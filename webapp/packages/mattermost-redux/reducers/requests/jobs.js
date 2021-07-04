"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var redux_1 = require("redux");
var action_types_1 = require("../../action_types");
var helpers_1 = require("./helpers");
function createJob(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.JobTypes.CREATE_JOB_REQUEST, action_types_1.JobTypes.CREATE_JOB_SUCCESS, action_types_1.JobTypes.CREATE_JOB_FAILURE, state, action);
}
function getJob(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.JobTypes.GET_JOB_REQUEST, action_types_1.JobTypes.GET_JOB_SUCCESS, action_types_1.JobTypes.GET_JOB_FAILURE, state, action);
}
function getJobs(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.JobTypes.GET_JOBS_REQUEST, action_types_1.JobTypes.GET_JOBS_SUCCESS, action_types_1.JobTypes.GET_JOBS_FAILURE, state, action);
}
function cancelJob(state, action) {
    if (state === void 0) { state = helpers_1.initialRequestState(); }
    return helpers_1.handleRequest(action_types_1.JobTypes.CANCEL_JOB_REQUEST, action_types_1.JobTypes.CANCEL_JOB_SUCCESS, action_types_1.JobTypes.CANCEL_JOB_FAILURE, state, action);
}
exports.default = redux_1.combineReducers({
    createJob: createJob,
    getJob: getJob,
    getJobs: getJobs,
    cancelJob: cancelJob,
});
//# sourceMappingURL=jobs.js.map