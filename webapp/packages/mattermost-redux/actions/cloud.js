"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCloudCustomerAddress = exports.updateCloudCustomer = exports.getInvoices = exports.getCloudCustomer = exports.getSubscriptionStats = exports.getCloudProducts = exports.getCloudSubscription = void 0;
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var action_types_1 = require("../action_types");
var client_1 = require("../client");
var helpers_1 = require("./helpers");
function getCloudSubscription() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getSubscription,
        onSuccess: [action_types_1.CloudTypes.RECEIVED_CLOUD_SUBSCRIPTION],
    });
}
exports.getCloudSubscription = getCloudSubscription;
function getCloudProducts() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getCloudProducts,
        onSuccess: [action_types_1.CloudTypes.RECEIVED_CLOUD_PRODUCTS],
    });
}
exports.getCloudProducts = getCloudProducts;
function getSubscriptionStats() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getSubscriptionStats,
        onSuccess: action_types_1.CloudTypes.RECEIVED_CLOUD_SUBSCRIPTION_STATS,
    });
}
exports.getSubscriptionStats = getSubscriptionStats;
function getCloudCustomer() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getCloudCustomer,
        onSuccess: [action_types_1.CloudTypes.RECEIVED_CLOUD_CUSTOMER],
    });
}
exports.getCloudCustomer = getCloudCustomer;
function getInvoices() {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getInvoices,
        onSuccess: [action_types_1.CloudTypes.RECEIVED_CLOUD_INVOICES],
    });
}
exports.getInvoices = getInvoices;
function updateCloudCustomer(customerPatch) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.updateCloudCustomer,
        onSuccess: [action_types_1.CloudTypes.RECEIVED_CLOUD_CUSTOMER],
        params: [customerPatch],
    });
}
exports.updateCloudCustomer = updateCloudCustomer;
function updateCloudCustomerAddress(address) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.updateCloudCustomerAddress,
        onSuccess: [action_types_1.CloudTypes.RECEIVED_CLOUD_CUSTOMER],
        params: [address],
    });
}
exports.updateCloudCustomerAddress = updateCloudCustomerAddress;
//# sourceMappingURL=cloud.js.map