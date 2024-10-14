import React, { useState, useEffect } from 'react'; 
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { fetchProfilePicture, uploadImage } from '../components/profilePictureUtils'; 
import { auth } from '../navigation/firebase';  // this isn't needed

const AppImagePicker = () => {
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
  }, []);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.error) {
      console.log('ImagePicker Error: ', result.error);
    } else {
      const uri = result.assets[0].uri;
      setUploading(true);
      try {
        const downloadURL = await uploadImage(uri);
        setProfilePicture(downloadURL);
        Alert.alert('Success', 'Profile picture updated!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload profile picture.');
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
        <Image source={{ uri: 'default-placeholder-image-url' }} style={styles.image} />
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
