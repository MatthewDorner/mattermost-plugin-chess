"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autocompleteCustomEmojis = exports.searchCustomEmojis = exports.deleteCustomEmoji = exports.getAllCustomEmojis = exports.loadProfilesForCustomEmojis = exports.getCustomEmojis = exports.getCustomEmojisInText = exports.getCustomEmojisByName = exports.getCustomEmojiByName = exports.getCustomEmoji = exports.createCustomEmoji = exports.setSystemEmojis = exports.systemEmojis = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var client_1 = require("../client");
var action_types_1 = require("../action_types");
var constants_1 = require("../constants");
var users_1 = require("./users");
var emojis_1 = require("../selectors/entities/emojis");
var emoji_utils_1 = require("../utils/emoji_utils");
var errors_1 = require("./errors");
var helpers_1 = require("./helpers");
exports.systemEmojis = new Map();
function setSystemEmojis(emojis) {
    exports.systemEmojis = emojis;
}
exports.setSystemEmojis = setSystemEmojis;
function createCustomEmoji(emoji, image) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createCustomEmoji,
        onSuccess: action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJI,
        params: [
            emoji,
            image,
        ],
    });
}
exports.createCustomEmoji = createCustomEmoji;
function getCustomEmoji(emojiId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getCustomEmoji,
        onSuccess: action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJI,
        params: [
            emojiId,
        ],
    });
}
exports.getCustomEmoji = getCustomEmoji;
function getCustomEmojiByName(name) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getCustomEmojiByName(name)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    if (error_1.status_code === 404) {
                        dispatch({ type: action_types_1.EmojiTypes.CUSTOM_EMOJI_DOES_NOT_EXIST, data: name });
                    }
                    else {
                        dispatch(errors_1.logError(error_1));
                    }
                    return [2 /*return*/, { error: error_1 }];
                case 3:
                    dispatch({
                        type: action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJI,
                        data: data,
                    });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getCustomEmojiByName = getCustomEmojiByName;
function getCustomEmojisByName(names) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var promises;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!names || names.length === 0) {
                        return [2 /*return*/, { data: true }];
                    }
                    promises = [];
                    names.forEach(function (name) { return promises.push(dispatch(getCustomEmojiByName(name))); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.getCustomEmojisByName = getCustomEmojisByName;
function getCustomEmojisInText(text) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, nonExistentEmoji, customEmojisByName, emojisToLoad;
        return tslib_1.__generator(this, function (_a) {
            if (!text) {
                return [2 /*return*/, { data: true }];
            }
            state = getState();
            nonExistentEmoji = state.entities.emojis.nonExistentEmoji;
            customEmojisByName = emojis_1.getCustomEmojisByName(state);
            emojisToLoad = emoji_utils_1.parseNeededCustomEmojisFromText(text, exports.systemEmojis, customEmojisByName, nonExistentEmoji);
            return [2 /*return*/, getCustomEmojisByName(Array.from(emojisToLoad))(dispatch, getState)];
        });
    }); };
}
exports.getCustomEmojisInText = getCustomEmojisInText;
function getCustomEmojis(page, perPage, sort, loadUsers) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    if (sort === void 0) { sort = constants_1.Emoji.SORT_BY_NAME; }
    if (loadUsers === void 0) { loadUsers = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getCustomEmojis(page, perPage, sort)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(errors_1.logError(error_2));
                    return [2 /*return*/, { error: error_2 }];
                case 3:
                    if (loadUsers) {
                        dispatch(loadProfilesForCustomEmojis(data));
                    }
                    dispatch({
                        type: action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJIS,
                        data: data,
                    });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getCustomEmojis = getCustomEmojis;
function loadProfilesForCustomEmojis(emojis) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var usersToLoad, userIds;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usersToLoad = {};
                    emojis.forEach(function (emoji) {
                        if (!getState().entities.users.profiles[emoji.creator_id]) {
                            usersToLoad[emoji.creator_id] = true;
                        }
                    });
                    userIds = Object.keys(usersToLoad);
                    if (!(userIds.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, dispatch(users_1.getProfilesByIds(userIds))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.loadProfilesForCustomEmojis = loadProfilesForCustomEmojis;
function getAllCustomEmojis(perPage) {
    var _this = this;
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_MAXIMUM; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var hasMore, page, allEmojis, emojis, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({
                        type: action_types_1.EmojiTypes.CLEAR_CUSTOM_EMOJIS,
                        data: null,
                    });
                    hasMore = true;
                    page = 0;
                    allEmojis = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    emojis = [];
                    return [4 /*yield*/, client_1.Client4.getCustomEmojis(page, perPage, constants_1.Emoji.SORT_BY_NAME)];
                case 2:
                    emojis = _a.sent(); // eslint-disable-line no-await-in-loop
                    if (emojis.length < perPage) {
                        hasMore = false;
                    }
                    else {
                        page += 1;
                    }
                    allEmojis.push.apply(allEmojis, tslib_1.__spread(emojis));
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(errors_1.logError(error_3));
                    return [2 /*return*/, { error: true }];
                case 4:
                    if (hasMore) return [3 /*break*/, 1];
                    _a.label = 5;
                case 5:
                    dispatch({
                        type: action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJIS,
                        data: allEmojis,
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.getAllCustomEmojis = getAllCustomEmojis;
function deleteCustomEmoji(emojiId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.deleteCustomEmoji(emojiId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch(errors_1.logError(error_4));
                    return [2 /*return*/, { error: error_4 }];
                case 3:
                    dispatch({
                        type: action_types_1.EmojiTypes.DELETED_CUSTOM_EMOJI,
                        data: { id: emojiId },
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.deleteCustomEmoji = deleteCustomEmoji;
function searchCustomEmojis(term, options, loadUsers) {
    var _this = this;
    if (options === void 0) { options = {}; }
    if (loadUsers === void 0) { loadUsers = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.searchCustomEmoji(term, options)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(errors_1.logError(error_5));
                    return [2 /*return*/, { error: error_5 }];
                case 3:
                    if (loadUsers) {
                        dispatch(loadProfilesForCustomEmojis(data));
                    }
                    dispatch({
                        type: action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJIS,
                        data: data,
                    });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.searchCustomEmojis = searchCustomEmojis;
function autocompleteCustomEmojis(name) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.autocompleteCustomEmoji(name)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_6, dispatch, getState);
                    dispatch(errors_1.logError(error_6));
                    return [2 /*return*/, { error: error_6 }];
                case 3:
                    dispatch({
                        type: action_types_1.EmojiTypes.RECEIVED_CUSTOM_EMOJIS,
                        data: data,
                    });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.autocompleteCustomEmojis = autocompleteCustomEmojis;
//# sourceMappingURL=emojis.js.map