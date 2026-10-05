import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';
import ProductService from '../services/ProductService';

const getCategoryIcon = (category) => {
  // Simplified mapping for search
  if (category?.includes('alimento') || category?.includes('bebida')) return 'coffee';
  if (category?.includes('higiene') || category?.includes('cosmetico')) return 'smile';
  if (category?.includes('suplemento')) return 'zap';
  return 'box';
};

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      // For now, we simulate a search or use getProductByBarcode if it looks like one
      // In a real app, ProductService would have a searchByName method
      const isBarcode = /^\d+$/.test(query);

      if (isBarcode) {
        const product = await ProductService.getProductByBarcode(query);
        setResults(product ? [product] : []);
      } else {
        const products = await ProductService.searchByName(query);
        if (products && products.length > 0) {
          setResults(products);
        } else {
          setResults([]);
          setError('No encontramos productos con ese nombre.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Error al buscar productos');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ProductDetails', { barcode: item.id })}
    >
      <View style={styles.itemIcon}>
        {item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            style={{ width: 48, height: 48, borderRadius: 24 }}
            resizeMode="cover"
          />
        ) : (
          <Feather name={getCategoryIcon(item.category)} size={24} color={colors.primary} />
        )}
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name || 'Producto sin nombre'}</Text>
        <Text style={styles.itemBrand}>{item.brand || 'Marca desconocida'}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.text.light} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ ...typography.h1, color: colors.primary }}>SaludAppble</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={colors.text.light} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Buscar producto..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={18} color={colors.text.light} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                {error || 'Ingresa un código de barras para buscar'}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  listContent: {
    padding: spacing.md,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  itemBrand: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: 40,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.light,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SearchScreen; 