/*
 * Angular 2 (ng2) Cordova Oauth
 * Created by Nic Raboy
 * http://www.nraboy.com
 */
"use strict";
var utility_1 = require('./utility');
/*
 * The main driver class for connections to each of the providers.
 */
var Oauth = (function () {
    function Oauth() {
        this.defaultWindowOptions = {};
    }
    Oauth.prototype.logInVia = function (provider, windowOptions) {
        if (windowOptions === void 0) { windowOptions = {}; }
        var url = provider.dialogUrl();
        return this.openDialog(url, utility_1.utils.defaults(windowOptions, this.defaultWindowOptions), {
            resolveOnUri: provider.options.redirectUri,
            providerName: provider.name
        }).then(function (event) {
            return provider.parseResponseInUrl(event.url);
        });
    };
    Oauth.prototype.serializeOptions = function (options) {
        var chunks = [];
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                chunks.push(prop + "=" + options[prop]);
            }
        }
        return chunks.join(',');
    };
    Oauth.prototype.openDialog = function (url, windowParams, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) { return reject(new Error('Not implemented')); });
    };
    return Oauth;
}());
exports.Oauth = Oauth;
