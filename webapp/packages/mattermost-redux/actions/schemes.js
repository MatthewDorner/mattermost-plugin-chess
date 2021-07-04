"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemeChannels = exports.getSchemeTeams = exports.patchScheme = exports.deleteScheme = exports.createScheme = exports.getSchemes = exports.getScheme = void 0;
var tslib_1 = require("tslib");
var client_1 = require("../client");
var action_types_1 = require("../action_types");
var constants_1 = require("../constants");
var helpers_1 = require("./helpers");
var errors_1 = require("./errors");
function getScheme(schemeId) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getScheme,
        onSuccess: [action_types_1.SchemeTypes.RECEIVED_SCHEME],
        params: [
            schemeId,
        ],
    });
}
exports.getScheme = getScheme;
function getSchemes(scope, page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getSchemes,
        onSuccess: [action_types_1.SchemeTypes.RECEIVED_SCHEMES],
        params: [
            scope,
            page,
            perPage,
        ],
    });
}
exports.getSchemes = getSchemes;
function createScheme(scheme) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createScheme,
        onSuccess: [action_types_1.SchemeTypes.CREATED_SCHEME],
        params: [
            scheme,
        ],
    });
}
exports.createScheme = createScheme;
function deleteScheme(schemeId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.deleteScheme(schemeId)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(errors_1.logError(error_1));
                    return [2 /*return*/, { error: error_1 }];
                case 4:
                    dispatch({ type: action_types_1.SchemeTypes.DELETED_SCHEME, data: { schemeId: schemeId } });
                    return [2 /*return*/, { data: data }];
            }
        });
    }); };
}
exports.deleteScheme = deleteScheme;
function patchScheme(schemeId, scheme) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.patchScheme,
        onSuccess: [action_types_1.SchemeTypes.PATCHED_SCHEME],
        params: [
            schemeId,
            scheme,
        ],
    });
}
exports.patchScheme = patchScheme;
function getSchemeTeams(schemeId, page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getSchemeTeams,
        onSuccess: [action_types_1.SchemeTypes.RECEIVED_SCHEME_TEAMS],
        params: [
            schemeId,
            page,
            perPage,
        ],
    });
}
exports.getSchemeTeams = getSchemeTeams;
function getSchemeChannels(schemeId, page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.PAGE_SIZE_DEFAULT; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getSchemeChannels,
        onSuccess: [action_types_1.SchemeTypes.RECEIVED_SCHEME_CHANNELS],
        params: [
            schemeId,
            page,
            perPage,
        ],
    });
}
exports.getSchemeChannels = getSchemeChannels;
//# sourceMappingURL=schemes.js.map