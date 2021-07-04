"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutocompleteCommandsList = exports.getAllCommands = exports.getOutgoingHooksInCurrentTeam = exports.getSystemCommands = exports.getOAuthApps = exports.getCommands = exports.getOutgoingHooks = exports.getIncomingHooks = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var teams_1 = require("./teams");
function getIncomingHooks(state) {
    return state.entities.integrations.incomingHooks;
}
exports.getIncomingHooks = getIncomingHooks;
function getOutgoingHooks(state) {
    return state.entities.integrations.outgoingHooks;
}
exports.getOutgoingHooks = getOutgoingHooks;
function getCommands(state) {
    return state.entities.integrations.commands;
}
exports.getCommands = getCommands;
function getOAuthApps(state) {
    return state.entities.integrations.oauthApps;
}
exports.getOAuthApps = getOAuthApps;
function getSystemCommands(state) {
    return state.entities.integrations.systemCommands;
}
exports.getSystemCommands = getSystemCommands;
/**
 * get outgoing hooks in current team
 */
exports.getOutgoingHooksInCurrentTeam = reselect_1.createSelector(teams_1.getCurrentTeamId, getOutgoingHooks, function (teamId, hooks) {
    return Object.values(hooks).filter(function (o) { return o.team_id === teamId; });
});
exports.getAllCommands = reselect_1.createSelector(getCommands, getSystemCommands, function (commands, systemCommands) {
    return tslib_1.__assign(tslib_1.__assign({}, commands), systemCommands);
});
exports.getAutocompleteCommandsList = reselect_1.createSelector(exports.getAllCommands, teams_1.getCurrentTeamId, function (commands, currentTeamId) {
    return Object.values(commands).filter(function (command) {
        return command && (!command.team_id || command.team_id === currentTeamId) && command.auto_complete;
    }).sort(function (a, b) { return a.display_name.localeCompare(b.display_name); });
});
//# sourceMappingURL=integrations.js.map