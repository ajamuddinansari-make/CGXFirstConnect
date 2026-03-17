import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  ToastAndroid,
  Animated,
  Easing,
  Platform,
  Alert,
  AppState,
  NativeModules,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrivacySnapshot from 'react-native-privacy-snapshot';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import notifee, { IOSAuthorizationStatus } from '@notifee/react-native';

const { ScreenshotDetector } = NativeModules;

const INTERNAL_DOMAINS = [
  'firstconnectuser.cognigixdemo.com',
  'firstconnectuser.cognigix.com',
  'mozilla.github.io',
  'officeapps.live.com',
  'login.microsoftonline.com',
  'login.live.com',
  'oauth.officeapps.live.com',
  'amazonaws.com',
];

const Home = () => {
  const webViewRef = useRef(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProtected, setIsProtected] = useState(false);

  const [userId, setUserId] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [isTokenSent, setIsTokenSent] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;

  console.log("FCM Token", fcmToken)

  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    PrivacySnapshot?.enabled?.(true);
    ScreenshotDetector?.enableSecure?.();

    const appStateListener = AppState.addEventListener('change', state => {
      setIsProtected(state !== 'active');
    });

    let screenshotListener;

    if (ScreenshotDetector?.addListener) {
      screenshotListener = ScreenshotDetector.addListener(
        'ScreenshotTaken',
        () => {
          setIsProtected(true);
          setTimeout(() => setIsProtected(false), 1500);
        }
      );
    }

    return () => {
      appStateListener.remove();
      screenshotListener?.remove();
      PrivacySnapshot?.enabled?.(false);
    };
  }, []);

 
useEffect(() => {
  const initFCM = async () => {
    try {
    
      await notifee.requestPermission();

    
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Notification permission denied');
        return;
      }

      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();
      setFcmToken(token);

     
      const unsubscribeOnMessage = messaging().onMessage(
        async remoteMessage => {
          console.log('Foreground message:', remoteMessage);

          await notifee.displayNotification({
            title: remoteMessage?.notification?.title || 'Notification',
            body: remoteMessage?.notification?.body || '',
            ios: {
              sound: 'default',
            },
          });
        }
      );

      const unsubscribeTokenRefresh = messaging().onTokenRefresh(newToken => {
        setFcmToken(newToken);
        setIsTokenSent(false);
      });

      return () => {
        unsubscribeOnMessage();
        unsubscribeTokenRefresh();
      };
    } catch (error) {
      console.log('FCM Setup Error:', error);
    }
  };

  initFCM();
}, []);



  const sendFcmTokenToBackend = async (userId, token) => {
    try {
      const response = await fetch(
        'https://firstconnectbackend.cognigix.com/api/addFcmToken',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appData: { USER_ID: userId, FCM_TOKEN: token },
          }),
        }
      );
      const data = await response.json() 
      console.log("data....",data)
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      setIsTokenSent(true);
    } catch (error) {
      console.log('Error sending FCM token:', error);
    }
  };

  useEffect(() => {
    if (userId && fcmToken && !isTokenSent) {
      sendFcmTokenToBackend(userId, fcmToken);
    }
  }, [userId, fcmToken, isTokenSent]);

  const handleBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current.goBack();
      return true;
    }

    if (backPressCount === 0) {
      setBackPressCount(1);
      Platform.OS === 'android'
        ? ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT)
        : Alert.alert('Press back again to exit');

      setTimeout(() => setBackPressCount(0), 2000);
      return true;
    }

    BackHandler.exitApp();
    return true;
  }, [canGoBack, backPressCount]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
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

  const handleShouldStartLoad = request => {
    const url = request.url;
    console.log('Trying to load URL:', url);

    if (!url || url === 'about:blank') return true;

    if (
      url.startsWith('tel:') ||
      url.startsWith('mailto:') ||
      url.startsWith('whatsapp:') ||
      url.startsWith('intent:')
    ) {
      Linking.openURL(url);
      return false;
    }

    try {
      const { hostname } = new URL(url);

    
      const isInternal = INTERNAL_DOMAINS.some(domain => hostname.includes(domain));
      if (!isInternal) {
        Linking.openURL(url);
        return false;
      }

      return true;
    } catch {
      return true;
    }
  };

  const handleNavigationChange = navState => {
    setCanGoBack(navState.canGoBack);
    console.log('Navigated to URL:', navState.url);

    if (navState.url.includes('/user/home')) {
      setTimeout(() => {
        webViewRef.current?.injectJavaScript(`
          (function() {
            try {
              var appState = localStorage.getItem('app-state');
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'APP_STATE', value: appState })
              );
            } catch (e) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'ERROR', message: e.message })
              );
            }
          })();
          true;
        `);
      }, 1000);
    }
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
        // source={{ uri: 'https://firstconnectuser.cognigixdemo.com' }}

        source={{ uri: 'https://firstconnectuser.cognigix.com' }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        onLoadProgress={onLoadProgress}
        onNavigationStateChange={handleNavigationChange}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        allowsBackForwardNavigationGestures
        onMessage={event => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'APP_STATE') {
              const parsed = JSON.parse(data.value);
              setUserId(parsed?.auth?.UDID);
            }
          } catch (error) {
            console.log('WebView message error:', error);
          }
        }}
      />

      {Platform.OS === 'ios' && isProtected && (
        <View style={styles.overlay} />
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  progressBar: { height: 3, backgroundColor: '#2196F3' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 999,
  },
});


