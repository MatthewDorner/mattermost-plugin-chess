import { GlobalState } from "../../types/store";
export declare type PermissionsOptions = {
    channel?: string;
    team?: string;
    permission: string;
};
export declare function getRoles(state: GlobalState): {
    [x: string]: import("../../types/roles").Role;
};
export declare const getMySystemRoles: (state: GlobalState) => Set<string>;
export declare const getMySystemPermissions: (state: GlobalState) => Set<string>;
export declare const haveISystemPermission: (state: GlobalState, options: PermissionsOptions) => boolean;
