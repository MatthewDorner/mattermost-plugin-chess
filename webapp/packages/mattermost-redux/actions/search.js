"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSearchTerms = exports.getRecentMentions = exports.clearPinnedPosts = exports.getPinnedPosts = exports.getFlaggedPosts = exports.getMoreFilesForSearch = exports.searchFiles = exports.searchFilesWithParams = exports.clearSearch = exports.getMorePostsForSearch = exports.searchPosts = exports.searchPostsWithParams = exports.getMissingChannelsFromFiles = exports.getMissingChannelsFromPosts = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var client_1 = require("../client");
var action_types_1 = require("../action_types");
var teams_1 = require("../selectors/entities/teams");
var users_1 = require("../selectors/entities/users");
var channels_1 = require("./channels");
var helpers_1 = require("./helpers");
var errors_1 = require("./errors");
var posts_1 = require("./posts");
var files_1 = require("./files");
var actions_1 = require("../types/actions");
var WEBAPP_SEARCH_PER_PAGE = 20;
function getMissingChannelsFromPosts(posts) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, channels, membersInChannel, myMembers, promises;
        return tslib_1.__generator(this, function (_b) {
            _a = getState().entities.channels, channels = _a.channels, membersInChannel = _a.membersInChannel, myMembers = _a.myMembers;
            promises = [];
            Object.values(posts).forEach(function (post) {
                var id = post.channel_id;
                if (!channels[id] || !myMembers[id]) {
                    promises.push(dispatch(channels_1.getChannelAndMyMember(id)));
                }
                if (!membersInChannel[id]) {
                    promises.push(dispatch(channels_1.getChannelMembers(id)));
                }
            });
            return [2 /*return*/, Promise.all(promises)];
        });
    }); };
}
exports.getMissingChannelsFromPosts = getMissingChannelsFromPosts;
function getMissingChannelsFromFiles(files) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, channels, membersInChannel, myMembers, promises;
        return tslib_1.__generator(this, function (_b) {
            _a = getState().entities.channels, channels = _a.channels, membersInChannel = _a.membersInChannel, myMembers = _a.myMembers;
            promises = [];
            Object.values(files).forEach(function (file) {
                var id = file.channel_id;
                if (!channels[id] || !myMembers[id]) {
                    promises.push(dispatch(channels_1.getChannelAndMyMember(id)));
                }
                if (!membersInChannel[id]) {
                    promises.push(dispatch(channels_1.getChannelMembers(id)));
                }
            });
            return [2 /*return*/, Promise.all(promises)];
        });
    }); };
}
exports.getMissingChannelsFromFiles = getMissingChannelsFromFiles;
function searchPostsWithParams(teamId, params) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var isGettingMore, posts, profilesAndStatuses, missingChannels, arr, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isGettingMore = params.page > 0;
                    dispatch({
                        type: action_types_1.SearchTypes.SEARCH_POSTS_REQUEST,
                        isGettingMore: isGettingMore,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, client_1.Client4.searchPostsWithParams(teamId, params)];
                case 2:
                    posts = _a.sent();
                    profilesAndStatuses = posts_1.getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    missingChannels = dispatch(getMissingChannelsFromPosts(posts.posts));
                    arr = [profilesAndStatuses, missingChannels];
                    return [4 /*yield*/, Promise.all(arr)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(errors_1.logError(error_1));
                    return [2 /*return*/, { error: error_1 }];
                case 5:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.SearchTypes.RECEIVED_SEARCH_POSTS,
                            data: posts,
                            isGettingMore: isGettingMore,
                        },
                        posts_1.receivedPosts(posts),
                        {
                            type: action_types_1.SearchTypes.RECEIVED_SEARCH_TERM,
                            data: {
                                teamId: teamId,
                                params: params,
                                isEnd: posts.order.length === 0,
                            },
                        },
                        {
                            type: action_types_1.SearchTypes.SEARCH_POSTS_SUCCESS,
                        },
                    ], 'SEARCH_POST_BATCH'));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.searchPostsWithParams = searchPostsWithParams;
