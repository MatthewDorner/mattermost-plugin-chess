"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAppBindings = void 0;
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var action_types_1 = require("../action_types");
var client_1 = require("../client");
var helpers_1 = require("./helpers");
// This file's contents belong to the Apps Framework feature.
// Apps Framework feature is experimental, and the contents of this file are
// susceptible to breaking changes without pushing the major version of this package.
function fetchAppBindings(userID, channelID) {
    return helpers_1.bindClientFunc({
        clientFunc: function () { return client_1.Client4.getAppsBindings(userID, channelID); },
        onSuccess: action_types_1.AppsTypes.RECEIVED_APP_BINDINGS,
    });
}
exports.fetchAppBindings = fetchAppBindings;
//# sourceMappingURL=apps.js.map