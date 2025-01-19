import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const TransparentButton = ({
  onPress,
  text,
  text2,
  type = 'PRIMARY',
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}> {text} </Text>
      <Text />
      <Text style={styles.text2}> {text2} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginVertical: 12,
    margin: 20,
    // padding: 15,
    // width: 300,
    height: 230,
    backgroundColor: 'rgba(255,255,255, 0.2)',
    fontSize: 16,
  },
  //  container_PRIMARY: {
  //    backgroundColor: '#9F65D9',
  //    fontSize: 16,
  //  },
  //  container_SECONDARY: {
  //    fontSize: 14,
  //    backgroundColor: 'rgba(135, 121, 164, 0.3)',
  //    marginVertical: 5,
  //  },
  //  container_TERTIARY: {
  //    fontSize: 9,
  //  },
  //  container_LOGOUT: {
  //    backgroundColor: '#9F65D9',
  //    fontSize: 16,
  //  },
  text: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
  },
  text2: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    padding: 2,
  },
});

export default TransparentButton;
