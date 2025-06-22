/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { RoleProvider } from './src/context/RoleContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>

      <RoleProvider>
        <AppNavigator />
      </RoleProvider>
    </SafeAreaProvider>

  );
}
