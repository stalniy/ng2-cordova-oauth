var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("utility", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils;
    return {
        setters:[],
        execute: function() {
            exports_1("utils", utils = {
                parseQueryString: function (url) {
                    var values = url.split(/[?#]{1,2}/)[1].split('&');
                    return values.reduce(function (map, value) {
                        var _a = value.split('='), paramName = _a[0], paramValue = _a[1];
                        map[decodeURIComponent(paramName)] = decodeURIComponent(paramValue);
                        return map;
                    }, {});
                },
                defaults: function (target) {
                    var sources = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        sources[_i - 1] = arguments[_i];
                    }
                    sources.forEach(function (source) {
                        for (var prop in source) {
                            if (!target.hasOwnProperty(prop)) {
                                target[prop] = source[prop];
                            }
                        }
                    });
                    return target;
                }
            });
        }
    }
});
System.register("provider", ["utility"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var utility_1;
    var DEFAULTS, OAuthProvider;
    return {
        setters:[
            function (utility_1_1) {
                utility_1 = utility_1_1;
            }],
        execute: function() {
            DEFAULTS = {
                redirectUri: 'http://localhost/callback'
            };
            OAuthProvider = (function () {
                function OAuthProvider(options) {
                    if (options === void 0) { options = {}; }
                    this.APP_SCOPE_DELIMITER = ',';
                    this.authUrl = '';
                    this.defaults = {};
                    this.options = utility_1.utils.defaults(options, DEFAULTS);
                    if (!options.clientId) {
                        throw Error("A " + this.name + " client id must exist");
                    }
                }
                Object.defineProperty(OAuthProvider.prototype, "name", {
                    get: function () {
                        return this.constructor.name || this.authUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                OAuthProvider.prototype.parseResponseInUrl = function (url) {
                    var response = utility_1.utils.parseQueryString(url);
                    if (!this.isValid(response)) {
                        var error = new Error("Problem authenticating with " + this.name);
                        Object.defineProperty(error, 'response', { value: response });
                        throw error;
                    }
                    return response;
                };
                OAuthProvider.prototype.dialogUrl = function () {
                    return this.optionsToDialogUrl(this.options);
                };
                OAuthProvider.prototype.optionsToDialogUrl = function (options) {
                    utility_1.utils.defaults(options, this.defaults);
                    var url = this.authUrl + "?client_id=" + options.clientId + "&redirect_uri=" + options.redirectUri;
                    if (options.appScope) {
                        url += "&scope=" + this.serializeAppScope(options.appScope);
                    }
                    if (options.state) {
                        url += "&state=" + options.state;
                    }
                    if (options.responseType) {
                        url += "&response_type=" + options.responseType;
                    }
                    return url;
                };
                OAuthProvider.prototype.serializeAppScope = function (scope) {
                    return typeof scope.join === 'function' ? scope.join(this.APP_SCOPE_DELIMITER) : scope;
                };
                OAuthProvider.prototype.isValid = function (response) {
                    return !response.error && (response.code || response['access_token']);
                };
                return OAuthProvider;
            }());
            exports_2("OAuthProvider", OAuthProvider);
        }
    }
});
/*
 * Angular 2 (ng2) Cordova Oauth
 * Created by Nic Raboy
 * http://www.nraboy.com
 */
System.register("oauth", ["utility"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var utility_2;
    var Oauth;
    return {
        setters:[
            function (utility_2_1) {
                utility_2 = utility_2_1;
            }],
        execute: function() {
            /*
             * The main driver class for connections to each of the providers.
             */
            Oauth = (function () {
                function Oauth() {
                    this.defaultWindowOptions = {};
                }
                Oauth.prototype.logInVia = function (provider, windowOptions) {
                    if (windowOptions === void 0) { windowOptions = {}; }
                    var url = provider.dialogUrl();
                    return this.openDialog(url, utility_2.utils.defaults(windowOptions, this.defaultWindowOptions), {
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
            exports_3("Oauth", Oauth);
        }
    }
});
System.register("platform/browser", ["oauth", "utility"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var oauth_1, utility_3;
    var OauthBrowser;
    return {
        setters:[
            function (oauth_1_1) {
                oauth_1 = oauth_1_1;
            },
            function (utility_3_1) {
                utility_3 = utility_3_1;
            }],
        execute: function() {
            OauthBrowser = (function (_super) {
                __extends(OauthBrowser, _super);
                function OauthBrowser() {
                    _super.apply(this, arguments);
                    this.defaultWindowOptions = {
                        width: 600,
                        location: 1,
                        toolbar: 0,
                    };
                }
                OauthBrowser.prototype.openDialog = function (url, params, options) {
                    if (options === void 0) { options = {}; }
                    var windowParams = this.addWindowRect(utility_3.utils.defaults({ title: 'Authentication' }, params));
                    var title = windowParams.title;
                    delete windowParams.title;
                    var popup = window.open(url, title, this.serializeOptions(windowParams));
                    return new Promise(function (resolve, reject) {
                        if (typeof popup.focus === 'function') {
                            popup.focus();
                        }
                        setTimeout(function watchPopup() {
                            try {
                                if (popup.closed) {
                                    return reject(new Error("The \"" + options.providerName + "\" sign in flow was canceled"));
                                }
                                if (popup.location.href.indexOf(options.resolveOnUri) === 0) {
                                    popup.close();
                                    resolve({ url: popup.location.href });
                                }
                            }
                            catch (e) {
                            }
                            setTimeout(watchPopup, 200);
                        }, 200);
                    });
                };
                OauthBrowser.prototype.addWindowRect = function (params) {
                    var root = document.documentElement;
                    var screenX = typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft;
                    var screenY = typeof window.screenY !== 'undefined' ? window.screenY : window.screenTop;
                    var outerWidth = typeof window.outerWidth !== 'undefined' ? window.outerWidth : root.clientWidth;
                    var outerHeight = typeof window.outerHeight !== 'undefined' ? window.outerHeight : root.clientHeight - 22;
                    screenX = screenX < 0 ? window.screen.width + screenX : screenX;
                    params.height = Math.floor(outerHeight * 0.8);
                    params.left = Math.floor(screenX + (outerWidth - params.width) / 2);
                    params.top = Math.floor(screenY + (outerHeight - params.height) / 2.5);
                    return params;
                };
                return OauthBrowser;
            }(oauth_1.Oauth));
            exports_4("OauthBrowser", OauthBrowser);
        }
    }
});
System.register("platform/cordova", ["oauth"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var oauth_2;
    var OauthCordova;
    function ensureEnvIsValid() {
        if (!window.cordova) {
            throw new Error('Cannot authenticate via a web browser');
        }
        if (!window.cordova.InAppBrowser) {
            throw new Error('The Apache Cordova InAppBrowser plugin was not found and is required');
        }
    }
    return {
        setters:[
            function (oauth_2_1) {
                oauth_2 = oauth_2_1;
            }],
        execute: function() {
            OauthCordova = (function (_super) {
                __extends(OauthCordova, _super);
                function OauthCordova() {
                    _super.apply(this, arguments);
                    this.defaultWindowOptions = {
                        location: 'no',
                        clearsessioncache: 'yes',
                        clearcache: 'yes'
                    };
                }
                OauthCordova.prototype.openDialog = function (url, windowParams, options) {
                    if (options === void 0) { options = {}; }
                    var params = this.serializeOptions(windowParams);
                    return new Promise(function (resolve, reject) {
                        try {
                            ensureEnvIsValid();
                        }
                        catch (error) {
                            return reject(error);
                        }
                        var browserRef = window.cordova.InAppBrowser.open(url, '_blank', params);
                        var exitListener = function () { return reject(new Error("The \"" + options.providerName + "\" sign in flow was canceled")); };
                        browserRef.addEventListener('loadstart', function (event) {
                            if (event.url.indexOf(options.resolveOnUri) === 0) {
                                browserRef.removeEventListener('exit', exitListener);
                                browserRef.close();
                                resolve(event);
                            }
                        });
                        return browserRef.addEventListener('exit', exitListener);
                    });
                };
                return OauthCordova;
            }(oauth_2.Oauth));
            exports_5("OauthCordova", OauthCordova);
        }
    }
});
System.register("provider/facebook", ["provider"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var provider_1;
    var Facebook;
    return {
        setters:[
            function (provider_1_1) {
                provider_1 = provider_1_1;
            }],
        execute: function() {
            Facebook = (function (_super) {
                __extends(Facebook, _super);
                function Facebook(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://www.facebook.com/v2.0/dialog/oauth';
                    this.defaults = {
                        responseType: 'token'
                    };
                    if (!options.appScope || options.appScope.length <= 0) {
                        throw new Error("A " + this.name + " app scope must exist");
                    }
                }
                Facebook.prototype.optionsToDialogUrl = function (options) {
                    var url = _super.prototype.optionsToDialogUrl.call(this, options);
                    if (options.authType) {
                        url += "&auth_type=" + options.authType;
                    }
                    return url;
                };
                return Facebook;
            }(provider_1.OAuthProvider));
            exports_6("Facebook", Facebook);
        }
    }
});
System.register("provider/google", ["provider"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var provider_2;
    var Google;
    return {
        setters:[
            function (provider_2_1) {
                provider_2 = provider_2_1;
            }],
        execute: function() {
            Google = (function (_super) {
                __extends(Google, _super);
                function Google(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://accounts.google.com/o/oauth2/auth';
                    this.APP_SCOPE_DELIMITER = ' ';
                    this.defaults = {
                        responseType: 'token'
                    };
                    if (!options.appScope || options.appScope.length <= 0) {
                        throw new Error("A " + this.name + " app scope must exist");
                    }
                }
                Google.prototype.optionsToDialogUrl = function (options) {
                    return _super.prototype.optionsToDialogUrl.call(this, options) + '&approval_prompt=force';
                };
                return Google;
            }(provider_2.OAuthProvider));
            exports_7("Google", Google);
        }
    }
});
System.register("provider/imgur", ["provider"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var provider_3;
    var Imgur;
    return {
        setters:[
            function (provider_3_1) {
                provider_3 = provider_3_1;
            }],
        execute: function() {
            Imgur = (function (_super) {
                __extends(Imgur, _super);
                function Imgur(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://api.imgur.com/oauth2/authorize';
                    this.defaults = {
                        responseType: 'token'
                    };
                }
                return Imgur;
            }(provider_3.OAuthProvider));
            exports_8("Imgur", Imgur);
        }
    }
});
System.register("provider/instagram", ["provider"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var provider_4;
    var Instagram;
    return {
        setters:[
            function (provider_4_1) {
                provider_4 = provider_4_1;
            }],
        execute: function() {
            Instagram = (function (_super) {
                __extends(Instagram, _super);
                function Instagram(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://api.instagram.com/oauth/authorize';
                    this.APP_SCOPE_DELIMITER = '+';
                    this.defaults = {
                        responseType: 'token'
                    };
                }
                return Instagram;
            }(provider_4.OAuthProvider));
            exports_9("Instagram", Instagram);
        }
    }
});
System.register("provider/meetup", ["provider"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var provider_5;
    var Meetup;
    return {
        setters:[
            function (provider_5_1) {
                provider_5 = provider_5_1;
            }],
        execute: function() {
            Meetup = (function (_super) {
                __extends(Meetup, _super);
                function Meetup(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://secure.meetup.com/oauth2/authorize/';
                    this.defaults = {
                        responseType: 'token'
                    };
                }
                return Meetup;
            }(provider_5.OAuthProvider));
            exports_10("Meetup", Meetup);
        }
    }
});
System.register("provider/linkedin", ["provider"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var provider_6;
    var LinkedIn;
    return {
        setters:[
            function (provider_6_1) {
                provider_6 = provider_6_1;
            }],
        execute: function() {
            LinkedIn = (function (_super) {
                __extends(LinkedIn, _super);
                function LinkedIn() {
                    _super.apply(this, arguments);
                    this.authUrl = 'https://www.linkedin.com/oauth/v2/authorization';
                    this.defaults = {
                        responseType: 'code'
                    };
                }
                return LinkedIn;
            }(provider_6.OAuthProvider));
            exports_11("LinkedIn", LinkedIn);
        }
    }
});
System.register("core", ["platform/browser", "platform/cordova", "provider/facebook", "provider/google", "provider/imgur", "provider/instagram", "provider/meetup", "provider/linkedin"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var browser_1, cordova_1;
    var oAuth;
    var exportedNames_1 = {
        'oAuth': true
    };
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_12(exports);
    }
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (cordova_1_1) {
                cordova_1 = cordova_1_1;
            },
            function (facebook_1_1) {
                exportStar_1(facebook_1_1);
            },
            function (google_1_1) {
                exportStar_1(google_1_1);
            },
            function (imgur_1_1) {
                exportStar_1(imgur_1_1);
            },
            function (instagram_1_1) {
                exportStar_1(instagram_1_1);
            },
            function (meetup_1_1) {
                exportStar_1(meetup_1_1);
            },
            function (linkedin_1_1) {
                exportStar_1(linkedin_1_1);
            }],
        execute: function() {
            exports_12("oAuth", oAuth = {
                for: function (type) {
                    return type === 'web' ? new browser_1.OauthBrowser() : new cordova_1.OauthCordova();
                },
                detect: function () {
                    return window.location.href.indexOf('file:') === 0 ? this.for('cordova') : this.for('web');
                }
            });
        }
    }
});
