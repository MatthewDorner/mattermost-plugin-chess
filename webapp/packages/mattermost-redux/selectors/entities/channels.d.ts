import { getCurrentChannelId, getMyChannelMemberships, getMyCurrentChannelMembership } from "./common";
import { Channel, ChannelStats, ChannelMembership, ChannelModeration, ChannelMemberCountsByGroup } from "../../types/channels";
import { Post } from "../../types/posts";
import { GlobalState } from "../../types/store";
import { Team } from "../../types/teams";
import { UserProfile } from "../../types/users";
import { $ID, IDMappedObjects, NameMappedObjects, RelationOneToMany, RelationOneToOne, UserIDMappedObjects } from "../../types/utilities";
export { getCurrentChannelId, getMyChannelMemberships, getMyCurrentChannelMembership };
declare type SortingType = 'recent' | 'alpha';
export declare function getAllChannels(state: GlobalState): IDMappedObjects<Channel>;
export declare function getAllChannelStats(state: GlobalState): RelationOneToOne<Channel, ChannelStats>;
export declare function getChannelsInTeam(state: GlobalState): RelationOneToMany<Team, Channel>;
export declare function getChannelsInPolicy(state: GlobalState): IDMappedObjects<Channel>;
export declare const getDirectChannelsSet: (state: GlobalState) => Set<string>;
export declare function getChannelMembersInChannels(state: GlobalState): RelationOneToOne<Channel, UserIDMappedObjects<ChannelMembership>>;
export declare const mapAndSortChannelIds: (channels: Channel[], currentUser: UserProfile, myMembers: RelationOneToOne<Channel, ChannelMembership>, lastPosts: RelationOneToOne<Channel, Post>, sorting: SortingType, sortMentionsFirst?: boolean) => string[];
export declare function filterChannels(unreadIds: string[], favoriteIds: string[], channelIds: string[], unreadsAtTop: boolean, favoritesAtTop: boolean): string[];
export declare function makeGetChannel(): (state: GlobalState, props: {
    id: string;
}) => Channel;
export declare function getChannel(state: GlobalState, id: string): Channel;
export declare function makeGetChannelsForIds(): (state: GlobalState, ids: string[]) => Channel[];
export declare const getCurrentChannel: (state: GlobalState) => Channel;
export declare const getMyChannelMember: (state: GlobalState, channelId: string) => ChannelMembership | undefined | null;
export declare const getCurrentChannelStats: (state: GlobalState) => ChannelStats;
export declare function isCurrentChannelFavorite(state: GlobalState): boolean;
export declare const isCurrentChannelMuted: (state: GlobalState) => boolean;
export declare const isCurrentChannelArchived: (state: GlobalState) => boolean;
export declare const isCurrentChannelDefault: (state: GlobalState) => boolean;
export declare function isCurrentChannelReadOnly(state: GlobalState): boolean;
export declare function isChannelReadOnlyById(state: GlobalState, channelId: string): boolean;
export declare function isChannelReadOnly(state: GlobalState, channel: Channel): boolean;
export declare function shouldHideDefaultChannel(state: GlobalState, channel: Channel): boolean;
export declare const countCurrentChannelUnreadMessages: (state: GlobalState) => number;
export declare function getChannelByName(state: GlobalState, channelName: string): Channel | undefined | null;
export declare const getChannelSetInCurrentTeam: (state: GlobalState) => string[];
export declare const getChannelsInCurrentTeam: (state: GlobalState) => Channel[];
export declare const getChannelsNameMapInTeam: (state: GlobalState, teamId: string) => NameMappedObjects<Channel>;
export declare const getChannelsNameMapInCurrentTeam: (state: GlobalState) => NameMappedObjects<Channel>;
export declare const getAllDirectChannels: (state: GlobalState) => Channel[];
export declare const getAllDirectChannelsNameMapInCurrentTeam: (state: GlobalState) => NameMappedObjects<Channel>;
export declare const getGroupChannels: (state: GlobalState) => Channel[];
export declare const getMyChannels: (state: GlobalState) => Channel[];
export declare const getOtherChannels: (state: GlobalState, archived?: boolean | null) => Channel[];
export declare const getDefaultChannel: (state: GlobalState) => Channel | undefined | null;
export declare const getMembersInCurrentChannel: (state: GlobalState) => UserIDMappedObjects<ChannelMembership>;
export declare const getUnreads: (state: GlobalState) => {
    messageCount: number;
    mentionCount: number;
};
export declare const getUnreadsInCurrentTeam: (a: GlobalState) => {
    messageCount: number;
    mentionCount: number;
};
export declare const canManageChannelMembers: (state: GlobalState) => boolean;
export declare const canManageAnyChannelMembersInCurrentTeam: (state: GlobalState) => boolean;
export declare const getAllDirectChannelIds: (state: GlobalState) => string[];
export declare const getChannelIdsInCurrentTeam: (state: GlobalState) => string[];
export declare const getChannelIdsForCurrentTeam: (state: GlobalState) => string[];
export declare const getUnreadChannelIds: (state: GlobalState, lastUnreadChannel?: Channel | null) => string[];
export declare const getUnreadChannels: (state: GlobalState, lastUnreadChannel?: Channel | null) => Channel[];
export declare const getMapAndSortedUnreadChannelIds: (state: GlobalState, lastUnreadChannel: Channel, sorting: SortingType) => string[];
export declare const getSortedUnreadChannelIds: (state: GlobalState, lastUnreadChannel: Channel | null, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
export declare const getAllRecentChannels: (state: GlobalState) => Channel[];
export declare const getFavoriteChannels: (state: GlobalState) => Channel[];
export declare const getFavoriteChannelIds: (state: GlobalState, lastUnreadChannel: Channel, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
export declare const getSortedFavoriteChannelIds: (state: GlobalState, lastUnreadChannel: Channel | null, favoritesAtTop: boolean, unreadsAtTop: boolean, sorting: SortingType) => string[];
export declare const getPublicChannels: (state: GlobalState) => Channel[];
export declare const getPublicChannelIds: (state: GlobalState, lastUnreadChannel: Channel, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
export declare const getSortedPublicChannelIds: (state: GlobalState, lastUnreadChannel: Channel | null, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
export declare const getPrivateChannels: (a: GlobalState) => Channel[];
export declare const getPrivateChannelIds: (state: GlobalState, lastUnreadChannel: Channel, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
export declare const getSortedPrivateChannelIds: (state: GlobalState, lastUnreadChannel: Channel | null, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
export declare const getDirectChannels: (state: GlobalState) => Channel[];
export declare const getDirectAndGroupChannels: (a: GlobalState) => Channel[];
export declare const getDirectChannelIds: (state: GlobalState, lastUnreadChannel: Channel, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
export declare const getSortedDirectChannelIds: (state: GlobalState, lastUnreadChannel: Channel | null, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => Array<$ID<Channel>>;
export declare const getChannelsWithUserProfiles: (state: GlobalState) => Array<{
    profiles: UserProfile[];
} & Channel>;
export declare const getAllChannelIds: (state: GlobalState, lastUnreadChannel: Channel, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
export declare const getAllSortedChannelIds: (state: GlobalState, lastUnreadChannel: Channel | null, unreadsAtTop: boolean, favoritesAtTop: boolean, sorting: SortingType) => string[];
declare type ChannelsByCategory = {
    type: string;
    name: string;
    items: string[];
};
export declare const getOrderedChannelIds: (state: GlobalState, lastUnreadChannel: Channel | null, grouping: 'by_type' | 'none', sorting: SortingType, unreadsAtTop: boolean, favoritesAtTop: boolean) => ChannelsByCategory[];
export declare const getDefaultChannelForTeams: (state: GlobalState) => RelationOneToOne<Team, Channel>;
export declare const getMyFirstChannelForTeams: (state: GlobalState) => RelationOneToOne<Team, Channel>;
export declare const getRedirectChannelNameForTeam: (state: GlobalState, teamId: string) => string;
export declare function isManuallyUnread(state: GlobalState, channelId?: string): boolean;
export declare function getChannelModerations(state: GlobalState, channelId: string): ChannelModeration[];
export declare function getChannelMemberCountsByGroup(state: GlobalState, channelId: string): ChannelMemberCountsByGroup;
export declare function isFavoriteChannel(state: GlobalState, channelId: string): boolean;
