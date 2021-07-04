import { UserProfile } from './users';
import { Dictionary, RelationOneToOne } from './utilities';
export declare type SyncableType = 'team' | 'channel';
export declare type SyncablePatch = {
    scheme_admin: boolean;
    auto_add: boolean;
};
export declare type GroupPatch = {
    allow_reference: boolean;
    name: string;
};
export declare type Group = {
    id: string;
    name: string;
    display_name: string;
    description: string;
    type: string;
    remote_id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    has_syncables: boolean;
    member_count: number;
    scheme_admin: boolean;
    allow_reference: boolean;
};
export declare type GroupTeam = {
    team_id: string;
    team_display_name: string;
    team_type: string;
    group_id: string;
    auto_add: boolean;
    scheme_admin: boolean;
    create_at: number;
    delete_at: number;
    update_at: number;
};
export declare type GroupChannel = {
    channel_id: string;
    channel_display_name: string;
    channel_type: string;
    team_id: string;
    team_display_name: string;
    team_type: string;
    group_id: string;
    auto_add: boolean;
    scheme_admin: boolean;
    create_at: number;
    delete_at: number;
    update_at: number;
};
export declare type GroupSyncable = {
    group_id: string;
    auto_add: boolean;
    scheme_admin: boolean;
    create_at: number;
    delete_at: number;
    update_at: number;
    type: 'Team' | 'Channel';
};
export declare type GroupSyncablesState = {
    teams: GroupTeam[];
    channels: GroupChannel[];
};
export declare type GroupsState = {
    syncables: Dictionary<GroupSyncablesState>;
    stats: RelationOneToOne<Group, GroupStats>;
    groups: Dictionary<Group>;
    myGroups: Dictionary<Group>;
};
export declare type GroupStats = {
    group_id: string;
    total_member_count: number;
};
export declare type GroupSearchOpts = {
    q: string;
    is_linked?: boolean;
    is_configured?: boolean;
};
export declare type MixedUnlinkedGroup = {
    mattermost_group_id?: string;
    name: string;
    primary_key: string;
    has_syncables?: boolean;
};
export declare type MixedUnlinkedGroupRedux = MixedUnlinkedGroup & {
    failed?: boolean;
};
export declare type UserWithGroup = UserProfile & {
    groups: Group[];
    scheme_guest: boolean;
    scheme_user: boolean;
    scheme_admin: boolean;
};
export declare type GroupsWithCount = {
    groups: Group[];
    total_group_count: number;
    channelID?: string;
    teamID?: string;
};
export declare type UsersWithGroupsAndCount = {
    users: UserWithGroup[];
    total_count: number;
};
