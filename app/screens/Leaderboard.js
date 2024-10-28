import React, { useState, useEffect } from 'react';
import {StyleSheet,
    View,
    SafeAreaView,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

import { auth, app } from '../navigation/firebase';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';

import { getDatabase, ref as dbRef, get } from 'firebase/database';

const db = getFirestore(app);

const Divider = () => {
    return (
        <View
            style={styles.divider}
        />
    );
}

const Rank = (props) => {
    switch(props.place) {
        case 1:
            return (
                <View style={styles.rankBox}>
                    <Image source={require('../assets/leaderboardMetalFirst.png')} style={styles.rankImage} />
                </View>
            );
        case 2:
            return (
                <View style={styles.rankBox}>
                    <Image source={require('../assets/leaderboardMetalSecond.png')} style={styles.rankImage} />
                </View>
            );
        case 3:
            return (
                <View style={styles.rankBox}>
                    <Image source={require('../assets/leaderboardMetalThird.png')} style={styles.rankImage} />
                </View>
            );
        default:
            return (
                <View style={styles.rankBox}>
                    <Text style={styles.rankText} adjustsFontSizeToFit={true} numberOfLines={1}>{props.place}</Text>
                </View>
            );
    }
}

function RectangleBoxDisplay() {
    return (
        <ImageBackground source={require('../assets/leaderboardHighlight.png')} style={{
            position: 'absolute',
            top: -10,
            height: 120,
            width: Dimensions.get('window').width
        }}></ImageBackground>
    );
}

const ReactangleBox = (props) => {
    return (
        <>
        {props.isGlowing && <RectangleBoxDisplay />}

        <View style={styles.rectangleBox}>
            <Rank place={props.data.placement} />

            <Divider />

            {props.data.picture
            ? <Image src={props.data.picture} style={styles.profilePic} />
            : <Image source={require("../assets/tempProfilePhoto.png")} style={styles.profilePic} />}

            <View style={styles.nameBox}>
                <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>
                    {props.data.name}
                </Text>
            </View>

            <Text style={styles.pointsText} adjustsFontSizeToFit={true} numberOfLines={1}>
                {props.data.points}
            </Text>
        </View>
    </>
    );
}

const LeaderboardList = props => {
    return (
        <SafeAreaView style={styles.leaderboardList}>
            <FlatList
                data={props.data}
                renderItem={({item}) => {
                    return(<ReactangleBox data={item} key={item.id} isGlowing={item.isGlowing} />);
                }}
                keyExtractor={(item) => item.id}
                style={{height: Dimensions.get('window').height * (5/6)}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

// disabled={true} on TouchableWithoutFeedback IS REQUIRED FOR THE FLATLIST TO BE SCROLLABLE!!!
function Screen({ children, style }) {
    return (
    <LinearGradient
        colors={['rgba(35,25,35,1)', 'rgba(5,13,65,1)', 'rgba(112,54,148,1)']}
        locations={[0, 0.6, 0.9]}
        start={{ x: 2.32, y: 0 }}
        end={{ x: 0, y: 1.0 }}
        style={[{ flex: 1 }, style]}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} disabled={true}>
            <View style={[styles.background, style]}>{children}</View>
        </TouchableWithoutFeedback>
    </LinearGradient>
    );
}

// Function to fetch the profile picture URL
const fetchProfilePicture = async (picId) => {
    try {
        const userRef = dbRef(getDatabase(), `users/${picId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            return snapshot.val().profilePicture;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error('Error fetching profile picture: ', error);
        throw error; // Propagate the error to be handled by the caller
    }
};

async function fetchLeaderboardData() {
    const q = await query(collection(db, "users"));
    const querySnapshot = await getDocs(q);

    const sortedData = querySnapshot.docs
        .map(doc => ({ id: doc.id, name: doc.name ? doc.name : "Unnamed", ...doc.data() }))
        .filter(user => user.points !== undefined)
        .sort((a, b) => b.points - a.points);
    
    sortedData.forEach(async (user, index) => {
        const authUser = auth.currentUser;
        user.isGlowing = user.id === auth.currentUser.uid;
        
        user.placement = index + 1;

        user.picture = await fetchProfilePicture(user.id);
    });

    return sortedData;
}

function Leaderboard({ navigation }) {
    const [leaderboardData, setLeaderboardData] = useState(null);

    useEffect(() => {
      const updateLeaderboardData = async () => {
        const _leaderboardData = await fetchLeaderboardData();
        setLeaderboardData(_leaderboardData);
      };
    
      updateLeaderboardData();
    }, []);

    return (
        <Screen style={styles.screen}>
            <TouchableOpacity onPress={() => {navigation.goBack()} } style={styles.backArrowContainer}>
                <Text style={styles.backArrow}>{'<'}</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Leaderboard</Text>

            <LeaderboardList data={leaderboardData} />
        </Screen>
    );
}

export default Leaderboard;

const styles = StyleSheet.create({
    screen: {
        paddingTop: 120,
        flex: 1
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        flex: 1,
        padding: 15,
        paddingTop: Constants.statusBarHeight + 10,
    },
    backArrowContainer: {
        position: 'absolute',
        width: 75,
        height: 35,
        left: 13,
        padding: 0,
        top: 50,
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 1
    },
    backArrow: {
        color: '#ffffff',
        fontSize: 30,
        fontFamily: 'Roboto', 
        fontWeight: '700',
        textAlign: 'center',
    },
    leaderboardList: {
        marginHorizontal: -16
    },
    rectangleBox: {
        backgroundColor: '#3F1AC9',
        height: 85,
        borderRadius: 25,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    title: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 30,
        textAlign: 'center',
        position: 'absolute',
        top: 50
    },
    pointsText: {
        color: '#C7C7C7',
        fontSize: 25,
        textAlign: 'right',
        alignSelf: 'center',
        flex: 0.25
    },
    divider: {
        borderLeftColor: 'black',
        borderLeftWidth: 2,
        flex: 0.1,
        marginTop: -16,
        marginBottom: -16,
        marginLeft: 10
    },
    profilePic: {
        width: 65,
        height: 65,
        borderRadius: 45,
        marginTop: -6,
        alignSelf: 'flex-start'
    },
    rankBox: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.25
    },
    rankImage: {
        width: 45,
        height: 45,
        marginTop: 2
    },
    rankText: {
        color: '#C7C7C7',
        textAlign: 'center',
        fontSize: 25
    },
    nameBox: {
        flex: 1,
        paddingLeft: 10,
        justifyContent: 'center'
    },
    name: {
        color: '#C7C7C7',
        fontSize: 25,
        paddingRight: 10
    }
});