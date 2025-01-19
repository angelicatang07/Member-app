import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Screen from '../components/Screen';

function RedeemQRCodeScreen({ navigation, route }) {
    const { data } = route.params || { data: "||||" }; 
    const dataArray = data.split('|');
    var [verifactionCode, date, startTime, endTime, points, eventName, timesRedeemable] = dataArray.map(item => item.trim());
    
    if (date.length === 8){
       // Alert.alert("Success", "QR Code scanned successfully!")
    }
    else if (date.length != 0){
        Alert.alert("Error", date)
        date = ""
        startTime = ""
        endTime = ""
        points = ""
        eventName = ""
        timesRedeemable = ""
    }

    const getOrdinalSuffix = (day) => {
        if (day % 10 === 1 && day % 100 !== 11) return "st";
        if (day % 10 === 2 && day % 100 !== 12) return "nd";
        if (day % 10 === 3 && day % 100 !== 13) return "rd";
        return "th";
      };
      
      // Function to convert the date string to the desired format
      const formatDate = (dateStr) => {
        if(dateStr.length != 8){
            return "";   // this will occur when the user first arrives at the screen
        }
        const day = dateStr.slice(0, 2)
        const month = dateStr.slice(2, 4)
        const year = dateStr.slice(4, 8)

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
      
        const monthName = monthNames[month - 1]; // Get the month name
        const ordinalSuffix = getOrdinalSuffix(day); // Get the ordinal suffix
        return `${monthName} ${day}${ordinalSuffix}, ${year}`;
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