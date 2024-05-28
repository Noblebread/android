import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import {BASE_URL} from '../configs';
import {Icons} from '../configs/icons';

const DocumentRequestScreen = () => {
  const {width} = useWindowDimensions();
  const [documentRequests, setDocumentRequests] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const {userInfo} = useContext(AuthContext);
  const [search, setSearch] = useState('');
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

  const filteredDocumentRequests =
    documentRequests &&
    documentRequests.filter(documentRequest => {
      if (!search) {
        return true;
      }

      const fullName = `${documentRequest.user.first_name} ${documentRequest.user.middle_name} ${documentRequest.user.last_name}`;
      const departmentName = documentRequest.department?.name || '';
      const documentNames = documentRequest.document_keys
        .map(key => key.documents.name)
        .join(' ');

      return (
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        departmentName.toLowerCase().includes(search.toLowerCase()) ||
        documentNames.toLowerCase().includes(search.toLowerCase())
      );
    });

  const renderDocumentRequest = ({item}) => {
    const status =
      statuses.find(status => status.id === item.status_id)?.name || 'Unknown';

    return (
      <View
        style={{
          width: width * 0.95,
          padding: 10,
          backgroundColor: 'white',
          marginBottom: 10,
          borderRadius: 5,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: 2},
          shadowRadius: 5,
          elevation: 3,
        }}>
        <Text style={styles.requestText}>Request ID: {item.id}</Text>
        <Text style={styles.requestText}>
          User:{' '}
          {`${item.user.first_name} ${item.user.middle_name} ${item.user.last_name}`}
        </Text>
        <Text style={styles.requestText}>
          Department: {item.department?.name ?? 'N/A'}
        </Text>
        <View style={styles.documentKeysContainer}>
          {item.document_keys.map(key => (
            <Text key={key.id} style={styles.documentKeyText}>
              Document: {key.documents.name}
            </Text>
          ))}
        </View>
        <Text style={[styles.requestText, styles.statusText]}>
          Status: {status}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 5,
          width: width,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginTop: 5,
        }}>
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            backgroundColor: '#f5f5f5',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              flex: 1,
              color: '#333',
              padding: 0,
            }}
            placeholder="Search"
            value={search}
            onChangeText={val => setSearch(val)}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icons.FontAwesome name="close" size={20} color="#333" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddDocument}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDocumentRequests}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderDocumentRequest}
        contentContainerStyle={{
          padding: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  requestsContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    marginTop: 80,
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
  statusText: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DocumentRequestScreen;
