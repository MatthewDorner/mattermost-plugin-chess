"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderByTeam = exports.byId = void 0;
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var array_utils_1 = require("../../utils/array_utils");
function byId(state, action) {
    var _a, e_1, _b, e_2, _c;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORIES: {
            var categories = action.data;
            return categories.reduce(function (nextState, category) {
                var _a;
                return tslib_1.__assign(tslib_1.__assign({}, nextState), (_a = {}, _a[category.id] = tslib_1.__assign(tslib_1.__assign({}, nextState[category.id]), category), _a));
            }, state);
        }
        case action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORY: {
            var category = action.data;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[category.id] = tslib_1.__assign(tslib_1.__assign({}, state[category.id]), category), _a));
        }
        case action_types_1.ChannelCategoryTypes.CATEGORY_DELETED: {
            var categoryId = action.data;
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, categoryId);
            return nextState;
        }
        case action_types_1.ChannelTypes.LEAVE_CHANNEL: {
            var channelId = action.data.id;
            var nextState = tslib_1.__assign({}, state);
            var changed = false;
            try {
                for (var _d = tslib_1.__values(Object.values(state)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var category = _e.value;
                    var index = category.channel_ids.indexOf(channelId);
                    if (index === -1) {
                        continue;
                    }
                    var nextChannelIds = tslib_1.__spread(category.channel_ids);
                    nextChannelIds.splice(index, 1);
                    nextState[category.id] = tslib_1.__assign(tslib_1.__assign({}, category), { channel_ids: nextChannelIds });
                    changed = true;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return changed ? nextState : state;
        }
        case action_types_1.TeamTypes.LEAVE_TEAM: {
            var team = action.data;
            var nextState = tslib_1.__assign({}, state);
            var changed = false;
            try {
                for (var _f = tslib_1.__values(Object.values(state)), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var category = _g.value;
                    if (category.team_id !== team.id) {
                        continue;
                    }
                    Reflect.deleteProperty(nextState, category.id);
                    changed = true;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return changed ? nextState : state;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.byId = byId;
function orderByTeam(state, action) {
    var _a, e_3, _b;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORY_ORDER: {
            var teamId = action.data.teamId;
            var order = action.data.order;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_a = {}, _a[teamId] = order, _a));
        }
        case action_types_1.ChannelCategoryTypes.CATEGORY_DELETED: {
            var categoryId = action.data;
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _c = tslib_1.__values(Object.keys(nextState)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var teamId = _d.value;
                    // removeItem only modifies the array if it contains the category ID, so other teams' state won't be modified
                    nextState[teamId] = array_utils_1.removeItem(state[teamId], categoryId);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return nextState;
        }
        case action_types_1.TeamTypes.LEAVE_TEAM: {
            var team = action.data;
            if (!state[team.id]) {
                return state;
            }
            var nextState = tslib_1.__assign({}, state);
            Reflect.deleteProperty(nextState, team.id);
            return nextState;
        }
        case action_types_1.UserTypes.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}
exports.orderByTeam = orderByTeam;
exports.default = redux_1.combineReducers({
    byId: byId,
    orderByTeam: orderByTeam,
});
//# sourceMappingURL=channel_categories.js.map