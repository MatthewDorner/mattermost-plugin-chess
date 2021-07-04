import { CustomEmoji } from "../../types/emojis";
import { GlobalState } from "../../types/store";
import { IDMappedObjects } from "../../types/utilities";
export declare const getCustomEmojis: (state: GlobalState) => IDMappedObjects<CustomEmoji>;
export declare const getCustomEmojisAsMap: (state: GlobalState) => Map<string, CustomEmoji>;
export declare const getCustomEmojisByName: (state: GlobalState) => Map<string, CustomEmoji>;
export declare const getCustomEmojiIdsSortedByName: (state: GlobalState) => string[];
