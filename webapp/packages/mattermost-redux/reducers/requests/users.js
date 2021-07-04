"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var constants_1 = require("../../constants");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function checkMfa(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    switch (action.type) {
        case action_types_1.UserTypes.CHECK_MFA_REQUEST:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.STARTED });
        case action_types_1.UserTypes.CHECK_MFA_SUCCESS:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.SUCCESS, error: null });
        case action_types_1.UserTypes.CHECK_MFA_FAILURE:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.FAILURE, error: action.error });
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.NOT_STARTED, error: null });
        default:
            return state;
    }
}
function login(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    switch (action.type) {
        case action_types_1.UserTypes.LOGIN_REQUEST:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.STARTED });
        case action_types_1.UserTypes.LOGIN_SUCCESS:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.SUCCESS, error: null });
        case action_types_1.UserTypes.LOGIN_FAILURE:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.FAILURE, error: action.error });
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.NOT_STARTED, error: null });
        default:
            return state;
    }
}
function logout(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    switch (action.type) {
        case action_types_1.UserTypes.LOGOUT_REQUEST:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.STARTED });
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.SUCCESS, error: null });
        case action_types_1.UserTypes.LOGOUT_FAILURE:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.FAILURE, error: action.error });
        case action_types_1.UserTypes.RESET_LOGOUT_STATE:
            return helpers_1.initialRequestState();
        default:
            return state;
    }
}
function autocompleteUsers(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.UserTypes.AUTOCOMPLETE_USERS_REQUEST, action_types_1.UserTypes.AUTOCOMPLETE_USERS_SUCCESS, action_types_1.UserTypes.AUTOCOMPLETE_USERS_FAILURE, state, action);
}
function updateMe(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.UserTypes.UPDATE_ME_REQUEST, action_types_1.UserTypes.UPDATE_ME_SUCCESS, action_types_1.UserTypes.UPDATE_ME_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    checkMfa: checkMfa,
    login: login,
    logout: logout,
    autocompleteUsers: autocompleteUsers,
    updateMe: updateMe,
});
//# sourceMappingURL=users.js.map