"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBindings = exports.fillAndTrimBindingsInformation = void 0;
var apps_1 = require("../constants/apps");
// fillAndTrimBindingsInformation does:
// - Build the location (e.g. channel_header/binding)
// - Inherit app calls
// - Inherit app ids
// - Trim invalid bindings (do not have an app call or app id at the leaf)
function fillAndTrimBindingsInformation(binding) {
    var _a, _b, _c, _d, _e;
    if (!binding) {
        return;
    }
    (_a = binding.bindings) === null || _a === void 0 ? void 0 : _a.forEach(function (b) {
        // Propagate id down if not defined
        if (!b.app_id) {
            b.app_id = binding.app_id;
        }
        // Compose location
        b.location = binding.location + '/' + b.location;
        // Propagate call down if not defined
        if (!b.call) {
            b.call = binding.call;
        }
        fillAndTrimBindingsInformation(b);
    });
    // Trim branches without app_id
    if (!binding.app_id) {
        binding.bindings = (_b = binding.bindings) === null || _b === void 0 ? void 0 : _b.filter(function (v) { return v.app_id; });
    }
    // Trim branches without calls
    if (!binding.call) {
        binding.bindings = (_c = binding.bindings) === null || _c === void 0 ? void 0 : _c.filter(function (v) { return v.call; });
    }
    // Pull up app_id if needed
    if (((_d = binding.bindings) === null || _d === void 0 ? void 0 : _d.length) && !binding.app_id) {
        binding.app_id = binding.bindings[0].app_id;
    }
    // Pull up call if needed
    if (((_e = binding.bindings) === null || _e === void 0 ? void 0 : _e.length) && !binding.call) {
        binding.call = binding.bindings[0].call;
    }
}
exports.fillAndTrimBindingsInformation = fillAndTrimBindingsInformation;
function validateBindings(binding) {
    var _a;
    filterInvalidChannelHeaderBindings(binding);
    filterInvalidCommands(binding);
    filterInvalidPostMenuBindings(binding);
    (_a = binding === null || binding === void 0 ? void 0 : binding.bindings) === null || _a === void 0 ? void 0 : _a.forEach(fillAndTrimBindingsInformation);
}
exports.validateBindings = validateBindings;
// filterInvalidCommands remove commands without a label
function filterInvalidCommands(binding) {
    var _a;
    if (!binding) {
        return;
    }
    var isValidCommand = function (b) {
        return Boolean(b.label);
    };
    var validateCommand = function (b) {
        var _a, _b;
        b.bindings = (_a = b.bindings) === null || _a === void 0 ? void 0 : _a.filter(isValidCommand);
        (_b = b.bindings) === null || _b === void 0 ? void 0 : _b.forEach(validateCommand);
    };
    (_a = binding.bindings) === null || _a === void 0 ? void 0 : _a.filter(function (b) { return b.location === apps_1.AppBindingLocations.COMMAND; }).forEach(validateCommand);
}
// filterInvalidChannelHeaderBindings remove bindings
// without a label or without an icon.
function filterInvalidChannelHeaderBindings(binding) {
    var _a;
    if (!binding) {
        return;
    }
    var isValidChannelHeaderBindings = function (b) {
        return Boolean(b.icon && b.label);
    };
    var validateChannelHeaderBinding = function (b) {
        var _a, _b;
        b.bindings = (_a = b.bindings) === null || _a === void 0 ? void 0 : _a.filter(isValidChannelHeaderBindings);
        (_b = b.bindings) === null || _b === void 0 ? void 0 : _b.forEach(validateChannelHeaderBinding);
    };
    (_a = binding.bindings) === null || _a === void 0 ? void 0 : _a.filter(function (b) { return b.location === apps_1.AppBindingLocations.CHANNEL_HEADER_ICON; }).forEach(validateChannelHeaderBinding);
}
// filterInvalidPostMenuBindings remove bindings
// without a label.
function filterInvalidPostMenuBindings(binding) {
    var _a;
    if (!binding) {
        return;
    }
    var isValidPostMenuBinding = function (b) {
        return Boolean(b.label);
    };
    var validatePostMenuBinding = function (b) {
        var _a, _b;
        b.bindings = (_a = b.bindings) === null || _a === void 0 ? void 0 : _a.filter(isValidPostMenuBinding);
        (_b = b.bindings) === null || _b === void 0 ? void 0 : _b.forEach(validatePostMenuBinding);
    };
    (_a = binding.bindings) === null || _a === void 0 ? void 0 : _a.filter(function (b) { return b.location === apps_1.AppBindingLocations.POST_MENU_ITEM; }).forEach(validatePostMenuBinding);
}
//# sourceMappingURL=apps.js.map