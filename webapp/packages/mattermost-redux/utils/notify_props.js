"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailInterval = void 0;
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var constants_1 = require("../constants");
function getEmailInterval(enableEmailNotification, enableEmailBatching, emailIntervalPreference) {
    var INTERVAL_NEVER = constants_1.Preferences.INTERVAL_NEVER, INTERVAL_IMMEDIATE = constants_1.Preferences.INTERVAL_IMMEDIATE, INTERVAL_FIFTEEN_MINUTES = constants_1.Preferences.INTERVAL_FIFTEEN_MINUTES, INTERVAL_HOUR = constants_1.Preferences.INTERVAL_HOUR;
    var validValuesWithEmailBatching = [INTERVAL_IMMEDIATE, INTERVAL_NEVER, INTERVAL_FIFTEEN_MINUTES, INTERVAL_HOUR];
    var validValuesWithoutEmailBatching = [INTERVAL_IMMEDIATE, INTERVAL_NEVER];
    if (!enableEmailNotification) {
        return INTERVAL_NEVER;
    }
    else if (enableEmailBatching && validValuesWithEmailBatching.indexOf(emailIntervalPreference) === -1) {
        // When email batching is enabled, the default interval is 15 minutes
        return INTERVAL_FIFTEEN_MINUTES;
    }
    else if (!enableEmailBatching && validValuesWithoutEmailBatching.indexOf(emailIntervalPreference) === -1) {
        // When email batching is not enabled, the default interval is immediately
        return INTERVAL_IMMEDIATE;
    }
    else if (enableEmailNotification && emailIntervalPreference === INTERVAL_NEVER) {
        // When email notification is enabled, the default interval is immediately
        return INTERVAL_IMMEDIATE;
    }
    return emailIntervalPreference;
}
exports.getEmailInterval = getEmailInterval;
//# sourceMappingURL=notify_props.js.map