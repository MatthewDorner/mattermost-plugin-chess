"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.localizeMessage = exports.setLocalizeFunction = void 0;
var localizeFunction;
function setLocalizeFunction(func) {
    localizeFunction = func;
}
exports.setLocalizeFunction = setLocalizeFunction;
function localizeMessage(id, defaultMessage) {
    if (!localizeFunction) {
        return defaultMessage;
    }
    return localizeFunction(id, defaultMessage);
}
exports.localizeMessage = localizeMessage;
//# sourceMappingURL=i18n_utils.js.map