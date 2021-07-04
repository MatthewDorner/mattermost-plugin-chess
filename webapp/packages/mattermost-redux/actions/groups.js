"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupStats = exports.getGroupsByUserId = exports.patchGroup = exports.getGroupsAssociatedToChannel = exports.getGroupsAssociatedToTeam = exports.getAllGroupsAssociatedToChannel = exports.getAllGroupsAssociatedToChannelsInTeam = exports.getAllGroupsAssociatedToTeam = exports.getGroupsNotAssociatedToChannel = exports.getGroupsNotAssociatedToTeam = exports.getGroups = exports.getGroup = exports.patchGroupSyncable = exports.getGroupSyncables = exports.unlinkGroupSyncable = exports.linkGroupSyncable = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var action_types_1 = require("../action_types");
var constants_1 = require("../constants");
var client_1 = require("../client");
var actions_1 = require("../types/actions");
var errors_1 = require("./errors");
var helpers_1 = require("./helpers");
function linkGroupSyncable(groupID, syncableID, syncableType, patch) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_1, dispatches, type;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.linkGroupSyncable(groupID, syncableID, syncableType, patch)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(errors_1.logError(error_1));
                    return [2 /*return*/, { error: error_1 }];
                case 3:
                    dispatches = [];
                    type = '';
                    switch (syncableType) {
                        case constants_1.Groups.SYNCABLE_TYPE_TEAM:
                            dispatches.push({ type: action_types_1.GroupTypes.RECEIVED_GROUP_ASSOCIATED_TO_TEAM, data: { teamID: syncableID, groups: [{ id: groupID }] } });
                            type = action_types_1.GroupTypes.LINKED_GROUP_TEAM;
                            break;
                        case constants_1.Groups.SYNCABLE_TYPE_CHANNEL:
                            type = action_types_1.GroupTypes.LINKED_GROUP_CHANNEL;
                            break;
                        default:
                            console.warn("unhandled syncable type " + syncableType); // eslint-disable-line no-console
                    }
                    dispatches.push({ type: type, data: data });
                    dispatch(actions_1.batchActions(dispatches));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.linkGroupSyncable = linkGroupSyncable;
function unlinkGroupSyncable(groupID, syncableID, syncableType) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_2, dispatches, type, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.unlinkGroupSyncable(groupID, syncableID, syncableType)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(errors_1.logError(error_2));
                    return [2 /*return*/, { error: error_2 }];
                case 3:
                    dispatches = [];
                    type = '';
                    data = { group_id: groupID, syncable_id: syncableID };
                    switch (syncableType) {
                        case constants_1.Groups.SYNCABLE_TYPE_TEAM:
                            type = action_types_1.GroupTypes.UNLINKED_GROUP_TEAM;
                            data.syncable_id = syncableID;
                            dispatches.push({ type: action_types_1.GroupTypes.RECEIVED_GROUPS_NOT_ASSOCIATED_TO_TEAM, data: { teamID: syncableID, groups: [{ id: groupID }] } });
                            break;
                        case constants_1.Groups.SYNCABLE_TYPE_CHANNEL:
                            type = action_types_1.GroupTypes.UNLINKED_GROUP_CHANNEL;
                            data.syncable_id = syncableID;
                            break;
                        default:
                            console.warn("unhandled syncable type " + syncableType); // eslint-disable-line no-console
                    }
                    dispatches.push({ type: type, data: data });
                    dispatch(actions_1.batchActions(dispatches));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.unlinkGroupSyncable = unlinkGroupSyncable;
