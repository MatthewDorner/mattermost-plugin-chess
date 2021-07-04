"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNotVisibleUsers = void 0;
var tslib_1 = require("tslib");
var action_types_1 = require("../action_types");
var users_1 = require("../selectors/entities/users");
var actions_1 = require("../types/actions");
var users_2 = require("./users");
function removeNotVisibleUsers() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, knownUsers, fetchResult, err_1, allUsers, usersToRemove, actions, _a, _b, userToRemove;
        var e_1, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    state = getState();
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dispatch(users_2.getKnownUsers())];
                case 2:
                    fetchResult = _d.sent();
                    knownUsers = new Set(fetchResult.data);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    return [2 /*return*/, { error: err_1 }];
                case 4:
                    knownUsers.add(users_1.getCurrentUserId(state));
                    allUsers = Object.keys(users_1.getUsers(state));
                    usersToRemove = new Set(allUsers.filter(function (x) { return !knownUsers.has(x); }));
                    actions = [];
                    try {
                        for (_a = tslib_1.__values(usersToRemove.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                            userToRemove = _b.value;
                            actions.push({ type: action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE, data: { user_id: userToRemove } });
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (actions.length > 0) {
                        dispatch(actions_1.batchActions(actions));
                    }
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.removeNotVisibleUsers = removeNotVisibleUsers;
//# sourceMappingURL=websocket.js.map