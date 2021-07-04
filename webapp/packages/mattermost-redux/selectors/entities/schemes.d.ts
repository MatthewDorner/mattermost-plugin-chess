import { Channel } from "../../types/channels";
import { Scheme } from "../../types/schemes";
import { GlobalState } from "../../types/store";
import { Team } from "../../types/teams";
export declare function getSchemes(state: GlobalState): {
    [x: string]: Scheme;
};
export declare function getScheme(state: GlobalState, id: string): Scheme;
export declare function makeGetSchemeChannels(): (b: GlobalState, a: {
    schemeId: string;
}) => Channel[];
export declare function makeGetSchemeTeams(): (b: GlobalState, a: {
    schemeId: string;
}) => Team[];
