export declare type SchemeScope = 'team' | 'channel';
export declare type Scheme = {
    id: string;
    name: string;
    description: string;
    display_name: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    scope: SchemeScope;
    default_team_admin_role: string;
    default_team_user_role: string;
    default_channel_admin_role: string;
    default_channel_user_role: string;
};
export declare type SchemesState = {
    schemes: {
        [x: string]: Scheme;
    };
};
export declare type SchemePatch = {
    name?: string;
    description?: string;
};
