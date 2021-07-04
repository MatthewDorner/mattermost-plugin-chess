"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDisplayableErrors = void 0;
function getDisplayableErrors(state) {
    return state.errors.filter(function (error) { return error.displayable; });
}
exports.getDisplayableErrors = getDisplayableErrors;
//# sourceMappingURL=errors.js.map