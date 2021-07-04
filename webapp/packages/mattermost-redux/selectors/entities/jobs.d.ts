import { JobType, Job, JobsByType } from "../../types/jobs";
import { GlobalState } from "../../types/store";
import { IDMappedObjects } from "../../types/utilities";
export declare function getAllJobs(state: GlobalState): IDMappedObjects<Job>;
export declare function getJobsByType(state: GlobalState): JobsByType;
export declare function makeGetJobsByType(type: JobType): (state: GlobalState) => Job[];
