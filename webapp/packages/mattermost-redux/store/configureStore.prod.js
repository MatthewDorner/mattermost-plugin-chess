"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var reducer_registry_1 = tslib_1.__importDefault(require("./reducer_registry"));
var reducers_1 = tslib_1.__importDefault(require("../reducers"));
var helpers_1 = require("./helpers");
var initial_state_1 = tslib_1.__importDefault(require("./initial_state"));
var middleware_1 = require("./middleware");
/**
 * Configures and constructs the redux store. Accepts the following parameters:
 * preloadedState - Any preloaded state to be applied to the store after it is initially configured.
 * appReducer - An object containing any app-specific reducer functions that the client needs.
 * persistConfig - Any additional configuration data to be passed into redux-persist aside from the default values.
 * getAppReducer - A function that returns the appReducer as defined above. Only used in development to enable hot reloading.
 * clientOptions - An object containing additional options used when configuring the redux store. The following options are available:
 *     additionalMiddleware - func | array - Allows for single or multiple additional middleware functions to be passed in from the client side.
 *     enableThunk - bool - default = true - If true, include the thunk middleware automatically. If false, thunk must be provided as part of additionalMiddleware.
 */
function configureOfflineServiceStore(preloadedState, appReducer, persistConfig, getAppReducer, clientOptions) {
    if (clientOptions === void 0) { clientOptions = {}; }
    var baseState = Object.assign({}, initial_state_1.default, preloadedState);
    var store = redux_1.createStore(helpers_1.createReducer(baseState, reducers_1.default, appReducer), baseState, redux_1.applyMiddleware.apply(void 0, tslib_1.__spread(middleware_1.createMiddleware(clientOptions))));
    reducer_registry_1.default.setChangeListener(function (reducers) {
        store.replaceReducer(helpers_1.createReducer(baseState, reducers));
    });
    // launch store persistor
    if (persistConfig.persist) {
        persistConfig.persist(store, persistConfig.persistOptions, persistConfig.persistCallback);
    }
    return store;
}
exports.default = configureOfflineServiceStore;
//# sourceMappingURL=configureStore.prod.js.map