function searchPosts(teamId, terms, isOrSearch, includeDeletedChannels) {
    return searchPostsWithParams(teamId, { terms: terms, is_or_search: isOrSearch, include_deleted_channels: includeDeletedChannels, page: 0, per_page: WEBAPP_SEARCH_PER_PAGE });
}
exports.searchPosts = searchPosts;
function getMorePostsForSearch() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var teamId, _a, params, isEnd, newParams;
        return tslib_1.__generator(this, function (_b) {
            teamId = teams_1.getCurrentTeamId(getState());
            _a = getState().entities.search.current[teamId], params = _a.params, isEnd = _a.isEnd;
            if (!isEnd) {
                newParams = Object.assign({}, params);
                newParams.page += 1;
                return [2 /*return*/, dispatch(searchPostsWithParams(teamId, newParams))];
            }
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.getMorePostsForSearch = getMorePostsForSearch;
function clearSearch() {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({ type: action_types_1.SearchTypes.REMOVE_SEARCH_POSTS });
            dispatch({ type: action_types_1.SearchTypes.REMOVE_SEARCH_FILES });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.clearSearch = clearSearch;
function searchFilesWithParams(teamId, params) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var isGettingMore, files, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isGettingMore = params.page > 0;
                    dispatch({
                        type: action_types_1.SearchTypes.SEARCH_FILES_REQUEST,
                        isGettingMore: isGettingMore,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, client_1.Client4.searchFilesWithParams(teamId, params)];
                case 2:
                    files = _a.sent();
                    return [4 /*yield*/, dispatch(getMissingChannelsFromFiles(files.file_infos))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(errors_1.logError(error_2));
                    return [2 /*return*/, { error: error_2 }];
                case 5:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.SearchTypes.RECEIVED_SEARCH_FILES,
                            data: files,
                            isGettingMore: isGettingMore,
                        },
                        files_1.receivedFiles(files.file_infos),
                        {
                            type: action_types_1.SearchTypes.RECEIVED_SEARCH_TERM,
                            data: {
                                teamId: teamId,
                                params: params,
                                isFilesEnd: files.order.length === 0,
                            },
                        },
                        {
                            type: action_types_1.SearchTypes.SEARCH_FILES_SUCCESS,
                        },
                    ], 'SEARCH_FILE_BATCH'));
                    return [2 /*return*/, { data: files }];
            }
        });
    }); };
}
exports.searchFilesWithParams = searchFilesWithParams;
function searchFiles(teamId, terms, isOrSearch, includeDeletedChannels) {
    return searchFilesWithParams(teamId, { terms: terms, is_or_search: isOrSearch, include_deleted_channels: includeDeletedChannels, page: 0, per_page: WEBAPP_SEARCH_PER_PAGE });
}
exports.searchFiles = searchFiles;
function getMoreFilesForSearch() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var teamId, _a, params, isFilesEnd, newParams;
        return tslib_1.__generator(this, function (_b) {
            teamId = teams_1.getCurrentTeamId(getState());
            _a = getState().entities.search.current[teamId], params = _a.params, isFilesEnd = _a.isFilesEnd;
            if (!isFilesEnd) {
                newParams = Object.assign({}, params);
                newParams.page += 1;
                return [2 /*return*/, dispatch(searchFilesWithParams(teamId, newParams))];
            }
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.getMoreFilesForSearch = getMoreFilesForSearch;
function getFlaggedPosts() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, userId, teamId, posts, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    userId = users_1.getCurrentUserId(state);
                    teamId = teams_1.getCurrentTeamId(state);
                    dispatch({ type: action_types_1.SearchTypes.SEARCH_FLAGGED_POSTS_REQUEST });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, client_1.Client4.getFlaggedPosts(userId, '', teamId)];
                case 2:
                    posts = _a.sent();
                    return [4 /*yield*/, Promise.all([posts_1.getProfilesAndStatusesForPosts(posts.posts, dispatch, getState), dispatch(getMissingChannelsFromPosts(posts.posts))])];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.SearchTypes.SEARCH_FLAGGED_POSTS_FAILURE, error: error_3 },
                        errors_1.logError(error_3),
                    ]));
                    return [2 /*return*/, { error: error_3 }];
                case 5:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.SearchTypes.RECEIVED_SEARCH_FLAGGED_POSTS,
                            data: posts,
                        },
                        posts_1.receivedPosts(posts),
                        {
                            type: action_types_1.SearchTypes.SEARCH_FLAGGED_POSTS_SUCCESS,
                        },
                    ], 'SEARCH_FLAGGED_POSTS_BATCH'));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getFlaggedPosts = getFlaggedPosts;
