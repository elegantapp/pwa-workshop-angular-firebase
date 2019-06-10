# Step 8

A service worker is the backbone of a Progressive Web App. And, updating a PWA always starts at its service worker. Browsers regularly check attached service worker of a client app for a byte difference and once service worker file is updated, the browser automatically initializes an update process.

![PWA SW Update procedure](https://cdn-images-1.medium.com/max/1600/0*FHyvYRffIAix_60T.jpg) 

## Understanding app versions and update checks in Angular

> In the context of an Angular service worker, a "version" is a collection of resources that represent a specific build of the Angular app. Whenever a new build of the app is deployed, the service worker treats that build as a new version of the app. This is true even if only a single file is updated. At any given time, the service worker may have multiple versions of the app in its cache and it may be serving them simultaneously.
> 
> Every time the user opens or refreshes the application, the Angular service worker checks for updates to the app by looking for updates to the ngsw.json manifest. This manifest file represents the "version" of an Angular build, along with all the files associated with ngsw-config file. If an update is found, it is downloaded and cached automatically, and will be served the next time the application is loaded.
>
> — [Angular docs](https://angular.io/guide/service-worker-devops)

Inspect the NGSW manifest file located at `www/ngsw.json`. If www folder is not there, generate it by building it for production: `npm run build -- --prod`.

## Add app data to NGSW config

`appData` field in ngsw-config.json file enables you to pass any data you want that describes this particular version of the app. The [SwUpdate](https://angular.io/api/service-worker/SwUpdate) service includes that data in the update notifications. Many apps make use of this field to provide some additional info for the display of any popups, notifying users of the available update.

Add the following object to your `ngsw-config.json` file;

```json
{
  "appData": {
    "version": "1.0.0",
    "changelog": "Initial release"
  }
}
```

## Add update notification handler

Angular handles its service worker updates via its own service called [SwUpdate](https://angular.io/api/service-worker/SwUpdate) from @angular/service-worker module. You can subscribe to `UpdateAvailableEvent` and `UpdateActivatedEvent` events on this service to be notified on service worker updates.

* Open `/src/app/app.component.ts` file
* Import `SwUpdate` from `@angular/service-worker` and inject it to the constructor
* Inject AlertController from Ionic to display an alert box
* Subscribe to swUpdate available stream and create a callback fn that receives UpdateAvailableEvent
* Display appData.version and appData.changelog information in the alert message
* Provide an option to users to immediately update the app by calling `window.location.reload()` 
* Example;

```typescript
constructor(
  private swUpdate: SwUpdate,
  private alertController: AlertController,
) {}

ngOnInit() {
  this.handleAppUpdate();
}

handleAppUpdate() {
  if (this.swUpdate.isEnabled) {
    this.swUpdate.available.subscribe(async (event: UpdateAvailableEvent) => {
      const alert = await this.alertController.create({
        header: `App update!`,
        message: `Newer version - v${((event.available.appData) as any).version} is available.
                  Change log: ${((event.available.appData) as any).changelog}`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          }, {
            text: 'Refresh',
            handler: () => {
              window.location.reload();
            },
          },
        ],
      });

      await alert.present();
    });
  }
}
``` 

> Please note that you don’t have to provide this manual update functionality. Service workers are automatically updated by the browser on the time of disconnection of all clients or pages attached to it. However, it's recommended providing this immediate update option for the convenience of your users.

## Test the results

In order to simulate an app update, follow the instructions below;

* Make sure that `Update on reload` option at Application -> Service Worker panel in Chrome's Web Inspector, is not selected.
* Simulate an app update by modifying `ngsw-config.json` file. Increase the version in app data and add a change log message.

```json
{
  "appData": {
    "version": "1.0.1",
    "changelog": "Added foo:bar feature"
  }
}
```
* Serve the app with running `npm run server`.
* Rebuild your app with running `npm run build:prod` while you have the app open on Chrome, and while serving the app already with `npm run server`.
* Refresh you tab and you need to see a new service worker waiting for an update in web inspector and also an alert popup in your app. 

## Good to go 🎯

Now you can continue to Step 9 -> [Host on Firebase](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-10/README.md).
