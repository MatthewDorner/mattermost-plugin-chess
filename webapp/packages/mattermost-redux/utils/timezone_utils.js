"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimezoneRegion = exports.getUserCurrentTimezone = void 0;
function getUserCurrentTimezone(userTimezone) {
    if (!userTimezone) {
        return null;
    }
    var useAutomaticTimezone = userTimezone.useAutomaticTimezone, automaticTimezone = userTimezone.automaticTimezone, manualTimezone = userTimezone.manualTimezone;
    var useAutomatic = useAutomaticTimezone;
    if (typeof useAutomaticTimezone === 'string') {
        useAutomatic = useAutomaticTimezone === 'true';
    }
    if (useAutomatic) {
        return automaticTimezone;
    }
    return manualTimezone;
}
exports.getUserCurrentTimezone = getUserCurrentTimezone;
function getTimezoneRegion(timezone) {
    if (timezone) {
        var split = timezone.split('/');
        if (split.length > 1) {
            return split.pop().replace(/_/g, ' ');
        }
    }
    return timezone;
}
exports.getTimezoneRegion = getTimezoneRegion;
//# sourceMappingURL=timezone_utils.js.map