import { Provider } from './provider';
export declare class CordovaOauth {
    logInVia(provider: Provider, browserOptions?: Object): Promise<{}>;
    protected serializeBrowserOptions(options: Object): string;
}
export interface IOauthProvider {
    login(options?: Object): Promise<Object>;
}
