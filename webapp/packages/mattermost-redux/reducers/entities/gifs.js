"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var SEARCH_SELECTORS = (_a = {},
    _a[action_types_1.GifTypes.SELECT_SEARCH_TEXT] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { searchText: action.searchText })); },
    _a[action_types_1.GifTypes.INVALIDATE_SEARCH_TEXT] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { resultsByTerm: tslib_1.__assign(tslib_1.__assign({}, state.resultsByTerm[action.searchText]), { didInvalidate: true }) })); },
    _a[action_types_1.GifTypes.REQUEST_SEARCH] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { resultsByTerm: TERM_SELECTOR[action.type](state.resultsByTerm, action) })); },
    _a[action_types_1.GifTypes.RECEIVE_SEARCH] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { searchText: action.searchText, resultsByTerm: TERM_SELECTOR[action.type](state.resultsByTerm, action) })); },
    _a[action_types_1.GifTypes.RECEIVE_SEARCH_END] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { searchText: action.searchText, resultsByTerm: TERM_SELECTOR[action.type](state.resultsByTerm, action) })); },
    _a[action_types_1.GifTypes.RECEIVE_CATEGORY_SEARCH] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { searchText: action.searchText, resultsByTerm: TERM_SELECTOR[action.type](state.resultsByTerm, action) })); },
    _a[action_types_1.GifTypes.SEARCH_FAILURE] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { searchText: action.searchText, resultsByTerm: TERM_SELECTOR[action.type](state.resultsByTerm, action) })); },
    _a[action_types_1.GifTypes.CLEAR_SEARCH_RESULTS] = function (state) { return (tslib_1.__assign(tslib_1.__assign({}, state), { searchText: '', resultsByTerm: {} })); },
    _a[action_types_1.GifTypes.SAVE_SEARCH_SCROLL_POSITION] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { scrollPosition: action.scrollPosition })); },
    _a[action_types_1.GifTypes.SAVE_SEARCH_PRIOR_LOCATION] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { priorLocation: action.priorLocation })); },
    _a[action_types_1.GifTypes.UPDATE_SEARCH_TEXT] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { searchText: action.searchText })); },
    _a[action_types_1.GifTypes.SAVE_SEARCH_BAR_TEXT] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { searchBarText: action.searchBarText })); },
    _a);
var CATEGORIES_SELECTORS = (_b = {},
    _b[action_types_1.GifTypes.REQUEST_CATEGORIES_LIST] = function (state) { return (tslib_1.__assign(tslib_1.__assign({}, state), { isFetching: true })); },
    _b[action_types_1.GifTypes.CATEGORIES_LIST_RECEIVED] = function (state, action) {
        var cursor = action.cursor, tags = action.tags;
        var _a = state.tagsList, oldTagsList = _a === void 0 ? [] : _a;
        var tagsDict = {};
        var newTagsList = tags.filter(function (item) {
            return Boolean(item && item.gfycats[0] && item.gfycats[0].width);
        }).map(function (item) {
            tagsDict[item.tag] = true;
            return {
                tagName: item.tag,
                gfyId: item.gfycats[0].gfyId,
            };
        });
        var tagsList = tslib_1.__spread(oldTagsList, newTagsList);
        return tslib_1.__assign(tslib_1.__assign({}, state), { cursor: cursor, hasMore: Boolean(cursor), isFetching: false, tagsList: tagsList,
            tagsDict: tagsDict });
    },
    _b[action_types_1.GifTypes.CATEGORIES_LIST_FAILURE] = function (state) { return (tslib_1.__assign(tslib_1.__assign({}, state), { isFetching: false })); },
    _b);
