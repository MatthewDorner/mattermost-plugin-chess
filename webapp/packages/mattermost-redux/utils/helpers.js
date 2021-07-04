"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryString = exports.isEmail = exports.generateId = exports.isMinimumServerVersion = exports.createShallowSelector = exports.createIdsSelector = exports.memoizeResult = void 0;
var tslib_1 = require("tslib");
var reselect = tslib_1.__importStar(require("reselect"));
var shallow_equals_1 = tslib_1.__importDefault(require("shallow-equals"));
// eslint-disable-next-line @typescript-eslint/ban-types
function memoizeResult(func) {
    var lastArgs = null;
    var lastResult = null;
    // we reference arguments instead of spreading them for performance reasons
    return function memoizedFunc() {
        if (!shallow_equals_1.default(lastArgs, arguments)) { //eslint-disable-line prefer-rest-params
            //eslint-disable-line prefer-rest-params
            // apply arguments instead of spreading for performance.
            var result = Reflect.apply(func, null, arguments); //eslint-disable-line prefer-rest-params
            if (!shallow_equals_1.default(lastResult, result)) {
                lastResult = result;
            }
        }
        lastArgs = arguments; //eslint-disable-line prefer-rest-params
        return lastResult;
    };
}
exports.memoizeResult = memoizeResult;
// Use this selector when you want a shallow comparison of the arguments and you want to memoize the result
// try and use this only when your selector returns an array of ids
exports.createIdsSelector = reselect.createSelectorCreator(memoizeResult);
// Use this selector when you want a shallow comparison of the arguments and you don't need to memoize the result
exports.createShallowSelector = reselect.createSelectorCreator(reselect.defaultMemoize, shallow_equals_1.default);
// isMinimumServerVersion will return true if currentVersion is equal to higher or than the
// the provided minimum version. A non-equal major version will ignore minor and dot
// versions, and a non-equal minor version will ignore dot version.
// currentVersion is a string, e.g '4.6.0'
// minMajorVersion, minMinorVersion, minDotVersion are integers
var isMinimumServerVersion = function (currentVersion, minMajorVersion, minMinorVersion, minDotVersion) {
    if (minMajorVersion === void 0) { minMajorVersion = 0; }
    if (minMinorVersion === void 0) { minMinorVersion = 0; }
    if (minDotVersion === void 0) { minDotVersion = 0; }
    if (!currentVersion || typeof currentVersion !== 'string') {
        return false;
    }
    var split = currentVersion.split('.');
    var major = parseInt(split[0], 10);
    var minor = parseInt(split[1] || '0', 10);
    var dot = parseInt(split[2] || '0', 10);
    if (major > minMajorVersion) {
        return true;
    }
    if (major < minMajorVersion) {
        return false;
    }
    // Major version is equal, check minor
    if (minor > minMinorVersion) {
        return true;
    }
    if (minor < minMinorVersion) {
        return false;
    }
    // Minor version is equal, check dot
    if (dot > minDotVersion) {
        return true;
    }
    if (dot < minDotVersion) {
        return false;
    }
    // Dot version is equal
    return true;
};
exports.isMinimumServerVersion = isMinimumServerVersion;
// Generates a RFC-4122 version 4 compliant globally unique identifier.
function generateId() {
    // implementation taken from http://stackoverflow.com/a/2117523
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    id = id.replace(/[xy]/g, function (c) {
        var r = Math.floor(Math.random() * 16);
        var v;
        if (c === 'x') {
            v = r;
        }
        else {
            // eslint-disable-next-line no-mixed-operators
            v = r & 0x3 | 0x8;
        }
        return v.toString(16);
    });
    return id;
}
exports.generateId = generateId;
function isEmail(email) {
    // writing a regex to match all valid email addresses is really, really hard. (see http://stackoverflow.com/a/201378)
    // this regex ensures:
    // - at least one character that is not a space, comma, or @ symbol
    // - followed by a single @ symbol
    // - followed by at least one character that is not a space, comma, or @ symbol
    // this prevents <Outlook Style> outlook.style@domain.com addresses and multiple comma-separated addresses from being accepted
    return (/^[^ ,@]+@[^ ,@]+$/).test(email);
}
exports.isEmail = isEmail;
function buildQueryString(parameters) {
    var keys = Object.keys(parameters);
    if (keys.length === 0) {
        return '';
    }
    var query = '?';
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        query += key + '=' + encodeURIComponent(parameters[key]);
        if (i < keys.length - 1) {
            query += '&';
        }
    }
    return query;
}
exports.buildQueryString = buildQueryString;
//# sourceMappingURL=helpers.js.map