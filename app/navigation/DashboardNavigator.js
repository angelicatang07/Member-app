import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsNavigator from './SettingsNavigator';
import DashboardScreen from '../screens/DashboardScreen';
import BadgesScreen from '../screens/BadgesScreen';
import MercuryFront from '../screens/MercuryFront';
import MercuryBack from '../screens/MercuryBack';
import VenusFront from '../screens/VenusFront';
import VenusBack from '../screens/VenusBack';
import EarthFront from '../screens/EarthFront';
import EarthBack from '../screens/EarthBack';
import MarsFront from '../screens/MarsFront';
import JupiterFront from '../screens/JupiterFront';
import SaturnFront from '../screens/SaturnFront';
import UranusFront from '../screens/UranusFront';
import NeptuneFront from '../screens/NeptuneFront';
import PlutoFront from '../screens/PlutoFront';
import MarsBack from '../screens/MarsBack';
import JupiterBack from '../screens/JupiterBack';
import SaturnBack from '../screens/SaturnBack';
import UranusBack from '../screens/UranusBack';
import NeptuneBack from '../screens/NeptuneBack';
import PlutoBack from '../screens/PlutoBack';
import Leaderboard from '../screens/Leaderboard';

// import QRCodeScanner from '../components/QRScanner';

const Stack = createNativeStackNavigator();

const DashboardNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{ headerShown: false }}
      name="Dashboard"
      component={DashboardScreen}
    />
    <Stack.Screen
      options={{ headerShown: false }}
      name="Leaderboard"
      component={Leaderboard}
    />
    <Stack.Screen
      options={{
        headerShown: false,
        headerTransparent: true,
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      }}
      name="Settings"
      component={SettingsNavigator}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="Badges"
      component={BadgesScreen}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="MercuryFront"
      component={MercuryFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="MercuryBack"
      component={MercuryBack}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="VenusFront"
      component={VenusFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="VenusBack"
      component={VenusBack}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="EarthFront"
      component={EarthFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="EarthBack"
      component={EarthBack}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="MarsFront"
      component={MarsFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="MarsBack"
      component={MarsBack}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="JupiterFront"
      component={JupiterFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="JupiterBack"
      component={JupiterBack}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="SaturnFront"
      component={SaturnFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="SaturnBack"
      component={SaturnBack}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="UranusFront"
      component={UranusFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="UranusBack"
      component={UranusBack}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="NeptuneFront"
      component={NeptuneFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="NeptuneBack"
      component={NeptuneBack}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="PlutoFront"
      component={PlutoFront}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="PlutoBack"
      component={PlutoBack}
    />
  </Stack.Navigator>
);

export default DashboardNavigator;
