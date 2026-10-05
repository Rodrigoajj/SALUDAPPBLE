import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import { colors, spacing, typography } from '../styles/theme';
import ProductService from '../services/ProductService';
import ProductDetailsTab from '../components/ProductDetailsTab';
import AlternativesTab from '../components/AlternativesTab';
import AIAnalysisTab from '../components/AIAnalysisTab';

import VerifiedService from '../services/VerifiedService';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { barcode } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('health');
  // New state for verification
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching product for barcode:', barcode);
        const data = await ProductService.getProductByBarcode(barcode);

        if (!data) {
          setError('Producto no encontrado');
        } else {
          setProduct(data);
          const verifiedValues = VerifiedService.checkVerification(data.brand, data.name);
          setIsVerified(!!verifiedValues);
        }
      } catch (err) {
        console.error('Error details:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    if (barcode) {
      fetchProduct();
    } else {
      setLoading(false);
      setError('Código de barras no válido');
    }
  }, [barcode]);

  const tabs = [
    { key: 'health', title: 'Salud', icon: 'heart' },
    { key: 'details', title: 'Detalles', icon: 'info' },
    { key: 'analysis', title: 'Análisis IA', icon: 'cpu' },
  ]; // Removed alternatives tab

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return colors.status.success;
      case 'regular': return colors.status.warning;
      case 'bad': return colors.status.error;
      default: return colors.text.light;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'good': return 'Recomendado'; // Changed from 'Bueno para la salud' to be more generic 
      case 'regular': return 'Uso moderado';
      case 'bad': return 'No recomendado';
      default: return 'Evaluación pendiente';
    }
  };

  const renderHealthAssessment = () => (
    <ScrollView style={styles.contentContainer}>
      {/* Product Status Header */}
      <View style={[styles.statusHeader, { backgroundColor: getStatusColor(product?.healthAssessment?.status) }]}>
        <Icon
          name={product?.healthAssessment?.status === 'bad' ? 'alert-triangle' : 'shield'}
          size={24}
          color="#FFF"
        />
        <Text style={styles.statusHeaderText}>{getStatusText(product?.healthAssessment?.status)}</Text>
      </View>

      {product?.healthAssessment?.groups?.map((group, idx) => (
        <View key={idx} style={styles.groupCard}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>{group.type}</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <Text
                  key={star}
                  style={[
                    styles.star,
                    group.rating && star <= group.rating ? styles.starFilled : styles.starEmpty
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
          </View>
          <Text style={styles.explanation}>{group.explanation}</Text>
          <View style={styles.recommendationBox}>
            <Icon name="info" size={16} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.recommendations}>{group.recommendations}</Text>
          </View>
        </View>
      ))}

      {product?.healthAssessment?.warnings?.length > 0 && (
        <View style={styles.warningCard}>
          <Text style={styles.warningHeader}>Advertencias</Text>
          {product.healthAssessment.warnings.map((warning, idx) => (
            <View key={idx} style={styles.warningItem}>
              <Icon name="alert-circle" size={16} color={colors.status.error} />
              <Text style={styles.warningText}>{warning}</Text>
            </View>
          ))}
        </View>
      )}

      {(!product?.healthAssessment?.groups || product.healthAssessment.groups.length === 0) && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay evaluación de salud disponible.</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'health':
        return renderHealthAssessment();
      case 'details':
        return <ProductDetailsTab product={product} />;
      case 'analysis':
        return <AIAnalysisTab product={product} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color={colors.status.error} />
        <Text style={styles.errorText}>{error || 'Producto no encontrado'}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* Product Title Section */}
      <View style={styles.header}>
        <Image
          source={{ uri: product.image_url || 'https://via.placeholder.com/300' }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.headerContent}>
          {isVerified && (
            <View style={styles.verifiedBadgeContainer}>
              <Icon name="check-circle" size={16} color="#FFF" />
              <Text style={styles.verifiedText}>SaludApp Verified</Text>
            </View>
          )}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
          {/* The original snippet included a scoreContainer here, but there's no existing score logic in the header.
              Keeping it commented out for now, or it can be removed if not needed.
          <View style={styles.scoreContainer}>
            {/* Reusing existing score logic or hiding it for verified? Keeping it for now. }
          </View> */}
        </View>
      </View>

      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={activeTab === tab.key ? colors.primary : colors.text.light}
            />
            <Text style={[
              styles.tabLabel,
              { color: activeTab === tab.key ? colors.primary : colors.text.light }
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  verifiedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary, // Or a specific verified blue
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  productName: {
    ...typography.h1,
    color: colors.text.primary,
    textTransform: 'capitalize', // Fix: Capitalize product name
  },
  productBrand: {
    ...typography.caption,
    color: colors.text.light,
    marginTop: 2,
  },
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
    elevation: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    ...typography.caption,
    marginTop: 4,
    fontWeight: '500',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  statusHeaderText: {
    ...typography.h2,
    color: '#FFF',
    marginLeft: 10,
  },
  groupCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    elevation: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  groupTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 18,
    marginLeft: 2,
  },
  starFilled: {
    color: colors.primary,
  },
  starEmpty: {
    color: '#DDD',
  },
  explanation: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  recommendationBox: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: 8,
  },
  recommendations: {
    ...typography.caption,
    color: colors.text.primary,
    flex: 1,
  },
  warningCard: {
    backgroundColor: '#FFF5F5',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCC',
    marginBottom: spacing.md,
  },
  warningHeader: {
    ...typography.h2,
    color: colors.status.error,
    marginBottom: spacing.sm,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  warningText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.light,
  }
});

export default ProductDetailsScreen; 