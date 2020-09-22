import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserData } from './providers/user-data';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';

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
      icon: 'people'
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
  isInstallPromotionDisplayed = false;

  constructor(
    private menu: MenuController,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private toastController: ToastController,
    private swUpdate: SwUpdate,
    private alertController: AlertController,
  ) {}

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
    await this.showIosInstallBanner();
    this.handleAppUpdate();
    this.hijackInstallPrompt();
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
        buttons: [{
          text: 'OK',
          role: 'cancel'
        }],
        cssClass: 'custom-toast',
        position: 'bottom',
        message: `To install the app, tap "Share" icon below and select "Add to Home Screen".`,
      });
      await toast.present();
      await this.storage.set('isBannerShown', true);
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
      });
  }
}
