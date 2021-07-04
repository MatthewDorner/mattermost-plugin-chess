"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var channels_1 = tslib_1.__importDefault(require("./channels"));
var files_1 = tslib_1.__importDefault(require("./files"));
var general_1 = tslib_1.__importDefault(require("./general"));
var posts_1 = tslib_1.__importDefault(require("./posts"));
var teams_1 = tslib_1.__importDefault(require("./teams"));
var users_1 = tslib_1.__importDefault(require("./users"));
var admin_1 = tslib_1.__importDefault(require("./admin"));
var jobs_1 = tslib_1.__importDefault(require("./jobs"));
var search_1 = tslib_1.__importDefault(require("./search"));
var roles_1 = tslib_1.__importDefault(require("./roles"));
exports.default = redux_1.combineReducers({
    channels: channels_1.default,
    files: files_1.default,
    general: general_1.default,
    posts: posts_1.default,
    teams: teams_1.default,
    users: users_1.default,
    admin: admin_1.default,
    jobs: jobs_1.default,
    search: search_1.default,
    roles: roles_1.default,
});
//# sourceMappingURL=index.js.map