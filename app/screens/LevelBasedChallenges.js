import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import Screen from '../components/Screen';
import { fetchProfilePicture } from '../components/profilePictureUtils';
import Check from '../assets/check.png';
import { useFocusEffect } from '@react-navigation/native';

const challenges = [
  {
    text: 'Become nominated as intern of the month for your team',
    points: 50,
  },
  {
    text: 'Speak on your team’s behalf during mentor meetings',
    points: 25,
  },
  {
    text: 'Attend the monthly townhalls',
    points: 20,
  },
];

const sortedChallenges = challenges.sort((a, b) => a.points - b.points);

function LevelBasedChallengesScreen({ navigation }) {
  const { height, width } = useWindowDimensions();
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProfilePicture = async () => {
      const url = await fetchProfilePicture();
      if (url) {
        setProfilePicture(url);
      }
      setIsLoading(false);
    };

    getProfilePicture();
  }, []);

  const onChallengePressed = () => {
    navigation.navigate('QR Code Scanner');
  };

  const fetchProfilePic = async () => {
    const url = await fetchProfilePicture();
    setProfilePicture(url);
  };

  const handleFetchProfilePicture = () => {
    fetchProfilePic(); // Fetch the profile picture when the button is pressed
  };

  useFocusEffect(
    React.useCallback(() => {
      handleFetchProfilePicture();
    }, [])
  );

  return (
    <Screen style={styles.screen}>
      {!isLoading && (
        <Image
          style={styles.profilePicture}
          source={
            profilePicture
              ? { uri: profilePicture } // Use fetched profile picture URL
              : require('../assets/tempProfilePhoto.png') // Fallback to default image
          }
        />
      )}
      <ScrollView style={[styles.challengesScroll, { width: width }]}>
        {sortedChallenges.map((challenge, index) => (
          <View key={index} style={styles.challengeContainer}>
            <Pressable
              onPress={onChallengePressed}
              style={[styles.challengeNameContainer, { width: width * 0.68 }]}
            >
              <Text style={styles.challengeText}>{challenge.text}</Text>
            </Pressable>
            <View style={styles.checkContainer}>
              <Text style={styles.challengeText}>{`+${challenge.points}`}</Text>
              <Image source={Check} style={styles.challengeCheck} />
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 120,
    alignItems: 'center',
  },
  challengesScroll: {
    marginTop: 5,
  },
  challengeContainer: {
    height: 75,
    borderRadius: 10,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  challengeNameContainer: {
    backgroundColor: 'rgba(135, 121, 164, 0.3)',
    marginLeft: 20,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 1,
    position: 'absolute',
  },
  challengeCheck: {
    marginRight: 'auto',
    marginBottom: 'auto',
    marginLeft: -10,
    marginTop: -10,
  },
  checkContainer: {
    backgroundColor: 'rgba(135, 121, 164, 0.5)',
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 'auto',
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular image
    position: 'absolute',
    right: 30,
    top: 30,
  },
});

export default LevelBasedChallengesScreen;
