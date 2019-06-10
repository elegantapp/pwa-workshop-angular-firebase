# Step 7

As of today, Angular service worker — aka NGSW doesn't support the composition of another service worker. This means that you cannot extend Angular service worker's default behaviour and add your own flavour to it.

You can try and edit automatically generated `ngsw-worker.js` service worker file in your dist folder, but every time you build your application for production, this file will be overridden by Angular. 

This architecture may introduce a problem if you plan to do more than what Angular service worker offers to you. No worries though, there is a nice workaround to tackle this issue.

We're going to look into one of the workarounds to extend NGSW and we will import an external service worker file in addition to Angular's. 

## Introducing our own service worker file

We're going to introduce a new service worker file, say `main-sw.js` to our Angular app and import automatically generated NGSW within our new service worker.

* Create a new folder in `/src` with the name `sw`
* Create a new file in `/src/sw` with the name `main-sw.js`
* Add the following import to your `main-sw.js` file;

```javascript
importScripts('ngsw-worker.js');
```

### Add the asset rule to angular.json

Since we introduced a new JS file that is out of the scope of NGSW and Angular, we need to change the build configuration of our app to make sure our new sw file will be in the build output.

* Open `angular.json`
* Add the following JSON object to the `assets` array located at L:18; 

```json
{
  "glob": "**/*-sw.js",
  "input": "src/sw",
  "output": "/"
}
```

This config will copy any file matching the glob pattern to the `www` output folder.

### Update the SW path in app module

If you remember from Step 1, when we added the `@angular/pwa` schematic, Angular modified our `app.module.ts` file with a fixed path of SW to register it to ServiceWorkerModule.

Since we introduced a new service worker file, we need to change the fixed path in `angular.module.ts` to `main-sw.js`.

* Open `src/app/app.module.ts`
* Change the service worker path to `main-sw.js` as below

```javascript
ServiceWorkerModule.register('main-sw.js', { enabled: environment.production })
```

### BONUS: Push Notifications

The idea of extending the NGSW is to be free with native service worker implementation, enabling us to interact with various Web APIs.

One of those APIs is Web Push Notification API. **We will not cover push notifications during this workshop due to time limitation.** However, you can introduce them later via Firebase Cloud Messaging by following the instructions on [documentation here](https://firebase.google.com/docs/cloud-messaging/js/receive#handle_messages_when_your_web_app_is_in_the_foreground).

Simply create a new file in `/src/sw` folder with the name `firebase-messaging-sw.js` as it's described in docs and continue with further steps. Our adjusted build setup is compatible with all the modifications you need to do for introducing push notifications. Do not forget importing `firebase-messaging-sw.js` to `main-sw.js` file, like we did for `ngsw-worker.js` earlier.

## Test the results

Once you're done with the instructions, you can test it by building the app for production. 

Run `npm run build:serve` to spin off an http server for your production build. Open `http://127.0.0.1:8080` in your browser to inspect the app.

You need to see `main-sw.js` as the registered service worker on your app. Inspect the sw, put a break point in it and inspect the `self` object in your console.

## Good to go 🎯

Now you can continue to Step 8 -> [Update PWA](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-8/README.md) 
