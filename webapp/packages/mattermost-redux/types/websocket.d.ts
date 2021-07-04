export declare type WebSocketBroadcast = {
    omit_users: Record<string, boolean>;
    user_id: string;
    channel_id: string;
    team_id: string;
};
export declare type WebSocketMessage<T> = {
    event: string;
    data: T;
    broadcast: WebSocketBroadcast;
    seq: number;
};
export declare type WebsocketStatus = {
    connected: boolean;
    lastConnectAt: number;
    lastDisconnectAt: number;
};
