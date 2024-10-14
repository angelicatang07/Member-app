import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Image, Text, useWindowDimensions } from 'react-native';

import Screen from '../components/Screen';
import TransparentButton from '../components/transparentButton';
import { auth } from '../navigation/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchProfilePicture } from '../components/profilePictureUtils';

function ChallengesScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const {height} = useWindowDimensions();

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const url = await fetchProfilePicture();
        setProfilePicture(url);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        Alert.alert('Error', 'Failed to load profile picture.');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfilePic();
      } else {
        setProfilePicture(null); // Reset profile picture if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const name = user ? user.displayName : "No name given"; 

  return (
    <Screen style={styles.screen}>
      <View style={[{position: 'absolute'}, {marginTop: 21}, {marginRight: 23}, {right: 0}, {height: height*0.075}, {width: height*0.075}, {borderRadius: height * (0.095/2)}, styles.profilePictureBorder]}>
        <Image  source={{ uri: profilePicture } // Use fetched profile picture URL
          }
           style ={[styles.profilePicture, {height: height * 0.062}, {width: height * 0.062}, {borderRadius: height*0.045}]}/>   
      </View>
      {/* <Text style={styles.title}>Challenges</Text> */}
      <Text style={styles.name}>{name}</Text>
      <TransparentButton
        onPress={() => navigation.navigate('Open Challenges')}
        text="Open Challenges"
        text2="Complete these challenges at any time!"
      />

      <TransparentButton
      onPress={() => navigation.navigate('Level Based Challenges')}
        text="Level-Based Challenges"
        text2="Complete these challenges at any time!"
      />
      {/* Should run backend code to switch to Level Based Challenges Page*/}
    </Screen>
  );
}

export default ChallengesScreen;

const styles = StyleSheet.create({
  profilePictureBorder: {
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: 0,
    borderColor: '#4881CB',
    justifyContent: 'center',
    overflow: 'hidden',
    right: 30,
    top: 30,
    position: 'absolute',
    width: 60,
    height: 60,
  },
  profilePicture: {
    maxHeight: 60,
    maxWidth: 60,
  },
  title: {
    color: 'white',
    fontSize: 25,
    paddingTop: 10,
    position: 'absolute',
    top: 50,
    left: 30,
  },
  name: {
    fontSize: 13,
    position: 'absolute',
    top: 25,
    left: 30,
    color: 'white',
    align: 'left',
    paddingVertical: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: '20',
  },
  text: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
  },
  description: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  screen: {
    paddingTop: 120,
  },
});
