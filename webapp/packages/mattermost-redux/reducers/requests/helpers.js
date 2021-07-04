"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = exports.initialRequestState = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var constants_1 = require("../../constants");
function initialRequestState() {
    return {
        status: constants_1.RequestStatus.NOT_STARTED,
        error: null,
    };
}
exports.initialRequestState = initialRequestState;
function handleRequest(REQUEST, SUCCESS, FAILURE, state, action) {
    switch (action.type) {
        case REQUEST:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.STARTED });
        case SUCCESS:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.SUCCESS, error: null });
        case FAILURE: {
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.FAILURE, error: action.error });
        }
        default:
            return state;
    }
}
exports.handleRequest = handleRequest;
//# sourceMappingURL=helpers.js.map