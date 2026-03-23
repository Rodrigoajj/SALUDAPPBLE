import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';

const AlternativesTab = ({ alternatives }) => {
    if (!alternatives || alternatives.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Feather name="check-circle" size={48} color={colors.primary} />
                <Text style={styles.emptyText}>
                    Este producto es una excelente opción. No hay alternativas mejores.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Alternativas más saludables</Text>
            {alternatives.map((alt, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Feather name="thumbs-up" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Alternativa sugerida {index + 1}</Text>
                        <Text style={styles.description}>
                            Esta opción tiene mejores valoraciones para tu perfil de salud.
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={24} color={colors.text.light} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
        backgroundColor: colors.background,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        textAlign: 'center',
        marginTop: spacing.md,
        color: colors.text.secondary,
    },
    header: {
        ...typography.h2,
        fontSize: 18,
        marginBottom: spacing.md,
        color: colors.text.primary,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginBottom: spacing.sm,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text.primary,
    },
    description: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: 2,
    },
});

export default AlternativesTab;
