"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminAnalytics = exports.getDataRetentionCustomPolicy = exports.getDataRetentionCustomPoliciesCount = exports.getDataRetentionCustomPolicies = exports.getUserAccessTokens = exports.getClusterInfo = exports.getComplianceReports = exports.getEnvironmentConfig = exports.getLdapGroupsCount = exports.getLdapGroups = exports.getConfig = exports.getAudits = exports.getLogs = void 0;
function getLogs(state) {
    return state.entities.admin.logs;
}
exports.getLogs = getLogs;
function getAudits(state) {
    return state.entities.admin.audits;
}
exports.getAudits = getAudits;
function getConfig(state) {
    return state.entities.admin.config;
}
exports.getConfig = getConfig;
function getLdapGroups(state) {
    return state.entities.admin.ldapGroups;
}
exports.getLdapGroups = getLdapGroups;
function getLdapGroupsCount(state) {
    return state.entities.admin.ldapGroupsCount;
}
exports.getLdapGroupsCount = getLdapGroupsCount;
function getEnvironmentConfig(state) {
    return state.entities.admin.environmentConfig;
}
exports.getEnvironmentConfig = getEnvironmentConfig;
function getComplianceReports(state) {
    return state.entities.admin.complianceReports;
}
exports.getComplianceReports = getComplianceReports;
function getClusterInfo(state) {
    return state.entities.admin.clusterInfo;
}
exports.getClusterInfo = getClusterInfo;
function getUserAccessTokens(state) {
    return state.entities.admin.userAccessTokens;
}
exports.getUserAccessTokens = getUserAccessTokens;
function getDataRetentionCustomPolicies(state) {
    return state.entities.admin.dataRetentionCustomPolicies;
}
exports.getDataRetentionCustomPolicies = getDataRetentionCustomPolicies;
function getDataRetentionCustomPoliciesCount(state) {
    return state.entities.admin.dataRetentionCustomPoliciesCount;
}
exports.getDataRetentionCustomPoliciesCount = getDataRetentionCustomPoliciesCount;
function getDataRetentionCustomPolicy(state, id) {
    var policy = getDataRetentionCustomPolicies(state);
    return policy[id];
}
exports.getDataRetentionCustomPolicy = getDataRetentionCustomPolicy;
function getAdminAnalytics(state) {
    return state.entities.admin.analytics;
}
exports.getAdminAnalytics = getAdminAnalytics;
//# sourceMappingURL=admin.js.map