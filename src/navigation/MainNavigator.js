import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import ScanScreen from '../screens/ScanScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import IngredientDetailsScreen from '../screens/IngredientDetailsScreen';
import { colors } from '../styles/theme';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Buscar"
      detachInactiveScreens={false} // CRITICAL FIX for iOS New Arch crash
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.text.primary,
          fontSize: 18,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
      }}
    >
      <Tab.Screen
        name="Buscar"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Escanear"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="camera" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Historial"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="clock" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' }, // Ensure it takes 0 space
          title: 'Detalles',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
          title: 'Ajustes',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Tab.Screen
        name="IngredientDetails"
        component={IngredientDetailsScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
          title: 'Ingrediente',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;