import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const TravelOrderScreen = () => {
    const navigation = useNavigation();

    const handleAddTravelOrder = () => {
        navigation.navigate('CreateTravelOrder');
      };

      return (
        <View style={styles.container}>
        <Text>Travel Order Screen</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTravelOrder}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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
    addButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'blue',
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
    },
});


export default TravelOrderScreen;
