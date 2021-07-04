"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var constants_1 = require("../../constants");
function results(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.SearchTypes.RECEIVED_SEARCH_POSTS: {
            if (action.isGettingMore) {
                return tslib_1.__spread(new Set(state.concat(action.data.order)));
            }
            return action.data.order;
        }
        case action_types_1.PostTypes.POST_REMOVED: {
            var postId = action.data ? action.data.id : null;
            var index = state.indexOf(postId);
            if (index !== -1) {
                var newState = tslib_1.__spread(state);
                newState.splice(index, 1);
                return newState;
            }
            return state;
        }
        case action_types_1.SearchTypes.REMOVE_SEARCH_POSTS:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function fileResults(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.SearchTypes.RECEIVED_SEARCH_FILES: {
            if (action.isGettingMore) {
                return tslib_1.__spread(new Set(state.concat(action.data.order)));
            }
            return action.data.order;
        }
        case action_types_1.SearchTypes.REMOVE_SEARCH_FILES:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function matches(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.SearchTypes.RECEIVED_SEARCH_POSTS:
            if (action.isGettingMore) {
                return Object.assign({}, state, action.data.matches);
            }
            return action.data.matches || {};
        case action_types_1.PostTypes.POST_REMOVED: {
            if (!state[action.data.id]) {
                return state;
            }
            var newState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(newState, action.data.id);
            return newState;
        }
        case action_types_1.SearchTypes.REMOVE_SEARCH_POSTS:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function flagged(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.SearchTypes.RECEIVED_SEARCH_FLAGGED_POSTS: {
            return action.data.order;
        }
        case action_types_1.PostTypes.POST_REMOVED: {
            var postId = action.data ? action.data.id : null;
            var index = state.indexOf(postId);
            if (index !== -1) {
                var newState = tslib_1.__spread(state);
                newState.splice(index, 1);
                return newState;
            }
            return state;
        }
        case action_types_1.PreferenceTypes.RECEIVED_PREFERENCES: {
            if (action.data) {
                var nextState_1 = tslib_1.__spread(state);
                var hasNewFlaggedPosts_1 = false;
                action.data.forEach(function (pref) {
                    if (pref.category === constants_1.Preferences.CATEGORY_FLAGGED_POST) {
                        var exists = nextState_1.find(function (p) { return p === pref.name; });
                        if (!exists) {
                            hasNewFlaggedPosts_1 = true;
                            nextState_1.unshift(pref.name);
                        }
                    }
                });
                return hasNewFlaggedPosts_1 ? nextState_1 : state;
            }
            return state;
        }
        case action_types_1.PreferenceTypes.DELETED_PREFERENCES: {
            if (action.data) {
                var nextState_2 = tslib_1.__spread(state);
                var flaggedPostsRemoved_1 = false;
                action.data.forEach(function (pref) {
                    if (pref.category === constants_1.Preferences.CATEGORY_FLAGGED_POST) {
                        var index = state.indexOf(pref.name);
                        if (index !== -1) {
                            flaggedPostsRemoved_1 = true;
                            nextState_2.splice(index, 1);
                        }
                    }
                });
                return flaggedPostsRemoved_1 ? nextState_2 : state;
            }
            return state;
        }
        case action_types_1.SearchTypes.REMOVE_SEARCH_POSTS:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function removePinnedPost(state, post) {
    var _a;
    if (post && state[post.channel_id]) {
        var postId = post.id;
        var channelId = post.channel_id;
        var pinnedPosts = tslib_1.__spread(state[channelId]);
        var index = pinnedPosts.indexOf(postId);
        if (index !== -1) {
            pinnedPosts.splice(index, 1);
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[channelId] = pinnedPosts, _a));
        }
    }
    return state;
}
function pinned(state, action) {
    var _a, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.SearchTypes.RECEIVED_SEARCH_PINNED_POSTS: {
            var _c = action.data, channelId = _c.channelId, posts = _c.pinned;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[channelId] = posts.order.reverse(), _a));
        }
        case action_types_1.PostTypes.POST_DELETED:
        case action_types_1.PostTypes.POST_REMOVED: {
            return removePinnedPost(state, action.data);
        }
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            if (post && post.is_pinned) {
                var channelId = post.channel_id;
                var pinnedPosts = [];
                if (state[channelId]) {
                    pinnedPosts = tslib_1.__spread(state[channelId]);
                }
                if (!pinnedPosts.includes(post.id)) {
                    pinnedPosts.unshift(post.id);
                }
                return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[channelId] = pinnedPosts, _b));
            }
            return removePinnedPost(state, action.data);
        }
        case action_types_1.SearchTypes.REMOVE_SEARCH_PINNED_POSTS: {
            var channelId = action.data.channelId;
            var nextState = tslib_1.__assign({}, state);
            if (nextState[channelId]) {
                Reflect.deleteProperty(nextState, channelId);
                return nextState;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function recent(state, action) {
    var _a, _b;
    if (state === void 0) { state = {}; }
    var data = action.data, type = action.type;
    switch (type) {
        case action_types_1.SearchTypes.RECEIVED_SEARCH_TERM: {
            var nextState = tslib_1.__assign({}, state);
            var teamId = data.teamId, params = data.params;
            var _c = params || {}, terms_1 = _c.terms, isOrSearch = _c.isOrSearch;
            var team = tslib_1.__spread((nextState[teamId] || []));
            var index = team.findIndex(function (r) { return r.terms === terms_1; });
            if (index === -1) {
                team.push({ terms: terms_1, isOrSearch: isOrSearch });
            }
            else {
                team[index] = { terms: terms_1, isOrSearch: isOrSearch };
            }
            return tslib_1.__assign(tslib_1.__assign({}, nextState), (_a = {}, _a[teamId] = team, _a));
        }
        case action_types_1.SearchTypes.REMOVE_SEARCH_TERM: {
            var nextState = tslib_1.__assign({}, state);
            var teamId = data.teamId, terms_2 = data.terms;
            var team = tslib_1.__spread((nextState[teamId] || []));
            var index = team.findIndex(function (r) { return r.terms === terms_2; });
            if (index !== -1) {
                team.splice(index, 1);
                return tslib_1.__assign(tslib_1.__assign({}, nextState), (_b = {}, _b[teamId] = team, _b));
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function current(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    var data = action.data, type = action.type;
    switch (type) {
        case action_types_1.SearchTypes.RECEIVED_SEARCH_TERM: {
            var nextState = tslib_1.__assign({}, state);
            var teamId = data.teamId, params = data.params, isEnd = data.isEnd, isFilesEnd = data.isFilesEnd;
            return tslib_1.__assign(tslib_1.__assign({}, nextState), (_a = {}, _a[teamId] = {
                params: params,
                isEnd: typeof isEnd === 'undefined' && state[teamId] ? state[teamId].isEnd : isEnd,
                isFilesEnd: typeof isFilesEnd === 'undefined' && state[teamId] ? state[teamId].isFilesEnd : isFilesEnd,
            }, _a));
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function isSearchingTerm(state, action) {
    if (state === void 0) { state = false; }
    switch (action.type) {
        case action_types_1.SearchTypes.SEARCH_POSTS_REQUEST:
            return !action.isGettingMore;
        case action_types_1.SearchTypes.SEARCH_POSTS_SUCCESS:
            return false;
        default:
            return state;
    }
}
function isSearchGettingMore(state, action) {
    if (state === void 0) { state = false; }
    switch (action.type) {
        case action_types_1.SearchTypes.SEARCH_POSTS_REQUEST:
            return action.isGettingMore;
        case action_types_1.SearchTypes.SEARCH_POSTS_SUCCESS:
            return false;
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // An ordered array with posts ids of flagged posts
    flagged: flagged,
    // An Object where every key is a channel id mapping to an ordered array with posts ids of pinned posts
    pinned: pinned,
    // An ordered array with posts ids from the search results
    results: results,
    // An ordered array with files ids from the search results
    fileResults: fileResults,
    // Object where every key is a post id mapping to an array of matched words in that post
    matches: matches,
    // Object where every key is a team composed with
    // an object where the key is the term and the value indicates is "or" search
    recent: recent,
    // Object holding the current searches for every team
    current: current,
    // Boolean true if we are are searching initally
    isSearchingTerm: isSearchingTerm,
    // Boolean true if we are getting more search results
    isSearchGettingMore: isSearchGettingMore,
});
//# sourceMappingURL=search.js.map