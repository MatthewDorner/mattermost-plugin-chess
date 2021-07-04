"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTypes = void 0;
exports.PostTypes = {
    CHANNEL_DELETED: 'system_channel_deleted',
    CHANNEL_UNARCHIVED: 'system_channel_restored',
    DISPLAYNAME_CHANGE: 'system_displayname_change',
    CONVERT_CHANNEL: 'system_convert_channel',
    EPHEMERAL: 'system_ephemeral',
    EPHEMERAL_ADD_TO_CHANNEL: 'system_ephemeral_add_to_channel',
    HEADER_CHANGE: 'system_header_change',
    PURPOSE_CHANGE: 'system_purpose_change',
    JOIN_LEAVE: 'system_join_leave',
    JOIN_CHANNEL: 'system_join_channel',
    GUEST_JOIN_CHANNEL: 'system_guest_join_channel',
    LEAVE_CHANNEL: 'system_leave_channel',
    ADD_REMOVE: 'system_add_remove',
    ADD_TO_CHANNEL: 'system_add_to_channel',
    ADD_GUEST_TO_CHANNEL: 'system_add_guest_to_chan',
    REMOVE_FROM_CHANNEL: 'system_remove_from_channel',
    JOIN_TEAM: 'system_join_team',
    LEAVE_TEAM: 'system_leave_team',
    ADD_TO_TEAM: 'system_add_to_team',
    REMOVE_FROM_TEAM: 'system_remove_from_team',
    COMBINED_USER_ACTIVITY: 'system_combined_user_activity',
    ME: 'me',
    ADD_BOT_TEAMS_CHANNELS: 'add_bot_teams_channels',
    SYSTEM_WARN_METRIC_STATUS: 'warn_metric_status',
};
exports.default = {
    POST_CHUNK_SIZE: 60,
    POST_DELETED: 'DELETED',
    SYSTEM_MESSAGE_PREFIX: 'system_',
    SYSTEM_AUTO_RESPONDER: 'system_auto_responder',
    POST_TYPES: exports.PostTypes,
    MESSAGE_TYPES: {
        POST: 'post',
        COMMENT: 'comment',
    },
    MAX_PREV_MSGS: 100,
    POST_COLLAPSE_TIMEOUT: 1000 * 60 * 5,
    IGNORE_POST_TYPES: [
        exports.PostTypes.ADD_REMOVE,
        exports.PostTypes.ADD_TO_CHANNEL,
        exports.PostTypes.CHANNEL_DELETED,
        exports.PostTypes.CHANNEL_UNARCHIVED,
        exports.PostTypes.JOIN_LEAVE,
        exports.PostTypes.JOIN_CHANNEL,
        exports.PostTypes.LEAVE_CHANNEL,
        exports.PostTypes.REMOVE_FROM_CHANNEL,
        exports.PostTypes.JOIN_TEAM,
        exports.PostTypes.LEAVE_TEAM,
        exports.PostTypes.ADD_TO_TEAM,
        exports.PostTypes.REMOVE_FROM_TEAM,
    ],
    USER_ACTIVITY_POST_TYPES: [
        exports.PostTypes.ADD_TO_CHANNEL,
        exports.PostTypes.JOIN_CHANNEL,
        exports.PostTypes.LEAVE_CHANNEL,
        exports.PostTypes.REMOVE_FROM_CHANNEL,
        exports.PostTypes.ADD_TO_TEAM,
        exports.PostTypes.JOIN_TEAM,
        exports.PostTypes.LEAVE_TEAM,
        exports.PostTypes.REMOVE_FROM_TEAM,
    ],
};
//# sourceMappingURL=posts.js.map