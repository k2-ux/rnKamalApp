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
import {GoogleSignin,isErrorWithCode,isSuccessResponse,statusCodes} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = ({navigation}: any) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [usrInfo, setUsrInfo]= useState(null)
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '150246811251-7ucgh4rufut99t5qpjub0p07gff89m4j.apps.googleusercontent.com',
    });
  }, []);
const handleGoogle = async()=>{
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log(response)

      if (isSuccessResponse(response)) {
        await AsyncStorage.setItem('isGoogleSign', JSON.stringify("true"));
        await AsyncStorage.setItem('googleUser', JSON.stringify(response.data.user));
        navigation.navigate('Home')
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
}
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
      } );

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
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login navigation link */}
      <TouchableOpacity
        onPress={handleNavigateToLogin}
        style={styles.loginLink}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>

      {Platform.OS === 'android' && (
        <View style={{marginTop: 20}}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            Or
          </Text>

          <TouchableOpacity   onPress={handleGoogle}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 5,
              marginTop: 10,
            }}>
            <Text style={{color: 'black', fontSize: 16, fontWeight: '600'}}>
              Sign up with
            </Text>
            <Image source={Images.google} style={{height: 20, width: 20}} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E4E2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});
