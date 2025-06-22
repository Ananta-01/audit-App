import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import AuditFormScreen from '../screens/AuditFormScreen';
import AuditSummaryScreen from '../screens/AuditSummaryScreen';
import AuditHistoryScreen from '../screens/AuditHistoryScreen';
import PolicyViewerScreen from '../screens/PolicyViewerScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
        <Stack.Screen name="AuditForm" component={AuditFormScreen} />
        <Stack.Screen name="AuditSummary" component={AuditSummaryScreen} />
        <Stack.Screen name="AuditHistory" options={{headerShown: false}} component={AuditHistoryScreen} />
        <Stack.Screen name="PolicyViewer" options={{headerShown: false}} component={PolicyViewerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
