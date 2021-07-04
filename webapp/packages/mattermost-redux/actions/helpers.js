"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormattedError = exports.debounce = exports.bindClientFunc = exports.requestFailure = exports.requestSuccess = exports.requestData = exports.forceLogoutIfNecessary = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var client_1 = require("../client");
var action_types_1 = require("../action_types");
var actions_1 = require("../types/actions");
var errors_1 = require("./errors");
var HTTP_UNAUTHORIZED = 401;
function forceLogoutIfNecessary(err, dispatch, getState) {
    var currentUserId = getState().entities.users.currentUserId;
    if ('status_code' in err && err.status_code === HTTP_UNAUTHORIZED && err.url && err.url.indexOf('/login') === -1 && currentUserId) {
        client_1.Client4.setToken('');
        dispatch({ type: action_types_1.UserTypes.LOGOUT_SUCCESS, data: {} });
    }
}
exports.forceLogoutIfNecessary = forceLogoutIfNecessary;
function dispatcher(type, data, dispatch) {
    if (type.indexOf('SUCCESS') === -1) { // we don't want to pass the data for the request types
        dispatch(requestSuccess(type, data));
    }
    else {
        dispatch(requestData(type));
    }
}
function requestData(type) {
    return {
        type: type,
        data: null,
    };
}
exports.requestData = requestData;
function requestSuccess(type, data) {
    return {
        type: type,
        data: data,
    };
}
exports.requestSuccess = requestSuccess;
function requestFailure(type, error) {
    return {
        type: type,
        error: error,
    };
}
exports.requestFailure = requestFailure;
/**
 * Returns an ActionFunc which calls a specfied (client) function and
 * dispatches the specifed actions on request, success or failure.
 *
 * @export
 * @param {Object} obj                                       an object for destructirung required properties
 * @param {() => Promise<mixed>} obj.clientFunc              clientFunc to execute
 * @param {ActionType} obj.onRequest                         ActionType to dispatch on request
 * @param {(ActionType | Array<ActionType>)} obj.onSuccess   ActionType to dispatch on success
 * @param {ActionType} obj.onFailure                         ActionType to dispatch on failure
 * @param {...Array<any>} obj.params
 * @returns {ActionFunc} ActionFunc
 */
function bindClientFunc(_a) {
    var _this = this;
    var clientFunc = _a.clientFunc, onRequest = _a.onRequest, onSuccess = _a.onSuccess, onFailure = _a.onFailure, _b = _a.params, params = _b === void 0 ? [] : _b;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_1, actions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (onRequest) {
                        dispatch(requestData(onRequest));
                    }
                    data = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, clientFunc.apply(void 0, tslib_1.__spread(params))];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    forceLogoutIfNecessary(error_1, dispatch, getState);
                    actions = [errors_1.logError(error_1)];
                    if (onFailure) {
                        actions.push(requestFailure(onFailure, error_1));
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { error: error_1 }];
                case 4:
                    if (Array.isArray(onSuccess)) {
                        onSuccess.forEach(function (s) {
                            dispatcher(s, data, dispatch);
                        });
                    }
                    else if (onSuccess) {
                        dispatcher(onSuccess, data, dispatch);
                    }
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.bindClientFunc = bindClientFunc;
// Debounce function based on underscores modified to use es6 and a cb
function debounce(func, wait, immediate, cb) {
    var timeout;
    return function fx() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var runLater = function () {
            timeout = null;
            if (!immediate) {
                Reflect.apply(func, _this, args);
                if (cb) {
                    cb();
                }
            }
        };
        var callNow = immediate && !timeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(runLater, wait);
        if (callNow) {
            Reflect.apply(func, this, args);
            if (cb) {
                cb();
            }
        }
    };
}
exports.debounce = debounce;
var FormattedError = /** @class */ (function (_super) {
    tslib_1.__extends(FormattedError, _super);
    function FormattedError(id, defaultMessage, values) {
        if (values === void 0) { values = {}; }
        var _this = _super.call(this, defaultMessage) || this;
        _this.intl = {
            id: id,
            defaultMessage: defaultMessage,
            values: values,
        };
        return _this;
    }
    return FormattedError;
}(Error));
exports.FormattedError = FormattedError;
//# sourceMappingURL=helpers.js.map