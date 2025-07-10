import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import AuthContext from './src/context/AuthContext';
import { AuthProvider } from './src/context/AuthContext';
import AuthStack from './src/screens/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ResidenciasScreen from './src/screens/ResidenciasScreen';
import CadastrarResidenciasScreen from './src/screens/CadastrarResidenciasScreen';

const Stack = createNativeStackNavigator();

// Separar a lógica em um componente dentro do Provider
function AppContent() {
  const { userToken, isLoading } = useContext(AuthContext);

  // Verificar Token
  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = await AsyncStorage.getItem('userToken');
  //     console.log('Token salvo:', token);
  //   };

  //   checkToken();
  // }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          <>
            <Stack.Screen name="Residencias" component={ResidenciasScreen} />
            <Stack.Screen name="CadastrarResidencias" component={CadastrarResidenciasScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Componente principal
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}