import { Channel } from './channels';
import { Team } from './teams';
import { UserProfile } from './users';
import { $ID, IDMappedObjects, RelationOneToOne } from './utilities';
export declare type ChannelCategoryType = 'favorites' | 'channels' | 'direct_messages' | 'custom';
export declare enum CategorySorting {
    Alphabetical = "alpha",
    Default = "",
    Recency = "recent",
    Manual = "manual"
}
export declare type ChannelCategory = {
    id: string;
    user_id: $ID<UserProfile>;
    team_id: $ID<Team>;
    type: ChannelCategoryType;
    display_name: string;
    sorting: CategorySorting;
    channel_ids: Array<$ID<Channel>>;
    muted: boolean;
};
export declare type OrderedChannelCategories = {
    categories: ChannelCategory[];
    order: string[];
};
export declare type ChannelCategoriesState = {
    byId: IDMappedObjects<ChannelCategory>;
    orderByTeam: RelationOneToOne<Team, Array<$ID<ChannelCategory>>>;
};
