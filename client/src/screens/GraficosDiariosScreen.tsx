// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity, FlatList } from "react-native";
import { IconButton, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import Sidebar from "../screens/SidebarModal";
import GraficoLinhaModel from '@/screens/GraficoLinhaModel';

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
import { buscarUsuarioPorEmail, listarConsumoEnergiaPorUsuario, listarConsumoAguaPorUsuario } from "@/services/api";

export default function GraficosDiariosScreen({ navigation }: any) {
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

    type ConsumoEnergia = {
        id_consumo_energia: number;
        id_eletrodomestico: number;
        tempo: number;
        tipo: string;
        data_registro: string;
    };

    type ConsumoAgua = {
        id_consumo_agua: number;
        id_atividade: number;
        tempo_uso: number;
        tipo: string;
        data_registro: string;
    };


    const [consumosEnergia, setConsumosEnergia] = useState<ConsumoEnergia[]>([]);
    const [consumosAgua, setConsumosAgua] = useState<ConsumoAgua[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsumos = async () => {
            if (idUsuario) {
                try {
                    const resultEnergia = await listarConsumoEnergiaPorUsuario(userToken, idUsuario);
                    setConsumosEnergia(resultEnergia.data || resultEnergia);

                    const resultAgua = await listarConsumoAguaPorUsuario(userToken, idUsuario);
                    setConsumosAgua(resultAgua.data || resultAgua);
                } catch (error) {
                    console.error("Erro ao buscar consumos:", error);
                    setSnackbarVisible(true);
                    setSnackbarMessage("Erro ao buscar dados de consumo.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchConsumos();
    }, [idUsuario]);

    const [semanasNoMes, setSemanasNoMes] = useState<string[][]>([]);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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

        const registros = [...consumosEnergia, ...consumosAgua];
        let uniqueMeses =
            registros.reduce((acc: string[], item) => {
                const dataItem = new Date(item.data_registro);
                const mesAno = `${meses[dataItem.getMonth()].charAt(0).toUpperCase() + meses[dataItem.getMonth()].slice(1)} / ${dataItem.getFullYear()}`;
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

    const converterTempo = (tempo: number, tipo: string) => {
        if (tipo?.toLowerCase() === "hora") {
            return tempo / 60;
        }
        return tempo;
    };

    const consumosEnergiaConvertidos = consumosEnergia.map(c => ({
        ...c,
        tempo: converterTempo(c.tempo, c.tipo)
    }));

    const consumosAguaConvertidos = consumosAgua.map(c => ({
        ...c,
        tempo_uso: converterTempo(c.tempo_uso, c.tipo)
    }));

    function gerarSemanasDoMes(ano: number, mes: number) {
        const semanas = [];
        let semanaAtual = [];
        const ultimoDia = new Date(ano, mes + 1, 0).getDate();

        for (let dia = 1; dia <= ultimoDia; dia++) {
            const dataAtual = new Date(ano, mes, dia);
            const diaSemana = dataAtual.getDay();

            semanaAtual.push(String(dia));

            if (diaSemana === 6 || dia === ultimoDia) {
                semanas.push(semanaAtual);
                semanaAtual = [];
            }
        }

        return semanas;
    }

    function somarConsumoPorSemana(
        semanas: string[][],
        consumos: any[],
        mesIndex: number,
        anoSelecionado: number
    ) {
        const consumoSemanal = semanas.map(semana => semana.map(() => 0));

        consumos.forEach(consumo => {
            const data = new Date(consumo.data_registro);
            const mes = data.getMonth() + 1;
            const ano = data.getFullYear();

            if (mes === Number(mesIndex) && ano === anoSelecionado) {
                const dia = data.getDate().toString();

                const tempo = consumo.tempo ?? consumo.tempo_uso ?? 0;
                const tipoTempo = consumo.tipoTempo ?? consumo.tipo_tempo ?? "min";
                const tipo = consumo.tipo ? "energia" : "agua";

                let consumoFinal = 0;

                if (tipo === "agua") {
                    const tempoMin = tempo / 60;
                    consumoFinal = tempoMin * (consumo.consumo_litros_minuto ?? 0);
                } else if (tipo === "energia") {
                    const tempoHora = tempo / 60;
                    consumoFinal = tempoHora * (consumo.consumo_kwh_hora ?? 0);
                    consumoFinal = parseFloat(consumoFinal.toFixed(3));
                }

                semanas.forEach((semana, i) => {
                    const idxDia = semana.indexOf(dia);
                    if (idxDia !== -1) {
                        consumoSemanal[i][idxDia] = parseFloat(
                            (consumoSemanal[i][idxDia] + consumoFinal).toFixed(3)
                        );
                    }
                });
            }
        });

        return consumoSemanal;
    }

    const [consumosEnergiaPorSemana, setConsumosEnergiaPorSemana] = useState<number[][]>([]);
    const [consumosAguaPorSemana, setConsumosAguaPorSemana] = useState<number[][]>([]);

    useEffect(() => {
        const mesIndex = meses.findIndex(m => m.toLowerCase() === mesSelecionado.toLowerCase());
        const semanas = gerarSemanasDoMes(anoSelecionado, mesIndex);
        setSemanasNoMes(semanas);

        const consumoEnergiaSemanal = somarConsumoPorSemana(semanas, consumosEnergia, mesIndex + 1, anoSelecionado);
        const consumoAguaSemanal = somarConsumoPorSemana(semanas, consumosAgua, mesIndex + 1, anoSelecionado);

        setConsumosEnergiaPorSemana(consumoEnergiaSemanal);
        setConsumosAguaPorSemana(consumoAguaSemanal);
    }, [mesSelecionado, anoSelecionado, loading]);

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
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Gráficos Diários</Text>
                                <Icon
                                    name="close-circle"
                                    color={colors.white}
                                    size={RFValue(23)}
                                    onPress={() => { navigation.navigate('Graficos') }}
                                    style={{ position: "absolute", right: 0 }}
                                />
                            </View>
                            <View style={{ width: "100%", backgroundColor: colors.blue[500], justifyContent: "flex-start", alignItems: "center", flexDirection: "column", marginTop: RFValue(15), paddingHorizontal: RFValue(10) }}>
                                <View style={{ width: "100%", backgroundColor: colors.blue[500], alignItems: "center", marginBottom: RFValue(10), flexDirection: "row", justifyContent: "space-between", zIndex: 5000 }}>
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

                                    <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder }}>
                                        {dataFormatada}
                                    </Text>
                                </View>

                                <ScrollView style={{ width: "100%", maxHeight: RFValue(180) }}>
                                    {semanasNoMes.length === 0 && (
                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, padding: RFValue(10) }}>
                                            Nenhuma semana encontrada para o mês selecionado.
                                        </Text>
                                    )}

                                    {loading ? (
                                        <ActivityIndicator animating={true} size="large" color={colors.white} />
                                    ) : (
                                        semanasNoMes
                                            .map((semana, idx) => {
                                                const mesIndex = meses.findIndex(m => m.toLowerCase() === mesSelecionado.toLowerCase());
                                                const mesNumero = mesIndex + 1;

                                                const semanaFiltrada =
                                                    anoSelecionado === ano && mesNumero === hoje.getMonth() + 1
                                                        ? semana.filter((d) => Number(d) <= hoje.getDate())
                                                        : semana;

                                                return { semanaFiltrada, idx, mesNumero };
                                            })
                                            .filter(({ semanaFiltrada }) => semanaFiltrada.length > 0)
                                            .map(({ semanaFiltrada, idx, mesNumero }) => {
                                                const tamanhoSemana = Math.max(1, semanaFiltrada.length);

                                                const energiaValsRaw = consumosEnergiaPorSemana[idx] ?? [];
                                                const aguaValsRaw = consumosAguaPorSemana[idx] ?? [];

                                                const energiaVals = energiaValsRaw.length
                                                    ? energiaValsRaw.slice(0, tamanhoSemana).concat(Array(Math.max(0, tamanhoSemana - energiaValsRaw.length)).fill(0))
                                                    : Array(tamanhoSemana).fill(0);

                                                const aguaVals = aguaValsRaw.length
                                                    ? aguaValsRaw.slice(0, tamanhoSemana).concat(Array(Math.max(0, tamanhoSemana - aguaValsRaw.length)).fill(0))
                                                    : Array(tamanhoSemana).fill(0);

                                                const inicioDia = semanaFiltrada[0];
                                                const fimDia = semanaFiltrada[semanaFiltrada.length - 1];

                                                const textoIntervalo = inicioDia === fimDia
                                                    ? `${inicioDia}/${mesNumero}`
                                                    : `${inicioDia}/${mesNumero} - ${fimDia}/${mesNumero}`;

                                                return (
                                                    <View
                                                        key={`semana-${idx}`}
                                                        style={{
                                                            width: "100%",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            backgroundColor: colors.blue[400],
                                                            borderRadius: RFValue(10),
                                                            marginBottom: RFValue(15),
                                                            padding: RFValue(10),
                                                        }}
                                                    >
                                                        <Text style={{
                                                            fontSize: RFValue(10),
                                                            color: colors.white,
                                                            fontFamily: fontFamily.inder,
                                                            textAlign: "left",
                                                            width: "100%"
                                                        }}>
                                                            {idx + 1}° semana — {textoIntervalo}
                                                        </Text>

                                                        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: RFValue(10) }}>
                                                            <View style={{ width: "49%", justifyContent: "flex-start", alignItems: "center", flexDirection: "column" }}>
                                                                <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(120) }}>
                                                                    <GraficoLinhaModel
                                                                        labels={semanaFiltrada.map((d) => `${d}/${mesNumero}`)}
                                                                        valores={energiaVals}
                                                                        cor={colors.yellow[100]}
                                                                        corSecundaria={colors.yellow[200]}
                                                                        tamanho={"grande"}
                                                                    />
                                                                </View>

                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-10) }}>Energia (kWh)</Text>

                                                                <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.blue[300], borderRadius: RFValue(10), padding: RFValue(10), marginTop: RFValue(10) }}>
                                                                    {semanaFiltrada.map((dia, i) => (
                                                                        <Text key={i} style={{ fontSize: RFValue(8), color: colors.white, fontFamily: fontFamily.inder, textAlign: "left", width: "100%" }}>
                                                                            {`${dia}/${mesNumero} — ${energiaVals[i]?.toFixed?.(3) ?? "0.000"} kWh`}
                                                                        </Text>
                                                                    ))}
                                                                </View>
                                                            </View>

                                                            <View style={{ width: "49%", justifyContent: "flex-start", alignItems: "center", flexDirection: "column" }}>
                                                                <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(120) }}>
                                                                    <GraficoLinhaModel
                                                                        labels={semanaFiltrada.map((d) => `${d}/${mesNumero}`)}
                                                                        valores={aguaVals}
                                                                        cor={colors.blue[100]}
                                                                        corSecundaria={colors.blue[200]}
                                                                        tamanho={"grande"}
                                                                    />
                                                                </View>

                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-10) }}>Água (Litros)</Text>

                                                                <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.blue[300], borderRadius: RFValue(10), padding: RFValue(10), marginTop: RFValue(10) }}>
                                                                    {semanaFiltrada.map((dia, i) => (
                                                                        <Text key={i} style={{ fontSize: RFValue(8), color: colors.white, fontFamily: fontFamily.inder, textAlign: "left", width: "100%" }}>
                                                                            {`${dia}/${mesNumero} — ${aguaVals[i]?.toFixed?.(1) ?? "0.0"} L`}
                                                                        </Text>
                                                                    ))}
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                );
                                            })
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300], position: "relative" }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Gráficos Diários</Text>

                                <Icon
                                    name="close-circle"
                                    color={colors.white}
                                    size={RFValue(30)}
                                    onPress={() => {navigation.navigate('Graficos')}}
                                    style={{ position: "absolute", right: 0, top: RFValue(5) }}
                                />
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30) }}>
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
                                <ScrollView style={{ width: "100%", maxHeight: RFValue(400) }}>
                                    {semanasNoMes.length === 0 && (
                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, padding: RFValue(10) }}>
                                            Nenhuma semana encontrada para o mês selecionado.
                                        </Text>
                                    )}

                                    {loading ? (
                                        <ActivityIndicator animating={true} size="large" color={colors.white} />
                                    ) : (
                                        semanasNoMes
                                            .map((semana, idx) => {
                                                const mesIndex = meses.findIndex(m => m.toLowerCase() === mesSelecionado.toLowerCase());
                                                const mesNumero = mesIndex + 1;

                                                const semanaFiltrada =
                                                    anoSelecionado === ano && mesNumero === hoje.getMonth() + 1
                                                        ? semana.filter((d) => Number(d) <= hoje.getDate())
                                                        : semana;

                                                return { semanaFiltrada, idx, mesNumero };
                                            })
                                            .filter(({ semanaFiltrada }) => semanaFiltrada.length > 0)
                                            .map(({ semanaFiltrada, idx, mesNumero }) => {
                                                const tamanhoSemana = Math.max(1, semanaFiltrada.length);

                                                const energiaValsRaw = consumosEnergiaPorSemana[idx] ?? [];
                                                const aguaValsRaw = consumosAguaPorSemana[idx] ?? [];

                                                const energiaVals = energiaValsRaw.length
                                                    ? energiaValsRaw.slice(0, tamanhoSemana).concat(Array(Math.max(0, tamanhoSemana - energiaValsRaw.length)).fill(0))
                                                    : Array(tamanhoSemana).fill(0);

                                                const aguaVals = aguaValsRaw.length
                                                    ? aguaValsRaw.slice(0, tamanhoSemana).concat(Array(Math.max(0, tamanhoSemana - aguaValsRaw.length)).fill(0))
                                                    : Array(tamanhoSemana).fill(0);

                                                const inicioDia = semanaFiltrada[0];
                                                const fimDia = semanaFiltrada[semanaFiltrada.length - 1];

                                                const textoIntervalo = inicioDia === fimDia
                                                    ? `${inicioDia}/${mesNumero}`
                                                    : `${inicioDia}/${mesNumero} - ${fimDia}/${mesNumero}`;

                                                return (
                                                    <View
                                                        key={`semana-${idx}`}
                                                        style={{
                                                            width: "100%",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            backgroundColor: colors.blue[400],
                                                            borderRadius: RFValue(10),
                                                            marginBottom: RFValue(20),
                                                            padding: RFValue(10),
                                                        }}
                                                    >
                                                        <Text style={{
                                                            fontSize: RFValue(14),
                                                            color: colors.white,
                                                            fontFamily: fontFamily.inder,
                                                            textAlign: "left",
                                                            width: "100%"
                                                        }}>
                                                            {idx + 1}° semana — {textoIntervalo}
                                                        </Text>

                                                        <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(140) }}>
                                                            <GraficoLinhaModel
                                                                labels={semanaFiltrada.map((d) => `${d}/${mesNumero}`)}
                                                                valores={energiaVals}
                                                                cor={colors.yellow[100]}
                                                                corSecundaria={colors.yellow[200]}
                                                                tamanho={"grande"}
                                                            />
                                                        </View>

                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(14), marginTop: RFValue(-15) }}>Energia (kWh)</Text>

                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.blue[300], borderRadius: RFValue(10), padding: RFValue(10), marginTop: RFValue(10) }}>
                                                            {semanaFiltrada.map((dia, i) => (
                                                                <Text key={i} style={{ fontSize: RFValue(12), color: colors.white, fontFamily: fontFamily.inder, textAlign: "left", width: "100%" }}>
                                                                    {`${dia}/${mesNumero} — ${energiaVals[i]?.toFixed?.(3) ?? "0.000"} kWh`}
                                                                </Text>
                                                            ))}
                                                        </View>

                                                        <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(140) }}>
                                                            <GraficoLinhaModel
                                                                labels={semanaFiltrada.map((d) => `${d}/${mesNumero}`)}
                                                                valores={aguaVals}
                                                                cor={colors.blue[100]}
                                                                corSecundaria={colors.blue[200]}
                                                                tamanho={"grande"}
                                                            />
                                                        </View>

                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(14), marginTop: RFValue(-15) }}>Água (Litros)</Text>

                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.blue[300], borderRadius: RFValue(10), padding: RFValue(10), marginTop: RFValue(10) }}>
                                                            {semanaFiltrada.map((dia, i) => (
                                                                <Text key={i} style={{ fontSize: RFValue(12), color: colors.white, fontFamily: fontFamily.inder, textAlign: "left", width: "100%" }}>
                                                                    {`${dia}/${mesNumero} — ${aguaVals[i]?.toFixed?.(1) ?? "0.0"} L`}
                                                                </Text>
                                                            ))}
                                                        </View>
                                                    </View>
                                                );
                                            })
                                    )}
                                </ScrollView>
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