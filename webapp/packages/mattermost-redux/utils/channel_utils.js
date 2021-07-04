"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterChannelsMatchingTerm = exports.areChannelMentionsIgnored = exports.isChannelMuted = exports.sortChannelsByRecency = exports.sortChannelsByDisplayNameAndMuted = exports.sortChannelsByDisplayName = exports.sortChannelsByTypeAndDisplayName = exports.sortChannelsByTypeListAndDisplayName = exports.isPrivateChannel = exports.isOpenChannel = exports.isUnreadChannel = exports.isDefault = exports.isFavoriteChannelOld = exports.getGroupDisplayNameFromUserIds = exports.getChannelsIdForTeam = exports.canManageMembersOldPermissions = exports.showDeleteOption = exports.showManagementOptions = exports.showCreateOption = exports.isGroupOrDirectChannelVisible = exports.isGroupChannelVisible = exports.isGroupChannel = exports.isDirectChannelVisible = exports.isDirectChannel = exports.isAutoClosed = exports.getUserIdFromChannelName = exports.getDirectChannelName = exports.getChannelByName = exports.cleanUpUrlable = exports.completeDirectChannelDisplayName = exports.newCompleteDirectChannelInfo = exports.completeDirectChannelInfo = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../constants");
var channels_1 = require("../constants/channels");
var general_1 = require("../selectors/entities/general");
var roles_1 = require("../selectors/entities/roles");
var preference_utils_1 = require("./preference_utils");
var user_utils_1 = require("./user_utils");
var channelTypeOrder = (_a = {},
    _a[constants_1.General.OPEN_CHANNEL] = 0,
    _a[constants_1.General.PRIVATE_CHANNEL] = 1,
    _a[constants_1.General.DM_CHANNEL] = 2,
    _a[constants_1.General.GM_CHANNEL] = 3,
    _a);
