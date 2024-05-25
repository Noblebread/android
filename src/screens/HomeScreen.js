import React, { useContext } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Button} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
    const {userInfo, isLoading, logout} = useContext(AuthContext);
    const { first_name, middle_name = '', last_name } = userInfo.user;

    return (
        <View style={styles.container}>
        <Spinner visible={isLoading} />
        <Text>
            Welcome {first_name} {middle_name} {last_name}
        </Text>
        <Button title="Logout" color={"red"} onPress={logout} />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5', // Light background color
    },
});


export default HomeScreen;
