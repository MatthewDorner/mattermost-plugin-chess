import { DispatchFunc, GetStateFunc } from "../types/actions";
import type { UserThread, UserThreadList } from "../types/threads";
export declare function getThreads(userId: string, teamId: string, { before, after, perPage, unread }?: {
    before?: string | undefined;
    after?: string | undefined;
    perPage?: number | undefined;
    unread?: boolean | undefined;
}): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: UserThreadList;
    error?: undefined;
}>;
export declare function getThreadMentionCountsByChannel(teamId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: Record<string, number>;
    error?: undefined;
}>;
export declare function handleThreadArrived(dispatch: DispatchFunc, getState: GetStateFunc, threadData: UserThread, teamId: string): {
    is_following: boolean;
    id: string;
    reply_count: number;
    last_reply_at: number;
    last_viewed_at: number;
    participants: (import("../types/users").UserProfile | {
        id: string;
    })[];
    unread_replies: number;
    unread_mentions: number;
    post: {
        channel_id: string;
        user_id: string;
    };
};
export declare function getThread(userId: string, teamId: string, threadId: string, extended?: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
    data?: undefined;
} | {
    data: {
        is_following: boolean;
        id: string;
        reply_count: number;
        last_reply_at: number;
        last_viewed_at: number;
        participants: (import("../types/users").UserProfile | {
            id: string;
        })[];
        unread_replies: number;
        unread_mentions: number;
        post: {
            channel_id: string;
            user_id: string;
        };
    };
    error?: undefined;
}>;
export declare function handleAllMarkedRead(dispatch: DispatchFunc, teamId: string): void;
export declare function markAllThreadsInTeamRead(userId: string, teamId: string): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
} | {
    error?: undefined;
}>;
export declare function updateThreadRead(userId: string, teamId: string, threadId: string, timestamp: number): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
} | {
    error?: undefined;
}>;
export declare function handleReadChanged(dispatch: DispatchFunc, threadId: string, teamId: string, channelId: string, { lastViewedAt, prevUnreadMentions, newUnreadMentions, prevUnreadReplies, newUnreadReplies, }: {
    lastViewedAt: number;
    prevUnreadMentions: number;
    newUnreadMentions: number;
    prevUnreadReplies: number;
    newUnreadReplies: number;
}): void;
export declare function handleFollowChanged(dispatch: DispatchFunc, threadId: string, teamId: string, following: boolean): void;
export declare function setThreadFollow(userId: string, teamId: string, threadId: string, newState: boolean): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<{
    error: any;
} | {
    error?: undefined;
}>;
