import React from 'react';
import AuthNavigator from './app/navigation/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import TechSupportScreen from './app/screens/TechSupportScreen';
import QRCode from './app/components/QRCode';
import QRScanner from './app/components/QRScanner';

export default function App() {
  return (
    // <QRCode />
    // <CalendarScreen />
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}