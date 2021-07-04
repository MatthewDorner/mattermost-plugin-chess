import { GlobalState } from './store';
export declare type GetStateFunc = () => GlobalState;
export declare type GenericAction = {
    type: string;
    data?: any;
    meta?: any;
    error?: any;
    index?: number;
    displayable?: boolean;
    postId?: string;
    sessionId?: string;
    currentUserId?: string;
    timestamp?: number;
    [extraProps: string]: any;
};
export declare type Thunk = (b: DispatchFunc, a: GetStateFunc) => Promise<ActionResult> | ActionResult;
declare type BatchAction = {
    type: 'BATCHING_REDUCER.BATCH';
    payload: GenericAction[];
    meta: {
        batch: true;
    };
};
export declare type Action = GenericAction | Thunk | BatchAction | ActionFunc;
export declare type ActionResult = {
    data: any;
} | {
    error: any;
};
export declare type DispatchFunc = (action: Action, getState?: GetStateFunc | null) => Promise<ActionResult>;
export declare type ActionFunc = (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<ActionResult | ActionResult[]> | ActionResult;
export declare type PlatformType = 'web' | 'ios' | 'android';
export declare const BATCH = "BATCHING_REDUCER.BATCH";
export declare function batchActions(actions: Action[], type?: string): {
    type: string;
    meta: {
        batch: boolean;
    };
    payload: Action[];
};
export declare type Reducer<S = any, A extends Action = Action> = (state: S | undefined, action: A) => S;
export declare function enableBatching<S>(reduce: Reducer<S>): Reducer<S>;
export {};
