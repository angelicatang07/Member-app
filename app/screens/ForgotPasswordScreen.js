import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import CustomButton from '../components/customButton';
import Logo from '../assets/stemeLogo.png';
import Screen from '../components/Screen';
import SubmitButton from '../components/submitButton';
import { auth } from '../navigation/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Toast from 'react-native-toast-message';

import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

const showToast = (message, type) => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 4000,
    });
  };

function ForgotPasswordScreen({ navigation }) {
  const handlePasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
        showToast('Check your email to reset your password', 'success');
        [{ text: "OK", onPress: () => navigation.goBack() }]
    } catch (error) {
        showToast('Email is invalid or not registered', 'error');
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.container}>
        <AppForm
          initialValues={{ email: '' }}
          onSubmit={({ email }) => handlePasswordReset(email)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="email"
            placeholder="Enter your email"
            textContentType="emailAddress"
            width="100%"
          />
          <SubmitButton text={'Reset Password'} />
        </AppForm>
        <CustomButton 
          text={'Back to Sign In'} 
          type="TERTIARY" 
          onPress={() => navigation.goBack()} 
        />
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Screen>
  );
}

export default ForgotPasswordScreen;

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
