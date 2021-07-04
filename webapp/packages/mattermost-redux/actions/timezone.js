"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoUpdateTimezone = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var users_1 = require("../selectors/entities/users");
var timezone_1 = require("../selectors/entities/timezone");
var users_2 = require("./users");
function autoUpdateTimezone(deviceTimezone) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUer, currentTimezone, newTimezoneExists, timezone, updatedUser;
        return tslib_1.__generator(this, function (_a) {
            currentUer = users_1.getCurrentUser(getState());
            currentTimezone = timezone_1.getUserTimezone(getState(), currentUer.id);
            newTimezoneExists = currentTimezone.automaticTimezone !== deviceTimezone;
            if (currentTimezone.useAutomaticTimezone && newTimezoneExists) {
                timezone = {
                    useAutomaticTimezone: 'true',
                    automaticTimezone: deviceTimezone,
                    manualTimezone: currentTimezone.manualTimezone,
                };
                updatedUser = tslib_1.__assign(tslib_1.__assign({}, currentUer), { timezone: timezone });
                users_2.updateMe(updatedUser)(dispatch, getState);
            }
            return [2 /*return*/];
        });
    }); };
}
exports.autoUpdateTimezone = autoUpdateTimezone;
//# sourceMappingURL=timezone.js.map