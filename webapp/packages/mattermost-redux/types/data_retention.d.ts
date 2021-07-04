export declare type DataRetentionCustomPolicy = {
    id: string;
    display_name: string;
    post_duration: number;
    team_count: number;
    channel_count: number;
};
export declare type CreateDataRetentionCustomPolicy = {
    display_name: string;
    post_duration: number;
    channel_ids: string[];
    team_ids: string[];
};
export declare type PatchDataRetentionCustomPolicy = {
    display_name: string;
    post_duration: number;
};
export declare type PatchDataRetentionCustomPolicyTeams = {
    team_ids: string[];
};
export declare type PatchDataRetentionCustomPolicyChannels = {
    channel_ids: string[];
};
export declare type DataRetentionCustomPolicies = {
    [x: string]: DataRetentionCustomPolicy;
};
export declare type GetDataRetentionCustomPoliciesRequest = {
    policies: DataRetentionCustomPolicy[];
    total_count: number;
};
