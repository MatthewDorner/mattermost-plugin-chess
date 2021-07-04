import { PluginManifest } from './plugins';
import { AppManifest } from './apps';
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
interface MarketplaceBaseItem {
    labels?: MarketplaceLabel[];
    hosting?: HostingType;
    author_type: AuthorType;
    release_stage: ReleaseStage;
    enterprise: boolean;
}
export interface MarketplacePlugin extends MarketplaceBaseItem {
    manifest: PluginManifest;
    icon_data?: string;
    homepage_url?: string;
    download_url?: string;
    release_notes_url?: string;
    installed_version?: string;
}
export interface MarketplaceApp extends MarketplaceBaseItem {
    manifest: AppManifest;
    installed: boolean;
}
export {};
