export declare type LogLevel = 'ERROR' | 'WARNING' | 'INFO';
export declare type ClientResponse<T> = {
    response: Response;
    headers: Map<string, string>;
    data: T;
};
declare type ErrorOffline = {
    message: string;
    url: string;
};
declare type ErrorInvalidResponse = {
    intl: {
        id: string;
        defaultMessage: string;
    };
};
export declare type ErrorApi = {
    message: string;
    server_error_id: string;
    status_code: number;
    url: string;
};
export declare type Client4Error = ErrorOffline | ErrorInvalidResponse | ErrorApi;
export declare type Options = {
    headers?: {
        [x: string]: string;
    };
    method?: string;
    url?: string;
    credentials?: 'omit' | 'same-origin' | 'include';
    body?: any;
};
export declare type StatusOK = {
    status: 'OK';
};
export {};
