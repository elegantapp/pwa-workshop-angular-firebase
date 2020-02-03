# Step 10 - Use an Android Emulator

In this step, we're going to test our PWA's behaviour on an emulated device environment.

In order to use an emulator, we have to install Android Studio first.

## Download Android Studio

Navigate to [Android Studio download page](https://developer.android.com/studio#downloads) and download the latest version for your OS.

## Install Android Studio

You need to customize the installation and select `Android Virtual Device` during the setup.

<img width="823" alt="10-1-install-android-studio" src="https://user-images.githubusercontent.com/2641384/73658069-e8514b00-4693-11ea-9a72-23385c3e7c32.png">

## Configure Android Studio SDK

Launch Android Studio, click `Configure` toggle with the gear icon and select `Preferences`.

<img width="692" alt="10-2-configure-android-studio" src="https://user-images.githubusercontent.com/2641384/73658127-120a7200-4694-11ea-9e65-a365612780f7.png">

### Install Android Emulator

Search for `sdk` in Preferences pane. And, using the search results, navigate to `Appereance & Behaviour` > `System Settings` > `Android SDK` menu.

<img width="1055" alt="10-3-sdk-tools-search" src="https://user-images.githubusercontent.com/2641384/73658170-2fd7d700-4694-11ea-84cf-e239917fb7c8.png">

Within `SDK Tools` pane, click the download icon next to `Android Emulator` to install the emulator library.

<img width="1063" alt="10-4-android-emulator" src="https://user-images.githubusercontent.com/2641384/73658171-2fd7d700-4694-11ea-899e-318a97d12efc.png">

## Create a Virtual Device using AVD

Launch Android Studio and launch `AVD Manager` from `Configure` toggle.

<img width="825" alt="10-5-launch-avd-manager" src="https://user-images.githubusercontent.com/2641384/73658173-2fd7d700-4694-11ea-90a5-74e3569f6454.png">

Click `Create Virtual Device` button on Android Virtual Device Manager.

<img width="693" alt="10-6-create-virtual-device" src="https://user-images.githubusercontent.com/2641384/73658174-2fd7d700-4694-11ea-9f71-c3a7913b7943.png">

### Select a hardware

From `Select Hardware` panel, search for `Pixel 2` and click `Next` to install and configure the hardware profile.

<img width="1027" alt="10-7-select-hardware" src="https://user-images.githubusercontent.com/2641384/73658175-2fd7d700-4694-11ea-9992-da3b7ffee23b.png">

## Launch the installed virtual device

Now you can see your installed hardware in the list of devices shown at `AVD Manager`.

<img width="689" alt="10-8-your-virtual-devices" src="https://user-images.githubusercontent.com/2641384/73658176-30706d80-4694-11ea-8594-1c0b8af2d5bc.png">

Click on the `Play/Launch` icon in the actions column to launch the emulator.

Your emulator is now ready to use.

<img width="512" alt="10-9-emulator-view" src="https://user-images.githubusercontent.com/2641384/73658177-30706d80-4694-11ea-8c1d-6bcaca9a5b78.png">

## Enable developer mode on your virtual device

Navigate to `Settings` > `About emulated device` screen on your emulated device.

Tap on `Build number` at the bottom of the screen 7 times to enable developer mode :) 

<img width="495" alt="10-10-build-number" src="https://user-images.githubusercontent.com/2641384/73658178-31090400-4694-11ea-846d-365a8f12be26.png">

You can find more information about Android Developer Mode and USB debugging on the article: [Enable Developer Mode and USB debugging](https://developer.android.com/studio/debug/dev-options.html#enable)

## Inspect Chrome via USB debugging

When developer mode is enabled, USB debugging is enabled for the emulated device automatically. 

You can start inspecting the Chrome tabs on your emulated device by opening `DevTools` on your desktop Chrome, and navigating to `Remote devices` panel.

Once you click `Android SDK built for x86` device on the left sidebar, you'll be able to see all the chrome processes on the device. 

Click on `Inspect` button next to the process you'd like to inspect and that's it!

<img width="645" alt="10-11-remote-devices" src="https://user-images.githubusercontent.com/2641384/73658179-31090400-4694-11ea-9a8e-0a0ff2ced584.png">

To find out more about Chrome DevTools remote device debugging, visit official docs: https://developers.google.com/web/tools/chrome-devtools/remote-debugging#discover

## Good to go 🎯

Now you can continue to Step 11 -> [Serve a secure local server](https://github.com/onderceylan/pwa-workshop-angular-firebase/blob/step-11/README.md).
