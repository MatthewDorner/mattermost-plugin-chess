import { GenericAction } from "../../types/actions";
import { FileInfo, FileSearchResultItem } from "../../types/files";
import { Dictionary } from "../../types/utilities";
export declare function files(state: Dictionary<FileInfo> | undefined, action: GenericAction): any;
export declare function filesFromSearch(state: Dictionary<FileSearchResultItem> | undefined, action: GenericAction): any;
export declare function fileIdsByPostId(state: Dictionary<string[]> | undefined, action: GenericAction): unknown;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    files: any;
    filesFromSearch: any;
    fileIdsByPostId: unknown;
    filePublicLink: any;
}>, import("redux").AnyAction>;
export default _default;
