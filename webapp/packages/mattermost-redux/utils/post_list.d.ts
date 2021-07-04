import * as reselect from 'reselect';
import * as types from "../../types";
export declare const COMBINED_USER_ACTIVITY = "user-activity-";
export declare const DATE_LINE = "date-";
export declare const START_OF_NEW_MESSAGES = "start-of-new-messages";
export declare const MAX_COMBINED_SYSTEM_POSTS = 100;
import { GlobalState } from "../types/store";
interface PostFilterOptions {
    postIds: string[];
    lastViewedAt: number;
    indicateNewMessages: boolean;
}
export declare function makePreparePostIdsForPostList(): (state: GlobalState, options: PostFilterOptions) => string[];
export declare function makeFilterPostsAndAddSeparators(): reselect.OutputParametricSelector<types.store.GlobalState, PostFilterOptions, string[], (res1: types.posts.Post[], res2: number, res3: boolean, res4: string, res5: types.users.UserProfile, res6: boolean, res7: boolean) => string[]>;
export declare function makeCombineUserActivityPosts(): reselect.OutputParametricSelector<types.store.GlobalState, string[], string[], (res1: string[], res2: types.utilities.RelationOneToOne<types.posts.Post, types.posts.Post>) => string[]>;
export declare function isStartOfNewMessages(item: string): boolean;
export declare function isDateLine(item: string): boolean;
export declare function getDateForDateLine(item: string): number;
export declare function isCombinedUserActivityPost(item: string): boolean;
export declare function getPostIdsForCombinedUserActivityPost(item: string): string[];
export declare function getFirstPostId(items: string[]): string;
export declare function getLastPostId(items: string[]): string;
export declare function getLastPostIndex(postIds: string[]): number;
export declare function makeGenerateCombinedPost(): reselect.OutputParametricSelector<types.store.GlobalState, string, {
    id: string;
    root_id: string;
    channel_id: string;
    create_at: number;
    delete_at: number;
    message: string;
    props: {
        messages: string[];
        user_activity: {
            allUserIds: string[];
            allUsernames: string[];
            messageData: any[];
        } | null;
    };
    state: string;
    system_post_ids: string[];
    type: string;
    user_activity_posts: types.posts.Post[];
    user_id: string;
    metadata: {};
}, (res1: string, res2: types.posts.Post[]) => {
    id: string;
    root_id: string;
    channel_id: string;
    create_at: number;
    delete_at: number;
    message: string;
    props: {
        messages: string[];
        user_activity: {
            allUserIds: string[];
            allUsernames: string[];
            messageData: any[];
        } | null;
    };
    state: string;
    system_post_ids: string[];
    type: string;
    user_activity_posts: types.posts.Post[];
    user_id: string;
    metadata: {};
}>;
export declare const postTypePriority: {
    [x: string]: number;
};
export declare function comparePostTypes(a: typeof postTypePriority, b: typeof postTypePriority): number;
export declare function combineUserActivitySystemPost(systemPosts?: types.posts.Post[]): {
    allUserIds: string[];
    allUsernames: string[];
    messageData: any[];
} | null;
export {};
