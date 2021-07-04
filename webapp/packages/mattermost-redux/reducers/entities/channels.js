"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelsInPolicy = exports.channelMemberCountsByGroup = exports.channelModerations = exports.manuallyUnread = void 0;
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var constants_1 = require("../../constants");
var channels_1 = require("../../constants/channels");
function removeMemberFromChannels(state, action) {
    var nextState = tslib_1.__assign({}, state);
    Object.keys(state).forEach(function (channel) {
        nextState[channel] = tslib_1.__assign({}, nextState[channel]);
        delete nextState[channel][action.data.user_id];
    });
    return nextState;
}
function channelListToSet(state, action) {
    var nextState = tslib_1.__assign({}, state);
    action.data.forEach(function (channel) {
        var nextSet = new Set(nextState[channel.team_id]);
        nextSet.add(channel.id);
        nextState[channel.team_id] = nextSet;
    });
    return nextState;
}
function removeChannelFromSet(state, action) {
    var _a;
    var id = action.data.team_id;
    var nextSet = new Set(state[id]);
    nextSet.delete(action.data.id);
    return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[id] = nextSet, _a));
}
function currentChannelId(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.ChannelTypes.SELECT_CHANNEL:
            return action.data;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return '';
        default:
            return state;
    }
}
function channels(state, action) {
    var _a, e_1, _b, _c, _d, _e, _f, _g, _h, _j;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL:
            if (state[action.data.id] && action.data.type === constants_1.General.DM_CHANNEL) {
                action.data.display_name = action.data.display_name || state[action.data.id].display_name;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.id] = action.data, _a));
        case action_types_1.ChannelTypes.RECEIVED_CHANNELS:
        case action_types_1.ChannelTypes.RECEIVED_ALL_CHANNELS:
        case action_types_1.SchemeTypes.RECEIVED_SCHEME_CHANNELS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _k = tslib_1.__values(action.data), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var channel = _l.value;
                    if (state[channel.id] && channel.type === constants_1.General.DM_CHANNEL && !channel.display_name) {
                        channel = tslib_1.__assign(tslib_1.__assign({}, channel), { display_name: state[channel.id].display_name });
                    }
                    nextState[channel.id] = channel;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_b = _k.return)) _b.call(_k);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_DELETED: {
            var _m = action.data, id = _m.id, deleteAt = _m.deleteAt;
            if (!state[id]) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[id] = tslib_1.__assign(tslib_1.__assign({}, state[id]), { delete_at: deleteAt }), _c));
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_UNARCHIVED: {
            var id = action.data.id;
            if (!state[id]) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[id] = tslib_1.__assign(tslib_1.__assign({}, state[id]), { delete_at: 0 }), _d));
        }
        case action_types_1.ChannelTypes.UPDATE_CHANNEL_HEADER: {
            var _o = action.data, channelId = _o.channelId, header = _o.header;
            if (!state[channelId]) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[channelId] = tslib_1.__assign(tslib_1.__assign({}, state[channelId]), { header: header }), _e));
        }
        case action_types_1.ChannelTypes.UPDATE_CHANNEL_PURPOSE: {
            var _p = action.data, channelId = _p.channelId, purpose = _p.purpose;
            if (!state[channelId]) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_f = {}, _f[channelId] = tslib_1.__assign(tslib_1.__assign({}, state[channelId]), { purpose: purpose }), _f));
        }
        case action_types_1.ChannelTypes.LEAVE_CHANNEL: {
            if (action.data && action.data.type === constants_1.General.PRIVATE_CHANNEL) {
                var nextState = tslib_1.__assign({}, state);
                Reflect.deleteProperty(nextState, action.data.id);
                return nextState;
            }
            return state;
        }
        case action_types_1.ChannelTypes.INCREMENT_TOTAL_MSG_COUNT: {
            var _q = action.data, channelId = _q.channelId, amount = _q.amount;
            var channel = state[channelId];
            if (!channel) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_g = {}, _g[channelId] = tslib_1.__assign(tslib_1.__assign({}, channel), { total_msg_count: channel.total_msg_count + amount }), _g));
        }
        case action_types_1.PostTypes.RECEIVED_NEW_POST: {
            var _r = action.data, channel_id = _r.channel_id, create_at = _r.create_at; //eslint-disable-line @typescript-eslint/naming-convention
            var channel = state[channel_id];
            if (!channel) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_h = {}, _h[channel_id] = tslib_1.__assign(tslib_1.__assign({}, channel), { last_post_at: Math.max(create_at, channel.last_post_at) }), _h));
        }
        case action_types_1.ChannelTypes.UPDATED_CHANNEL_SCHEME: {
            var _s = action.data, channelId = _s.channelId, schemeId = _s.schemeId;
            var channel = state[channelId];
            if (!channel) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_j = {}, _j[channelId] = tslib_1.__assign(tslib_1.__assign({}, channel), { scheme_id: schemeId }), _j));
        }
        case action_types_1.ChannelTypes.RECEIVED_MY_CHANNELS_WITH_MEMBERS: { // Used by the mobile app
            var nextState_1 = tslib_1.__assign({}, state);
            var myChannels = action.data.channels;
            var hasNewValues = false;
            if (myChannels && myChannels.length) {
                hasNewValues = true;
                myChannels.forEach(function (c) {
                    nextState_1[c.id] = c;
                });
            }
            return hasNewValues ? nextState_1 : state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function channelsInTeam(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL: {
            var nextSet = new Set(state[action.data.team_id]);
            nextSet.add(action.data.id);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.team_id] = nextSet, _a));
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNELS: {
            return channelListToSet(state, action);
        }
        case action_types_1.ChannelTypes.LEAVE_CHANNEL: {
            if (action.data && action.data.type === constants_1.General.PRIVATE_CHANNEL) {
                return removeChannelFromSet(state, action);
            }
            return state;
        }
        case action_types_1.ChannelTypes.RECEIVED_MY_CHANNELS_WITH_MEMBERS: { // Used by the mobile app
            var values = {
                type: action.type,
                teamId: action.data.teamId,
                sync: action.data.sync,
                data: action.data.channels,
            };
            return channelListToSet(state, values);
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function myMembers(state, action) {
    var _a, e_2, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER: {
            var channelMember = action.data;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[channelMember.channel_id] = channelMember, _a));
        }
        case action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBERS: {
            var nextState_2 = tslib_1.__assign({}, state);
            var remove = action.remove;
            if (remove) {
                remove.forEach(function (id) {
                    Reflect.deleteProperty(nextState_2, id);
                });
            }
            try {
                for (var _l = tslib_1.__values(action.data), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var cm = _m.value;
                    nextState_2[cm.channel_id] = cm;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_b = _l.return)) _b.call(_l);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return nextState_2;
        }
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_PROPS: {
            var member = tslib_1.__assign({}, state[action.data.channel_id]);
            member.notify_props = action.data.notifyProps;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[action.data.channel_id] = member, _c));
        }
        case action_types_1.ChannelTypes.SET_CHANNEL_MUTED: {
            var _o = action.data, channelId = _o.channelId, muted = _o.muted;
            if (!state[channelId]) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[channelId] = tslib_1.__assign(tslib_1.__assign({}, state[channelId]), { notify_props: tslib_1.__assign(tslib_1.__assign({}, state[channelId].notify_props), { mark_unread: muted ? channels_1.MarkUnread.MENTION : channels_1.MarkUnread.ALL }) }), _d));
        }
        case action_types_1.ChannelTypes.INCREMENT_UNREAD_MSG_COUNT: {
            var _p = action.data, channelId = _p.channelId, amount = _p.amount, onlyMentions = _p.onlyMentions, fetchedChannelMember = _p.fetchedChannelMember;
            var member = state[channelId];
            if (!member) {
                // Don't keep track of unread posts until we've loaded the actual channel member
                return state;
            }
            if (!onlyMentions) {
                // Incrementing the msg_count marks the channel as read, so don't do that if these posts should be unread
                return state;
            }
            if (fetchedChannelMember) {
                // We've already updated the channel member with the correct msg_count
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[channelId] = tslib_1.__assign(tslib_1.__assign({}, member), { msg_count: member.msg_count + amount }), _e));
        }
        case action_types_1.ChannelTypes.DECREMENT_UNREAD_MSG_COUNT: {
            var _q = action.data, channelId = _q.channelId, amount = _q.amount;
            var member = state[channelId];
            if (!member) {
                // Don't keep track of unread posts until we've loaded the actual channel member
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_f = {}, _f[channelId] = tslib_1.__assign(tslib_1.__assign({}, member), { msg_count: member.msg_count + amount }), _f));
        }
        case action_types_1.ChannelTypes.INCREMENT_UNREAD_MENTION_COUNT: {
            var _r = action.data, channelId = _r.channelId, amount = _r.amount, fetchedChannelMember = _r.fetchedChannelMember;
            var member = state[channelId];
            if (!member) {
                // Don't keep track of unread posts until we've loaded the actual channel member
                return state;
            }
            if (fetchedChannelMember) {
                // We've already updated the channel member with the correct msg_count
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_g = {}, _g[channelId] = tslib_1.__assign(tslib_1.__assign({}, member), { mention_count: member.mention_count + amount }), _g));
        }
        case action_types_1.ChannelTypes.DECREMENT_UNREAD_MENTION_COUNT: {
            var _s = action.data, channelId = _s.channelId, amount = _s.amount;
            var member = state[channelId];
            if (!member) {
                // Don't keep track of unread posts until we've loaded the actual channel member
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_h = {}, _h[channelId] = tslib_1.__assign(tslib_1.__assign({}, member), { mention_count: Math.max(member.mention_count - amount, 0) }), _h));
        }
        case action_types_1.ChannelTypes.RECEIVED_LAST_VIEWED_AT: {
            var data = action.data;
            var member = state[data.channel_id];
            member = tslib_1.__assign(tslib_1.__assign({}, member), { last_viewed_at: data.last_viewed_at });
            return tslib_1.__assign(tslib_1.__assign({}, state), (_j = {}, _j[action.data.channel_id] = member, _j));
        }
        case action_types_1.ChannelTypes.LEAVE_CHANNEL: {
            var nextState = tslib_1.__assign({}, state);
            if (action.data) {
                Reflect.deleteProperty(nextState, action.data.id);
                return nextState;
            }
            return state;
        }
        case action_types_1.ChannelTypes.UPDATED_CHANNEL_MEMBER_SCHEME_ROLES: {
            return updateChannelMemberSchemeRoles(state, action);
        }
        case action_types_1.ChannelTypes.POST_UNREAD_SUCCESS: {
            var data = action.data;
            var channelState = state[data.channelId];
            if (!channelState) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_k = {}, _k[data.channelId] = tslib_1.__assign(tslib_1.__assign({}, channelState), { msg_count: data.msgCount, mention_count: data.mentionCount, last_viewed_at: data.lastViewedAt }), _k));
        }
        case action_types_1.ChannelTypes.RECEIVED_MY_CHANNELS_WITH_MEMBERS: { // Used by the mobile app
            var nextState_3 = tslib_1.__assign({}, state);
            var current = Object.values(nextState_3);
            var _t = action.data, sync = _t.sync, channelMembers_1 = _t.channelMembers;
            var hasNewValues_1 = channelMembers_1 && channelMembers_1.length > 0;
            // Remove existing channel memberships when the user is no longer a member
            if (sync) {
                current.forEach(function (member) {
                    var id = member.channel_id;
                    if (channelMembers_1.find(function (cm) { return cm.channel_id === id; })) {
                        delete nextState_3[id];
                        hasNewValues_1 = true;
                    }
                });
            }
            if (hasNewValues_1) {
                channelMembers_1.forEach(function (cm) {
                    var id = cm.channel_id;
                    nextState_3[id] = cm;
                });
                return nextState_3;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function membersInChannel(state, action) {
    var _a, e_3, _b, _c;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBER:
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBER: {
            var member = action.data;
            var members = tslib_1.__assign({}, (state[member.channel_id] || {}));
            members[member.user_id] = member;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[member.channel_id] = members, _a));
        }
        case action_types_1.ChannelTypes.RECEIVED_MY_CHANNEL_MEMBERS:
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBERS: {
            var nextState_4 = tslib_1.__assign({}, state);
            var remove = action.remove;
            var currentUserId_1 = action.currentUserId;
            if (remove && currentUserId_1) {
                remove.forEach(function (id) {
                    if (nextState_4[id]) {
                        Reflect.deleteProperty(nextState_4[id], currentUserId_1);
                    }
                });
            }
            try {
                for (var _d = tslib_1.__values(action.data), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var cm = _e.value;
                    if (nextState_4[cm.channel_id]) {
                        nextState_4[cm.channel_id] = tslib_1.__assign({}, nextState_4[cm.channel_id]);
                    }
                    else {
                        nextState_4[cm.channel_id] = {};
                    }
                    nextState_4[cm.channel_id][cm.user_id] = cm;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return nextState_4;
        }
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE:
            return removeMemberFromChannels(state, action);
        case action_types_1.ChannelTypes.LEAVE_CHANNEL:
        case action_types_1.ChannelTypes.REMOVE_MEMBER_FROM_CHANNEL:
        case action_types_1.UserTypes.RECEIVED_PROFILE_NOT_IN_CHANNEL: {
            if (action.data) {
                var data = action.data;
                var members = tslib_1.__assign({}, (state[data.id] || {}));
                if (state[data.id]) {
                    Reflect.deleteProperty(members, data.user_id);
                    return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[data.id] = members, _c));
                }
            }
            return state;
        }
        case action_types_1.ChannelTypes.UPDATED_CHANNEL_MEMBER_SCHEME_ROLES: {
            return updateChannelMemberSchemeRoles(state, action);
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function stats(state, action) {
    var _a, _b, _c, _d;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_STATS: {
            var nextState = tslib_1.__assign({}, state);
            var stat = action.data;
            nextState[stat.channel_id] = stat;
            return nextState;
        }
        case action_types_1.ChannelTypes.ADD_CHANNEL_MEMBER_SUCCESS: {
            var nextState = tslib_1.__assign({}, state);
            var id = action.id;
            var nextStat = nextState[id];
            if (nextStat) {
                var count = nextStat.member_count + 1;
                return tslib_1.__assign(tslib_1.__assign({}, nextState), (_a = {}, _a[id] = tslib_1.__assign(tslib_1.__assign({}, nextStat), { member_count: count }), _a));
            }
            return state;
        }
        case action_types_1.ChannelTypes.REMOVE_CHANNEL_MEMBER_SUCCESS: {
            var nextState = tslib_1.__assign({}, state);
            var id = action.id;
            var nextStat = nextState[id];
            if (nextStat) {
                var count = nextStat.member_count - 1;
                return tslib_1.__assign(tslib_1.__assign({}, nextState), (_b = {}, _b[id] = tslib_1.__assign(tslib_1.__assign({}, nextStat), { member_count: count || 1 }), _b));
            }
            return state;
        }
        case action_types_1.ChannelTypes.INCREMENT_PINNED_POST_COUNT: {
            var nextState = tslib_1.__assign({}, state);
            var id = action.id;
            var nextStat = nextState[id];
            if (nextStat) {
                var count = nextStat.pinnedpost_count + 1;
                return tslib_1.__assign(tslib_1.__assign({}, nextState), (_c = {}, _c[id] = tslib_1.__assign(tslib_1.__assign({}, nextStat), { pinnedpost_count: count }), _c));
            }
            return state;
        }
        case action_types_1.ChannelTypes.DECREMENT_PINNED_POST_COUNT: {
            var nextState = tslib_1.__assign({}, state);
            var id = action.id;
            var nextStat = nextState[id];
            if (nextStat) {
                var count = nextStat.pinnedpost_count - 1;
                return tslib_1.__assign(tslib_1.__assign({}, nextState), (_d = {}, _d[id] = tslib_1.__assign(tslib_1.__assign({}, nextStat), { pinnedpost_count: count }), _d));
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function groupsAssociatedToChannel(state, action) {
    var e_4, _a, e_5, _b, e_6, _c, e_7, _d, e_8, _e, e_9, _f;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_CHANNELS_IN_TEAM: {
            var groupsByChannelId = action.data.groupsByChannelId;
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _g = tslib_1.__values(Object.keys(groupsByChannelId)), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var channelID = _h.value;
                    if (groupsByChannelId[channelID]) {
                        var associatedGroupIDs = new Set([]);
                        try {
                            for (var _j = (e_5 = void 0, tslib_1.__values(groupsByChannelId[channelID])), _k = _j.next(); !_k.done; _k = _j.next()) {
                                var group = _k.value;
                                associatedGroupIDs.add(group.id);
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_k && !_k.done && (_b = _j.return)) _b.call(_j);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        var ids = Array.from(associatedGroupIDs);
                        nextState[channelID] = { ids: ids, totalCount: ids.length };
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_a = _g.return)) _a.call(_g);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_GROUP_ASSOCIATED_TO_CHANNEL: {
            var _l = action.data, channelID = _l.channelID, groups = _l.groups;
            var nextState = tslib_1.__assign({}, state);
            var associatedGroupIDs = new Set(state[channelID] ? state[channelID].ids : []);
            try {
                for (var groups_1 = tslib_1.__values(groups), groups_1_1 = groups_1.next(); !groups_1_1.done; groups_1_1 = groups_1.next()) {
                    var group = groups_1_1.value;
                    associatedGroupIDs.add(group.id);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (groups_1_1 && !groups_1_1.done && (_c = groups_1.return)) _c.call(groups_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            nextState[channelID] = { ids: Array.from(associatedGroupIDs), totalCount: associatedGroupIDs.size };
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_GROUPS_ASSOCIATED_TO_CHANNEL: {
            var _m = action.data, channelID = _m.channelID, groups = _m.groups, totalGroupCount = _m.totalGroupCount;
            var nextState = tslib_1.__assign({}, state);
            var associatedGroupIDs = new Set([]);
            try {
                for (var groups_2 = tslib_1.__values(groups), groups_2_1 = groups_2.next(); !groups_2_1.done; groups_2_1 = groups_2.next()) {
                    var group = groups_2_1.value;
                    associatedGroupIDs.add(group.id);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (groups_2_1 && !groups_2_1.done && (_d = groups_2.return)) _d.call(groups_2);
                }
                finally { if (e_7) throw e_7.error; }
            }
            nextState[channelID] = { ids: Array.from(associatedGroupIDs), totalCount: totalGroupCount };
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_CHANNEL: {
            var _o = action.data, channelID = _o.channelID, groups = _o.groups;
            var nextState = tslib_1.__assign({}, state);
            var associatedGroupIDs = new Set([]);
            try {
                for (var groups_3 = tslib_1.__values(groups), groups_3_1 = groups_3.next(); !groups_3_1.done; groups_3_1 = groups_3.next()) {
                    var group = groups_3_1.value;
                    associatedGroupIDs.add(group.id);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (groups_3_1 && !groups_3_1.done && (_e = groups_3.return)) _e.call(groups_3);
                }
                finally { if (e_8) throw e_8.error; }
            }
            var ids = Array.from(associatedGroupIDs);
            nextState[channelID] = { ids: ids, totalCount: ids.length };
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_GROUP_NOT_ASSOCIATED_TO_CHANNEL:
        case action_types_1.GroupTypes.RECEIVED_GROUPS_NOT_ASSOCIATED_TO_CHANNEL: {
            var _p = action.data, channelID = _p.channelID, groups = _p.groups;
            var nextState = tslib_1.__assign({}, state);
            var associatedGroupIDs = new Set(state[channelID] ? state[channelID].ids : []);
            try {
                for (var groups_4 = tslib_1.__values(groups), groups_4_1 = groups_4.next(); !groups_4_1.done; groups_4_1 = groups_4.next()) {
                    var group = groups_4_1.value;
                    associatedGroupIDs.delete(group.id);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (groups_4_1 && !groups_4_1.done && (_f = groups_4.return)) _f.call(groups_4);
                }
                finally { if (e_9) throw e_9.error; }
            }
            nextState[channelID] = { ids: Array.from(associatedGroupIDs), totalCount: associatedGroupIDs.size };
            return nextState;
        }
        default:
            return state;
    }
}
function updateChannelMemberSchemeRoles(state, action) {
    var _a, _b;
    var _c = action.data, channelId = _c.channelId, userId = _c.userId, isSchemeUser = _c.isSchemeUser, isSchemeAdmin = _c.isSchemeAdmin;
    var channel = state[channelId];
    if (channel) {
        var member = channel[userId];
        if (member) {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[channelId] = tslib_1.__assign(tslib_1.__assign({}, state[channelId]), (_b = {}, _b[userId] = tslib_1.__assign(tslib_1.__assign({}, state[channelId][userId]), { scheme_user: isSchemeUser, scheme_admin: isSchemeAdmin }), _b)), _a));
        }
    }
    return state;
}
function totalCount(state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case action_types_1.ChannelTypes.RECEIVED_TOTAL_CHANNEL_COUNT: {
            return action.data;
        }
        default:
            return state;
    }
}
function manuallyUnread(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelTypes.REMOVE_MANUALLY_UNREAD: {
            if (state[action.data.channelId]) {
                var newState = tslib_1.__assign({}, state);
                delete newState[action.data.channelId];
                return newState;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS: {
            // user is logging out, remove any reference
            return {};
        }
        case action_types_1.ChannelTypes.ADD_MANUALLY_UNREAD:
        case action_types_1.ChannelTypes.POST_UNREAD_SUCCESS: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.channelId] = true, _a));
        }
        default:
            return state;
    }
}
exports.manuallyUnread = manuallyUnread;
function channelModerations(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_MODERATIONS: {
            var _b = action.data, channelId = _b.channelId, moderations = _b.moderations;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[channelId] = moderations, _a));
        }
        default:
            return state;
    }
}
exports.channelModerations = channelModerations;
function channelMemberCountsByGroup(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelTypes.RECEIVED_CHANNEL_MEMBER_COUNTS_BY_GROUP: {
            var _b = action.data, channelId = _b.channelId, memberCounts = _b.memberCounts;
            var memberCountsByGroup_1 = {};
            memberCounts.forEach(function (channelMemberCount) {
                memberCountsByGroup_1[channelMemberCount.group_id] = channelMemberCount;
            });
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[channelId] = memberCountsByGroup_1, _a));
        }
        default:
            return state;
    }
}
exports.channelMemberCountsByGroup = channelMemberCountsByGroup;
function channelsInPolicy(state, action) {
    var e_10, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_SEARCH:
        case action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_CHANNELS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data.channels), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var channel = _c.value;
                    if (state[channel.id] && channel.type === constants_1.General.DM_CHANNEL && !channel.display_name) {
                        channel = tslib_1.__assign(tslib_1.__assign({}, channel), { display_name: state[channel.id].display_name });
                    }
                    nextState[channel.id] = channel;
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
            return nextState;
        }
        case action_types_1.AdminTypes.CLEAR_DATA_RETENTION_CUSTOM_POLICY_CHANNELS: {
            return {};
        }
        default:
            return state;
    }
}
exports.channelsInPolicy = channelsInPolicy;
exports.default = redux_1.combineReducers({
    // the current selected channel
    currentChannelId: currentChannelId,
    // object where every key is the channel id and has and object with the channel detail
    channels: channels,
    // object where every key is a team id and has set of channel ids that are on the team
    channelsInTeam: channelsInTeam,
    // object where every key is the channel id and has an object with the channel members detail
    myMembers: myMembers,
    // object where every key is the channel id with an object where key is a user id and has an object with the channel members detail
    membersInChannel: membersInChannel,
    // object where every key is the channel id and has an object with the channel stats
    stats: stats,
    groupsAssociatedToChannel: groupsAssociatedToChannel,
    totalCount: totalCount,
    // object where every key is the channel id, if present means a user requested to mark that channel as unread.
    manuallyUnread: manuallyUnread,
    // object where every key is the channel id and has an object with the channel moderations
    channelModerations: channelModerations,
    // object where every key is the channel id containing map of <group_id: ChannelMemberCountByGroup>
    channelMemberCountsByGroup: channelMemberCountsByGroup,
    // object where every key is the channel id and has and object with the channel detail
    channelsInPolicy: channelsInPolicy,
});
//# sourceMappingURL=channels.js.map