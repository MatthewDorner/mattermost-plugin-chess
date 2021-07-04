"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitInteractiveDialog = exports.regenOAuthAppSecret = exports.deleteOAuthApp = exports.deauthorizeOAuthApp = exports.getAuthorizedOAuthApps = exports.getOAuthApp = exports.getOAuthApps = exports.editOAuthApp = exports.addOAuthApp = exports.deleteCommand = exports.regenCommandToken = exports.executeCommand = exports.editCommand = exports.addCommand = exports.getCustomTeamCommands = exports.getAutocompleteCommands = exports.getCommands = exports.regenOutgoingHookToken = exports.updateOutgoingHook = exports.removeOutgoingHook = exports.getOutgoingHooks = exports.getOutgoingHook = exports.createOutgoingHook = exports.updateIncomingHook = exports.removeIncomingHook = exports.getIncomingHooks = exports.getIncomingHook = exports.createIncomingHook = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var action_types_1 = require("../action_types");
var constants_1 = require("../constants");
var client_1 = require("../client");
var users_1 = require("../selectors/entities/users");
var channels_1 = require("../selectors/entities/channels");
var teams_1 = require("../selectors/entities/teams");
var actions_1 = require("../types/actions");
var errors_1 = require("./errors");
var helpers_1 = require("./helpers");
function createIncomingHook(hook) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createIncomingWebhook,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_INCOMING_HOOK],
        params: [
            hook,
        ],
    });
}
exports.createIncomingHook = createIncomingHook;
function getIncomingHook(hookId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getIncomingWebhook,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_INCOMING_HOOK],
        params: [
            hookId,
        ],
    });
}
exports.getIncomingHook = getIncomingHook;
function getIncomingHooks(teamId, page, perPage) {
    if (teamId === void 0) { teamId = ''; }
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getIncomingWebhooks,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_INCOMING_HOOKS],
        params: [
            teamId,
            page,
            perPage,
        ],
    });
}
exports.getIncomingHooks = getIncomingHooks;
function removeIncomingHook(hookId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.removeIncomingWebhook(hookId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(errors_1.logError(error_1));
                    return [2 /*return*/, { error: error_1 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.IntegrationTypes.DELETED_INCOMING_HOOK,
                            data: { id: hookId },
                        },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.removeIncomingHook = removeIncomingHook;
function updateIncomingHook(hook) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.updateIncomingWebhook,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_INCOMING_HOOK],
        params: [
            hook,
        ],
    });
}
exports.updateIncomingHook = updateIncomingHook;
function createOutgoingHook(hook) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createOutgoingWebhook,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OUTGOING_HOOK],
        params: [
            hook,
        ],
    });
}
exports.createOutgoingHook = createOutgoingHook;
function getOutgoingHook(hookId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getOutgoingWebhook,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OUTGOING_HOOK],
        params: [
            hookId,
        ],
    });
}
exports.getOutgoingHook = getOutgoingHook;
function getOutgoingHooks(channelId, teamId, page, perPage) {
    if (channelId === void 0) { channelId = ''; }
    if (teamId === void 0) { teamId = ''; }
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getOutgoingWebhooks,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OUTGOING_HOOKS],
        params: [
            channelId,
            teamId,
            page,
            perPage,
        ],
    });
}
exports.getOutgoingHooks = getOutgoingHooks;
function removeOutgoingHook(hookId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.removeOutgoingWebhook(hookId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(errors_1.logError(error_2));
                    return [2 /*return*/, { error: error_2 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.IntegrationTypes.DELETED_OUTGOING_HOOK,
                            data: { id: hookId },
                        },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.removeOutgoingHook = removeOutgoingHook;
function updateOutgoingHook(hook) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.updateOutgoingWebhook,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OUTGOING_HOOK],
        params: [
            hook,
        ],
    });
}
exports.updateOutgoingHook = updateOutgoingHook;
function regenOutgoingHookToken(hookId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.regenOutgoingHookToken,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OUTGOING_HOOK],
        params: [
            hookId,
        ],
    });
}
exports.regenOutgoingHookToken = regenOutgoingHookToken;
function getCommands(teamId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getCommandsList,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_COMMANDS],
        params: [
            teamId,
        ],
    });
}
exports.getCommands = getCommands;
function getAutocompleteCommands(teamId, page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getAutocompleteCommandsList,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_COMMANDS],
        params: [
            teamId,
            page,
            perPage,
        ],
    });
}
exports.getAutocompleteCommands = getAutocompleteCommands;
function getCustomTeamCommands(teamId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getCustomTeamCommands,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_CUSTOM_TEAM_COMMANDS],
        params: [
            teamId,
        ],
    });
}
exports.getCustomTeamCommands = getCustomTeamCommands;
function addCommand(command) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.addCommand,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_COMMAND],
        params: [
            command,
        ],
    });
}
exports.addCommand = addCommand;
function editCommand(command) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.editCommand,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_COMMAND],
        params: [
            command,
        ],
    });
}
exports.editCommand = editCommand;
function executeCommand(command, args) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.executeCommand,
        params: [
            command,
            args,
        ],
    });
}
exports.executeCommand = executeCommand;
function regenCommandToken(id) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var res, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.regenCommandToken(id)];
                case 1:
                    res = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(errors_1.logError(error_3));
                    return [2 /*return*/, { error: error_3 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.IntegrationTypes.RECEIVED_COMMAND_TOKEN,
                            data: {
                                id: id,
                                token: res.token,
                            },
                        },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.regenCommandToken = regenCommandToken;
function deleteCommand(id) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.deleteCommand(id)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch(errors_1.logError(error_4));
                    return [2 /*return*/, { error: error_4 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.IntegrationTypes.DELETED_COMMAND,
                            data: { id: id },
                        },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.deleteCommand = deleteCommand;
function addOAuthApp(app) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createOAuthApp,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OAUTH_APP],
        params: [
            app,
        ],
    });
}
exports.addOAuthApp = addOAuthApp;
function editOAuthApp(app) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.editOAuthApp,
        onSuccess: action_types_1.IntegrationTypes.RECEIVED_OAUTH_APP,
        params: [
            app,
        ],
    });
}
exports.editOAuthApp = editOAuthApp;
function getOAuthApps(page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getOAuthApps,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OAUTH_APPS],
        params: [
            page,
            perPage,
        ],
    });
}
exports.getOAuthApps = getOAuthApps;
function getOAuthApp(appId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getOAuthApp,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OAUTH_APP],
        params: [
            appId,
        ],
    });
}
exports.getOAuthApp = getOAuthApp;
function getAuthorizedOAuthApps() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, currentUserId, data, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    currentUserId = users_1.getCurrentUserId(state);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getAuthorizedOAuthApps(currentUserId)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(errors_1.logError(error_5));
                    return [2 /*return*/, { error: error_5 }];
                case 4: return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getAuthorizedOAuthApps = getAuthorizedOAuthApps;
