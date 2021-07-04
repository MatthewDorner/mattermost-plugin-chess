import { IDMappedObjects } from './utilities';
export declare type JobType = 'data_retention' | 'elasticsearch_post_indexing' | 'ldap_sync' | 'message_export';
export declare type JobStatus = 'pending' | 'in_progress' | 'success' | 'error' | 'cancel_requested' | 'canceled';
export declare type Job = {
    id: string;
    type: JobType;
    priority: number;
    create_at: number;
    start_at: number;
    last_activity_at: number;
    status: JobStatus;
    progress: number;
    data: any;
};
export declare type JobsByType = {
    [x in JobType]?: Job[];
};
export declare type JobsState = {
    jobs: IDMappedObjects<Job>;
    jobsByTypeList: JobsByType;
};
