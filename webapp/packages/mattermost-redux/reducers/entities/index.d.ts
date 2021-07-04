declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    general: import("redux").CombinedState<{
        appState: any;
        credentials: any;
        config: any;
        dataRetentionPolicy: any;
        deviceToken: any;
        license: any;
        serverVersion: any;
        timezones: any;
        warnMetricsStatus: any;
    }>;
    users: import("redux").CombinedState<{
        currentUserId: any;
        mySessions: any;
        myAudits: any;
        myUserAccessTokens: any;
        profiles: any;
        profilesInTeam: any;
        profilesNotInTeam: any;
        profilesWithoutTeam: any;
        profilesInChannel: any;
        profilesNotInChannel: any;
        profilesInGroup: any;
        statuses: any;
        isManualStatus: any;
        stats: any;
        filteredStats: any;
    }>;
    teams: import("redux").CombinedState<{
        currentTeamId: any;
        teams: any;
        myMembers: any;
        membersInTeam: any;
        stats: any;
        groupsAssociatedToTeam: any;
        totalCount: any;
        teamsInPolicy: any;
    }>;
    channels: import("redux").CombinedState<{
        currentChannelId: any;
        channels: any;
        channelsInTeam: any;
        myMembers: any;
        membersInChannel: any;
        stats: any;
        groupsAssociatedToChannel: any;
        totalCount: any;
        manuallyUnread: any;
        channelModerations: any;
        channelMemberCountsByGroup: any;
        channelsInPolicy: any;
    }>;
    posts: Partial<import("../../types/posts").PostsState> | {
        posts: any;
        postsReplies: {
            [x: string]: number;
        };
        pendingPostIds: string[];
        postsInChannel: import("../../types/utilities").Dictionary<import("../../types/posts").PostOrderBlock[]>;
        postsInThread: import("../../types/utilities").RelationOneToMany<import("../../types/posts").Post, import("../../types/posts").Post>;
        selectedPostId: any;
        currentFocusedPostId: any;
        reactions: any;
        openGraph: any;
        messagesHistory: Partial<import("../../types/posts").MessageHistory> | {
            messages: string[] | undefined;
            index: import("../../types/utilities").Dictionary<number>;
        };
        expandedURLs: import("../../types/utilities").Dictionary<string>;
    };
    files: import("redux").CombinedState<{
        files: any;
        filesFromSearch: any;
        fileIdsByPostId: any;
        filePublicLink: any;
    }>;
    preferences: import("redux").CombinedState<{
        myPreferences: any;
    }>;
    typing: import("../../types/typing").Typing;
    integrations: import("redux").CombinedState<{
        incomingHooks: any;
        outgoingHooks: any;
        commands: any;
        oauthApps: any;
        systemCommands: any;
        dialogTriggerId: any;
        dialog: any;
    }>;
    emojis: import("../../types/emojis").EmojisState;
    gifs: import("redux").CombinedState<{
        app: any;
        categories: any;
        search: any;
        cache: any;
    }>;
    admin: import("redux").CombinedState<{
        logs: any;
        audits: any;
        config: any;
        environmentConfig: any;
        complianceReports: any;
        clusterInfo: any;
        samlCertStatus: any;
        analytics: any;
        teamAnalytics: any;
        userAccessTokensByUser: any;
        userAccessTokens: any;
        plugins: any;
        pluginStatuses: any;
        ldapGroups: any;
        ldapGroupsCount: any;
        samlMetadataResponse: any;
        dataRetentionCustomPolicies: any;
        dataRetentionCustomPoliciesCount: any;
    }>;
    jobs: import("../../types/jobs").JobsState;
    search: import("redux").CombinedState<{
        flagged: any;
        pinned: any;
        results: any;
        fileResults: any;
        matches: any;
        recent: any;
        current: any;
        isSearchingTerm: any;
        isSearchGettingMore: any;
    }>;
    roles: import("redux").CombinedState<{
        roles: any;
        pending: any;
    }>;
    schemes: import("../../types/schemes").SchemesState;
    groups: import("redux").CombinedState<{
        syncables: any;
        groups: any;
        stats: any;
        myGroups: any;
    }>;
    bots: import("redux").CombinedState<{
        accounts: any;
    }>;
    threads: import("redux").CombinedState<{
        threads: any;
        threadsInTeam: any;
        counts: any;
    }>;
    channelCategories: import("redux").CombinedState<{
        byId: any;
        orderByTeam: any;
    }>;
    apps: import("../../types/apps").AppsState;
    cloud: import("redux").CombinedState<{
        customer: any;
        subscription: any;
        products: any;
        invoices: any;
        subscriptionStats: any;
    }>;
}>, import("redux").AnyAction>;
export default _default;
