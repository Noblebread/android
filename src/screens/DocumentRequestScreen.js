import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';

const DocumentRequestScreen = () => {
  const [documentRequests, setDocumentRequests] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const token = userInfo?.token;
  const navigation = useNavigation();

  useEffect(() => {
    if (token) {
      fetchDocumentRequests();
    } else {
      console.error('Token is missing or invalid');
    }
  }, [token]);

  const fetchDocumentRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/document-request-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocumentRequests(response.data.staffRequests);
      setStatuses(response.data.statuses);
    } catch (error) {
      console.error('Error fetching document requests:', error);
    }
  };

  const handleAddDocument = () => {
    navigation.navigate('CreateDocumentRequest');
  };

  const renderDocumentRequest = ({ item }) => {
    const status = statuses.find((status) => status.id === item.status_id)?.name || 'Unknown';

    return (
      <View style={styles.requestItem}>
        <Text style={styles.requestText}>Request ID: {item.id}</Text>
        <Text style={styles.requestText}>User: {`${item.user.first_name} ${item.user.middle_name} ${item.user.last_name}`}</Text>
        <Text style={styles.requestText}>Department: {item.department?.name ?? 'N/A'}</Text>
        <View style={styles.documentKeysContainer}>
          {item.document_keys.map((key) => (
            <Text key={key.id} style={styles.documentKeyText}>Document Key: {key.documents.name}</Text>
          ))}
        </View>
        <Text style={styles.requestText}>Status: {status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddDocument}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <View style={styles.requestsContainer}>
        <FlatList
          data={documentRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDocumentRequest}
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
    borderRadius: 20,
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
    marginTop: 80,
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
  requestText: {
    fontSize: 16,
    marginBottom: 5,
  },
  documentKeysContainer: {
    marginTop: 10,
  },
  documentKeyText: {
    fontSize: 14,
    color: '#000',
  },
});

export default DocumentRequestScreen;
