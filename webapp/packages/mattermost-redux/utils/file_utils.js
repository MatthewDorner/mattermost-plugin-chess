"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortFileInfos = exports.getFilePreviewUrl = exports.getFileThumbnailUrl = exports.getFileDownloadUrl = exports.getFileUrl = exports.lookupMimeType = exports.getFileType = exports.getFormattedFileSize = void 0;
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var constants_1 = require("../constants");
var client_1 = require("../client");
var mimeDB = require('mime-db');
function getFormattedFileSize(file) {
    var bytes = file.size;
    var fileSizes = [
        ['TB', 1024 * 1024 * 1024 * 1024],
        ['GB', 1024 * 1024 * 1024],
        ['MB', 1024 * 1024],
        ['KB', 1024],
    ];
    var size = fileSizes.find(function (unitAndMinBytes) {
        var minBytes = unitAndMinBytes[1];
        return bytes > minBytes;
    });
    if (size) {
        return Math.floor(bytes / size[1]) + " " + size[0];
    }
    return bytes + " B";
}
exports.getFormattedFileSize = getFormattedFileSize;
function getFileType(file) {
    if (!file || !file.extension) {
        return 'other';
    }
    var fileExt = file.extension.toLowerCase();
    var fileTypes = [
        'image',
        'code',
        'pdf',
        'video',
        'audio',
        'spreadsheet',
        'text',
        'word',
        'presentation',
        'patch',
    ];
    return fileTypes.find(function (fileType) {
        var constForFileTypeExtList = (fileType + "_types").toUpperCase();
        var fileTypeExts = constants_1.Files[constForFileTypeExtList];
        return fileTypeExts.indexOf(fileExt) > -1;
    }) || 'other';
}
exports.getFileType = getFileType;
var extToMime;
function buildExtToMime() {
    extToMime = {};
    Object.keys(mimeDB).forEach(function (key) {
        var mime = mimeDB[key];
        if (mime.extensions) {
            mime.extensions.forEach(function (ext) {
                extToMime[ext] = key;
            });
        }
    });
}
function lookupMimeType(filename) {
    if (!extToMime) {
        buildExtToMime();
    }
    var ext = filename.split('.').pop().toLowerCase();
    return extToMime[ext] || 'application/octet-stream';
}
exports.lookupMimeType = lookupMimeType;
function getFileUrl(fileId) {
    return client_1.Client4.getFileRoute(fileId);
}
exports.getFileUrl = getFileUrl;
function getFileDownloadUrl(fileId) {
    return client_1.Client4.getFileRoute(fileId) + "?download=1";
}
exports.getFileDownloadUrl = getFileDownloadUrl;
function getFileThumbnailUrl(fileId) {
    return client_1.Client4.getFileRoute(fileId) + "/thumbnail";
}
exports.getFileThumbnailUrl = getFileThumbnailUrl;
function getFilePreviewUrl(fileId) {
    return client_1.Client4.getFileRoute(fileId) + "/preview";
}
exports.getFilePreviewUrl = getFilePreviewUrl;
function sortFileInfos(fileInfos, locale) {
    if (fileInfos === void 0) { fileInfos = []; }
    if (locale === void 0) { locale = constants_1.General.DEFAULT_LOCALE; }
    return fileInfos.sort(function (a, b) {
        if (a.create_at !== b.create_at) {
            return a.create_at - b.create_at;
        }
        return a.name.localeCompare(b.name, locale, { numeric: true });
    });
}
exports.sortFileInfos = sortFileInfos;
//# sourceMappingURL=file_utils.js.map