import { OauthBrowser } from './platform/browser';
import { OauthCordova } from './platform/cordova';
export * from "./provider/facebook";
export * from "./provider/google";
export * from "./provider/imgur";
export * from "./provider/instagram";
export * from "./provider/meetup";
export * from "./provider/linkedin";
export declare const oAuth: {
    for(type: any): OauthBrowser | OauthCordova;
    detect(): any;
};
