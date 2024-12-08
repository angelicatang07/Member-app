import React, { useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import ProgressMarker from "./ProgressMarker";

function PlanetFront({ navigation, planetPicture, points, planetName, navigateTo }){
    const totalScreens = 9; // Total number of screens
    const currentIndex = useNavigationState(state => state.index); 

    return (
        <View style={styles.container}>
            <View style={styles.square}>
                <Text style={styles.point}>{points}</Text>
                <Text style={styles.planetName}>{planetName}</Text>
                <TouchableOpacity style={styles.learnMore} onPress={() => navigation.navigate(navigateTo)}>
                    <Text style={styles.learnMoreText}>Learn More</Text>
                </TouchableOpacity>
            </View>
            <Image
                source={planetPicture}
                style={styles.planet}
            />

<ProgressMarker currentIndex={currentIndex-1} totalDots={totalScreens} /> 
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth, // Set fixed width to occupy entire screen
        height: windowHeight, // Set fixed height to occupy entire screen
    },
    planet:{
        height: 230,  // Adjust as needed
        width: 230,
        top: '5%', // Adjust as needed
        position: 'absolute', 
        resizeMode: 'cover',
    },
    square: {
        width: '75%',  // Width of the square
        height: '60%', // Height of the square
        backgroundColor: 'rgba(176, 190, 197, 0.5)',  // Background color of the square
        borderRadius: 30,  // Rounded edges (you can adjust this value for more or less rounding)
        alignItems: 'center',
        justifyContent: 'center',
    },
    point: {
        top: '5%',
        padding: 45,
        fontSize: 100,
        color: 'white',
    },
    planetName: {
        padding: 5,
        fontSize: 30
    },
    learnMore: {
        backgroundColor: '#0d47a1', // Blue background color
        paddingVertical: 8, // Vertical padding
        paddingHorizontal: 20, // Horizontal padding
        borderRadius: 20,
    },
    learnMoreText: {
        color: '#ffffff', // Text color (white)
        fontSize: 18, // Text size
        fontFamily: 'Roboto', // Font family
        fontWeight: 'bold', // Font weight
    },
});

export default PlanetFront;
