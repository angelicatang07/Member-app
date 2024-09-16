import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions, TouchableWithoutFeedback, Alert } from 'react-native';
import Screen from '../components/Screen';
import TempProfilePhoto from '../assets/tempProfilePhoto.png';
import BadgesLogo from '../assets/badgesLogo.png';
import RankLogo from '../assets/RankLogo.png';
import PlanetLogo from '../assets/PlanetLogo.png';
import CustomButton from '../components/customButton';
import { auth } from '../navigation/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import pointsCheck from '../components/PointsCheck';
import { fetchProfilePicture } from '../components/profilePictureUtils';

function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSignOut = async () => {
    await signOut(auth);
    navigation.navigate('SignIn');
  };

  const { height } = useWindowDimensions();

  const [points, setPoints] = useState(null);

  useEffect(() => {
    const checkPoints = async () => {
      const _points = await pointsCheck();
      setPoints(_points ? _points : 0);
    };

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

    checkPoints();
    return () => unsubscribe();
  }, []);

  const name = user?.displayName || 'Guest';

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.text,{fontSize: 25}]}> {name} </Text>
        <Text style={[styles.text,{fontSize: 25}]}> {'Dashboard'} </Text>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Settings')}
        >
          <Image
          source={
            profilePicture
              ? { uri: profilePicture } // Use fetched profile picture URL
              : require('../assets/tempProfilePhoto.png') // Fallback to default image
          }
          onError={(error) => {
            console.error('Image load error: ', error.nativeEvent.error);
            setProfilePicture(null); // Reset if the image fails to load
          }}   
          style={[styles.profilePicture, { height: height * 0.08 }, { width: height * 0.08 }, { borderRadius: height * 0.045 },]}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.stats}>
        <View>
          <Text style={styles.text}>Points to Next Badge</Text>
          <Text style={styles.statsText}>350</Text>
        </View>
        <View>
          <Text style={styles.text}>Tasks Completed</Text>
          <Text style={styles.statsText}>50 / 80</Text>
        </View>
        <View>
          <Text style={styles.text}>Total Hours</Text>
          <Text style={styles.statsText}>6</Text>
        </View>
      </View>
      <View style={styles.paddedBox}>
        <View style={styles.rankLogoBox}>
          <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Leaderboard')}>
            <Image source={RankLogo} style={styles.image}/>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.rankLogoText}>
          <Text style={styles.rank}>{'Rank 125'}</Text>
          <Text style={styles.points}>{points + ' Points'}</Text>
        </View>
      </View>
      <View style={styles.badgeAndPlanet}>
        <View style={styles.badgeBox}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Badges')}>
            <Image source={BadgesLogo} style={styles.badge}/>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.planetBox}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('MercuryFront')}>
            <Image source={PlanetLogo} style={styles.planet}/>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Screen>
  )
};

const hexToRgbA = (hex, alpha) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default DashboardScreen;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    margin: 20,
  },

  header: {
    flex: 1,
    flexDirection: 'row',
  },

  profilePictureBorder: {
    borderWidth: 3,
    borderColor: '#4881CB',
  },

  profilePicture: {
    margin: 'auto',
    maxHeight: 100,
    maxWidth: 100,
  },

  text: {
    fontSize: 14,
    color: 'white',
    marginTop: -4,
    marginBottom: 10,
    marginRight: 'auto',
  },

  paddedBox: {
    backgroundColor: hexToRgbA('#8779A4', 0.7),
    borderColor: '#979797',
    borderRadius: 15,
    paddingVertical: 50,
    margin: 25,
    textAlign: 'center',
    flexDirection: 'row',
  },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-between',
    margin: 25,
    flex: 1,
  },

  statsText: {
    color: 'lightskyblue',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  rankLogoBox: {
    width: '40%',
    borderRightWidth: 2,
    borderRightColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -50,
  },

  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rankLogoText: {
    width: '60%',
    color: 'white',
    justifyContent: 'center',
    color: 'white',
  },

  rank: {
    textAlign: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 30,
    fontWeight: '300',
  },

  points: {
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    fontWeight: '300',
  },

  badgeAndPlanet: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeBox: {
    backgroundColor: hexToRgbA('#8779A4', 0.7),
    borderColor: '#979797',
    borderRadius: 15,
    padding: 20,
    margin: 25,
    textAlign: 'center',
    flexDirection: 'row',
  },

  badge: {
    tintColor: 'white',
    height: 120,
    width: 120,
    resizeMode: 'contain'
  },

  planetBox: {
    backgroundColor: hexToRgbA('#8779A4', 0.7),
    borderColor: '#979797',
    borderRadius: 15,
    padding: 20,
    margin: 25,
    textAlign: 'center',
    flexDirection: 'row',
  },

  planet: {
    height: 120,
    width: 120,
    resizeMode: 'contain'
  },
});