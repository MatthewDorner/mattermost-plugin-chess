"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchChannelModerations = exports.getChannelModerations = exports.membersMinusGroupMembers = exports.updateChannelMemberSchemeRoles = exports.updateChannelScheme = exports.unfavoriteChannel = exports.favoriteChannel = exports.getMyChannelMember = exports.getChannelMember = exports.getChannelMembersByIds = exports.markChannelAsUnread = exports.markChannelAsRead = exports.updateChannelPurpose = exports.updateChannelHeader = exports.updateChannelMemberRoles = exports.removeChannelMember = exports.addChannelMember = exports.getChannelStats = exports.searchGroupChannels = exports.searchAllChannels = exports.searchChannels = exports.autocompleteChannelsForSearch = exports.autocompleteChannels = exports.getAllChannels = exports.getAllChannelsWithCount = exports.getArchivedChannels = exports.getChannels = exports.markChannelAsViewed = exports.viewChannel = exports.unarchiveChannel = exports.deleteChannel = exports.joinChannel = exports.leaveChannel = exports.getChannelMembers = exports.getMyChannelMembers = exports.fetchMyChannelsAndMembers = exports.getChannelTimezones = exports.getChannelAndMyMember = exports.getChannel = exports.getChannelByNameAndTeamName = exports.updateChannelNotifyProps = exports.convertChannelToPrivate = exports.updateChannelPrivacy = exports.updateChannel = exports.patchChannel = exports.createGroupChannel = exports.markGroupChannelOpen = exports.createDirectChannel = exports.createChannel = exports.selectChannel = void 0;
exports.getChannelMemberCountsByGroup = void 0;
var tslib_1 = require("tslib");
var action_types_1 = require("../action_types");
var client_1 = require("../client");
var constants_1 = require("../constants");
var channel_categories_1 = require("../constants/channel_categories");
var channels_1 = require("../constants/channels");
var channel_categories_2 = require("../selectors/entities/channel_categories");
var channels_2 = require("../selectors/entities/channels");
var general_1 = require("../selectors/entities/general");
var teams_1 = require("../selectors/entities/teams");
var users_1 = require("../selectors/entities/users");
var actions_1 = require("../types/actions");
var channel_utils_1 = require("../utils/channel_utils");
var helpers_1 = require("../utils/helpers");
var channel_categories_3 = require("./channel_categories");
var errors_1 = require("./errors");
var helpers_2 = require("./helpers");
var preferences_1 = require("./preferences");
var roles_1 = require("./roles");
var users_2 = require("./users");
function selectChannel(channelId) {
    return {
        type: action_types_1.ChannelTypes.SELECT_CHANNEL,
        data: channelId,
    };
}
exports.selectChannel = selectChannel;
function createChannel(channel, userId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var created, error_1, member, actions, _a, channels, myMembers;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.createChannel(channel)];
                case 1:
                    created = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    helpers_2.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.CREATE_CHANNEL_FAILURE,
                            error: error_1,
                        },
                        errors_1.logError(error_1),
                    ]));
                    return [2 /*return*/, { error: error_1 }];
                case 3:
                    member = {
                        channel_id: created.id,
                        user_id: userId,
                        roles: constants_1.General.CHANNEL_USER_ROLE + " " + constants_1.General.CHANNEL_ADMIN_ROLE,
                        last_viewed_at: 0,
                        msg_count: 0,
                        mention_count: 0,
                        notify_props: { desktop: 'default', mark_unread: 'all' },
                        last_update_at: created.create_at,
                    };
                    actions = [];
                    _a = getState().entities.channels, channels = _a.channels, myMembers = _a.myMembers;
                    if (!channels[created.id]) {
                        actions.push({ type: action_types_1.ChannelTypes.RECEIVED_CHANNEL, data: created });
                    }
                    if (!myMembers[created.id]) {
                        actions.push({ type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER, data: member });
                        dispatch(roles_1.loadRolesIfNeeded(member.roles.split(' ')));
                    }
                    dispatch(actions_1.batchActions(tslib_1.__spread(actions, [
                        {
                            type: action_types_1.ChannelTypes.CREATE_CHANNEL_SUCCESS,
                        },
                    ])));
                    dispatch(channel_categories_3.addChannelToInitialCategory(created, true));
                    return [2 /*return*/, { data: created }];
            }
        });
    }); };
}
exports.createChannel = createChannel;
function createDirectChannel(userId, otherUserId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var created, error_2, member, preferences;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.CREATE_CHANNEL_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.createDirectChannel([userId, otherUserId])];
                case 2:
                    created = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.CREATE_CHANNEL_FAILURE, error: error_2 },
                        errors_1.logError(error_2),
                    ]));
                    return [2 /*return*/, { error: error_2 }];
                case 4:
                    member = {
                        channel_id: created.id,
                        user_id: userId,
                        roles: "" + constants_1.General.CHANNEL_USER_ROLE,
                        last_viewed_at: 0,
                        msg_count: 0,
                        mention_count: 0,
                        notify_props: { desktop: 'default', mark_unread: 'all' },
                        last_update_at: created.create_at,
                    };
                    preferences = [
                        { user_id: userId, category: constants_1.Preferences.CATEGORY_DIRECT_CHANNEL_SHOW, name: otherUserId, value: 'true' },
                        { user_id: userId, category: constants_1.Preferences.CATEGORY_CHANNEL_OPEN_TIME, name: created.id, value: new Date().getTime().toString() },
                    ];
                    preferences_1.savePreferences(userId, preferences)(dispatch);
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                            data: created,
                        },
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                            data: member,
                        },
                        {
                            type: action_types_1.PreferenceTypes.RECEIVED_PREFERENCES,
                            data: preferences,
                        },
                        {
                            type: action_types_1.ChannelTypes.CREATE_CHANNEL_SUCCESS,
                        },
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_CHANNEL,
                            id: created.id,
                            data: [{ id: userId }, { id: otherUserId }],
                        },
                    ]));
                    dispatch(channel_categories_3.addChannelToInitialCategory(created));
                    dispatch(roles_1.loadRolesIfNeeded(member.roles.split(' ')));
                    return [2 /*return*/, { data: created }];
            }
        });
    }); };
}
exports.createDirectChannel = createDirectChannel;
function markGroupChannelOpen(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, preferences;
        return tslib_1.__generator(this, function (_a) {
            currentUserId = getState().entities.users.currentUserId;
            preferences = [
                { user_id: currentUserId, category: constants_1.Preferences.CATEGORY_GROUP_CHANNEL_SHOW, name: channelId, value: 'true' },
                { user_id: currentUserId, category: constants_1.Preferences.CATEGORY_CHANNEL_OPEN_TIME, name: channelId, value: new Date().getTime().toString() },
            ];
            return [2 /*return*/, dispatch(preferences_1.savePreferences(currentUserId, preferences))];
        });
    }); };
}
exports.markGroupChannelOpen = markGroupChannelOpen;
function createGroupChannel(userIds) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, created, error_3, member, storeMember, error_4, profilesInChannel;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.CREATE_CHANNEL_REQUEST, data: null });
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.createGroupChannel(userIds)];
                case 2:
                    created = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.CREATE_CHANNEL_FAILURE, error: error_3 },
                        errors_1.logError(error_3),
                    ]));
                    return [2 /*return*/, { error: error_3 }];
                case 4:
                    member = {
                        channel_id: created.id,
                        user_id: currentUserId,
                        roles: "" + constants_1.General.CHANNEL_USER_ROLE,
                        last_viewed_at: 0,
                        msg_count: 0,
                        mention_count: 0,
                        notify_props: { desktop: 'default', mark_unread: 'all' },
                        last_update_at: created.create_at,
                    };
                    if (!(created.total_msg_count > 0)) return [3 /*break*/, 10];
                    storeMember = channels_2.getMyChannelMember(getState(), created.id);
                    if (!(storeMember === null)) return [3 /*break*/, 9];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, client_1.Client4.getMyChannelMember(created.id)];
                case 6:
                    member = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    // Log the error and keep going with the generated membership.
                    dispatch(errors_1.logError(error_4));
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    member = storeMember;
                    _a.label = 10;
                case 10:
                    dispatch(markGroupChannelOpen(created.id));
                    profilesInChannel = userIds.map(function (id) { return ({ id: id }); });
                    profilesInChannel.push({ id: currentUserId }); // currentUserId is optionally in userIds, but the reducer will get rid of a duplicate
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                            data: created,
                        },
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                            data: member,
                        },
                        {
                            type: action_types_1.ChannelTypes.CREATE_CHANNEL_SUCCESS,
                        },
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_CHANNEL,
                            id: created.id,
                            data: profilesInChannel,
                        },
                    ]));
                    dispatch(channel_categories_3.addChannelToInitialCategory(created));
                    dispatch(roles_1.loadRolesIfNeeded((member && member.roles && member.roles.split(' ')) || []));
                    return [2 /*return*/, { data: created }];
            }
        });
    }); };
}
exports.createGroupChannel = createGroupChannel;
function patchChannel(channelId, patch) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var updated, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.UPDATE_CHANNEL_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.patchChannel(channelId, patch)];
                case 2:
                    updated = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.UPDATE_CHANNEL_FAILURE, error: error_5 },
                        errors_1.logError(error_5),
                    ]));
                    return [2 /*return*/, { error: error_5 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                            data: updated,
                        },
                        {
                            type: action_types_1.ChannelTypes.UPDATE_CHANNEL_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: updated }];
            }
        });
    }); };
}
exports.patchChannel = patchChannel;
function updateChannel(channel) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var updated, error_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.UPDATE_CHANNEL_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.updateChannel(channel)];
                case 2:
                    updated = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_6, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.UPDATE_CHANNEL_FAILURE, error: error_6 },
                        errors_1.logError(error_6),
                    ]));
                    return [2 /*return*/, { error: error_6 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                            data: updated,
                        },
                        {
                            type: action_types_1.ChannelTypes.UPDATE_CHANNEL_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: updated }];
            }
        });
    }); };
}
exports.updateChannel = updateChannel;
function updateChannelPrivacy(channelId, privacy) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var updatedChannel, error_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.UPDATE_CHANNEL_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.updateChannelPrivacy(channelId, privacy)];
                case 2:
                    updatedChannel = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_7, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.UPDATE_CHANNEL_FAILURE, error: error_7 },
                        errors_1.logError(error_7),
                    ]));
                    return [2 /*return*/, { error: error_7 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                            data: updatedChannel,
                        },
                        {
                            type: action_types_1.ChannelTypes.UPDATE_CHANNEL_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: updatedChannel }];
            }
        });
    }); };
}
exports.updateChannelPrivacy = updateChannelPrivacy;
function convertChannelToPrivate(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var convertedChannel, error_8;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.UPDATE_CHANNEL_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.convertChannelToPrivate(channelId)];
                case 2:
                    convertedChannel = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_8, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.UPDATE_CHANNEL_FAILURE, error: error_8 },
                        errors_1.logError(error_8),
                    ]));
                    return [2 /*return*/, { error: error_8 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                            data: convertedChannel,
                        },
                        {
                            type: action_types_1.ChannelTypes.UPDATE_CHANNEL_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: convertedChannel }];
            }
        });
    }); };
}
exports.convertChannelToPrivate = convertChannelToPrivate;
function updateChannelNotifyProps(userId, channelId, props) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var notifyProps, error_9, member, currentNotifyProps;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notifyProps = tslib_1.__assign({ user_id: userId, channel_id: channelId }, props);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.updateChannelNotifyProps(notifyProps)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_9, dispatch, getState);
                    dispatch(errors_1.logError(error_9));
                    return [2 /*return*/, { error: error_9 }];
                case 4:
                    member = getState().entities.channels.myMembers[channelId] || {};
                    currentNotifyProps = member.notify_props || {};
                    dispatch({
                        type: action_types_1.ChannelTypes.RECEIVED_CHANNEL_PROPS,
                        data: {
                            channel_id: channelId,
                            notifyProps: tslib_1.__assign(tslib_1.__assign({}, currentNotifyProps), notifyProps),
                        },
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.updateChannelNotifyProps = updateChannelNotifyProps;
function getChannelByNameAndTeamName(teamName, channelName, includeDeleted) {
    var _this = this;
    if (includeDeleted === void 0) { includeDeleted = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_10;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getChannelByNameAndTeamName(teamName, channelName, includeDeleted)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_10, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.CHANNELS_FAILURE, error: error_10 },
                        errors_1.logError(error_10),
                    ]));
                    return [2 /*return*/, { error: error_10 }];
                case 3:
                    dispatch({
                        type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                        data: data,
                    });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getChannelByNameAndTeamName = getChannelByNameAndTeamName;
