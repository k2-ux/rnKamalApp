import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import Images from '../helpers/Images';

const Splash = (props: any) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      const timer = setTimeout(() => {
        if (user) {
          // If a user is logged in, navigate to the Home screen
          props.navigation.replace('Home');
        } else {
          // If no user is logged in, navigate to the Signup screen
          props.navigation.replace('Signup');
        }
      }, 3000); // 3 seconds delay for splash screen

      return () => clearTimeout(timer); // Cleanup the timer
    });

    return () => unsubscribe(); // Cleanup the auth state listener
  }, [props.navigation]);

  return (
    <ImageBackground
      source={Images.splash}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <View style={styles.textContainer}>
        <Text style={styles.text}>Welcome</Text>
      </View>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
