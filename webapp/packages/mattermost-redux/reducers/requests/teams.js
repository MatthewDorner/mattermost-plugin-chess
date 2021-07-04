"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function getMyTeams(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.TeamTypes.MY_TEAMS_REQUEST, action_types_1.TeamTypes.MY_TEAMS_SUCCESS, action_types_1.TeamTypes.MY_TEAMS_FAILURE, state, action);
}
function getTeams(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.TeamTypes.GET_TEAMS_REQUEST, action_types_1.TeamTypes.GET_TEAMS_SUCCESS, action_types_1.TeamTypes.GET_TEAMS_FAILURE, state, action);
}
function joinTeam(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.TeamTypes.JOIN_TEAM_REQUEST, action_types_1.TeamTypes.JOIN_TEAM_SUCCESS, action_types_1.TeamTypes.JOIN_TEAM_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    getTeams: getTeams,
    getMyTeams: getMyTeams,
    joinTeam: joinTeam,
});
//# sourceMappingURL=teams.js.map