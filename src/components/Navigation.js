import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RequestScreen from '../screens/RequestScreen';
import FolderScreen from '../screens/FolderScreen';
import DocumentRequestScreen from '../screens/DocumentRequestScreen';
import LeaveScreen from '../screens/LeaveScreen';
import TravelOrderScreen from '../screens/TravelOrderScreen';
import CreateDocumentRequestScreen from '../screens/CreateDocumentRequestScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenticatedTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Requests" component={RequestScreen} />
            <Tab.Screen name="Folders" component={FolderScreen} />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    const { userInfo } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {userInfo.token ? (
                    <>
                        <Stack.Screen name="HomeTabs" component={AuthenticatedTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="DocumentRequest" component={DocumentRequestScreen} />
                        <Stack.Screen name="CreateDocumentRequest" component={CreateDocumentRequestScreen} />
                        <Stack.Screen name="Leave" component={LeaveScreen} />
                        <Stack.Screen name="TravelOrder" component={TravelOrderScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
