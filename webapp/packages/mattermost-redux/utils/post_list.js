"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineUserActivitySystemPost = exports.comparePostTypes = exports.postTypePriority = exports.makeGenerateCombinedPost = exports.getLastPostIndex = exports.getLastPostId = exports.getFirstPostId = exports.getPostIdsForCombinedUserActivityPost = exports.isCombinedUserActivityPost = exports.getDateForDateLine = exports.isDateLine = exports.isStartOfNewMessages = exports.makeCombineUserActivityPosts = exports.makeFilterPostsAndAddSeparators = exports.makePreparePostIdsForPostList = exports.MAX_COMBINED_SYSTEM_POSTS = exports.START_OF_NEW_MESSAGES = exports.DATE_LINE = exports.COMBINED_USER_ACTIVITY = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var reselect = tslib_1.__importStar(require("reselect"));
var moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
var constants_1 = require("../constants");
var posts_1 = require("../selectors/entities/posts");
var preferences_1 = require("../selectors/entities/preferences");
var timezone_1 = require("../selectors/entities/timezone");
var users_1 = require("../selectors/entities/users");
var helpers_1 = require("./helpers");
var post_utils_1 = require("./post_utils");
var timezone_utils_1 = require("./timezone_utils");
exports.COMBINED_USER_ACTIVITY = 'user-activity-';
exports.DATE_LINE = 'date-';
exports.START_OF_NEW_MESSAGES = 'start-of-new-messages';
exports.MAX_COMBINED_SYSTEM_POSTS = 100;
function shouldShowJoinLeaveMessages(state) {
    // This setting is true or not set if join/leave messages are to be displayed
    return preferences_1.getBool(state, constants_1.Preferences.CATEGORY_ADVANCED_SETTINGS, constants_1.Preferences.ADVANCED_FILTER_JOIN_LEAVE, true);
}
function makePreparePostIdsForPostList() {
    var filterPostsAndAddSeparators = makeFilterPostsAndAddSeparators();
    var combineUserActivityPosts = makeCombineUserActivityPosts();
    return function (state, options) {
        var postIds = filterPostsAndAddSeparators(state, options);
        postIds = combineUserActivityPosts(state, postIds);
        return postIds;
    };
}
exports.makePreparePostIdsForPostList = makePreparePostIdsForPostList;
// Returns a selector that, given the state and an object containing an array of postIds and an optional
// timestamp of when the channel was last read, returns a memoized array of postIds interspersed with
// day indicators and an optional new message indicator.
function makeFilterPostsAndAddSeparators() {
    var getPostsForIds = posts_1.makeGetPostsForIds();
    return helpers_1.createIdsSelector(function (state, _a) {
        var postIds = _a.postIds;
        return getPostsForIds(state, postIds);
    }, function (state, _a) {
        var lastViewedAt = _a.lastViewedAt;
        return lastViewedAt;
    }, function (state, _a) {
        var indicateNewMessages = _a.indicateNewMessages;
        return indicateNewMessages;
    }, function (state) { return state.entities.posts.selectedPostId; }, users_1.getCurrentUser, shouldShowJoinLeaveMessages, timezone_1.isTimezoneEnabled, function (posts, lastViewedAt, indicateNewMessages, selectedPostId, currentUser, showJoinLeave, timeZoneEnabled) {
        if (posts.length === 0 || !currentUser) {
            return [];
        }
        var out = [];
        var lastDate;
        var addedNewMessagesIndicator = false;
        // Iterating through the posts from oldest to newest
        for (var i = posts.length - 1; i >= 0; i--) {
            var post = posts[i];
            if (!post ||
                (post.type === constants_1.Posts.POST_TYPES.EPHEMERAL_ADD_TO_CHANNEL && !selectedPostId)) {
                continue;
            }
            // Filter out join/leave messages if necessary
            if (post_utils_1.shouldFilterJoinLeavePost(post, showJoinLeave, currentUser.username)) {
                continue;
            }
            // Push on a date header if the last post was on a different day than the current one
            var postDate = new Date(post.create_at);
            if (timeZoneEnabled) {
                var currentOffset = postDate.getTimezoneOffset() * 60 * 1000;
                var timezone = timezone_utils_1.getUserCurrentTimezone(currentUser.timezone);
                if (timezone) {
                    var zone = moment_timezone_1.default.tz.zone(timezone);
                    if (zone) {
                        var timezoneOffset = zone.utcOffset(post.create_at) * 60 * 1000;
                        postDate.setTime(post.create_at + (currentOffset - timezoneOffset));
                    }
                }
            }
            if (!lastDate || lastDate.toDateString() !== postDate.toDateString()) {
                out.push(exports.DATE_LINE + postDate.getTime());
                lastDate = postDate;
            }
            if (lastViewedAt &&
                post.create_at > lastViewedAt &&
                (post.user_id !== currentUser.id || post_utils_1.isFromWebhook(post)) &&
                !addedNewMessagesIndicator &&
                indicateNewMessages) {
                out.push(exports.START_OF_NEW_MESSAGES);
                addedNewMessagesIndicator = true;
            }
            out.push(post.id);
        }
        // Flip it back to newest to oldest
        return out.reverse();
    });
}
exports.makeFilterPostsAndAddSeparators = makeFilterPostsAndAddSeparators;
function makeCombineUserActivityPosts() {
    return helpers_1.createIdsSelector(function (state, postIds) { return postIds; }, function (state) { return state.entities.posts.posts; }, function (postIds, posts) {
        var lastPostIsUserActivity = false;
        var combinedCount = 0;
        var out = [];
        var changed = false;
        for (var i = 0; i < postIds.length; i++) {
            var postId = postIds[i];
            if (postId === exports.START_OF_NEW_MESSAGES || postId.startsWith(exports.DATE_LINE)) {
                // Not a post, so it won't be combined
                out.push(postId);
                lastPostIsUserActivity = false;
                combinedCount = 0;
                continue;
            }
            var post = posts[postId];
            var postIsUserActivity = post_utils_1.isUserActivityPost(post.type);
            if (postIsUserActivity && lastPostIsUserActivity && combinedCount < exports.MAX_COMBINED_SYSTEM_POSTS) {
                // Add the ID to the previous combined post
                out[out.length - 1] += '_' + postId;
                combinedCount += 1;
                changed = true;
            }
            else if (postIsUserActivity) {
                // Start a new combined post, even if the "combined" post is only a single post
                out.push(exports.COMBINED_USER_ACTIVITY + postId);
                combinedCount = 1;
                changed = true;
            }
            else {
                out.push(postId);
                combinedCount = 0;
            }
            lastPostIsUserActivity = postIsUserActivity;
        }
        if (!changed) {
            // Nothing was combined, so return the original array
            return postIds;
        }
        return out;
    });
}
exports.makeCombineUserActivityPosts = makeCombineUserActivityPosts;
function isStartOfNewMessages(item) {
    return item === exports.START_OF_NEW_MESSAGES;
}
exports.isStartOfNewMessages = isStartOfNewMessages;
function isDateLine(item) {
    return item.startsWith(exports.DATE_LINE);
}
exports.isDateLine = isDateLine;
function getDateForDateLine(item) {
    return parseInt(item.substring(exports.DATE_LINE.length), 10);
}
exports.getDateForDateLine = getDateForDateLine;
function isCombinedUserActivityPost(item) {
    return (/^user-activity-(?:[^_]+_)*[^_]+$/).test(item);
}
exports.isCombinedUserActivityPost = isCombinedUserActivityPost;
function getPostIdsForCombinedUserActivityPost(item) {
    return item.substring(exports.COMBINED_USER_ACTIVITY.length).split('_');
}
exports.getPostIdsForCombinedUserActivityPost = getPostIdsForCombinedUserActivityPost;
function getFirstPostId(items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (isStartOfNewMessages(item) || isDateLine(item)) {
            // This is not a post at all
            continue;
        }
        if (isCombinedUserActivityPost(item)) {
            // This is a combined post, so find the first post ID from it
            var combinedIds = getPostIdsForCombinedUserActivityPost(item);
            return combinedIds[0];
        }
        // This is a post ID
        return item;
    }
    return '';
}
exports.getFirstPostId = getFirstPostId;
function getLastPostId(items) {
    for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        if (isStartOfNewMessages(item) || isDateLine(item)) {
            // This is not a post at all
            continue;
        }
        if (isCombinedUserActivityPost(item)) {
            // This is a combined post, so find the first post ID from it
            var combinedIds = getPostIdsForCombinedUserActivityPost(item);
            return combinedIds[combinedIds.length - 1];
        }
        // This is a post ID
        return item;
    }
    return '';
}
exports.getLastPostId = getLastPostId;
function getLastPostIndex(postIds) {
    var index = 0;
    for (var i = postIds.length - 1; i > 0; i--) {
        var item = postIds[i];
        if (!isStartOfNewMessages(item) && !isDateLine(item)) {
            index = i;
            break;
        }
    }
    return index;
}
exports.getLastPostIndex = getLastPostIndex;
function makeGenerateCombinedPost() {
    var getPostsForIds = posts_1.makeGetPostsForIds();
    var getPostIds = helpers_1.memoizeResult(getPostIdsForCombinedUserActivityPost);
    return reselect.createSelector(function (state, combinedId) { return combinedId; }, function (state, combinedId) { return getPostsForIds(state, getPostIds(combinedId)); }, function (combinedId, posts) {
        // All posts should be in the same channel
        var channelId = posts[0].channel_id;
        // Assume that the last post is the oldest one
        var createAt = posts[posts.length - 1].create_at;
        var messages = posts.map(function (post) { return post.message; });
        return {
            id: combinedId,
            root_id: '',
            channel_id: channelId,
            create_at: createAt,
            delete_at: 0,
            message: messages.join('\n'),
            props: {
                messages: messages,
                user_activity: combineUserActivitySystemPost(posts),
            },
            state: '',
            system_post_ids: posts.map(function (post) { return post.id; }),
            type: constants_1.Posts.POST_TYPES.COMBINED_USER_ACTIVITY,
            user_activity_posts: posts,
            user_id: '',
            metadata: {},
        };
    });
}
exports.makeGenerateCombinedPost = makeGenerateCombinedPost;
exports.postTypePriority = (_a = {},
    _a[constants_1.Posts.POST_TYPES.JOIN_TEAM] = 0,
    _a[constants_1.Posts.POST_TYPES.ADD_TO_TEAM] = 1,
    _a[constants_1.Posts.POST_TYPES.LEAVE_TEAM] = 2,
    _a[constants_1.Posts.POST_TYPES.REMOVE_FROM_TEAM] = 3,
    _a[constants_1.Posts.POST_TYPES.JOIN_CHANNEL] = 4,
    _a[constants_1.Posts.POST_TYPES.ADD_TO_CHANNEL] = 5,
    _a[constants_1.Posts.POST_TYPES.LEAVE_CHANNEL] = 6,
    _a[constants_1.Posts.POST_TYPES.REMOVE_FROM_CHANNEL] = 7,
    _a[constants_1.Posts.POST_TYPES.PURPOSE_CHANGE] = 8,
    _a[constants_1.Posts.POST_TYPES.HEADER_CHANGE] = 9,
    _a[constants_1.Posts.POST_TYPES.JOIN_LEAVE] = 10,
    _a[constants_1.Posts.POST_TYPES.DISPLAYNAME_CHANGE] = 11,
    _a[constants_1.Posts.POST_TYPES.CONVERT_CHANNEL] = 12,
    _a[constants_1.Posts.POST_TYPES.CHANNEL_DELETED] = 13,
    _a[constants_1.Posts.POST_TYPES.CHANNEL_UNARCHIVED] = 14,
    _a[constants_1.Posts.POST_TYPES.ADD_REMOVE] = 15,
    _a[constants_1.Posts.POST_TYPES.EPHEMERAL] = 16,
    _a);
