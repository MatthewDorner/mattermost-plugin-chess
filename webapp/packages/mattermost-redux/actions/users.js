"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoles = exports.patchUser = exports.updateMe = exports.stopPeriodicStatusUpdates = exports.startPeriodicStatusUpdates = exports.searchProfiles = exports.autocompleteUsers = exports.getUserAudits = exports.loadProfilesForDirect = exports.revokeSessionsForAllUsers = exports.revokeAllSessionsForUser = exports.revokeSession = exports.getSessions = exports.removeRecentCustomStatus = exports.unsetCustomStatus = exports.setCustomStatus = exports.setStatus = exports.getStatus = exports.getStatusesByIds = exports.getStatusesByIdsBatchedDebounced = exports.getUserByEmail = exports.getUserByUsername = exports.getUser = exports.createTermsOfService = exports.demoteUserToGuest = exports.promoteGuestToUser = exports.getTermsOfService = exports.getProfilesInGroup = exports.updateMyTermsOfServiceStatus = exports.getMe = exports.getProfilesNotInChannel = exports.getProfilesInGroupChannels = exports.getProfilesInChannel = exports.getProfilesWithoutTeam = exports.getProfilesNotInTeam = exports.getProfilesInTeam = exports.getProfilesByUsernames = exports.getProfilesByIds = exports.getMissingProfilesByUsernames = exports.getMissingProfilesByIds = exports.getProfiles = exports.getFilteredUsersStats = exports.getTotalUsersStats = exports.logout = exports.loadMe = exports.loginById = exports.login = exports.createUser = exports.generateMfaSecret = exports.checkMfa = void 0;
exports.checkForModifiedUsers = exports.clearUserAccessTokens = exports.getKnownUsers = exports.enableUserAccessToken = exports.disableUserAccessToken = exports.revokeUserAccessToken = exports.getUserAccessTokensForUser = exports.getUserAccessTokens = exports.getUserAccessToken = exports.createUserAccessToken = exports.switchLdapToEmail = exports.switchEmailToLdap = exports.switchOAuthToEmail = exports.switchEmailToOAuth = exports.uploadProfileImage = exports.setDefaultProfileImage = exports.sendPasswordResetEmail = exports.resetUserPassword = exports.sendVerificationEmail = exports.verifyUserEmail = exports.updateUserActive = exports.updateUserPassword = exports.updateUserMfa = void 0;
var tslib_1 = require("tslib");
var actions_1 = require("../types/actions");
var client_1 = require("../client");
var constants_1 = require("../constants");
var action_types_1 = require("../action_types");
var emojis_1 = require("./emojis");
var general_1 = require("./general");
var teams_1 = require("./teams");
var roles_1 = require("./roles");
var channel_utils_1 = require("../utils/channel_utils");
var user_utils_1 = require("../utils/user_utils");
var helpers_1 = require("../utils/helpers");
var general_2 = require("../selectors/entities/general");
var users_1 = require("../selectors/entities/users");
var errors_1 = require("./errors");
var helpers_2 = require("./helpers");
var preferences_1 = require("./preferences");
function checkMfa(loginId) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.UserTypes.CHECK_MFA_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.checkUserMfa(loginId)];
                case 2:
                    data = _a.sent();
                    dispatch({ type: action_types_1.UserTypes.CHECK_MFA_SUCCESS, data: null });
                    return [2 /*return*/, { data: data.mfa_required }];
                case 3:
                    error_1 = _a.sent();
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.UserTypes.CHECK_MFA_FAILURE, error: error_1 },
                        errors_1.logError(error_1),
                    ]));
                    return [2 /*return*/, { error: error_1 }];
                case 4: return [2 /*return*/];
            }
        });
    }); };
}
exports.checkMfa = checkMfa;
function generateMfaSecret(userId) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.generateMfaSecret,
        params: [
            userId,
        ],
    });
}
exports.generateMfaSecret = generateMfaSecret;
function createUser(user, token, inviteId, redirect) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var created, error_2, profiles;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.createUser(user, token, inviteId, redirect)];
                case 1:
                    created = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    helpers_2.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(errors_1.logError(error_2));
                    return [2 /*return*/, { error: error_2 }];
                case 3:
                    profiles = (_a = {},
                        _a[created.id] = created,
                        _a);
                    dispatch({ type: action_types_1.UserTypes.RECEIVED_PROFILES, data: profiles });
                    return [2 /*return*/, { data: created }];
            }
        });
    }); };
}
exports.createUser = createUser;
function login(loginId, password, mfaToken, ldapOnly) {
    var _this = this;
    if (mfaToken === void 0) { mfaToken = ''; }
    if (ldapOnly === void 0) { ldapOnly = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var deviceId, data, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.UserTypes.LOGIN_REQUEST, data: null });
                    deviceId = getState().entities.general.deviceToken;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.login(loginId, password, mfaToken, deviceId, ldapOnly)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.LOGIN_FAILURE,
                            error: error_3,
                        },
                        errors_1.logError(error_3),
                    ]));
                    return [2 /*return*/, { error: error_3 }];
                case 4: return [2 /*return*/, completeLogin(data)(dispatch, getState)];
            }
        });
    }); };
}
exports.login = login;
function loginById(id, password, mfaToken) {
    var _this = this;
    if (mfaToken === void 0) { mfaToken = ''; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var deviceId, data, error_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.UserTypes.LOGIN_REQUEST, data: null });
                    deviceId = getState().entities.general.deviceToken;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.loginById(id, password, mfaToken, deviceId)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.LOGIN_FAILURE,
                            error: error_4,
                        },
                        errors_1.logError(error_4),
                    ]));
                    return [2 /*return*/, { error: error_4 }];
                case 4: return [2 /*return*/, completeLogin(data)(dispatch, getState)];
            }
        });
    }); };
}
exports.loginById = loginById;
function completeLogin(data) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var teamMembers, membersRequest, unreadsRequest, teamUnreads, _loop_1, teamUnreads_1, teamUnreads_1_1, u, error_5, promises, serverVersion, error_6, roles, _a, _b, role, teamMembers_1, teamMembers_1_1, teamMember, _c, _d, role;
        var e_1, _e, e_2, _f, e_3, _g, e_4, _h;
        return tslib_1.__generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    dispatch({
                        type: action_types_1.UserTypes.RECEIVED_ME,
                        data: data,
                    });
                    client_1.Client4.setUserId(data.id);
                    client_1.Client4.setUserRoles(data.roles);
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 4, , 5]);
                    membersRequest = client_1.Client4.getMyTeamMembers();
                    unreadsRequest = client_1.Client4.getMyTeamUnreads();
                    return [4 /*yield*/, membersRequest];
                case 2:
                    teamMembers = _j.sent();
                    return [4 /*yield*/, unreadsRequest];
                case 3:
                    teamUnreads = _j.sent();
                    if (teamUnreads) {
                        _loop_1 = function (u) {
                            var index = teamMembers.findIndex(function (m) { return m.team_id === u.team_id; });
                            var member = teamMembers[index];
                            member.mention_count = u.mention_count;
                            member.msg_count = u.msg_count;
                        };
                        try {
                            for (teamUnreads_1 = tslib_1.__values(teamUnreads), teamUnreads_1_1 = teamUnreads_1.next(); !teamUnreads_1_1.done; teamUnreads_1_1 = teamUnreads_1.next()) {
                                u = teamUnreads_1_1.value;
                                _loop_1(u);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (teamUnreads_1_1 && !teamUnreads_1_1.done && (_e = teamUnreads_1.return)) _e.call(teamUnreads_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _j.sent();
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.UserTypes.LOGIN_FAILURE, error: error_5 },
                        errors_1.logError(error_5),
                    ]));
                    return [2 /*return*/, { error: error_5 }];
                case 5:
                    promises = [
                        dispatch(preferences_1.getMyPreferences()),
                        dispatch(teams_1.getMyTeams()),
                        dispatch(general_1.getClientConfig()),
                    ];
                    serverVersion = client_1.Client4.getServerVersion();
                    dispatch(general_1.setServerVersion(serverVersion));
                    if (!helpers_1.isMinimumServerVersion(serverVersion, 4, 7) && general_2.getConfig(getState()).EnableCustomEmoji === 'true') {
                        dispatch(emojis_1.getAllCustomEmojis());
                    }
                    _j.label = 6;
                case 6:
                    _j.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, Promise.all(promises)];
                case 7:
                    _j.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_6 = _j.sent();
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.UserTypes.LOGIN_FAILURE, error: error_6 },
                        errors_1.logError(error_6),
                    ]));
                    return [2 /*return*/, { error: error_6 }];
                case 9:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.TeamTypes.RECEIVED_MY_TEAM_MEMBERS,
                            data: teamMembers,
                        },
                        {
                            type: action_types_1.UserTypes.LOGIN_SUCCESS,
                        },
                    ]));
                    roles = new Set();
                    try {
                        for (_a = tslib_1.__values(data.roles.split(' ')), _b = _a.next(); !_b.done; _b = _a.next()) {
                            role = _b.value;
                            roles.add(role);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    try {
                        for (teamMembers_1 = tslib_1.__values(teamMembers), teamMembers_1_1 = teamMembers_1.next(); !teamMembers_1_1.done; teamMembers_1_1 = teamMembers_1.next()) {
                            teamMember = teamMembers_1_1.value;
                            try {
                                for (_c = (e_4 = void 0, tslib_1.__values(teamMember.roles.split(' '))), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    role = _d.value;
                                    roles.add(role);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (teamMembers_1_1 && !teamMembers_1_1.done && (_g = teamMembers_1.return)) _g.call(teamMembers_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    if (roles.size > 0) {
                        dispatch(roles_1.loadRolesIfNeeded(roles));
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
function loadMe() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, config, deviceId, promises, serverVersion, currentUserId, user;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    config = general_2.getConfig(state);
                    deviceId = state.entities.general.deviceToken;
                    if (deviceId) {
                        client_1.Client4.attachDevice(deviceId);
                    }
                    promises = [
                        dispatch(getMe()),
                        dispatch(preferences_1.getMyPreferences()),
                        dispatch(teams_1.getMyTeams()),
                        dispatch(teams_1.getMyTeamMembers()),
                        dispatch(teams_1.getMyTeamUnreads()),
                    ];
                    serverVersion = client_1.Client4.getServerVersion() || getState().entities.general.serverVersion;
                    dispatch(general_1.setServerVersion(serverVersion));
                    if (!helpers_1.isMinimumServerVersion(serverVersion, 4, 7) && config.EnableCustomEmoji === 'true') {
                        dispatch(emojis_1.getAllCustomEmojis());
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    currentUserId = getState().entities.users.currentUserId;
                    user = getState().entities.users.profiles[currentUserId];
                    if (currentUserId) {
                        client_1.Client4.setUserId(currentUserId);
                    }
                    if (user) {
                        client_1.Client4.setUserRoles(user.roles);
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.loadMe = loadMe;
function logout() {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.UserTypes.LOGOUT_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.logout()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    dispatch({ type: action_types_1.UserTypes.LOGOUT_SUCCESS, data: null });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.logout = logout;
function getTotalUsersStats() {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getTotalUsersStats,
        onSuccess: action_types_1.UserTypes.RECEIVED_USER_STATS,
    });
}
exports.getTotalUsersStats = getTotalUsersStats;
function getFilteredUsersStats(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var stats, error_8;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getFilteredUsersStats(options)];
                case 1:
                    stats = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_8, dispatch, getState);
                    dispatch(errors_1.logError(error_8));
                    return [2 /*return*/, { error: error_8 }];
                case 3:
                    dispatch({
                        type: action_types_1.UserTypes.RECEIVED_FILTERED_USER_STATS,
                        data: stats,
                    });
                    return [2 /*return*/, { data: stats }];
            }
        });
    }); };
}
exports.getFilteredUsersStats = getFilteredUsersStats;
function getProfiles(page, perPage, options) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    if (options === void 0) { options = {}; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, profiles, error_9;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfiles(page, perPage, options)];
                case 2:
                    profiles = _a.sent();
                    user_utils_1.removeUserFromList(currentUserId, profiles);
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_9, dispatch, getState);
                    dispatch(errors_1.logError(error_9));
                    return [2 /*return*/, { error: error_9 }];
                case 4:
                    dispatch({
                        type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                        data: profiles,
                    });
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfiles = getProfiles;
function getMissingProfilesByIds(userIds) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var profiles, missingIds;
        return tslib_1.__generator(this, function (_a) {
            profiles = getState().entities.users.profiles;
            missingIds = [];
            userIds.forEach(function (id) {
                if (!profiles[id]) {
                    missingIds.push(id);
                }
            });
            if (missingIds.length > 0) {
                getStatusesByIds(missingIds)(dispatch, getState);
                return [2 /*return*/, getProfilesByIds(missingIds)(dispatch, getState)];
            }
            return [2 /*return*/, { data: [] }];
        });
    }); };
}
exports.getMissingProfilesByIds = getMissingProfilesByIds;
function getMissingProfilesByUsernames(usernames) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var profiles, usernameProfiles, missingUsernames;
        return tslib_1.__generator(this, function (_a) {
            profiles = getState().entities.users.profiles;
            usernameProfiles = Object.values(profiles).reduce(function (acc, profile) {
                acc[profile.username] = profile;
                return acc;
            }, {});
            missingUsernames = [];
            usernames.forEach(function (username) {
                if (!usernameProfiles[username]) {
                    missingUsernames.push(username);
                }
            });
            if (missingUsernames.length > 0) {
                return [2 /*return*/, getProfilesByUsernames(missingUsernames)(dispatch, getState)];
            }
            return [2 /*return*/, { data: [] }];
        });
    }); };
}
exports.getMissingProfilesByUsernames = getMissingProfilesByUsernames;
function getProfilesByIds(userIds, options) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, profiles, error_10;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfilesByIds(userIds, options)];
                case 2:
                    profiles = _a.sent();
                    user_utils_1.removeUserFromList(currentUserId, profiles);
                    return [3 /*break*/, 4];
                case 3:
                    error_10 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_10, dispatch, getState);
                    dispatch(errors_1.logError(error_10));
                    return [2 /*return*/, { error: error_10 }];
                case 4:
                    dispatch({
                        type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                        data: profiles,
                    });
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfilesByIds = getProfilesByIds;
function getProfilesByUsernames(usernames) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, profiles, error_11;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfilesByUsernames(usernames)];
                case 2:
                    profiles = _a.sent();
                    user_utils_1.removeUserFromList(currentUserId, profiles);
                    return [3 /*break*/, 4];
                case 3:
                    error_11 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_11, dispatch, getState);
                    dispatch(errors_1.logError(error_11));
                    return [2 /*return*/, { error: error_11 }];
                case 4:
                    dispatch({
                        type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                        data: profiles,
                    });
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfilesByUsernames = getProfilesByUsernames;
function getProfilesInTeam(teamId, page, perPage, sort, options) {
    var _this = this;
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    if (sort === void 0) { sort = ''; }
    if (options === void 0) { options = {}; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, profiles, error_12;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfilesInTeam(teamId, page, perPage, sort, options)];
                case 2:
                    profiles = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_12 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_12, dispatch, getState);
                    dispatch(errors_1.logError(error_12));
                    return [2 /*return*/, { error: error_12 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_TEAM,
                            data: profiles,
                            id: teamId,
                        },
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                            data: user_utils_1.removeUserFromList(currentUserId, tslib_1.__spread(profiles)),
                        },
                    ]));
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfilesInTeam = getProfilesInTeam;
function getProfilesNotInTeam(teamId, groupConstrained, page, perPage) {
    var _this = this;
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var profiles, error_13, receivedProfilesListActionType;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getProfilesNotInTeam(teamId, groupConstrained, page, perPage)];
                case 1:
                    profiles = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_13, dispatch, getState);
                    dispatch(errors_1.logError(error_13));
                    return [2 /*return*/, { error: error_13 }];
                case 3:
                    receivedProfilesListActionType = groupConstrained ?
                        action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_TEAM_AND_REPLACE :
                        action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_TEAM;
                    dispatch(actions_1.batchActions([
                        {
                            type: receivedProfilesListActionType,
                            data: profiles,
                            id: teamId,
                        },
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                            data: profiles,
                        },
                    ]));
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfilesNotInTeam = getProfilesNotInTeam;
function getProfilesWithoutTeam(page, perPage, options) {
    var _this = this;
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    if (options === void 0) { options = {}; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var profiles, error_14;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profiles = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfilesWithoutTeam(page, perPage, options)];
                case 2:
                    profiles = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_14 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_14, dispatch, getState);
                    dispatch(errors_1.logError(error_14));
                    return [2 /*return*/, { error: error_14 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_WITHOUT_TEAM,
                            data: profiles,
                        },
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                            data: profiles,
                        },
                    ]));
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfilesWithoutTeam = getProfilesWithoutTeam;
function getProfilesInChannel(channelId, page, perPage, sort, options) {
    var _this = this;
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    if (sort === void 0) { sort = ''; }
    if (options === void 0) { options = {}; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, profiles, error_15;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfilesInChannel(channelId, page, perPage, sort, options)];
                case 2:
                    profiles = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_15 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_15, dispatch, getState);
                    dispatch(errors_1.logError(error_15));
                    return [2 /*return*/, { error: error_15 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_CHANNEL,
                            data: profiles,
                            id: channelId,
                        },
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                            data: user_utils_1.removeUserFromList(currentUserId, tslib_1.__spread(profiles)),
                        },
                    ]));
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfilesInChannel = getProfilesInChannel;
function getProfilesInGroupChannels(channelsIds) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, channelProfiles, error_16, actions, channelId, profiles;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfilesInGroupChannels(channelsIds.slice(0, constants_1.General.MAX_GROUP_CHANNELS_FOR_PROFILES))];
                case 2:
                    channelProfiles = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_16 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_16, dispatch, getState);
                    dispatch(errors_1.logError(error_16));
                    return [2 /*return*/, { error: error_16 }];
                case 4:
                    actions = [];
                    for (channelId in channelProfiles) {
                        if (channelProfiles.hasOwnProperty(channelId)) {
                            profiles = channelProfiles[channelId];
                            actions.push({
                                type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_CHANNEL,
                                data: profiles,
                                id: channelId,
                            }, {
                                type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                                data: user_utils_1.removeUserFromList(currentUserId, tslib_1.__spread(profiles)),
                            });
                        }
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: channelProfiles }];
            }
        });
    }); };
}
exports.getProfilesInGroupChannels = getProfilesInGroupChannels;
function getProfilesNotInChannel(teamId, channelId, groupConstrained, page, perPage) {
    var _this = this;
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, profiles, error_17, receivedProfilesListActionType;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfilesNotInChannel(teamId, channelId, groupConstrained, page, perPage)];
                case 2:
                    profiles = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_17 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_17, dispatch, getState);
                    dispatch(errors_1.logError(error_17));
                    return [2 /*return*/, { error: error_17 }];
                case 4:
                    receivedProfilesListActionType = groupConstrained ?
                        action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_CHANNEL_AND_REPLACE :
                        action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_CHANNEL;
                    dispatch(actions_1.batchActions([
                        {
                            type: receivedProfilesListActionType,
                            data: profiles,
                            id: channelId,
                        },
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                            data: user_utils_1.removeUserFromList(currentUserId, tslib_1.__spread(profiles)),
                        },
                    ]));
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfilesNotInChannel = getProfilesNotInChannel;
function getMe() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var getMeFunc, me;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getMeFunc = helpers_2.bindClientFunc({
                        clientFunc: client_1.Client4.getMe,
                        onSuccess: action_types_1.UserTypes.RECEIVED_ME,
                    });
                    return [4 /*yield*/, getMeFunc(dispatch, getState)];
                case 1:
                    me = _a.sent();
                    if ('error' in me) {
                        return [2 /*return*/, me];
                    }
                    if ('data' in me) {
                        dispatch(roles_1.loadRolesIfNeeded(me.data.roles.split(' ')));
                    }
                    return [2 /*return*/, me];
            }
        });
    }); };
}
exports.getMe = getMe;
function updateMyTermsOfServiceStatus(termsOfServiceId, accepted) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var response;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dispatch(helpers_2.bindClientFunc({
                        clientFunc: client_1.Client4.updateMyTermsOfServiceStatus,
                        params: [
                            termsOfServiceId,
                            accepted,
                        ],
                    }))];
                case 1:
                    response = _a.sent();
                    if ('data' in response) {
                        if (accepted) {
                            dispatch({
                                type: action_types_1.UserTypes.RECEIVED_TERMS_OF_SERVICE_STATUS,
                                data: {
                                    terms_of_service_create_at: new Date().getTime(),
                                    terms_of_service_id: accepted ? termsOfServiceId : null,
                                    user_id: users_1.getCurrentUserId(getState()),
                                },
                            });
                        }
                        return [2 /*return*/, {
                                data: response.data,
                            }];
                    }
                    return [2 /*return*/, {
                            error: response.error,
                        }];
            }
        });
    }); };
}
exports.updateMyTermsOfServiceStatus = updateMyTermsOfServiceStatus;
function getProfilesInGroup(groupId, page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, profiles, error_18;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getProfilesInGroup(groupId, page, perPage)];
                case 2:
                    profiles = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_18 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_18, dispatch, getState);
                    dispatch(errors_1.logError(error_18));
                    return [2 /*return*/, { error: error_18 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_GROUP,
                            data: profiles,
                            id: groupId,
                        },
                        {
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                            data: user_utils_1.removeUserFromList(currentUserId, tslib_1.__spread(profiles)),
                        },
                    ]));
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.getProfilesInGroup = getProfilesInGroup;
function getTermsOfService() {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getTermsOfService,
    });
}
exports.getTermsOfService = getTermsOfService;
function promoteGuestToUser(userId) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.promoteGuestToUser,
        params: [userId],
    });
}
exports.promoteGuestToUser = promoteGuestToUser;
function demoteUserToGuest(userId) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.demoteUserToGuest,
        params: [userId],
    });
}
exports.demoteUserToGuest = demoteUserToGuest;
function createTermsOfService(text) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.createTermsOfService,
        params: [
            text,
        ],
    });
}
exports.createTermsOfService = createTermsOfService;
function getUser(id) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getUser,
        onSuccess: action_types_1.UserTypes.RECEIVED_PROFILE,
        params: [
            id,
        ],
    });
}
exports.getUser = getUser;
function getUserByUsername(username) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getUserByUsername,
        onSuccess: action_types_1.UserTypes.RECEIVED_PROFILE,
        params: [
            username,
        ],
    });
}
exports.getUserByUsername = getUserByUsername;
function getUserByEmail(email) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getUserByEmail,
        onSuccess: action_types_1.UserTypes.RECEIVED_PROFILE,
        params: [
            email,
        ],
    });
}
exports.getUserByEmail = getUserByEmail;
// We create an array to hold the id's that we want to get a status for. We build our
// debounced function that will get called after a set period of idle time in which
// the array of id's will be passed to the getStatusesByIds with a cb that clears out
// the array. Helps with performance because instead of making 75 different calls for
// statuses, we are only making one call for 75 ids.
// We could maybe clean it up somewhat by storing the array of ids in redux state possbily?
var ids = [];
var debouncedGetStatusesByIds = helpers_2.debounce(function (dispatch, getState) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        getStatusesByIds(tslib_1.__spread(new Set(ids)))(dispatch, getState);
        return [2 /*return*/];
    });
}); }, 20, false, function () {
    ids = [];
});
function getStatusesByIdsBatchedDebounced(id) {
    ids = tslib_1.__spread(ids, [id]);
    return debouncedGetStatusesByIds;
}
exports.getStatusesByIdsBatchedDebounced = getStatusesByIdsBatchedDebounced;
function getStatusesByIds(userIds) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getStatusesByIds,
        onSuccess: action_types_1.UserTypes.RECEIVED_STATUSES,
        params: [
            userIds,
        ],
    });
}
exports.getStatusesByIds = getStatusesByIds;
function getStatus(userId) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getStatus,
        onSuccess: action_types_1.UserTypes.RECEIVED_STATUS,
        params: [
            userId,
        ],
    });
}
exports.getStatus = getStatus;
function setStatus(status) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_19;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateStatus(status)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_19 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_19, dispatch, getState);
                    dispatch(errors_1.logError(error_19));
                    return [2 /*return*/, { error: error_19 }];
                case 3:
                    dispatch({
                        type: action_types_1.UserTypes.RECEIVED_STATUS,
                        data: status,
                    });
                    return [2 /*return*/, { data: status }];
            }
        });
    }); };
}
exports.setStatus = setStatus;
function setCustomStatus(customStatus) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.updateCustomStatus,
        params: [
            customStatus,
        ],
    });
}
exports.setCustomStatus = setCustomStatus;
function unsetCustomStatus() {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.unsetCustomStatus,
    });
}
exports.unsetCustomStatus = unsetCustomStatus;
function removeRecentCustomStatus(customStatus) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.removeRecentCustomStatus,
        params: [
            customStatus,
        ],
    });
}
exports.removeRecentCustomStatus = removeRecentCustomStatus;
function getSessions(userId) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getSessions,
        onSuccess: action_types_1.UserTypes.RECEIVED_SESSIONS,
        params: [
            userId,
        ],
    });
}
exports.getSessions = getSessions;
function revokeSession(userId, sessionId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_20;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.revokeSession(userId, sessionId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_20 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_20, dispatch, getState);
                    dispatch(errors_1.logError(error_20));
                    return [2 /*return*/, { error: error_20 }];
                case 3:
                    dispatch({
                        type: action_types_1.UserTypes.RECEIVED_REVOKED_SESSION,
                        sessionId: sessionId,
                        data: null,
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.revokeSession = revokeSession;
function revokeAllSessionsForUser(userId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_21, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.revokeAllSessionsForUser(userId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_21 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_21, dispatch, getState);
                    dispatch(errors_1.logError(error_21));
                    return [2 /*return*/, { error: error_21 }];
                case 3:
                    data = { isCurrentUser: userId === users_1.getCurrentUserId(getState()) };
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.UserTypes.REVOKE_ALL_USER_SESSIONS_SUCCESS,
                            data: data,
                        },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.revokeAllSessionsForUser = revokeAllSessionsForUser;
function revokeSessionsForAllUsers() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_22;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.revokeSessionsForAllUsers()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_22 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_22, dispatch, getState);
                    dispatch(errors_1.logError(error_22));
                    return [2 /*return*/, { error: error_22 }];
                case 3:
                    dispatch({
                        type: action_types_1.UserTypes.REVOKE_SESSIONS_FOR_ALL_USERS_SUCCESS,
                        data: null,
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.revokeSessionsForAllUsers = revokeSessionsForAllUsers;
function loadProfilesForDirect() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, config, _a, channels, myMembers, myPreferences, _b, currentUserId, profiles, values, i, channel, member, otherUserId;
        return tslib_1.__generator(this, function (_c) {
            state = getState();
            config = state.entities.general.config;
            _a = state.entities.channels, channels = _a.channels, myMembers = _a.myMembers;
            myPreferences = state.entities.preferences.myPreferences;
            _b = state.entities.users, currentUserId = _b.currentUserId, profiles = _b.profiles;
            values = Object.values(channels);
            for (i = 0; i < values.length; i++) {
                channel = values[i];
                member = myMembers[channel.id];
                if (!channel_utils_1.isDirectChannel(channel) && !channel_utils_1.isGroupChannel(channel)) {
                    continue;
                }
                if (member) {
                    if (member.mention_count > 0 && channel_utils_1.isDirectChannel(channel)) {
                        otherUserId = channel_utils_1.getUserIdFromChannelName(currentUserId, channel.name);
                        if (!channel_utils_1.isDirectChannelVisible(profiles[otherUserId] || otherUserId, config, myPreferences, channel)) {
                            preferences_1.makeDirectChannelVisibleIfNecessary(otherUserId)(dispatch, getState);
                        }
                    }
                    else if ((member.mention_count > 0 || member.msg_count < channel.total_msg_count) &&
                        channel_utils_1.isGroupChannel(channel) && !channel_utils_1.isGroupChannelVisible(config, myPreferences, channel)) {
                        preferences_1.makeGroupMessageVisibleIfNecessary(channel.id)(dispatch, getState);
                    }
                }
            }
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.loadProfilesForDirect = loadProfilesForDirect;
function getUserAudits(userId, page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.AUDITS_CHUNK_SIZE; }
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getUserAudits,
        onSuccess: action_types_1.UserTypes.RECEIVED_AUDITS,
        params: [
            userId,
            page,
            perPage,
        ],
    });
}
exports.getUserAudits = getUserAudits;
function autocompleteUsers(term, teamId, channelId, options) {
    var _this = this;
    if (teamId === void 0) { teamId = ''; }
    if (channelId === void 0) { channelId = ''; }
    if (options === void 0) { options = {
        limit: constants_1.General.AUTOCOMPLETE_LIMIT_DEFAULT,
    }; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, data, error_23, users, actions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.UserTypes.AUTOCOMPLETE_USERS_REQUEST, data: null });
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.autocompleteUsers(term, teamId, channelId, options)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_23 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_23, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.UserTypes.AUTOCOMPLETE_USERS_FAILURE, error: error_23 },
                        errors_1.logError(error_23),
                    ]));
                    return [2 /*return*/, { error: error_23 }];
                case 4:
                    users = tslib_1.__spread(data.users);
                    if (data.out_of_channel) {
                        users = tslib_1.__spread(users, data.out_of_channel);
                    }
                    user_utils_1.removeUserFromList(currentUserId, users);
                    actions = [{
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                            data: users,
                        }, {
                            type: action_types_1.UserTypes.AUTOCOMPLETE_USERS_SUCCESS,
                        }];
                    if (channelId) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_CHANNEL,
                            data: data.users,
                            id: channelId,
                        });
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_CHANNEL,
                            data: data.out_of_channel,
                            id: channelId,
                        });
                    }
                    if (teamId) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_TEAM,
                            data: users,
                            id: teamId,
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.autocompleteUsers = autocompleteUsers;
function searchProfiles(term, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, profiles, error_24, actions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.searchUsers(term, options)];
                case 2:
                    profiles = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_24 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_24, dispatch, getState);
                    dispatch(errors_1.logError(error_24));
                    return [2 /*return*/, { error: error_24 }];
                case 4:
                    actions = [{ type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST, data: user_utils_1.removeUserFromList(currentUserId, tslib_1.__spread(profiles)) }];
                    if (options.in_channel_id) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_CHANNEL,
                            data: profiles,
                            id: options.in_channel_id,
                        });
                    }
                    if (options.not_in_channel_id) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_CHANNEL,
                            data: profiles,
                            id: options.not_in_channel_id,
                        });
                    }
                    if (options.team_id) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_TEAM,
                            data: profiles,
                            id: options.team_id,
                        });
                    }
                    if (options.not_in_team_id) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_TEAM,
                            data: profiles,
                            id: options.not_in_team_id,
                        });
                    }
                    if (options.in_group_id) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_GROUP,
                            data: profiles,
                            id: options.in_group_id,
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: profiles }];
            }
        });
    }); };
}
exports.searchProfiles = searchProfiles;
var statusIntervalId;
function startPeriodicStatusUpdates() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            if (statusIntervalId) {
                clearInterval(statusIntervalId);
            }
            statusIntervalId = setInterval(function () {
                var statuses = getState().entities.users.statuses;
                if (!statuses) {
                    return;
                }
                var userIds = Object.keys(statuses);
                if (!userIds.length) {
                    return;
                }
                getStatusesByIds(userIds)(dispatch, getState);
            }, constants_1.General.STATUS_INTERVAL);
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.startPeriodicStatusUpdates = startPeriodicStatusUpdates;
function stopPeriodicStatusUpdates() {
    var _this = this;
    return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            if (statusIntervalId) {
                clearInterval(statusIntervalId);
            }
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.stopPeriodicStatusUpdates = stopPeriodicStatusUpdates;
function updateMe(user) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_25;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.UserTypes.UPDATE_ME_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.patchMe(user)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_25 = _a.sent();
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.UserTypes.UPDATE_ME_FAILURE, error: error_25 },
                        errors_1.logError(error_25),
                    ]));
                    return [2 /*return*/, { error: error_25 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.UserTypes.RECEIVED_ME, data: data },
                        { type: action_types_1.UserTypes.UPDATE_ME_SUCCESS },
                    ]));
                    dispatch(roles_1.loadRolesIfNeeded(data.roles.split(' ')));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.updateMe = updateMe;
