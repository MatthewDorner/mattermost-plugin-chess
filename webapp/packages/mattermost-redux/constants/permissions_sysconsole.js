"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceToSysConsolePermissionsTable = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var permissions_1 = tslib_1.__importDefault(require("./permissions"));
exports.ResourceToSysConsolePermissionsTable = {
    about: [permissions_1.default.SYSCONSOLE_READ_ABOUT, permissions_1.default.SYSCONSOLE_WRITE_ABOUT],
    billing: [permissions_1.default.SYSCONSOLE_READ_BILLING, permissions_1.default.SYSCONSOLE_WRITE_BILLING],
    reporting: [permissions_1.default.SYSCONSOLE_READ_REPORTING, permissions_1.default.SYSCONSOLE_WRITE_REPORTING],
    'user_management.users': [permissions_1.default.SYSCONSOLE_READ_USERMANAGEMENT_USERS, permissions_1.default.SYSCONSOLE_WRITE_USERMANAGEMENT_USERS],
    'user_management.groups': [permissions_1.default.SYSCONSOLE_READ_USERMANAGEMENT_GROUPS, permissions_1.default.SYSCONSOLE_WRITE_USERMANAGEMENT_GROUPS],
    'user_management.teams': [permissions_1.default.SYSCONSOLE_READ_USERMANAGEMENT_TEAMS, permissions_1.default.SYSCONSOLE_WRITE_USERMANAGEMENT_TEAMS],
    'user_management.channels': [permissions_1.default.SYSCONSOLE_READ_USERMANAGEMENT_CHANNELS, permissions_1.default.SYSCONSOLE_WRITE_USERMANAGEMENT_CHANNELS],
    'user_management.permissions': [permissions_1.default.SYSCONSOLE_READ_USERMANAGEMENT_PERMISSIONS, permissions_1.default.SYSCONSOLE_WRITE_USERMANAGEMENT_PERMISSIONS],
    'user_management.system_roles': [permissions_1.default.SYSCONSOLE_READ_USERMANAGEMENT_SYSTEM_ROLES, permissions_1.default.SYSCONSOLE_WRITE_USERMANAGEMENT_SYSTEM_ROLES],
    environment: [permissions_1.default.SYSCONSOLE_READ_ENVIRONMENT, permissions_1.default.SYSCONSOLE_WRITE_ENVIRONMENT],
    site: [permissions_1.default.SYSCONSOLE_READ_SITE, permissions_1.default.SYSCONSOLE_WRITE_SITE],
    authentication: [permissions_1.default.SYSCONSOLE_READ_AUTHENTICATION, permissions_1.default.SYSCONSOLE_WRITE_AUTHENTICATION],
    plugins: [permissions_1.default.SYSCONSOLE_READ_PLUGINS, permissions_1.default.SYSCONSOLE_WRITE_PLUGINS],
    integrations: [permissions_1.default.SYSCONSOLE_READ_INTEGRATIONS, permissions_1.default.SYSCONSOLE_WRITE_INTEGRATIONS],
    compliance: [permissions_1.default.SYSCONSOLE_READ_COMPLIANCE, permissions_1.default.SYSCONSOLE_WRITE_COMPLIANCE],
    experimental: [permissions_1.default.SYSCONSOLE_READ_EXPERIMENTAL, permissions_1.default.SYSCONSOLE_WRITE_EXPERIMENTAL],
};
//# sourceMappingURL=permissions_sysconsole.js.map