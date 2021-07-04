"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserMentionKeys = exports.getCurrentSearchForCurrentTeam = void 0;
var reselect_1 = require("reselect");
var teams_1 = require("./teams");
var users_1 = require("./users");
var groups_1 = require("./groups");
exports.getCurrentSearchForCurrentTeam = reselect_1.createSelector(function (state) { return state.entities.search.current; }, teams_1.getCurrentTeamId, function (current, teamId) {
    return current[teamId];
});
exports.getAllUserMentionKeys = reselect_1.createSelector(users_1.getCurrentUserMentionKeys, groups_1.getMyGroupMentionKeys, function (userMentionKeys, groupMentionKeys) {
    return userMentionKeys.concat(groupMentionKeys);
});
//# sourceMappingURL=search.js.map