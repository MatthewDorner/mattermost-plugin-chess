"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignBot = exports.enableBot = exports.disableBot = exports.loadBots = exports.loadBot = exports.patchBot = exports.createBot = void 0;
var client_1 = require("../client");
var action_types_1 = require("../action_types");
var helpers_1 = require("./helpers");
var BOTS_PER_PAGE_DEFAULT = 20;
function createBot(bot) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createBot,
        onSuccess: action_types_1.BotTypes.RECEIVED_BOT_ACCOUNT,
        params: [
            bot,
        ],
    });
}
exports.createBot = createBot;
function patchBot(botUserId, botPatch) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.patchBot,
        onSuccess: action_types_1.BotTypes.RECEIVED_BOT_ACCOUNT,
        params: [
            botUserId,
            botPatch,
        ],
    });
}
exports.patchBot = patchBot;
function loadBot(botUserId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getBot,
        onSuccess: action_types_1.BotTypes.RECEIVED_BOT_ACCOUNT,
        params: [
            botUserId,
        ],
    });
}
exports.loadBot = loadBot;
function loadBots(page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = BOTS_PER_PAGE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getBotsIncludeDeleted,
        onSuccess: action_types_1.BotTypes.RECEIVED_BOT_ACCOUNTS,
        params: [
            page,
            perPage,
        ],
    });
}
exports.loadBots = loadBots;
function disableBot(botUserId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.disableBot,
        onSuccess: action_types_1.BotTypes.RECEIVED_BOT_ACCOUNT,
        params: [
            botUserId,
        ],
    });
}
exports.disableBot = disableBot;
function enableBot(botUserId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.enableBot,
        onSuccess: action_types_1.BotTypes.RECEIVED_BOT_ACCOUNT,
        params: [
            botUserId,
        ],
    });
}
exports.enableBot = enableBot;
function assignBot(botUserId, newOwnerId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.assignBot,
        onSuccess: action_types_1.BotTypes.RECEIVED_BOT_ACCOUNT,
        params: [
            botUserId,
            newOwnerId,
        ],
    });
}
exports.assignBot = assignBot;
//# sourceMappingURL=bots.js.map