import { OutgoingWebhook, Command } from "../../types/integrations";
import { GlobalState } from "../../types/store";
import { IDMappedObjects } from "../../types/utilities";
export declare function getIncomingHooks(state: GlobalState): import("../../types/utilities").RelationOneToOne<import("../../types/integrations").IncomingWebhook, import("../../types/integrations").IncomingWebhook>;
export declare function getOutgoingHooks(state: GlobalState): import("../../types/utilities").RelationOneToOne<OutgoingWebhook, OutgoingWebhook>;
export declare function getCommands(state: GlobalState): import("../../types/utilities").RelationOneToOne<Command, Command>;
export declare function getOAuthApps(state: GlobalState): import("../../types/utilities").RelationOneToOne<import("../../types/integrations").OAuthApp, import("../../types/integrations").OAuthApp>;
export declare function getSystemCommands(state: GlobalState): import("../../types/utilities").RelationOneToOne<Command, Command>;
/**
 * get outgoing hooks in current team
 */
export declare const getOutgoingHooksInCurrentTeam: (state: GlobalState) => OutgoingWebhook[];
export declare const getAllCommands: (state: GlobalState) => IDMappedObjects<Command>;
export declare const getAutocompleteCommandsList: (state: GlobalState) => Command[];
