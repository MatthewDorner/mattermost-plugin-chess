export declare type RequestStatusOption = 'not_started' | 'started' | 'success' | 'failure' | 'cancelled';
export declare type RequestStatusType = {
    status: RequestStatusOption;
    error: null | Record<string, any>;
};
export declare type ChannelsRequestsStatuses = {
    getChannels: RequestStatusType;
    getAllChannels: RequestStatusType;
    myChannels: RequestStatusType;
    createChannel: RequestStatusType;
    updateChannel: RequestStatusType;
};
export declare type GeneralRequestsStatuses = {
    websocket: RequestStatusType;
};
export declare type PostsRequestsStatuses = {
    createPost: RequestStatusType;
    editPost: RequestStatusType;
    getPostThread: RequestStatusType;
};
export declare type ThreadsRequestStatuses = {
    getThreads: RequestStatusType;
};
export declare type TeamsRequestsStatuses = {
    getMyTeams: RequestStatusType;
    getTeams: RequestStatusType;
    joinTeam: RequestStatusType;
};
export declare type UsersRequestsStatuses = {
    checkMfa: RequestStatusType;
    login: RequestStatusType;
    logout: RequestStatusType;
    autocompleteUsers: RequestStatusType;
    updateMe: RequestStatusType;
};
export declare type AdminRequestsStatuses = {
    getLogs: RequestStatusType;
    getAudits: RequestStatusType;
    getConfig: RequestStatusType;
    updateConfig: RequestStatusType;
    reloadConfig: RequestStatusType;
    testEmail: RequestStatusType;
    testSiteURL: RequestStatusType;
    invalidateCaches: RequestStatusType;
    recycleDatabase: RequestStatusType;
    createCompliance: RequestStatusType;
    getCompliance: RequestStatusType;
    testS3Connection: RequestStatusType;
    getLdapGroups: RequestStatusType;
    linkLdapGroup: RequestStatusType;
    unlinkLdapGroup: RequestStatusType;
    deleteBrandImage: RequestStatusType;
    disablePlugin: RequestStatusType;
    enablePlugin: RequestStatusType;
    getAnalytics: RequestStatusType;
    getClusterStatus: RequestStatusType;
    getEnvironmentConfig: RequestStatusType;
    getPluginStatuses: RequestStatusType;
    getPlugins: RequestStatusType;
    getSamlCertificateStatus: RequestStatusType;
    installPluginFromUrl: RequestStatusType;
    purgeElasticsearchIndexes: RequestStatusType;
    removeIdpSamlCertificate: RequestStatusType;
    removeLicense: RequestStatusType;
    removePlugin: RequestStatusType;
    removePrivateSamlCertificate: RequestStatusType;
    removePublicSamlCertificate: RequestStatusType;
    syncLdap: RequestStatusType;
    testElasticsearch: RequestStatusType;
    testLdap: RequestStatusType;
    uploadBrandImage: RequestStatusType;
    uploadIdpSamlCertificate: RequestStatusType;
    uploadLicense: RequestStatusType;
    uploadPlugin: RequestStatusType;
    uploadPrivateSamlCertificate: RequestStatusType;
    uploadPublicSamlCertificate: RequestStatusType;
};
export declare type EmojisRequestsStatuses = {
    createCustomEmoji: RequestStatusType;
    getCustomEmojis: RequestStatusType;
    deleteCustomEmoji: RequestStatusType;
    getAllCustomEmojis: RequestStatusType;
    getCustomEmoji: RequestStatusType;
};
export declare type FilesRequestsStatuses = {
    uploadFiles: RequestStatusType;
};
export declare type RolesRequestsStatuses = {
    getRolesByNames: RequestStatusType;
    getRoleByName: RequestStatusType;
    getRole: RequestStatusType;
    editRole: RequestStatusType;
};
export declare type JobsRequestsStatuses = {
    createJob: RequestStatusType;
    getJob: RequestStatusType;
    getJobs: RequestStatusType;
    cancelJob: RequestStatusType;
};
export declare type SearchRequestsStatuses = {
    flaggedPosts: RequestStatusType;
    pinnedPosts: RequestStatusType;
};
