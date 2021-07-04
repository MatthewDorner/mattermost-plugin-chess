export interface TelemetryHandler {
    trackEvent: (userId: string, userRoles: string, category: string, event: string, props?: any) => void;
    pageVisited: (userId: string, userRoles: string, category: string, name: string) => void;
}
