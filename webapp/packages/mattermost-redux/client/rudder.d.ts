import * as rudderAnalytics from 'rudder-sdk-js';
export { rudderAnalytics };
import { TelemetryHandler } from './telemetry';
export declare class RudderTelemetryHandler implements TelemetryHandler {
    trackEvent(userId: string, userRoles: string, category: string, event: string, props?: any): void;
    pageVisited(userId: string, userRoles: string, category: string, name: string): void;
}
