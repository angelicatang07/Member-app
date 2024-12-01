import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/customButton';
import MenuButton from '../components/MenuButton';
import Screen from '../components/Screen';
import { auth } from '../navigation/firebase';
import { signOut } from 'firebase/auth';
import { fetchProfilePicture } from '../components/profilePictureUtils';
import { useFocusEffect, CommonActions } from '@react-navigation/native';

function SettingsMenuScreen({ navigation }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const getProfilePicture = async () => {
      const url = await fetchProfilePicture();
      if (url) {
        setProfilePicture(url);
      }
      setIsLoading(false); // Stop loading once the image is fetched
    };

    getProfilePicture();
  }, []);

  const fetchProfilePic = async () => {
    const url = await fetchProfilePicture();
    setProfilePicture(url);
  };

  const handleFetchProfilePicture = () => {
    fetchProfilePic(); // Fetch the profile picture when the button is pressed
  };

  useFocusEffect(
    React.useCallback(() => {
      handleFetchProfilePicture();
      return () => {
        setProfilePicture(null); // Clear the profile picture on exit
      };
    }, [])
  );

  const handleSignOut = async () => {
    await signOut(auth);
    navigation.navigate('SignIn')
    /* app was crashing when we did this
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignIn' }], 
      })
    );
    */
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.profilePictureBorder}>
        {!isLoading && (
          <Image
            style={styles.profilePicture}
            source={
              profilePicture
                ? { uri: profilePicture } // Use fetched profile picture URL
                : require('../assets/tempProfilePhoto.png') // Fallback to default image
            }
          />
        )}
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
