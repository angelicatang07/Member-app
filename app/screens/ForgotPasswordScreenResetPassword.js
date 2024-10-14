import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import CustomButton from '../components/customButton';
import Logo from '../assets/stemeLogo.png';
import Screen from '../components/Screen';
import SubmitButton from '../components/submitButton';
import Toast from 'react-native-toast-message';
import { auth } from '../navigation/firebase';
import { updatePassword } from 'firebase/auth';
import * as Yup from 'yup';

// Validation schema for the form using Yup
const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(6).label('New Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required')
    .label('Confirm Password'),
});

function ForgotPasswordScreenResetPassword({ navigation }) {
  // Handler for updating the password
  const handlePasswordUpdate = async (password) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, password);
        Toast.show({
          type: 'success',
          text1: 'Password Updated',
          text2: 'Your password has been successfully updated.',
          position: 'bottom',
        });
        navigation.navigate('SignIn'); // Navigate back to Sign In after successful update
      } else {
        throw new Error('User not authenticated. Please try again.');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        position: 'bottom',
      });
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.container}>
        <AppForm
          initialValues={{ password: '', confirmPassword: '' }}
          onSubmit={({ password }) => handlePasswordUpdate(password)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            name="password"
            placeholder="New Password"
            textContentType="password"
            width="100%"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            name="confirmPassword"
            placeholder="Confirm Password"
            textContentType="password"
            width="100%"
          />
          <SubmitButton text={'Update Password'} />
        </AppForm>
        <CustomButton 
          text={'Back to Sign In'} 
          type="TERTIARY" 
          onPress={() => navigation.navigate('SignIn')} 
        />
      </View>
    </Screen>
  );
}

export default ForgotPasswordScreenResetPassword;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  logo: {
    height: 180,
    borderRadius: 90,
    width: 180,
    marginTop: 50,
    marginBottom: 20,
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
