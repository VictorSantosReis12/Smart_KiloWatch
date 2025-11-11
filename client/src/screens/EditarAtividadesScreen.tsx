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
import { Button } from "@/components/button";
import { Input } from "@/components/input";
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
import { buscarUsuarioPorEmail, editarLitrosMinutoAtividade, selecionarAtividadePorId, listarConsumoAguaPorAtividade, excluirConsumoAgua } from "@/services/api";

export default function EditarAtividadesScreen({ navigation, route }: any) {
    const { idAtividade } = route.params;

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

    useEffect(() => {
        const fetchUsuario = async () => {
            if (userData?.email) {
                const result = await buscarUsuarioPorEmail(userData.email);
                setUsuario(result);
                notificacao = result.ativar_notificacao;
            }
        };

        fetchUsuario();
    }, [userData?.email]);

    // Modal
    const [modalVisible, setModalVisible] = useState(false);

    const handleCloseModal = () => setModalVisible(false);
    const handleOk = () => setModalVisible(false);

    const [icone, setIcone] = useState('');
    const [nome, setNome] = useState('');
    const [consumo, setConsumo] = useState('');
    const [errorMessages, setErrorMessages] = useState({ consumo: '' });
    const [errors, setErrors] = useState({ consumo: '' });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchAtividade = async () => {
            if (!route?.params?.tipo && idAtividade) {
                const result = await selecionarAtividadePorId(userToken, idAtividade);
                if (result) {
                    setIcone(result.data.imagem);
                    setNome(result.data.nome);
                    setConsumo(result.data.consumo_litro_minuto);
                }
            }
        };

        fetchAtividade();
    }, [idAtividade, userToken]);


    const handleRegister = async () => {
        let hasError = false;
        const newErrors: { consumo: string } = { consumo: '' };

        if (consumo.trim() === '') {
            newErrors.consumo = 'Por favor, preencha o Consumo.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setErrors({ consumo: '' });

        const idUsuario = userData.id_usuario;
        try {
            const editarResponse = await editarLitrosMinutoAtividade(userToken, idAtividade, consumo);

            if (!editarResponse.success) {
                setSnackbarVisible(true);
                setSnackbarMessage(editarResponse.message || 'Erro ao editar atividade.');
                return;
            }

            const hoje = new Date().toISOString().split('T')[0];
            const listaConsumo = await listarConsumoAguaPorAtividade(userToken, idAtividade);

            const registroHoje = listaConsumo.data.find((c: any) => c.data_registro.startsWith(hoje));
            if (registroHoje) {
                await excluirConsumoAgua(userToken, registroHoje.id_consumo_agua);
            }

            navigation.navigate("Atividades");
        } catch (error) {
            console.error('Erro no handleRegister:', error);
        }
    }

    useEffect(() => {
        if (route?.params) {
            const { nome, consumo, icone } = route.params;
            if (nome) setNome(nome);
            if (consumo) setConsumo(consumo);
            if (icone !== undefined) setIcone(icone);
        }
    }, [route?.params]);


    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300], position: "relative" }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Editar Atividade</Text>
                                <Icon name="close-circle" color={colors.white} size={RFValue(23)} onPress={() => navigation.navigate("Atividades")} style={{ position: "absolute", right: 0 }} />
                            </View>
                            <View style={{ marginTop: RFValue(15) }}>
                                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: RFValue(15) }}>
                                    <View style={{ position: "relative", width: "12%", height: RFValue(80), justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity style={{
                                            width: "100%", height: "100%", borderWidth: RFValue(1), borderColor: colors.blue[300], borderRadius: RFValue(10), alignItems: "center", justifyContent: "center", backgroundColor: colors.blue[300], shadowColor: colors.black, shadowOffset: { width: RFValue(0), height: RFValue(3) }, shadowOpacity: 0.2, shadowRadius: RFValue(4.65), elevation: RFValue(2), cursor: 'auto'
                                        }}
                                            activeOpacity={1}>
                                            {icone !== "" ?
                                                <Icon name={icone as any} size={RFValue(45)} color={colors.white} />
                                                :
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8), textAlign: "center" }}>Selecionar Ícone</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ width: RFValue(520), height: RFValue(80), justifyContent: "flex-start", alignItems: "center" }}>
                                        <Input
                                            border={colors.gray}
                                            label="Atividade"
                                            value={nome}
                                            styleLabel={{ color: colors.white, fontSize: RFValue(10) }}
                                            contentStyle={{ fontSize: RFValue(10) }}
                                            outlineColor={'transparent'}
                                            style={[styles.input, { width: RFValue(520), height: RFValue(25), marginBottom: RFValue(15), borderRadius: RFValue(10), cursor: 'auto' }]}
                                            editable={false}
                                        />
                                    </View>
                                </View>
                                <Input
                                    border={!!errors.consumo === true ? colors.red : colors.gray}
                                    label="Consumo por minuto/uso"
                                    value={consumo}
                                    styleLabel={{ color: !!errors.consumo === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.consumo === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v.replace(/[^0-9.]/g, "");

                                        const formatado = apenasNumeros.split(".").length > 2
                                            ? apenasNumeros.replace(/\.+$/, "")
                                            : apenasNumeros;

                                        setConsumo(formatado);

                                        if (errors.consumo) {
                                            setErrors(prev => ({ ...prev, consumo: '' }));
                                        }
                                        if (errorMessages.consumo) {
                                            setErrorMessages(prev => ({ ...prev, consumo: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(610), height: RFValue(25), borderRadius: RFValue(10), marginBottom: RFValue(60) }]}
                                    hasError={!!errors.consumo}
                                    errorText={errors.consumo}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(2) }]}
                                />
                                <Button
                                    children="Confirmar"
                                    contentStyle={{ paddingVertical: RFValue(4), backgroundColor: colors.green }}
                                    labelStyle={{ fontSize: RFValue(10), color: colors.white }}
                                    style={{
                                        width: RFValue(140),
                                        backgroundColor: colors.green,
                                        borderRadius: RFValue(20),
                                        alignSelf: "center",
                                    }}
                                    onPress={() => handleRegister()}
                                />
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Editar Atividade</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(20), gap: RFValue(25) }}>
                                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: RFValue(5) }}>
                                    <View style={{ position: "relative", width: "30%", height: RFValue(120), justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity style={{
                                            width: "100%", height: "100%", borderWidth: RFValue(1), borderColor: colors.blue[300], borderRadius: RFValue(10), alignItems: "center", justifyContent: "center", backgroundColor: colors.blue[300], shadowColor: colors.black, shadowOffset: { width: RFValue(0), height: RFValue(3) }, shadowOpacity: 0.2, shadowRadius: RFValue(4.65), elevation: RFValue(2)
                                        }} activeOpacity={1}>
                                            {icone !== "" ?
                                                <Icon name={icone as any} size={RFValue(60)} color={colors.white} />
                                                :
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(13), textAlign: "center" }}>Selecionar Ícone</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>

                                    <Input
                                        border={colors.gray}
                                        label="Atividade"
                                        value={nome}
                                        styleLabel={{ color: colors.white, fontSize: RFValue(16) }}
                                        contentStyle={{ fontSize: RFValue(16) }}
                                        outlineColor={'transparent'}
                                        style={[styles.input, { width: RFValue(200), height: RFValue(40), borderRadius: RFValue(10), shadowColor: "transparent" }]}
                                        editable={false}
                                    />
                                </View>

                                <Input
                                    border={!!errors.consumo === true ? colors.red : colors.gray}
                                    label="Consumo por minuto/uso"
                                    value={consumo}
                                    styleLabel={{ color: !!errors.consumo === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                    contentStyle={{ fontSize: RFValue(16) }}
                                    outlineColor={!!errors.consumo === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v.replace(/[^0-9.]/g, "");

                                        const formatado = apenasNumeros.split(".").length > 2
                                            ? apenasNumeros.replace(/\.+$/, "")
                                            : apenasNumeros;

                                        setConsumo(formatado);

                                        if (errors.consumo) {
                                            setErrors(prev => ({ ...prev, consumo: '' }));
                                        }
                                        if (errorMessages.consumo) {
                                            setErrorMessages(prev => ({ ...prev, consumo: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(315), height: RFValue(40), borderRadius: RFValue(10), marginBottom: RFValue(60) }]}
                                    hasError={!!errors.consumo}
                                    errorText={errors.consumo}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(-16) }]}
                                />

                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    paddingVertical: RFValue(5),
                                    marginTop: RFValue(100)
                                }}>
                                    <Button
                                        children="Cancelar"
                                        compact
                                        contentStyle={{ paddingVertical: RFValue(6), backgroundColor: colors.blue[500], borderColor: colors.white, borderWidth: RFValue(2), width: RFValue(145), borderRadius: RFValue(20) }}
                                        labelStyle={{ fontSize: RFValue(14), color: colors.white }}
                                        style={{
                                            alignSelf: "center",
                                            borderRadius: RFValue(20)
                                        }}
                                        onPress={() => navigation.navigate('Atividades')}
                                    />

                                    <Button
                                        children="Confirmar"
                                        contentStyle={{ paddingVertical: RFValue(6), backgroundColor: colors.green }}
                                        labelStyle={{ fontSize: RFValue(14), color: colors.white }}
                                        style={{
                                            width: RFValue(145),
                                            backgroundColor: colors.green,
                                            borderRadius: RFValue(20)
                                        }}
                                        onPress={() => handleRegister()}
                                    />
                                </View>
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
    },
    input: {
        width: RFValue(255),
        height: RFValue(57),
        marginBottom: RFValue(37),
        fontFamily: fontFamily.inder
    },
    helperText: {
        color: colors.red,
        position: 'absolute',
        bottom: RFValue(14),
        left: RFValue(0),
        fontSize: RFValue(12),
        fontFamily: fontFamily.inder,
        backgroundColor: 'transparent',
        margin: RFValue(0),
        padding: RFValue(0)
    }
})