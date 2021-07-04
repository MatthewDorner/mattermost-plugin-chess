"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var constants_1 = require("../../constants");
function typing(state, action) {
    var _a, _b, _c;
    if (state === void 0) { state = {}; }
    var data = action.data, type = action.type;
    switch (type) {
        case constants_1.WebsocketEvents.TYPING: {
            var id = data.id, userId = data.userId, now = data.now;
            if (id && userId) {
                return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[id] = tslib_1.__assign(tslib_1.__assign({}, (state[id] || {})), (_b = {}, _b[userId] = now, _b)), _a));
            }
            return state;
        }
        case constants_1.WebsocketEvents.STOP_TYPING: {
            var id = data.id, userId = data.userId, now = data.now;
            if (state[id] && state[id][userId] <= now) {
                var nextState = tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[id] = tslib_1.__assign({}, state[id]), _c));
                Reflect.deleteProperty(nextState[id], userId);
                if (Object.keys(nextState[id]).length === 0) {
                    Reflect.deleteProperty(nextState, id);
                }
                return nextState;
            }
            return state;
        }
        default:
            return state;
    }
}
exports.default = typing;
//# sourceMappingURL=typing.js.map