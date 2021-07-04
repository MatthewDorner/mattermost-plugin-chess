import { ActionFunc } from "../types/actions";
import { JobType, Job } from "../types/jobs";
export declare function createJob(job: Job): ActionFunc;
export declare function getJob(id: string): ActionFunc;
export declare function getJobs(page?: number, perPage?: number): ActionFunc;
export declare function getJobsByType(type: JobType, page?: number, perPage?: number): ActionFunc;
export declare function cancelJob(job: string): ActionFunc;
