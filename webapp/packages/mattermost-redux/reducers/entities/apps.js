"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindings = void 0;
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var apps_1 = require("../../utils/apps");
// This file's contents belong to the Apps Framework feature.
// Apps Framework feature is experimental, and the contents of this file are
// susceptible to breaking changes without pushing the major version of this package.
function bindings(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.AppsTypes.RECEIVED_APP_BINDINGS: {
            apps_1.validateBindings(action.data);
            return action.data || [];
        }
        default:
            return state;
    }
}
exports.bindings = bindings;
exports.default = redux_1.combineReducers({
    bindings: bindings,
});
//# sourceMappingURL=apps.js.map