import { FileInfo, FileSearchResultItem } from "../../types/files";
import { GlobalState } from "../../types/store";
export declare function getFilePublicLink(state: GlobalState): string | undefined;
export declare function makeGetFilesForPost(): (state: GlobalState, postId: string) => FileInfo[];
export declare const getSearchFilesResults: (state: GlobalState) => FileSearchResultItem[];
