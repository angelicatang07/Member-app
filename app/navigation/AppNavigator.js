import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/Octicons';
import { auth, app } from '../navigation/firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import CalendarScreen from '../screens/CalendarScreen';
import AdminScreen from '../screens/AdminScreen';
import ChallengesNavigator from '../navigation/ChallengesNavigator';
import DashboardNavigator from './DashboardNavigator';
import SocialsScreen from '../screens/SocialsScreen';
import RedeemQRCodeScreen from '../screens/RedeemQRCodeScreen';

import adminCheck from '../components/AdminCheck';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await adminCheck();
      setIsAdmin(adminStatus);
    };

    async function onAuthStateChanged(user) {
        checkAdminStatus();
    }

    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  return (<Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        position: 'absolute',
      },
    }}
  >
    <Tab.Screen
      name="DashboardNavigator"
      component={DashboardNavigator}
      options={{
        tabBarIcon: ({ size }) => (
          <Icons name="home" size={size} color={'#fff'} />
        ),
        title: '',
      }}
    />
    <Tab.Screen
      name="Calendar"
      component={CalendarScreen}
      options={{
        tabBarIcon: ({ size }) => (
          <Icons name="calendar" size={size} color={'#fff'} />
        ),
        title: '',
      }}
    />
  <Tab.Screen
    name="RedeemQRCode"
    component={RedeemQRCodeScreen}
    options={{
      tabBarIcon: ({ size }) => (
        <FontAwesome name="qrcode" size={size} color="#fff" />  // Using FontAwesome's 'qrcode' icon
      ),
      title: '',
    }}
  />
    {isAdmin && (
      <Tab.Screen
        name="AdminPage"
        component={AdminScreen}
        options={{
          tabBarIcon: ({ size }) => (
            <Icons name="tools" size={size} color={'#fff'} />
          ),
          title: '',
        }}
      />
    )}
    <Tab.Screen
      name="Challenges"
      component={ChallengesNavigator}
      options={{
        tabBarIcon: ({ size }) => (
          <Icons name="list-ordered" size={size} color={'#fff'} />
        ),
        title: ''
      }}
    />
    <Tab.Screen
      name="Socials"
      component={SocialsScreen}
      options={{
        tabBarIcon: ({ size }) => (
          <Icons name="people" size={size} color={'#fff'} />
        ),
        title: '',
      }}
    />
  </Tab.Navigator>
);};

export default AppNavigator;
