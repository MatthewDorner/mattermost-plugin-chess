"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRolesFilters = exports.sortByUsername = exports.filterProfilesMatchingWithTerm = exports.filterProfilesStartingWithTerm = exports.nameSuggestionsForUser = exports.getSuggestionsSplitByMultiple = exports.getSuggestionsSplitBy = exports.removeUserFromList = exports.profileListToMap = exports.hasPostAllPublicRole = exports.hasPostAllRole = exports.hasUserAccessTokenRole = exports.isChannelAdmin = exports.includesAnAdminRole = exports.isSystemAdmin = exports.isTeamAdmin = exports.isGuest = exports.isAdmin = exports.spaceSeparatedStringIncludes = exports.displayUsername = exports.getFullName = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var constants_1 = require("../constants");
var i18n_utils_1 = require("./i18n_utils");
function getFullName(user) {
    if (user.first_name && user.last_name) {
        return user.first_name + ' ' + user.last_name;
    }
    else if (user.first_name) {
        return user.first_name;
    }
    else if (user.last_name) {
        return user.last_name;
    }
    return '';
}
exports.getFullName = getFullName;
function displayUsername(user, teammateNameDisplay, useFallbackUsername) {
    if (useFallbackUsername === void 0) { useFallbackUsername = true; }
    var name = useFallbackUsername ? i18n_utils_1.localizeMessage('channel_loader.someone', 'Someone') : '';
    if (user) {
        if (teammateNameDisplay === constants_1.Preferences.DISPLAY_PREFER_NICKNAME) {
            name = user.nickname || getFullName(user);
        }
        else if (teammateNameDisplay === constants_1.Preferences.DISPLAY_PREFER_FULL_NAME) {
            name = getFullName(user);
        }
        else {
            name = user.username;
        }
        if (!name || name.trim().length === 0) {
            name = user.username;
        }
    }
    return name;
}
exports.displayUsername = displayUsername;
function spaceSeparatedStringIncludes(spaceSeparated, item) {
    var items = spaceSeparated.split(' ');
    return items.includes(item);
}
exports.spaceSeparatedStringIncludes = spaceSeparatedStringIncludes;
function isAdmin(roles) {
    return isSystemAdmin(roles) || isTeamAdmin(roles);
}
exports.isAdmin = isAdmin;
function isGuest(roles) {
    return spaceSeparatedStringIncludes(roles, 'system_guest');
}
exports.isGuest = isGuest;
function isTeamAdmin(roles) {
    return spaceSeparatedStringIncludes(roles, constants_1.General.TEAM_ADMIN_ROLE);
}
exports.isTeamAdmin = isTeamAdmin;
function isSystemAdmin(roles) {
    return spaceSeparatedStringIncludes(roles, constants_1.General.SYSTEM_ADMIN_ROLE);
}
exports.isSystemAdmin = isSystemAdmin;
function includesAnAdminRole(roles) {
    var rolesArray = roles.split(' ');
    return [
        constants_1.General.SYSTEM_ADMIN_ROLE,
        constants_1.General.SYSTEM_USER_MANAGER_ROLE,
        constants_1.General.SYSTEM_READ_ONLY_ADMIN_ROLE,
        constants_1.General.SYSTEM_MANAGER_ROLE,
    ].some(function (el) { return rolesArray.includes(el); });
}
exports.includesAnAdminRole = includesAnAdminRole;
function isChannelAdmin(roles) {
    return spaceSeparatedStringIncludes(roles, constants_1.General.CHANNEL_ADMIN_ROLE);
}
exports.isChannelAdmin = isChannelAdmin;
function hasUserAccessTokenRole(roles) {
    return spaceSeparatedStringIncludes(roles, constants_1.General.SYSTEM_USER_ACCESS_TOKEN_ROLE);
}
exports.hasUserAccessTokenRole = hasUserAccessTokenRole;
function hasPostAllRole(roles) {
    return spaceSeparatedStringIncludes(roles, constants_1.General.SYSTEM_POST_ALL_ROLE);
}
exports.hasPostAllRole = hasPostAllRole;
function hasPostAllPublicRole(roles) {
    return spaceSeparatedStringIncludes(roles, constants_1.General.SYSTEM_POST_ALL_PUBLIC_ROLE);
}
exports.hasPostAllPublicRole = hasPostAllPublicRole;
function profileListToMap(profileList) {
    var profiles = {};
    for (var i = 0; i < profileList.length; i++) {
        profiles[profileList[i].id] = profileList[i];
    }
    return profiles;
}
exports.profileListToMap = profileListToMap;
function removeUserFromList(userId, list) {
    for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].id === userId) {
            list.splice(i, 1);
            return list;
        }
    }
    return list;
}
exports.removeUserFromList = removeUserFromList;
// Splits the term by a splitStr and composes a list of the parts of
// the split concatenated with the rest, forming a set of suggesitons
// matchable with startsWith
//
// E.g.: for "one.two.three" by "." it would yield
// ["one.two.three", ".two.three", "two.three", ".three", "three"]
function getSuggestionsSplitBy(term, splitStr) {
    var splitTerm = term.split(splitStr);
    var initialSuggestions = splitTerm.map(function (st, i) { return splitTerm.slice(i).join(splitStr); });
    var suggestions = [];
    if (splitStr === ' ') {
        suggestions = initialSuggestions;
    }
    else {
        suggestions = initialSuggestions.reduce(function (acc, val) {
            if (acc.length === 0) {
                acc.push(val);
            }
            else {
                acc.push(splitStr + val, val);
            }
            return acc;
        }, []);
    }
    return suggestions;
}
exports.getSuggestionsSplitBy = getSuggestionsSplitBy;
function getSuggestionsSplitByMultiple(term, splitStrs) {
    var suggestions = splitStrs.reduce(function (acc, val) {
        getSuggestionsSplitBy(term, val).forEach(function (suggestion) { return acc.add(suggestion); });
        return acc;
    }, new Set());
    return tslib_1.__spread(suggestions);
}
exports.getSuggestionsSplitByMultiple = getSuggestionsSplitByMultiple;
function nameSuggestionsForUser(user) {
    var profileSuggestions = [];
    var usernameSuggestions = getSuggestionsSplitByMultiple((user.username || '').toLowerCase(), constants_1.General.AUTOCOMPLETE_SPLIT_CHARACTERS);
    profileSuggestions.push.apply(profileSuggestions, tslib_1.__spread(usernameSuggestions));
    var first = (user.first_name || '').toLowerCase();
    var last = (user.last_name || '').toLowerCase();
    var full = first + ' ' + last;
    profileSuggestions.push(first, last, full);
    profileSuggestions.push((user.nickname || '').toLowerCase());
    profileSuggestions.push((user.position || '').toLowerCase());
    var email = (user.email || '').toLowerCase();
    profileSuggestions.push(email);
    var split = email.split('@');
    if (split.length > 1) {
        profileSuggestions.push(split[1]);
    }
    return profileSuggestions;
}
exports.nameSuggestionsForUser = nameSuggestionsForUser;
function filterProfilesStartingWithTerm(users, term) {
    var lowercasedTerm = term.toLowerCase();
    var trimmedTerm = lowercasedTerm;
    if (trimmedTerm.startsWith('@')) {
        trimmedTerm = trimmedTerm.substr(1);
    }
    return users.filter(function (user) {
        if (!user) {
            return false;
        }
        var profileSuggestions = nameSuggestionsForUser(user);
        return profileSuggestions.filter(function (suggestion) { return suggestion !== ''; }).some(function (suggestion) { return suggestion.startsWith(trimmedTerm); });
    });
}
exports.filterProfilesStartingWithTerm = filterProfilesStartingWithTerm;
function filterProfilesMatchingWithTerm(users, term) {
    var lowercasedTerm = term.toLowerCase();
    var trimmedTerm = lowercasedTerm;
    if (trimmedTerm.startsWith('@')) {
        trimmedTerm = trimmedTerm.substr(1);
    }
    return users.filter(function (user) {
        if (!user) {
            return false;
        }
        var profileSuggestions = nameSuggestionsForUser(user);
        return profileSuggestions.filter(function (suggestion) { return suggestion !== ''; }).some(function (suggestion) { return suggestion.includes(trimmedTerm); });
    });
}
exports.filterProfilesMatchingWithTerm = filterProfilesMatchingWithTerm;
function sortByUsername(a, b) {
    var nameA = a.username;
    var nameB = b.username;
    return nameA.localeCompare(nameB);
}
exports.sortByUsername = sortByUsername;
function checkUserHasRole(user, userIsNotAdminOrGuest, membership, role) {
    var isSystemRole = role.includes('system');
    return ((
    // If role is system user then user cannot have system admin or system guest roles
    isSystemRole && user.roles.includes(role) && ((role === constants_1.General.SYSTEM_USER_ROLE && userIsNotAdminOrGuest) ||
        role !== constants_1.General.SYSTEM_USER_ROLE)) || (
    // If user is a system admin or a system guest then ignore team and channel memberships
    !isSystemRole && userIsNotAdminOrGuest && ((role === constants_1.General.TEAM_ADMIN_ROLE && (membership === null || membership === void 0 ? void 0 : membership.scheme_admin)) ||
        (role === constants_1.General.CHANNEL_ADMIN_ROLE && (membership === null || membership === void 0 ? void 0 : membership.scheme_admin)) ||
        (role === constants_1.General.TEAM_USER_ROLE && (membership === null || membership === void 0 ? void 0 : membership.scheme_user) && !(membership === null || membership === void 0 ? void 0 : membership.scheme_admin)) ||
        (role === constants_1.General.CHANNEL_USER_ROLE && (membership === null || membership === void 0 ? void 0 : membership.scheme_user) && !(membership === null || membership === void 0 ? void 0 : membership.scheme_admin)))));
}
function applyRolesFilters(user, filterRoles, excludeRoles, membership) {
    var userIsNotAdminOrGuest = !(user.roles.includes(constants_1.General.SYSTEM_ADMIN_ROLE) || user.roles.includes(constants_1.General.SYSTEM_GUEST_ROLE));
    var userHasExcludedRole = excludeRoles.some(checkUserHasRole.bind(this, user, userIsNotAdminOrGuest, membership));
    if (userHasExcludedRole) {
        return false;
    }
    return filterRoles.length === 0 || filterRoles.some(checkUserHasRole.bind(this, user, userIsNotAdminOrGuest, membership));
}
exports.applyRolesFilters = applyRolesFilters;
//# sourceMappingURL=user_utils.js.map