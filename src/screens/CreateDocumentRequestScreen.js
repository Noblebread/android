import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';


const CreateDocumentRequestScreen = () => {
    
  const [docRequests, setDocRequests] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch document requests from API
    const fetchDocRequests = async () => {
      try {
        const response = await axios.get('/api/document-requests');
        setDocRequests(response.data);
      } catch (error) {
        console.error('Error fetching document requests:', error);
      }
    };

    fetchDocRequests();
  }, []); // Empty dependency array ensures the effect runs only once

  // Map over docRequests to create an array of options
  const options = docRequests.map(docRequest => ({
    value: docRequest.id,
    label: docRequest.name // Assuming there's a 'name' property in your DocumentRequest model
  }));

  // Handle change in selected items
  const handleSelectedItemsChange = selectedOptions => {
    setSelectedItems(selectedOptions);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={userName}
        onChangeText={setUserName}
        autoCapitalize="none"
        editable={false} // Disable editing as it should be auto-filled
      />
      <Select2
        options={options}
        value={selectedItems}
        onChange={handleSelectedItemsChange}
        isMulti
        placeholder="Select document items"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter department ID"
        value={departmentId}
        onChangeText={setDepartmentId}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '80%',
  },
});

export default CreateDocumentRequestScreen;
