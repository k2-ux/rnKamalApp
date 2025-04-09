import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import Images from '../helpers/Images';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '../helpers/Constants';

const Signup = ({navigation}: any) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [usrInfo, setUsrInfo] = useState(null);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Constants.Google_WebClient_Id,
    });
  }, []);
  const handleGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const response = await GoogleSignin.signIn();
      console.log(response);

      if (isSuccessResponse(response)) {
        await AsyncStorage.setItem('isGoogleSign', JSON.stringify('true'));
        await AsyncStorage.setItem(
          'googleUser',
          JSON.stringify(response.data.user),
        );
        navigation.navigate('Home');
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };
  const handleSignup = async () => {
    // Basic validation
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    setError('');
    try {
      // Create the user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      // Update the user's profile with a display name
      await userCredential.user.updateProfile({
        displayName: name,
      });

      console.log('User profile updated with display name:', name);

      // Show alert and navigate to Home on pressing "OK"
      Alert.alert(
        'Signup Successful',
        `Welcome, ${name}!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ],
        {cancelable: false},
      );
    } catch (error: any) {
      console.log('Error during sign-up:', error);

      // Show error alert if user creation fails
      Alert.alert('Signup Failed', error.message);
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login'); // Adjust to your login screen name
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNavigateToLogin}
          style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>

        {Platform.OS === 'android' && (
          <View style={styles.googleContainer}>
            <Text style={styles.orText}>Or sign up with</Text>
            <TouchableOpacity
              onPress={handleGoogle}
              style={styles.googleButton}>
              <Image source={Images.google} style={styles.googleIcon} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F3',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  googleContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  orText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  googleIcon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
