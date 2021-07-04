"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReducer = void 0;
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var constants_1 = require("../constants");
var actions_1 = require("../types/actions");
var reducer_registry_1 = tslib_1.__importDefault(require("./reducer_registry"));
function createReducer(baseState) {
    var reducers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        reducers[_i - 1] = arguments[_i];
    }
    reducer_registry_1.default.setReducers(Object.assign.apply(Object, tslib_1.__spread([{}], reducers)));
    var baseReducer = redux_1.combineReducers(reducer_registry_1.default.getReducers());
    // Root reducer wrapper that listens for reset events.
    // Returns whatever is passed for the data property
    // as the new state.
    function offlineReducer(state, action) {
        if (state === void 0) { state = {}; }
        if ('type' in action && 'data' in action && action.type === constants_1.General.OFFLINE_STORE_RESET) {
            return baseReducer(action.data || baseState, action);
        }
        return baseReducer(state, action);
    }
    return actions_1.enableBatching(offlineReducer);
}
exports.createReducer = createReducer;
//# sourceMappingURL=helpers.js.map