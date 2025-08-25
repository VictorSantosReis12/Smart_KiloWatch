// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity } from "react-native";
import { IconButton, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import Sidebar from "../screens/SidebarModal";

// Fontes
import { useFonts } from 'expo-font';
import {
    Inder_400Regular
} from "@expo-google-fonts/inder"
import {
    KronaOne_400Regular
} from "@expo-google-fonts/krona-one"
import { fontFamily } from "@/styles/FontFamily"

// Cores
import { colors } from "@/styles/colors"

// API
import { buscarUsuarioPorEmail, editarNotificacaoUsuario } from "@/services/api";

export default function ConfiguracoesScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const alturaCalculada = height * 0.82;

    const { userData } = useContext(AuthContext);
    const { userToken } = useContext(AuthContext);

    const idUsuario = userData?.id_usuario || '';
    const nomeUsuario = userData?.nome || '';
    const emailUsuario = userData?.email || '';

    type UsuarioType = {
        id_usuario?: number;
        nome?: string;
        email?: string;
        ativar_notificacao?: boolean;
    };

    const [usuario, setUsuario] = useState<UsuarioType | null>(null);
    let notificacao;
    const [checked, setChecked] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            if (userData?.email) {
                const result = await buscarUsuarioPorEmail(userData.email);
                setUsuario(result);
                notificacao = result.ativar_notificacao;
                setChecked(notificacao);
            }
        };

        fetchUsuario();
    }, [userData?.email]);

    async function handleModificarNotificacao() {
        setChecked(!checked);

        const response = await editarNotificacaoUsuario(userToken, idUsuario, !checked);
        if (!response) {
            return;
        }
    }

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[400]} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Configurações</Text>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Configurações</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30), gap: RFValue(25) }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: colors.blue[400], width: "100%", height: RFValue(60), justifyContent: "flex-start", alignItems: "center", borderRadius: RFValue(10), flexDirection: "row", gap: RFValue(10), paddingHorizontal: RFValue(10) }}
                                    onPress={() => handleModificarNotificacao()}
                                    activeOpacity={1}
                                >
                                    {checked ? (
                                        <Ionicons name="checkbox" size={30} color={colors.white} />
                                    ) : (
                                        <Ionicons name="square-outline" size={30} color={colors.white} />
                                    )}
                                    <Text style={{ fontFamily: fontFamily.inder, color: colors.white, fontSize: RFValue(16) }}>Receber notificações</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: colors.blue[400], width: "100%", height: RFValue(60), justifyContent: "flex-start", alignItems: "center", borderRadius: RFValue(10), flexDirection: "row", gap: RFValue(10), paddingHorizontal: RFValue(10) }}
                                    onPress={() => navigation.navigate("ResidenciasConfig")}
                                >
                                    <Icon name="home-outline" size={RFValue(35)} color={colors.white} />
                                    <Text style={{ fontFamily: fontFamily.inder, color: colors.white, fontSize: RFValue(16) }}>Suas Residências</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: colors.blue[400], width: "100%", height: RFValue(60), justifyContent: "flex-start", alignItems: "center", borderRadius: RFValue(10), flexDirection: "row", gap: RFValue(10), paddingHorizontal: RFValue(10) }}
                                    onPress={() => navigation.navigate("Suporte")}
                                >
                                    <Icon name="help-circle-outline" size={RFValue(35)} color={colors.white} />
                                    <Text style={{ fontFamily: fontFamily.inder, color: colors.white, fontSize: RFValue(16) }}>Suporte ao Cliente</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    <Sidebar navigation={navigation} />

                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.blue[500],
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative"
    }
})