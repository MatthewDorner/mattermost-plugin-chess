"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveHistoryIndexForward = exports.moveHistoryIndexBack = exports.resetHistoryIndex = exports.addMessageIntoHistory = exports.doPostActionWithCookie = exports.doPostAction = exports.getOpenGraphMetadata = exports.unflagPost = exports.selectFocusedPostId = exports.selectPost = exports.removePost = exports.getNeededCustomEmojis = exports.getNeededAtMentionedUsernames = exports.getProfilesAndStatusesForPosts = exports.getThreadsForPosts = exports.getPostsAround = exports.getPostsAfter = exports.getPostsBefore = exports.getPostsSince = exports.getPostsUnread = exports.getPosts = exports.getPostThread = exports.flagPost = exports.getReactionsForPost = exports.getCustomEmojiForReaction = exports.removeReaction = exports.addReaction = exports.unpinPost = exports.pinPost = exports.setUnreadPost = exports.editPost = exports.deletePost = exports.resetCreatePostRequest = exports.createPostImmediately = exports.createPost = exports.getPost = exports.postRemoved = exports.postDeleted = exports.receivedPostsInThread = exports.receivedPostsInChannel = exports.receivedPostsSince = exports.receivedPostsBefore = exports.receivedPostsAfter = exports.receivedPosts = exports.receivedNewPost = exports.receivedPost = void 0;
var tslib_1 = require("tslib");
var client_1 = require("../client");
var constants_1 = require("../constants");
var action_types_1 = require("../action_types");
var channels_1 = require("../selectors/entities/channels");
var emojis_1 = require("../selectors/entities/emojis");
var general_1 = require("../selectors/entities/general");
var Selectors = tslib_1.__importStar(require("../selectors/entities/posts"));
var users_1 = require("../selectors/entities/users");
var emoji_utils_1 = require("../utils/emoji_utils");
var post_list_1 = require("../utils/post_list");
var emojis_2 = require("./emojis");
var errors_1 = require("./errors");
var helpers_1 = require("./helpers");
var preferences_1 = require("./preferences");
var users_2 = require("./users");
var actions_1 = require("../types/actions");
var preferences_2 = require("../selectors/entities/preferences");
// receivedPost should be dispatched after a single post from the server. This typically happens when an existing post
// is updated.
function receivedPost(post) {
    return {
        type: action_types_1.PostTypes.RECEIVED_POST,
        data: post,
    };
}
exports.receivedPost = receivedPost;
// receivedNewPost should be dispatched when receiving a newly created post or when sending a request to the server
// to make a new post.
function receivedNewPost(post) {
    return {
        type: action_types_1.PostTypes.RECEIVED_NEW_POST,
        data: post,
    };
}
exports.receivedNewPost = receivedNewPost;
// receivedPosts should be dispatched when receiving multiple posts from the server that may or may not be ordered.
// This will typically be used alongside other actions like receivedPostsAfter which require the posts to be ordered.
function receivedPosts(posts) {
    return {
        type: action_types_1.PostTypes.RECEIVED_POSTS,
        data: posts,
    };
}
exports.receivedPosts = receivedPosts;
// receivedPostsAfter should be dispatched when receiving an ordered list of posts that come before a given post.
function receivedPostsAfter(posts, channelId, afterPostId, recent) {
    if (recent === void 0) { recent = false; }
    return {
        type: action_types_1.PostTypes.RECEIVED_POSTS_AFTER,
        channelId: channelId,
        data: posts,
        afterPostId: afterPostId,
        recent: recent,
    };
}
exports.receivedPostsAfter = receivedPostsAfter;
// receivedPostsBefore should be dispatched when receiving an ordered list of posts that come after a given post.
function receivedPostsBefore(posts, channelId, beforePostId, oldest) {
    if (oldest === void 0) { oldest = false; }
    return {
        type: action_types_1.PostTypes.RECEIVED_POSTS_BEFORE,
        channelId: channelId,
        data: posts,
        beforePostId: beforePostId,
        oldest: oldest,
    };
}
exports.receivedPostsBefore = receivedPostsBefore;
// receivedPostsSince should be dispatched when receiving a list of posts that have been updated since a certain time.
// Due to how the API endpoint works, some of these posts will be ordered, but others will not, so this needs special
// handling from the reducers.
function receivedPostsSince(posts, channelId) {
    return {
        type: action_types_1.PostTypes.RECEIVED_POSTS_SINCE,
        channelId: channelId,
        data: posts,
    };
}
exports.receivedPostsSince = receivedPostsSince;
// receivedPostsInChannel should be dispatched when receiving a list of ordered posts within a channel when the
// the adjacent posts are not known.
function receivedPostsInChannel(posts, channelId, recent, oldest) {
    if (recent === void 0) { recent = false; }
    if (oldest === void 0) { oldest = false; }
    return {
        type: action_types_1.PostTypes.RECEIVED_POSTS_IN_CHANNEL,
        channelId: channelId,
        data: posts,
        recent: recent,
        oldest: oldest,
    };
}
exports.receivedPostsInChannel = receivedPostsInChannel;
// receivedPostsInThread should be dispatched when receiving a list of unordered posts in a thread.
function receivedPostsInThread(posts, rootId) {
    return {
        type: action_types_1.PostTypes.RECEIVED_POSTS_IN_THREAD,
        data: posts,
        rootId: rootId,
    };
}
exports.receivedPostsInThread = receivedPostsInThread;
// postDeleted should be dispatched when a post has been deleted and should be replaced with a "message deleted"
// placeholder. This typically happens when a post is deleted by another user.
function postDeleted(post) {
    return {
        type: action_types_1.PostTypes.POST_DELETED,
        data: post,
    };
}
exports.postDeleted = postDeleted;
// postRemoved should be dispatched when a post should be immediately removed. This typically happens when a post is
// deleted by the current user.
function postRemoved(post) {
    return {
        type: action_types_1.PostTypes.POST_REMOVED,
        data: post,
    };
}
exports.postRemoved = postRemoved;
function getPost(postId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var post, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getPost(postId)];
                case 1:
                    post = _a.sent();
                    getProfilesAndStatusesForPosts([post], dispatch, getState);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.PostTypes.GET_POSTS_FAILURE, error: error_1 },
                        errors_1.logError(error_1),
                    ]));
                    return [2 /*return*/, { error: error_1 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        receivedPost(post),
                        {
                            type: action_types_1.PostTypes.GET_POSTS_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: post }];
            }
        });
    }); };
}
exports.getPost = getPost;
function createPost(post, files) {
    var _this = this;
    if (files === void 0) { files = []; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, currentUserId, timestamp, pendingPostId, actions, newPost, fileIds;
        return tslib_1.__generator(this, function (_a) {
            state = getState();
            currentUserId = state.entities.users.currentUserId;
            timestamp = Date.now();
            pendingPostId = post.pending_post_id || currentUserId + ":" + timestamp;
            actions = [];
            if (Selectors.isPostIdSending(state, pendingPostId)) {
                return [2 /*return*/, { data: true }];
            }
            newPost = tslib_1.__assign(tslib_1.__assign({}, post), { pending_post_id: pendingPostId, create_at: timestamp, update_at: timestamp, reply_count: 0 });
            if (post.root_id) {
                newPost.reply_count = Selectors.getPostRepliesCount(state, post.root_id) + 1;
            }
            // We are retrying a pending post that had files
            if (newPost.file_ids && !files.length) {
                files = newPost.file_ids.map(function (id) { return state.entities.files.files[id]; }); // eslint-disable-line
            }
            if (files.length) {
                fileIds = files.map(function (file) { return file.id; });
                newPost = tslib_1.__assign(tslib_1.__assign({}, newPost), { file_ids: fileIds });
                actions.push({
                    type: action_types_1.FileTypes.RECEIVED_FILES_FOR_POST,
                    postId: pendingPostId,
                    data: files,
                });
            }
            actions.push({
                type: action_types_1.PostTypes.RECEIVED_NEW_POST,
                data: tslib_1.__assign(tslib_1.__assign({}, newPost), { id: pendingPostId }),
            });
            dispatch(actions_1.batchActions(actions, 'BATCH_CREATE_POST_INIT'));
            (function createPostWrapper() {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var created, error_2, data;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, client_1.Client4.createPost(tslib_1.__assign(tslib_1.__assign({}, newPost), { create_at: 0 }))];
                            case 1:
                                created = _a.sent();
                                actions = [
                                    receivedPost(created),
                                    {
                                        type: action_types_1.PostTypes.CREATE_POST_SUCCESS,
                                    },
                                    {
                                        type: action_types_1.ChannelTypes.INCREMENT_TOTAL_MSG_COUNT,
                                        data: {
                                            channelId: newPost.channel_id,
                                            amount: 1,
                                        },
                                    },
                                    {
                                        type: action_types_1.ChannelTypes.DECREMENT_UNREAD_MSG_COUNT,
                                        data: {
                                            channelId: newPost.channel_id,
                                            amount: 1,
                                        },
                                    },
                                ];
                                if (files) {
                                    actions.push({
                                        type: action_types_1.FileTypes.RECEIVED_FILES_FOR_POST,
                                        postId: created.id,
                                        data: files,
                                    });
                                }
                                dispatch(actions_1.batchActions(actions, 'BATCH_CREATE_POST'));
                                return [3 /*break*/, 3];
                            case 2:
                                error_2 = _a.sent();
                                data = tslib_1.__assign(tslib_1.__assign({}, newPost), { id: pendingPostId, failed: true, update_at: Date.now() });
                                actions = [{ type: action_types_1.PostTypes.CREATE_POST_FAILURE, error: error_2 }];
                                // If the failure was because: the root post was deleted or
                                // TownSquareIsReadOnly=true then remove the post
                                if (error_2.server_error_id === 'api.post.create_post.root_id.app_error' ||
                                    error_2.server_error_id === 'api.post.create_post.town_square_read_only' ||
                                    error_2.server_error_id === 'plugin.message_will_be_posted.dismiss_post') {
                                    actions.push(removePost(data));
                                }
                                else {
                                    actions.push(receivedPost(data));
                                }
                                dispatch(actions_1.batchActions(actions, 'BATCH_CREATE_POST_FAILED'));
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }());
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.createPost = createPost;
function createPostImmediately(post, files) {
    var _this = this;
    if (files === void 0) { files = []; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, currentUserId, timestamp, pendingPostId, newPost, fileIds, created, error_3, actions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    currentUserId = state.entities.users.currentUserId;
                    timestamp = Date.now();
                    pendingPostId = currentUserId + ":" + timestamp;
                    newPost = tslib_1.__assign(tslib_1.__assign({}, post), { pending_post_id: pendingPostId, create_at: timestamp, update_at: timestamp, reply_count: 0 });
                    if (post.root_id) {
                        newPost.reply_count = Selectors.getPostRepliesCount(state, post.root_id) + 1;
                    }
                    if (files.length) {
                        fileIds = files.map(function (file) { return file.id; });
                        newPost = tslib_1.__assign(tslib_1.__assign({}, newPost), { file_ids: fileIds });
                        dispatch({
                            type: action_types_1.FileTypes.RECEIVED_FILES_FOR_POST,
                            postId: pendingPostId,
                            data: files,
                        });
                    }
                    dispatch(receivedNewPost(tslib_1.__assign(tslib_1.__assign({}, newPost), { id: pendingPostId })));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.createPost(tslib_1.__assign(tslib_1.__assign({}, newPost), { create_at: 0 }))];
                case 2:
                    created = _a.sent();
                    newPost.id = created.id;
                    newPost.reply_count = created.reply_count;
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.PostTypes.CREATE_POST_FAILURE, data: newPost, error: error_3 },
                        removePost(tslib_1.__assign(tslib_1.__assign({}, newPost), { id: pendingPostId })),
                        errors_1.logError(error_3),
                    ]));
                    return [2 /*return*/, { error: error_3 }];
                case 4:
                    actions = [
                        receivedPost(newPost),
                        {
                            type: action_types_1.PostTypes.CREATE_POST_SUCCESS,
                        },
                        {
                            type: action_types_1.ChannelTypes.INCREMENT_TOTAL_MSG_COUNT,
                            data: {
                                channelId: newPost.channel_id,
                                amount: 1,
                            },
                        },
                        {
                            type: action_types_1.ChannelTypes.DECREMENT_UNREAD_MSG_COUNT,
                            data: {
                                channelId: newPost.channel_id,
                                amount: 1,
                            },
                        },
                    ];
                    if (files) {
                        actions.push({
                            type: action_types_1.FileTypes.RECEIVED_FILES_FOR_POST,
                            postId: newPost.id,
                            data: files,
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: newPost }];
            }
        });
    }); };
}
exports.createPostImmediately = createPostImmediately;
function resetCreatePostRequest() {
    return { type: action_types_1.PostTypes.CREATE_POST_RESET_REQUEST };
}
exports.resetCreatePostRequest = resetCreatePostRequest;
function deletePost(post) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, delPost;
        return tslib_1.__generator(this, function (_a) {
            state = getState();
            delPost = tslib_1.__assign({}, post);
            if (delPost.type === constants_1.Posts.POST_TYPES.COMBINED_USER_ACTIVITY && delPost.system_post_ids) {
                delPost.system_post_ids.forEach(function (systemPostId) {
                    var systemPost = Selectors.getPost(state, systemPostId);
                    if (systemPost) {
                        dispatch(deletePost(systemPost));
                    }
                });
            }
            else {
                (function deletePostWrapper() {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var e_1;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    dispatch({
                                        type: action_types_1.PostTypes.POST_DELETED,
                                        data: delPost,
                                    });
                                    return [4 /*yield*/, client_1.Client4.deletePost(post.id)];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    // Recovering from this state doesn't actually work. The deleteAndRemovePost action
                                    // in the webapp needs to get an error in order to not call removePost, but then
                                    // the delete modal needs to handle this to show something to the user. Since none
                                    // of that ever worked (even with redux-offline in play), leave the behaviour here
                                    // unresolved.
                                    console.error('failed to delete post', e_1); // eslint-disable-line no-console
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                }());
            }
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.deletePost = deletePost;
function editPost(post) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.patchPost,
        onRequest: action_types_1.PostTypes.EDIT_POST_REQUEST,
        onSuccess: [action_types_1.PostTypes.RECEIVED_POST, action_types_1.PostTypes.EDIT_POST_SUCCESS],
        onFailure: action_types_1.PostTypes.EDIT_POST_FAILURE,
        params: [
            post,
        ],
    });
}
exports.editPost = editPost;
function getUnreadPostData(unreadChan, state) {
    var member = channels_1.getMyChannelMember(state, unreadChan.channel_id);
    var delta = member ? member.msg_count - unreadChan.msg_count : unreadChan.msg_count;
    var data = {
        teamId: unreadChan.team_id,
        channelId: unreadChan.channel_id,
        msgCount: unreadChan.msg_count,
        mentionCount: unreadChan.mention_count,
        lastViewedAt: unreadChan.last_viewed_at,
        deltaMsgs: delta,
    };
    return data;
}
function setUnreadPost(userId, postId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, post, unreadChan, error_4, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    post = Selectors.getPost(state, postId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (post_list_1.isCombinedUserActivityPost(postId)) {
                        return [2 /*return*/, {}];
                    }
                    return [4 /*yield*/, client_1.Client4.markPostAsUnread(userId, postId)];
                case 2:
                    unreadChan = _a.sent();
                    dispatch({
                        type: action_types_1.ChannelTypes.ADD_MANUALLY_UNREAD,
                        data: {
                            channelId: post.channel_id,
                        },
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch(errors_1.logError(error_4));
                    dispatch({
                        type: action_types_1.ChannelTypes.REMOVE_MANUALLY_UNREAD,
                        data: {
                            channelId: post.channel_id,
                        },
                    });
                    return [2 /*return*/, { error: error_4 }];
                case 4:
                    state = getState();
                    data = getUnreadPostData(unreadChan, state);
                    dispatch({
                        type: action_types_1.ChannelTypes.POST_UNREAD_SUCCESS,
                        data: data,
                    });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.setUnreadPost = setUnreadPost;
function pinPost(postId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var posts, error_5, actions, post;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.PostTypes.EDIT_POST_REQUEST });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.pinPost(postId)];
                case 2:
                    posts = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.PostTypes.EDIT_POST_FAILURE, error: error_5 },
                        errors_1.logError(error_5),
                    ]));
                    return [2 /*return*/, { error: error_5 }];
                case 4:
                    actions = [
                        {
                            type: action_types_1.PostTypes.EDIT_POST_SUCCESS,
                        },
                    ];
                    post = Selectors.getPost(getState(), postId);
                    if (post) {
                        actions.push(receivedPost(tslib_1.__assign(tslib_1.__assign({}, post), { is_pinned: true, update_at: Date.now() })), {
                            type: action_types_1.ChannelTypes.INCREMENT_PINNED_POST_COUNT,
                            id: post.channel_id,
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.pinPost = pinPost;
function unpinPost(postId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var posts, error_6, actions, post;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.PostTypes.EDIT_POST_REQUEST });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.unpinPost(postId)];
                case 2:
                    posts = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_6, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.PostTypes.EDIT_POST_FAILURE, error: error_6 },
                        errors_1.logError(error_6),
                    ]));
                    return [2 /*return*/, { error: error_6 }];
                case 4:
                    actions = [
                        {
                            type: action_types_1.PostTypes.EDIT_POST_SUCCESS,
                        },
                    ];
                    post = Selectors.getPost(getState(), postId);
                    if (post) {
                        actions.push(receivedPost(tslib_1.__assign(tslib_1.__assign({}, post), { is_pinned: false, update_at: Date.now() })), {
                            type: action_types_1.ChannelTypes.DECREMENT_PINNED_POST_COUNT,
                            id: post.channel_id,
                        });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.unpinPost = unpinPost;
function addReaction(postId, emojiName) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, reaction, error_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.addReaction(currentUserId, postId, emojiName)];
                case 2:
                    reaction = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_7, dispatch, getState);
                    dispatch(errors_1.logError(error_7));
                    return [2 /*return*/, { error: error_7 }];
                case 4:
                    dispatch({
                        type: action_types_1.PostTypes.RECEIVED_REACTION,
                        data: reaction,
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.addReaction = addReaction;
function removeReaction(postId, emojiName) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, error_8;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = getState().entities.users.currentUserId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.removeReaction(currentUserId, postId, emojiName)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_8, dispatch, getState);
                    dispatch(errors_1.logError(error_8));
                    return [2 /*return*/, { error: error_8 }];
                case 4:
                    dispatch({
                        type: action_types_1.PostTypes.REACTION_DELETED,
                        data: { user_id: currentUserId, post_id: postId, emoji_name: emojiName },
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.removeReaction = removeReaction;
function getCustomEmojiForReaction(name) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var nonExistentEmoji, customEmojisByName;
        return tslib_1.__generator(this, function (_a) {
            nonExistentEmoji = getState().entities.emojis.nonExistentEmoji;
            customEmojisByName = emojis_1.getCustomEmojisByName(getState());
            if (emojis_2.systemEmojis.has(name)) {
                return [2 /*return*/, { data: true }];
            }
            if (nonExistentEmoji.has(name)) {
                return [2 /*return*/, { data: true }];
            }
            if (customEmojisByName.has(name)) {
                return [2 /*return*/, { data: true }];
            }
            return [2 /*return*/, dispatch(emojis_2.getCustomEmojiByName(name))];
        });
    }); };
}
exports.getCustomEmojiForReaction = getCustomEmojiForReaction;
function getReactionsForPost(postId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var reactions, error_9, nonExistentEmoji_1, customEmojisByName_1, emojisToLoad_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getReactionsForPost(postId)];
                case 1:
                    reactions = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_9, dispatch, getState);
                    dispatch(errors_1.logError(error_9));
                    return [2 /*return*/, { error: error_9 }];
                case 3:
                    if (reactions && reactions.length > 0) {
                        nonExistentEmoji_1 = getState().entities.emojis.nonExistentEmoji;
                        customEmojisByName_1 = emojis_1.getCustomEmojisByName(getState());
                        emojisToLoad_1 = new Set();
                        reactions.forEach(function (r) {
                            var name = r.emoji_name;
                            if (emojis_2.systemEmojis.has(name)) {
                                // It's a system emoji, go the next match
                                return;
                            }
                            if (nonExistentEmoji_1.has(name)) {
                                // We've previously confirmed this is not a custom emoji
                                return;
                            }
                            if (customEmojisByName_1.has(name)) {
                                // We have the emoji, go to the next match
                                return;
                            }
                            emojisToLoad_1.add(name);
                        });
                        dispatch(emojis_2.getCustomEmojisByName(Array.from(emojisToLoad_1)));
                    }
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.PostTypes.RECEIVED_REACTIONS,
                            data: reactions,
                            postId: postId,
                        },
                    ]));
                    return [2 /*return*/, reactions];
            }
        });
    }); };
}
exports.getReactionsForPost = getReactionsForPost;
function flagPost(postId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, preference;
        return tslib_1.__generator(this, function (_a) {
            currentUserId = getState().entities.users.currentUserId;
            preference = {
                user_id: currentUserId,
                category: constants_1.Preferences.CATEGORY_FLAGGED_POST,
                name: postId,
                value: 'true',
            };
            client_1.Client4.trackEvent('action', 'action_posts_flag');
            return [2 /*return*/, preferences_1.savePreferences(currentUserId, [preference])(dispatch)];
        });
    }); };
}
exports.flagPost = flagPost;
function getPostThread(rootId, fetchThreads) {
    var _this = this;
    if (fetchThreads === void 0) { fetchThreads = true; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var posts, error_10;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.PostTypes.GET_POST_THREAD_REQUEST });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getPostThread(rootId, fetchThreads)];
                case 2:
                    posts = _a.sent();
                    getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    return [3 /*break*/, 4];
                case 3:
                    error_10 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_10, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.PostTypes.GET_POST_THREAD_FAILURE, error: error_10 },
                        errors_1.logError(error_10),
                    ]));
                    return [2 /*return*/, { error: error_10 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        receivedPosts(posts),
                        receivedPostsInThread(posts, rootId),
                        {
                            type: action_types_1.PostTypes.GET_POST_THREAD_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getPostThread = getPostThread;
function getPosts(channelId, page, perPage, fetchThreads, collapsedThreadsExtended) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.Posts.POST_CHUNK_SIZE; }
    if (fetchThreads === void 0) { fetchThreads = true; }
    if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var posts, collapsedThreadsEnabled, error_11;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collapsedThreadsEnabled = preferences_2.isCollapsedThreadsEnabled(getState());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getPosts(channelId, page, perPage, fetchThreads, collapsedThreadsEnabled, collapsedThreadsExtended)];
                case 2:
                    posts = _a.sent();
                    getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    return [3 /*break*/, 4];
                case 3:
                    error_11 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_11, dispatch, getState);
                    dispatch(errors_1.logError(error_11));
                    return [2 /*return*/, { error: error_11 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        receivedPosts(posts),
                        receivedPostsInChannel(posts, channelId, page === 0, posts.prev_post_id === ''),
                    ]));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getPosts = getPosts;
