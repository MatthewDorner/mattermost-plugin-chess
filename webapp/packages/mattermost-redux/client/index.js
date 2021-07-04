"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER_X_VERSION_ID = exports.DEFAULT_LIMIT_BEFORE = exports.DEFAULT_LIMIT_AFTER = exports.Client4 = void 0;
var tslib_1 = require("tslib");
var client4_1 = tslib_1.__importStar(require("./client4"));
Object.defineProperty(exports, "DEFAULT_LIMIT_AFTER", { enumerable: true, get: function () { return client4_1.DEFAULT_LIMIT_AFTER; } });
Object.defineProperty(exports, "DEFAULT_LIMIT_BEFORE", { enumerable: true, get: function () { return client4_1.DEFAULT_LIMIT_BEFORE; } });
Object.defineProperty(exports, "HEADER_X_VERSION_ID", { enumerable: true, get: function () { return client4_1.HEADER_X_VERSION_ID; } });
var Client4 = new client4_1.default();
exports.Client4 = Client4;
//# sourceMappingURL=index.js.map