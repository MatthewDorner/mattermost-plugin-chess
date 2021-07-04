"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function getLogs(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_LOGS_REQUEST, action_types_1.AdminTypes.GET_LOGS_SUCCESS, action_types_1.AdminTypes.GET_LOGS_FAILURE, state, action);
}
function getAudits(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_AUDITS_REQUEST, action_types_1.AdminTypes.GET_AUDITS_SUCCESS, action_types_1.AdminTypes.GET_AUDITS_FAILURE, state, action);
}
function getConfig(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_CONFIG_REQUEST, action_types_1.AdminTypes.GET_CONFIG_SUCCESS, action_types_1.AdminTypes.GET_CONFIG_FAILURE, state, action);
}
function updateConfig(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.UPDATE_CONFIG_REQUEST, action_types_1.AdminTypes.UPDATE_CONFIG_SUCCESS, action_types_1.AdminTypes.UPDATE_CONFIG_FAILURE, state, action);
}
function reloadConfig(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.RELOAD_CONFIG_REQUEST, action_types_1.AdminTypes.RELOAD_CONFIG_SUCCESS, action_types_1.AdminTypes.RELOAD_CONFIG_FAILURE, state, action);
}
function getEnvironmentConfig(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_ENVIRONMENT_CONFIG_REQUEST, action_types_1.AdminTypes.GET_ENVIRONMENT_CONFIG_SUCCESS, action_types_1.AdminTypes.GET_ENVIRONMENT_CONFIG_FAILURE, state, action);
}
function testEmail(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.TEST_EMAIL_REQUEST, action_types_1.AdminTypes.TEST_EMAIL_SUCCESS, action_types_1.AdminTypes.TEST_EMAIL_FAILURE, state, action);
}
function testSiteURL(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.TEST_SITE_URL_REQUEST, action_types_1.AdminTypes.TEST_SITE_URL_SUCCESS, action_types_1.AdminTypes.TEST_SITE_URL_FAILURE, state, action);
}
function testS3Connection(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.TEST_S3_REQUEST, action_types_1.AdminTypes.TEST_S3_SUCCESS, action_types_1.AdminTypes.TEST_S3_FAILURE, state, action);
}
function invalidateCaches(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.INVALIDATE_CACHES_REQUEST, action_types_1.AdminTypes.INVALIDATE_CACHES_SUCCESS, action_types_1.AdminTypes.INVALIDATE_CACHES_FAILURE, state, action);
}
function recycleDatabase(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.RECYCLE_DATABASE_REQUEST, action_types_1.AdminTypes.RECYCLE_DATABASE_SUCCESS, action_types_1.AdminTypes.RECYCLE_DATABASE_FAILURE, state, action);
}
function createCompliance(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.CREATE_COMPLIANCE_REQUEST, action_types_1.AdminTypes.CREATE_COMPLIANCE_SUCCESS, action_types_1.AdminTypes.CREATE_COMPLIANCE_FAILURE, state, action);
}
function getCompliance(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_COMPLIANCE_REQUEST, action_types_1.AdminTypes.GET_COMPLIANCE_SUCCESS, action_types_1.AdminTypes.GET_COMPLIANCE_FAILURE, state, action);
}
function uploadBrandImage(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.UPLOAD_BRAND_IMAGE_REQUEST, action_types_1.AdminTypes.UPLOAD_BRAND_IMAGE_SUCCESS, action_types_1.AdminTypes.UPLOAD_BRAND_IMAGE_FAILURE, state, action);
}
function deleteBrandImage(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.DELETE_BRAND_IMAGE_REQUEST, action_types_1.AdminTypes.DELETE_BRAND_IMAGE_SUCCESS, action_types_1.AdminTypes.DELETE_BRAND_IMAGE_FAILURE, state, action);
}
function getClusterStatus(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_CLUSTER_STATUS_REQUEST, action_types_1.AdminTypes.GET_CLUSTER_STATUS_SUCCESS, action_types_1.AdminTypes.GET_CLUSTER_STATUS_FAILURE, state, action);
}
function testLdap(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.TEST_LDAP_REQUEST, action_types_1.AdminTypes.TEST_LDAP_SUCCESS, action_types_1.AdminTypes.TEST_LDAP_FAILURE, state, action);
}
function syncLdap(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.SYNC_LDAP_REQUEST, action_types_1.AdminTypes.SYNC_LDAP_SUCCESS, action_types_1.AdminTypes.SYNC_LDAP_FAILURE, state, action);
}
function getLdapGroups(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_LDAP_GROUPS_REQUEST, action_types_1.AdminTypes.GET_LDAP_GROUPS_SUCCESS, action_types_1.AdminTypes.GET_LDAP_GROUPS_FAILURE, state, action);
}
function linkLdapGroup(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.LINK_LDAP_GROUP_REQUEST, action_types_1.AdminTypes.LINK_LDAP_GROUP_SUCCESS, action_types_1.AdminTypes.LINK_LDAP_GROUP_FAILURE, state, action);
}
function unlinkLdapGroup(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.UNLINK_LDAP_GROUP_REQUEST, action_types_1.AdminTypes.UNLINK_LDAP_GROUP_SUCCESS, action_types_1.AdminTypes.UNLINK_LDAP_GROUP_FAILURE, state, action);
}
function getSamlCertificateStatus(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.SAML_CERT_STATUS_REQUEST, action_types_1.AdminTypes.SAML_CERT_STATUS_SUCCESS, action_types_1.AdminTypes.SAML_CERT_STATUS_FAILURE, state, action);
}
function uploadPublicSamlCertificate(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.UPLOAD_SAML_PUBLIC_REQUEST, action_types_1.AdminTypes.UPLOAD_SAML_PUBLIC_SUCCESS, action_types_1.AdminTypes.UPLOAD_SAML_PUBLIC_FAILURE, state, action);
}
function uploadPrivateSamlCertificate(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.UPLOAD_SAML_PRIVATE_REQUEST, action_types_1.AdminTypes.UPLOAD_SAML_PRIVATE_SUCCESS, action_types_1.AdminTypes.UPLOAD_SAML_PRIVATE_FAILURE, state, action);
}
function uploadIdpSamlCertificate(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.UPLOAD_SAML_IDP_REQUEST, action_types_1.AdminTypes.UPLOAD_SAML_IDP_SUCCESS, action_types_1.AdminTypes.UPLOAD_SAML_IDP_FAILURE, state, action);
}
function removePublicSamlCertificate(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.DELETE_SAML_PUBLIC_REQUEST, action_types_1.AdminTypes.DELETE_SAML_PUBLIC_SUCCESS, action_types_1.AdminTypes.DELETE_SAML_PUBLIC_FAILURE, state, action);
}
function removePrivateSamlCertificate(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.DELETE_SAML_PRIVATE_REQUEST, action_types_1.AdminTypes.DELETE_SAML_PRIVATE_SUCCESS, action_types_1.AdminTypes.DELETE_SAML_PRIVATE_FAILURE, state, action);
}
function removeIdpSamlCertificate(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.DELETE_SAML_IDP_REQUEST, action_types_1.AdminTypes.DELETE_SAML_IDP_SUCCESS, action_types_1.AdminTypes.DELETE_SAML_IDP_FAILURE, state, action);
}
function testElasticsearch(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.TEST_ELASTICSEARCH_REQUEST, action_types_1.AdminTypes.TEST_ELASTICSEARCH_SUCCESS, action_types_1.AdminTypes.TEST_ELASTICSEARCH_FAILURE, state, action);
}
function purgeElasticsearchIndexes(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.PURGE_ELASTICSEARCH_INDEXES_REQUEST, action_types_1.AdminTypes.PURGE_ELASTICSEARCH_INDEXES_SUCCESS, action_types_1.AdminTypes.PURGE_ELASTICSEARCH_INDEXES_FAILURE, state, action);
}
function uploadLicense(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.UPLOAD_LICENSE_REQUEST, action_types_1.AdminTypes.UPLOAD_LICENSE_SUCCESS, action_types_1.AdminTypes.UPLOAD_LICENSE_FAILURE, state, action);
}
function removeLicense(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.REMOVE_LICENSE_REQUEST, action_types_1.AdminTypes.REMOVE_LICENSE_SUCCESS, action_types_1.AdminTypes.REMOVE_LICENSE_FAILURE, state, action);
}
function getAnalytics(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_ANALYTICS_REQUEST, action_types_1.AdminTypes.GET_ANALYTICS_SUCCESS, action_types_1.AdminTypes.GET_ANALYTICS_FAILURE, state, action);
}
function uploadPlugin(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.UPLOAD_PLUGIN_REQUEST, action_types_1.AdminTypes.UPLOAD_PLUGIN_SUCCESS, action_types_1.AdminTypes.UPLOAD_PLUGIN_FAILURE, state, action);
}
function installPluginFromUrl(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.INSTALL_PLUGIN_FROM_URL_REQUEST, action_types_1.AdminTypes.INSTALL_PLUGIN_FROM_URL_SUCCESS, action_types_1.AdminTypes.INSTALL_PLUGIN_FROM_URL_FAILURE, state, action);
}
function getPlugins(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_PLUGIN_REQUEST, action_types_1.AdminTypes.GET_PLUGIN_SUCCESS, action_types_1.AdminTypes.GET_PLUGIN_FAILURE, state, action);
}
function getPluginStatuses(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.GET_PLUGIN_STATUSES_REQUEST, action_types_1.AdminTypes.GET_PLUGIN_STATUSES_SUCCESS, action_types_1.AdminTypes.GET_PLUGIN_STATUSES_FAILURE, state, action);
}
function removePlugin(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.REMOVE_PLUGIN_REQUEST, action_types_1.AdminTypes.REMOVE_PLUGIN_SUCCESS, action_types_1.AdminTypes.REMOVE_PLUGIN_FAILURE, state, action);
}
function enablePlugin(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.ENABLE_PLUGIN_REQUEST, action_types_1.AdminTypes.ENABLE_PLUGIN_SUCCESS, action_types_1.AdminTypes.ENABLE_PLUGIN_FAILURE, state, action);
}
function disablePlugin(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.AdminTypes.DISABLE_PLUGIN_REQUEST, action_types_1.AdminTypes.DISABLE_PLUGIN_SUCCESS, action_types_1.AdminTypes.DISABLE_PLUGIN_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    getLogs: getLogs,
    getAudits: getAudits,
    getConfig: getConfig,
    updateConfig: updateConfig,
    reloadConfig: reloadConfig,
    getEnvironmentConfig: getEnvironmentConfig,
    testEmail: testEmail,
    testSiteURL: testSiteURL,
    testS3Connection: testS3Connection,
    invalidateCaches: invalidateCaches,
    recycleDatabase: recycleDatabase,
    createCompliance: createCompliance,
    getCompliance: getCompliance,
    uploadBrandImage: uploadBrandImage,
    deleteBrandImage: deleteBrandImage,
    getClusterStatus: getClusterStatus,
    testLdap: testLdap,
    syncLdap: syncLdap,
    getLdapGroups: getLdapGroups,
    linkLdapGroup: linkLdapGroup,
    unlinkLdapGroup: unlinkLdapGroup,
    getSamlCertificateStatus: getSamlCertificateStatus,
    uploadPublicSamlCertificate: uploadPublicSamlCertificate,
    uploadPrivateSamlCertificate: uploadPrivateSamlCertificate,
    uploadIdpSamlCertificate: uploadIdpSamlCertificate,
    removePublicSamlCertificate: removePublicSamlCertificate,
    removePrivateSamlCertificate: removePrivateSamlCertificate,
    removeIdpSamlCertificate: removeIdpSamlCertificate,
    testElasticsearch: testElasticsearch,
    purgeElasticsearchIndexes: purgeElasticsearchIndexes,
    uploadLicense: uploadLicense,
    removeLicense: removeLicense,
    getAnalytics: getAnalytics,
    uploadPlugin: uploadPlugin,
    installPluginFromUrl: installPluginFromUrl,
    getPlugins: getPlugins,
    getPluginStatuses: getPluginStatuses,
    removePlugin: removePlugin,
    enablePlugin: enablePlugin,
    disablePlugin: disablePlugin,
});
//# sourceMappingURL=admin.js.map