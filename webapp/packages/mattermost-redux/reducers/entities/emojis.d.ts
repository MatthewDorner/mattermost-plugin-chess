import { EmojisState, CustomEmoji } from "../../types/emojis";
import * as types from "../../../types";
export declare function customEmoji(state: types.utilities.RelationOneToOne<CustomEmoji, CustomEmoji> | undefined, action: types.actions.GenericAction): types.utilities.IDMappedObjects<CustomEmoji>;
declare const _default: (b: EmojisState, a: types.actions.GenericAction) => EmojisState;
export default _default;
