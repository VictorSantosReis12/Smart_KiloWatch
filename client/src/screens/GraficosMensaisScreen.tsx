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

export default function GraficosMensaisScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    });

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const alturaCalculada = height * 0.82;

    const { userData, userToken } = useContext(AuthContext);
    const idUsuario = userData?.id_usuario || '';

    const [consumosEnergia, setConsumosEnergia] = useState<any[]>([]);
    const [consumosAgua, setConsumosAgua] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const hoje = new Date();
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
    const [dadosSemestres, setDadosSemestres] = useState<any>(null);

    // 🔹 Buscar dados do usuário
    useEffect(() => {
        const fetchConsumos = async () => {
            if (!idUsuario) return;

            try {
                const resultEnergia = await listarConsumoEnergiaPorUsuario(userToken, idUsuario);
                setConsumosEnergia(resultEnergia.data || resultEnergia);

                const resultAgua = await listarConsumoAguaPorUsuario(userToken, idUsuario);
                setConsumosAgua(resultAgua.data || resultAgua);
            } catch (error) {
                console.error("Erro ao buscar consumos:", error);
                setSnackbarMessage("Erro ao buscar dados de consumo.");
                setSnackbarVisible(true);
            } finally {
                setLoading(false);
            }
        };
        fetchConsumos();
    }, [idUsuario]);

    const dia = hoje.getDate();
    const mes = meses[hoje.getMonth()];
    const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const ano = hoje.getFullYear();

    const dataFormatada = `${dia} de ${mesFormatado} de ${ano}`;

    // 🔹 Estado para controlar o dropdown e o ano selecionado
    const [dropdownAberto, setDropdownAberto] = useState(false);

    // 🔹 Função que retorna apenas os anos em que há consumo (energia ou água)
    const anosDisponiveis = () => {
        const registros = [...consumosEnergia, ...consumosAgua];
        let anos = registros.reduce((acc: number[], item) => {
            const ano = new Date(item.data_registro).getFullYear();
            if (!acc.includes(ano)) acc.push(ano);
            return acc;
        }, []);

        const anoAtual = hoje.getFullYear();
        if (!anos.includes(anoAtual)) anos.push(anoAtual);

        return anos.sort((a, b) => b - a); // ordena decrescente
    };

    // 🔹 Alternar o estado de aberto/fechado do dropdown
    const toggleDropdown = () => {
        setDropdownAberto(!dropdownAberto);
    };

    // 🔹 Função chamada ao selecionar um ano
    const selecionarAno = (ano: number) => {
        setAnoSelecionado(ano);
        setDropdownAberto(false);
    };


    // 🔹 Converter tempo de uso para minutos/horas
    const converterTempo = (tempo: number, tipo: string) => {
        if (tipo?.toLowerCase() === "hora") return tempo / 60;
        return tempo;
    };

    // 🔹 Somar consumo mensal
    function somarConsumoPorMes(consumos: any[], anoSelecionado: number) {
        const mesesDoAno = Array(12).fill(0);

        consumos.forEach((consumo) => {
            const data = new Date(consumo.data_registro);
            const mes = data.getMonth();
            const ano = data.getFullYear();

            if (ano === anoSelecionado) {
                const tempo = consumo.tempo ?? consumo.tempo_uso ?? 0;
                const tipo = consumo.id_eletrodomestico ? "energia" : "agua";

                let consumoFinal = 0;
                if (tipo === "agua") {
                    const tempoMin = tempo / 60;
                    consumoFinal = tempoMin * (consumo.consumo_litros_minuto ?? 0);
                } else {
                    const tempoHora = tempo / 60;
                    consumoFinal = tempoHora * (consumo.consumo_kwh_hora ?? 0);
                }

                mesesDoAno[mes] += consumoFinal;
            }
        });

        return mesesDoAno.map(v => parseFloat(v.toFixed(3)));
    }

    // 🔹 Gerar dados por semestre
    const gerarSemestres = (anoSelecionado: number) => {
        const energiaPorMes = somarConsumoPorMes(consumosEnergia, anoSelecionado);
        const aguaPorMes = somarConsumoPorMes(consumosAgua, anoSelecionado);

        const mesAtual = hoje.getMonth();
        const limite = anoSelecionado === hoje.getFullYear() ? mesAtual + 1 : 12;

        const primeiroSemestreMeses = meses.slice(0, Math.min(6, limite));
        const segundoSemestreMeses = meses.slice(6, limite);

        return {
            primeiro: {
                meses: primeiroSemestreMeses,
                energia: energiaPorMes.slice(0, primeiroSemestreMeses.length),
                agua: aguaPorMes.slice(0, primeiroSemestreMeses.length),
            },
            segundo: {
                meses: segundoSemestreMeses,
                energia: energiaPorMes.slice(6, limite),
                agua: aguaPorMes.slice(6, limite),
            },
        };
    };

    // 🔹 Atualiza os gráficos sempre que o ano ou os dados mudarem
    useEffect(() => {
        if (consumosEnergia.length || consumosAgua.length) {
            const semestres = gerarSemestres(anoSelecionado);
            setDadosSemestres(semestres);
        }
    }, [anoSelecionado, consumosEnergia, consumosAgua]);

    if (!fontsLoaded) return null;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300], position: "relative" }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Gráficos Mensais</Text>
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
                                        <TouchableOpacity style={{ backgroundColor: colors.blue[500], borderLeftWidth: RFValue(1), borderRightWidth: RFValue(1), borderTopWidth: RFValue(1), borderBottomWidth: dropdownAberto ? 0 : RFValue(1), borderColor: colors.white, paddingHorizontal: RFValue(5), paddingVertical: RFValue(3), flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: RFValue(120) }} onPress={() => { toggleDropdown() }} activeOpacity={1}>
                                            <Text style={{ fontSize: RFValue(10), color: colors.yellow[200], fontFamily: fontFamily.inder }}>{anoSelecionado}</Text>
                                            <Ionicons name={dropdownAberto ? "chevron-up" : "chevron-down"} size={RFValue(10)} color={colors.yellow[200]} />
                                        </TouchableOpacity>

                                        {dropdownAberto && (
                                            <ScrollView style={{ maxHeight: RFValue(69.5), width: RFValue(120), position: "absolute", top: RFValue(20), left: 0, right: 0, zIndex: 5000, borderBottomWidth: RFValue(1), borderColor: colors.white }} showsVerticalScrollIndicator={false}>
                                                <FlatList
                                                    data={anosDisponiveis()}
                                                    keyExtractor={(item) => item.toString()}
                                                    renderItem={({ item, index }) => {
                                                        const backgroundColor = index % 2 === 0 ? colors.blue[300] : colors.blue[500];
                                                        const data = anosDisponiveis();
                                                        const isLast = index === data.length - 1;
                                                        return (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    selecionarAno(item);
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
                                    {loading ? (
                                        <ActivityIndicator animating={true} size="large" color={colors.white} />
                                    ) : (
                                        <>
                                            <View style={{
                                                width: "100%",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: colors.blue[400],
                                                borderRadius: RFValue(10),
                                                marginBottom: RFValue(15),
                                                padding: RFValue(10),
                                            }}>
                                                <Text style={{
                                                    fontSize: RFValue(10),
                                                    color: colors.white,
                                                    fontFamily: fontFamily.inder,
                                                    textAlign: "left",
                                                    width: "100%"
                                                }}>
                                                    1° semestre
                                                </Text>

                                                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: RFValue(10) }}>
                                                    <View style={{ width: "49%", justifyContent: "flex-start", alignItems: "center", flexDirection: "column" }}>
                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(120) }}>
                                                            <GraficoLinhaModel
                                                                labels={dadosSemestres?.primeiro.meses.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))}
                                                                valores={dadosSemestres?.primeiro.energia || []}
                                                                cor={colors.yellow[100]}
                                                                corSecundaria={colors.yellow[200]}
                                                                tamanho={"grande"}
                                                            />
                                                        </View>

                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-10) }}>Energia (kWh)</Text>

                                                        <View
                                                            style={{
                                                                width: "100%",
                                                                justifyContent: "flex-start",
                                                                alignItems: "center",
                                                                backgroundColor: colors.blue[300],
                                                                borderRadius: RFValue(10),
                                                                padding: RFValue(10),
                                                                marginTop: RFValue(10),
                                                            }}
                                                        >
                                                            {dadosSemestres?.primeiro.meses.map((mes: string, i: number) => (
                                                                <Text
                                                                    key={i}
                                                                    style={{
                                                                        fontSize: RFValue(9),
                                                                        color: colors.white,
                                                                        fontFamily: fontFamily.inder,
                                                                        textAlign: "left",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    {`${mes.charAt(0).toUpperCase() + mes.slice(1)} — ${dadosSemestres?.primeiro.energia[i]?.toFixed?.(3) ?? "0.000"
                                                                        } kWh`}
                                                                </Text>
                                                            ))}
                                                        </View>
                                                    </View>

                                                    <View style={{ width: "49%", justifyContent: "flex-start", alignItems: "center", flexDirection: "column" }}>
                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(120) }}>
                                                            <GraficoLinhaModel
                                                                labels={dadosSemestres?.primeiro.meses.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))}
                                                                valores={dadosSemestres?.primeiro.agua || []}
                                                                cor={colors.blue[100]}
                                                                corSecundaria={colors.blue[200]}
                                                                tamanho={"grande"}
                                                            />
                                                        </View>

                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-10) }}>Água (Litros)</Text>

                                                        <View
                                                            style={{
                                                                width: "100%",
                                                                justifyContent: "flex-start",
                                                                alignItems: "center",
                                                                backgroundColor: colors.blue[300],
                                                                borderRadius: RFValue(10),
                                                                padding: RFValue(10),
                                                                marginTop: RFValue(10),
                                                            }}
                                                        >
                                                            {dadosSemestres?.primeiro.meses.map((mes: string, i: number) => (
                                                                <Text
                                                                    key={i}
                                                                    style={{
                                                                        fontSize: RFValue(9),
                                                                        color: colors.white,
                                                                        fontFamily: fontFamily.inder,
                                                                        textAlign: "left",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    {`${mes.charAt(0).toUpperCase() + mes.slice(1)} — ${dadosSemestres?.primeiro.agua[i]?.toFixed?.(1) ?? "0.0"
                                                                        } L`}
                                                                </Text>
                                                            ))}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{
                                                width: "100%",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: colors.blue[400],
                                                borderRadius: RFValue(10),
                                                marginBottom: RFValue(15),
                                                padding: RFValue(10),
                                            }}>
                                                <Text style={{
                                                    fontSize: RFValue(10),
                                                    color: colors.white,
                                                    fontFamily: fontFamily.inder,
                                                    textAlign: "left",
                                                    width: "100%"
                                                }}>
                                                    2° semestre
                                                </Text>

                                                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: RFValue(10) }}>
                                                    <View style={{ width: "49%", justifyContent: "flex-start", alignItems: "center", flexDirection: "column" }}>
                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(120) }}>
                                                            <GraficoLinhaModel
                                                                labels={dadosSemestres?.segundo.meses.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))}
                                                                valores={dadosSemestres?.segundo.energia || []}
                                                                cor={colors.yellow[100]}
                                                                corSecundaria={colors.yellow[200]}
                                                                tamanho={"grande"}
                                                            />
                                                        </View>

                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-10) }}>Energia (kWh)</Text>

                                                        <View
                                                            style={{
                                                                width: "100%",
                                                                justifyContent: "flex-start",
                                                                alignItems: "center",
                                                                backgroundColor: colors.blue[300],
                                                                borderRadius: RFValue(10),
                                                                padding: RFValue(10),
                                                                marginTop: RFValue(10),
                                                            }}
                                                        >
                                                            {dadosSemestres?.segundo.meses.map((mes: string, i: number) => (
                                                                <Text
                                                                    key={i}
                                                                    style={{
                                                                        fontSize: RFValue(9),
                                                                        color: colors.white,
                                                                        fontFamily: fontFamily.inder,
                                                                        textAlign: "left",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    {`${mes.charAt(0).toUpperCase() + mes.slice(1)} — ${dadosSemestres?.segundo.energia[i]?.toFixed?.(3) ?? "0.000"
                                                                        } kWh`}
                                                                </Text>
                                                            ))}
                                                        </View>
                                                    </View>

                                                    <View style={{ width: "49%", justifyContent: "flex-start", alignItems: "center", flexDirection: "column" }}>
                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(120) }}>
                                                            <GraficoLinhaModel
                                                                labels={dadosSemestres?.segundo.meses.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))}
                                                                valores={dadosSemestres?.segundo.agua || []}
                                                                cor={colors.blue[100]}
                                                                corSecundaria={colors.blue[200]}
                                                                tamanho={"grande"}
                                                            />
                                                        </View>

                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-10) }}>Água (Litros)</Text>

                                                        <View
                                                            style={{
                                                                width: "100%",
                                                                justifyContent: "flex-start",
                                                                alignItems: "center",
                                                                backgroundColor: colors.blue[300],
                                                                borderRadius: RFValue(10),
                                                                padding: RFValue(10),
                                                                marginTop: RFValue(10),
                                                            }}
                                                        >
                                                            {dadosSemestres?.segundo.meses.map((mes: string, i: number) => (
                                                                <Text
                                                                    key={i}
                                                                    style={{
                                                                        fontSize: RFValue(9),
                                                                        color: colors.white,
                                                                        fontFamily: fontFamily.inder,
                                                                        textAlign: "left",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    {`${mes.charAt(0).toUpperCase() + mes.slice(1)} — ${dadosSemestres?.segundo.agua[i]?.toFixed?.(1) ?? "0.0"
                                                                        } L`}
                                                                </Text>
                                                            ))}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </>
                                    )}
                                </ScrollView>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300], position: "relative" }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Gráficos Mensais</Text>

                                <Icon
                                    name="close-circle"
                                    color={colors.white}
                                    size={RFValue(30)}
                                    onPress={() => { navigation.navigate('Graficos') }}
                                    style={{ position: "absolute", right: 0, top: RFValue(5) }}
                                />
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30) }}>
                                <View style={{ width: "100%", backgroundColor: colors.blue[500], justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginBottom: RFValue(30) }}>
                                    <View style={{ position: "relative" }}>
                                        <TouchableOpacity style={{ backgroundColor: colors.blue[500], borderLeftWidth: RFValue(1), borderRightWidth: RFValue(1), borderTopWidth: RFValue(1), borderBottomWidth: dropdownAberto ? 0 : RFValue(1), borderColor: colors.white, paddingHorizontal: RFValue(5), paddingVertical: RFValue(3), flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: RFValue(140) }} onPress={() => { toggleDropdown() }} activeOpacity={1}>
                                            <Text style={{ fontSize: RFValue(13), color: colors.yellow[200], fontFamily: fontFamily.inder }}>{anoSelecionado}</Text>
                                            <Ionicons name={dropdownAberto ? "chevron-up" : "chevron-down"} size={RFValue(15)} color={colors.yellow[200]} />
                                        </TouchableOpacity>

                                        {dropdownAberto && (
                                            <ScrollView style={{ maxHeight: RFValue(80), width: RFValue(140), position: "absolute", top: RFValue(24), left: 0, right: 0, zIndex: 5000, borderBottomWidth: RFValue(1), borderColor: colors.white }} showsVerticalScrollIndicator={false}>
                                                <FlatList
                                                    data={anosDisponiveis()}
                                                    keyExtractor={(item) => item.toString()}
                                                    scrollEnabled={false}
                                                    renderItem={({ item, index }) => {
                                                        const backgroundColor = index % 2 === 0 ? colors.blue[300] : colors.blue[500];
                                                        const data = anosDisponiveis();
                                                        const isLast = index === data.length - 1;
                                                        return (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    selecionarAno(item);
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
                                    {loading ? (
                                        <ActivityIndicator animating={true} size="large" color={colors.white} />
                                    ) : (
                                        <>
                                            <View
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
                                                    1° semestre
                                                </Text>

                                                <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(140) }}>
                                                    <GraficoLinhaModel
                                                        labels={dadosSemestres?.primeiro.meses.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))}
                                                        valores={dadosSemestres?.primeiro.energia || []}
                                                        cor={colors.yellow[100]}
                                                        corSecundaria={colors.yellow[200]}
                                                        tamanho={"grande"}
                                                    />
                                                </View>

                                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(14), marginTop: RFValue(-15) }}>Energia (kWh)</Text>

                                                <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.blue[300], borderRadius: RFValue(10), padding: RFValue(10), marginTop: RFValue(10) }}>
                                                    {dadosSemestres?.primeiro.meses.map((mes: string, i: number) => (
                                                        <Text
                                                            key={i}
                                                            style={{
                                                                fontSize: RFValue(12),
                                                                color: colors.white,
                                                                fontFamily: fontFamily.inder,
                                                                textAlign: "left",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {`${mes.charAt(0).toUpperCase() + mes.slice(1)} — ${dadosSemestres?.primeiro.energia[i]?.toFixed?.(3) ?? "0.000"
                                                                } kWh`}
                                                        </Text>
                                                    ))}
                                                </View>

                                                <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(140) }}>
                                                    <GraficoLinhaModel
                                                        labels={dadosSemestres?.primeiro.meses.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))}
                                                        valores={dadosSemestres?.primeiro.agua || []}
                                                        cor={colors.blue[100]}
                                                        corSecundaria={colors.blue[200]}
                                                        tamanho={"grande"}
                                                    />
                                                </View>

                                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(14), marginTop: RFValue(-15) }}>Água (Litros)</Text>

                                                <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.blue[300], borderRadius: RFValue(10), padding: RFValue(10), marginTop: RFValue(10) }}>
                                                    {dadosSemestres?.primeiro.meses.map((mes: string, i: number) => (
                                                        <Text
                                                            key={i}
                                                            style={{
                                                                fontSize: RFValue(12),
                                                                color: colors.white,
                                                                fontFamily: fontFamily.inder,
                                                                textAlign: "left",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {`${mes.charAt(0).toUpperCase() + mes.slice(1)} — ${dadosSemestres?.primeiro.agua[i]?.toFixed?.(1) ?? "0.0"
                                                                } L`}
                                                        </Text>
                                                    ))}
                                                </View>
                                            </View>

                                            <View
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
                                                    2° semestre
                                                </Text>

                                                <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(140) }}>
                                                    <GraficoLinhaModel
                                                        labels={dadosSemestres?.segundo.meses.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))}
                                                        valores={dadosSemestres?.segundo.energia || []}
                                                        cor={colors.yellow[100]}
                                                        corSecundaria={colors.yellow[200]}
                                                        tamanho={"grande"}
                                                    />
                                                </View>

                                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(14), marginTop: RFValue(-15) }}>Energia (kWh)</Text>

                                                <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.blue[300], borderRadius: RFValue(10), padding: RFValue(10), marginTop: RFValue(10) }}>
                                                    {dadosSemestres?.segundo.meses.map((mes: string, i: number) => (
                                                        <Text
                                                            key={i}
                                                            style={{
                                                                fontSize: RFValue(12),
                                                                color: colors.white,
                                                                fontFamily: fontFamily.inder,
                                                                textAlign: "left",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {`${mes.charAt(0).toUpperCase() + mes.slice(1)} — ${dadosSemestres?.segundo.energia[i]?.toFixed?.(3) ?? "0.000"
                                                                } kWh`}
                                                        </Text>
                                                    ))}
                                                </View>

                                                <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(140) }}>
                                                    <GraficoLinhaModel
                                                        labels={dadosSemestres?.segundo.meses.map((m: string) => m.charAt(0).toUpperCase() + m.slice(1))}
                                                        valores={dadosSemestres?.segundo.agua || []}
                                                        cor={colors.blue[100]}
                                                        corSecundaria={colors.blue[200]}
                                                        tamanho={"grande"}
                                                    />
                                                </View>

                                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(14), marginTop: RFValue(-15) }}>Água (Litros)</Text>

                                                <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.blue[300], borderRadius: RFValue(10), padding: RFValue(10), marginTop: RFValue(10) }}>
                                                    {dadosSemestres?.segundo.meses.map((mes: string, i: number) => (
                                                        <Text
                                                            key={i}
                                                            style={{
                                                                fontSize: RFValue(12),
                                                                color: colors.white,
                                                                fontFamily: fontFamily.inder,
                                                                textAlign: "left",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {`${mes.charAt(0).toUpperCase() + mes.slice(1)} — ${dadosSemestres?.segundo.agua[i]?.toFixed?.(1) ?? "0.0"
                                                                } L`}
                                                        </Text>
                                                    ))}
                                                </View>
                                            </View>
                                        </>
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