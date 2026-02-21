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
  NativeEventEmitter,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrivacySnapshot from 'react-native-privacy-snapshot';

const { ScreenshotDetector } = NativeModules;

const INTERNAL_DOMAIN = 'firstconnectuser.cognigixdemo.com';

const Home = () => {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

 
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    if (PrivacySnapshot?.enabled) {
      PrivacySnapshot.enabled(true);
    }

    if (ScreenshotDetector?.enableSecure) {
      ScreenshotDetector.enableSecure();
    }

    const appStateListener = AppState.addEventListener('change', (state) => {
      setIsProtected(state !== 'active');
    });

    let screenshotListener;
    if (ScreenshotDetector) {
      const eventEmitter = new NativeEventEmitter(ScreenshotDetector);
      screenshotListener = eventEmitter.addListener('ScreenshotTaken', () => {
        console.log('Screenshot detected!');
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 1500);
      });
    }

    return () => {
      appStateListener.remove();
      screenshotListener?.remove();
      PrivacySnapshot?.enabled(false);
    };
  }, []);

 
  const handleBackPress = useCallback(() => {
    if (canGoBack) {
      webViewRef.current.goBack();
      return true;
    }

    if (backPressCount === 0) {
      setBackPressCount(1);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      } else {
        Alert.alert('Press back again to exit');
      }
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

 
  const handleShouldStartLoad = (request) => {
    const url = request.url;
    console.log('onShouldStartLoadWithRequest →', url);

    try {
      const hostname = new URL(url).hostname;

      
      if (hostname === INTERNAL_DOMAIN) {
        return true;
      }

      console.log('Opening external URL in browser →', url);

      Linking.openURL(url).catch((err) =>
        console.error('Failed to open external URL:', err)
      );

      return false; // Stop WebView
    } catch (error) {
      console.log('URL parse error:', error);
      return true;
    }
  };

  const handleNavigationChange = (navState) => {
    console.log('onNavigationStateChange →', navState.url);
    setCanGoBack(navState.canGoBack);
  };

  const handleLoadStart = (event) => {
    console.log('onLoadStart →', event.nativeEvent.url);
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
        style={{ flex: 1 }}
        injectedJavaScript={disableLongPressJS}
        javaScriptEnabled
        onLoadProgress={onLoadProgress}
        onLoadStart={handleLoadStart}
        onNavigationStateChange={handleNavigationChange}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
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









