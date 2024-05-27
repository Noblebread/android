// DocumentRequestScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../config';


const DocumentRequestScreen = () => {
  const [documentRequests, setDocumentRequests] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDocumentRequests = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/document-requests/list`);
        setDocumentRequests(response.data.staffRequests);
      } catch (error) {
        console.error('Error fetching document requests:', error);
      }
    };

    fetchDocumentRequests();
  }, []);

  const handleAddDocument = () => {
    navigation.navigate('CreateDocumentRequest');
  };

  return (
    <View style={styles.container}>
      <Text>Document Request Screen</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddDocument}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <View style={styles.requestsContainer}>
        <FlatList
          data={documentRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Text>{item.name}</Text>
              {/* Display other properties of the document request as needed */}
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
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
  requestsContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    marginTop: 20,
  },
  requestItem: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
});

export default DocumentRequestScreen;
