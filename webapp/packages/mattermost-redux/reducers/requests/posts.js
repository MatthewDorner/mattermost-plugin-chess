"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function createPost(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    if (action.type === action_types_1.PostTypes.CREATE_POST_RESET_REQUEST) {
        return helpers_1.initialRequestState();
    }
    return helpers_1.handleRequest(action_types_1.PostTypes.CREATE_POST_REQUEST, action_types_1.PostTypes.CREATE_POST_SUCCESS, action_types_1.PostTypes.CREATE_POST_FAILURE, state, action);
}
function editPost(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.PostTypes.EDIT_POST_REQUEST, action_types_1.PostTypes.EDIT_POST_SUCCESS, action_types_1.PostTypes.EDIT_POST_FAILURE, state, action);
}
function getPostThread(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.PostTypes.GET_POST_THREAD_REQUEST, action_types_1.PostTypes.GET_POST_THREAD_SUCCESS, action_types_1.PostTypes.GET_POST_THREAD_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    createPost: createPost,
    editPost: editPost,
    getPostThread: getPostThread,
});
//# sourceMappingURL=posts.js.map