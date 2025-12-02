// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity, FlatList, Touchable } from "react-native";
import { IconButton, ActivityIndicator, Snackbar, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import EletrodomesticoModal from "../screens/EletrodomesticoModal";
import ConfirmarModal from "../screens/ConfirmarModal";
import InputModal from "../screens/InputModal";
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
import { buscarUsuarioPorEmail, listarEletrodomesticosPorUsuario, listarConsumoEnergiaPorEletrodomestico, excluirEletrodomestico, cadastrarConsumoEnergia, editarTempoConsumoEnergia, editarManterTempoEletrodomestico, selecionarEletrodomesticoPorId, excluirConsumoEnergia, editarTipoConsumoEnergia } from "@/services/api";

export default function EletrodomesticosScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    const [tempo, setTempo] = useState('');
    const [errorMessages, setErrorMessages] = useState({ tempo: '' });
    const [errors, setErrors] = useState({ tempo: '' });
    const [checked, setChecked] = useState(false);

    const [unidadeTempo, setUnidadeTempo] = useState<'hora' | 'min'>('hora');
    const alternarUnidadeTempo = () => {
        setUnidadeTempo(prev => prev === 'hora' ? 'min' : 'hora');
    };

    const [listHeight, setListHeight] = useState(0);
    const [scrollBarVisible, setScrollBarVisible] = useState(false);

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const alturaCalculada = height * 0.82;

    const { userData } = useContext(AuthContext);
    const { userToken } = useContext(AuthContext);

    const [eletrodomesticoSelecionado, setEletrodomesticoSelecionado] = useState(0);
    const [tipoEletrodomestico, setTipoEletrodomestico] = useState('');

    const campos = ["Tipo", "Marca", "Modelo", "Consumo", "Tempo"];

    const [campoIndex, setCampoIndex] = useState(0);
    const campo = campos[campoIndex];

    const alternarCampo = () => {
        setCampoIndex((prevIndex) => (prevIndex + 1) % campos.length);
    };

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Modal
    const [modalEletrodomesticoVisible, setModalEletrodomesticoVisible] = useState(false);

    const [textConfirmarModal, setTextConfirmarModal] = useState('');
    const [buttonConfirmarCancelar, setButtonConfirmarCancelar] = useState('');
    const [buttonConfirmarConfirmar, setButtonConfirmarConfirmar] = useState('');
    const [handleConfirmarConfirmar, setHandleConfirmarConfirmar] = useState(() => () => { });
    const [modalConfirmarVisible, setModalConfirmarVisible] = useState(false);
    const handleOpenModalExcluir = () => {
        setModalConfirmarVisible(true);
        setModalEletrodomesticoVisible(false);
        setTextConfirmarModal('Tem certeza que deseja excluir este eletrodoméstico?');
        setButtonConfirmarCancelar('Cancelar');
        setButtonConfirmarConfirmar('Excluir');
        setHandleConfirmarConfirmar(() => async () => {
            try {
                const excluirResponse = await excluirEletrodomestico(userToken, eletrodomesticoSelecionado);
                if (!excluirResponse.success) {
                    setSnackbarVisible(true);
                    setSnackbarMessage(excluirResponse.message || 'Erro ao excluir eletrodoméstico.');
                    return;
                }
                setListaOrdenada(prev => prev.filter(eletro => eletro.id !== eletrodomesticoSelecionado));

                setEletrodomesticoSelecionado(0);

                setModalConfirmarVisible(false);

                setSnackbarVisible(true);
                setSnackbarMessage('Eletrodoméstico excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir eletrodoméstico:', error);
            }
        });
    };
    const handleCloseConfirmarModal = () => {
        setModalConfirmarVisible(false)
        setModalEletrodomesticoVisible(true)
    };

    const [textInputModal, setTextInputModal] = useState('');
    const [buttonInputCancelar, setButtonInputCancelar] = useState('');
    const [buttonInputConfirmar, setButtonInputConfirmar] = useState('');
    const [modalInputVisible, setModalInputVisible] = useState(false);
    async function salvarTempoDoDia(idEletrodomestico: number, tempo: number, manterTempo: boolean) {
        if (!userToken) return;

        const hoje = new Date().toISOString().split('T')[0];

        try {
            const consumos = await listarConsumoEnergiaPorEletrodomestico(userToken, idEletrodomestico);
            const registroHoje = consumos.data?.find((c: any) => c.data_registro.startsWith(hoje));

            if (registroHoje) {
                if (tempo === 0) {
                    await excluirConsumoEnergia(userToken, registroHoje.id_consumo_energia);
                } else {
                    await editarTempoConsumoEnergia(userToken, registroHoje.id_consumo_energia, tempo);
                    await editarTipoConsumoEnergia(userToken, registroHoje.id_consumo_energia, unidadeTempo);
                }
            } else {
                if (tempo > 0) {
                    await cadastrarConsumoEnergia(userToken, idEletrodomestico, tempo, unidadeTempo);
                }
            }

            const eletro = await selecionarEletrodomesticoPorId(userToken, idEletrodomestico);
            if (eletro.data.manter_tempo !== manterTempo) {
                await editarManterTempoEletrodomestico(userToken, idEletrodomestico, manterTempo);
            }

            atualizarLista();

            setSnackbarVisible(true);
            setSnackbarMessage('Tempo atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar tempo:', error);
            setSnackbarVisible(true);
            setSnackbarMessage('Erro ao salvar o tempo.');
        }
    }

    const handleOpenModalTempo = async () => {
        try {
            if (!userToken || !eletrodomesticoSelecionado) return;

            const hoje = new Date().toISOString().split('T')[0];
            const consumos = await listarConsumoEnergiaPorEletrodomestico(userToken, eletrodomesticoSelecionado);
            const registroHoje = consumos.data?.find((c: any) => c.data_registro.startsWith(hoje));

            if (registroHoje) {
                if (registroHoje.tipo === "hora") {
                    setTempo((registroHoje.tempo / 60).toString());
                } else {
                    setTempo(registroHoje.tempo.toString());
                }
                setUnidadeTempo(registroHoje.tipo);
            } else {
                setTempo('');
                setUnidadeTempo('hora');
            }

            const eletro = await selecionarEletrodomesticoPorId(userToken, eletrodomesticoSelecionado);
            if (eletro.success && eletro.data) {
                setChecked(eletro.data.manter_tempo);
            }

            setModalInputVisible(true);
            setModalEletrodomesticoVisible(false);
            setTextInputModal(`Tempo de consumo do ${tipoEletrodomestico} hoje`);
            setButtonInputCancelar('Cancelar');
            setButtonInputConfirmar('Salvar');
        } catch (error) {
            console.error("Erro ao abrir modal de tempo:", error);
            setSnackbarVisible(true);
            setSnackbarMessage("Erro ao carregar dados do eletrodoméstico.");
        }
    };
    const handleCloseInputModal = () => {
        setModalInputVisible(false)
        setModalEletrodomesticoVisible(true)
    };

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

    type EletrodomesticoFormatado = {
        id: number;
        tipo: string;
        marca: string;
        modelo: string;
        consumo: number;
        tempo: number;
        tipoTempo: string;
        tipos: string;
    };

    const [listaFinal, setListaFinal] = useState<EletrodomesticoFormatado[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEletrodomesticosComConsumo = async () => {
            if (!idUsuario || !userToken) return;

            try {
                const result = await listarEletrodomesticosPorUsuario(userToken, idUsuario);

                if (result.success === false) {
                    setError(result.message || "Erro ao buscar eletrodomésticos.");
                    setListaFinal([]);
                    return;
                }

                const eletros = result.data || result;

                const lista = await Promise.all(
                    eletros.map(async (item: any) => {
                        const consumoResp = await listarConsumoEnergiaPorEletrodomestico(userToken, item.id_eletrodomestico);

                        const hoje = new Date().toISOString().split('T')[0];
                        const registroHoje = consumoResp?.data?.find((c: any) => c.data_registro.startsWith(hoje));
                        const tempo = registroHoje ? registroHoje.tempo : 0;
                        const tipoTempo = registroHoje ? registroHoje.tipo : "min";

                        let tempoEmHoras = tipoTempo === "hora" ? tempo / 60 : tempo / 60;
                        const consumo = parseFloat(item.consumo_kwh_hora) * tempoEmHoras;

                        return {
                            id: item.id_eletrodomestico,
                            tipo: item.imagem,
                            marca: item.marca,
                            modelo: item.modelo,
                            consumo,
                            tempo,
                            tipoTempo,
                            tipos: item.tipo,
                        } as EletrodomesticoFormatado;
                    })
                );

                setListaFinal(lista);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar eletrodomésticos:", err);
                setError("Erro inesperado ao carregar os dados.");
            }
        };

        fetchEletrodomesticosComConsumo();
    }, [idUsuario, userToken]);

    const [listaOrdenada, setListaOrdenada] = useState<EletrodomesticoFormatado[]>([]);

    useEffect(() => {
        let novaLista = [...listaFinal];

        switch (campo) {
            case "Tipo":
                novaLista.sort((a, b) => a.tipo.localeCompare(b.tipo));
                break;
            case "Marca":
                novaLista.sort((a, b) => a.marca.localeCompare(b.marca));
                break;
            case "Modelo":
                novaLista.sort((a, b) => a.modelo.localeCompare(b.modelo));
                break;
            case "Consumo":
                novaLista.sort((a, b) => b.consumo - a.consumo);
                break;
            case "Tempo":
                novaLista.sort((a, b) => b.tempo - a.tempo);
                break;
        }

        setListaOrdenada(novaLista);
    }, [campo, listaFinal]);

    // Função para atualizar a lista de eletrodomésticos
    const atualizarLista = async () => {
        if (!idUsuario || !userToken) return;
        try {
            const result = await listarEletrodomesticosPorUsuario(userToken, idUsuario);
            if (result.success === false) {
                setError(result.message || "Erro ao buscar eletrodomésticos.");
                setListaFinal([]);
                return;
            }
            const eletros = result.data || result;
            const lista = await Promise.all(
                eletros.map(async (item: any) => {
                    const consumoResp = await listarConsumoEnergiaPorEletrodomestico(userToken, item.id_eletrodomestico);
                    const hoje = new Date().toISOString().split('T')[0];
                    const registroHoje = consumoResp?.data?.find((c: any) => c.data_registro.startsWith(hoje));
                    const tempo = registroHoje ? registroHoje.tempo : 0;
                    const tipoTempo = registroHoje ? registroHoje.tipo : "min";
                    let tempoEmHoras = tipoTempo === "hora" ? tempo / 60 : tempo / 60;
                    const consumo = parseFloat(item.consumo_kwh_hora) * tempoEmHoras;
                    return {
                        id: item.id_eletrodomestico,
                        tipo: item.imagem,
                        marca: item.marca,
                        modelo: item.modelo,
                        consumo,
                        tempo,
                        tipoTempo,
                        tipos: item.tipo,
                    } as EletrodomesticoFormatado;
                })
            );
            setListaFinal(lista);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar eletrodomésticos:", err);
            setError("Erro inesperado ao carregar os dados.");
        }
    };

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "flex-start", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Lista de Eletrodomésticos</Text>
                            </View>
                            <View style={{ width: "100%", height: RFValue(215), flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: RFValue(10) }}>
                                <View style={{ marginTop: RFValue(15), width: RFValue(180), height: "100%", justifyContent: "flex-start", alignItems: "flex-start", gap: RFValue(15) }}>
                                    <Button
                                        children="Inserir eletrodoméstico"
                                        contentStyle={{ paddingVertical: RFValue(2), backgroundColor: colors.green, gap: RFValue(5) }}
                                        labelStyle={{ fontSize: RFValue(6), color: colors.white }}
                                        icon={({ size, color }) => (
                                            <Icon name="table-row-plus-after" color={colors.white} size={RFValue(15)} />
                                        )}
                                        style={{
                                            width: RFValue(170),
                                            backgroundColor: colors.green,
                                            borderRadius: RFValue(20)
                                        }}
                                        onPress={() => navigation.navigate("CadastrarEletrodomesticos")}
                                    />
                                    <Button
                                        children={`Ordenar por: ${campo}`}
                                        contentStyle={{ paddingVertical: RFValue(1), backgroundColor: colors.blue[500], borderWidth: RFValue(1), borderColor: colors.white }}
                                        labelStyle={{ fontSize: RFValue(6), color: colors.yellow[200] }}
                                        style={{
                                            width: RFValue(130),
                                            backgroundColor: colors.blue[500],
                                            borderRadius: RFValue(0)
                                        }}
                                        onPress={alternarCampo}
                                    />
                                </View>
                                <View style={{ width: RFValue(420), height: RFValue(215), backgroundColor: colors.blue[400], borderRadius: RFValue(10), justifyContent: "center", alignItems: "center", padding: RFValue(10) }}>
                                    <View style={{
                                        backgroundColor: colors.blue[400],
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        width: "100%",
                                    }}>
                                        <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                        </View>
                                        <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                Marca
                                            </Text>
                                        </View>
                                        <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                Modelo
                                            </Text>
                                        </View>
                                        <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                Consumo
                                            </Text>
                                        </View>
                                        <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                Tempo
                                            </Text>
                                        </View>
                                    </View>
                                    <FlatList
                                        data={listaOrdenada}
                                        keyExtractor={(item) => item.id.toString()}
                                        style={{ width: "100%", height: "100%" }}
                                        contentContainerStyle={{ marginRight: scrollBarVisible ? RFValue(-6.8) : 0 }}
                                        onContentSizeChange={(contentWidth, contentHeight) => {
                                            setScrollBarVisible(contentHeight > listHeight);
                                        }}
                                        onLayout={(e) => {
                                            const { height } = e.nativeEvent.layout;
                                            setListHeight(height);
                                        }}
                                        renderItem={({ item, index }) => {
                                            const isLast = index === listaOrdenada.length - 1;

                                            return (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: colors.blue[400],
                                                        flexDirection: "row",
                                                        justifyContent: "flex-start",
                                                    }}
                                                    activeOpacity={1}
                                                    onPress={() => {
                                                        setEletrodomesticoSelecionado(item.id)
                                                        setModalEletrodomesticoVisible(true)
                                                        setTipoEletrodomestico(item.tipos)
                                                    }}
                                                >
                                                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5), position: "relative" }}>
                                                        <Icon name={"pencil"} size={RFValue(10)} color={colors.white} style={{position: "absolute", left: RFValue(5), top: RFValue(5)}} />
                                                        <Icon name={item.tipo ? item.tipo as any : "progress-question"} size={RFValue(30)} color={colors.white} />
                                                    </View>
                                                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                            {item.marca}
                                                        </Text>
                                                    </View>
                                                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                            {item.modelo}
                                                        </Text>
                                                    </View>
                                                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                            {item.consumo === 0 ? "0" : `${item.consumo.toFixed(3).replace(".", ",")} kWh`}
                                                        </Text>
                                                    </View>
                                                    <View style={{ width: "20%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                            {item.tempo === 0 ? "0" : item.tipoTempo === "hora"
                                                                ? `${item.tempo / 60} h`
                                                                : `${item.tempo} min`}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Lista de Eletrodomésticos</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(20), gap: RFValue(20) }}>
                                <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                    <Button
                                        children="Inserir"
                                        contentStyle={{ paddingVertical: RFValue(2), backgroundColor: colors.green, gap: RFValue(5) }}
                                        labelStyle={{ fontSize: RFValue(13), color: colors.white }}
                                        icon={({ size, color }) => (
                                            <Icon name="table-row-plus-after" color={colors.white} size={RFValue(22)} />
                                        )}
                                        style={{
                                            width: RFValue(130),
                                            backgroundColor: colors.green,
                                            borderRadius: RFValue(10)
                                        }}
                                        onPress={() => navigation.navigate("CadastrarEletrodomesticos")}
                                    />
                                    <TouchableOpacity style={{ backgroundColor: colors.blue[500], borderWidth: RFValue(1), borderColor: colors.white, paddingHorizontal: RFValue(5), paddingVertical: RFValue(6), alignItems: "center", justifyContent: "center", width: RFValue(160) }} onPress={alternarCampo} activeOpacity={1}>
                                        <Text style={{ fontSize: RFValue(9), color: colors.yellow[200], fontFamily: fontFamily.krona }}>Ordenar por: {campo}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: "100%", height: RFValue(400), backgroundColor: colors.blue[500], justifyContent: "center", alignItems: "center" }}>
                                    <View style={{
                                        backgroundColor: colors.blue[500],
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        width: "100%",
                                    }}>
                                        <View style={{ width: "15%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                        </View>
                                        <View style={{ width: "21.25%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                Marca
                                            </Text>
                                        </View>
                                        <View style={{ width: "21.25%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                Modelo
                                            </Text>
                                        </View>
                                        <View style={{ width: "21.25%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                Consumo
                                            </Text>
                                        </View>
                                        <View style={{ width: "21.25%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(10) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                Tempo
                                            </Text>
                                        </View>
                                    </View>
                                    <FlatList
                                        data={listaOrdenada}
                                        keyExtractor={(item) => item.id.toString()}
                                        style={{ width: "100%", height: "100%" }}
                                        renderItem={({ item, index }) => {
                                            const isLast = index === listaOrdenada.length - 1;

                                            return (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: colors.blue[500],
                                                        flexDirection: "row",
                                                        justifyContent: "flex-start",
                                                    }}
                                                    activeOpacity={1}
                                                    onPress={() => {
                                                        setEletrodomesticoSelecionado(item.id)
                                                        setModalEletrodomesticoVisible(true)
                                                        setTipoEletrodomestico(item.tipos)
                                                    }}
                                                >
                                                    <View style={{ width: "15%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5), position: "relative" }}>
                                                        <Icon name={"pencil"} size={RFValue(10)} color={colors.white} style={{position: "absolute", left: RFValue(0), top: RFValue(3)}} />
                                                        <Icon name={item.tipo ? item.tipo as any : "progress-question"} size={RFValue(30)} color={colors.white} />
                                                    </View>
                                                    <View style={{ width: "21.25%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5), paddingHorizontal: RFValue(1) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                            {item.marca}
                                                        </Text>
                                                    </View>
                                                    <View style={{ width: "21.25%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5), paddingHorizontal: RFValue(1) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                            {item.modelo}
                                                        </Text>
                                                    </View>
                                                    <View style={{ width: "21.25%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5), paddingHorizontal: RFValue(1) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                            {item.consumo === 0 ? "0" : `${item.consumo.toFixed(3).replace(".", ",")} kWh`}
                                                        </Text>
                                                    </View>
                                                    <View style={{ width: "21.25%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5), paddingHorizontal: RFValue(1) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                            {item.tempo === 0 ? "0" : item.tipoTempo === "hora"
                                                                ? `${item.tempo / 60} h`
                                                                : `${item.tempo} min`}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    }

                    <Sidebar navigation={navigation} />

                    <EletrodomesticoModal
                        visible={modalEletrodomesticoVisible}
                        onDismiss={() => {
                            setEletrodomesticoSelecionado(0)
                            setModalEletrodomesticoVisible(false)
                        }}
                        idEletrodomestico={eletrodomesticoSelecionado}
                        userToken={userToken}
                        onEdit={() => {
                            setModalEletrodomesticoVisible(false);
                            navigation.navigate("EditarEletrodomesticos", { idEletrodomestico: eletrodomesticoSelecionado });
                        }}
                        onDelete={() => handleOpenModalExcluir()}
                        onTempo={() => handleOpenModalTempo()}
                        onEsc={() => {
                            setEletrodomesticoSelecionado(0)
                            setModalEletrodomesticoVisible(false)
                        }}
                    />

                    <ConfirmarModal
                        visible={modalConfirmarVisible}
                        onDismiss={handleCloseConfirmarModal}
                        changeText={textConfirmarModal}
                        changeButtonCancelar={buttonConfirmarCancelar}
                        changeButtonConfirmar={buttonConfirmarConfirmar}
                        handleConfirmar={handleConfirmarConfirmar}
                    />

                    <InputModal
                        visible={modalInputVisible}
                        onDismiss={handleCloseInputModal}
                        changeText={textInputModal}
                        changeButtonCancelar={buttonInputCancelar}
                        changeButtonConfirmar={buttonInputConfirmar}
                        handleConfirmar={async () => {
                            if (tempo.trim() === '') {
                                setErrors(prev => ({ ...prev, tempo: 'Por favor, preencha o Tempo.' }));
                                return;
                            }

                            let tempoNumber = parseFloat(tempo);
                            if (isNaN(tempoNumber) || tempoNumber < 0) {
                                setErrors(prev => ({ ...prev, tempo: 'Tempo inválido.' }));
                                return;
                            }

                            if (unidadeTempo === 'hora') {
                                tempoNumber = tempoNumber * 60;
                            }

                            await salvarTempoDoDia(eletrodomesticoSelecionado, tempoNumber, checked);

                            setModalInputVisible(false);
                            setModalEletrodomesticoVisible(true);
                        }}
                        modalMaior={true}
                        input={
                            isLandscape ?
                                <>
                                    <View style={{ width: RFValue(200), height: RFValue(25), flexDirection: "row", alignSelf: "center", justifyContent: "center", shadowColor: colors.black, shadowOffset: { width: RFValue(0), height: RFValue(3) }, shadowOpacity: 0.2, shadowRadius: RFValue(4.65), elevation: RFValue(2) }}>
                                        <View style={{
                                            borderTopLeftRadius: RFValue(5),
                                            borderBottomLeftRadius: RFValue(5),
                                            overflow: 'hidden',
                                            backgroundColor: colors.blue[300],
                                            width: RFValue(160)
                                        }}>
                                            <Input
                                                border={!!errors.tempo === true ? colors.red : colors.gray}
                                                autoCapitalize="none"
                                                disableLabel={true}
                                                placeholder="Tempo"
                                                keyboardType='numeric'
                                                value={tempo}
                                                styleLabel={{ color: !!errors.tempo === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                                contentStyle={{ fontSize: RFValue(10) }}
                                                outlineColor={!!errors.tempo === true ? colors.red : 'transparent'}
                                                onChangeText={v => {
                                                    const apenasNumeros = v.replace(/[^0-9.]/g, "");

                                                    const formatado = apenasNumeros.split(".").length > 2
                                                        ? apenasNumeros.replace(/\.+$/, "")
                                                        : apenasNumeros;

                                                    setTempo(formatado);

                                                    if (errors.tempo) {
                                                        setErrors(prev => ({ ...prev, tempo: '' }));
                                                    }
                                                    if (errorMessages.tempo) {
                                                        setErrorMessages(prev => ({ ...prev, tempo: '' }));
                                                    }
                                                }}
                                                style={[styles.input, { width: RFValue(170), height: RFValue(25), marginBottom: RFValue(0), borderRadius: 0 }]}
                                                hasError={!!errors.tempo}
                                                errorText={errors.tempo}
                                                helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0), top: RFValue(25), left: RFValue(25) }]}
                                            />
                                        </View>
                                        <TouchableOpacity style={{ height: RFValue(25), width: RFValue(40), backgroundColor: colors.blue[300], borderTopRightRadius: RFValue(5), borderBottomRightRadius: RFValue(5), borderLeftWidth: RFValue(1), borderColor: colors.white, justifyContent: "center", alignItems: "center" }} activeOpacity={1} onPress={alternarUnidadeTempo}>
                                            <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder }}>{unidadeTempo}</Text>
                                        </TouchableOpacity>
                                        <HelperText
                                            type="error"
                                            visible={true}
                                            style={{
                                                color: colors.red,
                                                position: 'absolute',
                                                top: RFValue(25),
                                                left: RFValue(5),
                                                fontSize: RFValue(6),
                                                fontFamily: fontFamily.inder,
                                                backgroundColor: 'transparent',
                                                margin: RFValue(0),
                                                padding: RFValue(0)
                                            }}
                                        >
                                            {errors.tempo}
                                        </HelperText>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.caixa, {
                                            width: "auto",
                                            height: RFValue(30),
                                            marginTop: RFValue(5),
                                            alignSelf: "center"
                                        }]}
                                        onPress={() => setChecked(!checked)}
                                        activeOpacity={1}
                                    >
                                        {checked ? (
                                            <Ionicons name="checkbox" size={RFValue(20)} color={colors.white} />
                                        ) : (
                                            <Ionicons name="square-outline" size={RFValue(20)} color={colors.white} />
                                        )}
                                        <Text style={[styles.label, { fontSize: RFValue(10) }]}>Manter tempo</Text>
                                    </TouchableOpacity>
                                </>
                                :
                                <>
                                    <View style={{ width: RFValue(250), height: RFValue(40), flexDirection: "row", alignSelf: "center", justifyContent: "center", shadowColor: colors.black, shadowOffset: { width: RFValue(0), height: RFValue(3) }, shadowOpacity: 0.2, shadowRadius: RFValue(4.65), elevation: RFValue(2) }}>
                                        <View style={{
                                            borderTopLeftRadius: RFValue(5),
                                            borderBottomLeftRadius: RFValue(5),
                                            overflow: 'hidden',
                                            backgroundColor: colors.blue[300],
                                            width: RFValue(190)
                                        }}>
                                            <Input
                                                border={!!errors.tempo === true ? colors.red : colors.gray}
                                                autoCapitalize="none"
                                                disableLabel={true}
                                                placeholder="Tempo"
                                                keyboardType='numeric'
                                                value={tempo}
                                                styleLabel={{ color: !!errors.tempo === true ? colors.red : colors.white, fontSize: RFValue(14) }}
                                                contentStyle={{ fontSize: RFValue(14) }}
                                                outlineColor={!!errors.tempo === true ? colors.red : 'transparent'}
                                                onChangeText={v => {
                                                    const apenasNumeros = v.replace(/[^0-9.]/g, "");

                                                    const formatado = apenasNumeros.split(".").length > 2
                                                        ? apenasNumeros.replace(/\.+$/, "")
                                                        : apenasNumeros;

                                                    setTempo(formatado);

                                                    if (errors.tempo) {
                                                        setErrors(prev => ({ ...prev, tempo: '' }));
                                                    }
                                                    if (errorMessages.tempo) {
                                                        setErrorMessages(prev => ({ ...prev, tempo: '' }));
                                                    }
                                                }}
                                                style={[styles.input, { width: RFValue(200), height: RFValue(40), marginBottom: RFValue(0), borderRadius: 0 }]}
                                                hasError={!!errors.tempo}
                                                errorText={errors.tempo}
                                                helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0), top: RFValue(25), left: RFValue(25) }]}
                                            />
                                        </View>
                                        <TouchableOpacity style={{ height: RFValue(40), width: RFValue(60), backgroundColor: colors.blue[300], borderTopRightRadius: RFValue(5), borderBottomRightRadius: RFValue(5), borderLeftWidth: RFValue(1), borderColor: colors.white, justifyContent: "center", alignItems: "center" }} activeOpacity={1} onPress={alternarUnidadeTempo}>
                                            <Text style={{ fontSize: RFValue(13), color: colors.white, fontFamily: fontFamily.inder }}>{unidadeTempo}</Text>
                                        </TouchableOpacity>
                                        <HelperText
                                            type="error"
                                            visible={true}
                                            style={{
                                                color: colors.red,
                                                position: 'absolute',
                                                top: RFValue(25),
                                                left: RFValue(5),
                                                fontSize: RFValue(6),
                                                fontFamily: fontFamily.inder,
                                                backgroundColor: 'transparent',
                                                margin: RFValue(0),
                                                padding: RFValue(0)
                                            }}
                                        >
                                            {errors.tempo}
                                        </HelperText>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.caixa, {
                                            width: "auto",
                                            height: RFValue(40),
                                            marginTop: RFValue(5),
                                            marginBottom: RFValue(5),
                                            alignSelf: "center"
                                        }]}
                                        onPress={() => setChecked(!checked)}
                                        activeOpacity={1}
                                    >
                                        {checked ? (
                                            <Ionicons name="checkbox" size={RFValue(28)} color={colors.white} />
                                        ) : (
                                            <Ionicons name="square-outline" size={RFValue(28)} color={colors.white} />
                                        )}
                                        <Text style={[styles.label, { fontSize: RFValue(14) }]}>Manter tempo</Text>
                                    </TouchableOpacity>
                                </>
                        }
                    />

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
                            marginBottom: isLandscape ? RFValue(5) : RFValue(90),
                            zIndex: 10000
                        }}

                    >
                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder }}>{snackbarMessage}</Text>
                    </Snackbar>
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
    }, input: {
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
    },
    caixa: {
        flexDirection: 'row',
        alignItems: 'center',
        width: RFValue(255),
        height: RFValue(35)
    },
    label: {
        marginLeft: RFValue(8),
        fontSize: RFValue(14),
        fontFamily: fontFamily.inder,
        color: colors.white
    }
})