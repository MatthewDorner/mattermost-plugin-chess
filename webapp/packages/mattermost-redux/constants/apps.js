"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFieldTypes = exports.AppExpandLevels = exports.AppCallTypes = exports.AppCallResponseTypes = exports.AppBindingPresentations = exports.AppBindingLocations = void 0;
// This file's contents belong to the Apps Framework feature.
// Apps Framework feature is experimental, and the contents of this file are
// susceptible to breaking changes without pushing the major version of this package.
exports.AppBindingLocations = {
    POST_MENU_ITEM: '/post_menu',
    CHANNEL_HEADER_ICON: '/channel_header',
    COMMAND: '/command',
    IN_POST: '/in_post',
};
exports.AppBindingPresentations = {
    MODAL: 'modal',
};
exports.AppCallResponseTypes = {
    OK: 'ok',
    ERROR: 'error',
    FORM: 'form',
    CALL: 'call',
    NAVIGATE: 'navigate',
};
exports.AppCallTypes = {
    SUBMIT: 'submit',
    LOOKUP: 'lookup',
    FORM: 'form',
    CANCEL: 'cancel',
};
exports.AppExpandLevels = {
    EXPAND_DEFAULT: '',
    EXPAND_NONE: 'none',
    EXPAND_ALL: 'all',
    EXPAND_SUMMARY: 'summary',
};
exports.AppFieldTypes = {
    TEXT: 'text',
    STATIC_SELECT: 'static_select',
    DYNAMIC_SELECT: 'dynamic_select',
    BOOL: 'bool',
    USER: 'user',
    CHANNEL: 'channel',
};
//# sourceMappingURL=apps.js.map