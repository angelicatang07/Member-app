import React from 'react';
import { StyleSheet } from 'react-native';

import Screen from '../components/Screen';
import Badge from '../components/Badge';

function BadgesScreen(props) {
  return (
    <Screen>
      <Badge badge={'Mercury Badge'} color={'gold'} completed={true} />
      <Badge badge={'STEM - E Badge'} color={'silver'} />
    </Screen>
  );
}

export default BadgesScreen;

const styles = StyleSheet.create({});
