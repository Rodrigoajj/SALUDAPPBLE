import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';
import Icon from '@expo/vector-icons/Feather';
import AIService from '../services/AIService';

const DetailItem = ({ label, value, icon }) => (
    <View style={styles.detailItem}>
        <View style={styles.iconContainer}>
            <Icon name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value || 'No especificado'}</Text>
        </View>
    </View>
);

const Section = ({ title, icon, children }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Icon name={icon} size={22} color={colors.primary} style={{ marginRight: 10 }} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
);

import { useNavigation } from '@react-navigation/native';

const ProductDetailsTab = ({ product }) => {
    const navigation = useNavigation();
    if (!product) return null;

    const isFood = product.category === 'alimento';
    const isBeauty = product.category === 'higiene' || product.category === 'cosmetico';
    const isSupplement = product.category === 'suplemento';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* General Info */}
            <View style={styles.infoCard}>
                <DetailItem label="Marca" value={product.brand} icon="tag" />
                <DetailItem label="Categoría" value={product.category} icon="box" />
                {product.details?.servingSize && (
                    <DetailItem label="Tamaño por porción" value={product.details.servingSize} icon="activity" />
                )}
            </View>

            {/* Nutritional Info (for Food and Supplements) */}
            {(isFood || isSupplement) && product.details?.nutritionalInfo && (
                <Section title="Información Nutricional" icon="bar-chart-2">
                    <View style={styles.nutritionGrid}>
                        {Object.entries(product.details.nutritionalInfo).map(([key, value]) => (
                            <View key={key} style={styles.nutritionRow}>
                                <Text style={styles.rowLabel}>{key.replace('_', ' ')}</Text>
                                <Text style={styles.rowValue}>{typeof value === 'number' ? value.toFixed(1) : value}</Text>
                            </View>
                        ))}
                    </View>
                </Section>
            )}

            {/* Active Ingredients (for Beauty and Supplements) */}
            {(isBeauty || isSupplement) && product.details?.activeIngredients?.length > 0 && (
                <Section title="Ingredientes Activos" icon="star">
                    {product.details.activeIngredients.map((item, idx) => (
                        <View key={idx} style={styles.activeIngredientCard}>
                            <Text style={styles.activeIngredientName}>{item.name}</Text>
                            <View style={styles.activeIngredientMeta}>
                                <Text style={styles.activeIngredientSubtle}>{item.concentration || 'Conc. no disp.'}</Text>
                                <Text style={styles.activeIngredientSubtle}>{item.purpose || ''}</Text>
                            </View>
                        </View>
                    ))}
                </Section>
            )}

            {/* Top Ingredients Analysis (Updated) */}

            {/* Ingredients List */}
            {product.details?.ingredients && product.details.ingredients.length > 0 && (
                <Section title="Lista de Ingredientes" icon="list">
                    <View style={styles.ingredientsContainer}>
                        {product.details.ingredients.map((ingredient, idx) => {
                            const status = AIService.getIngredientStatus(ingredient, product.category);
                            let chipStyle = { backgroundColor: '#E8F5E9' }; // Default/Neutral (Light Greenish)
                            let textStyle = { color: colors.text.primary };

                            if (status === 'bad') {
                                chipStyle = { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#EF4444' }; // Red
                                textStyle = { color: '#B91C1C', fontWeight: 'bold' };
                            } else if (status === 'good') {
                                chipStyle = { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#22C55E' }; // Green
                                textStyle = { color: '#15803D', fontWeight: 'bold' };
                            }

                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={[styles.ingredientChip, chipStyle]}
                                    onPress={() => navigation.navigate('IngredientDetails', {
                                        ingredientName: ingredient,
                                        category: product.category
                                    })}
                                >
                                    <Text style={[styles.ingredientText, textStyle]}>{ingredient.trim()}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Section>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.md,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    detailLabel: {
        ...typography.caption,
        color: colors.text.light,
        textTransform: 'uppercase',
    },
    detailValue: {
        ...typography.body,
        fontSize: 18,
        color: colors.text.primary,
        fontWeight: '600',
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h2,
        color: colors.text.primary,
    },
    sectionContent: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    analysisContainer: {
        width: '100%',
    },
    analysisGroup: {
        marginBottom: spacing.md,
    },
    analysisLabel: {
        ...typography.caption,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
    },
    ingredientDetailCard: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: colors.status.success,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    ingredientDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ingredientDetailName: {
        ...typography.body,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginLeft: 6,
    },
    ingredientDetailReason: {
        ...typography.caption,
        color: colors.text.secondary,
        marginLeft: 22,
        lineHeight: 18,
    },
    nutritionGrid: {
        width: '100%',
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    rowLabel: {
        ...typography.body,
        color: colors.text.secondary,
        textTransform: 'capitalize',
    },
    rowValue: {
        ...typography.body,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    ingredientsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    ingredientChip: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    ingredientText: {
        ...typography.caption,
        color: colors.text.primary,
    },
    activeIngredientCard: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        elevation: 1,
    },
    activeIngredientName: {
        ...typography.body,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    activeIngredientMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    activeIngredientSubtle: {
        ...typography.caption,
        color: colors.text.light,
        fontStyle: 'italic',
    }
});

export default ProductDetailsTab;