function completeDirectChannelInfo(usersState, teammateNameDisplay, channel) {
    if (isDirectChannel(channel)) {
        var teammateId = getUserIdFromChannelName(usersState.currentUserId, channel.name);
        // return empty string instead of `someone` default string for display_name
        return tslib_1.__assign(tslib_1.__assign({}, channel), { display_name: user_utils_1.displayUsername(usersState.profiles[teammateId], teammateNameDisplay, false), teammate_id: teammateId, status: usersState.statuses[teammateId] || 'offline' });
    }
    else if (isGroupChannel(channel)) {
        return completeDirectGroupInfo(usersState, teammateNameDisplay, channel);
    }
    return channel;
}
exports.completeDirectChannelInfo = completeDirectChannelInfo;
// newCompleteDirectChannelInfo is a variant of completeDirectChannelInfo that accepts the minimal
// data required instead of depending on the entirety of state.entities.users. This allows the
// calling selector to have fewer dependencies, reducing its need to recompute when memoized.
//
// Ideally, this would replace completeDirectChannelInfo altogether, but is currently factored out
// to minimize changes while addressing a critical performance issue.
function newCompleteDirectChannelInfo(currentUserId, profiles, profilesInChannel, teammateStatus, teammateNameDisplay, channel) {
    if (isDirectChannel(channel)) {
        var teammateId = getUserIdFromChannelName(currentUserId, channel.name);
        // return empty string instead of `someone` default string for display_name
        return tslib_1.__assign(tslib_1.__assign({}, channel), { display_name: user_utils_1.displayUsername(profiles[teammateId], teammateNameDisplay, false), teammate_id: teammateId, status: teammateStatus });
    }
    else if (isGroupChannel(channel)) {
        return newCompleteDirectGroupInfo(currentUserId, profiles, profilesInChannel, teammateNameDisplay, channel);
    }
    return channel;
}
exports.newCompleteDirectChannelInfo = newCompleteDirectChannelInfo;
function completeDirectChannelDisplayName(currentUserId, profiles, userIdsInChannel, teammateNameDisplay, channel) {
    if (isDirectChannel(channel)) {
        var dmChannelClone = tslib_1.__assign({}, channel);
        var teammateId = getUserIdFromChannelName(currentUserId, channel.name);
        return Object.assign(dmChannelClone, { display_name: user_utils_1.displayUsername(profiles[teammateId], teammateNameDisplay) });
    }
    else if (isGroupChannel(channel) && userIdsInChannel && userIdsInChannel.size > 0) {
        var displayName = getGroupDisplayNameFromUserIds(Array.from(userIdsInChannel), profiles, currentUserId, teammateNameDisplay);
        return tslib_1.__assign(tslib_1.__assign({}, channel), { display_name: displayName });
    }
    return channel;
}
exports.completeDirectChannelDisplayName = completeDirectChannelDisplayName;
function cleanUpUrlable(input) {
    var cleaned = input.trim().replace(/-/g, ' ').replace(/[^\w\s]/gi, '').toLowerCase().replace(/\s/g, '-');
    cleaned = cleaned.replace(/-{2,}/, '-');
    cleaned = cleaned.replace(/^-+/, '');
    cleaned = cleaned.replace(/-+$/, '');
    return cleaned;
}
exports.cleanUpUrlable = cleanUpUrlable;
function getChannelByName(channels, name) {
    var channelIds = Object.keys(channels);
    for (var i = 0; i < channelIds.length; i++) {
        var id = channelIds[i];
        if (channels[id].name === name) {
            return channels[id];
        }
    }
    return null;
}
exports.getChannelByName = getChannelByName;
function getDirectChannelName(id, otherId) {
    var handle;
    if (otherId > id) {
        handle = id + '__' + otherId;
    }
    else {
        handle = otherId + '__' + id;
    }
    return handle;
}
exports.getDirectChannelName = getDirectChannelName;
function getUserIdFromChannelName(userId, channelName) {
    var ids = channelName.split('__');
    var otherUserId = '';
    if (ids[0] === userId) {
        otherUserId = ids[1];
    }
    else {
        otherUserId = ids[0];
    }
    return otherUserId;
}
exports.getUserIdFromChannelName = getUserIdFromChannelName;
function isAutoClosed(config, myPreferences, channel, channelActivity, channelArchiveTime, currentChannelId, now) {
    if (currentChannelId === void 0) { currentChannelId = ''; }
    if (now === void 0) { now = Date.now(); }
    var cutoff = now - (7 * 24 * 60 * 60 * 1000);
    var viewTimePref = myPreferences[constants_1.Preferences.CATEGORY_CHANNEL_APPROXIMATE_VIEW_TIME + "--" + channel.id];
    var viewTime = viewTimePref ? parseInt(viewTimePref.value, 10) : 0;
    // Note that viewTime is not set correctly at the time of writing
    if (viewTime > cutoff) {
        return false;
    }
    var openTimePref = myPreferences[constants_1.Preferences.CATEGORY_CHANNEL_OPEN_TIME + "--" + channel.id];
    var openTime = openTimePref ? parseInt(openTimePref.value, 10) : 0;
    // Only close archived channels when not being viewed
    if (channel.id !== currentChannelId && channelArchiveTime && channelArchiveTime > openTime) {
        return true;
    }
    if (config.CloseUnusedDirectMessages !== 'true' || isFavoriteChannelOld(myPreferences, channel.id)) {
        return false;
    }
    var autoClose = myPreferences[preference_utils_1.getPreferenceKey(constants_1.Preferences.CATEGORY_SIDEBAR_SETTINGS, constants_1.Preferences.CHANNEL_SIDEBAR_AUTOCLOSE_DMS)];
    if (!autoClose || autoClose.value === constants_1.Preferences.AUTOCLOSE_DMS_ENABLED) {
        if (channelActivity && channelActivity > cutoff) {
            return false;
        }
        if (openTime > cutoff) {
            return false;
        }
        var lastActivity = channel.last_post_at;
        return !lastActivity || lastActivity < cutoff;
    }
    return false;
}
exports.isAutoClosed = isAutoClosed;
function isDirectChannel(channel) {
    return channel.type === constants_1.General.DM_CHANNEL;
}
exports.isDirectChannel = isDirectChannel;
function isDirectChannelVisible(otherUserOrOtherUserId, config, myPreferences, channel, lastPost, isUnread, currentChannelId, now) {
    if (currentChannelId === void 0) { currentChannelId = ''; }
    var otherUser = typeof otherUserOrOtherUserId === 'object' ? otherUserOrOtherUserId : null;
    var otherUserId = typeof otherUserOrOtherUserId === 'object' ? otherUserOrOtherUserId.id : otherUserOrOtherUserId;
    var dm = myPreferences[constants_1.Preferences.CATEGORY_DIRECT_CHANNEL_SHOW + "--" + otherUserId];
    if (!dm || dm.value !== 'true') {
        return false;
    }
    return isUnread || !isAutoClosed(config, myPreferences, channel, lastPost ? lastPost.create_at : 0, otherUser ? otherUser.delete_at : 0, currentChannelId, now);
}
exports.isDirectChannelVisible = isDirectChannelVisible;
function isGroupChannel(channel) {
    return channel.type === constants_1.General.GM_CHANNEL;
}
exports.isGroupChannel = isGroupChannel;
function isGroupChannelVisible(config, myPreferences, channel, lastPost, isUnread, now) {
    var gm = myPreferences[constants_1.Preferences.CATEGORY_GROUP_CHANNEL_SHOW + "--" + channel.id];
    if (!gm || gm.value !== 'true') {
        return false;
    }
    return isUnread || !isAutoClosed(config, myPreferences, channel, lastPost ? lastPost.create_at : 0, 0, '', now);
}
exports.isGroupChannelVisible = isGroupChannelVisible;
function isGroupOrDirectChannelVisible(channel, memberships, config, myPreferences, currentUserId, users, lastPosts, currentChannelId, now) {
    var lastPost = lastPosts[channel.id];
    if (isGroupChannel(channel) && isGroupChannelVisible(config, myPreferences, channel, lastPost, isUnreadChannel(memberships, channel), now)) {
        return true;
    }
    if (!isDirectChannel(channel)) {
        return false;
    }
    var otherUserId = getUserIdFromChannelName(currentUserId, channel.name);
    return isDirectChannelVisible(users[otherUserId] || otherUserId, config, myPreferences, channel, lastPost, isUnreadChannel(memberships, channel), currentChannelId, now);
}
exports.isGroupOrDirectChannelVisible = isGroupOrDirectChannelVisible;
function showCreateOption(state, config, license, teamId, channelType, isAdmin, isSystemAdmin) {
    if (general_1.hasNewPermissions(state)) {
        if (channelType === constants_1.General.OPEN_CHANNEL) {
            return roles_1.haveITeamPermission(state, { team: teamId, permission: constants_1.Permissions.CREATE_PUBLIC_CHANNEL });
        }
        else if (channelType === constants_1.General.PRIVATE_CHANNEL) {
            return roles_1.haveITeamPermission(state, { team: teamId, permission: constants_1.Permissions.CREATE_PRIVATE_CHANNEL });
        }
        return true;
    }
    if (license.IsLicensed !== 'true') {
        return true;
    }
    // Backwards compatibility with pre-advanced permissions config settings.
    if (channelType === constants_1.General.OPEN_CHANNEL) {
        if (config.RestrictPublicChannelCreation === constants_1.General.SYSTEM_ADMIN_ROLE && !isSystemAdmin) {
            return false;
        }
        else if (config.RestrictPublicChannelCreation === constants_1.General.TEAM_ADMIN_ROLE && !isAdmin) {
            return false;
        }
    }
    else if (channelType === constants_1.General.PRIVATE_CHANNEL) {
        if (config.RestrictPrivateChannelCreation === constants_1.General.SYSTEM_ADMIN_ROLE && !isSystemAdmin) {
            return false;
        }
        else if (config.RestrictPrivateChannelCreation === constants_1.General.TEAM_ADMIN_ROLE && !isAdmin) {
            return false;
        }
    }
    return true;
}
exports.showCreateOption = showCreateOption;
function showManagementOptions(state, config, license, channel, isAdmin, isSystemAdmin, isChannelAdmin) {
    if (general_1.hasNewPermissions(state)) {
        if (channel.type === constants_1.General.OPEN_CHANNEL) {
            return roles_1.haveIChannelPermission(state, { channel: channel.id, team: channel.team_id, permission: constants_1.Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES });
        }
        else if (channel.type === constants_1.General.PRIVATE_CHANNEL) {
            return roles_1.haveIChannelPermission(state, { channel: channel.id, team: channel.team_id, permission: constants_1.Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES });
        }
        return true;
    }
    if (license.IsLicensed !== 'true') {
        return true;
    }
    // Backwards compatibility with pre-advanced permissions config settings.
    if (channel.type === constants_1.General.OPEN_CHANNEL) {
        if (config.RestrictPublicChannelManagement === constants_1.General.SYSTEM_ADMIN_ROLE && !isSystemAdmin) {
            return false;
        }
        if (config.RestrictPublicChannelManagement === constants_1.General.TEAM_ADMIN_ROLE && !isAdmin) {
            return false;
        }
        if (config.RestrictPublicChannelManagement === constants_1.General.CHANNEL_ADMIN_ROLE && !isChannelAdmin && !isAdmin) {
            return false;
        }
    }
    else if (channel.type === constants_1.General.PRIVATE_CHANNEL) {
        if (config.RestrictPrivateChannelManagement === constants_1.General.SYSTEM_ADMIN_ROLE && !isSystemAdmin) {
            return false;
        }
        if (config.RestrictPrivateChannelManagement === constants_1.General.TEAM_ADMIN_ROLE && !isAdmin) {
            return false;
        }
        if (config.RestrictPrivateChannelManagement === constants_1.General.CHANNEL_ADMIN_ROLE && !isChannelAdmin && !isAdmin) {
            return false;
        }
    }
    return true;
}
exports.showManagementOptions = showManagementOptions;
function showDeleteOption(state, config, license, channel, isAdmin, isSystemAdmin, isChannelAdmin) {
    if (general_1.hasNewPermissions(state)) {
        if (channel.type === constants_1.General.OPEN_CHANNEL) {
            return roles_1.haveIChannelPermission(state, { channel: channel.id, team: channel.team_id, permission: constants_1.Permissions.DELETE_PUBLIC_CHANNEL });
        }
        else if (channel.type === constants_1.General.PRIVATE_CHANNEL) {
            return roles_1.haveIChannelPermission(state, { channel: channel.id, team: channel.team_id, permission: constants_1.Permissions.DELETE_PRIVATE_CHANNEL });
        }
        return true;
    }
    if (license.IsLicensed !== 'true') {
        return true;
    }
    // Backwards compatibility with pre-advanced permissions config settings.
    if (channel.type === constants_1.General.OPEN_CHANNEL) {
        if (config.RestrictPublicChannelDeletion === constants_1.General.SYSTEM_ADMIN_ROLE && !isSystemAdmin) {
            return false;
        }
        if (config.RestrictPublicChannelDeletion === constants_1.General.TEAM_ADMIN_ROLE && !isAdmin) {
            return false;
        }
        if (config.RestrictPublicChannelDeletion === constants_1.General.CHANNEL_ADMIN_ROLE && !isChannelAdmin && !isAdmin) {
            return false;
        }
    }
    else if (channel.type === constants_1.General.PRIVATE_CHANNEL) {
        if (config.RestrictPrivateChannelDeletion === constants_1.General.SYSTEM_ADMIN_ROLE && !isSystemAdmin) {
            return false;
        }
        if (config.RestrictPrivateChannelDeletion === constants_1.General.TEAM_ADMIN_ROLE && !isAdmin) {
            return false;
        }
        if (config.RestrictPrivateChannelDeletion === constants_1.General.CHANNEL_ADMIN_ROLE && !isChannelAdmin && !isAdmin) {
            return false;
        }
    }
    return true;
}
exports.showDeleteOption = showDeleteOption;
// Backwards compatibility with pre-advanced permissions config settings.
function canManageMembersOldPermissions(channel, user, teamMember, channelMember, config, license) {
    if (channel.type === constants_1.General.DM_CHANNEL ||
        channel.type === constants_1.General.GM_CHANNEL ||
        channel.name === constants_1.General.DEFAULT_CHANNEL) {
        return false;
    }
    if (license.IsLicensed !== 'true') {
        return true;
    }
    if (channel.type === constants_1.General.PRIVATE_CHANNEL) {
        var isSystemAdmin = user.roles.includes(constants_1.General.SYSTEM_ADMIN_ROLE);
        if (config.RestrictPrivateChannelManageMembers === constants_1.General.PERMISSIONS_SYSTEM_ADMIN && !isSystemAdmin) {
            return false;
        }
        var isTeamAdmin = teamMember.roles.includes(constants_1.General.TEAM_ADMIN_ROLE);
        if (config.RestrictPrivateChannelManageMembers === constants_1.General.PERMISSIONS_TEAM_ADMIN && !isTeamAdmin && !isSystemAdmin) {
            return false;
        }
        var isChannelAdmin = channelMember.roles.includes(constants_1.General.CHANNEL_ADMIN_ROLE);
        if (config.RestrictPrivateChannelManageMembers === constants_1.General.PERMISSIONS_CHANNEL_ADMIN && !isChannelAdmin && !isTeamAdmin && !isSystemAdmin) {
            return false;
        }
    }
    return true;
}
exports.canManageMembersOldPermissions = canManageMembersOldPermissions;
function getChannelsIdForTeam(state, teamId) {
    var channels = state.entities.channels.channels;
    return Object.keys(channels).map(function (key) { return channels[key]; }).reduce(function (res, channel) {
        if (channel.team_id === teamId) {
            res.push(channel.id);
        }
        return res;
    }, []);
}
exports.getChannelsIdForTeam = getChannelsIdForTeam;
function getGroupDisplayNameFromUserIds(userIds, profiles, currentUserId, teammateNameDisplay) {
    var names = [];
    userIds.forEach(function (id) {
        if (id !== currentUserId) {
            names.push(user_utils_1.displayUsername(profiles[id], teammateNameDisplay));
        }
    });
    function sortUsernames(a, b) {
        var locale = getUserLocale(currentUserId, profiles);
        return a.localeCompare(b, locale, { numeric: true });
    }
    return names.sort(sortUsernames).join(', ');
}
exports.getGroupDisplayNameFromUserIds = getGroupDisplayNameFromUserIds;
function isFavoriteChannelOld(myPreferences, id) {
    var fav = myPreferences[constants_1.Preferences.CATEGORY_FAVORITE_CHANNEL + "--" + id];
    return fav ? fav.value === 'true' : false;
}
exports.isFavoriteChannelOld = isFavoriteChannelOld;
function isDefault(channel) {
    return channel.name === constants_1.General.DEFAULT_CHANNEL;
}
exports.isDefault = isDefault;
function completeDirectGroupInfo(usersState, teammateNameDisplay, channel) {
    var currentUserId = usersState.currentUserId, profiles = usersState.profiles, profilesInChannel = usersState.profilesInChannel;
    var profilesIds = profilesInChannel[channel.id];
    var gm = tslib_1.__assign({}, channel);
    if (profilesIds) {
        gm.display_name = getGroupDisplayNameFromUserIds(profilesIds, profiles, currentUserId, teammateNameDisplay);
        return gm;
    }
    var usernames = gm.display_name.split(', ');
    var users = Object.keys(profiles).map(function (key) { return profiles[key]; });
    var userIds = [];
    usernames.forEach(function (username) {
        var u = users.find(function (p) { return p.username === username; });
        if (u) {
            userIds.push(u.id);
        }
    });
    if (usernames.length === userIds.length) {
        gm.display_name = getGroupDisplayNameFromUserIds(userIds, profiles, currentUserId, teammateNameDisplay);
        return gm;
    }
    return channel;
}
// newCompleteDirectGroupInfo is a variant of completeDirectGroupInfo that accepts the minimal
// data required instead of depending on the entirety of state.entities.users. This allows the
// calling selector to have fewer dependencies, reducing its need to recompute when memoized.
//
// See also newCompleteDirectChannelInfo.
function newCompleteDirectGroupInfo(currentUserId, profiles, profilesInChannel, teammateNameDisplay, channel) {
    var profilesIds = profilesInChannel[channel.id];
    var gm = tslib_1.__assign({}, channel);
    if (profilesIds) {
        gm.display_name = getGroupDisplayNameFromUserIds(profilesIds, profiles, currentUserId, teammateNameDisplay);
        return gm;
    }
    var usernames = gm.display_name.split(', ');
    var users = Object.keys(profiles).map(function (key) { return profiles[key]; });
    var userIds = [];
    usernames.forEach(function (username) {
        var u = users.find(function (p) { return p.username === username; });
        if (u) {
            userIds.push(u.id);
        }
    });
    if (usernames.length === userIds.length) {
        gm.display_name = getGroupDisplayNameFromUserIds(userIds, profiles, currentUserId, teammateNameDisplay);
        return gm;
    }
    return channel;
}
function isUnreadChannel(members, channel) {
    var member = members[channel.id];
    if (member) {
        var msgCount = channel.total_msg_count - member.msg_count;
        var onlyMentions = member.notify_props && member.notify_props.mark_unread === channels_1.MarkUnread.MENTION;
        return (member.mention_count > 0 || (Boolean(msgCount) && !onlyMentions));
    }
    return false;
}
exports.isUnreadChannel = isUnreadChannel;
function isOpenChannel(channel) {
    return channel.type === constants_1.General.OPEN_CHANNEL;
}
exports.isOpenChannel = isOpenChannel;
function isPrivateChannel(channel) {
    return channel.type === constants_1.General.PRIVATE_CHANNEL;
}
exports.isPrivateChannel = isPrivateChannel;
function sortChannelsByTypeListAndDisplayName(locale, typeList, a, b) {
    var idxA = typeList.indexOf(a.type);
    var idxB = typeList.indexOf(b.type);
    if (idxA === -1 && idxB !== -1) {
        return 1;
    }
    if (idxB === -1 && idxA !== -1) {
        return -1;
    }
    if (idxA !== idxB) {
        if (idxA < idxB) {
            return -1;
        }
        return 1;
    }
    var aDisplayName = filterName(a.display_name);
    var bDisplayName = filterName(b.display_name);
    if (aDisplayName !== bDisplayName) {
        return aDisplayName.toLowerCase().localeCompare(bDisplayName.toLowerCase(), locale, { numeric: true });
    }
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), locale, { numeric: true });
}
exports.sortChannelsByTypeListAndDisplayName = sortChannelsByTypeListAndDisplayName;
function sortChannelsByTypeAndDisplayName(locale, a, b) {
    if (channelTypeOrder[a.type] !== channelTypeOrder[b.type]) {
        if (channelTypeOrder[a.type] < channelTypeOrder[b.type]) {
            return -1;
        }
        return 1;
    }
    var aDisplayName = filterName(a.display_name);
    var bDisplayName = filterName(b.display_name);
    if (aDisplayName !== bDisplayName) {
        return aDisplayName.toLowerCase().localeCompare(bDisplayName.toLowerCase(), locale, { numeric: true });
    }
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), locale, { numeric: true });
}
exports.sortChannelsByTypeAndDisplayName = sortChannelsByTypeAndDisplayName;
function filterName(name) {
    return name.replace(/[.,'"\/#!$%\^&\*;:{}=\-_`~()]/g, ''); // eslint-disable-line no-useless-escape
}
function sortChannelsByDisplayName(locale, a, b) {
    // if both channels have the display_name defined
    if (a.display_name && b.display_name && a.display_name !== b.display_name) {
        return a.display_name.toLowerCase().localeCompare(b.display_name.toLowerCase(), locale, { numeric: true });
    }
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), locale, { numeric: true });
}
exports.sortChannelsByDisplayName = sortChannelsByDisplayName;
function sortChannelsByDisplayNameAndMuted(locale, members, a, b) {
    var aMember = members[a.id];
    var bMember = members[b.id];
    if (isChannelMuted(bMember) === isChannelMuted(aMember)) {
        return sortChannelsByDisplayName(locale, a, b);
    }
    if (!isChannelMuted(bMember) && isChannelMuted(aMember)) {
        return 1;
    }
    return -1;
}
exports.sortChannelsByDisplayNameAndMuted = sortChannelsByDisplayNameAndMuted;
function sortChannelsByRecency(lastPosts, a, b) {
    var aLastPostAt = a.last_post_at;
    if (lastPosts[a.id] && lastPosts[a.id].create_at > a.last_post_at) {
        aLastPostAt = lastPosts[a.id].create_at;
    }
    var bLastPostAt = b.last_post_at;
    if (lastPosts[b.id] && lastPosts[b.id].create_at > b.last_post_at) {
        bLastPostAt = lastPosts[b.id].create_at;
    }
    return bLastPostAt - aLastPostAt;
}
exports.sortChannelsByRecency = sortChannelsByRecency;
function isChannelMuted(member) {
    return member && member.notify_props ? (member.notify_props.mark_unread === channels_1.MarkUnread.MENTION) : false;
}
exports.isChannelMuted = isChannelMuted;
function areChannelMentionsIgnored(channelMemberNotifyProps, currentUserNotifyProps) {
    var ignoreChannelMentionsDefault = constants_1.Users.IGNORE_CHANNEL_MENTIONS_OFF;
    if (currentUserNotifyProps.channel && currentUserNotifyProps.channel === 'false') {
        ignoreChannelMentionsDefault = constants_1.Users.IGNORE_CHANNEL_MENTIONS_ON;
    }
    var ignoreChannelMentions = channelMemberNotifyProps && channelMemberNotifyProps.ignore_channel_mentions;
    if (!ignoreChannelMentions || ignoreChannelMentions === constants_1.Users.IGNORE_CHANNEL_MENTIONS_DEFAULT) {
        ignoreChannelMentions = ignoreChannelMentionsDefault;
    }
    return ignoreChannelMentions !== constants_1.Users.IGNORE_CHANNEL_MENTIONS_OFF;
}
exports.areChannelMentionsIgnored = areChannelMentionsIgnored;
function getUserLocale(userId, profiles) {
    var locale = constants_1.General.DEFAULT_LOCALE;
    if (profiles && profiles[userId] && profiles[userId].locale) {
        locale = profiles[userId].locale;
    }
    return locale;
}
function filterChannelsMatchingTerm(channels, term) {
    var lowercasedTerm = term.toLowerCase();
    return channels.filter(function (channel) {
        if (!channel) {
            return false;
        }
        var name = (channel.name || '').toLowerCase();
        var displayName = (channel.display_name || '').toLowerCase();
        return name.startsWith(lowercasedTerm) ||
            displayName.startsWith(lowercasedTerm);
    });
}
exports.filterChannelsMatchingTerm = filterChannelsMatchingTerm;
//# sourceMappingURL=channel_utils.js.map