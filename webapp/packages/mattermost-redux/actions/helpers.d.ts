import { Client4Error } from "../types/client4";
import { ActionFunc, GenericAction, DispatchFunc, GetStateFunc } from "../types/actions";
declare type ActionType = string;
export declare function forceLogoutIfNecessary(err: Client4Error, dispatch: DispatchFunc, getState: GetStateFunc): void;
export declare function requestData(type: ActionType): GenericAction;
export declare function requestSuccess(type: ActionType, data: any): {
    type: string;
    data: any;
};
export declare function requestFailure(type: ActionType, error: Client4Error): any;
/**
 * Returns an ActionFunc which calls a specfied (client) function and
 * dispatches the specifed actions on request, success or failure.
 *
 * @export
 * @param {Object} obj                                       an object for destructirung required properties
 * @param {() => Promise<mixed>} obj.clientFunc              clientFunc to execute
 * @param {ActionType} obj.onRequest                         ActionType to dispatch on request
 * @param {(ActionType | Array<ActionType>)} obj.onSuccess   ActionType to dispatch on success
 * @param {ActionType} obj.onFailure                         ActionType to dispatch on failure
 * @param {...Array<any>} obj.params
 * @returns {ActionFunc} ActionFunc
 */
export declare function bindClientFunc({ clientFunc, onRequest, onSuccess, onFailure, params, }: {
    clientFunc: (...args: any[]) => Promise<any>;
    onRequest?: ActionType;
    onSuccess?: ActionType | ActionType[];
    onFailure?: ActionType;
    params?: any[];
}): ActionFunc;
export declare function debounce(func: (...args: any) => unknown, wait: number, immediate: boolean, cb: () => unknown): (...args: any[]) => void;
export declare class FormattedError extends Error {
    intl: {
        id: string;
        defaultMessage: string;
        values: any;
    };
    constructor(id: string, defaultMessage: string, values?: any);
}
export {};
