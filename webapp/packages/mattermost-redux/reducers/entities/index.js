"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var channels_1 = tslib_1.__importDefault(require("./channels"));
var general_1 = tslib_1.__importDefault(require("./general"));
var users_1 = tslib_1.__importDefault(require("./users"));
var teams_1 = tslib_1.__importDefault(require("./teams"));
var posts_1 = tslib_1.__importDefault(require("./posts"));
var files_1 = tslib_1.__importDefault(require("./files"));
var preferences_1 = tslib_1.__importDefault(require("./preferences"));
var typing_1 = tslib_1.__importDefault(require("./typing"));
var integrations_1 = tslib_1.__importDefault(require("./integrations"));
var emojis_1 = tslib_1.__importDefault(require("./emojis"));
var gifs_1 = tslib_1.__importDefault(require("./gifs"));
var admin_1 = tslib_1.__importDefault(require("./admin"));
var jobs_1 = tslib_1.__importDefault(require("./jobs"));
var search_1 = tslib_1.__importDefault(require("./search"));
var roles_1 = tslib_1.__importDefault(require("./roles"));
var schemes_1 = tslib_1.__importDefault(require("./schemes"));
var groups_1 = tslib_1.__importDefault(require("./groups"));
var bots_1 = tslib_1.__importDefault(require("./bots"));
var channel_categories_1 = tslib_1.__importDefault(require("./channel_categories"));
var apps_1 = tslib_1.__importDefault(require("./apps"));
var cloud_1 = tslib_1.__importDefault(require("./cloud"));
var threads_1 = tslib_1.__importDefault(require("./threads"));
exports.default = redux_1.combineReducers({
    general: general_1.default,
    users: users_1.default,
    teams: teams_1.default,
    channels: channels_1.default,
    posts: posts_1.default,
    files: files_1.default,
    preferences: preferences_1.default,
    typing: typing_1.default,
    integrations: integrations_1.default,
    emojis: emojis_1.default,
    gifs: gifs_1.default,
    admin: admin_1.default,
    jobs: jobs_1.default,
    search: search_1.default,
    roles: roles_1.default,
    schemes: schemes_1.default,
    groups: groups_1.default,
    bots: bots_1.default,
    threads: threads_1.default,
    channelCategories: channel_categories_1.default,
    apps: apps_1.default,
    cloud: cloud_1.default,
});
//# sourceMappingURL=index.js.map