"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disablePlugin = exports.enablePlugin = exports.removePlugin = exports.getPluginStatuses = exports.getPlugins = exports.installPluginFromUrl = exports.uploadPlugin = exports.getUsersPerDayAnalytics = exports.getBotPostsPerDayAnalytics = exports.getPostsPerDayAnalytics = exports.getAdvancedAnalytics = exports.getStandardAnalytics = exports.getAnalytics = exports.removeLicense = exports.uploadLicense = exports.purgeElasticsearchIndexes = exports.testElasticsearch = exports.removeIdpSamlCertificate = exports.removePrivateLdapCertificate = exports.removePublicLdapCertificate = exports.removePrivateSamlCertificate = exports.removePublicSamlCertificate = exports.uploadIdpSamlCertificate = exports.uploadPrivateLdapCertificate = exports.uploadPublicLdapCertificate = exports.uploadPrivateSamlCertificate = exports.uploadPublicSamlCertificate = exports.getSamlCertificateStatus = exports.unlinkLdapGroup = exports.linkLdapGroup = exports.getLdapGroups = exports.syncLdap = exports.testLdap = exports.getClusterStatus = exports.deleteBrandImage = exports.uploadBrandImage = exports.getComplianceReports = exports.getComplianceReport = exports.createComplianceReport = exports.recycleDatabase = exports.invalidateCaches = exports.testS3Connection = exports.testSiteURL = exports.testEmail = exports.getEnvironmentConfig = exports.reloadConfig = exports.updateConfig = exports.getConfig = exports.getAudits = exports.getLogs = void 0;
exports.clearDataRetentionCustomPolicyChannels = exports.clearDataRetentionCustomPolicyTeams = exports.removeDataRetentionCustomPolicyChannels = exports.addDataRetentionCustomPolicyChannels = exports.removeDataRetentionCustomPolicyTeams = exports.addDataRetentionCustomPolicyTeams = exports.updateDataRetentionCustomPolicy = exports.createDataRetentionCustomPolicy = exports.searchDataRetentionCustomPolicyChannels = exports.searchDataRetentionCustomPolicyTeams = exports.getDataRetentionCustomPolicyChannels = exports.getDataRetentionCustomPolicyTeams = exports.getDataRetentionCustomPolicy = exports.getDataRetentionCustomPolicies = exports.sendWarnMetricAck = exports.setSamlIdpCertificateFromMetadata = exports.getSamlMetadataFromIdp = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var action_types_1 = require("../action_types");
var constants_1 = require("../constants");
var client_1 = require("../client");
var actions_1 = require("../types/actions");
var helpers_1 = require("./helpers");
var errors_1 = require("./errors");
function getLogs(page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.LOGS_PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getLogs,
        onRequest: action_types_1.AdminTypes.GET_LOGS_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_LOGS, action_types_1.AdminTypes.GET_LOGS_SUCCESS],
        onFailure: action_types_1.AdminTypes.GET_LOGS_FAILURE,
        params: [
            page,
            perPage,
        ],
    });
}
exports.getLogs = getLogs;
function getAudits(page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getAudits,
        onRequest: action_types_1.AdminTypes.GET_AUDITS_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_AUDITS, action_types_1.AdminTypes.GET_AUDITS_SUCCESS],
        onFailure: action_types_1.AdminTypes.GET_AUDITS_FAILURE,
        params: [
            page,
            perPage,
        ],
    });
}
exports.getAudits = getAudits;
function getConfig() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getConfig,
        onRequest: action_types_1.AdminTypes.GET_CONFIG_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_CONFIG, action_types_1.AdminTypes.GET_CONFIG_SUCCESS],
        onFailure: action_types_1.AdminTypes.GET_CONFIG_FAILURE,
    });
}
exports.getConfig = getConfig;
function updateConfig(config) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.updateConfig,
        onRequest: action_types_1.AdminTypes.UPDATE_CONFIG_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_CONFIG, action_types_1.AdminTypes.UPDATE_CONFIG_SUCCESS],
        onFailure: action_types_1.AdminTypes.UPDATE_CONFIG_FAILURE,
        params: [
            config,
        ],
    });
}
exports.updateConfig = updateConfig;
function reloadConfig() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.reloadConfig,
        onRequest: action_types_1.AdminTypes.RELOAD_CONFIG_REQUEST,
        onSuccess: action_types_1.AdminTypes.RELOAD_CONFIG_SUCCESS,
        onFailure: action_types_1.AdminTypes.RELOAD_CONFIG_FAILURE,
    });
}
exports.reloadConfig = reloadConfig;
function getEnvironmentConfig() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getEnvironmentConfig,
        onRequest: action_types_1.AdminTypes.GET_ENVIRONMENT_CONFIG_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_ENVIRONMENT_CONFIG, action_types_1.AdminTypes.GET_ENVIRONMENT_CONFIG_SUCCESS],
        onFailure: action_types_1.AdminTypes.GET_ENVIRONMENT_CONFIG_FAILURE,
    });
}
exports.getEnvironmentConfig = getEnvironmentConfig;
function testEmail(config) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.testEmail,
        onRequest: action_types_1.AdminTypes.TEST_EMAIL_REQUEST,
        onSuccess: action_types_1.AdminTypes.TEST_EMAIL_SUCCESS,
        onFailure: action_types_1.AdminTypes.TEST_EMAIL_FAILURE,
        params: [
            config,
        ],
    });
}
exports.testEmail = testEmail;
function testSiteURL(siteURL) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.testSiteURL,
        onRequest: action_types_1.AdminTypes.TEST_SITE_URL_REQUEST,
        onSuccess: action_types_1.AdminTypes.TEST_SITE_URL_SUCCESS,
        onFailure: action_types_1.AdminTypes.TEST_SITE_URL_FAILURE,
        params: [
            siteURL,
        ],
    });
}
exports.testSiteURL = testSiteURL;
function testS3Connection(config) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.testS3Connection,
        onRequest: action_types_1.AdminTypes.TEST_S3_REQUEST,
        onSuccess: action_types_1.AdminTypes.TEST_S3_SUCCESS,
        onFailure: action_types_1.AdminTypes.TEST_S3_FAILURE,
        params: [
            config,
        ],
    });
}
exports.testS3Connection = testS3Connection;
function invalidateCaches() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.invalidateCaches,
        onRequest: action_types_1.AdminTypes.INVALIDATE_CACHES_REQUEST,
        onSuccess: action_types_1.AdminTypes.INVALIDATE_CACHES_SUCCESS,
        onFailure: action_types_1.AdminTypes.INVALIDATE_CACHES_FAILURE,
    });
}
exports.invalidateCaches = invalidateCaches;
function recycleDatabase() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.recycleDatabase,
        onRequest: action_types_1.AdminTypes.RECYCLE_DATABASE_REQUEST,
        onSuccess: action_types_1.AdminTypes.RECYCLE_DATABASE_SUCCESS,
        onFailure: action_types_1.AdminTypes.RECYCLE_DATABASE_FAILURE,
    });
}
exports.recycleDatabase = recycleDatabase;
function createComplianceReport(job) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createComplianceReport,
        onRequest: action_types_1.AdminTypes.CREATE_COMPLIANCE_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_COMPLIANCE_REPORT, action_types_1.AdminTypes.CREATE_COMPLIANCE_SUCCESS],
        onFailure: action_types_1.AdminTypes.CREATE_COMPLIANCE_FAILURE,
        params: [
            job,
        ],
    });
}
exports.createComplianceReport = createComplianceReport;
function getComplianceReport(reportId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getComplianceReport,
        onRequest: action_types_1.AdminTypes.GET_COMPLIANCE_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_COMPLIANCE_REPORT, action_types_1.AdminTypes.GET_COMPLIANCE_SUCCESS],
        onFailure: action_types_1.AdminTypes.GET_COMPLIANCE_FAILURE,
        params: [
            reportId,
        ],
    });
}
exports.getComplianceReport = getComplianceReport;
function getComplianceReports(page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getComplianceReports,
        onRequest: action_types_1.AdminTypes.GET_COMPLIANCE_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_COMPLIANCE_REPORTS, action_types_1.AdminTypes.GET_COMPLIANCE_SUCCESS],
        onFailure: action_types_1.AdminTypes.GET_COMPLIANCE_FAILURE,
        params: [
            page,
            perPage,
        ],
    });
}
exports.getComplianceReports = getComplianceReports;
function uploadBrandImage(imageData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.uploadBrandImage,
        onRequest: action_types_1.AdminTypes.UPLOAD_BRAND_IMAGE_REQUEST,
        onSuccess: action_types_1.AdminTypes.UPLOAD_BRAND_IMAGE_SUCCESS,
        onFailure: action_types_1.AdminTypes.UPLOAD_BRAND_IMAGE_FAILURE,
        params: [
            imageData,
        ],
    });
}
exports.uploadBrandImage = uploadBrandImage;
function deleteBrandImage() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.deleteBrandImage,
        onRequest: action_types_1.AdminTypes.DELETE_BRAND_IMAGE_REQUEST,
        onSuccess: action_types_1.AdminTypes.DELETE_BRAND_IMAGE_SUCCESS,
        onFailure: action_types_1.AdminTypes.DELETE_BRAND_IMAGE_FAILURE,
    });
}
exports.deleteBrandImage = deleteBrandImage;
function getClusterStatus() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getClusterStatus,
        onRequest: action_types_1.AdminTypes.GET_CLUSTER_STATUS_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_CLUSTER_STATUS, action_types_1.AdminTypes.GET_CLUSTER_STATUS_SUCCESS],
        onFailure: action_types_1.AdminTypes.GET_CLUSTER_STATUS_FAILURE,
    });
}
exports.getClusterStatus = getClusterStatus;
function testLdap() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.testLdap,
        onRequest: action_types_1.AdminTypes.TEST_LDAP_REQUEST,
        onSuccess: action_types_1.AdminTypes.TEST_LDAP_SUCCESS,
        onFailure: action_types_1.AdminTypes.TEST_LDAP_FAILURE,
    });
}
exports.testLdap = testLdap;
function syncLdap() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.syncLdap,
        onRequest: action_types_1.AdminTypes.SYNC_LDAP_REQUEST,
        onSuccess: action_types_1.AdminTypes.SYNC_LDAP_SUCCESS,
        onFailure: action_types_1.AdminTypes.SYNC_LDAP_FAILURE,
    });
}
exports.syncLdap = syncLdap;
function getLdapGroups(page, perPage, opts) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_MAXIMUM; }
    if (opts === void 0) { opts = { q: '' }; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getLdapGroups,
        onRequest: action_types_1.AdminTypes.GET_LDAP_GROUPS_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_LDAP_GROUPS, action_types_1.AdminTypes.GET_LDAP_GROUPS_SUCCESS],
        onFailure: action_types_1.AdminTypes.GET_LDAP_GROUPS_FAILURE,
        params: [
            page,
            perPage,
            opts,
        ],
    });
}
exports.getLdapGroups = getLdapGroups;
function linkLdapGroup(key) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.AdminTypes.LINK_LDAP_GROUP_REQUEST, data: key });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.linkLdapGroup(key)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.LINK_LDAP_GROUP_FAILURE, error: error_1, data: key },
                        errors_1.logError(error_1),
                    ]));
                    return [2 /*return*/, { error: error_1 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.LINK_LDAP_GROUP_SUCCESS, data: null },
                        {
                            type: action_types_1.AdminTypes.LINKED_LDAP_GROUP,
                            data: {
                                primary_key: key,
                                name: data.display_name,
                                mattermost_group_id: data.id,
                                has_syncables: false,
                            },
                        },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.linkLdapGroup = linkLdapGroup;
function unlinkLdapGroup(key) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.AdminTypes.UNLINK_LDAP_GROUP_REQUEST, data: key });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.unlinkLdapGroup(key)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.UNLINK_LDAP_GROUP_FAILURE, error: error_2, data: key },
                        errors_1.logError(error_2),
                    ]));
                    return [2 /*return*/, { error: error_2 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.UNLINK_LDAP_GROUP_SUCCESS, data: null },
                        { type: action_types_1.AdminTypes.UNLINKED_LDAP_GROUP, data: key },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.unlinkLdapGroup = unlinkLdapGroup;
function getSamlCertificateStatus() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getSamlCertificateStatus,
        onRequest: action_types_1.AdminTypes.SAML_CERT_STATUS_REQUEST,
        onSuccess: [action_types_1.AdminTypes.RECEIVED_SAML_CERT_STATUS, action_types_1.AdminTypes.SAML_CERT_STATUS_SUCCESS],
        onFailure: action_types_1.AdminTypes.SAML_CERT_STATUS_FAILURE,
    });
}
exports.getSamlCertificateStatus = getSamlCertificateStatus;
function uploadPublicSamlCertificate(fileData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.uploadPublicSamlCertificate,
        onRequest: action_types_1.AdminTypes.UPLOAD_SAML_PUBLIC_REQUEST,
        onSuccess: action_types_1.AdminTypes.UPLOAD_SAML_PUBLIC_SUCCESS,
        onFailure: action_types_1.AdminTypes.UPLOAD_SAML_PUBLIC_FAILURE,
        params: [
            fileData,
        ],
    });
}
exports.uploadPublicSamlCertificate = uploadPublicSamlCertificate;
function uploadPrivateSamlCertificate(fileData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.uploadPrivateSamlCertificate,
        onRequest: action_types_1.AdminTypes.UPLOAD_SAML_PRIVATE_REQUEST,
        onSuccess: action_types_1.AdminTypes.UPLOAD_SAML_PRIVATE_SUCCESS,
        onFailure: action_types_1.AdminTypes.UPLOAD_SAML_PRIVATE_FAILURE,
        params: [
            fileData,
        ],
    });
}
exports.uploadPrivateSamlCertificate = uploadPrivateSamlCertificate;
function uploadPublicLdapCertificate(fileData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.uploadPublicLdapCertificate,
        onSuccess: action_types_1.AdminTypes.UPLOAD_LDAP_PUBLIC_SUCCESS,
        params: [
            fileData,
        ],
    });
}
exports.uploadPublicLdapCertificate = uploadPublicLdapCertificate;
function uploadPrivateLdapCertificate(fileData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.uploadPrivateLdapCertificate,
        onSuccess: action_types_1.AdminTypes.UPLOAD_LDAP_PRIVATE_SUCCESS,
        params: [
            fileData,
        ],
    });
}
exports.uploadPrivateLdapCertificate = uploadPrivateLdapCertificate;
function uploadIdpSamlCertificate(fileData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.uploadIdpSamlCertificate,
        onRequest: action_types_1.AdminTypes.UPLOAD_SAML_IDP_REQUEST,
        onSuccess: action_types_1.AdminTypes.UPLOAD_SAML_IDP_SUCCESS,
        onFailure: action_types_1.AdminTypes.UPLOAD_SAML_IDP_FAILURE,
        params: [
            fileData,
        ],
    });
}
exports.uploadIdpSamlCertificate = uploadIdpSamlCertificate;
function removePublicSamlCertificate() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.deletePublicSamlCertificate,
        onRequest: action_types_1.AdminTypes.DELETE_SAML_PUBLIC_REQUEST,
        onSuccess: action_types_1.AdminTypes.DELETE_SAML_PUBLIC_SUCCESS,
        onFailure: action_types_1.AdminTypes.DELETE_SAML_PUBLIC_FAILURE,
    });
}
exports.removePublicSamlCertificate = removePublicSamlCertificate;
function removePrivateSamlCertificate() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.deletePrivateSamlCertificate,
        onRequest: action_types_1.AdminTypes.DELETE_SAML_PRIVATE_REQUEST,
        onSuccess: action_types_1.AdminTypes.DELETE_SAML_PRIVATE_SUCCESS,
        onFailure: action_types_1.AdminTypes.DELETE_SAML_PRIVATE_FAILURE,
    });
}
exports.removePrivateSamlCertificate = removePrivateSamlCertificate;
function removePublicLdapCertificate() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.deletePublicLdapCertificate,
        onSuccess: action_types_1.AdminTypes.DELETE_LDAP_PUBLIC_SUCCESS,
    });
}
exports.removePublicLdapCertificate = removePublicLdapCertificate;
function removePrivateLdapCertificate() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.deletePrivateLdapCertificate,
        onSuccess: action_types_1.AdminTypes.DELETE_LDAP_PRIVATE_SUCCESS,
    });
}
exports.removePrivateLdapCertificate = removePrivateLdapCertificate;
function removeIdpSamlCertificate() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.deleteIdpSamlCertificate,
        onRequest: action_types_1.AdminTypes.DELETE_SAML_IDP_REQUEST,
        onSuccess: action_types_1.AdminTypes.DELETE_SAML_IDP_SUCCESS,
        onFailure: action_types_1.AdminTypes.DELETE_SAML_IDP_FAILURE,
    });
}
exports.removeIdpSamlCertificate = removeIdpSamlCertificate;
function testElasticsearch(config) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.testElasticsearch,
        onRequest: action_types_1.AdminTypes.TEST_ELASTICSEARCH_REQUEST,
        onSuccess: action_types_1.AdminTypes.TEST_ELASTICSEARCH_SUCCESS,
        onFailure: action_types_1.AdminTypes.TEST_ELASTICSEARCH_FAILURE,
        params: [
            config,
        ],
    });
}
exports.testElasticsearch = testElasticsearch;
function purgeElasticsearchIndexes() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.purgeElasticsearchIndexes,
        onRequest: action_types_1.AdminTypes.PURGE_ELASTICSEARCH_INDEXES_REQUEST,
        onSuccess: action_types_1.AdminTypes.PURGE_ELASTICSEARCH_INDEXES_SUCCESS,
        onFailure: action_types_1.AdminTypes.PURGE_ELASTICSEARCH_INDEXES_FAILURE,
    });
}
exports.purgeElasticsearchIndexes = purgeElasticsearchIndexes;
function uploadLicense(fileData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.uploadLicense,
        onRequest: action_types_1.AdminTypes.UPLOAD_LICENSE_REQUEST,
        onSuccess: action_types_1.AdminTypes.UPLOAD_LICENSE_SUCCESS,
        onFailure: action_types_1.AdminTypes.UPLOAD_LICENSE_FAILURE,
        params: [
            fileData,
        ],
    });
}
exports.uploadLicense = uploadLicense;
function removeLicense() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.removeLicense,
        onRequest: action_types_1.AdminTypes.REMOVE_LICENSE_REQUEST,
        onSuccess: action_types_1.AdminTypes.REMOVE_LICENSE_SUCCESS,
        onFailure: action_types_1.AdminTypes.REMOVE_LICENSE_FAILURE,
    });
}
exports.removeLicense = removeLicense;
function getAnalytics(name, teamId) {
    var _this = this;
    if (teamId === void 0) { teamId = ''; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_3, actions;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.AdminTypes.GET_ANALYTICS_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getAnalytics(name, teamId)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.GET_ANALYTICS_FAILURE, error: error_3 },
                        errors_1.logError(error_3),
                    ]));
                    return [2 /*return*/, { error: error_3 }];
                case 4:
                    actions = [{ type: action_types_1.AdminTypes.GET_ANALYTICS_SUCCESS, data: null }];
                    if (teamId === '') {
                        actions.push({ type: action_types_1.AdminTypes.RECEIVED_SYSTEM_ANALYTICS, data: data, name: name });
                    }
                    else {
                        actions.push({ type: action_types_1.AdminTypes.RECEIVED_TEAM_ANALYTICS, data: data, name: name, teamId: teamId });
                    }
                    dispatch(actions_1.batchActions(actions));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getAnalytics = getAnalytics;
