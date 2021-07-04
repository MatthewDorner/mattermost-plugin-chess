"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandedURLs = exports.openGraph = exports.reactions = exports.postsInThread = exports.mergePostOrder = exports.mergePostBlocks = exports.removeNonRecentEmptyPostBlocks = exports.postsInChannel = exports.handlePendingPosts = exports.handlePosts = exports.nextPostsReplies = exports.removeUnneededMetadata = void 0;
var tslib_1 = require("tslib");
var action_types_1 = require("../../action_types");
var constants_1 = require("../../constants");
var post_utils_1 = require("../../utils/post_utils");
function removeUnneededMetadata(post) {
    if (!post.metadata) {
        return post;
    }
    var metadata = tslib_1.__assign({}, post.metadata);
    var changed = false;
    // These fields are stored separately
    if (metadata.emojis) {
        Reflect.deleteProperty(metadata, 'emojis');
        changed = true;
    }
    if (metadata.files) {
        Reflect.deleteProperty(metadata, 'files');
        changed = true;
    }
    if (metadata.reactions) {
        Reflect.deleteProperty(metadata, 'reactions');
        changed = true;
    }
    if (metadata.embeds) {
        var embedsChanged_1 = false;
        var newEmbeds = metadata.embeds.map(function (embed) {
            if (embed.type !== 'opengraph') {
                return embed;
            }
            var newEmbed = tslib_1.__assign({}, embed);
            Reflect.deleteProperty(newEmbed, 'data');
            embedsChanged_1 = true;
            return newEmbed;
        });
        if (embedsChanged_1) {
            metadata.embeds = newEmbeds;
            changed = true;
        }
    }
    if (!changed) {
        // Nothing changed
        return post;
    }
    return tslib_1.__assign(tslib_1.__assign({}, post), { metadata: metadata });
}
exports.removeUnneededMetadata = removeUnneededMetadata;
function nextPostsReplies(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_POST:
        case action_types_1.PostTypes.RECEIVED_NEW_POST: {
            var post = action.data;
            if (!post.id || !post.root_id || !post.reply_count) {
                // Ignoring pending posts and root posts
                return state;
            }
            var newState = tslib_1.__assign({}, state);
            newState[post.root_id] = post.reply_count;
            return newState;
        }
        case action_types_1.PostTypes.RECEIVED_POSTS: {
            var posts = Object.values(action.data.posts);
            if (posts.length === 0) {
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var posts_1 = tslib_1.__values(posts), posts_1_1 = posts_1.next(); !posts_1_1.done; posts_1_1 = posts_1.next()) {
                    var post = posts_1_1.value;
                    if (post.root_id) {
                        nextState[post.root_id] = post.reply_count;
                    }
                    else {
                        nextState[post.id] = post.reply_count;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (posts_1_1 && !posts_1_1.done && (_a = posts_1.return)) _a.call(posts_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        case action_types_1.PostTypes.POST_DELETED: {
            var post = action.data;
            if (!state[post.root_id] && !state[post.id]) {
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            if (post.root_id && state[post.root_id]) {
                nextState[post.root_id] -= 1;
            }
            if (!post.root_id && state[post.id]) {
                Reflect.deleteProperty(nextState, post.id);
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.nextPostsReplies = nextPostsReplies;
function handlePosts(state, action) {
    var e_2, _a, _b, e_3, _c, e_4, _d, e_5, _e;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_POST:
        case action_types_1.PostTypes.RECEIVED_NEW_POST: {
            return handlePostReceived(tslib_1.__assign({}, state), action.data);
        }
        case action_types_1.PostTypes.RECEIVED_POSTS: {
            var posts = Object.values(action.data.posts);
            if (posts.length === 0) {
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var posts_2 = tslib_1.__values(posts), posts_2_1 = posts_2.next(); !posts_2_1.done; posts_2_1 = posts_2.next()) {
                    var post = posts_2_1.value;
                    handlePostReceived(nextState, post);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (posts_2_1 && !posts_2_1.done && (_a = posts_2.return)) _a.call(posts_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return nextState;
        }
        case action_types_1.PostTypes.POST_DELETED: {
            var post = action.data;
            if (!state[post.id]) {
                return state;
            }
            // Mark the post as deleted
            var nextState = tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[post.id] = tslib_1.__assign(tslib_1.__assign({}, state[post.id]), { state: constants_1.Posts.POST_DELETED, file_ids: [], has_reactions: false }), _b));
            try {
                // Remove any of its comments
                for (var _f = tslib_1.__values(Object.values(state)), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var otherPost = _g.value;
                    if (otherPost.root_id === post.id) {
                        Reflect.deleteProperty(nextState, otherPost.id);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return nextState;
        }
        case action_types_1.PostTypes.POST_REMOVED: {
            var post = action.data;
            if (!state[post.id]) {
                return state;
            }
            // Remove the post itself
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, post.id);
            try {
                // Remove any of its comments
                for (var _h = tslib_1.__values(Object.values(state)), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var otherPost = _j.value;
                    if (otherPost.root_id === post.id) {
                        Reflect.deleteProperty(nextState, otherPost.id);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_d = _h.return)) _d.call(_h);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return nextState;
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_DELETED:
        case action_types_1.ChannelTypes.DELETE_CHANNEL_SUCCESS:
        case action_types_1.ChannelTypes.LEAVE_CHANNEL: {
            if (action.data && action.data.viewArchivedChannels) {
                // Nothing to do since we still want to store posts in archived channels
                return state;
            }
            var channelId = action.data.id;
            var postDeleted = false;
            // Remove any posts in the deleted channel
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _k = tslib_1.__values(Object.values(state)), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var post = _l.value;
                    if (post.channel_id === channelId) {
                        Reflect.deleteProperty(nextState, post.id);
                        postDeleted = true;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_e = _k.return)) _e.call(_k);
                }
                finally { if (e_5) throw e_5.error; }
            }
            if (!postDeleted) {
                // Nothing changed
                return state;
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.handlePosts = handlePosts;
function handlePostReceived(nextState, post) {
    if (nextState[post.id] && nextState[post.id].update_at >= post.update_at) {
        // The stored post is newer than the one we've received
        return nextState;
    }
    if (post.delete_at > 0) {
        // We've received a deleted post, so mark the post as deleted if we already have it
        if (nextState[post.id]) {
            nextState[post.id] = tslib_1.__assign(tslib_1.__assign({}, removeUnneededMetadata(post)), { state: constants_1.Posts.POST_DELETED, file_ids: [], has_reactions: false });
        }
    }
    else {
        nextState[post.id] = removeUnneededMetadata(post);
    }
    // Delete any pending post that existed for this post
    if (post.pending_post_id && post.id !== post.pending_post_id && nextState[post.pending_post_id]) {
        Reflect.deleteProperty(nextState, post.pending_post_id);
    }
    return nextState;
}
function handlePendingPosts(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_NEW_POST: {
            var post = action.data;
            if (!post.pending_post_id) {
                // This is not a pending post
                return state;
            }
            var index = state.indexOf(post.pending_post_id);
            if (index !== -1) {
                // An entry already exists for this post
                return state;
            }
            // Add the new pending post ID
            var nextState = tslib_1.__spread(state);
            nextState.push(post.pending_post_id);
            return nextState;
        }
        case action_types_1.PostTypes.POST_REMOVED: {
            var post = action.data;
            var index = state.indexOf(post.id);
            if (index === -1) {
                // There's nothing to remove
                return state;
            }
            // The post has been removed, so remove the entry for it
            var nextState = tslib_1.__spread(state);
            nextState.splice(index, 1);
            return nextState;
        }
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            if (!post.pending_post_id) {
                // This isn't a pending post
                return state;
            }
            var index = state.indexOf(post.pending_post_id);
            if (index === -1) {
                // There's nothing to remove
                return state;
            }
            // The post has actually been created, so remove the entry for it
            var nextState = tslib_1.__spread(state);
            nextState.splice(index, 1);
            return nextState;
        }
        default:
            return state;
    }
}
exports.handlePendingPosts = handlePendingPosts;
function postsInChannel(state, action, prevPosts, nextPosts) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_NEW_POST: {
            var post = action.data;
            var postsForChannel = state[post.channel_id];
            if (!postsForChannel) {
                // Don't save newly created posts until the channel has been loaded
                return state;
            }
            var recentBlockIndex = postsForChannel.findIndex(function (block) { return block.recent; });
            var nextRecentBlock = void 0;
            if (recentBlockIndex === -1) {
                nextRecentBlock = {
                    order: [],
                    recent: true,
                };
            }
            else {
                var recentBlock = postsForChannel[recentBlockIndex];
                nextRecentBlock = tslib_1.__assign(tslib_1.__assign({}, recentBlock), { order: tslib_1.__spread(recentBlock.order) });
            }
            var changed = false;
            // Add the new post to the channel
            if (!nextRecentBlock.order.includes(post.id)) {
                nextRecentBlock.order.unshift(post.id);
                changed = true;
            }
            // If this is a newly created post, remove any pending post that exists for it
            if (post.pending_post_id && post.id !== post.pending_post_id) {
                var index = nextRecentBlock.order.indexOf(post.pending_post_id);
                if (index !== -1) {
                    nextRecentBlock.order.splice(index, 1);
                    // Need to re-sort to make sure any other pending posts come first
                    nextRecentBlock.order.sort(function (a, b) {
                        return post_utils_1.comparePosts(nextPosts[a], nextPosts[b]);
                    });
                    changed = true;
                }
            }
            if (!changed) {
                return state;
            }
            var nextPostsForChannel = tslib_1.__spread(postsForChannel);
            if (recentBlockIndex === -1) {
                nextPostsForChannel.push(nextRecentBlock);
            }
            else {
                nextPostsForChannel[recentBlockIndex] = nextRecentBlock;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[post.channel_id] = nextPostsForChannel, _a));
        }
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            // Receiving a single post doesn't usually affect the order of posts in a channel, except for when we've
            // received a newly created post that was previously stored as pending
            if (!post.pending_post_id) {
                return state;
            }
            var postsForChannel = state[post.channel_id] || [];
            var recentBlockIndex = postsForChannel.findIndex(function (block) { return block.recent; });
            if (recentBlockIndex === -1) {
                // Nothing to do since there's no recent block and only the recent block should contain pending posts
                return state;
            }
            var recentBlock = postsForChannel[recentBlockIndex];
            // Replace the pending post with the newly created one
            var index = recentBlock.order.indexOf(post.pending_post_id);
            if (index === -1) {
                // No pending post found to remove
                return state;
            }
            var nextRecentBlock = tslib_1.__assign(tslib_1.__assign({}, recentBlock), { order: tslib_1.__spread(recentBlock.order) });
            nextRecentBlock.order[index] = post.id;
            var nextPostsForChannel = tslib_1.__spread(postsForChannel);
            nextPostsForChannel[recentBlockIndex] = nextRecentBlock;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[post.channel_id] = nextPostsForChannel, _b));
        }
        case action_types_1.PostTypes.RECEIVED_POSTS_IN_CHANNEL: {
            var recent = action.recent, oldest = action.oldest;
            var order = action.data.order;
            if (order.length === 0 && state[action.channelId]) {
                // No new posts received when we already have posts
                return state;
            }
            var postsForChannel = state[action.channelId] || [];
            var nextPostsForChannel = tslib_1.__spread(postsForChannel);
            if (recent) {
                // The newly received block is now the most recent, so unmark the current most recent block
                var recentBlockIndex = postsForChannel.findIndex(function (block) { return block.recent; });
                if (recentBlockIndex !== -1) {
                    var recentBlock = postsForChannel[recentBlockIndex];
                    if (recentBlock.order.length === order.length &&
                        recentBlock.order[0] === order[0] &&
                        recentBlock.order[recentBlock.order.length - 1] === order[order.length - 1]) {
                        // The newly received posts are identical to the most recent block, so there's nothing to do
                        return state;
                    }
                    // Unmark the most recent block since the new posts are more recent
                    var nextRecentBlock = tslib_1.__assign(tslib_1.__assign({}, recentBlock), { recent: false });
                    nextPostsForChannel[recentBlockIndex] = nextRecentBlock;
                }
            }
            // Add the new most recent block
            nextPostsForChannel.push({
                order: order,
                recent: recent,
                oldest: oldest,
            });
            // Merge overlapping blocks
            nextPostsForChannel = mergePostBlocks(nextPostsForChannel, nextPosts);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[action.channelId] = nextPostsForChannel, _c));
        }
        case action_types_1.PostTypes.RECEIVED_POSTS_AFTER: {
            var order = action.data.order;
            var afterPostId = action.afterPostId;
            if (order.length === 0) {
                // No posts received
                return state;
            }
            var postsForChannel = state[action.channelId] || [];
            // Add a new block including the previous post and then have mergePostBlocks sort out any overlap or duplicates
            var newBlock = {
                order: tslib_1.__spread(order, [afterPostId]),
                recent: action.recent,
            };
            var nextPostsForChannel = tslib_1.__spread(postsForChannel, [newBlock]);
            nextPostsForChannel = mergePostBlocks(nextPostsForChannel, nextPosts);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[action.channelId] = nextPostsForChannel, _d));
        }
        case action_types_1.PostTypes.RECEIVED_POSTS_BEFORE: {
            var order = action.data.order;
            var beforePostId = action.beforePostId, oldest = action.oldest;
            if (order.length === 0) {
                // No posts received
                return state;
            }
            var postsForChannel = state[action.channelId] || [];
            // Add a new block including the next post and then have mergePostBlocks sort out any overlap or duplicates
            var newBlock = {
                order: tslib_1.__spread([beforePostId], order),
                recent: false,
                oldest: oldest,
            };
            var nextPostsForChannel = tslib_1.__spread(postsForChannel, [newBlock]);
            nextPostsForChannel = mergePostBlocks(nextPostsForChannel, nextPosts);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[action.channelId] = nextPostsForChannel, _e));
        }
        case action_types_1.PostTypes.RECEIVED_POSTS_SINCE: {
            var order = action.data.order;
            if (order.length === 0 && state[action.channelId]) {
                // No new posts received when we already have posts
                return state;
            }
            var postsForChannel = state[action.channelId] || [];
            var recentBlockIndex = postsForChannel.findIndex(function (block) { return block.recent; });
            if (recentBlockIndex === -1) {
                // Nothing to do since this shouldn't be dispatched if we haven't loaded the most recent posts yet
                return state;
            }
            var recentBlock = postsForChannel[recentBlockIndex];
            var mostOldestCreateAt = nextPosts[recentBlock.order[recentBlock.order.length - 1]].create_at;
            var nextRecentBlock = tslib_1.__assign(tslib_1.__assign({}, recentBlock), { order: tslib_1.__spread(recentBlock.order) });
            // Add any new posts to the most recent block while skipping ones that were only updated
            for (var i = order.length - 1; i >= 0; i--) {
                var postId = order[i];
                if (!nextPosts[postId]) {
                    // the post was removed from the list
                    continue;
                }
                if (nextPosts[postId].create_at <= mostOldestCreateAt) {
                    // This is an old post
                    continue;
                }
                if (nextRecentBlock.order.indexOf(postId) !== -1) {
                    // This postId exists so no need to add it again
                    continue;
                }
                // This post is newer than what we have
                nextRecentBlock.order.unshift(postId);
            }
            if (nextRecentBlock.order.length === recentBlock.order.length) {
                // Nothing was added
                return state;
            }
            nextRecentBlock.order.sort(function (a, b) {
                return post_utils_1.comparePosts(nextPosts[a], nextPosts[b]);
            });
            var nextPostsForChannel = tslib_1.__spread(postsForChannel);
            nextPostsForChannel[recentBlockIndex] = nextRecentBlock;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_f = {}, _f[action.channelId] = nextPostsForChannel, _f));
        }
        case action_types_1.PostTypes.POST_DELETED: {
            var post_1 = action.data;
            // Deleting a post removes its comments from the order, but does not remove the post itself
            var postsForChannel = state[post_1.channel_id] || [];
            if (postsForChannel.length === 0) {
                return state;
            }
            var changed = false;
            var nextPostsForChannel = tslib_1.__spread(postsForChannel);
            for (var i = 0; i < nextPostsForChannel.length; i++) {
                var block = nextPostsForChannel[i];
                // Remove any comments for this post
                var nextOrder = block.order.filter(function (postId) { return prevPosts[postId].root_id !== post_1.id; });
                if (nextOrder.length !== block.order.length) {
                    nextPostsForChannel[i] = tslib_1.__assign(tslib_1.__assign({}, block), { order: nextOrder });
                    changed = true;
                }
            }
            if (!changed) {
                // Nothing was removed
                return state;
            }
            nextPostsForChannel = removeNonRecentEmptyPostBlocks(nextPostsForChannel);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_g = {}, _g[post_1.channel_id] = nextPostsForChannel, _g));
        }
        case action_types_1.PostTypes.POST_REMOVED: {
            var post_2 = action.data;
            // Removing a post removes it as well as its comments
            var postsForChannel = state[post_2.channel_id] || [];
            if (postsForChannel.length === 0) {
                return state;
            }
            var changed = false;
            // Remove the post and its comments from the channel
            var nextPostsForChannel = tslib_1.__spread(postsForChannel);
            for (var i = 0; i < nextPostsForChannel.length; i++) {
                var block = nextPostsForChannel[i];
                var nextOrder = block.order.filter(function (postId) { return postId !== post_2.id && prevPosts[postId].root_id !== post_2.id; });
                if (nextOrder.length !== block.order.length) {
                    nextPostsForChannel[i] = tslib_1.__assign(tslib_1.__assign({}, block), { order: nextOrder });
                    changed = true;
                }
            }
            if (!changed) {
                // Nothing was removed
                return state;
            }
            nextPostsForChannel = removeNonRecentEmptyPostBlocks(nextPostsForChannel);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_h = {}, _h[post_2.channel_id] = nextPostsForChannel, _h));
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_DELETED:
        case action_types_1.ChannelTypes.DELETE_CHANNEL_SUCCESS:
        case action_types_1.ChannelTypes.LEAVE_CHANNEL: {
            if (action.data && action.data.viewArchivedChannels) {
                // Nothing to do since we still want to store posts in archived channels
                return state;
            }
            var channelId = action.data.id;
            if (!state[channelId]) {
                // Nothing to do since we have no posts for this channel
                return state;
            }
            // Remove the entry for the deleted channel
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, channelId);
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.postsInChannel = postsInChannel;
function removeNonRecentEmptyPostBlocks(blocks) {
    return blocks.filter(function (block) { return block.order.length !== 0 || block.recent; });
}
exports.removeNonRecentEmptyPostBlocks = removeNonRecentEmptyPostBlocks;
function mergePostBlocks(blocks, posts) {
    var nextBlocks = tslib_1.__spread(blocks);
    // Remove any blocks that may have become empty by removing posts
    nextBlocks = removeNonRecentEmptyPostBlocks(blocks);
    // If a channel does not have any posts(Experimental feature where join and leave messages don't exist)
    // return the previous state i.e an empty block
    if (!nextBlocks.length) {
        return blocks;
    }
    // Sort blocks so that the most recent one comes first
    nextBlocks.sort(function (a, b) {
        var aStartsAt = posts[a.order[0]].create_at;
        var bStartsAt = posts[b.order[0]].create_at;
        return bStartsAt - aStartsAt;
    });
    // Merge adjacent blocks
    var i = 0;
    while (i < nextBlocks.length - 1) {
        // Since we know the start of a is more recent than the start of b, they'll overlap if the last post in a is
        // older than the first post in b
        var a = nextBlocks[i];
        var aEndsAt = posts[a.order[a.order.length - 1]].create_at;
        var b = nextBlocks[i + 1];
        var bStartsAt = posts[b.order[0]].create_at;
        if (aEndsAt <= bStartsAt) {
            // The blocks overlap, so combine them and remove the second block
            nextBlocks[i] = {
                order: mergePostOrder(a.order, b.order, posts),
            };
            nextBlocks[i].recent = a.recent || b.recent;
            nextBlocks[i].oldest = a.oldest || b.oldest;
            nextBlocks.splice(i + 1, 1);
            // Do another iteration on this index since it may need to be merged into the next
        }
        else {
            // The blocks don't overlap, so move on to the next one
            i += 1;
        }
    }
    if (blocks.length === nextBlocks.length) {
        // No changes were made
        return blocks;
    }
    return nextBlocks;
}
exports.mergePostBlocks = mergePostBlocks;
function mergePostOrder(left, right, posts) {
    var e_6, _a;
    var result = tslib_1.__spread(left);
    // Add without duplicates
    var seen = new Set(left);
    try {
        for (var right_1 = tslib_1.__values(right), right_1_1 = right_1.next(); !right_1_1.done; right_1_1 = right_1.next()) {
            var id = right_1_1.value;
            if (seen.has(id)) {
                continue;
            }
            result.push(id);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (right_1_1 && !right_1_1.done && (_a = right_1.return)) _a.call(right_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    if (result.length === left.length) {
        // No new items added
        return left;
    }
    // Re-sort so that the most recent post comes first
    result.sort(function (a, b) { return posts[b].create_at - posts[a].create_at; });
    return result;
}
exports.mergePostOrder = mergePostOrder;
function postsInThread(state, action, prevPosts) {
    var _a, e_7, _b, e_8, _c, _d, _e, e_9, _f;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_NEW_POST:
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            if (!post.root_id) {
                // Only store comments, not the root post
                return state;
            }
            var postsForThread = state[post.root_id] || [];
            var nextPostsForThread = tslib_1.__spread(postsForThread);
            var changed = false;
            if (!postsForThread.includes(post.id)) {
                nextPostsForThread.push(post.id);
                changed = true;
            }
            // If this is a new non-pending post, remove any pending post that exists for it
            if (post.pending_post_id && post.id !== post.pending_post_id) {
                var index = nextPostsForThread.indexOf(post.pending_post_id);
                if (index !== -1) {
                    nextPostsForThread.splice(index, 1);
                    changed = true;
                }
            }
            if (!changed) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[post.root_id] = nextPostsForThread, _a));
        }
        case action_types_1.PostTypes.RECEIVED_POSTS_AFTER:
        case action_types_1.PostTypes.RECEIVED_POSTS_BEFORE:
        case action_types_1.PostTypes.RECEIVED_POSTS_IN_CHANNEL:
        case action_types_1.PostTypes.RECEIVED_POSTS_SINCE: {
            var newPosts = Object.values(action.data.posts);
            if (newPosts.length === 0) {
                // Nothing to add
                return state;
            }
            var nextState = {};
            try {
                for (var newPosts_1 = tslib_1.__values(newPosts), newPosts_1_1 = newPosts_1.next(); !newPosts_1_1.done; newPosts_1_1 = newPosts_1.next()) {
                    var post = newPosts_1_1.value;
                    if (!post.root_id) {
                        // Only store comments, not the root post
                        continue;
                    }
                    var postsForThread = state[post.root_id] || [];
                    var nextPostsForThread = nextState[post.root_id] || tslib_1.__spread(postsForThread);
                    // Add the post to the thread
                    if (!nextPostsForThread.includes(post.id)) {
                        nextPostsForThread.push(post.id);
                    }
                    nextState[post.root_id] = nextPostsForThread;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (newPosts_1_1 && !newPosts_1_1.done && (_b = newPosts_1.return)) _b.call(newPosts_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            if (Object.keys(nextState).length === 0) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), nextState);
        }
        case action_types_1.PostTypes.RECEIVED_POSTS_IN_THREAD: {
            var newPosts = Object.values(action.data.posts);
            if (newPosts.length === 0) {
                // Nothing to add
                return state;
            }
            var postsForThread = state[action.rootId] || [];
            var nextPostsForThread = tslib_1.__spread(postsForThread);
            try {
                for (var newPosts_2 = tslib_1.__values(newPosts), newPosts_2_1 = newPosts_2.next(); !newPosts_2_1.done; newPosts_2_1 = newPosts_2.next()) {
                    var post = newPosts_2_1.value;
                    if (post.root_id !== action.rootId) {
                        // Only store comments
                        continue;
                    }
                    if (nextPostsForThread.includes(post.id)) {
                        // Don't store duplicates
                        continue;
                    }
                    nextPostsForThread.push(post.id);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (newPosts_2_1 && !newPosts_2_1.done && (_c = newPosts_2.return)) _c.call(newPosts_2);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[action.rootId] = nextPostsForThread, _d));
        }
        case action_types_1.PostTypes.POST_DELETED: {
            var post = action.data;
            var postsForThread = state[post.id];
            if (!postsForThread) {
                // Nothing to remove
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, post.id);
            return nextState;
        }
        case action_types_1.PostTypes.POST_REMOVED: {
            var post_3 = action.data;
            if (post_3.root_id) {
                // This is a comment, so remove it from the thread
                var postsForThread_1 = state[post_3.root_id];
                if (!postsForThread_1) {
                    return state;
                }
                var index = postsForThread_1.findIndex(function (postId) { return postId === post_3.id; });
                if (index === -1) {
                    return state;
                }
                var nextPostsForThread = tslib_1.__spread(postsForThread_1);
                nextPostsForThread.splice(index, 1);
                return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[post_3.root_id] = nextPostsForThread, _e));
            }
            // This is not a comment, so remove any comments on it
            var postsForThread = state[post_3.id];
            if (!postsForThread) {
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, post_3.id);
            return nextState;
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_DELETED:
        case action_types_1.ChannelTypes.DELETE_CHANNEL_SUCCESS:
        case action_types_1.ChannelTypes.LEAVE_CHANNEL: {
            if (action.data && action.data.viewArchivedChannels) {
                // Nothing to do since we still want to store posts in archived channels
                return state;
            }
            var channelId = action.data.id;
            var postDeleted = false;
            // Remove entries for any thread in the channel
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _g = tslib_1.__values(Object.keys(state)), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var rootId = _h.value;
                    if (prevPosts[rootId] && prevPosts[rootId].channel_id === channelId) {
                        Reflect.deleteProperty(nextState, rootId);
                        postDeleted = true;
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_f = _g.return)) _f.call(_g);
                }
                finally { if (e_9) throw e_9.error; }
            }
            if (!postDeleted) {
                // Nothing was actually removed
                return state;
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.postsInThread = postsInThread;
function selectedPostId(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_POST_SELECTED:
            return action.data;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return '';
        default:
            return state;
    }
}
function currentFocusedPostId(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_FOCUSED_POST:
            return action.data;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return '';
        default:
            return state;
    }
}
function reactions(state, action) {
    var _a, _b, _c;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_REACTIONS: {
            var reactionsList = action.data;
            var nextReactions_1 = {};
            reactionsList.forEach(function (reaction) {
                nextReactions_1[reaction.user_id + '-' + reaction.emoji_name] = reaction;
            });
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.postId] = nextReactions_1, _a));
        }
        case action_types_1.PostTypes.RECEIVED_REACTION: {
            var reaction = action.data;
            var nextReactions = tslib_1.__assign({}, (state[reaction.post_id] || {}));
            nextReactions[reaction.user_id + '-' + reaction.emoji_name] = reaction;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[reaction.post_id] = nextReactions, _b));
        }
        case action_types_1.PostTypes.REACTION_DELETED: {
            var reaction = action.data;
            var nextReactions = tslib_1.__assign({}, (state[reaction.post_id] || {}));
            if (!nextReactions[reaction.user_id + '-' + reaction.emoji_name]) {
                return state;
            }
            Reflect.deleteProperty(nextReactions, reaction.user_id + '-' + reaction.emoji_name);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[reaction.post_id] = nextReactions, _c));
        }
        case action_types_1.PostTypes.RECEIVED_NEW_POST:
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            return storeReactionsForPost(state, post);
        }
        case action_types_1.PostTypes.RECEIVED_POSTS: {
            var posts = Object.values(action.data.posts);
            return posts.reduce(storeReactionsForPost, state);
        }
        case action_types_1.PostTypes.POST_DELETED:
        case action_types_1.PostTypes.POST_REMOVED: {
            var post = action.data;
            if (post && state[post.id]) {
                var nextState = tslib_1.__assign({}, state);
                Reflect.deleteProperty(nextState, post.id);
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
exports.reactions = reactions;
function storeReactionsForPost(state, post) {
    var e_10, _a, _b;
    if (!post.metadata || !post.metadata.reactions || post.delete_at > 0) {
        return state;
    }
    var reactionsForPost = {};
    if (post.metadata.reactions && post.metadata.reactions.length > 0) {
        try {
            for (var _c = tslib_1.__values(post.metadata.reactions), _d = _c.next(); !_d.done; _d = _c.next()) {
                var reaction = _d.value;
                reactionsForPost[reaction.user_id + '-' + reaction.emoji_name] = reaction;
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_10) throw e_10.error; }
        }
    }
    return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[post.id] = reactionsForPost, _b));
}
function openGraph(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.PostTypes.RECEIVED_OPEN_GRAPH_METADATA: {
            var nextState = tslib_1.__assign({}, state);
            nextState[action.url] = action.data;
            return nextState;
        }
        case action_types_1.PostTypes.RECEIVED_NEW_POST:
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            return storeOpenGraphForPost(state, post);
        }
        case action_types_1.PostTypes.RECEIVED_POSTS: {
            var posts = Object.values(action.data.posts);
            return posts.reduce(storeOpenGraphForPost, state);
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.openGraph = openGraph;
function storeOpenGraphForPost(state, post) {
    if (!post.metadata || !post.metadata.embeds) {
        return state;
    }
    return post.metadata.embeds.reduce(function (nextState, embed) {
        var _a, _b, _c;
        if (embed.type !== 'opengraph' || !embed.data) {
            // Not an OpenGraph embed
            return nextState;
        }
        var postIdState = nextState[post.id] ? tslib_1.__assign(tslib_1.__assign({}, nextState[post.id]), (_a = {}, _a[embed.url] = embed.data, _a)) : (_b = {}, _b[embed.url] = embed.data, _b);
        return tslib_1.__assign(tslib_1.__assign({}, nextState), (_c = {}, _c[post.id] = postIdState, _c));
    }, state);
}
function messagesHistory(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.PostTypes.ADD_MESSAGE_INTO_HISTORY: {
            var nextIndex = {};
            var nextMessages = state.messages ? tslib_1.__spread(state.messages) : [];
            nextMessages.push(action.data);
            nextIndex[constants_1.Posts.MESSAGE_TYPES.POST] = nextMessages.length;
            nextIndex[constants_1.Posts.MESSAGE_TYPES.COMMENT] = nextMessages.length;
            if (nextMessages.length > constants_1.Posts.MAX_PREV_MSGS) {
                nextMessages = nextMessages.slice(1, constants_1.Posts.MAX_PREV_MSGS + 1);
            }
            return {
                messages: nextMessages,
                index: nextIndex,
            };
        }
        case action_types_1.PostTypes.RESET_HISTORY_INDEX: {
            var index = {};
            index[constants_1.Posts.MESSAGE_TYPES.POST] = -1;
            index[constants_1.Posts.MESSAGE_TYPES.COMMENT] = -1;
            var messages = state.messages || [];
            var nextIndex = state.index ? tslib_1.__assign({}, state.index) : index;
            nextIndex[action.data] = messages.length;
            return {
                messages: state.messages,
                index: nextIndex,
            };
        }
        case action_types_1.PostTypes.MOVE_HISTORY_INDEX_BACK: {
            var index = {};
            index[constants_1.Posts.MESSAGE_TYPES.POST] = -1;
            index[constants_1.Posts.MESSAGE_TYPES.COMMENT] = -1;
            var nextIndex = state.index ? tslib_1.__assign({}, state.index) : index;
            if (nextIndex[action.data] > 0) {
                nextIndex[action.data]--;
            }
            return {
                messages: state.messages,
                index: nextIndex,
            };
        }
        case action_types_1.PostTypes.MOVE_HISTORY_INDEX_FORWARD: {
            var index = {};
            index[constants_1.Posts.MESSAGE_TYPES.POST] = -1;
            index[constants_1.Posts.MESSAGE_TYPES.COMMENT] = -1;
            var messages = state.messages || [];
            var nextIndex = state.index ? tslib_1.__assign({}, state.index) : index;
            if (nextIndex[action.data] < messages.length) {
                nextIndex[action.data]++;
            }
            return {
                messages: state.messages,
                index: nextIndex,
            };
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS: {
            var index = {};
            index[constants_1.Posts.MESSAGE_TYPES.POST] = -1;
            index[constants_1.Posts.MESSAGE_TYPES.COMMENT] = -1;
            return {
                messages: [],
                index: index,
            };
        }
        default:
            return state;
    }
}
function expandedURLs(state, action) {
    var _a, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GeneralTypes.REDIRECT_LOCATION_SUCCESS:
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.url] = action.data.location, _a));
        case action_types_1.GeneralTypes.REDIRECT_LOCATION_FAILURE:
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[action.data.url] = action.data.url, _b));
        default:
            return state;
    }
}
exports.expandedURLs = expandedURLs;
function reducer(state, action) {
    if (state === void 0) { state = {}; }
    var nextPosts = handlePosts(state.posts, action);
    var nextPostsInChannel = postsInChannel(state.postsInChannel, action, state.posts, nextPosts);
    var nextState = {
        // Object mapping post ids to post objects
        posts: nextPosts,
        // Object mapping post ids to replies count
        postsReplies: nextPostsReplies(state.postsReplies, action),
        // Array that contains the pending post ids for those messages that are in transition to being created
        pendingPostIds: handlePendingPosts(state.pendingPostIds, action),
        // Object mapping channel ids to an array of posts ids in that channel with the most recent post first
        postsInChannel: nextPostsInChannel,
        // Object mapping post root ids to an array of posts ids of comments (but not the root post) in that thread
        // with no guaranteed order
        postsInThread: postsInThread(state.postsInThread, action, state.posts),
        // The current selected post
        selectedPostId: selectedPostId(state.selectedPostId, action),
        // The current selected focused post (permalink view)
        currentFocusedPostId: currentFocusedPostId(state.currentFocusedPostId, action),
        // Object mapping post ids to an object of emoji reactions using userId-emojiName as keys
        reactions: reactions(state.reactions, action),
        // Object mapping URLs to their relevant opengraph metadata for link previews
        openGraph: openGraph(state.openGraph, action),
        // History of posts and comments
        messagesHistory: messagesHistory(state.messagesHistory, action),
        expandedURLs: expandedURLs(state.expandedURLs, action),
    };
    if (state.posts === nextState.posts && state.postsInChannel === nextState.postsInChannel &&
        state.postsInThread === nextState.postsInThread &&
        state.pendingPostIds === nextState.pendingPostIds &&
        state.selectedPostId === nextState.selectedPostId &&
        state.currentFocusedPostId === nextState.currentFocusedPostId &&
        state.reactions === nextState.reactions &&
        state.openGraph === nextState.openGraph &&
        state.messagesHistory === nextState.messagesHistory &&
        state.expandedURLs === nextState.expandedURLs) {
        // None of the children have changed so don't even let the parent object change
        return state;
    }
    return nextState;
}
exports.default = reducer;
//# sourceMappingURL=posts.js.map