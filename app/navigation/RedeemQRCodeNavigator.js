import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import QRCodeScanner from '../components/QRScanner'
import RedeemQRCodeScreen from '../screens/RedeemQRCodeScreen';

const Stack = createNativeStackNavigator();

const RedeemQRCodeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
        options={{
            headerShown: false,
        }}
        name="RedeemQRCode"
        component={RedeemQRCodeScreen}
    />
    <Stack.Screen
        options={{
            headerShown: false,
        }}
        name="QR Code Scanner"
        component={QRCodeScanner}
        />
    </Stack.Navigator>
    );

export default RedeemQRCodeNavigator;
