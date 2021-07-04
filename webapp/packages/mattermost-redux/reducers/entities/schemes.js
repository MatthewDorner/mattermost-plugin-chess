"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function schemes(state, action) {
    var _a, e_1, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.SchemeTypes.CREATED_SCHEME:
        case action_types_1.SchemeTypes.PATCHED_SCHEME:
        case action_types_1.SchemeTypes.RECEIVED_SCHEME: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.id] = action.data, _a));
        }
        case action_types_1.SchemeTypes.RECEIVED_SCHEMES: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _c = tslib_1.__values(action.data), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var scheme = _d.value;
                    nextState[scheme.id] = scheme;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        case action_types_1.SchemeTypes.DELETED_SCHEME: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data.schemeId);
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    schemes: schemes,
});
//# sourceMappingURL=schemes.js.map