# Step 16 - Save push subscriptions in a DB

You have already experienced that copying and pasting the push subscription every time for a client is not optimal.

We need to keep our users' push subscriptions in a database and query them to send push notifications to all our users. 

In this step, we're going to create a new DB on Firebase to collect push subscirption data. After that, we will adjust our `sendPush` script to query all the subscriptions first and then send a notification to all subscription.

By doing so, we will be getting rid of manual copy/paste procedure of subscription object that we were experimenting with in previous step.

## Create a new database

Navigate to `Database` page using side navigation. Click on `Create database` button.

<img width="959" alt="16-1-create-db" src="https://user-images.githubusercontent.com/2641384/73678720-3c225b00-46b9-11ea-824a-39fe9147b84b.png">

### Choose a security rule to start with

Choose `Start in test mode` for testing purposes. 

<img width="963" alt="16-2-test-mode" src="https://user-images.githubusercontent.com/2641384/73678721-3cbaf180-46b9-11ea-85cf-5763f41ce337.png">

> Note that, you need to adjust your database's security rules before going to production environment. Read more about [Structuring Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-structure). 

### Create a new collection

Click on `Start collection` on your Firebase console. Set the name `pushUsers` for the **Collection ID**.

<img width="960" alt="16-3-start-collection" src="https://user-images.githubusercontent.com/2641384/73678723-3cbaf180-46b9-11ea-84f5-fc131353ac54.png">

### Initialize Firebase configuration files

Now that we have set up the Firestore DB on console, we can introduce the project files to our app. 

Run `npx firebase init` on your console in your project root and select `Firestore` from the list of services. 

Proceed with the default config. You should have 2 new files:

```
firestore.indexes.json
firestore.rules
```

Now you can configure your DB over those files and deploy the new settings by running `npx firebase deploy`.

## Save each push subscription to the DB

