"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function config(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GeneralTypes.CLIENT_CONFIG_RECEIVED:
            return Object.assign({}, state, action.data);
        case action_types_1.UserTypes.LOGIN: // Used by the mobile app
        case action_types_1.GeneralTypes.SET_CONFIG_AND_LICENSE:
            return Object.assign({}, state, action.data.config);
        case action_types_1.GeneralTypes.CLIENT_CONFIG_RESET:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function appState(state, action) {
    if (state === void 0) { state = false; }
    switch (action.type) {
        case action_types_1.GeneralTypes.RECEIVED_APP_STATE:
            return action.data;
        default:
            return state;
    }
}
function credentials(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GeneralTypes.RECEIVED_APP_CREDENTIALS:
            return Object.assign({}, state, action.data);
        case action_types_1.UserTypes.LOGIN: // Used by the mobile app
            return {
                url: action.data.url,
            };
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function dataRetentionPolicy(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GeneralTypes.RECEIVED_DATA_RETENTION_POLICY:
            return action.data;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function deviceToken(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.GeneralTypes.RECEIVED_APP_DEVICE_TOKEN:
            return action.data;
        default:
            return state;
    }
}
function license(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GeneralTypes.CLIENT_LICENSE_RECEIVED:
            return action.data;
        case action_types_1.GeneralTypes.SET_CONFIG_AND_LICENSE:
            return Object.assign({}, state, action.data.license);
        case action_types_1.GeneralTypes.CLIENT_LICENSE_RESET:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function timezones(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.GeneralTypes.SUPPORTED_TIMEZONES_RECEIVED:
            return action.data;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function serverVersion(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.GeneralTypes.RECEIVED_SERVER_VERSION:
            return action.data;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return '';
        default:
            return state;
    }
}
function warnMetricsStatus(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.GeneralTypes.WARN_METRICS_STATUS_RECEIVED:
            return action.data;
        case action_types_1.GeneralTypes.WARN_METRIC_STATUS_RECEIVED: {
            var nextState = tslib_1.__assign({}, state);
            nextState[action.data.id] = action.data;
            return nextState;
        }
        case action_types_1.GeneralTypes.WARN_METRIC_STATUS_REMOVED: {
            var nextState = tslib_1.__assign({}, state);
            var newParams = Object.assign({}, nextState[action.data.id]);
            newParams.acked = true;
            nextState[action.data.id] = newParams;
            return nextState;
        }
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    appState: appState,
    credentials: credentials,
    config: config,
    dataRetentionPolicy: dataRetentionPolicy,
    deviceToken: deviceToken,
    license: license,
    serverVersion: serverVersion,
    timezones: timezones,
    warnMetricsStatus: warnMetricsStatus,
});
//# sourceMappingURL=general.js.map