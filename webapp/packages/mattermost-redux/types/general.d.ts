import { ClientConfig, ClientLicense, WarnMetricStatus } from './config';
import { Dictionary } from './utilities';
export declare type GeneralState = {
    appState: boolean;
    credentials: any;
    config: Partial<ClientConfig>;
    dataRetentionPolicy: any;
    deviceToken: string;
    license: ClientLicense;
    serverVersion: string;
    timezones: string[];
    warnMetricsStatus: Dictionary<WarnMetricStatus>;
};
