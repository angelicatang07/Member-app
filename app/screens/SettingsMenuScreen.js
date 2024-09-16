import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import CustomButton from '../components/customButton';
import MenuButton from '../components/MenuButton';
import Screen from '../components/Screen';
import { auth } from '../navigation/firebase';
import { signOut } from 'firebase/auth';
import { fetchProfilePicture } from '../components/profilePictureUtils';

function SettingsMenuScreen({ navigation }) {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const getProfilePicture = async () => {
      try {
        const url = await fetchProfilePicture();
        if (url) {
          setProfilePicture(url);
        } else {
          throw new Error('No profile picture found');
        }
      } catch (error) {
        console.error('Error fetching profile picture: ', error);
        Alert.alert('Error', 'Failed to load profile picture.');
      }
    };

    getProfilePicture();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigation.navigate('SignIn');
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.profilePictureBorder}>
        <Image
          style={styles.profilePicture}
          source={
            profilePicture
              ? { uri: profilePicture } // Use fetched profile picture URL
              : require('../assets/tempProfilePhoto.png') // Fallback to default image
          }
          onError={(error) => {
            console.error('Image load error: ', error.nativeEvent.error);
            setProfilePicture(null); // Reset if the image fails to load
          }}
        />
      </View>
      <MenuButton
        onPress={() => navigation.navigate('Account')}
        icon={'account'}
        text="Account"
        color={'#fff'}
        size={30}
      />
      <MenuButton
        icon={'account-question-outline'}
        color={'#fff'}
        size={30}
        text="Tech Support"
      />
      <CustomButton text="Sign Out" onPress={handleSignOut} type="PRIMARY" />
    </Screen>
  );
}

export default SettingsMenuScreen;

const styles = StyleSheet.create({
  profilePictureBorder: {
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(72, 129, 203, 0)', // Set a transparent blue border (adjust alpha for more/less transparency)
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 80,
    marginTop: 100,
    height: 130,
    width: 130,
  },
  profilePicture: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

