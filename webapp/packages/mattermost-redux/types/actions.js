"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableBatching = exports.batchActions = exports.BATCH = void 0;
exports.BATCH = 'BATCHING_REDUCER.BATCH';
function batchActions(actions, type) {
    if (type === void 0) { type = exports.BATCH; }
    return { type: type, meta: { batch: true }, payload: actions };
}
exports.batchActions = batchActions;
function enableBatching(reduce) {
    return function batchingReducer(state, action) {
        if (action && 'meta' in action && action.meta.batch) {
            return action.payload.reduce(batchingReducer, state);
        }
        return reduce(state, action);
    };
}
exports.enableBatching = enableBatching;
//# sourceMappingURL=actions.js.map