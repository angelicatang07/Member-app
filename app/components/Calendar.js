import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';

// This is your Calendar screen component
const CalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch events from the backend
  const fetchEvents = async () => {
    try {
      // Replace with your server's address and endpoint
      const response = await fetch('http://10.0.2.2:3000/events');
      const data = await response.json();
      setEvents(data);
      setLoading(false); // Disable loading spinner after fetching
      console.log(data)
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  // Use `useEffect` to automatically fetch events when the screen loads
  useEffect(() => {
    fetchEvents(); // Automatically fetch events when component mounts
  }, []);

  // Render events or a loading spinner
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.summary}</Text>
              <Text>Start: {item.start.dateTime}</Text>
              <Text>End: {item.end.dateTime}</Text>
              <Text>Location: {item.location}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default CalendarScreen;