function getPostsUnread(channelId, fetchThreads, collapsedThreadsExtended) {
    var _this = this;
    if (fetchThreads === void 0) { fetchThreads = true; }
    if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var collapsedThreadsEnabled, userId, posts, error_12;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    collapsedThreadsEnabled = preferences_2.isCollapsedThreadsEnabled(getState());
                    userId = users_1.getCurrentUserId(getState());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getPostsUnread(channelId, userId, client_1.DEFAULT_LIMIT_BEFORE, client_1.DEFAULT_LIMIT_AFTER, fetchThreads, collapsedThreadsEnabled, collapsedThreadsExtended)];
                case 2:
                    posts = _a.sent();
                    getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    return [3 /*break*/, 4];
                case 3:
                    error_12 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_12, dispatch, getState);
                    dispatch(errors_1.logError(error_12));
                    return [2 /*return*/, { error: error_12 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        receivedPosts(posts),
                        receivedPostsInChannel(posts, channelId, posts.next_post_id === '', posts.prev_post_id === ''),
                    ]));
                    dispatch({
                        type: action_types_1.PostTypes.RECEIVED_POSTS,
                        data: posts,
                        channelId: channelId,
                    });
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getPostsUnread = getPostsUnread;
function getPostsSince(channelId, since, fetchThreads, collapsedThreadsExtended) {
    var _this = this;
    if (fetchThreads === void 0) { fetchThreads = true; }
    if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var posts, collapsedThreadsEnabled, error_13;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    collapsedThreadsEnabled = preferences_2.isCollapsedThreadsEnabled(getState());
                    return [4 /*yield*/, client_1.Client4.getPostsSince(channelId, since, fetchThreads, collapsedThreadsEnabled, collapsedThreadsExtended)];
                case 1:
                    posts = _a.sent();
                    getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_13, dispatch, getState);
                    dispatch(errors_1.logError(error_13));
                    return [2 /*return*/, { error: error_13 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        receivedPosts(posts),
                        receivedPostsSince(posts, channelId),
                        {
                            type: action_types_1.PostTypes.GET_POSTS_SINCE_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getPostsSince = getPostsSince;
function getPostsBefore(channelId, postId, page, perPage, fetchThreads, collapsedThreadsExtended) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.Posts.POST_CHUNK_SIZE; }
    if (fetchThreads === void 0) { fetchThreads = true; }
    if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var posts, collapsedThreadsEnabled, error_14;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    collapsedThreadsEnabled = preferences_2.isCollapsedThreadsEnabled(getState());
                    return [4 /*yield*/, client_1.Client4.getPostsBefore(channelId, postId, page, perPage, fetchThreads, collapsedThreadsEnabled, collapsedThreadsExtended)];
                case 1:
                    posts = _a.sent();
                    getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    return [3 /*break*/, 3];
                case 2:
                    error_14 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_14, dispatch, getState);
                    dispatch(errors_1.logError(error_14));
                    return [2 /*return*/, { error: error_14 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        receivedPosts(posts),
                        receivedPostsBefore(posts, channelId, postId, posts.prev_post_id === ''),
                    ]));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getPostsBefore = getPostsBefore;
