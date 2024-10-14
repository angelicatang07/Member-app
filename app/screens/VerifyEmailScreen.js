import React, { useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import Screen from '../components/Screen';
import CustomButton from '../components/customButton';
import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import SubmitButton from '../components/submitButton';
import Logo from '../assets/stemeLogo.png';
import { auth, db } from '../navigation/firebase';
import { ref, get, update } from 'firebase/database';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .required('Verification code is required')
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .label('Verification Code'),
});

function VerifyEmailScreen({ navigation }) {
  const showToast = (message, type) => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 4000,
    });
  };

  const handleVerifyCode = async ({ verificationCode }) => {
    try {
      const user = auth.currentUser;
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        if (userData.verificationCode === verificationCode) {
          await update(userRef, { isVerified: true });
          showToast('Email verified successfully!', 'success');
          navigation.navigate('SignIn');
        } else {
          showToast('Invalid verification code. Please try again.', 'error');
        }
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            A verification email has been sent to your email address. Please check your email and enter the verification code below.
          </Text>
        </View>
        <AppForm
          initialValues={{ verificationCode: '' }}
          onSubmit={handleVerifyCode}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            name="verificationCode"
            placeholder="Verification Code"
            keyboardType="numeric"
            textContentType="oneTimeCode"
            width="100%"
          />
          <SubmitButton text={'Verify Code'} />
        </AppForm>
        <CustomButton
          text={'Go to Login'}
          onPress={() => navigation.navigate('SignIn')}
          type="TERTIARY"
        />
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Screen>
  );
}

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
  messageContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VerifyEmailScreen;
