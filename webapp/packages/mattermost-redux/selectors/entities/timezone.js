"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTimezoneEnabled = exports.getUserTimezone = void 0;
var tslib_1 = require("tslib");
function getUserTimezone(state, id) {
    var profile = state.entities.users.profiles[id];
    if (profile && profile.timezone) {
        return tslib_1.__assign(tslib_1.__assign({}, profile.timezone), { useAutomaticTimezone: profile.timezone.useAutomaticTimezone === 'true' });
    }
    return {
        useAutomaticTimezone: true,
        automaticTimezone: '',
        manualTimezone: '',
    };
}
exports.getUserTimezone = getUserTimezone;
function isTimezoneEnabled(state) {
    var config = state.entities.general.config;
    return config.ExperimentalTimezone === 'true';
}
exports.isTimezoneEnabled = isTimezoneEnabled;
//# sourceMappingURL=timezone.js.map