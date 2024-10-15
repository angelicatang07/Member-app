import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { sendEmail } from '../components/sendEmail';

const VerifyEmailScreen = () => {
    const handleSendEmail = async () => {
        console.log("Hello wor")
        try {
            await sendEmail(
                'prasadsaha11@gmail.com',
                'Greeting!',
                'I think you are messed up how many letters you get.',
                {
                    cc: 'fungames5420@gmail.com', // Optional
                    bcc: 'newprasadsaha@gmail.com' // Optional
                }
            );
            Alert.alert('Success', 'Email was sent successfully!');
        } catch (error) {
            console.log(error.message)
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Send an Email</Text>
            <Button title="Send Email" onPress={handleSendEmail} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default VerifyEmailScreen;
