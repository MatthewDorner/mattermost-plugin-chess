"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetChannelsByCategory = exports.makeFilterAndSortChannelsForCategory = exports.makeGetChannelsForCategory = exports.makeSortChannels = exports.makeSortChannelsByRecency = exports.makeSortChannelsByNameWithDMs = exports.makeSortChannelsByName = exports.makeCompareChannels = exports.makeFilterManuallyClosedDMs = exports.makeFilterAutoclosedDMs = exports.legacyMakeFilterAutoclosedDMs = exports.makeFilterArchivedChannels = exports.makeGetCategoriesForTeam = exports.getCategoryIdsForTeam = exports.getCategoryWhere = exports.getCategoryInTeamWithChannel = exports.getCategoryInTeamByType = exports.getCategory = exports.getAllCategoriesByIds = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var shallow_equals_1 = tslib_1.__importDefault(require("shallow-equals"));
var constants_1 = require("../../constants");
var channel_categories_1 = require("../../constants/channel_categories");
var channels_1 = require("./channels");
var i18n_1 = require("./i18n");
var posts_1 = require("./posts");
var preferences_1 = require("./preferences");
var users_1 = require("./users");
var channel_categories_2 = require("../../types/channel_categories");
var channel_utils_1 = require("../../utils/channel_utils");
var preference_utils_1 = require("../../utils/preference_utils");
var user_utils_1 = require("../../utils/user_utils");
function getAllCategoriesByIds(state) {
    return state.entities.channelCategories.byId;
}
exports.getAllCategoriesByIds = getAllCategoriesByIds;
function getCategory(state, categoryId) {
    return getAllCategoriesByIds(state)[categoryId];
}
exports.getCategory = getCategory;
// getCategoryInTeamByType returns the first category found of the given type on the given team. This is intended for use
// with only non-custom types of categories.
function getCategoryInTeamByType(state, teamId, categoryType) {
    return getCategoryWhere(state, function (category) { return category.type === categoryType && category.team_id === teamId; });
}
exports.getCategoryInTeamByType = getCategoryInTeamByType;
// getCategoryInTeamWithChannel returns the category on a given team containing the given channel ID.
function getCategoryInTeamWithChannel(state, teamId, channelId) {
    return getCategoryWhere(state, function (category) { return category.team_id === teamId && category.channel_ids.includes(channelId); });
}
exports.getCategoryInTeamWithChannel = getCategoryInTeamWithChannel;
// getCategoryWhere returns the first category meeting the given condition. This should not be used with a condition
// that matches multiple categories.
function getCategoryWhere(state, condition) {
    var categoriesByIds = getAllCategoriesByIds(state);
    return Object.values(categoriesByIds).find(condition);
}
exports.getCategoryWhere = getCategoryWhere;
function getCategoryIdsForTeam(state, teamId) {
    return state.entities.channelCategories.orderByTeam[teamId];
}
exports.getCategoryIdsForTeam = getCategoryIdsForTeam;
function makeGetCategoriesForTeam() {
    return reselect_1.createSelector(getCategoryIdsForTeam, function (state) { return state.entities.channelCategories.byId; }, function (categoryIds, categoriesById) {
        if (!categoryIds) {
            return [];
        }
        return categoryIds.map(function (id) { return categoriesById[id]; });
    });
}
exports.makeGetCategoriesForTeam = makeGetCategoriesForTeam;
// makeFilterArchivedChannels returns a selector that filters a given list of channels based on whether or not the channel
// is archived or is currently being viewed. The selector returns the original array if no channels are filtered out.
function makeFilterArchivedChannels() {
    return reselect_1.createSelector(function (state, channels) { return channels; }, channels_1.getCurrentChannelId, function (channels, currentChannelId) {
        var filtered = channels.filter(function (channel) { return channel && (channel.id === currentChannelId || channel.delete_at === 0); });
        return filtered.length === channels.length ? channels : filtered;
    });
}
exports.makeFilterArchivedChannels = makeFilterArchivedChannels;
function getDefaultAutocloseCutoff() {
    return Date.now() - (7 * 24 * 60 * 60 * 1000);
}
// legacyMakeFilterAutoclosedDMs returns a selector that filters a given list of channels based on whether or not the channel has
// been autoclosed by either being an inactive DM/GM or a DM with a deactivated user. The exact requirements for being
// inactive are complicated, but they are intended to include the channel not having been opened, posted in, or viewed
// recently. The selector returns the original array if no channels are filtered out.
function legacyMakeFilterAutoclosedDMs(getAutocloseCutoff) {
    if (getAutocloseCutoff === void 0) { getAutocloseCutoff = getDefaultAutocloseCutoff; }
    return reselect_1.createSelector(function (state, channels) { return channels; }, function (state, channels, categoryType) { return categoryType; }, preferences_1.getMyPreferences, preferences_1.shouldAutocloseDMs, channels_1.getCurrentChannelId, function (state) { return state.entities.users.profiles; }, users_1.getCurrentUserId, channels_1.getMyChannelMemberships, posts_1.getLastPostPerChannel, function (channels, categoryType, myPreferences, autocloseDMs, currentChannelId, profiles, currentUserId, myMembers, lastPosts) {
        if (categoryType !== channel_categories_1.CategoryTypes.DIRECT_MESSAGES) {
            // Only autoclose DMs that haven't been assigned to a category
            return channels;
        }
        // Ideally, this would come from a selector, but that would cause the filter to recompute too often
        var cutoff = getAutocloseCutoff();
        var filtered = channels.filter(function (channel) {
            if (channel.type !== constants_1.General.DM_CHANNEL && channel.type !== constants_1.General.GM_CHANNEL) {
                return true;
            }
            if (channel_utils_1.isUnreadChannel(myMembers, channel)) {
                // Unread DMs/GMs are always visible
                return true;
            }
            if (currentChannelId === channel.id) {
                // The current channel is always visible
                return true;
            }
            // viewTime is the time the channel was last viewed by the user
            var viewTimePref = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_CHANNEL_APPROXIMATE_VIEW_TIME, channel.id)];
            var viewTime = parseInt(viewTimePref ? viewTimePref.value : '0', 10);
            // Recently viewed channels will never be hidden. Note that viewTime is not set correctly at the time of writing.
            if (viewTime > cutoff) {
                return true;
            }
            // openTime is the time the channel was last opened (like from the More DMs list) after having been closed
            var openTimePref = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_CHANNEL_OPEN_TIME, channel.id)];
            var openTime = parseInt(openTimePref ? openTimePref.value : '0', 10);
            // DMs with deactivated users will be visible if you're currently viewing them and they were opened
            // since the user was deactivated
            if (channel.type === constants_1.General.DM_CHANNEL) {
                var teammateId = channel_utils_1.getUserIdFromChannelName(currentUserId, channel.name);
                var teammate = profiles[teammateId];
                if (!teammate || teammate.delete_at > openTime) {
                    return false;
                }
            }
            // Skip the rest of the checks if autoclosing inactive DMs is disabled
            if (!autocloseDMs) {
                return true;
            }
            // Keep the channel open if it had a recent post. If we have posts loaded for the channel, use the create_at
            // of the last post in the channel since channel.last_post_at isn't kept up to date on the client. If we don't
            // have posts loaded, then fall back to the last_post_at.
            var lastPost = lastPosts[channel.id];
            if (lastPost && lastPost.create_at > cutoff) {
                return true;
            }
            if (openTime > cutoff) {
                return true;
            }
            if (channel.last_post_at && channel.last_post_at > cutoff) {
                return true;
            }
            return false;
        });
        return filtered.length === channels.length ? channels : filtered;
    });
}
exports.legacyMakeFilterAutoclosedDMs = legacyMakeFilterAutoclosedDMs;
function makeFilterAutoclosedDMs() {
    return reselect_1.createSelector(function (state, channels) { return channels; }, function (state, channels, categoryType) { return categoryType; }, channels_1.getCurrentChannelId, function (state) { return state.entities.users.profiles; }, users_1.getCurrentUserId, channels_1.getMyChannelMemberships, function (state) { return preferences_1.getInt(state, constants_1.Preferences.CATEGORY_SIDEBAR_SETTINGS, constants_1.Preferences.LIMIT_VISIBLE_DMS_GMS, 20); }, preferences_1.getMyPreferences, function (channels, categoryType, currentChannelId, profiles, currentUserId, myMembers, limitPref, myPreferences) {
        if (categoryType !== channel_categories_1.CategoryTypes.DIRECT_MESSAGES) {
            // Only autoclose DMs that haven't been assigned to a category
            return channels;
        }
        var getTimestampFromPrefs = function (category, name) {
            var pref = myPreferences[preference_utils_1.getPreferenceKey(category, name)];
            return parseInt(pref ? pref.value : '0', 10);
        };
        var getLastViewedAt = function (channel) {
            var _a;
            // The server only ever sets the last_viewed_at to the time of the last post in channel, so we may need
            // to use the preferences added for the previous version of autoclosing DMs.
            return Math.max((_a = myMembers[channel.id]) === null || _a === void 0 ? void 0 : _a.last_viewed_at, getTimestampFromPrefs(constants_1.Preferences.CATEGORY_CHANNEL_APPROXIMATE_VIEW_TIME, channel.id), getTimestampFromPrefs(constants_1.Preferences.CATEGORY_CHANNEL_OPEN_TIME, channel.id));
        };
        var unreadCount = 0;
        var visibleChannels = channels.filter(function (channel) {
            if (channel_utils_1.isUnreadChannel(myMembers, channel)) {
                unreadCount++;
                // Unread DMs/GMs are always visible
                return true;
            }
            if (channel.id === currentChannelId) {
                return true;
            }
            // DMs with deactivated users will be visible if you're currently viewing them and they were opened
            // since the user was deactivated
            if (channel.type === constants_1.General.DM_CHANNEL) {
                var teammateId = channel_utils_1.getUserIdFromChannelName(currentUserId, channel.name);
                var teammate = profiles[teammateId];
                var lastViewedAt = getLastViewedAt(channel);
                if (!teammate || teammate.delete_at > lastViewedAt) {
                    return false;
                }
            }
            return true;
        });
        visibleChannels.sort(function (channelA, channelB) {
            // Should always prioritise the current channel
            if (channelA.id === currentChannelId) {
                return -1;
            }
            else if (channelB.id === currentChannelId) {
                return 1;
            }
            // Second priority is for unread channels
            if (channel_utils_1.isUnreadChannel(myMembers, channelA) && !channel_utils_1.isUnreadChannel(myMembers, channelB)) {
                return -1;
            }
            else if (!channel_utils_1.isUnreadChannel(myMembers, channelA) && channel_utils_1.isUnreadChannel(myMembers, channelB)) {
                return 1;
            }
            // Third priority is last_viewed_at
            var channelAlastViewed = getLastViewedAt(channelA) || 0;
            var channelBlastViewed = getLastViewedAt(channelB) || 0;
            if (channelAlastViewed > channelBlastViewed) {
                return -1;
            }
            else if (channelBlastViewed > channelAlastViewed) {
                return 1;
            }
            return 0;
        });
        // The limit of DMs user specifies to be rendered in the sidebar
        var remaining = Math.max(limitPref, unreadCount);
        visibleChannels = visibleChannels.slice(0, remaining);
        var visibleChannelsSet = new Set(visibleChannels);
        var filteredChannels = channels.filter(function (channel) { return visibleChannelsSet.has(channel); });
        return filteredChannels.length === channels.length ? channels : filteredChannels;
    });
}
exports.makeFilterAutoclosedDMs = makeFilterAutoclosedDMs;
function makeFilterManuallyClosedDMs() {
    return reselect_1.createSelector(function (state, channels) { return channels; }, preferences_1.getMyPreferences, channels_1.getCurrentChannelId, users_1.getCurrentUserId, channels_1.getMyChannelMemberships, function (channels, myPreferences, currentChannelId, currentUserId, myMembers) {
        var filtered = channels.filter(function (channel) {
            var preference;
            if (channel.type !== constants_1.General.DM_CHANNEL && channel.type !== constants_1.General.GM_CHANNEL) {
                return true;
            }
            if (channel_utils_1.isUnreadChannel(myMembers, channel)) {
                // Unread DMs/GMs are always visible
                return true;
            }
            if (currentChannelId === channel.id) {
                // The current channel is always visible
                return true;
            }
            if (channel.type === constants_1.General.DM_CHANNEL) {
                var teammateId = channel_utils_1.getUserIdFromChannelName(currentUserId, channel.name);
                preference = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_DIRECT_CHANNEL_SHOW, teammateId)];
            }
            else {
                preference = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_GROUP_CHANNEL_SHOW, channel.id)];
            }
            return preference && preference.value !== 'false';
        });
        // Only return a new array if anything was removed
        return filtered.length === channels.length ? channels : filtered;
    });
}
exports.makeFilterManuallyClosedDMs = makeFilterManuallyClosedDMs;
function makeCompareChannels(getDisplayName, locale, myMembers) {
    return function (a, b) {
        // Sort muted channels last
        var aMuted = channel_utils_1.isChannelMuted(myMembers[a.id]);
        var bMuted = channel_utils_1.isChannelMuted(myMembers[b.id]);
        if (aMuted && !bMuted) {
            return 1;
        }
        else if (!aMuted && bMuted) {
            return -1;
        }
        // And then sort alphabetically
        return getDisplayName(a).localeCompare(getDisplayName(b), locale, { numeric: true });
    };
}
exports.makeCompareChannels = makeCompareChannels;
function makeSortChannelsByName() {
    return reselect_1.createSelector(function (state, channels) { return channels; }, i18n_1.getCurrentUserLocale, channels_1.getMyChannelMemberships, function (channels, locale, myMembers) {
        var getDisplayName = function (channel) { return channel.display_name; };
        return tslib_1.__spread(channels).sort(makeCompareChannels(getDisplayName, locale, myMembers));
    });
}
exports.makeSortChannelsByName = makeSortChannelsByName;
function makeSortChannelsByNameWithDMs() {
    return reselect_1.createSelector(function (state, channels) { return channels; }, users_1.getCurrentUserId, function (state) { return state.entities.users.profiles; }, preferences_1.getTeammateNameDisplaySetting, i18n_1.getCurrentUserLocale, channels_1.getMyChannelMemberships, function (channels, currentUserId, profiles, teammateNameDisplay, locale, myMembers) {
        var cachedNames = {};
        var getDisplayName = function (channel) {
            var e_1, _a;
            if (cachedNames[channel.id]) {
                return cachedNames[channel.id];
            }
            var displayName;
            // TODO it might be easier to do this by using channel members to find the users
            if (channel.type === constants_1.General.DM_CHANNEL) {
                var teammateId = channel_utils_1.getUserIdFromChannelName(currentUserId, channel.name);
                var teammate = profiles[teammateId];
                displayName = user_utils_1.displayUsername(teammate, teammateNameDisplay, false);
            }
            else if (channel.type === constants_1.General.GM_CHANNEL) {
                var usernames = channel.display_name.split(', ');
                var userDisplayNames = [];
                var _loop_1 = function (username) {
                    var user = Object.values(profiles).find(function (profile) { return profile.username === username; });
                    if (!user) {
                        return "continue";
                    }
                    if (user.id === currentUserId) {
                        return "continue";
                    }
                    userDisplayNames.push(user_utils_1.displayUsername(user, teammateNameDisplay, false));
                };
                try {
                    for (var usernames_1 = tslib_1.__values(usernames), usernames_1_1 = usernames_1.next(); !usernames_1_1.done; usernames_1_1 = usernames_1.next()) {
                        var username = usernames_1_1.value;
                        _loop_1(username);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (usernames_1_1 && !usernames_1_1.done && (_a = usernames_1.return)) _a.call(usernames_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                displayName = userDisplayNames.sort(function (a, b) { return a.localeCompare(b, locale, { numeric: true }); }).join(', ');
            }
            else {
                displayName = channel.display_name;
            }
            cachedNames[channel.id] = displayName;
            return displayName;
        };
        return tslib_1.__spread(channels).sort(makeCompareChannels(getDisplayName, locale, myMembers));
    });
}
exports.makeSortChannelsByNameWithDMs = makeSortChannelsByNameWithDMs;
function makeSortChannelsByRecency() {
    return reselect_1.createSelector(function (state, channels) { return channels; }, posts_1.getLastPostPerChannel, function (channels, lastPosts) {
        return tslib_1.__spread(channels).sort(function (a, b) {
            // If available, get the last post time from the loaded posts for the channel, but fall back to the
            // channel's last_post_at if that's not available. The last post time from the loaded posts is more
            // accurate because channel.last_post_at is not updated on the client as new messages come in.
            var aLastPostAt = a.last_post_at;
            if (lastPosts[a.id] && lastPosts[a.id].create_at > a.last_post_at) {
                aLastPostAt = lastPosts[a.id].create_at;
            }
            var bLastPostAt = b.last_post_at;
            if (lastPosts[b.id] && lastPosts[b.id].create_at > b.last_post_at) {
                bLastPostAt = lastPosts[b.id].create_at;
            }
            return bLastPostAt - aLastPostAt;
        });
    });
}
exports.makeSortChannelsByRecency = makeSortChannelsByRecency;
function makeSortChannels() {
    var sortChannelsByName = makeSortChannelsByName();
    var sortChannelsByNameWithDMs = makeSortChannelsByNameWithDMs();
    var sortChannelsByRecency = makeSortChannelsByRecency();
    return function (state, originalChannels, category) {
        var channels = originalChannels;
        // While this function isn't memoized, sortChannelsByX should be since they know what parts of state
        // will affect sort order.
        if (category.sorting === channel_categories_2.CategorySorting.Recency) {
            channels = sortChannelsByRecency(state, channels);
        }
        else if (category.sorting === channel_categories_2.CategorySorting.Alphabetical || category.sorting === channel_categories_2.CategorySorting.Default) {
            if (channels.some(function (channel) { return channel.type === constants_1.General.DM_CHANNEL || channel.type === constants_1.General.GM_CHANNEL; })) {
                channels = sortChannelsByNameWithDMs(state, channels);
            }
            else {
                channels = sortChannelsByName(state, channels);
            }
        }
        return channels;
    };
}
exports.makeSortChannels = makeSortChannels;
function makeGetChannelsForCategory() {
    var getChannels = channels_1.makeGetChannelsForIds();
    var filterAndSortChannelsForCategory = makeFilterAndSortChannelsForCategory();
    return function (state, category) {
        var channels = getChannels(state, category.channel_ids);
        return filterAndSortChannelsForCategory(state, channels, category);
    };
}
exports.makeGetChannelsForCategory = makeGetChannelsForCategory;
// Returns a selector that takes an array of channels and the category they belong to and returns the array sorted and
// with inactive DMs/GMs and archived channels filtered out.
function makeFilterAndSortChannelsForCategory() {
    var filterArchivedChannels = makeFilterArchivedChannels();
    var filterAutoclosedDMs = makeFilterAutoclosedDMs();
    var filterManuallyClosedDMs = makeFilterManuallyClosedDMs();
    var sortChannels = makeSortChannels();
    return function (state, originalChannels, category) {
        var channels = originalChannels;
        channels = filterArchivedChannels(state, channels);
        channels = filterManuallyClosedDMs(state, channels);
        channels = filterAutoclosedDMs(state, channels, category.type);
        channels = sortChannels(state, channels, category);
        return channels;
    };
}
exports.makeFilterAndSortChannelsForCategory = makeFilterAndSortChannelsForCategory;
function makeGetChannelsByCategory() {
    var getCategoriesForTeam = makeGetCategoriesForTeam();
    // Memoize by category. As long as the categories don't change, we can keep using the same selectors for each category.
    var getChannels;
    var filterAndSortChannels;
    var lastCategoryIds = [];
    var lastChannelsByCategory = {};
    return function (state, teamId) {
        var e_2, _a, e_3, _b;
        var categoryIds = getCategoryIdsForTeam(state, teamId);
        // Create an instance of filterAndSortChannels for each category. As long as we don't add or remove new categories,
        // we can reuse these selectors to memoize the results of each category. This will also create new selectors when
        // categories are reordered, but that should be rare enough that it won't meaningfully affect performance.
        if (categoryIds !== lastCategoryIds) {
            lastCategoryIds = categoryIds;
            lastChannelsByCategory = {};
            getChannels = {};
            filterAndSortChannels = {};
            if (categoryIds) {
                try {
                    for (var categoryIds_1 = tslib_1.__values(categoryIds), categoryIds_1_1 = categoryIds_1.next(); !categoryIds_1_1.done; categoryIds_1_1 = categoryIds_1.next()) {
                        var categoryId = categoryIds_1_1.value;
                        getChannels[categoryId] = channels_1.makeGetChannelsForIds();
                        filterAndSortChannels[categoryId] = makeFilterAndSortChannelsForCategory();
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (categoryIds_1_1 && !categoryIds_1_1.done && (_a = categoryIds_1.return)) _a.call(categoryIds_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        var categories = getCategoriesForTeam(state, teamId);
        var channelsByCategory = {};
        try {
            for (var categories_1 = tslib_1.__values(categories), categories_1_1 = categories_1.next(); !categories_1_1.done; categories_1_1 = categories_1.next()) {
                var category = categories_1_1.value;
                var channels = getChannels[category.id](state, category.channel_ids);
                channelsByCategory[category.id] = filterAndSortChannels[category.id](state, channels, category);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (categories_1_1 && !categories_1_1.done && (_b = categories_1.return)) _b.call(categories_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // Do a shallow equality check of channelsByCategory to avoid returning a new object containing the same data
        if (shallow_equals_1.default(channelsByCategory, lastChannelsByCategory)) {
            return lastChannelsByCategory;
        }
        lastChannelsByCategory = channelsByCategory;
        return channelsByCategory;
    };
}
exports.makeGetChannelsByCategory = makeGetChannelsByCategory;
//# sourceMappingURL=channel_categories.js.map