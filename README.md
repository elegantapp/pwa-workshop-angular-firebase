# Step 17 - Use an API from project Fugu

In this step, you're free to implement any of the APIs from project Fugu. Fugu is a special project that is started by Google to fill the gap between native app capabilities and PWA capabilities.
Read more about [Unlocking new capabilities for the web](https://developers.google.com/web/updates/capabilities) on Google Developers.

Navigate to [Fugu API Tracker](https://goo.gle/fugu-api-tracker) and select a brand new API which is in origin trial stage. 

> Be aware of the aimed platform of the API and choose an API targeting both desktop and mobile platforms if possible.   

## Opt-in for origin trials

* Navigate to [Chrome Origin Trials](https://developers.chrome.com/origintrials/#/trials/active) and locate the API that you've decided to experiment with.
* Click on `REGISTER` button.
* Enter the web origin `https://localhost` if you'd like to test on desktop.
* Choose the expected usage of the API.
* Accept the terms and proceed.
* Copy the token to your clipboard.

<img width="785" alt="17-badging-origin-trial" src="https://user-images.githubusercontent.com/2641384/73699163-67ba3b00-46e3-11ea-949d-48edb75dfc48.png">

> You need to create a new token if you'd like to test on emulated device as well, as it has a different web origin - https://10.0.2.2

## Add the origin trial meta tag to your app

Open your `index.html` file and paste the following meta tag to the `head` of your HTML:

```html
<meta http-equiv="origin-trial" content="the_token_from_your_clipboard">
```

> If your app is used on multiple origins, you can paste multiple origin-trial tags with different tokens generated for each web origin.

## Implement the API interface

Navigate to the docs of the chosen API and implement the API interface in your app. 

An example of implementation of one of the Fugu APIs being in origin trial by the time of preparing this workshop - Badging API v2 can be seen below:

```typescript
setExperimentalAppBadge() {
  if ('setExperimentalAppBadge' in navigator) {
    const unreadCount = 4;
    // @ts-ignore
    navigator.setExperimentalAppBadge(unreadCount);
  }
}
```

<img width="447" alt="17-badging-look" src="https://user-images.githubusercontent.com/2641384/73699949-7a357400-46e5-11ea-89e0-a9da83e9e64f.png">

## Congratulations! 🎉

Thanks for completing the workshop! You're amazing!!!

Please continue to `final` branch to see the complete solution and final message -> [What's next?](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/final/README.md).
