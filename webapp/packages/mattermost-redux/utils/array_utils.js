"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.insertMultipleWithoutDuplicates = exports.insertWithoutDuplicates = void 0;
var tslib_1 = require("tslib");
// insertWithoutDuplicates inserts an item into an array and returns the result. The provided array is not modified.
// If the array already contains the given item, that item is moved to the new location instead of adding a duplicate.
// If the array already had the given item at the given index, the origianl array is returned.
function insertWithoutDuplicates(array, item, newIndex) {
    var index = array.indexOf(item);
    if (newIndex === index) {
        // The item doesn't need to be moved since its location hasn't changed
        return array;
    }
    var newArray = tslib_1.__spread(array);
    // Remove the item from its old location if it already exists in the array
    if (index !== -1) {
        newArray.splice(index, 1);
    }
    // And re-add it in its new location
    newArray.splice(newIndex, 0, item);
    return newArray;
}
exports.insertWithoutDuplicates = insertWithoutDuplicates;
function insertMultipleWithoutDuplicates(array, items, newIndex) {
    var newArray = tslib_1.__spread(array);
    items.forEach(function (item) {
        newArray = removeItem(newArray, item);
    });
    // And re-add it in its new location
    newArray.splice.apply(newArray, tslib_1.__spread([newIndex, 0], items));
    return newArray;
}
exports.insertMultipleWithoutDuplicates = insertMultipleWithoutDuplicates;
// removeItem removes an item from an array and returns the result. The provided array is not modified. If the array
// did not originally contain the given item, the original array is returned.
function removeItem(array, item) {
    var index = array.indexOf(item);
    if (index === -1) {
        return array;
    }
    var result = tslib_1.__spread(array);
    result.splice(index, 1);
    return result;
}
exports.removeItem = removeItem;
//# sourceMappingURL=array_utils.js.map