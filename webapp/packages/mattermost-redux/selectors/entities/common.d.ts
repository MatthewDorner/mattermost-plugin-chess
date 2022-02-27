import { ChannelMembership, Channel } from "../../types/channels";
import { TeamMembership } from "../../types/teams";
import { GlobalState } from "../../types/store";
import { UserProfile } from "../../types/users";
import { RelationOneToOne, IDMappedObjects, UserIDMappedObjects } from "../../types/utilities";
export declare function getCurrentChannelId(state: GlobalState): string;
export declare function getMyChannelMemberships(state: GlobalState): RelationOneToOne<Channel, ChannelMembership>;
export declare const getMyCurrentChannelMembership: (a: GlobalState) => ChannelMembership | undefined | null;
export declare function getMembersInChannel(state: GlobalState, channelId: string): UserIDMappedObjects<ChannelMembership>;
export declare function getMembersInTeam(state: GlobalState, teamId: string): RelationOneToOne<UserProfile, TeamMembership>;
export declare function getCurrentUser(state: GlobalState): UserProfile;
export declare function getCurrentUserId(state: GlobalState): string;
export declare function getUsers(state: GlobalState): IDMappedObjects<UserProfile>;