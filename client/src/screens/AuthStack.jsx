// src/screens/AuthStack.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaInicialScreen from './TelaInicialScreen';
import LoginScreen from './LoginScreen';
import CadastroScreen from './CadastroScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TelaInicial" component={TelaInicialScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;