function getPostsAfter(channelId, postId, page, perPage, fetchThreads, collapsedThreadsExtended) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.Posts.POST_CHUNK_SIZE; }
    if (fetchThreads === void 0) { fetchThreads = true; }
    if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var posts, collapsedThreadsEnabled, error_15;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    collapsedThreadsEnabled = preferences_2.isCollapsedThreadsEnabled(getState());
                    return [4 /*yield*/, client_1.Client4.getPostsAfter(channelId, postId, page, perPage, fetchThreads, collapsedThreadsEnabled, collapsedThreadsExtended)];
                case 1:
                    posts = _a.sent();
                    getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    return [3 /*break*/, 3];
                case 2:
                    error_15 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_15, dispatch, getState);
                    dispatch(errors_1.logError(error_15));
                    return [2 /*return*/, { error: error_15 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        receivedPosts(posts),
                        receivedPostsAfter(posts, channelId, postId, posts.next_post_id === ''),
                    ]));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getPostsAfter = getPostsAfter;
function getPostsAround(channelId, postId, perPage, fetchThreads, collapsedThreadsExtended) {
    var _this = this;
    if (perPage === void 0) { perPage = constants_1.Posts.POST_CHUNK_SIZE / 2; }
    if (fetchThreads === void 0) { fetchThreads = true; }
    if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var after, thread, before, collapsedThreadsEnabled, error_16, posts;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    collapsedThreadsEnabled = preferences_2.isCollapsedThreadsEnabled(getState());
                    return [4 /*yield*/, Promise.all([
                            client_1.Client4.getPostsAfter(channelId, postId, 0, perPage, fetchThreads, collapsedThreadsEnabled, collapsedThreadsExtended),
                            client_1.Client4.getPostThread(postId, fetchThreads, collapsedThreadsEnabled, collapsedThreadsExtended),
                            client_1.Client4.getPostsBefore(channelId, postId, 0, perPage, fetchThreads, collapsedThreadsEnabled, collapsedThreadsExtended),
                        ])];
                case 1:
                    _a = tslib_1.__read.apply(void 0, [_b.sent(), 3]), after = _a[0], thread = _a[1], before = _a[2];
                    return [3 /*break*/, 3];
                case 2:
                    error_16 = _b.sent();
                    helpers_1.forceLogoutIfNecessary(error_16, dispatch, getState);
                    dispatch(errors_1.logError(error_16));
                    return [2 /*return*/, { error: error_16 }];
                case 3:
                    posts = {
                        posts: tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, after.posts), thread.posts), before.posts),
                        order: tslib_1.__spread(after.order, [
                            postId
                        ], before.order),
                        next_post_id: after.next_post_id,
                        prev_post_id: before.prev_post_id,
                    };
                    getProfilesAndStatusesForPosts(posts.posts, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        receivedPosts(posts),
                        receivedPostsInChannel(posts, channelId, after.next_post_id === '', before.prev_post_id === ''),
                    ]));
                    return [2 /*return*/, { data: posts }];
            }
        });
    }); };
}
exports.getPostsAround = getPostsAround;
// getThreadsForPosts is intended for an array of posts that have been batched
// (see the actions/websocket_actions/handleNewPostEvents function in the webapp)
function getThreadsForPosts(posts, fetchThreads) {
    if (fetchThreads === void 0) { fetchThreads = true; }
    return function (dispatch, getState) {
        if (!Array.isArray(posts) || !posts.length) {
            return { data: true };
        }
        var state = getState();
        var promises = [];
        posts.forEach(function (post) {
            if (!post.root_id) {
                return;
            }
            var rootPost = Selectors.getPost(state, post.root_id);
            if (!rootPost) {
                promises.push(dispatch(getPostThread(post.root_id, fetchThreads)));
            }
        });
        return Promise.all(promises);
    };
}
exports.getThreadsForPosts = getThreadsForPosts;
// Note that getProfilesAndStatusesForPosts can take either an array of posts or a map of ids to posts
function getProfilesAndStatusesForPosts(postsArrayOrMap, dispatch, getState) {
    if (!postsArrayOrMap) {
        // Some API methods return {error} for no results
        return Promise.resolve();
    }
    var posts = Object.values(postsArrayOrMap);
    if (posts.length === 0) {
        return Promise.resolve();
    }
    var state = getState();
    var _a = state.entities.users, currentUserId = _a.currentUserId, profiles = _a.profiles, statuses = _a.statuses;
    // Statuses and profiles of the users who made the posts
    var userIdsToLoad = new Set();
    var statusesToLoad = new Set();
    Object.values(posts).forEach(function (post) {
        var userId = post.user_id;
        if (!statuses[userId]) {
            statusesToLoad.add(userId);
        }
        if (userId === currentUserId) {
            return;
        }
        if (!profiles[userId]) {
            userIdsToLoad.add(userId);
        }
    });
    var promises = [];
    if (userIdsToLoad.size > 0) {
        promises.push(users_2.getProfilesByIds(Array.from(userIdsToLoad))(dispatch, getState));
    }
    if (statusesToLoad.size > 0) {
        promises.push(users_2.getStatusesByIds(Array.from(statusesToLoad))(dispatch, getState));
    }
    // Profiles of users mentioned in the posts
    var usernamesToLoad = getNeededAtMentionedUsernames(state, posts);
    if (usernamesToLoad.size > 0) {
        promises.push(users_2.getProfilesByUsernames(Array.from(usernamesToLoad))(dispatch, getState));
    }
    // Emojis used in the posts
    var emojisToLoad = getNeededCustomEmojis(state, posts);
    if (emojisToLoad && emojisToLoad.size > 0) {
        promises.push(emojis_2.getCustomEmojisByName(Array.from(emojisToLoad))(dispatch, getState));
    }
    return Promise.all(promises);
}
exports.getProfilesAndStatusesForPosts = getProfilesAndStatusesForPosts;
function getNeededAtMentionedUsernames(state, posts) {
    var usersByUsername; // Populate this lazily since it's relatively expensive
    var usernamesToLoad = new Set();
    posts.forEach(function (post) {
        if (!post.message.includes('@')) {
            return;
        }
        if (!usersByUsername) {
            usersByUsername = users_1.getUsersByUsername(state);
        }
        var pattern = /\B@(([a-z0-9_.-]*[a-z0-9_])[.-]*)/gi;
        var match;
        while ((match = pattern.exec(post.message)) !== null) {
            // match[1] is the matched mention including trailing punctuation
            // match[2] is the matched mention without trailing punctuation
            if (constants_1.General.SPECIAL_MENTIONS.indexOf(match[2]) !== -1) {
                continue;
            }
            if (usersByUsername[match[1]] || usersByUsername[match[2]]) {
                // We have the user, go to the next match
                continue;
            }
            // If there's no trailing punctuation, this will only add 1 item to the set
            usernamesToLoad.add(match[1]);
            usernamesToLoad.add(match[2]);
        }
    });
    return usernamesToLoad;
}
exports.getNeededAtMentionedUsernames = getNeededAtMentionedUsernames;
function buildPostAttachmentText(attachments) {
    var attachmentText = '';
    attachments.forEach(function (a) {
        if (a.fields && a.fields.length) {
            a.fields.forEach(function (f) {
                attachmentText += ' ' + (f.value || '');
            });
        }
        if (a.pretext) {
            attachmentText += ' ' + a.pretext;
        }
        if (a.text) {
            attachmentText += ' ' + a.text;
        }
    });
    return attachmentText;
}
function getNeededCustomEmojis(state, posts) {
    if (general_1.getConfig(state).EnableCustomEmoji !== 'true') {
        return new Set();
    }
    // If post metadata is supported, custom emojis will have been provided as part of that
    if (posts[0].metadata) {
        return new Set();
    }
    var customEmojisToLoad = new Set();
    var customEmojisByName; // Populate this lazily since it's relatively expensive
    var nonExistentEmoji = state.entities.emojis.nonExistentEmoji;
    posts.forEach(function (post) {
        if (post.message.includes(':')) {
            if (!customEmojisByName) {
                customEmojisByName = emojis_1.getCustomEmojisByName(state);
            }
            var emojisFromPost = emoji_utils_1.parseNeededCustomEmojisFromText(post.message, emojis_2.systemEmojis, customEmojisByName, nonExistentEmoji);
            if (emojisFromPost.size > 0) {
                customEmojisToLoad = new Set(tslib_1.__spread(customEmojisToLoad, emojisFromPost));
            }
        }
        var props = post.props;
        if (props && props.attachments && props.attachments.length) {
            if (!customEmojisByName) {
                customEmojisByName = emojis_1.getCustomEmojisByName(state);
            }
            var attachmentText = buildPostAttachmentText(props.attachments);
            if (attachmentText) {
                var emojisFromAttachment = emoji_utils_1.parseNeededCustomEmojisFromText(attachmentText, emojis_2.systemEmojis, customEmojisByName, nonExistentEmoji);
                if (emojisFromAttachment.size > 0) {
                    customEmojisToLoad = new Set(tslib_1.__spread(customEmojisToLoad, emojisFromAttachment));
                }
            }
        }
    });
    return customEmojisToLoad;
}
exports.getNeededCustomEmojis = getNeededCustomEmojis;
function removePost(post) {
    return function (dispatch, getState) {
        var e_2, _a;
        if (post.type === constants_1.Posts.POST_TYPES.COMBINED_USER_ACTIVITY && post.system_post_ids) {
            var state = getState();
            try {
                for (var _b = tslib_1.__values(post.system_post_ids), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var systemPostId = _c.value;
                    var systemPost = Selectors.getPost(state, systemPostId);
                    if (systemPost) {
                        dispatch(removePost(systemPost));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        else {
            dispatch(postRemoved(post));
            if (post.is_pinned) {
                dispatch({
                    type: action_types_1.ChannelTypes.DECREMENT_PINNED_POST_COUNT,
                    id: post.channel_id,
                });
            }
        }
    };
}
exports.removePost = removePost;
function selectPost(postId) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({
                type: action_types_1.PostTypes.RECEIVED_POST_SELECTED,
                data: postId,
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.selectPost = selectPost;
function selectFocusedPostId(postId) {
    return {
        type: action_types_1.PostTypes.RECEIVED_FOCUSED_POST,
        data: postId,
    };
}
exports.selectFocusedPostId = selectFocusedPostId;
function unflagPost(postId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, preference;
        return tslib_1.__generator(this, function (_a) {
            currentUserId = getState().entities.users.currentUserId;
            preference = {
                user_id: currentUserId,
                category: constants_1.Preferences.CATEGORY_FLAGGED_POST,
                name: postId,
            };
            client_1.Client4.trackEvent('action', 'action_posts_unflag');
            return [2 /*return*/, preferences_1.deletePreferences(currentUserId, [preference])(dispatch, getState)];
        });
    }); };
}
exports.unflagPost = unflagPost;
function getOpenGraphMetadata(url) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_17;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getOpenGraphMetadata(url)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_17 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_17, dispatch, getState);
                    dispatch(errors_1.logError(error_17));
                    return [2 /*return*/, { error: error_17 }];
                case 3:
                    if (data && (data.url || data.type || data.title || data.description)) {
                        dispatch({
                            type: action_types_1.PostTypes.RECEIVED_OPEN_GRAPH_METADATA,
                            data: data,
                            url: url,
                        });
                    }
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getOpenGraphMetadata = getOpenGraphMetadata;
function doPostAction(postId, actionId, selectedOption) {
    if (selectedOption === void 0) { selectedOption = ''; }
    return doPostActionWithCookie(postId, actionId, '', selectedOption);
}
exports.doPostAction = doPostAction;
function doPostActionWithCookie(postId, actionId, actionCookie, selectedOption) {
    var _this = this;
    if (selectedOption === void 0) { selectedOption = ''; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_18;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.doPostActionWithCookie(postId, actionId, actionCookie, selectedOption)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_18 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_18, dispatch, getState);
                    dispatch(errors_1.logError(error_18));
                    return [2 /*return*/, { error: error_18 }];
                case 3:
                    if (data && data.trigger_id) {
                        dispatch({
                            type: action_types_1.IntegrationTypes.RECEIVED_DIALOG_TRIGGER_ID,
                            data: data.trigger_id,
                        });
                    }
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.doPostActionWithCookie = doPostActionWithCookie;
function addMessageIntoHistory(message) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({
                type: action_types_1.PostTypes.ADD_MESSAGE_INTO_HISTORY,
                data: message,
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.addMessageIntoHistory = addMessageIntoHistory;
function resetHistoryIndex(index) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({
                type: action_types_1.PostTypes.RESET_HISTORY_INDEX,
                data: index,
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.resetHistoryIndex = resetHistoryIndex;
function moveHistoryIndexBack(index) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({
                type: action_types_1.PostTypes.MOVE_HISTORY_INDEX_BACK,
                data: index,
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.moveHistoryIndexBack = moveHistoryIndexBack;
function moveHistoryIndexForward(index) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({
                type: action_types_1.PostTypes.MOVE_HISTORY_INDEX_FORWARD,
                data: index,
            });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.moveHistoryIndexForward = moveHistoryIndexForward;
//# sourceMappingURL=posts.js.map