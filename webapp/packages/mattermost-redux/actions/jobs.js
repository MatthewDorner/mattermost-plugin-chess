"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelJob = exports.getJobsByType = exports.getJobs = exports.getJob = exports.createJob = void 0;
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var action_types_1 = require("../action_types");
var client_1 = require("../client");
var constants_1 = require("../constants");
var helpers_1 = require("./helpers");
function createJob(job) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.createJob,
        onRequest: action_types_1.JobTypes.CREATE_JOB_REQUEST,
        onSuccess: [action_types_1.JobTypes.RECEIVED_JOB, action_types_1.JobTypes.CREATE_JOB_SUCCESS],
        onFailure: action_types_1.JobTypes.CREATE_JOB_FAILURE,
        params: [
            job,
        ],
    });
}
exports.createJob = createJob;
function getJob(id) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getJob,
        onRequest: action_types_1.JobTypes.GET_JOB_REQUEST,
        onSuccess: [action_types_1.JobTypes.RECEIVED_JOB, action_types_1.JobTypes.GET_JOB_SUCCESS],
        onFailure: action_types_1.JobTypes.GET_JOB_FAILURE,
        params: [
            id,
        ],
    });
}
exports.getJob = getJob;
function getJobs(page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.JOBS_CHUNK_SIZE; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getJobs,
        onRequest: action_types_1.JobTypes.GET_JOBS_REQUEST,
        onSuccess: [action_types_1.JobTypes.RECEIVED_JOBS, action_types_1.JobTypes.GET_JOBS_SUCCESS],
        onFailure: action_types_1.JobTypes.GET_JOBS_FAILURE,
        params: [
            page,
            perPage,
        ],
    });
}
exports.getJobs = getJobs;
function getJobsByType(type, page, perPage) {
    if (page === void 0) { page = 0; }
    if (perPage === void 0) { perPage = constants_1.General.JOBS_CHUNK_SIZE; }
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.getJobsByType,
        onRequest: action_types_1.JobTypes.GET_JOBS_REQUEST,
        onSuccess: [action_types_1.JobTypes.RECEIVED_JOBS, action_types_1.JobTypes.RECEIVED_JOBS_BY_TYPE, action_types_1.JobTypes.GET_JOBS_SUCCESS],
        onFailure: action_types_1.JobTypes.GET_JOBS_FAILURE,
        params: [
            type,
            page,
            perPage,
        ],
    });
}
exports.getJobsByType = getJobsByType;
function cancelJob(job) {
    return helpers_1.bindClientFunc({
        clientFunc: client_1.Client4.cancelJob,
        onRequest: action_types_1.JobTypes.CANCEL_JOB_REQUEST,
        onSuccess: action_types_1.JobTypes.CANCEL_JOB_SUCCESS,
        onFailure: action_types_1.JobTypes.CANCEL_JOB_FAILURE,
        params: [
            job,
        ],
    });
}
exports.cancelJob = cancelJob;
//# sourceMappingURL=jobs.js.map