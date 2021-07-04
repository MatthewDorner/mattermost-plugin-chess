import { UserProfile } from './users';
export declare type UserAutocomplete = {
    users: UserProfile[];
    out_of_channel?: UserProfile[];
};
export declare type AutocompleteSuggestion = {
    Complete: string;
    Suggestion: string;
    Hint: string;
    Description: string;
    IconData: string;
};
