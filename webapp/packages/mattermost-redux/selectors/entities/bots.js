"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExternalBotAccounts = exports.getBotAccounts = exports.ExternalBotAccountNames = void 0;
var reselect_1 = require("reselect");
var common_1 = require("./common");
exports.ExternalBotAccountNames = ['mattermost-advisor'];
function getBotAccounts(state) {
    return state.entities.bots.accounts;
}
exports.getBotAccounts = getBotAccounts;
exports.getExternalBotAccounts = reselect_1.createSelector(getBotAccounts, common_1.getUsers, function (botAccounts, userProfiles) {
    var nextState = {};
    Object.values(botAccounts).forEach(function (botAccount) {
        var botUser = userProfiles[botAccount.user_id];
        if (botUser && !exports.ExternalBotAccountNames.includes(botUser.username)) {
            nextState[botAccount.user_id] = botAccount;
        }
    });
    return nextState;
});
//# sourceMappingURL=bots.js.map