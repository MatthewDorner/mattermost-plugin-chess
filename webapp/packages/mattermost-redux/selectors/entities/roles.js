"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.haveICurrentChannelPermission = exports.haveICurrentTeamPermission = exports.haveIChannelPermission = exports.haveITeamPermission = exports.haveISystemPermission = exports.getMyChannelPermissions = exports.getMyTeamPermissions = exports.getMyCurrentChannelPermissions = exports.getMyCurrentTeamPermissions = exports.getRolesById = exports.getMyRoles = exports.getMyChannelRoles = exports.getMyTeamRoles = exports.getRoles = exports.getMySystemRoles = exports.getMySystemPermissions = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var common_1 = require("./common");
var roles_helpers_1 = require("./roles_helpers");
Object.defineProperty(exports, "getMySystemPermissions", { enumerable: true, get: function () { return roles_helpers_1.getMySystemPermissions; } });
Object.defineProperty(exports, "getMySystemRoles", { enumerable: true, get: function () { return roles_helpers_1.getMySystemRoles; } });
Object.defineProperty(exports, "getRoles", { enumerable: true, get: function () { return roles_helpers_1.getRoles; } });
var teams_1 = require("./teams");
exports.getMyTeamRoles = reselect_1.createSelector(teams_1.getTeamMemberships, function (teamsMemberships) {
    var roles = {};
    if (teamsMemberships) {
        for (var key in teamsMemberships) {
            if (teamsMemberships.hasOwnProperty(key) && teamsMemberships[key].roles) {
                roles[key] = new Set(teamsMemberships[key].roles.split(' '));
            }
        }
    }
    return roles;
});
exports.getMyChannelRoles = reselect_1.createSelector(function (state) { return state.entities.channels.myMembers; }, function (channelsMemberships) {
    var roles = {};
    if (channelsMemberships) {
        for (var key in channelsMemberships) {
            if (channelsMemberships.hasOwnProperty(key) && channelsMemberships[key].roles) {
                roles[key] = new Set(channelsMemberships[key].roles.split(' '));
            }
        }
    }
    return roles;
});
exports.getMyRoles = reselect_1.createSelector(roles_helpers_1.getMySystemRoles, exports.getMyTeamRoles, exports.getMyChannelRoles, function (systemRoles, teamRoles, channelRoles) {
    return {
        system: systemRoles,
        team: teamRoles,
        channel: channelRoles,
    };
});
exports.getRolesById = reselect_1.createSelector(roles_helpers_1.getRoles, function (rolesByName) {
    var e_1, _a;
    var rolesById = {};
    try {
        for (var _b = tslib_1.__values(Object.values(rolesByName)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var role = _c.value;
            rolesById[role.id] = role;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return rolesById;
});
exports.getMyCurrentTeamPermissions = reselect_1.createSelector(exports.getMyTeamRoles, roles_helpers_1.getRoles, roles_helpers_1.getMySystemPermissions, teams_1.getCurrentTeamId, function (myTeamRoles, roles, systemPermissions, teamId) {
    var e_2, _a, e_3, _b, e_4, _c;
    var permissions = new Set();
    if (myTeamRoles[teamId]) {
        try {
            for (var _d = tslib_1.__values(myTeamRoles[teamId]), _e = _d.next(); !_e.done; _e = _d.next()) {
                var roleName = _e.value;
                if (roles[roleName]) {
                    try {
                        for (var _f = (e_3 = void 0, tslib_1.__values(roles[roleName].permissions)), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var permission = _g.value;
                            permissions.add(permission);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    try {
        for (var systemPermissions_1 = tslib_1.__values(systemPermissions), systemPermissions_1_1 = systemPermissions_1.next(); !systemPermissions_1_1.done; systemPermissions_1_1 = systemPermissions_1.next()) {
            var permission = systemPermissions_1_1.value;
            permissions.add(permission);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (systemPermissions_1_1 && !systemPermissions_1_1.done && (_c = systemPermissions_1.return)) _c.call(systemPermissions_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return permissions;
});
exports.getMyCurrentChannelPermissions = reselect_1.createSelector(exports.getMyChannelRoles, roles_helpers_1.getRoles, exports.getMyCurrentTeamPermissions, common_1.getCurrentChannelId, function (myChannelRoles, roles, teamPermissions, channelId) {
    var e_5, _a, e_6, _b, e_7, _c;
    var permissions = new Set();
    if (myChannelRoles[channelId]) {
        try {
            for (var _d = tslib_1.__values(myChannelRoles[channelId]), _e = _d.next(); !_e.done; _e = _d.next()) {
                var roleName = _e.value;
                if (roles[roleName]) {
                    try {
                        for (var _f = (e_6 = void 0, tslib_1.__values(roles[roleName].permissions)), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var permission = _g.value;
                            permissions.add(permission);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_5) throw e_5.error; }
        }
    }
    try {
        for (var teamPermissions_1 = tslib_1.__values(teamPermissions), teamPermissions_1_1 = teamPermissions_1.next(); !teamPermissions_1_1.done; teamPermissions_1_1 = teamPermissions_1.next()) {
            var permission = teamPermissions_1_1.value;
            permissions.add(permission);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (teamPermissions_1_1 && !teamPermissions_1_1.done && (_c = teamPermissions_1.return)) _c.call(teamPermissions_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return permissions;
});
exports.getMyTeamPermissions = reselect_1.createSelector(exports.getMyTeamRoles, roles_helpers_1.getRoles, roles_helpers_1.getMySystemPermissions, function (state, options) { return options.team; }, function (myTeamRoles, roles, systemPermissions, teamId) {
    var e_8, _a, e_9, _b, e_10, _c;
    var permissions = new Set();
    if (myTeamRoles[teamId]) {
        try {
            for (var _d = tslib_1.__values(myTeamRoles[teamId]), _e = _d.next(); !_e.done; _e = _d.next()) {
                var roleName = _e.value;
                if (roles[roleName]) {
                    try {
                        for (var _f = (e_9 = void 0, tslib_1.__values(roles[roleName].permissions)), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var permission = _g.value;
                            permissions.add(permission);
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_8) throw e_8.error; }
        }
    }
    try {
        for (var systemPermissions_2 = tslib_1.__values(systemPermissions), systemPermissions_2_1 = systemPermissions_2.next(); !systemPermissions_2_1.done; systemPermissions_2_1 = systemPermissions_2.next()) {
            var permission = systemPermissions_2_1.value;
            permissions.add(permission);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (systemPermissions_2_1 && !systemPermissions_2_1.done && (_c = systemPermissions_2.return)) _c.call(systemPermissions_2);
        }
        finally { if (e_10) throw e_10.error; }
    }
    return permissions;
});
exports.getMyChannelPermissions = reselect_1.createSelector(exports.getMyChannelRoles, roles_helpers_1.getRoles, exports.getMyTeamPermissions, function (state, options) { return options.channel; }, function (myChannelRoles, roles, teamPermissions, channelId) {
    var e_11, _a, e_12, _b, e_13, _c;
    var permissions = new Set();
    if (myChannelRoles[channelId]) {
        try {
            for (var _d = tslib_1.__values(myChannelRoles[channelId]), _e = _d.next(); !_e.done; _e = _d.next()) {
                var roleName = _e.value;
                if (roles[roleName]) {
                    try {
                        for (var _f = (e_12 = void 0, tslib_1.__values(roles[roleName].permissions)), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var permission = _g.value;
                            permissions.add(permission);
                        }
                    }
                    catch (e_12_1) { e_12 = { error: e_12_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_12) throw e_12.error; }
                    }
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_11) throw e_11.error; }
        }
    }
    try {
        for (var teamPermissions_2 = tslib_1.__values(teamPermissions), teamPermissions_2_1 = teamPermissions_2.next(); !teamPermissions_2_1.done; teamPermissions_2_1 = teamPermissions_2.next()) {
            var permission = teamPermissions_2_1.value;
            permissions.add(permission);
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (teamPermissions_2_1 && !teamPermissions_2_1.done && (_c = teamPermissions_2.return)) _c.call(teamPermissions_2);
        }
        finally { if (e_13) throw e_13.error; }
    }
    return permissions;
});
exports.haveISystemPermission = reselect_1.createSelector(roles_helpers_1.getMySystemPermissions, function (state, options) { return options.permission; }, function (permissions, permission) {
    return permissions.has(permission);
});
exports.haveITeamPermission = reselect_1.createSelector(exports.getMyTeamPermissions, function (state, options) { return options.permission; }, function (permissions, permission) {
    return permissions.has(permission);
});
exports.haveIChannelPermission = reselect_1.createSelector(exports.getMyChannelPermissions, function (state, options) { return options.permission; }, function (permissions, permission) {
    return permissions.has(permission);
});
exports.haveICurrentTeamPermission = reselect_1.createSelector(exports.getMyCurrentTeamPermissions, function (state, options) { return options.permission; }, function (permissions, permission) {
    return permissions.has(permission);
});
exports.haveICurrentChannelPermission = reselect_1.createSelector(exports.getMyCurrentChannelPermissions, function (state, options) { return options.permission; }, function (permissions, permission) {
    return permissions.has(permission);
});
//# sourceMappingURL=roles.js.map