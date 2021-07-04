"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserLocale = void 0;
var constants_1 = require("../../constants");
var common_1 = require("./common");
function getCurrentUserLocale(state, defaultLocale) {
    if (defaultLocale === void 0) { defaultLocale = constants_1.General.DEFAULT_LOCALE; }
    var currentUser = common_1.getCurrentUser(state);
    if (!currentUser) {
        return defaultLocale;
    }
    return currentUser.locale || defaultLocale;
}
exports.getCurrentUserLocale = getCurrentUserLocale;
//# sourceMappingURL=i18n.js.map