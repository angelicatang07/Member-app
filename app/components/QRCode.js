import React, { useRef } from 'react';
import { View, TouchableOpacity, Button, Alert, StyleSheet, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';  // To save the image
import Screen from '../components/Screen';

const QRCodeDisplay = ({ navigation, route }) => {
  const { data } = route.params; 
  const qrCodeRef = useRef();
  const qrData = data;

  const handleCapture = async () => {
    try {
      // Capture QR code as an image
      console.log("Attempting to capture QR Code...");
      const uri = await captureRef(qrCodeRef.current, {
        format: 'png',
        quality: 0.8,
      });

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

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.qrContainer} collapsable={false} ref={qrCodeRef}>
          <QRCode
            value={qrData}
            size={200}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCapture}>
          <Text style={styles.buttonText}>Capture QR Code</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    marginBottom: 30, // Increased space between QR code and button
  },
  button: {
    backgroundColor: '#6200EE', // Deep purple color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, // Rounded corners
    shadowColor: '#000', // Shadow for a cool effect
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // Elevation for Android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QRCodeDisplay;
