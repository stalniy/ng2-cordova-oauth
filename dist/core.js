"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var browser_1 = require('./platform/browser');
var cordova_1 = require('./platform/cordova');
__export(require("./provider/facebook"));
__export(require("./provider/google"));
__export(require("./provider/imgur"));
__export(require("./provider/instagram"));
__export(require("./provider/meetup"));
__export(require("./provider/linkedin"));
exports.oAuth = {
    for: function (type) {
        return type === 'web' ? new browser_1.OauthBrowser() : new cordova_1.OauthCordova();
    },
    detect: function () {
        return window.location.href.indexOf('file:') === 0 ? this.for('cordova') : this.for('web');
    }
};
