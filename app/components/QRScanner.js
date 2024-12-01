import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc, setDoc, getFirestore, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigation = useNavigation();

  const db = getFirestore();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      setUserName(currentUser.displayName || "Guest");
    } else {
      console.log("No user is signed in.");
    }
  }, []);

  useEffect(() => {
  }, [scanned]);

  async function addEvent(userId, points, name) {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        name: userName,
      });
    }

    const eventsCollectionRef = collection(userRef, "Events");
    const testEventRef = doc(eventsCollectionRef, name);

    const testEventSnapshot = await getDoc(testEventRef);

    if (!testEventSnapshot.exists()) {
      await setDoc(testEventRef, {
        points: points,
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

  /*
  function generateRandomAsciiCode() {
    let code = "";
    for (let i = 0; i < 8; i++) {
      const randomAscii = Math.floor(Math.random() * 94) + 33;
      code += String.fromCharCode(randomAscii);
    }
    return code;
  }
    */

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true); // Prevent further scans immediately

    // we take the QR Code data and parse it
    const dataArray = data.split("|");
    const [verificationCode, date, startTime, endTime, points, eventName, timesRedeemable] = dataArray.map((item) => item.trim());

    const eventsCollectionRef = collection(doc(db, "users", userId), "Events");
    const eventsSnapshot = await getDocs(eventsCollectionRef);

    var eventExists = false;
    // eventWithTime is how it appears in firebase
    const eventWithTime = `${eventName}|${date}|${startTime}|${endTime}`;

    // here, we are searching through firebase. If the user is found to have that exact event name (with the same date), the eventExists variable is set to True
    eventsSnapshot.forEach((doc) => {
      const eventNameFromId = doc.id;  
      if (eventNameFromId === eventWithTime) {
        eventExists = true;
      }
    });

    // what we are doing here is taking only the information before the first |, and putting it in an array
    // this array contains all of the event names, but not information such as the time, date, etc.
    // ex: ["Mentor Meeting", "Mentor Meeting", "Other Event"]
    const eventNamesArray = [];
    eventsSnapshot.forEach((doc) => {
      const eventNameFromId = doc.id.split("|")[0];
      eventNamesArray.push(eventNameFromId);
    });

    // this sees how many times the event being scanned is already in firebase by checking how many times it's in the aray
    const timesInArray = eventNamesArray.filter((item) => item === eventName).length;

    // if the code is valid, timesInArray is less than timesRedeemable, and the event is not in the array
    if (verificationCode === "A2k7X9wz" && timesInArray < parseInt(timesRedeemable, 10) && !eventExists) {
      await addEvent(userId, points, eventWithTime);
      await updateUserPoints(userId);

      navigation.navigate("RedeemQRCode", { data: `${data}` });

      // if the event is in firebase too many times
    } else if (timesInArray >= parseInt(timesRedeemable, 10)) {
      navigation.navigate('RedeemQRCode', {data: "error|The event has already been claimed the maximum amount of times."})
      // if the user has already claimed this specific QR Code
    } else if (eventExists) {
      navigation.navigate('RedeemQRCode', {data: "error|You have already claimed this QR Code."})
    // if the verifaction code is invalid or something else occurs
    } else {
      navigation.navigate('RedeemQRCode', {data: "error|Invalid QR Code."})
    }
    setScanned(false);
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