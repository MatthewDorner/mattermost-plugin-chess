import { GenericAction } from "../../types/actions";
import { FilesRequestsStatuses, RequestStatusType } from "../../types/requests";
export declare function handleUploadFilesRequest(REQUEST: string, SUCCESS: string, FAILURE: string, CANCEL: string, state: RequestStatusType, action: GenericAction): RequestStatusType;
declare const _default: (b: FilesRequestsStatuses, a: GenericAction) => FilesRequestsStatuses;
export default _default;
