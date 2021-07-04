"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function incomingHooks(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.IntegrationTypes.RECEIVED_INCOMING_HOOK: {
            var nextState = tslib_1.__assign({}, state);
            nextState[action.data.id] = action.data;
            return nextState;
        }
        case action_types_1.IntegrationTypes.RECEIVED_INCOMING_HOOKS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var hook = _c.value;
                    nextState[hook.id] = hook;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        case action_types_1.IntegrationTypes.DELETED_INCOMING_HOOK: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data.id);
            return nextState;
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_DELETED: {
            var nextState_1 = tslib_1.__assign({}, state);
            var deleted_1 = false;
            Object.keys(nextState_1).forEach(function (id) {
                if (nextState_1[id].channel_id === action.data.id) {
                    deleted_1 = true;
                    Reflect.deleteProperty(nextState_1, id);
                }
            });
            if (deleted_1) {
                return nextState_1;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function outgoingHooks(state, action) {
    var e_2, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.IntegrationTypes.RECEIVED_OUTGOING_HOOK: {
            var nextState = tslib_1.__assign({}, state);
            nextState[action.data.id] = action.data;
            return nextState;
        }
        case action_types_1.IntegrationTypes.RECEIVED_OUTGOING_HOOKS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var hook = _c.value;
                    nextState[hook.id] = hook;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return nextState;
        }
        case action_types_1.IntegrationTypes.DELETED_OUTGOING_HOOK: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data.id);
            return nextState;
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_DELETED: {
            var nextState_2 = tslib_1.__assign({}, state);
            var deleted_2 = false;
            Object.keys(nextState_2).forEach(function (id) {
                if (nextState_2[id].channel_id === action.data.id) {
                    deleted_2 = true;
                    Reflect.deleteProperty(nextState_2, id);
                }
            });
            if (deleted_2) {
                return nextState_2;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function commands(state, action) {
    var e_3, _a, _b, _c;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.IntegrationTypes.RECEIVED_COMMANDS:
        case action_types_1.IntegrationTypes.RECEIVED_CUSTOM_TEAM_COMMANDS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _d = tslib_1.__values(action.data), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var command = _e.value;
                    if (command.id) {
                        var id = command.id;
                        nextState[id] = command;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return nextState;
        }
        case action_types_1.IntegrationTypes.RECEIVED_COMMAND:
            if (action.data.id) {
                return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[action.data.id] = action.data, _b));
            }
            return state;
        case action_types_1.IntegrationTypes.RECEIVED_COMMAND_TOKEN: {
            var _f = action.data, id = _f.id, token = _f.token;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[id] = tslib_1.__assign(tslib_1.__assign({}, state[id]), { token: token }), _c));
        }
        case action_types_1.IntegrationTypes.DELETED_COMMAND: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data.id);
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function systemCommands(state, action) {
    var e_4, _a, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.IntegrationTypes.RECEIVED_COMMANDS: {
            var nextCommands = {};
            try {
                for (var _c = tslib_1.__values(action.data), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var command = _d.value;
                    if (!command.id) {
                        nextCommands[command.trigger] = command;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return nextCommands;
        }
        case action_types_1.IntegrationTypes.RECEIVED_COMMAND:
            if (!action.data.id) {
                return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[action.data.trigger] = action.data, _b));
            }
            return state;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function oauthApps(state, action) {
    var e_5, _a, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.IntegrationTypes.RECEIVED_OAUTH_APPS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _c = tslib_1.__values(action.data), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var app = _d.value;
                    nextState[app.id] = app;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return nextState;
        }
        case action_types_1.IntegrationTypes.RECEIVED_OAUTH_APP:
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[action.data.id] = action.data, _b));
        case action_types_1.IntegrationTypes.DELETED_OAUTH_APP: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data.id);
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function dialogTriggerId(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.IntegrationTypes.RECEIVED_DIALOG_TRIGGER_ID:
            return action.data;
        default:
            return state;
    }
}
function dialog(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.IntegrationTypes.RECEIVED_DIALOG:
            return action.data;
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // object where every key is the hook id and has an object with the incoming hook details
    incomingHooks: incomingHooks,
    // object where every key is the hook id and has an object with the outgoing hook details
    outgoingHooks: outgoingHooks,
    // object to represent installed slash commands for a current team
    commands: commands,
    // object to represent registered oauth apps with app id as the key
    oauthApps: oauthApps,
    // object to represent built-in slash commands
    systemCommands: systemCommands,
    // trigger ID for interactive dialogs
    dialogTriggerId: dialogTriggerId,
    // data for an interactive dialog to display
    dialog: dialog,
});
//# sourceMappingURL=integrations.js.map