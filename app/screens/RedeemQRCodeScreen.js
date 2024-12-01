import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Screen from '../components/Screen';

function RedeemQRCodeScreen({ navigation, route }) {
    const { data } = route.params || { data: "||||" }; 
    const dataArray = data.split('|');
    var [verifactionCode, date, startTime, endTime, points, eventName, timesRedeemable] = dataArray.map(item => item.trim());

    // note - the alerts should be in QRScanner.js. However, the behavior was really buggy, so for now, they are here
    // there should also be an alert upon successfully scanning the QR Code, but the implementation was buggy so that is commented out
    if (date.length == 8 || date.length == 0){
       // Alert.alert("Success", "QR Code scanned successfully!")
    }
    else{
        Alert.alert("Error", date)
        date = ""
        startTime = ""
        endTime = ""
        points = ""
        eventName = ""
        timesRedeemable = ""
    }

    const formatDate = (dateStr) => {
        if (dateStr.length === 8) {
            const month = dateStr.slice(0, 2);
            const day = dateStr.slice(2, 4);
            const year = dateStr.slice(4, 8);
            return `${month}/${day}/${year}`;
        }
        return dateStr; // Return original if format is incorrect
    };

    return (
        <Screen style={styles.screen}>
            <Text style={styles.title}>Redeem QR Code</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Event Name:</Text>
                <Text style={styles.value}>{eventName}</Text>
                
                <Text style={styles.label}>Points:</Text>
                <Text style={styles.value}>{points}</Text>

                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{formatDate(date)}</Text>

                <Text style={styles.label}>Start Time:</Text>
                <Text style={styles.value}>{startTime}</Text>

                <Text style={styles.label}>End Time:</Text>
                <Text style={styles.value}>{endTime}</Text>

                <Text style={styles.label}>Times Redeemable:</Text>
                <Text style={styles.value}>{timesRedeemable}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('QR Code Scanner', { data })} style={styles.button}>
                <Text style={styles.buttonText}>Scan QR Code</Text>
            </TouchableOpacity>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    infoContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    value: {
        fontSize: 16,
        color: 'white',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#6200ee',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RedeemQRCodeScreen;