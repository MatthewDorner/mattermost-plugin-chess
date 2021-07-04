"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetBadgeCountForTeamId = exports.getChannelDrawerBadgeCount = exports.getMyTeamsCount = exports.getMySortedTeamIds = exports.getSortedJoinableTeams = exports.getJoinableTeams = exports.getJoinableTeamIds = exports.getSortedListableTeams = exports.getListableTeams = exports.getListableTeamIds = exports.getTeamMember = exports.getMembersInCurrentTeam = exports.getMyTeamMember = exports.getMyTeams = exports.getCurrentTeamStats = exports.getCurrentRelativeTeamUrl = exports.getCurrentTeamUrl = exports.isCurrentUserCurrentTeamAdmin = exports.getCurrentTeamMembership = exports.getTeam = exports.getCurrentTeam = exports.getTeamsList = exports.getMembersInTeams = exports.getTeamMemberships = exports.getTeamStats = exports.getTeamsInPolicy = exports.getTeams = exports.getTeamByName = exports.getCurrentTeamId = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var constants_1 = require("../../constants");
var general_1 = require("./general");
var roles_helpers_1 = require("./roles_helpers");
var helpers_1 = require("../../utils/helpers");
var user_utils_1 = require("../../utils/user_utils");
var team_utils_1 = require("../../utils/team_utils");
function getCurrentTeamId(state) {
    return state.entities.teams.currentTeamId;
}
exports.getCurrentTeamId = getCurrentTeamId;
function getTeamByName(state, name) {
    var teams = getTeams(state);
    return Object.values(teams).find(function (team) { return team.name === name; });
}
exports.getTeamByName = getTeamByName;
function getTeams(state) {
    return state.entities.teams.teams;
}
exports.getTeams = getTeams;
function getTeamsInPolicy(state) {
    return state.entities.teams.teamsInPolicy;
}
exports.getTeamsInPolicy = getTeamsInPolicy;
function getTeamStats(state) {
    return state.entities.teams.stats;
}
exports.getTeamStats = getTeamStats;
function getTeamMemberships(state) {
    return state.entities.teams.myMembers;
}
exports.getTeamMemberships = getTeamMemberships;
function getMembersInTeams(state) {
    return state.entities.teams.membersInTeam;
}
exports.getMembersInTeams = getMembersInTeams;
exports.getTeamsList = reselect_1.createSelector(getTeams, function (teams) {
    return Object.values(teams);
});
exports.getCurrentTeam = reselect_1.createSelector(getTeams, getCurrentTeamId, function (teams, currentTeamId) {
    return teams[currentTeamId];
});
function getTeam(state, id) {
    var teams = getTeams(state);
    return teams[id];
}
exports.getTeam = getTeam;
exports.getCurrentTeamMembership = reselect_1.createSelector(getCurrentTeamId, getTeamMemberships, function (currentTeamId, teamMemberships) {
    return teamMemberships[currentTeamId];
});
exports.isCurrentUserCurrentTeamAdmin = reselect_1.createSelector(exports.getCurrentTeamMembership, function (member) {
    if (member) {
        var roles = member.roles || '';
        return user_utils_1.isTeamAdmin(roles);
    }
    return false;
});
exports.getCurrentTeamUrl = reselect_1.createSelector(general_1.getCurrentUrl, exports.getCurrentTeam, function (state) { return general_1.getConfig(state).SiteURL; }, function (currentURL, currentTeam, siteURL) {
    var rootURL = "" + (currentURL || siteURL);
    if (!currentTeam) {
        return rootURL;
    }
    return rootURL + "/" + currentTeam.name;
});
exports.getCurrentRelativeTeamUrl = reselect_1.createSelector(exports.getCurrentTeam, function (currentTeam) {
    if (!currentTeam) {
        return '/';
    }
    return "/" + currentTeam.name;
});
exports.getCurrentTeamStats = reselect_1.createSelector(getCurrentTeamId, getTeamStats, function (currentTeamId, teamStats) {
    return teamStats[currentTeamId];
});
exports.getMyTeams = reselect_1.createSelector(getTeams, getTeamMemberships, function (teams, members) {
    return Object.values(teams).filter(function (t) { return members[t.id] && t.delete_at === 0; });
});
exports.getMyTeamMember = reselect_1.createSelector(getTeamMemberships, function (state, teamId) { return teamId; }, function (teamMemberships, teamId) {
    return teamMemberships[teamId] || {};
});
exports.getMembersInCurrentTeam = reselect_1.createSelector(getCurrentTeamId, getMembersInTeams, function (currentTeamId, teamMembers) {
    return teamMembers[currentTeamId];
});
function getTeamMember(state, teamId, userId) {
    var members = getMembersInTeams(state)[teamId];
    if (members) {
        return members[userId];
    }
    return null;
}
exports.getTeamMember = getTeamMember;
exports.getListableTeamIds = helpers_1.createIdsSelector(getTeams, getTeamMemberships, function (state) { return roles_helpers_1.haveISystemPermission(state, { permission: constants_1.Permissions.LIST_PUBLIC_TEAMS }); }, function (state) { return roles_helpers_1.haveISystemPermission(state, { permission: constants_1.Permissions.LIST_PRIVATE_TEAMS }); }, general_1.isCompatibleWithJoinViewTeamPermissions, function (teams, myMembers, canListPublicTeams, canListPrivateTeams, compatibleWithJoinViewTeamPermissions) {
    return Object.keys(teams).filter(function (id) {
        var team = teams[id];
        var member = myMembers[id];
        var canList = team.allow_open_invite;
        if (compatibleWithJoinViewTeamPermissions) {
            canList = (canListPrivateTeams && !team.allow_open_invite) || (canListPublicTeams && team.allow_open_invite);
        }
        return team.delete_at === 0 && canList && !member;
    });
});
exports.getListableTeams = reselect_1.createSelector(getTeams, exports.getListableTeamIds, function (teams, listableTeamIds) {
    return listableTeamIds.map(function (id) { return teams[id]; });
});
exports.getSortedListableTeams = reselect_1.createSelector(getTeams, exports.getListableTeamIds, function (state, locale) { return locale; }, function (teams, listableTeamIds, locale) {
    var e_1, _a;
    var listableTeams = {};
    try {
        for (var listableTeamIds_1 = tslib_1.__values(listableTeamIds), listableTeamIds_1_1 = listableTeamIds_1.next(); !listableTeamIds_1_1.done; listableTeamIds_1_1 = listableTeamIds_1.next()) {
            var id = listableTeamIds_1_1.value;
            listableTeams[id] = teams[id];
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (listableTeamIds_1_1 && !listableTeamIds_1_1.done && (_a = listableTeamIds_1.return)) _a.call(listableTeamIds_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Object.values(listableTeams).sort(team_utils_1.sortTeamsWithLocale(locale));
});
exports.getJoinableTeamIds = helpers_1.createIdsSelector(getTeams, getTeamMemberships, function (state) { return roles_helpers_1.haveISystemPermission(state, { permission: constants_1.Permissions.JOIN_PUBLIC_TEAMS }); }, function (state) { return roles_helpers_1.haveISystemPermission(state, { permission: constants_1.Permissions.JOIN_PRIVATE_TEAMS }); }, general_1.isCompatibleWithJoinViewTeamPermissions, function (teams, myMembers, canJoinPublicTeams, canJoinPrivateTeams, compatibleWithJoinViewTeamPermissions) {
    return Object.keys(teams).filter(function (id) {
        var team = teams[id];
        var member = myMembers[id];
        var canJoin = team.allow_open_invite;
        if (compatibleWithJoinViewTeamPermissions) {
            canJoin = (canJoinPrivateTeams && !team.allow_open_invite) || (canJoinPublicTeams && team.allow_open_invite);
        }
        return team.delete_at === 0 && canJoin && !member;
    });
});
exports.getJoinableTeams = reselect_1.createSelector(getTeams, exports.getJoinableTeamIds, function (teams, joinableTeamIds) {
    return joinableTeamIds.map(function (id) { return teams[id]; });
});
exports.getSortedJoinableTeams = reselect_1.createSelector(getTeams, exports.getJoinableTeamIds, function (state, locale) { return locale; }, function (teams, joinableTeamIds, locale) {
    var e_2, _a;
    var joinableTeams = {};
    try {
        for (var joinableTeamIds_1 = tslib_1.__values(joinableTeamIds), joinableTeamIds_1_1 = joinableTeamIds_1.next(); !joinableTeamIds_1_1.done; joinableTeamIds_1_1 = joinableTeamIds_1.next()) {
            var id = joinableTeamIds_1_1.value;
            joinableTeams[id] = teams[id];
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (joinableTeamIds_1_1 && !joinableTeamIds_1_1.done && (_a = joinableTeamIds_1.return)) _a.call(joinableTeamIds_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return Object.values(joinableTeams).sort(team_utils_1.sortTeamsWithLocale(locale));
});
exports.getMySortedTeamIds = helpers_1.createIdsSelector(exports.getMyTeams, function (state, locale) { return locale; }, function (teams, locale) {
    return teams.sort(team_utils_1.sortTeamsWithLocale(locale)).map(function (t) { return t.id; });
});
function getMyTeamsCount(state) {
    return exports.getMyTeams(state).length;
}
exports.getMyTeamsCount = getMyTeamsCount;
// returns the badge number to show (excluding the current team)
// > 0 means is returning the mention count
// 0 means that there are no unread messages
// -1 means that there are unread messages but no mentions
exports.getChannelDrawerBadgeCount = reselect_1.createSelector(getCurrentTeamId, getTeamMemberships, function (currentTeamId, teamMembers) {
    var mentionCount = 0;
    var messageCount = 0;
    Object.values(teamMembers).forEach(function (m) {
        if (m.team_id !== currentTeamId) {
            mentionCount += (m.mention_count || 0);
            messageCount += (m.msg_count || 0);
        }
    });
    var badgeCount = 0;
    if (mentionCount) {
        badgeCount = mentionCount;
    }
    else if (messageCount) {
        badgeCount = -1;
    }
    return badgeCount;
});
// returns the badge for a team
// > 0 means is returning the mention count
// 0 means that there are no unread messages
// -1 means that there are unread messages but no mentions
function makeGetBadgeCountForTeamId() {
    return reselect_1.createSelector(getTeamMemberships, function (state, id) { return id; }, function (members, teamId) {
        var member = members[teamId];
        var badgeCount = 0;
        if (member) {
            if (member.mention_count) {
                badgeCount = member.mention_count;
            }
            else if (member.msg_count) {
                badgeCount = -1;
            }
        }
        return badgeCount;
    });
}
exports.makeGetBadgeCountForTeamId = makeGetBadgeCountForTeamId;
//# sourceMappingURL=teams.js.map