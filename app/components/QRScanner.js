import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, setDoc, getFirestore, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);  // New state for user's name

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      setUserName(currentUser.displayName || 'Guest'); // Set the user's name or default to 'Guest'
    } else {
      console.log("No user is signed in.");
    }
  }, []);

  async function addEvent(userId, points, name) {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        name: userName
      });
    }

    const eventsCollectionRef = collection(userRef, "Events");
    const testEventRef = doc(eventsCollectionRef, name);

    const testEventSnapshot = await getDoc(testEventRef);

    if (!testEventSnapshot.exists()) {
      await setDoc(testEventRef, {
        points: points
      });
    }
  }

  async function updateUserPoints(userId) {
    const userRef = doc(db, "users", userId);
    const tasksCollectionRef = collection(userRef, "Events");

    const taskSnapshot = await getDocs(tasksCollectionRef);
    let totalPoints = 0;

    taskSnapshot.forEach((doc) => {
      const taskData = doc.data();
      totalPoints += parseInt(taskData.points, 10) || 0;
    });

    await setDoc(userRef, { points: totalPoints }, { merge: true });
  }

  function generateRandomAsciiCode() {
    let code = '';
    for (let i = 0; i < 8; i++) {
      const randomAscii = Math.floor(Math.random() * 94) + 33;
      code += String.fromCharCode(randomAscii);
    }
    return code;
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const dataArray = data.split('|');
    const [verifactionCode, points, eventName, startTime, endTime, timesRedeemable] = dataArray.map(item => item.trim());

    const eventsCollectionRef = collection(doc(db, "users", userId), "Events");
    const eventsSnapshot = await getDocs(eventsCollectionRef);

    const eventNamesArray = [];

    eventsSnapshot.forEach((doc) => {
      const eventNameFromId = doc.id.split('|')[0];
      eventNamesArray.push(eventNameFromId);
    });
    const timesInArray = eventNamesArray.filter(item => item === eventName).length;

    if (verifactionCode === "A2k7X9wz" && timesInArray < parseInt(timesRedeemable, 10)) {
      alert("QR Code Redeemed Successfully!");

      const randomCode = generateRandomAsciiCode();
      const eventWithCode = `${eventName}|${randomCode}`;

      await addEvent(userId, points, eventWithCode);
      await updateUserPoints(userId);

      navigation.navigate('RedeemQRCode', { data: `${data}` });
    } else if (timesInArray >= parseInt(timesRedeemable, 10)) {
      alert("The event has already been claimed the maximum amount of times");
    } else {
      alert("Invalid QR Code");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
});
