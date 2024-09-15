import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

function AppImagePicker({ height, width }) {
  const [image, setImage] = useState();

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      alert('You need to enable permissions to access the library');
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        allowsEditing: true,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error reading an image');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={pickImage}>
      <View
        style={{
          alignItems: 'center',
          borderColor: 'white',
          borderRadius: width / 2,
          borderWidth: 4,
          height: height,
          justifyContent: 'center',
          width: width,
        }}
      >
        {image && (
          <Image
            style={{
              height: height - 5,
              width: width - 5,
              borderRadius: width / 2,
            }}
            source={{ uri: image }}
          />
        )}
        <View
          style={{
            alignItems: 'center',
            borderRadius: width / 2,
            backgroundColor: 'transparent',
            flex: 1,
            height: height,
            justifyContent: 'space-around',
            position: 'absolute',
            width: width,
          }}
        >
          {!image && <Text style={styles.textHeading}>Profile Picture</Text>}
          <View style={styles.textContainer}>
            <Text style={styles.text}>Change</Text>
            <Text style={styles.text}>Picture</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default AppImagePicker;

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 15,
  },
  textContainer: {
    position: 'absolute',
    top: 130,
  },
  textHeading: {
    color: '#fff',
    fontSize: 35,
    paddingBottom: 60,
  },
});