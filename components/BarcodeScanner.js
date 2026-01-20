import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const BarcodeScanner = ({ onScan }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScanning(false);
    onScan(data);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sin acceso a la cámara</Text>;
  }

  return (
    <View style={{ height: isScanning ? 300 : 'auto' }}>
      {isScanning ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={{ height: 300 }}
        />
      ) : null}
      <Button
        mode="outlined"
        onPress={() => setIsScanning(!isScanning)}
        icon={({ size, color }) => (
          <MaterialCommunityIcons 
            name="camera" 
            size={size} 
            color={color} 
          />
        )}
      >
        {isScanning ? 'Detener Escaneo' : 'Escanear Código'}
      </Button>
    </View>
  );
}; 