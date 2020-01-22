# Step 5 - Add asset groups for app shell and icons

In this step, we're going to configure `ngsw-config.json` file based on [Angular's NGSW docs](https://angular.io/guide/service-worker-config). We'll define a cache strategy for our application shell and other static assets.

## Understanding asset groups in NGSW architecture

> Assets are resources that are part of the app version that update along with the app. They can include resources loaded from the page’s origin as well as third-party resources loaded from CDNs and other external URLs.
> 
> — [Angular docs](https://angular.io/guide/service-worker-config#assetgroups)

Asset groups follow the Typescript interface shown here:

```typescript
interface AssetGroup {
  name: string;
  installMode?: 'prefetch' | 'lazy';
  updateMode?: 'prefetch' | 'lazy';
  resources: {
    files?: string[];
    urls?: string[];
  };
}
```

Depending on the policy by which they are cached, you can introduce either `lazy` or `prefetch` strategy on each of your asset group. Resources on service worker configuration accept [glob-like patterns](https://angular.io/guide/service-worker-config#glob-patterns) that match a number of files, like;

```json
{
  "assetGroups": [
    {
      "name": "shell",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/*.css",
          "/vendor.*.js",
          "/runtime.*.js",
          "!/*-sw.js"
        ]
      }
    }
  ]
}
```

## Add asset group for app shell

### App shell model

> An application shell (or app shell) architecture is one way to build a Progressive Web App that reliably and instantly loads on your users' screens, similar to what you see in native applications.
>  
> The app "shell" is the minimal HTML, CSS and JavaScript required to power the user interface and when cached offline can ensure instant, reliably good performance to users on repeat visits. This means the application shell is not loaded from the network every time the user visits. Only the necessary content is needed from the network.
> 
> — [The App Shell Model on Web Fundamentals](https://developers.google.com/web/fundamentals/architecture/app-shell)

![Application Shell Model](https://developers.google.com/web/fundamentals/architecture/images/appshell.png)

For a typical minimal app shell, devices load `index.html`, layout css files, vendor and app JS files and some more static assets like `favicon`. We need to determine which files of our application shell are required to be cached on `prefetch`.

### Add app shell asset group to ngsw-config.json

Run `npm run build:prod` and observe the output to see which files can be cached for the app shell. In addition, navigate to `www` output folder of the project and observe the static assets that should be part of app shell over there.

Open `ngsw-config.json` file and extend the following config;

```json
{
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    }
  ]
}
```

* Rename the cache name `app` to `appshell`.
* Add `/vendor.*.js`, `/common.*.js`, `/main.*.js`, `/runtime.*.js`, `/*polyfills.*.js` globs to files array.
* Rename `/*.css` glob to `/styles.*.css` in files array.
* Remove `/*.js` from files array.

## Add asset group for lazy loaded Angular modules

After observing the output in `www` folder, you might have noticed that there are many JS files like `1.ab41d3de4a68c5501412.js`. These files are lazy loaded modules of the app.

We're going to introduce another asset group with a different cache strategy - `lazy` to handle lazy loaded modules.

Add the following asset group to `assetGroups` array of `ngsw-config.json` file;

```json
{
  "name": "modules",
  "installMode": "lazy",
  "updateMode": "prefetch",
  "resources": {
    "files": [
      "/*.js",
      "!/vendor.*.js",
      "!/common.*.js",
      "!/main.*.js",
      "!/runtime.*.js",
      "!/*polyfills.*.js"
    ]
  }
}
```

By doing this, we exclude the JS files that we've declared as part of our `appshell` asset group but match all other files with .js extension.

## Add asset group for icons

We also need to introduce an additional asset group for caching image assets. Open `ngsw-config.json` file and change the group with the name of `assets` into following;

```json
{
  "name": "assets",
  "installMode": "lazy",
  "updateMode": "prefetch",
  "resources": {
    "files": [
      "/assets/**/*.(svg|jpg|png|webp|gif)",
      "/svg/**"
    ]
  }
}
```

## Test the results

Once you're done with changing the config file in any of the steps, you can test it by building the app for production. 

Run `npm run build:serve` to spin off an http server for your production build. Open `http://127.0.0.1:8080` in your browser to inspect the app. You should still be able to load the application shell when app is offline. 

## Good to go 🎯
Now you can continue to Step 6 -> [Add data group for conference data](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-6/README.md). 
