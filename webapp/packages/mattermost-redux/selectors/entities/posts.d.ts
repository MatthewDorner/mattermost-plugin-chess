import { Channel } from "../../types/channels";
import { OpenGraphMetadata, Post, PostOrderBlock, PostWithFormatData } from "../../types/posts";
import { Reaction } from "../../types/reactions";
import { GlobalState } from "../../types/store";
import { UserProfile } from "../../types/users";
import { $ID, RelationOneToOne, RelationOneToMany, Dictionary } from "../../types/utilities";
export declare function getAllPosts(state: GlobalState): RelationOneToOne<Post, Post>;
export declare function getPost(state: GlobalState, postId: $ID<Post>): Post;
export declare function getPostRepliesCount(state: GlobalState, postId: $ID<Post>): number;
export declare function getPostsInThread(state: GlobalState): RelationOneToMany<Post, Post>;
export declare function getReactionsForPosts(state: GlobalState): RelationOneToOne<Post, {
    [x: string]: Reaction;
}>;
export declare function makeGetReactionsForPost(): (state: GlobalState, postId: $ID<Post>) => {
    [x: string]: Reaction;
} | undefined | null;
export declare function getOpenGraphMetadata(state: GlobalState): RelationOneToOne<Post, Dictionary<OpenGraphMetadata>>;
export declare function getOpenGraphMetadataForUrl(state: GlobalState, postId: string, url: string): OpenGraphMetadata | undefined;
export declare function getPostIdsInCurrentChannel(state: GlobalState): Array<$ID<Post>> | undefined | null;
export declare const getPostsInCurrentChannel: (state: GlobalState) => PostWithFormatData[] | undefined | null;
export declare function makeGetPostIdsForThread(): (state: GlobalState, postId: $ID<Post>) => Array<$ID<Post>>;
export declare function makeGetPostsChunkAroundPost(): (state: GlobalState, postId: $ID<Post>, channelId: $ID<Channel>) => PostOrderBlock | null | undefined;
export declare function makeGetPostIdsAroundPost(): (state: GlobalState, postId: $ID<Post>, channelId: $ID<Channel>, a: {
    postsBeforeCount: number;
    postsAfterCount: number;
}) => Array<$ID<Post>> | undefined | null;
export declare function makeGetPostsInChannel(): (state: GlobalState, channelId: $ID<Channel>, numPosts: number) => PostWithFormatData[] | undefined | null;
export declare function makeGetPostsAroundPost(): (state: GlobalState, postId: $ID<Post>, channelId: $ID<Channel>) => PostWithFormatData[] | undefined | null;
export declare function makeGetPostsForThread(): (state: GlobalState, props: {
    rootId: $ID<Post>;
}) => Post[];
export declare function makeGetProfilesForThread(): (state: GlobalState, props: {
    rootId: $ID<Post>;
}) => UserProfile[];
export declare function makeGetCommentCountForPost(): (state: GlobalState, props: {
    post: Post;
}) => number;
export declare const getSearchResults: (state: GlobalState) => Post[];
export declare function getSearchMatches(state: GlobalState): {
    [x: string]: string[];
};
export declare function makeGetMessageInHistoryItem(type: 'post' | 'comment'): (state: GlobalState) => string;
export declare function makeGetPostsForIds(): (state: GlobalState, postIds: Array<$ID<Post>>) => Post[];
export declare const getLastPostPerChannel: (state: GlobalState) => RelationOneToOne<Channel, Post>;
export declare const getMostRecentPostIdInChannel: (state: GlobalState, channelId: $ID<Channel>) => $ID<Post> | undefined | null;
export declare const getLatestReplyablePostId: (state: GlobalState) => $ID<Post>;
export declare const getCurrentUsersLatestPost: (state: GlobalState, postId: $ID<Post>) => PostWithFormatData | undefined | null;
export declare function getRecentPostsChunkInChannel(state: GlobalState, channelId: $ID<Channel>): PostOrderBlock | null | undefined;
export declare function getOldestPostsChunkInChannel(state: GlobalState, channelId: $ID<Channel>): PostOrderBlock | null | undefined;
export declare function getPostIdsInChannel(state: GlobalState, channelId: $ID<Channel>): Array<$ID<Post>> | undefined | null;
export declare function getPostsChunkInChannelAroundTime(state: GlobalState, channelId: $ID<Channel>, timeStamp: number): PostOrderBlock | undefined | null;
export declare function getUnreadPostsChunk(state: GlobalState, channelId: $ID<Channel>, timeStamp: number): PostOrderBlock | undefined | null;
export declare const isPostIdSending: (state: GlobalState, postId: $ID<Post>) => boolean;
export declare const makeIsPostCommentMention: () => (state: GlobalState, postId: $ID<Post>) => boolean;
export declare function getExpandedLink(state: GlobalState, link: string): string;
