import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';
import ProductService from '../services/ProductService';

const getCategoryIcon = (category) => {
    const map = {
        'beverage': 'coffee', 'soda': 'droplet', 'juice': 'sun', 'alcohol': 'wine-glass',
        'yogurt': 'loader', 'cheese': 'box', 'snack': 'package', 'sweet': 'gift',
        'shampoo': 'umbrella', 'cream': 'sun', 'soap': 'shield', 'makeup': 'smile',
        'protein': 'zap', 'creatine': 'battery-charging', 'vitamin': 'plus-circle',
        'supplement': 'activity', 'medicine': 'thermometer'
    };
    // Default fallback
    return map[category] || 'box';
};

const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Hace menos de un minuto';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;

    return past.toLocaleDateString('es-ES');
};

const HistoryScreen = ({ navigation }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        setLoading(true);
        const data = await ProductService.getHistory();
        setHistory(data);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const handleClearHistory = () => {
        Alert.alert(
            "Borrar Historial",
            "¿Estás seguro de que quieres borrar todo el historial?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Borrar",
                    style: "destructive",
                    onPress: async () => {
                        await ProductService.clearHistory();
                        loadHistory();
                    }
                }
            ]
        );
    };

    // Add clear button to header
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginLeft: 15 }}>
                    <Feather name="settings" size={24} color={colors.text.primary} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                history.length > 0 && (
                    <TouchableOpacity onPress={handleClearHistory} style={{ marginRight: 15 }}>
                        <Feather name="trash-2" size={20} color={colors.status.error} />
                    </TouchableOpacity>
                )
            ),
        });
    }, [navigation, history]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'good': return { name: 'check-circle', color: colors.status.success };
            case 'regular': return { name: 'minus-circle', color: colors.status.warning };
            case 'bad': return { name: 'alert-triangle', color: colors.status.error };
            default: return { name: 'help-circle', color: colors.text.light };
        }
    };

    const renderItem = ({ item }) => {
        const statusIcon = getStatusIcon(item.status);
        const timeAgo = getTimeAgo(item.timestamp);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ProductDetails', { barcode: item.id })}
            >
                {item.image_url ? (
                    <Image
                        source={{ uri: item.image_url }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Feather name={getCategoryIcon(item.category || 'general')} size={24} color={colors.primary} />
                    </View>
                )}
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.brand} numberOfLines={1}>{item.brand}</Text>
                    <Text style={styles.date}>{timeAgo}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusIcon.color + '20' }]}>
                    <Feather name={statusIcon.name} size={18} color={statusIcon.color} />
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>Cargando historial...</Text>
            </View>
        );
    }

    if (history.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Feather name="clock" size={48} color={colors.text.light} style={{ marginBottom: 15, opacity: 0.5 }} />
                <Text style={styles.emptyText}>No hay búsquedas recientes.</Text>
                <Text style={styles.emptySubtext}>Escanea productos para verlos aquí.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    listContent: {
        padding: spacing.md,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    imagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#e0f2fe', // sky 100
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    name: {
        ...typography.body,
        fontWeight: 'bold',
        color: colors.text.primary,
        textTransform: 'capitalize',
        marginBottom: 2,
    },
    brand: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    date: {
        fontSize: 10,
        color: colors.text.light,
    },
    statusBadge: {
        padding: 8,
        borderRadius: 20,
    },
    emptyText: {
        ...typography.h3,
        color: colors.text.secondary,
    },
    emptySubtext: {
        ...typography.caption,
        color: colors.text.light,
        marginTop: 5,
    }
});

export default HistoryScreen;
