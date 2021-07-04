import { Dictionary } from "../../types/utilities";
import { Search } from "../../types/search";
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    flagged: any;
    pinned: never[] | Dictionary<string[]>;
    results: any;
    fileResults: any;
    matches: any;
    recent: Dictionary<Search[]>;
    current: any;
    isSearchingTerm: boolean;
    isSearchGettingMore: any;
}>, import("redux").AnyAction>;
export default _default;