function comparePostTypes(a, b) {
    return exports.postTypePriority[a.postType] - exports.postTypePriority[b.postType];
}
exports.comparePostTypes = comparePostTypes;
function extractUserActivityData(userActivities) {
    var messageData = [];
    var allUserIds = [];
    var allUsernames = [];
    Object.entries(userActivities).forEach(function (_a) {
        var _b = tslib_1.__read(_a, 2), postType = _b[0], values = _b[1];
        if (postType === constants_1.Posts.POST_TYPES.ADD_TO_TEAM ||
            postType === constants_1.Posts.POST_TYPES.ADD_TO_CHANNEL ||
            postType === constants_1.Posts.POST_TYPES.REMOVE_FROM_CHANNEL) {
            Object.keys(values).map(function (key) { return [key, values[key]]; }).forEach(function (_a) {
                var _b = tslib_1.__read(_a, 2), actorId = _b[0], users = _b[1];
                if (Array.isArray(users)) {
                    throw new Error('Invalid Post activity data');
                }
                var ids = users.ids, usernames = users.usernames;
                messageData.push({ postType: postType, userIds: tslib_1.__spread(usernames, ids), actorId: actorId });
                if (ids.length > 0) {
                    allUserIds.push.apply(allUserIds, tslib_1.__spread(ids));
                }
                if (usernames.length > 0) {
                    allUsernames.push.apply(allUsernames, tslib_1.__spread(usernames));
                }
                allUserIds.push(actorId);
            });
        }
        else {
            if (!Array.isArray(values)) {
                throw new Error('Invalid Post activity data');
            }
            messageData.push({ postType: postType, userIds: values });
            allUserIds.push.apply(allUserIds, tslib_1.__spread(values));
        }
    });
    messageData.sort(comparePostTypes);
    function reduceUsers(acc, curr) {
        if (!acc.includes(curr)) {
            acc.push(curr);
        }
        return acc;
    }
    return {
        allUserIds: allUserIds.reduce(reduceUsers, []),
        allUsernames: allUsernames.reduce(reduceUsers, []),
        messageData: messageData,
    };
}
function combineUserActivitySystemPost(systemPosts) {
    if (systemPosts === void 0) { systemPosts = []; }
    if (systemPosts.length === 0) {
        return null;
    }
    var userActivities = systemPosts.reduce(function (acc, post) {
        var _a, _b;
        var postType = post.type;
        var userActivityProps = acc;
        var combinedPostType = userActivityProps[postType];
        if (postType === constants_1.Posts.POST_TYPES.ADD_TO_TEAM ||
            postType === constants_1.Posts.POST_TYPES.ADD_TO_CHANNEL ||
            postType === constants_1.Posts.POST_TYPES.REMOVE_FROM_CHANNEL) {
            var userId = post.props.addedUserId || post.props.removedUserId;
            var username = post.props.addedUsername || post.props.removedUsername;
            if (combinedPostType) {
                if (Array.isArray(combinedPostType[post.user_id])) {
                    throw new Error('Invalid Post activity data');
                }
                var users = combinedPostType[post.user_id] || { ids: [], usernames: [] };
                if (userId) {
                    if (!users.ids.includes(userId)) {
                        users.ids.push(userId);
                    }
                }
                else if (username && !users.usernames.includes(username)) {
                    users.usernames.push(username);
                }
                combinedPostType[post.user_id] = users;
            }
            else {
                var users = {
                    ids: [],
                    usernames: [],
                };
                if (userId) {
                    users.ids.push(userId);
                }
                else if (username) {
                    users.usernames.push(username);
                }
                userActivityProps[postType] = (_a = {},
                    _a[post.user_id] = users,
                    _a);
            }
        }
        else {
            var propsUserId = post.user_id;
            if (combinedPostType) {
                if (!Array.isArray(combinedPostType)) {
                    throw new Error('Invalid Post activity data');
                }
                if (!combinedPostType.includes(propsUserId)) {
                    userActivityProps[postType] = tslib_1.__spread(combinedPostType, [propsUserId]);
                }
            }
            else {
                userActivityProps = tslib_1.__assign(tslib_1.__assign({}, userActivityProps), (_b = {}, _b[postType] = [propsUserId], _b));
            }
        }
        return userActivityProps;
    }, {});
    return extractUserActivityData(userActivities);
}
exports.combineUserActivitySystemPost = combineUserActivitySystemPost;
//# sourceMappingURL=post_list.js.map