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

  await Promise.all(pushUsers.map((sub) => {
     return webpush.sendNotification(sub.data().subscription, JSON.stringify(notificationPayload));
  }));

  console.log(`Message sent to  ${pushUsersSnapshot.size} clients`);
  process.exit(0);
})();
