"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheGifsRequest = exports.cacheGifs = exports.cacheRequest = exports.shouldRequestCategoriesList = exports.requestCategoriesListIfNeeded = exports.requestCategoriesList = exports.categoriesListFailure = exports.categoriesListReceived = exports.categoriesListRequest = exports.saveSearchBarText = exports.searchTextUpdate = exports.saveSearchPriorLocation = exports.saveSearchScrollPosition = exports.searchByIdIfNeeded = exports.shouldSearchById = exports.searchById = exports.shouldSearchInitial = exports.searchIfNeededInitial = exports.searchIfNeeded = exports.shouldSearch = exports.searchCategory = exports.searchGfycat = exports.searchPriorLocation = exports.searchScrollPosition = exports.errorSearchById = exports.receiveSearchById = exports.requestSearchById = exports.clearSearchResults = exports.receiveCategorySearch = exports.errorSearching = exports.receiveSearchEnd = exports.receiveSearch = exports.requestSearch = exports.invalidateSearchText = exports.searchBarTextSave = exports.updateSearchText = exports.selectSearchText = exports.saveAppProps = exports.saveAppPropsRequest = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var action_types_1 = require("../action_types");
var client_1 = require("../client");
var gfycat_sdk_1 = tslib_1.__importDefault(require("../utils/gfycat_sdk"));
// APP PROPS
function saveAppPropsRequest(props) {
    return {
        type: action_types_1.GifTypes.SAVE_APP_PROPS,
        props: props,
    };
}
exports.saveAppPropsRequest = saveAppPropsRequest;
function saveAppProps(appProps) {
    return function (dispatch, getState) {
        var _a = getState().entities.general.config, GfycatApiKey = _a.GfycatApiKey, GfycatApiSecret = _a.GfycatApiSecret;
        gfycat_sdk_1.default(GfycatApiKey, GfycatApiSecret).authenticate();
        dispatch(saveAppPropsRequest(appProps));
    };
}
exports.saveAppProps = saveAppProps;
// SEARCH
function selectSearchText(searchText) {
    return {
        type: action_types_1.GifTypes.SELECT_SEARCH_TEXT,
        searchText: searchText,
    };
}
exports.selectSearchText = selectSearchText;
function updateSearchText(searchText) {
    return {
        type: action_types_1.GifTypes.UPDATE_SEARCH_TEXT,
        searchText: searchText,
    };
}
exports.updateSearchText = updateSearchText;
function searchBarTextSave(searchBarText) {
    return {
        type: action_types_1.GifTypes.SAVE_SEARCH_BAR_TEXT,
        searchBarText: searchBarText,
    };
}
exports.searchBarTextSave = searchBarTextSave;
function invalidateSearchText(searchText) {
    return {
        type: action_types_1.GifTypes.INVALIDATE_SEARCH_TEXT,
        searchText: searchText,
    };
}
exports.invalidateSearchText = invalidateSearchText;
function requestSearch(searchText) {
    return {
        type: action_types_1.GifTypes.REQUEST_SEARCH,
        searchText: searchText,
    };
}
exports.requestSearch = requestSearch;
function receiveSearch(_a) {
    var searchText = _a.searchText, count = _a.count, start = _a.start, json = _a.json;
    return tslib_1.__assign(tslib_1.__assign({ type: action_types_1.GifTypes.RECEIVE_SEARCH, searchText: searchText }, json), { count: count,
        start: start, currentPage: start / count, receivedAt: Date.now() });
}
exports.receiveSearch = receiveSearch;
function receiveSearchEnd(searchText) {
    return {
        type: action_types_1.GifTypes.RECEIVE_SEARCH_END,
        searchText: searchText,
    };
}
exports.receiveSearchEnd = receiveSearchEnd;
function errorSearching(err, searchText) {
    return {
        type: action_types_1.GifTypes.SEARCH_FAILURE,
        searchText: searchText,
        err: err,
    };
}
exports.errorSearching = errorSearching;
function receiveCategorySearch(_a) {
    var tagName = _a.tagName, json = _a.json;
    return tslib_1.__assign(tslib_1.__assign({ type: action_types_1.GifTypes.RECEIVE_CATEGORY_SEARCH, searchText: tagName }, json), { receiveAt: Date.now() });
}
exports.receiveCategorySearch = receiveCategorySearch;
function clearSearchResults() {
    return {
        type: action_types_1.GifTypes.CLEAR_SEARCH_RESULTS,
    };
}
exports.clearSearchResults = clearSearchResults;
function requestSearchById(gfyId) {
    return {
        type: action_types_1.GifTypes.SEARCH_BY_ID_REQUEST,
        payload: {
            gfyId: gfyId,
        },
    };
}
exports.requestSearchById = requestSearchById;
function receiveSearchById(gfyId, gfyItem) {
    return {
        type: action_types_1.GifTypes.SEARCH_BY_ID_SUCCESS,
        payload: {
            gfyId: gfyId,
            gfyItem: gfyItem,
        },
    };
}
exports.receiveSearchById = receiveSearchById;
function errorSearchById(err, gfyId) {
    return {
        type: action_types_1.GifTypes.SEARCH_BY_ID_FAILURE,
        err: err,
        gfyId: gfyId,
    };
}
exports.errorSearchById = errorSearchById;
function searchScrollPosition(scrollPosition) {
    return {
        type: action_types_1.GifTypes.SAVE_SEARCH_SCROLL_POSITION,
        scrollPosition: scrollPosition,
    };
}
exports.searchScrollPosition = searchScrollPosition;
function searchPriorLocation(priorLocation) {
    return {
        type: action_types_1.GifTypes.SAVE_SEARCH_PRIOR_LOCATION,
        priorLocation: priorLocation,
    };
}
exports.searchPriorLocation = searchPriorLocation;
function searchGfycat(_a) {
    var searchText = _a.searchText, _b = _a.count, count = _b === void 0 ? 30 : _b, _c = _a.startIndex, startIndex = _c === void 0 ? 0 : _c;
    var start = startIndex;
    return function (dispatch, getState) {
        var _a = getState().entities.general.config, GfycatApiKey = _a.GfycatApiKey, GfycatApiSecret = _a.GfycatApiSecret;
        var resultsByTerm = getState().entities.gifs.search.resultsByTerm;
        if (resultsByTerm[searchText]) {
            start = resultsByTerm[searchText].start + count;
        }
        dispatch(requestSearch(searchText));
        var sdk = gfycat_sdk_1.default(GfycatApiKey, GfycatApiSecret);
        sdk.authenticate();
        return sdk.search({ search_text: searchText, count: count, start: start }).then(function (json) {
            if (json.errorMessage) {
                // There was no results before
                if (resultsByTerm[searchText].items) {
                    dispatch(receiveSearchEnd(searchText));
                }
                else {
                    dispatch(errorSearching(json, searchText));
                }
            }
            else {
                dispatch(updateSearchText(searchText));
                dispatch(cacheGifsRequest(json.gfycats));
                dispatch(receiveSearch({ searchText: searchText, count: count, start: start, json: json }));
                var context = getState().entities.gifs.categories.tagsDict[searchText] ?
                    'category' :
                    'search';
                client_1.Client4.trackEvent('gfycat', 'views', { context: context, count: json.gfycats.length, keyword: searchText });
            }
        }).catch(function (err) { return dispatch(errorSearching(err, searchText)); });
    };
}
exports.searchGfycat = searchGfycat;
function searchCategory(_a) {
    var _this = this;
    var _b = _a.tagName, tagName = _b === void 0 ? '' : _b, _c = _a.gfyCount, gfyCount = _c === void 0 ? 30 : _c, _d = _a.cursorPos, cursorPos = _d === void 0 ? undefined : _d;
    var cursor = cursorPos;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, GfycatApiKey, GfycatApiSecret, resultsByTerm;
        return tslib_1.__generator(this, function (_b) {
            _a = getState().entities.general.config, GfycatApiKey = _a.GfycatApiKey, GfycatApiSecret = _a.GfycatApiSecret;
            resultsByTerm = getState().entities.gifs.search.resultsByTerm;
            if (resultsByTerm[tagName]) {
                cursor = resultsByTerm[tagName].cursor;
            }
            dispatch(requestSearch(tagName));
            return [2 /*return*/, gfycat_sdk_1.default(GfycatApiKey, GfycatApiSecret).getTrendingCategories({ tagName: tagName, gfyCount: gfyCount, cursor: cursor }).then(function (json) {
                    if (json.errorMessage) {
                        if (resultsByTerm[tagName].gfycats) {
                            dispatch(receiveSearchEnd(tagName));
                        }
                        else {
                            dispatch(errorSearching(json, tagName));
                        }
                    }
                    else {
                        dispatch(updateSearchText(tagName));
                        dispatch(cacheGifsRequest(json.gfycats));
                        dispatch(receiveCategorySearch({ tagName: tagName, json: json }));
                        client_1.Client4.trackEvent('gfycat', 'views', { context: 'category', count: json.gfycats.length, keyword: tagName });
                        // preload categories list
                        if (tagName === 'trending') {
                            dispatch(requestCategoriesListIfNeeded());
                        }
                    }
                }).catch(function (err) { return dispatch(errorSearching(err, tagName)); })];
        });
    }); };
}
exports.searchCategory = searchCategory;
function shouldSearch(state, searchText) {
    var resultsByTerm = state.entities.gifs.search.resultsByTerm[searchText];
    if (!resultsByTerm) {
        return true;
    }
    else if (resultsByTerm.isFetching) {
        return false;
    }
    else if (resultsByTerm.moreRemaining) {
        return true;
    }
    return resultsByTerm.didInvalidate;
}
exports.shouldSearch = shouldSearch;
function searchIfNeeded(searchText) {
    return function (dispatch, getState) {
        if (shouldSearch(getState(), searchText)) {
            if (searchText.toLowerCase() === 'trending') {
                return dispatch(searchCategory({ tagName: searchText }));
            }
            return dispatch(searchGfycat({ searchText: searchText }));
        }
        return Promise.resolve();
    };
}
exports.searchIfNeeded = searchIfNeeded;
function searchIfNeededInitial(searchText) {
    return function (dispatch, getState) {
        dispatch(updateSearchText(searchText));
        if (shouldSearchInitial(getState(), searchText)) {
            if (searchText.toLowerCase() === 'trending') {
                return dispatch(searchCategory({ tagName: searchText }));
            }
            return dispatch(searchGfycat({ searchText: searchText }));
        }
        return Promise.resolve();
    };
}
exports.searchIfNeededInitial = searchIfNeededInitial;
function shouldSearchInitial(state, searchText) {
    var resultsByTerm = state.entities.gifs.search.resultsByTerm[searchText];
    if (!resultsByTerm) {
        return true;
    }
    else if (resultsByTerm.isFetching) {
        return false;
    }
    return false;
}
exports.shouldSearchInitial = shouldSearchInitial;
function searchById(gfyId) {
    return function (dispatch, getState) {
        var _a = getState().entities.general.config, GfycatApiKey = _a.GfycatApiKey, GfycatApiSecret = _a.GfycatApiSecret;
        dispatch(requestSearchById(gfyId));
        return gfycat_sdk_1.default(GfycatApiKey, GfycatApiSecret).searchById({ id: gfyId }).then(function (response) {
            dispatch(receiveSearchById(gfyId, response.gfyItem));
            dispatch(cacheGifsRequest([response.gfyItem]));
        }).catch(function (err) { return dispatch(errorSearchById(err, gfyId)); });
    };
}
exports.searchById = searchById;
function shouldSearchById(state, gfyId) {
    return !state.entities.gifs.cache.gifs[gfyId]; //TODO investigate, used to be !state.cache.gifs[gfyId];
}
exports.shouldSearchById = shouldSearchById;
function searchByIdIfNeeded(gfyId) {
    return function (dispatch, getState) {
        if (shouldSearchById(getState(), gfyId)) {
            return dispatch(searchById(gfyId));
        }
        return Promise.resolve(getState().entities.gifs.cache.gifs[gfyId]); //TODO: investigate, used to be getState().cache.gifs[gfyId]
    };
}
exports.searchByIdIfNeeded = searchByIdIfNeeded;
function saveSearchScrollPosition(scrollPosition) {
    return function (dispatch) {
        dispatch(searchScrollPosition(scrollPosition));
    };
}
exports.saveSearchScrollPosition = saveSearchScrollPosition;
function saveSearchPriorLocation(priorLocation) {
    return function (dispatch) {
        dispatch(searchPriorLocation(priorLocation));
    };
}
exports.saveSearchPriorLocation = saveSearchPriorLocation;
function searchTextUpdate(searchText) {
    return function (dispatch) {
        dispatch(updateSearchText(searchText));
    };
}
exports.searchTextUpdate = searchTextUpdate;
function saveSearchBarText(searchBarText) {
    return function (dispatch) {
        dispatch(searchBarTextSave(searchBarText));
    };
}
exports.saveSearchBarText = saveSearchBarText;
// CATEGORIES
function categoriesListRequest() {
    return {
        type: action_types_1.GifTypes.REQUEST_CATEGORIES_LIST,
    };
}
exports.categoriesListRequest = categoriesListRequest;
function categoriesListReceived(json) {
    return tslib_1.__assign({ type: action_types_1.GifTypes.CATEGORIES_LIST_RECEIVED }, json);
}
exports.categoriesListReceived = categoriesListReceived;
function categoriesListFailure(err) {
    return {
        type: action_types_1.GifTypes.CATEGORIES_LIST_FAILURE,
        err: err,
    };
}
exports.categoriesListFailure = categoriesListFailure;
function requestCategoriesList(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.count, count = _c === void 0 ? 60 : _c;
    return function (dispatch, getState) {
        var _a = getState().entities.general.config, GfycatApiKey = _a.GfycatApiKey, GfycatApiSecret = _a.GfycatApiSecret;
        var state = getState().entities.gifs.categories;
        if (!shouldRequestCategoriesList(state)) {
            return Promise.resolve();
        }
        dispatch(categoriesListRequest());
        var cursor = state.cursor;
        var options = tslib_1.__assign(tslib_1.__assign({}, (count && { count: count })), (cursor && { cursor: cursor }));
        return gfycat_sdk_1.default(GfycatApiKey, GfycatApiSecret).getCategories(options).then(function (json) {
            var newGfycats = json.tags.reduce(function (gfycats, tag) {
                if (tag.gfycats[0] && tag.gfycats[0].width) {
                    return tslib_1.__spread(gfycats, tag.gfycats);
                }
                return gfycats;
            }, []);
            dispatch(cacheGifsRequest(newGfycats));
            dispatch(categoriesListReceived(json));
        }).catch(function (err) {
            dispatch(categoriesListFailure(err));
        });
    };
}
exports.requestCategoriesList = requestCategoriesList;
function requestCategoriesListIfNeeded(_a) {
    var _b = _a === void 0 ? { count: undefined } : _a, count = _b.count;
    return function (dispatch, getState) {
        var state = getState().entities.gifs.categories;
        if (state.tagsList && state.tagsList.length) {
            return Promise.resolve();
        }
        return dispatch(requestCategoriesList({ count: count }));
    };
}
exports.requestCategoriesListIfNeeded = requestCategoriesListIfNeeded;
function shouldRequestCategoriesList(state) {
    var hasMore = state.hasMore, isFetching = state.isFetching, tagsList = state.tagsList;
    if (!tagsList || !tagsList.length) {
        return true;
    }
    else if (isFetching) {
        return false;
    }
    else if (hasMore) {
        return true;
    }
    return false;
}
exports.shouldRequestCategoriesList = shouldRequestCategoriesList;
// CACHE
function cacheRequest() {
    return {
        type: action_types_1.GifTypes.CACHE_REQUEST,
        payload: {
            updating: true,
        },
    };
}
exports.cacheRequest = cacheRequest;
function cacheGifs(gifs) {
    return {
        type: action_types_1.GifTypes.CACHE_GIFS,
        gifs: gifs,
    };
}
exports.cacheGifs = cacheGifs;
function cacheGifsRequest(gifs) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch(cacheRequest());
            dispatch(cacheGifs(gifs));
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.cacheGifsRequest = cacheGifsRequest;
//# sourceMappingURL=gifs.js.map