import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, useWindowDimensions, TouchableWithoutFeedback, Alert } from 'react-native';
import Screen from '../components/Screen';
import BadgesLogo from '../assets/badgesLogo.png';
import RankLogo from '../assets/RankLogo.png';
import PlanetLogo from '../assets/PlanetLogo.png';
import CustomButton from '../components/customButton';
import { auth } from '../navigation/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import pointsCheck from '../components/PointsCheck';
import { fetchProfilePicture } from '../components/profilePictureUtils';
import { useFocusEffect } from '@react-navigation/native';
import placementCheck from '../components/placementCheck';

function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { height } = useWindowDimensions();

  const [points, setPoints] = useState(null);
  const [placement, setPlacement] = useState(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
        const url = await fetchProfilePicture();
        setProfilePicture(url);
        setIsLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProfilePic();
      } else {
        setProfilePicture(null); // Reset profile picture if not authenticated
      }
    });

    // checkPoints();
    return () => unsubscribe();
  }, []);

  const fetchProfilePic = async () => {
    const url = await fetchProfilePicture();
    setProfilePicture(url);
  };

  const handleFetchProfilePicture = () => {
    fetchProfilePic(); // Fetch the profile picture when the button is pressed
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await handleFetchProfilePicture();
        const _points = await pointsCheck();
        setPoints(_points ? _points : 0);

        const __placement = await placementCheck();
        setPlacement(__placement ? __placement : 0);
      };
  
      fetchData();
  
      return () => {
        // Cleanup if necessary
      };
    }, [])
  );

  const name = user?.displayName || 'Guest';

  return (
    <Screen>
      <View style={styles.header}>
      <View style={styles.textContainer}>
          <Text style={[styles.text, { fontSize: 13 }]}> {name} </Text>
          <Text style={[styles.text, { fontSize: 22, fontWeight: 'bold'}]}> {'Dashboard'} </Text>
      </View>
        <TouchableWithoutFeedback

          onPress={() => navigation.navigate('Settings')}
        >
          <Image
          
          source={
            profilePicture
              ? { uri: profilePicture } // Use fetched profile picture URL
              : require('../assets/tempProfilePhoto.png') // Fallback to default image
          } 
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
          <Text style={styles.statsText}> 60 / 80</Text>
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
          <Text style={styles.rank}>{'Rank ' + placement}</Text>
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
    flexDirection: 'row',           
    justifyContent: 'space-around', 
    alignContent: 'center',
    paddingHorizontal: 5,
  },

  textContainer: {
    flex: 1,
    flexDirection: 'row',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 100,
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
    fontSize: 10,
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
    margin: 1,
    textAlign: 'center',
    flexDirection: 'row',
    marginBottom: 35,
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
    alignItems: 'center',
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
    margin: 11,
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
    margin: 5,
    textAlign: 'center',
    flexDirection: 'row',
  },

  planet: {
    height: 120,
    width: 120,
    resizeMode: 'contain'
  },
});