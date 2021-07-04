import { DispatchFunc, ActionFunc } from "../types/actions";
import { Role } from "../types/roles";
export declare function getRolesByNames(rolesNames: string[]): ActionFunc;
export declare function getRoleByName(roleName: string): ActionFunc;
export declare function getRole(roleId: string): ActionFunc;
export declare function editRole(role: Role): ActionFunc;
export declare function setPendingRoles(roles: string[]): (dispatch: DispatchFunc) => Promise<{
    data: string[];
}>;
export declare function loadRolesIfNeeded(roles: Iterable<string>): ActionFunc;
