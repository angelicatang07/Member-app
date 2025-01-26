import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Modal, FlatList, StyleSheet, TouchableOpacity, findNodeHandle } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import the QRCode component
import adminCheck from '../components/AdminCheck';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

// This is your Calendar screen component
const CalendarNode = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventStartTime, setEventStartTime] = useState(null);
  const [eventEndTime, setEventEndTime] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [qrVisible, setQrVisible] = useState(false); // State to control QR code visibility
  const [showHideQRCode, setShowHideQRCode] = useState("Show QR Code")
  const qrCodeRef = useRef();

  
    // Function to fetch events from the backe
    const fetchEvents = async (key1, key2) => {
      try {
        const serverAddress = 'https://testrunsteme-d7epe6eubzabbpgk.eastus-01.azurewebsites.net/';
        let response1 = await fetch(serverAddress + key1);
        const data1 = await response1.json();
        let response2 = await fetch(serverAddress + key2);
        const data2 = await response2.json();
        const dataArray1 = Array.isArray(data1) ? data1 : [data1];
        const dataArray2 = Array.isArray(data2) ? data2 : [data2];
      
        const data = [...dataArray1, ...dataArray2];
    
        // Filter out events with invalid date formats
        const validEvents = data.filter(event => {
          const startTime = dateFormat(event.start.dateTime);
          const endTime = dateFormat(event.end.dateTime);
          return startTime !== "error" && Object.keys(startTime).length > 0 && endTime !== "error" && Object.keys(endTime).length > 0;
        });
    
        setEvents(events.concat(validEvents));
        setLoading(false); // Disable loading spinner after fetching
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };
    
  // Use `useEffect` to automatically fetch events when the screen loads
  useEffect(() => {
    fetchEvents('meetings', 'general'); 
    // fetchEvents('general'); 
    // fetchEvents('events');
    // fetchEvents('orientations');

    const checkAdminStatus = async () => {
      const adminStatus = await adminCheck();
      setIsAdmin(adminStatus);
    };

    checkAdminStatus();
  }, []);

  

  const dateFormat = (unformattedDate) => {
    // unformatted date looks like 2025-01-26T17:00:00-06:00 - this is CST
    if (!unformattedDate) {
      return "error"; // Return an empty object to prevent further errors
    }
  
    const months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    ];
  
    const dateParts = unformattedDate.split('T')[0].split('-');
    const timeParts = unformattedDate.split('T')[1]?.split('-')[0]?.split(':');
  
    if (dateParts.length < 3 || !timeParts || timeParts.length < 3) {
      return {};
    }
  
    // parse the input
    const [year, month, day] = dateParts.map(Number);
    const [hour, minute, second] = timeParts.map(Number);
  
    const inputDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const isDST = isDateInDST(inputDate); // determine if it's DST
    const offset = isDST ? 5 : 6; // CDT (UTC-5) or CST (UTC-6)
  
    // Convert to UTC with the appropriate offset
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour + offset, minute, second));
  
    // Convert UTC time to the user's local timezone
    const localDate = new Date(utcDate);
  
  
    // Extract local time components
    const localYear = localDate.getFullYear();
    const localMonth = localDate.getMonth() + 1; // Months are 0-indexed
    const localDay = localDate.getDate();
    const localHour = localDate.getHours();
    const localMinute = localDate.getMinutes();
    const localSecond = localDate.getSeconds();
  
    const isPM = localHour >= 12;
    const formattedHour = isPM ? localHour - 12 : localHour;
    const displayHour = formattedHour === 0 ? 12 : formattedHour; // Adjust for 12-hour clock
  
    return {
      year: localYear,
      month: localMonth.toString().padStart(2, '0'),
      monthName: months[localMonth - 1],
      day: localDay.toString().padStart(2, '0'),
      hour: displayHour,
      minute: localMinute.toString().padStart(2, '0'),
      second: localSecond.toString().padStart(2, '0'),
      amPM: isPM ? 'PM' : 'AM',
    };
  };
  
  const isDateInDST = (date) => {
    // DST is second sunday in March to first Sunday in November in the US
    // If the US gov changes DST policy, this may have to be changed
    // Also, there may be some issues with the transition period

    const year = date.getFullYear();
  
    // Second Sunday in March
    const marchStart = new Date(Date.UTC(year, 2, 1)); // March 1st
    const marchDSTStart = new Date(
      Date.UTC(
        year,
        2,
        1 + (7 - marchStart.getUTCDay()) % 7 + 7, // Second Sunday in March
        2, // 2 AM UTC. Note that locally, it will happen a few hours later (about 8 AM UTC in CST)
      )
    );
  
    // First Sunday in November
    const novemberStart = new Date(Date.UTC(year, 10, 1)); // November 1st
    const novemberDSTEnd = new Date(
      Date.UTC(
        year,
        10,
        1 + (7 - novemberStart.getUTCDay()) % 7, // First Sunday in November
        2, // 2 AM UTC. Note that locally, it will happen a few hours later (about 8 AM UTC in CST)
      )
    );
  
    // Check if the date falls within the DST period
    return date >= marchDSTStart && date < novemberDSTEnd;
  };

  const openModal = (event, eventStart, eventEnd) => {
    setSelectedEvent(event);
    setEventStartTime(eventStart);
    setEventEndTime(eventEnd);
    setModalVisible(true);
    setQrVisible(false); // Reset QR code visibility when opening the modal
    setShowHideQRCode("Show QR Code");
  } 

  const closeModal = () => {
    setSelectedEvent(null);
    setEventStartTime(null);
    setEventEndTime(null);
    setModalVisible(false);
  }

  const handleCapture = async () => {
    try {
      // Capture QR code as an image
     // console.log(qrCodeRef.current)
      // const tag = findNodeHandle(qrCodeRef.current);
      console.log('React tag:', tag); // This will log the React tag (e.g., 1348)
      const uri = await captureRef(qrCodeRef.current, {
        format: 'png',
        quality: 0.8,
      });
      
     // const uri = "https://picsum.photos/200"
  
      // Request permission to access media library
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        await MediaLibrary.saveToLibraryAsync(uri);
        alert('QR code image saved to your library!');
      } else {
        alert('Permission to access the gallery is required!');
      }
    } catch (error) {
      console.error('Failed to capture screenshot', error);
    }
  };

  const toggleQrCode = () => {
    setQrVisible(!qrVisible); // Toggle QR code visibility
    if(showHideQRCode === "Show QR Code"){
      setShowHideQRCode("Hide QR Code");
    }
    else{
      setShowHideQRCode("Show QR Code");
    }
  }

  // Render events or a loading spinner
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <FlatList
        horizontal= {true}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const startTime = dateFormat(item.start.dateTime);
            const endTime = dateFormat(item.end.dateTime);
            return (

              
              <TouchableOpacity onPress={() => openModal(item, startTime, endTime)}>
               <View style={[{flexDirection: 'column'}]}>



                <View style={styles.eventContainer}>
                  <View style={[{backgroundColor: '#939CEB'}, {height: 50}, {width: 50}, {borderRadius: 25}, {marginLeft: 10}, {alignItems: "center"}, {justifyContent: "center"}, ]}>
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
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontWeight:"bold"}}>Event Details</Text>
              {isAdmin && 
                <TouchableOpacity onPress={toggleQrCode}>
                  <Text style={styles.buttonText}>{showHideQRCode}</Text>
                </TouchableOpacity>
                }
                {qrVisible && selectedEvent && (
                  <View ref={qrCodeRef} style={styles.qrContainer}>
                    <QRCode
                      value={`A2k7X9wz|${eventStartTime.day}${eventStartTime.month}${eventStartTime.year}|${eventStartTime.hour}:${eventStartTime.minute} ${eventStartTime.amPM}|${eventEndTime.hour}:${eventEndTime.minute} ${eventEndTime.amPM}|${(selectedEvent.description?.match(/Points:\s*(\d+)/)?.[1] ?? 0)}|${selectedEvent.summary}|${(selectedEvent.description?.match(/Times_Redeemable:\s*([\w\s]+)/)?.[1] ?? "Unlimited")}`}
                      size={150}
                    />
                  </View>
                )}
                {qrVisible && selectedEvent && (
                  <TouchableOpacity onPress={handleCapture}>
                    <Text style={styles.buttonText}>Save Image</Text>
                  </TouchableOpacity>
                  )}

            {selectedEvent && (
             <View style={styles.container}>
                
                <View>
                  <View style={[{backgroundColor: '#939CEB'}, {height: 50}, {width: 50}, {borderRadius: 25}, {alignItems: "center"}, {justifyContent: "center"}]}>
                    <Text style={styles.eventDateNumber}>{eventStartTime.day}</Text>
                    <Text style={styles.eventHeader}>{eventStartTime.monthName}</Text>
                  </View>
                </View>
              
                <View style={styles.innerContainer}>    
                  {selectedEvent && (
                    <View>
                      <Text>{selectedEvent.summary}</Text>
                      <View>
                        <Text style={{paddingTop:10}}>
                          Time: {""}
                          {eventStartTime.hour + ':' + eventStartTime.minute + ' ' + eventStartTime.amPM + ' - ' +
                            eventEndTime.hour + ':' + eventEndTime.minute + ' ' + eventEndTime.amPM}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

            </View>
            )}


            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 10,
    flexDirection: "row",
    margin: 5,
    overflow: 'hidden'
  },
  eventDateNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: -3,
    marginTop: -2,
    marginLeft: 0
  },
  eventHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: 'rgba(255, 255, 255, 1)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row-reverse'
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingRight: 10
    },
  innerContainer: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 10,
    width: 350,
    height: 100,
    margin: 5,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center', // Center the text
    marginTop: 10,
    marginBottom: 0
  },
  qrContainer: {
    marginTop: 20, // Add some space above the QR code
    alignItems: 'center', // Center the QR code
  },
})

export default CalendarNode;
