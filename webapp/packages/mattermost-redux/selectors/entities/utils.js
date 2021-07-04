"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAddLastViewAtToProfiles = void 0;
var tslib_1 = require("tslib");
var reselect_1 = require("reselect");
var channels_1 = require("./channels");
var users_1 = require("./users");
var channel_utils_1 = require("../../utils/channel_utils");
var constants_1 = require("../../constants");
function makeAddLastViewAtToProfiles() {
    return reselect_1.createSelector(users_1.getCurrentUserId, channels_1.getMyChannelMemberships, channels_1.getAllChannels, function (state, profiles) { return profiles; }, function (currentUserId, memberships, allChannels, profiles) {
        var DMchannels = Object.values(allChannels).reduce(function (acc, channel) {
            var _a;
            if (channel.type === constants_1.General.DM_CHANNEL) {
                return tslib_1.__assign(tslib_1.__assign({}, acc), (_a = {}, _a[channel.name] = channel, _a));
            }
            return acc;
        }, {});
        var formattedProfiles = profiles.map(function (profile) {
            var channelName = channel_utils_1.getDirectChannelName(currentUserId, profile.id);
            var channel = DMchannels[channelName];
            var membership = channel ? memberships[channel.id] : null;
            return tslib_1.__assign(tslib_1.__assign({}, profile), { last_viewed_at: channel && membership ? membership.last_viewed_at : 0 });
        });
        return formattedProfiles;
    });
}
exports.makeAddLastViewAtToProfiles = makeAddLastViewAtToProfiles;
//# sourceMappingURL=utils.js.map