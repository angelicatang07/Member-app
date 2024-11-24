import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import CustomButton from '../components/customButton';
import Logo from '../assets/stemeLogo.png';
import Screen from '../components/Screen';
import SubmitButton from '../components/submitButton';
import { auth } from '../navigation/firebase';
import { onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});

function SignInScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the email is verified
        if (user.emailVerified) {
          navigation.navigate('Dashboard')  // was App Navigator, but this brought it to settings, causing bugs with the Profile Picture
        } else {
          // Sign out the user if email is not verified
          auth.signOut();
          Alert.alert('Verify Email', 'Your account needs to be authenicated. Check your email to verify your idenity');
          sendEmailVerification(user)
        }
      } else {
        setUser(null); // Set user to null if not authenticated
      }
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, [navigation]);

  const handleSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
    } catch (error) {
      let errorMessage = '';
  
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later.';
          break;
        default:
          errorMessage = error.code;  // get rid of this in production
          break;
      }
  
      Alert.alert('Login Error', errorMessage); // Show error messages for login errors
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.container}>
        <AppForm
          initialValues={{ email: '', password: '' }}
          onSubmit={({ email, password }) => handleSignIn(email, password)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
            width='100%'
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            width='100%'
          />
          <SubmitButton text={'LOGIN'} />
        </AppForm>
        <CustomButton 
          text={'Forgot your password?'} 
          type="TERTIARY"
          onPress={() => navigation.navigate('ForgotPassword')} 
        />        
        <CustomButton
          style={styles.createAccount}
          text={"Don't have an account? Create one "}
          type="TERTIARY"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </Screen>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  logo: {
    height: 180,
    borderRadius: 90,
    width: 180,
    marginTop: 50,
    marginBottom: 20,
  },
  createAccount: {
    position: 'absolute',
    bottom: '-20%',
  },
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
