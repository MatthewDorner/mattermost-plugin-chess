"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAnalyticsRowsToStats = void 0;
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var constants_1 = require("../../constants");
var plugins_1 = tslib_1.__importDefault(require("../../constants/plugins"));
function logs(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_LOGS: {
            return action.data;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function audits(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_AUDITS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var audit = _c.value;
                    nextState[audit.id] = audit;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function config(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_CONFIG: {
            return action.data;
        }
        case action_types_1.AdminTypes.ENABLED_PLUGIN: {
            var nextPluginSettings = tslib_1.__assign({}, state.PluginSettings);
            var nextPluginStates = tslib_1.__assign({}, nextPluginSettings.PluginStates);
            nextPluginStates[action.data] = { Enable: true };
            nextPluginSettings.PluginStates = nextPluginStates;
            return tslib_1.__assign(tslib_1.__assign({}, state), { PluginSettings: nextPluginSettings });
        }
        case action_types_1.AdminTypes.DISABLED_PLUGIN: {
            var nextPluginSettings = tslib_1.__assign({}, state.PluginSettings);
            var nextPluginStates = tslib_1.__assign({}, nextPluginSettings.PluginStates);
            nextPluginStates[action.data] = { Enable: false };
            nextPluginSettings.PluginStates = nextPluginStates;
            return tslib_1.__assign(tslib_1.__assign({}, state), { PluginSettings: nextPluginSettings });
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function environmentConfig(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_ENVIRONMENT_CONFIG: {
            return action.data;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function complianceReports(state, action) {
    var e_2, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_COMPLIANCE_REPORT: {
            var nextState = tslib_1.__assign({}, state);
            nextState[action.data.id] = action.data;
            return nextState;
        }
        case action_types_1.AdminTypes.RECEIVED_COMPLIANCE_REPORTS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var report = _c.value;
                    nextState[report.id] = report;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function clusterInfo(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_CLUSTER_STATUS: {
            return action.data;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function samlCertStatus(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_SAML_CERT_STATUS: {
            return action.data;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function convertAnalyticsRowsToStats(data, name) {
    var stats = {};
    var clonedData = tslib_1.__spread(data);
    if (name === 'post_counts_day') {
        clonedData.reverse();
        stats[constants_1.Stats.POST_PER_DAY] = clonedData;
        return stats;
    }
    if (name === 'bot_post_counts_day') {
        clonedData.reverse();
        stats[constants_1.Stats.BOT_POST_PER_DAY] = clonedData;
        return stats;
    }
    if (name === 'user_counts_with_posts_day') {
        clonedData.reverse();
        stats[constants_1.Stats.USERS_WITH_POSTS_PER_DAY] = clonedData;
        return stats;
    }
    clonedData.forEach(function (row) {
        var key;
        switch (row.name) {
            case 'channel_open_count':
                key = constants_1.Stats.TOTAL_PUBLIC_CHANNELS;
                break;
            case 'channel_private_count':
                key = constants_1.Stats.TOTAL_PRIVATE_GROUPS;
                break;
            case 'post_count':
                key = constants_1.Stats.TOTAL_POSTS;
                break;
            case 'unique_user_count':
                key = constants_1.Stats.TOTAL_USERS;
                break;
            case 'inactive_user_count':
                key = constants_1.Stats.TOTAL_INACTIVE_USERS;
                break;
            case 'team_count':
                key = constants_1.Stats.TOTAL_TEAMS;
                break;
            case 'total_websocket_connections':
                key = constants_1.Stats.TOTAL_WEBSOCKET_CONNECTIONS;
                break;
            case 'total_master_db_connections':
                key = constants_1.Stats.TOTAL_MASTER_DB_CONNECTIONS;
                break;
            case 'total_read_db_connections':
                key = constants_1.Stats.TOTAL_READ_DB_CONNECTIONS;
                break;
            case 'daily_active_users':
                key = constants_1.Stats.DAILY_ACTIVE_USERS;
                break;
            case 'monthly_active_users':
                key = constants_1.Stats.MONTHLY_ACTIVE_USERS;
                break;
            case 'file_post_count':
                key = constants_1.Stats.TOTAL_FILE_POSTS;
                break;
            case 'hashtag_post_count':
                key = constants_1.Stats.TOTAL_HASHTAG_POSTS;
                break;
            case 'incoming_webhook_count':
                key = constants_1.Stats.TOTAL_IHOOKS;
                break;
            case 'outgoing_webhook_count':
                key = constants_1.Stats.TOTAL_OHOOKS;
                break;
            case 'command_count':
                key = constants_1.Stats.TOTAL_COMMANDS;
                break;
            case 'session_count':
                key = constants_1.Stats.TOTAL_SESSIONS;
                break;
            case 'registered_users':
                key = constants_1.Stats.REGISTERED_USERS;
                break;
        }
        if (key) {
            stats[key] = row.value;
        }
    });
    return stats;
}
exports.convertAnalyticsRowsToStats = convertAnalyticsRowsToStats;
function analytics(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_SYSTEM_ANALYTICS: {
            var stats = convertAnalyticsRowsToStats(action.data, action.name);
            return tslib_1.__assign(tslib_1.__assign({}, state), stats);
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function teamAnalytics(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_TEAM_ANALYTICS: {
            var nextState = tslib_1.__assign({}, state);
            var stats = convertAnalyticsRowsToStats(action.data, action.name);
            var analyticsForTeam = tslib_1.__assign(tslib_1.__assign({}, (nextState[action.teamId] || {})), stats);
            nextState[action.teamId] = analyticsForTeam;
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function userAccessTokens(state, action) {
    var _a, e_3, _b, e_4, _c, _d, _e;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKEN: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.id] = action.data, _a));
        }
        case action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKENS_FOR_USER: {
            var nextState = {};
            try {
                for (var _f = tslib_1.__values(action.data), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var uat = _g.value;
                    nextState[uat.id] = uat;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), nextState);
        }
        case action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKENS: {
            var nextState = {};
            try {
                for (var _h = tslib_1.__values(action.data), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var uat = _j.value;
                    nextState[uat.id] = uat;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), nextState);
        }
        case action_types_1.UserTypes.REVOKED_USER_ACCESS_TOKEN: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data);
            return tslib_1.__assign({}, nextState);
        }
        case action_types_1.UserTypes.ENABLED_USER_ACCESS_TOKEN: {
            var token = tslib_1.__assign(tslib_1.__assign({}, state[action.data]), { is_active: true });
            return tslib_1.__assign(tslib_1.__assign({}, state), (_d = {}, _d[action.data] = token, _d));
        }
        case action_types_1.UserTypes.DISABLED_USER_ACCESS_TOKEN: {
            var token = tslib_1.__assign(tslib_1.__assign({}, state[action.data]), { is_active: false });
            return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[action.data] = token, _e));
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function userAccessTokensByUser(state, action) {
    var _a, e_5, _b, _c, e_6, _d, _e, _f, _g;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKEN: { // UserAccessToken
            var nextUserState = tslib_1.__assign({}, (state[action.data.user_id] || {}));
            nextUserState[action.data.id] = action.data;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.user_id] = nextUserState, _a));
        }
        case action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKENS_FOR_USER: { // UserAccessToken[]
            var nextUserState = tslib_1.__assign({}, (state[action.userId] || {}));
            try {
                for (var _h = tslib_1.__values(action.data), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var uat = _j.value;
                    nextUserState[uat.id] = uat;
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[action.userId] = nextUserState, _c));
        }
        case action_types_1.AdminTypes.RECEIVED_USER_ACCESS_TOKENS: { // UserAccessToken[]
            var nextUserState = {};
            try {
                for (var _k = tslib_1.__values(action.data), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var uat = _l.value;
                    nextUserState[uat.user_id] = nextUserState[uat.user_id] || {};
                    nextUserState[uat.user_id][uat.id] = uat;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_d = _k.return)) _d.call(_k);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), nextUserState);
        }
        case action_types_1.UserTypes.REVOKED_USER_ACCESS_TOKEN: {
            var userIds = Object.keys(state);
            for (var i = 0; i < userIds.length; i++) {
                var userId = userIds[i];
                if (state[userId] && state[userId][action.data]) {
                    var nextUserState = tslib_1.__assign({}, state[userId]);
                    Reflect.deleteProperty(nextUserState, action.data);
                    return tslib_1.__assign(tslib_1.__assign({}, state), (_e = {}, _e[userId] = nextUserState, _e));
                }
            }
            return state;
        }
        case action_types_1.UserTypes.ENABLED_USER_ACCESS_TOKEN: {
            var userIds = Object.keys(state);
            for (var i = 0; i < userIds.length; i++) {
                var userId = userIds[i];
                if (state[userId] && state[userId][action.data]) {
                    var nextUserState = tslib_1.__assign({}, state[userId]);
                    var token = tslib_1.__assign(tslib_1.__assign({}, nextUserState[action.data]), { is_active: true });
                    nextUserState[token.id] = token;
                    return tslib_1.__assign(tslib_1.__assign({}, state), (_f = {}, _f[userId] = nextUserState, _f));
                }
            }
            return state;
        }
        case action_types_1.UserTypes.DISABLED_USER_ACCESS_TOKEN: {
            var userIds = Object.keys(state);
            for (var i = 0; i < userIds.length; i++) {
                var userId = userIds[i];
                if (state[userId] && state[userId][action.data]) {
                    var nextUserState = tslib_1.__assign({}, state[userId]);
                    var token = tslib_1.__assign(tslib_1.__assign({}, nextUserState[action.data]), { is_active: false });
                    nextUserState[token.id] = token;
                    return tslib_1.__assign(tslib_1.__assign({}, state), (_g = {}, _g[userId] = nextUserState, _g));
                }
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function plugins(state, action) {
    var e_7, _a, e_8, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_PLUGINS: {
            var nextState = tslib_1.__assign({}, state);
            var activePlugins = action.data.active;
            try {
                for (var activePlugins_1 = tslib_1.__values(activePlugins), activePlugins_1_1 = activePlugins_1.next(); !activePlugins_1_1.done; activePlugins_1_1 = activePlugins_1.next()) {
                    var plugin = activePlugins_1_1.value;
                    nextState[plugin.id] = tslib_1.__assign(tslib_1.__assign({}, plugin), { active: true });
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (activePlugins_1_1 && !activePlugins_1_1.done && (_a = activePlugins_1.return)) _a.call(activePlugins_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            var inactivePlugins = action.data.inactive;
            try {
                for (var inactivePlugins_1 = tslib_1.__values(inactivePlugins), inactivePlugins_1_1 = inactivePlugins_1.next(); !inactivePlugins_1_1.done; inactivePlugins_1_1 = inactivePlugins_1.next()) {
                    var plugin = inactivePlugins_1_1.value;
                    nextState[plugin.id] = tslib_1.__assign(tslib_1.__assign({}, plugin), { active: false });
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (inactivePlugins_1_1 && !inactivePlugins_1_1.done && (_b = inactivePlugins_1.return)) _b.call(inactivePlugins_1);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return nextState;
        }
        case action_types_1.AdminTypes.REMOVED_PLUGIN: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data);
            return nextState;
        }
        case action_types_1.AdminTypes.ENABLED_PLUGIN: {
            var nextState = tslib_1.__assign({}, state);
            var plugin = nextState[action.data];
            if (plugin && !plugin.active) {
                nextState[action.data] = tslib_1.__assign(tslib_1.__assign({}, plugin), { active: true });
                return nextState;
            }
            return state;
        }
        case action_types_1.AdminTypes.DISABLED_PLUGIN: {
            var nextState = tslib_1.__assign({}, state);
            var plugin = nextState[action.data];
            if (plugin && plugin.active) {
                nextState[action.data] = tslib_1.__assign(tslib_1.__assign({}, plugin), { active: false });
                return nextState;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function pluginStatuses(state, action) {
    var e_9, _a, _b, _c;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_PLUGIN_STATUSES: {
            var nextState = {};
            try {
                for (var _d = tslib_1.__values((action.data || [])), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var plugin = _e.value;
                    var id = plugin.plugin_id;
                    // The plugin may be in different states across the cluster. Pick the highest one to
                    // surface an error.
                    var pluginState = Math.max((nextState[id] && nextState[id].state) || 0, plugin.state);
                    var instances = tslib_1.__spread(((nextState[id] && nextState[id].instances) || []), [
                        {
                            cluster_id: plugin.cluster_id,
                            version: plugin.version,
                            state: plugin.state,
                        },
                    ]);
                    nextState[id] = {
                        id: id,
                        name: (nextState[id] && nextState[id].name) || plugin.name,
                        description: (nextState[id] && nextState[id].description) || plugin.description,
                        version: (nextState[id] && nextState[id].version) || plugin.version,
                        active: pluginState > 0,
                        state: pluginState,
                        instances: instances,
                    };
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_9) throw e_9.error; }
            }
            return nextState;
        }
        case action_types_1.AdminTypes.ENABLE_PLUGIN_REQUEST: {
            var pluginId = action.data;
            if (!state[pluginId]) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[pluginId] = tslib_1.__assign(tslib_1.__assign({}, state[pluginId]), { state: plugins_1.default.PLUGIN_STATE_STARTING }), _b));
        }
        case action_types_1.AdminTypes.DISABLE_PLUGIN_REQUEST: {
            var pluginId = action.data;
            if (!state[pluginId]) {
                return state;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[pluginId] = tslib_1.__assign(tslib_1.__assign({}, state[pluginId]), { state: plugins_1.default.PLUGIN_STATE_STOPPING }), _c));
        }
        case action_types_1.AdminTypes.REMOVED_PLUGIN: {
            var pluginId = action.data;
            if (!state[pluginId]) {
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, pluginId);
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function ldapGroupsCount(state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_LDAP_GROUPS:
            return action.data.count;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return 0;
        default:
            return state;
    }
}
function ldapGroups(state, action) {
    var e_10, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_LDAP_GROUPS: {
            var nextState = {};
            try {
                for (var _b = tslib_1.__values(action.data.groups), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var group = _c.value;
                    nextState[group.primary_key] = group;
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_10) throw e_10.error; }
            }
            return nextState;
        }
        case action_types_1.AdminTypes.LINKED_LDAP_GROUP: {
            var nextState = tslib_1.__assign({}, state);
            if (nextState[action.data.primary_key]) {
                nextState[action.data.primary_key] = action.data;
            }
            return nextState;
        }
        case action_types_1.AdminTypes.UNLINKED_LDAP_GROUP: {
            var nextState = tslib_1.__assign({}, state);
            if (nextState[action.data]) {
                nextState[action.data] = tslib_1.__assign(tslib_1.__assign({}, nextState[action.data]), { mattermost_group_id: undefined, has_syncables: undefined, failed: false });
            }
            return nextState;
        }
        case action_types_1.AdminTypes.LINK_LDAP_GROUP_FAILURE: {
            var nextState = tslib_1.__assign({}, state);
            if (nextState[action.data]) {
                nextState[action.data] = tslib_1.__assign(tslib_1.__assign({}, nextState[action.data]), { failed: true });
            }
            return nextState;
        }
        case action_types_1.AdminTypes.UNLINK_LDAP_GROUP_FAILURE: {
            var nextState = tslib_1.__assign({}, state);
            if (nextState[action.data]) {
                nextState[action.data] = tslib_1.__assign(tslib_1.__assign({}, nextState[action.data]), { failed: true });
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function samlMetadataResponse(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_SAML_METADATA_RESPONSE: {
            return action.data;
        }
        default:
            return state;
    }
}
function dataRetentionCustomPolicies(state, action) {
    var _a, e_11, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICY: {
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[action.data.id] = action.data, _a));
        }
        case action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICIES: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _c = tslib_1.__values(action.data.policies), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var dataRetention = _d.value;
                    nextState[dataRetention.id] = dataRetention;
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_11) throw e_11.error; }
            }
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function dataRetentionCustomPoliciesCount(state, action) {
    if (state === void 0) { state = 0; }
    switch (action.type) {
        case action_types_1.AdminTypes.RECEIVED_DATA_RETENTION_CUSTOM_POLICIES:
            return action.data.total_count;
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return 0;
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // array of strings each representing a log entry
    logs: logs,
    // object where every key is an audit id and has an object with audit details
    audits: audits,
    // object representing the server configuration
    config: config,
    // object representing which fields of the server configuration were set through the environment config
    environmentConfig: environmentConfig,
    // object where every key is a report id and has an object with report details
    complianceReports: complianceReports,
    // array of cluster status data
    clusterInfo: clusterInfo,
    // object with certificate type as keys and boolean statuses as values
    samlCertStatus: samlCertStatus,
    // object with analytic categories as types and numbers as values
    analytics: analytics,
    // object with team ids as keys and analytics objects as values
    teamAnalytics: teamAnalytics,
    // object with user ids as keys and objects, with token ids as keys, and
    // user access tokens as values without actual token
    userAccessTokensByUser: userAccessTokensByUser,
    // object with token ids as keys, and user access tokens as values without actual token
    userAccessTokens: userAccessTokens,
    // object with plugin ids as keys and objects representing plugin manifests as values
    plugins: plugins,
    // object with plugin ids as keys and objects representing plugin statuses across the cluster
    pluginStatuses: pluginStatuses,
    // object representing the ldap groups
    ldapGroups: ldapGroups,
    // total ldap groups
    ldapGroupsCount: ldapGroupsCount,
    // object representing the metadata response obtained from the IdP
    samlMetadataResponse: samlMetadataResponse,
    // object representing the custom data retention policies
    dataRetentionCustomPolicies: dataRetentionCustomPolicies,
    // total custom retention policies
    dataRetentionCustomPoliciesCount: dataRetentionCustomPoliciesCount,
});
//# sourceMappingURL=admin.js.map