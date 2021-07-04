"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRolesIfNeeded = exports.setPendingRoles = exports.editRole = exports.getRole = exports.getRoleByName = exports.getRolesByNames = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var client_1 = require("../client");
var action_types_1 = require("../action_types");
var roles_helpers_1 = require("../selectors/entities/roles_helpers");
var general_1 = require("../selectors/entities/general");
var helpers_1 = require("./helpers");
function getRolesByNames(rolesNames) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getRolesByNames,
        onRequest: action_types_1.RoleTypes.ROLES_BY_NAMES_REQUEST,
        onSuccess: [action_types_1.RoleTypes.RECEIVED_ROLES, action_types_1.RoleTypes.ROLES_BY_NAMES_SUCCESS],
        onFailure: action_types_1.RoleTypes.ROLES_BY_NAMES_FAILURE,
        params: [
            rolesNames,
        ],
    });
}
exports.getRolesByNames = getRolesByNames;
function getRoleByName(roleName) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getRoleByName,
        onRequest: action_types_1.RoleTypes.ROLE_BY_NAME_REQUEST,
        onSuccess: [action_types_1.RoleTypes.RECEIVED_ROLE, action_types_1.RoleTypes.ROLE_BY_NAME_SUCCESS],
        onFailure: action_types_1.RoleTypes.ROLE_BY_NAME_FAILURE,
        params: [
            roleName,
        ],
    });
}
exports.getRoleByName = getRoleByName;
function getRole(roleId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getRole,
        onRequest: action_types_1.RoleTypes.ROLE_BY_ID_REQUEST,
        onSuccess: [action_types_1.RoleTypes.RECEIVED_ROLE, action_types_1.RoleTypes.ROLE_BY_ID_SUCCESS],
        onFailure: action_types_1.RoleTypes.ROLE_BY_ID_FAILURE,
        params: [
            roleId,
        ],
    });
}
exports.getRole = getRole;
function editRole(role) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.patchRole,
        onRequest: action_types_1.RoleTypes.EDIT_ROLE_REQUEST,
        onSuccess: [action_types_1.RoleTypes.RECEIVED_ROLE, action_types_1.RoleTypes.EDIT_ROLE_SUCCESS],
        onFailure: action_types_1.RoleTypes.EDIT_ROLE_FAILURE,
        params: [
            role.id,
            role,
        ],
    });
}
exports.editRole = editRole;
function setPendingRoles(roles) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            dispatch({ type: action_types_1.RoleTypes.SET_PENDING_ROLES, data: roles });
            return [2 /*return*/, { data: roles }];
        });
    }); };
}
exports.setPendingRoles = setPendingRoles;
function loadRolesIfNeeded(roles) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, pendingRoles, roles_1, roles_1_1, role, loadedRoles, newRoles, pendingRoles_1, pendingRoles_1_1, role;
        var e_1, _a, e_2, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    pendingRoles = new Set();
                    try {
                        pendingRoles = new Set(state.entities.roles.pending);
                    }
                    catch (e) { // eslint-disable-line
                    }
                    try {
                        for (roles_1 = tslib_1.__values(roles), roles_1_1 = roles_1.next(); !roles_1_1.done; roles_1_1 = roles_1.next()) {
                            role = roles_1_1.value;
                            pendingRoles.add(role);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (roles_1_1 && !roles_1_1.done && (_a = roles_1.return)) _a.call(roles_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (!state.entities.general.serverVersion) {
                        dispatch(setPendingRoles(Array.from(pendingRoles)));
                        setTimeout(function () { return dispatch(loadRolesIfNeeded([])); }, 500);
                        return [2 /*return*/, { data: [] }];
                    }
                    if (!!general_1.hasNewPermissions(state)) return [3 /*break*/, 3];
                    if (!state.entities.roles.pending) return [3 /*break*/, 2];
                    return [4 /*yield*/, dispatch(setPendingRoles([]))];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2: return [2 /*return*/, { data: [] }];
                case 3:
                    loadedRoles = roles_helpers_1.getRoles(state);
                    newRoles = new Set();
                    try {
                        for (pendingRoles_1 = tslib_1.__values(pendingRoles), pendingRoles_1_1 = pendingRoles_1.next(); !pendingRoles_1_1.done; pendingRoles_1_1 = pendingRoles_1.next()) {
                            role = pendingRoles_1_1.value;
                            if (!loadedRoles[role] && role.trim() !== '') {
                                newRoles.add(role);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (pendingRoles_1_1 && !pendingRoles_1_1.done && (_b = pendingRoles_1.return)) _b.call(pendingRoles_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    if (!state.entities.roles.pending) return [3 /*break*/, 5];
                    return [4 /*yield*/, dispatch(setPendingRoles([]))];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    if (newRoles.size > 0) {
                        return [2 /*return*/, getRolesByNames(Array.from(newRoles))(dispatch, getState)];
                    }
                    return [2 /*return*/, { data: state.entities.roles.roles }];
            }
        });
    }); };
}
exports.loadRolesIfNeeded = loadRolesIfNeeded;
//# sourceMappingURL=roles.js.map