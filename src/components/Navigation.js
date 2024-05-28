import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthContext} from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RequestScreen from '../screens/RequestScreen';
import DocumentRequestScreen from '../screens/DocumentRequestScreen';
import LeaveScreen from '../screens/LeaveScreen';
import TravelOrderScreen from '../screens/TravelOrderScreen';
import CreateDocumentRequestScreen from '../screens/CreateDocumentRequestScreen';
import CreateLeaveScreen from '../screens/CreateLeaveScreen';
import CreateTravelOrderScreen from '../screens/CreateTravelOrderScreen';
import {Platform, StatusBar} from 'react-native';
import {Icons} from '../configs/icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        keyboardHidesTabBar: true,

        tabBarIcon: ({focused, color = '#000', size}) => {
          let iconName;
          let iconSize;
          if (route.name === 'Home') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
            return (
              <Icons.MaterialCommunityIcons
                name={iconName}
                size={22}
                color={color}
              />
            );
          } else if (route.name === 'Requests') {
            iconName = focused ? 'receipt-sharp' : 'receipt-outline';
            return <Icons.Ionicons name={iconName} size={22} color={color} />;
          }
        },

        tabBarStyle: {
          height: 55,
          backgroundColor: 'white',
        },
        tabBarItemStyle: {
          marginBottom: 7,
          marginTop: 3,
        },
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          textTransform: 'uppercase',
          fontSize: 12,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Requests" component={RequestScreen} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const {userInfo} = useContext(AuthContext);

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#f5f5f5', true);
    }
    StatusBar.setBarStyle('dark-content', true);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }}>
        {userInfo && userInfo.token ? (
          <>
            <Stack.Screen
              name="HomeTabs"
              component={AuthenticatedTabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DocumentRequest"
              component={DocumentRequestScreen}
            />
            <Stack.Screen
              name="CreateDocumentRequest"
              component={CreateDocumentRequestScreen}
            />
            <Stack.Screen name="Leave" component={LeaveScreen} />
            <Stack.Screen name="CreateLeave" component={CreateLeaveScreen} />
            <Stack.Screen name="TravelOrder" component={TravelOrderScreen} />
            <Stack.Screen
              name="CreateTravelOrder"
              component={CreateTravelOrderScreen}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
