import { ActionFunc } from "../types/actions";
import { Bot, BotPatch } from "../types/bots";
export declare function createBot(bot: Bot): ActionFunc;
export declare function patchBot(botUserId: string, botPatch: BotPatch): ActionFunc;
export declare function loadBot(botUserId: string): ActionFunc;
export declare function loadBots(page?: number, perPage?: number): ActionFunc;
export declare function disableBot(botUserId: string): ActionFunc;
export declare function enableBot(botUserId: string): ActionFunc;
export declare function assignBot(botUserId: string, newOwnerId: string): ActionFunc;
