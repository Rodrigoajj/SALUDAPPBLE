import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, typography } from '../styles/theme';

const ProductDetailsScreen = ({ route }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'health', title: 'Salud', icon: 'heart' },
    { key: 'details', title: 'Detalles', icon: 'info' },
    { key: 'alternatives', title: 'Alternativas', icon: 'list' },
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      renderIcon={({ route, color }) => (
        <Icon name={route.icon} size={20} color={color} />
      )}
      labelStyle={styles.tabLabel}
      activeColor={colors.primary}
      inactiveColor={colors.text.light}
    />
  );

  const renderHealthAssessment = () => (
    <ScrollView style={styles.container}>
      {product?.healthAssessment.groups.map((group, index) => (
        <View key={index} style={styles.groupCard}>
          <Text style={styles.groupTitle}>{group.type}</Text>
          <View style={styles.ratingContainer}>
            {[1,2,3,4,5].map(star => (
              <Text 
                key={star} 
                style={[
                  styles.star,
                  star <= group.rating ? styles.starFilled : styles.starEmpty
                ]}
              >
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.explanation}>{group.explanation}</Text>
          <Text style={styles.recommendations}>{group.recommendations}</Text>
        </View>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        health: renderHealthAssessment,
        details: () => <ProductDetailsTab product={product} />,
        alternatives: () => <AlternativesTab alternatives={product?.alternatives} />
      })}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.background,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  indicator: {
    backgroundColor: colors.primary,
    height: 3,
  },
  tabLabel: {
    ...typography.caption,
    textTransform: 'none',
  },
  groupCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    elevation: 1,
  },
  groupTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  star: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  starFilled: {
    color: colors.primary,
  },
  starEmpty: {
    color: colors.accent,
  },
  explanation: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  recommendations: {
    ...typography.body,
    color: colors.text.light,
    fontStyle: 'italic',
  },
});

export default ProductDetailsScreen; 