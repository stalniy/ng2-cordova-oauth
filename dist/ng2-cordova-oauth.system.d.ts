declare module "utility" {
    export const utils: {
        parseQueryString(url: string): Object;
        defaults(target: any, ...sources: Object[]): any;
    };
}
declare module "provider" {
    import { IOauthProvider } from "oauth";
    export interface IOAuthOptions {
        clientId?: string;
        appScope?: string[];
        redirectUri?: string;
        responseType?: string;
    }
    export class OAuthProvider implements IOauthProvider {
        options: IOAuthOptions;
        protected APP_SCOPE_DELIMITER: string;
        protected authUrl: string;
        protected defaults: Object;
        constructor(options?: IOAuthOptions);
        name: string;
        parseResponseInUrl(url: any): Object;
        dialogUrl(): string;
        protected optionsToDialogUrl(options: any): string;
        protected serializeAppScope(scope: any): any;
        protected isValid(response: any): any;
    }
}
declare module "oauth" {
    import { OAuthProvider } from "provider";
    export class Oauth {
        defaultWindowOptions: Object;
        logInVia(provider: OAuthProvider, windowOptions?: Object): Promise<Object>;
        protected serializeOptions(options: Object): string;
        protected openDialog(url: string, windowParams: Object, options?: any): Promise<any>;
    }
    export interface IOauthProvider {
        parseResponseInUrl(url: string): Object;
    }
}
declare module "platform/browser" {
    import { Oauth } from "oauth";
    export class OauthBrowser extends Oauth {
        defaultWindowOptions: {
            width: number;
            location: number;
            toolbar: number;
        };
        protected openDialog(url: string, params: Object, options?: any): Promise<{}>;
        private addWindowRect(params);
    }
}
declare module "platform/cordova" {
    import { Oauth } from "oauth";
    export class OauthCordova extends Oauth {
        defaultWindowOptions: {
            location: string;
            clearsessioncache: string;
            clearcache: string;
        };
        protected openDialog(url: string, windowParams: Object, options?: any): Promise<{}>;
    }
}
declare module "provider/facebook" {
    import { OAuthProvider, IOAuthOptions } from "provider";
    export interface IFacebookOptions extends IOAuthOptions {
        authType?: string;
    }
    export class Facebook extends OAuthProvider {
        options: IFacebookOptions;
        protected authUrl: string;
        protected defaults: Object;
        constructor(options?: IFacebookOptions);
        protected optionsToDialogUrl(options: any): string;
    }
}
declare module "provider/google" {
    import { OAuthProvider, IOAuthOptions } from "provider";
    export interface IGoogleOptions extends IOAuthOptions {
    }
    export class Google extends OAuthProvider {
        options: IGoogleOptions;
        protected authUrl: string;
        protected APP_SCOPE_DELIMITER: string;
        protected defaults: Object;
        constructor(options?: IGoogleOptions);
        protected optionsToDialogUrl(options: any): string;
    }
}
declare module "provider/imgur" {
    import { OAuthProvider, IOAuthOptions } from "provider";
    export interface IImgurOptions extends IOAuthOptions {
    }
    export class Imgur extends OAuthProvider {
        options: IImgurOptions;
        protected authUrl: string;
        protected defaults: Object;
        constructor(options?: IImgurOptions);
    }
}
declare module "provider/instagram" {
    import { OAuthProvider, IOAuthOptions } from "provider";
    export interface IInstagramOptions extends IOAuthOptions {
    }
    export class Instagram extends OAuthProvider {
        options: IInstagramOptions;
        protected authUrl: string;
        protected APP_SCOPE_DELIMITER: string;
        protected defaults: Object;
        constructor(options?: IInstagramOptions);
    }
}
declare module "provider/meetup" {
    import { OAuthProvider, IOAuthOptions } from "provider";
    export interface IMeetupOptions extends IOAuthOptions {
    }
    export class Meetup extends OAuthProvider {
        options: IMeetupOptions;
        protected authUrl: string;
        protected defaults: Object;
        constructor(options?: IMeetupOptions);
    }
}
declare module "provider/linkedin" {
    import { OAuthProvider } from "provider";
    export class LinkedIn extends OAuthProvider {
        protected authUrl: string;
        protected defaults: Object;
    }
}
declare module "core" {
    import { OauthBrowser } from "platform/browser";
    import { OauthCordova } from "platform/cordova";
    export * from "provider/facebook";
    export * from "provider/google";
    export * from "provider/imgur";
    export * from "provider/instagram";
    export * from "provider/meetup";
    export * from "provider/linkedin";
    export const oAuth: {
        for(type: any): OauthBrowser | OauthCordova;
        detect(): any;
    };
}
