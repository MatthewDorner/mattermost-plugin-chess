import { Team } from "../types/teams";
import { IDMappedObjects } from "../types/utilities";
export declare function teamListToMap(teamList: Team[]): IDMappedObjects<Team>;
export declare function sortTeamsWithLocale(locale: string): (a: Team, b: Team) => number;
