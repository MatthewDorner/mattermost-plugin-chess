import { GlobalState } from "../../types/store";
import { ClientConfig, FeatureFlags } from "../../types/config";
export declare function getConfig(state: GlobalState): Partial<ClientConfig>;
/**
 * Safely get value of a specific or known FeatureFlag
 */
export declare function getFeatureFlagValue(state: GlobalState, key: keyof FeatureFlags): string | undefined;
export declare function getLicense(state: GlobalState): any;
export declare function getSupportedTimezones(state: GlobalState): string[];
export declare function getCurrentUrl(state: GlobalState): string;
export declare function warnMetricsStatus(state: GlobalState): any;
export declare function getSubscriptionStats(state: GlobalState): any;
export declare function isCompatibleWithJoinViewTeamPermissions(state: GlobalState): boolean;
export declare function hasNewPermissions(state: GlobalState): boolean;
export declare const canUploadFilesOnMobile: (a: GlobalState) => boolean;
export declare const canDownloadFilesOnMobile: (a: GlobalState) => boolean;
export declare const getAutolinkedUrlSchemes: (a: GlobalState) => string[];
export declare const getManagedResourcePaths: (state: GlobalState) => string[];
export declare const getServerVersion: (state: GlobalState) => string;
