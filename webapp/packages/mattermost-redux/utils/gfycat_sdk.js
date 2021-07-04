"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var gfycat_sdk_1 = tslib_1.__importDefault(require("gfycat-sdk"));
var defaultKey = '2_KtH_W5';
var defaultSecret = '3wLVZPiswc3DnaiaFoLkDvB4X0IV6CpMkj4tf2inJRsBY6-FnkT08zGmppWFgeof';
var activeKey = null;
var activeSecret = null;
var instance = null;
function gfycatSdk(key, secret) {
    if (instance && activeKey === key && activeSecret === secret) {
        return instance;
    }
    if (!key || !secret) {
        instance = new gfycat_sdk_1.default({ client_id: defaultKey, client_secret: defaultSecret });
        return instance;
    }
    activeKey = key;
    activeSecret = secret;
    instance = new gfycat_sdk_1.default({ client_id: key, client_secret: secret });
    return instance;
}
exports.default = gfycatSdk;
//# sourceMappingURL=gfycat_sdk.js.map