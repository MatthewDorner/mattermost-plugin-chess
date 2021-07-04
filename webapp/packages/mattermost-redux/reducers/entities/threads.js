"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.countsReducer = exports.threadsInTeamReducer = exports.threadsReducer = void 0;
var tslib_1 = require("tslib");
var action_types_1 = require("../../action_types");
var redux_1 = require("redux");
var threadsReducer = function (state, action) {
    var _a, _b, _c;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ThreadTypes.RECEIVED_THREADS: {
            var threads = action.data.threads;
            return tslib_1.__assign(tslib_1.__assign({}, state), threads.reduce(function (results, thread) {
                results[thread.id] = thread;
                return results;
            }, {}));
        }
        case action_types_1.ThreadTypes.RECEIVED_THREAD: {
            var thread = action.data.thread;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[thread.id] = thread, _a));
        }
        case action_types_1.ThreadTypes.READ_CHANGED_THREAD: {
            var _d = action.data, id = _d.id, newUnreadMentions = _d.newUnreadMentions, newUnreadReplies = _d.newUnreadReplies, lastViewedAt = _d.lastViewedAt;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[id] = tslib_1.__assign(tslib_1.__assign({}, (state[id] || {})), { last_viewed_at: lastViewedAt, unread_mentions: newUnreadMentions, unread_replies: newUnreadReplies, is_following: true }), _b));
        }
        case action_types_1.ThreadTypes.FOLLOW_CHANGED_THREAD: {
            var _e = action.data, id = _e.id, following = _e.following;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[id] = tslib_1.__assign(tslib_1.__assign({}, (state[id] || {})), { is_following: following }), _c));
        }
        case action_types_1.ThreadTypes.ALL_TEAM_THREADS_READ: {
            return Object.entries(state).reduce(function (newState, _a) {
                var _b = tslib_1.__read(_a, 2), id = _b[0], thread = _b[1];
                newState[id] = tslib_1.__assign(tslib_1.__assign({}, thread), { unread_mentions: 0, unread_replies: 0 });
                return newState;
            }, {});
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
    }
    return state;
};
exports.threadsReducer = threadsReducer;
var threadsInTeamReducer = function (state, action) {
    var _a, _b;
    var _c;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ThreadTypes.RECEIVED_THREADS: {
            var nextSet_1 = new Set(state[action.data.team_id]);
            action.data.threads.forEach(function (thread) {
                nextSet_1.add(thread.id);
            });
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.team_id] = tslib_1.__spread(nextSet_1), _a));
        }
        case action_types_1.ThreadTypes.RECEIVED_THREAD: {
            if ((_c = state[action.data.team_id]) === null || _c === void 0 ? void 0 : _c.includes(action.data.thread.id)) {
                return state;
            }
            var nextSet = new Set(state[action.data.team_id]);
            nextSet.add(action.data.thread.id);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[action.data.team_id] = tslib_1.__spread(nextSet), _b));
        }
        case action_types_1.TeamTypes.LEAVE_TEAM: {
            var team = action.data;
            if (!state[team.id]) {
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, team.id);
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
    }
    return state;
};
exports.threadsInTeamReducer = threadsInTeamReducer;
var countsReducer = function (state, action) {
    var _a, _b, _c, _d, _e, _f;
    var _g, _h, _j, _k;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ThreadTypes.ALL_TEAM_THREADS_READ: {
            var counts = (_g = state[action.data.team_id]) !== null && _g !== void 0 ? _g : { unread_mentions_per_channel: {} };
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.team_id] = tslib_1.__assign(tslib_1.__assign({}, counts), { unread_mentions_per_channel: {}, total_unread_mentions: 0, total_unread_threads: 0 }), _a));
        }
        case action_types_1.ThreadTypes.READ_CHANGED_THREAD: {
            var _l = action.data, teamId = _l.teamId, channelId = _l.channelId, _m = _l.prevUnreadMentions, prevUnreadMentions = _m === void 0 ? 0 : _m, _o = _l.newUnreadMentions, newUnreadMentions = _o === void 0 ? 0 : _o, _p = _l.prevUnreadReplies, prevUnreadReplies = _p === void 0 ? 0 : _p, _q = _l.newUnreadReplies, newUnreadReplies = _q === void 0 ? 0 : _q;
            var counts = state[teamId] ? tslib_1.__assign({}, state[teamId]) : {
                unread_mentions_per_channel: (_b = {},
                    _b[channelId] = 0,
                    _b),
                total_unread_threads: 0,
                total: 0,
                total_unread_mentions: 0,
            };
            var unreadMentionDiff = newUnreadMentions - prevUnreadMentions;
            if (counts.unread_mentions_per_channel[channelId]) {
                var nc = tslib_1.__assign({}, counts.unread_mentions_per_channel);
                nc[channelId] += unreadMentionDiff;
                counts.unread_mentions_per_channel = nc;
            }
            else {
                counts.unread_mentions_per_channel = (_c = {}, _c[channelId] = newUnreadMentions, _c);
            }
            counts.total_unread_mentions += unreadMentionDiff;
            if (newUnreadReplies > 0 && prevUnreadReplies === 0) {
                counts.total_unread_threads += 1;
            }
            else if (prevUnreadReplies > 0 && newUnreadReplies === 0) {
                counts.total_unread_threads -= 1;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[action.data.teamId] = counts, _d));
        }
        case action_types_1.ThreadTypes.RECEIVED_PER_CHANNEL_MENTION_COUNTS: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[action.data.team_id] = tslib_1.__assign(tslib_1.__assign({}, (_h = state[action.data.team_id]) !== null && _h !== void 0 ? _h : {}), { unread_mentions_per_channel: action.data.counts }), _e));
        }
        case action_types_1.ThreadTypes.RECEIVED_THREADS: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_f = {}, _f[action.data.team_id] = {
                unread_mentions_per_channel: (_k = (_j = state[action.data.team_id]) === null || _j === void 0 ? void 0 : _j.unread_mentions_per_channel) !== null && _k !== void 0 ? _k : {},
                total: action.data.total,
                total_unread_threads: action.data.total_unread_threads,
                total_unread_mentions: action.data.total_unread_mentions,
            }, _f));
        }
        case action_types_1.TeamTypes.LEAVE_TEAM: {
            var team = action.data;
            if (!state[team.id]) {
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, team.id);
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {
                total: 0,
                unread_mentions_per_channel: {},
                total_unread_threads: 0,
                total_unread_mentions: 0,
            };
    }
    return state;
};
exports.countsReducer = countsReducer;
exports.default = redux_1.combineReducers({
    threads: exports.threadsReducer,
    threadsInTeam: exports.threadsInTeamReducer,
    counts: exports.countsReducer,
});
//# sourceMappingURL=threads.js.map