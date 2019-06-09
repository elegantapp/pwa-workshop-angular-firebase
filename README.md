# Step 6

In this step, we're going to configure `ngsw-config.json` file based on [Angular's NGSW docs](https://angular.io/guide/service-worker-config). We'll define a cache strategy for our application's data resources.

## Understanding data groups in NGSW architecture

> Unlike asset resources, data requests are not versioned along with the app. They're cached according to manually-configured policies that are more useful for situations such as API requests and other data dependencies.
> 
> — [Angular docs](https://angular.io/guide/service-worker-config#datagroups)

Data groups follow this Typescript interface:

```typescript
export interface DataGroup {
  name: string;
  urls: string[];
  version?: number;
  cacheConfig: {
    maxSize: number;
    maxAge: string;
    timeout?: string;
    strategy?: 'freshness' | 'performance';
  };
}
```

What I would like to stress here is, the caching strategies for data resources. Angular service worker is designed with brevity in mind, therefore it provides 2 caching strategies.

### Caching strategy: Performance

> Suitable for resources that don’t change often; for example, user avatar images.
>
> — [Angular docs](https://angular.io/guide/service-worker-config#strategy)

![Performance strategy](https://cdn-images-1.medium.com/max/1600/1*tQBcZt0HlpnrbHz9KxAFEg.png)

`performance`, the default, optimizes for responses that are as fast as possible. If a resource exists in the cache, the cached version is used. This allows for some staleness, depending on the `maxAge`, in exchange for better performance. This is suitable for resources that don't change often; for example, user avatar images.

### Caching strategy: Freshness

> Useful for resources that change frequently; for example, account balances.
>
> — [Angular docs](https://angular.io/guide/service-worker-config#strategy)

![Freshness strategy](https://cdn-images-1.medium.com/max/1600/1*I6rc4R5HBixBdZbRpwZBCw.png)

`freshness`, optimizes for currency of data, preferentially fetching requested data from the network. Only if the network times out, according to `timeout`, does the request fall back to the cache.

## Add data group for conference data

Our app uses a static data source that is located at `/assets/data/data.json`. 

We're going to introduce a data group with a `performance` cache strategy as this data source does not change often.

Add the following section to the `ngsw-config.json` file;

```json
{
  "dataGroups": [
    {
      "name": "conf-data",
      "version": 1,
      "urls": ["/assets/data/data.json"],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 10,
        "maxAge": "3h",
        "timeout": "3s"
      }
    }
  ]
}
```

With the example above, data received from a static json file, will be cached with a performance strategy for a maximum of 10 responses, maximum cache age of 3 hour, and a timeout of 3 seconds, after which the result will fallback to the cache. 

> `performance` is a `cache-first` strategy, and alternatively you can use `freshness` as a `network-first` strategy.

## Test the results

Once you're done with changing the config file, you can test it by building the app for production. 

Run `npm run build -- --prod` and run `npx http-server ./www` to spin off an http server for your production build. Open `http://127.0.0.1:8080` in your browser to inspect the app.

## Good to go 🎯

Now you can continue to Step 7 -> [Add data group for conference data]([Extend NGSW](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-7/README.md)). 
