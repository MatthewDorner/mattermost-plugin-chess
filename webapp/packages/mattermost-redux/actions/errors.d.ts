import { ErrorObject } from 'serialize-error';
import { ActionFunc } from "../types/actions";
import { ServerError } from "../types/errors";
export declare function dismissErrorObject(index: number): {
    type: "DISMISS_ERROR";
    index: number;
    data: null;
};
export declare function dismissError(index: number): ActionFunc;
export declare function getLogErrorAction(error: ErrorObject, displayable?: boolean): {
    type: "LOG_ERROR";
    displayable: boolean;
    error: ErrorObject;
    data: null;
};
export declare function logError(error: ServerError, displayable?: boolean): ActionFunc;
export declare function clearErrors(): ActionFunc;
