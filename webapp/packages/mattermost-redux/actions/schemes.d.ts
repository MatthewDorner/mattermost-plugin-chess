import { Scheme, SchemeScope, SchemePatch } from "../types/schemes";
import { ActionFunc } from "../types/actions";
export declare function getScheme(schemeId: string): ActionFunc;
export declare function getSchemes(scope: SchemeScope, page?: number, perPage?: number): ActionFunc;
export declare function createScheme(scheme: Scheme): ActionFunc;
export declare function deleteScheme(schemeId: string): ActionFunc;
export declare function patchScheme(schemeId: string, scheme: SchemePatch): ActionFunc;
export declare function getSchemeTeams(schemeId: string, page?: number, perPage?: number): ActionFunc;
export declare function getSchemeChannels(schemeId: string, page?: number, perPage?: number): ActionFunc;
