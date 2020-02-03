import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserData } from './providers/user-data';
import { SwPush, SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Schedule',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Speakers',
      url: '/app/tabs/speakers',
      icon: 'contacts'
    },
    {
      title: 'Map',
      url: '/app/tabs/map',
      icon: 'map'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }
  ];
  loggedIn = false;
  dark = false;
  deferredPrompt;
  notificationToast: HTMLIonToastElement;
  isInstallPromotionDisplayed = false;
  showBackdrop = false;
  Notification = Notification;
  pushUsersCollection: AngularFirestoreCollection<PushUser>;

  constructor(
    private menu: MenuController,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private toastController: ToastController,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private alertController: AlertController,
    private db: AngularFirestore,
  ) {
    this.pushUsersCollection = db.collection<PushUser>('pushUsers');
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
    await this.showIosInstallBanner();
    this.handleAppUpdate();
    this.hijackInstallPrompt();
    this.subscribeToWebPush();
    this.subscribeToNotificationClicks();
    this.subscribeToPushMessages();
    this.setExperimentalAppBadge();
  }

  handleAppUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(async (event: UpdateAvailableEvent) => {
        const alert = await this.alertController.create({
          header: `App update!`,
          message: `Newer version - v${((event.available.appData) as any).version} is available.
                    Change log: ${((event.available.appData) as any).changelog}`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            }, {
              text: 'Refresh',
              handler: () => {
                this.swUpdate.activateUpdate().then(() => window.location.reload());
              },
            },
          ],
        });

        await alert.present();
      });
    }
  }

  async showIosInstallBanner() {
    // Detects if device is on iOS
    const isIos = () => {
      return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    };

    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && ((window as any).navigator.standalone);

    // Show the banner once
    const isBannerShown = await this.storage.get('isBannerShown');

    // Checks if it should display install popup notification
    if (isIos() && !isInStandaloneMode() && isBannerShown == null) {
      const toast = await this.toastController.create({
        showCloseButton: true,
        closeButtonText: 'OK',
        cssClass: 'custom-toast',
        position: 'bottom',
        message: `To install the app, tap "Share" icon below and select "Add to Home Screen".`,
      });
      toast.present();
      this.storage.set('isBannerShown', true);
    }
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }

  hijackInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 76 and later from showing the mini-infobar
      e.preventDefault();

      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;

      // Toggle the install promotion display
      this.showInstallPromotion();
    });
  }

  showInstallPromotion() {
    this.isInstallPromotionDisplayed = true;
  }

  showInstallPrompt() {
    this.showBackdrop = true;

    // Show the prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // Hide the install promotion UI as user just installed it
          this.isInstallPromotionDisplayed = false;
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
        this.showBackdrop = false;
      }).catch(() => {
      this.showBackdrop = false;
    });
  }

  subscribeToWebPush() {
    if ('Notification' in window && Notification.permission === 'granted') {

      this.swPush.requestSubscription({
        serverPublicKey: 'BNkLamK-YMWgX47j3xx9bjhHpPWqtEuR-9rMsXx6L-0-KdYY1RcqydKt7hQEyAiaP8XuJVlX4dqtKP6NNaZSZQM',
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

  requestNotificationPermission() {
    // We will use the backdrop to create user focus on permission dialog
    this.showBackdrop = true;

    if ('Notification' in window) {
      Notification.requestPermission().then((permission: NotificationPermission) => {
        this.showBackdrop = false;

        if (permission === 'granted') {
          console.log('Notification permission is granted');

          // Since we have the permission now, let's subscribe to Web Push server
          this.subscribeToWebPush();
        } else {
          console.log('Notification permission is not granted: ', permission);
        }
      }).catch((err) => {
        console.log('Error on requestNotificationPermission', err);
        this.showBackdrop = false;
      });
    }
  }

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
      // Hide the internal message when an action is tapped on system notification
      if (this.notificationToast) {
        this.notificationToast.dismiss();
      }
    });
  }

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

  addPushUser(pushUser: PushUser) {
    return this.pushUsersCollection.doc(pushUser.subscription.keys.auth).set(pushUser, { merge: true });
  }

  setExperimentalAppBadge() {
    if ('setExperimentalAppBadge' in navigator) {
      const unreadCount = 4;
      // @ts-ignore
      navigator.setExperimentalAppBadge(unreadCount);
    }
  }
}
