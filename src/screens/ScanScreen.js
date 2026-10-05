import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Platform, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';

const ScanScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    console.log("ScanScreen Mounted");
    if (permission) {
      console.log("Permission status:", permission.status);
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    console.log("Barcode scanned:", data);
    navigation.navigate('ProductDetails', { barcode: data });
    // Reset scanner after a delay when coming back
    setTimeout(() => setScanned(false), 2000);
  };

  const handleManualSubmit = () => {
    if (manualCode) {
      handleBarCodeScanned({ data: manualCode });
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webContainer]}>
        <Text style={styles.webTitle}>Escáner no disponible en web</Text>
        <Text style={styles.webSubtitle}>Ingresa el código manualmente:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 7501001123456"
          value={manualCode}
          onChangeText={setManualCode}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleManualSubmit}>
          <Text style={styles.buttonText}>Buscar Producto</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Códigos de prueba:</Text>
        <TouchableOpacity onPress={() => setManualCode('7501055310866')}>
          <Text style={styles.link}>Coca Cola 600ml (7501055310866)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission) {
    return <View style={styles.container} />; // Loading state
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Feather name="camera-off" size={48} color={colors.text.light} />
        <Text style={styles.permissionText}>
          Necesitamos acceso a la cámara para escanear productos
        </Text>
        <Button title="Dar Permiso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View
            style={[
              styles.scanLine,
              // Animation removed
            ]}
          />
        </View>
        <Text style={styles.instructions}>
          Centra el código de barras en el área
        </Text>

        {/* Helper to reset if stuck */}
        {scanned && (
          <TouchableOpacity
            style={{ position: 'absolute', bottom: 100, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8 }}
            onPress={() => setScanned(false)}
          >
            <Text style={{ color: 'white' }}>Escanear de nuevo</Text>
          </TouchableOpacity>
        )}

        {/* Hidden button for simulator testing */}
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 50, padding: 20 }}
          onPress={() => handleBarCodeScanned({ data: '7501055310866' })}
        >
          <Text style={{ color: 'white', opacity: 0.5 }}>Simular Escaneo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 200,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  scanLine: {
    height: 2,
    width: '100%',
    backgroundColor: colors.primary,
  },
  instructions: {
    ...typography.body,
    color: colors.background,
    marginTop: spacing.lg,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing.sm,
    borderRadius: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  permissionText: {
    ...typography.body,
    color: colors.text.light,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  webContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  webTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  webSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  hint: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  link: {
    ...typography.body,
    color: colors.primary,
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  }
});

export default ScanScreen; 