function getStandardAnalytics(teamId) {
    if (teamId === void 0) { teamId = ''; }
    return getAnalytics('standard', teamId);
}
exports.getStandardAnalytics = getStandardAnalytics;
function getAdvancedAnalytics(teamId) {
    if (teamId === void 0) { teamId = ''; }
    return getAnalytics('extra_counts', teamId);
}
exports.getAdvancedAnalytics = getAdvancedAnalytics;
function getPostsPerDayAnalytics(teamId) {
    if (teamId === void 0) { teamId = ''; }
    return getAnalytics('post_counts_day', teamId);
}
exports.getPostsPerDayAnalytics = getPostsPerDayAnalytics;
function getBotPostsPerDayAnalytics(teamId) {
    if (teamId === void 0) { teamId = ''; }
    return getAnalytics('bot_post_counts_day', teamId);
}
exports.getBotPostsPerDayAnalytics = getBotPostsPerDayAnalytics;
function getUsersPerDayAnalytics(teamId) {
    if (teamId === void 0) { teamId = ''; }
    return getAnalytics('user_counts_with_posts_day', teamId);
}
exports.getUsersPerDayAnalytics = getUsersPerDayAnalytics;
function uploadPlugin(fileData, force) {
    var _this = this;
    if (force === void 0) { force = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_4;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.AdminTypes.UPLOAD_PLUGIN_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.uploadPlugin(fileData, force)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.UPLOAD_PLUGIN_FAILURE, error: error_4 },
                        errors_1.logError(error_4),
                    ]));
                    return [2 /*return*/, { error: error_4 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.UPLOAD_PLUGIN_SUCCESS, data: null },
                    ]));
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.uploadPlugin = uploadPlugin;
function installPluginFromUrl(url, force) {
    var _this = this;
    if (force === void 0) { force = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.AdminTypes.INSTALL_PLUGIN_FROM_URL_REQUEST, data: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.installPluginFromUrl(url, force)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.INSTALL_PLUGIN_FROM_URL_FAILURE, error: error_5 },
                        errors_1.logError(error_5),
                    ]));
                    return [2 /*return*/, { error: error_5 }];
                case 4:
                    dispatch({ type: action_types_1.AdminTypes.INSTALL_PLUGIN_FROM_URL_SUCCESS, data: null });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.installPluginFromUrl = installPluginFromUrl;
