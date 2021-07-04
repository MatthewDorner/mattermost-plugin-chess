"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReducerRegistry = void 0;
var tslib_1 = require("tslib");
// Based on http://nicolasgallagher.com/redux-modules-and-code-splitting/
var ReducerRegistry = /** @class */ (function () {
    function ReducerRegistry() {
        var _this = this;
        this.reducers = {};
        this.setReducers = function (reducers) {
            _this.reducers = reducers;
        };
        this.getReducers = function () {
            return tslib_1.__assign({}, _this.reducers);
        };
        this.register = function (name, reducer) {
            var _a;
            _this.reducers = tslib_1.__assign(tslib_1.__assign({}, _this.reducers), (_a = {}, _a[name] = reducer, _a));
            if (_this.emitChange) {
                _this.emitChange(_this.getReducers());
            }
        };
        this.setChangeListener = function (listener) {
            _this.emitChange = listener;
        };
    }
    return ReducerRegistry;
}());
exports.ReducerRegistry = ReducerRegistry;
var reducerRegistry = new ReducerRegistry();
exports.default = reducerRegistry;
//# sourceMappingURL=reducer_registry.js.map