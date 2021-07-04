import { GenericAction } from "../../types/actions";
import { Team } from "../../types/teams";
import { UserThread } from "../../types/threads";
export declare const threadsReducer: (state: import("../../types/utilities").RelationOneToOne<UserThread, UserThread> | undefined, action: GenericAction) => any;
export declare const threadsInTeamReducer: (state: import("../../types/utilities").RelationOneToMany<Team, UserThread> | undefined, action: GenericAction) => import("../../types/utilities").RelationOneToMany<Team, UserThread>;
export declare const countsReducer: (state: import("../../types/utilities").RelationOneToOne<Team, {
    total: number;
    total_unread_threads: number;
    total_unread_mentions: number;
    unread_mentions_per_channel: Record<string, number>;
}> | undefined, action: GenericAction) => import("../../types/utilities").RelationOneToOne<Team, {
    total: number;
    total_unread_threads: number;
    total_unread_mentions: number;
    unread_mentions_per_channel: Record<string, number>;
}> | {
    total: number;
    unread_mentions_per_channel: {};
    total_unread_threads: number;
    total_unread_mentions: number;
};
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    threads: any;
    threadsInTeam: import("../../types/utilities").RelationOneToMany<Team, UserThread>;
    counts: import("../../types/utilities").RelationOneToOne<Team, {
        total: number;
        total_unread_threads: number;
        total_unread_mentions: number;
        unread_mentions_per_channel: Record<string, number>;
    }> | {
        total: number;
        unread_mentions_per_channel: {};
        total_unread_threads: number;
        total_unread_mentions: number;
    };
}>, import("redux").AnyAction>;
export default _default;
