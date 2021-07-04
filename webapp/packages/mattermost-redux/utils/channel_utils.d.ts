import { Channel, ChannelMembership, ChannelType, ChannelNotifyProps } from "../types/channels";
import { Post } from "../types/posts";
import { UsersState, UserProfile, UserNotifyProps } from "../types/users";
import { GlobalState } from "../types/store";
import { TeamMembership } from "../types/teams";
import { PreferenceType } from "../types/preferences";
import { IDMappedObjects, RelationOneToMany, RelationOneToOne } from "../types/utilities";
export declare function completeDirectChannelInfo(usersState: UsersState, teammateNameDisplay: string, channel: Channel): Channel;
export declare function newCompleteDirectChannelInfo(currentUserId: string, profiles: IDMappedObjects<UserProfile>, profilesInChannel: RelationOneToMany<Channel, UserProfile>, teammateStatus: string, teammateNameDisplay: string, channel: Channel): Channel;
export declare function completeDirectChannelDisplayName(currentUserId: string, profiles: IDMappedObjects<UserProfile>, userIdsInChannel: Set<string>, teammateNameDisplay: string, channel: Channel): Channel;
export declare function cleanUpUrlable(input: string): string;
export declare function getChannelByName(channels: IDMappedObjects<Channel>, name: string): Channel | undefined | null;
export declare function getDirectChannelName(id: string, otherId: string): string;
export declare function getUserIdFromChannelName(userId: string, channelName: string): string;
export declare function isAutoClosed(config: any, myPreferences: {
    [x: string]: PreferenceType;
}, channel: Channel, channelActivity: number, channelArchiveTime: number, currentChannelId?: string, now?: number): boolean;
export declare function isDirectChannel(channel: Channel): boolean;
export declare function isDirectChannelVisible(otherUserOrOtherUserId: UserProfile | string, config: any, myPreferences: {
    [x: string]: PreferenceType;
}, channel: Channel, lastPost?: Post | null, isUnread?: boolean, currentChannelId?: string, now?: number): boolean;
export declare function isGroupChannel(channel: Channel): boolean;
export declare function isGroupChannelVisible(config: any, myPreferences: {
    [x: string]: PreferenceType;
}, channel: Channel, lastPost?: Post, isUnread?: boolean, now?: number): boolean;
export declare function isGroupOrDirectChannelVisible(channel: Channel, memberships: RelationOneToOne<Channel, ChannelMembership>, config: any, myPreferences: {
    [x: string]: PreferenceType;
}, currentUserId: string, users: IDMappedObjects<UserProfile>, lastPosts: RelationOneToOne<Channel, Post>, currentChannelId?: string, now?: number): boolean;
export declare function showCreateOption(state: GlobalState, config: any, license: any, teamId: string, channelType: ChannelType, isAdmin: boolean, isSystemAdmin: boolean): boolean;
export declare function showManagementOptions(state: GlobalState, config: any, license: any, channel: Channel, isAdmin: boolean, isSystemAdmin: boolean, isChannelAdmin: boolean): boolean;
export declare function showDeleteOption(state: GlobalState, config: any, license: any, channel: Channel, isAdmin: boolean, isSystemAdmin: boolean, isChannelAdmin: boolean): boolean;
export declare function canManageMembersOldPermissions(channel: Channel, user: UserProfile, teamMember: TeamMembership, channelMember: ChannelMembership, config: any, license: any): boolean;
export declare function getChannelsIdForTeam(state: GlobalState, teamId: string): string[];
export declare function getGroupDisplayNameFromUserIds(userIds: string[], profiles: IDMappedObjects<UserProfile>, currentUserId: string, teammateNameDisplay: string): string;
export declare function isFavoriteChannelOld(myPreferences: {
    [x: string]: PreferenceType;
}, id: string): boolean;
export declare function isDefault(channel: Channel): boolean;
export declare function isUnreadChannel(members: RelationOneToOne<Channel, ChannelMembership>, channel: Channel): boolean;
export declare function isOpenChannel(channel: Channel): boolean;
export declare function isPrivateChannel(channel: Channel): boolean;
export declare function sortChannelsByTypeListAndDisplayName(locale: string, typeList: string[], a: Channel, b: Channel): number;
export declare function sortChannelsByTypeAndDisplayName(locale: string, a: Channel, b: Channel): number;
export declare function sortChannelsByDisplayName(locale: string, a: Channel, b: Channel): number;
export declare function sortChannelsByDisplayNameAndMuted(locale: string, members: RelationOneToOne<Channel, ChannelMembership>, a: Channel, b: Channel): number;
export declare function sortChannelsByRecency(lastPosts: RelationOneToOne<Channel, Post>, a: Channel, b: Channel): number;
export declare function isChannelMuted(member: ChannelMembership): boolean;
export declare function areChannelMentionsIgnored(channelMemberNotifyProps: ChannelNotifyProps, currentUserNotifyProps: UserNotifyProps): boolean;
export declare function filterChannelsMatchingTerm(channels: Channel[], term: string): Channel[];
