"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNoticesAsViewed = exports.getInProductNotices = exports.membersMinusGroupMembers = exports.invalidateAllEmailInvites = exports.updateTeamMemberSchemeRoles = exports.updateTeamScheme = exports.removeTeamIcon = exports.setTeamIcon = exports.joinTeam = exports.checkIfTeamExists = exports.getTeamInviteInfo = exports.sendEmailGuestInvitesToChannelsGracefully = exports.sendEmailInvitesToTeamGracefully = exports.sendEmailGuestInvitesToChannels = exports.sendEmailInvitesToTeam = exports.updateTeamMemberRoles = exports.removeUserFromTeam = exports.addUsersToTeamGracefully = exports.addUsersToTeam = exports.addUserToTeam = exports.addUserToTeamFromInvite = exports.getTeamStats = exports.getTeamMembersForUser = exports.getTeamsForUser = exports.getTeamMembersByIds = exports.getTeamMember = exports.getTeamMembers = exports.getMyTeamMembers = exports.regenerateTeamInviteId = exports.patchTeam = exports.updateTeam = exports.deleteTeam = exports.createTeam = exports.searchTeams = exports.getTeams = exports.getTeamByName = exports.getTeam = exports.getMyTeamUnreads = exports.getMyTeams = exports.selectTeam = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var client_1 = require("../client");
var constants_1 = require("../constants");
var action_types_1 = require("../action_types");
var event_emitter_1 = tslib_1.__importDefault(require("../utils/event_emitter"));
var general_1 = require("../selectors/entities/general");
var teams_1 = require("../selectors/entities/teams");
var users_1 = require("../selectors/entities/users");
var actions_1 = require("../types/actions");
var channels_1 = require("./channels");
var errors_1 = require("./errors");
var helpers_1 = require("./helpers");
var users_2 = require("./users");
var roles_1 = require("./roles");
function getProfilesAndStatusesForMembers(userIds, dispatch, getState) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, currentUserId, profiles, statuses, profilesToLoad, statusesToLoad, requests;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = getState().entities.users, currentUserId = _a.currentUserId, profiles = _a.profiles, statuses = _a.statuses;
                    profilesToLoad = [];
                    statusesToLoad = [];
                    userIds.forEach(function (userId) {
                        if (!profiles[userId] && !profilesToLoad.includes(userId) && userId !== currentUserId) {
                            profilesToLoad.push(userId);
                        }
                        if (!statuses[userId] && !statusesToLoad.includes(userId) && userId !== currentUserId) {
                            statusesToLoad.push(userId);
                        }
                    });
                    requests = [];
                    if (profilesToLoad.length) {
                        requests.push(dispatch(users_2.getProfilesByIds(profilesToLoad)));
                    }
                    if (statusesToLoad.length) {
                        requests.push(dispatch(users_2.getStatusesByIds(statusesToLoad)));
                    }
                    return [4 /*yield*/, Promise.all(requests)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function selectTeam(team) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var teamId;
        return tslib_1.__generator(this, function (_a) {
            teamId = (typeof team === 'string') ? team : team.id;
            dispatch({
                type: action_types_1.TeamTypes.SELECT_TEAM,
                data: teamId,
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.selectTeam = selectTeam;
function getMyTeams() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getMyTeams,
        onRequest: action_types_1.TeamTypes.MY_TEAMS_REQUEST,
        onSuccess: [action_types_1.TeamTypes.RECEIVED_TEAMS_LIST, action_types_1.TeamTypes.MY_TEAMS_SUCCESS],
        onFailure: action_types_1.TeamTypes.MY_TEAMS_FAILURE,
    });
}
exports.getMyTeams = getMyTeams;
function getMyTeamUnreads() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getMyTeamUnreads,
        onSuccess: action_types_1.TeamTypes.RECEIVED_MY_TEAM_UNREADS,
    });
}
exports.getMyTeamUnreads = getMyTeamUnreads;
function getTeam(teamId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getTeam,
        onSuccess: action_types_1.TeamTypes.RECEIVED_TEAM,
        params: [
            teamId,
        ],
    });
}
exports.getTeam = getTeam;
function getTeamByName(teamName) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getTeamByName,
        onSuccess: action_types_1.TeamTypes.RECEIVED_TEAM,
        params: [
            teamName,
        ],
    });
}
exports.getTeamByName = getTeamByName;
function getTeams(page, perPage, includeTotalCount) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.TEAMS_CHUNK_SIZE; }
    if (includeTotalCount === void 0) { includeTotalCount = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_1, actions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.TeamTypes.GET_TEAMS_REQUEST, data: data });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getTeams(page, perPage, includeTotalCount)];
                case 2:
                    data = (_a.sent());
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch({ type: action_types_1.TeamTypes.GET_TEAMS_FAILURE, data: data });
                    dispatch(errors_1.logError(error_1));
                    return [2 /*return*/, { error: error_1 }];
                case 4:
                    actions = [
                        {
                            type: action_types_1.TeamTypes.RECEIVED_TEAMS_LIST,
                            data: includeTotalCount ? data.teams : data,
                        },
                        {
                            type: action_types_1.TeamTypes.GET_TEAMS_SUCCESS,
                            data: data,
                        },
                    ];
                    if (includeTotalCount) {
                        actions.push({
                            type: action_types_1.TeamTypes.RECEIVED_TOTAL_TEAM_COUNT,
                            data: data.total_count,
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getTeams = getTeams;
function searchTeams(term, opts) {
    var _this = this;
    if (opts === void 0) { opts = {}; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var response, error_2, teams;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.TeamTypes.GET_TEAMS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.searchTeams(term, opts)];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.TeamTypes.GET_TEAMS_FAILURE, error: error_2 },
                        errors_1.logError(error_2),
                    ]));
                    return [2 /*return*/, { error: error_2 }];
                case 4:
                    if (!opts.page || !opts.per_page) {
                        teams = response;
                    }
                    else {
                        teams = response.teams;
                    }
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.TeamTypes.RECEIVED_TEAMS_LIST,
                            data: teams,
                        },
                        {
                            type: action_types_1.TeamTypes.GET_TEAMS_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: response }];
            }
        });
    }); };
}
exports.searchTeams = searchTeams;
function createTeam(team) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var created, error_3, member;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.createTeam(team)];
                case 1:
                    created = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(errors_1.logError(error_3));
                    return [2 /*return*/, { error: error_3 }];
                case 3:
                    member = {
                        team_id: created.id,
                        user_id: getState().entities.users.currentUserId,
                        roles: constants_1.General.TEAM_ADMIN_ROLE + " " + constants_1.General.TEAM_USER_ROLE,
                        delete_at: 0,
                        msg_count: 0,
                        mention_count: 0,
                    };
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.TeamTypes.CREATED_TEAM,
                            data: created,
                        },
                        {
                            type: action_types_1.TeamTypes.RECEIVED_MY_TEAM_MEMBER,
                            data: member,
                        },
                        {
                            type: action_types_1.TeamTypes.SELECT_TEAM,
                            data: created.id,
                        },
                    ]));
                    dispatch(roles_1.loadRolesIfNeeded(member.roles.split(' ')));
                    return [2 /*return*/, { data: created }];
            }
        });
    }); };
}
exports.createTeam = createTeam;
function deleteTeam(teamId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_4, entities, currentTeamId, actions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.deleteTeam(teamId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch(errors_1.logError(error_4));
                    return [2 /*return*/, { error: error_4 }];
                case 3:
                    entities = getState().entities;
                    currentTeamId = entities.teams.currentTeamId;
                    actions = [];
                    if (teamId === currentTeamId) {
                        event_emitter_1.default.emit('leave_team');
                        actions.push({ type: action_types_1.ChannelTypes.SELECT_CHANNEL, data: '' });
                    }
                    actions.push({
                        type: action_types_1.TeamTypes.RECEIVED_TEAM_DELETED,
                        data: { id: teamId },
                    });
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.deleteTeam = deleteTeam;
function updateTeam(team) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.updateTeam,
        onSuccess: action_types_1.TeamTypes.UPDATED_TEAM,
        params: [
            team,
        ],
    });
}
exports.updateTeam = updateTeam;
function patchTeam(team) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.patchTeam,
        onSuccess: action_types_1.TeamTypes.PATCHED_TEAM,
        params: [
            team,
        ],
    });
}
exports.patchTeam = patchTeam;
function regenerateTeamInviteId(teamId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.regenerateTeamInviteId,
        onSuccess: action_types_1.TeamTypes.REGENERATED_TEAM_INVITE_ID,
        params: [
            teamId,
        ],
    });
}
exports.regenerateTeamInviteId = regenerateTeamInviteId;
function getMyTeamMembers() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var getMyTeamMembersFunc, teamMembers, roles, _a, _b, teamMember, _c, _d, role;
        var e_1, _e, e_2, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    getMyTeamMembersFunc = helpers_1.bindClientFunc({
                        clientFunc: client_1.Client4.getMyTeamMembers,
                        onSuccess: action_types_1.TeamTypes.RECEIVED_MY_TEAM_MEMBERS,
                    });
                    return [4 /*yield*/, getMyTeamMembersFunc(dispatch, getState)];
                case 1:
                    teamMembers = (_g.sent());
                    if ('data' in teamMembers && teamMembers.data) {
                        roles = new Set();
                        try {
                            for (_a = tslib_1.__values(teamMembers.data), _b = _a.next(); !_b.done; _b = _a.next()) {
                                teamMember = _b.value;
                                try {
                                    for (_c = (e_2 = void 0, tslib_1.__values(teamMember.roles.split(' '))), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        role = _d.value;
                                        roles.add(role);
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        if (roles.size > 0) {
                            dispatch(roles_1.loadRolesIfNeeded(tslib_1.__spread(roles)));
                        }
                    }
                    return [2 /*return*/, teamMembers];
            }
        });
    }); };
}
exports.getMyTeamMembers = getMyTeamMembers;
function getTeamMembers(teamId, page, perPage, options) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.TEAMS_CHUNK_SIZE; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getTeamMembers,
        onRequest: action_types_1.TeamTypes.GET_TEAM_MEMBERS_REQUEST,
        onSuccess: [action_types_1.TeamTypes.RECEIVED_MEMBERS_IN_TEAM, action_types_1.TeamTypes.GET_TEAM_MEMBERS_SUCCESS],
        onFailure: action_types_1.TeamTypes.GET_TEAM_MEMBERS_FAILURE,
        params: [
            teamId,
            page,
            perPage,
            options,
        ],
    });
}
exports.getTeamMembers = getTeamMembers;
function getTeamMember(teamId, userId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var member, memberRequest, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    memberRequest = client_1.Client4.getTeamMember(teamId, userId);
                    getProfilesAndStatusesForMembers([userId], dispatch, getState);
                    return [4 /*yield*/, memberRequest];
                case 1:
                    member = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(errors_1.logError(error_5));
                    return [2 /*return*/, { error: error_5 }];
                case 3:
                    dispatch({
                        type: action_types_1.TeamTypes.RECEIVED_MEMBERS_IN_TEAM,
                        data: [member],
                    });
                    return [2 /*return*/, { data: member }];
            }
        });
    }); };
}
exports.getTeamMember = getTeamMember;
function getTeamMembersByIds(teamId, userIds) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var members, membersRequest, error_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    membersRequest = client_1.Client4.getTeamMembersByIds(teamId, userIds);
                    getProfilesAndStatusesForMembers(userIds, dispatch, getState);
                    return [4 /*yield*/, membersRequest];
                case 1:
                    members = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_6, dispatch, getState);
                    dispatch(errors_1.logError(error_6));
                    return [2 /*return*/, { error: error_6 }];
                case 3:
                    dispatch({
                        type: action_types_1.TeamTypes.RECEIVED_MEMBERS_IN_TEAM,
                        data: members,
                    });
                    return [2 /*return*/, { data: members }];
            }
        });
    }); };
}
exports.getTeamMembersByIds = getTeamMembersByIds;
function getTeamsForUser(userId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getTeamsForUser,
        onRequest: action_types_1.TeamTypes.GET_TEAMS_REQUEST,
        onSuccess: [action_types_1.TeamTypes.RECEIVED_TEAMS_LIST, action_types_1.TeamTypes.GET_TEAMS_SUCCESS],
        onFailure: action_types_1.TeamTypes.GET_TEAMS_FAILURE,
        params: [
            userId,
        ],
    });
}
exports.getTeamsForUser = getTeamsForUser;
function getTeamMembersForUser(userId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getTeamMembersForUser,
        onSuccess: action_types_1.TeamTypes.RECEIVED_TEAM_MEMBERS,
        params: [
            userId,
        ],
    });
}
exports.getTeamMembersForUser = getTeamMembersForUser;
function getTeamStats(teamId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getTeamStats,
        onSuccess: action_types_1.TeamTypes.RECEIVED_TEAM_STATS,
        params: [
            teamId,
        ],
    });
}
exports.getTeamStats = getTeamStats;
function addUserToTeamFromInvite(token, inviteId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.addToTeamFromInvite,
        onRequest: action_types_1.TeamTypes.ADD_TO_TEAM_FROM_INVITE_REQUEST,
        onSuccess: action_types_1.TeamTypes.ADD_TO_TEAM_FROM_INVITE_SUCCESS,
        onFailure: action_types_1.TeamTypes.ADD_TO_TEAM_FROM_INVITE_FAILURE,
        params: [
            token,
            inviteId,
        ],
    });
}
exports.addUserToTeamFromInvite = addUserToTeamFromInvite;
function addUserToTeam(teamId, userId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var member, error_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.addToTeam(teamId, userId)];
                case 1:
                    member = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_7, dispatch, getState);
                    dispatch(errors_1.logError(error_7));
                    return [2 /*return*/, { error: error_7 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILE_IN_TEAM,
                            data: { id: teamId, user_id: userId },
                        },
                        {
                            type: action_types_1.TeamTypes.RECEIVED_MEMBER_IN_TEAM,
                            data: member,
                        },
                    ]));
                    return [2 /*return*/, { data: member }];
            }
        });
    }); };
}
exports.addUserToTeam = addUserToTeam;
function addUsersToTeam(teamId, userIds) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var members, error_8, profiles;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.addUsersToTeam(teamId, userIds)];
                case 1:
                    members = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_8, dispatch, getState);
                    dispatch(errors_1.logError(error_8));
                    return [2 /*return*/, { error: error_8 }];
                case 3:
                    profiles = [];
                    members.forEach(function (m) { return profiles.push({ id: m.user_id }); });
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_TEAM,
                            data: profiles,
                            id: teamId,
                        },
                        {
                            type: action_types_1.TeamTypes.RECEIVED_MEMBERS_IN_TEAM,
                            data: members,
                        },
                    ]));
                    return [2 /*return*/, { data: members }];
            }
        });
    }); };
}
exports.addUsersToTeam = addUsersToTeam;
function addUsersToTeamGracefully(teamId, userIds) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, error_9, addedMembers, profiles, members;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.addUsersToTeamGracefully(teamId, userIds)];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_9, dispatch, getState);
                    dispatch(errors_1.logError(error_9));
                    return [2 /*return*/, { error: error_9 }];
                case 3:
                    addedMembers = result ? result.filter(function (m) { return !m.error; }) : [];
                    profiles = addedMembers.map(function (m) { return ({ id: m.user_id }); });
                    members = addedMembers.map(function (m) { return m.member; });
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_TEAM,
                            data: profiles,
                            id: teamId,
                        },
                        {
                            type: action_types_1.TeamTypes.RECEIVED_MEMBERS_IN_TEAM,
                            data: members,
                        },
                    ]));
                    return [2 /*return*/, { data: result }];
            }
        });
    }); };
}
exports.addUsersToTeamGracefully = addUsersToTeamGracefully;
function removeUserFromTeam(teamId, userId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_10, member, actions, state, currentUserId, _a, channels, myMembers, _b, _c, channelMember, channel;
        var e_3, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.removeFromTeam(teamId, userId)];
                case 1:
                    _e.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _e.sent();
                    helpers_1.forceLogoutIfNecessary(error_10, dispatch, getState);
                    dispatch(errors_1.logError(error_10));
                    return [2 /*return*/, { error: error_10 }];
                case 3:
                    member = {
                        team_id: teamId,
                        user_id: userId,
                    };
                    actions = [
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILE_NOT_IN_TEAM,
                            data: { id: teamId, user_id: userId },
                        },
                        {
                            type: action_types_1.TeamTypes.REMOVE_MEMBER_FROM_TEAM,
                            data: member,
                        },
                    ];
                    state = getState();
                    currentUserId = users_1.getCurrentUserId(state);
                    if (userId === currentUserId) {
                        _a = state.entities.channels, channels = _a.channels, myMembers = _a.myMembers;
                        try {
                            for (_b = tslib_1.__values(Object.values(myMembers)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                channelMember = _c.value;
                                channel = channels[channelMember.channel_id];
                                if (channel && channel.team_id === teamId) {
                                    actions.push({
                                        type: action_types_1.ChannelTypes.LEAVE_CHANNEL,
                                        data: channel,
                                    });
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        if (teamId === teams_1.getCurrentTeamId(state)) {
                            actions.push(channels_1.selectChannel(''));
                        }
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.removeUserFromTeam = removeUserFromTeam;
function updateTeamMemberRoles(teamId, userId, roles) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_11, membersInTeam;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateTeamMemberRoles(teamId, userId, roles)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_11, dispatch, getState);
                    dispatch(errors_1.logError(error_11));
                    return [2 /*return*/, { error: error_11 }];
                case 3:
                    membersInTeam = getState().entities.teams.membersInTeam[teamId];
                    if (membersInTeam && membersInTeam[userId]) {
                        dispatch({
                            type: action_types_1.TeamTypes.RECEIVED_MEMBER_IN_TEAM,
                            data: tslib_1.__assign(tslib_1.__assign({}, membersInTeam[userId]), { roles: roles }),
                        });
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.updateTeamMemberRoles = updateTeamMemberRoles;
function sendEmailInvitesToTeam(teamId, emails) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.sendEmailInvitesToTeam,
        params: [
            teamId,
            emails,
        ],
    });
}
exports.sendEmailInvitesToTeam = sendEmailInvitesToTeam;
function sendEmailGuestInvitesToChannels(teamId, channelIds, emails, message) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.sendEmailGuestInvitesToChannels,
        params: [
            teamId,
            channelIds,
            emails,
            message,
        ],
    });
}
exports.sendEmailGuestInvitesToChannels = sendEmailGuestInvitesToChannels;
function sendEmailInvitesToTeamGracefully(teamId, emails) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.sendEmailInvitesToTeamGracefully,
        params: [
            teamId,
            emails,
        ],
    });
}
exports.sendEmailInvitesToTeamGracefully = sendEmailInvitesToTeamGracefully;
function sendEmailGuestInvitesToChannelsGracefully(teamId, channelIds, emails, message) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.sendEmailGuestInvitesToChannelsGracefully,
        params: [
            teamId,
            channelIds,
            emails,
            message,
        ],
    });
}
exports.sendEmailGuestInvitesToChannelsGracefully = sendEmailGuestInvitesToChannelsGracefully;
function getTeamInviteInfo(inviteId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getTeamInviteInfo,
        onRequest: action_types_1.TeamTypes.TEAM_INVITE_INFO_REQUEST,
        onSuccess: action_types_1.TeamTypes.TEAM_INVITE_INFO_SUCCESS,
        onFailure: action_types_1.TeamTypes.TEAM_INVITE_INFO_FAILURE,
        params: [
            inviteId,
        ],
    });
}
exports.getTeamInviteInfo = getTeamInviteInfo;
function checkIfTeamExists(teamName) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_12;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.checkIfTeamExists(teamName)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_12 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_12, dispatch, getState);
                    dispatch(errors_1.logError(error_12));
                    return [2 /*return*/, { error: error_12 }];
                case 3: return [2 /*return*/, { data: data.exists }];
            }
        });
    }); };
}
exports.checkIfTeamExists = checkIfTeamExists;
function joinTeam(inviteId, teamId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, currentUserId, error_13;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.TeamTypes.JOIN_TEAM_REQUEST, data: null });
                    state = getState();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!general_1.isCompatibleWithJoinViewTeamPermissions(state)) return [3 /*break*/, 3];
                    currentUserId = state.entities.users.currentUserId;
                    return [4 /*yield*/, client_1.Client4.addToTeam(teamId, currentUserId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, client_1.Client4.joinTeam(inviteId)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_13 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_13, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.TeamTypes.JOIN_TEAM_FAILURE, error: error_13 },
                        errors_1.logError(error_13),
                    ]));
                    return [2 /*return*/, { error: error_13 }];
                case 7:
                    getMyTeamUnreads()(dispatch, getState);
                    return [4 /*yield*/, Promise.all([
                            getTeam(teamId)(dispatch, getState),
                            getMyTeamMembers()(dispatch, getState),
                        ])];
                case 8:
                    _a.sent();
                    dispatch({ type: action_types_1.TeamTypes.JOIN_TEAM_SUCCESS, data: null });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.joinTeam = joinTeam;
