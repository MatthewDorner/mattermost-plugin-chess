import { ActionFunc, Action } from "../types/actions";
import { FileSearchResultItem } from "../types/files";
export declare function receivedFiles(files: Map<string, FileSearchResultItem>): Action;
export declare function getFilesForPost(postId: string): ActionFunc;
export declare function uploadFile(channelId: string, rootId: string, clientIds: string[], fileFormData: File, formBoundary: string): ActionFunc;
export declare function getFilePublicLink(fileId: string): ActionFunc;
