import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';
import Icon from '@expo/vector-icons/Feather';
import RevenueCatService from '../services/RevenueCatService';
import { runStressTest } from '../utils/StressTest';

const SettingsScreen = () => {

    const openUrl = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Error", "No se pudo abrir el enlace: " + url);
        }
    };

    const handleRestorePurchases = async () => {
        try {
            const restored = await RevenueCatService.restorePurchases();
            if (restored) {
                Alert.alert("Éxito", "Tus compras han sido restauradas correctamente.");
            } else {
                Alert.alert("Aviso", "No se encontraron compras activas para restaurar.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un problema al restaurar compras.");
        }
    };

    const SettingItem = ({ icon, title, onPress, subtitle }) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Icon name={icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            <Icon name="chevron-right" size={20} color={colors.text.light} />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ajustes</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Suscripción</Text>
                <SettingItem
                    icon="credit-card"
                    title="Gestionar Suscripción"
                    subtitle="Ver plan, cancelar o cambiar"
                    onPress={async () => {
                        try {
                            const RevenueCatUI = require('react-native-purchases-ui').default;
                            await RevenueCatUI.presentCustomerCenter();
                        } catch (e) {
                            Alert.alert("Aviso", "Disponible solo en versión final (Native Build).");
                        }
                    }}
                />
                <SettingItem
                    icon="refresh-cw"
                    title="Restaurar Compras"
                    subtitle="Si ya compraste Premium anteriormente"
                    onPress={handleRestorePurchases}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Legal</Text>
                <SettingItem
                    icon="shield"
                    title="Política de Privacidad"
                    onPress={() => openUrl('https://tustudio.com/privacy-policy')}
                />
                <SettingItem
                    icon="file-text"
                    title="Términos de Uso (EULA)"
                    onPress={() => openUrl('https://tustudio.com/terms')}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acerca de</Text>
                <SettingItem
                    icon="info"
                    title="Versión de la App"
                    subtitle="1.0.0 (Build 1)"
                    onPress={() => { }}
                />
                <SettingItem
                    icon="mail"
                    title="Contacto / Soporte"
                    onPress={() => openUrl('mailto:soporte@tustudio.com')}
                />
            </View>

            {/* DEVELOPER SECTION */}
            {__DEV__ && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Developer Tools</Text>
                    <SettingItem
                        icon="cpu"
                        title="Ejecutar Prueba de Estrés IA"
                        subtitle="Simular 50 escaneos (Ver Consola)"
                        onPress={() => {
                            Alert.alert(
                                "Iniciar Prueba de Estrés",
                                "Esto ejecutará una simulación de 50 productos. Los resultados detallados se mostrarán en una alerta al finalizar.",
                                [
                                    { text: "Cancelar", style: "cancel" },
                                    {
                                        text: "Iniciar",
                                        onPress: async () => {
                                            try {
                                                const { runStressTest } = require('../utils/StressTest');
                                                const results = await runStressTest();
                                                Alert.alert(
                                                    "Prueba Finalizada",
                                                    `✅ Éxitos: ${results.successCount}\n❌ Fallos: ${results.failureCount}\n🛡️ Verificados: ${results.verifiedCount}\n⏱️ Tiempo Total: ${results.totalTime}ms\n⏱️ Promedio: ${results.avgTime.toFixed(2)}ms`
                                                );
                                            } catch (error) {
                                                Alert.alert("Error", error.message);
                                            }
                                        }
                                    }
                                ]
                            );
                        }}
                    />
                </View>
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>SaludAppble © 2024</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.lg,
        paddingTop: spacing.xl,
        backgroundColor: colors.background,
    },
    headerTitle: {
        ...typography.h1,
        color: colors.text.primary,
    },
    section: {
        marginBottom: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.surface,
    },
    sectionTitle: {
        ...typography.caption,
        color: colors.text.light,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: '#FFF',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    itemTitle: {
        ...typography.body,
        fontWeight: '500',
        color: colors.text.primary,
    },
    itemSubtitle: {
        ...typography.caption,
        color: colors.text.light,
        marginTop: 2,
    },
    footer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        ...typography.caption,
        color: colors.text.light,
    }
});

export default SettingsScreen;
