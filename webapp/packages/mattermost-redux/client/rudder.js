"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RudderTelemetryHandler = exports.rudderAnalytics = void 0;
var tslib_1 = require("tslib");
// As per rudder-sdk-js documentation, import this only once and use like a singleton.
// See https://github.com/rudderlabs/rudder-sdk-js#step-1-install-rudderstack-using-the-code-snippet
var rudderAnalytics = tslib_1.__importStar(require("rudder-sdk-js"));
exports.rudderAnalytics = rudderAnalytics;
var RudderTelemetryHandler = /** @class */ (function () {
    function RudderTelemetryHandler() {
    }
    RudderTelemetryHandler.prototype.trackEvent = function (userId, userRoles, category, event, props) {
        var properties = Object.assign({
            category: category,
            type: event,
            user_actual_role: userRoles,
            user_actual_id: userId,
        }, props);
        var options = {
            context: {
                ip: '0.0.0.0',
            },
            page: {
                path: '',
                referrer: '',
                search: '',
                title: '',
                url: '',
            },
            anonymousId: '00000000000000000000000000',
        };
        rudderAnalytics.track('event', properties, options);
    };
    RudderTelemetryHandler.prototype.pageVisited = function (userId, userRoles, category, name) {
        rudderAnalytics.page(category, name, {
            path: '',
            referrer: '',
            search: '',
            title: '',
            url: '',
            user_actual_role: userRoles,
            user_actual_id: userId,
        }, {
            context: {
                ip: '0.0.0.0',
            },
            anonymousId: '00000000000000000000000000',
        });
    };
    return RudderTelemetryHandler;
}());
exports.RudderTelemetryHandler = RudderTelemetryHandler;
//# sourceMappingURL=rudder.js.map