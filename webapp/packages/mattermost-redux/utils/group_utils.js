"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterGroupsMatchingTerm = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var constants_1 = require("../constants");
var user_utils_1 = require("./user_utils");
function filterGroupsMatchingTerm(groups, term) {
    var lowercasedTerm = term.toLowerCase();
    var trimmedTerm = lowercasedTerm;
    if (trimmedTerm.startsWith('@')) {
        trimmedTerm = trimmedTerm.substr(1);
    }
    return groups.filter(function (group) {
        if (!group) {
            return false;
        }
        var groupSuggestions = [];
        var groupnameSuggestions = user_utils_1.getSuggestionsSplitByMultiple((group.name || '').toLowerCase(), constants_1.General.AUTOCOMPLETE_SPLIT_CHARACTERS);
        groupSuggestions.push.apply(groupSuggestions, tslib_1.__spread(groupnameSuggestions));
        var displayname = (group.display_name || '').toLowerCase();
        groupSuggestions.push(displayname);
        return groupSuggestions.
            filter(function (suggestion) { return suggestion !== ''; }).
            some(function (suggestion) { return suggestion.startsWith(trimmedTerm); });
    });
}
exports.filterGroupsMatchingTerm = filterGroupsMatchingTerm;
//# sourceMappingURL=group_utils.js.map