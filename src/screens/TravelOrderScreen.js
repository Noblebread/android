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
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {BASE_URL} from '../configs';
import {Icons} from '../configs/icons';

const TravelOrderScreen = () => {
  const {width} = useWindowDimensions();
  const [travelOrders, setTravelOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [types, setTypes] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [search, setSearch] = useState('');
  const {userInfo} = useContext(AuthContext);
  const token = userInfo?.token;
  const navigation = useNavigation();

  useEffect(() => {
    if (token) {
      fetchTravelOrders();
    } else {
      console.error('Token is missing or invalid');
    }
  }, [token]);

  const fetchTravelOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/travel-order-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTravelOrders(response.data.staffTravels);
      setStatuses(response.data.statuses || []);
      setDepartments(response.data.departments || []);
      setTypes(response.data.types || []);
      setTransportations(response.data.transportations || []);
    } catch (error) {
      console.error('Error fetching travel orders:', error);
    }
  };

  const handleAddTravelOrder = () => {
    navigation.navigate('CreateTravelOrder');
  };

  const filteredTravelRequests =
    travelOrders &&
    travelOrders.filter(leave => {
      if (!search) {
        return true;
      }

      const fullName = `${leave.user.first_name} ${leave.user.middle_name} ${leave.user.last_name}`;
      const type =
        types.find(type => type.id === leave.type_id)?.title || 'Unknown';
      const status =
        statuses.find(status => status.id === leave.status_id)?.name ||
        'Unknown';
      const transportation =
        transportations.find(
          transportation => transportation.id === leave.transportation_id,
        )?.name || 'Unknown';

      return (
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        type.toLowerCase().includes(search.toLowerCase()) ||
        status.toLowerCase().includes(search.toLowerCase()) ||
        transportation.toLowerCase().includes(search.toLowerCase()) ||
        leave.destination.toLowerCase().includes(search.toLowerCase()) ||
        leave.purpose.toLowerCase().includes(search.toLowerCase())
      );
    });

  const renderTravelOrder = ({item}) => {
    const status =
      statuses.find(status => status.id === item.status_id)?.name || 'Unknown';
    const type =
      types.find(type => type.id === item.type_id)?.title || 'Unknown';
    const transportation =
      transportations.find(
        transportation => transportation.id === item.transportation_id,
      )?.name || 'Unknown';

    return (
      <View style={[styles.travelOrderItem, {width: width * 0.95}]}>
        <Text style={styles.travelOrderText}>ID: {item.id}</Text>
        <Text style={styles.travelOrderText}>
          User:{' '}
          {`${item.user.first_name} ${item.user.middle_name} ${item.user.last_name}`}
        </Text>
        <Text style={styles.travelOrderText}>Type: {type}</Text>
        <Text style={styles.travelOrderText}>
          Transportation: {transportation}
        </Text>
        <Text style={styles.travelOrderText}>Purpose: {item.destination}</Text>
        <Text style={styles.travelOrderText}>
          Date Leave: {item.date_leave}
        </Text>
        <Text style={styles.travelOrderText}>
          Date Return: {item.date_return}
        </Text>
        <Text style={styles.travelOrderText}>Purpose: {item.purpose}</Text>
        <Text style={styles.travelOrderText}>Status: {status}</Text>
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
            value={search}
            onChangeText={val => setSearch(val)}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icons.FontAwesome name="close" size={20} color="#333" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTravelOrder}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTravelRequests}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderTravelOrder}
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
  travelOrdersContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    marginTop: 80,
  },
  travelOrderItem: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  travelOrderText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TravelOrderScreen;
