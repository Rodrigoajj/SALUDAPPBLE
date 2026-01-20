import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Búsqueda de productos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text.primary,
    fontSize: 16,
  },
});

export default SearchScreen; 