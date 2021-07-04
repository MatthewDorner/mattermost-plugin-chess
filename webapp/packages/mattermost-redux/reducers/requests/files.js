"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadFilesRequest = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var constants_1 = require("../../constants");
var helpers_1 = require("./helpers");
function handleUploadFilesRequest(REQUEST, SUCCESS, FAILURE, CANCEL, state, action) {
    switch (action.type) {
        case REQUEST:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.STARTED });
        case SUCCESS:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.SUCCESS, error: null });
        case FAILURE: {
            var error = action.error;
            if (error instanceof Error) {
                error = error.hasOwnProperty('intl') ? tslib_1.__assign({}, error) : error.toString();
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.FAILURE, error: error });
        }
        case CANCEL:
            return tslib_1.__assign(tslib_1.__assign({}, state), { status: constants_1.RequestStatus.CANCELLED, error: null });
        default:
            return state;
    }
}
exports.handleUploadFilesRequest = handleUploadFilesRequest;
function uploadFiles(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return handleUploadFilesRequest(action_types_1.FileTypes.UPLOAD_FILES_REQUEST, action_types_1.FileTypes.UPLOAD_FILES_SUCCESS, action_types_1.FileTypes.UPLOAD_FILES_FAILURE, action_types_1.FileTypes.UPLOAD_FILES_CANCEL, state, action);
}
exports.default = redux_1.combineReducers({
    uploadFiles: uploadFiles,
});
//# sourceMappingURL=files.js.map