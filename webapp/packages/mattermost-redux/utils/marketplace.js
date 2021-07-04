"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getName = exports.isPlugin = void 0;
// This file's contents belong to the Apps Framework feature.
// Apps Framework feature is experimental, and the contents of this file are
// susceptible to breaking changes without pushing the major version of this package.
function isPlugin(item) {
    return item.manifest.id !== undefined;
}
exports.isPlugin = isPlugin;
function getName(item) {
    if (isPlugin(item)) {
        return item.manifest.name;
    }
    return item.manifest.display_name;
}
exports.getName = getName;
//# sourceMappingURL=marketplace.js.map