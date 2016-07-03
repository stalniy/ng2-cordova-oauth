"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var browser_1 = require('./platform/browser');
var cordova_1 = require('./platform/cordova');
var PLATFORMS = {
    instances: {},
    web: browser_1.OauthBrowser,
    cordova: cordova_1.OauthCordova
};
__export(require("./provider/facebook"));
__export(require("./provider/google"));
__export(require("./provider/imgur"));
__export(require("./provider/instagram"));
__export(require("./provider/meetup"));
__export(require("./provider/linkedin"));
exports.oAuth = {
    for: function (type) {
        if (typeof PLATFORMS[type] !== 'function') {
            throw new Error("Unknown oAuth platform type: " + type);
        }
        if (!PLATFORMS.instances[type]) {
            PLATFORMS.instances[type] = new PLATFORMS[type]();
        }
        return PLATFORMS.instances[type];
    },
    detect: function () {
        return window.location.href.indexOf('file:') === 0 ? this.for('cordova') : this.for('web');
    }
};
