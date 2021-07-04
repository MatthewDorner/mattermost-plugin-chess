"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetSchemeTeams = exports.makeGetSchemeChannels = exports.getScheme = exports.getSchemes = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var schemes_1 = require("../../constants/schemes");
var channels_1 = require("./channels");
var teams_1 = require("./teams");
function getSchemes(state) {
    return state.entities.schemes.schemes;
}
exports.getSchemes = getSchemes;
function getScheme(state, id) {
    var schemes = getSchemes(state);
    return schemes[id];
}
exports.getScheme = getScheme;
function makeGetSchemeChannels() {
    return reselect_1.createSelector(channels_1.getAllChannels, function (state, props) { return getScheme(state, props.schemeId); }, function (allChannels, scheme) {
        if (!scheme) {
            return [];
        }
        if (scheme.scope === schemes_1.ScopeTypes.TEAM) {
            var msg = "Not implemented: scheme '" + scheme.id + "' is team-scope but 'getSchemeChannels' only accepts channel-scoped schemes.";
            console.log(msg); // eslint-disable-line no-console
            return [];
        }
        var schemeChannels = [];
        Object.entries(allChannels).forEach(function (item) {
            var _a = tslib_1.__read(item, 2), channel = _a[1];
            if (channel.scheme_id === scheme.id) {
                schemeChannels.push(channel);
            }
        });
        return schemeChannels;
    });
}
exports.makeGetSchemeChannels = makeGetSchemeChannels;
function makeGetSchemeTeams() {
    return reselect_1.createSelector(teams_1.getTeams, function (state, props) { return getScheme(state, props.schemeId); }, function (allTeams, scheme) {
        if (!scheme) {
            return [];
        }
        if (scheme.scope === schemes_1.ScopeTypes.CHANNEL) {
            var msg = "Error: scheme '" + scheme.id + "' is channel-scoped but 'getSchemeChannels' only accepts team-scoped schemes.";
            console.log(msg); // eslint-disable-line no-console
            return [];
        }
        var schemeTeams = [];
        Object.entries(allTeams).forEach(function (item) {
            var _a = tslib_1.__read(item, 2), team = _a[1];
            if (team.scheme_id === scheme.id) {
                schemeTeams.push(team);
            }
        });
        return schemeTeams;
    });
}
exports.makeGetSchemeTeams = makeGetSchemeTeams;
//# sourceMappingURL=schemes.js.map