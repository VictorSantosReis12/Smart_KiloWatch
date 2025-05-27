import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaInicialScreen from './src/screens/TelaInicialScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import CadastroSenhaScreen from './src/screens/CadastroSenhaScreen';
import ResidenciasScreen from './src/screens/ResidenciasScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TelaInicial"
        screenOptions={{ headerShown: false,
          animation: 'fade_from_bottom'
        }}
      >
        <Stack.Screen name="TelaInicial" component={TelaInicialScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="CadastroSenha" component={CadastroSenhaScreen} />
        <Stack.Screen name="Residencias" component={ResidenciasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}