export declare type PostAction = {
    id?: string;
    type?: string;
    name?: string;
    disabled?: boolean;
    style?: string;
    data_source?: string;
    options?: PostActionOption[];
    default_option?: string;
    integration?: PostActionIntegration;
    cookie?: string;
};
export declare type PostActionOption = {
    text: string;
    value: string;
};
export declare type PostActionIntegration = {
    url?: string;
    context?: Record<string, any>;
};
export declare type PostActionResponse = {
    status: string;
    trigger_id: string;
};
