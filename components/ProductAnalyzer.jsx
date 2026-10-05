import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarcodeScanner } from './BarcodeScanner';
import { fetchProductInfo } from '../services/barcodeAPI';

const ProductAnalyzer = () => {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    try {
      const productData = await fetchProductInfo(barcode);
      const evaluations = getProductEvaluations(productData);
      setProduct({
        ...productData,
        evaluations,
      });
    } catch (error) {
      setError('Producto no encontrado o error en la búsqueda.');
    }
  };

  const RatingIcon = ({ rating }) => {
    let iconName = 'help-circle';
    let color = '#666';

    switch(rating) {
      case 'excellent':
        iconName = 'thumb-up';
        color = '#4CAF50';
        break;
      case 'good':
        iconName = 'thumb-up-outline';
        color = '#2196F3';
        break;
      case 'poor':
        iconName = 'thumb-down';
        color = '#f44336';
        break;
    }

    return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Analizador de Productos</Title>
          <Paragraph>Ingrese el código de barras o escanee el producto</Paragraph>
          
          <View style={styles.searchContainer}>
            <TextInput
              value={barcode}
              onChangeText={setBarcode}
              placeholder="Ingrese código de barras..."
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSearch}>
              Buscar
            </Button>
          </View>
          
          <BarcodeScanner onScan={(code) => {
            setBarcode(code);
            handleSearch();
          }} />
        </Card.Content>
      </Card>

      {error ? (
        <Card style={[styles.card, styles.errorCard]}>
          <Card.Content>
            <Title style={styles.errorText}>Error</Title>
            <Paragraph style={styles.errorText}>{error}</Paragraph>
          </Card.Content>
        </Card>
      ) : null}

      {product && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>{product.name}</Title>
            <Paragraph>Categoría: {product.category}</Paragraph>
            
            {Object.entries(product.evaluations).map(([profile, evaluation]) => (
              <View key={profile} style={styles.evaluationItem}>
                <RatingIcon rating={evaluation.rating} />
                <View style={styles.evaluationText}>
                  <Text style={styles.profileText}>
                    {profile.replace('_', ' ')}
                  </Text>
                  <Text>{evaluation.reason}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    gap: 8,
  },
  input: {
    flex: 1,
  },
  errorCard: {
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
  },
  evaluationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  evaluationText: {
    marginLeft: 8,
    flex: 1,
  },
  profileText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

export default ProductAnalyzer; 