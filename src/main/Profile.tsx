import React, { useEffect, useState } from 'react';
import { View, Image, Text, Button, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';
import { clearFavorites } from '../redux/favouriteSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const avatars = [
  'https://randomuser.me/api/portraits/men/1.jpg',
  'https://randomuser.me/api/portraits/women/1.jpg',
  'https://randomuser.me/api/portraits/men/2.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/men/3.jpg',
  'https://randomuser.me/api/portraits/women/3.jpg',
];

const Profile = ({ navigation }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [newAvatar, setNewAvatar] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('https://randomuser.me/api/');
          const data = await response.json();
          const randomUser = data.results[0];
  setNewAvatar(randomUser.picture.large)
        //   setUser({
        //     name: `${randomUser.name.first} ${randomUser.name.last}`,
        //     email: randomUser.email,
        //     avatar: randomUser.picture.large,
        //   });
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, []);
    const handleFetchUser = async () => {
        setLoading(true); // Start loading
        try {
          const response = await fetch('https://randomuser.me/api/');
          const data = await response.json();
          const randomUser = data.results[0];
    
          setNewAvatar(randomUser.picture.large); // Set the new avatar
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false); // Stop loading
        }
      };
      const getGoogleSignStatus = async () => {
        try {
          const value = await AsyncStorage.getItem('isGoogleSign');
          if (value !== null) {
            // We got the value from AsyncStorage
            console.log('Is Google Sign-In:', JSON.parse(value));


            
          }
        } catch (error) {
          console.error('Error retrieving Google sign-in status:', error);
        }
      }; 
    useEffect(() => {
     
      getGoogleSignStatus()
      const unsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('User Details:', user);
          setNewName(user.displayName || ''); // Set default name if null
        setEmail(user.email || '')
        } else {
          console.log('No user is signed in.');
        }
      });
  
      // Cleanup listener on component unmount
      return () => unsubscribe();
    }, []);
 

  const handleEdit = () => {
    setIsEditing(true);
  };
  
const handleLogout = () => {

  auth()
    .signOut()
    .then(async () => {
      // Clear AsyncStorage
      try {
        await AsyncStorage.clear();
        console.log('AsyncStorage cleared!');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }

      // Clear Redux state
      dispatch(clearFavorites());
      console.log('Redux and Favorites state cleared!');

      // Show logout toast
      ToastAndroid.show('Logging out...', ToastAndroid.SHORT);

      // Navigate to Signup screen
      navigation.push('Signup');
    })
    .catch((error) => {
      console.error('Error signing out:', error);
      ToastAndroid.show('Logout failed. Please try again.', ToastAndroid.SHORT);
    });
};

  const handleSave = async () => {
    try {
      const currentUser = auth().currentUser; // Get the currently signed-in user
  
      if (currentUser) {
      
        await currentUser.updateProfile({
          displayName: newName,
         
        });
  
        console.log('Profile updated successfully!');
        setIsEditing(false)
        
      } else {
        console.log('No user is signed in.');
       
      }
    } catch (error) {
      console.error('Error updating profile:', error);
     
    }
  };
  

  const shuffleAvatar = () => {
    const nextIndex = (avatars.indexOf(newAvatar) + 1) % avatars.length; // Get the next avatar in the array
    setNewAvatar(avatars[nextIndex]);
  };

  return (
    <View style={styles.container}>


         {newAvatar && (
                
                  <Image source={{ uri: newAvatar }} style={styles.avatar} />)}

  
{loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Fetch New Avatar" onPress={handleFetchUser} />
      )}
      <View  style={{marginVertical:10}}/>
      {newName && (
        <>
          {/* <Image source={{ uri: newAvatar }} style={styles.avatar} /> */}

          {isEditing ? (
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
              color='black'
            />
          ) : (
            <Text style={styles.name}>{newName}</Text>
          )}

       
{/* 
          <TouchableOpacity onPress={shuffleAvatar}>
            <Text style={styles.editText}>Shuffle Avatar</Text>
          </TouchableOpacity> */}

          {/* <Button title="Logout" onPress={handleLogout} /> */}

          {isEditing ? (
  <View style={{ flexDirection: 'row', alignItems: 'center',gap:10 }}>
    <Button title="Save Changes" onPress={handleSave} />
    <Button title="Cancel" onPress={() => setIsEditing(false)}  />
  </View>
) : (
  <TouchableOpacity onPress={handleEdit}>
    <Text style={styles.editText}>Edit Name</Text>
  </TouchableOpacity>
)}


<Text style={styles.email}>{email}</Text>


<View style={{marginTop:20}}>

   <Button title="Logout" onPress={handleLogout} />
</View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  email: {
    fontSize: 16,
    color: 'black',
    marginBottom: 30,
  },
  editText: {
    color: 'blue',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default Profile;
