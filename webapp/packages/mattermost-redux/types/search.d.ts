import { Dictionary } from './utilities';
export declare type Search = {
    terms: string;
    isOrSearch: boolean;
};
export declare type SearchState = {
    current: any;
    results: string[];
    fileResults: string[];
    flagged: string[];
    pinned: Dictionary<string[]>;
    isSearchingTerm: boolean;
    isSearchGettingMore: boolean;
    recent: {
        [x: string]: Search[];
    };
    matches: {
        [x: string]: string[];
    };
};
export declare type SearchParameter = {
    terms: string;
    is_or_search: boolean;
    time_zone_offset?: number;
    page: number;
    per_page: number;
    include_deleted_channels: boolean;
};
