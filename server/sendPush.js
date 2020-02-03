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
