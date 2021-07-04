"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getCurrentUserId = exports.getCurrentUser = exports.getMembersInTeam = exports.getMembersInChannel = exports.getMyCurrentChannelMembership = exports.getMyChannelMemberships = exports.getCurrentChannelId = void 0;
var reselect_1 = require("reselect");
// Channels
function getCurrentChannelId(state) {
    return state.entities.channels.currentChannelId;
}
exports.getCurrentChannelId = getCurrentChannelId;
function getMyChannelMemberships(state) {
    return state.entities.channels.myMembers;
}
exports.getMyChannelMemberships = getMyChannelMemberships;
exports.getMyCurrentChannelMembership = reselect_1.createSelector(getCurrentChannelId, getMyChannelMemberships, function (currentChannelId, channelMemberships) {
    return channelMemberships[currentChannelId] || null;
});
function getMembersInChannel(state, channelId) {
    var _a, _b;
    return ((_b = (_a = state.entities.channels) === null || _a === void 0 ? void 0 : _a.membersInChannel) === null || _b === void 0 ? void 0 : _b[channelId]) || {};
}
exports.getMembersInChannel = getMembersInChannel;
// Teams
function getMembersInTeam(state, teamId) {
    var _a, _b;
    return ((_b = (_a = state.entities.teams) === null || _a === void 0 ? void 0 : _a.membersInTeam) === null || _b === void 0 ? void 0 : _b[teamId]) || {};
}
exports.getMembersInTeam = getMembersInTeam;
// Users
function getCurrentUser(state) {
    return state.entities.users.profiles[getCurrentUserId(state)];
}
exports.getCurrentUser = getCurrentUser;
function getCurrentUserId(state) {
    return state.entities.users.currentUserId;
}
exports.getCurrentUserId = getCurrentUserId;
function getUsers(state) {
    return state.entities.users.profiles;
}
exports.getUsers = getUsers;
//# sourceMappingURL=common.js.map