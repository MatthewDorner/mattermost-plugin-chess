"use strict";
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var MAX_WEBSOCKET_FAILS = 7;
var MIN_WEBSOCKET_RETRY_TIME = 3000; // 3 sec
var MAX_WEBSOCKET_RETRY_TIME = 300000; // 5 mins
var Socket;
var WebSocketClient = /** @class */ (function () {
    function WebSocketClient() {
        this.connectionUrl = null;
        this.token = null;
        this.sequence = 1;
        this.connectFailCount = 0;
        this.stop = false;
        this.platform = '';
    }
    WebSocketClient.prototype.initialize = function (token, opts) {
        var _this = this;
        var defaults = {
            forceConnection: true,
            connectionUrl: this.connectionUrl,
            webSocketConnector: WebSocket,
        };
        var _a = Object.assign({}, defaults, opts), connectionUrl = _a.connectionUrl, forceConnection = _a.forceConnection, webSocketConnector = _a.webSocketConnector, platform = _a.platform, additionalOptions = tslib_1.__rest(_a, ["connectionUrl", "forceConnection", "webSocketConnector", "platform"]);
        if (platform) {
            this.platform = platform;
        }
        if (forceConnection) {
            this.stop = false;
        }
        return new Promise(function (resolve, reject) {
            if (_this.conn) {
                resolve();
                return;
            }
            if (connectionUrl == null) {
                console.log('websocket must have connection url'); //eslint-disable-line no-console
                reject(new Error('websocket must have connection url'));
                return;
            }
            if (_this.connectFailCount === 0) {
                console.log('websocket connecting to ' + connectionUrl); //eslint-disable-line no-console
            }
            Socket = webSocketConnector;
            if (_this.connectingCallback) {
                _this.connectingCallback();
            }
            var regex = /^(?:https?|wss?):(?:\/\/)?[^/]*/;
            var captured = (regex).exec(connectionUrl);
            var origin;
            if (captured) {
                origin = captured[0];
                if (platform === 'android') {
                    // this is done cause for android having the port 80 or 443 will fail the connection
                    // the websocket will append them
                    var split = origin.split(':');
                    var port = split[2];
                    if (port === '80' || port === '443') {
                        origin = split[0] + ":" + split[1];
                    }
                }
            }
            else {
                // If we're unable to set the origin header, the websocket won't connect, but the URL is likely malformed anyway
                var errorMessage = 'websocket failed to parse origin from ' + connectionUrl;
                console.warn(errorMessage); // eslint-disable-line no-console
                reject(new Error(errorMessage));
                return;
            }
            _this.conn = new Socket(connectionUrl, [], tslib_1.__assign({ headers: { origin: origin } }, (additionalOptions || {})));
            _this.connectionUrl = connectionUrl;
            _this.token = token;
            _this.conn.onopen = function () {
                if (token) {
                    // we check for the platform as a workaround until we fix on the server that further authentications
                    // are ignored
                    _this.sendMessage('authentication_challenge', { token: token });
                }
                if (_this.connectFailCount > 0) {
                    console.log('websocket re-established connection'); //eslint-disable-line no-console
                    if (_this.reconnectCallback) {
                        _this.reconnectCallback();
                    }
                }
                else if (_this.firstConnectCallback) {
                    _this.firstConnectCallback();
                }
                _this.connectFailCount = 0;
                resolve();
            };
            _this.conn.onclose = function () {
                _this.conn = undefined;
                _this.sequence = 1;
                if (_this.connectFailCount === 0) {
                    console.log('websocket closed'); //eslint-disable-line no-console
                }
                _this.connectFailCount++;
                if (_this.closeCallback) {
                    _this.closeCallback(_this.connectFailCount);
                }
                var retryTime = MIN_WEBSOCKET_RETRY_TIME;
                // If we've failed a bunch of connections then start backing off
                if (_this.connectFailCount > MAX_WEBSOCKET_FAILS) {
                    retryTime = MIN_WEBSOCKET_RETRY_TIME * _this.connectFailCount;
                    if (retryTime > MAX_WEBSOCKET_RETRY_TIME) {
                        retryTime = MAX_WEBSOCKET_RETRY_TIME;
                    }
                }
                if (_this.connectionTimeout) {
                    clearTimeout(_this.connectionTimeout);
                }
                _this.connectionTimeout = setTimeout(function () {
                    if (_this.stop) {
                        clearTimeout(_this.connectionTimeout);
                        return;
                    }
                    _this.initialize(token, opts);
                }, retryTime);
            };
            _this.conn.onerror = function (evt) {
                if (_this.connectFailCount <= 1) {
                    console.log('websocket error'); //eslint-disable-line no-console
                    console.log(evt); //eslint-disable-line no-console
                }
                if (_this.errorCallback) {
                    _this.errorCallback(evt);
                }
            };
            _this.conn.onmessage = function (evt) {
                var msg = JSON.parse(evt.data);
                if (msg.seq_reply) {
                    if (msg.error) {
                        console.warn(msg); //eslint-disable-line no-console
                    }
                }
                else if (_this.eventCallback) {
                    _this.eventCallback(msg);
                }
            };
        });
    };
    WebSocketClient.prototype.setConnectingCallback = function (callback) {
        this.connectingCallback = callback;
    };
    WebSocketClient.prototype.setEventCallback = function (callback) {
        this.eventCallback = callback;
    };
    WebSocketClient.prototype.setFirstConnectCallback = function (callback) {
        this.firstConnectCallback = callback;
    };
    WebSocketClient.prototype.setReconnectCallback = function (callback) {
        this.reconnectCallback = callback;
    };
    WebSocketClient.prototype.setErrorCallback = function (callback) {
        this.errorCallback = callback;
    };
    WebSocketClient.prototype.setCloseCallback = function (callback) {
        this.closeCallback = callback;
    };
    WebSocketClient.prototype.close = function (stop) {
        if (stop === void 0) { stop = false; }
        this.stop = stop;
        this.connectFailCount = 0;
        this.sequence = 1;
        if (this.conn && this.conn.readyState === Socket.OPEN) {
            this.conn.onclose = function () { }; //eslint-disable-line @typescript-eslint/no-empty-function
            this.conn.close();
            this.conn = undefined;
            console.log('websocket closed'); //eslint-disable-line no-console
        }
    };
    WebSocketClient.prototype.sendMessage = function (action, data) {
        var msg = {
            action: action,
            seq: this.sequence++,
            data: data,
        };
        if (this.conn && this.conn.readyState === Socket.OPEN) {
            this.conn.send(JSON.stringify(msg));
        }
        else if (!this.conn || this.conn.readyState === Socket.CLOSED) {
            this.conn = undefined;
            this.initialize(this.token, { platform: this.platform });
        }
    };
    WebSocketClient.prototype.userTyping = function (channelId, parentId) {
        this.sendMessage('user_typing', {
            channel_id: channelId,
            parent_id: parentId,
        });
    };
    WebSocketClient.prototype.getStatuses = function () {
        this.sendMessage('get_statuses', null);
    };
    WebSocketClient.prototype.getStatusesByIds = function (userIds) {
        this.sendMessage('get_statuses_by_ids', {
            user_ids: userIds,
        });
    };
    return WebSocketClient;
}());
exports.default = new WebSocketClient();
//# sourceMappingURL=websocket_client.js.map