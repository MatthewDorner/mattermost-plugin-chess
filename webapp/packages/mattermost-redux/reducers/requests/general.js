"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function websocket(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    if (action.type === action_types_1.GeneralTypes.WEBSOCKET_CLOSED) {
        return helpers_1.initialRequestState();
    }
    return helpers_1.handleRequest(action_types_1.GeneralTypes.WEBSOCKET_REQUEST, action_types_1.GeneralTypes.WEBSOCKET_SUCCESS, action_types_1.GeneralTypes.WEBSOCKET_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    websocket: websocket,
});
//# sourceMappingURL=general.js.map