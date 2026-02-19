import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  ToastAndroid,
  Animated,
  Easing,
  Platform,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  check,
  request,
  PERMISSIONS,
  // RESULTS
} from 'react-native-permissions';
import { requestNotifications, RESULTS } from 'react-native-permissions';


// Uncomment if using Firebase token
// import messaging from '@react-native-firebase/messaging';

const Home = () => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);


  // const requestPermission = useCallback(async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
  //       if (result === RESULTS.GRANTED) {
  //         console.log('Notification Permission Granted (Android)');
  //         getToken();
  //       } else {
  //         console.log('Notification Permission Denied (Android)');
  //       }
  //     } else if (Platform.OS === 'ios') {
  //       const result = requestNotifications(['alert', 'sound', 'badge']);
  //       if (result === RESULTS.GRANTED) {
  //         console.log('Notification Permission Granted (iOS)');
  //         getToken();
  //       } else {
  //         console.log('Notification Permission Denied (iOS)');
  //       }
  //     }
  //   } catch (error) {
  //     console.warn('Permission Error:', error);
  //   }
  // }, []);






const requestPermission = useCallback(async () => {
  try {
    if (Platform.OS === 'android') {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (result === RESULTS.GRANTED) {
        console.log('Notification Permission Granted (Android)');
        getToken();
      } else {
        console.log('Notification Permission Denied (Android)');
      }
    } else if (Platform.OS === 'ios') {
      const { status, settings } = await requestNotifications(['alert', 'sound', 'badge']);
      console.log('iOS notification status:', status, settings);

      if (status === RESULTS.GRANTED) {
        console.log('Notification Permission Granted (iOS)');
        getToken();
      } else if (status === RESULTS.DENIED) {
        console.log('Notification Permission Denied (iOS)');
      } else if (status === RESULTS.BLOCKED) {
        console.log('Notification Permission Blocked (iOS) — user must enable in settings');
      }
    }
  } catch (error) {
    console.warn('Permission Error:', error);
  }
}, []);



  useEffect(() => {
    requestPermission();
  }, []);

 
  const handleBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current.goBack();
      return true;
    }

    if (backPressCount === 0) {
      setBackPressCount(1);
      if (Platform.OS === 'android') {
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
      } else {
        Alert.alert("Press back again to exit");
      }

      setTimeout(() => setBackPressCount(0), 2000);
      return true;
    }

    BackHandler.exitApp();
    return true;
  }, [canGoBack, backPressCount]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => subscription.remove();
  }, [handleBackPress]);


  const onLoadProgress = ({ nativeEvent }) => {
    const progressValue = nativeEvent.progress;
    setIsLoading(progressValue < 1);

    Animated.timing(progress, {
      toValue: progressValue,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

 
  const disableLongPressJS = `
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    const style = document.createElement('style');
    style.innerHTML = \`
      * {
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
        user-select: none !important;
      }
    \`;
    document.head.appendChild(style);
    true;
  `;


  const getToken = () => {
   
    console.log("Token function called");
  };


  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: 'https://firstconnectuser.cognigixdemo.com' }}
        
        // source={{ uri: 'https://reactnative.dev/docs/environment-setup' }}

        style={{ flex: 1 }}
        injectedJavaScript={disableLongPressJS}
        javaScriptEnabled={true}
        onLoadProgress={onLoadProgress}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#2196F3',
  },
});
