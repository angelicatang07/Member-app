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

const gender = ['Male', 'Female', 'Decline to answer'];

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  email: Yup.string().email().required().label('Email'),
  country: Yup.string().required().label('Country'),
  gender: Yup.string().required().label('Gender'),
});

function EditProfileScreen(props) {
  const handleSubmit = async (values) => {
    const { name, email, country, gender } = values;
    const user = auth.currentUser;

    if (user) {
      try {
        await updateProfile(user, { displayName: name });
        await updateEmail(user, email);

        set(ref(db, 'users/' + user.uid), {
          country,
          gender,
        });

        console.log('Profile updated successfully!');
      } catch (error) {
        console.log('Error updating profile: ', error);
      }
    } else {
      console.log('No user is logged in');
    }
  };

  return (
    <Screen style={styles.screen}>
      <AppForm
        initialValues={{
          name: '',
          email: '',
          country: '',
          gender: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <AppFormField
          autoCapitalize="none"
          name={'name'}
          placeholder="Full Name"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          name="email"
          placeholder="Email address"
          textContentType="emailAddress"
        />
        <AppFormPicker
          name={'country'}
          items={countryList}
          placeholder={'Country'}
        />
        <AppFormPicker name={'gender'} items={gender} placeholder={'Gender'} />
        <SubmitButton text={'SAVE'} />
      </AppForm>
    </Screen>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  screen: {
    paddingTop: 120,
  },
});
