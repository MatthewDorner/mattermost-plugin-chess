import { GetStateFunc, DispatchFunc, ActionFunc } from "../types/actions";
import { PreferenceType, Theme } from "../types/preferences";
export declare function deletePreferences(userId: string, preferences: PreferenceType[]): ActionFunc;
export declare function getMyPreferences(): ActionFunc;
export declare function makeDirectChannelVisibleIfNecessary(otherUserId: string): ActionFunc;
export declare function makeGroupMessageVisibleIfNecessary(channelId: string): ActionFunc;
export declare function setCustomStatusInitialisationState(initializationState: Record<string, boolean>): (dispatch: DispatchFunc, getState: GetStateFunc) => Promise<void>;
export declare function savePreferences(userId: string, preferences: PreferenceType[]): (dispatch: DispatchFunc) => Promise<{
    data: boolean;
}>;
export declare function saveTheme(teamId: string, theme: Theme): ActionFunc;
export declare function deleteTeamSpecificThemes(): ActionFunc;
