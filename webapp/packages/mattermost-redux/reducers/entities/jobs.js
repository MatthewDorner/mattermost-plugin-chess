"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
function jobs(state, action) {
    var e_1, _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.JobTypes.RECEIVED_JOB: {
            var nextState = tslib_1.__assign({}, state);
            nextState[action.data.id] = action.data;
            return nextState;
        }
        case action_types_1.JobTypes.RECEIVED_JOBS: {
            var nextState = tslib_1.__assign({}, state);
            try {
                for (var _b = tslib_1.__values(action.data), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var job = _c.value;
                    nextState[job.id] = job;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return nextState;
        }
        default:
            return state;
    }
}
function jobsByTypeList(state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case action_types_1.JobTypes.RECEIVED_JOBS_BY_TYPE: {
            var nextState = tslib_1.__assign({}, state);
            if (action.data && action.data.length && action.data.length > 0) {
                nextState[action.data[0].type] = action.data;
            }
            return nextState;
        }
        default:
            return state;
    }
}
exports.default = redux_1.combineReducers({
    // object where every key is the job id and has an object with the job details
    jobs: jobs,
    // object where every key is a job type and contains a list of jobs.
    jobsByTypeList: jobsByTypeList,
});
//# sourceMappingURL=jobs.js.map