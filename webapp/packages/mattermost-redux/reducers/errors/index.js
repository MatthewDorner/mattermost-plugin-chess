"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var action_types_1 = require("../../action_types");
exports.default = (function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.ErrorTypes.DISMISS_ERROR: {
            var nextState = tslib_1.__spread(state);
            nextState.splice(action.index, 1);
            return nextState;
        }
        case action_types_1.ErrorTypes.LOG_ERROR: {
            var nextState = tslib_1.__spread(state);
            var displayable = action.displayable, error = action.error;
            nextState.push({
                displayable: displayable,
                error: error,
                date: new Date(Date.now()).toUTCString(),
            });
            return nextState;
        }
        case action_types_1.ErrorTypes.RESTORE_ERRORS:
            return action.data;
        case action_types_1.ErrorTypes.CLEAR_ERRORS: {
            return [];
        }
        default:
            return state;
    }
});
//# sourceMappingURL=index.js.map