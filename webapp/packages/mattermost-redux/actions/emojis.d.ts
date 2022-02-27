import { ActionFunc } from "../types/actions";
import { SystemEmoji, CustomEmoji } from "../types/emojis";
export declare let systemEmojis: Map<string, SystemEmoji>;
export declare function setSystemEmojis(emojis: Map<string, SystemEmoji>): void;
export declare function createCustomEmoji(emoji: any, image: any): ActionFunc;
export declare function getCustomEmoji(emojiId: string): ActionFunc;
export declare function getCustomEmojiByName(name: string): ActionFunc;
export declare function getCustomEmojisByName(names: string[]): ActionFunc;
export declare function getCustomEmojisInText(text: string): ActionFunc;
export declare function getCustomEmojis(page?: number, perPage?: number, sort?: string, loadUsers?: boolean): ActionFunc;
export declare function loadProfilesForCustomEmojis(emojis: CustomEmoji[]): ActionFunc;
export declare function getAllCustomEmojis(perPage?: number): ActionFunc;
export declare function deleteCustomEmoji(emojiId: string): ActionFunc;
export declare function searchCustomEmojis(term: string, options?: any, loadUsers?: boolean): ActionFunc;
export declare function autocompleteCustomEmojis(name: string): ActionFunc;