import * as reselect from 'reselect';
import { Dictionary } from "../types/utilities";
export declare function memoizeResult<F extends Function>(func: F): F;
export declare const createIdsSelector: typeof reselect.createSelector;
export declare const createShallowSelector: typeof reselect.createSelector;
export declare const isMinimumServerVersion: (currentVersion: string, minMajorVersion?: number, minMinorVersion?: number, minDotVersion?: number) => boolean;
export declare function generateId(): string;
export declare function isEmail(email: string): boolean;
export declare function buildQueryString(parameters: Dictionary<any>): string;
