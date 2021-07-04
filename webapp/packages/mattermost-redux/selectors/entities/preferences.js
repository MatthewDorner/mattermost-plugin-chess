"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCollapsedThreadsEnabled = exports.isCollapsedThreadsAllowed = exports.getCollapsedThreadsPreference = exports.shouldAutocloseDMs = exports.shouldShowUnreadsCategory = exports.getSidebarPreferences = exports.makeGetStyleFromTheme = exports.getTheme = exports.getTeammateNameDisplaySetting = exports.getVisibleGroupIds = exports.getVisibleTeammate = exports.getFavoritesPreferences = exports.getGroupShowPreferences = exports.getDirectShowPreferences = exports.makeGetCategory = exports.getInt = exports.getBool = exports.get = exports.getMyPreferences = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var constants_1 = require("../../constants");
var general_1 = require("./general");
var teams_1 = require("./teams");
var helpers_1 = require("../../utils/helpers");
var preference_utils_1 = require("../../utils/preference_utils");
var theme_utils_1 = require("../../utils/theme_utils");
function getMyPreferences(state) {
    return state.entities.preferences.myPreferences;
}
exports.getMyPreferences = getMyPreferences;
function get(state, category, name, defaultValue) {
    if (defaultValue === void 0) { defaultValue = ''; }
    var key = preference_utils_1.getPreferenceKey(category, name);
    var prefs = getMyPreferences(state);
    if (!(key in prefs)) {
        return defaultValue;
    }
    return prefs[key].value;
}
exports.get = get;
function getBool(state, category, name, defaultValue) {
    if (defaultValue === void 0) { defaultValue = false; }
    var value = get(state, category, name, String(defaultValue));
    return value !== 'false';
}
exports.getBool = getBool;
function getInt(state, category, name, defaultValue) {
    if (defaultValue === void 0) { defaultValue = 0; }
    var value = get(state, category, name, defaultValue);
    return parseInt(value, 10);
}
exports.getInt = getInt;
function makeGetCategory() {
    return reselect_1.createSelector(getMyPreferences, function (state, category) { return category; }, function (preferences, category) {
        var prefix = category + '--';
        var prefsInCategory = [];
        for (var key in preferences) {
            if (key.startsWith(prefix)) {
                prefsInCategory.push(preferences[key]);
            }
        }
        return prefsInCategory;
    });
}
exports.makeGetCategory = makeGetCategory;
var getDirectShowCategory = makeGetCategory();
function getDirectShowPreferences(state) {
    return getDirectShowCategory(state, constants_1.Preferences.CATEGORY_DIRECT_CHANNEL_SHOW);
}
exports.getDirectShowPreferences = getDirectShowPreferences;
var getGroupShowCategory = makeGetCategory();
function getGroupShowPreferences(state) {
    return getGroupShowCategory(state, constants_1.Preferences.CATEGORY_GROUP_CHANNEL_SHOW);
}
exports.getGroupShowPreferences = getGroupShowPreferences;
var getFavoritesCategory = makeGetCategory();
function getFavoritesPreferences(state) {
    var favorites = getFavoritesCategory(state, constants_1.Preferences.CATEGORY_FAVORITE_CHANNEL);
    return favorites.filter(function (f) { return f.value === 'true'; }).map(function (f) { return f.name; });
}
exports.getFavoritesPreferences = getFavoritesPreferences;
exports.getVisibleTeammate = reselect_1.createSelector(getDirectShowPreferences, function (direct) {
    return direct.filter(function (dm) { return dm.value === 'true' && dm.name; }).map(function (dm) { return dm.name; });
});
exports.getVisibleGroupIds = reselect_1.createSelector(getGroupShowPreferences, function (groups) {
    return groups.filter(function (dm) { return dm.value === 'true' && dm.name; }).map(function (dm) { return dm.name; });
});
exports.getTeammateNameDisplaySetting = reselect_1.createSelector(general_1.getConfig, getMyPreferences, general_1.getLicense, function (config, preferences, license) {
    var useAdminTeammateNameDisplaySetting = (license && license.LockTeammateNameDisplay === 'true') && config.LockTeammateNameDisplay === 'true';
    var key = preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_DISPLAY_SETTINGS, constants_1.Preferences.NAME_NAME_FORMAT);
    if (preferences[key] && !useAdminTeammateNameDisplaySetting) {
        return preferences[key].value;
    }
    else if (config.TeammateNameDisplay) {
        return config.TeammateNameDisplay;
    }
    return constants_1.General.TEAMMATE_NAME_DISPLAY.SHOW_USERNAME;
});
var getThemePreference = reselect_1.createSelector(getMyPreferences, teams_1.getCurrentTeamId, function (myPreferences, currentTeamId) {
    // Prefer the user's current team-specific theme over the user's current global theme
    var themePreference;
    if (currentTeamId) {
        themePreference = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_THEME, currentTeamId)];
    }
    if (!themePreference) {
        themePreference = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_THEME, '')];
    }
    return themePreference;
});
var getDefaultTheme = reselect_1.createSelector(general_1.getConfig, function (config) {
    if (config.DefaultTheme && config.DefaultTheme in constants_1.Preferences.THEMES) {
        var theme = constants_1.Preferences.THEMES[config.DefaultTheme];
        if (theme) {
            return theme;
        }
    }
    // If no config.DefaultTheme or value doesn't refer to a valid theme name...
    return constants_1.Preferences.THEMES.default;
});
exports.getTheme = helpers_1.createShallowSelector(getThemePreference, getDefaultTheme, function (themePreference, defaultTheme) {
    var _a;
    var themeValue = (_a = themePreference === null || themePreference === void 0 ? void 0 : themePreference.value) !== null && _a !== void 0 ? _a : defaultTheme;
    // A custom theme will be a JSON-serialized object stored in a preference
    // At this point, the theme should be a plain object
    var theme = typeof themeValue === 'string' ? JSON.parse(themeValue) : themeValue;
    return theme_utils_1.setThemeDefaults(theme);
});
function makeGetStyleFromTheme() {
    return reselect_1.createSelector(exports.getTheme, function (state, getStyleFromTheme) { return getStyleFromTheme; }, function (theme, getStyleFromTheme) {
        return getStyleFromTheme(theme);
    });
}
exports.makeGetStyleFromTheme = makeGetStyleFromTheme;
var defaultSidebarPrefs = {
    grouping: 'by_type',
    unreads_at_top: 'true',
    favorite_at_top: 'true',
    sorting: 'alpha',
};
exports.getSidebarPreferences = reselect_1.createSelector(function (state) {
    var config = general_1.getConfig(state);
    return config.ExperimentalGroupUnreadChannels !== constants_1.General.DISABLED && getBool(state, constants_1.Preferences.CATEGORY_SIDEBAR_SETTINGS, 'show_unread_section', config.ExperimentalGroupUnreadChannels === constants_1.General.DEFAULT_ON);
}, function (state) {
    return get(state, constants_1.Preferences.CATEGORY_SIDEBAR_SETTINGS, '', null);
}, function (showUnreadSection, sidebarPreference) {
    var sidebarPrefs = JSON.parse(sidebarPreference);
    if (sidebarPrefs === null) {
        // Support unread settings for old implementation
        sidebarPrefs = tslib_1.__assign(tslib_1.__assign({}, defaultSidebarPrefs), { unreads_at_top: showUnreadSection ? 'true' : 'false' });
    }
    return sidebarPrefs;
});
// shouldShowUnreadsCategory returns true if the user has unereads grouped separately with the new sidebar enabled.
exports.shouldShowUnreadsCategory = reselect_1.createSelector(function (state) { return get(state, constants_1.Preferences.CATEGORY_SIDEBAR_SETTINGS, constants_1.Preferences.SHOW_UNREAD_SECTION); }, function (state) { return get(state, constants_1.Preferences.CATEGORY_SIDEBAR_SETTINGS, ''); }, function (state) { return general_1.getConfig(state).ExperimentalGroupUnreadChannels; }, function (userPreference, oldUserPreference, serverDefault) {
    // Prefer the show_unread_section user preference over the previous version
    if (userPreference) {
        return userPreference === 'true';
    }
    if (oldUserPreference) {
        return JSON.parse(oldUserPreference).unreads_at_top === 'true';
    }
    // The user setting is not set, so use the system default
    return serverDefault === constants_1.General.DEFAULT_ON;
});
function shouldAutocloseDMs(state) {
    var config = general_1.getConfig(state);
    if (!config.CloseUnusedDirectMessages || config.CloseUnusedDirectMessages === 'false') {
        return false;
    }
    var preference = get(state, constants_1.Preferences.CATEGORY_SIDEBAR_SETTINGS, constants_1.Preferences.CHANNEL_SIDEBAR_AUTOCLOSE_DMS, constants_1.Preferences.AUTOCLOSE_DMS_ENABLED);
    return preference === constants_1.Preferences.AUTOCLOSE_DMS_ENABLED;
}
exports.shouldAutocloseDMs = shouldAutocloseDMs;
function getCollapsedThreadsPreference(state) {
    var configValue = general_1.getConfig(state).CollapsedThreads;
    var preferenceDefault;
    switch (configValue) {
        case 'default_off':
            preferenceDefault = constants_1.Preferences.COLLAPSED_REPLY_THREADS_OFF;
            break;
        case 'default_on':
            preferenceDefault = constants_1.Preferences.COLLAPSED_REPLY_THREADS_ON;
            break;
    }
    return get(state, constants_1.Preferences.CATEGORY_DISPLAY_SETTINGS, constants_1.Preferences.COLLAPSED_REPLY_THREADS, preferenceDefault !== null && preferenceDefault !== void 0 ? preferenceDefault : constants_1.Preferences.COLLAPSED_REPLY_THREADS_FALLBACK_DEFAULT);
}
exports.getCollapsedThreadsPreference = getCollapsedThreadsPreference;
function isCollapsedThreadsAllowed(state) {
    return (general_1.getFeatureFlagValue(state, 'CollapsedThreads') === 'true' &&
        general_1.getConfig(state).CollapsedThreads !== 'disabled');
}
exports.isCollapsedThreadsAllowed = isCollapsedThreadsAllowed;
function isCollapsedThreadsEnabled(state) {
    var isAllowed = isCollapsedThreadsAllowed(state);
    var userPreference = getCollapsedThreadsPreference(state);
    return isAllowed && (userPreference === constants_1.Preferences.COLLAPSED_REPLY_THREADS_ON || general_1.getConfig(state).CollapsedThreads === 'always_on');
}
exports.isCollapsedThreadsEnabled = isCollapsedThreadsEnabled;
//# sourceMappingURL=preferences.js.map