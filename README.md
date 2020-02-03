# Step 15 - Send and receive push notifications

In previous chapter, we have done all the necessary preparations on the client side to receive a push notification. 

In this step, we will build the server side foundation to send a notification and we will improve our UI to create better engagements and interactions over the received notifications.

## Send VAPID identified Web Push notifications

We need to build a server side script to send the push notifications by using the keys that we generated in previous step. Those are required for VAPID identification. 

![VAPID identification](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/application-server-key-send.svg)

We will also use the push subscription we receive on our client when we call `requestSubscription()` over NGSW's SwPush service.

A Push subscription is literally the destination definition for our messages.

### Install web-push library

[web-push](https://github.com/web-push-libs/web-push/) is a library we're going to use to simplify the identification and the request flow needed for sending Web Push notification. 

It automates the authentication and modifies the request headers required for sending a push notification request.

Execute the following command to install the package along with dotenv for the constants to use with:

```
npm i -D web-push dotenv
```

### Create a new env file

We should always keep our keys and secret and ideally other environment related configuration variables in a `.env` file in our project. 

This will not only help us to keep variables secure, it will also help on configuring variables on a server environment later on.

Create a new file with the name `.env` in your project's root folder. Add the following content to it:

```
FIREBASE_SERVER_API_KEY="put-your-key-from-your-notes-here"
FIREBASE_WEB_PUSH_PUBLIC_VAPID_KEY="put-your-key-from-your-notes-here"
FIREBASE_WEB_PUSH_PRIVATE_VAPID_KEY="put-your-key-from-your-notes-here"
EMAIL_FOR_SUBJECT="put-your-email-address-here"
```

You should update the variables with the earlier notes you took.

Update `.gitignore` file and add `.env` field to the list of ignored files.

### Create a new server script

Create a new file with the name `sendPush.js` in `server` folder.


Add the following code block to the new `sendPush.js` file:

```javascript
const webpush = require('web-push');

webpush.setGCMAPIKey(process.env.FIREBASE_SERVER_API_KEY);
webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_FOR_SUBJECT}`,
  process.env.FIREBASE_WEB_PUSH_PUBLIC_VAPID_KEY,
  process.env.FIREBASE_WEB_PUSH_PRIVATE_VAPID_KEY
);

// This is the output of calling JSON.stringify on a PushSubscription you receive on your client
// Copy paste the console log of push subscription from the receiver client here
const pushSubscription = {
  endpoint: '...',
  keys: {
    auth: '...',
    p256dh: '...'
  }
};

const notificationPayload = {
  notification: {
    title: 'Session is about the start 🏃‍♀️',
    body: '"Community Interaction" by Gino Giraffe is starting in Hall 3.',
    icon: 'assets/pwa/manifest-icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
    },
    actions: []
  }
};

