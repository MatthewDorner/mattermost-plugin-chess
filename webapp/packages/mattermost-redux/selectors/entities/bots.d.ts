import { Bot } from "../../types/bots";
import { GlobalState } from "../../types/store";
import { Dictionary } from "../../types/utilities";
export declare const ExternalBotAccountNames: string[];
export declare function getBotAccounts(state: GlobalState): Dictionary<Bot>;
export declare const getExternalBotAccounts: (state: GlobalState) => Dictionary<Bot>;
