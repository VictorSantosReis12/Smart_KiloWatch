// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity, FlatList } from "react-native";
import { IconButton, ActivityIndicator, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import Sidebar from "../screens/SidebarModal";
import InputModal from "../screens/InputModal";
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
import { buscarUsuarioPorEmail, listarCustosPorUsuario, editarCusto } from "@/services/api";

export default function EstimativaCustosScreen({ navigation }: any) {
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

    type Custo = {
        id_custo: number;
        id_usuario: number;
        valor_energia_sem_imposto: number;
        valor_energia_com_imposto: number;
        valor_agua_sem_imposto: number;
        valor_agua_com_imposto: number;
        data_registro: string;
    };

    const [custos, setCustos] = useState<Custo[]>([]);

    useEffect(() => {
        const fetchCustos = async () => {
            if (idUsuario) {
                const result = await listarCustosPorUsuario(userToken, idUsuario);
                if (!result.success) {
                    setSnackbarVisible(true);
                    setSnackbarMessage(result.message || 'Erro ao buscar custos.');
                }
                setCustos(result.data || result);
            }
        };

        fetchCustos();
    }, [idUsuario]);

    const [valorEnergiaSemImposto, setValorEnergiaSemImposto] = useState('00,00');
    const [valorEnergiaComImposto, setValorEnergiaComImposto] = useState('00,00');
    const [valorAguaSemImposto, setValorAguaSemImposto] = useState('00,00');
    const [valorAguaComImposto, setValorAguaComImposto] = useState('00,00');

    const [inputEnergia, setInputEnergia] = useState('0');
    const [inputAgua, setInputAgua] = useState('0');
    const [errorMessages, setErrorMessages] = useState({ inputEnergia: '', inputAgua: '' });
    const [errors, setErrors] = useState({ inputEnergia: '', inputAgua: '' });

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Modal
    const [textModal, setTextModal] = useState('Reajustar valores dos custos de energia/água');
    const [buttonCancelar, setButtonCancelar] = useState('Cancelar');
    const [buttonConfirmar, setButtonConfirmar] = useState('Salvar');
    const handleConfirmar = () => {
        let hasError = false;
        const newErrors: { inputEnergia: string; inputAgua: string } = { inputEnergia: '', inputAgua: '' };

        if (inputEnergia === '') {
            newErrors.inputEnergia = 'Por favor, preencha a Energia Sem Imposto.';
            hasError = true;
        } else if (inputEnergia.includes('.')) {
            const partes = inputEnergia.split('.');
            if (partes[1].length !== 2) {
                newErrors.inputEnergia = 'O valor deve ter exatamente duas casas decimais.';
                hasError = true;
            }
        }

        if (inputAgua === '') {
            newErrors.inputAgua = 'Por favor, preencha a Água Sem Imposto.';
            hasError = true;
        } else if (inputAgua.includes('.')) {
            const partes = inputAgua.split('.');
            if (partes[1].length !== 2) {
                newErrors.inputAgua = 'O valor deve ter exatamente duas casas decimais.';
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
            const dataCustoSelecionado = new Date(anoSelecionadoNum, mesIndexSelecionado, hoje.getDate());
            const mysqlDate = new Date(dataCustoSelecionado.getTime() - dataCustoSelecionado.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            const custoExistente = custos.find((custo: Custo) => {
                const dataCusto = new Date(custo.data_registro);
                return dataCusto.getMonth() === mesIndexSelecionado && dataCusto.getFullYear() === anoSelecionadoNum;
            });

            if (!custoExistente) return;

            const formatarNumeroParaMySQL = (valor: string) => {
                return valor.replace(',', '.');
            };

            const impostoEnergia = Number(inputEnergia) * 32.5 / 100;
            const totalEnergia = Number(inputEnergia) + impostoEnergia;
            const inputEnergiaImposto = totalEnergia.toFixed(2).replace('.', ',');

            const impostoAgua = Number(inputAgua) * 7.5 / 100;
            const totalAgua = Number(inputAgua) + impostoAgua;
            const inputAguaImposto = totalAgua.toFixed(2).replace('.', ',');

            console.log('Valores enviados:', {
                id_custo: custoExistente.id_custo,
                id_usuario: idUsuario,
                energia: inputEnergia,
                energia_imposto: inputEnergiaImposto,
                agua: inputAgua,
                agua_imposto: inputAguaImposto,
                data: mysqlDate
            });
            const edicaoResponse = await editarCusto(userToken, custoExistente.id_custo, idUsuario, formatarNumeroParaMySQL(inputEnergia), formatarNumeroParaMySQL(inputEnergiaImposto), formatarNumeroParaMySQL(inputAgua), formatarNumeroParaMySQL(inputAguaImposto), mysqlDate);
            console.log('Resposta da edição:', edicaoResponse);
            setSnackbarVisible(true);
            setSnackbarMessage(edicaoResponse.message || 'Custo atualizado com sucesso!');

            const result = await listarCustosPorUsuario(userToken, idUsuario);
            setCustos(result.data || result);
            setValorEnergiaSemImposto(inputEnergia);
            setValorEnergiaComImposto(inputEnergiaImposto);
            setValorAguaSemImposto(inputAgua);
            setValorAguaComImposto(inputAguaImposto);
            setModalVisible(false);
        } catch (error) {
            console.error(error);
            setSnackbarVisible(true);
            setSnackbarMessage('Erro ao salvar o custo.');
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

    // Dropdown para seleção de mês/ano
    const [mesSelecionado, setMesSelecionado] = useState(meses[hoje.getMonth()].charAt(0).toUpperCase() + meses[hoje.getMonth()].slice(1));
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

    const [dropdownAberto, setDropdownAberto] = useState(false);

    const mesesAnoDropdown = () => {
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const mesAtualStr = `${meses[mesAtual].charAt(0).toUpperCase() + meses[mesAtual].slice(1)} / ${anoAtual}`;

        let uniqueMeses = custos?.reduce((acc: string[], custo: Custo) => {
            const dataCusto = new Date(custo.data_registro);
            const mesAno = `${meses[dataCusto.getMonth()].charAt(0).toUpperCase() + meses[dataCusto.getMonth()].slice(1)} / ${dataCusto.getFullYear()}`;
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
        if (custos.length === 0) return;

        const custoSelecionado = custos.find((custo) => {
            const data = new Date(custo.data_registro);
            const mesCusto = meses[data.getMonth()].charAt(0).toUpperCase() + meses[data.getMonth()].slice(1);
            const anoCusto = data.getFullYear();
            return mesCusto === mesSelecionado && anoCusto === anoSelecionado;
        });

        if (custoSelecionado) {
            const formatarValor = (valor: any) => {
                const numero = parseFloat(valor);
                if (isNaN(numero)) return '00,00';
                return numero.toFixed(2).replace('.', ',');
            };

            setValorEnergiaSemImposto(formatarValor(custoSelecionado.valor_energia_sem_impostos));
            setValorEnergiaComImposto(formatarValor(custoSelecionado.valor_energia_com_impostos));
            setValorAguaSemImposto(formatarValor(custoSelecionado.valor_agua_sem_impostos));
            setValorAguaComImposto(formatarValor(custoSelecionado.valor_agua_com_impostos));
        } else {
            setValorEnergiaSemImposto('00,00');
            setValorEnergiaComImposto('00,00');
            setValorAguaSemImposto('00,00');
            setValorAguaComImposto('00,00');
        }
    }, [mesSelecionado, anoSelecionado, custos]);


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
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Estimativa de Custos Mensais</Text>
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
                                            children="Reajustar Valores"
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
                                            disabled={mesSelecionado === mesFormatado}
                                        />
                                        {(mesSelecionado === mesFormatado) && (
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
                                    <View style={{
                                        height: "100%", width: "70%", justifyContent: "flex-start", alignItems: "center", gap: RFValue(15), backgroundColor: colors.blue[400], borderRadius: RFValue(10), position: "relative", padding: RFValue(10)
                                    }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                                            <Icon name="lightning-bolt" size={RFValue(25)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Energia</Text>
                                        </View>
                                        <View style={{ width: "100%", flexDirection: "column", gap: RFValue(5), alignItems: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>Sem Impostos</Text>
                                            <View style={{ backgroundColor: colors.blue[500], paddingHorizontal: RFValue(8), paddingVertical: RFValue(10), borderRadius: RFValue(10), alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>R$ {valorEnergiaSemImposto}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: "100%", flexDirection: "column", gap: RFValue(5), alignItems: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>Com Impostos</Text>
                                            <View style={{ backgroundColor: colors.blue[500], paddingHorizontal: RFValue(8), paddingVertical: RFValue(10), borderRadius: RFValue(10), alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>R$ {valorEnergiaComImposto}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: "35%", height: "100%", backgroundColor: colors.blue[500], justifyContent: "center", alignItems: "center" }}>
                                    <View style={{ height: "100%", width: "70%", justifyContent: "flex-start", alignItems: "center", gap: RFValue(15), backgroundColor: colors.blue[400], borderRadius: RFValue(10), position: "relative", padding: RFValue(10) }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                                            <Icon name="water" size={RFValue(25)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Água</Text>
                                        </View>
                                        <View style={{ width: "100%", flexDirection: "column", gap: RFValue(5), alignItems: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>Sem Impostos</Text>
                                            <View style={{ backgroundColor: colors.blue[500], paddingHorizontal: RFValue(8), paddingVertical: RFValue(10), borderRadius: RFValue(10), alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>R$ {valorAguaSemImposto}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: "100%", flexDirection: "column", gap: RFValue(5), alignItems: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>Com Impostos</Text>
                                            <View style={{ backgroundColor: colors.blue[500], paddingHorizontal: RFValue(8), paddingVertical: RFValue(10), borderRadius: RFValue(10), alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>R$ {valorAguaComImposto}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(23), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(15) }}>Estimativa de Custos Mensais</Text>
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
                                        height: RFValue(220), width: "48%", justifyContent: "flex-start", alignItems: "center", gap: RFValue(15), backgroundColor: colors.blue[400], borderRadius: RFValue(10), position: "relative", padding: RFValue(10)
                                    }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                                            <Icon name="lightning-bolt" size={RFValue(25)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Energia</Text>
                                        </View>
                                        <View style={{ width: "100%", flexDirection: "column", gap: RFValue(5), alignItems: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(15) }}>Sem Impostos</Text>
                                            <View style={{ backgroundColor: colors.blue[500], paddingHorizontal: RFValue(8), paddingVertical: RFValue(10), borderRadius: RFValue(10), alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(15) }}>R$ {valorEnergiaSemImposto}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: "100%", flexDirection: "column", gap: RFValue(5), alignItems: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(15) }}>Com Impostos</Text>
                                            <View style={{ backgroundColor: colors.blue[500], paddingHorizontal: RFValue(8), paddingVertical: RFValue(10), borderRadius: RFValue(10), alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(15) }}>R$ {valorEnergiaComImposto}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ height: RFValue(220), width: "48%", justifyContent: "flex-start", alignItems: "center", gap: RFValue(15), backgroundColor: colors.blue[400], borderRadius: RFValue(10), position: "relative", padding: RFValue(10) }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                                            <Icon name="water" size={RFValue(25)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Água</Text>
                                        </View>
                                        <View style={{ width: "100%", flexDirection: "column", gap: RFValue(5), alignItems: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(15) }}>Sem Impostos</Text>
                                            <View style={{ backgroundColor: colors.blue[500], paddingHorizontal: RFValue(8), paddingVertical: RFValue(10), borderRadius: RFValue(10), alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(15) }}>R$ {valorAguaSemImposto}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: "100%", flexDirection: "column", gap: RFValue(5), alignItems: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(15) }}>Com Impostos</Text>
                                            <View style={{ backgroundColor: colors.blue[500], paddingHorizontal: RFValue(8), paddingVertical: RFValue(10), borderRadius: RFValue(10), alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(15) }}>R$ {valorAguaComImposto}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ position: "relative", width: "70%", marginTop: RFValue(25) }}>
                                    <Button
                                        children="Reajustar Valores"
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
                                        disabled={mesSelecionado === mesFormatado && anoSelecionado === ano}
                                    />
                                    {(mesSelecionado === mesFormatado && anoSelecionado === ano) && (
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
                            marginBottom: isLandscape ? RFValue(5) : RFValue(50),
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
                    doubleInputMaior={true}
                    input={
                        isLandscape ?
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "78%", alignSelf: "center" }}>
                                <Input
                                    border={!!errors.inputEnergia === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Energia Sem Impostos"
                                    value={inputEnergia}
                                    styleLabel={{ color: !!errors.inputEnergia === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.inputEnergia === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v
                                            .replace(/[^0-9.]/g, '')
                                            .replace(/^([^.]*\.)|\./g, '$1')
                                            .replace(/^\./, '');
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
                                    label="Água Sem Impostos"
                                    value={inputAgua}
                                    styleLabel={{ color: !!errors.inputAgua === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.inputAgua === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v
                                            .replace(/[^0-9.]/g, '')
                                            .replace(/^([^.]*\.)|\./g, '$1')
                                            .replace(/^\./, '');
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
                                    label="Energia Sem Impostos"
                                    value={inputEnergia}
                                    styleLabel={{ color: !!errors.inputEnergia === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                    contentStyle={{ fontSize: RFValue(16) }}
                                    outlineColor={!!errors.inputEnergia === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v
                                            .replace(/[^0-9.]/g, '')
                                            .replace(/^([^.]*\.)|\./g, '$1')
                                            .replace(/^\./, '');
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
                                    helperStyle={[styles.helperText, { fontSize: RFValue(10), top: RFValue(45), left: RFValue(15) }]}
                                />
                                <Input
                                    border={!!errors.inputAgua === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Água Sem Impostos"
                                    value={inputAgua}
                                    styleLabel={{ color: !!errors.inputAgua === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                    contentStyle={{ fontSize: RFValue(16) }}
                                    outlineColor={!!errors.inputAgua === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        const apenasNumeros = v
                                            .replace(/[^0-9.]/g, '')
                                            .replace(/^([^.]*\.)|\./g, '$1')
                                            .replace(/^\./, '');
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
                                    helperStyle={[styles.helperText, { fontSize: RFValue(10), top: RFValue(45), left: RFValue(15) }]}
                                />
                            </View>
                    }
                />
            </SafeAreaView>
        </SafeAreaProvider >
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