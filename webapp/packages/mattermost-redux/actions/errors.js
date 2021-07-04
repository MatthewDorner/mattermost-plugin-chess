"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearErrors = exports.logError = exports.getLogErrorAction = exports.dismissError = exports.dismissErrorObject = void 0;
var tslib_1 = require("tslib");
var action_types_1 = require("../action_types");
var serialize_error_1 = require("serialize-error");
var client_1 = require("../client");
var event_emitter_1 = tslib_1.__importDefault(require("../utils/event_emitter"));
function dismissErrorObject(index) {
    return {
        type: action_types_1.ErrorTypes.DISMISS_ERROR,
        index: index,
        data: null,
    };
}
exports.dismissErrorObject = dismissErrorObject;
function dismissError(index) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch(dismissErrorObject(index));
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.dismissError = dismissError;
function getLogErrorAction(error, displayable) {
    if (displayable === void 0) { displayable = false; }
    return {
        type: action_types_1.ErrorTypes.LOG_ERROR,
        displayable: displayable,
        error: error,
        data: null,
    };
}
exports.getLogErrorAction = getLogErrorAction;
function logError(error, displayable) {
    var _this = this;
    if (displayable === void 0) { displayable = false; }
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var serializedError, sendToServer, stringifiedSerializedError, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (error.server_error_id === 'api.context.session_expired.app_error') {
                        return [2 /*return*/, { data: true }];
                    }
                    serializedError = serialize_error_1.serializeError(error);
                    sendToServer = true;
                    if (error.stack && error.stack.includes('TypeError: Failed to fetch')) {
                        sendToServer = false;
                    }
                    if (error.server_error_id) {
                        sendToServer = false;
                    }
                    if (!sendToServer) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    stringifiedSerializedError = JSON.stringify(serializedError).toString();
                    return [4 /*yield*/, client_1.Client4.logClientError(stringifiedSerializedError)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    event_emitter_1.default.emit(action_types_1.ErrorTypes.LOG_ERROR, error);
                    dispatch(getLogErrorAction(serializedError, displayable));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.logError = logError;
function clearErrors() {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({ type: action_types_1.ErrorTypes.CLEAR_ERRORS, data: null });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.clearErrors = clearErrors;
//# sourceMappingURL=errors.js.map