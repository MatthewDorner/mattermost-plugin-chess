"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedFromMetadata = exports.fromAutoResponder = exports.isPostCommentMention = exports.comparePosts = exports.isPostPendingOrFailed = exports.shouldFilterJoinLeavePost = exports.getLastCreateAt = exports.canEditPost = exports.canDeletePost = exports.isEdited = exports.isPostOwner = exports.isUserActivityPost = exports.shouldIgnorePost = exports.isPostEphemeral = exports.isFromWebhook = exports.isMeMessage = exports.isSystemMessage = exports.isPostFlagged = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var constants_1 = require("../constants");
var general_1 = require("../selectors/entities/general");
var roles_1 = require("../selectors/entities/roles");
var preference_utils_1 = require("./preference_utils");
function isPostFlagged(postId, myPreferences) {
    var key = preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_FLAGGED_POST, postId);
    return myPreferences.hasOwnProperty(key);
}
exports.isPostFlagged = isPostFlagged;
function isSystemMessage(post) {
    return Boolean(post.type && post.type.startsWith(constants_1.Posts.SYSTEM_MESSAGE_PREFIX));
}
exports.isSystemMessage = isSystemMessage;
function isMeMessage(post) {
    return Boolean(post.type && post.type === constants_1.Posts.POST_TYPES.ME);
}
exports.isMeMessage = isMeMessage;
function isFromWebhook(post) {
    return post.props && post.props.from_webhook;
}
exports.isFromWebhook = isFromWebhook;
function isPostEphemeral(post) {
    return post.type === constants_1.Posts.POST_TYPES.EPHEMERAL || post.type === constants_1.Posts.POST_TYPES.EPHEMERAL_ADD_TO_CHANNEL || post.state === constants_1.Posts.POST_DELETED;
}
exports.isPostEphemeral = isPostEphemeral;
function shouldIgnorePost(post, userId) {
    var postTypeCheck = post.type && (post.type === constants_1.Posts.POST_TYPES.ADD_TO_CHANNEL);
    var userIdCheck = post.props && post.props.addedUserId && (post.props.addedUserId === userId);
    if (postTypeCheck && userIdCheck) {
        return false;
    }
    return constants_1.Posts.IGNORE_POST_TYPES.includes(post.type);
}
exports.shouldIgnorePost = shouldIgnorePost;
function isUserActivityPost(postType) {
    return constants_1.Posts.USER_ACTIVITY_POST_TYPES.includes(postType);
}
exports.isUserActivityPost = isUserActivityPost;
function isPostOwner(userId, post) {
    return userId === post.user_id;
}
exports.isPostOwner = isPostOwner;
function isEdited(post) {
    return post.edit_at > 0;
}
exports.isEdited = isEdited;
function canDeletePost(state, config, license, teamId, channelId, userId, post, isAdmin, isSystemAdmin) {
    if (!post) {
        return false;
    }
    var isOwner = isPostOwner(userId, post);
    if (general_1.hasNewPermissions(state)) {
        var canDelete = roles_1.haveIChannelPermission(state, { team: teamId, channel: channelId, permission: constants_1.Permissions.DELETE_POST });
        if (!isOwner) {
            return canDelete && roles_1.haveIChannelPermission(state, { team: teamId, channel: channelId, permission: constants_1.Permissions.DELETE_OTHERS_POSTS });
        }
        return canDelete;
    }
    // Backwards compatibility with pre-advanced permissions config settings.
    if (license.IsLicensed === 'true') {
        return (config.RestrictPostDelete === constants_1.General.PERMISSIONS_ALL && (isOwner || isAdmin)) ||
            (config.RestrictPostDelete === constants_1.General.PERMISSIONS_TEAM_ADMIN && isAdmin) ||
            (config.RestrictPostDelete === constants_1.General.PERMISSIONS_SYSTEM_ADMIN && isSystemAdmin);
    }
    return isOwner || isAdmin;
}
exports.canDeletePost = canDeletePost;
function canEditPost(state, config, license, teamId, channelId, userId, post) {
    if (!post || isSystemMessage(post)) {
        return false;
    }
    var isOwner = isPostOwner(userId, post);
    var canEdit = true;
    if (general_1.hasNewPermissions(state)) {
        var permission = isOwner ? constants_1.Permissions.EDIT_POST : constants_1.Permissions.EDIT_OTHERS_POSTS;
        canEdit = roles_1.haveIChannelPermission(state, { team: teamId, channel: channelId, permission: permission });
        if (license.IsLicensed === 'true' && config.PostEditTimeLimit !== '-1' && config.PostEditTimeLimit !== -1) {
            var timeLeft = (post.create_at + (config.PostEditTimeLimit * 1000)) - Date.now();
            if (timeLeft <= 0) {
                canEdit = false;
            }
        }
    }
    else {
        // Backwards compatibility with pre-advanced permissions config settings.
        canEdit = isOwner && config.AllowEditPost !== 'never';
        if (config.AllowEditPost === constants_1.General.ALLOW_EDIT_POST_TIME_LIMIT) {
            var timeLeft = (post.create_at + (config.PostEditTimeLimit * 1000)) - Date.now();
            if (timeLeft <= 0) {
                canEdit = false;
            }
        }
    }
    return canEdit;
}
exports.canEditPost = canEditPost;
function getLastCreateAt(postsArray) {
    var createAt = postsArray.map(function (p) { return p.create_at; });
    if (createAt.length) {
        return Reflect.apply(Math.max, null, createAt);
    }
    return 0;
}
exports.getLastCreateAt = getLastCreateAt;
var joinLeavePostTypes = [
    constants_1.Posts.POST_TYPES.JOIN_LEAVE,
    constants_1.Posts.POST_TYPES.JOIN_CHANNEL,
    constants_1.Posts.POST_TYPES.LEAVE_CHANNEL,
    constants_1.Posts.POST_TYPES.ADD_REMOVE,
    constants_1.Posts.POST_TYPES.ADD_TO_CHANNEL,
    constants_1.Posts.POST_TYPES.REMOVE_FROM_CHANNEL,
    constants_1.Posts.POST_TYPES.JOIN_TEAM,
    constants_1.Posts.POST_TYPES.LEAVE_TEAM,
    constants_1.Posts.POST_TYPES.ADD_TO_TEAM,
    constants_1.Posts.POST_TYPES.REMOVE_FROM_TEAM,
    constants_1.Posts.POST_TYPES.COMBINED_USER_ACTIVITY,
];
// Returns true if a post should be hidden when the user has Show Join/Leave Messages disabled
function shouldFilterJoinLeavePost(post, showJoinLeave, currentUsername) {
    if (showJoinLeave) {
        return false;
    }
    // Don't filter out non-join/leave messages
    if (joinLeavePostTypes.indexOf(post.type) === -1) {
        return false;
    }
    // Don't filter out join/leave messages about the current user
    return !isJoinLeavePostForUsername(post, currentUsername);
}
exports.shouldFilterJoinLeavePost = shouldFilterJoinLeavePost;
function isJoinLeavePostForUsername(post, currentUsername) {
    var e_1, _a;
    if (!post.props || !currentUsername) {
        return false;
    }
    if (post.user_activity_posts) {
        try {
            for (var _b = tslib_1.__values(post.user_activity_posts), _c = _b.next(); !_c.done; _c = _b.next()) {
                var childPost = _c.value;
                if (isJoinLeavePostForUsername(childPost, currentUsername)) {
                    // If any of the contained posts are for this user, the client will
                    // need to figure out how to render the post
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return post.props.username === currentUsername ||
        post.props.addedUsername === currentUsername ||
        post.props.removedUsername === currentUsername;
}
function isPostPendingOrFailed(post) {
    return post.failed || post.id === post.pending_post_id;
}
exports.isPostPendingOrFailed = isPostPendingOrFailed;
function comparePosts(a, b) {
    var aIsPendingOrFailed = isPostPendingOrFailed(a);
    var bIsPendingOrFailed = isPostPendingOrFailed(b);
    if (aIsPendingOrFailed && !bIsPendingOrFailed) {
        return -1;
    }
    else if (!aIsPendingOrFailed && bIsPendingOrFailed) {
        return 1;
    }
    if (a.create_at > b.create_at) {
        return -1;
    }
    else if (a.create_at < b.create_at) {
        return 1;
    }
    return 0;
}
exports.comparePosts = comparePosts;
function isPostCommentMention(_a) {
    var post = _a.post, currentUser = _a.currentUser, threadRepliedToByCurrentUser = _a.threadRepliedToByCurrentUser, rootPost = _a.rootPost;
    var commentsNotifyLevel = constants_1.Preferences.COMMENTS_NEVER;
    var isCommentMention = false;
    var threadCreatedByCurrentUser = false;
    if (rootPost && rootPost.user_id === currentUser.id) {
        threadCreatedByCurrentUser = true;
    }
    if (currentUser.notify_props && currentUser.notify_props.comments) {
        commentsNotifyLevel = currentUser.notify_props.comments;
    }
    var notCurrentUser = post.user_id !== currentUser.id || (post.props && post.props.from_webhook);
    if (notCurrentUser) {
        if (commentsNotifyLevel === constants_1.Preferences.COMMENTS_ANY && (threadCreatedByCurrentUser || threadRepliedToByCurrentUser)) {
            isCommentMention = true;
        }
        else if (commentsNotifyLevel === constants_1.Preferences.COMMENTS_ROOT && threadCreatedByCurrentUser) {
            isCommentMention = true;
        }
    }
    return isCommentMention;
}
exports.isPostCommentMention = isPostCommentMention;
function fromAutoResponder(post) {
    return Boolean(post.type && (post.type === constants_1.Posts.SYSTEM_AUTO_RESPONDER));
}
exports.fromAutoResponder = fromAutoResponder;
function getEmbedFromMetadata(metadata) {
    if (!metadata || !metadata.embeds || metadata.embeds.length === 0) {
        return null;
    }
    return metadata.embeds[0];
}
exports.getEmbedFromMetadata = getEmbedFromMetadata;
//# sourceMappingURL=post_utils.js.map