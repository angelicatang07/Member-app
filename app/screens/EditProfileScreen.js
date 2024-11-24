import React from 'react';
import { StyleSheet, Alert } from 'react-native';
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

const genderOptions = ['Male', 'Female', 'Decline to answer'];

// Unified validation schema for all fields
const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  email: Yup.string().email().required().label('Email'),
  country: Yup.string().required().label('Country'),
  gender: Yup.string().required().label('Gender'),
});

function EditProfileScreen(props) {
  const user = auth.currentUser;

  // Handle submission for all fields
  const handleSubmitAll = async (values) => {
    const { name, email, country, gender } = values;
    await updateProfile(user, { displayName: name });

    /*
    Might remove this
    if (email !== user.email) {
      try {
        await updateEmail(user, email);
      } catch (error) {
      }
    }*/

    /*
    // Update country in database
    try {
      await set(ref(db, 'users/' + user.uid + '/country'), country);
    } catch (error) {
    }

    // Update gender in database
    try {
      await set(ref(db, 'users/' + user.uid + '/gender'), gender);
    } catch (error) {
    }
    */

    Alert.alert("Information updated successfully!")

  };

  return (
    <Screen style={styles.screen}>
      <AppForm
        initialValues={{ 
          name: user.displayName, 
          email: user.email, 
          country: user.country || '', 
          gender: user.gender || '' 
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitAll}
      >
        {/* Name Field */}
        <AppFormField 
          autoCapitalize="none" 
          name="name" 
          placeholder="Full Name" 
        />

        {/* Email Field */}
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Email address"
          textContentType="emailAddress"
        />

        {/*
        <AppFormPicker 
          name="country" 
          items={countryList} 
          placeholder="Country" 
        />

        <AppFormPicker 
          name="gender" 
          items={genderOptions} 
          placeholder="Gender" 
        />
        */}

        {/* Unified Submit Button */}
        <SubmitButton text={'Update Profile'} />
      </AppForm>
    </Screen>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  screen: {
    paddingTop: 120,
    paddingHorizontal: 20,
  },
});
