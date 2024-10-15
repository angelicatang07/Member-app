import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Use Expo's ImagePicker
import { fetchProfilePicture, uploadImage } from '../components/profilePictureUtils'; 

const AppImagePicker = ({ onImageUpdate }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getProfilePicture = async () => {
      try {
        const url = await fetchProfilePicture();
        setProfilePicture(url);
      } catch (error) {
        console.error('Error fetching profile picture: ', error);
      }
    };

    getProfilePicture();
    requestPermission(); // Request permission for image access
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'You need to enable camera access to use this feature.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      // Alert.alert("Loading"); Make it so that the user can't cancel this
      setUploading(true);
      try {
        const downloadURL = await uploadImage(uri); // Upload the selected image
        setProfilePicture(downloadURL);
        Alert.alert("Profile Picture", "Profile Picture changed successfully!")
        // onImageUpdate(downloadURL); // Pass the image URL back to the parent component
      } catch (error) {
        Alert.alert('Error', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.image} />
      ) : (
        <Image source={require('../assets/tempProfilePhoto.png')} style={styles.image} />
      )}
      <Button title="Change Profile Picture" onPress={pickImage} disabled={uploading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
});

export default AppImagePicker;
