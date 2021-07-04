import { Command, IncomingWebhook, OutgoingWebhook, OAuthApp } from "../../types/integrations";
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    incomingHooks: import("../../types/utilities").RelationOneToOne<IncomingWebhook, IncomingWebhook>;
    outgoingHooks: import("../../types/utilities").RelationOneToOne<OutgoingWebhook, OutgoingWebhook>;
    commands: import("../../types/utilities").RelationOneToOne<Command, Command>;
    oauthApps: import("../../types/utilities").RelationOneToOne<OAuthApp, OAuthApp>;
    systemCommands: import("../../types/utilities").RelationOneToOne<Command, Command>;
    dialogTriggerId: any;
    dialog: any;
}>, import("redux").AnyAction>;
export default _default;
