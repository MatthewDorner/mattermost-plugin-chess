"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchFilesResults = exports.makeGetFilesForPost = exports.getFilePublicLink = void 0;
var reselect_1 = require("reselect");
var i18n_1 = require("./i18n");
var file_utils_1 = require("../../utils/file_utils");
function getAllFiles(state) {
    return state.entities.files.files;
}
function getAllFilesFromSearch(state) {
    return state.entities.files.filesFromSearch;
}
function getFilesIdsForPost(state, postId) {
    if (postId) {
        return state.entities.files.fileIdsByPostId[postId] || [];
    }
    return [];
}
function getFilePublicLink(state) {
    return state.entities.files.filePublicLink;
}
exports.getFilePublicLink = getFilePublicLink;
function makeGetFilesForPost() {
    return reselect_1.createSelector(getAllFiles, getFilesIdsForPost, i18n_1.getCurrentUserLocale, function (allFiles, fileIdsForPost, locale) {
        var fileInfos = fileIdsForPost.map(function (id) { return allFiles[id]; }).filter(function (id) { return Boolean(id); });
        return file_utils_1.sortFileInfos(fileInfos, locale);
    });
}
exports.makeGetFilesForPost = makeGetFilesForPost;
exports.getSearchFilesResults = reselect_1.createSelector(getAllFilesFromSearch, function (state) { return state.entities.search.fileResults; }, function (files, fileIds) {
    if (!fileIds) {
        return [];
    }
    return fileIds.map(function (id) { return files[id]; });
});
//# sourceMappingURL=files.js.map