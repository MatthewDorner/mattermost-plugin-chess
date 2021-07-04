"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseStage = exports.AuthorType = exports.HostingType = void 0;
var HostingType;
(function (HostingType) {
    HostingType["OnPrem"] = "on-prem";
    HostingType["Cloud"] = "cloud";
})(HostingType = exports.HostingType || (exports.HostingType = {}));
var AuthorType;
(function (AuthorType) {
    AuthorType["Mattermost"] = "mattermost";
    AuthorType["Partner"] = "partner";
    AuthorType["Community"] = "community";
})(AuthorType = exports.AuthorType || (exports.AuthorType = {}));
var ReleaseStage;
(function (ReleaseStage) {
    ReleaseStage["Production"] = "production";
    ReleaseStage["Beta"] = "beta";
    ReleaseStage["Experimental"] = "experimental";
})(ReleaseStage = exports.ReleaseStage || (exports.ReleaseStage = {}));
//# sourceMappingURL=plugins.js.map