import { DispatchFunc, GetStateFunc } from "../types/actions";
export declare function autoUpdateTimezone(deviceTimezone: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<void>;
