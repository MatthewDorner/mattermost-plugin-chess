export declare type ChannelModerationRoles = 'members' | 'guests';
export declare type Role = {
    id: string;
    name: string;
    display_name: string;
    description: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    permissions: string[];
    scheme_managed: boolean;
    built_in: boolean;
};
