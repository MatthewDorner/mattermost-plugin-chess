import { PreferencesType } from "../types/preferences";
export declare function getPreferenceKey(category: string, name: string): string;
export declare function getPreferencesByCategory(myPreferences: PreferencesType, category: string): Map<string, any>;
export declare function isChannelFavorite(myPreferences: PreferencesType, channelId: string): boolean;
