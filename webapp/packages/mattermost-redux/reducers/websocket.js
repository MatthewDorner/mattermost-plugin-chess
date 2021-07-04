"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_types_1 = require("../action_types");
function getInitialState() {
    return {
        connected: false,
        lastConnectAt: 0,
        lastDisconnectAt: 0,
    };
}
function reducer(state, action) {
    if (state === void 0) { state = getInitialState(); }
    if (!state.connected && action.type === action_types_1.GeneralTypes.WEBSOCKET_SUCCESS) {
        return tslib_1.__assign(tslib_1.__assign({}, state), { connected: true, lastConnectAt: action.timestamp });
    }
    else if (state.connected && (action.type === action_types_1.GeneralTypes.WEBSOCKET_FAILURE || action.type === action_types_1.GeneralTypes.WEBSOCKET_CLOSED)) {
        return tslib_1.__assign(tslib_1.__assign({}, state), { connected: false, lastDisconnectAt: action.timestamp });
    }
    if (action.type === action_types_1.UserTypes.LOGOUT_SUCCESS) {
        return getInitialState();
    }
    return state;
}
exports.default = reducer;
//# sourceMappingURL=websocket.js.map