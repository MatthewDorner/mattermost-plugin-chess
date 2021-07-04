"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetJobsByType = exports.getJobsByType = exports.getAllJobs = void 0;
var reselect_1 = require("reselect");
function getAllJobs(state) {
    return state.entities.jobs.jobs;
}
exports.getAllJobs = getAllJobs;
function getJobsByType(state) {
    return state.entities.jobs.jobsByTypeList;
}
exports.getJobsByType = getJobsByType;
function makeGetJobsByType(type) {
    return reselect_1.createSelector(getJobsByType, function (jobsByType) {
        return jobsByType[type] || [];
    });
}
exports.makeGetJobsByType = makeGetJobsByType;
//# sourceMappingURL=jobs.js.map