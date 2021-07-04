import { DispatchFunc, GetStateFunc } from "../types/actions";
import { GlobalState } from "../types/store";
export declare function saveAppPropsRequest(props: any): {
    type: "SAVE_APP_PROPS";
    props: any;
};
export declare function saveAppProps(appProps: any): (dispatch: DispatchFunc, getState: GetStateFunc) => void;
export declare function selectSearchText(searchText: string): {
    type: "SELECT_SEARCH_TEXT";
    searchText: string;
};
export declare function updateSearchText(searchText: string): {
    type: "UPDATE_SEARCH_TEXT";
    searchText: string;
};
export declare function searchBarTextSave(searchBarText: string): {
    type: "SAVE_SEARCH_BAR_TEXT";
    searchBarText: string;
};
export declare function invalidateSearchText(searchText: string): {
    type: "INVALIDATE_SEARCH_TEXT";
    searchText: string;
};
export declare function requestSearch(searchText: string): {
    type: "REQUEST_SEARCH";
    searchText: string;
};
export declare function receiveSearch({ searchText, count, start, json }: {
    searchText: string;
    count: number;
    start: number;
    json: any;
}): any;
export declare function receiveSearchEnd(searchText: string): {
    type: "RECEIVE_SEARCH_END";
    searchText: string;
};
export declare function errorSearching(err: any, searchText: string): {
    type: "SEARCH_FAILURE";
    searchText: string;
    err: any;
};
export declare function receiveCategorySearch({ tagName, json }: {
    tagName: string;
    json: any;
}): any;
export declare function clearSearchResults(): {
    type: "CLEAR_SEARCH_RESULTS";
};
export declare function requestSearchById(gfyId: string): {
    type: "SEARCH_BY_ID_REQUEST";
    payload: {
        gfyId: string;
    };
};
export declare function receiveSearchById(gfyId: string, gfyItem: any): {
    type: "SEARCH_BY_ID_SUCCESS";
    payload: {
        gfyId: string;
        gfyItem: any;
    };
};
export declare function errorSearchById(err: any, gfyId: string): {
    type: "SEARCH_BY_ID_FAILURE";
    err: any;
    gfyId: string;
};
export declare function searchScrollPosition(scrollPosition: number): {
    type: "SAVE_SEARCH_SCROLL_POSITION";
    scrollPosition: number;
};
export declare function searchPriorLocation(priorLocation: number): {
    type: "SAVE_SEARCH_PRIOR_LOCATION";
    priorLocation: number;
};
export declare function searchGfycat({ searchText, count, startIndex }: {
    searchText: string;
    count?: number;
    startIndex?: number;
}): (dispatch: DispatchFunc, getState: GetStateFunc) => any;
export declare function searchCategory({ tagName, gfyCount, cursorPos }: {
    tagName?: string | undefined;
    gfyCount?: number | undefined;
    cursorPos?: undefined;
}): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<any>;
export declare function shouldSearch(state: GlobalState, searchText: string): any;
export declare function searchIfNeeded(searchText: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<void> | Promise<import("../types/actions").ActionResult>;
export declare function searchIfNeededInitial(searchText: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<void> | Promise<import("../types/actions").ActionResult>;
export declare function shouldSearchInitial(state: GlobalState, searchText: string): boolean;
export declare function searchById(gfyId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => any;
export declare function shouldSearchById(state: GlobalState, gfyId: string): boolean;
export declare function searchByIdIfNeeded(gfyId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<any>;
export declare function saveSearchScrollPosition(scrollPosition: number): (dispatch: DispatchFunc) => void;
export declare function saveSearchPriorLocation(priorLocation: number): (dispatch: DispatchFunc) => void;
export declare function searchTextUpdate(searchText: string): (dispatch: DispatchFunc) => void;
export declare function saveSearchBarText(searchBarText: string): (dispatch: DispatchFunc) => void;
export declare function categoriesListRequest(): {
    type: "REQUEST_CATEGORIES_LIST";
};
export declare function categoriesListReceived(json: any): any;
export declare function categoriesListFailure(err: any): {
    type: "CATEGORIES_LIST_FAILURE";
    err: any;
};
export declare function requestCategoriesList({ count }?: {
    count?: number | undefined;
}): (dispatch: DispatchFunc, getState: GetStateFunc) => any;
export declare function requestCategoriesListIfNeeded({ count, }?: {
    count: undefined;
}): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<void> | Promise<import("../types/actions").ActionResult>;
export declare function shouldRequestCategoriesList(state: {
    hasMore: boolean;
    isFetching: boolean;
    tagsList: any[];
}): boolean;
export declare function cacheRequest(): {
    type: "CACHE_REQUEST";
    payload: {
        updating: boolean;
    };
};
export declare function cacheGifs(gifs: any): {
    type: "CACHE_GIFS";
    gifs: any;
};
export declare function cacheGifsRequest(gifs: any): (dispatch: DispatchFunc) => Promise<{
    data: boolean;
}>;
