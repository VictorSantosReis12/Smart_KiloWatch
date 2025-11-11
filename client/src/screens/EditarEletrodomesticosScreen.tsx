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
import InfoModal from "../screens/InfoModal";

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
import { buscarUsuarioPorEmail, editarEletrodomestico, selecionarEletrodomesticoPorId, listarConsumoEnergiaPorEletrodomestico, excluirConsumoEnergia } from "@/services/api";

export default function EditarEletrodomesticosScreen({ navigation, route }: any) {
    const { idEletrodomestico } = route.params;

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
    const [tipo, setTipo] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [consumo, setConsumo] = useState('');
    const [manterTempo, setManterTempo] = useState(false);
    const [errorMessages, setErrorMessages] = useState({ icone: '', tipo: '', marca: '', modelo: '', consumo: '' });
    const [errors, setErrors] = useState({ icone: '', tipo: '', marca: '', modelo: '', consumo: '' });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [consumoOriginal, setConsumoOriginal] = useState('');

    useEffect(() => {
        const fetchEletrodomestico = async () => {
            if (!route?.params?.tipo && idEletrodomestico) {
                const result = await selecionarEletrodomesticoPorId(userToken, idEletrodomestico);
                if (result) {
                    setIcone(result.data.imagem);
                    setTipo(result.data.tipo);
                    setMarca(result.data.marca);
                    setModelo(result.data.modelo);
                    setConsumo(result.data.consumo_kwh_mes);
                    setConsumo(result.data.consumo_kwh_mes);
                    setManterTempo(result.data.manter_tempo);
                    setConsumoOriginal(result.data.consumo_kwh_mes);
                }
            }
        };

        fetchEletrodomestico();
    }, [idEletrodomestico, userToken]);


    const handleRegister = async () => {
        let hasError = false;
        const newErrors: { icone: string; tipo: string; marca: string; modelo: string; consumo: string } = { icone: '', tipo: '', marca: '', modelo: '', consumo: '' };

        if (tipo.trim() === '') {
            newErrors.tipo = 'Por favor, preencha o Tipo.';
            hasError = true;
        }

        if (marca.trim() === '') {
            newErrors.marca = 'Por favor, preencha a Marca.';
            hasError = true;
        }

        if (modelo.trim() === '') {
            newErrors.modelo = 'Por favor, preencha o Modelo.';
            hasError = true;
        }

        if (consumo.trim() === '') {
            newErrors.consumo = 'Por favor, preencha o Consumo.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setErrors({ icone: '', tipo: '', marca: '', modelo: '', consumo: '' });

        const valorConsumoHora = Number(consumo) / 30;
        const consumoHoraFormatado = valorConsumoHora.toFixed(3);

        const idUsuario = userData.id_usuario;
        try {
            const editarResponse = await editarEletrodomestico(userToken, idEletrodomestico, idUsuario, tipo, marca, modelo, icone, consumo, consumoHoraFormatado, manterTempo);

            if (!editarResponse.success) {
                setSnackbarVisible(true);
                setSnackbarMessage(editarResponse.message || 'Erro ao editar eletrodoméstico.');
                return;
            }

            const hoje = new Date().toISOString().split('T')[0];

            if (String(consumo) !== String(consumoOriginal)) {
                const listaConsumo = await listarConsumoEnergiaPorEletrodomestico(userToken, idEletrodomestico);

                const registroHoje = listaConsumo.data.find((c: any) => c.data_registro.startsWith(hoje));
                if (registroHoje) {
                    await excluirConsumoEnergia(userToken, registroHoje.id_consumo_energia);
                }
            }

            navigation.navigate("Eletrodomesticos");
        } catch (error) {
            console.error('Erro no handleRegister:', error);
        }
    }

    useEffect(() => {
        if (route?.params) {
            const { tipo, marca, modelo, consumo, icone } = route.params;
            if (tipo) setTipo(tipo);
            if (marca) setMarca(marca);
            if (modelo) setModelo(modelo);
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
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Editar Eletrodoméstico</Text>
                                <Icon name="close-circle" color={colors.white} size={RFValue(23)} onPress={() => navigation.navigate("Eletrodomesticos")} style={{ position: "absolute", right: 0 }} />
                            </View>
                            <View style={{ marginTop: RFValue(15) }}>
                                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: RFValue(15) }}>
                                    <View style={{ position: "relative", width: "12%", height: RFValue(80), justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity style={{
                                            width: "100%", height: "100%", borderWidth: RFValue(1), borderColor: !!errors.icone === true ? colors.red : colors.blue[300], borderRadius: RFValue(10), alignItems: "center", justifyContent: "center", backgroundColor: colors.blue[300], shadowColor: colors.black, shadowOffset: { width: RFValue(0), height: RFValue(3) }, shadowOpacity: 0.2, shadowRadius: RFValue(4.65), elevation: RFValue(2)
                                        }} onPress={() => {
                                            navigation.navigate("SelecionarIcone", {
                                                icone,
                                                idEletrodomestico,
                                                tipo,
                                                marca,
                                                modelo,
                                                consumo,
                                                origem: "editar"
                                            });
                                        }} activeOpacity={1}>
                                            {icone !== "" ?
                                                <Icon name={icone as any} size={RFValue(45)} color={colors.white} />
                                                :
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8), textAlign: "center" }}>Selecionar Ícone</Text>
                                            }
                                        </TouchableOpacity>

                                        {icone !== "" && (
                                            <TouchableOpacity
                                                style={{
                                                    position: "absolute",
                                                    top: RFValue(-8),
                                                    right: RFValue(-8),
                                                    backgroundColor: colors.red,
                                                    borderRadius: RFValue(12),
                                                    padding: RFValue(4),
                                                }}
                                                onPress={() => setIcone("")}
                                            >
                                                <Icon name="close" size={RFValue(15)} color={colors.white} />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <View style={{ width: RFValue(520), height: RFValue(80), justifyContent: "flex-start", alignItems: "center" }}>
                                        <Input
                                            border={!!errors.tipo === true ? colors.red : colors.gray}
                                            label="Tipo"
                                            value={tipo}
                                            styleLabel={{ color: !!errors.tipo === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                            contentStyle={{ fontSize: RFValue(10) }}
                                            outlineColor={!!errors.tipo === true ? colors.red : 'transparent'}
                                            onChangeText={v => {
                                                setTipo(v);
                                                if (errors.tipo) {
                                                    setErrors(prev => ({ ...prev, tipo: '' }));
                                                }
                                                if (errorMessages.tipo) {
                                                    setErrorMessages(prev => ({ ...prev, tipo: '' }));
                                                }
                                            }}
                                            style={[styles.input, { width: RFValue(520), height: RFValue(25), marginBottom: RFValue(15), borderRadius: RFValue(10) }]}
                                            hasError={!!errors.tipo}
                                            errorText={errors.tipo}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(2) }]}
                                        />

                                        <Input
                                            border={!!errors.marca === true ? colors.red : colors.gray}
                                            label="Marca"
                                            value={marca}
                                            styleLabel={{ color: !!errors.marca === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                            contentStyle={{ fontSize: RFValue(10) }}
                                            outlineColor={!!errors.marca === true ? colors.red : 'transparent'}
                                            onChangeText={v => {
                                                setMarca(v);
                                                if (errors.marca) {
                                                    setErrors(prev => ({ ...prev, marca: '' }));
                                                }
                                                if (errorMessages.marca) {
                                                    setErrorMessages(prev => ({ ...prev, marca: '' }));
                                                }
                                            }}
                                            style={[styles.input, { width: RFValue(520), height: RFValue(25), marginBottom: RFValue(15), borderRadius: RFValue(10) }]}
                                            hasError={!!errors.marca}
                                            errorText={errors.marca}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(2) }]}
                                        />
                                    </View>
                                </View>

                                <Input
                                    border={!!errors.modelo === true ? colors.red : colors.gray}
                                    label="Modelo"
                                    value={modelo}
                                    styleLabel={{ color: !!errors.modelo === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.modelo === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        setModelo(v);
                                        if (errors.modelo) {
                                            setErrors(prev => ({ ...prev, modelo: '' }));
                                        }
                                        if (errorMessages.modelo) {
                                            setErrorMessages(prev => ({ ...prev, modelo: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(610), height: RFValue(25), marginBottom: RFValue(15), borderRadius: RFValue(10) }]}
                                    hasError={!!errors.modelo}
                                    errorText={errors.modelo}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(2) }]}
                                />
                                <View style={{ width: RFValue(610), height: RFValue(45), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Input
                                        border={!!errors.consumo === true ? colors.red : colors.gray}
                                        label="Consumo kWh/mês"
                                        value={consumo}
                                        styleLabel={{ color: !!errors.consumo === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                        contentStyle={{ fontSize: RFValue(10) }}
                                        outlineColor={!!errors.consumo === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setConsumo(v);
                                            if (errors.consumo) {
                                                setErrors(prev => ({ ...prev, consumo: '' }));
                                            }
                                            if (errorMessages.consumo) {
                                                setErrorMessages(prev => ({ ...prev, consumo: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(575), height: RFValue(25), borderRadius: RFValue(10), marginBottom: RFValue(15) }]}
                                        hasError={!!errors.consumo}
                                        errorText={errors.consumo}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(2) }]}
                                    />

                                    <Icon name="information" size={RFValue(23)} color={colors.white} onPress={() => { setModalVisible(true) }} style={{ marginBottom: RFValue(11) }} />
                                </View>
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
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Editar Eletrodoméstico</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30), gap: RFValue(25) }}>
                                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: RFValue(5) }}>
                                    <View style={{ position: "relative", width: "30%", height: RFValue(120), justifyContent: "center", alignItems: "center" }}>
                                        <TouchableOpacity style={{
                                            width: "100%", height: "100%", borderWidth: RFValue(1), borderColor: !!errors.icone === true ? colors.red : colors.blue[300], borderRadius: RFValue(10), alignItems: "center", justifyContent: "center", backgroundColor: colors.blue[300], shadowColor: colors.black, shadowOffset: { width: RFValue(0), height: RFValue(3) }, shadowOpacity: 0.2, shadowRadius: RFValue(4.65), elevation: RFValue(2)
                                        }} onPress={() => {
                                            navigation.navigate("SelecionarIcone", {
                                                icone,
                                                idEletrodomestico,
                                                tipo,
                                                marca,
                                                modelo,
                                                consumo,
                                                origem: "editar"
                                            });
                                        }} activeOpacity={1}>
                                            {icone !== "" ?
                                                <Icon name={icone as any} size={RFValue(60)} color={colors.white} />
                                                :
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(13), textAlign: "center" }}>Selecionar Ícone</Text>
                                            }
                                        </TouchableOpacity>

                                        {icone !== "" && (
                                            <TouchableOpacity
                                                style={{
                                                    position: "absolute",
                                                    top: RFValue(-8),
                                                    right: RFValue(-12),
                                                    backgroundColor: colors.red,
                                                    borderRadius: RFValue(12),
                                                    padding: RFValue(4),
                                                }}
                                                onPress={() => setIcone("")}
                                            >
                                                <Icon name="close" size={RFValue(20)} color={colors.white} />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <Input
                                        border={!!errors.tipo === true ? colors.red : colors.gray}
                                        label="Tipo"
                                        value={tipo}
                                        styleLabel={{ color: !!errors.tipo === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                        contentStyle={{ fontSize: RFValue(16) }}
                                        outlineColor={!!errors.tipo === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setTipo(v);
                                            if (errors.tipo) {
                                                setErrors(prev => ({ ...prev, tipo: '' }));
                                            }
                                            if (errorMessages.tipo) {
                                                setErrorMessages(prev => ({ ...prev, tipo: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(200), height: RFValue(40), borderRadius: RFValue(10), shadowColor: "transparent" }]}
                                        hasError={!!errors.tipo}
                                        errorText={errors.tipo}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(14) }]}
                                    />
                                </View>

                                <Input
                                    border={!!errors.marca === true ? colors.red : colors.gray}
                                    label="Marca"
                                    value={marca}
                                    styleLabel={{ color: !!errors.marca === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                    contentStyle={{ fontSize: RFValue(16) }}
                                    outlineColor={!!errors.marca === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        setMarca(v);
                                        if (errors.marca) {
                                            setErrors(prev => ({ ...prev, marca: '' }));
                                        }
                                        if (errorMessages.marca) {
                                            setErrorMessages(prev => ({ ...prev, marca: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(315), height: RFValue(40), marginBottom: RFValue(5), borderRadius: RFValue(10), shadowColor: "transparent" }]}
                                    hasError={!!errors.marca}
                                    errorText={errors.marca}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(-16) }]}
                                />

                                <Input
                                    border={!!errors.modelo === true ? colors.red : colors.gray}
                                    label="Modelo"
                                    value={modelo}
                                    styleLabel={{ color: !!errors.modelo === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                    contentStyle={{ fontSize: RFValue(16) }}
                                    outlineColor={!!errors.modelo === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        setModelo(v);
                                        if (errors.modelo) {
                                            setErrors(prev => ({ ...prev, modelo: '' }));
                                        }
                                        if (errorMessages.modelo) {
                                            setErrorMessages(prev => ({ ...prev, modelo: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(315), height: RFValue(40), marginBottom: RFValue(15), borderRadius: RFValue(10), shadowColor: "transparent" }]}
                                    hasError={!!errors.modelo}
                                    errorText={errors.modelo}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(-10) }]}
                                />
                                <View style={{ width: RFValue(315), height: RFValue(40), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Input
                                        border={!!errors.consumo === true ? colors.red : colors.gray}
                                        label="Consumo kWh/mês"
                                        value={consumo}
                                        styleLabel={{ color: !!errors.consumo === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                        contentStyle={{ fontSize: RFValue(16) }}
                                        outlineColor={!!errors.consumo === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setConsumo(v);
                                            if (errors.consumo) {
                                                setErrors(prev => ({ ...prev, consumo: '' }));
                                            }
                                            if (errorMessages.consumo) {
                                                setErrorMessages(prev => ({ ...prev, consumo: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(270), height: RFValue(40), borderRadius: RFValue(10), marginBottom: RFValue(5), shadowColor: "transparent" }]}
                                        hasError={!!errors.consumo}
                                        errorText={errors.consumo}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(-16) }]}
                                    />

                                    <Icon name="information" size={RFValue(35)} color={colors.white} onPress={() => { setModalVisible(true) }} />
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    paddingVertical: RFValue(5),
                                    marginTop: RFValue(15)
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
                                        onPress={() => navigation.navigate('Eletrodomesticos')}
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

                    <InfoModal
                        visible={modalVisible}
                        onDismiss={handleCloseModal}
                        handleOk={handleOk}
                    />

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