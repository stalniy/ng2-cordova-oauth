import { OauthBrowser } from './platform/browser';
import { OauthCordova } from './platform/cordova';

export * from "./provider/facebook"
export * from "./provider/google"
export * from "./provider/imgur"
export * from "./provider/instagram"
export * from "./provider/meetup"
export * from "./provider/linkedin"
export const oAuth = {
  for(type) {
    return type === 'web' ? new OauthBrowser() : new OauthCordova();
  },

  detect() {
    return window.location.href.indexOf('file:') === 0 ? this.for('cordova') : this.for('web');
  }
}