function getPlugins() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getPlugins,
        onRequest: action_types_1.AdminTypes.GET_PLUGIN_REQUEST,
        onSuccess: [action_types_1.AdminTypes.GET_PLUGIN_SUCCESS, action_types_1.AdminTypes.RECEIVED_PLUGINS],
        onFailure: action_types_1.AdminTypes.GET_PLUGIN_FAILURE,
    });
}
exports.getPlugins = getPlugins;
function getPluginStatuses() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getPluginStatuses,
        onRequest: action_types_1.AdminTypes.GET_PLUGIN_STATUSES_REQUEST,
        onSuccess: [action_types_1.AdminTypes.GET_PLUGIN_STATUSES_SUCCESS, action_types_1.AdminTypes.RECEIVED_PLUGIN_STATUSES],
        onFailure: action_types_1.AdminTypes.GET_PLUGIN_STATUSES_FAILURE,
    });
}
exports.getPluginStatuses = getPluginStatuses;
function removePlugin(pluginId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.AdminTypes.REMOVE_PLUGIN_REQUEST, data: pluginId });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.removePlugin(pluginId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_6, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.REMOVE_PLUGIN_FAILURE, error: error_6, data: pluginId },
                        errors_1.logError(error_6),
                    ]));
                    return [2 /*return*/, { error: error_6 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.REMOVE_PLUGIN_SUCCESS, data: null },
                        { type: action_types_1.AdminTypes.REMOVED_PLUGIN, data: pluginId },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.removePlugin = removePlugin;
function enablePlugin(pluginId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.AdminTypes.ENABLE_PLUGIN_REQUEST, data: pluginId });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.enablePlugin(pluginId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_7, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.ENABLE_PLUGIN_FAILURE, error: error_7, data: pluginId },
                        errors_1.logError(error_7),
                    ]));
                    return [2 /*return*/, { error: error_7 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.ENABLE_PLUGIN_SUCCESS, data: null },
                        { type: action_types_1.AdminTypes.ENABLED_PLUGIN, data: pluginId },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.enablePlugin = enablePlugin;
function disablePlugin(pluginId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var error_8;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.AdminTypes.DISABLE_PLUGIN_REQUEST, data: pluginId });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.disablePlugin(pluginId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_8, dispatch, getState);
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.DISABLE_PLUGIN_FAILURE, error: error_8, data: pluginId },
                        errors_1.logError(error_8),
                    ]));
                    return [2 /*return*/, { error: error_8 }];
                case 4:
                    dispatch(actions_1.batchActions([
                        { type: action_types_1.AdminTypes.DISABLE_PLUGIN_SUCCESS, data: null },
                        { type: action_types_1.AdminTypes.DISABLED_PLUGIN, data: pluginId },
                    ]));
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.disablePlugin = disablePlugin;
function getSamlMetadataFromIdp(samlMetadataURL) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getSamlMetadataFromIdp,
        onSuccess: action_types_1.AdminTypes.RECEIVED_SAML_METADATA_RESPONSE,
        params: [
            samlMetadataURL,
        ],
    });
}
exports.getSamlMetadataFromIdp = getSamlMetadataFromIdp;
function setSamlIdpCertificateFromMetadata(certData) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.setSamlIdpCertificateFromMetadata,
        onSuccess: action_types_1.AdminTypes.SET_SAML_IDP_SUCCESS,
        params: [
            certData,
        ],
    });
}
exports.setSamlIdpCertificateFromMetadata = setSamlIdpCertificateFromMetadata;
function sendWarnMetricAck(warnMetricId, forceAck) {
    var _this = this;
    return function (dispatch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    client_1.Client4.trackEvent('api', 'api_request_send_metric_ack', { warnMetricId: warnMetricId });
                    return [4 /*yield*/, client_1.Client4.sendWarnMetricAck(warnMetricId, forceAck)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { data: true }];
                case 2:
                    e_1 = _a.sent();
                    dispatch(errors_1.logError(e_1));
                    return [2 /*return*/, { error: e_1.message }];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
exports.sendWarnMetricAck = sendWarnMetricAck;
function getDataRetentionCustomPolicies(page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = 10; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_9;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getDataRetentionCustomPolicies(page, perPage)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_9, dispatch, getState);
                    dispatch({
                        type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICIES,
                        error: error_9,
                    });
                    return [2 /*return*/, { error: error_9 }];
                case 3:
                    dispatch({ type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICIES, data: data });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getDataRetentionCustomPolicies = getDataRetentionCustomPolicies;
function getDataRetentionCustomPolicy(id) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_10;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getDataRetentionCustomPolicy(id)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_10, dispatch, getState);
                    dispatch({
                        type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY,
                        error: error_10,
                    });
                    return [2 /*return*/, { error: error_10 }];
                case 3:
                    dispatch({ type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY, data: data });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getDataRetentionCustomPolicy = getDataRetentionCustomPolicy;
function getDataRetentionCustomPolicyTeams(id, page, perPage, includeTotalCount) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.TEAMS_CHUNK_SIZE; }
    if (includeTotalCount === void 0) { includeTotalCount = false; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_11;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getDataRetentionCustomPolicyTeams(id, page, perPage, includeTotalCount)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_11, dispatch, getState);
                    dispatch({
                        type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_TEAMS,
                        error: error_11,
                    });
                    return [2 /*return*/, { error: error_11 }];
                case 3:
                    dispatch({ type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_TEAMS, data: data });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getDataRetentionCustomPolicyTeams = getDataRetentionCustomPolicyTeams;
