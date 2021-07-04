import { PostAction } from './integration_actions';
export declare type MessageAttachment = {
    id: number;
    fallback: string;
    color: string;
    pretext: string;
    author_name: string;
    author_link: string;
    author_icon: string;
    title: string;
    title_link: string;
    text: string;
    fields: MessageAttachmentField[];
    image_url: string;
    thumb_url: string;
    footer: string;
    footer_icon: string;
    timestamp: number | string;
    actions?: PostAction[];
};
export declare type MessageAttachmentField = {
    title: string;
    value: any;
    short: boolean;
};
