import { OauthBrowser } from './platform/browser';
import { OauthCordova } from './platform/cordova';

const PLATFORMS = {
  instances: {},
  web: OauthBrowser,
  cordova: OauthCordova
};

export * from "./provider/facebook";
export * from "./provider/google";
export * from "./provider/imgur";
export * from "./provider/instagram";
export * from "./provider/meetup";
export * from "./provider/linkedin";
export const oAuth = {
  for(type) {
    if (typeof PLATFORMS[type] !== 'function') {
      throw new Error(`Unknown oAuth platform type: ${type}`);
    }

    if (!PLATFORMS.instances[type]) {
      PLATFORMS.instances[type] = new PLATFORMS[type]();
    }

    return PLATFORMS.instances[type];
  },

  detect() {
    return window.location.href.indexOf('file:') === 0 ? this.for('cordova') : this.for('web');
  }
}
;
