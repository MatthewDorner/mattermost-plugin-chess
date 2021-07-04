import { ServerError } from './errors';
import { UserProfile } from './users';
import { Dictionary, RelationOneToOne } from './utilities';
export declare type TeamMembership = {
    mention_count: number;
    msg_count: number;
    team_id: string;
    user_id: string;
    roles: string;
    delete_at: number;
    scheme_user: boolean;
    scheme_admin: boolean;
};
export declare type TeamMemberWithError = {
    member: TeamMembership;
    user_id: string;
    error: ServerError;
};
export declare type TeamType = 'O' | 'I';
export declare type Team = {
    id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    display_name: string;
    name: string;
    description: string;
    email: string;
    type: TeamType;
    company_name: string;
    allowed_domains: string;
    invite_id: string;
    allow_open_invite: boolean;
    scheme_id: string;
    group_constrained: boolean;
};
export declare type TeamsState = {
    currentTeamId: string;
    teams: Dictionary<Team>;
    myMembers: Dictionary<TeamMembership>;
    membersInTeam: RelationOneToOne<Team, RelationOneToOne<UserProfile, TeamMembership>>;
    stats: RelationOneToOne<Team, TeamStats>;
    groupsAssociatedToTeam: any;
    totalCount: number;
    teamsInPolicy: Dictionary<Team>;
};
export declare type TeamUnread = {
    team_id: string;
    mention_count: number;
    msg_count: number;
};
export declare type GetTeamMembersOpts = {
    sort?: 'Username';
    exclude_deleted_users?: boolean;
};
export declare type TeamsWithCount = {
    teams: Team[];
    total_count: number;
};
export declare type TeamStats = {
    team_id: string;
    total_member_count: number;
    active_member_count: number;
};
export declare type TeamSearchOpts = {
    page?: number;
    per_page?: number;
    allow_open_invite?: boolean;
    group_constrained?: boolean;
};
export declare type TeamInviteWithError = {
    email: string;
    error: ServerError;
};
