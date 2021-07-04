import { ActionResult, DispatchFunc, GetStateFunc } from "../types/actions";
import { GlobalState } from "../types/store";
import { Post, PostList } from "../types/posts";
import { Reaction } from "../types/reactions";
export declare function receivedPost(post: Post): {
    type: "RECEIVED_POST";
    data: Post;
};
export declare function receivedNewPost(post: Post): {
    type: "RECEIVED_NEW_POST";
    data: Post;
};
export declare function receivedPosts(posts: PostList): {
    type: "RECEIVED_POSTS";
    data: PostList;
};
export declare function receivedPostsAfter(posts: PostList, channelId: string, afterPostId: string, recent?: boolean): {
    type: "RECEIVED_POSTS_AFTER";
    channelId: string;
    data: PostList;
    afterPostId: string;
    recent: boolean;
};
export declare function receivedPostsBefore(posts: PostList, channelId: string, beforePostId: string, oldest?: boolean): {
    type: "RECEIVED_POSTS_BEFORE";
    channelId: string;
    data: PostList;
    beforePostId: string;
    oldest: boolean;
};
export declare function receivedPostsSince(posts: PostList, channelId: string): {
    type: "RECEIVED_POSTS_SINCE";
    channelId: string;
    data: PostList;
};
export declare function receivedPostsInChannel(posts: PostList, channelId: string, recent?: boolean, oldest?: boolean): {
    type: "RECEIVED_POSTS_IN_CHANNEL";
    channelId: string;
    data: PostList;
    recent: boolean;
    oldest: boolean;
};
export declare function receivedPostsInThread(posts: PostList, rootId: string): {
    type: "RECEIVED_POSTS_IN_THREAD";
    data: PostList;
    rootId: string;
};
export declare function postDeleted(post: Post): {
    type: "POST_DELETED";
    data: Post;
};
export declare function postRemoved(post: Post): {
    type: "POST_REMOVED";
    data: Post;
};
export declare function getPost(postId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: Post;
    error?: undefined;
}>;
export declare function createPost(post: Post, files?: any[]): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    data: boolean;
}>;
export declare function createPostImmediately(post: Post, files?: any[]): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: Post;
    error?: undefined;
}>;
export declare function resetCreatePostRequest(): {
    type: "CREATE_POST_RESET_REQUEST";
};
export declare function deletePost(post: ExtendedPost): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    data: boolean;
}>;
export declare function editPost(post: Post): import("../types/actions").ActionFunc;
export declare function setUnreadPost(userId: string, postId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error?: undefined;
    data?: undefined;
} | {
    error: any;
    data?: undefined;
} | {
    data: {
        teamId: string;
        channelId: string;
        msgCount: number;
        mentionCount: number;
        lastViewedAt: number;
        deltaMsgs: number;
    };
    error?: undefined;
}>;
export declare function pinPost(postId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: import("../types/client4").StatusOK;
    error?: undefined;
}>;
export declare function unpinPost(postId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: import("../types/client4").StatusOK;
    error?: undefined;
}>;
export declare function addReaction(postId: string, emojiName: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: boolean;
    error?: undefined;
}>;
export declare function removeReaction(postId: string, emojiName: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: boolean;
    error?: undefined;
}>;
export declare function getCustomEmojiForReaction(name: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<ActionResult>;
export declare function getReactionsForPost(postId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<Reaction[] | {
    error: any;
}>;
export declare function flagPost(postId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    data: boolean;
}>;
export declare function getPostThread(rootId: string, fetchThreads?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: PostList;
    error?: undefined;
}>;
export declare function getPosts(channelId: string, page?: number, perPage?: number, fetchThreads?: boolean, collapsedThreadsExtended?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: PostList;
    error?: undefined;
}>;
export declare function getPostsUnread(channelId: string, fetchThreads?: boolean, collapsedThreadsExtended?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: PostList;
    error?: undefined;
}>;
export declare function getPostsSince(channelId: string, since: number, fetchThreads?: boolean, collapsedThreadsExtended?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: PostList;
    error?: undefined;
}>;
export declare function getPostsBefore(channelId: string, postId: string, page?: number, perPage?: number, fetchThreads?: boolean, collapsedThreadsExtended?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: PostList;
    error?: undefined;
}>;
export declare function getPostsAfter(channelId: string, postId: string, page?: number, perPage?: number, fetchThreads?: boolean, collapsedThreadsExtended?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: PostList;
    error?: undefined;
}>;
export declare function getPostsAround(channelId: string, postId: string, perPage?: number, fetchThreads?: boolean, collapsedThreadsExtended?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: PostList;
    error?: undefined;
}>;
export declare function getThreadsForPosts(posts: Post[], fetchThreads?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<ActionResult[]> | {
    data: boolean;
};
export declare function getProfilesAndStatusesForPosts(postsArrayOrMap: Post[] | Map<string, Post>, dispatch: DispatchFunc, getState: GetStateFunc): Promise<void> | Promise<any[]>;
export declare function getNeededAtMentionedUsernames(state: GlobalState, posts: Post[]): Set<string>;
export declare function getNeededCustomEmojis(state: GlobalState, posts: Post[]): Set<string>;
export declare type ExtendedPost = Post & {
    system_post_ids?: string[];
};
export declare function removePost(post: ExtendedPost): (dispatch: DispatchFunc, getState: GetStateFunc) => void;
export declare function selectPost(postId: string): (dispatch: DispatchFunc) => Promise<{
    data: boolean;
}>;
export declare function selectFocusedPostId(postId: string): {
    type: "RECEIVED_FOCUSED_POST";
    data: string;
};
export declare function unflagPost(postId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    data: any;
} | {
    error: any;
} | ActionResult[]>;
export declare function getOpenGraphMetadata(url: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: import("../types/posts").OpenGraphMetadata;
    error?: undefined;
}>;
export declare function doPostAction(postId: string, actionId: string, selectedOption?: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: import("../types/integration_actions").PostActionResponse;
    error?: undefined;
}>;
export declare function doPostActionWithCookie(postId: string, actionId: string, actionCookie: string, selectedOption?: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: import("../types/integration_actions").PostActionResponse;
    error?: undefined;
}>;
export declare function addMessageIntoHistory(message: string): (dispatch: DispatchFunc) => Promise<{
    data: boolean;
}>;
export declare function resetHistoryIndex(index: number): (dispatch: DispatchFunc) => Promise<{
    data: boolean;
}>;
export declare function moveHistoryIndexBack(index: number): (dispatch: DispatchFunc) => Promise<{
    data: boolean;
}>;
export declare function moveHistoryIndexForward(index: number): (dispatch: DispatchFunc) => Promise<{
    data: boolean;
}>;