webpush.sendNotification(pushSubscription, JSON.stringify(notificationPayload));
```

### Send a push notification

Now it's time to test sending the push notification on either your desktop or emulated mobile device, or both! 

Navigate to your PWA on the device you'd like to test and inspect the console logs there.

<img width="592" alt="15-1-push-subs" src="https://user-images.githubusercontent.com/2641384/73658344-73cadc00-4694-11ea-8878-0884dbc740a6.png">

Copy the stringified PushSubscription object to your `sendPush.js` script.

Execute the script by running the following command from your root directory:

```
node -r dotenv/config server/sendPush.js
```

You should be seeing the pushed notification on your mobile device. 

<img width="504" alt="15-2-push-test" src="https://user-images.githubusercontent.com/2641384/73658345-73cadc00-4694-11ea-9a7f-ba225478caf3.png">

Now close the Conf app and test sending the push notification again. Thanks to service workers working on a background thread, you should be still getting the push notification even though the app is closed.

### Update package.json

As we're going to execute sending push notifications more often, let's move our script to a new npm script in the package.json file.

Open `package.json` file and add the following script amongst `scripts`:

```json
"push": "node -r dotenv/config server/sendPush.js"
```

From now on, we will execute `npm run push` to send push notifications.

## Add actions to your notifications

Notifications can introduce additional actions for the users. We're going to leverage this feature by adding 2 actions to our notification payload.

We're going to provide the `action` data in a format of `actionType:id`. We'll be using those fields during the following steps.

Open `sendPush.js` file and change the `actions` array in notification payload object with the following:

```json
actions: [
  {
    action: 'session:10',
    title: 'Session info 👉',
  },
  {
    action: 'speaker:6',
    title: 'Speaker info 🗣',
  }
]
```

Execute the script by running the following command from your root directory:

```
npm run push
```

You should now see a notification with 2 actions, pushed to your device. 

<img width="508" alt="15-3-push-actions-diff" src="https://user-images.githubusercontent.com/2641384/73658346-73cadc00-4694-11ea-9a6f-e766119889b2.png">

### Optional: Experiment with `text` action type

Replace actions array with the following to experiment with the `text` action type.

```json
actions: [
  {
    action: 'reply',
    type: 'text',
    title: 'What\'s your name? 👇',
    placeholder: 'Respond to organizers',
  }
]
```

Test the new action on both your desktop and mobile browser.

## Handle notification clicks

When you click on the notification or on any of the recently added actions, nothing happens for now because we haven't handled the notification clicks yet. 

We're going to setup a notification click handler to navigate to certain pages based on **action type** and **id** values we get from notification actions.

### Add a notification click handler 

Angular's `SwPush` service has [a built-in notification handler interface](https://angular.io/api/service-worker/SwPush#notificationClicks) and we're going to implement it in our app.

Open `app.component.ts` file and add the following 2 methods:

```typescript
navigateOnNotificationClick(notificationAction: string) {
  const [action, id] = notificationAction.split(':');

  if (action === 'speaker') {
    this.router.navigateByUrl(`/app/tabs/speakers/speaker-details/${id}`);
  } else if (action === 'session') {
    this.router.navigateByUrl(`/app/tabs/schedule/session/${id}`);
  }
}

subscribeToNotificationClicks() {
  this.swPush.notificationClicks.subscribe(msg => {
    console.log('notification click', msg);

    // If there's no action in notification payload, do nothing
    if (!msg.action) {
      return;
    }

    this.navigateOnNotificationClick(msg.action);
  });
}
```

Also, navigate to `ngOnInit()` method to add `subscribeToNotificationClicks()` call on component init:

```typescript
async ngOnInit() {
  this.subscribeToNotificationClicks();
}
```

### Test the notification clicks

Execute `npm run build:serve:https` in your command line OR `npm run build:prod` if your HTTPS server is already running.

You might need to close the app and restart again to see your  changes take place.

Send a new push notification by running `npm run push` and click on any of the actions in your device over the received push notification.

Now, you can see your app navigating to different pages based on the action type and id you provide within your notification payload.

However, there's one UX issue we need to tackle. If our app is in the background, an action click does not bring our app in front. It still handles the navigation but we can only see the navigated page once we bring the app to the foreground again.

## Extend NGSW capabilities with `focus to app on notification click` feature

Angular's `SwPush` service does not implement [`openWindow` interface of Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Clients) neither the [focus method](https://developer.mozilla.org/en-US/docs/Web/API/WindowClient/focus). This prevents focusing to our app on a notification click.

We need to extend NGSW's capability to focus on our PWA on notification click.

### Implement a custom Service Worker functionality to handle focus

Open `src/sw/main-sw.js` file to add your custom service worker code. Replace the file contents with the block below:

```javascript
importScripts('ngsw-worker.js');

function navigateOnNotificationClick(notificationAction) {
  const [action, id] = notificationAction.split(':');

  if (action === 'speaker') {
    return clients.openWindow(`/app/tabs/speakers/speaker-details/${id}`);
  } else if (action === 'session') {
    return clients.openWindow(`/app/tabs/schedule/session/${id}`);
  }

  return clients.openWindow(`/`);
}

