"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelFavorite = exports.getPreferencesByCategory = exports.getPreferenceKey = void 0;
var constants_1 = require("../constants");
function getPreferenceKey(category, name) {
    return category + "--" + name;
}
exports.getPreferenceKey = getPreferenceKey;
function getPreferencesByCategory(myPreferences, category) {
    var prefix = category + "--";
    var preferences = new Map();
    Object.keys(myPreferences).forEach(function (key) {
        if (key.startsWith(prefix)) {
            preferences.set(key.substring(prefix.length), myPreferences[key]);
        }
    });
    return preferences;
}
exports.getPreferencesByCategory = getPreferencesByCategory;
function isChannelFavorite(myPreferences, channelId) {
    var preference = myPreferences[getPreferenceKey(constants_1.Preferences.CATEGORY_FAVORITE_CHANNEL, channelId)];
    return Boolean(preference && preference.value !== 'false');
}
exports.isChannelFavorite = isChannelFavorite;
//# sourceMappingURL=preference_utils.js.map