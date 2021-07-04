"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function getKey(preference) {
    return preference.category + "--" + preference.name;
}
function setAllPreferences(preferences) {
    var e_1, _a;
    var nextState = {};
    if (preferences) {
        try {
            for (var preferences_1 = tslib_1.__values(preferences), preferences_1_1 = preferences_1.next(); !preferences_1_1.done; preferences_1_1 = preferences_1.next()) {
                var preference = preferences_1_1.value;
                nextState[getKey(preference)] = preference;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (preferences_1_1 && !preferences_1_1.done && (_a = preferences_1.return)) _a.call(preferences_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return nextState;
}
function myPreferences(state, action) {
    var e_2, _a, e_3, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.PreferenceTypes.RECEIVED_ALL_PREFERENCES:
            return setAllPreferences(action.data);
        case action_types_1.UserTypes.LOGIN: // Used by the mobile app
            return setAllPreferences(action.data.preferences);
        case action_types_1.PreferenceTypes.RECEIVED_PREFERENCES: {
            var nextState = tslib_1.__assign({}, state);
            if (action.data) {
                try {
                    for (var _c = tslib_1.__values(action.data), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var preference = _d.value;
                        nextState[getKey(preference)] = preference;
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            return nextState;
        }
        case action_types_1.PreferenceTypes.DELETED_PREFERENCES: {
            var nextState = tslib_1.__assign({}, state);
            if (action.data) {
                try {
                    for (var _e = tslib_1.__values(action.data), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var preference = _f.value;
                        Reflect.deleteProperty(nextState, getKey(preference));
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // object where the key is the category-name and has the corresponding value
    myPreferences: myPreferences,
});
//# sourceMappingURL=preferences.js.map