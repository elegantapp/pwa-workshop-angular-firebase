# Step 12 - Test the A2HS functionality on Android

On your emulated device, launch Chrome app and then navigate to https://10.0.2.2 address again.

Tap on `Add Conf App to Home screen` button on the screen. An A2HS prompt will show up.

<img width="507" alt="12-1-a2hs-prompt" src="https://user-images.githubusercontent.com/2641384/73658277-5a299480-4694-11ea-82f0-c51398f754b2.png">

Tap on `Add` and proceed with the icon. Your app icon will eventually show up on the home screen.

<img width="510" alt="12-2-shortcut" src="https://user-images.githubusercontent.com/2641384/73658280-5ac22b00-4694-11ea-8edc-eb98735677a9.png">

You might have seen the `Chrome` badge icon being on your app icon. If that's the case, it's possibly an indication of an app being a shortcut rather than a native app on the home screen. And, your emulated device is bundled with an older version of Chrome. 

Chrome team introduced a feature called WebAPK for PWA installations. Android creates an APK file on the file while adding a PWA to the home screen and you can manage your app like any other native apps installed on your Android system.

If you see the described behaviour, you need to update Chrome to see how WebAPK works. If there's no Chrome icon on top of your app icon, then you can skip updating the Chrome.

## Update Chrome 

Open Chrome app and tap on three dots next to the address bar.

Tap on `Update Chrome`.

<img width="513" alt="12-3-update-chrome" src="https://user-images.githubusercontent.com/2641384/73658281-5ac22b00-4694-11ea-8960-d6bfd9ec4fc7.png">

You need to sign in with your Google account to the Play Store in order to update Chrome on the emulated device. Do login with your account and finalize the installation of the Chrome update.

## Re-test the A2HS functionality

After updating the Chrome, navigate to https://10.0.2.2 address again. Tap on `Add Conf App to Home screen` button on the screen. An A2HS prompt will show up. Proceed with adding the app to the home screen.

When looked at the home screen, you might have noticed the difference of the WebAPK installation.

<img width="515" alt="12-4-comparison-webapk" src="https://user-images.githubusercontent.com/2641384/73658282-5b5ac180-4694-11ea-89bc-d0017fafe0bc.png">

The app on the app is more like a Chrome shortcut, but the one we've just added is packaged and installed like a native app.

Validate the PWA behaving like a native installed app on the system by navigation to the following screens:

`Settings` > `Apps & Notifications` > `See all x apps` > `Conf App`

<img width="513" alt="12-5-webapk" src="https://user-images.githubusercontent.com/2641384/73658284-5b5ac180-4694-11ea-9faf-605a00a946f4.png">

As you can observe, `Conf App` is installed just like any other native app. And, it's much smaller in size compared to other store apps.

## Take control of when to display A2HS prompt

When your PWA meets with [A2HS criteria](https://developers.google.com/web/fundamentals/app-install-banners#criteria), Chrome automatically displays a mini info bar.

As it goes for any sort of user engagement, the time to engage with your users is crucial for a better conversion. 

You might want to wait for the right moment to request your user to add your app to their home screen. Such as waiting for a time duration, a navigation pattern, a predicted hot path, and so on.

See [Patterns for Promoting PWA Installation](https://developers.google.com/web/fundamentals/app-install-banners/promoting-install-mobile) for recommended patterns and best practices for notifying the user your PWA is installable.

### Prevent the mini-infobar from appearing

Starting in Chrome 76, it's possible to prevent the mini-infobar from appearing automatically by calling `preventDefault()` on the `beforeinstallprompt` event.

Open `app.component.ts` file and add the following property and method:

```typescript
deferredPrompt;

hijackInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 76 and later from showing the mini-infobar
    e.preventDefault();

    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;

    // Toggle the install promotion display
    this.showInstallPromotion();
  });
}

showInstallPromotion() {
  // TODO: Toggle the install promotion display
}
```

### Add a custom install promotion display

Within the `app.component.ts` file, add the following property and implement the functionality of the `showInstallPromotion()` method.

```typescript
isInstallPromotionDisplayed = false;

showInstallPromotion() {
  this.isInstallPromotionDisplayed = true;
}
```

Then, open `app.component.html` file to add the custom install promotion UI in `ion-menu` element right after `ion-header`:

```html
<ion-card button color="tertiary" *ngIf="isInstallPromotionDisplayed">
  <ion-card-header>
    <ion-card-title>Add to home screen</ion-card-title>
  </ion-card-header>

  <ion-item>
    <ion-icon name="download" slot="start"></ion-icon>
    <ion-label>1 click away</ion-label>
    <ion-button color="tertiary" slot="end">INSTALL</ion-button>
  </ion-item>

  <ion-card-content>
    By adding our app to your home screen you can enjoy browsing the app offline.
  </ion-card-content>
</ion-card>
```

> Feel free to customize the UI as you wish. 
> You can use [`ion-card` docs](https://ionicframework.com/docs/api/card) and [`ionicons` website](https://ionicons.com/) to see what are your customization options in ionic.

<img width="505" alt="12-6-promotion-ui" src="https://user-images.githubusercontent.com/2641384/73658285-5b5ac180-4694-11ea-9258-4f936abfee8a.png">

As `beforeinstallprompt` is not available in Safari, the UI displayed above will never be shown on iOS platform.

Now that we have the install promotion UI in place, we need to add a click handler to it to re-trigger th install prompt event stashed in `deferredPrompt` property.

### Add a click handler to install promotion UI

Add a click handler to `ion-card` element we've just added in `app.component.html` template and re-trigger install prompt event stashed in `deferredPrompt` property in `AppComponent` class.

Extend `ion-card` element in `app.component.html` by adding the following click handler:

```html
<ion-card (click)="showInstallPrompt()">
```

Open `app.component.ts` file to add `showInstallPrompt()` method:

```typescript
showInstallPrompt() {
  // Show the prompt
  this.deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  this.deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        // Hide the install promotion UI as user just installed it
        this.isInstallPromotionDisplayed = false;
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
}
```

## Test the custom install promotion on device

Run `npm run build:serve:https` to build the app for production and serve it on local server over HTTPS protocol. 

After running the command, test the functionality on the emulated device. 

You need to remove the previously installed app in order to test this functionality. The `beforeinstallprompt` event will not be fired if it's already installed on the device.

## Good to go 🎯

Now you can continue to Step 13 -> [Add maskable icons](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-13/README.md).
