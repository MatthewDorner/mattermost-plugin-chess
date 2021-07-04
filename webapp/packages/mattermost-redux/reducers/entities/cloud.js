"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function subscription(state, action) {
    if (state === void 0) { state = null; }
    switch (action.type) {
        case action_types_1.CloudTypes.RECEIVED_CLOUD_SUBSCRIPTION: {
            return action.data;
        }
        default:
            return state;
    }
}
function customer(state, action) {
    if (state === void 0) { state = null; }
    switch (action.type) {
        case action_types_1.CloudTypes.RECEIVED_CLOUD_CUSTOMER: {
            return action.data;
        }
        default:
            return state;
    }
}
function products(state, action) {
    if (state === void 0) { state = null; }
    switch (action.type) {
        case action_types_1.CloudTypes.RECEIVED_CLOUD_PRODUCTS: {
            var productList = action.data;
            var productDict = productList.reduce(function (map, obj) {
                map[obj.id] = obj;
                return map;
            }, {});
            return tslib_1.__assign(tslib_1.__assign({}, state), productDict);
        }
        default:
            return state;
    }
}
function invoices(state, action) {
    if (state === void 0) { state = null; }
    switch (action.type) {
        case action_types_1.CloudTypes.RECEIVED_CLOUD_INVOICES: {
            var invoiceList = action.data;
            var invoiceDict = invoiceList.reduce(function (map, obj) {
                map[obj.id] = obj;
                return map;
            }, {});
            return tslib_1.__assign(tslib_1.__assign({}, state), invoiceDict);
        }
        default:
            return state;
    }
}
function subscriptionStats(state, action) {
    if (state === void 0) { state = null; }
    switch (action.type) {
        case action_types_1.CloudTypes.RECEIVED_CLOUD_SUBSCRIPTION_STATS: {
            var data = action.data;
            return tslib_1.__assign(tslib_1.__assign({}, state), data);
        }
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // represents the current cloud customer
    customer: customer,
    // represents the current cloud subscription
    subscription: subscription,
    // represents the cloud products offered
    products: products,
    // represents the invoices tied to the current subscription
    invoices: invoices,
    subscriptionStats: subscriptionStats,
});
//# sourceMappingURL=cloud.js.map