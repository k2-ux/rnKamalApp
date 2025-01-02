import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Image,
} from 'react-native';
import Images from '../helpers/Images';

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin =async () => {
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
      // Attempt to sign in the user
      await auth().signInWithEmailAndPassword(email, password);
  
      // Show a toast message for successful login
      ToastAndroid.show('Login Successful!', ToastAndroid.SHORT);
  
      // Navigate to the Home screen
      navigation.navigate('Home');
    } catch (error:any) {
      // Handle specific error cases

      console.log(error.code, error.message)
      if (error.code === 'auth/invalid-credential') {
        console.log('That email address is invalid!');
        ToastAndroid.show('Invalid credentials!', ToastAndroid.SHORT);
      } else if (error.code === 'auth/user-not-found') {
        console.log('No user found for that email.');
        ToastAndroid.show('User not found!', ToastAndroid.SHORT);
      } else if (error.code === 'auth/wrong-password') {
        console.log('Incorrect password.');
        ToastAndroid.show('Incorrect password!', ToastAndroid.SHORT);
      } else {
        // console.error('Error during login:', error);
        ToastAndroid.show('Login failed!', ToastAndroid.SHORT);
      }
    }
  };

  const handleNavigateToSignup = () => {
    navigation.navigate('Signup'); // Adjust to your signup screen name
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Signup navigation link */}
      <TouchableOpacity onPress={handleNavigateToSignup} style={styles.signupLink}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      {Platform.OS==='android' &&   <View style={{marginTop: 20}}>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          Or
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: 'white',
            padding: 5,
            borderRadius: 5,
            marginTop:10
          }}>
          <Text style={{color: 'black', fontSize: 16, fontWeight: '600'}}>
            Login with
          </Text>
          <Image source={Images.google} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      </View>}
    </View>
  );
};

export default Login;

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
    backgroundColor:'white',
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
  signupLink: {
    marginTop: 20,
  },
  signupText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});
