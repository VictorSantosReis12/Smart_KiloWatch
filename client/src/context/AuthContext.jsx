// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para persistir o token
import { jwtDecode } from 'jwt-decode';

// Instalar AsyncStorage:
// npx expo install @react-native-async-storage/async-storage

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Para carregar o token ao iniciar
    const [userData, setUserData] = useState(null);

    // Função para salvar o token e o usuário (se necessário)
    const signIn = async (token, userData, persistir) => {
        if (persistir) {
            try {
                await AsyncStorage.setItem('userToken', token);
            } catch (e) {
                console.error('Erro ao salvar token:', e);
            }
        }
        setUserToken(token);

        try {
            const decoded = jwtDecode(token);
            setUserData(decoded);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
        }
    };

    // Função para remover o token ao fazer logout
    const signOut = async () => {
        try {
            console.log('AuthContext: Iniciando signOut(). Tentando remover userToken.');
            await AsyncStorage.removeItem('userToken');
            setUserToken(null);
            setUserData(null);
            console.log('AuthContext: userToken definido para null e AsyncStorage limpo.');
        } catch (e) {
            console.error('AuthContext: Erro ao remover token do AsyncStorage:', e);
        }
    };
    // Carregar o token ao iniciar o aplicativo
    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    setUserToken(token);
                    const decoded = jwtDecode(token);
                    setUserData(decoded);
                }
            } catch (e) {
                console.error('Erro ao carregar token do AsyncStorage', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userToken, userData, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;