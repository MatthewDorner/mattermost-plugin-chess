"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function accounts(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.BotTypes.RECEIVED_BOT_ACCOUNTS: {
            var newBots = action.data;
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var newBots_1 = tslib_1.__values(newBots), newBots_1_1 = newBots_1.next(); !newBots_1_1.done; newBots_1_1 = newBots_1.next()) {
                    var bot = newBots_1_1.value;
                    nextState[bot.user_id] = bot;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (newBots_1_1 && !newBots_1_1.done && (_a = newBots_1.return)) _a.call(newBots_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        case action_types_1.BotTypes.RECEIVED_BOT_ACCOUNT: {
            var bot = action.data;
            var nextState = tslib_1.__assign({}, state);
            nextState[bot.user_id] = bot;
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    accounts: accounts,
});
//# sourceMappingURL=bots.js.map