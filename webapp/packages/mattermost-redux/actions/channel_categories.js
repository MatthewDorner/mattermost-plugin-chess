"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.renameCategory = exports.createCategory = exports.receivedCategoryOrder = exports.moveCategory = exports.moveChannelsToCategory = exports.moveChannelToCategory = exports.addChannelToCategory = exports.addChannelToInitialCategory = exports.fetchMyCategories = exports.updateCategory = exports.setCategoryMuted = exports.setCategorySorting = exports.collapseCategory = exports.expandCategory = void 0;
var tslib_1 = require("tslib");
var action_types_1 = require("../action_types");
var client_1 = require("../client");
var channels_1 = require("./channels");
var errors_1 = require("./errors");
var helpers_1 = require("./helpers");
var constants_1 = require("../constants");
var channel_categories_1 = require("../constants/channel_categories");
var channel_categories_2 = require("../selectors/entities/channel_categories");
var users_1 = require("../selectors/entities/users");
var actions_1 = require("../types/actions");
var channel_categories_3 = require("../types/channel_categories");
var array_utils_1 = require("../utils/array_utils");
function expandCategory(categoryId) {
    return {
        type: action_types_1.ChannelCategoryTypes.CATEGORY_EXPANDED,
        data: categoryId,
    };
}
exports.expandCategory = expandCategory;
function collapseCategory(categoryId) {
    return {
        type: action_types_1.ChannelCategoryTypes.CATEGORY_COLLAPSED,
        data: categoryId,
    };
}
exports.collapseCategory = collapseCategory;
function setCategorySorting(categoryId, sorting) {
    return function (dispatch, getState) {
        var state = getState();
        var category = channel_categories_2.getCategory(state, categoryId);
        return dispatch(updateCategory(tslib_1.__assign(tslib_1.__assign({}, category), { sorting: sorting })));
    };
}
exports.setCategorySorting = setCategorySorting;
function setCategoryMuted(categoryId, muted) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, category, result, updated;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    category = channel_categories_2.getCategory(state, categoryId);
                    return [4 /*yield*/, dispatch(updateCategory(tslib_1.__assign(tslib_1.__assign({}, category), { muted: muted })))];
                case 1:
                    result = _a.sent();
                    if ('error' in result) {
                        return [2 /*return*/, result];
                    }
                    updated = result.data;
                    return [2 /*return*/, dispatch(actions_1.batchActions(tslib_1.__spread([
                            {
                                type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORY,
                                data: updated,
                            }
                        ], (updated.channel_ids.map(function (channelId) { return ({
                            type: action_types_1.ChannelTypes.SET_CHANNEL_MUTED,
                            data: {
                                channelId: channelId,
                                muted: muted,
                            },
                        }); })))))];
            }
        });
    }); };
}
exports.setCategoryMuted = setCategoryMuted;
function updateCategory(category) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, currentUserId, updatedCategory, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    currentUserId = users_1.getCurrentUserId(state);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.updateChannelCategory(currentUserId, category.team_id, category)];
                case 2:
                    updatedCategory = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_1, dispatch, getState);
                    dispatch(errors_1.logError(error_1));
                    return [2 /*return*/, { error: error_1 }];
                case 4: 
                // The updated category will be added to the state after receiving the corresponding websocket event.
                return [2 /*return*/, { data: updatedCategory }];
            }
        });
    }); };
}
exports.updateCategory = updateCategory;
function fetchMyCategories(teamId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, data, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = users_1.getCurrentUserId(getState());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.getChannelCategories(currentUserId, teamId)];
                case 2:
                    data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_2, dispatch, getState);
                    dispatch(errors_1.logError(error_2));
                    return [2 /*return*/, { error: error_2 }];
                case 4: return [2 /*return*/, dispatch(actions_1.batchActions([
                        {
                            type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORIES,
                            data: data.categories,
                        },
                        {
                            type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORY_ORDER,
                            data: {
                                teamId: teamId,
                                order: data.order,
                            },
                        },
                    ]))];
            }
        });
    }); };
}
exports.fetchMyCategories = fetchMyCategories;
// addChannelToInitialCategory returns an action that can be dispatched to add a newly-joined or newly-created channel
// to its either the Channels or Direct Messages category based on the type of channel. New DM and GM channels are
// added to the Direct Messages category on each team.
//
// Unless setOnServer is true, this only affects the categories on this client. If it is set to true, this updates
// categories on the server too.
function addChannelToInitialCategory(channel, setOnServer) {
    if (setOnServer === void 0) { setOnServer = false; }
    return function (dispatch, getState) {
        var state = getState();
        var categories = Object.values(channel_categories_2.getAllCategoriesByIds(state));
        if (channel.type === constants_1.General.DM_CHANNEL || channel.type === constants_1.General.GM_CHANNEL) {
            var allDmCategories = categories.filter(function (category) { return category.type === channel_categories_1.CategoryTypes.DIRECT_MESSAGES; });
            // Get all the categories in which channel exists
            var channelInCategories_1 = categories.filter(function (category) {
                return category.channel_ids.findIndex(function (channelId) { return channelId === channel.id; }) !== -1;
            });
            // Skip DM categories where channel already exists in a different category
            var dmCategories = allDmCategories.filter(function (dmCategory) {
                return channelInCategories_1.findIndex(function (category) { return dmCategory.team_id === category.team_id; }) === -1;
            });
            return dispatch({
                type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORIES,
                data: dmCategories.map(function (category) { return (tslib_1.__assign(tslib_1.__assign({}, category), { channel_ids: array_utils_1.insertWithoutDuplicates(category.channel_ids, channel.id, 0) })); }),
            });
        }
        // Add the new channel to the Channels category on the channel's team
        if (categories.some(function (category) { return category.channel_ids.some(function (channelId) { return channelId === channel.id; }); })) {
            return { data: false };
        }
        var channelsCategory = channel_categories_2.getCategoryInTeamByType(state, channel.team_id, channel_categories_1.CategoryTypes.CHANNELS);
        if (!channelsCategory) {
            // No categories were found for this team, so the categories for this team haven't been loaded yet.
            // The channel will have been added to the category by the server, so we'll get it once the categories
            // are actually loaded.
            return { data: false };
        }
        if (setOnServer) {
            return dispatch(addChannelToCategory(channelsCategory.id, channel.id));
        }
        return dispatch({
            type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORY,
            data: tslib_1.__assign(tslib_1.__assign({}, channelsCategory), { channel_ids: array_utils_1.insertWithoutDuplicates(channelsCategory.channel_ids, channel.id, 0) }),
        });
    };
}
exports.addChannelToInitialCategory = addChannelToInitialCategory;
// addChannelToCategory returns an action that can be dispatched to add a channel to a given category without specifying
// its order. The channel will be removed from its previous category (if any) on the given category's team and it will be
// placed first in its new category.
function addChannelToCategory(categoryId, channelId) {
    return moveChannelToCategory(categoryId, channelId, 0, false);
}
exports.addChannelToCategory = addChannelToCategory;
// moveChannelToCategory returns an action that moves a channel into a category and puts it at the given index at the
// category. The channel will also be removed from its previous category (if any) on that category's team. The category's
// order will also be set to manual by default.
function moveChannelToCategory(categoryId, channelId, newIndex, setManualSorting) {
    var _this = this;
    if (setManualSorting === void 0) { setManualSorting = true; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, targetCategory, currentUserId, sorting, categories, sourceCategory, result, error_3, originalCategories;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    targetCategory = channel_categories_2.getCategory(state, categoryId);
                    currentUserId = users_1.getCurrentUserId(state);
                    sorting = targetCategory.sorting;
                    if (setManualSorting &&
                        targetCategory.type !== channel_categories_1.CategoryTypes.DIRECT_MESSAGES &&
                        targetCategory.sorting === channel_categories_3.CategorySorting.Default) {
                        sorting = channel_categories_3.CategorySorting.Manual;
                    }
                    categories = [tslib_1.__assign(tslib_1.__assign({}, targetCategory), { sorting: sorting, channel_ids: array_utils_1.insertWithoutDuplicates(targetCategory.channel_ids, channelId, newIndex) })];
                    sourceCategory = channel_categories_2.getCategoryInTeamWithChannel(getState(), targetCategory.team_id, channelId);
                    if (sourceCategory && sourceCategory.id !== targetCategory.id) {
                        categories.push(tslib_1.__assign(tslib_1.__assign({}, sourceCategory), { channel_ids: array_utils_1.removeItem(sourceCategory.channel_ids, channelId) }));
                    }
                    result = dispatch({
                        type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORIES,
                        data: categories,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.updateChannelCategories(currentUserId, targetCategory.team_id, categories)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_3, dispatch, getState);
                    dispatch(errors_1.logError(error_3));
                    originalCategories = [targetCategory];
                    if (sourceCategory && sourceCategory.id !== targetCategory.id) {
                        originalCategories.push(sourceCategory);
                    }
                    dispatch({
                        type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORIES,
                        data: originalCategories,
                    });
                    return [2 /*return*/, { error: error_3 }];
                case 4:
                    if (!(targetCategory.type === channel_categories_1.CategoryTypes.FAVORITES)) return [3 /*break*/, 6];
                    return [4 /*yield*/, dispatch(channels_1.favoriteChannel(channelId, false))];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6:
                    if (!(sourceCategory && sourceCategory.type === channel_categories_1.CategoryTypes.FAVORITES)) return [3 /*break*/, 8];
                    return [4 /*yield*/, dispatch(channels_1.unfavoriteChannel(channelId, false))];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, result];
            }
        });
    }); };
}
exports.moveChannelToCategory = moveChannelToCategory;
function moveChannelsToCategory(categoryId, channelIds, newIndex, setManualSorting) {
    var _this = this;
    if (setManualSorting === void 0) { setManualSorting = true; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, targetCategory, currentUserId, sorting, categories, unmodifiedCategories, sourceCategories, categoriesArray, result, error_4, originalCategories;
        var _a, _b;
        var _this = this;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    targetCategory = channel_categories_2.getCategory(state, categoryId);
                    currentUserId = users_1.getCurrentUserId(state);
                    sorting = targetCategory.sorting;
                    if (setManualSorting &&
                        targetCategory.type !== channel_categories_1.CategoryTypes.DIRECT_MESSAGES &&
                        targetCategory.sorting === channel_categories_3.CategorySorting.Default) {
                        sorting = channel_categories_3.CategorySorting.Manual;
                    }
                    categories = (_a = {},
                        _a[targetCategory.id] = tslib_1.__assign(tslib_1.__assign({}, targetCategory), { sorting: sorting, channel_ids: array_utils_1.insertMultipleWithoutDuplicates(targetCategory.channel_ids, channelIds, newIndex) }),
                        _a);
                    unmodifiedCategories = (_b = {}, _b[targetCategory.id] = targetCategory, _b);
                    sourceCategories = {};
                    // And remove it from the old categories
                    channelIds.forEach(function (channelId) {
                        var _a, _b, _c;
                        var sourceCategory = channel_categories_2.getCategoryInTeamWithChannel(getState(), targetCategory.team_id, channelId);
                        if (sourceCategory && sourceCategory.id !== targetCategory.id) {
                            unmodifiedCategories = tslib_1.__assign(tslib_1.__assign({}, unmodifiedCategories), (_a = {}, _a[sourceCategory.id] = sourceCategory, _a));
                            sourceCategories = tslib_1.__assign(tslib_1.__assign({}, sourceCategories), (_b = {}, _b[channelId] = sourceCategory.id, _b));
                            categories = tslib_1.__assign(tslib_1.__assign({}, categories), (_c = {}, _c[sourceCategory.id] = tslib_1.__assign(tslib_1.__assign({}, (categories[sourceCategory.id] || sourceCategory)), { channel_ids: array_utils_1.removeItem((categories[sourceCategory.id] || sourceCategory).channel_ids, channelId) }), _c));
                        }
                    });
                    categoriesArray = Object.values(categories).reduce(function (allCategories, category) {
                        allCategories.push(category);
                        return allCategories;
                    }, []);
                    result = dispatch({
                        type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORIES,
                        data: categoriesArray,
                    });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.updateChannelCategories(currentUserId, targetCategory.team_id, categoriesArray)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _c.sent();
                    helpers_1.forceLogoutIfNecessary(error_4, dispatch, getState);
                    dispatch(errors_1.logError(error_4));
                    originalCategories = Object.values(unmodifiedCategories).reduce(function (allCategories, category) {
                        allCategories.push(category);
                        return allCategories;
                    }, []);
                    dispatch({
                        type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORIES,
                        data: originalCategories,
                    });
                    return [2 /*return*/, { error: error_4 }];
                case 4: 
                // Update the favorite preferences locally on the client in case we have any logic relying on that
                return [4 /*yield*/, Promise.all(channelIds.map(function (channelId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var sourceCategory;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sourceCategory = unmodifiedCategories[sourceCategories[channelId]];
                                    if (!(targetCategory.type === channel_categories_1.CategoryTypes.FAVORITES)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, dispatch(channels_1.favoriteChannel(channelId, false))];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    if (!(sourceCategory && sourceCategory.type === channel_categories_1.CategoryTypes.FAVORITES)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, dispatch(channels_1.unfavoriteChannel(channelId, false))];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
                case 5:
                    // Update the favorite preferences locally on the client in case we have any logic relying on that
                    _c.sent();
                    return [2 /*return*/, result];
            }
        });
    }); };
}
exports.moveChannelsToCategory = moveChannelsToCategory;
function moveCategory(teamId, categoryId, newIndex) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, order, currentUserId, newOrder, result, error_5;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    order = channel_categories_2.getCategoryIdsForTeam(state, teamId);
                    currentUserId = users_1.getCurrentUserId(state);
                    newOrder = array_utils_1.insertWithoutDuplicates(order, categoryId, newIndex);
                    result = dispatch({
                        type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORY_ORDER,
                        data: {
                            teamId: teamId,
                            order: newOrder,
                        },
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.updateChannelCategoryOrder(currentUserId, teamId, newOrder)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_5, dispatch, getState);
                    dispatch(errors_1.logError(error_5));
                    // Restore original order
                    dispatch({
                        type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORY_ORDER,
                        data: {
                            teamId: teamId,
                            order: order,
                        },
                    });
                    return [2 /*return*/, { error: error_5 }];
                case 4: return [2 /*return*/, result];
            }
        });
    }); };
}
exports.moveCategory = moveCategory;
function receivedCategoryOrder(teamId, order) {
    return {
        type: action_types_1.ChannelCategoryTypes.RECEIVED_CATEGORY_ORDER,
        data: {
            teamId: teamId,
            order: order,
        },
    };
}
exports.receivedCategoryOrder = receivedCategoryOrder;
function createCategory(teamId, displayName, channelIds) {
    var _this = this;
    if (channelIds === void 0) { channelIds = []; }
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var currentUserId, newCategory, error_6;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentUserId = users_1.getCurrentUserId(getState());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.createChannelCategory(currentUserId, teamId, {
                            team_id: teamId,
                            user_id: currentUserId,
                            display_name: displayName,
                            channel_ids: channelIds,
                        })];
                case 2:
                    newCategory = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_6, dispatch, getState);
                    dispatch(errors_1.logError(error_6));
                    return [2 /*return*/, { error: error_6 }];
                case 4: 
                // The new category will be added to the state after receiving the corresponding websocket event.
                return [2 /*return*/, { data: newCategory }];
            }
        });
    }); };
}
exports.createCategory = createCategory;
function renameCategory(categoryId, displayName) {
    return function (dispatch, getState) {
        var state = getState();
        var category = channel_categories_2.getCategory(state, categoryId);
        return dispatch(updateCategory(tslib_1.__assign(tslib_1.__assign({}, category), { display_name: displayName })));
    };
}
exports.renameCategory = renameCategory;
function deleteCategory(categoryId) {
    var _this = this;
    return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var state, category, currentUserId, error_7;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    category = channel_categories_2.getCategory(state, categoryId);
                    currentUserId = users_1.getCurrentUserId(state);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client_1.Client4.deleteChannelCategory(currentUserId, category.team_id, category.id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    helpers_1.forceLogoutIfNecessary(error_7, dispatch, getState);
                    dispatch(errors_1.logError(error_7));
                    return [2 /*return*/, { error: error_7 }];
                case 4: 
                // The category will be deleted from the state after receiving the corresponding websocket event.
                return [2 /*return*/, { data: true }];
            }
        });
    }); };
}
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=channel_categories.js.map