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
import notifee from '@notifee/react-native';

// Function to display notification
async function displayNotification(remoteMessage) {
  if (!remoteMessage) return;

  let title = 'Notification';
  let body = '';

  try {
    if (remoteMessage.data?.content) {
      const content = JSON.parse(remoteMessage.data.content);
      title = content?.TITLE?.EN || title;
      body = content?.SUBTITLE?.EN || body;
    }
  } catch (e) {
    console.log('Error parsing notification data', e);
  }

  await notifee.displayNotification({
    title: title,
    body: body,
    ios: {
      sound: 'default',
    },
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
    },
  });
}

// Background / killed state handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  await displayNotification(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

