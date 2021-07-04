declare type Plugin = {
    id: string;
    name: string;
    description?: string;
    homepage_url?: string;
    support_url?: string;
    release_notes_url?: string;
    icon_path?: string;
    version: string;
    min_server_version?: string;
    server?: PluginManifestServer;
    backend?: PluginManifestServer;
    webapp?: PluginManifestWebapp;
    settings_schema?: PluginSettingsSchema;
    props?: Record<string, any>;
};
export declare type PluginManifest = Plugin;
export declare type PluginRedux = PluginManifest & {
    active: boolean;
};
export declare type PluginManifestServer = {
    executables?: {
        'linux-amd64'?: string;
        'darwin-amd64'?: string;
        'windows-amd64'?: string;
    };
    executable: string;
};
export declare type PluginManifestWebapp = {
    bundle_path: string;
};
export declare type PluginSettingsSchema = {
    header: string;
    footer: string;
    settings: PluginSetting[];
};
export declare type PluginSetting = {
    key: string;
    display_name: string;
    type: string;
    help_text: string;
    regenerate_help_text?: string;
    placeholder: string;
    default: any;
    options?: PluginSettingOption[];
};
export declare type PluginSettingOption = {
    display_name: string;
    value: string;
};
export declare type PluginsResponse = {
    active: PluginManifest[];
    inactive: PluginManifest[];
};
export declare type PluginStatus = {
    plugin_id: string;
    cluster_id: string;
    plugin_path: string;
    state: number;
    name: string;
    description: string;
    version: string;
};
declare type PluginInstance = {
    cluster_id: string;
    version: string;
    state: number;
};
export declare type PluginStatusRedux = {
    id: string;
    name: string;
    description: string;
    version: string;
    active: boolean;
    state: number;
    instances: PluginInstance[];
};
export declare type ClientPluginManifest = {
    id: string;
    min_server_version?: string;
    version: string;
    webapp: {
        bundle_path: string;
    };
};
export declare type MarketplaceLabel = {
    name: string;
    description?: string;
    url?: string;
    color?: string;
};
export declare enum HostingType {
    OnPrem = "on-prem",
    Cloud = "cloud"
}
export declare enum AuthorType {
    Mattermost = "mattermost",
    Partner = "partner",
    Community = "community"
}
export declare enum ReleaseStage {
    Production = "production",
    Beta = "beta",
    Experimental = "experimental"
}
export declare type MarketplacePlugin = {
    homepage_url?: string;
    icon_data?: string;
    download_url?: string;
    release_notes_url?: string;
    labels?: MarketplaceLabel[];
    hosting?: HostingType;
    author_type: AuthorType;
    release_stage: ReleaseStage;
    enterprise: boolean;
    manifest: PluginManifest;
    installed_version?: string;
};
export {};
