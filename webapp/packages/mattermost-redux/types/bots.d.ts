export declare type Bot = {
    user_id: string;
    username: string;
    display_name?: string;
    description?: string;
    owner_id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
};
export declare type BotPatch = {
    username: string;
    display_name: string;
    description: string;
};
