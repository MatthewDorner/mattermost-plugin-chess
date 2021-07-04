"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyGroupMentionKeysForChannel = exports.getMyGroupMentionKeys = exports.getMyGroupsAssociatedToChannelForReference = exports.getMyAllowReferencedGroups = exports.getAllGroupsForReferenceByName = exports.getAllAssociatedGroupsForReference = exports.getGroupsAssociatedToChannelForReference = exports.getGroupsAssociatedToTeamForReference = exports.getGroupsAssociatedToChannel = exports.getGroupsNotAssociatedToChannel = exports.getGroupsAssociatedToTeam = exports.getGroupsNotAssociatedToTeam = exports.getAssociatedGroupsForReference = exports.searchAssociatedGroupsForReferenceLocal = exports.getAssociatedGroupsForReferenceByMention = exports.getAssociatedGroupsByName = exports.getGroupChannels = exports.getGroupTeams = exports.getGroupMemberCount = exports.getGroup = exports.getGroupStats = exports.getAllGroupStats = exports.getMyGroups = exports.getAllGroups = void 0;
var tslib_1 = require("tslib");
var group_utils_1 = require("../../utils/group_utils");
var channels_1 = require("./channels");
var teams_1 = require("./teams");
var reselect_1 = require("reselect");
var emptyList = [];
var emptySyncables = {
    teams: [],
    channels: [],
};
function getAllGroups(state) {
    return state.entities.groups.groups;
}
exports.getAllGroups = getAllGroups;
function getMyGroups(state) {
    return state.entities.groups.myGroups;
}
exports.getMyGroups = getMyGroups;
function getAllGroupStats(state) {
    return state.entities.groups.stats;
}
exports.getAllGroupStats = getAllGroupStats;
function getGroupStats(state, id) {
    return getAllGroupStats(state)[id] || {};
}
exports.getGroupStats = getGroupStats;
function getGroup(state, id) {
    return getAllGroups(state)[id];
}
exports.getGroup = getGroup;
function getGroupMemberCount(state, id) {
    return getGroupStats(state, id).total_member_count;
}
exports.getGroupMemberCount = getGroupMemberCount;
function getGroupSyncables(state, id) {
    return state.entities.groups.syncables[id] || emptySyncables;
}
function getGroupTeams(state, id) {
    return getGroupSyncables(state, id).teams;
}
exports.getGroupTeams = getGroupTeams;
function getGroupChannels(state, id) {
    return getGroupSyncables(state, id).channels;
}
exports.getGroupChannels = getGroupChannels;
exports.getAssociatedGroupsByName = reselect_1.createSelector(getAssociatedGroupsForReference, function (groups) {
    var groupsByName = {};
    for (var id in groups) {
        if (groups.hasOwnProperty(id)) {
            var group = groups[id];
            groupsByName[group.name] = group;
        }
    }
    return groupsByName;
});
exports.getAssociatedGroupsForReferenceByMention = reselect_1.createSelector(getAssociatedGroupsForReference, function (groups) {
    return new Map(groups.map(function (group) { return ["@" + group.name, group]; }));
});
function searchAssociatedGroupsForReferenceLocal(state, term, teamId, channelId) {
    var groups = getAssociatedGroupsForReference(state, teamId, channelId);
    if (!groups) {
        return emptyList;
    }
    var filteredGroups = group_utils_1.filterGroupsMatchingTerm(groups, term);
    return filteredGroups;
}
exports.searchAssociatedGroupsForReferenceLocal = searchAssociatedGroupsForReferenceLocal;
function getAssociatedGroupsForReference(state, teamId, channelId) {
    var team = teams_1.getTeam(state, teamId);
    var channel = channels_1.getChannel(state, channelId);
    var groupsForReference = [];
    if (team && team.group_constrained && channel && channel.group_constrained) {
        var groupsFromChannel_1 = exports.getGroupsAssociatedToChannelForReference(state, channelId);
        var groupsFromTeam = exports.getGroupsAssociatedToTeamForReference(state, teamId);
        groupsForReference = groupsFromChannel_1.concat(groupsFromTeam.filter(function (item) { return groupsFromChannel_1.indexOf(item) < 0; }));
    }
    else if (team && team.group_constrained) {
        groupsForReference = exports.getGroupsAssociatedToTeamForReference(state, teamId);
    }
    else if (channel && channel.group_constrained) {
        groupsForReference = exports.getGroupsAssociatedToChannelForReference(state, channelId);
    }
    else {
        groupsForReference = exports.getAllAssociatedGroupsForReference(state);
    }
    return groupsForReference;
}
exports.getAssociatedGroupsForReference = getAssociatedGroupsForReference;
var teamGroupIDs = function (state, teamID) { var _a; return ((_a = state.entities.teams.groupsAssociatedToTeam[teamID]) === null || _a === void 0 ? void 0 : _a.ids) || []; };
var channelGroupIDs = function (state, channelID) { var _a; return ((_a = state.entities.channels.groupsAssociatedToChannel[channelID]) === null || _a === void 0 ? void 0 : _a.ids) || []; };
var getTeamGroupIDSet = reselect_1.createSelector(teamGroupIDs, function (teamIDs) { return new Set(teamIDs); });
var getChannelGroupIDSet = reselect_1.createSelector(channelGroupIDs, function (channelIDs) { return new Set(channelIDs); });
exports.getGroupsNotAssociatedToTeam = reselect_1.createSelector(getAllGroups, function (state, teamID) { return getTeamGroupIDSet(state, teamID); }, function (allGroups, teamGroupIDSet) {
    return Object.entries(allGroups).filter(function (_a) {
        var _b = tslib_1.__read(_a, 1), groupID = _b[0];
        return !teamGroupIDSet.has(groupID);
    }).map(function (entry) { return entry[1]; });
});
exports.getGroupsAssociatedToTeam = reselect_1.createSelector(getAllGroups, function (state, teamID) { return getTeamGroupIDSet(state, teamID); }, function (allGroups, teamGroupIDSet) {
    return Object.entries(allGroups).filter(function (_a) {
        var _b = tslib_1.__read(_a, 1), groupID = _b[0];
        return teamGroupIDSet.has(groupID);
    }).map(function (entry) { return entry[1]; });
});
exports.getGroupsNotAssociatedToChannel = reselect_1.createSelector(getAllGroups, function (state, channelID) { return getChannelGroupIDSet(state, channelID); }, function (state, channelID, teamID) { return teams_1.getTeam(state, teamID); }, function (state, channelID, teamID) { return exports.getGroupsAssociatedToTeam(state, teamID); }, function (allGroups, channelGroupIDSet, team, teamGroups) {
    var result = Object.values(allGroups).filter(function (group) { return !channelGroupIDSet.has(group.id); });
    if (team.group_constrained) {
        var gids_1 = teamGroups.map(function (group) { return group.id; });
        result = result.filter(function (group) { return gids_1 === null || gids_1 === void 0 ? void 0 : gids_1.includes(group.id); });
    }
    return result;
});
exports.getGroupsAssociatedToChannel = reselect_1.createSelector(getAllGroups, function (state, channelID) { return getChannelGroupIDSet(state, channelID); }, function (allGroups, channelGroupIDSet) {
    return Object.entries(allGroups).filter(function (_a) {
        var _b = tslib_1.__read(_a, 1), groupID = _b[0];
        return channelGroupIDSet.has(groupID);
    }).map(function (entry) { return entry[1]; });
});
exports.getGroupsAssociatedToTeamForReference = reselect_1.createSelector(getAllGroups, function (state, teamID) { return getTeamGroupIDSet(state, teamID); }, function (allGroups, teamGroupIDSet) {
    return Object.entries(allGroups).filter(function (_a) {
        var _b = tslib_1.__read(_a, 1), groupID = _b[0];
        return teamGroupIDSet.has(groupID);
    }).filter(function (entry) { return (entry[1].allow_reference && entry[1].delete_at === 0); }).map(function (entry) { return entry[1]; });
});
exports.getGroupsAssociatedToChannelForReference = reselect_1.createSelector(getAllGroups, function (state, channelID) { return getChannelGroupIDSet(state, channelID); }, function (allGroups, channelGroupIDSet) {
    return Object.entries(allGroups).filter(function (_a) {
        var _b = tslib_1.__read(_a, 1), groupID = _b[0];
        return channelGroupIDSet.has(groupID);
    }).filter(function (entry) { return (entry[1].allow_reference && entry[1].delete_at === 0); }).map(function (entry) { return entry[1]; });
});
exports.getAllAssociatedGroupsForReference = reselect_1.createSelector(getAllGroups, function (allGroups) {
    return Object.entries(allGroups).filter(function (entry) { return (entry[1].allow_reference && entry[1].delete_at === 0); }).map(function (entry) { return entry[1]; });
});
exports.getAllGroupsForReferenceByName = reselect_1.createSelector(exports.getAllAssociatedGroupsForReference, function (groups) {
    var groupsByName = {};
    for (var id in groups) {
        if (groups.hasOwnProperty(id)) {
            var group = groups[id];
            groupsByName[group.name] = group;
        }
    }
    return groupsByName;
});
exports.getMyAllowReferencedGroups = reselect_1.createSelector(getMyGroups, function (myGroups) {
    return Object.values(myGroups).filter(function (group) { return group.allow_reference && group.delete_at === 0; });
});
exports.getMyGroupsAssociatedToChannelForReference = reselect_1.createSelector(getMyGroups, exports.getAssociatedGroupsByName, function (myGroups, groups) {
    return Object.values(myGroups).filter(function (group) { return group.allow_reference && group.delete_at === 0 && groups[group.name]; });
});
exports.getMyGroupMentionKeys = reselect_1.createSelector(exports.getMyAllowReferencedGroups, function (groups) {
    var keys = [];
    groups.forEach(function (group) { return keys.push({ key: "@" + group.name }); });
    return keys;
});
exports.getMyGroupMentionKeysForChannel = reselect_1.createSelector(exports.getMyGroupsAssociatedToChannelForReference, function (groups) {
    var keys = [];
    groups.forEach(function (group) { return keys.push({ key: "@" + group.name }); });
    return keys;
});
//# sourceMappingURL=groups.js.map