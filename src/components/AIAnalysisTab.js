import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';
import Icon from '@expo/vector-icons/Feather';
import AIService from '../services/AIService';
import RevenueCatService from '../services/RevenueCatService';
// import RevenueCatUI from 'react-native-purchases-ui'; // Removed for Expo Go compatibility

const AIAnalysisTab = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [isPremium, setIsPremium] = useState(RevenueCatService.isUserPremium);
    const [offerings, setOfferings] = useState([]);

    useEffect(() => {
        const checkStatus = async () => {
            const premium = await RevenueCatService.checkSubscriptionStatus();
            setIsPremium(premium);
            const offers = await RevenueCatService.getOfferings();
            setOfferings(offers);
        };
        checkStatus();
    }, []);

    const handlePurchase = async () => {
        try {
            // 1. Try to present the Native Paywall (RevenueCat UI)
            const RevenueCatUI = require('react-native-purchases-ui').default;
            const paywallResult = await RevenueCatUI.presentPaywall();
            if (paywallResult === RevenueCatUI.PAYWALL_RESULT.PURCHASED ||
                paywallResult === RevenueCatUI.PAYWALL_RESULT.RESTORED) {
                setIsPremium(true);
                return;
            } else if (paywallResult === RevenueCatUI.PAYWALL_RESULT.CANCELLED) {
                return;
            }
        } catch (e) {
            console.log("Paywall not available (likely Expo Go), using manual flow");
        }

        // 2. Fallback to Manual Flow (for Expo Go or if Paywall fails)
        if (offerings.length > 0) {
            try {
                const success = await RevenueCatService.purchasePackage(offerings[0]);
                setIsPremium(success);
            } catch (error) {
                console.log("Purchase failed");
            }
        } else {
            console.log("Mocking Purchase for Dev");
            setIsPremium(true);
        }
    };

    const isFood = ['alimento', 'bebida', 'suplemento'].includes(product?.category);

    // Customize selling points based on category
    const premiumFeatures = isFood ? [
        { icon: 'activity', title: 'Impacto Metabólico', desc: 'Predice picos de glucosa e insulina.' },
        { icon: 'alert-triangle', title: 'Aditivos Ocultos', desc: 'Detecta colorantes y conservantes de riesgo.' },
        { icon: 'user-check', title: 'Opinión Experta', desc: 'Evaluación de Nutricionista/Diabetólogo.' }
    ] : [
        { icon: 'shield', title: 'Seguridad Hormonal', desc: 'Detecta parabenos y disruptores endocrinos.' },
        { icon: 'droplet', title: 'Compatibilidad Dérmica', desc: 'Análisis de irritantes y comedogenicidad.' },
        { icon: 'user-check', title: 'Opinión Experta', desc: 'Evaluación de Dermatólogo/Cosmetólogo.' }
    ];

    const triggerAnalysis = async () => {
        setLoading(true);
        try {
            const result = await AIService.generateLLMAnalysis(product);
            setAnalysis(result);
        } catch (error) {
            console.error('LLM Analysis error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (product) {
            triggerAnalysis();
        }
    }, [product]);

    const cyanColor = '#06b6d4';
    const violetColor = '#7c3aed';
    const indigoColor = '#4338ca';

    const renderVerdict = (verdict) => {
        const isBad = verdict.status === 'bad';
        const isVerified = verdict.status === 'verified';

        let containerStyle = styles.verdictRegular;
        let iconName = 'check';
        let iconColor = '#06b6d4';

        if (isBad) {
            containerStyle = styles.verdictBad;
            iconName = 'alert-triangle';
            iconColor = '#dc2626';
        } else if (isVerified) {
            containerStyle = styles.verdictVerified;
            iconName = 'shield';
            iconColor = '#10b981'; // Emerald 500
        }

        return (
            <View style={[styles.verdictBadge, containerStyle]}>
                <Icon name={iconName} size={14} color={isVerified ? '#10b981' : (isBad ? '#dc2626' : '#06b6d4')} />
                <Text style={[styles.verdictText, isVerified && { color: '#10b981' }, isBad && { color: '#dc2626' }]}>{verdict.label}</Text>
            </View>
        );
    };

    const LockedFeature = ({ icon, title, desc }) => (
        <View style={styles.lockedFeatureItem}>
            <View style={styles.lockedIconBg}>
                <Icon name={icon} size={20} color={violetColor} />
            </View>
            <View>
                <Text style={styles.lockedFeatureTitle}>{title}</Text>
                <Text style={styles.lockedFeatureDesc}>{desc}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Header: Always visible but maybe truncated if free */}
            <View style={styles.headerCard}>
                <View style={styles.headerTop}>
                    <View style={styles.iconCircle}>
                        <Icon name="cpu" size={24} color="#FFF" />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Informe de Diagnóstico IA</Text>
                        <Text style={styles.headerSubtitle}>v2.5 • Análisis Neural de {product?.category || 'Producto'}</Text>
                    </View>
                    {/* Demo Toggle */}
                    <TouchableOpacity onPress={() => setIsPremium(!isPremium)} style={{ padding: 5 }}>
                        <Icon name={isPremium ? "unlock" : "lock"} size={16} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>
                </View>
                {analysis && (
                    <View style={styles.headerBottom}>
                        <Text style={styles.focusLabel}>ENFOQUE: {analysis.focus.toUpperCase()}</Text>
                        {renderVerdict(analysis.verdict)}
                    </View>
                )}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={violetColor} />
                    <Text style={styles.loadingText}>Procesando matriz de componentes...</Text>
                    <Text style={styles.loadingSubtext}>Evaluando sinergia y niveles de riesgo</Text>
                </View>
            ) : analysis ? (
                <View style={styles.reportContent}>

                    {/* ALTERNATIVES SECTION (New Feature) */}
                    {analysis.alternatives && analysis.alternatives.length > 0 && !isPremium && (
                        <View style={styles.alternativesCard}>
                            <View style={styles.alternativesHeader}>
                                <Icon name="thumbs-up" size={18} color="#10b981" />
                                <Text style={styles.alternativesTitle}>Alternativas Saludables</Text>
                            </View>
                            <Text style={styles.alternativesSubtitle}>Basado en tu escaneo, te recomendamos:</Text>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                                {analysis.alternatives.map((alt, idx) => (
                                    <View key={idx} style={styles.productCard}>
                                        <Image source={{ uri: alt.image_url }} style={styles.productImage} resizeMode="contain" />
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productBrand}>{alt.brand}</Text>
                                            <Text style={styles.productName} numberOfLines={2}>{alt.name}</Text>
                                            <View style={styles.miniBadge}>
                                                <Icon name="check-circle" size={10} color="#10b981" />
                                                <Text style={styles.miniBadgeText}>Verificado</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* CONDITIONAL RENDERING: LOCKED vs UNLOCKED */}
                    {!isPremium ? (
                        <View style={styles.lockedContainer}>
                            <View style={styles.premiumCard}>
                                <View style={styles.crownIcon}>
                                    <Icon name="star" size={32} color="#fbbf24" fill="#fbbf24" />
                                </View>
                                <Text style={styles.premiumTitle}>Análisis Profundo</Text>
                                <Text style={styles.premiumSubtitle}>
                                    {isFood ? 'Desbloquea el impacto real en tu salud' : 'Descubre qué pones realmente en tu piel'}
                                </Text>

                                <View style={styles.featuresList}>
                                    {premiumFeatures.map((feat, idx) => (
                                        <LockedFeature key={idx} icon={feat.icon} title={feat.title} desc={feat.desc} />
                                    ))}
                                </View>

                                <TouchableOpacity style={styles.upgradeBtn} onPress={handlePurchase}>
                                    <Text style={styles.upgradeBtnText}>DESBLOQUEAR AHORA</Text>
                                    <Text style={styles.upgradePrice}>
                                        {offerings.length > 0 ? offerings[0].product.priceString + "/mes" : "7 días gratis, luego $4.99/mes"}
                                    </Text>
                                </TouchableOpacity>

                                {/* Restore Purchases (Mandatory for App Store) */}
                                <TouchableOpacity onPress={async () => {
                                    try {
                                        const restored = await RevenueCatService.restorePurchases();
                                        setIsPremium(restored);
                                        if (restored) alert("Compras restauradas con éxito.");
                                        else alert("No se encontraron compras previas.");
                                    } catch (e) { console.error(e); }
                                }}>
                                    <Text style={{ color: '#a5b4fc', marginTop: 15, fontSize: 12, textDecorationLine: 'underline' }}>Restaurar Compras</Text>
                                </TouchableOpacity>

                                {/* Customer Center (Optional) */}
                                <TouchableOpacity onPress={async () => {
                                    try {
                                        const RevenueCatUI = require('react-native-purchases-ui').default;
                                        await RevenueCatUI.presentCustomerCenter();
                                    }
                                    catch (e) { alert("Customer Center requiere Native Build"); }
                                }}>
                                    <Text style={{ color: '#a5b4fc', marginTop: 10, fontSize: 10, opacity: 0.7 }}>Gestionar Suscripción</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Sneak peek / blurred hint below */}
                            <View style={styles.blurredPreview}>
                                <Text style={styles.sneakPeekText}>
                                    Contenido oculto: {analysis.sections.length} secciones, {analysis.facts.length} datos científicos...
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            {/* Insights Sections */}
                            {analysis.sections.map((section, index) => (
                                <View key={index} style={[styles.sectionCard, section.type === 'warning' || section.type === 'bad' ? styles.section_warning : styles.section_info]}>
                                    <View style={styles.sectionHeader}>
                                        <Icon name={section.icon} size={18} color={section.type === 'warning' || section.type === 'bad' ? '#dc2626' : violetColor} />
                                        <Text style={[styles.sectionTitle, (section.type === 'warning' || section.type === 'bad') && { color: '#dc2626' }]}>
                                            {section.title}
                                        </Text>
                                    </View>
                                    <Text style={styles.sectionText}>{section.content}</Text>
                                </View>
                            ))}

                            {/* Facts Table */}
                            <View style={styles.factsCard}>
                                <Text style={styles.cardLabel}>EVIDENCIA CIENTÍFICA</Text>

                                {/* Human Explanation Block */}
                                {analysis.humanExplanation && (
                                    <View style={styles.humanExplanationBox}>
                                        <Text style={styles.humanExplanationText}>{analysis.humanExplanation}</Text>
                                    </View>
                                )}

                                {analysis.facts.map((fact, idx) => (
                                    <View key={idx} style={styles.factRow}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Text style={[styles.factLabel, { flex: 0 }]}>{fact.label}</Text>
                                            {fact.label === 'Clean Label' && (
                                                <TouchableOpacity
                                                    onPress={() => Alert.alert(
                                                        "¿Qué es Clean Label?",
                                                        "Significa que el producto tiene una lista de ingredientes corta, comprensible y libre de aditivos artificiales complejos. Es sinónimo de naturalidad y transparencia."
                                                    )}
                                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                    style={{ marginLeft: 6 }}
                                                >
                                                    <Icon name="info" size={14} color="#7c3aed" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <TouchableOpacity
                                            style={[
                                                styles.factValueContainer,
                                                fact.label === 'Aditivos Críticos' && !fact.value.startsWith('0') && { backgroundColor: '#fef2f2', borderColor: '#fca5a5' }
                                            ]}
                                            disabled={fact.label !== 'Aditivos Críticos' || fact.value.startsWith('0')}
                                            onPress={() => {
                                                if (analysis.criticalIngredients && analysis.criticalIngredients.length > 0) {
                                                    Alert.alert(
                                                        "Aditivos Críticos Detectados",
                                                        `Se han encontrado los siguientes componentes de atención:\n\n• ${analysis.criticalIngredients.join('\n• ')}\n\nEstos ingredientes suelen estar asociados a efectos no deseados cuando se consumen en exceso.`,
                                                        [{ text: "Entendido", style: "default" }]
                                                    );
                                                }
                                            }}
                                        >
                                            <Text style={[
                                                styles.factValue,
                                                fact.label === 'Aditivos Críticos' && !fact.value.startsWith('0') && { color: '#dc2626' }
                                            ]}>
                                                {fact.value} {fact.label === 'Aditivos Críticos' && !fact.value.startsWith('0') && ' ›'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            {/* Professional Advice */}
                            <View style={styles.proCard}>
                                <View style={styles.proIconBox}>
                                    <Icon name="user-check" size={24} color={indigoColor} />
                                </View>
                                <View style={styles.proTextBox}>
                                    <Text style={styles.proTitle}>Consulta Recomendada</Text>
                                    <Text style={styles.proSpecialist}>{analysis.professionalAdvice.specialist}</Text>
                                    <Text style={styles.proMessage}>{analysis.professionalAdvice.message}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            ) : (
                <TouchableOpacity style={styles.refreshBtn} onPress={triggerAnalysis}>
                    <Icon name="refresh-cw" size={16} color="#FFF" />
                    <Text style={styles.refreshBtnText}>Analizar Producto</Text>
                </TouchableOpacity>
            )}

            <View style={styles.footerNote}>
                <Text style={styles.footerNoteText}>
                    Este sistema utiliza IA predictiva (OFF/OBF). No sustituye juicio médico.
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
    scrollContent: {
        padding: spacing.md,
    },
    headerCard: {
        backgroundColor: '#4c1d95', // Deep Violet
        padding: spacing.lg,
        borderRadius: 20,
        marginBottom: spacing.lg,
        elevation: 6,
        shadowColor: '#4c1d95',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        flexWrap: 'wrap', // Allow wrapping to prevent collision
        gap: 10, // Add gap for spacing when wrapped
    },
    iconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        ...typography.h2,
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        ...typography.caption,
        color: '#c4b5fd', // Light Violet
        marginTop: 4,
    },
    focusLabel: {
        ...typography.caption,
        color: '#e9d5ff',
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    verdictBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    verdictRegular: {
        backgroundColor: 'rgba(6, 182, 212, 0.2)', // Cyan transparent
        borderWidth: 1,
        borderColor: '#06b6d4',
    },
    verdictBad: {
        backgroundColor: 'rgba(220, 38, 38, 0.2)', // Red transparent
        borderWidth: 1,
        borderColor: '#dc2626',
    },
    verdictText: {
        ...typography.caption,
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 6,
    },
    verdictVerified: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)', // Emerald transparent
        borderWidth: 1,
        borderColor: '#10b981',
    },
    alternativesCard: {
        backgroundColor: '#ecfdf5', // Emerald 50
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#a7f3d0',
    },
    alternativesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    alternativesTitle: {
        ...typography.h3,
        marginLeft: 10,
        color: '#047857', // Emerald 700
        fontWeight: 'bold',
    },
    alternativesSubtitle: {
        ...typography.caption,
        color: '#065f46',
        marginBottom: 10,
    },
    productsScroll: {
        marginTop: 5,
    },
    productCard: {
        width: 120,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    productImage: {
        width: '100%',
        height: 80,
        marginBottom: 5,
        borderRadius: 8,
    },
    productInfo: {
        alignItems: 'flex-start',
    },
    productBrand: {
        fontSize: 10,
        color: '#6b7280',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: 11,
        color: '#1f2937',
        fontWeight: '600',
        height: 30, // Fixed height for alignment
    },
    miniBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        backgroundColor: '#d1fae5',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    miniBadgeText: {
        fontSize: 8,
        color: '#059669',
        marginLeft: 3,
        fontWeight: 'bold',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 20,
    },
    loadingText: {
        ...typography.h3,
        color: '#4c1d95',
        marginTop: 20,
    },
    loadingSubtext: {
        ...typography.caption,
        color: colors.text.light,
        marginTop: 8,
    },
    reportContent: {
        width: '100%',
        position: 'relative',
        minHeight: 400, // Ensure height for overlay
    },
    sectionCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        elevation: 2,
    },
    section_info: {
        borderLeftColor: '#7c3aed', // Violet 600
    },
    section_warning: {
        borderLeftColor: '#dc2626',
        backgroundColor: '#fef2f2',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        ...typography.h3,
        marginLeft: 10,
        color: '#5b21b6', // Violet 800
        fontWeight: 'bold',
    },
    sectionText: {
        ...typography.body,
        lineHeight: 22,
        color: colors.text.secondary,
    },
    factsCard: {
        backgroundColor: '#f5f3ff', // Light Violet Bg
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#ddd6fe',
    },
    cardLabel: {
        ...typography.caption,
        color: '#6d28d9',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 15,
    },
    factRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(124, 58, 237, 0.1)',
    },
    factLabel: {
        ...typography.body,
        color: '#4c1d95',
        flex: 1,
    },
    factValueContainer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#8b5cf6',
    },
    factValue: {
        ...typography.caption,
        color: '#7c3aed',
        fontWeight: 'bold',
    },
    humanExplanationBox: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(124, 58, 237, 0.1)',
    },
    humanExplanationText: {
        ...typography.body,
        color: '#5b21b6', // Violet 800
        lineHeight: 22,
        fontStyle: 'italic',
        fontSize: 14,
    },
    proCard: {
        flexDirection: 'row',
        backgroundColor: '#eef2ff', // Indigo 50
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#c7d2fe',
    },
    proIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        elevation: 1,
    },
    proTextBox: {
        flex: 1,
    },
    proTitle: {
        ...typography.caption,
        color: '#3730a3',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    proSpecialist: {
        ...typography.h3,
        color: '#312e81',
        marginTop: 2,
    },
    proMessage: {
        ...typography.body,
        color: '#4338ca',
        fontSize: 13,
        marginTop: 6,
        lineHeight: 18,
    },
    // PREMIUM CARDS
    premiumCard: {
        backgroundColor: '#1e1b4b', // Very dark indigo
        width: '100%',
        padding: 25,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    crownIcon: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 50,
        marginBottom: 15,
    },
    premiumTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
    },
    premiumSubtitle: {
        fontSize: 14,
        color: '#c7d2fe',
        marginBottom: 20,
    },
    featuresList: {
        width: '100%',
        marginBottom: 20,
    },
    lockedFeatureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 12,
    },
    lockedIconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    lockedFeatureTitle: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    lockedFeatureDesc: {
        color: '#a5b4fc',
        fontSize: 12,
    },
    upgradeBtn: {
        backgroundColor: '#fbbf24', // Amber 400
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 50,
        width: '100%',
        alignItems: 'center',
        shadowColor: "#fbbf24",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    upgradeBtnText: {
        color: '#4c1d95',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 1,
    },
    upgradePrice: {
        color: '#713f12',
        fontSize: 10,
        marginTop: 2,
        fontWeight: 'bold',
    },
    blurredPreview: {
        alignItems: 'center',
        padding: 20,
        opacity: 0.5,
    },
    sneakPeekText: {
        ...typography.caption,
        color: colors.text.light,
    },
    // Footer
    footerNote: {
        padding: 20,
        alignItems: 'center',
    },
    footerNoteText: {
        ...typography.caption,
        color: colors.text.light,
        textAlign: 'center',
        lineHeight: 16,
        fontSize: 11,
    },
    refreshBtn: {
        backgroundColor: '#7c3aed',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 12,
        marginVertical: 20,
    },
    refreshBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 10,
    }
});

export default AIAnalysisTab;
