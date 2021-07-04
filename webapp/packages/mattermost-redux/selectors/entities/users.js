"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetProfilesForReactions = exports.getUsersInVisibleDMs = exports.shouldShowTermsOfService = exports.searchProfilesWithoutTeam = exports.searchProfilesNotInCurrentTeam = exports.searchProfilesInTeam = exports.searchProfilesInCurrentTeam = exports.searchProfilesNotInCurrentChannel = exports.searchProfilesInCurrentChannel = exports.makeSearchProfilesInChannel = exports.makeSearchProfilesMatchingWithTerm = exports.makeSearchProfilesStartingWithTerm = exports.getFilteredUsersStats = exports.getTotalUsersStats = exports.getStatusForUserId = exports.getProfilesWithoutTeam = exports.getProfilesNotInCurrentTeam = exports.getProfilesNotInTeam = exports.getProfilesInTeam = exports.getProfilesInCurrentTeam = exports.getProfilesNotInCurrentChannel = exports.getProfilesInCurrentChannel = exports.getIsManualStatusForUserId = exports.filterProfiles = exports.getProfiles = exports.getProfileSetNotInCurrentTeam = exports.getProfileSetInCurrentTeam = exports.getProfileSetNotInCurrentChannel = exports.getProfileSetInCurrentChannel = exports.getCurrentUserMentionKeys = exports.getCurrentUserRoles = exports.currentUserHasAnAdminRole = exports.isCurrentUserSystemAdmin = exports.getUserByEmail = exports.getUsersByEmail = exports.getUserByUsername = exports.getUsersByUsername = exports.getUser = exports.getUserAudits = exports.getUserSessions = exports.getUserStatuses = exports.getUserIdsInGroups = exports.getUserIdsWithoutTeam = exports.getUserIdsNotInTeams = exports.getUserIdsInTeams = exports.getUserIdsNotInChannels = exports.getUserIdsInChannels = exports.getUsers = exports.getCurrentUserId = exports.getCurrentUser = void 0;
exports.searchProfilesInGroup = exports.getProfilesInGroup = exports.makeGetDisplayName = exports.makeGetProfilesByIdsAndUsernames = exports.makeGetProfilesNotInChannel = exports.makeGetProfilesInChannel = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var common_1 = require("./common");
Object.defineProperty(exports, "getCurrentUser", { enumerable: true, get: function () { return common_1.getCurrentUser; } });
Object.defineProperty(exports, "getCurrentUserId", { enumerable: true, get: function () { return common_1.getCurrentUserId; } });
Object.defineProperty(exports, "getUsers", { enumerable: true, get: function () { return common_1.getUsers; } });
var general_1 = require("./general");
var preferences_1 = require("./preferences");
var user_utils_1 = require("../../utils/user_utils");
function getUserIdsInChannels(state) {
    return state.entities.users.profilesInChannel;
}
exports.getUserIdsInChannels = getUserIdsInChannels;
function getUserIdsNotInChannels(state) {
    return state.entities.users.profilesNotInChannel;
}
exports.getUserIdsNotInChannels = getUserIdsNotInChannels;
function getUserIdsInTeams(state) {
    return state.entities.users.profilesInTeam;
}
exports.getUserIdsInTeams = getUserIdsInTeams;
function getUserIdsNotInTeams(state) {
    return state.entities.users.profilesNotInTeam;
}
exports.getUserIdsNotInTeams = getUserIdsNotInTeams;
function getUserIdsWithoutTeam(state) {
    return state.entities.users.profilesWithoutTeam;
}
exports.getUserIdsWithoutTeam = getUserIdsWithoutTeam;
function getUserIdsInGroups(state) {
    return state.entities.users.profilesInGroup;
}
exports.getUserIdsInGroups = getUserIdsInGroups;
function getUserStatuses(state) {
    return state.entities.users.statuses;
}
exports.getUserStatuses = getUserStatuses;
function getUserSessions(state) {
    return state.entities.users.mySessions;
}
exports.getUserSessions = getUserSessions;
function getUserAudits(state) {
    return state.entities.users.myAudits;
}
exports.getUserAudits = getUserAudits;
function getUser(state, id) {
    return state.entities.users.profiles[id];
}
exports.getUser = getUser;
exports.getUsersByUsername = reselect_1.createSelector(common_1.getUsers, function (users) {
    var usersByUsername = {};
    for (var id in users) {
        if (users.hasOwnProperty(id)) {
            var user = users[id];
            usersByUsername[user.username] = user;
        }
    }
    return usersByUsername;
});
function getUserByUsername(state, username) {
    return exports.getUsersByUsername(state)[username];
}
exports.getUserByUsername = getUserByUsername;
exports.getUsersByEmail = reselect_1.createSelector(common_1.getUsers, function (users) {
    var e_1, _a;
    var usersByEmail = {};
    try {
        for (var _b = tslib_1.__values(Object.keys(users).map(function (key) { return users[key]; })), _c = _b.next(); !_c.done; _c = _b.next()) {
            var user = _c.value;
            usersByEmail[user.email] = user;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return usersByEmail;
});
function getUserByEmail(state, email) {
    return exports.getUsersByEmail(state)[email];
}
exports.getUserByEmail = getUserByEmail;
exports.isCurrentUserSystemAdmin = reselect_1.createSelector(common_1.getCurrentUser, function (user) {
    var roles = (user === null || user === void 0 ? void 0 : user.roles) || '';
    return user_utils_1.isSystemAdmin(roles);
});
exports.currentUserHasAnAdminRole = reselect_1.createSelector(common_1.getCurrentUser, function (user) {
    var roles = user.roles || '';
    return user_utils_1.includesAnAdminRole(roles);
});
exports.getCurrentUserRoles = reselect_1.createSelector(common_1.getMyCurrentChannelMembership, function (state) { return state.entities.teams.myMembers[state.entities.teams.currentTeamId]; }, common_1.getCurrentUser, function (currentChannelMembership, currentTeamMembership, currentUser) {
    var roles = '';
    if (currentTeamMembership) {
        roles += currentTeamMembership.roles + " ";
    }
    if (currentChannelMembership) {
        roles += currentChannelMembership.roles + " ";
    }
    if (currentUser) {
        roles += currentUser.roles;
    }
    return roles.trim();
});
exports.getCurrentUserMentionKeys = reselect_1.createSelector(common_1.getCurrentUser, function (user) {
    var keys = [];
    if (!user || !user.notify_props) {
        return keys;
    }
    if (user.notify_props.mention_keys) {
        keys = keys.concat(user.notify_props.mention_keys.split(',').map(function (key) {
            return { key: key };
        }));
    }
    if (user.notify_props.first_name === 'true' && user.first_name) {
        keys.push({ key: user.first_name, caseSensitive: true });
    }
    if (user.notify_props.channel === 'true') {
        keys.push({ key: '@channel' });
        keys.push({ key: '@all' });
        keys.push({ key: '@here' });
    }
    var usernameKey = '@' + user.username;
    if (keys.findIndex(function (key) { return key.key === usernameKey; }) === -1) {
        keys.push({ key: usernameKey });
    }
    return keys;
});
exports.getProfileSetInCurrentChannel = reselect_1.createSelector(common_1.getCurrentChannelId, getUserIdsInChannels, function (currentChannel, channelProfiles) {
    return channelProfiles[currentChannel];
});
exports.getProfileSetNotInCurrentChannel = reselect_1.createSelector(common_1.getCurrentChannelId, getUserIdsNotInChannels, function (currentChannel, channelProfiles) {
    return channelProfiles[currentChannel];
});
exports.getProfileSetInCurrentTeam = reselect_1.createSelector(function (state) { return state.entities.teams.currentTeamId; }, getUserIdsInTeams, function (currentTeam, teamProfiles) {
    return teamProfiles[currentTeam];
});
exports.getProfileSetNotInCurrentTeam = reselect_1.createSelector(function (state) { return state.entities.teams.currentTeamId; }, getUserIdsNotInTeams, function (currentTeam, teamProfiles) {
    return teamProfiles[currentTeam];
});
var PROFILE_SET_ALL = 'all';
function sortAndInjectProfiles(profiles, profileSet) {
    var currentProfiles = [];
    if (typeof profileSet === 'undefined') {
        return currentProfiles;
    }
    else if (profileSet === PROFILE_SET_ALL) {
        currentProfiles = Object.keys(profiles).map(function (key) { return profiles[key]; });
    }
    else {
        currentProfiles = Array.from(profileSet).map(function (p) { return profiles[p]; });
    }
    currentProfiles = currentProfiles.filter(function (profile) { return Boolean(profile); });
    return currentProfiles.sort(user_utils_1.sortByUsername);
}
exports.getProfiles = reselect_1.createSelector(common_1.getUsers, function (state, filters) { return filters; }, function (profiles, filters) {
    return sortAndInjectProfiles(filterProfiles(profiles, filters), PROFILE_SET_ALL);
});
function filterProfiles(profiles, filters, memberships) {
    if (!filters) {
        return profiles;
    }
    var users = Object.keys(profiles).map(function (key) { return profiles[key]; });
    var filterRole = (filters.role && filters.role !== '') ? [filters.role] : [];
    var filterRoles = tslib_1.__spread(filterRole, (filters.roles || []), (filters.team_roles || []), (filters.channel_roles || []));
    var excludeRoles = filters.exclude_roles || [];
    if (filterRoles.length > 0 || excludeRoles.length > 0) {
        users = users.filter(function (user) {
            return user.roles.length > 0 && user_utils_1.applyRolesFilters(user, filterRoles, excludeRoles, memberships === null || memberships === void 0 ? void 0 : memberships[user.id]);
        });
    }
    if (filters.inactive) {
        users = users.filter(function (user) { return user.delete_at !== 0; });
    }
    else if (filters.active) {
        users = users.filter(function (user) { return user.delete_at === 0; });
    }
    return users.reduce(function (acc, user) {
        acc[user.id] = user;
        return acc;
    }, {});
}
exports.filterProfiles = filterProfiles;
function getIsManualStatusForUserId(state, userId) {
    return state.entities.users.isManualStatus[userId];
}
exports.getIsManualStatusForUserId = getIsManualStatusForUserId;
exports.getProfilesInCurrentChannel = reselect_1.createSelector(common_1.getUsers, exports.getProfileSetInCurrentChannel, function (profiles, currentChannelProfileSet) {
    return sortAndInjectProfiles(profiles, currentChannelProfileSet);
});
exports.getProfilesNotInCurrentChannel = reselect_1.createSelector(common_1.getUsers, exports.getProfileSetNotInCurrentChannel, function (profiles, notInCurrentChannelProfileSet) {
    return sortAndInjectProfiles(profiles, notInCurrentChannelProfileSet);
});
exports.getProfilesInCurrentTeam = reselect_1.createSelector(common_1.getUsers, exports.getProfileSetInCurrentTeam, function (profiles, currentTeamProfileSet) {
    return sortAndInjectProfiles(profiles, currentTeamProfileSet);
});
exports.getProfilesInTeam = reselect_1.createSelector(common_1.getUsers, getUserIdsInTeams, common_1.getMembersInTeam, function (state, teamId) { return teamId; }, function (state, teamId, filters) { return filters; }, function (profiles, usersInTeams, memberships, teamId, filters) {
    return sortAndInjectProfiles(filterProfiles(profiles, filters, memberships), usersInTeams[teamId] || new Set());
});
exports.getProfilesNotInTeam = reselect_1.createSelector(common_1.getUsers, getUserIdsNotInTeams, function (state, teamId) { return teamId; }, function (state, teamId, filters) { return filters; }, function (profiles, usersNotInTeams, teamId, filters) {
    return sortAndInjectProfiles(filterProfiles(profiles, filters), usersNotInTeams[teamId] || new Set());
});
exports.getProfilesNotInCurrentTeam = reselect_1.createSelector(common_1.getUsers, exports.getProfileSetNotInCurrentTeam, function (profiles, notInCurrentTeamProfileSet) {
    return sortAndInjectProfiles(profiles, notInCurrentTeamProfileSet);
});
exports.getProfilesWithoutTeam = reselect_1.createSelector(common_1.getUsers, getUserIdsWithoutTeam, function (state, filters) { return filters; }, function (profiles, withoutTeamProfileSet, filters) {
    return sortAndInjectProfiles(filterProfiles(profiles, filters), withoutTeamProfileSet);
});
function getStatusForUserId(state, userId) {
    return getUserStatuses(state)[userId];
}
exports.getStatusForUserId = getStatusForUserId;
function getTotalUsersStats(state) {
    return state.entities.users.stats;
}
exports.getTotalUsersStats = getTotalUsersStats;
function getFilteredUsersStats(state) {
    return state.entities.users.filteredStats;
}
exports.getFilteredUsersStats = getFilteredUsersStats;
function filterFromProfiles(currentUserId, profiles, skipCurrent, filters) {
    if (skipCurrent === void 0) { skipCurrent = false; }
    var filteredProfilesMap = filterProfiles(user_utils_1.profileListToMap(profiles), filters);
    var filteredProfiles = Object.keys(filteredProfilesMap).map(function (key) { return filteredProfilesMap[key]; });
    if (skipCurrent) {
        removeCurrentUserFromList(filteredProfiles, currentUserId);
    }
    return filteredProfiles;
}
function makeSearchProfilesStartingWithTerm() {
    return reselect_1.createSelector(common_1.getUsers, common_1.getCurrentUserId, function (state, term) { return term; }, function (state, term, skipCurrent) { return skipCurrent || false; }, function (stateGlobalState, term, skipCurrent, filters) { return filters; }, function (users, currentUserId, term, skipCurrent, filters) {
        var profiles = user_utils_1.filterProfilesStartingWithTerm(Object.values(users), term);
        return filterFromProfiles(currentUserId, profiles, skipCurrent, filters);
    });
}
exports.makeSearchProfilesStartingWithTerm = makeSearchProfilesStartingWithTerm;
function makeSearchProfilesMatchingWithTerm() {
    return reselect_1.createSelector(common_1.getUsers, common_1.getCurrentUserId, function (state, term) { return term; }, function (state, term, skipCurrent) { return skipCurrent || false; }, function (stateGlobalState, term, skipCurrent, filters) { return filters; }, function (users, currentUserId, term, skipCurrent, filters) {
        var profiles = user_utils_1.filterProfilesMatchingWithTerm(Object.values(users), term);
        return filterFromProfiles(currentUserId, profiles, skipCurrent, filters);
    });
}
exports.makeSearchProfilesMatchingWithTerm = makeSearchProfilesMatchingWithTerm;
function makeSearchProfilesInChannel() {
    var doGetProfilesInChannel = makeGetProfilesInChannel();
    return function (state, channelId, term, skipCurrent, filters) {
        if (skipCurrent === void 0) { skipCurrent = false; }
        var profiles = user_utils_1.filterProfilesStartingWithTerm(doGetProfilesInChannel(state, channelId, filters), term);
        if (skipCurrent) {
            removeCurrentUserFromList(profiles, common_1.getCurrentUserId(state));
        }
        return profiles;
    };
}
exports.makeSearchProfilesInChannel = makeSearchProfilesInChannel;
function searchProfilesInCurrentChannel(state, term, skipCurrent) {
    if (skipCurrent === void 0) { skipCurrent = false; }
    var profiles = user_utils_1.filterProfilesStartingWithTerm(exports.getProfilesInCurrentChannel(state), term);
    if (skipCurrent) {
        removeCurrentUserFromList(profiles, common_1.getCurrentUserId(state));
    }
    return profiles;
}
exports.searchProfilesInCurrentChannel = searchProfilesInCurrentChannel;
function searchProfilesNotInCurrentChannel(state, term, skipCurrent) {
    if (skipCurrent === void 0) { skipCurrent = false; }
    var profiles = user_utils_1.filterProfilesStartingWithTerm(exports.getProfilesNotInCurrentChannel(state), term);
    if (skipCurrent) {
        removeCurrentUserFromList(profiles, common_1.getCurrentUserId(state));
    }
    return profiles;
}
exports.searchProfilesNotInCurrentChannel = searchProfilesNotInCurrentChannel;
function searchProfilesInCurrentTeam(state, term, skipCurrent) {
    if (skipCurrent === void 0) { skipCurrent = false; }
    var profiles = user_utils_1.filterProfilesStartingWithTerm(exports.getProfilesInCurrentTeam(state), term);
    if (skipCurrent) {
        removeCurrentUserFromList(profiles, common_1.getCurrentUserId(state));
    }
    return profiles;
}
exports.searchProfilesInCurrentTeam = searchProfilesInCurrentTeam;
function searchProfilesInTeam(state, teamId, term, skipCurrent, filters) {
    if (skipCurrent === void 0) { skipCurrent = false; }
    var profiles = user_utils_1.filterProfilesStartingWithTerm(exports.getProfilesInTeam(state, teamId, filters), term);
    if (skipCurrent) {
        removeCurrentUserFromList(profiles, common_1.getCurrentUserId(state));
    }
    return profiles;
}
exports.searchProfilesInTeam = searchProfilesInTeam;
function searchProfilesNotInCurrentTeam(state, term, skipCurrent) {
    if (skipCurrent === void 0) { skipCurrent = false; }
    var profiles = user_utils_1.filterProfilesStartingWithTerm(exports.getProfilesNotInCurrentTeam(state), term);
    if (skipCurrent) {
        removeCurrentUserFromList(profiles, common_1.getCurrentUserId(state));
    }
    return profiles;
}
exports.searchProfilesNotInCurrentTeam = searchProfilesNotInCurrentTeam;
function searchProfilesWithoutTeam(state, term, skipCurrent, filters) {
    if (skipCurrent === void 0) { skipCurrent = false; }
    var filteredProfiles = user_utils_1.filterProfilesStartingWithTerm(exports.getProfilesWithoutTeam(state, filters), term);
    if (skipCurrent) {
        removeCurrentUserFromList(filteredProfiles, common_1.getCurrentUserId(state));
    }
    return filteredProfiles;
}
exports.searchProfilesWithoutTeam = searchProfilesWithoutTeam;
function removeCurrentUserFromList(profiles, currentUserId) {
    var index = profiles.findIndex(function (p) { return p.id === currentUserId; });
    if (index >= 0) {
        profiles.splice(index, 1);
    }
}
exports.shouldShowTermsOfService = reselect_1.createSelector(general_1.getConfig, common_1.getCurrentUser, general_1.getLicense, function (config, user, license) {
    // Defaults to false if the user is not logged in or the setting doesn't exist
    var acceptedTermsId = user ? user.terms_of_service_id : '';
    var acceptedAt = user ? user.terms_of_service_create_at : 0;
    var featureEnabled = license.IsLicensed === 'true' && config.EnableCustomTermsOfService === 'true';
    var reacceptanceTime = parseInt(config.CustomTermsOfServiceReAcceptancePeriod, 10) * 1000 * 60 * 60 * 24;
    var timeElapsed = new Date().getTime() - acceptedAt;
    return Boolean(user && featureEnabled && (config.CustomTermsOfServiceId !== acceptedTermsId || timeElapsed > reacceptanceTime));
});
exports.getUsersInVisibleDMs = reselect_1.createSelector(common_1.getUsers, preferences_1.getDirectShowPreferences, function (users, preferences) {
    var dmUsers = [];
    preferences.forEach(function (pref) {
        if (pref.value === 'true' && users[pref.name]) {
            dmUsers.push(users[pref.name]);
        }
    });
    return dmUsers;
});
function makeGetProfilesForReactions() {
    return reselect_1.createSelector(common_1.getUsers, function (state, reactions) { return reactions; }, function (users, reactions) {
        var profiles = [];
        reactions.forEach(function (r) {
            if (users[r.user_id]) {
                profiles.push(users[r.user_id]);
            }
        });
        return profiles;
    });
}
exports.makeGetProfilesForReactions = makeGetProfilesForReactions;
function makeGetProfilesInChannel() {
    return reselect_1.createSelector(common_1.getUsers, getUserIdsInChannels, common_1.getMembersInChannel, function (state, channelId) { return channelId; }, function (state, channelId, filters) { return filters; }, function (users, userIds, membersInChannel, channelId, filters) {
        if (filters === void 0) { filters = {}; }
        var userIdsInChannel = userIds[channelId];
        if (!userIdsInChannel) {
            return [];
        }
        return sortAndInjectProfiles(filterProfiles(users, filters, membersInChannel), userIdsInChannel);
    });
}
exports.makeGetProfilesInChannel = makeGetProfilesInChannel;
function makeGetProfilesNotInChannel() {
    return reselect_1.createSelector(common_1.getUsers, getUserIdsNotInChannels, function (state, channelId) { return channelId; }, function (state, channelId, filters) { return filters; }, function (users, userIds, channelId, filters) {
        if (filters === void 0) { filters = {}; }
        var userIdsInChannel = userIds[channelId];
        if (!userIdsInChannel) {
            return [];
        }
        else if (filters) {
            return sortAndInjectProfiles(filterProfiles(users, filters), userIdsInChannel);
        }
        return sortAndInjectProfiles(users, userIdsInChannel);
    });
}
exports.makeGetProfilesNotInChannel = makeGetProfilesNotInChannel;
function makeGetProfilesByIdsAndUsernames() {
    return reselect_1.createSelector(common_1.getUsers, exports.getUsersByUsername, function (state, props) { return props.allUserIds; }, function (state, props) { return props.allUsernames; }, function (allProfilesById, allProfilesByUsername, allUserIds, allUsernames) {
        var userProfiles = [];
        if (allUserIds && allUserIds.length > 0) {
            var profilesById = allUserIds.
                filter(function (userId) { return allProfilesById[userId]; }).
                map(function (userId) { return allProfilesById[userId]; });
            if (profilesById && profilesById.length > 0) {
                userProfiles.push.apply(userProfiles, tslib_1.__spread(profilesById));
            }
        }
        if (allUsernames && allUsernames.length > 0) {
            var profilesByUsername = allUsernames.
                filter(function (username) { return allProfilesByUsername[username]; }).
                map(function (username) { return allProfilesByUsername[username]; });
            if (profilesByUsername && profilesByUsername.length > 0) {
                userProfiles.push.apply(userProfiles, tslib_1.__spread(profilesByUsername));
            }
        }
        return userProfiles;
    });
}
exports.makeGetProfilesByIdsAndUsernames = makeGetProfilesByIdsAndUsernames;
function makeGetDisplayName() {
    return reselect_1.createSelector(function (state, userId) { return getUser(state, userId); }, preferences_1.getTeammateNameDisplaySetting, function (state, userId, useFallbackUsername) {
        if (useFallbackUsername === void 0) { useFallbackUsername = true; }
        return useFallbackUsername;
    }, function (user, teammateNameDisplaySetting, useFallbackUsername) {
        return user_utils_1.displayUsername(user, teammateNameDisplaySetting, useFallbackUsername);
    });
}
exports.makeGetDisplayName = makeGetDisplayName;
exports.getProfilesInGroup = reselect_1.createSelector(common_1.getUsers, getUserIdsInGroups, function (state, groupId) { return groupId; }, function (state, groupId, filters) { return filters; }, function (profiles, usersInGroups, groupId, filters) {
    return sortAndInjectProfiles(filterProfiles(profiles, filters), usersInGroups[groupId] || new Set());
});
function searchProfilesInGroup(state, groupId, term, skipCurrent, filters) {
    if (skipCurrent === void 0) { skipCurrent = false; }
    var profiles = user_utils_1.filterProfilesStartingWithTerm(exports.getProfilesInGroup(state, groupId, filters), term);
    if (skipCurrent) {
        removeCurrentUserFromList(profiles, common_1.getCurrentUserId(state));
    }
    return profiles;
}
exports.searchProfilesInGroup = searchProfilesInGroup;
//# sourceMappingURL=users.js.map