"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNeededCustomEmojisFromText = exports.getEmojiImageUrl = exports.isCustomEmoji = exports.isSystemEmoji = void 0;
var client_1 = require("../client");
function isSystemEmoji(emoji) {
    return 'batch' in emoji;
}
exports.isSystemEmoji = isSystemEmoji;
function isCustomEmoji(emoji) {
    return 'id' in emoji;
}
exports.isCustomEmoji = isCustomEmoji;
function getEmojiImageUrl(emoji) {
    if (isCustomEmoji(emoji)) {
        return client_1.Client4.getEmojiRoute(emoji.id) + '/image';
    }
    var filename = emoji.filename || emoji.aliases[0];
    return client_1.Client4.getSystemEmojiImageUrl(filename);
}
exports.getEmojiImageUrl = getEmojiImageUrl;
function parseNeededCustomEmojisFromText(text, systemEmojis, customEmojisByName, nonExistentEmoji) {
    if (!text.includes(':')) {
        return new Set();
    }
    var pattern = /:([A-Za-z0-9_-]+):/gi;
    var customEmojis = new Set();
    var match;
    while ((match = pattern.exec(text)) !== null) {
        if (!match) {
            continue;
        }
        if (systemEmojis.has(match[1])) {
            // It's a system emoji, go the next match
            continue;
        }
        if (nonExistentEmoji.has(match[1])) {
            // We've previously confirmed this is not a custom emoji
            continue;
        }
        if (customEmojisByName.has(match[1])) {
            // We have the emoji, go to the next match
            continue;
        }
        customEmojis.add(match[1]);
    }
    return customEmojis;
}
exports.parseNeededCustomEmojisFromText = parseNeededCustomEmojisFromText;
//# sourceMappingURL=emoji_utils.js.map