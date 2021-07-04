"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileIdsByPostId = exports.filesFromSearch = exports.files = void 0;
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function files(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.FileTypes.RECEIVED_UPLOAD_FILES:
        case action_types_1.FileTypes.RECEIVED_FILES_FOR_POST: {
            var filesById = action.data.reduce(function (filesMap, file) {
                var _a;
                return tslib_1.__assign(tslib_1.__assign({}, filesMap), (_a = {}, _a[file.id] = file, _a));
            }, {});
            return tslib_1.__assign(tslib_1.__assign({}, state), filesById);
        }
        case action_types_1.PostTypes.RECEIVED_NEW_POST:
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            return storeFilesForPost(state, post);
        }
        case action_types_1.PostTypes.RECEIVED_POSTS: {
            var posts = Object.values(action.data.posts);
            return posts.reduce(storeFilesForPost, state);
        }
        case action_types_1.PostTypes.POST_DELETED:
        case action_types_1.PostTypes.POST_REMOVED: {
            if (action.data && action.data.file_ids && action.data.file_ids.length) {
                var nextState_1 = tslib_1.__assign({}, state);
                var fileIds = action.data.file_ids;
                fileIds.forEach(function (id) {
                    Reflect.deleteProperty(nextState_1, id);
                });
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
exports.files = files;
function filesFromSearch(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.FileTypes.RECEIVED_FILES_FOR_SEARCH: {
            return tslib_1.__assign(tslib_1.__assign({}, state), action.data);
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.filesFromSearch = filesFromSearch;
function storeFilesForPost(state, post) {
    if (!post.metadata || !post.metadata.files) {
        return state;
    }
    return post.metadata.files.reduce(function (nextState, file) {
        var _a;
        if (nextState[file.id]) {
            // File is already in the store
            return nextState;
        }
        return tslib_1.__assign(tslib_1.__assign({}, nextState), (_a = {}, _a[file.id] = file, _a));
    }, state);
}
function fileIdsByPostId(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.FileTypes.RECEIVED_FILES_FOR_POST: {
            var data = action.data, postId = action.postId;
            var filesIdsForPost = data.map(function (file) { return file.id; });
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[postId] = filesIdsForPost, _a));
        }
        case action_types_1.PostTypes.RECEIVED_NEW_POST:
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            return storeFilesIdsForPost(state, post);
        }
        case action_types_1.PostTypes.RECEIVED_POSTS: {
            var posts = Object.values(action.data.posts);
            return posts.reduce(storeFilesIdsForPost, state);
        }
        case action_types_1.PostTypes.POST_DELETED:
        case action_types_1.PostTypes.POST_REMOVED: {
            if (action.data) {
                var nextState = tslib_1.__assign({}, state);
                Reflect.deleteProperty(nextState, action.data.id);
                return nextState;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.fileIdsByPostId = fileIdsByPostId;
function storeFilesIdsForPost(state, post) {
    var _a;
    if (!post.metadata || !post.metadata.files) {
        return state;
    }
    return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[post.id] = post.metadata.files ? post.metadata.files.map(function (file) { return file.id; }) : [], _a));
}
function filePublicLink(state, action) {
    if (state === void 0) { state = { link: '' }; }
    switch (action.type) {
        case action_types_1.FileTypes.RECEIVED_FILE_PUBLIC_LINK: {
            return action.data;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return { link: '' };
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    files: files,
    filesFromSearch: filesFromSearch,
    fileIdsByPostId: fileIdsByPostId,
    filePublicLink: filePublicLink,
});
//# sourceMappingURL=files.js.map