"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpandedLink = exports.makeIsPostCommentMention = exports.isPostIdSending = exports.getUnreadPostsChunk = exports.getPostsChunkInChannelAroundTime = exports.getPostIdsInChannel = exports.getOldestPostsChunkInChannel = exports.getRecentPostsChunkInChannel = exports.getCurrentUsersLatestPost = exports.getLatestReplyablePostId = exports.getMostRecentPostIdInChannel = exports.getLastPostPerChannel = exports.makeGetPostsForIds = exports.makeGetMessageInHistoryItem = exports.getSearchMatches = exports.getSearchResults = exports.makeGetCommentCountForPost = exports.makeGetProfilesForThread = exports.makeGetPostsForThread = exports.makeGetPostsAroundPost = exports.makeGetPostsInChannel = exports.makeGetPostIdsAroundPost = exports.makeGetPostsChunkAroundPost = exports.makeGetPostIdsForThread = exports.getPostsInCurrentChannel = exports.getPostIdsInCurrentChannel = exports.getOpenGraphMetadataForUrl = exports.getOpenGraphMetadata = exports.makeGetReactionsForPost = exports.getReactionsForPosts = exports.getPostsInThread = exports.getPostRepliesCount = exports.getPost = exports.getAllPosts = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var constants_1 = require("../../constants");
var common_1 = require("./common");
var preferences_1 = require("./preferences");
var users_1 = require("./users");
var helpers_1 = require("../../utils/helpers");
var post_utils_1 = require("../../utils/post_utils");
var preference_utils_1 = require("../../utils/preference_utils");
function getAllPosts(state) {
    return state.entities.posts.posts;
}
exports.getAllPosts = getAllPosts;
function getPost(state, postId) {
    return getAllPosts(state)[postId];
}
exports.getPost = getPost;
function getPostRepliesCount(state, postId) {
    return state.entities.posts.postsReplies[postId] || 0;
}
exports.getPostRepliesCount = getPostRepliesCount;
function getPostsInThread(state) {
    return state.entities.posts.postsInThread;
}
exports.getPostsInThread = getPostsInThread;
function getReactionsForPosts(state) {
    return state.entities.posts.reactions;
}
exports.getReactionsForPosts = getReactionsForPosts;
function makeGetReactionsForPost() {
    return reselect_1.createSelector(getReactionsForPosts, function (state, postId) { return postId; }, function (reactions, postId) {
        if (reactions[postId]) {
            return reactions[postId];
        }
        return null;
    });
}
exports.makeGetReactionsForPost = makeGetReactionsForPost;
function getOpenGraphMetadata(state) {
    return state.entities.posts.openGraph;
}
exports.getOpenGraphMetadata = getOpenGraphMetadata;
function getOpenGraphMetadataForUrl(state, postId, url) {
    var openGraphForPost = state.entities.posts.openGraph[postId];
    return openGraphForPost ? openGraphForPost[url] : undefined;
}
exports.getOpenGraphMetadataForUrl = getOpenGraphMetadataForUrl;
// getPostIdsInCurrentChannel returns the IDs of posts loaded at the bottom of the channel. It does not include older
// posts such as those loaded by viewing a thread or a permalink.
function getPostIdsInCurrentChannel(state) {
    return getPostIdsInChannel(state, state.entities.channels.currentChannelId);
}
exports.getPostIdsInCurrentChannel = getPostIdsInCurrentChannel;
// getPostsInCurrentChannel returns the posts loaded at the bottom of the channel. It does not include older posts
// such as those loaded by viewing a thread or a permalink.
exports.getPostsInCurrentChannel = (function () {
    var getPostsInChannel = makeGetPostsInChannel();
    return function (state) { return getPostsInChannel(state, state.entities.channels.currentChannelId, -1); };
})();
function makeGetPostIdsForThread() {
    return helpers_1.createIdsSelector(getAllPosts, function (state, rootId) { return state.entities.posts.postsInThread[rootId] || []; }, function (state, rootId) { return state.entities.posts.posts[rootId]; }, function (posts, postsForThread, rootPost) {
        var thread = [];
        if (rootPost) {
            thread.push(rootPost);
        }
        postsForThread.forEach(function (id) {
            var post = posts[id];
            if (post) {
                thread.push(post);
            }
        });
        thread.sort(post_utils_1.comparePosts);
        return thread.map(function (post) { return post.id; });
    });
}
exports.makeGetPostIdsForThread = makeGetPostIdsForThread;
function makeGetPostsChunkAroundPost() {
    return helpers_1.createIdsSelector(function (state, postId, channelId) { return state.entities.posts.postsInChannel[channelId]; }, function (state, postId) { return postId; }, function (postsForChannel, postId) {
        var e_1, _a;
        if (!postsForChannel) {
            return null;
        }
        var postChunk;
        try {
            for (var postsForChannel_1 = tslib_1.__values(postsForChannel), postsForChannel_1_1 = postsForChannel_1.next(); !postsForChannel_1_1.done; postsForChannel_1_1 = postsForChannel_1.next()) {
                var block = postsForChannel_1_1.value;
                var index = block.order.indexOf(postId);
                if (index === -1) {
                    continue;
                }
                postChunk = block;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (postsForChannel_1_1 && !postsForChannel_1_1.done && (_a = postsForChannel_1.return)) _a.call(postsForChannel_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return postChunk;
    });
}
exports.makeGetPostsChunkAroundPost = makeGetPostsChunkAroundPost;
function makeGetPostIdsAroundPost() {
    var getPostsChunkAroundPost = makeGetPostsChunkAroundPost();
    return helpers_1.createIdsSelector(function (state, postId, channelId) { return getPostsChunkAroundPost(state, postId, channelId); }, function (state, postId) { return postId; }, function (state, postId, channelId, options) { return options && options.postsBeforeCount; }, function (state, postId, channelId, options) { return options && options.postsAfterCount; }, function (postsChunk, postId, postsBeforeCount, postsAfterCount) {
        if (postsBeforeCount === void 0) { postsBeforeCount = constants_1.Posts.POST_CHUNK_SIZE / 2; }
        if (postsAfterCount === void 0) { postsAfterCount = constants_1.Posts.POST_CHUNK_SIZE / 2; }
        if (!postsChunk || !postsChunk.order) {
            return null;
        }
        var postIds = postsChunk.order;
        var index = postIds.indexOf(postId);
        // Remember that posts that come after the post have a smaller index
        var minPostIndex = postsAfterCount === -1 ? 0 : Math.max(index - postsAfterCount, 0);
        var maxPostIndex = postsBeforeCount === -1 ? postIds.length : Math.min(index + postsBeforeCount + 1, postIds.length); // Needs the extra 1 to include the focused post
        return postIds.slice(minPostIndex, maxPostIndex);
    });
}
exports.makeGetPostIdsAroundPost = makeGetPostIdsAroundPost;
function formatPostInChannel(post, previousPost, index, allPosts, postsInThread, postIds, currentUser, focusedPostId) {
    var e_2, _a;
    var isFirstReply = false;
    var isLastReply = false;
    var highlight = false;
    var commentedOnPost;
    if (post.id === focusedPostId) {
        highlight = true;
    }
    if (post.root_id) {
        if (previousPost && previousPost.root_id !== post.root_id) {
            // Post is the first reply in a list of consecutive replies
            isFirstReply = true;
            if (previousPost && previousPost.id !== post.root_id) {
                commentedOnPost = allPosts[post.root_id];
            }
        }
        if (index - 1 < 0 || allPosts[postIds[index - 1]].root_id !== post.root_id) {
            // Post is the last reply in a list of consecutive replies
            isLastReply = true;
        }
    }
    var previousPostIsComment = false;
    if (previousPost && previousPost.root_id) {
        previousPostIsComment = true;
    }
    var postFromWebhook = Boolean(post.props && post.props.from_webhook);
    var prevPostFromWebhook = Boolean(previousPost && previousPost.props && previousPost.props.from_webhook);
    var consecutivePostByUser = false;
    if (previousPost &&
        previousPost.user_id === post.user_id &&
        post.create_at - previousPost.create_at <= constants_1.Posts.POST_COLLAPSE_TIMEOUT &&
        !postFromWebhook && !prevPostFromWebhook &&
        !post_utils_1.isSystemMessage(post) && !post_utils_1.isSystemMessage(previousPost)) {
        // The last post and this post were made by the same user within some time
        consecutivePostByUser = true;
    }
    var threadRepliedToByCurrentUser = false;
    var replyCount = 0;
    var isCommentMention = false;
    if (currentUser) {
        var rootId = post.root_id || post.id;
        var threadIds = postsInThread[rootId] || [];
        try {
            for (var threadIds_1 = tslib_1.__values(threadIds), threadIds_1_1 = threadIds_1.next(); !threadIds_1_1.done; threadIds_1_1 = threadIds_1.next()) {
                var pid = threadIds_1_1.value;
                var p = allPosts[pid];
                if (!p) {
                    continue;
                }
                if (p.user_id === currentUser.id) {
                    threadRepliedToByCurrentUser = true;
                }
                if (!post_utils_1.isPostEphemeral(p)) {
                    replyCount += 1;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (threadIds_1_1 && !threadIds_1_1.done && (_a = threadIds_1.return)) _a.call(threadIds_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var rootPost = allPosts[rootId];
        isCommentMention = post_utils_1.isPostCommentMention({ post: post, currentUser: currentUser, threadRepliedToByCurrentUser: threadRepliedToByCurrentUser, rootPost: rootPost });
    }
    return tslib_1.__assign(tslib_1.__assign({}, post), { isFirstReply: isFirstReply,
        isLastReply: isLastReply,
        previousPostIsComment: previousPostIsComment,
        commentedOnPost: commentedOnPost,
        consecutivePostByUser: consecutivePostByUser,
        replyCount: replyCount,
        isCommentMention: isCommentMention,
        highlight: highlight });
}
// makeGetPostsInChannel creates a selector that returns up to the given number of posts loaded at the bottom of the
// given channel. It does not include older posts such as those loaded by viewing a thread or a permalink.
function makeGetPostsInChannel() {
    return reselect_1.createSelector(getAllPosts, getPostsInThread, function (state, channelId) { return getPostIdsInChannel(state, channelId); }, common_1.getCurrentUser, preferences_1.getMyPreferences, function (state, channelId, numPosts) { return numPosts || constants_1.Posts.POST_CHUNK_SIZE; }, function (allPosts, postsInThread, allPostIds, currentUser, myPreferences, numPosts) {
        if (!allPostIds) {
            return null;
        }
        var posts = [];
        var joinLeavePref = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_ADVANCED_SETTINGS, constants_1.Preferences.ADVANCED_FILTER_JOIN_LEAVE)];
        var showJoinLeave = joinLeavePref ? joinLeavePref.value !== 'false' : true;
        var postIds = numPosts === -1 ? allPostIds : allPostIds.slice(0, numPosts);
        for (var i = 0; i < postIds.length; i++) {
            var post = allPosts[postIds[i]];
            if (post_utils_1.shouldFilterJoinLeavePost(post, showJoinLeave, currentUser ? currentUser.username : '')) {
                continue;
            }
            var previousPost = allPosts[postIds[i + 1]] || null;
            posts.push(formatPostInChannel(post, previousPost, i, allPosts, postsInThread, postIds, currentUser, ''));
        }
        return posts;
    });
}
exports.makeGetPostsInChannel = makeGetPostsInChannel;
function makeGetPostsAroundPost() {
    var getPostIdsAroundPost = makeGetPostIdsAroundPost();
    var options = {
        postsBeforeCount: -1,
        postsAfterCount: constants_1.Posts.POST_CHUNK_SIZE / 2,
    };
    return reselect_1.createSelector(function (state, focusedPostId, channelId) { return getPostIdsAroundPost(state, focusedPostId, channelId, options); }, getAllPosts, getPostsInThread, function (state, focusedPostId) { return focusedPostId; }, common_1.getCurrentUser, preferences_1.getMyPreferences, function (postIds, allPosts, postsInThread, focusedPostId, currentUser, myPreferences) {
        if (!postIds || !currentUser) {
            return null;
        }
        var posts = [];
        var joinLeavePref = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_ADVANCED_SETTINGS, constants_1.Preferences.ADVANCED_FILTER_JOIN_LEAVE)];
        var showJoinLeave = joinLeavePref ? joinLeavePref.value !== 'false' : true;
        for (var i = 0; i < postIds.length; i++) {
            var post = allPosts[postIds[i]];
            if (post_utils_1.shouldFilterJoinLeavePost(post, showJoinLeave, currentUser.username)) {
                continue;
            }
            var previousPost = allPosts[postIds[i + 1]] || null;
            var formattedPost = formatPostInChannel(post, previousPost, i, allPosts, postsInThread, postIds, currentUser, focusedPostId);
            posts.push(formattedPost);
        }
        return posts;
    });
}
exports.makeGetPostsAroundPost = makeGetPostsAroundPost;
// Returns a function that creates a creates a selector that will get the posts for a given thread.
// That selector will take a props object (containing a rootId field) as its
// only argument and will be memoized based on that argument.
function makeGetPostsForThread() {
    return reselect_1.createSelector(getAllPosts, function (state, props) { return state.entities.posts.postsInThread[props.rootId] || []; }, function (state, props) { return state.entities.posts.posts[props.rootId]; }, function (posts, postsForThread, rootPost) {
        var thread = [];
        if (rootPost) {
            thread.push(rootPost);
        }
        postsForThread.forEach(function (id) {
            var post = posts[id];
            if (post) {
                thread.push(post);
            }
        });
        thread.sort(post_utils_1.comparePosts);
        return thread;
    });
}
exports.makeGetPostsForThread = makeGetPostsForThread;
// The selector below filters current user if it exists. Excluding currentUser is just for convinience
function makeGetProfilesForThread() {
    var getPostsForThread = makeGetPostsForThread();
    return reselect_1.createSelector(users_1.getUsers, users_1.getCurrentUserId, getPostsForThread, function (allUsers, currentUserId, posts) {
        var profileIds = posts.map(function (post) { return post.user_id; });
        var uniqueIds = tslib_1.__spread(new Set(profileIds));
        return uniqueIds.reduce(function (acc, id) {
            if (allUsers[id] && currentUserId !== id) {
                return tslib_1.__spread(acc, [
                    allUsers[id],
                ]);
            }
            return acc;
        }, []);
    });
}
exports.makeGetProfilesForThread = makeGetProfilesForThread;
function makeGetCommentCountForPost() {
    return reselect_1.createSelector(getAllPosts, function (state, _a) {
        var post = _a.post;
        return state.entities.posts.postsInThread[post ? post.id : ''] || [];
    }, function (state, props) { return props; }, function (posts, postsForThread, _a) {
        var currentPost = _a.post;
        if (!currentPost) {
            return 0;
        }
        var count = 0;
        postsForThread.forEach(function (id) {
            var post = posts[id];
            if (post && post.state !== constants_1.Posts.POST_DELETED && !post_utils_1.isPostEphemeral(post)) {
                count += 1;
            }
        });
        return count;
    });
}
exports.makeGetCommentCountForPost = makeGetCommentCountForPost;
exports.getSearchResults = reselect_1.createSelector(getAllPosts, function (state) { return state.entities.search.results; }, function (posts, postIds) {
    if (!postIds) {
        return [];
    }
    return postIds.map(function (id) { return posts[id]; });
});
// Returns the matched text from the search results, if the server has provided them.
// These matches will only be present if the server is running Mattermost 5.1 or higher
// with Elasticsearch enabled to search posts. Otherwise, null will be returned.
function getSearchMatches(state) {
    return state.entities.search.matches;
}
exports.getSearchMatches = getSearchMatches;
function makeGetMessageInHistoryItem(type) {
    return reselect_1.createSelector(function (state) { return state.entities.posts.messagesHistory; }, function (messagesHistory) {
        var idx = messagesHistory.index[type];
        var messages = messagesHistory.messages;
        if (idx >= 0 && messages && messages.length > idx) {
            return messages[idx];
        }
        return '';
    });
}
exports.makeGetMessageInHistoryItem = makeGetMessageInHistoryItem;
function makeGetPostsForIds() {
    return helpers_1.createIdsSelector(getAllPosts, function (state, postIds) { return postIds; }, function (allPosts, postIds) {
        if (!postIds) {
            return [];
        }
        return postIds.map(function (id) { return allPosts[id]; });
    });
}
exports.makeGetPostsForIds = makeGetPostsForIds;
exports.getLastPostPerChannel = reselect_1.createSelector(getAllPosts, function (state) { return state.entities.posts.postsInChannel; }, function (allPosts, postsInChannel) {
    var e_3, _a;
    var ret = {};
    try {
        for (var _b = tslib_1.__values(Object.entries(postsInChannel)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = tslib_1.__read(_c.value, 2), channelId = _d[0], postsForChannel = _d[1];
            var recentBlock = (postsForChannel).find(function (block) { return block.recent; });
            if (!recentBlock) {
                continue;
            }
            var postId = recentBlock.order[0];
            if (allPosts.hasOwnProperty(postId)) {
                ret[channelId] = allPosts[postId];
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return ret;
});
exports.getMostRecentPostIdInChannel = reselect_1.createSelector(getAllPosts, function (state, channelId) { return getPostIdsInChannel(state, channelId); }, preferences_1.getMyPreferences, function (posts, postIdsInChannel, preferences) {
    if (!postIdsInChannel) {
        return '';
    }
    var key = preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_ADVANCED_SETTINGS, constants_1.Preferences.ADVANCED_FILTER_JOIN_LEAVE);
    var allowSystemMessages = preferences[key] ? preferences[key].value === 'true' : true;
    if (!allowSystemMessages) {
        // return the most recent non-system message in the channel
        var postId = void 0;
        for (var i = 0; i < postIdsInChannel.length; i++) {
            var p = posts[postIdsInChannel[i]];
            if (!p.type || !p.type.startsWith(constants_1.Posts.SYSTEM_MESSAGE_PREFIX)) {
                postId = p.id;
                break;
            }
        }
        return postId;
    }
    // return the most recent message in the channel
    return postIdsInChannel[0];
});
exports.getLatestReplyablePostId = reselect_1.createSelector(exports.getPostsInCurrentChannel, function (posts) {
    if (!posts) {
        return '';
    }
    var latestReplyablePost = posts.find(function (post) { return post.state !== constants_1.Posts.POST_DELETED && !post_utils_1.isSystemMessage(post) && !post_utils_1.isPostEphemeral(post); });
    if (!latestReplyablePost) {
        return '';
    }
    return latestReplyablePost.id;
});
exports.getCurrentUsersLatestPost = reselect_1.createSelector(exports.getPostsInCurrentChannel, common_1.getCurrentUser, function (state, rootId) { return rootId; }, function (posts, currentUser, rootId) {
    if (!posts) {
        return null;
    }
    var lastPost = posts.find(function (post) {
        // don't edit webhook posts, deleted posts, or system messages
        if (post.user_id !== currentUser.id || (post.props && post.props.from_webhook) || post.state === constants_1.Posts.POST_DELETED || post_utils_1.isSystemMessage(post) || post_utils_1.isPostEphemeral(post) || post_utils_1.isPostPendingOrFailed(post)) {
            return false;
        }
        if (rootId) {
            return post.root_id === rootId || post.id === rootId;
        }
        return true;
    });
    return lastPost;
});
function getRecentPostsChunkInChannel(state, channelId) {
    var postsForChannel = state.entities.posts.postsInChannel[channelId];
    if (!postsForChannel) {
        return null;
    }
    return postsForChannel.find(function (block) { return block.recent; });
}
exports.getRecentPostsChunkInChannel = getRecentPostsChunkInChannel;
function getOldestPostsChunkInChannel(state, channelId) {
    var postsForChannel = state.entities.posts.postsInChannel[channelId];
    if (!postsForChannel) {
        return null;
    }
    return postsForChannel.find(function (block) { return block.oldest; });
}
exports.getOldestPostsChunkInChannel = getOldestPostsChunkInChannel;
// getPostIdsInChannel returns the IDs of posts loaded at the bottom of the given channel. It does not include older
// posts such as those loaded by viewing a thread or a permalink.
function getPostIdsInChannel(state, channelId) {
    var recentBlock = getRecentPostsChunkInChannel(state, channelId);
    if (!recentBlock) {
        return null;
    }
    return recentBlock.order;
}
exports.getPostIdsInChannel = getPostIdsInChannel;
function getPostsChunkInChannelAroundTime(state, channelId, timeStamp) {
    var postsEntity = state.entities.posts;
    var postsForChannel = postsEntity.postsInChannel[channelId];
    var posts = postsEntity.posts;
    if (!postsForChannel) {
        return null;
    }
    var blockAroundTimestamp = postsForChannel.find(function (block) {
        var order = block.order;
        var recentPostInBlock = posts[order[0]];
        var oldestPostInBlock = posts[order[order.length - 1]];
        if (recentPostInBlock && oldestPostInBlock) {
            return (recentPostInBlock.create_at >= timeStamp && oldestPostInBlock.create_at <= timeStamp);
        }
        return false;
    });
    return blockAroundTimestamp;
}
exports.getPostsChunkInChannelAroundTime = getPostsChunkInChannelAroundTime;
function getUnreadPostsChunk(state, channelId, timeStamp) {
    var postsEntity = state.entities.posts;
    var posts = postsEntity.posts;
    var recentChunk = getRecentPostsChunkInChannel(state, channelId);
    /* 1. lastViewedAt can be greater than the most recent chunk in case of edited posts etc.
          * return if recent block exists and oldest post is created after the last lastViewedAt timestamp
          i.e all posts are read and the lastViewedAt is greater than the last post

       2. lastViewedAt can be less than the first post in a channel if all the last viewed posts are deleted
          * return if oldest block exist and oldest post created_at is greater than the last viewed post
          i.e all posts are unread so the lastViewedAt is lessthan the first post

      The above two exceptions are added because we cannot select the chunk based on timestamp alone as these cases are out of bounds

      3. Normal cases where there are few unreads and few reads in a chunk as that is how unread API returns data
          * return getPostsChunkInChannelAroundTime
    */
    if (recentChunk) {
        // This would happen if there are no posts in channel.
        // If the system messages are deleted by sys admin.
        // Experimental changes like hiding Join/Leave still will have recent chunk so it follows the default path based on timestamp
        if (!recentChunk.order.length) {
            return recentChunk;
        }
        var order = recentChunk.order;
        var oldestPostInBlock = posts[order[order.length - 1]];
        // check for only oldest posts because this can be higher than the latest post if the last post is edited
        if (oldestPostInBlock.create_at <= timeStamp) {
            return recentChunk;
        }
    }
    var oldestPostsChunk = getOldestPostsChunkInChannel(state, channelId);
    if (oldestPostsChunk && oldestPostsChunk.order.length) {
        var order = oldestPostsChunk.order;
        var oldestPostInBlock = posts[order[order.length - 1]];
        if (oldestPostInBlock.create_at >= timeStamp) {
            return oldestPostsChunk;
        }
    }
    return getPostsChunkInChannelAroundTime(state, channelId, timeStamp);
}
exports.getUnreadPostsChunk = getUnreadPostsChunk;
var isPostIdSending = function (state, postId) {
    return state.entities.posts.pendingPostIds.some(function (sendingPostId) { return sendingPostId === postId; });
};
exports.isPostIdSending = isPostIdSending;
var makeIsPostCommentMention = function () {
    return reselect_1.createSelector(getAllPosts, getPostsInThread, common_1.getCurrentUser, getPost, function (allPosts, postsInThread, currentUser, post) {
        var e_4, _a;
        if (!post) {
            return false;
        }
        var threadRepliedToByCurrentUser = false;
        var isCommentMention = false;
        if (currentUser) {
            var rootId = post.root_id || post.id;
            var threadIds = postsInThread[rootId] || [];
            try {
                for (var threadIds_2 = tslib_1.__values(threadIds), threadIds_2_1 = threadIds_2.next(); !threadIds_2_1.done; threadIds_2_1 = threadIds_2.next()) {
                    var pid = threadIds_2_1.value;
                    var p = allPosts[pid];
                    if (!p) {
                        continue;
                    }
                    if (p.user_id === currentUser.id) {
                        threadRepliedToByCurrentUser = true;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (threadIds_2_1 && !threadIds_2_1.done && (_a = threadIds_2.return)) _a.call(threadIds_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            var rootPost = allPosts[rootId];
            isCommentMention = post_utils_1.isPostCommentMention({ post: post, currentUser: currentUser, threadRepliedToByCurrentUser: threadRepliedToByCurrentUser, rootPost: rootPost });
        }
        return isCommentMention;
    });
};
exports.makeIsPostCommentMention = makeIsPostCommentMention;
function getExpandedLink(state, link) {
    return state.entities.posts.expandedURLs[link];
}
exports.getExpandedLink = getExpandedLink;
//# sourceMappingURL=posts.js.map