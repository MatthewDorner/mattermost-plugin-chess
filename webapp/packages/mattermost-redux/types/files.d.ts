import { Dictionary, $ID } from './utilities';
export declare type FileInfo = {
    id: string;
    user_id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    name: string;
    extension: string;
    size: number;
    mime_type: string;
    width: number;
    height: number;
    has_preview_image: boolean;
    clientId: string;
    post_id?: string;
};
export declare type FilesState = {
    files: Dictionary<FileInfo>;
    filesFromSearch: Dictionary<FileSearchResultItem>;
    fileIdsByPostId: Dictionary<string[]>;
    filePublicLink?: string;
};
export declare type FileUploadResponse = {
    file_infos: FileInfo[];
    client_ids: string[];
};
export declare type FileSearchResultItem = FileInfo & {
    channel_id: string;
};
export declare type FileSearchResults = {
    order: Array<$ID<FileSearchResultItem>>;
    file_infos: Map<string, FileSearchResultItem>;
    next_file_info_id: string;
    prev_file_info_id: string;
};
