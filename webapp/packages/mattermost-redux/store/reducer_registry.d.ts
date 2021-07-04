import { Reducer } from "../types/actions";
import { Dictionary } from "../types/utilities";
export declare class ReducerRegistry {
    emitChange?: (reducers: Dictionary<Reducer>) => void;
    reducers: Dictionary<Reducer>;
    setReducers: (reducers: Dictionary<Reducer>) => void;
    getReducers: () => {
        [x: string]: Reducer<any, import("../types/actions").Action>;
    };
    register: (name: string, reducer: Reducer) => void;
    setChangeListener: (listener: (reducers: Dictionary<Reducer>) => void) => void;
}
declare const reducerRegistry: ReducerRegistry;
export default reducerRegistry;
