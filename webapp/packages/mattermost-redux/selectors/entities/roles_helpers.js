"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.haveISystemPermission = exports.getMySystemPermissions = exports.getMySystemRoles = exports.getRoles = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var common_1 = require("./common");
function getRoles(state) {
    return state.entities.roles.roles;
}
exports.getRoles = getRoles;
exports.getMySystemRoles = reselect_1.createSelector(common_1.getCurrentUser, function (user) {
    if (user) {
        return new Set(user.roles.split(' '));
    }
    return new Set();
});
exports.getMySystemPermissions = reselect_1.createSelector(exports.getMySystemRoles, getRoles, function (mySystemRoles, roles) {
    var e_1, _a, e_2, _b;
    var permissions = new Set();
    try {
        for (var mySystemRoles_1 = tslib_1.__values(mySystemRoles), mySystemRoles_1_1 = mySystemRoles_1.next(); !mySystemRoles_1_1.done; mySystemRoles_1_1 = mySystemRoles_1.next()) {
            var roleName = mySystemRoles_1_1.value;
            if (roles[roleName]) {
                try {
                    for (var _c = (e_2 = void 0, tslib_1.__values(roles[roleName].permissions)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var permission = _d.value;
                        permissions.add(permission);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (mySystemRoles_1_1 && !mySystemRoles_1_1.done && (_a = mySystemRoles_1.return)) _a.call(mySystemRoles_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return permissions;
});
exports.haveISystemPermission = reselect_1.createSelector(exports.getMySystemPermissions, function (state, options) { return options.permission; }, function (permissions, permission) {
    return permissions.has(permission);
});
//# sourceMappingURL=roles_helpers.js.map