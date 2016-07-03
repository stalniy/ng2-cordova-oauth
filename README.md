[![Build Status](https://travis-ci.org/nraboy/ng2-cordova-oauth.svg?branch=master)](https://travis-ci.org/nraboy/ng2-cordova-oauth)
[![PayPal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/nraboy)

# Angular 2 Cordova Oauth

ng2-cordova-oauth is an Oauth library which easily integrates in Angular2/Ionic2 or any other WEB or Cordova applications.  The purpose of this library is to quickly and easily obtain an access token or a code from various web services to use their APIs.


## Requirements
*for mobile*:
* Apache Cordova 5+
* [Apache Cordova InAppBrowser Plugin](http://cordova.apache.org/docs/en/3.0.0/cordova_inappbrowser_inappbrowser.md.html)
* [Apache Cordova Whitelist Plugin](https://github.com/apache/cordova-plugin-whitelist)

*for web*:
* webpack, systemjs or amd loaders

## Installing ng2-cordova-oauth Into Your Project

### Installing

From the root of your project, execute the following:

```
npm install ng2-cordova-oauth --save
```

This will install ng2-cordova-oauth and its dependencies.

### Injecting:

Once installed, you need to inject the library classes into every class in which you wish to use them.  For example, if you wish to use Facebook oauth in a particular class, it would look something like:

```javascript
import {oAuth, Facebook, Google} from 'ng2-cordova-oauth';
```

So, there 2 types of entities in the library: Platform (i.e., Cordova, Browser) and Provider (i.e., Facebook, LinkedIn, etc.).
Each provider has it's own class.  At this point, ng2-cordova-oauth is installed into your project and is ready for use.


## Using ng2-cordova-oauth In Your Project

Each web service API acts independently in this library.  However, when configuring each web service, one thing must remain consistent. It supports several oAuth proviers: Facebook, Instagram, LinkedIn, Google, Meetup, Imgur. Example of creating oAuth provider:

```typescript
Facebook({
    clientId: string,
    appScope?: string[],
    redirectUri?: string,
    responseType?: string,
    authType?: string
});
```
Platform is responsible for opening popups in appropriates environemnts and has only one public method `logInVia` which returns `Promise`. 

```javascript
import {oAuth, Facebook, Google} from 'ng2-cordova-oauth';

const facebook = new Facebook({
  clientId: 'your client id',
  responseType: 'code',
  redirectUri: 'http://localhost',
  appScope: ['email']
})

oAuth.for('cordova').logInVia(facebook)
    .then(response => console.log(JSON.stringify(response))
    .catch(error => console.error(error.stack, error.response);
```

You can add similar authentication process for web just by replacing string `'cordova'` with `'web'` or use `oAuth.detect()` method which automatically detects on which platform script is running and proceed with env specific strategy. 

As of Apache Cordova 5.0.0, the [whitelist plugin](https://blog.nraboy.com/2015/05/whitelist-external-resources-for-use-in-ionic-framework/) must be used in order to reach external web services.

This library **DO** work with a web browser and with a device or simulator as well.

## A Working Example

```javascript
import {Platform} from 'ionic/ionic';
import {Component} from '@angular/core';
import {LoginPage} from './pages/login/login';
import {oAuth, Facebook} from 'ng2-cordova-oauth';

@Component({
    template: `
        <ion-nav [root]="root"></ion-nav>
    `,
})

export class MyApp {
    constructor(platform: Platform) {
        this.platform = platform;
        this.root = HomePage;
    }
    
    ngOnInit() {
        this.platform.ready().then(() => {
            oAuth.detect().logInVia(new Facebook({
                clientId: 'CLIENT_ID_HERE',
                appScope: ['email']
            })).then((response) => {
                console.log(JSON.stringify(response));
            }, (error) => {
                console.error(error);
            });
        });
    }

}
```

## Version History

Coming soon...


## Contribution Rules

All contributions must be made via the `development` branch.  This keeps the project more maintainable in terms of versioning as well as code control.


## Have a question or found a bug (compliments work too)?

This project is maintained by **Nic Raboy**.

Tweet Nic Raboy on Twitter - [@nraboy](https://www.twitter.com/nraboy)


## Resources

Ionic 2 - [http://www.ionicframework.com](http://www.ionicframework.com)

Angular 2 - [https://www.angular.io](https://www.angular.io)

Apache Cordova - [http://cordova.apache.org](http://cordova.apache.org)