function getChannel(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_11;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getChannel(channelId)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_11, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.CHANNELS_FAILURE, error: error_11 },
                        errors_1.logError(error_11),
                    ]));
                    return [2 /*return*/, { error: error_11 }];
                case 3:
                    dispatch({
                        type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                        data: data,
                    });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getChannel = getChannel;
function getChannelAndMyMember(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channel, member, channelRequest, memberRequest, error_12;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    channelRequest = client_1.Client4.getChannel(channelId);
                    memberRequest = client_1.Client4.getMyChannelMember(channelId);
                    return [4 /*yield*/, channelRequest];
                case 1:
                    channel = _a.sent();
                    return [4 /*yield*/, memberRequest];
                case 2:
                    member = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_12 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_12, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.CHANNELS_FAILURE, error: error_12 },
                        errors_1.logError(error_12),
                    ]));
                    return [2 /*return*/, { error: error_12 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                            data: channel,
                        },
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                            data: member,
                        },
                    ]));
                    dispatch(roles_1.loadRolesIfNeeded(member.roles.split(' ')));
                    return [2 /*return*/, { data: { channel: channel, member: member } }];
            }
        });
    }); };
}
exports.getChannelAndMyMember = getChannelAndMyMember;
function getChannelTimezones(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channelTimezones, channelTimezonesRequest, error_13;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    channelTimezonesRequest = client_1.Client4.getChannelTimezones(channelId);
                    return [4 /*yield*/, channelTimezonesRequest];
                case 1:
                    channelTimezones = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_13, dispatch, getState);
                    dispatch(errors_1.logError(error_13));
                    return [2 /*return*/, { error: error_13 }];
                case 3: return [2 /*return*/, { data: channelTimezones }];
            }
        });
    }); };
}
exports.getChannelTimezones = getChannelTimezones;
function fetchMyChannelsAndMembers(teamId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channels, channelMembers, state, shouldFetchArchived, channelRequest, memberRequest, error_14, currentUserId, currentChannelId, roles, channelMembers_1, channelMembers_1_1, member, _a, _b, role;
        var e_1, _c, e_2, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    dispatch({
                        type: action_types_1.ChannelTypes.CHANNELS_REQUEST,
                        data: null,
                    });
                    state = getState();
                    shouldFetchArchived = helpers_1.isMinimumServerVersion(general_1.getServerVersion(state), 5, 21);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    channelRequest = client_1.Client4.getMyChannels(teamId, shouldFetchArchived);
                    memberRequest = client_1.Client4.getMyChannelMembers(teamId);
                    return [4 /*yield*/, channelRequest];
                case 2:
                    channels = _e.sent();
                    return [4 /*yield*/, memberRequest];
                case 3:
                    channelMembers = _e.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_14 = _e.sent();
                    helpers_2.forceLogoutIfNecessary(error_14, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.CHANNELS_FAILURE, error: error_14 },
                        errors_1.logError(error_14),
                    ]));
                    return [2 /*return*/, { error: error_14 }];
                case 5:
                    currentUserId = state.entities.users.currentUserId;
                    currentChannelId = state.entities.channels.currentChannelId;
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNELS,
                            teamId: teamId,
                            data: channels,
                            currentChannelId: currentChannelId,
                        },
                        {
                            type: action_types_1.ChannelTypes.CHANNELS_SUCCESS,
                        },
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBERS,
                            data: channelMembers,
                            sync: !shouldFetchArchived,
                            channels: channels,
                            remove: channel_utils_1.getChannelsIdForTeam(state, teamId),
                            currentUserId: currentUserId,
                            currentChannelId: currentChannelId,
                        },
                    ]));
                    roles = new Set();
                    try {
                        for (channelMembers_1 = tslib_1.__values(channelMembers), channelMembers_1_1 = channelMembers_1.next(); !channelMembers_1_1.done; channelMembers_1_1 = channelMembers_1.next()) {
                            member = channelMembers_1_1.value;
                            try {
                                for (_a = (e_2 = void 0, tslib_1.__values(member.roles.split(' '))), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    role = _b.value;
                                    roles.add(role);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (channelMembers_1_1 && !channelMembers_1_1.done && (_c = channelMembers_1.return)) _c.call(channelMembers_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (roles.size > 0) {
                        dispatch(roles_1.loadRolesIfNeeded(roles));
                    }
                    return [2 /*return*/, { data: { channels: channels, members: channelMembers } }];
            }
        });
    }); };
}
exports.fetchMyChannelsAndMembers = fetchMyChannelsAndMembers;
function getMyChannelMembers(teamId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channelMembers, channelMembersRequest, error_15, state, currentUserId, currentChannelId, roles, channelMembers_2, channelMembers_2_1, member, _a, _b, role;
        var e_3, _c, e_4, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    channelMembersRequest = client_1.Client4.getMyChannelMembers(teamId);
                    return [4 /*yield*/, channelMembersRequest];
                case 1:
                    channelMembers = _e.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_15 = _e.sent();
                    helpers_2.forceLogoutIfNecessary(error_15, dispatch, getState);
                    dispatch(errors_1.logError(error_15));
                    return [2 /*return*/, { error: error_15 }];
                case 3:
                    state = getState();
                    currentUserId = state.entities.users.currentUserId;
                    currentChannelId = state.entities.channels.currentChannelId;
                    dispatch({
                        type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBERS,
                        data: channelMembers,
                        remove: channel_utils_1.getChannelsIdForTeam(getState(), teamId),
                        currentUserId: currentUserId,
                        currentChannelId: currentChannelId,
                    });
                    roles = new Set();
                    try {
                        for (channelMembers_2 = tslib_1.__values(channelMembers), channelMembers_2_1 = channelMembers_2.next(); !channelMembers_2_1.done; channelMembers_2_1 = channelMembers_2.next()) {
                            member = channelMembers_2_1.value;
                            try {
                                for (_a = (e_4 = void 0, tslib_1.__values(member.roles.split(' '))), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    role = _b.value;
                                    roles.add(role);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (channelMembers_2_1 && !channelMembers_2_1.done && (_c = channelMembers_2.return)) _c.call(channelMembers_2);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    if (roles.size > 0) {
                        dispatch(roles_1.loadRolesIfNeeded(roles));
                    }
                    return [2 /*return*/, { data: channelMembers }];
            }
        });
    }); };
}
exports.getMyChannelMembers = getMyChannelMembers;
function getChannelMembers(channelId, page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.CHANNELS_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channelMembers, channelMembersRequest, error_16, userIds;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    channelMembersRequest = client_1.Client4.getChannelMembers(channelId, page, perPage);
                    return [4 /*yield*/, channelMembersRequest];
                case 1:
                    channelMembers = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_16 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_16, dispatch, getState);
                    dispatch(errors_1.logError(error_16));
                    return [2 /*return*/, { error: error_16 }];
                case 3:
                    userIds = channelMembers.map(function (cm) { return cm.user_id; });
                    users_2.getMissingProfilesByIds(userIds)(dispatch, getState);
                    dispatch({
                        type: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBERS,
                        data: channelMembers,
                    });
                    return [2 /*return*/, { data: channelMembers }];
            }
        });
    }); };
}
exports.getChannelMembers = getChannelMembers;
function leaveChannel(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, currentUserId, _a, channels, myMembers, channel, member;
        return tslib_1.__generator(this, function (_b) {
            state = getState();
            currentUserId = state.entities.users.currentUserId;
            _a = state.entities.channels, channels = _a.channels, myMembers = _a.myMembers;
            channel = channels[channelId];
            member = myMembers[channelId];
            client_1.Client4.trackEvent('action', 'action_channels_leave', { channel_id: channelId });
            dispatch({
                type: action_types_1.ChannelTypes.LEAVE_CHANNEL,
                data: {
                    id: channelId,
                    user_id: currentUserId,
                    team_id: channel.team_id,
                    type: channel.type,
                },
            });
            (function removeFromChannelWrapper() {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, client_1.Client4.removeFromChannel(currentUserId, channelId)];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                _a = _b.sent();
                                dispatch(actions_1.batchActions([
                                    {
                                        type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                                        data: channel,
                                    },
                                    {
                                        type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                                        data: member,
                                    },
                                ]));
                                // The category here may not be the one in which the channel was originally located,
                                // much less the order in which it was placed. Treating this as a transient issue
                                // for the user to resolve by refreshing or leaving again.
                                dispatch(channel_categories_3.addChannelToInitialCategory(channel, false));
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
exports.leaveChannel = leaveChannel;
function joinChannel(userId, teamId, channelId, channelName) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var member, channel, error_17;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!channelId && !channelName) {
                        return [2 /*return*/, { data: null }];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    if (!channelId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client_1.Client4.addToChannel(userId, channelId)];
                case 2:
                    member = _a.sent();
                    return [4 /*yield*/, client_1.Client4.getChannel(channelId)];
                case 3:
                    channel = _a.sent();
                    return [3 /*break*/, 9];
                case 4: return [4 /*yield*/, client_1.Client4.getChannelByName(teamId, channelName, true)];
                case 5:
                    channel = _a.sent();
                    if (!((channel.type === constants_1.General.GM_CHANNEL) || (channel.type === constants_1.General.DM_CHANNEL))) return [3 /*break*/, 7];
                    return [4 /*yield*/, client_1.Client4.getChannelMember(channel.id, userId)];
                case 6:
                    member = _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, client_1.Client4.addToChannel(userId, channel.id)];
                case 8:
                    member = _a.sent();
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_17 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_17, dispatch, getState);
                    dispatch(errors_1.logError(error_17));
                    return [2 /*return*/, { error: error_17 }];
                case 11:
                    client_1.Client4.trackEvent('action', 'action_channels_join', { channel_id: channelId });
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL,
                            data: channel,
                        },
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                            data: member,
                        },
                    ]));
                    dispatch(channel_categories_3.addChannelToInitialCategory(channel));
                    if (member) {
                        dispatch(roles_1.loadRolesIfNeeded(member.roles.split(' ')));
                    }
                    return [2 /*return*/, { data: { channel: channel, member: member } }];
            }
        });
    }); };
}
exports.joinChannel = joinChannel;
function deleteChannel(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, viewArchivedChannels, error_18, currentChannelId, teamId, channelsInTeam, channel;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    viewArchivedChannels = state.entities.general.config.ExperimentalViewArchivedChannels === 'true';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.deleteChannel(channelId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_18 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_18, dispatch, getState);
                    dispatch(errors_1.logError(error_18));
                    return [2 /*return*/, { error: error_18 }];
                case 4:
                    state = getState();
                    currentChannelId = state.entities.channels.currentChannelId;
                    if (channelId === currentChannelId && !viewArchivedChannels) {
                        teamId = teams_1.getCurrentTeamId(state);
                        channelsInTeam = channels_2.getChannelsNameMapInTeam(state, teamId);
                        channel = channel_utils_1.getChannelByName(channelsInTeam, channels_2.getRedirectChannelNameForTeam(state, teamId));
                        if (channel && channel.id) {
                            dispatch({ type: action_types_1.ChannelTypes.SELECT_CHANNEL, data: channel.id });
                        }
                    }
                    dispatch({ type: action_types_1.ChannelTypes.DELETE_CHANNEL_SUCCESS, data: { id: channelId, viewArchivedChannels: viewArchivedChannels } });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.deleteChannel = deleteChannel;
function unarchiveChannel(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_19, state, config, viewArchivedChannels;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.unarchiveChannel(channelId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_19 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_19, dispatch, getState);
                    dispatch(errors_1.logError(error_19));
                    return [2 /*return*/, { error: error_19 }];
                case 3:
                    state = getState();
                    config = general_1.getConfig(state);
                    viewArchivedChannels = config.ExperimentalViewArchivedChannels === 'true';
                    dispatch({ type: action_types_1.ChannelTypes.UNARCHIVED_CHANNEL_SUCCESS, data: { id: channelId, viewArchivedChannels: viewArchivedChannels } });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.unarchiveChannel = unarchiveChannel;
function viewChannel(channelId, prevChannelId) {
    var _this = this;
    if (prevChannelId === void 0) { prevChannelId = ''; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, myPreferences, viewTimePref, viewTime, prevChanManuallyUnread, preferences, error_20, actions, myMembers, member, prevMember;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    myPreferences = getState().entities.preferences.myPreferences;
                    viewTimePref = myPreferences[constants_1.Preferences.CATEGORY_CHANNEL_APPROXIMATE_VIEW_TIME + "--" + channelId];
                    viewTime = viewTimePref ? parseInt(viewTimePref.value, 10) : 0;
                    prevChanManuallyUnread = channels_2.isManuallyUnread(getState(), prevChannelId);
                    if (viewTime < new Date().getTime() - (3 * 60 * 60 * 1000)) {
                        preferences = [
                            { user_id: currentUserId, category: constants_1.Preferences.CATEGORY_CHANNEL_APPROXIMATE_VIEW_TIME, name: channelId, value: new Date().getTime().toString() },
                        ];
                        preferences_1.savePreferences(currentUserId, preferences)(dispatch);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.viewMyChannel(channelId, prevChanManuallyUnread ? '' : prevChannelId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_20 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_20, dispatch, getState);
                    dispatch(errors_1.logError(error_20));
                    return [2 /*return*/, { error: error_20 }];
                case 4:
                    actions = [];
                    myMembers = getState().entities.channels.myMembers;
                    member = myMembers[channelId];
                    if (member) {
                        if (channels_2.isManuallyUnread(getState(), channelId)) {
                            actions.push({
                                type: action_types_1.ChannelTypes.REMOVE_MANUALLY_UNREAD,
                                data: { channelId: channelId },
                            });
                        }
                        actions.push({
                            type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                            data: tslib_1.__assign(tslib_1.__assign({}, member), { last_viewed_at: new Date().getTime() }),
                        });
                        dispatch(roles_1.loadRolesIfNeeded(member.roles.split(' ')));
                    }
                    prevMember = myMembers[prevChannelId];
                    if (!prevChanManuallyUnread && prevMember) {
                        actions.push({
                            type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                            data: tslib_1.__assign(tslib_1.__assign({}, prevMember), { last_viewed_at: new Date().getTime() }),
                        });
                        dispatch(roles_1.loadRolesIfNeeded(prevMember.roles.split(' ')));
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.viewChannel = viewChannel;
function markChannelAsViewed(channelId, prevChannelId) {
    if (prevChannelId === void 0) { prevChannelId = ''; }
    return function (dispatch, getState) {
        var actions = [];
        var myMembers = getState().entities.channels.myMembers;
        var member = myMembers[channelId];
        var state = getState();
        if (member) {
            actions.push({
                type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                data: tslib_1.__assign(tslib_1.__assign({}, member), { last_viewed_at: Date.now() }),
            });
            if (channels_2.isManuallyUnread(state, channelId)) {
                actions.push({
                    type: action_types_1.ChannelTypes.REMOVE_MANUALLY_UNREAD,
                    data: { channelId: channelId },
                });
            }
            dispatch(roles_1.loadRolesIfNeeded(member.roles.split(' ')));
        }
        var prevMember = myMembers[prevChannelId];
        if (prevMember && !channels_2.isManuallyUnread(getState(), prevChannelId)) {
            actions.push({
                type: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
                data: tslib_1.__assign(tslib_1.__assign({}, prevMember), { last_viewed_at: Date.now() }),
            });
            dispatch(roles_1.loadRolesIfNeeded(prevMember.roles.split(' ')));
        }
        if (actions.length) {
            dispatch(actions_1.batchActions(actions));
        }
        return { data: true };
    };
}
exports.markChannelAsViewed = markChannelAsViewed;
function getChannels(teamId, page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.CHANNELS_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channels, error_21;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.GET_CHANNELS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getChannels(teamId, page, perPage)];
                case 2:
                    channels = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_21 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_21, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.GET_CHANNELS_FAILURE, error: error_21 },
                        errors_1.logError(error_21),
                    ]));
                    return [2 /*return*/, { error: error_21 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNELS,
                            teamId: teamId,
                            data: channels,
                        },
                        {
                            type: action_types_1.ChannelTypes.GET_CHANNELS_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: channels }];
            }
        });
    }); };
}
exports.getChannels = getChannels;
function getArchivedChannels(teamId, page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.CHANNELS_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channels, error_22;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getArchivedChannels(teamId, page, perPage)];
                case 1:
                    channels = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_22 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_22, dispatch, getState);
                    return [2 /*return*/, { error: error_22 }];
                case 3:
                    dispatch({
                        type: action_types_1.ChannelTypes.RECEIVED_CHANNELS,
                        teamId: teamId,
                        data: channels,
                    });
                    return [2 /*return*/, { data: channels }];
            }
        });
    }); };
}
exports.getArchivedChannels = getArchivedChannels;
function getAllChannelsWithCount(page, perPage, notAssociatedToGroup, excludeDefaultChannels, includeDeleted) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.CHANNELS_CHUNK_SIZE; }
    if (notAssociatedToGroup === void 0) { notAssociatedToGroup = ''; }
    if (excludeDefaultChannels === void 0) { excludeDefaultChannels = false; }
    if (includeDeleted === void 0) { includeDeleted = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var payload, error_23;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getAllChannels(page, perPage, notAssociatedToGroup, excludeDefaultChannels, true, includeDeleted)];
                case 2:
                    payload = (_a.sent());
                    return [3 /*break*/, 4];
                case 3:
                    error_23 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_23, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_FAILURE, error: error_23 },
                        errors_1.logError(error_23),
                    ]));
                    return [2 /*return*/, { error: error_23 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_ALL_CHANNELS,
                            data: payload.channels,
                        },
                        {
                            type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_SUCCESS,
                        },
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_TOTAL_CHANNEL_COUNT,
                            data: payload.total_count,
                        },
                    ]));
                    return [2 /*return*/, { data: payload }];
            }
        });
    }); };
}
exports.getAllChannelsWithCount = getAllChannelsWithCount;
function getAllChannels(page, perPage, notAssociatedToGroup, excludeDefaultChannels) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.CHANNELS_CHUNK_SIZE; }
    if (notAssociatedToGroup === void 0) { notAssociatedToGroup = ''; }
    if (excludeDefaultChannels === void 0) { excludeDefaultChannels = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channels, error_24;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getAllChannels(page, perPage, notAssociatedToGroup, excludeDefaultChannels)];
                case 2:
                    channels = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_24 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_24, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_FAILURE, error: error_24 },
                        errors_1.logError(error_24),
                    ]));
                    return [2 /*return*/, { error: error_24 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_ALL_CHANNELS,
                            data: channels,
                        },
                        {
                            type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: channels }];
            }
        });
    }); };
}
exports.getAllChannels = getAllChannels;
function autocompleteChannels(teamId, term) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channels, error_25;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.GET_CHANNELS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.autocompleteChannels(teamId, term)];
                case 2:
                    channels = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_25 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_25, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.GET_CHANNELS_FAILURE, error: error_25 },
                        errors_1.logError(error_25),
                    ]));
                    return [2 /*return*/, { error: error_25 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNELS,
                            teamId: teamId,
                            data: channels,
                        },
                        {
                            type: action_types_1.ChannelTypes.GET_CHANNELS_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: channels }];
            }
        });
    }); };
}
exports.autocompleteChannels = autocompleteChannels;
function autocompleteChannelsForSearch(teamId, term) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channels, error_26;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.GET_CHANNELS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.autocompleteChannelsForSearch(teamId, term)];
                case 2:
                    channels = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_26 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_26, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.GET_CHANNELS_FAILURE, error: error_26 },
                        errors_1.logError(error_26),
                    ]));
                    return [2 /*return*/, { error: error_26 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNELS,
                            teamId: teamId,
                            data: channels,
                        },
                        {
                            type: action_types_1.ChannelTypes.GET_CHANNELS_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: channels }];
            }
        });
    }); };
}
exports.autocompleteChannelsForSearch = autocompleteChannelsForSearch;
function searchChannels(teamId, term, archived) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var channels, error_27;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.GET_CHANNELS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!archived) return [3 /*break*/, 3];
                    return [4 /*yield*/, client_1.Client4.searchArchivedChannels(teamId, term)];
                case 2:
                    channels = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, client_1.Client4.searchChannels(teamId, term)];
                case 4:
                    channels = _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_27 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_27, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.GET_CHANNELS_FAILURE, error: error_27 },
                        errors_1.logError(error_27),
                    ]));
                    return [2 /*return*/, { error: error_27 }];
                case 7:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNELS,
                            teamId: teamId,
                            data: channels,
                        },
                        {
                            type: action_types_1.ChannelTypes.GET_CHANNELS_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: channels }];
            }
        });
    }); };
}
exports.searchChannels = searchChannels;
function searchAllChannels(term, opts) {
    var _this = this;
    if (opts === void 0) { opts = {}; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var response, error_28, channels;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.searchAllChannels(term, opts)];
                case 2:
                    response = (_a.sent());
                    return [3 /*break*/, 4];
                case 3:
                    error_28 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_28, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_FAILURE, error: error_28 },
                        errors_1.logError(error_28),
                    ]));
                    return [2 /*return*/, { error: error_28 }];
                case 4:
                    channels = response.channels || response;
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_ALL_CHANNELS,
                            data: channels,
                        },
                        {
                            type: action_types_1.ChannelTypes.GET_ALL_CHANNELS_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: response }];
            }
        });
    }); };
}
exports.searchAllChannels = searchAllChannels;
function searchGroupChannels(term) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.searchGroupChannels,
        params: [term],
    });
}
exports.searchGroupChannels = searchGroupChannels;
function getChannelStats(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var stat, error_29;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getChannelStats(channelId)];
                case 1:
                    stat = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_29 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_29, dispatch, getState);
                    dispatch(errors_1.logError(error_29));
                    return [2 /*return*/, { error: error_29 }];
                case 3:
                    dispatch({
                        type: action_types_1.ChannelTypes.RECEIVED_CHANNEL_STATS,
                        data: stat,
                    });
                    return [2 /*return*/, { data: stat }];
            }
        });
    }); };
}
exports.getChannelStats = getChannelStats;
function addChannelMember(channelId, userId, postRootId) {
    var _this = this;
    if (postRootId === void 0) { postRootId = ''; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var member, error_30;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.addToChannel(userId, channelId, postRootId)];
                case 1:
                    member = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_30 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_30, dispatch, getState);
                    dispatch(errors_1.logError(error_30));
                    return [2 /*return*/, { error: error_30 }];
                case 3:
                    client_1.Client4.trackEvent('action', 'action_channels_add_member', { channel_id: channelId });
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILE_IN_CHANNEL,
                            data: { id: channelId, user_id: userId },
                        },
                        {
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBER,
                            data: member,
                        },
                        {
                            type: action_types_1.ChannelTypes.ADD_CHANNEL_MEMBER_SUCCESS,
                            id: channelId,
                        },
                    ], 'ADD_CHANNEL_MEMBER.BATCH'));
                    return [2 /*return*/, { data: member }];
            }
        });
    }); };
}
exports.addChannelMember = addChannelMember;
function removeChannelMember(channelId, userId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_31;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.removeFromChannel(userId, channelId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_31 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_31, dispatch, getState);
                    dispatch(errors_1.logError(error_31));
                    return [2 /*return*/, { error: error_31 }];
                case 3:
                    client_1.Client4.trackEvent('action', 'action_channels_remove_member', { channel_id: channelId });
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILE_NOT_IN_CHANNEL,
                            data: { id: channelId, user_id: userId },
                        },
                        {
                            type: action_types_1.ChannelTypes.REMOVE_CHANNEL_MEMBER_SUCCESS,
                            id: channelId,
                        },
                    ], 'REMOVE_CHANNEL_MEMBER.BATCH'));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.removeChannelMember = removeChannelMember;
