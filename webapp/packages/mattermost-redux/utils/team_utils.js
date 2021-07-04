"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTeamsWithLocale = exports.teamListToMap = void 0;
var constants_1 = require("../constants");
function teamListToMap(teamList) {
    var teams = {};
    for (var i = 0; i < teamList.length; i++) {
        teams[teamList[i].id] = teamList[i];
    }
    return teams;
}
exports.teamListToMap = teamListToMap;
function sortTeamsWithLocale(locale) {
    return function (a, b) {
        if (a.display_name !== b.display_name) {
            return a.display_name.toLowerCase().localeCompare(b.display_name.toLowerCase(), locale || constants_1.General.DEFAULT_LOCALE, { numeric: true });
        }
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), locale || constants_1.General.DEFAULT_LOCALE, { numeric: true });
    };
}
exports.sortTeamsWithLocale = sortTeamsWithLocale;
//# sourceMappingURL=team_utils.js.map