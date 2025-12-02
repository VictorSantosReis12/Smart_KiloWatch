// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity, FlatList } from "react-native";
import { IconButton, ActivityIndicator, TextInput, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import Sidebar from "../screens/SidebarModal";
import InputModal from "../screens/InputModal";
import GraficoDonutModel from "../screens/GraficoDonutModel";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

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
import { buscarUsuarioPorEmail, listarMetasPorUsuario, cadastrarMeta, editarMeta, listarConsumoEnergiaPorUsuario, listarConsumoAguaPorUsuario } from "@/services/api";

export default function MetasScreen({ navigation }: any) {
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

    type Meta = {
        id_meta: number;
        id_usuario: number;
        meta_energia: number;
        meta_agua: number;
        data_registro: string;
    };

    const [metas, setMetas] = useState<Meta[]>([]);

    useEffect(() => {
        const fetchMetas = async () => {
            if (idUsuario) {
                const result = await listarMetasPorUsuario(userToken, idUsuario);
                if (!result.success) {
                    setSnackbarVisible(true);
                    setSnackbarMessage(result.message || 'Erro ao buscar metas.');
                }
                setMetas(result.data || result);
            }
        };

        fetchMetas();
    }, [idUsuario]);

    const [consumoEnergia, setConsumoEnergia] = useState('0');
    const [metaEnergia, setMetaEnergia] = useState('0');
    const [loadingEnergia, setLoadingEnergia] = useState(false);
    const [consumoAgua, setConsumoAgua] = useState('120');
    const [metaAgua, setMetaAgua] = useState('0');
    const [loadingAgua, setLoadingAgua] = useState(false);
    const [inputEnergia, setInputEnergia] = useState('0');
    const [inputAgua, setInputAgua] = useState('0');
    const [errorMessages, setErrorMessages] = useState({ inputEnergia: '', inputAgua: '' });
    const [errors, setErrors] = useState({ inputEnergia: '', inputAgua: '' });

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isMultilineEnergia, setIsMultilineEnergia] = useState(false);
    const [isMultilineAgua, setIsMultilineAgua] = useState(false);

    // Modal
    const [textModal, setTextModal] = useState('Inserir metas de energia/água');
    const [buttonCancelar, setButtonCancelar] = useState('Cancelar');
    const [buttonConfirmar, setButtonConfirmar] = useState('Salvar');
    const handleConfirmar = () => {
        let hasError = false;
        const newErrors: { inputEnergia: string; inputAgua: string } = { inputEnergia: '', inputAgua: '' };

        if (inputEnergia === '') {
            newErrors.inputEnergia = 'Por favor, preencha a Meta de Energia.';
            hasError = true;
        } else {
            if (Number(inputEnergia) <= 0) {
                newErrors.inputEnergia = 'A meta deve ser maior que 0.';
                hasError = true;
            }
        }

        if (inputAgua === '') {
            newErrors.inputAgua = 'Por favor, preencha a Meta de Água.';
            hasError = true;
        } else {
            if (Number(inputAgua) <= 0) {
                newErrors.inputAgua = 'A meta deve ser maior que 0.';
                hasError = true;
            }
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setErrors({ inputEnergia: '', inputAgua: '' });

        handleRegister();
    }

    const handleRegister = async () => {
        try {
            const mesIndexSelecionado = meses.findIndex(m => m.toLowerCase() === mesSelecionado.toLowerCase());
            const anoSelecionadoNum = anoSelecionado;

            const hoje = new Date();
            const dataMetaSelecionada = new Date(anoSelecionadoNum, mesIndexSelecionado, hoje.getDate());
            const mysqlDate = new Date(dataMetaSelecionada.getTime() - dataMetaSelecionada.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            if (!metas || metas.length === 0) {
                const cadastroResponse = await cadastrarMeta(userToken, idUsuario, inputEnergia, inputAgua);
                setSnackbarVisible(true);
                setSnackbarMessage(cadastroResponse.message || 'Nova meta cadastrada com sucesso!');
            } else {
                const metaExistente = metas.find((meta: Meta) => {
                    const dataMeta = new Date(meta.data_registro);
                    return dataMeta.getMonth() === mesIndexSelecionado && dataMeta.getFullYear() === anoSelecionadoNum;
                });

                if (metaExistente) {
                    const edicaoResponse = await editarMeta(userToken, metaExistente.id_meta, idUsuario, inputEnergia, inputAgua, mysqlDate);
                    setSnackbarVisible(true);
                    setSnackbarMessage(edicaoResponse.message || 'Meta atualizada com sucesso!');
                } else {
                    const cadastroResponse = await cadastrarMeta(userToken, idUsuario, inputEnergia, inputAgua);
                    setSnackbarVisible(true);
                    setSnackbarMessage(cadastroResponse.message || 'Nova meta cadastrada com sucesso!');
                }
            }

            const result = await listarMetasPorUsuario(userToken, idUsuario);
            setMetas(result.data || result);
            setMetaEnergia(inputEnergia);
            setMetaAgua(inputAgua);
            setModalVisible(false);
        } catch (error) {
            console.error(error);
            setSnackbarVisible(true);
            setSnackbarMessage('Erro ao salvar a meta.');
        }
    };

    const [modalVisible, setModalVisible] = useState(false);

    const handleCloseModal = () => setModalVisible(false);

    const hoje = new Date();
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const dia = hoje.getDate();
    const mes = meses[hoje.getMonth()];
    const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const ano = hoje.getFullYear();

    const dataFormatada = `${dia} de ${mesFormatado} de ${ano}`;

    const pegarMetaPorMesAno = (mesStr: string, ano: number) => {
        const mesIndex = meses.findIndex(m => m.toLowerCase() === mesStr.toLowerCase());
        return metas.find(meta => {
            const dataMeta = new Date(meta.data_registro);
            return dataMeta.getMonth() === mesIndex && dataMeta.getFullYear() === ano;
        });
    };

    // Dropdown para seleção de mês/ano
    const [mesSelecionado, setMesSelecionado] = useState(meses[hoje.getMonth()].charAt(0).toUpperCase() + meses[hoje.getMonth()].slice(1));
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

    const [dropdownAberto, setDropdownAberto] = useState(false);

    const mesesAnoDropdown = () => {
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const mesAtualStr = `${meses[mesAtual].charAt(0).toUpperCase() + meses[mesAtual].slice(1)} / ${anoAtual}`;

        let uniqueMeses = metas?.reduce((acc: string[], meta: Meta) => {
            const dataMeta = new Date(meta.data_registro);
            const mesAno = `${meses[dataMeta.getMonth()].charAt(0).toUpperCase() + meses[dataMeta.getMonth()].slice(1)} / ${dataMeta.getFullYear()}`;
            if (!acc.includes(mesAno)) acc.push(mesAno);
            return acc;
        }, []) || [];

        if (!uniqueMeses.includes(mesAtualStr)) {
            uniqueMeses.push(mesAtualStr);
        }

        uniqueMeses.sort((a, b) => {
            const [mesA, anoA] = a.split(" / ");
            const [mesB, anoB] = b.split(" / ");
            const dateA = new Date(Number(anoA), meses.findIndex(m => m.toLowerCase() === mesA.toLowerCase()));
            const dateB = new Date(Number(anoB), meses.findIndex(m => m.toLowerCase() === mesB.toLowerCase()));
            return dateB.getTime() - dateA.getTime();
        });

        const mesAnoSelecionado = `${mesSelecionado} / ${anoSelecionado}`;

        if (mesAnoSelecionado === mesAtualStr) {
            uniqueMeses = uniqueMeses.filter(m => m !== mesAtualStr);
        }

        return uniqueMeses;
    };

    useEffect(() => {
        const meta = pegarMetaPorMesAno(mesSelecionado, anoSelecionado);
        if (meta) {
            setMetaEnergia(String(meta.meta_energia));
            setMetaAgua(String(meta.meta_agua));
        } else {
            setMetaEnergia('0');
            setMetaAgua('0');
        }
    }, [mesSelecionado, anoSelecionado, metas]);

    const [consumoEnergiaExcedeu, setConsumoEnergiaExcedeu] = useState(false);
    const [consumoEnergiaQuaseExcedendo, setConsumoEnergiaQuaseExcedendo] = useState(false);
    const [consumoAguaExcedeu, setConsumoAguaExcedeu] = useState(false);
    const [consumoAguaQuaseExcedendo, setConsumoAguaQuaseExcedendo] = useState(false);

    const [consumoEnergiaExcedeuValor, setConsumoEnergiaExcedeuValor] = useState(0);
    const [consumoAguaExcedeuValor, setConsumoAguaExcedeuValor] = useState(0);
    const [consumoEnergiaQuaseExcedendoValor, setConsumoEnergiaQuaseExcedendoValor] = useState(0);
    const [consumoAguaQuaseExcedendoValor, setConsumoAguaQuaseExcedendoValor] = useState(0);

    useEffect(() => {
        const energia = Number(consumoEnergia);
        const metaE = Number(metaEnergia);
        const agua = Number(consumoAgua);
        const metaA = Number(metaAgua);

        if (metaA === 0 && metaE === 0) return;

        const excedeuEnergia = energia > metaE;
        const excedeuAgua = agua > metaA;

        setConsumoEnergiaExcedeu(excedeuEnergia);
        setConsumoAguaExcedeu(excedeuAgua);

        if (!excedeuEnergia) {
            setConsumoEnergiaQuaseExcedendo(energia >= metaE * 0.85);
            setConsumoEnergiaQuaseExcedendoValor(metaE - energia);
        } else {
            setConsumoEnergiaExcedeuValor(energia - metaE);
            setConsumoEnergiaQuaseExcedendo(false);
        }

        if (!excedeuAgua) {
            setConsumoAguaQuaseExcedendo(agua >= metaA * 0.85);
            setConsumoAguaQuaseExcedendoValor(metaA - agua);
        } else {
            setConsumoAguaExcedeuValor(agua - metaA);
            setConsumoAguaQuaseExcedendo(false);
        }
    }, [consumoEnergia, consumoAgua, metaEnergia, metaAgua]);

    useEffect(() => {
        if (modalVisible) {
            const meta = pegarMetaPorMesAno(mesSelecionado, anoSelecionado);
            if (meta) {
                setInputEnergia(String(meta.meta_energia));
                setInputAgua(String(meta.meta_agua));
            } else {
                setInputEnergia('0');
                setInputAgua('0');
            }
        }
    }, [modalVisible, mesSelecionado, anoSelecionado, metas]);

    useEffect(() => {
        const fetchConsumo = async () => {
            if (!idUsuario) return;

            setLoadingEnergia(true);
            try {
                const result = await listarConsumoEnergiaPorUsuario(userToken, idUsuario);

                if (result.success && result.data.length > 0) {
                    const mesIndex = meses.findIndex(m => m.toLowerCase() === mesSelecionado.toLowerCase());
                    const anoNum = anoSelecionado;

                    const registrosFiltrados = result.data.filter((c: any) => {
                        const data = new Date(c.data_registro);
                        return data.getMonth() === mesIndex && data.getFullYear() === anoNum;
                    });

                    const somaConsumo = registrosFiltrados.reduce((acc: number, c: any) => {
                        const tempo = Number(c.tempo) || 0;
                        const consumo = Number(c.consumo_kwh_hora) || 0;
                        return acc + (tempo / 60) * consumo;
                    }, 0);

                    setConsumoEnergia(String(Number(somaConsumo.toFixed(3))));
                } else {
                    setConsumoEnergia("0");
                }
            } catch (error) {
                console.error(error);
                setConsumoEnergia("0");
            } finally {
                setLoadingEnergia(false);
            }
        };

        fetchConsumo();
    }, [mesSelecionado, anoSelecionado, idUsuario]);

    useEffect(() => {
        const fetchConsumo = async () => {
            if (!idUsuario) return;

            setLoadingAgua(true);
            try {
                const result = await listarConsumoAguaPorUsuario(userToken, idUsuario);

                if (result.success && result.data.length > 0) {
                    const mesIndex = meses.findIndex(m => m.toLowerCase() === mesSelecionado.toLowerCase());
                    const anoNum = anoSelecionado;

                    const registrosFiltrados = result.data.filter((c: any) => {
                        const data = new Date(c.data_registro);
                        return data.getMonth() === mesIndex && data.getFullYear() === anoNum;
                    });

                    const somaConsumo = registrosFiltrados.reduce((acc: number, c: any) => {
                        const tempo = Number(c.tempo_uso) || 0;
                        const consumo = Number(c.consumo_litros_minuto) || 0;
                        return acc + (tempo / 60) * consumo;
                    }, 0);

                    setConsumoAgua(String(Number(somaConsumo.toFixed(3))));
                } else {
                    setConsumoAgua("0");
                }
            } catch (error) {
                console.error(error);
                setConsumoAgua("0");
            } finally {
                setLoadingAgua(false);
            }
        };

        fetchConsumo();
    }, [mesSelecionado, anoSelecionado, idUsuario]);

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
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Metas de Consumo</Text>
                            </View>
                            <View style={{ width: "100%", height: RFValue(208), marginTop: RFValue(15), flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ width: "25%", height: "100%", backgroundColor: colors.blue[500], justifyContent: "space-between", alignItems: "flex-start", paddingBottom: RFValue(25), paddingTop: RFValue(10), paddingLeft: RFValue(20) }}>
                                    <View>
                                        <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(10) }}>
                                            {dataFormatada}
                                        </Text>

                                        <View style={{ position: "relative" }}>
                                            <TouchableOpacity style={{ backgroundColor: colors.blue[500], borderLeftWidth: RFValue(1), borderRightWidth: RFValue(1), borderTopWidth: RFValue(1), borderBottomWidth: dropdownAberto ? 0 : RFValue(1), borderColor: colors.white, paddingHorizontal: RFValue(5), paddingVertical: RFValue(3), flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: RFValue(120) }} onPress={() => { setDropdownAberto(!dropdownAberto) }} activeOpacity={1}>
                                                <Text style={{ fontSize: RFValue(10), color: colors.yellow[200], fontFamily: fontFamily.inder }}>{mesSelecionado} / {anoSelecionado}</Text>
                                                <Ionicons name={dropdownAberto ? "chevron-up" : "chevron-down"} size={RFValue(10)} color={colors.yellow[200]} />
                                            </TouchableOpacity>

                                            {dropdownAberto && (
                                                <ScrollView style={{ maxHeight: RFValue(69.5), width: RFValue(120), position: "absolute", top: RFValue(20), left: 0, right: 0, zIndex: 5000, borderBottomWidth: RFValue(1), borderColor: colors.white }} showsVerticalScrollIndicator={false}>
                                                    <FlatList
                                                        data={mesesAnoDropdown()}
                                                        keyExtractor={(item) => item}
                                                        renderItem={({ item, index }) => {
                                                            const backgroundColor = index % 2 === 0 ? colors.blue[300] : colors.blue[500];
                                                            const data = mesesAnoDropdown();
                                                            const isLast = index === data.length - 1;
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        const [mes, ano] = item.split(" / ");
                                                                        setMesSelecionado(mes);
                                                                        setAnoSelecionado(Number(ano));
                                                                        setDropdownAberto(false);
                                                                    }}
                                                                    style={{
                                                                        backgroundColor,
                                                                        borderLeftWidth: RFValue(1),
                                                                        borderRightWidth: RFValue(1),
                                                                        borderColor: colors.white,
                                                                        width: RFValue(120),
                                                                    }}
                                                                    activeOpacity={1}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            paddingVertical: RFValue(2),
                                                                            paddingHorizontal: RFValue(3),
                                                                            color: colors.yellow[200],
                                                                            fontSize: RFValue(10),
                                                                            fontFamily: fontFamily.inder,
                                                                        }}
                                                                    >
                                                                        {item}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            );
                                                        }}
                                                    />
                                                </ScrollView>
                                            )}
                                        </View>
                                    </View>

                                    <View style={{ position: "relative", width: "100%" }}>
                                        <Button
                                            children="Ajustar Metas"
                                            contentStyle={{ paddingVertical: RFValue(4), backgroundColor: colors.blue[400] }}
                                            labelStyle={{ fontSize: RFValue(8), color: colors.yellow[200] }}
                                            style={{
                                                width: "100%",
                                                backgroundColor: colors.blue[400],
                                                borderRadius: RFValue(20),
                                                marginTop: RFValue(15)
                                            }}
                                            onPress={() => {
                                                setInputEnergia('0');
                                                setInputAgua('0');
                                                setModalVisible(true);
                                            }}
                                            disabled={mesSelecionado !== mesFormatado || anoSelecionado !== ano}
                                        />
                                        {(mesSelecionado !== mesFormatado || anoSelecionado !== ano) && (
                                            <View style={{
                                                position: "absolute",
                                                top: "37%",
                                                left: 0,
                                                width: "100%",
                                                height: "63%",
                                                borderRadius: RFValue(20),
                                                backgroundColor: colors.black,
                                                opacity: 0.5,
                                                zIndex: 5000
                                            }} />
                                        )}
                                    </View>
                                </View>
                                <View style={{ width: "35%", height: "100%", backgroundColor: colors.blue[500], justifyContent: "center", alignItems: "flex-end" }}>
                                    <View style={{ height: "100%", width: "80%", justifyContent: "flex-start", alignItems: "center", gap: RFValue(10), backgroundColor: colors.blue[400], borderRadius: RFValue(10), paddingTop: RFValue(10), position: "relative" }}>
                                        <GraficoDonutModel consumo={Number(consumoEnergia)} meta={Number(metaEnergia)} cor={colors.yellow[300]} tipo={"energia"} tamanho={"grande"} />

                                        {consumoEnergiaExcedeu && (<Text style={{ fontFamily: fontFamily.inder, fontSize: RFValue(7.5), color: colors.red, position: "absolute", width: "100%", bottom: RFValue(10), textAlign: "center", paddingHorizontal: RFValue(10) }}>Você excedeu {consumoEnergiaExcedeuValor.toFixed(3)} kWh da sua meta!</Text>)}

                                        {consumoEnergiaQuaseExcedendo && (<Text style={{ fontFamily: fontFamily.inder, fontSize: RFValue(7.5), color: colors.yellow[300], position: "absolute", width: "100%", bottom: RFValue(10), textAlign: "center", paddingHorizontal: RFValue(10) }}> {Number(consumoEnergia) - Number(metaEnergia) === 0 ? 'Você atingiu seu limite!' : `Falta ${consumoEnergiaQuaseExcedendoValor.toFixed(3)} kWh para atingir sua meta!`} </Text>)}

                                        {loadingEnergia ? (
                                            <ActivityIndicator animating={true} size="large" color={colors.white} />
                                        ) : (
                                            <Text style={{ fontFamily: fontFamily.krona, fontSize: RFValue(10), color: colors.white }}>{consumoEnergia.replace(".", ",")} kWh / {metaEnergia} kWh</Text>
                                        )}
                                    </View>
                                </View>
                                <View style={{ width: "35%", height: "100%", backgroundColor: colors.blue[500], justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ height: "100%", width: "80%", justifyContent: "flex-start", alignItems: "center", gap: RFValue(10), backgroundColor: colors.blue[400], borderRadius: RFValue(10), paddingTop: RFValue(10), position: "relative" }}>
                                        <GraficoDonutModel consumo={Number(consumoAgua)} meta={Number(metaAgua)} cor={colors.blue[200]} tipo={"agua"} tamanho={"grande"} />

                                        {consumoAguaExcedeu && (<Text style={{ fontFamily: fontFamily.inder, fontSize: RFValue(7.5), color: colors.red, position: "absolute", width: "100%", bottom: RFValue(10), textAlign: "center", paddingHorizontal: RFValue(10) }}>Você excedeu {consumoAguaExcedeuValor} L da sua meta!</Text>)}

                                        {consumoAguaQuaseExcedendo && (<Text style={{ fontFamily: fontFamily.inder, fontSize: RFValue(7.5), color: colors.yellow[300], position: "absolute", width: "100%", bottom: RFValue(10), textAlign: "center", paddingHorizontal: RFValue(10) }}> {Number(consumoAgua) - Number(metaAgua) === 0 ? 'Você atingiu seu limite!' : `Falta ${consumoAguaQuaseExcedendoValor} L para atingir sua meta!`} </Text>)}

                                        {loadingAgua ? (
                                            <ActivityIndicator animating={true} size="large" color={colors.white} />
                                        ) : (
                                            <Text style={{ fontFamily: fontFamily.krona, fontSize: RFValue(10), color: colors.white }}>{consumoAgua} Litros / {metaAgua} Litros</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Metas de Consumo</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30), justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ width: "100%", backgroundColor: colors.blue[500], justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginBottom: RFValue(30) }}>
                                    <View style={{ position: "relative" }}>
                                        <TouchableOpacity style={{ backgroundColor: colors.blue[500], borderLeftWidth: RFValue(1), borderRightWidth: RFValue(1), borderTopWidth: RFValue(1), borderBottomWidth: dropdownAberto ? 0 : RFValue(1), borderColor: colors.white, paddingHorizontal: RFValue(5), paddingVertical: RFValue(3), flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: RFValue(140) }} onPress={() => { setDropdownAberto(!dropdownAberto) }} activeOpacity={1}>
                                            <Text style={{ fontSize: RFValue(13), color: colors.yellow[200], fontFamily: fontFamily.inder }}>{mesSelecionado} / {anoSelecionado}</Text>
                                            <Ionicons name={dropdownAberto ? "chevron-up" : "chevron-down"} size={RFValue(15)} color={colors.yellow[200]} />
                                        </TouchableOpacity>

                                        {dropdownAberto && (
                                            <ScrollView style={{ maxHeight: RFValue(80), width: RFValue(140), position: "absolute", top: RFValue(24), left: 0, right: 0, zIndex: 5000, borderBottomWidth: RFValue(1), borderColor: colors.white }} showsVerticalScrollIndicator={false}>
                                                <FlatList
                                                    data={mesesAnoDropdown()}
                                                    keyExtractor={(item) => item}
                                                    scrollEnabled={false}
                                                    renderItem={({ item, index }) => {
                                                        const backgroundColor = index % 2 === 0 ? colors.blue[300] : colors.blue[500];
                                                        const data = mesesAnoDropdown();
                                                        const isLast = index === data.length - 1;
                                                        return (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    const [mes, ano] = item.split(" / ");
                                                                    setMesSelecionado(mes);
                                                                    setAnoSelecionado(Number(ano));
                                                                    setDropdownAberto(false);
                                                                }}
                                                                style={{
                                                                    backgroundColor,
                                                                    borderLeftWidth: RFValue(1),
                                                                    borderRightWidth: RFValue(1),
                                                                    borderColor: colors.white,
                                                                    width: RFValue(140),
                                                                }}
                                                                activeOpacity={1}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        paddingVertical: RFValue(2),
                                                                        paddingHorizontal: RFValue(3),
                                                                        color: colors.yellow[200],
                                                                        fontSize: RFValue(13),
                                                                        fontFamily: fontFamily.inder,
                                                                    }}
                                                                >
                                                                    {item}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        );
                                                    }}
                                                />
                                            </ScrollView>
                                        )}
                                    </View>

                                    <Text style={{ fontSize: RFValue(13), color: colors.white, fontFamily: fontFamily.inder }}>
                                        {dataFormatada}
                                    </Text>
                                </View>
                                <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row" }}>
                                    <View style={{
                                        height: isMultilineEnergia && (consumoEnergiaExcedeu || consumoEnergiaQuaseExcedendo) ? RFValue(240) : RFValue(220), width: "48%", justifyContent: "flex-start", alignItems: "center", gap: RFValue(15), backgroundColor: colors.blue[400], borderRadius: RFValue(10), position: "relative"
                                    }}>
                                        <GraficoDonutModel consumo={Number(consumoEnergia)} meta={Number(metaEnergia)} cor={colors.yellow[300]} tipo={"energia"} tamanho={"grande"} />

                                        {consumoEnergiaExcedeu && (<Text style={{ fontFamily: fontFamily.inder, fontSize: RFValue(10), color: colors.red, position: "absolute", width: "100%", bottom: RFValue(11), textAlign: "center", paddingHorizontal: RFValue(10) }}>Você excedeu {consumoEnergiaExcedeuValor.toFixed(3)} kWh da sua meta!</Text>)}

                                        {consumoEnergiaQuaseExcedendo && (<Text style={{ fontFamily: fontFamily.inder, fontSize: RFValue(10), color: colors.yellow[300], position: "absolute", width: "100%", bottom: RFValue(11), textAlign: "center", paddingHorizontal: RFValue(10) }}>Falta {consumoEnergiaQuaseExcedendoValor.toFixed(3)} kWh para atingir sua meta!</Text>)}

                                        {loadingEnergia ? (
                                            <ActivityIndicator animating={true} size="large" color={colors.white} />
                                        ) : (
                                            <Text onTextLayout={(e) => {
                                                const lines = e.nativeEvent.lines.length;
                                                setIsMultilineEnergia(lines > 1);
                                            }}
                                                style={{ fontFamily: fontFamily.krona, fontSize: RFValue(12), color: colors.white, textAlign: "center" }}>{consumoEnergia} kWh / {metaEnergia} kWh</Text>
                                        )}
                                    </View>
                                    <View style={{ height: isMultilineEnergia && (consumoEnergiaExcedeu || consumoEnergiaQuaseExcedendo) ? RFValue(240) : RFValue(220), width: "48%", justifyContent: "flex-start", alignItems: "center", gap: RFValue(15), backgroundColor: colors.blue[400], borderRadius: RFValue(10), position: "relative" }}>
                                        <GraficoDonutModel consumo={Number(consumoAgua)} meta={Number(metaAgua)} cor={colors.blue[200]} tipo={"agua"} tamanho={"grande"} />

                                        {consumoAguaExcedeu && (<Text style={{ fontFamily: fontFamily.inder, fontSize: RFValue(10), color: colors.red, position: "absolute", width: "100%", bottom: isMultilineAgua ? RFValue(30) : RFValue(11), textAlign: "center", paddingHorizontal: RFValue(10) }}>Você excedeu {consumoAguaExcedeuValor} L da sua meta!</Text>)}

                                        {consumoAguaQuaseExcedendo && (<Text style={{ fontFamily: fontFamily.inder, fontSize: RFValue(10), color: colors.yellow[300], position: "absolute", width: "100%", bottom: isMultilineAgua ? RFValue(30) : RFValue(11), textAlign: "center", paddingHorizontal: RFValue(10) }}>Falta {consumoAguaQuaseExcedendoValor} L para atingir sua meta!</Text>)}


                                        {loadingAgua ? (
                                            <ActivityIndicator animating={true} size="large" color={colors.white} />
                                        ) : (
                                            <Text style={{ fontFamily: fontFamily.krona, fontSize: RFValue(12), color: colors.white, textAlign: "center" }}>{consumoAgua} L / {metaAgua} L</Text>
                                        )}
                                    </View>
                                </View>
                                <View style={{ position: "relative", width: "60%", marginTop: RFValue(25) }}>
                                    <Button
                                        children="Ajustar Metas"
                                        contentStyle={{ paddingVertical: RFValue(4), backgroundColor: colors.blue[400] }}
                                        labelStyle={{ fontSize: RFValue(14), color: colors.yellow[200] }}
                                        style={{
                                            width: "100%",
                                            backgroundColor: colors.blue[400],
                                            borderRadius: RFValue(20),
                                            marginTop: RFValue(15)
                                        }}
                                        onPress={() => {
                                            setInputEnergia('0');
                                            setInputAgua('0');
                                            setModalVisible(true);
                                        }}
                                        disabled={mesSelecionado !== mesFormatado || anoSelecionado !== ano}
                                    />
                                    {(mesSelecionado !== mesFormatado || anoSelecionado !== ano) && (
                                        <View style={{
                                            position: "absolute",
                                            top: "26%",
                                            left: 0,
                                            width: "100%",
                                            height: "74%",
                                            borderRadius: RFValue(20),
                                            backgroundColor: colors.black,
                                            opacity: 0.5,
                                            zIndex: 5000
                                        }} />
                                    )}
                                </View>
                            </View>
                        </View>
                    }

                    <Sidebar navigation={navigation} />

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
                            zIndex: 5000,
                        }}

                    >
                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder }}>{snackbarMessage}</Text>
                    </Snackbar>
                </View>
                <InputModal
                    visible={modalVisible}
                    onDismiss={handleCloseModal}
                    changeText={textModal}
                    changeButtonCancelar={buttonCancelar}
                    changeButtonConfirmar={buttonConfirmar}
                    handleConfirmar={handleConfirmar}
                    doubleInput={true}
                    input={
                        isLandscape ?
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "78%", alignSelf: "center" }}>
                                <Input
                                    border={!!errors.inputEnergia === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Meta de Energia"
                                    value={inputEnergia}
                                    styleLabel={{ color: !!errors.inputEnergia === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.inputEnergia === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v.replace(/[^0-9]/g, '');
                                        setInputEnergia(apenasNumeros);

                                        if (errors.inputEnergia) {
                                            setErrors(prev => ({ ...prev, inputEnergia: '' }));
                                        }
                                        if (errorMessages.inputEnergia) {
                                            setErrorMessages(prev => ({ ...prev, inputEnergia: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(90), height: RFValue(25), marginBottom: RFValue(0), borderRadius: RFValue(10), alignSelf: 'center' }]}
                                    keyboardType='numeric'
                                    hasError={!!errors.inputEnergia}
                                    errorText={errors.inputEnergia}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0), top: RFValue(28), left: RFValue(0) }]}
                                />
                                <Input
                                    border={!!errors.inputAgua === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Meta de Água"
                                    value={inputAgua}
                                    styleLabel={{ color: !!errors.inputAgua === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.inputAgua === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v.replace(/[^0-9]/g, '');
                                        setInputAgua(apenasNumeros);

                                        if (errors.inputAgua) {
                                            setErrors(prev => ({ ...prev, inputAgua: '' }));
                                        }
                                        if (errorMessages.inputAgua) {
                                            setErrorMessages(prev => ({ ...prev, inputAgua: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(90), height: RFValue(25), marginBottom: RFValue(0), borderRadius: RFValue(10), alignSelf: 'center' }]}
                                    keyboardType='numeric'
                                    hasError={!!errors.inputAgua}
                                    errorText={errors.inputAgua}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0), top: RFValue(28), left: RFValue(0) }]}
                                />
                            </View>
                            :
                            <View style={{ justifyContent: "space-between", width: "85%", alignSelf: "center" }}>
                                <Input
                                    border={!!errors.inputEnergia === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Meta de Energia"
                                    value={inputEnergia}
                                    styleLabel={{ color: !!errors.inputEnergia === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                    contentStyle={{ fontSize: RFValue(16) }}
                                    outlineColor={!!errors.inputEnergia === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v.replace(/[^0-9]/g, '');
                                        setInputEnergia(apenasNumeros);

                                        if (errors.inputEnergia) {
                                            setErrors(prev => ({ ...prev, inputEnergia: '' }));
                                        }
                                        if (errorMessages.inputEnergia) {
                                            setErrorMessages(prev => ({ ...prev, inputEnergia: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(200), height: RFValue(40), marginBottom: RFValue(34), borderRadius: RFValue(10), alignSelf: 'center' }]}
                                    keyboardType='numeric'
                                    hasError={!!errors.inputEnergia}
                                    errorText={errors.inputEnergia}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(10), top: RFValue(45), left: RFValue(25) }]}
                                />
                                <Input
                                    border={!!errors.inputAgua === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Meta de Água"
                                    value={inputAgua}
                                    styleLabel={{ color: !!errors.inputAgua === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                    contentStyle={{ fontSize: RFValue(16) }}
                                    outlineColor={!!errors.inputAgua === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v.replace(/[^0-9]/g, '');
                                        setInputAgua(apenasNumeros);

                                        if (errors.inputAgua) {
                                            setErrors(prev => ({ ...prev, inputAgua: '' }));
                                        }
                                        if (errorMessages.inputAgua) {
                                            setErrorMessages(prev => ({ ...prev, inputAgua: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(200), height: RFValue(40), marginBottom: RFValue(34), borderRadius: RFValue(10), alignSelf: 'center' }]}
                                    keyboardType='numeric'
                                    hasError={!!errors.inputAgua}
                                    errorText={errors.inputAgua}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(10), top: RFValue(45), left: RFValue(25) }]}
                                />
                            </View>
                    }
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
})