function getGroupSyncables(groupID, syncableType) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_3, type;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getGroupSyncables(groupID, syncableType)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(errors_1.logError(error_3));
                    return [2 /*return*/, { error: error_3 }];
                case 3:
                    type = '';
                    switch (syncableType) {
                        case constants_1.Groups.SYNCABLE_TYPE_TEAM:
                            type = action_types_1.GroupTypes.RECEIVED_GROUP_TEAMS;
                            break;
                        case constants_1.Groups.SYNCABLE_TYPE_CHANNEL:
                            type = action_types_1.GroupTypes.RECEIVED_GROUP_CHANNELS;
                            break;
                        default:
                            console.warn("unhandled syncable type " + syncableType); // eslint-disable-line no-console
                    }
                    dispatch(actions_1.batchActions([
                        { type: type, data: data, group_id: groupID },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.getGroupSyncables = getGroupSyncables;
function patchGroupSyncable(groupID, syncableID, syncableType, patch) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_4, dispatches, type;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.patchGroupSyncable(groupID, syncableID, syncableType, patch)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    return [2 /*return*/, { error: error_4 }];
                case 3:
                    dispatches = [];
                    type = '';
                    switch (syncableType) {
                        case constants_1.Groups.SYNCABLE_TYPE_TEAM:
                            type = action_types_1.GroupTypes.PATCHED_GROUP_TEAM;
                            break;
                        case constants_1.Groups.SYNCABLE_TYPE_CHANNEL:
                            type = action_types_1.GroupTypes.PATCHED_GROUP_CHANNEL;
                            break;
                        default:
                            console.warn("unhandled syncable type " + syncableType); // eslint-disable-line no-console
                    }
                    dispatches.push({ type: type, data: data });
                    dispatch(actions_1.batchActions(dispatches));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.patchGroupSyncable = patchGroupSyncable;
function getGroup(id) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getGroup,
        onSuccess: [action_types_1.GroupTypes.RECEIVED_GROUP],
        params: [
            id,
        ],
    });
}
exports.getGroup = getGroup;
function getGroups(filterAllowReference, page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: function (param1, param2, param3) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.getGroups(param1, param2, param3)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); },
        onSuccess: [action_types_1.GroupTypes.RECEIVED_GROUPS],
        params: [
            filterAllowReference,
            page,
            perPage,
        ],
    });
}
exports.getGroups = getGroups;
function getGroupsNotAssociatedToTeam(teamID, q, page, perPage) {
    if (q === void 0) { q = ''; }
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getGroupsNotAssociatedToTeam,
        onSuccess: [action_types_1.GroupTypes.RECEIVED_GROUPS],
        params: [
            teamID,
            q,
            page,
            perPage,
        ],
    });
}
exports.getGroupsNotAssociatedToTeam = getGroupsNotAssociatedToTeam;
function getGroupsNotAssociatedToChannel(channelID, q, page, perPage, filterParentTeamPermitted) {
    if (q === void 0) { q = ''; }
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    if (filterParentTeamPermitted === void 0) { filterParentTeamPermitted = false; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getGroupsNotAssociatedToChannel,
        onSuccess: [action_types_1.GroupTypes.RECEIVED_GROUPS],
        params: [
            channelID,
            q,
            page,
            perPage,
            filterParentTeamPermitted,
        ],
    });
}
exports.getGroupsNotAssociatedToChannel = getGroupsNotAssociatedToChannel;
function getAllGroupsAssociatedToTeam(teamID, filterAllowReference, includeMemberCount) {
    var _this = this;
    return helpers_1.bindClientFunc({
        clientFunc: function (param1, param2, param3) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.getAllGroupsAssociatedToTeam(param1, param2, param3)];
                    case 1:
                        result = _a.sent();
                        result.teamID = param1;
                        return [2 /*return*/, result];
                }
            });
        }); },
        onSuccess: [action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_TEAM],
        params: [
            teamID,
            filterAllowReference,
            includeMemberCount,
        ],
    });
}
exports.getAllGroupsAssociatedToTeam = getAllGroupsAssociatedToTeam;
function getAllGroupsAssociatedToChannelsInTeam(teamID, filterAllowReference) {
    var _this = this;
    return helpers_1.bindClientFunc({
        clientFunc: function (param1, param2) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.getAllGroupsAssociatedToChannelsInTeam(param1, param2)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { groupsByChannelId: result.groups }];
                }
            });
        }); },
        onSuccess: [action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_CHANNELS_IN_TEAM],
        params: [
            teamID,
            filterAllowReference,
        ],
    });
}
exports.getAllGroupsAssociatedToChannelsInTeam = getAllGroupsAssociatedToChannelsInTeam;
function getAllGroupsAssociatedToChannel(channelID, filterAllowReference, includeMemberCount) {
    var _this = this;
    return helpers_1.bindClientFunc({
        clientFunc: function (param1, param2, param3) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.getAllGroupsAssociatedToChannel(param1, param2, param3)];
                    case 1:
                        result = _a.sent();
                        result.channelID = param1;
                        return [2 /*return*/, result];
                }
            });
        }); },
        onSuccess: [action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_CHANNEL],
        params: [
            channelID,
            filterAllowReference,
            includeMemberCount,
        ],
    });
}
exports.getAllGroupsAssociatedToChannel = getAllGroupsAssociatedToChannel;
function getGroupsAssociatedToTeam(teamID, q, page, perPage, filterAllowReference) {
    var _this = this;
    if (q === void 0) { q = ''; }
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: function (param1, param2, param3, param4, param5) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.getGroupsAssociatedToTeam(param1, param2, param3, param4, param5)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { groups: result.groups, totalGroupCount: result.total_group_count, teamID: param1 }];
                }
            });
        }); },
        onSuccess: [action_types_1.GroupTypes.RECEIVED_GROUPS_ASSOCIATED_TO_TEAM],
        params: [
            teamID,
            q,
            page,
            perPage,
            filterAllowReference,
        ],
    });
}
exports.getGroupsAssociatedToTeam = getGroupsAssociatedToTeam;
function getGroupsAssociatedToChannel(channelID, q, page, perPage, filterAllowReference) {
    var _this = this;
    if (q === void 0) { q = ''; }
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    if (filterAllowReference === void 0) { filterAllowReference = false; }
    return helpers_1.bindClientFunc({
        clientFunc: function (param1, param2, param3, param4, param5) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.getGroupsAssociatedToChannel(param1, param2, param3, param4, param5)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { groups: result.groups, totalGroupCount: result.total_group_count, channelID: param1 }];
                }
            });
        }); },
        onSuccess: [action_types_1.GroupTypes.RECEIVED_GROUPS_ASSOCIATED_TO_CHANNEL],
        params: [
            channelID,
            q,
            page,
            perPage,
            filterAllowReference,
        ],
    });
}
exports.getGroupsAssociatedToChannel = getGroupsAssociatedToChannel;
function patchGroup(groupID, patch) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.patchGroup,
        onSuccess: [action_types_1.GroupTypes.PATCHED_GROUP],
        params: [
            groupID,
            patch,
        ],
    });
}
exports.patchGroup = patchGroup;
function getGroupsByUserId(userID) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getGroupsByUserId,
        onSuccess: [action_types_1.GroupTypes.RECEIVED_MY_GROUPS],
        params: [
            userID,
        ],
    });
}
exports.getGroupsByUserId = getGroupsByUserId;
function getGroupStats(groupID) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getGroupStats,
        onSuccess: [action_types_1.GroupTypes.RECEIVED_GROUP_STATS],
        params: [
            groupID,
        ],
    });
}
exports.getGroupStats = getGroupStats;
//# sourceMappingURL=groups.js.map