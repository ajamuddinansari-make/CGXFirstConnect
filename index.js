// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import messaging from '@react-native-firebase/messaging';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

// AppRegistry.registerComponent(appName, () => App);









// /**
//  * @format
//  */

// import { AppRegistry, Platform } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';





// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Background message received:', remoteMessage);
//   await displayNotification(remoteMessage);
// });




// AppRegistry.registerComponent(appName, () => App);
















/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

import notifee, { EventType } from '@notifee/react-native';

// Function to display notification
async function displayNotification(remoteMessage) {
  if (!remoteMessage) return;

  const title =
    remoteMessage.notification?.title || "Notification";

  const body =
    remoteMessage.notification?.body || "";

  console.log("FCM DATA:", remoteMessage.data);

  await notifee.displayNotification({
    title,
    body,

    data: {
      contentLink: remoteMessage.data?.contentLink,
      contentUdid: remoteMessage.data?.contentUdid,
      moduleType: remoteMessage.data?.moduleType,
    },

    android: {
      channelId: "default",
      smallIcon: "ic_launcher",

      pressAction: {
        id: "default",
      },
    },

    ios: {
      sound: "default",
    },
  });
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log(
      "Pressed:",
      detail.notification?.data
    );
  }
});

// Background / killed state handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  await displayNotification(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