var TERM_SELECTOR = (_c = {},
    _c[action_types_1.GifTypes.REQUEST_SEARCH] = function (state, action) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.searchText] = tslib_1.__assign(tslib_1.__assign({}, state[action.searchText]), { isFetching: true, didInvalidate: false, pages: PAGE_SELECTOR[action.type](state[action.searchText], action) }), _a)));
    },
    _c[action_types_1.GifTypes.RECEIVE_SEARCH] = function (state, action) {
        var _a;
        var gfycats = action.gfycats.filter(function (item) {
            return Boolean(item.gfyId && item.width && item.height);
        });
        var newItems = gfycats.map(function (gfycat) { return gfycat.gfyId; });
        return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.searchText] = tslib_1.__assign(tslib_1.__assign({}, state[action.searchText]), { isFetching: false, items: typeof state[action.searchText] !== 'undefined' &&
                state[action.searchText].items ? tslib_1.__spread(state[action.searchText].items, newItems) :
                newItems, moreRemaining: typeof state[action.searchText] !== 'undefined' &&
                state[action.searchText].items ?
                tslib_1.__spread(state[action.searchText].items, action.gfycats).length < action.found :
                action.gfycats.length < action.found, count: action.count, found: action.found, start: action.start, currentPage: action.currentPage, pages: PAGE_SELECTOR[action.type](state[action.searchText], action), cursor: action.cursor }), _a));
    },
    _c[action_types_1.GifTypes.RECEIVE_CATEGORY_SEARCH] = function (state, action) {
        var _a;
        var gfycats = action.gfycats.filter(function (item) {
            return Boolean(item.gfyId && item.width && item.height);
        });
        var newItems = gfycats.map(function (gfycat) { return gfycat.gfyId; });
        return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.searchText] = tslib_1.__assign(tslib_1.__assign({}, state[action.searchText]), { isFetching: false, items: typeof state[action.searchText] !== 'undefined' &&
                state[action.searchText].items ? tslib_1.__spread(state[action.searchText].items, newItems) :
                newItems, cursor: action.cursor, moreRemaining: Boolean(action.cursor) }), _a));
    },
    _c[action_types_1.GifTypes.RECEIVE_SEARCH_END] = function (state, action) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.searchText] = tslib_1.__assign(tslib_1.__assign({}, state[action.searchText]), { isFetching: false, moreRemaining: false }), _a)));
    },
    _c[action_types_1.GifTypes.SEARCH_FAILURE] = function (state, action) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.searchText] = tslib_1.__assign(tslib_1.__assign({}, state[action.searchText]), { isFetching: false, items: [], moreRemaining: false, count: 0, found: 0, start: 0, isEmpty: true }), _a)));
    },
    _c);
var PAGE_SELECTOR = (_d = {},
    _d[action_types_1.GifTypes.REQUEST_SEARCH] = function (state) {
        if (state === void 0) { state = {}; }
        if (typeof state.pages == 'undefined') {
            return {};
        }
        return tslib_1.__assign({}, state.pages);
    },
    _d[action_types_1.GifTypes.RECEIVE_SEARCH] = function (state, action) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, state.pages), (_a = {}, _a[action.currentPage] = action.gfycats.map(function (gfycat) { return gfycat.gfyId; }), _a)));
    },
    _d);
var CACHE_SELECTORS = (_e = {},
    _e[action_types_1.GifTypes.CACHE_GIFS] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), { gifs: CACHE_GIF_SELECTOR[action.type](state.gifs, action), updating: false })); },
    _e[action_types_1.GifTypes.CACHE_REQUEST] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), action.payload)); },
    _e);
var CACHE_GIF_SELECTOR = (_f = {},
    _f[action_types_1.GifTypes.CACHE_GIFS] = function (state, action) { return (tslib_1.__assign(tslib_1.__assign({}, state), action.gifs.reduce(function (map, obj) {
        map[obj.gfyId] = obj;
        return map;
    }, {}))); },
    _f);
function appReducer(state, action) {
    if (state === void 0) { state = {}; }
    var nextState = tslib_1.__assign({}, state);
    switch (action.type) {
        case action_types_1.GifTypes.SAVE_APP_PROPS:
            return tslib_1.__assign(tslib_1.__assign({}, nextState), action.props);
        default:
            return state;
    }
}
function categoriesReducer(state, action) {
    if (state === void 0) { state = {}; }
    var selector = CATEGORIES_SELECTORS[action.type];
    return selector ? selector(state, action) : state;
}
function searchReducer(state, action) {
    if (state === void 0) { state = {}; }
    var selector = SEARCH_SELECTORS[action.type];
    return selector ? selector(state, action) : state;
}
function cacheReducer(state, action) {
    if (state === void 0) { state = {}; }
    var selector = CACHE_SELECTORS[action.type];
    return selector ? selector(state, action) : state;
}
exports.default = redux_1.combineReducers({
    app: appReducer,
    categories: categoriesReducer,
    search: searchReducer,
    cache: cacheReducer,
});
//# sourceMappingURL=gifs.js.map