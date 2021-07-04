"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersTyping = exports.makeGetUsersTypingByChannelAndPost = void 0;
var reselect_1 = require("reselect");
var common_1 = require("./common");
var preferences_1 = require("./preferences");
var user_utils_1 = require("../../utils/user_utils");
var getUsersTypingImpl = function (profiles, teammateNameDisplay, channelId, parentPostId, typing) {
    var id = channelId + parentPostId;
    if (typing[id]) {
        var users = Object.keys(typing[id]);
        if (users.length) {
            return users.map(function (userId) {
                return user_utils_1.displayUsername(profiles[userId], teammateNameDisplay);
            });
        }
    }
    return [];
};
function makeGetUsersTypingByChannelAndPost() {
    return reselect_1.createSelector(common_1.getUsers, preferences_1.getTeammateNameDisplaySetting, function (state, options) { return options.channelId; }, function (state, options) { return options.postId; }, function (state) { return state.entities.typing; }, getUsersTypingImpl);
}
exports.makeGetUsersTypingByChannelAndPost = makeGetUsersTypingByChannelAndPost;
exports.getUsersTyping = reselect_1.createSelector(common_1.getUsers, preferences_1.getTeammateNameDisplaySetting, common_1.getCurrentChannelId, function (state) { return state.entities.posts.selectedPostId; }, function (state) { return state.entities.typing; }, getUsersTypingImpl);
//# sourceMappingURL=typing.js.map