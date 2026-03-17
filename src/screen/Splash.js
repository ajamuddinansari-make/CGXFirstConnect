import { View, Text, StyleSheet, ImageBackground, Alert, Linking, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { moderateScale } from '../components/Responsive';
import { SafeAreaView } from 'react-native-safe-area-context';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';

const Splash = ({ navigation }) => {

   const IOS_APP_ID = '6756782373'; 

  useEffect(() => {
    // checkAppVersion();
    navigateToHome();
  }, []);

  const checkAppVersion = async () => {
    try {
      const latestVersion = await VersionCheck.getLatestVersion();
      const currentVersion = DeviceInfo.getVersion();
      
      // const currentVersion = 1.4

      console.log("latestVersion",latestVersion)
      console.log("currentVersion",currentVersion)

      if (latestVersion !== currentVersion) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Please update to continue.",
          [
            {
              text: "Update",
                onPress: async () => {
                try {
                  const storeUrl =
                    Platform.OS === 'ios'
                      ? `https://apps.apple.com/app/id${IOS_APP_ID}`
                      : 'market://details?id=com.firstconnect'; 

                  await Linking.openURL(storeUrl);
                } catch (err) {
                  console.log("Error opening store:", err);
                }
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        navigateToHome();
      }
    } catch (error) {
      navigateToHome();
    }
  };

  const navigateToHome = () => {
    setTimeout(() => {
      navigation.replace("Home");
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/Splash.png')}
        style={styles.container}
        resizeMode='cover'
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#fff'
  }
})

export default Splash;










