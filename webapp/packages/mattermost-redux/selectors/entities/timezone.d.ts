import { GlobalState } from "../../types/store";
export declare function getUserTimezone(state: GlobalState, id: string): {
    useAutomaticTimezone: boolean;
    automaticTimezone: string;
    manualTimezone: string;
};
export declare function isTimezoneEnabled(state: GlobalState): boolean;
