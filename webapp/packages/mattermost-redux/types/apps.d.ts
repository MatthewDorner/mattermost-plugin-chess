export declare type AppManifest = {
    app_id: string;
    display_name: string;
    description?: string;
    homepage_url?: string;
    root_url?: string;
};
export declare type AppModalState = {
    form: AppForm;
    call: AppCallRequest;
};
export declare type AppsState = {
    bindings: AppBinding[];
};
export declare type AppBinding = {
    app_id: string;
    location?: string;
    icon?: string;
    label: string;
    hint?: string;
    description?: string;
    role_id?: string;
    depends_on_team?: boolean;
    depends_on_channel?: boolean;
    depends_on_user?: boolean;
    depends_on_post?: boolean;
    call?: AppCall;
    bindings?: AppBinding[];
    form?: AppForm;
};
export declare type AppCallValues = {
    [name: string]: any;
};
export declare type AppCallType = string;
export declare type AppCall = {
    path: string;
    expand?: AppExpand;
    state?: any;
};
export declare type AppCallRequest = AppCall & {
    context: AppContext;
    values?: AppCallValues;
    raw_command?: string;
    selected_field?: string;
    query?: string;
};
export declare type AppCallResponseType = string;
export declare type AppCallResponse<Res = unknown> = {
    type: AppCallResponseType;
    markdown?: string;
    data?: Res;
    error?: string;
    navigate_to_url?: string;
    use_external_browser?: boolean;
    call?: AppCall;
    form?: AppForm;
};
export declare type AppContext = {
    app_id: string;
    location?: string;
    acting_user_id?: string;
    user_id?: string;
    channel_id?: string;
    team_id?: string;
    post_id?: string;
    root_id?: string;
    props?: AppContextProps;
    user_agent?: string;
};
export declare type AppContextProps = {
    [name: string]: string;
};
export declare type AppExpandLevel = string;
export declare type AppExpand = {
    app?: AppExpandLevel;
    acting_user?: AppExpandLevel;
    channel?: AppExpandLevel;
    config?: AppExpandLevel;
    mentioned?: AppExpandLevel;
    parent_post?: AppExpandLevel;
    post?: AppExpandLevel;
    root_post?: AppExpandLevel;
    team?: AppExpandLevel;
    user?: AppExpandLevel;
};
export declare type AppForm = {
    title?: string;
    header?: string;
    footer?: string;
    icon?: string;
    submit_buttons?: string;
    cancel_button?: boolean;
    submit_on_cancel?: boolean;
    fields: AppField[];
    call?: AppCall;
    depends_on?: string[];
};
export declare type AppFormValue = string | AppSelectOption | boolean | null;
export declare type AppFormValues = {
    [name: string]: AppFormValue;
};
export declare type AppSelectOption = {
    label: string;
    value: string;
    icon_data?: string;
};
export declare type AppFieldType = string;
export declare type AppField = {
    name: string;
    type: AppFieldType;
    is_required?: boolean;
    readonly?: boolean;
    value?: AppFormValue;
    description?: string;
    label?: string;
    hint?: string;
    position?: number;
    modal_label?: string;
    refresh?: boolean;
    options?: AppSelectOption[];
    multiselect?: boolean;
    subtype?: string;
    min_length?: number;
    max_length?: number;
};
export declare type AutocompleteSuggestion = {
    suggestion: string;
    complete?: string;
    description?: string;
    hint?: string;
    iconData?: string;
};
export declare type AutocompleteSuggestionWithComplete = AutocompleteSuggestion & {
    complete: string;
};
export declare type AutocompleteElement = AppField;
export declare type AutocompleteStaticSelect = AutocompleteElement & {
    options: AppSelectOption[];
};
export declare type AutocompleteDynamicSelect = AutocompleteElement;
export declare type AutocompleteUserSelect = AutocompleteElement;
export declare type AutocompleteChannelSelect = AutocompleteElement;
export declare type FormResponseData = {
    errors?: {
        [field: string]: string;
    };
};
export declare type AppLookupResponse = {
    items: AppSelectOption[];
};
