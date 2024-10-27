import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { getAuth, updatePassword } from 'firebase/auth';
import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import Screen from '../components/Screen';
import SubmitButton from '../components/submitButton';
import * as Yup from 'yup';
import { fetchProfilePicture } from '../components/profilePictureUtils';
import { useFocusEffect } from '@react-navigation/native';

// Validation schema for the form
const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match'),
});

function PasswordResetScreen(props) {
  const auth = getAuth(); // Get Firebase Authentication instance
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    }, [])
  );

  // Function to handle form submission
  const handleSubmit = async (values) => {
    const user = auth.currentUser; // Get the current authenticated user
    await updatePassword(user, values.password); // Update the password
    Alert.alert('Success', 'Password has been updated successfully.');

    /*
    if (user) {
      try {
        await updatePassword(user, values.password); // Update the password
        Alert.alert('Success', 'Password has been updated successfully.');
      } catch (error) {
        Alert.alert('Error', error.message); // Show error message
      }
    } else {
      Alert.alert('Error', 'No authenticated user found.');
    }
  */
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.profilePictureContainer}>
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
      </View>
      <AppForm
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit} // Pass handleSubmit function
      >
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          name="password"
          placeholder="New password"
          secureTextEntry
          textContentType="password"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry
          textContentType="password"
        />
        <SubmitButton text="RESET" />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 150, // Space between profile picture and form
  },
  profilePictureBorder: {
    alignItems: 'center',
    borderRadius: 60, // Circular border
    borderWidth: 3,
    borderColor: '#4881CB', // Visible border
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: 'transparent', // Transparent background to avoid black circle
    marginBottom: 50,
  },
  profilePicture: {
    width: 120,
    height: 120,
  },
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 130,
  },
});

export default PasswordResetScreen;
