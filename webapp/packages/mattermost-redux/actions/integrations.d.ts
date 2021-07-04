import { ActionFunc } from "../types/actions";
import { Command, CommandArgs, DialogSubmission, IncomingWebhook, OAuthApp, OutgoingWebhook } from "../types/integrations";
export declare function createIncomingHook(hook: IncomingWebhook): ActionFunc;
export declare function getIncomingHook(hookId: string): ActionFunc;
export declare function getIncomingHooks(teamId?: string, page?: number, perPage?: number): ActionFunc;
export declare function removeIncomingHook(hookId: string): ActionFunc;
export declare function updateIncomingHook(hook: IncomingWebhook): ActionFunc;
export declare function createOutgoingHook(hook: OutgoingWebhook): ActionFunc;
export declare function getOutgoingHook(hookId: string): ActionFunc;
export declare function getOutgoingHooks(channelId?: string, teamId?: string, page?: number, perPage?: number): ActionFunc;
export declare function removeOutgoingHook(hookId: string): ActionFunc;
export declare function updateOutgoingHook(hook: OutgoingWebhook): ActionFunc;
export declare function regenOutgoingHookToken(hookId: string): ActionFunc;
export declare function getCommands(teamId: string): ActionFunc;
export declare function getAutocompleteCommands(teamId: string, page?: number, perPage?: number): ActionFunc;
export declare function getCustomTeamCommands(teamId: string): ActionFunc;
export declare function addCommand(command: Command): ActionFunc;
export declare function editCommand(command: Command): ActionFunc;
export declare function executeCommand(command: string, args: CommandArgs): ActionFunc;
export declare function regenCommandToken(id: string): ActionFunc;
export declare function deleteCommand(id: string): ActionFunc;
export declare function addOAuthApp(app: OAuthApp): ActionFunc;
export declare function editOAuthApp(app: OAuthApp): ActionFunc;
export declare function getOAuthApps(page?: number, perPage?: number): ActionFunc;
export declare function getOAuthApp(appId: string): ActionFunc;
export declare function getAuthorizedOAuthApps(): ActionFunc;
export declare function deauthorizeOAuthApp(clientId: string): ActionFunc;
export declare function deleteOAuthApp(id: string): ActionFunc;
export declare function regenOAuthAppSecret(appId: string): ActionFunc;
export declare function submitInteractiveDialog(submission: DialogSubmission): ActionFunc;