function getDataRetentionCustomPolicyChannels(id, page, perPage) {
    var _this = this;
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.TEAMS_CHUNK_SIZE; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_12;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getDataRetentionCustomPolicyChannels(id, page, perPage)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_12 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_12, dispatch, getState);
                    dispatch({
                        type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_CHANNELS,
                        error: error_12,
                    });
                    return [2 /*return*/, { error: error_12 }];
                case 3:
                    dispatch({ type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_CHANNELS, data: data });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.getDataRetentionCustomPolicyChannels = getDataRetentionCustomPolicyChannels;
function searchDataRetentionCustomPolicyTeams(id, term, opts) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_13;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.searchDataRetentionCustomPolicyTeams(id, term, opts)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_13, dispatch, getState);
                    dispatch({
                        type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_TEAMS_SEARCH,
                        error: error_13,
                    });
                    return [2 /*return*/, { error: error_13 }];
                case 3:
                    dispatch({ type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_TEAMS_SEARCH, data: data });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.searchDataRetentionCustomPolicyTeams = searchDataRetentionCustomPolicyTeams;
function searchDataRetentionCustomPolicyChannels(id, term, opts) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_14;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.searchDataRetentionCustomPolicyChannels(id, term, opts)];
                case 1:
                    data = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_14 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_14, dispatch, getState);
                    dispatch({
                        type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_SEARCH,
                        error: error_14,
                    });
                    return [2 /*return*/, { error: error_14 }];
                case 3:
                    dispatch({ type: action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_SEARCH, data: data });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.searchDataRetentionCustomPolicyChannels = searchDataRetentionCustomPolicyChannels;
