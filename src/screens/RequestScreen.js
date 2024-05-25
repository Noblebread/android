import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const RequestScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Request Screen</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DocumentRequest')}>
                    <Icon name="file" size={40} color="#000" />
                    <Text style={styles.buttonText}>Document</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Leave')}>
                    <Icon name="calendar" size={40} color="#000" />
                    <Text style={styles.buttonText}>Leave</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TravelOrder')}>
                    <Icon name="plane" size={40} color="#000" />
                    <Text style={styles.buttonText}>Travel Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonText: {
        marginTop: 8,
        fontSize: 16,
    },
});

export default RequestScreen;
