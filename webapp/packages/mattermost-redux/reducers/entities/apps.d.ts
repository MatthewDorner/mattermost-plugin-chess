import { AppBinding, AppsState } from "../../types/apps";
import { GenericAction } from "../../types/actions";
export declare function bindings(state: AppBinding[] | undefined, action: GenericAction): AppBinding[];
declare const _default: (b: AppsState, a: GenericAction) => AppsState;
export default _default;
