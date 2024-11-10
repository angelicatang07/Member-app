import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Screen from '../components/Screen';

function RedeemQRCodeScreen({ navigation, route }) {
    const { data } = route.params || { data: "||||" }; 
    const dataArray = data.split('|');
    const [verifactionCode, points, eventName, startTime, endTime, timesRedeemable] = dataArray.map(item => item.trim());

    const handleCapture = async () => {
        navigation.navigate('QR Code Scanner', { data }); // Pass the original data if needed
    };
    

    return (
        <Screen style={styles.screen}>
            <Text style={styles.title}>Redeem QR Code</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Points:</Text>
                <Text style={styles.value}>{points}</Text>

                <Text style={styles.label}>Event Name:</Text>
                <Text style={styles.value}>{eventName}</Text>

                <Text style={styles.label}>Start Time:</Text>
                <Text style={styles.value}>{startTime}</Text>

                <Text style={styles.label}>End Time:</Text>
                <Text style={styles.value}>{endTime}</Text>

                <Text style={styles.label}>Times Redeemable:</Text>
                <Text style={styles.value}>{timesRedeemable}</Text>
            </View>
            <TouchableOpacity onPress={handleCapture} style={styles.button}>
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
