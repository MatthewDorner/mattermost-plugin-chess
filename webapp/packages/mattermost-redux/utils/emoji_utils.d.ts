import { Emoji, SystemEmoji, CustomEmoji } from "../types/emojis";
export declare function isSystemEmoji(emoji: Emoji): emoji is SystemEmoji;
export declare function isCustomEmoji(emoji: Emoji): emoji is CustomEmoji;
export declare function getEmojiImageUrl(emoji: Emoji): string;
export declare function parseNeededCustomEmojisFromText(text: string, systemEmojis: Map<string, SystemEmoji>, customEmojisByName: Map<string, CustomEmoji>, nonExistentEmoji: Set<string>): Set<string>;
