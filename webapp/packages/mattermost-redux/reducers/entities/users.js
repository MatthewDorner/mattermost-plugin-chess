"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var user_utils_1 = require("../../utils/user_utils");
function profilesToSet(state, action) {
    var _a;
    var id = action.id;
    var nextSet = new Set(state[id]);
    Object.keys(action.data).forEach(function (key) {
        nextSet.add(key);
    });
    return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[id] = nextSet, _a));
}
function profileListToSet(state, action, replace) {
    var _a;
    if (replace === void 0) { replace = false; }
    var id = action.id;
    var nextSet = replace ? new Set() : new Set(state[id]);
    if (action.data) {
        action.data.forEach(function (profile) {
            nextSet.add(profile.id);
        });
        return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[id] = nextSet, _a));
    }
    return state;
}
function removeProfileListFromSet(state, action) {
    var _a;
    var id = action.id;
    var nextSet = new Set(state[id]);
    if (action.data) {
        action.data.forEach(function (profile) {
            nextSet.delete(profile.id);
        });
        return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[id] = nextSet, _a));
    }
    return state;
}
function addProfileToSet(state, action) {
    var _a;
    var _b = action.data, id = _b.id, userId = _b.user_id;
    var nextSet = new Set(state[id]);
    nextSet.add(userId);
    return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[id] = nextSet, _a));
}
function removeProfileFromTeams(state, action) {
    var newState = tslib_1.__assign({}, state);
    var removed = false;
    Object.keys(state).forEach(function (key) {
        if (newState[key][action.data.user_id]) {
            delete newState[key][action.data.user_id];
            removed = true;
        }
    });
    return removed ? newState : state;
}
function removeProfileFromSet(state, action) {
    var _a;
    var _b = action.data, id = _b.id, userId = _b.user_id;
    var nextSet = new Set(state[id]);
    nextSet.delete(userId);
    return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[id] = nextSet, _a));
}
function currentUserId(state, action) {
    if (state === void 0) { state = ''; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_ME: {
            var data = action.data || action.payload;
            return data.id;
        }
        case action_types_1.UserTypes.LOGIN: { // Used by the mobile app
            var user = action.data.user;
            return user ? user.id : state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return '';
    }
    return state;
}
function mySessions(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_SESSIONS:
            return tslib_1.__spread(action.data);
        case action_types_1.UserTypes.RECEIVED_REVOKED_SESSION: {
            var index = -1;
            var length_1 = state.length;
            for (var i = 0; i < length_1; i++) {
                if (state[i].id === action.sessionId) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                return state.slice(0, index).concat(state.slice(index + 1));
            }
            return state;
        }
        case action_types_1.UserTypes.REVOKE_ALL_USER_SESSIONS_SUCCESS:
            if (action.data.isCurrentUser === true) {
                return [];
            }
            return state;
        case action_types_1.UserTypes.REVOKE_SESSIONS_FOR_ALL_USERS_SUCCESS:
            return [];
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function myAudits(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_AUDITS:
            return tslib_1.__spread(action.data);
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return [];
        default:
            return state;
    }
}
function profiles(state, action) {
    var _a, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_ME:
        case action_types_1.UserTypes.RECEIVED_PROFILE: {
            var data = action.data || action.payload;
            var user = tslib_1.__assign({}, data);
            var oldUser = state[data.id];
            if (oldUser) {
                user.terms_of_service_id = oldUser.terms_of_service_id;
                user.terms_of_service_create_at = oldUser.terms_of_service_create_at;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[data.id] = user, _a));
        }
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST:
            return Object.assign({}, state, user_utils_1.profileListToMap(action.data));
        case action_types_1.UserTypes.RECEIVED_PROFILES:
            return Object.assign({}, state, action.data);
        case action_types_1.UserTypes.LOGIN: { // Used by the mobile app
            var user = action.data.user;
            if (user) {
                var nextState = tslib_1.__assign({}, state);
                nextState[user.id] = user;
                return nextState;
            }
            return state;
        }
        case action_types_1.UserTypes.RECEIVED_BATCHED_PROFILES_IN_CHANNEL: {
            var data = action.data;
            if (data && data.length) {
                var nextState_1 = tslib_1.__assign({}, state);
                var ids_1 = new Set();
                data.forEach(function (d) {
                    d.data.users.forEach(function (u) {
                        if (!ids_1.has(u.id)) {
                            ids_1.add(u.id);
                            nextState_1[u.id] = u;
                        }
                    });
                });
                return nextState_1;
            }
            return state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        case action_types_1.UserTypes.RECEIVED_TERMS_OF_SERVICE_STATUS: {
            var data = action.data || action.payload;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[data.user_id] = tslib_1.__assign(tslib_1.__assign({}, state[data.user_id]), { terms_of_service_id: data.terms_of_service_id, terms_of_service_create_at: data.terms_of_service_create_at }), _b));
        }
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE: {
            if (state[action.data.user_id]) {
                var newState = tslib_1.__assign({}, state);
                delete newState[action.data.user_id];
                return newState;
            }
            return state;
        }
        default:
            return state;
    }
}
function profilesInTeam(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_PROFILE_IN_TEAM:
            return addProfileToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_TEAM:
            return profileListToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_IN_TEAM:
            return profilesToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILE_NOT_IN_TEAM:
            return removeProfileFromSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_TEAM:
            return removeProfileListFromSet(state, action);
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE:
            return removeProfileFromTeams(state, action);
        default:
            return state;
    }
}
function profilesNotInTeam(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_PROFILE_NOT_IN_TEAM:
            return addProfileToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_TEAM:
            return profileListToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_TEAM_AND_REPLACE:
            return profileListToSet(state, action, true);
        case action_types_1.UserTypes.RECEIVED_PROFILE_IN_TEAM:
            return removeProfileFromSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_TEAM:
            return removeProfileListFromSet(state, action);
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE:
            return removeProfileFromTeams(state, action);
        default:
            return state;
    }
}
function profilesWithoutTeam(state, action) {
    if (state === void 0) { state = new Set(); }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_PROFILE_WITHOUT_TEAM: {
            var nextSet_1 = new Set(state);
            Object.values(action.data).forEach(function (id) { return nextSet_1.add(id); });
            return nextSet_1;
        }
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_WITHOUT_TEAM: {
            var nextSet_2 = new Set(state);
            action.data.forEach(function (user) { return nextSet_2.add(user.id); });
            return nextSet_2;
        }
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE:
        case action_types_1.UserTypes.RECEIVED_PROFILE_IN_TEAM: {
            var nextSet = new Set(state);
            nextSet.delete(action.data.id);
            return nextSet;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return new Set();
        default:
            return state;
    }
}
function profilesInChannel(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_PROFILE_IN_CHANNEL:
            return addProfileToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_CHANNEL:
            return profileListToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_IN_CHANNEL:
            return profilesToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILE_NOT_IN_CHANNEL:
            return removeProfileFromSet(state, action);
        case action_types_1.ChannelTypes.CHANNEL_MEMBER_REMOVED:
            return removeProfileFromSet(state, {
                type: '',
                data: {
                    id: action.data.channel_id,
                    user_id: action.data.user_id,
                }
            });
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE:
            return removeProfileFromTeams(state, action);
        case action_types_1.UserTypes.RECEIVED_BATCHED_PROFILES_IN_CHANNEL: { // Used by the mobile  app
            var data = action.data;
            if (data && data.length) {
                var nextState_2 = tslib_1.__assign({}, state);
                data.forEach(function (d) {
                    var _a = d.data, channelId = _a.channelId, users = _a.users;
                    var nextSet = new Set(state[channelId]);
                    users.forEach(function (u) { return nextSet.add(u.id); });
                    nextState_2[channelId] = nextSet;
                });
                return nextState_2;
            }
            return state;
        }
        default:
            return state;
    }
}
function profilesNotInChannel(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_PROFILE_NOT_IN_CHANNEL:
            return addProfileToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_CHANNEL:
            return profileListToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_NOT_IN_CHANNEL_AND_REPLACE:
            return profileListToSet(state, action, true);
        case action_types_1.UserTypes.RECEIVED_PROFILES_NOT_IN_CHANNEL:
            return profilesToSet(state, action);
        case action_types_1.UserTypes.RECEIVED_PROFILE_IN_CHANNEL:
            return removeProfileFromSet(state, action);
        case action_types_1.ChannelTypes.CHANNEL_MEMBER_ADDED:
            return removeProfileFromSet(state, {
                type: '',
                data: {
                    id: action.data.channel_id,
                    user_id: action.data.user_id,
                }
            });
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE:
            return removeProfileFromTeams(state, action);
        default:
            return state;
    }
}
function profilesInGroup(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_PROFILES_LIST_IN_GROUP: {
            return profileListToSet(state, action);
        }
        default:
            return state;
    }
}
function statuses(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_STATUS: {
            var nextState = Object.assign({}, state);
            nextState[action.data.user_id] = action.data.status;
            return nextState;
        }
        case action_types_1.UserTypes.RECEIVED_STATUSES: {
            var nextState = Object.assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var s = _c.value;
                    nextState[s.user_id] = s.status;
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
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE: {
            if (state[action.data.user_id]) {
                var newState = tslib_1.__assign({}, state);
                delete newState[action.data.user_id];
                return newState;
            }
            return state;
        }
        case action_types_1.UserTypes.RECEIVED_BATCHED_PROFILES_IN_CHANNEL: { // Used by the mobile app
            var data = action.data;
            if (data && data.length) {
                var nextState_3 = tslib_1.__assign({}, state);
                var ids_2 = new Set();
                var hasNewStatuses_1 = false;
                data.forEach(function (d) {
                    var st = d.data.statuses;
                    if (st && st.length) {
                        st.forEach(function (u) {
                            if (!ids_2.has(u.user_id)) {
                                ids_2.add(u.user_id);
                                nextState_3[u.user_id] = u.status;
                                hasNewStatuses_1 = true;
                            }
                        });
                    }
                });
                if (hasNewStatuses_1) {
                    return nextState_3;
                }
            }
            return state;
        }
        default:
            return state;
    }
}
function isManualStatus(state, action) {
    var e_2, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_STATUS: {
            var nextState = Object.assign({}, state);
            nextState[action.data.user_id] = action.data.manual;
            return nextState;
        }
        case action_types_1.UserTypes.RECEIVED_STATUSES: {
            var nextState = Object.assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var s = _c.value;
                    nextState[s.user_id] = s.manual;
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
        case action_types_1.UserTypes.PROFILE_NO_LONGER_VISIBLE: {
            if (state[action.data.user_id]) {
                var newState = tslib_1.__assign({}, state);
                delete newState[action.data.user_id];
                return newState;
            }
            return state;
        }
        default:
            return state;
    }
}
function myUserAccessTokens(state, action) {
    var e_3, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_MY_USER_ACCESS_TOKEN: {
            var nextState = tslib_1.__assign({}, state);
            nextState[action.data.id] = action.data;
            return nextState;
        }
        case action_types_1.UserTypes.RECEIVED_MY_USER_ACCESS_TOKENS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var uat = _c.value;
                    nextState[uat.id] = uat;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return nextState;
        }
        case action_types_1.UserTypes.REVOKED_USER_ACCESS_TOKEN: {
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, action.data);
            return nextState;
        }
        case action_types_1.UserTypes.ENABLED_USER_ACCESS_TOKEN: {
            if (state[action.data]) {
                var nextState = tslib_1.__assign({}, state);
                nextState[action.data] = tslib_1.__assign(tslib_1.__assign({}, nextState[action.data]), { is_active: true });
                return nextState;
            }
            return state;
        }
        case action_types_1.UserTypes.DISABLED_USER_ACCESS_TOKEN: {
            if (state[action.data]) {
                var nextState = tslib_1.__assign({}, state);
                nextState[action.data] = tslib_1.__assign(tslib_1.__assign({}, nextState[action.data]), { is_active: false });
                return nextState;
            }
            return state;
        }
        case action_types_1.UserTypes.CLEAR_MY_USER_ACCESS_TOKENS:
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
function stats(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_USER_STATS: {
            var stat = action.data;
            return tslib_1.__assign(tslib_1.__assign({}, state), stat);
        }
        default:
            return state;
    }
}
function filteredStats(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.UserTypes.RECEIVED_FILTERED_USER_STATS: {
            var stat = action.data;
            return tslib_1.__assign(tslib_1.__assign({}, state), stat);
        }
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // the current selected user
    currentUserId: currentUserId,
    // array with the user's sessions
    mySessions: mySessions,
    // array with the user's audits
    myAudits: myAudits,
    // object where every key is the token id and has a user access token as a value
    myUserAccessTokens: myUserAccessTokens,
    // object where every key is a user id and has an object with the users details
    profiles: profiles,
    // object where every key is a team id and has a Set with the users id that are members of the team
    profilesInTeam: profilesInTeam,
    // object where every key is a team id and has a Set with the users id that are not members of the team
    profilesNotInTeam: profilesNotInTeam,
    // set with user ids for users that are not on any team
    profilesWithoutTeam: profilesWithoutTeam,
    // object where every key is a channel id and has a Set with the users id that are members of the channel
    profilesInChannel: profilesInChannel,
    // object where every key is a channel id and has a Set with the users id that are not members of the channel
    profilesNotInChannel: profilesNotInChannel,
    // object where every key is a group id and has a Set with the users id that are members of the group
    profilesInGroup: profilesInGroup,
    // object where every key is the user id and has a value with the current status of each user
    statuses: statuses,
    // object where every key is the user id and has a value with a flag determining if their status was set manually
    isManualStatus: isManualStatus,
    // Total user stats
    stats: stats,
    // Total user stats after filters have been applied
    filteredStats: filteredStats,
});
//# sourceMappingURL=users.js.map