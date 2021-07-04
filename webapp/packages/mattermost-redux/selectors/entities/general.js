"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerVersion = exports.getManagedResourcePaths = exports.getAutolinkedUrlSchemes = exports.canDownloadFilesOnMobile = exports.canUploadFilesOnMobile = exports.hasNewPermissions = exports.isCompatibleWithJoinViewTeamPermissions = exports.getSubscriptionStats = exports.warnMetricsStatus = exports.getCurrentUrl = exports.getSupportedTimezones = exports.getLicense = exports.getFeatureFlagValue = exports.getConfig = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var constants_1 = require("../../constants");
var helpers_1 = require("../../utils/helpers");
function getConfig(state) {
    return state.entities.general.config;
}
exports.getConfig = getConfig;
/**
 * Safely get value of a specific or known FeatureFlag
 */
function getFeatureFlagValue(state, key) {
    var _a;
    return (_a = getConfig(state)) === null || _a === void 0 ? void 0 : _a["FeatureFlag" + key];
}
exports.getFeatureFlagValue = getFeatureFlagValue;
function getLicense(state) {
    return state.entities.general.license;
}
exports.getLicense = getLicense;
function getSupportedTimezones(state) {
    return state.entities.general.timezones;
}
exports.getSupportedTimezones = getSupportedTimezones;
function getCurrentUrl(state) {
    return state.entities.general.credentials.url;
}
exports.getCurrentUrl = getCurrentUrl;
function warnMetricsStatus(state) {
    return state.entities.general.warnMetricsStatus;
}
exports.warnMetricsStatus = warnMetricsStatus;
function getSubscriptionStats(state) {
    return state.entities.cloud.subscriptionStats;
}
exports.getSubscriptionStats = getSubscriptionStats;
function isCompatibleWithJoinViewTeamPermissions(state) {
    var version = state.entities.general.serverVersion;
    return helpers_1.isMinimumServerVersion(version, 5, 10, 0) ||
        (version.indexOf('dev') !== -1 && helpers_1.isMinimumServerVersion(version, 5, 8, 0)) ||
        (version.match(/^5.8.\d.\d\d\d\d.*$/) !== null && helpers_1.isMinimumServerVersion(version, 5, 8, 0));
}
exports.isCompatibleWithJoinViewTeamPermissions = isCompatibleWithJoinViewTeamPermissions;
function hasNewPermissions(state) {
    var version = state.entities.general.serverVersion;
    // FIXME This must be changed to 4, 9, 0 before we generate the 4.9.0 release
    return helpers_1.isMinimumServerVersion(version, 4, 9, 0) ||
        (version.indexOf('dev') !== -1 && helpers_1.isMinimumServerVersion(version, 4, 8, 0)) ||
        (version.match(/^4.8.\d.\d\d\d\d.*$/) !== null && helpers_1.isMinimumServerVersion(version, 4, 8, 0));
}
exports.hasNewPermissions = hasNewPermissions;
exports.canUploadFilesOnMobile = reselect_1.createSelector(getConfig, getLicense, function (config, license) {
    // Defaults to true if either setting doesn't exist
    return config.EnableFileAttachments !== 'false' &&
        (license.IsLicensed === 'false' || license.Compliance === 'false' || config.EnableMobileFileUpload !== 'false');
});
exports.canDownloadFilesOnMobile = reselect_1.createSelector(getConfig, getLicense, function (config, license) {
    // Defaults to true if the setting doesn't exist
    return license.IsLicensed === 'false' || license.Compliance === 'false' || config.EnableMobileFileDownload !== 'false';
});
exports.getAutolinkedUrlSchemes = reselect_1.createSelector(getConfig, function (config) {
    if (!config.CustomUrlSchemes) {
        return constants_1.General.DEFAULT_AUTOLINKED_URL_SCHEMES;
    }
    return tslib_1.__spread(constants_1.General.DEFAULT_AUTOLINKED_URL_SCHEMES, config.CustomUrlSchemes.split(','));
});
exports.getManagedResourcePaths = reselect_1.createSelector(getConfig, function (config) {
    if (!config.ManagedResourcePaths) {
        return [];
    }
    return config.ManagedResourcePaths.split(',').map(function (path) { return path.trim(); });
});
var getServerVersion = function (state) {
    return state.entities.general.serverVersion;
};
exports.getServerVersion = getServerVersion;
//# sourceMappingURL=general.js.map