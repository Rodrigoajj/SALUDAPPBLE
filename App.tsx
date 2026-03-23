import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import { StatusBar } from 'expo-status-bar';
import RevenueCatService from './src/services/RevenueCatService';

export default function App() {
  useEffect(() => {
    // Inicializar sistema de pagos (RevenueCat)
    RevenueCatService.configure();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}