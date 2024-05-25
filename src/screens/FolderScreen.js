import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';

const FolderScreen = () => {
  const [documents, setDocuments] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const token = userInfo?.token;

  useEffect(() => {
    if (token) {
      fetchDocuments();
    }
  }, [token]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: '',
        },
      });
      setDocuments(response.data.headStaffDocument);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const renderDocumentsTable = () => {
    return (
      <ScrollView horizontal>
        <View>
          <View style={styles.tableRow}>
            <Text style={styles.columnHeader}>Name</Text>
            <Text style={styles.columnHeader}>File</Text>
            <Text style={styles.columnHeader}>Department</Text>
            <Text style={styles.columnHeader}>Created At</Text>
          </View>
          {documents.map((document, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{document.name}</Text>
              <Text style={styles.tableCell}>{document.file}</Text>
              <Text style={styles.tableCell}>
                {document.department && document.department.name ? document.department.name : 'N/A'}
              </Text>
              <Text style={styles.tableCell}>{new Date(document.created_at).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents</Text>
      {renderDocumentsTable()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default FolderScreen;
