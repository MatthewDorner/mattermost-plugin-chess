"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function syncables(state, action) {
    var _a, _b, _c, _d, _e, _f;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GroupTypes.RECEIVED_GROUP_TEAMS: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.group_id] = tslib_1.__assign(tslib_1.__assign({}, state[action.group_id]), { teams: action.data }), _a));
        }
        case action_types_1.GroupTypes.RECEIVED_GROUP_CHANNELS: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[action.group_id] = tslib_1.__assign(tslib_1.__assign({}, state[action.group_id]), { channels: action.data }), _b));
        }
        case action_types_1.GroupTypes.PATCHED_GROUP_TEAM:
        case action_types_1.GroupTypes.LINKED_GROUP_TEAM: {
            var nextGroupTeams = [];
            if (!state[action.data.group_id] || !state[action.data.group_id].teams || state[action.data.group_id].teams.length === 0) {
                nextGroupTeams = [action.data];
            }
            else {
                nextGroupTeams = tslib_1.__assign({}, state)[action.data.group_id].teams.slice();
                for (var i = 0, len = nextGroupTeams.length; i < len; i++) {
                    if (nextGroupTeams[i].team_id === action.data.team_id) {
                        nextGroupTeams[i] = action.data;
                    }
                }
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[action.data.group_id] = tslib_1.__assign(tslib_1.__assign({}, state[action.data.group_id]), { teams: nextGroupTeams }), _c));
        }
        case action_types_1.GroupTypes.PATCHED_GROUP_CHANNEL:
        case action_types_1.GroupTypes.LINKED_GROUP_CHANNEL: {
            var nextGroupChannels = [];
            if (!state[action.data.group_id] || !state[action.data.group_id].channels) {
                nextGroupChannels = [action.data];
            }
            else {
                nextGroupChannels = tslib_1.__assign({}, state)[action.data.group_id].channels.slice();
                for (var i = 0, len = nextGroupChannels.length; i < len; i++) {
                    if (nextGroupChannels[i].channel_id === action.data.channel_id) {
                        nextGroupChannels[i] = action.data;
                    }
                }
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[action.data.group_id] = tslib_1.__assign(tslib_1.__assign({}, state[action.data.group_id]), { channels: nextGroupChannels }), _d));
        }
        case action_types_1.GroupTypes.UNLINKED_GROUP_TEAM: {
            if (!state[action.data.group_id]) {
                return state;
            }
            var nextTeams = state[action.data.group_id].teams.slice();
            var index = nextTeams.findIndex(function (groupTeam) {
                return groupTeam.team_id === action.data.syncable_id;
            });
            if (index !== -1) {
                nextTeams.splice(index, 1);
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[action.data.group_id] = tslib_1.__assign(tslib_1.__assign({}, state[action.data.group_id]), { teams: nextTeams }), _e));
        }
        case action_types_1.GroupTypes.UNLINKED_GROUP_CHANNEL: {
            if (!state[action.data.group_id]) {
                return state;
            }
            var nextChannels = state[action.data.group_id].channels.slice();
            var index = nextChannels.findIndex(function (groupChannel) {
                return groupChannel.channel_id === action.data.syncable_id;
            });
            if (index !== -1) {
                nextChannels.splice(index, 1);
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_f = {}, _f[action.data.group_id] = tslib_1.__assign(tslib_1.__assign({}, state[action.data.group_id]), { channels: nextChannels }), _f));
        }
        default:
            return state;
    }
}
function myGroups(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GroupTypes.RECEIVED_MY_GROUPS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var group = _c.value;
                    nextState[group.id] = group;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        default:
            return state;
    }
}
function stats(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GroupTypes.RECEIVED_GROUP_STATS: {
            var stat = action.data;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[stat.group_id] = stat, _a));
        }
        default:
            return state;
    }
}
function groups(state, action) {
    var _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GroupTypes.PATCHED_GROUP:
        case action_types_1.GroupTypes.RECEIVED_GROUP: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.id] = action.data, _a));
        }
        case action_types_1.GroupTypes.RECEIVED_GROUPS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _f = tslib_1.__values(action.data), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var group = _g.value;
                    nextState[group.id] = group;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_CHANNELS_IN_TEAM: {
            var nextState = tslib_1.__assign({}, state);
            var groupsByChannelId = action.data.groupsByChannelId;
            try {
                for (var _h = tslib_1.__values(Object.keys(groupsByChannelId)), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var channelID = _j.value;
                    if (groupsByChannelId[channelID]) {
                        try {
                            for (var _k = (e_4 = void 0, tslib_1.__values(groupsByChannelId[channelID])), _l = _k.next(); !_l.done; _l = _k.next()) {
                                var group = _l.value;
                                nextState[group.id] = group;
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_l && !_l.done && (_d = _k.return)) _d.call(_k);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_GROUPS_ASSOCIATED_TO_TEAM:
        case action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_TEAM:
        case action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_CHANNEL:
        case action_types_1.GroupTypes.RECEIVED_GROUPS_ASSOCIATED_TO_CHANNEL: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _m = tslib_1.__values(action.data.groups), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var group = _o.value;
                    nextState[group.id] = group;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_e = _m.return)) _e.call(_m);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return nextState;
        }
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    syncables: syncables,
    groups: groups,
    stats: stats,
    myGroups: myGroups,
});
//# sourceMappingURL=groups.js.map