function patchUser(user) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_26;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.patchUser(user)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_26 = _a.sent();
                    dispatch(errors_1.logError(error_26));
                    return [2 /*return*/, { error: error_26 }];
                case 3:
                    dispatch({ type: action_types_1.UserTypes.RECEIVED_PROFILE, data: data });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.patchUser = patchUser;
function updateUserRoles(userId, roles) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_27, profile;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateUserRoles(userId, roles)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_27 = _a.sent();
                    return [2 /*return*/, { error: error_27 }];
                case 3:
                    profile = getState().entities.users.profiles[userId];
                    if (profile) {
                        dispatch({ type: action_types_1.UserTypes.RECEIVED_PROFILE, data: tslib_1.__assign(tslib_1.__assign({}, profile), { roles: roles }) });
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.updateUserRoles = updateUserRoles;
function updateUserMfa(userId, activate, code) {
    var _this = this;
    if (code === void 0) { code = ''; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_28, profile;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateUserMfa(userId, activate, code)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_28 = _a.sent();
                    dispatch(errors_1.logError(error_28));
                    return [2 /*return*/, { error: error_28 }];
                case 3:
                    profile = getState().entities.users.profiles[userId];
                    if (profile) {
                        dispatch({ type: action_types_1.UserTypes.RECEIVED_PROFILE, data: tslib_1.__assign(tslib_1.__assign({}, profile), { mfa_active: activate }) });
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.updateUserMfa = updateUserMfa;
function updateUserPassword(userId, currentPassword, newPassword) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_29, profile;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateUserPassword(userId, currentPassword, newPassword)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_29 = _a.sent();
                    dispatch(errors_1.logError(error_29));
                    return [2 /*return*/, { error: error_29 }];
                case 3:
                    profile = getState().entities.users.profiles[userId];
                    if (profile) {
                        dispatch({ type: action_types_1.UserTypes.RECEIVED_PROFILE, data: tslib_1.__assign(tslib_1.__assign({}, profile), { last_password_update_at: new Date().getTime() }) });
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.updateUserPassword = updateUserPassword;
function updateUserActive(userId, active) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_30, profile, deleteAt;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateUserActive(userId, active)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_30 = _a.sent();
                    dispatch(errors_1.logError(error_30));
                    return [2 /*return*/, { error: error_30 }];
                case 3:
                    profile = getState().entities.users.profiles[userId];
                    if (profile) {
                        deleteAt = active ? 0 : new Date().getTime();
                        dispatch({ type: action_types_1.UserTypes.RECEIVED_PROFILE, data: tslib_1.__assign(tslib_1.__assign({}, profile), { delete_at: deleteAt }) });
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.updateUserActive = updateUserActive;
function verifyUserEmail(token) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.verifyUserEmail,
        params: [
            token,
        ],
    });
}
exports.verifyUserEmail = verifyUserEmail;
function sendVerificationEmail(email) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.sendVerificationEmail,
        params: [
            email,
        ],
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
function resetUserPassword(token, newPassword) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.resetUserPassword,
        params: [
            token,
            newPassword,
        ],
    });
}
exports.resetUserPassword = resetUserPassword;
function sendPasswordResetEmail(email) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.sendPasswordResetEmail,
        params: [
            email,
        ],
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
function setDefaultProfileImage(userId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_31, profile;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.setDefaultProfileImage(userId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_31 = _a.sent();
                    dispatch(errors_1.logError(error_31));
                    return [2 /*return*/, { error: error_31 }];
                case 3:
                    profile = getState().entities.users.profiles[userId];
                    if (profile) {
                        dispatch({ type: action_types_1.UserTypes.RECEIVED_PROFILE, data: tslib_1.__assign(tslib_1.__assign({}, profile), { last_picture_update: 0 }) });
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.setDefaultProfileImage = setDefaultProfileImage;
function uploadProfileImage(userId, imageData) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_32, profile;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.uploadProfileImage(userId, imageData)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_32 = _a.sent();
                    return [2 /*return*/, { error: error_32 }];
                case 3:
                    profile = getState().entities.users.profiles[userId];
                    if (profile) {
                        dispatch({ type: action_types_1.UserTypes.RECEIVED_PROFILE, data: tslib_1.__assign(tslib_1.__assign({}, profile), { last_picture_update: new Date().getTime() }) });
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.uploadProfileImage = uploadProfileImage;
function switchEmailToOAuth(service, email, password, mfaCode) {
    if (mfaCode === void 0) { mfaCode = ''; }
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.switchEmailToOAuth,
        params: [
            service,
            email,
            password,
            mfaCode,
        ],
    });
}
exports.switchEmailToOAuth = switchEmailToOAuth;
function switchOAuthToEmail(currentService, email, password) {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.switchOAuthToEmail,
        params: [
            currentService,
            email,
            password,
        ],
    });
}
exports.switchOAuthToEmail = switchOAuthToEmail;
function switchEmailToLdap(email, emailPassword, ldapId, ldapPassword, mfaCode) {
    if (mfaCode === void 0) { mfaCode = ''; }
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.switchEmailToLdap,
        params: [
            email,
            emailPassword,
            ldapId,
            ldapPassword,
            mfaCode,
        ],
    });
}
exports.switchEmailToLdap = switchEmailToLdap;
function switchLdapToEmail(ldapPassword, email, emailPassword, mfaCode) {
    if (mfaCode === void 0) { mfaCode = ''; }
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.switchLdapToEmail,
        params: [
            ldapPassword,
            email,
            emailPassword,
            mfaCode,
        ],
    });
}
exports.switchLdapToEmail = switchLdapToEmail;
function createUserAccessToken(userId, description) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_33, actions, currentUserId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.createUserAccessToken(userId, description)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_33 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_33, dispatch, getState);
                    dispatch(errors_1.logError(error_33));
                    return [2 /*return*/, { error: error_33 }];
                case 3:
                    actions = [{
                            type: action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKEN,
                            data: tslib_1.__assign(tslib_1.__assign({}, data), { token: '' }),
                        }];
                    currentUserId = getState().entities.users.currentUserId;
                    if (userId === currentUserId) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_MY_USER_ACCESS_TOKEN,
                            data: tslib_1.__assign(tslib_1.__assign({}, data), { token: '' }),
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.createUserAccessToken = createUserAccessToken;
function getUserAccessToken(tokenId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_34, actions, currentUserId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getUserAccessToken(tokenId)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_34 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_34, dispatch, getState);
                    dispatch(errors_1.logError(error_34));
                    return [2 /*return*/, { error: error_34 }];
                case 3:
                    actions = [{
                            type: action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKEN,
                            data: data,
                        }];
                    currentUserId = getState().entities.users.currentUserId;
                    if (data.user_id === currentUserId) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_MY_USER_ACCESS_TOKEN,
                            data: data,
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getUserAccessToken = getUserAccessToken;
function getUserAccessTokens(page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_35, actions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getUserAccessTokens(page, perPage)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_35 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_35, dispatch, getState);
                    dispatch(errors_1.logError(error_35));
                    return [2 /*return*/, { error: error_35 }];
                case 3:
                    actions = [
                        {
                            type: action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKENS,
                            data: data,
                        },
                    ];
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getUserAccessTokens = getUserAccessTokens;
function getUserAccessTokensForUser(userId, page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PROFILE_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_36, actions, currentUserId;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getUserAccessTokensForUser(userId, page, perPage)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_36 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_36, dispatch, getState);
                    dispatch(errors_1.logError(error_36));
                    return [2 /*return*/, { error: error_36 }];
                case 3:
                    actions = [{
                            type: action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKENS_FOR_USER,
                            data: data,
                            userId: userId,
                        }];
                    currentUserId = getState().entities.users.currentUserId;
                    if (userId === currentUserId) {
                        actions.push({
                            type: action_types_1.UserTypes.RECEIVED_MY_USER_ACCESS_TOKENS,
                            data: data,
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getUserAccessTokensForUser = getUserAccessTokensForUser;
function revokeUserAccessToken(tokenId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_37;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.revokeUserAccessToken(tokenId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_37 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_37, dispatch, getState);
                    dispatch(errors_1.logError(error_37));
                    return [2 /*return*/, { error: error_37 }];
                case 3:
                    dispatch({
                        type: action_types_1.UserTypes.REVOKED_USER_ACCESS_TOKEN,
                        data: tokenId,
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.revokeUserAccessToken = revokeUserAccessToken;
function disableUserAccessToken(tokenId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_38;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.disableUserAccessToken(tokenId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_38 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_38, dispatch, getState);
                    dispatch(errors_1.logError(error_38));
                    return [2 /*return*/, { error: error_38 }];
                case 3:
                    dispatch({
                        type: action_types_1.UserTypes.DISABLED_USER_ACCESS_TOKEN,
                        data: tokenId,
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.disableUserAccessToken = disableUserAccessToken;
function enableUserAccessToken(tokenId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_39;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.enableUserAccessToken(tokenId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_39 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_39, dispatch, getState);
                    dispatch(errors_1.logError(error_39));
                    return [2 /*return*/, { error: error_39 }];
                case 3:
                    dispatch({
                        type: action_types_1.UserTypes.ENABLED_USER_ACCESS_TOKEN,
                        data: tokenId,
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.enableUserAccessToken = enableUserAccessToken;
function getKnownUsers() {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getKnownUsers,
    });
}
exports.getKnownUsers = getKnownUsers;
function clearUserAccessTokens() {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({ type: action_types_1.UserTypes.CLEAR_MY_USER_ACCESS_TOKENS, data: null });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.clearUserAccessTokens = clearUserAccessTokens;
function checkForModifiedUsers() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, users, lastDisconnectAt, serverVersion;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    users = users_1.getUsers(state);
                    lastDisconnectAt = state.websocket.lastDisconnectAt;
                    serverVersion = general_2.getServerVersion(state);
                    if (!helpers_1.isMinimumServerVersion(serverVersion, 5, 14)) {
                        return [2 /*return*/, { data: true }];
                    }
                    return [4 /*yield*/, dispatch(getProfilesByIds(Object.keys(users), { since: lastDisconnectAt }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.checkForModifiedUsers = checkForModifiedUsers;
exports.default = {
    checkMfa: checkMfa,
    generateMfaSecret: generateMfaSecret,
    login: login,
    logout: logout,
    getProfiles: getProfiles,
    getProfilesByIds: getProfilesByIds,
    getProfilesInTeam: getProfilesInTeam,
    getProfilesInChannel: getProfilesInChannel,
    getProfilesNotInChannel: getProfilesNotInChannel,
    getUser: getUser,
    getMe: getMe,
    getUserByUsername: getUserByUsername,
    getStatus: getStatus,
    getStatusesByIds: getStatusesByIds,
    getSessions: getSessions,
    getTotalUsersStats: getTotalUsersStats,
    loadProfilesForDirect: loadProfilesForDirect,
    revokeSession: revokeSession,
    revokeAllSessionsForUser: revokeAllSessionsForUser,
    revokeSessionsForAllUsers: revokeSessionsForAllUsers,
    getUserAudits: getUserAudits,
    searchProfiles: searchProfiles,
    startPeriodicStatusUpdates: startPeriodicStatusUpdates,
    stopPeriodicStatusUpdates: stopPeriodicStatusUpdates,
    updateMe: updateMe,
    updateUserRoles: updateUserRoles,
    updateUserMfa: updateUserMfa,
    updateUserPassword: updateUserPassword,
    updateUserActive: updateUserActive,
    verifyUserEmail: verifyUserEmail,
    sendVerificationEmail: sendVerificationEmail,
    resetUserPassword: resetUserPassword,
    sendPasswordResetEmail: sendPasswordResetEmail,
    uploadProfileImage: uploadProfileImage,
    switchEmailToOAuth: switchEmailToOAuth,
    switchOAuthToEmail: switchOAuthToEmail,
    switchEmailToLdap: switchEmailToLdap,
    switchLdapToEmail: switchLdapToEmail,
    getTermsOfService: getTermsOfService,
    createTermsOfService: createTermsOfService,
    updateMyTermsOfServiceStatus: updateMyTermsOfServiceStatus,
    createUserAccessToken: createUserAccessToken,
    getUserAccessToken: getUserAccessToken,
    getUserAccessTokensForUser: getUserAccessTokensForUser,
    revokeUserAccessToken: revokeUserAccessToken,
    disableUserAccessToken: disableUserAccessToken,
    enableUserAccessToken: enableUserAccessToken,
    checkForModifiedUsers: checkForModifiedUsers,
};
//# sourceMappingURL=users.js.map