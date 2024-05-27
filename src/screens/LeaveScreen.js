import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';

const LeaveScreen = () => {
  const [staffLeaves, setStaffLeaves] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const token = userInfo?.token;
  const navigation = useNavigation();

  useEffect(() => {
    if (token) {
      fetchLeaveData();
    } else {
      console.error('Token is missing or invalid');
    }
  }, [token]);

  const fetchLeaveData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/leave-request-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaffLeaves(response.data.staffLeaves);
      setStatuses(response.data.statuses);
      setTypes(response.data.types);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  const handleAddLeave = () => {
    navigation.navigate('CreateLeave');
  };

  const renderLeave = ({ item }) => {
    const status = statuses.find((status) => status.id === item.status_id)?.name || 'Unknown';
    const type = types.find((type) => type.id === item.type_id)?.title || 'Unknown';
    const user = item.user || {};

    return (
      <View style={styles.leaveItem}>
        <Text style={styles.leaveText}>ID: {item.id}</Text>
        <Text style={styles.leaveText}>User: {`${user.first_name ?? ''} ${user.middle_name ?? ''} ${user.last_name ?? ''}`}</Text>
        <Text style={styles.leaveText}>Type: {type}</Text>
        <Text style={styles.leaveText}>Date Leave: {item.date_leave}</Text>
        <Text style={styles.leaveText}>Date Return: {item.date_return}</Text>
        <Text style={styles.leaveText}>Purpose: {item.purpose ?? 'No Input'}</Text>
        <Text style={styles.leaveText}>Status: {status}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddLeave}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <View style={styles.leavesContainer}>
        <FlatList
          data={staffLeaves}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLeave}
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
  leavesContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    marginTop: 80,
  },
  leaveItem: {
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
  leaveText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default LeaveScreen;