function setTeamIcon(teamId, imageData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.setTeamIcon,
        params: [
            teamId,
            imageData,
        ],
    });
}
exports.setTeamIcon = setTeamIcon;
function removeTeamIcon(teamId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.removeTeamIcon,
        params: [
            teamId,
        ],
    });
}
exports.removeTeamIcon = removeTeamIcon;
function updateTeamScheme(teamId, schemeId) {
    var _this = this;
    return helpers_1.bindClientFunc({
        clientFunc: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.updateTeamScheme(teamId, schemeId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { teamId: teamId, schemeId: schemeId }];
                }
            });
        }); },
        onSuccess: action_types_1.TeamTypes.UPDATED_TEAM_SCHEME,
    });
}
exports.updateTeamScheme = updateTeamScheme;
function updateTeamMemberSchemeRoles(teamId, userId, isSchemeUser, isSchemeAdmin) {
    var _this = this;
    return helpers_1.bindClientFunc({
        clientFunc: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.Client4.updateTeamMemberSchemeRoles(teamId, userId, isSchemeUser, isSchemeAdmin)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { teamId: teamId, userId: userId, isSchemeUser: isSchemeUser, isSchemeAdmin: isSchemeAdmin }];
                }
            });
        }); },
        onSuccess: action_types_1.TeamTypes.UPDATED_TEAM_MEMBER_SCHEME_ROLES,
    });
}
exports.updateTeamMemberSchemeRoles = updateTeamMemberSchemeRoles;
function invalidateAllEmailInvites() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.invalidateAllEmailInvites,
    });
}
exports.invalidateAllEmailInvites = invalidateAllEmailInvites;
function membersMinusGroupMembers(teamID, groupIDs, page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.teamMembersMinusGroupMembers,
        onSuccess: action_types_1.TeamTypes.RECEIVED_TEAM_MEMBERS_MINUS_GROUP_MEMBERS,
        params: [
            teamID,
            groupIDs,
            page,
            perPage,
        ],
    });
}
exports.membersMinusGroupMembers = membersMinusGroupMembers;
function getInProductNotices(teamId, client, clientVersion) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getInProductNotices,
        params: [
            teamId,
            client,
            clientVersion,
        ],
    });
}
exports.getInProductNotices = getInProductNotices;
function updateNoticesAsViewed(noticeIds) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.updateNoticesAsViewed,
        params: [
            noticeIds,
        ],
    });
}
exports.updateNoticesAsViewed = updateNoticesAsViewed;
//# sourceMappingURL=teams.js.map