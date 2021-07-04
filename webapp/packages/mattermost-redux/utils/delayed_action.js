"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var DelayedAction = /** @class */ (function () {
    function DelayedAction(action) {
        var _this = this;
        this.fire = function () {
            _this.action();
            _this.timer = null;
        };
        this.fireAfter = function (timeout) {
            if (_this.timer !== null) {
                clearTimeout(_this.timer);
            }
            _this.timer = setTimeout(_this.fire, timeout);
        };
        this.cancel = function () {
            if (_this.timer !== null) {
                clearTimeout(_this.timer);
            }
        };
        this.action = action;
        this.timer = null;
    }
    return DelayedAction;
}());
exports.default = DelayedAction;
//# sourceMappingURL=delayed_action.js.map