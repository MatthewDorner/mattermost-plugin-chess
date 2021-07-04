"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function isFunction(obj) {
    return typeof obj === 'function';
}
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = new Map();
    }
    EventEmitter.prototype.addListener = function (label, callback) {
        if (!this.listeners.has(label)) {
            this.listeners.set(label, []);
        }
        this.listeners.get(label).push(callback);
    };
    EventEmitter.prototype.on = function (label, callback) {
        this.addListener(label, callback);
    };
    EventEmitter.prototype.removeListener = function (label, callback) {
        var listeners = this.listeners.get(label);
        var index;
        if (listeners && listeners.length) {
            index = listeners.reduce(function (i, listener, idx) {
                return isFunction(listener) && listener === callback ? idx : i;
            }, -1);
            if (index > -1) {
                listeners.splice(index, 1);
                this.listeners.set(label, listeners);
                return true;
            }
        }
        return false;
    };
    EventEmitter.prototype.off = function (label, callback) {
        this.removeListener(label, callback);
    };
    EventEmitter.prototype.emit = function (label) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = this.listeners.get(label);
        if (listeners && listeners.length) {
            listeners.forEach(function (listener) {
                listener.apply(void 0, tslib_1.__spread(args));
            });
            return true;
        }
        return false;
    };
    return EventEmitter;
}());
exports.default = new EventEmitter();
//# sourceMappingURL=event_emitter.js.map