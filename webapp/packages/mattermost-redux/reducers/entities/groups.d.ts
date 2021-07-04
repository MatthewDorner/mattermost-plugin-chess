import { GroupSyncablesState, Group } from "../../types/groups";
import { Dictionary } from "../../types/utilities";
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    syncables: Dictionary<GroupSyncablesState>;
    groups: Dictionary<Group>;
    stats: any;
    myGroups: any;
}>, import("redux").AnyAction>;
export default _default;
