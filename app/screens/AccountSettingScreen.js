import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For pencil icon
import AppImagePicker from '../components/AppImagePicker';
import MenuButton from '../components/MenuButton';
import { auth } from '../navigation/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database'; // Change the import
import { useFocusEffect } from '@react-navigation/native';

function AccountSettingScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState(""); // Default description
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [tempDescription, setTempDescription] = useState(description); // Temporary description for editing

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      // Fetch user description from Firebase if user is logged in
      if (currentUser) {
        const db = getDatabase();
        const userRef = ref(db, `users/${currentUser.uid}`); // Reference to the user node
        try {
          const snapshot = await get(userRef); // Use get() instead of once()
          if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData && userData.description) {
              setDescription(userData.description);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });
  
    return () => unsubscribe();
  }, []);

  const email = user ? user.email : "None";
  const name = user ? user.displayName : "No name given"; // the exception doesn't seem to ever occur

  const toggleEditMode = () => {
    if (!isEditing) {
      // When entering edit mode, prefill tempDescription with the current description
      setTempDescription(description);
    } else {
      // If in edit mode and user is saving, update the description in Firebase
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
  
      // Get the existing user data first, then update only the description
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const existingData = snapshot.val(); // Get existing data to avoid overwriting
            const updatedData = {
              ...existingData,
              description: tempDescription, // Update only the description
            };
            update(userRef, updatedData) // Merge updates using update()
              .then(() => {
                setDescription(tempDescription); // Update local description
              })
              .catch((error) => {
                console.error("Error updating description:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
    setIsEditing(!isEditing);
  };

  return (
    // Replace ImageBackground with a solid purple View
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <AppImagePicker width={200} height={200} />
        <View style={styles.descriptionContainer}>
          <View style={styles.topBar}>
            <Text style={styles.label}>Description</Text>
            <TouchableOpacity onPress={toggleEditMode}>
              <MaterialIcons name={isEditing ? "check" : "edit"} size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionBox}>
            {isEditing ? (
              <TextInput
                style={styles.descriptionInput}
                value={tempDescription}
                onChangeText={setTempDescription}
                placeholder="Edit description..." 
                multiline
              />
            ) : (
              <Text style={styles.descriptionText}>{description}</Text>
            )}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.text}>Full Name: {name}</Text>
          <Text style={styles.text}>Email address: {email}</Text>
        </View>
        <MenuButton
          text={'Edit Profile'}
          type={'SECONDARY'}
          style={styles.button}
          onPress={() => navigation.navigate('Edit Profile')}
        />
        <MenuButton
          text={'Reset Password'}
          type={'SECONDARY'}
          style={styles.button}
          onPress={() => navigation.navigate('Password Reset')}
        />
        <MenuButton
          text={'Become an Admin'}
          type={'SECONDARY'}
          style={styles.button}
          onPress={() => navigation.navigate('Become an Admin')}
        />
        <MenuButton
          text={'Delete Account'}
          type={'SECONDARY'}
          style={[{ backgroundColor: '#d40f0f', fontSize: 20 }, styles.button]}
        />
      </ScrollView>
    </View>
  );
}

export default AccountSettingScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'purple', // Solid purple background
    paddingTop: 120,
  },
  scrollViewContainer: {
    paddingBottom: 20,  // Add some padding at the bottom for better spacing
    paddingHorizontal: '5%',
  },
  descriptionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: 'white',
  },
  descriptionBox: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: 'white',
  },
  descriptionInput: {
    fontSize: 16,
    color: 'white',
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  detailsContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  text: {
    color: 'white',
    fontSize: 22,
  },
  button: {
    fontSize: 20,
    marginVertical: 10,
    padding: 20,
  },
});
