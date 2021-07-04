"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamSpecificThemes = exports.saveTheme = exports.savePreferences = exports.setCustomStatusInitialisationState = exports.makeGroupMessageVisibleIfNecessary = exports.makeDirectChannelVisibleIfNecessary = exports.getMyPreferences = exports.deletePreferences = void 0;
var tslib_1 = require("tslib");
var action_types_1 = require("../action_types");
var client_1 = require("../client");
var constants_1 = require("../constants");
var preferences_1 = require("../selectors/entities/preferences");
var users_1 = require("../selectors/entities/users");
var preference_utils_1 = require("../utils/preference_utils");
var channels_1 = require("./channels");
var helpers_1 = require("./helpers");
var users_2 = require("./users");
function deletePreferences(userId, preferences) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, myPreferences, currentPreferences;
        return tslib_1.__generator(this, function (_a) {
            state = getState();
            myPreferences = preferences_1.getMyPreferences(state);
            currentPreferences = preferences.map(function (pref) { return myPreferences[preference_utils_1.getPreferenceKey(pref.category, pref.name)]; });
            (function deletePreferencesWrapper() {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                dispatch({
                                    type: action_types_1.PreferenceTypes.DELETED_PREFERENCES,
                                    data: preferences,
                                });
                                return [4 /*yield*/, client_1.Client4.deletePreferences(userId, preferences)];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                _a = _b.sent();
                                dispatch({
                                    type: action_types_1.PreferenceTypes.RECEIVED_PREFERENCES,
                                    data: currentPreferences,
                                });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }());
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.deletePreferences = deletePreferences;
function getMyPreferences() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getMyPreferences,
        onSuccess: action_types_1.PreferenceTypes.RECEIVED_ALL_PREFERENCES,
    });
}
exports.getMyPreferences = getMyPreferences;
function makeDirectChannelVisibleIfNecessary(otherUserId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, myPreferences, currentUserId, preference;
        return tslib_1.__generator(this, function (_a) {
            state = getState();
            myPreferences = preferences_1.getMyPreferences(state);
            currentUserId = users_1.getCurrentUserId(state);
            preference = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_DIRECT_CHANNEL_SHOW, otherUserId)];
            if (!preference || preference.value === 'false') {
                preference = {
                    user_id: currentUserId,
                    category: constants_1.Preferences.CATEGORY_DIRECT_CHANNEL_SHOW,
                    name: otherUserId,
                    value: 'true',
                };
                users_2.getProfilesByIds([otherUserId])(dispatch, getState);
                savePreferences(currentUserId, [preference])(dispatch);
            }
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.makeDirectChannelVisibleIfNecessary = makeDirectChannelVisibleIfNecessary;
function makeGroupMessageVisibleIfNecessary(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, myPreferences, currentUserId, channels, preference;
        return tslib_1.__generator(this, function (_a) {
            state = getState();
            myPreferences = preferences_1.getMyPreferences(state);
            currentUserId = users_1.getCurrentUserId(state);
            channels = state.entities.channels.channels;
            preference = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_GROUP_CHANNEL_SHOW, channelId)];
            if (!preference || preference.value === 'false') {
                preference = {
                    user_id: currentUserId,
                    category: constants_1.Preferences.CATEGORY_GROUP_CHANNEL_SHOW,
                    name: channelId,
                    value: 'true',
                };
                if (channels[channelId]) {
                    channels_1.getMyChannelMember(channelId)(dispatch, getState);
                }
                else {
                    channels_1.getChannelAndMyMember(channelId)(dispatch, getState);
                }
                users_2.getProfilesInChannel(channelId, 0)(dispatch, getState);
                savePreferences(currentUserId, [preference])(dispatch);
            }
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.makeGroupMessageVisibleIfNecessary = makeGroupMessageVisibleIfNecessary;
function setCustomStatusInitialisationState(initializationState) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, currentUserId, preference;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    currentUserId = users_1.getCurrentUserId(state);
                    preference = {
                        user_id: currentUserId,
                        category: constants_1.Preferences.CATEGORY_CUSTOM_STATUS,
                        name: constants_1.Preferences.NAME_CUSTOM_STATUS_TUTORIAL_STATE,
                        value: JSON.stringify(initializationState),
                    };
                    return [4 /*yield*/, dispatch(savePreferences(currentUserId, [preference]))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.setCustomStatusInitialisationState = setCustomStatusInitialisationState;
function savePreferences(userId, preferences) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            (function savePreferencesWrapper() {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                dispatch({
                                    type: action_types_1.PreferenceTypes.RECEIVED_PREFERENCES,
                                    data: preferences,
                                });
                                return [4 /*yield*/, client_1.Client4.savePreferences(userId, preferences)];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                _a = _b.sent();
                                dispatch({
                                    type: action_types_1.PreferenceTypes.DELETED_PREFERENCES,
                                    data: preferences,
                                });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }());
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.savePreferences = savePreferences;
function saveTheme(teamId, theme) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, currentUserId, preference;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    currentUserId = users_1.getCurrentUserId(state);
                    preference = {
                        user_id: currentUserId,
                        category: constants_1.Preferences.CATEGORY_THEME,
                        name: teamId || '',
                        value: JSON.stringify(theme),
                    };
                    return [4 /*yield*/, savePreferences(currentUserId, [preference])(dispatch)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.saveTheme = saveTheme;
function deleteTeamSpecificThemes() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, themePreferences, currentUserId, toDelete;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    themePreferences = preferences_1.makeGetCategory()(state, constants_1.Preferences.CATEGORY_THEME);
                    currentUserId = users_1.getCurrentUserId(state);
                    toDelete = themePreferences.filter(function (pref) { return pref.name !== ''; });
                    if (!(toDelete.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, deletePreferences(currentUserId, toDelete)(dispatch, getState)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.deleteTeamSpecificThemes = deleteTeamSpecificThemes;
//# sourceMappingURL=preferences.js.map