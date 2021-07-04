"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWarnMetricsStatus = exports.getRedirectLocation = exports.setUrl = exports.getSupportedTimezones = exports.setStoreFromLocalData = exports.setServerVersion = exports.setDeviceToken = exports.setAppState = exports.logClientError = exports.getLicenseConfig = exports.getDataRetentionPolicy = exports.getClientConfig = exports.resetPing = exports.getPing = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var client_1 = require("../client");
var action_types_1 = require("../action_types");
var general_1 = require("../selectors/entities/general");
var helpers_1 = require("../utils/helpers");
var actions_1 = require("../types/actions");
var errors_1 = require("./errors");
var roles_1 = require("./roles");
var users_1 = require("./users");
var helpers_2 = require("./helpers");
function getPing() {
    var _this = this;
    return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, pingError, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pingError = new helpers_2.FormattedError('mobile.server_ping_failed', 'Cannot connect to the server. Please check your server URL and internet connection.');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.ping()];
                case 2:
                    data = _a.sent();
                    if (data.status !== 'OK') {
                        // successful ping but not the right return {data}
                        return [2 /*return*/, { error: pingError }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.status_code === 401) {
                        // When the server requires a client certificate to connect.
                        pingError = error_1;
                    }
                    return [2 /*return*/, { error: pingError }];
                case 4: return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getPing = getPing;
function resetPing() {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({ type: action_types_1.GeneralTypes.PING_RESET, data: {} });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.resetPing = resetPing;
function getClientConfig() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getClientConfigOld()];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_2, dispatch, getState);
                    return [2 /*return*/, { error: error_2 }];
                case 3:
                    client_1.Client4.setEnableLogging(data.EnableDeveloper === 'true');
                    client_1.Client4.setDiagnosticId(data.DiagnosticId);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.GeneralTypes.CLIENT_CONFIG_RECEIVED, data: data },
                    ]));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getClientConfig = getClientConfig;
function getDataRetentionPolicy() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getDataRetentionPolicy()];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.GeneralTypes.RECEIVED_DATA_RETENTION_POLICY,
                            error: error_3,
                        },
                        errors_1.logError(error_3),
                    ]));
                    return [2 /*return*/, { error: error_3 }];
                case 3:
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.GeneralTypes.RECEIVED_DATA_RETENTION_POLICY, data: data },
                    ]));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getDataRetentionPolicy = getDataRetentionPolicy;
function getLicenseConfig() {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getClientLicenseOld,
        onSuccess: [action_types_1.GeneralTypes.CLIENT_LICENSE_RECEIVED],
    });
}
exports.getLicenseConfig = getLicenseConfig;
function logClientError(message, level) {
    if (level === void 0) { level = 'ERROR'; }
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.logClientError,
        onRequest: action_types_1.GeneralTypes.LOG_CLIENT_ERROR_REQUEST,
        onSuccess: action_types_1.GeneralTypes.LOG_CLIENT_ERROR_SUCCESS,
        onFailure: action_types_1.GeneralTypes.LOG_CLIENT_ERROR_FAILURE,
        params: [
            message,
            level,
        ],
    });
}
exports.logClientError = logClientError;
function setAppState(state) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({ type: action_types_1.GeneralTypes.RECEIVED_APP_STATE, data: state });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.setAppState = setAppState;
function setDeviceToken(token) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({ type: action_types_1.GeneralTypes.RECEIVED_APP_DEVICE_TOKEN, data: token });
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.setDeviceToken = setDeviceToken;
function setServerVersion(serverVersion) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({ type: action_types_1.GeneralTypes.RECEIVED_SERVER_VERSION, data: serverVersion });
            dispatch(roles_1.loadRolesIfNeeded([]));
            return [2 /*return*/, { data: true }];
        });
    }); };
}
exports.setServerVersion = setServerVersion;
function setStoreFromLocalData(data) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            client_1.Client4.setToken(data.token);
            client_1.Client4.setUrl(data.url);
            return [2 /*return*/, users_1.loadMe()(dispatch, getState)];
        });
    }); };
}
exports.setStoreFromLocalData = setStoreFromLocalData;
function getSupportedTimezones() {
    return helpers_2.bindClientFunc({
        clientFunc: client_1.Client4.getTimezones,
        onRequest: action_types_1.GeneralTypes.SUPPORTED_TIMEZONES_REQUEST,
        onSuccess: [action_types_1.GeneralTypes.SUPPORTED_TIMEZONES_RECEIVED, action_types_1.GeneralTypes.SUPPORTED_TIMEZONES_SUCCESS],
        onFailure: action_types_1.GeneralTypes.SUPPORTED_TIMEZONES_FAILURE,
    });
}
exports.getSupportedTimezones = getSupportedTimezones;
function setUrl(url) {
    client_1.Client4.setUrl(url);
    return true;
}
exports.setUrl = setUrl;
function getRedirectLocation(url) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var pendingData, data, error_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (helpers_1.isMinimumServerVersion(general_1.getServerVersion(getState()), 5, 3)) {
                        pendingData = client_1.Client4.getRedirectLocation(url);
                    }
                    else {
                        pendingData = Promise.resolve({ location: url });
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pendingData];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch({ type: action_types_1.GeneralTypes.REDIRECT_LOCATION_FAILURE, data: { error: error_4, url: url } });
                    return [2 /*return*/, { error: error_4 }];
                case 4:
                    dispatch({ type: action_types_1.GeneralTypes.REDIRECT_LOCATION_SUCCESS, data: tslib_1.__assign(tslib_1.__assign({}, data), { url: url }) });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getRedirectLocation = getRedirectLocation;
function getWarnMetricsStatus() {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getWarnMetricsStatus()];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    helpers_2.forceLogoutIfNecessary(error_5, dispatch, getState);
                    return [2 /*return*/, { error: error_5 }];
                case 3:
                    dispatch({ type: action_types_1.GeneralTypes.WARN_METRICS_STATUS_RECEIVED, data: data });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getWarnMetricsStatus = getWarnMetricsStatus;
exports.default = {
    getPing: getPing,
    getClientConfig: getClientConfig,
    getDataRetentionPolicy: getDataRetentionPolicy,
    getSupportedTimezones: getSupportedTimezones,
    getLicenseConfig: getLicenseConfig,
    logClientError: logClientError,
    setAppState: setAppState,
    setDeviceToken: setDeviceToken,
    setServerVersion: setServerVersion,
    setStoreFromLocalData: setStoreFromLocalData,
    setUrl: setUrl,
    getRedirectLocation: getRedirectLocation,
    getWarnMetricsStatus: getWarnMetricsStatus,
};
//# sourceMappingURL=general.js.map