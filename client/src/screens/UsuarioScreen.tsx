// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity } from "react-native";
import { IconButton, ActivityIndicator, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import Sidebar from "../screens/SidebarModal";
import ConfirmarModal from "../screens/ConfirmarModal";

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
import { buscarUsuarioPorEmail, excluirUsuario } from "@/services/api";

export default function UsuarioScreen({ navigation }: any) {
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

    const { signOut } = useContext(AuthContext);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Modal
    const [textModal, setTextModal] = useState('');
    const [buttonCancelar, setButtonCancelar] = useState('');
    const [buttonConfirmar, setButtonConfirmar] = useState('');
    const [handleConfirmar, setHandleConfirmar] = useState(() => () => { });
    const [modalVisible, setModalVisible] = useState(false);
    const handleOpenModalSair = () => {
        setModalVisible(true);
        setTextModal('Tem certeza que deseja sair da conta?');
        setButtonCancelar('Cancelar');
        setButtonConfirmar('Sair');
        setHandleConfirmar(() => () => {
            signOut();
        });
    };

    const handleOpenModalExcluir = () => {
        setModalVisible(true);
        setTextModal('Tem certeza que deseja excluir esta conta?');
        setButtonCancelar('Cancelar');
        setButtonConfirmar('Excluir');
        setHandleConfirmar(() => async () => {
            const excluirResponse = await excluirUsuario(userToken, idUsuario);
            if (!excluirResponse.success) {
                setSnackbarMessage(excluirResponse.message || 'Erro ao excluir residência.');
                return;
            }
            signOut();
        });
    };

    const handleCloseModal = () => setModalVisible(false);

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[400]} />

                    <Sidebar navigation={navigation} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Usuário</Text>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Usuário</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30), gap: RFValue(25) }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: colors.blue[400], width: "100%", height: RFValue(60), justifyContent: "flex-start", alignItems: "center", borderRadius: RFValue(10), flexDirection: "row", gap: RFValue(10), paddingHorizontal: RFValue(10) }}
                                    onPress={() => navigation.navigate("EditarUsuario")}
                                >
                                    <Icon name="account-edit" size={RFValue(35)} color={colors.white} />
                                    <Text style={{ fontFamily: fontFamily.inder, color: colors.white, fontSize: RFValue(16) }}>Editar usuário</Text>
                                </TouchableOpacity>
                                <View style={{ gap: RFValue(5) }}>
                                    <TouchableOpacity
                                        style={{ backgroundColor: colors.blue[400], width: "100%", height: RFValue(60), justifyContent: "flex-start", alignItems: "center", borderTopLeftRadius: RFValue(10), borderTopRightRadius: RFValue(10), flexDirection: "row", gap: RFValue(10), paddingHorizontal: RFValue(10) }}
                                        onPress={() => handleOpenModalSair()}
                                    >
                                        <Icon name="exit-run" size={RFValue(35)} color={colors.white} />
                                        <Text style={{ fontFamily: fontFamily.inder, color: colors.white, fontSize: RFValue(16) }}>Sair da conta</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ backgroundColor: colors.blue[400], width: "100%", height: RFValue(60), justifyContent: "flex-start", alignItems: "center", borderBottomLeftRadius: RFValue(10), borderBottomRightRadius: RFValue(10), flexDirection: "row", gap: RFValue(10), paddingHorizontal: RFValue(10) }}
                                        onPress={() => handleOpenModalExcluir()}
                                    >
                                        <Icon name="delete-forever" size={RFValue(35)} color={colors.white} />
                                        <Text style={{ fontFamily: fontFamily.inder, color: colors.white, fontSize: RFValue(16) }}>Excluir conta</Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{ alignItems: "center", justifyContent: "flex-start", gap: RFValue(10), paddingVertical: RFValue(10), paddingHorizontal: RFValue(10), backgroundColor: colors.blue[400], width: "100%", borderRadius: RFValue(10) }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(8), width: "100%" }}>
                                        <Icon name="account-outline" size={RFValue(30)} color={colors.white} />
                                        <Text style={{ fontSize: RFValue(14), color: colors.white, fontFamily: fontFamily.inder }}>Nome: {nomeUsuario}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(8), width: "100%" }}>
                                        <Icon name="email" size={RFValue(30)} color={colors.white} />
                                        <Text style={{ fontSize: RFValue(14), color: colors.white, fontFamily: fontFamily.inder }}>Email: {emailUsuario}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(8), width: "100%" }}>
                                        <Icon name="bell-outline" size={RFValue(30)} color={colors.white} />
                                        <Text style={{
                                            fontSize: RFValue(14),
                                            color: colors.white,
                                            fontFamily: fontFamily.inder,
                                        }}>
                                            Notificações{" "}
                                            <Text style={{
                                                color: checked ? colors.green : colors.red
                                            }}>
                                                {checked ? "ativadas" : "desativadas"}
                                            </Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }
                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        duration={5000}
                        action={{
                            label: 'OK',
                            onPress: () => setSnackbarVisible(false),
                            textColor: colors.blue[200],
                        }}
                        style={{
                            alignSelf: 'center',
                            width: isLandscape ? '50%' : '90%',
                            borderRadius: 6,
                            backgroundColor: colors.strongGray,
                            marginBottom: isLandscape ? RFValue(0) : RFValue(85),
                            zIndex: 5000,
                        }}

                    >
                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder }}>{snackbarMessage}</Text>
                    </Snackbar>
                </View>
                <ConfirmarModal
                    visible={modalVisible}
                    onDismiss={handleCloseModal}
                    changeText={textModal}
                    changeButtonCancelar={buttonCancelar}
                    changeButtonConfirmar={buttonConfirmar}
                    handleConfirmar={handleConfirmar}
                />
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