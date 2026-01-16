import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { moderateScale } from '../components/Responsive';
import { SafeAreaView } from 'react-native-safe-area-context';



const Splash = ({ navigation }) => {

console.log("cgx ..")
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home")
    }, 2000);

    return () => clearTimeout(timer)
  }, [navigation])



  return (
    // <View style={styles.container}>
    //   <Text style={styles.text}>FirstConnect</Text>
    //   <Image
    //   source={require("../assets/images/Splash.png")}
    //   resizeMethod='cover'
    //   />
    // </View>
    
    <SafeAreaView>
    <ImageBackground 
    source={require('../assets/images/Splash.png')}
    style={styles.container}
    resizeMethod='cover'
    >

    </ImageBackground>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50'
  },
  text: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#fff'
  }


})


export default Splash
