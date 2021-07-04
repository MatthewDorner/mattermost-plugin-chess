"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadThreadOrderInCurrentTeam = exports.getThreadOrderInCurrentTeam = exports.getThread = exports.getThreads = exports.getThreadCountsInCurrentTeam = exports.getTeamThreadCounts = exports.getThreadCounts = exports.getThreadsInCurrentTeam = exports.getThreadsInTeam = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var teams_1 = require("./teams");
function getThreadsInTeam(state) {
    return state.entities.threads.threadsInTeam;
}
exports.getThreadsInTeam = getThreadsInTeam;
exports.getThreadsInCurrentTeam = reselect_1.createSelector(teams_1.getCurrentTeamId, getThreadsInTeam, function (currentTeamId, threadsInTeam) {
    var _a;
    return (_a = threadsInTeam === null || threadsInTeam === void 0 ? void 0 : threadsInTeam[currentTeamId]) !== null && _a !== void 0 ? _a : [];
});
function getThreadCounts(state) {
    return state.entities.threads.counts;
}
exports.getThreadCounts = getThreadCounts;
function getTeamThreadCounts(state, teamId) {
    return getThreadCounts(state)[teamId];
}
exports.getTeamThreadCounts = getTeamThreadCounts;
exports.getThreadCountsInCurrentTeam = reselect_1.createSelector(teams_1.getCurrentTeamId, getThreadCounts, function (currentTeamId, counts) {
    return counts === null || counts === void 0 ? void 0 : counts[currentTeamId];
});
function getThreads(state) {
    return state.entities.threads.threads;
}
exports.getThreads = getThreads;
function getThread(state, threadId) {
    var _a;
    if (!threadId || !((_a = exports.getThreadsInCurrentTeam(state)) === null || _a === void 0 ? void 0 : _a.includes(threadId))) {
        return null;
    }
    return getThreads(state)[threadId];
}
exports.getThread = getThread;
exports.getThreadOrderInCurrentTeam = reselect_1.createSelector(exports.getThreadsInCurrentTeam, getThreads, function (state, selectedThreadIdInTeam) { return selectedThreadIdInTeam; }, function (threadsInTeam, threads, selectedThreadIdInTeam) {
    var ids = tslib_1.__spread(threadsInTeam.filter(function (id) { return threads[id].is_following; }));
    if (selectedThreadIdInTeam && !ids.includes(selectedThreadIdInTeam)) {
        ids.push(selectedThreadIdInTeam);
    }
    return sortByLastReply(ids, threads);
});
exports.getUnreadThreadOrderInCurrentTeam = reselect_1.createSelector(exports.getThreadsInCurrentTeam, getThreads, function (state, selectedThreadIdInTeam) { return selectedThreadIdInTeam; }, function (threadsInTeam, threads, selectedThreadIdInTeam) {
    var ids = threadsInTeam.filter(function (id) {
        var thread = threads[id];
        return thread.is_following && (thread.unread_mentions || thread.unread_replies);
    });
    if (selectedThreadIdInTeam && !ids.includes(selectedThreadIdInTeam)) {
        ids.push(selectedThreadIdInTeam);
    }
    return sortByLastReply(ids, threads);
});
function sortByLastReply(ids, threads) {
    return ids.sort(function (a, b) { return threads[b].last_reply_at - threads[a].last_reply_at; });
}
//# sourceMappingURL=threads.js.map