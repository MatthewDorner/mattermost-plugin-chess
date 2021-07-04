"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.setThemeDefaults = exports.blendColors = exports.changeOpacity = exports.getComponents = exports.makeStyleFromTheme = void 0;
var tslib_1 = require("tslib");
var constants_1 = require("../constants");
function makeStyleFromTheme(getStyleFromTheme) {
    var lastTheme;
    var style;
    return function (theme) {
        if (!style || theme !== lastTheme) {
            style = getStyleFromTheme(theme);
            lastTheme = theme;
        }
        return style;
    };
}
exports.makeStyleFromTheme = makeStyleFromTheme;
var rgbPattern = /^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/;
function getComponents(inColor) {
    var color = inColor;
    // RGB color
    var match = rgbPattern.exec(color);
    if (match) {
        return {
            red: parseInt(match[1], 10),
            green: parseInt(match[2], 10),
            blue: parseInt(match[3], 10),
            alpha: match[4] ? parseFloat(match[4]) : 1,
        };
    }
    // Hex color
    if (color[0] === '#') {
        color = color.slice(1);
    }
    if (color.length === 3) {
        var tempColor = color;
        color = '';
        color += tempColor[0] + tempColor[0];
        color += tempColor[1] + tempColor[1];
        color += tempColor[2] + tempColor[2];
    }
    return {
        red: parseInt(color.substring(0, 2), 16),
        green: parseInt(color.substring(2, 4), 16),
        blue: parseInt(color.substring(4, 6), 16),
        alpha: 1,
    };
}
exports.getComponents = getComponents;
function changeOpacity(oldColor, opacity) {
    var _a = getComponents(oldColor), red = _a.red, green = _a.green, blue = _a.blue, alpha = _a.alpha;
    return "rgba(" + red + "," + green + "," + blue + "," + alpha * opacity + ")";
}
exports.changeOpacity = changeOpacity;
function blendComponent(background, foreground, opacity) {
    return ((1 - opacity) * background) + (opacity * foreground);
}
var blendColors = function (background, foreground, opacity, hex) {
    if (hex === void 0) { hex = false; }
    var backgroundComponents = getComponents(background);
    var foregroundComponents = getComponents(foreground);
    var red = Math.floor(blendComponent(backgroundComponents.red, foregroundComponents.red, opacity));
    var green = Math.floor(blendComponent(backgroundComponents.green, foregroundComponents.green, opacity));
    var blue = Math.floor(blendComponent(backgroundComponents.blue, foregroundComponents.blue, opacity));
    var alpha = blendComponent(backgroundComponents.alpha, foregroundComponents.alpha, opacity);
    if (hex) {
        var r = red.toString(16);
        var g = green.toString(16);
        var b = blue.toString(16);
        if (r.length === 1) {
            r = '0' + r;
        }
        if (g.length === 1) {
            g = '0' + g;
        }
        if (b.length === 1) {
            b = '0' + b;
        }
        return "#" + (r + g + b);
    }
    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
};
exports.blendColors = blendColors;
// setThemeDefaults will set defaults on the theme for any unset properties.
function setThemeDefaults(theme) {
    var e_1, _a;
    var _b;
    var defaultTheme = constants_1.Preferences.THEMES.default;
    // If this is a system theme, find it in case the user's theme is missing any fields
    if (theme.type && theme.type !== 'custom') {
        var match = Object.values(constants_1.Preferences.THEMES).find(function (v) { return v.type === theme.type; });
        if (match) {
            if (!match.mentionBg) {
                match.mentionBg = match.mentionBj;
            }
            return match;
        }
    }
    try {
        for (var _c = tslib_1.__values(Object.keys(defaultTheme)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var key = _d.value;
            if (theme[key]) {
                // Fix a case where upper case theme colours are rendered as black
                theme[key] = (_b = theme[key]) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    for (var property in defaultTheme) {
        if (property === 'type' || property === 'sidebarTeamBarBg') {
            continue;
        }
        if (theme[property] == null) {
            theme[property] = defaultTheme[property];
        }
        // Backwards compatability with old name
        if (!theme.mentionBg) {
            theme.mentionBg = theme.mentionBj;
        }
    }
    if (!theme.sidebarTeamBarBg) {
        theme.sidebarTeamBarBg = exports.blendColors(theme.sidebarHeaderBg, '#000000', 0.2, true);
    }
    return theme;
}
exports.setThemeDefaults = setThemeDefaults;
//# sourceMappingURL=theme_utils.js.map