The easiest way to interact with a Firebase service within Angular project is [using @angular/fire package](https://github.com/angular/angularfire/).

### Install @angular/fire

Execute the following command to install **@angular/fire**:

```
npm install firebase @angular/fire --save
```

### Configure @angular/fire

`@angular/fire` requires a specific project configuration as it's described on it's [Install and Setup docs](https://github.com/angular/angularfire/blob/master/docs/install-and-setup.md).

* Navigate to `Firebase Console` to copy your project id.

<img width="1038" alt="project-id" src="https://user-images.githubusercontent.com/2641384/74479818-275f7780-4eb0-11ea-9c5f-d7ccff9d8127.png"> 

* Open `environment.ts` and `environment.prod.ts` files and add the following config to the env object, pasting your firebase project id:

```typescript
firebase: {
  projectId: '⚠️ PUT YOUT FIREBASE PROJECT ID HERE ⚠️'
}
```

* Open `app.module.ts` file and import/add 2 new modules from `@angular/fire` package:

```typescript
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
})
```

## Save push subscriptions to the DB

We're going to store push subscriptions in the `pushUsers` collection we created in our DB.

Open `app.component.ts` file and add the following import statements and interface declaration:

```typescript
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

interface PushUser {
  subscription: {
    endpoint: string;
    expirationTime: number | null;
    keys: {
      auth: string;
      p256dh: string;
    }
  };
}
```

### Create a collection reference

Within `app.component.ts` file, inject the `AngularFirestore` service and create a new collection reference:

```typescript
pushUsersCollection: AngularFirestoreCollection<PushUser>;

constructor(
    private db: AngularFirestore,
  ) {
    this.pushUsersCollection = db.collection<PushUser>('pushUsers');
  }
```

Over the collection reference we can query the documents, save new documents and do more. Let's save our subscription as a new document using it.

### Save subscription as a new document

Add the new method `addPushUser` below to your `app.component.ts` file:

```typescript
addPushUser(pushUser: PushUser) {
  return this.pushUsersCollection.doc(pushUser.subscription.keys.auth).set(pushUser, { merge: true });
}
```

Update `subscribeToWebPush()` method with the content below to call the new `addPushUser` method:
```typescript
subscribeToWebPush() {
  if ('Notification' in window && Notification.permission === 'granted') {

    this.swPush.requestSubscription({
      serverPublicKey: `⚠️ PUT YOUR FIREBASE_WEB_PUSH_PUBLIC_VAPID_KEY HERE ⚠️`,
    }).then((sub) => {
      const subscription = JSON.parse(JSON.stringify(sub));
      console.log('subscribeToWebPush successful');
      console.log(subscription);
      this.addPushUser({ subscription });
    }).catch((err) => {
      console.log('subscribeToWebPush error', err);
    });
  }
}
```

Normally, adding a new item as a document to our collection is as easy as calling `this.pushUsersCollection.add(pushUser)`. However, this creates a new document with a different doc id every time, with the same subscription data.

By using `pushUser.subscription.keys.auth` variable as a document id and providing `merge: true` option, we make sure we don't have duplicate entries for the same subscription.

### Test the db entries

* Build and serve your app by running `npm run build:serve:https`. 
* Navigate to https://localhost on your desktop and to https://10.0.2.2 on your emulated device.
* Open the database UI on your firebase console. 
* You should have 2 different documents in your collection.

<img width="1283" alt="16-4-push-docs" src="https://user-images.githubusercontent.com/2641384/73697529-14de8480-46df-11ea-89c7-062b18178cfa.png">

## Query the DB and send batch notifications to all subscribers

We still need to update our `sendPush.js` script to send the push notifications using the list of documents stored in our Firestore DB.

### Add new environment variables

Open `.env` file and add the following environment variables:

```
FIREBASE_PROJECT_ID="⚠️ PUT YOUT FIREBASE PROJECT ID HERE ⚠️"
FIREBASE_FIRESTORE_COLLECTION_NAME="pushUsers"
```

### Update the sendPush script

We're going to query all the documents from our collection to retrieve a list of subscriptions.
Finally, we will send a message to each subscription using `webpush`. 

Open `sendPush.js` file and replace the file contents with the code below:

```typescript
const webpush = require('web-push');
const firebase = require('firebase/app');
require('firebase/firestore');

(async () => {
  webpush.setGCMAPIKey(process.env.FIREBASE_SERVER_API_KEY);
  webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_FOR_SUBJECT}`,
    process.env.FIREBASE_WEB_PUSH_PUBLIC_VAPID_KEY,
    process.env.FIREBASE_WEB_PUSH_PRIVATE_VAPID_KEY
  );

  const notificationPayload = {
    notification: {
      title: 'Session is about the start 🏃‍♀️',
      body: '"Community Interaction" by Gino Giraffe is starting in Hall 3.',
      icon: 'assets/pwa/manifest-icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
      },
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
    }
  };

  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
  };

  firebase.initializeApp(firebaseConfig);
  const pushUsersRef = firebase.firestore().collection(process.env.FIREBASE_FIRESTORE_COLLECTION_NAME);

  const pushUsersSnapshot = await pushUsersRef.get();
  const pushUsers = pushUsersSnapshot.docs;
  let successCount = 0;

  for (let i = 0; i < pushUsers.length; i++) {
    try {
      await webpush.sendNotification(pushUsers[i].data().subscription, JSON.stringify(notificationPayload));
      successCount++;
    } catch (error) {
      if (error.body.includes('push subscription has unsubscribed')) {
        await pushUsersRef.doc(pushUsers[i].data().subscription.keys.auth).delete();
      } else {
        console.log(e);
      }
    }
  }

  console.log(`Message is sent to ${successCount} of ${pushUsersSnapshot.size} subscribers`);
  if (pushUsersSnapshot.size - successCount > 0) {
    console.log(`Removed ${pushUsersSnapshot.size - successCount} of expired subscriptions`);
  }
  process.exit(0);
})();
```

### Test sending batch push messages

Open your app on as much as device as you can. Execute `npm run push`. 
You should be getting the push notification on each of your test devices. 

## Good to go 🎯

Now you can continue to Step 17 -> [Use an API from project Fugu](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-17/README.md).
