"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function myChannels(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.ChannelTypes.CHANNELS_REQUEST, action_types_1.ChannelTypes.CHANNELS_SUCCESS, action_types_1.ChannelTypes.CHANNELS_FAILURE, state, action);
}
function createChannel(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.ChannelTypes.CREATE_CHANNEL_REQUEST, action_types_1.ChannelTypes.CREATE_CHANNEL_SUCCESS, action_types_1.ChannelTypes.CREATE_CHANNEL_FAILURE, state, action);
}
function updateChannel(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.ChannelTypes.UPDATE_CHANNEL_REQUEST, action_types_1.ChannelTypes.UPDATE_CHANNEL_SUCCESS, action_types_1.ChannelTypes.UPDATE_CHANNEL_FAILURE, state, action);
}
function getChannels(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.ChannelTypes.GET_CHANNELS_REQUEST, action_types_1.ChannelTypes.GET_CHANNELS_SUCCESS, action_types_1.ChannelTypes.GET_CHANNELS_FAILURE, state, action);
}
function getAllChannels(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.ChannelTypes.GET_ALL_CHANNELS_REQUEST, action_types_1.ChannelTypes.GET_ALL_CHANNELS_SUCCESS, action_types_1.ChannelTypes.GET_ALL_CHANNELS_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    getChannels: getChannels,
    getAllChannels: getAllChannels,
    myChannels: myChannels,
    createChannel: createChannel,
    updateChannel: updateChannel,
});
//# sourceMappingURL=channels.js.map