"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePublicLink = exports.uploadFile = exports.getFilesForPost = exports.receivedFiles = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var client_1 = require("../client");
var action_types_1 = require("../action_types");
var actions_1 = require("../types/actions");
var errors_1 = require("./errors");
var helpers_1 = require("./helpers");
function receivedFiles(files) {
    return {
        type: action_types_1.FileTypes.RECEIVED_FILES_FOR_SEARCH,
        data: files,
    };
}
exports.receivedFiles = receivedFiles;
function getFilesForPost(postId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var files, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client_1.Client4.getFileInfosForPost(postId)];
                case 1:
                    files = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(errors_1.logError(error_1));
                    return [2 /*return*/, { error: error_1 }];
                case 3:
                    dispatch({
                        type: action_types_1.FileTypes.RECEIVED_FILES_FOR_POST,
                        data: files,
                        postId: postId,
                    });
                    return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.getFilesForPost = getFilesForPost;
function uploadFile(channelId, rootId, clientIds, fileFormData, formBoundary) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var files, error_2, failure, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: action_types_1.FileTypes.UPLOAD_FILES_REQUEST, data: {} });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.uploadFile(fileFormData, formBoundary)];
                case 2:
                    files = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    failure = {
                        type: action_types_1.FileTypes.UPLOAD_FILES_FAILURE,
                        clientIds: clientIds,
                        channelId: channelId,
                        rootId: rootId,
                        error: error_2,
                    };
                    dispatch(actions_1.batchActions([failure, errors_1.logError(error_2)]));
                    return [2 /*return*/, { error: error_2 }];
                case 4:
                    data = files.file_infos.map(function (file, index) {
                        return tslib_1.__assign(tslib_1.__assign({}, file), { clientId: files.client_ids[index] });
                    });
                    dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.FileTypes.RECEIVED_UPLOAD_FILES,
                            data: data,
                            channelId: channelId,
                            rootId: rootId,
                        },
                        {
                            type: action_types_1.FileTypes.UPLOAD_FILES_SUCCESS,
                        },
                    ]));
                    return [2 /*return*/, { data: files }];
            }
        });
    }); };
}
exports.uploadFile = uploadFile;
function getFilePublicLink(fileId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getFilePublicLink,
        onSuccess: action_types_1.FileTypes.RECEIVED_FILE_PUBLIC_LINK,
        params: [
            fileId,
        ],
    });
}
exports.getFilePublicLink = getFilePublicLink;
//# sourceMappingURL=files.js.map