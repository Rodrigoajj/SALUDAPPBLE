import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';
import { getIngredientInfo } from '../services/IngredientKnowledgeBase';
import WikiService from '../services/WikiService';

const IngredientDetailsScreen = ({ route, navigation }) => {
    const { ingredientName, category } = route.params;
    const [info, setInfo] = useState(null);
    useEffect(() => {
        // Fetch intelligent data
        console.log('Fetching info for:', ingredientName);
        const data = getIngredientInfo(ingredientName, category);
        setInfo(data);

        // Fetch Wiki Data
        WikiService.getIngredientDescription(ingredientName).then(wikiData => {
            if (wikiData) {
                setInfo(prev => ({
                    ...prev,
                    wikiDescription: wikiData.description,
                    wikiImage: wikiData.image,
                    wikiUrl: wikiData.pageUrl,
                    wikiTitle: wikiData.title
                }));
            }
        });

        navigation.setOptions({ title: ingredientName || 'Análisis' });
    }, [ingredientName]);

    if (!info) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 20, color: colors.text.secondary }}>Analizando ingrediente...</Text>
            </View>
        );
    }

    const getSafetyColor = (safety) => {
        if (safety === 'good') return colors.status.success; // Green
        if (safety === 'bad') return colors.status.error; // Red
        return colors.status.warning; // Neutral/Yellow
    };

    const getSafetyIcon = (safety) => {
        if (safety === 'good') return 'check-circle';
        if (safety === 'bad') return 'alert-triangle';
        return 'info';
    };

    const safetyColor = getSafetyColor(info.safety);

    const InfoSection = ({ title, icon, children }) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Feather name={icon} size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );



    const WikiSection = ({ info }) => {
        const [imageError, setImageError] = useState(false);

        return (
            <InfoSection title={`Qué es (Según Wikipedia: ${info.wikiTitle || 'Fuente'})`} icon="book-open">
                {info.wikiImage && !imageError && (
                    <View style={{ backgroundColor: '#f3f4f6', borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
                        <Image
                            source={{ uri: info.wikiImage }}
                            style={{ width: '100%', height: 150 }}
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    </View>
                )}
                <Text style={[styles.bodyText, { minHeight: 40 }]}>{info.wikiDescription}</Text>
                <TouchableOpacity onPress={() => info.wikiUrl && Linking.openURL(info.wikiUrl)}>
                    <Text style={[styles.disclaimerText, { textAlign: 'right', marginTop: 5, color: colors.primary, textDecorationLine: 'underline' }]}>
                        Fuente: Wikipedia ↗
                    </Text>
                </TouchableOpacity>
            </InfoSection>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>


            {/* Header Card */}
            <View style={[styles.headerCard, { borderTopColor: safetyColor }]}>
                <View style={styles.headerTop}>
                    <View style={[styles.iconBadge, { backgroundColor: safetyColor + '20' }]}>
                        <Feather name={getSafetyIcon(info.safety)} size={32} color={safetyColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.ingredientName}>{info.name}</Text>
                        <Text style={styles.ingredientCategory}>{info.category}</Text>
                    </View>
                </View>
                <Text style={styles.description}>{info.description}</Text>
            </View>

            {/* Intelligent Data Sections */}

            {info.wikiDescription && (
                <WikiSection info={info} />
            )}

            {info.dosage && (
                <InfoSection title="Dosis y Uso Recomendado" icon="activity">
                    <Text style={styles.bodyText}>{info.dosage}</Text>
                </InfoSection>
            )}

            {info.benefits && (
                <InfoSection title="Beneficios Principales" icon="thumbs-up">
                    {Array.isArray(info.benefits) ? (
                        info.benefits.map((benefit, idx) => (
                            <View key={idx} style={styles.bulletRow}>
                                <Feather name="check" size={16} color={colors.status.success} style={{ marginTop: 2 }} />
                                <Text style={styles.bulletText}>{benefit}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.bodyText}>{info.benefits}</Text>
                    )}
                </InfoSection>
            )}

            {info.risks && (
                <InfoSection title="Riesgos y Precauciones" icon="alert-circle">
                    <Text style={[styles.bodyText, { color: colors.text.secondary }]}>{info.risks}</Text>
                </InfoSection>
            )}

            {info.sources && (
                <InfoSection title="Fuentes Comunes" icon="layers">
                    <Text style={styles.bodyText}>{info.sources}</Text>
                </InfoSection>
            )}

            <View style={styles.disclaimerBox}>
                <Feather name="shield" size={16} color={colors.text.light} />
                <Text style={styles.disclaimerText}>
                    Información generada por SaludApp AI. Consulta siempre a un profesional de la salud.
                </Text>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.md,
    },
    headerCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderTopWidth: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    iconBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    ingredientName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 4,
    },
    ingredientCategory: {
        fontSize: 14,
        color: colors.text.light,
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: 1,
    },
    description: {
        fontSize: 16,
        color: colors.text.secondary,
        lineHeight: 24,
    },
    section: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginLeft: 10,
    },
    sectionContent: {
        paddingLeft: 4,
    },
    bodyText: {
        fontSize: 15,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    bulletText: {
        fontSize: 15,
        color: colors.text.secondary,
        marginLeft: 10,
        flex: 1,
    },
    disclaimerBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
        padding: spacing.md,
        opacity: 0.7,
    },
    disclaimerText: {
        fontSize: 12,
        color: colors.text.light,
        marginLeft: 8,
        textAlign: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default IngredientDetailsScreen;
