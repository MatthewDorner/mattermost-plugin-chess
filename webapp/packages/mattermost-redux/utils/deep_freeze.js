"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable header/header */
/**
 * If your application is accepting different values for the same field over
 * time and is doing a diff on them, you can either (1) create a copy or
 * (2) ensure that those values are not mutated behind two passes.
 * This function helps you with (2) by freezing the object and throwing if
 * the user subsequently modifies the value.
 *
 * There are two caveats with this function:
 *   - If the call site is not in strict mode, it will only throw when
 *     mutating existing fields, adding a new one
 *     will unfortunately fail silently :(
 *   - If the object is already frozen or sealed, it will not continue the
 *     deep traversal and will leave leaf nodes unfrozen.
 *
 * Freezing the object and adding the throw mechanism is expensive and will
 * only be used in DEV.
 */
function deepFreezeAndThrowOnMutation(object) {
    // Some objects in IE11 don't have a hasOwnProperty method so don't even bother trying to freeze them
    if (typeof object !== 'object' || object === null || Object.isFrozen(object) || Object.isSealed(object)) {
        return object;
    }
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            object.__defineGetter__(key, identity.bind(null, object[key])); // eslint-disable-line no-underscore-dangle
            object.__defineSetter__(key, throwOnImmutableMutation.bind(null, key)); // eslint-disable-line no-underscore-dangle
        }
    }
    Object.freeze(object);
    Object.seal(object);
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            deepFreezeAndThrowOnMutation(object[key]);
        }
    }
    return object;
}
exports.default = deepFreezeAndThrowOnMutation;
function throwOnImmutableMutation(key, value) {
    throw Error('You attempted to set the key `' + key + '` with the value `' +
        JSON.stringify(value) + '` on an object that is meant to be immutable ' +
        'and has been frozen.');
}
function identity(value) {
    return value;
}
//# sourceMappingURL=deep_freeze.js.map