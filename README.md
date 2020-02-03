# Congratulations! 🎉

Woah, what a journey it was! Thanks for completing the workshop 🙌 You've done an amazing job!!

## What's next?

Since we've explored the edges of PWA development, it's very important to see the behaviour of our app on multiple platforms.

* Install your PWA on different devices and platforms, including mobile and desktop.
* Release an update to your PWA and test the update flow on your device.
* Inspect the bundle size of your app on the OS of your mobile device.

### Introduce a notification opt-out feature

Now that we've introduced a DB to our app, we can keep user preference for receiving push notifications. You can change the notification toggle's behaviour in the side menu to allow users to unsubscribe from push notifications.

You need to use `swPush.unsubscribe()` and remove then push subscription from the collection in your db when user turn offs the subscription.

### Introduce a background service to send reminder notifications for user's favorite sessions

You can leverage the nature of a service worker by using it to send notifications to your users even if your app is offline.

[Check out the service worker implementation of mine](https://github.com/LINKIT-Group/itnext-summit-app/blob/master/src/app/sw/main-sw.js#L5-L82) to see how I implemented sending reminder notifications for the favorite sessions of the users, 5 minutes before each of them.

Try to introduce the same feature to your app!  

### Participate in Web Capabilities codelab

Google leads a project called Fugu in order to close the capability gap of PWAs compared to native applications. [Read more about it here](https://developers.google.com/web/updates/capabilities).

Participate in the [Web Capabilities codelab](https://codelabs.developers.google.com/codelabs/web-capabilities/) and introduce what you've learned from there to this app.

### Explore further Web APIs

[Check out the Web Payments API implementation of mine](https://github.com/LINKIT-Group/itnext-summit-app/blob/master/src/app/utils/ticket-sale.ts) and try to introduce the same feature to your app!

Furthermore, check out https://tomayac.github.io/pwa-feature-detector/ and https://whatwebcando.today/ to see some great set of Web APIs and introduce the ones that are interesting to you to this app.

### Keep in contact

I love PWAs and I enjoy sharing latest developments in web and javascript world. 

Connect with me on [Twitter](https://twitter.com/onderceylan), [LinkedIn](https://www.linkedin.com/in/onderceylan/) and [Medium](https://medium.com/@onderceylan) for more web content like this. Cheers!
