# Step 4 - Display A2HS on iOS

Google Chrome automatically detects a PWA on Android systems and if the site meets the [add to home screen criteria](https://developers.google.com/web/fundamentals/app-install-banners/#criteria), it shows an [install banner or mini info bar](https://developers.google.com/web/updates/2018/06/a2hs-updates) to the user to allow them adding it to their home screen.

![A2HS Popup on Android](https://cdn-images-1.medium.com/max/1600/0*i0LfXaT1VuddsPB8.png) 

Such functionality does not exist on iOS. But, luckily we can build our own UX to guide users towards the required taps to help them add your app to their home screens. We're going to implement the below logic on `app.component.ts` file.

## Display a banner with A2HS message to the users 

We're going to display a toast banner to the users on iOS, to remind them they can install the PWA by adding it to the home screen.

![A2HS Popup on Android](https://cdn-images-1.medium.com/max/1600/0*XMMa7gwBkG7auHi5.png) 

### Check if user is on iOS

We only want to display this message to the users on iOS platform as Android platform handles it automatically. You can use the following function to detect a device using iOS;

```javascript
const isIos = () => {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
};
```

### Check if app is in standalone mode

We don't want to display this message if user has already added the app to their home screen. We can accomplish this by asserting `window.navigator.standalone`.

You can use the following function to detect if app is launched from the home screen;

```typescript
const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);
```

### Show the banner to the users only once

We don't want to disturb our users by showing the same banner over and over again on every visit. We need to get a global state of `isBannerShown` and show the A2HS message only if it's not shown yet.

You can use the following function to detect if app is launched from the home screen;

```javascript 
import { Storage } from '@ionic/storage';
const isBannerShown = await this.storage.get('isBannerShown');
```

You also need to set this value when you show the message;

```javascript
import { Storage } from '@ionic/storage';
this.storage.set('isBannerShown', true);
```

### Display the banner with a message

We can use `ToastController` of Ionic for displaying the message. Simply open `app.component.ts` file and inject `ToastController` from `@ionic/angular` to your component.

Create a new function called showIosInstallBanner and do all the checks mentioned above. Then display the message by calling toast controller as the example below;

```javascript
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

// Inject ToastController and Storage to the constructor

async ngOnInit() {
  // The rest of ngOnInit
  await this.showIosInstallBanner();
}

async showIosInstallBanner() {
  // Put the functions for assertion here
  
  if (isIos() && !isInStandaloneMode() && isBannerShown == null) {
    const toast = await this.toastController.create({
      showCloseButton: true,
      closeButtonText: 'OK',
      cssClass: 'your-class-here-if-need-to-customize',
      position: 'bottom',
      message: `To install the app, tap "Share" icon below and select "Add to Home Screen".`,
    });
    toast.present();
    this.storage.set('isBannerShown', true);
  }
}
```

You can test displaying the message on your local dev env by temporarily removing `isIos() && !isInStandaloneMode()`. When you see the message, put the removed expressions back and continue.  

## Good to go 🎯
Now you can continue to Step 5 -> [Add asset groups for app shell and icons](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-5/README.md). 
