import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const CreateLeaveScreen = () => {
    const [typeId, setTypeId] = useState('');
    const [dateLeave, setDateLeave] = useState(new Date());
    const [dateReturn, setDateReturn] = useState(new Date());
    const [showDateLeavePicker, setShowDateLeavePicker] = useState(false);
    const [showDateReturnPicker, setShowDateReturnPicker] = useState(false);
    const [purpose, setPurpose] = useState('');
    const [types, setTypes] = useState([]);
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
                const response = await axios.get(`${BASE_URL}/leaves/types`, {
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

        fetchTypes();
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
            const response = await axios.post(`${BASE_URL}/leaves`, {
                type_id: typeId,
                date_leave: dateLeave.toISOString().split('T')[0],
                date_return: dateReturn.toISOString().split('T')[0],
                purpose: purpose,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data.message);
            Alert.alert('Success', response.data.message);
            setTypeId('');
            setDateLeave(new Date());
            setDateReturn(new Date());
            setPurpose('');
            setErrors({});
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data);
            } else {
                console.error('Error creating leave request:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Leave Request</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            <RNPickerSelect
                onValueChange={(value) => setTypeId(value)}
                items={types}
                placeholder={{ label: "Select a type", value: null }}
                style={pickerSelectStyles}
                value={typeId}
            />
            {errors.type_id && <Text style={styles.error}>{errors.type_id[0]}</Text>}

            <View>
                <Button onPress={() => setShowDateLeavePicker(true)} title="Select Date Leave" />
                {showDateLeavePicker && (
                    <DateTimePicker
                        value={dateLeave}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'leave')}
                    />
                )}
                <Text style={styles.selectedDate}>Selected Date Leave: {dateLeave.toDateString()}</Text>
            </View>
            {errors.date_leave && <Text style={styles.error}>{errors.date_leave[0]}</Text>}

            <View>
                <Button onPress={() => setShowDateReturnPicker(true)} title="Select Date Return" />
                {showDateReturnPicker && (
                    <DateTimePicker
                        value={dateReturn}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'return')}
                    />
                )}
                <Text style={styles.selectedDate}>Selected Date Return: {dateReturn.toDateString()}</Text>
            </View>
            {errors.date_return && <Text style={styles.error}>{errors.date_return[0]}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Purpose"
                value={purpose}
                onChangeText={setPurpose}
            />
            {errors.purpose && <Text style={styles.error}>{errors.purpose[0]}</Text>}

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
    selectedDate: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        color: 'black',
    },

    inputAndroid: {
        height: 40,
        borderColor: 'black',
        borderWidth: 2,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    
});

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        height: 40,
        borderColor: 'black',
        borderWidth: 2,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
});

export default CreateLeaveScreen;
