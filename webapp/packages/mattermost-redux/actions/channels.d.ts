import { ActionFunc } from "../types/actions";
import { Channel, ChannelNotifyProps, ChannelModerationPatch, ChannelSearchOpts } from "../types/channels";
export declare function selectChannel(channelId: string): {
    type: "SELECT_CHANNEL";
    data: string;
};
export declare function createChannel(channel: Channel, userId: string): ActionFunc;
export declare function createDirectChannel(userId: string, otherUserId: string): ActionFunc;
export declare function markGroupChannelOpen(channelId: string): ActionFunc;
export declare function createGroupChannel(userIds: string[]): ActionFunc;
export declare function patchChannel(channelId: string, patch: Channel): ActionFunc;
export declare function updateChannel(channel: Channel): ActionFunc;
export declare function updateChannelPrivacy(channelId: string, privacy: string): ActionFunc;
export declare function convertChannelToPrivate(channelId: string): ActionFunc;
export declare function updateChannelNotifyProps(userId: string, channelId: string, props: ChannelNotifyProps): ActionFunc;
export declare function getChannelByNameAndTeamName(teamName: string, channelName: string, includeDeleted?: boolean): ActionFunc;
export declare function getChannel(channelId: string): ActionFunc;
export declare function getChannelAndMyMember(channelId: string): ActionFunc;
export declare function getChannelTimezones(channelId: string): ActionFunc;
export declare function fetchMyChannelsAndMembers(teamId: string): ActionFunc;
export declare function getMyChannelMembers(teamId: string): ActionFunc;
export declare function getChannelMembers(channelId: string, page?: number, perPage?: number): ActionFunc;
export declare function leaveChannel(channelId: string): ActionFunc;
export declare function joinChannel(userId: string, teamId: string, channelId: string, channelName: string): ActionFunc;
export declare function deleteChannel(channelId: string): ActionFunc;
export declare function unarchiveChannel(channelId: string): ActionFunc;
export declare function viewChannel(channelId: string, prevChannelId?: string): ActionFunc;
export declare function markChannelAsViewed(channelId: string, prevChannelId?: string): ActionFunc;
export declare function getChannels(teamId: string, page?: number, perPage?: number): ActionFunc;
export declare function getArchivedChannels(teamId: string, page?: number, perPage?: number): ActionFunc;
export declare function getAllChannelsWithCount(page?: number, perPage?: number, notAssociatedToGroup?: string, excludeDefaultChannels?: boolean, includeDeleted?: boolean): ActionFunc;
export declare function getAllChannels(page?: number, perPage?: number, notAssociatedToGroup?: string, excludeDefaultChannels?: boolean): ActionFunc;
export declare function autocompleteChannels(teamId: string, term: string): ActionFunc;
export declare function autocompleteChannelsForSearch(teamId: string, term: string): ActionFunc;
export declare function searchChannels(teamId: string, term: string, archived?: boolean): ActionFunc;
export declare function searchAllChannels(term: string, opts?: ChannelSearchOpts): ActionFunc;
export declare function searchGroupChannels(term: string): ActionFunc;
export declare function getChannelStats(channelId: string): ActionFunc;
export declare function addChannelMember(channelId: string, userId: string, postRootId?: string): ActionFunc;
export declare function removeChannelMember(channelId: string, userId: string): ActionFunc;
export declare function updateChannelMemberRoles(channelId: string, userId: string, roles: string): ActionFunc;
export declare function updateChannelHeader(channelId: string, header: string): ActionFunc;
export declare function updateChannelPurpose(channelId: string, purpose: string): ActionFunc;
export declare function markChannelAsRead(channelId: string, prevChannelId?: string, updateLastViewedAt?: boolean): ActionFunc;
export declare function markChannelAsUnread(teamId: string, channelId: string, mentions: string[], fetchedChannelMember?: boolean): ActionFunc;
export declare function getChannelMembersByIds(channelId: string, userIds: string[]): ActionFunc;
export declare function getChannelMember(channelId: string, userId: string): ActionFunc;
export declare function getMyChannelMember(channelId: string): ActionFunc;
export declare function favoriteChannel(channelId: string, updateCategories?: boolean): ActionFunc;
export declare function unfavoriteChannel(channelId: string, updateCategories?: boolean): ActionFunc;
export declare function updateChannelScheme(channelId: string, schemeId: string): ActionFunc;
export declare function updateChannelMemberSchemeRoles(channelId: string, userId: string, isSchemeUser: boolean, isSchemeAdmin: boolean): ActionFunc;
export declare function membersMinusGroupMembers(channelID: string, groupIDs: string[], page?: number, perPage?: number): ActionFunc;
export declare function getChannelModerations(channelId: string): ActionFunc;
export declare function patchChannelModerations(channelId: string, patch: ChannelModerationPatch[]): ActionFunc;
export declare function getChannelMemberCountsByGroup(channelId: string, includeTimezones: boolean): ActionFunc;
declare const _default: {
    selectChannel: typeof selectChannel;
    createChannel: typeof createChannel;
    createDirectChannel: typeof createDirectChannel;
    updateChannel: typeof updateChannel;
    patchChannel: typeof patchChannel;
    updateChannelNotifyProps: typeof updateChannelNotifyProps;
    getChannel: typeof getChannel;
    fetchMyChannelsAndMembers: typeof fetchMyChannelsAndMembers;
    getMyChannelMembers: typeof getMyChannelMembers;
    getChannelTimezones: typeof getChannelTimezones;
    getChannelMembersByIds: typeof getChannelMembersByIds;
    leaveChannel: typeof leaveChannel;
    joinChannel: typeof joinChannel;
    deleteChannel: typeof deleteChannel;
    unarchiveChannel: typeof unarchiveChannel;
    viewChannel: typeof viewChannel;
    markChannelAsViewed: typeof markChannelAsViewed;
    getChannels: typeof getChannels;
    autocompleteChannels: typeof autocompleteChannels;
    autocompleteChannelsForSearch: typeof autocompleteChannelsForSearch;
    searchChannels: typeof searchChannels;
    searchGroupChannels: typeof searchGroupChannels;
    getChannelStats: typeof getChannelStats;
    addChannelMember: typeof addChannelMember;
    removeChannelMember: typeof removeChannelMember;
    updateChannelHeader: typeof updateChannelHeader;
    updateChannelPurpose: typeof updateChannelPurpose;
    markChannelAsRead: typeof markChannelAsRead;
    markChannelAsUnread: typeof markChannelAsUnread;
    favoriteChannel: typeof favoriteChannel;
    unfavoriteChannel: typeof unfavoriteChannel;
    membersMinusGroupMembers: typeof membersMinusGroupMembers;
    getChannelModerations: typeof getChannelModerations;
    getChannelMemberCountsByGroup: typeof getChannelMemberCountsByGroup;
};
export default _default;