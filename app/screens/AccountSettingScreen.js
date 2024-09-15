import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppImagePicker from '../components/AppImagePicker';
import MenuButton from '../components/MenuButton';
import Screen from '../components/Screen';

import { auth } from '../navigation/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function AccountSettingScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const email = user ? user.email : "None";
  const name = user ? user.displayName : "No name given";  // the exception doesn't seem to ever occur

  return (
    <Screen style={styles.screen}>
      <AppImagePicker width={200} height={200}>
        <Text>Please</Text>  {/* This is to make a profile picture. It's currently incomplete.*/}
      </AppImagePicker>
      <View style={styles.detailsContainer}>
        <Text style={styles.text}>Full Name: {name}</Text>
        <Text style={styles.text}>Email address: {email}</Text>
      </View>
      <MenuButton
        text={'Reset Password'}
        type={'SECONDARY'}
        style={styles.button}
        onPress={() => navigation.navigate('Password Reset')}
      />
      <MenuButton
        text={'Edit Profile'}
        type={'SECONDARY'}
        style={styles.button}
        onPress={() => navigation.navigate('Edit Profile')}
      />
      <MenuButton
        text={'Become an Admin'}
        type={'SECONDARY'}
        style={styles.button}
        onPress={() => navigation.navigate('Become an Admin')}
      />
      <MenuButton
        text={'Delete Account'}
        type={'SECONDARY'}
        style={[{ backgroundColor: '#d40f0f', fontSize: 20 }, styles.button]}
      />
    </Screen>
  );
}

export default AccountSettingScreen;

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
  screen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 120,
  },
  text: {
    color: 'white',
    fontSize: 22,
  },
  button: {
    fontSize: 20,
    marginVertical: 10,
    padding: 20,
  },
});
