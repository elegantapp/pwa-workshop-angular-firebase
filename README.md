# Step 3

## Add meta tags for icons and splash screens

By adding PWA schematic of Angular, we've had automatically generated icon files under `/src/assets/icons` folder. 

We're going to replace the icons with Ionic logo and we will generate splash screens for iOS platform and add related meta tags. 

## Generate new icons and splash screen images

This workshop includes a small script to automatically generate icon and splash screen images based on one SVG vector image.

In order to generate all images at once, you need to run the following;

```bash
npm run resources
```

After running the script, please verify that you the following files modified in your change set, by running `git status`;

```
src/assets/icons/icon-128x128.png
src/assets/icons/icon-144x144.png
src/assets/icons/icon-152x152.png
src/assets/icons/icon-192x192.png
src/assets/icons/icon-384x384.png
src/assets/icons/icon-512x512.png
src/assets/icons/icon-72x72.png
src/assets/icons/icon-96x96.png
```

In addition, there should be new splash screen image files as well as `apple-icon` for iOS home screens;

```
apple-icon.png
ipad_splash.png
ipadpro1_splash.png
ipadpro2_splash.png
ipadpro3_splash.png
iphone5_splash.png
iphone6_splash.png
iphoneplus_splash.png
iphonex_splash.png
iphonexr_splash.png
iphonexsmax_splash.png
```  

## Add splash screen image meta tags for iOS

Although many browsers adopted the [Web App Manifest spec](https://w3c.github.io/manifest/), WebKit (specifically, Mobile Safari on iOS) currently uses custom non-standards track meta tag implementations.

We need to add a special type of non-standard meta tag - [see here](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) - in order to have our PWAs on iOS to display splash screen.

In order to add splash screen to your PWA on iOS, we must add a meta tag that points out an image for a specific resolution. If the size of an image in the meta tag matches with the device’s resolution, iOS will show the image as a splash screen. 

You need to create static images in different sizes for different devices. Here’s a list of devices and their resolutions: https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/launch-screen/#static-launch-screen-images-not-recommended 

Add the following code to the `index.html` file of your PWA. 

```
<link href="assets/icons/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="assets/icons/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="assets/icons/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="assets/icons/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="assets/icons/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="assets/icons/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="assets/icons/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="assets/icons/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="assets/icons/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="assets/icons/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
```

> Keep an eye on WebKit Feature Status for tracking the progress of the implementation of web standards. For instance; once Web App Manifest specs is implemented on WebKit, you won’t need to use the custom meta tags above anymore. Track the progress here: https://webkit.org/status/#?search=manifest

## Add meta tags for the status bar on iOS

You can customize iOS status bar of your PWA by using `apple-mobile-web-app-status-bar-style` meta tag in your index.html file. This meta tag has no effect unless you specify full-screen mode aka standalone for your PWA.

View of the status bars; `black-translucent`, `white`, and `black`;

![View of the status bars](https://cdn-images-1.medium.com/max/1600/1*DmaoahB1qXMpZgt2X2gq9Q.png)

Add the following meta tag to your index.html file;

```html
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

## Good to go 🎯
Now you can continue to Step 4 -> [Display A2HS on iOS](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-4/README.md). 
