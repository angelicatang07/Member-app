import React from 'react';
import AuthNavigator from './app/navigation/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import TechSupportScreen from './app/screens/TechSupportScreen';
import QRCode from './app/components/QRCode';
import QRScanner from './app/components/QRScanner';
import CalendarScreen from './app/components/Calendar';
import Toast from 'react-native-toast-message'; 

export default function App() {
  return (
    <>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} /> {/* Add Toast component */}
    </>
  );
}
