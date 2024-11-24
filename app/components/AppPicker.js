import React, { useState, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Button,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PickerItem from './PickerItem';

const AppPicker = ({
  items,
  onSelectItem,
  selectedItem,
  numberOfColumns,
  PickerItemComponent = PickerItem,
  placeholder,
  width = '100%',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width }]}>
          {selectedItem ? (
            <Text style={styles.text}>{selectedItem}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}

          <MaterialCommunityIcons
            name={'chevron-down'}
            size={20}
            color={'grey'}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <View>
          <Button title="Close" onPress={() => setModalVisible(false)} />
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()} // Assuming each item has a unique 'id'
            numColumns={numberOfColumns}
            renderItem={({ item }) => (
              <PickerItemComponent
                label={item.label}  // Assuming 'label' is the field to display
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item);
                }}
              />
            )}
          />
        </View>
      </Modal>
    </>
  );
};

export default memo(AppPicker);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161B45',
    borderColor: '#979797',
    borderRadius: 25,
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: 'grey',
    flex: 1,
  },
  text: {
    flex: 1,
    color: '#FFFFFF',
  },
});
