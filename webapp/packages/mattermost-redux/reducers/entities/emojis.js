"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customEmoji = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function customEmoji(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJI: {
            var nextState = tslib_1.__assign({}, state);
            nextState[action.data.id] = action.data;
            return nextState;
        }
        case action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJIS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var emoji = _c.value;
                    nextState[emoji.id] = emoji;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        case action_types_1.EmojiTypes.DELETED_CUSTOM_EMOJI: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data.id);
            return nextState;
        }
        case action_types_1.EmojiTypes.CLEAR_CUSTOM_EMOJIS:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        case action_types_1.PostTypes.RECEIVED_NEW_POST:
        case action_types_1.PostTypes.RECEIVED_POST: {
            var post = action.data;
            return storeEmojisForPost(state, post);
        }
        case action_types_1.PostTypes.RECEIVED_POSTS: {
            var posts = Object.values(action.data.posts);
            return posts.reduce(storeEmojisForPost, state); // Cast to any to avoid typing problems caused by Object.values
        }
        default:
            return state;
    }
}
exports.customEmoji = customEmoji;
function storeEmojisForPost(state, post) {
    if (!post.metadata || !post.metadata.emojis) {
        return state;
    }
    return post.metadata.emojis.reduce(function (nextState, emoji) {
        var _a;
        if (nextState[emoji.id]) {
            // Emoji is already in the store
            return nextState;
        }
        return tslib_1.__assign(tslib_1.__assign({}, nextState), (_a = {}, _a[emoji.id] = emoji, _a));
    }, state);
}
function nonExistentEmoji(state, action) {
    var e_2, _a;
    if (state === void 0) { state = new Set(); }
    switch (action.type) {
        case action_types_1.EmojiTypes.CUSTOM_EMOJI_DOES_NOT_EXIST: {
            if (!state.has(action.data)) {
                var nextState = new Set(state);
                nextState.add(action.data);
                return nextState;
            }
            return state;
        }
        case action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJI: {
            if (action.data && state.has(action.data.name)) {
                var nextState = new Set(state);
                nextState.delete(action.data.name);
                return nextState;
            }
            return state;
        }
        case action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJIS: {
            var data = action.data || [];
            var nextState = new Set(state);
            var changed = false;
            try {
                for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                    var emoji = data_1_1.value;
                    if (emoji && nextState.has(emoji.name)) {
                        nextState.delete(emoji.name);
                        changed = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return changed ? nextState : state;
        }
        case action_types_1.EmojiTypes.CLEAR_CUSTOM_EMOJIS:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return new Set();
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // object where every key is the custom emoji id and has an object with the custom emoji details
    customEmoji: customEmoji,
    // set containing custom emoji names that do not exist
    nonExistentEmoji: nonExistentEmoji,
});
//# sourceMappingURL=emojis.js.map