function createDataRetentionCustomPolicy(policy) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createDataRetentionPolicy,
        onSuccess: action_types_1.AdminTypes.CREATE_DATA_RETENTION_CUSTOM_POLICY_SUCCESS,
        params: [
            policy,
        ],
    });
}
exports.createDataRetentionCustomPolicy = createDataRetentionCustomPolicy;
function updateDataRetentionCustomPolicy(id, policy) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.updateDataRetentionPolicy,
        onSuccess: action_types_1.AdminTypes.UPDATE_DATA_RETENTION_CUSTOM_POLICY_SUCCESS,
        params: [
            id,
            policy,
        ],
    });
}
exports.updateDataRetentionCustomPolicy = updateDataRetentionCustomPolicy;
function addDataRetentionCustomPolicyTeams(id, policy) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.addDataRetentionPolicyTeams,
        onSuccess: action_types_1.AdminTypes.ADD_DATA_RETENTION_CUSTOM_POLICY_TEAMS_SUCCESS,
        params: [
            id,
            policy,
        ],
    });
}
exports.addDataRetentionCustomPolicyTeams = addDataRetentionCustomPolicyTeams;
function removeDataRetentionCustomPolicyTeams(id, policy) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.removeDataRetentionPolicyTeams,
        onSuccess: action_types_1.AdminTypes.REMOVE_DATA_RETENTION_CUSTOM_POLICY_TEAMS_SUCCESS,
        params: [
            id,
            policy,
        ],
    });
}
exports.removeDataRetentionCustomPolicyTeams = removeDataRetentionCustomPolicyTeams;
function addDataRetentionCustomPolicyChannels(id, policy) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.addDataRetentionPolicyChannels,
        onSuccess: action_types_1.AdminTypes.ADD_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_SUCCESS,
        params: [
            id,
            policy,
        ],
    });
}
exports.addDataRetentionCustomPolicyChannels = addDataRetentionCustomPolicyChannels;
function removeDataRetentionCustomPolicyChannels(id, policy) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.removeDataRetentionPolicyChannels,
        onSuccess: action_types_1.AdminTypes.REMOVE_DATA_RETENTION_CUSTOM_POLICY_CHANNELS_SUCCESS,
        params: [
            id,
            policy,
        ],
    });
}
exports.removeDataRetentionCustomPolicyChannels = removeDataRetentionCustomPolicyChannels;
function clearDataRetentionCustomPolicyTeams() {
    return function (dispatch) {
        dispatch({ type: action_types_1.AdminTypes.CLEAR_DATA_RETENTION_CUSTOM_POLICY_TEAMS, data: {} });
        return { data: {} };
    };
}
exports.clearDataRetentionCustomPolicyTeams = clearDataRetentionCustomPolicyTeams;
function clearDataRetentionCustomPolicyChannels() {
    return function (dispatch) {
        dispatch({ type: action_types_1.AdminTypes.CLEAR_DATA_RETENTION_CUSTOM_POLICY_CHANNELS, data: {} });
        return { data: {} };
    };
}
exports.clearDataRetentionCustomPolicyChannels = clearDataRetentionCustomPolicyChannels;
//# sourceMappingURL=admin.js.map