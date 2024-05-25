import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TravelOrderScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Travel Order Screen</Text>
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
});

export default TravelOrderScreen;
