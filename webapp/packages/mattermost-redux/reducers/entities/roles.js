"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function pending(state, action) {
    if (state === void 0) { state = new Set(); }
    switch (action.type) {
        case action_types_1.RoleTypes.SET_PENDING_ROLES:
            return action.data;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return new Set();
        default:
            return state;
    }
}
function roles(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.RoleTypes.RECEIVED_ROLES: {
            if (action.data) {
                var nextState = tslib_1.__assign({}, state);
                try {
                    for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var role = _c.value;
                        nextState[role.name] = role;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return nextState;
            }
            return state;
        }
        case action_types_1.RoleTypes.ROLE_DELETED: {
            if (action.data) {
                var nextState = tslib_1.__assign({}, state);
                Reflect.deleteProperty(nextState, action.data.name);
                return nextState;
            }
            return state;
        }
        case action_types_1.RoleTypes.RECEIVED_ROLE: {
            if (action.data) {
                var nextState = tslib_1.__assign({}, state);
                nextState[action.data.name] = action.data;
                return nextState;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // object where the key is the category-name and has the corresponding value
    roles: roles,
    pending: pending,
});
//# sourceMappingURL=roles.js.map