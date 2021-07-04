"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRecentChannels = exports.getSortedUnreadChannelIds = exports.getMapAndSortedUnreadChannelIds = exports.getUnreadChannels = exports.getUnreadChannelIds = exports.getChannelIdsForCurrentTeam = exports.getChannelIdsInCurrentTeam = exports.getAllDirectChannelIds = exports.canManageAnyChannelMembersInCurrentTeam = exports.canManageChannelMembers = exports.getUnreadsInCurrentTeam = exports.getUnreads = exports.getMembersInCurrentChannel = exports.getDefaultChannel = exports.getOtherChannels = exports.getMyChannels = exports.getGroupChannels = exports.getAllDirectChannelsNameMapInCurrentTeam = exports.getAllDirectChannels = exports.getChannelsNameMapInCurrentTeam = exports.getChannelsNameMapInTeam = exports.getChannelsInCurrentTeam = exports.getChannelSetInCurrentTeam = exports.getChannelByName = exports.countCurrentChannelUnreadMessages = exports.shouldHideDefaultChannel = exports.isChannelReadOnly = exports.isChannelReadOnlyById = exports.isCurrentChannelReadOnly = exports.isCurrentChannelDefault = exports.isCurrentChannelArchived = exports.isCurrentChannelMuted = exports.isCurrentChannelFavorite = exports.getCurrentChannelStats = exports.getMyChannelMember = exports.getCurrentChannel = exports.makeGetChannelsForIds = exports.getChannel = exports.makeGetChannel = exports.filterChannels = exports.mapAndSortChannelIds = exports.getChannelMembersInChannels = exports.getDirectChannelsSet = exports.getChannelsInPolicy = exports.getChannelsInTeam = exports.getAllChannelStats = exports.getAllChannels = exports.getMyCurrentChannelMembership = exports.getMyChannelMemberships = exports.getCurrentChannelId = void 0;
exports.isFavoriteChannel = exports.getChannelMemberCountsByGroup = exports.getChannelModerations = exports.isManuallyUnread = exports.getRedirectChannelNameForTeam = exports.getMyFirstChannelForTeams = exports.getDefaultChannelForTeams = exports.getOrderedChannelIds = exports.getAllSortedChannelIds = exports.getAllChannelIds = exports.getChannelsWithUserProfiles = exports.getSortedDirectChannelIds = exports.getDirectChannelIds = exports.getDirectAndGroupChannels = exports.getDirectChannels = exports.getSortedPrivateChannelIds = exports.getPrivateChannelIds = exports.getPrivateChannels = exports.getSortedPublicChannelIds = exports.getPublicChannelIds = exports.getPublicChannels = exports.getSortedFavoriteChannelIds = exports.getFavoriteChannelIds = exports.getFavoriteChannels = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var constants_1 = require("../../constants");
var channel_categories_1 = require("../../constants/channel_categories");
var channel_categories_2 = require("./channel_categories");
var common_1 = require("./common");
Object.defineProperty(exports, "getCurrentChannelId", { enumerable: true, get: function () { return common_1.getCurrentChannelId; } });
Object.defineProperty(exports, "getMyChannelMemberships", { enumerable: true, get: function () { return common_1.getMyChannelMemberships; } });
Object.defineProperty(exports, "getMyCurrentChannelMembership", { enumerable: true, get: function () { return common_1.getMyCurrentChannelMembership; } });
var general_1 = require("./general");
var posts_1 = require("./posts");
var preferences_1 = require("./preferences");
var roles_1 = require("./roles");
var teams_1 = require("./teams");
var users_1 = require("./users");
var channel_utils_1 = require("../../utils/channel_utils");
var helpers_1 = require("../../utils/helpers");
function getAllChannels(state) {
    return state.entities.channels.channels;
}
exports.getAllChannels = getAllChannels;
function getAllChannelStats(state) {
    return state.entities.channels.stats;
}
exports.getAllChannelStats = getAllChannelStats;
function getChannelsInTeam(state) {
    return state.entities.channels.channelsInTeam;
}
exports.getChannelsInTeam = getChannelsInTeam;
function getChannelsInPolicy(state) {
    return state.entities.channels.channelsInPolicy;
}
exports.getChannelsInPolicy = getChannelsInPolicy;
exports.getDirectChannelsSet = reselect_1.createSelector(getChannelsInTeam, function (channelsInTeam) {
    if (!channelsInTeam) {
        return new Set();
    }
    return new Set(channelsInTeam['']);
});
function getChannelMembersInChannels(state) {
    return state.entities.channels.membersInChannel;
}
exports.getChannelMembersInChannels = getChannelMembersInChannels;
function sortChannelsByRecencyOrAlpha(locale, lastPosts, sorting, a, b) {
    if (sorting === 'recent') {
        return channel_utils_1.sortChannelsByRecency(lastPosts, a, b);
    }
    return channel_utils_1.sortChannelsByDisplayName(locale, a, b);
}
// mapAndSortChannelIds sorts channels, primarily by:
//   For all sections except unreads:
//     a. All other unread channels
//     b. Muted channels
//   For unreads section:
//     a. Non-muted channels with mentions
//     b. Muted channels with mentions
//     c. Remaining unread channels
//   And then secondary by alphabetical ("alpha") or chronological ("recency") order
var mapAndSortChannelIds = function (channels, currentUser, myMembers, lastPosts, sorting, sortMentionsFirst) {
    if (sortMentionsFirst === void 0) { sortMentionsFirst = false; }
    var locale = currentUser.locale || constants_1.General.DEFAULT_LOCALE;
    var mutedChannelIds = channels.
        filter(function (channel) { return channel_utils_1.isChannelMuted(myMembers[channel.id]); }).
        sort(sortChannelsByRecencyOrAlpha.bind(null, locale, lastPosts, sorting)).
        map(function (channel) { return channel.id; });
    var hasMentionedChannelIds = [];
    if (sortMentionsFirst) {
        hasMentionedChannelIds = channels.
            filter(function (channel) {
            var member = myMembers[channel.id];
            return member && member.mention_count > 0 && !channel_utils_1.isChannelMuted(member);
        }).
            sort(sortChannelsByRecencyOrAlpha.bind(null, locale, lastPosts, sorting)).
            map(function (channel) { return channel.id; });
    }
    var otherChannelIds = channels.
        filter(function (channel) {
        return !mutedChannelIds.includes(channel.id) && !hasMentionedChannelIds.includes(channel.id);
    }).
        sort(sortChannelsByRecencyOrAlpha.bind(null, locale, lastPosts, sorting)).
        map(function (channel) { return channel.id; });
    return sortMentionsFirst ? hasMentionedChannelIds.concat(mutedChannelIds, otherChannelIds) : otherChannelIds.concat(mutedChannelIds);
};
exports.mapAndSortChannelIds = mapAndSortChannelIds;
function filterChannels(unreadIds, favoriteIds, channelIds, unreadsAtTop, favoritesAtTop) {
    var channels = channelIds;
    if (unreadsAtTop) {
        channels = channels.filter(function (id) {
            return !unreadIds.includes(id);
        });
    }
    if (favoritesAtTop) {
        channels = channels.filter(function (id) {
            return !favoriteIds.includes(id);
        });
    }
    return channels;
}
exports.filterChannels = filterChannels;
// makeGetChannel returns a selector that returns a channel from the store with the following filled in for DM/GM channels:
// - The display_name set to the other user(s) names, following the Teammate Name Display setting
// - The teammate_id for DM channels
// - The status of the other user in a DM channel
function makeGetChannel() {
    return reselect_1.createSelector(users_1.getCurrentUserId, function (state) { return state.entities.users.profiles; }, function (state) { return state.entities.users.profilesInChannel; }, function (state, props) {
        var channel = getChannel(state, props.id);
        if (!channel || !channel_utils_1.isDirectChannel(channel)) {
            return '';
        }
        var currentUserId = users_1.getCurrentUserId(state);
        var teammateId = channel_utils_1.getUserIdFromChannelName(currentUserId, channel.name);
        var teammateStatus = users_1.getStatusForUserId(state, teammateId);
        return teammateStatus || 'offline';
    }, function (state, props) { return getChannel(state, props.id); }, preferences_1.getTeammateNameDisplaySetting, function (currentUserId, profiles, profilesInChannel, teammateStatus, channel, teammateNameDisplay) {
        if (channel) {
            return channel_utils_1.newCompleteDirectChannelInfo(currentUserId, profiles, profilesInChannel, teammateStatus, teammateNameDisplay, channel);
        }
        return channel;
    });
}
exports.makeGetChannel = makeGetChannel;
// getChannel returns a channel as it exists in the store without filling in any additional details such as the
// display_name for DM/GM channels.
function getChannel(state, id) {
    return getAllChannels(state)[id];
}
exports.getChannel = getChannel;
// makeGetChannelsForIds returns a selector that, given an array of channel IDs, returns a list of the corresponding
// channels. Channels are returned in the same order as the given IDs with undefined entries replacing any invalid IDs.
// Note that memoization will fail if an array literal is passed in.
function makeGetChannelsForIds() {
    return reselect_1.createSelector(getAllChannels, function (state, ids) { return ids; }, function (allChannels, ids) {
        return ids.map(function (id) { return allChannels[id]; });
    });
}
exports.makeGetChannelsForIds = makeGetChannelsForIds;
exports.getCurrentChannel = reselect_1.createSelector(getAllChannels, common_1.getCurrentChannelId, function (state) { return state.entities.users; }, preferences_1.getTeammateNameDisplaySetting, function (allChannels, currentChannelId, users, teammateNameDisplay) {
    var channel = allChannels[currentChannelId];
    if (channel) {
        return channel_utils_1.completeDirectChannelInfo(users, teammateNameDisplay, channel);
    }
    return channel;
});
exports.getMyChannelMember = reselect_1.createSelector(common_1.getMyChannelMemberships, function (state, channelId) { return channelId; }, function (channelMemberships, channelId) {
    return channelMemberships[channelId] || null;
});
exports.getCurrentChannelStats = reselect_1.createSelector(getAllChannelStats, common_1.getCurrentChannelId, function (allChannelStats, currentChannelId) {
    return allChannelStats[currentChannelId];
});
function isCurrentChannelFavorite(state) {
    var currentChannelId = common_1.getCurrentChannelId(state);
    return isFavoriteChannel(state, currentChannelId);
}
exports.isCurrentChannelFavorite = isCurrentChannelFavorite;
exports.isCurrentChannelMuted = reselect_1.createSelector(common_1.getMyCurrentChannelMembership, function (membership) {
    if (!membership) {
        return false;
    }
    return channel_utils_1.isChannelMuted(membership);
});
exports.isCurrentChannelArchived = reselect_1.createSelector(exports.getCurrentChannel, function (channel) { return channel.delete_at !== 0; });
exports.isCurrentChannelDefault = reselect_1.createSelector(exports.getCurrentChannel, function (channel) { return channel_utils_1.isDefault(channel); });
function isCurrentChannelReadOnly(state) {
    return isChannelReadOnly(state, exports.getCurrentChannel(state));
}
exports.isCurrentChannelReadOnly = isCurrentChannelReadOnly;
function isChannelReadOnlyById(state, channelId) {
    return isChannelReadOnly(state, getChannel(state, channelId));
}
exports.isChannelReadOnlyById = isChannelReadOnlyById;
function isChannelReadOnly(state, channel) {
    return channel && channel.name === constants_1.General.DEFAULT_CHANNEL && !users_1.isCurrentUserSystemAdmin(state) && general_1.getConfig(state).ExperimentalTownSquareIsReadOnly === 'true';
}
exports.isChannelReadOnly = isChannelReadOnly;
function shouldHideDefaultChannel(state, channel) {
    return channel && channel.name === constants_1.General.DEFAULT_CHANNEL && !users_1.isCurrentUserSystemAdmin(state) && general_1.getConfig(state).ExperimentalHideTownSquareinLHS === 'true';
}
exports.shouldHideDefaultChannel = shouldHideDefaultChannel;
exports.countCurrentChannelUnreadMessages = reselect_1.createSelector(exports.getCurrentChannel, common_1.getMyCurrentChannelMembership, function (channel, membership) {
    if (!membership) {
        return 0;
    }
    return channel.total_msg_count - membership.msg_count;
});
function getChannelByName(state, channelName) {
    return channel_utils_1.getChannelByName(getAllChannels(state), channelName);
}
exports.getChannelByName = getChannelByName;
exports.getChannelSetInCurrentTeam = reselect_1.createSelector(teams_1.getCurrentTeamId, getChannelsInTeam, function (currentTeamId, channelsInTeam) {
    return (channelsInTeam && channelsInTeam[currentTeamId]) || [];
});
function sortAndInjectChannels(channels, channelSet, locale) {
    var currentChannels = [];
    if (typeof channelSet === 'undefined') {
        return currentChannels;
    }
    channelSet.forEach(function (c) {
        currentChannels.push(channels[c]);
    });
    return currentChannels.sort(channel_utils_1.sortChannelsByDisplayName.bind(null, locale));
}
exports.getChannelsInCurrentTeam = reselect_1.createSelector(getAllChannels, exports.getChannelSetInCurrentTeam, common_1.getCurrentUser, function (channels, currentTeamChannelSet, currentUser) {
    var locale = constants_1.General.DEFAULT_LOCALE;
    if (currentUser && currentUser.locale) {
        locale = currentUser.locale;
    }
    return sortAndInjectChannels(channels, currentTeamChannelSet, locale);
});
exports.getChannelsNameMapInTeam = reselect_1.createSelector(getAllChannels, getChannelsInTeam, function (state, teamId) { return teamId; }, function (channels, channelsInTeams, teamId) {
    var channelsInTeam = channelsInTeams[teamId] || [];
    var channelMap = {};
    channelsInTeam.forEach(function (id) {
        var channel = channels[id];
        channelMap[channel.name] = channel;
    });
    return channelMap;
});
exports.getChannelsNameMapInCurrentTeam = reselect_1.createSelector(getAllChannels, exports.getChannelSetInCurrentTeam, function (channels, currentTeamChannelSet) {
    var channelMap = {};
    currentTeamChannelSet.forEach(function (id) {
        var channel = channels[id];
        channelMap[channel.name] = channel;
    });
    return channelMap;
});
// Returns both DMs and GMs
exports.getAllDirectChannels = reselect_1.createSelector(getAllChannels, exports.getDirectChannelsSet, function (state) { return state.entities.users; }, preferences_1.getTeammateNameDisplaySetting, function (channels, channelSet, users, teammateNameDisplay) {
    var dmChannels = [];
    channelSet.forEach(function (c) {
        dmChannels.push(channel_utils_1.completeDirectChannelInfo(users, teammateNameDisplay, channels[c]));
    });
    return dmChannels;
});
exports.getAllDirectChannelsNameMapInCurrentTeam = reselect_1.createSelector(getAllChannels, exports.getDirectChannelsSet, function (state) { return state.entities.users; }, preferences_1.getTeammateNameDisplaySetting, function (channels, channelSet, users, teammateNameDisplay) {
    var channelMap = {};
    channelSet.forEach(function (id) {
        var channel = channels[id];
        channelMap[channel.name] = channel_utils_1.completeDirectChannelInfo(users, teammateNameDisplay, channel);
    });
    return channelMap;
});
// Returns only GMs
exports.getGroupChannels = reselect_1.createSelector(getAllChannels, exports.getDirectChannelsSet, function (state) { return state.entities.users; }, preferences_1.getTeammateNameDisplaySetting, function (channels, channelSet, users, teammateNameDisplay) {
    var gmChannels = [];
    channelSet.forEach(function (id) {
        var channel = channels[id];
        if (channel.type === constants_1.General.GM_CHANNEL) {
            gmChannels.push(channel_utils_1.completeDirectChannelInfo(users, teammateNameDisplay, channel));
        }
    });
    return gmChannels;
});
exports.getMyChannels = reselect_1.createSelector(exports.getChannelsInCurrentTeam, exports.getAllDirectChannels, common_1.getMyChannelMemberships, function (channels, directChannels, myMembers) {
    return tslib_1.__spread(channels, directChannels).filter(function (c) { return myMembers.hasOwnProperty(c.id); });
});
exports.getOtherChannels = reselect_1.createSelector(exports.getChannelsInCurrentTeam, common_1.getMyChannelMemberships, function (state, archived) {
    if (archived === void 0) { archived = true; }
    return archived;
}, function (channels, myMembers, archived) {
    return channels.filter(function (c) { return !myMembers.hasOwnProperty(c.id) && c.type === constants_1.General.OPEN_CHANNEL && (archived ? true : c.delete_at === 0); });
});
exports.getDefaultChannel = reselect_1.createSelector(getAllChannels, teams_1.getCurrentTeamId, function (channels, teamId) {
    return Object.keys(channels).map(function (key) { return channels[key]; }).find(function (c) { return c && c.team_id === teamId && c.name === constants_1.General.DEFAULT_CHANNEL; });
});
exports.getMembersInCurrentChannel = reselect_1.createSelector(common_1.getCurrentChannelId, getChannelMembersInChannels, function (currentChannelId, members) {
    return members[currentChannelId];
});
exports.getUnreads = reselect_1.createSelector(getAllChannels, common_1.getMyChannelMemberships, common_1.getUsers, users_1.getCurrentUserId, teams_1.getCurrentTeamId, teams_1.getMyTeams, teams_1.getTeamMemberships, function (channels, myMembers, users, currentUserId, currentTeamId, myTeams, myTeamMemberships) {
    var messageCountForCurrentTeam = 0; // Includes message count from channels of current team plus all GM'S and all DM's across teams
    var mentionCountForCurrentTeam = 0; // Includes mention count from channels of current team plus all GM'S and all DM's across teams
    Object.keys(myMembers).forEach(function (channelId) {
        var channel = channels[channelId];
        var m = myMembers[channelId];
        if (!channel || !m) {
            return;
        }
        if (channel.team_id !== currentTeamId && channel.type !== constants_1.General.DM_CHANNEL && channel.type !== constants_1.General.GM_CHANNEL) {
            return;
        }
        var otherUserId = '';
        if (channel.type === constants_1.General.DM_CHANNEL) {
            otherUserId = channel_utils_1.getUserIdFromChannelName(currentUserId, channel.name);
            if (users[otherUserId] && users[otherUserId].delete_at === 0) {
                mentionCountForCurrentTeam += m.mention_count;
            }
        }
        else if (m.mention_count > 0 && channel.delete_at === 0) {
            mentionCountForCurrentTeam += m.mention_count;
        }
        if (m.notify_props && m.notify_props.mark_unread !== 'mention' && channel.total_msg_count - m.msg_count > 0) {
            if (channel.type === constants_1.General.DM_CHANNEL) {
                // otherUserId is guaranteed to have been set above
                if (users[otherUserId] && users[otherUserId].delete_at === 0) {
                    messageCountForCurrentTeam += 1;
                }
            }
            else if (channel.delete_at === 0) {
                messageCountForCurrentTeam += 1;
            }
        }
    });
    // Includes mention count and message count from teams other than the current team
    // This count does not include GM's and DM's
    var otherTeamsUnreadCountForChannels = myTeams.reduce(function (acc, team) {
        if (currentTeamId !== team.id) {
            var member = myTeamMemberships[team.id];
            acc.messageCount += member.msg_count;
            acc.mentionCount += member.mention_count;
        }
        return acc;
    }, {
        messageCount: 0,
        mentionCount: 0,
    });
    // messageCount is the number of unread channels, mention count is the total number of mentions
    return {
        messageCount: messageCountForCurrentTeam + otherTeamsUnreadCountForChannels.messageCount,
        mentionCount: mentionCountForCurrentTeam + otherTeamsUnreadCountForChannels.mentionCount,
    };
});
exports.getUnreadsInCurrentTeam = reselect_1.createSelector(common_1.getCurrentChannelId, exports.getMyChannels, common_1.getMyChannelMemberships, common_1.getUsers, users_1.getCurrentUserId, function (currentChannelId, channels, myMembers, users, currentUserId) {
    var messageCount = 0;
    var mentionCount = 0;
    channels.forEach(function (channel) {
        var m = myMembers[channel.id];
        if (m && channel.id !== currentChannelId) {
            var otherUserId = '';
            if (channel.type === 'D') {
                otherUserId = channel_utils_1.getUserIdFromChannelName(currentUserId, channel.name);
                if (users[otherUserId] && users[otherUserId].delete_at === 0) {
                    mentionCount += channel.total_msg_count - m.msg_count;
                }
            }
            else if (m.mention_count > 0 && channel.delete_at === 0) {
                mentionCount += m.mention_count;
            }
            if (m.notify_props && m.notify_props.mark_unread !== 'mention' && channel.total_msg_count - m.msg_count > 0) {
                if (channel.type === 'D') {
                    if (users[otherUserId] && users[otherUserId].delete_at === 0) {
                        messageCount += 1;
                    }
                }
                else if (channel.delete_at === 0) {
                    messageCount += 1;
                }
            }
        }
    });
    return {
        messageCount: messageCount,
        mentionCount: mentionCount,
    };
});
exports.canManageChannelMembers = reselect_1.createSelector(exports.getCurrentChannel, common_1.getCurrentUser, teams_1.getCurrentTeamMembership, common_1.getMyCurrentChannelMembership, general_1.getConfig, general_1.getLicense, general_1.hasNewPermissions, function (state) { return roles_1.haveICurrentChannelPermission(state, {
    permission: constants_1.Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS,
}); }, function (state) { return roles_1.haveICurrentChannelPermission(state, {
    permission: constants_1.Permissions.MANAGE_PUBLIC_CHANNEL_MEMBERS,
}); }, function (channel, user, teamMembership, channelMembership, config, license, newPermissions, managePrivateMembers, managePublicMembers) {
    if (!channel) {
        return false;
    }
    if (channel.delete_at !== 0) {
        return false;
    }
    if (channel.type === constants_1.General.DM_CHANNEL || channel.type === constants_1.General.GM_CHANNEL || channel.name === constants_1.General.DEFAULT_CHANNEL) {
        return false;
    }
    if (newPermissions) {
        if (channel.type === constants_1.General.OPEN_CHANNEL) {
            return managePublicMembers;
        }
        else if (channel.type === constants_1.General.PRIVATE_CHANNEL) {
            return managePrivateMembers;
        }
        return true;
    }
    if (!channelMembership) {
        return false;
    }
    return channel_utils_1.canManageMembersOldPermissions(channel, user, teamMembership, channelMembership, config, license);
});
// Determine if the user has permissions to manage members in at least one channel of the current team
exports.canManageAnyChannelMembersInCurrentTeam = reselect_1.createSelector(common_1.getMyChannelMemberships, teams_1.getCurrentTeamId, function (state) { return state; }, function (members, currentTeamId, state) {
    var e_1, _a;
    try {
        for (var _b = tslib_1.__values(Object.keys(members)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var channelId = _c.value;
            var channel = getChannel(state, channelId);
            if (!channel || channel.team_id !== currentTeamId) {
                continue;
            }
            if (channel.type === constants_1.General.OPEN_CHANNEL && roles_1.haveIChannelPermission(state, {
                permission: constants_1.Permissions.MANAGE_PUBLIC_CHANNEL_MEMBERS,
                channel: channelId,
                team: currentTeamId,
            })) {
                return true;
            }
            else if (channel.type === constants_1.General.PRIVATE_CHANNEL && roles_1.haveIChannelPermission(state, {
                permission: constants_1.Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS,
                channel: channelId,
                team: currentTeamId,
            })) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
});
exports.getAllDirectChannelIds = helpers_1.createIdsSelector(exports.getDirectChannelsSet, function (directIds) {
    return Array.from(directIds);
});
exports.getChannelIdsInCurrentTeam = helpers_1.createIdsSelector(teams_1.getCurrentTeamId, getChannelsInTeam, function (currentTeamId, channelsInTeam) {
    return Array.from(channelsInTeam[currentTeamId] || []);
});
exports.getChannelIdsForCurrentTeam = helpers_1.createIdsSelector(exports.getChannelIdsInCurrentTeam, exports.getAllDirectChannelIds, function (channels, direct) {
    return tslib_1.__spread(channels, direct);
});
exports.getUnreadChannelIds = helpers_1.createIdsSelector(getAllChannels, common_1.getMyChannelMemberships, exports.getChannelIdsForCurrentTeam, function (state, lastUnreadChannel) {
    if (lastUnreadChannel === void 0) { lastUnreadChannel = null; }
    return lastUnreadChannel;
}, function (channels, members, teamChannelIds, lastUnreadChannel) {
    var unreadIds = teamChannelIds.filter(function (id) {
        var c = channels[id];
        var m = members[id];
        if (c && m) {
            var chHasUnread = c.total_msg_count - m.msg_count > 0;
            var chHasMention = m.mention_count > 0;
            if ((m.notify_props && m.notify_props.mark_unread !== 'mention' && chHasUnread) || chHasMention) {
                return true;
            }
        }
        return false;
    });
    if (lastUnreadChannel && !unreadIds.includes(lastUnreadChannel.id)) {
        unreadIds.push(lastUnreadChannel.id);
    }
    return unreadIds;
});
exports.getUnreadChannels = helpers_1.createIdsSelector(common_1.getCurrentUser, common_1.getUsers, users_1.getUserIdsInChannels, getAllChannels, exports.getUnreadChannelIds, preferences_1.getTeammateNameDisplaySetting, function (currentUser, profiles, userIdsInChannels, channels, unreadIds, settings) {
    // If we receive an unread for a channel and then a mention the channel
    // won't be sorted correctly until we receive a message in another channel
    if (!currentUser) {
        return [];
    }
    var allUnreadChannels = unreadIds.filter(function (id) { return channels[id] && channels[id].delete_at === 0; }).map(function (id) {
        var c = channels[id];
        if (c.type === constants_1.General.DM_CHANNEL || c.type === constants_1.General.GM_CHANNEL) {
            return channel_utils_1.completeDirectChannelDisplayName(currentUser.id, profiles, userIdsInChannels[id], settings, c);
        }
        return c;
    });
    return allUnreadChannels;
});
exports.getMapAndSortedUnreadChannelIds = helpers_1.createIdsSelector(exports.getUnreadChannels, common_1.getCurrentUser, common_1.getMyChannelMemberships, posts_1.getLastPostPerChannel, function (state, lastUnreadChannel, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return sorting;
}, function (channels, currentUser, myMembers, lastPosts, sorting) {
    return exports.mapAndSortChannelIds(channels, currentUser, myMembers, lastPosts, sorting, true);
});
exports.getSortedUnreadChannelIds = helpers_1.createIdsSelector(exports.getUnreadChannelIds, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return exports.getMapAndSortedUnreadChannelIds(state, lastUnreadChannel, sorting);
}, function (unreadChannelIds, mappedAndSortedUnreadChannelIds) { return mappedAndSortedUnreadChannelIds; });
//recent channels
exports.getAllRecentChannels = reselect_1.createSelector(common_1.getUsers, common_1.getCurrentUser, getAllChannels, users_1.getUserIdsInChannels, posts_1.getLastPostPerChannel, common_1.getMyChannelMemberships, exports.getChannelIdsForCurrentTeam, preferences_1.getTeammateNameDisplaySetting, function (profiles, currentUser, channels, userIdsInChannels, lastPosts, members, teamChannelIds, settings) {
    var sorting = 'recent';
    var recentIds = teamChannelIds.filter(function (id) {
        var c = channels[id];
        var m = members[id];
        return Boolean(c && m);
    });
    if (!currentUser) {
        return [];
    }
    var Channels = recentIds.filter(function (id) { return channels[id] && channels[id].delete_at === 0; }).map(function (id) {
        var c = channels[id];
        if (c.type === constants_1.General.DM_CHANNEL || c.type === constants_1.General.GM_CHANNEL) {
            return channel_utils_1.completeDirectChannelDisplayName(currentUser.id, profiles, userIdsInChannels[id], settings, c);
        }
        return c;
    });
    var locale = currentUser.locale || constants_1.General.DEFAULT_LOCALE;
    var recentChannels = Channels.
        sort(sortChannelsByRecencyOrAlpha.bind(null, locale, lastPosts, sorting));
    return recentChannels;
});
// Favorites
exports.getFavoriteChannels = helpers_1.createIdsSelector(common_1.getCurrentUser, common_1.getUsers, users_1.getUserIdsInChannels, getAllChannels, common_1.getMyChannelMemberships, preferences_1.getFavoritesPreferences, exports.getChannelIdsForCurrentTeam, preferences_1.getTeammateNameDisplaySetting, general_1.getConfig, preferences_1.getMyPreferences, common_1.getCurrentChannelId, function (currentUser, profiles, userIdsInChannels, channels, myMembers, favoriteIds, teamChannelIds, settings, config, prefs, currentChannelId) {
    if (!currentUser) {
        return [];
    }
    var favoriteChannel = favoriteIds.filter(function (id) {
        if (!myMembers[id] || !channels[id]) {
            return false;
        }
        var channel = channels[id];
        var otherUserId = channel_utils_1.getUserIdFromChannelName(currentUser.id, channel.name);
        if (channel.delete_at !== 0 && channel.id !== currentChannelId) {
            return false;
        }
        // Deleted users from CLI will not have a profiles entry
        if (channel.type === constants_1.General.DM_CHANNEL && !profiles[otherUserId]) {
            return false;
        }
        if (channel.type === constants_1.General.DM_CHANNEL && !channel_utils_1.isDirectChannelVisible(profiles[otherUserId] || otherUserId, config, prefs, channel, null, false, currentChannelId)) {
            return false;
        }
        else if (channel.type === constants_1.General.GM_CHANNEL && !channel_utils_1.isGroupChannelVisible(config, prefs, channel)) {
            return false;
        }
        return teamChannelIds.includes(id);
    }).map(function (id) {
        var c = channels[id];
        if (c.type === constants_1.General.DM_CHANNEL || c.type === constants_1.General.GM_CHANNEL) {
            return channel_utils_1.completeDirectChannelDisplayName(currentUser.id, profiles, userIdsInChannels[id], settings, c);
        }
        return c;
    });
    return favoriteChannel;
});
exports.getFavoriteChannelIds = helpers_1.createIdsSelector(exports.getFavoriteChannels, common_1.getCurrentUser, common_1.getMyChannelMemberships, posts_1.getLastPostPerChannel, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return sorting;
}, exports.mapAndSortChannelIds);
exports.getSortedFavoriteChannelIds = helpers_1.createIdsSelector(exports.getUnreadChannelIds, preferences_1.getFavoritesPreferences, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) { return exports.getFavoriteChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting); }, function (state, lastUnreadChannel, unreadsAtTop) {
    if (unreadsAtTop === void 0) { unreadsAtTop = true; }
    return unreadsAtTop;
}, function (unreadChannelIds, favoritePreferences, favoriteChannelIds, unreadsAtTop) {
    return filterChannels(unreadChannelIds, favoritePreferences, favoriteChannelIds, unreadsAtTop, false);
});
// Public Channels
exports.getPublicChannels = reselect_1.createSelector(common_1.getCurrentUser, getAllChannels, common_1.getMyChannelMemberships, exports.getChannelIdsForCurrentTeam, function (currentUser, channels, myMembers, teamChannelIds) {
    if (!currentUser) {
        return [];
    }
    var publicChannels = teamChannelIds.filter(function (id) {
        if (!myMembers[id]) {
            return false;
        }
        var channel = channels[id];
        return teamChannelIds.includes(id) && channel.type === constants_1.General.OPEN_CHANNEL;
    }).map(function (id) { return channels[id]; });
    return publicChannels;
});
exports.getPublicChannelIds = helpers_1.createIdsSelector(exports.getPublicChannels, common_1.getCurrentUser, common_1.getMyChannelMemberships, posts_1.getLastPostPerChannel, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return sorting;
}, exports.mapAndSortChannelIds);
exports.getSortedPublicChannelIds = helpers_1.createIdsSelector(exports.getUnreadChannelIds, preferences_1.getFavoritesPreferences, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return exports.getPublicChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting);
}, function (state, lastUnreadChannel, unreadsAtTop) {
    if (unreadsAtTop === void 0) { unreadsAtTop = true; }
    return unreadsAtTop;
}, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop) {
    if (favoritesAtTop === void 0) { favoritesAtTop = true; }
    return favoritesAtTop;
}, filterChannels);
// Private Channels
exports.getPrivateChannels = reselect_1.createSelector(common_1.getCurrentUser, getAllChannels, common_1.getMyChannelMemberships, exports.getChannelIdsForCurrentTeam, function (currentUser, channels, myMembers, teamChannelIds) {
    if (!currentUser) {
        return [];
    }
    var privateChannels = teamChannelIds.filter(function (id) {
        if (!myMembers[id]) {
            return false;
        }
        var channel = channels[id];
        return teamChannelIds.includes(id) && channel.type === constants_1.General.PRIVATE_CHANNEL;
    }).map(function (id) { return channels[id]; });
    return privateChannels;
});
exports.getPrivateChannelIds = helpers_1.createIdsSelector(exports.getPrivateChannels, common_1.getCurrentUser, common_1.getMyChannelMemberships, posts_1.getLastPostPerChannel, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return sorting;
}, exports.mapAndSortChannelIds);
exports.getSortedPrivateChannelIds = helpers_1.createIdsSelector(exports.getUnreadChannelIds, preferences_1.getFavoritesPreferences, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return exports.getPrivateChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting);
}, function (state, lastUnreadChannel, unreadsAtTop) {
    if (unreadsAtTop === void 0) { unreadsAtTop = true; }
    return unreadsAtTop;
}, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop) {
    if (favoritesAtTop === void 0) { favoritesAtTop = true; }
    return favoritesAtTop;
}, filterChannels);
// Direct Messages
exports.getDirectChannels = reselect_1.createSelector(common_1.getCurrentUser, common_1.getUsers, users_1.getUserIdsInChannels, getAllChannels, preferences_1.getVisibleTeammate, preferences_1.getVisibleGroupIds, preferences_1.getTeammateNameDisplaySetting, general_1.getConfig, preferences_1.getMyPreferences, posts_1.getLastPostPerChannel, common_1.getCurrentChannelId, function (currentUser, profiles, userIdsInChannels, channels, teammates, groupIds, settings, config, preferences, lastPosts, currentChannelId) {
    if (!currentUser) {
        return [];
    }
    var channelValues = Object.keys(channels).map(function (key) { return channels[key]; });
    var directChannelsIds = [];
    teammates.reduce(function (result, teammateId) {
        var name = channel_utils_1.getDirectChannelName(currentUser.id, teammateId);
        var channel = channelValues.find(function (c) { return c && c.name === name; }); //eslint-disable-line max-nested-callbacks
        if (channel) {
            var lastPost = lastPosts[channel.id];
            var otherUser = profiles[channel_utils_1.getUserIdFromChannelName(currentUser.id, channel.name)];
            if (!channel_utils_1.isAutoClosed(config, preferences, channel, lastPost ? lastPost.create_at : 0, otherUser ? otherUser.delete_at : 0, currentChannelId)) {
                result.push(channel.id);
            }
        }
        return result;
    }, directChannelsIds);
    var directChannels = groupIds.filter(function (id) {
        var channel = channels[id];
        if (channel && (channel.type === constants_1.General.DM_CHANNEL || channel.type === constants_1.General.GM_CHANNEL)) {
            var lastPost = lastPosts[channel.id];
            return !channel_utils_1.isAutoClosed(config, preferences, channels[id], lastPost ? lastPost.create_at : 0, 0, currentChannelId);
        }
        return false;
    }).concat(directChannelsIds).map(function (id) {
        var channel = channels[id];
        return channel_utils_1.completeDirectChannelDisplayName(currentUser.id, profiles, userIdsInChannels[id], settings, channel);
    });
    return directChannels;
});
// getDirectAndGroupChannels returns all direct and group channels, even if they have been manually
// or automatically closed.
//
// This is similar to the getDirectChannels above (which actually also returns group channels,
// but suppresses manually closed group channels but not manually closed direct channels.) This
// method does away with all the suppression, since the webapp client downstream uses this for
// the channel switcher and puts such suppressed channels in a separate category.
exports.getDirectAndGroupChannels = reselect_1.createSelector(common_1.getCurrentUser, common_1.getUsers, users_1.getUserIdsInChannels, getAllChannels, preferences_1.getTeammateNameDisplaySetting, function (currentUser, profiles, userIdsInChannels, channels, settings) {
    if (!currentUser) {
        return [];
    }
    return Object.keys(channels).
        map(function (key) { return channels[key]; }).
        filter(function (channel) { return Boolean(channel); }).
        filter(function (channel) { return channel.type === constants_1.General.DM_CHANNEL || channel.type === constants_1.General.GM_CHANNEL; }).
        map(function (channel) { return channel_utils_1.completeDirectChannelDisplayName(currentUser.id, profiles, userIdsInChannels[channel.id], settings, channel); });
});
exports.getDirectChannelIds = helpers_1.createIdsSelector(exports.getDirectChannels, common_1.getCurrentUser, common_1.getMyChannelMemberships, posts_1.getLastPostPerChannel, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return sorting;
}, function (directChannels, currentUser, myChannelMemberships, lastPostPerChannel, sorting) {
    return exports.mapAndSortChannelIds(directChannels, currentUser, myChannelMemberships, lastPostPerChannel, sorting);
});
exports.getSortedDirectChannelIds = helpers_1.createIdsSelector(exports.getUnreadChannelIds, preferences_1.getFavoritesPreferences, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return exports.getDirectChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting);
}, function (state, lastUnreadChannel, unreadsAtTop) {
    if (unreadsAtTop === void 0) { unreadsAtTop = true; }
    return unreadsAtTop;
}, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop) {
    if (favoritesAtTop === void 0) { favoritesAtTop = true; }
    return favoritesAtTop;
}, function (unreadChannelIds, favoritesPreferences, directChannelIds, unreadsAtTop, favoritesAtTop) {
    return filterChannels(unreadChannelIds, favoritesPreferences, directChannelIds, unreadsAtTop, favoritesAtTop);
});
var getProfiles = function (currentUserId, usersIdsInChannel, users) {
    var profiles = [];
    usersIdsInChannel.forEach(function (userId) {
        if (userId !== currentUserId) {
            profiles.push(users[userId]);
        }
    });
    return profiles;
};
exports.getChannelsWithUserProfiles = reselect_1.createSelector(users_1.getUserIdsInChannels, common_1.getUsers, exports.getGroupChannels, users_1.getCurrentUserId, function (channelUserMap, users, channels, currentUserId) {
    return channels.map(function (channel) {
        var profiles = getProfiles(currentUserId, channelUserMap[channel.id] || [], users);
        return tslib_1.__assign(tslib_1.__assign({}, channel), { profiles: profiles });
    });
});
var getAllActiveChannels = reselect_1.createSelector(exports.getPublicChannels, exports.getPrivateChannels, exports.getDirectChannels, function (publicChannels, privateChannels, directChannels) {
    var allChannels = tslib_1.__spread(publicChannels, privateChannels, directChannels);
    return allChannels;
});
exports.getAllChannelIds = helpers_1.createIdsSelector(getAllActiveChannels, common_1.getCurrentUser, common_1.getMyChannelMemberships, posts_1.getLastPostPerChannel, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return sorting;
}, exports.mapAndSortChannelIds);
exports.getAllSortedChannelIds = helpers_1.createIdsSelector(exports.getUnreadChannelIds, preferences_1.getFavoritesPreferences, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting) {
    if (sorting === void 0) { sorting = 'alpha'; }
    return exports.getAllChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting);
}, function (state, lastUnreadChannel, unreadsAtTop) {
    if (unreadsAtTop === void 0) { unreadsAtTop = true; }
    return unreadsAtTop;
}, function (state, lastUnreadChannel, unreadsAtTop, favoritesAtTop) {
    if (favoritesAtTop === void 0) { favoritesAtTop = true; }
    return favoritesAtTop;
}, filterChannels);
var lastChannels;
var haveChannelsChanged = function (channels) {
    if (!lastChannels || lastChannels.length !== channels.length) {
        return true;
    }
    for (var i = 0; i < channels.length; i++) {
        if (channels[i].type !== lastChannels[i].type || channels[i].items !== lastChannels[i].items) {
            return true;
        }
    }
    return false;
};
var getOrderedChannelIds = function (state, lastUnreadChannel, grouping, sorting, unreadsAtTop, favoritesAtTop) {
    var channels = [];
    if (grouping === 'by_type') {
        channels.push({
            type: 'public',
            name: 'PUBLIC CHANNELS',
            items: exports.getSortedPublicChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting),
        });
        channels.push({
            type: 'private',
            name: 'PRIVATE CHANNELS',
            items: exports.getSortedPrivateChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting),
        });
        channels.push({
            type: 'direct',
            name: 'DIRECT MESSAGES',
            items: exports.getSortedDirectChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting),
        });
    }
    else {
        // Combine all channel types
        var type = 'alpha';
        var name_1 = 'CHANNELS';
        if (sorting === 'recent') {
            type = 'recent';
            name_1 = 'RECENT ACTIVITY';
        }
        channels.push({
            type: type,
            name: name_1,
            items: exports.getAllSortedChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting),
        });
    }
    if (favoritesAtTop) {
        channels.unshift({
            type: 'favorite',
            name: 'FAVORITE CHANNELS',
            items: exports.getSortedFavoriteChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting),
        });
    }
    if (unreadsAtTop) {
        channels.unshift({
            type: 'unreads',
            name: 'UNREADS',
            items: exports.getSortedUnreadChannelIds(state, lastUnreadChannel, unreadsAtTop, favoritesAtTop, sorting),
        });
    }
    if (haveChannelsChanged(channels)) {
        lastChannels = channels;
    }
    return lastChannels;
};
exports.getOrderedChannelIds = getOrderedChannelIds;
exports.getDefaultChannelForTeams = reselect_1.createSelector(getAllChannels, function (channels) {
    var e_2, _a;
    var result = {};
    try {
        for (var _b = tslib_1.__values(Object.keys(channels).map(function (key) { return channels[key]; })), _c = _b.next(); !_c.done; _c = _b.next()) {
            var channel = _c.value;
            if (channel && channel.name === constants_1.General.DEFAULT_CHANNEL) {
                result[channel.team_id] = channel;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
});
exports.getMyFirstChannelForTeams = reselect_1.createSelector(getAllChannels, common_1.getMyChannelMemberships, teams_1.getMyTeams, common_1.getCurrentUser, function (allChannels, myChannelMemberships, myTeams, currentUser) {
    var e_3, _a;
    var locale = currentUser.locale || constants_1.General.DEFAULT_LOCALE;
    var result = {};
    var _loop_1 = function (team) {
        // Get a sorted array of all channels in the team that the current user is a member of
        var teamChannels = Object.values(allChannels).filter(function (channel) { return channel && channel.team_id === team.id && Boolean(myChannelMemberships[channel.id]); }).sort(channel_utils_1.sortChannelsByDisplayName.bind(null, locale));
        if (teamChannels.length === 0) {
            return "continue";
        }
        result[team.id] = teamChannels[0];
    };
    try {
        for (var myTeams_1 = tslib_1.__values(myTeams), myTeams_1_1 = myTeams_1.next(); !myTeams_1_1.done; myTeams_1_1 = myTeams_1.next()) {
            var team = myTeams_1_1.value;
            _loop_1(team);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (myTeams_1_1 && !myTeams_1_1.done && (_a = myTeams_1.return)) _a.call(myTeams_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
});
var getRedirectChannelNameForTeam = function (state, teamId) {
    var defaultChannelForTeam = exports.getDefaultChannelForTeams(state)[teamId];
    var myFirstChannelForTeam = exports.getMyFirstChannelForTeams(state)[teamId];
    var canIJoinPublicChannelsInTeam = !general_1.hasNewPermissions(state) || roles_1.haveITeamPermission(state, {
        team: teamId,
        permission: constants_1.Permissions.JOIN_PUBLIC_CHANNELS,
    });
    var myChannelMemberships = common_1.getMyChannelMemberships(state);
    var iAmMemberOfTheTeamDefaultChannel = Boolean(defaultChannelForTeam && myChannelMemberships[defaultChannelForTeam.id]);
    if (iAmMemberOfTheTeamDefaultChannel || canIJoinPublicChannelsInTeam) {
        return constants_1.General.DEFAULT_CHANNEL;
    }
    return (myFirstChannelForTeam && myFirstChannelForTeam.name) || constants_1.General.DEFAULT_CHANNEL;
};
exports.getRedirectChannelNameForTeam = getRedirectChannelNameForTeam;
// isManually unread looks into state if the provided channelId is marked as unread by the user.
function isManuallyUnread(state, channelId) {
    if (!channelId) {
        return false;
    }
    return Boolean(state.entities.channels.manuallyUnread[channelId]);
}
exports.isManuallyUnread = isManuallyUnread;
function getChannelModerations(state, channelId) {
    return state.entities.channels.channelModerations[channelId];
}
exports.getChannelModerations = getChannelModerations;
function getChannelMemberCountsByGroup(state, channelId) {
    return state.entities.channels.channelMemberCountsByGroup[channelId] || {};
}
exports.getChannelMemberCountsByGroup = getChannelMemberCountsByGroup;
function isFavoriteChannel(state, channelId) {
    var config = general_1.getConfig(state);
    if (config.EnableLegacySidebar === 'true') {
        return channel_utils_1.isFavoriteChannelOld(preferences_1.getMyPreferences(state), channelId);
    }
    var channel = getChannel(state, channelId);
    if (!channel) {
        return false;
    }
    var category = channel_categories_2.getCategoryInTeamByType(state, channel.team_id || teams_1.getCurrentTeamId(state), channel_categories_1.CategoryTypes.FAVORITES);
    if (!category) {
        return false;
    }
    return category.channel_ids.includes(channel.id);
}
exports.isFavoriteChannel = isFavoriteChannel;
//# sourceMappingURL=channels.js.map