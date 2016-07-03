import { Oauth } from '../oauth';
export declare class OauthBrowser extends Oauth {
    defaultWindowOptions: {
        width: number;
        location: number;
        toolbar: number;
    };
    protected openDialog(url: string, params: Object, options?: any): Promise<{}>;
    private addWindowRect(params);
}
