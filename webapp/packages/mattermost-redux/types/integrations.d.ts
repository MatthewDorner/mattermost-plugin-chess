import { MessageAttachment } from './message_attachments';
import { IDMappedObjects } from './utilities';
export declare type IncomingWebhook = {
    id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    user_id: string;
    channel_id: string;
    team_id: string;
    display_name: string;
    description: string;
    username: string;
    icon_url: string;
    channel_locked: boolean;
};
export declare type OutgoingWebhook = {
    id: string;
    token: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    creator_id: string;
    channel_id: string;
    team_id: string;
    trigger_words: string[];
    trigger_when: number;
    callback_urls: string[];
    display_name: string;
    description: string;
    content_type: string;
    username: string;
    icon_url: string;
};
export declare type Command = {
    'id': string;
    'token': string;
    'create_at': number;
    'update_at': number;
    'delete_at': number;
    'creator_id': string;
    'team_id': string;
    'trigger': string;
    'method': 'P' | 'G' | '';
    'username': string;
    'icon_url': string;
    'auto_complete': boolean;
    'auto_complete_desc': string;
    'auto_complete_hint': string;
    'display_name': string;
    'description': string;
    'url': string;
};
export declare type CommandArgs = {
    channel_id: string;
    team_id?: string;
    root_id?: string;
    parent_id?: string;
};
export declare type CommandResponse = {
    response_type: string;
    text: string;
    username: string;
    channel_id: SVGAnimatedString;
    icon_url: string;
    type: string;
    props: Record<string, any>;
    goto_location: string;
    trigger_id: string;
    skip_slack_parsing: boolean;
    attachments: MessageAttachment[];
    extra_responses: CommandResponse[];
};
export declare type AutocompleteSuggestion = {
    Complete: string;
    Suggestion: string;
    Hint: string;
    Description: string;
    IconData: string;
};
export declare type CommandAutocompleteSuggestion = AutocompleteSuggestion;
export declare type OAuthApp = {
    'id': string;
    'creator_id': string;
    'create_at': number;
    'update_at': number;
    'client_secret': string;
    'name': string;
    'description': string;
    'icon_url': string;
    'callback_urls': string[];
    'homepage': string;
    'is_trusted': boolean;
};
export declare type IntegrationsState = {
    incomingHooks: IDMappedObjects<IncomingWebhook>;
    outgoingHooks: IDMappedObjects<OutgoingWebhook>;
    oauthApps: IDMappedObjects<OAuthApp>;
    systemCommands: IDMappedObjects<Command>;
    commands: IDMappedObjects<Command>;
};
export declare type InteractiveDialogConfig = {
    app_id: string;
    trigger_id: string;
    url: string;
    dialog: {
        callback_id: string;
        title: string;
        introduction_text: string;
        icon_url?: string;
        elements: DialogElement[];
        submit_label: string;
        notify_on_cancel: boolean;
        state: string;
    };
};
export declare type DialogSubmission = {
    url: string;
    callback_id: string;
    state: string;
    user_id: string;
    channel_id: string;
    team_id: string;
    submission: {
        [x: string]: string;
    };
    cancelled: boolean;
};
export declare type DialogElement = {
    display_name: string;
    name: string;
    type: string;
    subtype: string;
    default: string;
    placeholder: string;
    help_text: string;
    optional: boolean;
    min_length: number;
    max_length: number;
    data_source: string;
    options: Array<{
        text: string;
        value: any;
    }>;
};
export declare type SubmitDialogResponse = {
    error?: string;
    errors?: Record<string, string>;
};
