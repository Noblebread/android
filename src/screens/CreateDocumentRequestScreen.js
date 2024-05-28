import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import RNPickerSelect from 'react-native-picker-select';
import {AuthContext} from '../context/AuthContext';
import {BASE_URL} from '../configs';
import axios from 'axios';

const CreateDocumentRequestScreen = () => {
  const [docRequests, setDocRequests] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [userName, setUserName] = useState('');

  const {userInfo} = useContext(AuthContext);
  const {first_name, middle_name = '', last_name} = userInfo.user;

  useEffect(() => {
    const fetchDocRequests = async () => {
      try {
        const token = userInfo?.token;
        if (!token) {
          throw new Error('Token not found');
        }
        const response = await axios.get(`${BASE_URL}/document-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocRequests(response.data);
      } catch (error) {
        console.error('Error fetching document requests:', error);
      }
    };

    fetchDocRequests();
  }, [userInfo]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = userInfo?.token;
        if (!token) {
          throw new Error('Token not found');
        }
        const response = await axios.get(
          `${BASE_URL}/document-requests/departments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const departmentOptions = response.data.map(department => ({
          label: department.name,
          value: department.id,
        }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.user) {
      setUserName(
        `${userInfo.user.first_name} ${userInfo.user.middle_name || ''} ${
          userInfo.user.last_name
        }`,
      );
    }
  }, [userInfo]);

  const options = docRequests.map(docRequest => ({
    id: docRequest.id,
    name: docRequest.name,
  }));

  const handleSelectedItemsChange = selectedItems => {
    setSelectedItems(selectedItems);
  };

  const handleSubmit = async () => {
    try {
      const token = userInfo?.token;
      if (!token) {
        throw new Error('Token not found');
      }
      const data = {
        department_id: departmentId,
        documentItems: selectedItems,
      };
      const response = await axios.post(`${BASE_URL}/document-requests`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Success', 'Document request created successfully');
    } catch (error) {
      console.error('Error creating document request:', error);
      Alert.alert('Error', 'Failed to create document request');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={`${first_name} ${middle_name} ${last_name}`}
        onChangeText={setUserName}
        autoCapitalize="none"
        editable={false}
      />
      <MultiSelect
        hideTags
        items={options}
        uniqueKey="id"
        onSelectedItemsChange={handleSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="Pick Items"
        searchInputPlaceholderText="Search Items..."
        altFontFamily="ProximaNova-Light"
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{color: '#CCC'}}
        submitButtonColor="#CCC"
        submitButtonText="Submit"
      />
      <RNPickerSelect
        onValueChange={value => setDepartmentId(value)}
        items={departments}
        placeholder={{label: 'Select a department', value: null}}
        style={pickerSelectStyles}
        value={departmentId}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 10,
  },
  itemText: {
    fontSize: 16,
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginTop: 10,
    width: '100%',
  },
});

export default CreateDocumentRequestScreen;
