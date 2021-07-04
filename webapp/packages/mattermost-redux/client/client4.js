"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientError = exports.DEFAULT_LIMIT_AFTER = exports.DEFAULT_LIMIT_BEFORE = exports.HEADER_X_VERSION_ID = void 0;
var tslib_1 = require("tslib");
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
var constants_1 = require("../constants");
var helpers_1 = require("../utils/helpers");
var sentry_1 = require("../utils/sentry");
var user_utils_1 = require("../utils/user_utils");
var fetch_etag_1 = tslib_1.__importDefault(require("./fetch_etag"));
var FormData = require('form-data');
var HEADER_AUTH = 'Authorization';
var HEADER_BEARER = 'BEARER';
var HEADER_REQUESTED_WITH = 'X-Requested-With';
var HEADER_USER_AGENT = 'User-Agent';
var HEADER_X_CLUSTER_ID = 'X-Cluster-Id';
var HEADER_X_CSRF_TOKEN = 'X-CSRF-Token';
exports.HEADER_X_VERSION_ID = 'X-Version-Id';
var PER_PAGE_DEFAULT = 60;
var LOGS_PER_PAGE_DEFAULT = 10000;
exports.DEFAULT_LIMIT_BEFORE = 30;
exports.DEFAULT_LIMIT_AFTER = 30;
/* eslint-disable no-throw-literal */
var Client4 = /** @class */ (function () {
    function Client4() {
        var _this = this;
        this.logToConsole = false;
        this.serverVersion = '';
        this.clusterId = '';
        this.token = '';
        this.csrf = '';
        this.url = '';
        this.urlVersion = '/api/v4';
        this.userAgent = null;
        this.enableLogging = false;
        this.defaultHeaders = {};
        this.userId = '';
        this.diagnosticId = '';
        this.includeCookies = true;
        this.translations = {
            connectionError: 'There appears to be a problem with your internet connection.',
            unknownError: 'We received an unexpected status code from the server.',
        };
        // User Routes
        this.createUser = function (user, token, inviteId, redirect) {
            _this.trackEvent('api', 'api_users_create');
            var queryParams = {};
            if (token) {
                queryParams.t = token;
            }
            if (inviteId) {
                queryParams.iid = inviteId;
            }
            if (redirect) {
                queryParams.r = redirect;
            }
            return _this.doFetch("" + _this.getUsersRoute() + helpers_1.buildQueryString(queryParams), { method: 'post', body: JSON.stringify(user) });
        };
        this.patchMe = function (userPatch) {
            return _this.doFetch(_this.getUserRoute('me') + "/patch", { method: 'put', body: JSON.stringify(userPatch) });
        };
        this.patchUser = function (userPatch) {
            _this.trackEvent('api', 'api_users_patch');
            return _this.doFetch(_this.getUserRoute(userPatch.id) + "/patch", { method: 'put', body: JSON.stringify(userPatch) });
        };
        this.updateUser = function (user) {
            _this.trackEvent('api', 'api_users_update');
            return _this.doFetch("" + _this.getUserRoute(user.id), { method: 'put', body: JSON.stringify(user) });
        };
        this.promoteGuestToUser = function (userId) {
            _this.trackEvent('api', 'api_users_promote_guest_to_user');
            return _this.doFetch(_this.getUserRoute(userId) + "/promote", { method: 'post' });
        };
        this.demoteUserToGuest = function (userId) {
            _this.trackEvent('api', 'api_users_demote_user_to_guest');
            return _this.doFetch(_this.getUserRoute(userId) + "/demote", { method: 'post' });
        };
        this.updateUserRoles = function (userId, roles) {
            _this.trackEvent('api', 'api_users_update_roles');
            return _this.doFetch(_this.getUserRoute(userId) + "/roles", { method: 'put', body: JSON.stringify({ roles: roles }) });
        };
        this.updateUserMfa = function (userId, activate, code) {
            var body = {
                activate: activate,
            };
            if (activate) {
                body.code = code;
            }
            return _this.doFetch(_this.getUserRoute(userId) + "/mfa", { method: 'put', body: JSON.stringify(body) });
        };
        this.updateUserPassword = function (userId, currentPassword, newPassword) {
            _this.trackEvent('api', 'api_users_newpassword');
            return _this.doFetch(_this.getUserRoute(userId) + "/password", { method: 'put', body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) });
        };
        this.resetUserPassword = function (token, newPassword) {
            _this.trackEvent('api', 'api_users_reset_password');
            return _this.doFetch(_this.getUsersRoute() + "/password/reset", { method: 'post', body: JSON.stringify({ token: token, new_password: newPassword }) });
        };
        this.getKnownUsers = function () {
            _this.trackEvent('api', 'api_get_known_users');
            return _this.doFetch(_this.getUsersRoute() + "/known", { method: 'get' });
        };
        this.sendPasswordResetEmail = function (email) {
            _this.trackEvent('api', 'api_users_send_password_reset');
            return _this.doFetch(_this.getUsersRoute() + "/password/reset/send", { method: 'post', body: JSON.stringify({ email: email }) });
        };
        this.updateUserActive = function (userId, active) {
            _this.trackEvent('api', 'api_users_update_active');
            return _this.doFetch(_this.getUserRoute(userId) + "/active", { method: 'put', body: JSON.stringify({ active: active }) });
        };
        this.uploadProfileImage = function (userId, imageData) {
            _this.trackEvent('api', 'api_users_update_profile_picture');
            var formData = new FormData();
            formData.append('image', imageData);
            var request = {
                method: 'post',
                body: formData,
            };
            if (formData.getBoundary) {
                request.headers = {
                    'Content-Type': "multipart/form-data; boundary=" + formData.getBoundary(),
                };
            }
            return _this.doFetch(_this.getUserRoute(userId) + "/image", request);
        };
        this.setDefaultProfileImage = function (userId) {
            _this.trackEvent('api', 'api_users_set_default_profile_picture');
            return _this.doFetch(_this.getUserRoute(userId) + "/image", { method: 'delete' });
        };
        this.verifyUserEmail = function (token) {
            return _this.doFetch(_this.getUsersRoute() + "/email/verify", { method: 'post', body: JSON.stringify({ token: token }) });
        };
        this.updateMyTermsOfServiceStatus = function (termsOfServiceId, accepted) {
            return _this.doFetch(_this.getUserRoute('me') + "/terms_of_service", { method: 'post', body: JSON.stringify({ termsOfServiceId: termsOfServiceId, accepted: accepted }) });
        };
        this.getTermsOfService = function () {
            return _this.doFetch(_this.getBaseRoute() + "/terms_of_service", { method: 'get' });
        };
        this.createTermsOfService = function (text) {
            return _this.doFetch(_this.getBaseRoute() + "/terms_of_service", { method: 'post', body: JSON.stringify({ text: text }) });
        };
        this.sendVerificationEmail = function (email) {
            return _this.doFetch(_this.getUsersRoute() + "/email/verify/send", { method: 'post', body: JSON.stringify({ email: email }) });
        };
        this.login = function (loginId, password, token, deviceId, ldapOnly) {
            if (token === void 0) { token = ''; }
            if (deviceId === void 0) { deviceId = ''; }
            if (ldapOnly === void 0) { ldapOnly = false; }
            _this.trackEvent('api', 'api_users_login');
            if (ldapOnly) {
                _this.trackEvent('api', 'api_users_login_ldap');
            }
            var body = {
                device_id: deviceId,
                login_id: loginId,
                password: password,
                token: token,
            };
            if (ldapOnly) {
                body.ldap_only = 'true';
            }
            return _this.doFetch(_this.getUsersRoute() + "/login", { method: 'post', body: JSON.stringify(body) });
        };
        this.loginById = function (id, password, token, deviceId) {
            if (token === void 0) { token = ''; }
            if (deviceId === void 0) { deviceId = ''; }
            _this.trackEvent('api', 'api_users_login');
            var body = {
                device_id: deviceId,
                id: id,
                password: password,
                token: token,
            };
            return _this.doFetch(_this.getUsersRoute() + "/login", { method: 'post', body: JSON.stringify(body) });
        };
        this.logout = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.trackEvent('api', 'api_users_logout');
                        return [4 /*yield*/, this.doFetchWithResponse(this.getUsersRoute() + "/logout", { method: 'post' })];
                    case 1:
                        response = (_a.sent()).response;
                        if (response.ok) {
                            this.token = '';
                        }
                        this.serverVersion = '';
                        return [2 /*return*/, response];
                }
            });
        }); };
        this.getProfiles = function (page, perPage, options) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (options === void 0) { options = {}; }
            _this.trackEvent('api', 'api_profiles_get');
            return _this.doFetch("" + _this.getUsersRoute() + helpers_1.buildQueryString(tslib_1.__assign({ page: page, per_page: perPage }, options)), { method: 'get' });
        };
        this.getProfilesByIds = function (userIds, options) {
            if (options === void 0) { options = {}; }
            _this.trackEvent('api', 'api_profiles_get_by_ids');
            return _this.doFetch(_this.getUsersRoute() + "/ids" + helpers_1.buildQueryString(options), { method: 'post', body: JSON.stringify(userIds) });
        };
        this.getProfilesByUsernames = function (usernames) {
            _this.trackEvent('api', 'api_profiles_get_by_usernames');
            return _this.doFetch(_this.getUsersRoute() + "/usernames", { method: 'post', body: JSON.stringify(usernames) });
        };
        this.getProfilesInTeam = function (teamId, page, perPage, sort, options) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (sort === void 0) { sort = ''; }
            if (options === void 0) { options = {}; }
            _this.trackEvent('api', 'api_profiles_get_in_team', { team_id: teamId, sort: sort });
            return _this.doFetch("" + _this.getUsersRoute() + helpers_1.buildQueryString(tslib_1.__assign(tslib_1.__assign({}, options), { in_team: teamId, page: page, per_page: perPage, sort: sort })), { method: 'get' });
        };
        this.getProfilesNotInTeam = function (teamId, groupConstrained, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            _this.trackEvent('api', 'api_profiles_get_not_in_team', { team_id: teamId, group_constrained: groupConstrained });
            var queryStringObj = { not_in_team: teamId, page: page, per_page: perPage };
            if (groupConstrained) {
                queryStringObj.group_constrained = true;
            }
            return _this.doFetch("" + _this.getUsersRoute() + helpers_1.buildQueryString(queryStringObj), { method: 'get' });
        };
        this.getProfilesWithoutTeam = function (page, perPage, options) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (options === void 0) { options = {}; }
            _this.trackEvent('api', 'api_profiles_get_without_team');
            return _this.doFetch("" + _this.getUsersRoute() + helpers_1.buildQueryString(tslib_1.__assign(tslib_1.__assign({}, options), { without_team: 1, page: page, per_page: perPage })), { method: 'get' });
        };
        this.getProfilesInChannel = function (channelId, page, perPage, sort, options) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (sort === void 0) { sort = ''; }
            if (options === void 0) { options = {}; }
            _this.trackEvent('api', 'api_profiles_get_in_channel', { channel_id: channelId });
            var serverVersion = _this.getServerVersion();
            var queryStringObj;
            if (helpers_1.isMinimumServerVersion(serverVersion, 4, 7)) {
                queryStringObj = { in_channel: channelId, page: page, per_page: perPage, sort: sort };
            }
            else {
                queryStringObj = { in_channel: channelId, page: page, per_page: perPage };
            }
            return _this.doFetch("" + _this.getUsersRoute() + helpers_1.buildQueryString(tslib_1.__assign(tslib_1.__assign({}, queryStringObj), options)), { method: 'get' });
        };
        this.getProfilesInGroupChannels = function (channelsIds) {
            _this.trackEvent('api', 'api_profiles_get_in_group_channels', { channelsIds: channelsIds });
            return _this.doFetch(_this.getUsersRoute() + "/group_channels", { method: 'post', body: JSON.stringify(channelsIds) });
        };
        this.getProfilesNotInChannel = function (teamId, channelId, groupConstrained, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            _this.trackEvent('api', 'api_profiles_get_not_in_channel', { team_id: teamId, channel_id: channelId, group_constrained: groupConstrained });
            var queryStringObj = { in_team: teamId, not_in_channel: channelId, page: page, per_page: perPage };
            if (groupConstrained) {
                queryStringObj.group_constrained = true;
            }
            return _this.doFetch("" + _this.getUsersRoute() + helpers_1.buildQueryString(queryStringObj), { method: 'get' });
        };
        this.getProfilesInGroup = function (groupId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getUsersRoute() + helpers_1.buildQueryString({ in_group: groupId, page: page, per_page: perPage }), { method: 'get' });
        };
        this.getMe = function () {
            return _this.doFetch("" + _this.getUserRoute('me'), { method: 'get' });
        };
        this.getUser = function (userId) {
            return _this.doFetch("" + _this.getUserRoute(userId), { method: 'get' });
        };
        this.getUserByUsername = function (username) {
            return _this.doFetch(_this.getUsersRoute() + "/username/" + username, { method: 'get' });
        };
        this.getUserByEmail = function (email) {
            return _this.doFetch(_this.getUsersRoute() + "/email/" + email, { method: 'get' });
        };
        this.getProfilePictureUrl = function (userId, lastPictureUpdate) {
            var params = {};
            if (lastPictureUpdate) {
                params._ = lastPictureUpdate;
            }
            return _this.getUserRoute(userId) + "/image" + helpers_1.buildQueryString(params);
        };
        this.getDefaultProfilePictureUrl = function (userId) {
            return _this.getUserRoute(userId) + "/image/default";
        };
        this.autocompleteUsers = function (name, teamId, channelId, options) {
            if (options === void 0) { options = {
                limit: constants_1.General.AUTOCOMPLETE_LIMIT_DEFAULT,
            }; }
            return _this.doFetch(_this.getUsersRoute() + "/autocomplete" + helpers_1.buildQueryString({
                in_team: teamId,
                in_channel: channelId,
                name: name,
                limit: options.limit,
            }), {
                method: 'get',
            });
        };
        this.getSessions = function (userId) {
            return _this.doFetch(_this.getUserRoute(userId) + "/sessions", { method: 'get' });
        };
        this.revokeSession = function (userId, sessionId) {
            return _this.doFetch(_this.getUserRoute(userId) + "/sessions/revoke", { method: 'post', body: JSON.stringify({ session_id: sessionId }) });
        };
        this.revokeAllSessionsForUser = function (userId) {
            return _this.doFetch(_this.getUserRoute(userId) + "/sessions/revoke/all", { method: 'post' });
        };
        this.revokeSessionsForAllUsers = function () {
            return _this.doFetch(_this.getUsersRoute() + "/sessions/revoke/all", { method: 'post' });
        };
        this.getUserAudits = function (userId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getUserRoute(userId) + "/audits" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.checkUserMfa = function (loginId) {
            return _this.doFetch(_this.getUsersRoute() + "/mfa", { method: 'post', body: JSON.stringify({ login_id: loginId }) });
        };
        this.generateMfaSecret = function (userId) {
            return _this.doFetch(_this.getUserRoute(userId) + "/mfa/generate", { method: 'post' });
        };
        this.attachDevice = function (deviceId) {
            return _this.doFetch(_this.getUsersRoute() + "/sessions/device", { method: 'put', body: JSON.stringify({ device_id: deviceId }) });
        };
        this.searchUsers = function (term, options) {
            _this.trackEvent('api', 'api_search_users');
            return _this.doFetch(_this.getUsersRoute() + "/search", { method: 'post', body: JSON.stringify(tslib_1.__assign({ term: term }, options)) });
        };
        this.getStatusesByIds = function (userIds) {
            return _this.doFetch(_this.getUsersRoute() + "/status/ids", { method: 'post', body: JSON.stringify(userIds) });
        };
        this.getStatus = function (userId) {
            return _this.doFetch(_this.getUserRoute(userId) + "/status", { method: 'get' });
        };
        this.updateStatus = function (status) {
            return _this.doFetch(_this.getUserRoute(status.user_id) + "/status", { method: 'put', body: JSON.stringify(status) });
        };
        this.updateCustomStatus = function (customStatus) {
            return _this.doFetch(_this.getUserRoute('me') + "/status/custom", { method: 'put', body: JSON.stringify(customStatus) });
        };
        this.unsetCustomStatus = function () {
            return _this.doFetch(_this.getUserRoute('me') + "/status/custom", { method: 'delete' });
        };
        this.removeRecentCustomStatus = function (customStatus) {
            return _this.doFetch(_this.getUserRoute('me') + "/status/custom/recent", { method: 'delete', body: JSON.stringify(customStatus) });
        };
        this.switchEmailToOAuth = function (service, email, password, mfaCode) {
            if (mfaCode === void 0) { mfaCode = ''; }
            _this.trackEvent('api', 'api_users_email_to_oauth');
            return _this.doFetch(_this.getUsersRoute() + "/login/switch", { method: 'post', body: JSON.stringify({ current_service: 'email', new_service: service, email: email, password: password, mfa_code: mfaCode }) });
        };
        this.switchOAuthToEmail = function (currentService, email, password) {
            _this.trackEvent('api', 'api_users_oauth_to_email');
            return _this.doFetch(_this.getUsersRoute() + "/login/switch", { method: 'post', body: JSON.stringify({ current_service: currentService, new_service: 'email', email: email, new_password: password }) });
        };
        this.switchEmailToLdap = function (email, emailPassword, ldapId, ldapPassword, mfaCode) {
            if (mfaCode === void 0) { mfaCode = ''; }
            _this.trackEvent('api', 'api_users_email_to_ldap');
            return _this.doFetch(_this.getUsersRoute() + "/login/switch", { method: 'post', body: JSON.stringify({ current_service: 'email', new_service: 'ldap', email: email, password: emailPassword, ldap_id: ldapId, new_password: ldapPassword, mfa_code: mfaCode }) });
        };
        this.switchLdapToEmail = function (ldapPassword, email, emailPassword, mfaCode) {
            if (mfaCode === void 0) { mfaCode = ''; }
            _this.trackEvent('api', 'api_users_ldap_to_email');
            return _this.doFetch(_this.getUsersRoute() + "/login/switch", { method: 'post', body: JSON.stringify({ current_service: 'ldap', new_service: 'email', email: email, password: ldapPassword, new_password: emailPassword, mfa_code: mfaCode }) });
        };
        this.getAuthorizedOAuthApps = function (userId) {
            return _this.doFetch(_this.getUserRoute(userId) + "/oauth/apps/authorized", { method: 'get' });
        };
        this.authorizeOAuthApp = function (responseType, clientId, redirectUri, state, scope) {
            return _this.doFetch(_this.url + "/oauth/authorize", { method: 'post', body: JSON.stringify({ client_id: clientId, response_type: responseType, redirect_uri: redirectUri, state: state, scope: scope }) });
        };
        this.deauthorizeOAuthApp = function (clientId) {
            return _this.doFetch(_this.url + "/oauth/deauthorize", { method: 'post', body: JSON.stringify({ client_id: clientId }) });
        };
        this.createUserAccessToken = function (userId, description) {
            _this.trackEvent('api', 'api_users_create_access_token');
            return _this.doFetch(_this.getUserRoute(userId) + "/tokens", { method: 'post', body: JSON.stringify({ description: description }) });
        };
        this.getUserAccessToken = function (tokenId) {
            return _this.doFetch(_this.getUsersRoute() + "/tokens/" + tokenId, { method: 'get' });
        };
        this.getUserAccessTokensForUser = function (userId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getUserRoute(userId) + "/tokens" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getUserAccessTokens = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getUsersRoute() + "/tokens" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.revokeUserAccessToken = function (tokenId) {
            _this.trackEvent('api', 'api_users_revoke_access_token');
            return _this.doFetch(_this.getUsersRoute() + "/tokens/revoke", { method: 'post', body: JSON.stringify({ token_id: tokenId }) });
        };
        this.disableUserAccessToken = function (tokenId) {
            return _this.doFetch(_this.getUsersRoute() + "/tokens/disable", { method: 'post', body: JSON.stringify({ token_id: tokenId }) });
        };
        this.enableUserAccessToken = function (tokenId) {
            return _this.doFetch(_this.getUsersRoute() + "/tokens/enable", { method: 'post', body: JSON.stringify({ token_id: tokenId }) });
        };
        // Team Routes
        this.createTeam = function (team) {
            _this.trackEvent('api', 'api_teams_create');
            return _this.doFetch("" + _this.getTeamsRoute(), { method: 'post', body: JSON.stringify(team) });
        };
        this.deleteTeam = function (teamId) {
            _this.trackEvent('api', 'api_teams_delete');
            return _this.doFetch("" + _this.getTeamRoute(teamId), { method: 'delete' });
        };
        this.updateTeam = function (team) {
            _this.trackEvent('api', 'api_teams_update_name', { team_id: team.id });
            return _this.doFetch("" + _this.getTeamRoute(team.id), { method: 'put', body: JSON.stringify(team) });
        };
        this.patchTeam = function (team) {
            _this.trackEvent('api', 'api_teams_patch_name', { team_id: team.id });
            return _this.doFetch(_this.getTeamRoute(team.id) + "/patch", { method: 'put', body: JSON.stringify(team) });
        };
        this.regenerateTeamInviteId = function (teamId) {
            _this.trackEvent('api', 'api_teams_regenerate_invite_id', { team_id: teamId });
            return _this.doFetch(_this.getTeamRoute(teamId) + "/regenerate_invite_id", { method: 'post' });
        };
        this.updateTeamScheme = function (teamId, schemeId) {
            var patch = { scheme_id: schemeId };
            _this.trackEvent('api', 'api_teams_update_scheme', tslib_1.__assign({ team_id: teamId }, patch));
            return _this.doFetch("" + _this.getTeamSchemeRoute(teamId), { method: 'put', body: JSON.stringify(patch) });
        };
        this.checkIfTeamExists = function (teamName) {
            return _this.doFetch(_this.getTeamNameRoute(teamName) + "/exists", { method: 'get' });
        };
        this.getTeams = function (page, perPage, includeTotalCount) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (includeTotalCount === void 0) { includeTotalCount = false; }
            return _this.doFetch("" + _this.getTeamsRoute() + helpers_1.buildQueryString({ page: page, per_page: perPage, include_total_count: includeTotalCount }), { method: 'get' });
        };
        this.searchTeams = function (term, opts) {
            _this.trackEvent('api', 'api_search_teams');
            return _this.doFetch(_this.getTeamsRoute() + "/search", { method: 'post', body: JSON.stringify(tslib_1.__assign({ term: term }, opts)) });
        };
        this.getTeam = function (teamId) {
            return _this.doFetch(_this.getTeamRoute(teamId), { method: 'get' });
        };
        this.getTeamByName = function (teamName) {
            _this.trackEvent('api', 'api_teams_get_team_by_name');
            return _this.doFetch(_this.getTeamNameRoute(teamName), { method: 'get' });
        };
        this.getMyTeams = function () {
            return _this.doFetch(_this.getUserRoute('me') + "/teams", { method: 'get' });
        };
        this.getTeamsForUser = function (userId) {
            return _this.doFetch(_this.getUserRoute(userId) + "/teams", { method: 'get' });
        };
        this.getMyTeamMembers = function () {
            return _this.doFetch(_this.getUserRoute('me') + "/teams/members", { method: 'get' });
        };
        this.getMyTeamUnreads = function () {
            return _this.doFetch(_this.getUserRoute('me') + "/teams/unread", { method: 'get' });
        };
        this.getTeamMembers = function (teamId, page, perPage, options) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getTeamMembersRoute(teamId) + helpers_1.buildQueryString(tslib_1.__assign({ page: page, per_page: perPage }, options)), { method: 'get' });
        };
        this.getTeamMembersForUser = function (userId) {
            return _this.doFetch(_this.getUserRoute(userId) + "/teams/members", { method: 'get' });
        };
        this.getTeamMember = function (teamId, userId) {
            return _this.doFetch("" + _this.getTeamMemberRoute(teamId, userId), { method: 'get' });
        };
        this.getTeamMembersByIds = function (teamId, userIds) {
            return _this.doFetch(_this.getTeamMembersRoute(teamId) + "/ids", { method: 'post', body: JSON.stringify(userIds) });
        };
        this.addToTeam = function (teamId, userId) {
            _this.trackEvent('api', 'api_teams_invite_members', { team_id: teamId });
            var member = { user_id: userId, team_id: teamId };
            return _this.doFetch("" + _this.getTeamMembersRoute(teamId), { method: 'post', body: JSON.stringify(member) });
        };
        this.addToTeamFromInvite = function (token, inviteId) {
            if (token === void 0) { token = ''; }
            if (inviteId === void 0) { inviteId = ''; }
            _this.trackEvent('api', 'api_teams_invite_members');
            var query = helpers_1.buildQueryString({ token: token, invite_id: inviteId });
            return _this.doFetch(_this.getTeamsRoute() + "/members/invite" + query, { method: 'post' });
        };
        this.addUsersToTeam = function (teamId, userIds) {
            _this.trackEvent('api', 'api_teams_batch_add_members', { team_id: teamId, count: userIds.length });
            var members = [];
            userIds.forEach(function (id) { return members.push({ team_id: teamId, user_id: id }); });
            return _this.doFetch(_this.getTeamMembersRoute(teamId) + "/batch", { method: 'post', body: JSON.stringify(members) });
        };
        this.addUsersToTeamGracefully = function (teamId, userIds) {
            _this.trackEvent('api', 'api_teams_batch_add_members', { team_id: teamId, count: userIds.length });
            var members = [];
            userIds.forEach(function (id) { return members.push({ team_id: teamId, user_id: id }); });
            return _this.doFetch(_this.getTeamMembersRoute(teamId) + "/batch?graceful=true", { method: 'post', body: JSON.stringify(members) });
        };
        this.joinTeam = function (inviteId) {
            var query = helpers_1.buildQueryString({ invite_id: inviteId });
            return _this.doFetch(_this.getTeamsRoute() + "/members/invite" + query, { method: 'post' });
        };
        this.removeFromTeam = function (teamId, userId) {
            _this.trackEvent('api', 'api_teams_remove_members', { team_id: teamId });
            return _this.doFetch("" + _this.getTeamMemberRoute(teamId, userId), { method: 'delete' });
        };
        this.getTeamStats = function (teamId) {
            return _this.doFetch(_this.getTeamRoute(teamId) + "/stats", { method: 'get' });
        };
        this.getTotalUsersStats = function () {
            return _this.doFetch(_this.getUsersRoute() + "/stats", { method: 'get' });
        };
        this.getFilteredUsersStats = function (options) {
            return _this.doFetch(_this.getUsersRoute() + "/stats/filtered" + helpers_1.buildQueryString(options), { method: 'get' });
        };
        this.invalidateAllEmailInvites = function () {
            return _this.doFetch(_this.getTeamsRoute() + "/invites/email", { method: 'delete' });
        };
        this.getTeamInviteInfo = function (inviteId) {
            return _this.doFetch(_this.getTeamsRoute() + "/invite/" + inviteId, { method: 'get' });
        };
        this.updateTeamMemberRoles = function (teamId, userId, roles) {
            _this.trackEvent('api', 'api_teams_update_member_roles', { team_id: teamId });
            return _this.doFetch(_this.getTeamMemberRoute(teamId, userId) + "/roles", { method: 'put', body: JSON.stringify({ roles: roles }) });
        };
        this.sendEmailInvitesToTeam = function (teamId, emails) {
            _this.trackEvent('api', 'api_teams_invite_members', { team_id: teamId });
            return _this.doFetch(_this.getTeamRoute(teamId) + "/invite/email", { method: 'post', body: JSON.stringify(emails) });
        };
        this.sendEmailGuestInvitesToChannels = function (teamId, channelIds, emails, message) {
            _this.trackEvent('api', 'api_teams_invite_guests', { team_id: teamId, channel_ids: channelIds });
            return _this.doFetch(_this.getTeamRoute(teamId) + "/invite-guests/email", { method: 'post', body: JSON.stringify({ emails: emails, channels: channelIds, message: message }) });
        };
        this.sendEmailInvitesToTeamGracefully = function (teamId, emails) {
            _this.trackEvent('api', 'api_teams_invite_members', { team_id: teamId });
            return _this.doFetch(_this.getTeamRoute(teamId) + "/invite/email?graceful=true", { method: 'post', body: JSON.stringify(emails) });
        };
        this.sendEmailGuestInvitesToChannelsGracefully = function (teamId, channelIds, emails, message) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.trackEvent('api', 'api_teams_invite_guests', { team_id: teamId, channel_ids: channelIds });
                return [2 /*return*/, this.doFetch(this.getTeamRoute(teamId) + "/invite-guests/email?graceful=true", { method: 'post', body: JSON.stringify({ emails: emails, channels: channelIds, message: message }) })];
            });
        }); };
        this.importTeam = function (teamId, file, importFrom) {
            var formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('filesize', file.size);
            formData.append('importFrom', importFrom);
            var request = {
                method: 'post',
                body: formData,
            };
            if (formData.getBoundary) {
                request.headers = {
                    'Content-Type': "multipart/form-data; boundary=" + formData.getBoundary(),
                };
            }
            return _this.doFetch(_this.getTeamRoute(teamId) + "/import", request);
        };
        this.getTeamIconUrl = function (teamId, lastTeamIconUpdate) {
            var params = {};
            if (lastTeamIconUpdate) {
                params._ = lastTeamIconUpdate;
            }
            return _this.getTeamRoute(teamId) + "/image" + helpers_1.buildQueryString(params);
        };
        this.setTeamIcon = function (teamId, imageData) {
            _this.trackEvent('api', 'api_team_set_team_icon');
            var formData = new FormData();
            formData.append('image', imageData);
            var request = {
                method: 'post',
                body: formData,
            };
            if (formData.getBoundary) {
                request.headers = {
                    'Content-Type': "multipart/form-data; boundary=" + formData.getBoundary(),
                };
            }
            return _this.doFetch(_this.getTeamRoute(teamId) + "/image", request);
        };
        this.removeTeamIcon = function (teamId) {
            _this.trackEvent('api', 'api_team_remove_team_icon');
            return _this.doFetch(_this.getTeamRoute(teamId) + "/image", { method: 'delete' });
        };
        this.updateTeamMemberSchemeRoles = function (teamId, userId, isSchemeUser, isSchemeAdmin) {
            var body = { scheme_user: isSchemeUser, scheme_admin: isSchemeAdmin };
            return _this.doFetch(_this.getTeamRoute(teamId) + "/members/" + userId + "/schemeRoles", { method: 'put', body: JSON.stringify(body) });
        };
        // Channel Routes
        this.getAllChannels = function (page, perPage, notAssociatedToGroup, excludeDefaultChannels, includeTotalCount, includeDeleted) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (notAssociatedToGroup === void 0) { notAssociatedToGroup = ''; }
            if (excludeDefaultChannels === void 0) { excludeDefaultChannels = false; }
            if (includeTotalCount === void 0) { includeTotalCount = false; }
            if (includeDeleted === void 0) { includeDeleted = false; }
            var queryData = {
                page: page,
                per_page: perPage,
                not_associated_to_group: notAssociatedToGroup,
                exclude_default_channels: excludeDefaultChannels,
                include_total_count: includeTotalCount,
                include_deleted: includeDeleted,
            };
            return _this.doFetch("" + _this.getChannelsRoute() + helpers_1.buildQueryString(queryData), { method: 'get' });
        };
        this.createChannel = function (channel) {
            _this.trackEvent('api', 'api_channels_create', { team_id: channel.team_id });
            return _this.doFetch("" + _this.getChannelsRoute(), { method: 'post', body: JSON.stringify(channel) });
        };
        this.createDirectChannel = function (userIds) {
            _this.trackEvent('api', 'api_channels_create_direct');
            return _this.doFetch(_this.getChannelsRoute() + "/direct", { method: 'post', body: JSON.stringify(userIds) });
        };
        this.createGroupChannel = function (userIds) {
            _this.trackEvent('api', 'api_channels_create_group');
            return _this.doFetch(_this.getChannelsRoute() + "/group", { method: 'post', body: JSON.stringify(userIds) });
        };
        this.deleteChannel = function (channelId) {
            _this.trackEvent('api', 'api_channels_delete', { channel_id: channelId });
            return _this.doFetch("" + _this.getChannelRoute(channelId), { method: 'delete' });
        };
        this.unarchiveChannel = function (channelId) {
            _this.trackEvent('api', 'api_channels_unarchive', { channel_id: channelId });
            return _this.doFetch(_this.getChannelRoute(channelId) + "/restore", { method: 'post' });
        };
        this.updateChannel = function (channel) {
            _this.trackEvent('api', 'api_channels_update', { channel_id: channel.id });
            return _this.doFetch("" + _this.getChannelRoute(channel.id), { method: 'put', body: JSON.stringify(channel) });
        };
        this.convertChannelToPrivate = function (channelId) {
            _this.trackEvent('api', 'api_channels_convert_to_private', { channel_id: channelId });
            return _this.doFetch(_this.getChannelRoute(channelId) + "/convert", { method: 'post' });
        };
        this.updateChannelPrivacy = function (channelId, privacy) {
            _this.trackEvent('api', 'api_channels_update_privacy', { channel_id: channelId, privacy: privacy });
            return _this.doFetch(_this.getChannelRoute(channelId) + "/privacy", { method: 'put', body: JSON.stringify({ privacy: privacy }) });
        };
        this.patchChannel = function (channelId, channelPatch) {
            _this.trackEvent('api', 'api_channels_patch', { channel_id: channelId });
            return _this.doFetch(_this.getChannelRoute(channelId) + "/patch", { method: 'put', body: JSON.stringify(channelPatch) });
        };
        this.updateChannelNotifyProps = function (props) {
            _this.trackEvent('api', 'api_users_update_channel_notifications', { channel_id: props.channel_id });
            return _this.doFetch(_this.getChannelMemberRoute(props.channel_id, props.user_id) + "/notify_props", { method: 'put', body: JSON.stringify(props) });
        };
        this.updateChannelScheme = function (channelId, schemeId) {
            var patch = { scheme_id: schemeId };
            _this.trackEvent('api', 'api_channels_update_scheme', tslib_1.__assign({ channel_id: channelId }, patch));
            return _this.doFetch("" + _this.getChannelSchemeRoute(channelId), { method: 'put', body: JSON.stringify(patch) });
        };
        this.getChannel = function (channelId) {
            _this.trackEvent('api', 'api_channel_get', { channel_id: channelId });
            return _this.doFetch("" + _this.getChannelRoute(channelId), { method: 'get' });
        };
        this.getChannelByName = function (teamId, channelName, includeDeleted) {
            if (includeDeleted === void 0) { includeDeleted = false; }
            return _this.doFetch(_this.getTeamRoute(teamId) + "/channels/name/" + channelName + "?include_deleted=" + includeDeleted, { method: 'get' });
        };
        this.getChannelByNameAndTeamName = function (teamName, channelName, includeDeleted) {
            if (includeDeleted === void 0) { includeDeleted = false; }
            _this.trackEvent('api', 'api_channel_get_by_name_and_teamName', { include_deleted: includeDeleted });
            return _this.doFetch(_this.getTeamNameRoute(teamName) + "/channels/name/" + channelName + "?include_deleted=" + includeDeleted, { method: 'get' });
        };
        this.getChannels = function (teamId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getTeamRoute(teamId) + "/channels" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getArchivedChannels = function (teamId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getTeamRoute(teamId) + "/channels/deleted" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getMyChannels = function (teamId, includeDeleted) {
            if (includeDeleted === void 0) { includeDeleted = false; }
            return _this.doFetch(_this.getUserRoute('me') + "/teams/" + teamId + "/channels" + helpers_1.buildQueryString({ include_deleted: includeDeleted }), { method: 'get' });
        };
        this.getMyChannelMember = function (channelId) {
            return _this.doFetch("" + _this.getChannelMemberRoute(channelId, 'me'), { method: 'get' });
        };
        this.getMyChannelMembers = function (teamId) {
            return _this.doFetch(_this.getUserRoute('me') + "/teams/" + teamId + "/channels/members", { method: 'get' });
        };
        this.getChannelMembers = function (channelId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getChannelMembersRoute(channelId) + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getChannelTimezones = function (channelId) {
            return _this.doFetch(_this.getChannelRoute(channelId) + "/timezones", { method: 'get' });
        };
        this.getChannelMember = function (channelId, userId) {
            return _this.doFetch("" + _this.getChannelMemberRoute(channelId, userId), { method: 'get' });
        };
        this.getChannelMembersByIds = function (channelId, userIds) {
            return _this.doFetch(_this.getChannelMembersRoute(channelId) + "/ids", { method: 'post', body: JSON.stringify(userIds) });
        };
        this.addToChannel = function (userId, channelId, postRootId) {
            if (postRootId === void 0) { postRootId = ''; }
            _this.trackEvent('api', 'api_channels_add_member', { channel_id: channelId });
            var member = { user_id: userId, channel_id: channelId, post_root_id: postRootId };
            return _this.doFetch("" + _this.getChannelMembersRoute(channelId), { method: 'post', body: JSON.stringify(member) });
        };
        this.removeFromChannel = function (userId, channelId) {
            _this.trackEvent('api', 'api_channels_remove_member', { channel_id: channelId });
            return _this.doFetch("" + _this.getChannelMemberRoute(channelId, userId), { method: 'delete' });
        };
        this.updateChannelMemberRoles = function (channelId, userId, roles) {
            return _this.doFetch(_this.getChannelMemberRoute(channelId, userId) + "/roles", { method: 'put', body: JSON.stringify({ roles: roles }) });
        };
        this.getChannelStats = function (channelId) {
            return _this.doFetch(_this.getChannelRoute(channelId) + "/stats", { method: 'get' });
        };
        this.getChannelModerations = function (channelId) {
            return _this.doFetch(_this.getChannelRoute(channelId) + "/moderations", { method: 'get' });
        };
        this.patchChannelModerations = function (channelId, channelModerationsPatch) {
            return _this.doFetch(_this.getChannelRoute(channelId) + "/moderations/patch", { method: 'put', body: JSON.stringify(channelModerationsPatch) });
        };
        this.getChannelMemberCountsByGroup = function (channelId, includeTimezones) {
            return _this.doFetch(_this.getChannelRoute(channelId) + "/member_counts_by_group?include_timezones=" + includeTimezones, { method: 'get' });
        };
        this.viewMyChannel = function (channelId, prevChannelId) {
            var data = { channel_id: channelId, prev_channel_id: prevChannelId };
            return _this.doFetch(_this.getChannelsRoute() + "/members/me/view", { method: 'post', body: JSON.stringify(data) });
        };
        this.autocompleteChannels = function (teamId, name) {
            return _this.doFetch(_this.getTeamRoute(teamId) + "/channels/autocomplete" + helpers_1.buildQueryString({ name: name }), { method: 'get' });
        };
        this.autocompleteChannelsForSearch = function (teamId, name) {
            return _this.doFetch(_this.getTeamRoute(teamId) + "/channels/search_autocomplete" + helpers_1.buildQueryString({ name: name }), { method: 'get' });
        };
        this.searchChannels = function (teamId, term) {
            return _this.doFetch(_this.getTeamRoute(teamId) + "/channels/search", { method: 'post', body: JSON.stringify({ term: term }) });
        };
        this.searchArchivedChannels = function (teamId, term) {
            return _this.doFetch(_this.getTeamRoute(teamId) + "/channels/search_archived", { method: 'post', body: JSON.stringify({ term: term }) });
        };
        this.searchAllChannels = function (term, opts) {
            if (opts === void 0) { opts = {}; }
            var body = tslib_1.__assign({ term: term }, opts);
            var includeDeleted = Boolean(opts.include_deleted);
            return _this.doFetch(_this.getChannelsRoute() + "/search?include_deleted=" + includeDeleted, { method: 'post', body: JSON.stringify(body) });
        };
        this.searchGroupChannels = function (term) {
            return _this.doFetch(_this.getChannelsRoute() + "/group/search", { method: 'post', body: JSON.stringify({ term: term }) });
        };
        this.updateChannelMemberSchemeRoles = function (channelId, userId, isSchemeUser, isSchemeAdmin) {
            var body = { scheme_user: isSchemeUser, scheme_admin: isSchemeAdmin };
            return _this.doFetch(_this.getChannelRoute(channelId) + "/members/" + userId + "/schemeRoles", { method: 'put', body: JSON.stringify(body) });
        };
        // Channel Category Routes
        this.getChannelCategories = function (userId, teamId) {
            return _this.doFetch("" + _this.getChannelCategoriesRoute(userId, teamId), { method: 'get' });
        };
        this.createChannelCategory = function (userId, teamId, category) {
            return _this.doFetch("" + _this.getChannelCategoriesRoute(userId, teamId), { method: 'post', body: JSON.stringify(category) });
        };
        this.updateChannelCategories = function (userId, teamId, categories) {
            return _this.doFetch("" + _this.getChannelCategoriesRoute(userId, teamId), { method: 'put', body: JSON.stringify(categories) });
        };
        this.getChannelCategoryOrder = function (userId, teamId) {
            return _this.doFetch(_this.getChannelCategoriesRoute(userId, teamId) + "/order", { method: 'get' });
        };
        this.updateChannelCategoryOrder = function (userId, teamId, categoryOrder) {
            return _this.doFetch(_this.getChannelCategoriesRoute(userId, teamId) + "/order", { method: 'put', body: JSON.stringify(categoryOrder) });
        };
        this.getChannelCategory = function (userId, teamId, categoryId) {
            return _this.doFetch(_this.getChannelCategoriesRoute(userId, teamId) + "/" + categoryId, { method: 'get' });
        };
        this.updateChannelCategory = function (userId, teamId, category) {
            return _this.doFetch(_this.getChannelCategoriesRoute(userId, teamId) + "/" + category.id, { method: 'put', body: JSON.stringify(category) });
        };
        this.deleteChannelCategory = function (userId, teamId, categoryId) {
            return _this.doFetch(_this.getChannelCategoriesRoute(userId, teamId) + "/" + categoryId, { method: 'delete' });
        };
        // Post Routes
        this.createPost = function (post) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, analyticsData;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doFetch("" + this.getPostsRoute(), { method: 'post', body: JSON.stringify(post) })];
                    case 1:
                        result = _a.sent();
                        analyticsData = { channel_id: result.channel_id, post_id: result.id, user_actual_id: result.user_id, root_id: result.root_id };
                        this.trackEvent('api', 'api_posts_create', analyticsData);
                        if (result.root_id != null && result.root_id !== '') {
                            this.trackEvent('api', 'api_posts_replied', analyticsData);
                        }
                        return [2 /*return*/, result];
                }
            });
        }); };
        this.updatePost = function (post) {
            _this.trackEvent('api', 'api_posts_update', { channel_id: post.channel_id, post_id: post.id });
            return _this.doFetch("" + _this.getPostRoute(post.id), { method: 'put', body: JSON.stringify(post) });
        };
        this.getPost = function (postId) {
            return _this.doFetch("" + _this.getPostRoute(postId), { method: 'get' });
        };
        this.patchPost = function (postPatch) {
            _this.trackEvent('api', 'api_posts_patch', { channel_id: postPatch.channel_id, post_id: postPatch.id });
            return _this.doFetch(_this.getPostRoute(postPatch.id) + "/patch", { method: 'put', body: JSON.stringify(postPatch) });
        };
        this.deletePost = function (postId) {
            _this.trackEvent('api', 'api_posts_delete');
            return _this.doFetch("" + _this.getPostRoute(postId), { method: 'delete' });
        };
        this.getPostThread = function (postId, fetchThreads, collapsedThreads, collapsedThreadsExtended) {
            if (fetchThreads === void 0) { fetchThreads = true; }
            if (collapsedThreads === void 0) { collapsedThreads = false; }
            if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
            return _this.doFetch(_this.getPostRoute(postId) + "/thread" + helpers_1.buildQueryString({ skipFetchThreads: !fetchThreads, collapsedThreads: collapsedThreads, collapsedThreadsExtended: collapsedThreadsExtended }), { method: 'get' });
        };
        this.getPosts = function (channelId, page, perPage, fetchThreads, collapsedThreads, collapsedThreadsExtended) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (fetchThreads === void 0) { fetchThreads = true; }
            if (collapsedThreads === void 0) { collapsedThreads = false; }
            if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
            return _this.doFetch(_this.getChannelRoute(channelId) + "/posts" + helpers_1.buildQueryString({ page: page, per_page: perPage, skipFetchThreads: !fetchThreads, collapsedThreads: collapsedThreads, collapsedThreadsExtended: collapsedThreadsExtended }), { method: 'get' });
        };
        this.getPostsUnread = function (channelId, userId, limitAfter, limitBefore, fetchThreads, collapsedThreads, collapsedThreadsExtended) {
            if (limitAfter === void 0) { limitAfter = exports.DEFAULT_LIMIT_AFTER; }
            if (limitBefore === void 0) { limitBefore = exports.DEFAULT_LIMIT_BEFORE; }
            if (fetchThreads === void 0) { fetchThreads = true; }
            if (collapsedThreads === void 0) { collapsedThreads = false; }
            if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
            return _this.doFetch(_this.getUserRoute(userId) + "/channels/" + channelId + "/posts/unread" + helpers_1.buildQueryString({ limit_after: limitAfter, limit_before: limitBefore, skipFetchThreads: !fetchThreads, collapsedThreads: collapsedThreads, collapsedThreadsExtended: collapsedThreadsExtended }), { method: 'get' });
        };
        this.getPostsSince = function (channelId, since, fetchThreads, collapsedThreads, collapsedThreadsExtended) {
            if (fetchThreads === void 0) { fetchThreads = true; }
            if (collapsedThreads === void 0) { collapsedThreads = false; }
            if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
            return _this.doFetch(_this.getChannelRoute(channelId) + "/posts" + helpers_1.buildQueryString({ since: since, skipFetchThreads: !fetchThreads, collapsedThreads: collapsedThreads, collapsedThreadsExtended: collapsedThreadsExtended }), { method: 'get' });
        };
        this.getPostsBefore = function (channelId, postId, page, perPage, fetchThreads, collapsedThreads, collapsedThreadsExtended) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (fetchThreads === void 0) { fetchThreads = true; }
            if (collapsedThreads === void 0) { collapsedThreads = false; }
            if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
            _this.trackEvent('api', 'api_posts_get_before', { channel_id: channelId });
            return _this.doFetch(_this.getChannelRoute(channelId) + "/posts" + helpers_1.buildQueryString({ before: postId, page: page, per_page: perPage, skipFetchThreads: !fetchThreads, collapsedThreads: collapsedThreads, collapsedThreadsExtended: collapsedThreadsExtended }), { method: 'get' });
        };
        this.getPostsAfter = function (channelId, postId, page, perPage, fetchThreads, collapsedThreads, collapsedThreadsExtended) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (fetchThreads === void 0) { fetchThreads = true; }
            if (collapsedThreads === void 0) { collapsedThreads = false; }
            if (collapsedThreadsExtended === void 0) { collapsedThreadsExtended = false; }
            _this.trackEvent('api', 'api_posts_get_after', { channel_id: channelId });
            return _this.doFetch(_this.getChannelRoute(channelId) + "/posts" + helpers_1.buildQueryString({ after: postId, page: page, per_page: perPage, skipFetchThreads: !fetchThreads, collapsedThreads: collapsedThreads, collapsedThreadsExtended: collapsedThreadsExtended }), { method: 'get' });
        };
        this.getUserThreads = function (userId, teamId, _a) {
            if (userId === void 0) { userId = 'me'; }
            var _b = _a.before, before = _b === void 0 ? '' : _b, _c = _a.after, after = _c === void 0 ? '' : _c, _d = _a.pageSize, pageSize = _d === void 0 ? PER_PAGE_DEFAULT : _d, _e = _a.extended, extended = _e === void 0 ? false : _e, _f = _a.deleted, deleted = _f === void 0 ? false : _f, _g = _a.unread, unread = _g === void 0 ? false : _g, _h = _a.since, since = _h === void 0 ? 0 : _h;
            return _this.doFetch("" + _this.getUserThreadsRoute(userId, teamId) + helpers_1.buildQueryString({ before: before, after: after, pageSize: pageSize, extended: extended, deleted: deleted, unread: unread, since: since }), { method: 'get' });
        };
        this.getUserThread = function (userId, teamId, threadId, extended) {
            if (extended === void 0) { extended = false; }
            var url = "" + _this.getUserThreadRoute(userId, teamId, threadId);
            return _this.doFetch("" + url + helpers_1.buildQueryString({ extended: extended }), { method: 'get' });
        };
        this.getThreadMentionCountsByChannel = function (userId, teamId) {
            var url = _this.getUserThreadsRoute(userId, teamId) + "/mention_counts";
            return _this.doFetch(url, { method: 'get' });
        };
        this.updateThreadsReadForUser = function (userId, teamId) {
            var url = _this.getUserThreadsRoute(userId, teamId) + "/read";
            return _this.doFetch(url, { method: 'put' });
        };
        this.updateThreadReadForUser = function (userId, teamId, threadId, timestamp) {
            var url = _this.getUserThreadRoute(userId, teamId, threadId) + "/read/" + timestamp;
            return _this.doFetch(url, { method: 'put' });
        };
        this.updateThreadFollowForUser = function (userId, teamId, threadId, state) {
            var url = _this.getUserThreadRoute(userId, teamId, threadId) + '/following';
            return _this.doFetch(url, { method: state ? 'put' : 'delete' });
        };
        this.getFileInfosForPost = function (postId) {
            return _this.doFetch(_this.getPostRoute(postId) + "/files/info", { method: 'get' });
        };
        this.getFlaggedPosts = function (userId, channelId, teamId, page, perPage) {
            if (channelId === void 0) { channelId = ''; }
            if (teamId === void 0) { teamId = ''; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            _this.trackEvent('api', 'api_posts_get_flagged', { team_id: teamId });
            return _this.doFetch(_this.getUserRoute(userId) + "/posts/flagged" + helpers_1.buildQueryString({ channel_id: channelId, team_id: teamId, page: page, per_page: perPage }), { method: 'get' });
        };
        this.getPinnedPosts = function (channelId) {
            _this.trackEvent('api', 'api_posts_get_pinned', { channel_id: channelId });
            return _this.doFetch(_this.getChannelRoute(channelId) + "/pinned", { method: 'get' });
        };
        this.markPostAsUnread = function (userId, postId) {
            _this.trackEvent('api', 'api_post_set_unread_post');
            return _this.doFetch(_this.getUserRoute(userId) + "/posts/" + postId + "/set_unread", { method: 'post' });
        };
        this.pinPost = function (postId) {
            _this.trackEvent('api', 'api_posts_pin');
            return _this.doFetch(_this.getPostRoute(postId) + "/pin", { method: 'post' });
        };
        this.unpinPost = function (postId) {
            _this.trackEvent('api', 'api_posts_unpin');
            return _this.doFetch(_this.getPostRoute(postId) + "/unpin", { method: 'post' });
        };
        this.addReaction = function (userId, postId, emojiName) {
            _this.trackEvent('api', 'api_reactions_save', { post_id: postId });
            return _this.doFetch("" + _this.getReactionsRoute(), { method: 'post', body: JSON.stringify({ user_id: userId, post_id: postId, emoji_name: emojiName }) });
        };
        this.removeReaction = function (userId, postId, emojiName) {
            _this.trackEvent('api', 'api_reactions_delete', { post_id: postId });
            return _this.doFetch(_this.getUserRoute(userId) + "/posts/" + postId + "/reactions/" + emojiName, { method: 'delete' });
        };
        this.getReactionsForPost = function (postId) {
            return _this.doFetch(_this.getPostRoute(postId) + "/reactions", { method: 'get' });
        };
        this.searchPostsWithParams = function (teamId, params) {
            _this.trackEvent('api', 'api_posts_search', { team_id: teamId });
            return _this.doFetch(_this.getTeamRoute(teamId) + "/posts/search", { method: 'post', body: JSON.stringify(params) });
        };
        this.searchPosts = function (teamId, terms, isOrSearch) {
            return _this.searchPostsWithParams(teamId, { terms: terms, is_or_search: isOrSearch });
        };
        this.searchFilesWithParams = function (teamId, params) {
            _this.trackEvent('api', 'api_files_search', { team_id: teamId });
            return _this.doFetch(_this.getTeamRoute(teamId) + "/files/search", { method: 'post', body: JSON.stringify(params) });
        };
        this.searchFiles = function (teamId, terms, isOrSearch) {
            return _this.searchFilesWithParams(teamId, { terms: terms, is_or_search: isOrSearch });
        };
        this.getOpenGraphMetadata = function (url) {
            return _this.doFetch(_this.getBaseRoute() + "/opengraph", { method: 'post', body: JSON.stringify({ url: url }) });
        };
        this.doPostAction = function (postId, actionId, selectedOption) {
            if (selectedOption === void 0) { selectedOption = ''; }
            return _this.doPostActionWithCookie(postId, actionId, '', selectedOption);
        };
        this.doPostActionWithCookie = function (postId, actionId, actionCookie, selectedOption) {
            if (selectedOption === void 0) { selectedOption = ''; }
            if (selectedOption) {
                _this.trackEvent('api', 'api_interactive_messages_menu_selected');
            }
            else {
                _this.trackEvent('api', 'api_interactive_messages_button_clicked');
            }
            var msg = {
                selected_option: selectedOption,
            };
            if (actionCookie !== '') {
                msg.cookie = actionCookie;
            }
            return _this.doFetch(_this.getPostRoute(postId) + "/actions/" + encodeURIComponent(actionId), { method: 'post', body: JSON.stringify(msg) });
        };
        this.uploadFile = function (fileFormData, formBoundary) {
            _this.trackEvent('api', 'api_files_upload');
            var request = {
                method: 'post',
                body: fileFormData,
            };
            if (formBoundary) {
                request.headers = {
                    'Content-Type': "multipart/form-data; boundary=" + formBoundary,
                };
            }
            return _this.doFetch("" + _this.getFilesRoute(), request);
        };
        this.getFilePublicLink = function (fileId) {
            return _this.doFetch(_this.getFileRoute(fileId) + "/link", { method: 'get' });
        };
        // Preference Routes
        this.savePreferences = function (userId, preferences) {
            return _this.doFetch("" + _this.getPreferencesRoute(userId), { method: 'put', body: JSON.stringify(preferences) });
        };
        this.getMyPreferences = function () {
            return _this.doFetch("" + _this.getPreferencesRoute('me'), { method: 'get' });
        };
        this.deletePreferences = function (userId, preferences) {
            return _this.doFetch(_this.getPreferencesRoute(userId) + "/delete", { method: 'post', body: JSON.stringify(preferences) });
        };
        // General Routes
        this.ping = function () {
            return _this.doFetch(_this.getBaseRoute() + "/system/ping?time=" + Date.now(), { method: 'get' });
        };
        this.upgradeToEnterprise = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doFetch(this.getBaseRoute() + "/upgrade_to_enterprise", { method: 'post' })];
            });
        }); };
        this.upgradeToEnterpriseStatus = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doFetch(this.getBaseRoute() + "/upgrade_to_enterprise/status", { method: 'get' })];
            });
        }); };
        this.restartServer = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doFetch(this.getBaseRoute() + "/restart", { method: 'post' })];
            });
        }); };
        this.logClientError = function (message, level) {
            if (level === void 0) { level = 'ERROR'; }
            var url = _this.getBaseRoute() + "/logs";
            if (!_this.enableLogging) {
                throw new ClientError(_this.getUrl(), {
                    message: 'Logging disabled.',
                    url: url,
                });
            }
            return _this.doFetch(url, { method: 'post', body: JSON.stringify({ message: message, level: level }) });
        };
        this.getClientConfigOld = function () {
            return _this.doFetch(_this.getBaseRoute() + "/config/client?format=old", { method: 'get' });
        };
        this.getClientLicenseOld = function () {
            return _this.doFetch(_this.getBaseRoute() + "/license/client?format=old", { method: 'get' });
        };
        this.getWarnMetricsStatus = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doFetch(this.getBaseRoute() + "/warn_metrics/status", { method: 'get' })];
            });
        }); };
        this.sendWarnMetricAck = function (warnMetricId, forceAckVal) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doFetch(this.getBaseRoute() + "/warn_metrics/ack/" + encodeURI(warnMetricId), { method: 'post', body: JSON.stringify({ forceAck: forceAckVal }) })];
            });
        }); };
        this.getTranslations = function (url) {
            return _this.doFetch(url, { method: 'get' });
        };
        this.getWebSocketUrl = function () {
            return _this.getBaseRoute() + "/websocket";
        };
        // Integration Routes
        this.createIncomingWebhook = function (hook) {
            _this.trackEvent('api', 'api_integrations_created', { team_id: hook.team_id });
            return _this.doFetch("" + _this.getIncomingHooksRoute(), { method: 'post', body: JSON.stringify(hook) });
        };
        this.getIncomingWebhook = function (hookId) {
            return _this.doFetch("" + _this.getIncomingHookRoute(hookId), { method: 'get' });
        };
        this.getIncomingWebhooks = function (teamId, page, perPage) {
            if (teamId === void 0) { teamId = ''; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            var queryParams = {
                page: page,
                per_page: perPage,
            };
            if (teamId) {
                queryParams.team_id = teamId;
            }
            return _this.doFetch("" + _this.getIncomingHooksRoute() + helpers_1.buildQueryString(queryParams), { method: 'get' });
        };
        this.removeIncomingWebhook = function (hookId) {
            _this.trackEvent('api', 'api_integrations_deleted');
            return _this.doFetch("" + _this.getIncomingHookRoute(hookId), { method: 'delete' });
        };
        this.updateIncomingWebhook = function (hook) {
            _this.trackEvent('api', 'api_integrations_updated', { team_id: hook.team_id });
            return _this.doFetch("" + _this.getIncomingHookRoute(hook.id), { method: 'put', body: JSON.stringify(hook) });
        };
        this.createOutgoingWebhook = function (hook) {
            _this.trackEvent('api', 'api_integrations_created', { team_id: hook.team_id });
            return _this.doFetch("" + _this.getOutgoingHooksRoute(), { method: 'post', body: JSON.stringify(hook) });
        };
        this.getOutgoingWebhook = function (hookId) {
            return _this.doFetch("" + _this.getOutgoingHookRoute(hookId), { method: 'get' });
        };
        this.getOutgoingWebhooks = function (channelId, teamId, page, perPage) {
            if (channelId === void 0) { channelId = ''; }
            if (teamId === void 0) { teamId = ''; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            var queryParams = {
                page: page,
                per_page: perPage,
            };
            if (channelId) {
                queryParams.channel_id = channelId;
            }
            if (teamId) {
                queryParams.team_id = teamId;
            }
            return _this.doFetch("" + _this.getOutgoingHooksRoute() + helpers_1.buildQueryString(queryParams), { method: 'get' });
        };
        this.removeOutgoingWebhook = function (hookId) {
            _this.trackEvent('api', 'api_integrations_deleted');
            return _this.doFetch("" + _this.getOutgoingHookRoute(hookId), { method: 'delete' });
        };
        this.updateOutgoingWebhook = function (hook) {
            _this.trackEvent('api', 'api_integrations_updated', { team_id: hook.team_id });
            return _this.doFetch("" + _this.getOutgoingHookRoute(hook.id), { method: 'put', body: JSON.stringify(hook) });
        };
        this.regenOutgoingHookToken = function (id) {
            return _this.doFetch(_this.getOutgoingHookRoute(id) + "/regen_token", { method: 'post' });
        };
        this.getCommandsList = function (teamId) {
            return _this.doFetch(_this.getCommandsRoute() + "?team_id=" + teamId, { method: 'get' });
        };
        this.getCommandAutocompleteSuggestionsList = function (userInput, teamId, commandArgs) {
            return _this.doFetch(_this.getTeamRoute(teamId) + "/commands/autocomplete_suggestions" + helpers_1.buildQueryString(tslib_1.__assign(tslib_1.__assign({}, commandArgs), { user_input: userInput })), { method: 'get' });
        };
        this.getAutocompleteCommandsList = function (teamId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getTeamRoute(teamId) + "/commands/autocomplete" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getCustomTeamCommands = function (teamId) {
            return _this.doFetch(_this.getCommandsRoute() + "?team_id=" + teamId + "&custom_only=true", { method: 'get' });
        };
        this.executeCommand = function (command, commandArgs) {
            _this.trackEvent('api', 'api_integrations_used');
            return _this.doFetch(_this.getCommandsRoute() + "/execute", { method: 'post', body: JSON.stringify(tslib_1.__assign({ command: command }, commandArgs)) });
        };
        this.addCommand = function (command) {
            _this.trackEvent('api', 'api_integrations_created');
            return _this.doFetch("" + _this.getCommandsRoute(), { method: 'post', body: JSON.stringify(command) });
        };
        this.editCommand = function (command) {
            _this.trackEvent('api', 'api_integrations_created');
            return _this.doFetch(_this.getCommandsRoute() + "/" + command.id, { method: 'put', body: JSON.stringify(command) });
        };
        this.regenCommandToken = function (id) {
            return _this.doFetch(_this.getCommandsRoute() + "/" + id + "/regen_token", { method: 'put' });
        };
        this.deleteCommand = function (id) {
            _this.trackEvent('api', 'api_integrations_deleted');
            return _this.doFetch(_this.getCommandsRoute() + "/" + id, { method: 'delete' });
        };
        this.createOAuthApp = function (app) {
            _this.trackEvent('api', 'api_apps_register');
            return _this.doFetch("" + _this.getOAuthAppsRoute(), { method: 'post', body: JSON.stringify(app) });
        };
        this.editOAuthApp = function (app) {
            return _this.doFetch(_this.getOAuthAppsRoute() + "/" + app.id, { method: 'put', body: JSON.stringify(app) });
        };
        this.getOAuthApps = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getOAuthAppsRoute() + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getOAuthApp = function (appId) {
            return _this.doFetch("" + _this.getOAuthAppRoute(appId), { method: 'get' });
        };
        this.getOAuthAppInfo = function (appId) {
            return _this.doFetch(_this.getOAuthAppRoute(appId) + "/info", { method: 'get' });
        };
        this.deleteOAuthApp = function (appId) {
            _this.trackEvent('api', 'api_apps_delete');
            return _this.doFetch("" + _this.getOAuthAppRoute(appId), { method: 'delete' });
        };
        this.regenOAuthAppSecret = function (appId) {
            return _this.doFetch(_this.getOAuthAppRoute(appId) + "/regen_secret", { method: 'post' });
        };
        this.submitInteractiveDialog = function (data) {
            _this.trackEvent('api', 'api_interactive_messages_dialog_submitted');
            return _this.doFetch(_this.getBaseRoute() + "/actions/dialogs/submit", { method: 'post', body: JSON.stringify(data) });
        };
        // Emoji Routes
        this.createCustomEmoji = function (emoji, imageData) {
            _this.trackEvent('api', 'api_emoji_custom_add');
            var formData = new FormData();
            formData.append('image', imageData);
            formData.append('emoji', JSON.stringify(emoji));
            var request = {
                method: 'post',
                body: formData,
            };
            if (formData.getBoundary) {
                request.headers = {
                    'Content-Type': "multipart/form-data; boundary=" + formData.getBoundary(),
                };
            }
            return _this.doFetch("" + _this.getEmojisRoute(), request);
        };
        this.getCustomEmoji = function (id) {
            return _this.doFetch(_this.getEmojisRoute() + "/" + id, { method: 'get' });
        };
        this.getCustomEmojiByName = function (name) {
            return _this.doFetch(_this.getEmojisRoute() + "/name/" + name, { method: 'get' });
        };
        this.getCustomEmojis = function (page, perPage, sort) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (sort === void 0) { sort = ''; }
            return _this.doFetch("" + _this.getEmojisRoute() + helpers_1.buildQueryString({ page: page, per_page: perPage, sort: sort }), { method: 'get' });
        };
        this.deleteCustomEmoji = function (emojiId) {
            _this.trackEvent('api', 'api_emoji_custom_delete');
            return _this.doFetch("" + _this.getEmojiRoute(emojiId), { method: 'delete' });
        };
        this.getSystemEmojiImageUrl = function (filename) {
            return _this.url + "/static/emoji/" + filename + ".png";
        };
        this.getCustomEmojiImageUrl = function (id) {
            return _this.getEmojiRoute(id) + "/image";
        };
        this.searchCustomEmoji = function (term, options) {
            if (options === void 0) { options = {}; }
            return _this.doFetch(_this.getEmojisRoute() + "/search", { method: 'post', body: JSON.stringify(tslib_1.__assign({ term: term }, options)) });
        };
        this.autocompleteCustomEmoji = function (name) {
            return _this.doFetch(_this.getEmojisRoute() + "/autocomplete" + helpers_1.buildQueryString({ name: name }), { method: 'get' });
        };
        // Timezone Routes
        this.getTimezones = function () {
            return _this.doFetch("" + _this.getTimezonesRoute(), { method: 'get' });
        };
        // Data Retention
        this.getDataRetentionPolicy = function () {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policy", { method: 'get' });
        };
        this.getDataRetentionCustomPolicies = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getDataRetentionCustomPolicy = function (id) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + id, { method: 'get' });
        };
        this.searchDataRetentionCustomPolicyChannels = function (policyId, term, opts) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + policyId + "/channels/search", { method: 'post', body: JSON.stringify(tslib_1.__assign({ term: term }, opts)) });
        };
        this.searchDataRetentionCustomPolicyTeams = function (policyId, term, opts) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + policyId + "/teams/search", { method: 'post', body: JSON.stringify(tslib_1.__assign({ term: term }, opts)) });
        };
        this.getDataRetentionCustomPolicyTeams = function (id, page, perPage, includeTotalCount) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (includeTotalCount === void 0) { includeTotalCount = false; }
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + id + "/teams" + helpers_1.buildQueryString({ page: page, per_page: perPage, include_total_count: includeTotalCount }), { method: 'get' });
        };
        this.getDataRetentionCustomPolicyChannels = function (id, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + id + "/channels" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.createDataRetentionPolicy = function (policy) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies", { method: 'post', body: JSON.stringify(policy) });
        };
        this.updateDataRetentionPolicy = function (id, policy) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + id, { method: 'PATCH', body: JSON.stringify(policy) });
        };
        this.addDataRetentionPolicyTeams = function (id, policy) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + id + "/teams", { method: 'post', body: JSON.stringify(policy) });
        };
        this.removeDataRetentionPolicyTeams = function (id, policy) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + id + "/teams", { method: 'delete', body: JSON.stringify(policy) });
        };
        this.addDataRetentionPolicyChannels = function (id, policy) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + id + "/channels", { method: 'post', body: JSON.stringify(policy) });
        };
        this.removeDataRetentionPolicyChannels = function (id, policy) {
            return _this.doFetch(_this.getDataRetentionRoute() + "/policies/" + id + "/channels", { method: 'delete', body: JSON.stringify(policy) });
        };
        // Jobs Routes
        this.getJob = function (id) {
            return _this.doFetch(_this.getJobsRoute() + "/" + id, { method: 'get' });
        };
        this.getJobs = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getJobsRoute() + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getJobsByType = function (type, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getJobsRoute() + "/type/" + type + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.createJob = function (job) {
            return _this.doFetch("" + _this.getJobsRoute(), { method: 'post', body: JSON.stringify(job) });
        };
        this.cancelJob = function (id) {
            return _this.doFetch(_this.getJobsRoute() + "/" + id + "/cancel", { method: 'post' });
        };
        // Admin Routes
        this.getLogs = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = LOGS_PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getBaseRoute() + "/logs" + helpers_1.buildQueryString({ page: page, logs_per_page: perPage }), { method: 'get' });
        };
        this.getAudits = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getBaseRoute() + "/audits" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getConfig = function () {
            return _this.doFetch(_this.getBaseRoute() + "/config", { method: 'get' });
        };
        this.updateConfig = function (config) {
            return _this.doFetch(_this.getBaseRoute() + "/config", { method: 'put', body: JSON.stringify(config) });
        };
        this.reloadConfig = function () {
            return _this.doFetch(_this.getBaseRoute() + "/config/reload", { method: 'post' });
        };
        this.getEnvironmentConfig = function () {
            return _this.doFetch(_this.getBaseRoute() + "/config/environment", { method: 'get' });
        };
        this.testEmail = function (config) {
            return _this.doFetch(_this.getBaseRoute() + "/email/test", { method: 'post', body: JSON.stringify(config) });
        };
        this.testSiteURL = function (siteURL) {
            return _this.doFetch(_this.getBaseRoute() + "/site_url/test", { method: 'post', body: JSON.stringify({ site_url: siteURL }) });
        };
        this.testS3Connection = function (config) {
            return _this.doFetch(_this.getBaseRoute() + "/file/s3_test", { method: 'post', body: JSON.stringify(config) });
        };
        this.invalidateCaches = function () {
            return _this.doFetch(_this.getBaseRoute() + "/caches/invalidate", { method: 'post' });
        };
        this.recycleDatabase = function () {
            return _this.doFetch(_this.getBaseRoute() + "/database/recycle", { method: 'post' });
        };
        this.createComplianceReport = function (job) {
            return _this.doFetch(_this.getBaseRoute() + "/compliance/reports", { method: 'post', body: JSON.stringify(job) });
        };
        this.getComplianceReport = function (reportId) {
            return _this.doFetch(_this.getBaseRoute() + "/compliance/reports/" + reportId, { method: 'get' });
        };
        this.getComplianceReports = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getBaseRoute() + "/compliance/reports" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.uploadBrandImage = function (imageData) {
            var formData = new FormData();
            formData.append('image', imageData);
            var request = {
                method: 'post',
                body: formData,
            };
            if (formData.getBoundary) {
                request.headers = {
                    'Content-Type': "multipart/form-data; boundary=" + formData.getBoundary(),
                };
            }
            return _this.doFetch(_this.getBrandRoute() + "/image", request);
        };
        this.deleteBrandImage = function () {
            return _this.doFetch(_this.getBrandRoute() + "/image", { method: 'delete' });
        };
        this.getClusterStatus = function () {
            return _this.doFetch(_this.getBaseRoute() + "/cluster/status", { method: 'get' });
        };
        this.testLdap = function () {
            return _this.doFetch(_this.getBaseRoute() + "/ldap/test", { method: 'post' });
        };
        this.syncLdap = function () {
            return _this.doFetch(_this.getBaseRoute() + "/ldap/sync", { method: 'post' });
        };
        this.getLdapGroups = function (page, perPage, opts) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (opts === void 0) { opts = {}; }
            var query = tslib_1.__assign({ page: page, per_page: perPage }, opts);
            return _this.doFetch(_this.getBaseRoute() + "/ldap/groups" + helpers_1.buildQueryString(query), { method: 'get' });
        };
        this.linkLdapGroup = function (key) {
            return _this.doFetch(_this.getBaseRoute() + "/ldap/groups/" + encodeURI(key) + "/link", { method: 'post' });
        };
        this.unlinkLdapGroup = function (key) {
            return _this.doFetch(_this.getBaseRoute() + "/ldap/groups/" + encodeURI(key) + "/link", { method: 'delete' });
        };
        this.getSamlCertificateStatus = function () {
            return _this.doFetch(_this.getBaseRoute() + "/saml/certificate/status", { method: 'get' });
        };
        this.uploadPublicSamlCertificate = function (fileData) {
            var formData = new FormData();
            formData.append('certificate', fileData);
            return _this.doFetch(_this.getBaseRoute() + "/saml/certificate/public", {
                method: 'post',
                body: formData,
            });
        };
        this.uploadPrivateSamlCertificate = function (fileData) {
            var formData = new FormData();
            formData.append('certificate', fileData);
            return _this.doFetch(_this.getBaseRoute() + "/saml/certificate/private", {
                method: 'post',
                body: formData,
            });
        };
        this.uploadPublicLdapCertificate = function (fileData) {
            var formData = new FormData();
            formData.append('certificate', fileData);
            return _this.doFetch(_this.getBaseRoute() + "/ldap/certificate/public", {
                method: 'post',
                body: formData,
            });
        };
        this.uploadPrivateLdapCertificate = function (fileData) {
            var formData = new FormData();
            formData.append('certificate', fileData);
            return _this.doFetch(_this.getBaseRoute() + "/ldap/certificate/private", {
                method: 'post',
                body: formData,
            });
        };
        this.uploadIdpSamlCertificate = function (fileData) {
            var formData = new FormData();
            formData.append('certificate', fileData);
            return _this.doFetch(_this.getBaseRoute() + "/saml/certificate/idp", {
                method: 'post',
                body: formData,
            });
        };
        this.deletePublicSamlCertificate = function () {
            return _this.doFetch(_this.getBaseRoute() + "/saml/certificate/public", { method: 'delete' });
        };
        this.deletePrivateSamlCertificate = function () {
            return _this.doFetch(_this.getBaseRoute() + "/saml/certificate/private", { method: 'delete' });
        };
        this.deletePublicLdapCertificate = function () {
            return _this.doFetch(_this.getBaseRoute() + "/ldap/certificate/public", { method: 'delete' });
        };
        this.deletePrivateLdapCertificate = function () {
            return _this.doFetch(_this.getBaseRoute() + "/ldap/certificate/private", { method: 'delete' });
        };
        this.deleteIdpSamlCertificate = function () {
            return _this.doFetch(_this.getBaseRoute() + "/saml/certificate/idp", { method: 'delete' });
        };
        this.testElasticsearch = function (config) {
            return _this.doFetch(_this.getBaseRoute() + "/elasticsearch/test", { method: 'post', body: JSON.stringify(config) });
        };
        this.purgeElasticsearchIndexes = function () {
            return _this.doFetch(_this.getBaseRoute() + "/elasticsearch/purge_indexes", { method: 'post' });
        };
        this.purgeBleveIndexes = function () {
            return _this.doFetch(_this.getBaseRoute() + "/bleve/purge_indexes", { method: 'post' });
        };
        this.uploadLicense = function (fileData) {
            _this.trackEvent('api', 'api_license_upload');
            var formData = new FormData();
            formData.append('license', fileData);
            var request = {
                method: 'post',
                body: formData,
            };
            if (formData.getBoundary) {
                request.headers = {
                    'Content-Type': "multipart/form-data; boundary=" + formData.getBoundary(),
                };
            }
            return _this.doFetch(_this.getBaseRoute() + "/license", request);
        };
        this.removeLicense = function () {
            return _this.doFetch(_this.getBaseRoute() + "/license", { method: 'delete' });
        };
        this.getAnalytics = function (name, teamId) {
            if (name === void 0) { name = 'standard'; }
            if (teamId === void 0) { teamId = ''; }
            return _this.doFetch(_this.getBaseRoute() + "/analytics/old" + helpers_1.buildQueryString({ name: name, team_id: teamId }), { method: 'get' });
        };
        // Role Routes
        this.getRole = function (roleId) {
            return _this.doFetch(_this.getRolesRoute() + "/" + roleId, { method: 'get' });
        };
        this.getRoleByName = function (roleName) {
            return _this.doFetch(_this.getRolesRoute() + "/name/" + roleName, { method: 'get' });
        };
        this.getRolesByNames = function (rolesNames) {
            return _this.doFetch(_this.getRolesRoute() + "/names", { method: 'post', body: JSON.stringify(rolesNames) });
        };
        this.patchRole = function (roleId, rolePatch) {
            return _this.doFetch(_this.getRolesRoute() + "/" + roleId + "/patch", { method: 'put', body: JSON.stringify(rolePatch) });
        };
        // Scheme Routes
        this.getSchemes = function (scope, page, perPage) {
            if (scope === void 0) { scope = ''; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getSchemesRoute() + helpers_1.buildQueryString({ scope: scope, page: page, per_page: perPage }), { method: 'get' });
        };
        this.createScheme = function (scheme) {
            _this.trackEvent('api', 'api_schemes_create');
            return _this.doFetch("" + _this.getSchemesRoute(), { method: 'post', body: JSON.stringify(scheme) });
        };
        this.getScheme = function (schemeId) {
            return _this.doFetch(_this.getSchemesRoute() + "/" + schemeId, { method: 'get' });
        };
        this.deleteScheme = function (schemeId) {
            _this.trackEvent('api', 'api_schemes_delete');
            return _this.doFetch(_this.getSchemesRoute() + "/" + schemeId, { method: 'delete' });
        };
        this.patchScheme = function (schemeId, schemePatch) {
            _this.trackEvent('api', 'api_schemes_patch', { scheme_id: schemeId });
            return _this.doFetch(_this.getSchemesRoute() + "/" + schemeId + "/patch", { method: 'put', body: JSON.stringify(schemePatch) });
        };
        this.getSchemeTeams = function (schemeId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getSchemesRoute() + "/" + schemeId + "/teams" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getSchemeChannels = function (schemeId, page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch(_this.getSchemesRoute() + "/" + schemeId + "/channels" + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        // Plugin Routes - EXPERIMENTAL - SUBJECT TO CHANGE
        this.uploadPlugin = function (fileData, force) {
            if (force === void 0) { force = false; }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var formData, request;
                return tslib_1.__generator(this, function (_a) {
                    this.trackEvent('api', 'api_plugin_upload');
                    formData = new FormData();
                    if (force) {
                        formData.append('force', 'true');
                    }
                    formData.append('plugin', fileData);
                    request = {
                        method: 'post',
                        body: formData,
                    };
                    if (formData.getBoundary) {
                        request.headers = {
                            'Content-Type': "multipart/form-data; boundary=" + formData.getBoundary(),
                        };
                    }
                    return [2 /*return*/, this.doFetch(this.getPluginsRoute(), request)];
                });
            });
        };
        this.installPluginFromUrl = function (pluginDownloadUrl, force) {
            if (force === void 0) { force = false; }
            _this.trackEvent('api', 'api_install_plugin');
            var queryParams = { plugin_download_url: pluginDownloadUrl, force: force };
            return _this.doFetch(_this.getPluginsRoute() + "/install_from_url" + helpers_1.buildQueryString(queryParams), { method: 'post' });
        };
        this.getPlugins = function () {
            return _this.doFetch(_this.getPluginsRoute(), { method: 'get' });
        };
        this.getMarketplacePlugins = function (filter, localOnly) {
            if (localOnly === void 0) { localOnly = false; }
            return _this.doFetch("" + _this.getPluginsMarketplaceRoute() + helpers_1.buildQueryString({ filter: filter || '', local_only: localOnly }), { method: 'get' });
        };
        this.installMarketplacePlugin = function (id, version) {
            _this.trackEvent('api', 'api_install_marketplace_plugin');
            return _this.doFetch("" + _this.getPluginsMarketplaceRoute(), { method: 'post', body: JSON.stringify({ id: id, version: version }) });
        };
        // This function belongs to the Apps Framework feature.
        // Apps Framework feature is experimental, and this function is susceptible
        // to breaking changes without pushing the major version of this package.
        this.getMarketplaceApps = function (filter) {
            return _this.doFetch(_this.getAppsProxyRoute() + "/api/v1/marketplace" + helpers_1.buildQueryString({ filter: filter || '' }), { method: 'get' });
        };
        this.getPluginStatuses = function () {
            return _this.doFetch(_this.getPluginsRoute() + "/statuses", { method: 'get' });
        };
        this.removePlugin = function (pluginId) {
            return _this.doFetch(_this.getPluginRoute(pluginId), { method: 'delete' });
        };
        this.getWebappPlugins = function () {
            return _this.doFetch(_this.getPluginsRoute() + "/webapp", { method: 'get' });
        };
        this.enablePlugin = function (pluginId) {
            return _this.doFetch(_this.getPluginRoute(pluginId) + "/enable", { method: 'post' });
        };
        this.disablePlugin = function (pluginId) {
            return _this.doFetch(_this.getPluginRoute(pluginId) + "/disable", { method: 'post' });
        };
        // Groups
        this.linkGroupSyncable = function (groupID, syncableID, syncableType, patch) {
            return _this.doFetch(_this.getGroupRoute(groupID) + "/" + syncableType + "s/" + syncableID + "/link", { method: 'post', body: JSON.stringify(patch) });
        };
        this.unlinkGroupSyncable = function (groupID, syncableID, syncableType) {
            return _this.doFetch(_this.getGroupRoute(groupID) + "/" + syncableType + "s/" + syncableID + "/link", { method: 'delete' });
        };
        this.getGroupSyncables = function (groupID, syncableType) {
            return _this.doFetch(_this.getGroupRoute(groupID) + "/" + syncableType + "s", { method: 'get' });
        };
        this.getGroup = function (groupID) {
            return _this.doFetch(_this.getGroupRoute(groupID), { method: 'get' });
        };
        this.getGroupStats = function (groupID) {
            return _this.doFetch(_this.getGroupRoute(groupID) + "/stats", { method: 'get' });
        };
        this.getGroups = function (filterAllowReference, page, perPage) {
            if (filterAllowReference === void 0) { filterAllowReference = false; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getGroupsRoute() + helpers_1.buildQueryString({ filter_allow_reference: filterAllowReference, page: page, per_page: perPage }), { method: 'get' });
        };
        this.getGroupsByUserId = function (userID) {
            return _this.doFetch(_this.getUsersRoute() + "/" + userID + "/groups", { method: 'get' });
        };
        this.getGroupsNotAssociatedToTeam = function (teamID, q, page, perPage) {
            if (q === void 0) { q = ''; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            _this.trackEvent('api', 'api_groups_get_not_associated_to_team', { team_id: teamID });
            return _this.doFetch("" + _this.getGroupsRoute() + helpers_1.buildQueryString({ not_associated_to_team: teamID, page: page, per_page: perPage, q: q, include_member_count: true }), { method: 'get' });
        };
        this.getGroupsNotAssociatedToChannel = function (channelID, q, page, perPage, filterParentTeamPermitted) {
            if (q === void 0) { q = ''; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (filterParentTeamPermitted === void 0) { filterParentTeamPermitted = false; }
            _this.trackEvent('api', 'api_groups_get_not_associated_to_channel', { channel_id: channelID });
            var query = {
                not_associated_to_channel: channelID,
                page: page,
                per_page: perPage,
                q: q,
                include_member_count: true,
                filter_parent_team_permitted: filterParentTeamPermitted,
            };
            return _this.doFetch("" + _this.getGroupsRoute() + helpers_1.buildQueryString(query), { method: 'get' });
        };
        // This function belongs to the Apps Framework feature.
        // Apps Framework feature is experimental, and this function is susceptible
        // to breaking changes without pushing the major version of this package.
        this.executeAppCall = function (call, type) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var callCopy;
            return tslib_1.__generator(this, function (_a) {
                callCopy = tslib_1.__assign(tslib_1.__assign({}, call), { path: call.path + "/" + type, context: tslib_1.__assign(tslib_1.__assign({}, call.context), { user_agent: 'webapp' }) });
                return [2 /*return*/, this.doFetch(this.getAppsProxyRoute() + "/api/v1/call", { method: 'post', body: JSON.stringify(callCopy) })];
            });
        }); };
        // This function belongs to the Apps Framework feature.
        // Apps Framework feature is experimental, and this function is susceptible
        // to breaking changes without pushing the major version of this package.
        this.getAppsBindings = function (userID, channelID) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doFetch(this.getAppsProxyRoute() + ("/api/v1/bindings?user_id=" + userID + "&channel_id=" + channelID + "&user_agent_type=webapp"), { method: 'get' })];
            });
        }); };
        this.getGroupsAssociatedToTeam = function (teamID, q, page, perPage, filterAllowReference) {
            if (q === void 0) { q = ''; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (filterAllowReference === void 0) { filterAllowReference = false; }
            _this.trackEvent('api', 'api_groups_get_associated_to_team', { team_id: teamID });
            return _this.doFetch(_this.getBaseRoute() + "/teams/" + teamID + "/groups" + helpers_1.buildQueryString({ page: page, per_page: perPage, q: q, include_member_count: true, filter_allow_reference: filterAllowReference }), { method: 'get' });
        };
        this.getGroupsAssociatedToChannel = function (channelID, q, page, perPage, filterAllowReference) {
            if (q === void 0) { q = ''; }
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            if (filterAllowReference === void 0) { filterAllowReference = false; }
            _this.trackEvent('api', 'api_groups_get_associated_to_channel', { channel_id: channelID });
            return _this.doFetch(_this.getBaseRoute() + "/channels/" + channelID + "/groups" + helpers_1.buildQueryString({ page: page, per_page: perPage, q: q, include_member_count: true, filter_allow_reference: filterAllowReference }), { method: 'get' });
        };
        this.getAllGroupsAssociatedToTeam = function (teamID, filterAllowReference, includeMemberCount) {
            if (filterAllowReference === void 0) { filterAllowReference = false; }
            if (includeMemberCount === void 0) { includeMemberCount = false; }
            return _this.doFetch(_this.getBaseRoute() + "/teams/" + teamID + "/groups" + helpers_1.buildQueryString({ paginate: false, filter_allow_reference: filterAllowReference, include_member_count: includeMemberCount }), { method: 'get' });
        };
        this.getAllGroupsAssociatedToChannelsInTeam = function (teamID, filterAllowReference) {
            if (filterAllowReference === void 0) { filterAllowReference = false; }
            return _this.doFetch(_this.getBaseRoute() + "/teams/" + teamID + "/groups_by_channels" + helpers_1.buildQueryString({ paginate: false, filter_allow_reference: filterAllowReference }), { method: 'get' });
        };
        this.getAllGroupsAssociatedToChannel = function (channelID, filterAllowReference, includeMemberCount) {
            if (filterAllowReference === void 0) { filterAllowReference = false; }
            if (includeMemberCount === void 0) { includeMemberCount = false; }
            return _this.doFetch(_this.getBaseRoute() + "/channels/" + channelID + "/groups" + helpers_1.buildQueryString({ paginate: false, filter_allow_reference: filterAllowReference, include_member_count: includeMemberCount }), { method: 'get' });
        };
        this.patchGroupSyncable = function (groupID, syncableID, syncableType, patch) {
            return _this.doFetch(_this.getGroupRoute(groupID) + "/" + syncableType + "s/" + syncableID + "/patch", { method: 'put', body: JSON.stringify(patch) });
        };
        this.patchGroup = function (groupID, patch) {
            return _this.doFetch(_this.getGroupRoute(groupID) + "/patch", { method: 'put', body: JSON.stringify(patch) });
        };
        // Redirect Location
        this.getRedirectLocation = function (urlParam) {
            if (!urlParam.length) {
                return Promise.resolve();
            }
            var url = "" + _this.getRedirectLocationRoute() + helpers_1.buildQueryString({ url: urlParam });
            return _this.doFetch(url, { method: 'get' });
        };
        // Bot Routes
        this.createBot = function (bot) {
            return _this.doFetch("" + _this.getBotsRoute(), { method: 'post', body: JSON.stringify(bot) });
        };
        this.patchBot = function (botUserId, botPatch) {
            return _this.doFetch("" + _this.getBotRoute(botUserId), { method: 'put', body: JSON.stringify(botPatch) });
        };
        this.getBot = function (botUserId) {
            return _this.doFetch("" + _this.getBotRoute(botUserId), { method: 'get' });
        };
        this.getBots = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getBotsRoute() + helpers_1.buildQueryString({ page: page, per_page: perPage }), { method: 'get' });
        };
        this.getBotsIncludeDeleted = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getBotsRoute() + helpers_1.buildQueryString({ include_deleted: true, page: page, per_page: perPage }), { method: 'get' });
        };
        this.getBotsOrphaned = function (page, perPage) {
            if (page === void 0) { page = 0; }
            if (perPage === void 0) { perPage = PER_PAGE_DEFAULT; }
            return _this.doFetch("" + _this.getBotsRoute() + helpers_1.buildQueryString({ only_orphaned: true, page: page, per_page: perPage }), { method: 'get' });
        };
        this.disableBot = function (botUserId) {
            return _this.doFetch(_this.getBotRoute(botUserId) + "/disable", { method: 'post' });
        };
        this.enableBot = function (botUserId) {
            return _this.doFetch(_this.getBotRoute(botUserId) + "/enable", { method: 'post' });
        };
        this.assignBot = function (botUserId, newOwnerId) {
            return _this.doFetch(_this.getBotRoute(botUserId) + "/assign/" + newOwnerId, { method: 'post' });
        };
        // Cloud routes
        this.getCloudProducts = function () {
            return _this.doFetch(_this.getCloudRoute() + "/products", { method: 'get' });
        };
        this.createPaymentMethod = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doFetch(this.getCloudRoute() + "/payment", { method: 'post' })];
            });
        }); };
        this.getCloudCustomer = function () {
            return _this.doFetch(_this.getCloudRoute() + "/customer", { method: 'get' });
        };
        this.updateCloudCustomer = function (customerPatch) {
            return _this.doFetch(_this.getCloudRoute() + "/customer", { method: 'put', body: JSON.stringify(customerPatch) });
        };
        this.updateCloudCustomerAddress = function (address) {
            return _this.doFetch(_this.getCloudRoute() + "/customer/address", { method: 'put', body: JSON.stringify(address) });
        };
        this.confirmPaymentMethod = function (stripeSetupIntentID) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.doFetch(this.getCloudRoute() + "/payment/confirm", { method: 'post', body: JSON.stringify({ stripe_setup_intent_id: stripeSetupIntentID }) })];
            });
        }); };
        this.getSubscription = function () {
            return _this.doFetch(_this.getCloudRoute() + "/subscription", { method: 'get' });
        };
        this.getSubscriptionStats = function () {
            return _this.doFetch(_this.getCloudRoute() + "/subscription/stats", { method: 'get' });
        };
        this.getRenewalLink = function () {
            return _this.doFetch(_this.getBaseRoute() + "/license/renewal", { method: 'get' });
        };
        this.getInvoices = function () {
            return _this.doFetch(_this.getCloudRoute() + "/subscription/invoices", { method: 'get' });
        };
        this.getInvoicePdfUrl = function (invoiceId) {
            return _this.getCloudRoute() + "/subscription/invoices/" + invoiceId + "/pdf";
        };
        this.teamMembersMinusGroupMembers = function (teamID, groupIDs, page, perPage) {
            var query = "group_ids=" + groupIDs.join(',') + "&page=" + page + "&per_page=" + perPage;
            return _this.doFetch(_this.getTeamRoute(teamID) + "/members_minus_group_members?" + query, { method: 'get' });
        };
        this.channelMembersMinusGroupMembers = function (channelID, groupIDs, page, perPage) {
            var query = "group_ids=" + groupIDs.join(',') + "&page=" + page + "&per_page=" + perPage;
            return _this.doFetch(_this.getChannelRoute(channelID) + "/members_minus_group_members?" + query, { method: 'get' });
        };
        this.getSamlMetadataFromIdp = function (samlMetadataURL) {
            return _this.doFetch(_this.getBaseRoute() + "/saml/metadatafromidp", { method: 'post', body: JSON.stringify({ saml_metadata_url: samlMetadataURL }) });
        };
        this.setSamlIdpCertificateFromMetadata = function (certData) {
            var request = {
                method: 'post',
                body: certData,
            };
            request.headers = {
                'Content-Type': 'application/x-pem-file',
            };
            return _this.doFetch(_this.getBaseRoute() + "/saml/certificate/idp", request);
        };
        this.getInProductNotices = function (teamId, client, clientVersion) {
            return _this.doFetch(_this.getNoticesRoute() + "/" + teamId + "?client=" + client + "&clientVersion=" + clientVersion, { method: 'get' });
        };
        this.updateNoticesAsViewed = function (noticeIds) {
            // Only one notice is marked as viewed at a time so using 0 index
            _this.trackEvent('ui', "notice_seen_" + noticeIds[0]);
            return _this.doFetch(_this.getNoticesRoute() + "/view", { method: 'put', body: JSON.stringify(noticeIds) });
        };
        this.sendAdminUpgradeRequestEmail = function () {
            return _this.doFetch(_this.getCloudRoute() + "/subscription/limitreached/invite", { method: 'post' });
        };
        this.sendAdminUpgradeRequestEmailOnJoin = function () {
            return _this.doFetch(_this.getCloudRoute() + "/subscription/limitreached/join", { method: 'post' });
        };
        // Client Helpers
        this.doFetch = function (url, options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.doFetchWithResponse(url, options)];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                }
            });
        }); };
        this.doFetchWithResponse = function (url, options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, headers, data, err_1, serverVersion, clusterId, msg;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch_etag_1.default(url, this.getOptions(options))];
                    case 1:
                        response = _a.sent();
                        headers = parseAndMergeNestedHeaders(response.headers);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        throw new ClientError(this.getUrl(), {
                            message: 'Received invalid response from the server.',
                            intl: {
                                id: 'mobile.request.invalid_response',
                                defaultMessage: 'Received invalid response from the server.',
                            },
                            url: url,
                        });
                    case 5:
                        if (headers.has(exports.HEADER_X_VERSION_ID) && !headers.get('Cache-Control')) {
                            serverVersion = headers.get(exports.HEADER_X_VERSION_ID);
                            if (serverVersion && this.serverVersion !== serverVersion) {
                                this.serverVersion = serverVersion;
                            }
                        }
                        if (headers.has(HEADER_X_CLUSTER_ID)) {
                            clusterId = headers.get(HEADER_X_CLUSTER_ID);
                            if (clusterId && this.clusterId !== clusterId) {
                                this.clusterId = clusterId;
                            }
                        }
                        if (response.ok) {
                            return [2 /*return*/, {
                                    response: response,
                                    headers: headers,
                                    data: data,
                                }];
                        }
                        msg = data.message || '';
                        if (this.logToConsole) {
                            console.error(msg); // eslint-disable-line no-console
                        }
                        throw new ClientError(this.getUrl(), {
                            message: msg,
                            server_error_id: data.id,
                            status_code: data.status_code,
                            url: url,
                        });
                }
            });
        }); };
    }
    Client4.prototype.getUrl = function () {
        return this.url;
    };
    Client4.prototype.getAbsoluteUrl = function (baseUrl) {
        if (typeof baseUrl !== 'string' || !baseUrl.startsWith('/')) {
            return baseUrl;
        }
        return this.getUrl() + baseUrl;
    };
    Client4.prototype.setUrl = function (url) {
        this.url = url;
    };
    Client4.prototype.setUserAgent = function (userAgent) {
        this.userAgent = userAgent;
    };
    Client4.prototype.getToken = function () {
        return this.token;
    };
    Client4.prototype.setToken = function (token) {
        this.token = token;
    };
    Client4.prototype.setCSRF = function (csrfToken) {
        this.csrf = csrfToken;
    };
    Client4.prototype.setAcceptLanguage = function (locale) {
        this.defaultHeaders['Accept-Language'] = locale;
    };
    Client4.prototype.setEnableLogging = function (enable) {
        this.enableLogging = enable;
    };
    Client4.prototype.setIncludeCookies = function (include) {
        this.includeCookies = include;
    };
    Client4.prototype.setUserId = function (userId) {
        this.userId = userId;
    };
    Client4.prototype.setUserRoles = function (roles) {
        this.userRoles = roles;
    };
    Client4.prototype.setDiagnosticId = function (diagnosticId) {
        this.diagnosticId = diagnosticId;
    };
    Client4.prototype.setTelemetryHandler = function (telemetryHandler) {
        this.telemetryHandler = telemetryHandler;
    };
    Client4.prototype.getServerVersion = function () {
        return this.serverVersion;
    };
    Client4.prototype.getUrlVersion = function () {
        return this.urlVersion;
    };
    Client4.prototype.getBaseRoute = function () {
        return "" + this.url + this.urlVersion;
    };
    // This function belongs to the Apps Framework feature.
    // Apps Framework feature is experimental, and this function is susceptible
    // to breaking changes without pushing the major version of this package.
    Client4.prototype.getAppsProxyRoute = function () {
        return this.url + "/plugins/com.mattermost.apps";
    };
    Client4.prototype.getUsersRoute = function () {
        return this.getBaseRoute() + "/users";
    };
    Client4.prototype.getUserRoute = function (userId) {
        return this.getUsersRoute() + "/" + userId;
    };
    Client4.prototype.getTeamsRoute = function () {
        return this.getBaseRoute() + "/teams";
    };
    Client4.prototype.getTeamRoute = function (teamId) {
        return this.getTeamsRoute() + "/" + teamId;
    };
    Client4.prototype.getTeamSchemeRoute = function (teamId) {
        return this.getTeamRoute(teamId) + "/scheme";
    };
    Client4.prototype.getTeamNameRoute = function (teamName) {
        return this.getTeamsRoute() + "/name/" + teamName;
    };
    Client4.prototype.getTeamMembersRoute = function (teamId) {
        return this.getTeamRoute(teamId) + "/members";
    };
    Client4.prototype.getTeamMemberRoute = function (teamId, userId) {
        return this.getTeamMembersRoute(teamId) + "/" + userId;
    };
    Client4.prototype.getChannelsRoute = function () {
        return this.getBaseRoute() + "/channels";
    };
    Client4.prototype.getChannelRoute = function (channelId) {
        return this.getChannelsRoute() + "/" + channelId;
    };
    Client4.prototype.getChannelMembersRoute = function (channelId) {
        return this.getChannelRoute(channelId) + "/members";
    };
    Client4.prototype.getChannelMemberRoute = function (channelId, userId) {
        return this.getChannelMembersRoute(channelId) + "/" + userId;
    };
    Client4.prototype.getChannelSchemeRoute = function (channelId) {
        return this.getChannelRoute(channelId) + "/scheme";
    };
    Client4.prototype.getChannelCategoriesRoute = function (userId, teamId) {
        return this.getBaseRoute() + "/users/" + userId + "/teams/" + teamId + "/channels/categories";
    };
    Client4.prototype.getPostsRoute = function () {
        return this.getBaseRoute() + "/posts";
    };
    Client4.prototype.getPostRoute = function (postId) {
        return this.getPostsRoute() + "/" + postId;
    };
    Client4.prototype.getReactionsRoute = function () {
        return this.getBaseRoute() + "/reactions";
    };
    Client4.prototype.getCommandsRoute = function () {
        return this.getBaseRoute() + "/commands";
    };
    Client4.prototype.getFilesRoute = function () {
        return this.getBaseRoute() + "/files";
    };
    Client4.prototype.getFileRoute = function (fileId) {
        return this.getFilesRoute() + "/" + fileId;
    };
    Client4.prototype.getPreferencesRoute = function (userId) {
        return this.getUserRoute(userId) + "/preferences";
    };
    Client4.prototype.getIncomingHooksRoute = function () {
        return this.getBaseRoute() + "/hooks/incoming";
    };
    Client4.prototype.getIncomingHookRoute = function (hookId) {
        return this.getBaseRoute() + "/hooks/incoming/" + hookId;
    };
    Client4.prototype.getOutgoingHooksRoute = function () {
        return this.getBaseRoute() + "/hooks/outgoing";
    };
    Client4.prototype.getOutgoingHookRoute = function (hookId) {
        return this.getBaseRoute() + "/hooks/outgoing/" + hookId;
    };
    Client4.prototype.getOAuthRoute = function () {
        return this.url + "/oauth";
    };
    Client4.prototype.getOAuthAppsRoute = function () {
        return this.getBaseRoute() + "/oauth/apps";
    };
    Client4.prototype.getOAuthAppRoute = function (appId) {
        return this.getOAuthAppsRoute() + "/" + appId;
    };
    Client4.prototype.getEmojisRoute = function () {
        return this.getBaseRoute() + "/emoji";
    };
    Client4.prototype.getEmojiRoute = function (emojiId) {
        return this.getEmojisRoute() + "/" + emojiId;
    };
    Client4.prototype.getBrandRoute = function () {
        return this.getBaseRoute() + "/brand";
    };
    Client4.prototype.getBrandImageUrl = function (timestamp) {
        return this.getBrandRoute() + "/image?t=" + timestamp;
    };
    Client4.prototype.getDataRetentionRoute = function () {
        return this.getBaseRoute() + "/data_retention";
    };
    Client4.prototype.getJobsRoute = function () {
        return this.getBaseRoute() + "/jobs";
    };
    Client4.prototype.getPluginsRoute = function () {
        return this.getBaseRoute() + "/plugins";
    };
    Client4.prototype.getPluginRoute = function (pluginId) {
        return this.getPluginsRoute() + "/" + pluginId;
    };
    Client4.prototype.getPluginsMarketplaceRoute = function () {
        return this.getPluginsRoute() + "/marketplace";
    };
    Client4.prototype.getRolesRoute = function () {
        return this.getBaseRoute() + "/roles";
    };
    Client4.prototype.getTimezonesRoute = function () {
        return this.getBaseRoute() + "/system/timezones";
    };
    Client4.prototype.getSchemesRoute = function () {
        return this.getBaseRoute() + "/schemes";
    };
    Client4.prototype.getRedirectLocationRoute = function () {
        return this.getBaseRoute() + "/redirect_location";
    };
    Client4.prototype.getBotsRoute = function () {
        return this.getBaseRoute() + "/bots";
    };
    Client4.prototype.getBotRoute = function (botUserId) {
        return this.getBotsRoute() + "/" + botUserId;
    };
    Client4.prototype.getGroupsRoute = function () {
        return this.getBaseRoute() + "/groups";
    };
    Client4.prototype.getGroupRoute = function (groupID) {
        return this.getGroupsRoute() + "/" + groupID;
    };
    Client4.prototype.getNoticesRoute = function () {
        return this.getBaseRoute() + "/system/notices";
    };
    Client4.prototype.getCloudRoute = function () {
        return this.getBaseRoute() + "/cloud";
    };
    Client4.prototype.getUserThreadsRoute = function (userID, teamID) {
        return this.getUserRoute(userID) + "/teams/" + teamID + "/threads";
    };
    Client4.prototype.getUserThreadRoute = function (userId, teamId, threadId) {
        return this.getUserThreadsRoute(userId, teamId) + "/" + threadId;
    };
    Client4.prototype.getCSRFFromCookie = function () {
        if (typeof document !== 'undefined' && typeof document.cookie !== 'undefined') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.startsWith('MMCSRF=')) {
                    return cookie.replace('MMCSRF=', '');
                }
            }
        }
        return '';
    };
    Client4.prototype.getOptions = function (options) {
        var _a;
        var newOptions = tslib_1.__assign({}, options);
        var headers = tslib_1.__assign((_a = {}, _a[HEADER_REQUESTED_WITH] = 'XMLHttpRequest', _a), this.defaultHeaders);
        if (this.token) {
            headers[HEADER_AUTH] = HEADER_BEARER + " " + this.token;
        }
        var csrfToken = this.csrf || this.getCSRFFromCookie();
        if (options.method && options.method.toLowerCase() !== 'get' && csrfToken) {
            headers[HEADER_X_CSRF_TOKEN] = csrfToken;
        }
        if (this.includeCookies) {
            newOptions.credentials = 'include';
        }
        if (this.userAgent) {
            headers[HEADER_USER_AGENT] = this.userAgent;
        }
        if (newOptions.headers) {
            Object.assign(headers, newOptions.headers);
        }
        return tslib_1.__assign(tslib_1.__assign({}, newOptions), { headers: headers });
    };
    // Files Routes
    Client4.prototype.getFileUrl = function (fileId, timestamp) {
        var url = "" + this.getFileRoute(fileId);
        if (timestamp) {
            url += "?" + timestamp;
        }
        return url;
    };
    Client4.prototype.getFileThumbnailUrl = function (fileId, timestamp) {
        var url = this.getFileRoute(fileId) + "/thumbnail";
        if (timestamp) {
            url += "?" + timestamp;
        }
        return url;
    };
    Client4.prototype.getFilePreviewUrl = function (fileId, timestamp) {
        var url = this.getFileRoute(fileId) + "/preview";
        if (timestamp) {
            url += "?" + timestamp;
        }
        return url;
    };
    Client4.prototype.trackEvent = function (category, event, props) {
        if (this.telemetryHandler) {
            var userRoles = this.userRoles && user_utils_1.isSystemAdmin(this.userRoles) ? 'system_admin, system_user' : 'system_user';
            this.telemetryHandler.trackEvent(this.userId, userRoles, category, event, props);
        }
    };
    Client4.prototype.pageVisited = function (category, name) {
        if (this.telemetryHandler) {
            var userRoles = this.userRoles && user_utils_1.isSystemAdmin(this.userRoles) ? 'system_admin, system_user' : 'system_user';
            this.telemetryHandler.pageVisited(this.userId, userRoles, category, name);
        }
    };
    return Client4;
}());
exports.default = Client4;
function parseAndMergeNestedHeaders(originalHeaders) {
    var headers = new Map();
    var nestedHeaders = new Map();
    originalHeaders.forEach(function (val, key) {
        var capitalizedKey = key.replace(/\b[a-z]/g, function (l) { return l.toUpperCase(); });
        var realVal = val;
        if (val && val.match(/\n\S+:\s\S+/)) {
            var nestedHeaderStrings = val.split('\n');
            realVal = nestedHeaderStrings.shift();
            var moreNestedHeaders = new Map(nestedHeaderStrings.map(function (h) { return h.split(/:\s/); }));
            nestedHeaders = new Map(tslib_1.__spread(nestedHeaders, moreNestedHeaders));
        }
        headers.set(capitalizedKey, realVal);
    });
    return new Map(tslib_1.__spread(headers, nestedHeaders));
}
var ClientError = /** @class */ (function (_super) {
    tslib_1.__extends(ClientError, _super);
    function ClientError(baseUrl, data) {
        var _this = _super.call(this, data.message + ': ' + sentry_1.cleanUrlForLogging(baseUrl, data.url || '')) || this;
        _this.message = data.message;
        _this.url = data.url;
        _this.intl = data.intl;
        _this.server_error_id = data.server_error_id;
        _this.status_code = data.status_code;
        // Ensure message is treated as a property of this class when object spreading. Without this,
        // copying the object by using `{...error}` would not include the message.
        Object.defineProperty(_this, 'message', { enumerable: true });
        return _this;
    }
    return ClientError;
}(Error));
exports.ClientError = ClientError;
//# sourceMappingURL=client4.js.map