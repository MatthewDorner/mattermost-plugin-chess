import { GlobalState } from "../../types/store";
import { UserProfile, UserProfileWithLastViewAt } from "../../types/users";
export declare function makeAddLastViewAtToProfiles(): (state: GlobalState, profiles: UserProfile[]) => UserProfileWithLastViewAt[];