addEventListener('notificationclick', event => {
  event.waitUntil(async function() {
    const allClients = await clients.matchAll({
      type: 'window'
    });
    console.log('Inspect all the clients attached to the sw', allClients);

    let pwaClient;

    // Focus if there's only one client
    if (allClients.length === 1) {
      pwaClient = allClients[0];
      pwaClient.focus();
    }

    // TODO: replace the code block above with the following when it's possible to preserve search params globally in Angular
    // https://github.com/angular/angular/issues/12664
    // for (const client of allClients) {
    //   const url = new URL(client.url);
    //   const utmSource = url.searchParams.get('utm_source');
    //   console.log(client, url);
    //
    //   if (utmSource === 'home_screen') {
    //     client.focus();
    //     pwaClient = client;
    //     break;
    //   }
    // }

    // If there's no active client, focus by calling openWindow()
    if (!pwaClient) {
      pwaClient = await openWindowByAction(event.action || (event.notification.actions && event.notification.actions.length ? event.notification.actions[0].action : null));
    }
  }());
});
```

The code above first checks if there's a client running on the device attached to the service worker and it focuses to it. If no client is running, it triggers a run by calling `openWindow()` method.

### Test the notification clicks

Execute `npm run build:serve:https` in your command line OR `npm run build:prod` if your HTTPS server is already running.

You might need to close the app and restart again to see your  changes take place.

Put your app in the background and send a new push notification by running `npm run push`. Click on any of the actions in your device over the received push notification.

Now, you can see your app coming in to foreground.

<img width="507" alt="15-4-push-click" src="https://user-images.githubusercontent.com/2641384/73658347-74637280-4694-11ea-96a3-f80933a229f5.png">

Repeat the same flow by first closing the app and then sending a push notification to test the `openWindow()` functionality.

## Receive notifications in your client app

You might have noticed that notifications do not pop up on mobile device by default. Even though this behaviour can be configured on the device; many devices don't pop up notifications at all if the app is in the foreground.

We're going to implement [SwPush service's `messages` interface](https://angular.io/api/service-worker/SwPush#messages) to display the pushed messages on an internal UI only when app is in the foreground. 

We will use [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) to detect the app being in the foreground or not.

### Display the push messages internally

Open `app.component.ts` file and add the following property and method:

```typescript
notificationToast: HTMLIonToastElement;

subscribeToPushMessages() {
  this.swPush.messages.subscribe((msg: {
    notification: NotificationOptions & {
      title: string;
    }
  }) => {
    console.log('Received a message in client app', msg);
    // Only display the toast message if the app is in the foreground
    if (document.visibilityState === 'visible') {
      const toast = this.toastController.create({
        showCloseButton: false,
        duration: 10000,
        cssClass: 'custom-toast',
        position: 'top',
        message: `${msg.notification.title}
<strong>${msg.notification.body}</strong>`,
        buttons: msg.notification.actions.map(actionEl => ({
          side: 'end',
          text: actionEl.title,
          handler: () => {
            this.navigateOnNotificationClick(actionEl.action);
          }
        })),
      });
      toast.then(res => {
        res.present();
        this.notificationToast = res;
      });
    }
  });
}
```

Also, navigate to `ngOnInit()` method to add `subscribeToPushMessages()` call on component init:

```typescript
async ngOnInit() {
  this.subscribeToPushMessages();
}
```

We assigned the toast message to a class property to be able to dismiss it over any other method in our class.

#### Hide the internal message when an action is tapped on system notification

We need to adjust one more thing in this step. When the app is in the foreground, it displays an internal UI. Toast message will be dismissed if user takes an action on it within the internal UI. 
However, if system notification action is clicked, our internal toast message still stays on the screen. We have to dismiss it on system notification click to provide a uniform experience.

Open `app.component.ts` file and navigate to `subscribeToNotificationClicks()` method. Replace the method with the following:

```typescript
subscribeToNotificationClicks() {
  this.swPush.notificationClicks.subscribe(msg => {
    console.log('notification click', msg);

    // If there's no action in notification payload, do nothing
    if (!msg.action) {
      return;
    }

    this.navigateOnNotificationClick(msg.action);
    // Hide the internal message when an action is tapped on system notification
    this.notificationToast.dismiss();
  });
}
```

### Test internal message display

Execute `npm run build:serve:https` in your command line OR `npm run build:prod` if your HTTPS server is already running.

You might need to close the app and restart again to see your  changes take place.

Put your app in the foreground and send a new push notification by running `npm run push`. 

<img width="504" alt="15-5-internal-msg-ui" src="https://user-images.githubusercontent.com/2641384/73658348-74637280-4694-11ea-8386-222c8ca1b8fe.png">

Now, put your app in the background and send another push notification. Open the app and you shouldn't see the internal message UI.

### Optional: Adjust the CSS of the toast message

As you might have noticed, the message displayed in the default toast UI is not really beautifully aligned. 

Add your own css to customize the look and feel of the message by using `custom-toast` css class.

## Good to go 🎯

Now you can continue to Step 16 -> [Save push subscriptions in a DB](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-16/README.md).
