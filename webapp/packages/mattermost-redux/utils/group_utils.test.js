"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var assert_1 = tslib_1.__importDefault(require("assert"));
var group_utils_1 = require("./group_utils");
describe('group utils', function () {
    describe('filterGroupsMatchingTerm', function () {
        var groupA = {
            id: 'groupid1',
            name: 'board-group',
            description: 'group1 description',
            display_name: 'board-group',
            type: 'ldap',
            remote_id: 'group1',
            create_at: 1,
            update_at: 2,
            delete_at: 0,
            has_syncables: true,
            member_count: 3,
            scheme_admin: false,
            allow_reference: true,
        };
        var groupB = {
            id: 'groupid2',
            name: 'developers-group',
            description: 'group2 description',
            display_name: 'developers-group',
            type: 'ldap',
            remote_id: 'group2',
            create_at: 1,
            update_at: 2,
            delete_at: 0,
            has_syncables: true,
            member_count: 3,
            scheme_admin: false,
            allow_reference: true,
        };
        var groupC = {
            id: 'groupid3',
            name: 'software-engineers',
            description: 'group3 description',
            display_name: 'software engineers',
            type: 'ldap',
            remote_id: 'group3',
            create_at: 1,
            update_at: 2,
            delete_at: 0,
            has_syncables: true,
            member_count: 3,
            scheme_admin: false,
            allow_reference: true,
        };
        var groups = [groupA, groupB, groupC];
        it('should match all for empty filter', function () {
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, ''), [groupA, groupB, groupC]);
        });
        it('should filter out results which do not match', function () {
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, 'testBad'), []);
        });
        it('should match by name', function () {
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, 'software-engineers'), [groupC]);
        });
        it('should match by split part of the name', function () {
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, 'group'), [groupA, groupB]);
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, 'board'), [groupA]);
        });
        it('should match by display_name fully', function () {
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, 'software engineers'), [groupC]);
        });
        it('should match by display_name case-insensitive', function () {
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, 'software ENGINEERS'), [groupC]);
        });
        it('should ignore leading @ for name', function () {
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, '@developers'), [groupB]);
        });
        it('should ignore leading @ for display_name', function () {
            assert_1.default.deepEqual(group_utils_1.filterGroupsMatchingTerm(groups, '@software'), [groupC]);
        });
    });
});
//# sourceMappingURL=group_utils.test.js.map