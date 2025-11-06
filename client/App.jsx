import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import AuthContext from './src/context/AuthContext';
import { AuthProvider } from './src/context/AuthContext';
import AuthStack from './src/screens/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ResidenciasScreen from './src/screens/ResidenciasScreen';
import CadastrarResidenciasScreen from './src/screens/CadastrarResidenciasScreen';
import EditarResidenciasScreen from './src/screens/EditarResidenciasScreen';
import HomeScreen from './src/screens/HomeScreen';
import EditarUsuarioScreen from './src/screens/EditarUsuarioScreen';
import EletrodomesticosScreen from './src/screens/EletrodomesticosScreen';
import CadastrarEletrodomesticosScreen from './src/screens/CadastrarEletrodomesticosScreen';
import EditarEletrodomesticosScreen from './src/screens/EditarEletrodomesticosScreen';
import AtividadesScreen from './src/screens/AtividadesScreen';
import CadastrarAtividadesScreen from './src/screens/CadastrarAtividadesScreen';
import GraficosScreen from './src/screens/GraficosScreen';
import MetasScreen from './src/screens/MetasScreen';
import NotificacoesScreen from './src/screens/NotificacoesScreen';
import SuporteScreen from './src/screens/SuporteScreen';
import ResidenciasConfigScreen from './src/screens/ResidenciasConfigScreen';
import EstimativaCustosScreen from './src/screens/EstimativaCustosScreen';
import CadastrarResidenciasConfigScreen from './src/screens/CadastrarResidenciasConfigScreen';
import EditarResidenciasConfigScreen from './src/screens/EditarResidenciasConfigScreen';
import EditarAtividadesScreen from './src/screens/EditarAtividadesScreen';
import ConfiguracoesScreen from './src/screens/ConfiguracoesScreen';
import UsuarioScreen from './src/screens/UsuarioScreen';
import ListasScreen from './src/screens/ListasScreen';
import SelecionarIconeScreen from './src/screens/SelecionarIconeScreen';

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
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
        {userToken ? (
          <>
            <Stack.Screen name="Residencias" component={ResidenciasScreen} />
            <Stack.Screen name="CadastrarResidencias" component={CadastrarResidenciasScreen} />
            <Stack.Screen name="EditarResidencias" component={EditarResidenciasScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="EditarUsuario" component={EditarUsuarioScreen} />
            <Stack.Screen name="Eletrodomesticos" component={EletrodomesticosScreen} />
            <Stack.Screen name="CadastrarEletrodomesticos" component={CadastrarEletrodomesticosScreen} />
            <Stack.Screen name="EditarEletrodomesticos" component={EditarEletrodomesticosScreen} />
            <Stack.Screen name="Atividades" component={AtividadesScreen} />
            <Stack.Screen name="CadastrarAtividades" component={CadastrarAtividadesScreen} />
            <Stack.Screen name="Graficos" component={GraficosScreen} />
            <Stack.Screen name="Metas" component={MetasScreen} />
            <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />
            <Stack.Screen name="Suporte" component={SuporteScreen} />
            <Stack.Screen name="ResidenciasConfig" component={ResidenciasConfigScreen} />
            <Stack.Screen name="EstimativaCustos" component={EstimativaCustosScreen} />
            <Stack.Screen name="CadastrarResidenciasConfig" component={CadastrarResidenciasConfigScreen} />
            <Stack.Screen name="EditarResidenciasConfig" component={EditarResidenciasConfigScreen} />
            <Stack.Screen name="EditarAtividades" component={EditarAtividadesScreen} />
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
            <Stack.Screen name="Usuario" component={UsuarioScreen} />
            <Stack.Screen name="Listas" component={ListasScreen} />
            <Stack.Screen name="SelecionarIcone" component={SelecionarIconeScreen} />
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
    <PaperProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  );
}