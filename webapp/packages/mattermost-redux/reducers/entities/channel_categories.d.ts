import { GenericAction } from "../../types/actions";
import { ChannelCategory } from "../../types/channel_categories";
import { Team } from "../../types/teams";
import { RelationOneToOne } from "../../types/utilities";
export declare function byId(state: RelationOneToOne<ChannelCategory, ChannelCategory> | undefined, action: GenericAction): RelationOneToOne<ChannelCategory, ChannelCategory>;
export declare function orderByTeam(state: RelationOneToOne<Team, string[]> | undefined, action: GenericAction): RelationOneToOne<Team, string[]>;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    byId: RelationOneToOne<ChannelCategory, ChannelCategory>;
    orderByTeam: RelationOneToOne<Team, string[]>;
}>, import("redux").AnyAction>;
export default _default;
