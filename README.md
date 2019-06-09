# Step 1

## Add @angular/pwa schematic

The first thing you need to do on your existing Angular app to transform it into a Progressive Web App is, adding @angular/pwa schematic to your app.

Simply run **add** command on your Angular CLI.

```bash
npm run ng add @angular/pwa
```

## Acknowledge local changes

Running `ng add @angular/pwa` creates the following files for your application;

```
ngsw-config.json
src/assets/icons/icon-128x128.png
src/assets/icons/icon-144x144.png
src/assets/icons/icon-152x152.png
src/assets/icons/icon-192x192.png
src/assets/icons/icon-384x384.png
src/assets/icons/icon-512x512.png
src/assets/icons/icon-72x72.png
src/assets/icons/icon-96x96.png
src/manifest.json
``` 

It will also tweak your `angular.json`, `index.html` and `app.module.ts` files accordingly. 
Please take a look at your local diff by running `git status` and `git diff`.

## Update angular.json

Change the path in the `ngswConfigPath` config in `angular.json` file from `/ngsw-config.json` to `ngsw-config.json`.
Test the production build by running `npm run build -- --prod`. If no error shows up, continue.

## Good to go 🎯
Now you can continue to Step 2 -> [Change web app manifest](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-2/README.md). 
