/*
 * Angular 2 (ng2) Cordova Oauth
 * Created by Nic Raboy
 * http://www.nraboy.com
 */
var DEFAULT_BROWSER_OPTIONS = {
    location: 'no',
    clearsessioncache: 'yes',
    clearcache: 'yes'
};
/*
 * The main driver class for connections to each of the providers.
 */
var CordovaOauth = (function () {
    function CordovaOauth() {
        if (!window.cordova) {
            throw new Error('Cannot authenticate via a web browser');
        }
        if (!window.cordova.InAppBrowser) {
            throw new Error('The Apache Cordova InAppBrowser plugin was not found and is required');
        }
    }
    CordovaOauth.prototype.logInVia = function (provider, browserOptions) {
        if (browserOptions === void 0) { browserOptions = {}; }
        var url = provider.dialogUrl();
        var windowParams = this.serializeBrowserOptions(utils.defaults(browserOptions, DEFAULT_BROWSER_OPTIONS));
        return new Promise(function (resolve, reject) {
            var browserRef = window.cordova.InAppBrowser.open(url, '_blank', windowParams);
            var exitListener = function () { return reject("The \"" + provider.name + "\" sign in flow was canceled"); };
            browserRef.addEventListener('loadstart', function (event) {
                if (event.url.indexOf(provider.options.redirectUri) === 0) {
                    browserRef.removeEventListener('exit', exitListener);
                    browserRef.close();
                    try {
                        resolve(provider.parseResponseInUrl(event.url));
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            });
            browserRef.addEventListener('exit', exitListener);
        });
    };
    CordovaOauth.prototype.serializeBrowserOptions = function (options) {
        var chunks = [];
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                chunks.push(prop + "=" + options[prop]);
            }
        }
        return chunks.join(',');
    };
    return CordovaOauth;
})();
exports.CordovaOauth = CordovaOauth;
