import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import ProductAnalyzer from './components/ProductAnalyzer';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <ProductAnalyzer />
      </SafeAreaView>
    </PaperProvider>
  );
} 