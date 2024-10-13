import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';

// This is your Calendar screen component
const CalendarNode = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch events from the backend
  const fetchEvents = async (key) => {
    try {
      // Replace with your server's address and endpoint
      const serverAddress = 'https://testrunsteme-d7epe6eubzabbpgk.eastus-01.azurewebsites.net/';
      let response = await fetch(serverAddress + key);
      const data = await response.json();
      setEvents(events.concat(data));
      setLoading(false); // Disable loading spinner after fetching
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  // Use `useEffect` to automatically fetch events when the screen loads
  useEffect(() => {
    fetchEvents('general'); // Automatically fetch events when component mounts
    fetchEvents('events');
    fetchEvents('orientations');
  }, []);

  const dateFormat = (unformattedDate) => {
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];

    // Get the date from the following format (The T separates the date from the time): YYYY-MM-DDTHH:MM:SS-HHMMSS
    const date = unformattedDate.split('T')[0].split('-');
    const time = unformattedDate.split('T')[1].split('-')[0].split(':');
    const isPM = time[0] > 12;

    const data = {
      year: date[0],
      month: date[1],
      monthName: months[parseInt(date[1]) - 1],
      day: date[2],
      
      hour: isPM ? time[0] - 12 : time[0],
      minute: time[1],
      second: time[2],
      amPM: isPM ? 'PM' : 'AM',
    };

    return data;
  }

  // Render events or a loading spinner
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const startTime = dateFormat(item.start.dateTime);
            const endTime = dateFormat(item.end.dateTime);

            return (
              <View style={styles.eventContainer}>
                <View style={[{backgroundColor: '#939CEB'}, {height: 50}, {width: 50}, {borderRadius: 25}, {marginLeft: 10}, {alignItems: "center"}, {justifyContent: "center"}]}>
                  <Text style={styles.eventDateNumber}>{startTime.day}</Text>
                  <Text style={styles.eventHeader}>{startTime.monthName}</Text>
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={styles.eventHeader}>{startTime.hour + ':' + startTime.minute + ' ' + startTime.amPM}</Text>
                  <Text style={[styles.eventHeader, {fontSize: 10}]}>{item.summary}</Text>
                  <Text style={[styles.eventHeader, {fontSize: 9}, {marginBottom: 2}]}>{
                    startTime.hour + ':' + startTime.minute + ' ' + startTime.amPM + ' - '
                    + endTime.hour + ':' + endTime.minute + ' ' + startTime.amPM
                  }</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventContainer: {
    backgroundColor: '#6A76DE',
    height: 70,
    width: 200,
    borderRadius: 10,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  eventDateNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: -3,
    marginTop: -2
  },
  eventHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
  },
})

export default CalendarNode;