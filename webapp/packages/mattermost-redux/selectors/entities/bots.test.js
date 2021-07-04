"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var assert_1 = tslib_1.__importDefault(require("assert"));
var deep_freeze_1 = tslib_1.__importDefault(require("../../utils/deep_freeze"));
var Selectors = tslib_1.__importStar(require("./bots"));
describe('Selectors.Bots', function () {
    var _a;
    var userID1 = 'currentUser';
    var userID2 = 'otherUser1';
    var userID3 = 'otherUser2';
    var currentUser = { id: userID1, username: 'currentUser', first_name: 'Current', last_name: 'User', locale: 'en' };
    var otherUser1 = { id: userID2, username: 'otherUser1', first_name: 'Other', last_name: 'User', locale: 'en' };
    var otherUser2 = { id: userID3, username: 'mattermost-advisor', first_name: 'Another', last_name: 'User', locale: 'en' };
    var bot1 = {
        user_id: userID1,
        username: 'currentUser',
        display_name: 'abc',
        description: '',
        owner_id: 'abc',
        create_at: 1553808969975,
        update_at: 1553808969975,
        delete_at: 0,
    };
    var bot2 = {
        user_id: userID3,
        username: 'mattermost-advisor',
        display_name: 'xyz',
        description: '',
        owner_id: 'xyz',
        create_at: 1553808972099,
        update_at: 1553808972099,
        delete_at: 0,
    };
    var testState = deep_freeze_1.default({
        entities: {
            bots: {
                syncables: {},
                members: {},
                accounts: (_a = {},
                    _a[userID1] = bot1,
                    _a[userID3] = bot2,
                    _a),
            },
            users: {
                profiles: {
                    currentUser: currentUser,
                    otherUser1: otherUser1,
                    otherUser2: otherUser2,
                },
            },
        },
    });
    it('getBotAccounts', function () {
        var botsById = Selectors.getBotAccounts(testState);
        assert_1.default.equal(botsById[bot1.user_id], bot1);
        assert_1.default.equal(botsById[bot2.user_id], bot2);
        assert_1.default.equal(Object.keys(botsById).length, 2);
    });
    it('getExternalBotAccounts', function () {
        var expected = {
            currentUser: bot1,
        };
        assert_1.default.deepEqual(Selectors.getExternalBotAccounts(testState), expected);
    });
});
//# sourceMappingURL=bots.test.js.map