# Step 13 - Add maskable icons

If you’re running Android O or later, and you’ve installed a Progressive Web App, you’ve probably noticed the annoying white circle around the icon.

<img width="71" alt="13-1-annoyance" src="https://user-images.githubusercontent.com/2641384/73658301-631a6600-4694-11ea-8283-2f8cce9cdc27.png">

That issue has been addressed with a new specification called `maskable icons` on Web App Manifest API. 

Starting with Chrome 79, Chrome now supports maskable icons for installed Progressive Web Apps. You can read more about it on [Chrome web updates blog](https://developers.google.com/web/updates/2019/12/nic79#maskable-icons). 

Furthermore, [Maskable Icons: Android Adaptive Icons for Your PWA](https://css-tricks.com/maskable-icons-android-adaptive-icons-for-your-pwa/) article on CSS-tricks explains all of the details, and has a great tool you can use for testing your icons to make sure they’ll fit.

## Update Web App Manifest file to provide a maskable icon

We're going to make a small change in our `manifest.webmanifest` file to introduce the maskable icons feature.

We need to add a new property for each icon we have in our manifest file with the name of `purpose`. 

We're going to use the value `maskable any`, to declare that both of the icons can be used as a maskable icon and also as a regular icon.

Open `manifest.webmanifest` file and add `"purpose": "maskable any"` line for each icon.

Your icons array should look like the following:

```json
"icons": [
  {
    "src": "assets/pwa/manifest-icon-192.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "maskable any"
  },
  {
    "src": "assets/pwa/manifest-icon-512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "maskable any"
  }
]
```

## Uninstall the Conf App and re-install it

First, let's re-build our app by executing `npm run build:serve:https` to reflect our changes in manifest file.

Uninstall the Conf app on the home screen by tapping and holding on to it in device emulator, and dragging it to `Uninstall` bin.

Refresh the PWA in Chrome and install it again using the promotional UI in the sidebar menu.

You might have noticed the first difference on the install prompt of Android. Our icon have a better fitting in the circle viewport. This is already a good sign of maskable icons being used.

<img width="505" alt="13-2-diff-on-prompt" src="https://user-images.githubusercontent.com/2641384/73658302-631a6600-4694-11ea-9933-4e1e398ac452.png">

Proceed with adding it to home screen and enjoy much better user experience and native-like look and feel with your new maskable icon set.

<img width="511" alt="13-3-diff-on-hs" src="https://user-images.githubusercontent.com/2641384/73658304-63b2fc80-4694-11ea-90f3-c0ece6129aa4.png">

## Optional: Use a different design for the maskable icons 

It's up to you to declare which icons in the array will be used as maskable icons. 

You can provide more items, some of them aiming default behaviour without having a `"purpose"` field - that is the same as `"purpose": "any"`. And, some others having only `"purpose": "maskable"`.

## Good to go 🎯

Now you can continue to Step 14 -> [Subscribe to push notifications and manage permission](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-14/README.md).