function updateChannelMemberRoles(channelId, userId, roles) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_32, membersInChannel;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateChannelMemberRoles(channelId, userId, roles)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_32 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_32, dispatch, getState);
                    dispatch(errors_1.logError(error_32));
                    return [2 /*return*/, { error: error_32 }];
                case 3:
                    membersInChannel = getState().entities.channels.membersInChannel[channelId];
                    if (membersInChannel && membersInChannel[userId]) {
                        dispatch({
                            type: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBER,
                            data: tslib_1.__assign(tslib_1.__assign({}, membersInChannel[userId]), { roles: roles }),
                        });
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.updateChannelMemberRoles = updateChannelMemberRoles;
function updateChannelHeader(channelId, header) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            client_1.Client4.trackEvent('action', 'action_channels_update_header', { channel_id: channelId });
            dispatch({
                type: action_types_1.ChannelTypes.UPDATE_CHANNEL_HEADER,
                data: {
                    channelId: channelId,
                    header: header,
                },
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.updateChannelHeader = updateChannelHeader;
function updateChannelPurpose(channelId, purpose) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            client_1.Client4.trackEvent('action', 'action_channels_update_purpose', { channel_id: channelId });
            dispatch({
                type: action_types_1.ChannelTypes.UPDATE_CHANNEL_PURPOSE,
                data: {
                    channelId: channelId,
                    purpose: purpose,
                },
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.updateChannelPurpose = updateChannelPurpose;
function markChannelAsRead(channelId, prevChannelId, updateLastViewedAt) {
    var _this = this;
    if (updateLastViewedAt === void 0) { updateLastViewedAt = true; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var prevChanManuallyUnread, state, _a, channels, myMembers, channel, prevChannel, channelMember, prevChannelMember, actions;
        return tslib_1.__generator(this, function (_b) {
            prevChanManuallyUnread = channels_2.isManuallyUnread(getState(), prevChannelId);
            // Send channel last viewed at to the server
            if (updateLastViewedAt) {
                client_1.Client4.viewMyChannel(channelId, prevChanManuallyUnread ? '' : prevChannelId).then().catch(function (error) {
                    helpers_2.forceLogoutIfNecessary(error, dispatch, getState);
                    dispatch(errors_1.logError(error));
                    return { error: error };
                });
            }
            state = getState();
            _a = state.entities.channels, channels = _a.channels, myMembers = _a.myMembers;
            channel = channels[channelId];
            prevChannel = (!prevChanManuallyUnread && prevChannelId) ? channels[prevChannelId] : null;
            channelMember = myMembers[channelId];
            prevChannelMember = (!prevChanManuallyUnread && prevChannelId) ? myMembers[prevChannelId] : null;
            actions = [];
            if (channel && channelMember) {
                actions.push({
                    type: action_types_1.ChannelTypes.DECREMENT_UNREAD_MSG_COUNT,
                    data: {
                        teamId: channel.team_id,
                        channelId: channelId,
                        amount: channel.total_msg_count - channelMember.msg_count,
                    },
                });
                actions.push({
                    type: action_types_1.ChannelTypes.DECREMENT_UNREAD_MENTION_COUNT,
                    data: {
                        teamId: channel.team_id,
                        channelId: channelId,
                        amount: channelMember.mention_count,
                    },
                });
            }
            if (channel && channels_2.isManuallyUnread(getState(), channelId)) {
                actions.push({
                    type: action_types_1.ChannelTypes.REMOVE_MANUALLY_UNREAD,
                    data: { channelId: channelId },
                });
            }
            if (prevChannel && prevChannelMember) {
                actions.push({
                    type: action_types_1.ChannelTypes.DECREMENT_UNREAD_MSG_COUNT,
                    data: {
                        teamId: prevChannel.team_id,
                        channelId: prevChannelId,
                        amount: prevChannel.total_msg_count - prevChannelMember.msg_count,
                    },
                });
                actions.push({
                    type: action_types_1.ChannelTypes.DECREMENT_UNREAD_MENTION_COUNT,
                    data: {
                        teamId: prevChannel.team_id,
                        channelId: prevChannelId,
                        amount: prevChannelMember.mention_count,
                    },
                });
            }
            if (actions.length > 0) {
                dispatch(actions_1.batchActions(actions));
            }
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.markChannelAsRead = markChannelAsRead;
// Increments the number of posts in the channel by 1 and marks it as unread if necessary
function markChannelAsUnread(teamId, channelId, mentions, fetchedChannelMember) {
    var _this = this;
    if (fetchedChannelMember === void 0) { fetchedChannelMember = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, myMembers, currentUserId, actions;
        return tslib_1.__generator(this, function (_a) {
            state = getState();
            myMembers = state.entities.channels.myMembers;
            currentUserId = state.entities.users.currentUserId;
            actions = [{
                    type: action_types_1.ChannelTypes.INCREMENT_UNREAD_MSG_COUNT,
                    data: {
                        teamId: teamId,
                        channelId: channelId,
                        amount: 1,
                        onlyMentions: myMembers[channelId] && myMembers[channelId].notify_props &&
                            myMembers[channelId].notify_props.mark_unread === channels_1.MarkUnread.MENTION,
                        fetchedChannelMember: fetchedChannelMember,
                    },
                }];
            if (!fetchedChannelMember) {
                actions.push({
                    type: action_types_1.ChannelTypes.INCREMENT_TOTAL_MSG_COUNT,
                    data: {
                        channelId: channelId,
                        amount: 1,
                    },
                });
            }
            if (mentions && mentions.indexOf(currentUserId) !== -1) {
                actions.push({
                    type: action_types_1.ChannelTypes.INCREMENT_UNREAD_MENTION_COUNT,
                    data: {
                        teamId: teamId,
                        channelId: channelId,
                        amount: 1,
                        fetchedChannelMember: fetchedChannelMember,
                    },
                });
            }
            dispatch(actions_1.batchActions(actions));
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.markChannelAsUnread = markChannelAsUnread;
function getChannelMembersByIds(channelId, userIds) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getChannelMembersByIds,
        onSuccess: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBERS,
        params: [
            channelId,
            userIds,
        ],
    });
}
exports.getChannelMembersByIds = getChannelMembersByIds;
function getChannelMember(channelId, userId) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getChannelMember,
        onSuccess: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBER,
        params: [
            channelId,
            userId,
        ],
    });
}
exports.getChannelMember = getChannelMember;
function getMyChannelMember(channelId) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getMyChannelMember,
        onSuccess: action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER,
        params: [
            channelId,
        ],
    });
}
exports.getMyChannelMember = getMyChannelMember;
function favoriteChannel(channelId, updateCategories) {
    var _this = this;
    if (updateCategories === void 0) { updateCategories = true; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, config, currentUserId, preference, channel, category;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    config = general_1.getConfig(state);
                    currentUserId = users_1.getCurrentUserId(state);
                    preference = {
                        user_id: currentUserId,
                        category: constants_1.Preferences.CATEGORY_FAVORITE_CHANNEL,
                        name: channelId,
                        value: 'true',
                    };
                    client_1.Client4.trackEvent('action', 'action_channels_favorite');
                    if (config.EnableLegacySidebar === 'true') {
                        // The old sidebar is enabled, so favorite the channel by calling the preferences API
                        return [2 /*return*/, dispatch(preferences_1.savePreferences(currentUserId, [preference]))];
                    }
                    if (!updateCategories) return [3 /*break*/, 2];
                    channel = channels_2.getChannel(state, channelId);
                    category = channel_categories_2.getCategoryInTeamByType(state, channel.team_id || teams_1.getCurrentTeamId(state), channel_categories_1.CategoryTypes.FAVORITES);
                    if (!category) return [3 /*break*/, 2];
                    return [4 /*yield*/, dispatch(channel_categories_3.addChannelToCategory(category.id, channelId))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, dispatch({
                        type: action_types_1.PreferenceTypes.RECEIVED_PREFERENCES,
                        data: [preference],
                    })];
            }
        });
    }); };
}
exports.favoriteChannel = favoriteChannel;
function unfavoriteChannel(channelId, updateCategories) {
    var _this = this;
    if (updateCategories === void 0) { updateCategories = true; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, config, currentUserId, preference, channel, category;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    config = general_1.getConfig(state);
                    currentUserId = users_1.getCurrentUserId(state);
                    preference = {
                        user_id: currentUserId,
                        category: constants_1.Preferences.CATEGORY_FAVORITE_CHANNEL,
                        name: channelId,
                        value: '',
                    };
                    client_1.Client4.trackEvent('action', 'action_channels_unfavorite');
                    if (config.EnableLegacySidebar === 'true') {
                        // The old sidebar is enabled, so unfavorite the channel by calling the preferences API
                        return [2 /*return*/, dispatch(preferences_1.deletePreferences(currentUserId, [preference]))];
                    }
                    if (!updateCategories) return [3 /*break*/, 2];
                    channel = channels_2.getChannel(state, channelId);
                    category = channel_categories_2.getCategoryInTeamByType(state, channel.team_id || teams_1.getCurrentTeamId(state), channel.type === constants_1.General.DM_CHANNEL || channel.type === constants_1.General.GM_CHANNEL ? channel_categories_1.CategoryTypes.DIRECT_MESSAGES : channel_categories_1.CategoryTypes.CHANNELS);
                    if (!category) return [3 /*break*/, 2];
                    return [4 /*yield*/, dispatch(channel_categories_3.addChannelToCategory(category.id, channel.id))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, dispatch({
                        type: action_types_1.PreferenceTypes.DELETED_PREFERENCES,
                        data: [preference],
                    })];
            }
        });
    }); };
}
exports.unfavoriteChannel = unfavoriteChannel;
function updateChannelScheme(channelId, schemeId) {
    var _this = this;
    return helpers_2.bindClientFunc({
        clientFunc: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.updateChannelScheme(channelId, schemeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { channelId: channelId, schemeId: schemeId }];
                }
            });
        }); },
        onSuccess: action_types_1.ChannelTypes.UPDATED_CHANNEL_SCHEME,
    });
}
exports.updateChannelScheme = updateChannelScheme;
function updateChannelMemberSchemeRoles(channelId, userId, isSchemeUser, isSchemeAdmin) {
    var _this = this;
    return helpers_2.bindClientFunc({
        clientFunc: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.updateChannelMemberSchemeRoles(channelId, userId, isSchemeUser, isSchemeAdmin)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { channelId: channelId, userId: userId, isSchemeUser: isSchemeUser, isSchemeAdmin: isSchemeAdmin }];
                }
            });
        }); },
        onSuccess: action_types_1.ChannelTypes.UPDATED_CHANNEL_MEMBER_SCHEME_ROLES,
    });
}
exports.updateChannelMemberSchemeRoles = updateChannelMemberSchemeRoles;
function membersMinusGroupMembers(channelID, groupIDs, page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.channelMembersMinusGroupMembers,
        onSuccess: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBERS_MINUS_GROUP_MEMBERS,
        params: [
            channelID,
            groupIDs,
            page,
            perPage,
        ],
    });
}
exports.membersMinusGroupMembers = membersMinusGroupMembers;
function getChannelModerations(channelId) {
    var _this = this;
    return helpers_2.bindClientFunc({
        clientFunc: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var moderations;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.getChannelModerations(channelId)];
                    case 1:
                        moderations = _a.sent();
                        return [2 /*return*/, { channelId: channelId, moderations: moderations }];
                }
            });
        }); },
        onSuccess: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MODERATIONS,
        params: [
            channelId,
        ],
    });
}
exports.getChannelModerations = getChannelModerations;
function patchChannelModerations(channelId, patch) {
    var _this = this;
    return helpers_2.bindClientFunc({
        clientFunc: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var moderations;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.patchChannelModerations(channelId, patch)];
                    case 1:
                        moderations = _a.sent();
                        return [2 /*return*/, { channelId: channelId, moderations: moderations }];
                }
            });
        }); },
        onSuccess: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MODERATIONS,
        params: [
            channelId,
        ],
    });
}
exports.patchChannelModerations = patchChannelModerations;
function getChannelMemberCountsByGroup(channelId, includeTimezones) {
    var _this = this;
    return helpers_2.bindClientFunc({
        clientFunc: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var channelMemberCountsByGroup;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.getChannelMemberCountsByGroup(channelId, includeTimezones)];
                    case 1:
                        channelMemberCountsByGroup = _a.sent();
                        return [2 /*return*/, { channelId: channelId, memberCounts: channelMemberCountsByGroup }];
                }
            });
        }); },
        onSuccess: action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBER_COUNTS_BY_GROUP,
        params: [
            channelId,
        ],
    });
}
exports.getChannelMemberCountsByGroup = getChannelMemberCountsByGroup;
exports.default = {
    selectChannel: selectChannel,
    createChannel: createChannel,
    createDirectChannel: createDirectChannel,
    updateChannel: updateChannel,
    patchChannel: patchChannel,
    updateChannelNotifyProps: updateChannelNotifyProps,
    getChannel: getChannel,
    fetchMyChannelsAndMembers: fetchMyChannelsAndMembers,
    getMyChannelMembers: getMyChannelMembers,
    getChannelTimezones: getChannelTimezones,
    getChannelMembersByIds: getChannelMembersByIds,
    leaveChannel: leaveChannel,
    joinChannel: joinChannel,
    deleteChannel: deleteChannel,
    unarchiveChannel: unarchiveChannel,
    viewChannel: viewChannel,
    markChannelAsViewed: markChannelAsViewed,
    getChannels: getChannels,
    autocompleteChannels: autocompleteChannels,
    autocompleteChannelsForSearch: autocompleteChannelsForSearch,
    searchChannels: searchChannels,
    searchGroupChannels: searchGroupChannels,
    getChannelStats: getChannelStats,
    addChannelMember: addChannelMember,
    removeChannelMember: removeChannelMember,
    updateChannelHeader: updateChannelHeader,
    updateChannelPurpose: updateChannelPurpose,
    markChannelAsRead: markChannelAsRead,
    markChannelAsUnread: markChannelAsUnread,
    favoriteChannel: favoriteChannel,
    unfavoriteChannel: unfavoriteChannel,
    membersMinusGroupMembers: membersMinusGroupMembers,
    getChannelModerations: getChannelModerations,
    getChannelMemberCountsByGroup: getChannelMemberCountsByGroup,
};
//# sourceMappingURL=channels.js.map