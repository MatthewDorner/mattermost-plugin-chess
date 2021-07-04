"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.setThreadFollow = exports.handleFollowChanged = exports.handleReadChanged = exports.updateThreadRead = exports.markAllThreadsInTeamRead = exports.handleAllMarkedRead = exports.getThread = exports.handleThreadArrived = exports.getThreadMentionCountsByChannel = exports.getThreads = void 0;
var tslib_1 = require("tslib");
var action_types_1 = require("../action_types");
var client_1 = require("../client");
var threads_1 = tslib_1.__importDefault(require("../constants/threads"));
var errors_1 = require("./errors");
var helpers_1 = require("./helpers");
function getThreads(userId, teamId, _a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, _c = _b.before, before = _c === void 0 ? '' : _c, _d = _b.after, after = _d === void 0 ? '' : _d, _e = _b.perPage, perPage = _e === void 0 ? threads_1.default.THREADS_CHUNK_SIZE : _e, _f = _b.unread, unread = _f === void 0 ? false : _f;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var entities, userThreadList, error_1;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    entities = getState().entities;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getUserThreads(userId, teamId, { before: before, after: after, pageSize: perPage, extended: true, unread: unread })];
                case 2:
                    userThreadList = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _d.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(errors_1.logError(error_1));
                    return [2 /*return*/, { error: error_1 }];
                case 4:
                    if ((_a = userThreadList === null || userThreadList === void 0 ? void 0 : userThreadList.threads) === null || _a === void 0 ? void 0 : _a.length) {
                        dispatch({
                            type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
                            data: userThreadList.threads.map(function (_a) {
                                var participants = _a.participants;
                                return participants.filter(function (user) { return user.id !== entities.users.currentUserId; });
                            }).flat(),
                        });
                        dispatch({
                            type: action_types_1.PostTypes.RECEIVED_POSTS,
                            data: { posts: userThreadList.threads.map(function (_a) {
                                    var post = _a.post;
                                    return post;
                                }) },
                        });
                    }
                    dispatch({
                        type: action_types_1.ThreadTypes.RECEIVED_THREADS,
                        data: tslib_1.__assign(tslib_1.__assign({}, userThreadList), { threads: (_c = (_b = userThreadList === null || userThreadList === void 0 ? void 0 : userThreadList.threads) === null || _b === void 0 ? void 0 : _b.map(function (thread) { return (tslib_1.__assign(tslib_1.__assign({}, thread), { is_following: true })); })) !== null && _c !== void 0 ? _c : [], team_id: teamId }),
                    });
                    return [2 /*return*/, { data: userThreadList }];
            }
        });
    }); };
}
exports.getThreads = getThreads;
function getThreadMentionCountsByChannel(teamId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, currentUserId, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    currentUserId = getState().entities.users.currentUserId;
                    return [4 /*yield*/, client_1.Client4.getThreadMentionCountsByChannel(currentUserId, teamId)];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(errors_1.logError(error_2));
                    return [2 /*return*/, { error: error_2 }];
                case 3:
                    dispatch({
                        type: action_types_1.ThreadTypes.RECEIVED_PER_CHANNEL_MENTION_COUNTS,
                        data: {
                            counts: result,
                            team_id: teamId,
                        },
                    });
                    return [2 /*return*/, { data: result }];
            }
        });
    }); };
}
exports.getThreadMentionCountsByChannel = getThreadMentionCountsByChannel;
function handleThreadArrived(dispatch, getState, threadData, teamId) {
    var entities = getState().entities;
    var thread = tslib_1.__assign(tslib_1.__assign({}, threadData), { is_following: true });
    dispatch({
        type: action_types_1.UserTypes.RECEIVED_PROFILES_LIST,
        data: thread.participants.filter(function (user) { return user.id !== entities.users.currentUserId; }),
    });
    dispatch({
        type: action_types_1.PostTypes.RECEIVED_POSTS,
        data: { posts: [thread.post] },
    });
    dispatch({
        type: action_types_1.ThreadTypes.RECEIVED_THREAD,
        data: {
            thread: thread,
            team_id: teamId,
        },
    });
    var oldThreadData = entities.threads.threads[threadData.id];
    handleReadChanged(dispatch, thread.id, teamId, thread.post.channel_id, {
        lastViewedAt: thread.last_viewed_at,
        prevUnreadMentions: oldThreadData === null || oldThreadData === void 0 ? void 0 : oldThreadData.unread_mentions,
        newUnreadMentions: thread.unread_mentions,
        prevUnreadReplies: oldThreadData === null || oldThreadData === void 0 ? void 0 : oldThreadData.unread_replies,
        newUnreadReplies: thread.unread_replies,
    });
    return thread;
}
exports.handleThreadArrived = handleThreadArrived;
function getThread(userId, teamId, threadId, extended) {
    var _this = this;
    if (extended === void 0) { extended = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var thread, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getUserThread(userId, teamId, threadId, extended)];
                case 1:
                    thread = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(errors_1.logError(error_3));
                    return [2 /*return*/, { error: error_3 }];
                case 3:
                    if (thread) {
                        thread = handleThreadArrived(dispatch, getState, thread, teamId);
                    }
                    return [2 /*return*/, { data: thread }];
            }
        });
    }); };
}
exports.getThread = getThread;
function handleAllMarkedRead(dispatch, teamId) {
    dispatch({
        type: action_types_1.ThreadTypes.ALL_TEAM_THREADS_READ,
        data: {
            team_id: teamId,
        },
    });
}
exports.handleAllMarkedRead = handleAllMarkedRead;
function markAllThreadsInTeamRead(userId, teamId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateThreadsReadForUser(userId, teamId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch(errors_1.logError(error_4));
                    return [2 /*return*/, { error: error_4 }];
                case 3:
                    handleAllMarkedRead(dispatch, teamId);
                    return [2 /*return*/, {}];
            }
        });
    }); };
}
exports.markAllThreadsInTeamRead = markAllThreadsInTeamRead;
function updateThreadRead(userId, teamId, threadId, timestamp) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.updateThreadReadForUser(userId, teamId, threadId, timestamp)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(errors_1.logError(error_5));
                    return [2 /*return*/, { error: error_5 }];
                case 3: return [2 /*return*/, {}];
            }
        });
    }); };
}
exports.updateThreadRead = updateThreadRead;
function handleReadChanged(dispatch, threadId, teamId, channelId, _a) {
    var lastViewedAt = _a.lastViewedAt, prevUnreadMentions = _a.prevUnreadMentions, newUnreadMentions = _a.newUnreadMentions, prevUnreadReplies = _a.prevUnreadReplies, newUnreadReplies = _a.newUnreadReplies;
    dispatch({
        type: action_types_1.ThreadTypes.READ_CHANGED_THREAD,
        data: {
            id: threadId,
            teamId: teamId,
            channelId: channelId,
            lastViewedAt: lastViewedAt,
            prevUnreadMentions: prevUnreadMentions,
            newUnreadMentions: newUnreadMentions,
            prevUnreadReplies: prevUnreadReplies,
            newUnreadReplies: newUnreadReplies,
        },
    });
}
exports.handleReadChanged = handleReadChanged;
function handleFollowChanged(dispatch, threadId, teamId, following) {
    dispatch({
        type: action_types_1.ThreadTypes.FOLLOW_CHANGED_THREAD,
        data: {
            id: threadId,
            team_id: teamId,
            following: following,
        },
    });
}
exports.handleFollowChanged = handleFollowChanged;
function setThreadFollow(userId, teamId, threadId, newState) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleFollowChanged(dispatch, threadId, teamId, newState);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.updateThreadFollowForUser(userId, teamId, threadId, newState)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_6, dispatch, getState);
                    dispatch(errors_1.logError(error_6));
                    return [2 /*return*/, { error: error_6 }];
                case 4: return [2 /*return*/, {}];
            }
        });
    }); };
}
exports.setThreadFollow = setThreadFollow;
//# sourceMappingURL=threads.js.map