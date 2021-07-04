import { UserMentionKey } from './users';
import { GlobalState } from "../../types/store";
export declare const getCurrentSearchForCurrentTeam: (state: GlobalState) => string;
export declare const getAllUserMentionKeys: (state: GlobalState) => UserMentionKey[];
