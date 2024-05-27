import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const CreateTravelOrderScreen = () => {
    
    const [dateLeave, setDateLeave] = useState(new Date());
    const [dateReturn, setDateReturn] = useState(new Date());
    const [showDateLeavePicker, setShowDateLeavePicker] = useState(false);
    const [showDateReturnPicker, setShowDateReturnPicker] = useState(false);
    const [destination, setDestination] = useState('');
    const [transportationId, setTransportationId] = useState('');
    const [expenses, setExpenses] = useState('');
    const [purpose, setPurpose] = useState('');
    const [typeId, setTypeId] = useState('');
    const [types, setTypes] = useState([]);
    const [transportations, setTransportations] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const token = userInfo?.token;
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(`${BASE_URL}/travel-orders/types`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const typeOptions = response.data.map(type => ({
                    label: type.title,
                    value: type.id,
                }));
                setTypes(typeOptions);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };


        const fetchTransportations = async () => {
            try {
                const token = userInfo?.token;
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get(`${BASE_URL}/travel-orders/transportations`, {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`,
                    },
                });
                const transportationOptions = response.data.map(type => ({
                    label: type.name,
                    value: type.id,
                }));
                setTransportations(transportationOptions);
            } catch (error) {
                console.error('Error fetching transportations:', error);
            }
        };

        fetchTypes();
        fetchTransportations();
    }, [userInfo]);

    const handleDateChange = (event, selectedDate, type) => {
        if (type === 'leave') {
            setShowDateLeavePicker(false);
            if (selectedDate) {
                setDateLeave(selectedDate);
            }
        } else {
            setShowDateReturnPicker(false);
            if (selectedDate) {
                setDateReturn(selectedDate);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const token = userInfo?.token;
            if (!token) {
                throw new Error('Token not found');
            }
            const response = await axios.post(`${BASE_URL}/travel-orders`, {
                type_id: typeId,
                date_leave: dateLeave.toISOString().split('T')[0],
                date_return: dateReturn.toISOString().split('T')[0],
                destination: destination,
                expenses: expenses,
                transportation_id: transportationId,

                purpose: purpose,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data.message);
            Alert.alert('Success', response.data.message);
            resetForm();
            setErrors({});
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data);
            } else {
                console.error('Error creating leave request:', error);
            }
        }
    };

    // const handleSubmit = async () => {
    //     const data = {
    //         type_id: typeId,
    //         date_leave: dateLeave,
    //         date_return: dateReturn,
    //         destination: destination,
    //         transportation_id: transportationId,
    //         expenses: expenses,
    //         purpose: purpose,
    //     };

    //     try {
    //         const response = await axios.post(`${BASE_URL}/travel-orders`, data, {
    //             headers: {
    //                 'Authorization': `Bearer ${userInfo.token}`,
    //             },
    //         });
    //         setMessage(response.data.message);
    //         Alert.alert('Success', response.data.message);
    //         resetForm();
    //     } catch (error) {
    //         if (error.response && error.response.status === 422) {
    //             setErrors(error.response.data);
    //         } else {
    //             console.error('Error creating travel order:', error);
    //         }
    //     }
    // };

    const resetForm = () => {
        setTypeId('');
        setDateLeave(new Date());
        setDateReturn(new Date());
        setDestination('');
        setTransportationId('');
        setExpenses('');
        setPurpose('');
        setErrors({});
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Travel Order</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            <RNPickerSelect
                onValueChange={(value) => setTypeId(value)}
                items={types}
                placeholder={{ label: "Select a type", value: null }}
                style={pickerSelectStyles}
                value={typeId}
            />
            {errors.type_id && <Text style={styles.error}>{errors.type_id[0]}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Destination"
                value={destination}
                onChangeText={(value) => setDestination(value)}
            />
            {errors.destination && <Text style={styles.error}>{errors.destination[0]}</Text>}
            <RNPickerSelect
                onValueChange={(value) => setTransportationId(value)}
                items={transportations}
                placeholder={{ label: "Select a Transportation", value: null }}
                style={pickerSelectStyles}
                value={transportationId}
            />
            {errors.transportation_id && <Text style={styles.error}>{errors.transportation_id[0]}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Expenses"
                value={expenses}
                onChangeText={(value) => setExpenses(value)}
                keyboardType="numeric"
            />
            {errors.expenses && <Text style={styles.error}>{errors.expenses[0]}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Purpose"
                value={purpose}
                onChangeText={(value) => setPurpose(value)}
            />
            {errors.purpose && <Text style={styles.error}>{errors.purpose[0]}</Text>}
            <View>
                <Button title="Pick Date Leave" onPress={() => setShowDateLeavePicker(true)} />
                {showDateLeavePicker && (
                    <DateTimePicker
                        value={dateLeave}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDateLeavePicker(false);
                            if (selectedDate) setDateLeave(selectedDate);
                        }}
                    />
                )}
                <Text>{dateLeave.toDateString()}</Text>
            </View>
            {errors.date_leave && <Text style={styles.error}>{errors.date_leave[0]}</Text>}
            <View>
                <Button title="Pick Date Return" onPress={() => setShowDateReturnPicker(true)} />
                {showDateReturnPicker && (
                    <DateTimePicker
                        value={dateReturn}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDateReturnPicker(false);
                            if (selectedDate) setDateReturn(selectedDate);
                        }}
                    />
                )}
                <Text>{dateReturn.toDateString()}</Text>
            </View>
            {errors.date_return && <Text style={styles.error}>{errors.date_return[0]}</Text>}
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    message: {
        color: 'green',
        marginBottom: 10,
        textAlign: 'center',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    inputAndroid: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
});

export default CreateTravelOrderScreen;
