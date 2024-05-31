import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import {BASE_URL} from '../configs';
import {Icons} from '../configs/icons';

const LeaveScreen = () => {
  const {width} = useWindowDimensions();
  const [staffLeaves, setStaffLeaves] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState('');
  const {userInfo} = useContext(AuthContext);
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

  const filteredLeaveRequests =
    staffLeaves &&
    staffLeaves.filter(leave => {
      if (!search) {
        return true;
      }

      const fullName = `${leave.user.first_name} ${leave.user.middle_name} ${leave.user.last_name}`;
      const type =
        types.find(type => type.id === leave.type_id)?.title || 'Unknown';
      const status =
        statuses.find(status => status.id === leave.status_id)?.name ||
        'Unknown';

      return (
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        type.toLowerCase().includes(search.toLowerCase()) ||
        status.toLowerCase().includes(search.toLowerCase())
      );
    });

  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return 'yellow';
      case 'Approved':
        return 'rgb(3, 161, 3)';
      case 'Cancelled':
        return 'red';
      case 'Completed':
        return 'rgb(62, 7, 228)';
      default:
        return 'black';
    }
  };

  const renderLeave = ({item}) => {
    const status =
      statuses.find(status => status.id === item.status_id)?.name || 'Unknown';
    const type =
      types.find(type => type.id === item.type_id)?.title || 'Unknown';
    const user = item.user || {};

    return (
      <View
        style={[
          styles.leaveItem,
          {
            width: width * 0.95,
          },
        ]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.leaveText, {fontWeight: 'bold'}]}>ID:</Text>
          <Text style={styles.leaveText}>{item.id}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.leaveText, {fontWeight: 'bold'}]}>User:</Text>
          <Text style={styles.leaveText}>
            {`${user.first_name ?? ''} ${
              user.middle_name ? user.middle_name + ' ' : ''
            }${user.last_name ?? ''}`}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.leaveText, {fontWeight: 'bold'}]}>Type:</Text>
          <Text style={styles.leaveText}>{type}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.leaveText, {fontWeight: 'bold'}]}>
            Date Leave:
          </Text>
          <Text style={styles.leaveText}>{item.date_leave}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.leaveText, {fontWeight: 'bold'}]}>
            Date Return:
          </Text>
          <Text style={styles.leaveText}>{item.date_return}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.leaveText, {fontWeight: 'bold'}]}>Purpose:</Text>
          <Text style={styles.leaveText}>{item.purpose ?? 'No Input'}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.leaveText, {fontWeight: 'bold'}]}>Status:</Text>
          <Text
            style={[
              styles.leaveText,
              {color: getStatusColor(status), fontWeight: 'bold'},
            ]}>
            {status}
          </Text>
        </View>
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
            width: width * 0.8,
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
            placeholderTextColor={'gray'}
            value={search}
            onChangeText={val => setSearch(val)}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icons.FontAwesome name="close" size={20} color="#333" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddLeave}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {staffLeaves.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={filteredLeaveRequests}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderLeave}
          contentContainerStyle={{
            padding: 10,
          }}
        />
      )}
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
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  leaveText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
  },
});

export default LeaveScreen;
