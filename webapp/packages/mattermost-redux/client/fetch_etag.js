"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var data = {};
var etags = {};
exports.default = (function (url, options) {
    if (options === void 0) { options = { headers: {} }; }
    url = url || options.url || ''; // eslint-disable-line no-param-reassign
    if (options.method === 'GET' || !options.method) {
        var etag = etags[url];
        var cachedResponse_1 = data["" + url + etag]; // ensure etag is for url
        if (etag) {
            options.headers['If-None-Match'] = etag;
        }
        return fetch(url, options).
            then(function (response) {
            if (response.status === 304) {
                return cachedResponse_1.clone();
            }
            if (response.status === 200) {
                var responseEtag = response.headers.get('Etag');
                if (responseEtag) {
                    data["" + url + responseEtag] = response.clone();
                    etags[url] = responseEtag;
                }
            }
            return response;
        });
    }
    // all other requests go straight to fetch
    return Reflect.apply(fetch, undefined, [url, options]);
});
//# sourceMappingURL=fetch_etag.js.map