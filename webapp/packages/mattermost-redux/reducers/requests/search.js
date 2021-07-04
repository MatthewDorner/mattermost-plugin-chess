"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function flaggedPosts(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    if (action.type === action_types_1.SearchTypes.REMOVE_SEARCH_POSTS) {
        return helpers_1.initialRequestState();
    }
    return helpers_1.handleRequest(action_types_1.SearchTypes.SEARCH_FLAGGED_POSTS_REQUEST, action_types_1.SearchTypes.SEARCH_FLAGGED_POSTS_SUCCESS, action_types_1.SearchTypes.SEARCH_FLAGGED_POSTS_FAILURE, state, action);
}
function pinnedPosts(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    if (action.type === action_types_1.SearchTypes.REMOVE_SEARCH_POSTS) {
        return helpers_1.initialRequestState();
    }
    return helpers_1.handleRequest(action_types_1.SearchTypes.SEARCH_PINNED_POSTS_REQUEST, action_types_1.SearchTypes.SEARCH_PINNED_POSTS_SUCCESS, action_types_1.SearchTypes.SEARCH_PINNED_POSTS_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    flaggedPosts: flaggedPosts,
    pinnedPosts: pinnedPosts,
});
//# sourceMappingURL=search.js.map