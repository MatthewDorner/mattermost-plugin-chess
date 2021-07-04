export declare type EmojiCategory = ('recent' | 'people' | 'nature' | 'foods' | 'activity' | 'places' | 'objects' | 'symbols' | 'flags' | 'custom');
export declare type CustomEmoji = {
    id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    creator_id: string;
    name: string;
    category: 'custom';
};
export declare type SystemEmoji = {
    filename: string;
    aliases: string[];
    category: EmojiCategory;
    batch: number;
};
export declare type Emoji = SystemEmoji | CustomEmoji;
export declare type EmojisState = {
    customEmoji: {
        [x: string]: CustomEmoji;
    };
    nonExistentEmoji: Set<string>;
};
