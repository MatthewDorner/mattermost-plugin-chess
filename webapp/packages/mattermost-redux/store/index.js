"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable global-require, no-process-env */
var config = process.env.NODE_ENV === 'production' ? require('./configureStore.prod').default : require('./configureStore.dev').default;
exports.default = config;
//# sourceMappingURL=index.js.map