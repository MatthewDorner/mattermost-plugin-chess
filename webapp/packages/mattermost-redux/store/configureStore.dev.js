"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_1 = require("redux");
var redux_devtools_extension_1 = require("redux-devtools-extension");
var reducer_registry_1 = tslib_1.__importDefault(require("./reducer_registry"));
var reducers_1 = tslib_1.__importDefault(require("../reducers"));
var deep_freeze_1 = tslib_1.__importDefault(require("../utils/deep_freeze"));
var initial_state_1 = tslib_1.__importDefault(require("./initial_state"));
var helpers_1 = require("./helpers");
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
function configureServiceStore(preloadedState, appReducer, persistConfig, getAppReducer, clientOptions) {
    var baseState = Object.assign({}, initial_state_1.default, preloadedState);
    var store = redux_1.createStore(createDevReducer(baseState, reducers_1.default, appReducer), baseState, redux_devtools_extension_1.composeWithDevTools(redux_1.applyMiddleware.apply(void 0, tslib_1.__spread(middleware_1.createMiddleware(clientOptions)))));
    reducer_registry_1.default.setChangeListener(function (reducers) {
        store.replaceReducer(createDevReducer(baseState, reducers));
    });
    // launch store persistor
    if (persistConfig.persist) {
        persistConfig.persist(store, persistConfig.persistOptions, persistConfig.persistCallback);
    }
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept(function () {
            var nextServiceReducer = require('../reducers').default; // eslint-disable-line global-require
            var nextAppReducer;
            if (getAppReducer) {
                nextAppReducer = getAppReducer(); // eslint-disable-line global-require
            }
            store.replaceReducer(createDevReducer(baseState, reducer_registry_1.default.getReducers(), nextServiceReducer, nextAppReducer));
        });
    }
    return store;
}
exports.default = configureServiceStore;
function createDevReducer(baseState) {
    var reducers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        reducers[_i - 1] = arguments[_i];
    }
    return enableFreezing(helpers_1.createReducer.apply(void 0, tslib_1.__spread([baseState], reducers)));
}
function enableFreezing(reducer) {
    return function (state, action) {
        var nextState = reducer(state, action);
        if (nextState !== state) {
            deep_freeze_1.default(nextState);
        }
        return nextState;
    };
}
//# sourceMappingURL=configureStore.dev.js.map