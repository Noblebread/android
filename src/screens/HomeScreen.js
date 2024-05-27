import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
    const { userInfo, isLoading, logout } = useContext(AuthContext);
    const { first_name, middle_name = '', last_name } = userInfo.user;

    return (
        <View style={styles.screenContainer}>
            <Spinner visible={isLoading} />
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.nameText}>{first_name} {middle_name} {last_name}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Light background color
        alignItems: 'center',
        justifyContent: 'flex-start', // Start from the top
        paddingTop: '10%', // Adjust this value to move the card higher or lower
    },
    logoutButton: {
        position: 'absolute',
        top: 10, // Adjust this value to position the button at the top right
        right: 10, // Adjust this value to position the button at the top right
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
    },
    card: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 2 }, // For shadow on iOS
        shadowOpacity: 0.2, // For shadow on iOS
        shadowRadius: 10, // For shadow on iOS
        marginTop: '5%', // Adjust this value to fine-tune the card's position
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nameText: {
        fontSize: 24,
        textAlign: 'center',
    },
});

export default HomeScreen;
