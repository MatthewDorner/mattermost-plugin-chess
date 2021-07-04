"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var action_types_1 = require("../../action_types");
var Reducers = tslib_1.__importStar(require("./apps"));
describe('bindings', function () {
    var initialState = [];
    test('No element get filtered', function () {
        var data = {
            bindings: [
                {
                    app_id: '1',
                    location: '/post_menu',
                    bindings: [
                        {
                            location: 'locA',
                            label: 'a',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '2',
                    location: '/post_menu',
                    bindings: [
                        {
                            location: 'locA',
                            label: 'a',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '1',
                    location: '/channel_header',
                    bindings: [
                        {
                            location: 'locB',
                            label: 'b',
                            icon: 'icon',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '3',
                    location: '/command',
                    bindings: [
                        {
                            location: 'locC',
                            label: 'c',
                            call: {},
                        },
                    ],
                },
            ],
        };
        var state = Reducers.bindings(initialState, {
            type: action_types_1.AppsTypes.RECEIVED_APP_BINDINGS,
            data: data,
        });
        expect(state).toMatchSnapshot();
    });
    test('Invalid channel header get filtered', function () {
        var data = {
            bindings: [
                {
                    app_id: '1',
                    location: '/post_menu',
                    bindings: [
                        {
                            location: 'locA',
                            label: 'a',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '2',
                    location: '/post_menu',
                    bindings: [
                        {
                            location: 'locA',
                            label: 'a',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '1',
                    location: '/channel_header',
                    bindings: [
                        {
                            location: 'locB',
                            label: 'b',
                            icon: 'icon',
                            call: {},
                        },
                        {
                            location: 'locC',
                            label: 'c',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '2',
                    location: '/channel_header',
                    bindings: [
                        {
                            location: 'locB',
                            icon: 'icon',
                            call: {},
                        },
                        {
                            location: 'locC',
                            label: 'c',
                            icon: 'icon',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '3',
                    location: '/channel_header',
                    bindings: [
                        {
                            location: 'locB',
                            call: {},
                        },
                        {
                            location: 'locC',
                            label: 'c',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '3',
                    location: '/command',
                    bindings: [
                        {
                            location: 'locC',
                            label: 'c',
                            call: {},
                        },
                    ],
                },
            ],
        };
        var state = Reducers.bindings(initialState, {
            type: action_types_1.AppsTypes.RECEIVED_APP_BINDINGS,
            data: data,
        });
        expect(state).toMatchSnapshot();
    });
    test('Invalid post menu get filtered', function () {
        var data = {
            bindings: [
                {
                    app_id: '1',
                    location: '/post_menu',
                    bindings: [
                        {
                            location: 'locA',
                            call: {},
                        },
                        {
                            location: 'locB',
                            label: 'a',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '2',
                    location: '/post_menu',
                    bindings: [
                        {
                            location: 'locA',
                            label: 'a',
                            call: {},
                        },
                        {
                            location: 'locB',
                            label: 'b',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '3',
                    location: '/post_menu',
                    bindings: [
                        {
                            location: 'locA',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '1',
                    location: '/channel_header',
                    bindings: [
                        {
                            location: 'locB',
                            label: 'b',
                            icon: 'icon',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '3',
                    location: '/command',
                    bindings: [
                        {
                            location: 'locC',
                            label: 'c',
                            call: {},
                        },
                    ],
                },
            ],
        };
        var state = Reducers.bindings(initialState, {
            type: action_types_1.AppsTypes.RECEIVED_APP_BINDINGS,
            data: data,
        });
        expect(state).toMatchSnapshot();
    });
    test('Invalid commands get filtered', function () {
        var data = {
            bindings: [
                {
                    app_id: '1',
                    location: '/post_menu',
                    bindings: [
                        {
                            location: 'locA',
                            label: 'a',
                            call: {},
                        },
                        {
                            location: 'locB',
                            label: 'a',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '1',
                    location: '/channel_header',
                    bindings: [
                        {
                            location: 'locB',
                            label: 'b',
                            icon: 'icon',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '3',
                    location: '/command',
                    bindings: [
                        {
                            location: 'locC',
                            label: 'c',
                            bindings: [
                                {
                                    location: 'subC1',
                                    call: {},
                                },
                                {
                                    location: 'subC2',
                                    label: 'c2',
                                    call: {},
                                },
                            ],
                        },
                        {
                            location: 'locD',
                            label: 'd',
                            bindings: [
                                {
                                    location: 'subC1',
                                    call: {},
                                },
                            ],
                        },
                    ],
                },
                {
                    app_id: '1',
                    location: '/command',
                    bindings: [
                        {
                            location: 'locC',
                            call: {},
                        },
                    ],
                },
                {
                    app_id: '2',
                    location: '/command',
                    bindings: [
                        {
                            location: 'locC',
                            label: 'c',
                            call: {},
                            bindings: [
                                {
                                    location: 'subC1',
                                    label: 'c1',
                                    call: {},
                                },
                                {
                                    location: 'subC2',
                                    label: 'c2',
                                    call: {},
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        var state = Reducers.bindings(initialState, {
            type: action_types_1.AppsTypes.RECEIVED_APP_BINDINGS,
            data: data,
        });
        expect(state).toMatchSnapshot();
    });
});
//# sourceMappingURL=apps.test.js.map