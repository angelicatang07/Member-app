import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, set, get } from 'firebase/database';
import { auth } from '../navigation/firebase';

// Function to fetch the profile picture URL
export const fetchProfilePicture = async () => {
    const currentUser = auth.currentUser;

    const userId = currentUser.uid;
    const userRef = dbRef(getDatabase(), `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val().profilePicture;
    }
};

// Function to upload an image and get the download URL
export const uploadImage = async (uri) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const response = await fetch(uri);
    const blob = await response.blob();

    const userId = currentUser.uid;
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${userId}`);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    await saveProfilePictureURL(downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image: ', error);
    throw error; // Propagate the error to be handled by the caller
  }
};

// Function to save the profile picture URL to the database
export const saveProfilePictureURL = async (url) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const userId = currentUser.uid;
    const userRef = dbRef(getDatabase(), `users/${userId}`);
    await set(userRef, { profilePicture: url });
  } catch (error) {
    console.error('Error saving profile picture URL: ', error);
    throw error; // Propagate the error to be handled by the caller
  }
};
