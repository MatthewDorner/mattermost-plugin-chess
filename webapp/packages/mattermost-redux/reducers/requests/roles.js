"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function getRolesByNames(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.RoleTypes.ROLES_BY_NAMES_REQUEST, action_types_1.RoleTypes.ROLES_BY_NAMES_SUCCESS, action_types_1.RoleTypes.ROLES_BY_NAMES_FAILURE, state, action);
}
function getRoleByName(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.RoleTypes.ROLE_BY_NAME_REQUEST, action_types_1.RoleTypes.ROLE_BY_NAME_SUCCESS, action_types_1.RoleTypes.ROLE_BY_NAME_FAILURE, state, action);
}
function getRole(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.RoleTypes.ROLE_BY_ID_REQUEST, action_types_1.RoleTypes.ROLE_BY_ID_SUCCESS, action_types_1.RoleTypes.ROLE_BY_ID_FAILURE, state, action);
}
function editRole(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.RoleTypes.EDIT_ROLE_REQUEST, action_types_1.RoleTypes.EDIT_ROLE_SUCCESS, action_types_1.RoleTypes.EDIT_ROLE_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    getRolesByNames: getRolesByNames,
    getRoleByName: getRoleByName,
    getRole: getRole,
    editRole: editRole,
});
//# sourceMappingURL=roles.js.map