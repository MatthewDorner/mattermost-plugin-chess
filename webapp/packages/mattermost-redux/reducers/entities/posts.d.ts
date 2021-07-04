import { GenericAction } from "../../types/actions";
import { OpenGraphMetadata, Post, PostsState, PostOrderBlock, MessageHistory } from "../../types/posts";
import { Reaction } from "../../types/reactions";
import { RelationOneToOne, Dictionary, IDMappedObjects, RelationOneToMany } from "../../types/utilities";
export declare function removeUnneededMetadata(post: Post): Post;
export declare function nextPostsReplies(state: {
    [x: string]: number;
} | undefined, action: GenericAction): {
    [x: string]: number;
};
export declare function handlePosts(state: RelationOneToOne<Post, Post> | undefined, action: GenericAction): any;
export declare function handlePendingPosts(state: string[] | undefined, action: GenericAction): string[];
export declare function postsInChannel(state: Dictionary<PostOrderBlock[]> | undefined, action: GenericAction, prevPosts: IDMappedObjects<Post>, nextPosts: Dictionary<Post>): Dictionary<PostOrderBlock[]>;
export declare function removeNonRecentEmptyPostBlocks(blocks: PostOrderBlock[]): PostOrderBlock[];
export declare function mergePostBlocks(blocks: PostOrderBlock[], posts: Dictionary<Post>): PostOrderBlock[];
export declare function mergePostOrder(left: string[], right: string[], posts: Dictionary<Post>): string[];
export declare function postsInThread(state: RelationOneToMany<Post, Post> | undefined, action: GenericAction, prevPosts: Dictionary<Post>): RelationOneToMany<Post, Post>;
export declare function reactions(state: RelationOneToOne<Post, Dictionary<Reaction>> | undefined, action: GenericAction): any;
export declare function openGraph(state: RelationOneToOne<Post, Dictionary<OpenGraphMetadata>> | undefined, action: GenericAction): any;
export declare function expandedURLs(state: Dictionary<string> | undefined, action: GenericAction): Dictionary<string>;
export default function reducer(state: Partial<PostsState> | undefined, action: GenericAction): Partial<PostsState> | {
    posts: any;
    postsReplies: {
        [x: string]: number;
    };
    pendingPostIds: string[];
    postsInChannel: Dictionary<PostOrderBlock[]>;
    postsInThread: RelationOneToMany<Post, Post>;
    selectedPostId: any;
    currentFocusedPostId: any;
    reactions: any;
    openGraph: any;
    messagesHistory: Partial<MessageHistory> | {
        messages: string[] | undefined;
        index: Dictionary<number>;
    };
    expandedURLs: Dictionary<string>;
};
