"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMiddleware = void 0;
var tslib_1 = require("tslib");
var redux_thunk_1 = tslib_1.__importDefault(require("redux-thunk"));
var defaultOptions = {
    additionalMiddleware: [],
    enableThunk: true,
};
function createMiddleware(clientOptions) {
    var options = Object.assign({}, defaultOptions, clientOptions);
    var additionalMiddleware = options.additionalMiddleware, enableThunk = options.enableThunk;
    var middleware = [];
    if (enableThunk) {
        middleware.push(redux_thunk_1.default);
    }
    if (additionalMiddleware) {
        if (typeof additionalMiddleware === 'function') {
            middleware.push(additionalMiddleware);
        }
        else {
            middleware.push.apply(middleware, tslib_1.__spread(additionalMiddleware));
        }
    }
    return middleware;
}
exports.createMiddleware = createMiddleware;
//# sourceMappingURL=middleware.js.map