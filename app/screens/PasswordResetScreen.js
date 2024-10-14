import React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { getAuth, updatePassword } from 'firebase/auth';
import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import Screen from '../components/Screen';
import SubmitButton from '../components/submitButton';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

// Validation schema for the form
const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match'),
});

function PasswordResetScreen(props) {
  const auth = getAuth(); // Get Firebase Authentication instance

  const showToast = (message, type) => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 4000,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (values) => {
    const user = auth.currentUser; // Get the current authenticated user

    if (user) {
      try {
        await updatePassword(user, values.password); // Update the password
        Alert.alert('Success', 'Password has been updated successfully.');
        showToast('Password has been updated succesfully', 'success')
      } catch (error) {
        Alert.alert('Error', error.message); // Show error message
      }
    } else {
      Alert.alert('Error', 'No authenticated user found.');
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.profilePictureBorder}>
        <Image
          style={styles.profilePicture}
          source={require('../assets/tempProfilePhoto.png')}
        />
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
      <Toast ref={(ref) => Toast.setRef(ref)} />

    </Screen>
  );
}

const styles = StyleSheet.create({
  profilePictureBorder: {
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4881CB',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 50,
  },
  profilePicture: {
    maxHeight: 120,
    maxWidth: 120,
  },
  screen: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 130,
  },
});

export default PasswordResetScreen;
