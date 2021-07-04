import { Action, Reducer } from "../types/actions";
export declare function createReducer(baseState: any, ...reducers: Reducer[]): Reducer<{}, Action>;
