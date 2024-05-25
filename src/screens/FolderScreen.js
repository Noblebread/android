import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FolderScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Folder Screen</Text>
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

export default FolderScreen;