function deauthorizeOAuthApp(clientId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.deauthorizeOAuthApp,
        params: [clientId],
    });
}
exports.deauthorizeOAuthApp = deauthorizeOAuthApp;
function deleteOAuthApp(id) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.deleteOAuthApp(id)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_6, dispatch, getState);
                    dispatch(errors_1.logError(error_6));
                    return [2 /*return*/, { error: error_6 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.IntegrationTypes.DELETED_OAUTH_APP,
                            data: { id: id },
                        },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.deleteOAuthApp = deleteOAuthApp;
function regenOAuthAppSecret(appId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.regenOAuthAppSecret,
        onSuccess: [action_types_1.IntegrationTypes.RECEIVED_OAUTH_APP],
        params: [
            appId,
        ],
    });
}
exports.regenOAuthAppSecret = regenOAuthAppSecret;
function submitInteractiveDialog(submission) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, data, error_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    submission.channel_id = channels_1.getCurrentChannelId(state);
                    submission.team_id = teams_1.getCurrentTeamId(state);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.submitInteractiveDialog(submission)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_7, dispatch, getState);
                    dispatch(errors_1.logError(error_7));
                    return [2 /*return*/, { error: error_7 }];
                case 4: return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.submitInteractiveDialog = submitInteractiveDialog;
//# sourceMappingURL=integrations.js.map