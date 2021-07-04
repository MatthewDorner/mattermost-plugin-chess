import type { Post } from './posts';
import type { Team } from './teams';
import type { Channel } from './channels';
import type { UserProfile } from './users';
import type { $ID, IDMappedObjects, RelationOneToMany, RelationOneToOne } from './utilities';
export declare type UserThread = {
    id: string;
    reply_count: number;
    last_reply_at: number;
    last_viewed_at: number;
    participants: Array<{
        id: $ID<UserProfile>;
    } | UserProfile>;
    unread_replies: number;
    unread_mentions: number;
    is_following?: boolean;
    /**
     * only depend on channel_id and user_id for UserThread<>Channel/User mapping,
     * use normalized post store/selectors as those are kept up-to-date in the store
     */
    post: {
        channel_id: $ID<Channel>;
        user_id: $ID<UserProfile>;
    };
};
export declare type UserThreadWithPost = UserThread & {
    post: Post;
};
export declare type UserThreadList = {
    total: number;
    total_unread_threads: number;
    total_unread_mentions: number;
    threads: UserThreadWithPost[];
};
export declare type ThreadsState = {
    threadsInTeam: RelationOneToMany<Team, UserThread>;
    threads: IDMappedObjects<UserThread>;
    counts: RelationOneToOne<Team, {
        total: number;
        total_unread_threads: number;
        total_unread_mentions: number;
        unread_mentions_per_channel: Record<$ID<Channel>, number>;
    }>;
};