function getPinnedPosts(channelId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, profilesAndStatuses, missingChannels, arr, error_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.SearchTypes.SEARCH_PINNED_POSTS_REQUEST });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, client_1.Client4.getPinnedPosts(channelId)];
                case 2:
                    result = _a.sent();
                    profilesAndStatuses = posts_1.getProfilesAndStatusesForPosts(result.posts, dispatch, getState);
                    missingChannels = dispatch(getMissingChannelsFromPosts(result.posts));
                    arr = [profilesAndStatuses, missingChannels];
                    return [4 /*yield*/, Promise.all(arr)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.SearchTypes.SEARCH_PINNED_POSTS_FAILURE, error: error_4 },
                        errors_1.logError(error_4),
                    ]));
                    return [2 /*return*/, { error: error_4 }];
                case 5:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.SearchTypes.RECEIVED_SEARCH_PINNED_POSTS,
                            data: {
                                pinned: result,
                                channelId: channelId,
                            },
                        },
                        posts_1.receivedPosts(result),
                        {
                            type: action_types_1.SearchTypes.SEARCH_PINNED_POSTS_SUCCESS,
                        },
                    ], 'SEARCH_PINNED_POSTS_BATCH'));
                    return [2 /*return*/, { data: result }];
            }
        });
    }); };
}
exports.getPinnedPosts = getPinnedPosts;
function clearPinnedPosts(channelId) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({
                type: action_types_1.SearchTypes.REMOVE_SEARCH_PINNED_POSTS,
                data: {
                    channelId: channelId,
                },
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.clearPinnedPosts = clearPinnedPosts;
function getRecentMentions() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, teamId, posts, termKeys, terms, profilesAndStatuses, missingChannels, arr, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    teamId = teams_1.getCurrentTeamId(state);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    termKeys = users_1.getCurrentUserMentionKeys(state).filter(function (_a) {
                        var key = _a.key;
                        return key !== '@channel' && key !== '@all' && key !== '@here';
                    });
                    terms = termKeys.map(function (_a) {
                        var key = _a.key;
                        return key;
                    }).join(' ').trim() + ' ';
                    client_1.Client4.trackEvent('api', 'api_posts_search_mention');
                    return [4 /*yield*/, client_1.Client4.searchPosts(teamId, terms, true)];
                case 2:
                    posts = _a.sent();
                    profilesAndStatuses = posts_1.getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    missingChannels = dispatch(getMissingChannelsFromPosts(posts.posts));
                    arr = [profilesAndStatuses, missingChannels];
                    return [4 /*yield*/, Promise.all(arr)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(errors_1.logError(error_5));
                    return [2 /*return*/, { error: error_5 }];
                case 5:
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.SearchTypes.RECEIVED_SEARCH_POSTS,
                            data: posts,
                        },
                        posts_1.receivedPosts(posts),
                    ], 'SEARCH_RECENT_MENTIONS_BATCH'));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getRecentMentions = getRecentMentions;
function removeSearchTerms(teamId, terms) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({
                type: action_types_1.SearchTypes.REMOVE_SEARCH_TERM,
                data: {
                    teamId: teamId,
                    terms: terms,
                },
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.removeSearchTerms = removeSearchTerms;
exports.default = {
    clearSearch: clearSearch,
    removeSearchTerms: removeSearchTerms,
    searchPosts: searchPosts,
};
//# sourceMappingURL=search.js.map