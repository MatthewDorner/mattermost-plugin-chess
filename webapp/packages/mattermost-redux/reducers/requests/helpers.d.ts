import { GenericAction } from "../../types/actions";
import { RequestStatusType } from "../../types/requests";
export declare function initialRequestState(): RequestStatusType;
export declare function handleRequest(REQUEST: string, SUCCESS: string, FAILURE: string, state: RequestStatusType, action: GenericAction): RequestStatusType;
