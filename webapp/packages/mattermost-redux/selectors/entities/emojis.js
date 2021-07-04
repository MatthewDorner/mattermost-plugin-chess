"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomEmojiIdsSortedByName = exports.getCustomEmojisByName = exports.getCustomEmojisAsMap = exports.getCustomEmojis = void 0;
var reselect_1 = require("reselect");
var general_1 = require("./general");
var helpers_1 = require("../../utils/helpers");
exports.getCustomEmojis = reselect_1.createSelector(general_1.getConfig, function (state) { return state.entities.emojis.customEmoji; }, function (config, customEmoji) {
    if (config.EnableCustomEmoji !== 'true') {
        return {};
    }
    return customEmoji;
});
exports.getCustomEmojisAsMap = reselect_1.createSelector(exports.getCustomEmojis, function (emojis) {
    var map = new Map();
    Object.keys(emojis).forEach(function (key) {
        map.set(key, emojis[key]);
    });
    return map;
});
exports.getCustomEmojisByName = reselect_1.createSelector(exports.getCustomEmojis, function (emojis) {
    var map = new Map();
    Object.keys(emojis).forEach(function (key) {
        map.set(emojis[key].name, emojis[key]);
    });
    return map;
});
exports.getCustomEmojiIdsSortedByName = helpers_1.createIdsSelector(exports.getCustomEmojis, function (emojis) {
    return Object.keys(emojis).sort(function (a, b) { return emojis[a].name.localeCompare(emojis[b].name); });
});
//# sourceMappingURL=emojis.js.map