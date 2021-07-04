"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var team_utils_1 = require("../../utils/team_utils");
function currentTeamId(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.TeamTypes.SELECT_TEAM:
            return action.data;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return '';
        default:
            return state;
    }
}
function teams(state, action) {
    var _a, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.TeamTypes.RECEIVED_TEAMS_LIST:
        case action_types_1.SchemeTypes.RECEIVED_SCHEME_TEAMS:
            return Object.assign({}, state, team_utils_1.teamListToMap(action.data));
        case action_types_1.UserTypes.LOGIN: // Used by the mobile app
            return Object.assign({}, state, team_utils_1.teamListToMap(action.data.teams));
        case action_types_1.TeamTypes.RECEIVED_TEAMS:
            return Object.assign({}, state, action.data);
        case action_types_1.TeamTypes.CREATED_TEAM:
        case action_types_1.TeamTypes.UPDATED_TEAM:
        case action_types_1.TeamTypes.PATCHED_TEAM:
        case action_types_1.TeamTypes.REGENERATED_TEAM_INVITE_ID:
        case action_types_1.TeamTypes.RECEIVED_TEAM:
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.id] = action.data, _a));
        case action_types_1.TeamTypes.RECEIVED_TEAM_DELETED: {
            var nextState = tslib_1.__assign({}, state);
            var teamId = action.data.id;
            if (nextState.hasOwnProperty(teamId)) {
                Reflect.deleteProperty(nextState, teamId);
                return nextState;
            }
            return state;
        }
        case action_types_1.TeamTypes.UPDATED_TEAM_SCHEME: {
            var _c = action.data, teamId = _c.teamId, schemeId = _c.schemeId;
            var team = state[teamId];
            if (!team) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[teamId] = tslib_1.__assign(tslib_1.__assign({}, team), { scheme_id: schemeId }), _b));
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function myMembers(state, action) {
    var e_1, _a, e_2, _b, _c, _d, _e, _f, _g, e_3, _h;
    if (state === void 0) { state = {}; }
    function updateState(receivedTeams, currentState) {
        if (receivedTeams === void 0) { receivedTeams = {}; }
        if (currentState === void 0) { currentState = {}; }
        return Object.keys(receivedTeams).forEach(function (teamId) {
            if (receivedTeams[teamId].delete_at > 0 && currentState[teamId]) {
                Reflect.deleteProperty(currentState, teamId);
            }
        });
    }
    switch (action.type) {
        case action_types_1.TeamTypes.RECEIVED_MY_TEAM_MEMBER: {
            var nextState = tslib_1.__assign({}, state);
            var member = action.data;
            if (member.delete_at === 0) {
                nextState[member.team_id] = member;
            }
            return nextState;
        }
        case action_types_1.TeamTypes.RECEIVED_MY_TEAM_MEMBERS: {
            var nextState = {};
            var members = action.data;
            try {
                for (var members_1 = tslib_1.__values(members), members_1_1 = members_1.next(); !members_1_1.done; members_1_1 = members_1.next()) {
                    var m = members_1_1.value;
                    if (m.delete_at == null || m.delete_at === 0) {
                        var prevMember = state[m.team_id] || { mention_count: 0, msg_count: 0 };
                        nextState[m.team_id] = tslib_1.__assign(tslib_1.__assign({}, prevMember), m);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (members_1_1 && !members_1_1.done && (_a = members_1.return)) _a.call(members_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        case action_types_1.TeamTypes.RECEIVED_TEAMS_LIST: {
            var nextState = tslib_1.__assign({}, state);
            var receivedTeams = team_utils_1.teamListToMap(action.data);
            updateState(receivedTeams, nextState);
            return nextState;
        }
        case action_types_1.TeamTypes.RECEIVED_TEAMS: {
            var nextState = tslib_1.__assign({}, state);
            var receivedTeams = action.data;
            updateState(receivedTeams, nextState);
            return nextState;
        }
        case action_types_1.TeamTypes.RECEIVED_MY_TEAM_UNREADS: {
            var nextState = tslib_1.__assign({}, state);
            var unreads = action.data;
            try {
                for (var unreads_1 = tslib_1.__values(unreads), unreads_1_1 = unreads_1.next(); !unreads_1_1.done; unreads_1_1 = unreads_1.next()) {
                    var u = unreads_1_1.value;
                    var msgCount = u.msg_count < 0 ? 0 : u.msg_count;
                    var mentionCount = u.mention_count < 0 ? 0 : u.mention_count;
                    var m = tslib_1.__assign(tslib_1.__assign({}, state[u.team_id]), { mention_count: mentionCount, msg_count: msgCount });
                    nextState[u.team_id] = m;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (unreads_1_1 && !unreads_1_1.done && (_b = unreads_1.return)) _b.call(unreads_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return nextState;
        }
        case action_types_1.ChannelTypes.INCREMENT_UNREAD_MSG_COUNT: {
            var _j = action.data, teamId = _j.teamId, amount = _j.amount, onlyMentions = _j.onlyMentions;
            var member = state[teamId];
            if (!member) {
                // Don't keep track of unread posts until we've loaded the actual team member
                return state;
            }
            if (onlyMentions) {
                // Incrementing the msg_count marks the team as unread, so don't do that if these posts shouldn't be unread
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[teamId] = tslib_1.__assign(tslib_1.__assign({}, member), { msg_count: member.msg_count + amount }), _c));
        }
        case action_types_1.ChannelTypes.DECREMENT_UNREAD_MSG_COUNT: {
            var _k = action.data, teamId = _k.teamId, amount = _k.amount;
            var member = state[teamId];
            if (!member) {
                // Don't keep track of unread posts until we've loaded the actual team member
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[teamId] = tslib_1.__assign(tslib_1.__assign({}, member), { msg_count: Math.max(member.msg_count - Math.abs(amount), 0) }), _d));
        }
        case action_types_1.ChannelTypes.INCREMENT_UNREAD_MENTION_COUNT: {
            var _l = action.data, teamId = _l.teamId, amount = _l.amount;
            var member = state[teamId];
            if (!member) {
                // Don't keep track of unread posts until we've loaded the actual team member
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[teamId] = tslib_1.__assign(tslib_1.__assign({}, member), { mention_count: member.mention_count + amount }), _e));
        }
        case action_types_1.ChannelTypes.DECREMENT_UNREAD_MENTION_COUNT: {
            var _m = action.data, teamId = _m.teamId, amount = _m.amount;
            var member = state[teamId];
            if (!member) {
                // Don't keep track of unread posts until we've loaded the actual team member
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_f = {}, _f[teamId] = tslib_1.__assign(tslib_1.__assign({}, member), { mention_count: Math.max(member.mention_count - amount, 0) }), _f));
        }
        case action_types_1.TeamTypes.LEAVE_TEAM:
        case action_types_1.TeamTypes.RECEIVED_TEAM_DELETED: {
            var nextState = tslib_1.__assign({}, state);
            var data = action.data;
            Reflect.deleteProperty(nextState, data.id);
            return nextState;
        }
        case action_types_1.TeamTypes.UPDATED_TEAM_MEMBER_SCHEME_ROLES: {
            return updateMyTeamMemberSchemeRoles(state, action);
        }
        case action_types_1.ChannelTypes.POST_UNREAD_SUCCESS: {
            var _o = action.data, teamId = _o.teamId, deltaMsgs = _o.deltaMsgs, mentionCount = _o.mentionCount, msgCount = _o.msgCount;
            var teamState = state[teamId];
            if (!teamState) {
                return state;
            }
            var newTeamState = tslib_1.__assign(tslib_1.__assign({}, teamState), { msg_count: (typeof teamState.msg_count === 'undefined' ? msgCount : teamState.msg_count - deltaMsgs), mention_count: (typeof teamState.mention_count === 'undefined' ? mentionCount : teamState.mention_count + mentionCount) });
            return tslib_1.__assign(tslib_1.__assign({}, state), (_g = {}, _g[teamId] = newTeamState, _g));
        }
        case action_types_1.UserTypes.LOGIN: { // Used by the mobile app
            var _p = action.data, teamMembers = _p.teamMembers, teamUnreads = _p.teamUnreads;
            var nextState = tslib_1.__assign({}, state);
            var _loop_1 = function (m) {
                if (m.delete_at == null || m.delete_at === 0) {
                    var unread = teamUnreads.find(function (u) { return u.team_id === m.team_id; });
                    if (unread) {
                        m.mention_count = unread.mention_count;
                        m.msg_count = unread.msg_count;
                    }
                    nextState[m.team_id] = m;
                }
            };
            try {
                for (var teamMembers_1 = tslib_1.__values(teamMembers), teamMembers_1_1 = teamMembers_1.next(); !teamMembers_1_1.done; teamMembers_1_1 = teamMembers_1.next()) {
                    var m = teamMembers_1_1.value;
                    _loop_1(m);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (teamMembers_1_1 && !teamMembers_1_1.done && (_h = teamMembers_1.return)) _h.call(teamMembers_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function membersInTeam(state, action) {
    var _a, e_4, _b, e_5, _c, _d, _e;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.TeamTypes.RECEIVED_MEMBER_IN_TEAM: {
            var data = action.data;
            var members = tslib_1.__assign({}, (state[data.team_id] || {}));
            members[data.user_id] = data;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[data.team_id] = members, _a));
        }
        case action_types_1.TeamTypes.RECEIVED_TEAM_MEMBERS: {
            var data = action.data;
            if (data && data.length) {
                var nextState = tslib_1.__assign({}, state);
                try {
                    for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                        var member = data_1_1.value;
                        if (nextState[member.team_id]) {
                            nextState[member.team_id] = tslib_1.__assign({}, nextState[member.team_id]);
                        }
                        else {
                            nextState[member.team_id] = {};
                        }
                        nextState[member.team_id][member.user_id] = member;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (data_1_1 && !data_1_1.done && (_b = data_1.return)) _b.call(data_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return nextState;
            }
            return state;
        }
        case action_types_1.TeamTypes.RECEIVED_MEMBERS_IN_TEAM: {
            var data = action.data;
            if (data && data.length) {
                var teamId = data[0].team_id;
                var members = tslib_1.__assign({}, (state[teamId] || {}));
                try {
                    for (var data_2 = tslib_1.__values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                        var member = data_2_1.value;
                        members[member.user_id] = member;
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (data_2_1 && !data_2_1.done && (_c = data_2.return)) _c.call(data_2);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[teamId] = members, _d));
            }
            return state;
        }
        case action_types_1.TeamTypes.REMOVE_MEMBER_FROM_TEAM: {
            var data = action.data;
            var members = state[data.team_id];
            if (members) {
                var nextState = tslib_1.__assign({}, members);
                Reflect.deleteProperty(nextState, data.user_id);
                return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[data.team_id] = nextState, _e));
            }
            return state;
        }
        case action_types_1.TeamTypes.RECEIVED_TEAM_DELETED: {
            var nextState = tslib_1.__assign({}, state);
            var teamId = action.data.id;
            if (nextState.hasOwnProperty(teamId)) {
                Reflect.deleteProperty(nextState, teamId);
                return nextState;
            }
            return state;
        }
        case action_types_1.TeamTypes.UPDATED_TEAM_MEMBER_SCHEME_ROLES: {
            return updateTeamMemberSchemeRoles(state, action);
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function stats(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.TeamTypes.RECEIVED_TEAM_STATS: {
            var stat = action.data;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[stat.team_id] = stat, _a));
        }
        case action_types_1.TeamTypes.RECEIVED_TEAM_DELETED: {
            var nextState = tslib_1.__assign({}, state);
            var teamId = action.data.id;
            if (nextState.hasOwnProperty(teamId)) {
                Reflect.deleteProperty(nextState, teamId);
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
function groupsAssociatedToTeam(state, action) {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GroupTypes.RECEIVED_GROUP_ASSOCIATED_TO_TEAM: {
            var _e = action.data, teamID = _e.teamID, groups = _e.groups;
            var nextState = tslib_1.__assign({}, state);
            var associatedGroupIDs = new Set(state[teamID] ? state[teamID].ids : []);
            try {
                for (var groups_1 = tslib_1.__values(groups), groups_1_1 = groups_1.next(); !groups_1_1.done; groups_1_1 = groups_1.next()) {
                    var group = groups_1_1.value;
                    associatedGroupIDs.add(group.id);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (groups_1_1 && !groups_1_1.done && (_a = groups_1.return)) _a.call(groups_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            nextState[teamID] = { ids: Array.from(associatedGroupIDs), totalCount: associatedGroupIDs.size };
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_GROUPS_ASSOCIATED_TO_TEAM: {
            var _f = action.data, teamID = _f.teamID, groups = _f.groups, totalGroupCount = _f.totalGroupCount;
            var nextState = tslib_1.__assign({}, state);
            var associatedGroupIDs = new Set(state[teamID] ? state[teamID].ids : []);
            try {
                for (var groups_2 = tslib_1.__values(groups), groups_2_1 = groups_2.next(); !groups_2_1.done; groups_2_1 = groups_2.next()) {
                    var group = groups_2_1.value;
                    associatedGroupIDs.add(group.id);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (groups_2_1 && !groups_2_1.done && (_b = groups_2.return)) _b.call(groups_2);
                }
                finally { if (e_7) throw e_7.error; }
            }
            nextState[teamID] = { ids: Array.from(associatedGroupIDs), totalCount: totalGroupCount };
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_ALL_GROUPS_ASSOCIATED_TO_TEAM: {
            var _g = action.data, teamID = _g.teamID, groups = _g.groups;
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
                    if (groups_3_1 && !groups_3_1.done && (_c = groups_3.return)) _c.call(groups_3);
                }
                finally { if (e_8) throw e_8.error; }
            }
            var ids = Array.from(associatedGroupIDs);
            nextState[teamID] = { ids: ids, totalCount: ids.length };
            return nextState;
        }
        case action_types_1.GroupTypes.RECEIVED_GROUP_NOT_ASSOCIATED_TO_TEAM:
        case action_types_1.GroupTypes.RECEIVED_GROUPS_NOT_ASSOCIATED_TO_TEAM: {
            var _h = action.data, teamID = _h.teamID, groups = _h.groups;
            var nextState = tslib_1.__assign({}, state);
            var associatedGroupIDs = new Set(state[teamID] ? state[teamID].ids : []);
            try {
                for (var groups_4 = tslib_1.__values(groups), groups_4_1 = groups_4.next(); !groups_4_1.done; groups_4_1 = groups_4.next()) {
                    var group = groups_4_1.value;
                    associatedGroupIDs.delete(group.id);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (groups_4_1 && !groups_4_1.done && (_d = groups_4.return)) _d.call(groups_4);
                }
                finally { if (e_9) throw e_9.error; }
            }
            nextState[teamID] = { ids: Array.from(associatedGroupIDs), totalCount: associatedGroupIDs.size };
            return nextState;
        }
        default:
            return state;
    }
}
function updateTeamMemberSchemeRoles(state, action) {
    var _a, _b;
    var _c = action.data, teamId = _c.teamId, userId = _c.userId, isSchemeUser = _c.isSchemeUser, isSchemeAdmin = _c.isSchemeAdmin;
    var team = state[teamId];
    if (team) {
        var member = team[userId];
        if (member) {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[teamId] = tslib_1.__assign(tslib_1.__assign({}, state[teamId]), (_b = {}, _b[userId] = tslib_1.__assign(tslib_1.__assign({}, state[teamId][userId]), { scheme_user: isSchemeUser, scheme_admin: isSchemeAdmin }), _b)), _a));
        }
    }
    return state;
}
function updateMyTeamMemberSchemeRoles(state, action) {
    var _a;
    var _b = action.data, teamId = _b.teamId, isSchemeUser = _b.isSchemeUser, isSchemeAdmin = _b.isSchemeAdmin;
    var member = state[teamId];
    if (member) {
        return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[teamId] = tslib_1.__assign(tslib_1.__assign({}, state[teamId]), { scheme_user: isSchemeUser, scheme_admin: isSchemeAdmin }), _a));
    }
    return state;
}
function totalCount(state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case action_types_1.TeamTypes.RECEIVED_TOTAL_TEAM_COUNT: {
            return action.data;
        }
        default:
            return state;
    }
}
function teamsInPolicy(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_TEAMS_SEARCH: {
            return Object.assign({}, state, team_utils_1.teamListToMap(action.data));
        }
        case action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_TEAMS: {
            return Object.assign({}, state, team_utils_1.teamListToMap(action.data.teams));
        }
        case action_types_1.AdminTypes.CLEAR_DATA_RETENTION_CUSTOM_POLICY_TEAMS: {
            return {};
        }
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // the current selected team
    currentTeamId: currentTeamId,
    // object where every key is the team id and has and object with the team detail
    teams: teams,
    // object where every key is the team id and has and object with the team members detail
    myMembers: myMembers,
    // object where every key is the team id and has an object of members in the team where the key is user id
    membersInTeam: membersInTeam,
    // object where every key is the team id and has an object with the team stats
    stats: stats,
    groupsAssociatedToTeam: groupsAssociatedToTeam,
    totalCount: totalCount,
    teamsInPolicy: teamsInPolicy,
});
//# sourceMappingURL=teams.js.map