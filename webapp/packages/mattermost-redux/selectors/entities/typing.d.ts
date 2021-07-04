import { GlobalState } from "../../types/store";
export declare function makeGetUsersTypingByChannelAndPost(): (state: GlobalState, props: {
    channelId: string;
    postId: string;
}) => string[];
export declare const getUsersTyping: (state: GlobalState) => string[];
