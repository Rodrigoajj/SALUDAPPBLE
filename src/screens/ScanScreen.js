import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const scanAnimation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isScanning]);

  const handleBarCodeScanned = ({ data }) => {
    setIsScanning(false);
    navigation.navigate('ProductDetails', { barcode: data });
  };

  return (
    <View style={styles.container}>
      {hasPermission ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={isScanning ? handleBarCodeScanned : undefined}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{
                      translateY: scanAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 200],
                      }),
                    }],
                  },
                ]}
              />
            </View>
            <Text style={styles.instructions}>
              Centra el código de barras en el área
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.permissionContainer}>
          <Feather name="camera-off" size={48} color={colors.text.light} />
          <Text style={styles.permissionText}>
            Necesitamos acceso a la cámara para escanear productos
          </Text>
        </View>
      )}
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
  },
});

export default ScanScreen; 