import React, { useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { auth, app } from '../navigation/firebase';
import { doc, getFirestore, setDoc, getDoc } from 'firebase/firestore';

import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import Screen from '../components/Screen';
import SubmitButton from '../components/submitButton';
import adminCheck from '../components/AdminCheck';

const db = getFirestore(app);

function EditProfileScreen(props) {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await adminCheck();
      setIsAdmin(adminStatus);

      if (adminStatus) {
        clearInterval(checkInterval);
      }
    };
  
    const checkInterval = setInterval(() => {
      checkAdminStatus();
    }, 2000);

    checkAdminStatus();

    return () => {
        clearInterval(checkInterval);
    };
  }, []);

  if (isAdmin === null) {
    return (
      <Screen style={styles.screen}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Checking admin status...</Text>
      </Screen>
    );
  }

  if (isAdmin) {
    return (
      <Screen style={styles.screen}>
        <Text style={{ color: 'white', textAlign: 'center' }}>You are already an Admin, please re-launch the application to access the Admin Only features.</Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <AppForm
        initialValues={{
          code: ''
        }}
        onSubmit={(values) => verifyAdminCode(values.code)}
      >
        <AppFormField
          autoCapitalize="none"
          name={'code'}
          placeholder="Admin Code"
          secureTextEntry
          autoCorrect={false}
        />
        <SubmitButton text={'SUBMIT'} />
      </AppForm>
    </Screen>
  );
}

async function verifyAdminCode(code) {
  const adminCodeDoc = await getDoc(doc(db, `RoleCodes/Admin`));
  const adminCode = adminCodeDoc.data().code;
  if (adminCode !== code) return;
  
  await setDoc(doc(db, `users/${auth.currentUser.uid}`), {
    role: 'admin'
  });
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  screen: {
    paddingTop: 120,
  },
});
