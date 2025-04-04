import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ClockInScreen from './src/screens/ClockInScreen';
import { DatabaseProvider } from './src/database/db';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ClockIn" component={ClockInScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
