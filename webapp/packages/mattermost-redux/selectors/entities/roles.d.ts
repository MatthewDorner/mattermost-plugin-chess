import { getMySystemPermissions, getMySystemRoles, getRoles, PermissionsOptions } from "./roles_helpers";
import { Role } from "../../types/roles";
import { GlobalState } from "../../types/store";
import { Dictionary } from "../../types/utilities";
export { getMySystemPermissions, getMySystemRoles, getRoles };
export declare const getMyTeamRoles: (state: GlobalState) => Dictionary<Set<string>>;
export declare const getMyChannelRoles: (state: GlobalState) => Dictionary<Set<string>>;
export declare const getMyRoles: (state: GlobalState) => {
    system: Set<string>;
    team: Dictionary<Set<string>>;
    channel: Dictionary<Set<string>>;
};
export declare const getRolesById: (state: GlobalState) => Dictionary<Role>;
export declare const getMyCurrentTeamPermissions: (state: GlobalState) => Set<string>;
export declare const getMyCurrentChannelPermissions: (state: GlobalState) => Set<string>;
export declare const getMyTeamPermissions: (state: GlobalState, options: PermissionsOptions) => Set<string>;
export declare const getMyChannelPermissions: (state: GlobalState, options: PermissionsOptions) => Set<string>;
export declare const haveISystemPermission: (state: GlobalState, options: PermissionsOptions) => boolean;
export declare const haveITeamPermission: (state: GlobalState, options: PermissionsOptions) => boolean;
export declare const haveIChannelPermission: (state: GlobalState, options: PermissionsOptions) => boolean;
export declare const haveICurrentTeamPermission: (state: GlobalState, options: PermissionsOptions) => boolean;
export declare const haveICurrentChannelPermission: (state: GlobalState, options: PermissionsOptions) => boolean;
