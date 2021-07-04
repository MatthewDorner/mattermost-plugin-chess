"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfErrorsMatchElements = exports.checkDialogElementForError = void 0;
var tslib_1 = require("tslib");
function checkDialogElementForError(elem, value) {
    if (!value && !elem.optional) {
        return {
            id: 'interactive_dialog.error.required',
            defaultMessage: 'This field is required.',
        };
    }
    var type = elem.type;
    if (type === 'text' || type === 'textarea') {
        if (value && value.length < elem.min_length) {
            return {
                id: 'interactive_dialog.error.too_short',
                defaultMessage: 'Minimum input length is {minLength}.',
                values: { minLength: elem.min_length },
            };
        }
        if (elem.subtype === 'email') {
            if (value && !value.includes('@')) {
                return {
                    id: 'interactive_dialog.error.bad_email',
                    defaultMessage: 'Must be a valid email address.',
                };
            }
        }
        if (elem.subtype === 'number') {
            if (value && isNaN(value)) {
                return {
                    id: 'interactive_dialog.error.bad_number',
                    defaultMessage: 'Must be a number.',
                };
            }
        }
        if (elem.subtype === 'url') {
            if (value && !value.includes('http://') && !value.includes('https://')) {
                return {
                    id: 'interactive_dialog.error.bad_url',
                    defaultMessage: 'URL must include http:// or https://.',
                };
            }
        }
    }
    else if (type === 'radio') {
        var options = elem.options;
        if (typeof value !== 'undefined' && Array.isArray(options) && !options.some(function (e) { return e.value === value; })) {
            return {
                id: 'interactive_dialog.error.invalid_option',
                defaultMessage: 'Must be a valid option',
            };
        }
    }
    return null;
}
exports.checkDialogElementForError = checkDialogElementForError;
// If we're returned errors that don't match any of the elements we have,
// ignore them and complete the dialog
function checkIfErrorsMatchElements(errors, elements) {
    var e_1, _a;
    if (errors === void 0) { errors = {}; }
    if (elements === void 0) { elements = []; }
    for (var name_1 in errors) {
        if (!errors.hasOwnProperty(name_1)) {
            continue;
        }
        try {
            for (var elements_1 = (e_1 = void 0, tslib_1.__values(elements)), elements_1_1 = elements_1.next(); !elements_1_1.done; elements_1_1 = elements_1.next()) {
                var elem = elements_1_1.value;
                if (elem.name === name_1) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (elements_1_1 && !elements_1_1.done && (_a = elements_1.return)) _a.call(elements_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return false;
}
exports.checkIfErrorsMatchElements = checkIfErrorsMatchElements;
//# sourceMappingURL=integration_utils.js.map