import React from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { updateProfile, updateEmail } from 'firebase/auth';
import { ref, set } from 'firebase/database'; 
import { auth, db } from '../navigation/firebase'; 

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import AppFormPicker from '../components/AppFormPicker';
import Screen from '../components/Screen';
import countryList from '../components/countries';
import SubmitButton from '../components/submitButton';
import Toast from 'react-native-toast-message';

const gender = ['Male', 'Female', 'Decline to answer'];

const nameSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
});

const emailSchema = Yup.object().shape({
  email: Yup.string().email().required().label('Email'),
});

const countrySchema = Yup.object().shape({
  country: Yup.string().required().label('Country'),
});

const genderSchema = Yup.object().shape({
  gender: Yup.string().required().label('Gender'),
});

function EditProfileScreen(props) {
  const user = auth.currentUser;

  const showToast = (message, type) => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 4000,
    });
  };

  const handleNameSubmit = async (values) => {
    const { name } = values;
    if (user) {
      try {
        await updateProfile(user, { displayName: name });
        showToast('Success! Reload to see your new name.', 'success');
      } catch (error) {
        showToast('Error updating name: ' + error.message, 'error');
      }
    }
  };

  const handleEmailSubmit = async (values) => {
    const { email } = values;
    if (user) {
      showToast('Email cannot be updated at this time', 'error')
      /*
      might remove this
      try {
        await updateEmail(user, email);
        showToast('Email updated successfully!', 'success');
      } catch (error) {
        showToast('Error updating email: ' + error.message, 'error');
      }
        */
    }
  };

  const handleCountrySubmit = async (values) => {
    const { country } = values;
    if (user) {
      try {
        await set(ref(db, 'users/' + user.uid + '/country'), country);
        showToast('Country updated successfully!', 'success');
      } catch (error) {
        showToast('Error updating country: ' + error.message, 'error');
      }
    }
  };
  console.log(user.country, user.gender);

  const handleGenderSubmit = async (values) => {
    const { gender } = values;
    if (user) {
      try {
        await set(ref(db, 'users/' + user.uid + '/gender'), gender);
        showToast('Gender updated successfully!', 'success');
      } catch (error) {
        showToast('Error updating gender: ' + error.message, 'error');
      }
    }
  };

  return (
    <Screen style={styles.screen}>
      <AppForm
        initialValues={{ name: user.displayName }} 
        validationSchema={nameSchema}
        onSubmit={handleNameSubmit}
      >
        <AppFormField autoCapitalize="none" name="name" placeholder="Full Name" />
        <SubmitButton text={'Update Name'} />
      </AppForm>

      <AppForm
        initialValues={{ email: user.email }}  
        validationSchema={emailSchema}
        onSubmit={handleEmailSubmit}
      >
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Email address"
          textContentType="emailAddress"
        />
        <SubmitButton text={'Update Email'} />
      </AppForm>

      <AppForm
        initialValues={{ country: user.country }}  
        validationSchema={countrySchema}
        onSubmit={handleCountrySubmit}
      >
        <AppFormPicker name="country" items={countryList} placeholder="Country" />
        <SubmitButton text={'Update Country'} />
      </AppForm>

      <AppForm
        initialValues={{ gender: user.gender }}
        validationSchema={genderSchema}
        onSubmit={handleGenderSubmit}
      >
        <AppFormPicker name="gender" items={gender} placeholder="Gender" />
        <SubmitButton text={'Update Gender'} />
      </AppForm>

      <Toast ref={(ref) => Toast.setRef(ref)} />
        
    </Screen>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  screen: {
    paddingTop: 120,
  },
});
