import { FileInfo } from "../types/files";
export declare function getFormattedFileSize(file: FileInfo): string;
export declare function getFileType(file: FileInfo): string;
export declare function lookupMimeType(filename: string): string;
export declare function getFileUrl(fileId: string): string;
export declare function getFileDownloadUrl(fileId: string): string;
export declare function getFileThumbnailUrl(fileId: string): string;
export declare function getFilePreviewUrl(fileId: string): string;
export declare function sortFileInfos(fileInfos?: FileInfo[], locale?: string): FileInfo[];
