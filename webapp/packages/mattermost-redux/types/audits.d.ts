export declare type Audit = {
    id: string;
    create_at: number;
    user_id: string;
    action: string;
    extra_info: string;
    ip_address: string;
    session_id: string;
};
