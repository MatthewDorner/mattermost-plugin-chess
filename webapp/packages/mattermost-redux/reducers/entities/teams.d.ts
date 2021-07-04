import { Team, TeamMembership } from "../../types/teams";
import { UserProfile } from "../../types/users";
import { RelationOneToOne } from "../../types/utilities";
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    currentTeamId: any;
    teams: any;
    myMembers: RelationOneToOne<Team, TeamMembership>;
    membersInTeam: RelationOneToOne<Team, RelationOneToOne<UserProfile, TeamMembership>>;
    stats: any;
    groupsAssociatedToTeam: RelationOneToOne<Team, {
        ids: string[];
        totalCount: number;
    }>;
    totalCount: any;
    teamsInPolicy: RelationOneToOne<Team, Team>;
}>, import("redux").AnyAction>;
export default _default;
