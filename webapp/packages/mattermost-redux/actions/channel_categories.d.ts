import { ActionFunc, DispatchFunc, GetStateFunc } from "../types/actions";
import { CategorySorting, ChannelCategory } from "../types/channel_categories";
import { Channel } from "../types/channels";
import { $ID } from "../types/utilities";
export declare function expandCategory(categoryId: string): {
    type: "CATEGORY_EXPANDED";
    data: string;
};
export declare function collapseCategory(categoryId: string): {
    type: "CATEGORY_COLLAPSED";
    data: string;
};
export declare function setCategorySorting(categoryId: string, sorting: CategorySorting): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<import("../types/actions").ActionResult>;
export declare function setCategoryMuted(categoryId: string, muted: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<import("../types/actions").ActionResult>;
export declare function updateCategory(category: ChannelCategory): ActionFunc;
export declare function fetchMyCategories(teamId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<import("../types/actions").ActionResult>;
export declare function addChannelToInitialCategory(channel: Channel, setOnServer?: boolean): ActionFunc;
export declare function addChannelToCategory(categoryId: string, channelId: string): ActionFunc;
export declare function moveChannelToCategory(categoryId: string, channelId: string, newIndex: number, setManualSorting?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<import("../types/actions").ActionResult>;
export declare function moveChannelsToCategory(categoryId: string, channelIds: string[], newIndex: number, setManualSorting?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<import("../types/actions").ActionResult>;
export declare function moveCategory(teamId: string, categoryId: string, newIndex: number): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<import("../types/actions").ActionResult>;
export declare function receivedCategoryOrder(teamId: string, order: string[]): {
    type: "RECEIVED_CATEGORY_ORDER";
    data: {
        teamId: string;
        order: string[];
    };
};
export declare function createCategory(teamId: string, displayName: string, channelIds?: Array<$ID<Channel>>): ActionFunc;
export declare function renameCategory(categoryId: string, displayName: string): ActionFunc;
export declare function deleteCategory(categoryId: string): ActionFunc;
