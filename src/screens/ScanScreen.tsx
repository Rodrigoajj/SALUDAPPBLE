import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { NavigationProp } from '@react-navigation/native';
import { colors } from '../styles/theme';

type RootStackParamList = {
  ProductDetails: { barcode: string };
};

interface ScanScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    navigation.navigate('ProductDetails', { barcode: data });
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sin acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.scanAgainContainer}>
          <Text 
            style={styles.scanAgainText}
            onPress={() => setScanned(false)}
          >
            Toca para escanear de nuevo
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanAgainContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanAgainText: {
    backgroundColor: colors.primary,
    color: 'white',
    padding: 15,
    borderRadius: 8,
  },
});

export default ScanScreen; 