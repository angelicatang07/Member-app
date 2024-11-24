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

    const dataArray = data.split("|");
    const [verificationCode, date, startTime, endTime, points, eventName, timesRedeemable] = dataArray.map((item) => item.trim());

    const eventsCollectionRef = collection(doc(db, "users", userId), "Events");
    const eventsSnapshot = await getDocs(eventsCollectionRef);

    var eventExists = false;
    const eventWithTime = `${eventName}|${date}|${startTime}|${endTime}`;

    eventsSnapshot.forEach((doc) => {
      const eventNameFromId = doc.id;  // no splitting, use the full id
      if (eventNameFromId === eventWithTime) {
        eventExists = true;
      }
    });

    const eventNamesArray = [];
    eventsSnapshot.forEach((doc) => {
      const eventNameFromId = doc.id.split("|")[0];
      eventNamesArray.push(eventNameFromId);
    });

    const timesInArray = eventNamesArray.filter((item) => item === eventName).length;

    if (verificationCode === "A2k7X9wz" && timesInArray < parseInt(timesRedeemable, 10) && !eventExists) {
      console.log("1");
      await addEvent(userId, points, eventWithTime);
      await updateUserPoints(userId);

      navigation.navigate("RedeemQRCode", { data: `${data}` });

    } else if (timesInArray >= parseInt(timesRedeemable, 10)) {
      navigation.navigate('RedeemQRCode', {data: "error|The event has already been claimed the maximum amount of times."})
      console.log("2");
      // alert("The event has already been claimed the maximum amount of times.");
    } else if (eventExists) {
      navigation.navigate('RedeemQRCode', {data: "error|You have already claimed this QR Code."})
      console.log("3");
      // alert("You have already claimed this QR Code.")
    } else {
      navigation.navigate('RedeemQRCode', {data: "error|Invalid QR Code."})
      console.log("4");
      // alert("Invalid QR Code.");
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
