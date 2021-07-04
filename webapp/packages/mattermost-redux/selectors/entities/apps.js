"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppBindings = void 0;
// This file's contents belong to the Apps Framework feature.
// Apps Framework feature is experimental, and the contents of this file are
// susceptible to breaking changes without pushing the major version of this package.
function getAppBindings(state, location) {
    if (!state.entities.apps.bindings) {
        return [];
    }
    if (location) {
        var headerBindings = state.entities.apps.bindings.filter(function (b) { return b.location === location; });
        return headerBindings.reduce(function (accum, current) { return accum.concat(current.bindings || []); }, []);
    }
    return state.entities.apps.bindings;
}
exports.getAppBindings = getAppBindings;
//# sourceMappingURL=apps.js.map