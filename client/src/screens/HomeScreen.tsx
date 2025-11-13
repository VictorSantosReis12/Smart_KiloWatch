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
import * as NavigationBar from 'expo-navigation-bar';

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
import { listarResidenciasPorUsuario, excluirResidencia, listarMetasPorUsuario, listarConsumoEnergiaPorUsuario, listarConsumoAguaPorUsuario, listarEletrodomesticosPorUsuario, listarAtividadesPorUsuario, listarCustosPorUsuario, cadastrarCusto, editarCusto, selecionarTarifaPorEstado, selecionarResidenciaPorId } from "@/services/api";

// Gráficos
import GraficoDonutModel from '@/screens/GraficoDonutModel';
import GraficoLinhaModel from '@/screens/GraficoLinhaModel';

export default function HomeScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const alturaCalculada = height * 0.82;

    // Estados
    const { userData, userToken } = useContext(AuthContext);
    const idUsuario = userData?.id_usuario || '';

    // Estimativa de Custos Mensais
    const definirValorEnergia = "13,00";
    const [valorEnergia, setValorEnergia] = useState(definirValorEnergia);
    const definirValorAgua = "22,00";
    const [valorAgua, setValorAgua] = useState(definirValorAgua);

    // Listas
    const [hasEletrodomestico, setHasEletrodomestico] = useState(false);
    const [hasAtividade, setHasAtividade] = useState(false);

    // Metas de Consumo
    const [metaEnergia, setMetaEnergia] = useState(0);
    const [metaAgua, setMetaAgua] = useState(0);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#04498E');
        NavigationBar.setButtonStyleAsync('light');
    }, []);

    // Lógica das Metas de Consumo
    useEffect(() => {
        const fetchMetasAtuais = async () => {
            if (!idUsuario) return;

            try {
                const result: any = await listarMetasPorUsuario(userToken, idUsuario);
                if (result && result.success && Array.isArray(result.data)) {
                    const metas = result.data;
                    const hoje = new Date();
                    const mesIndex = hoje.getMonth();
                    const ano = hoje.getFullYear();

                    const metaAtual = metas.find((m: any) => {
                        const dataMeta = new Date(m.data_registro);
                        return dataMeta.getMonth() === mesIndex && dataMeta.getFullYear() === ano;
                    });

                    if (metaAtual) {
                        setMetaEnergia(Number(metaAtual.meta_energia) || 0);
                        setMetaAgua(Number(metaAtual.meta_agua) || 0);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar metas atuais:', error);
            }
        };

        fetchMetasAtuais();
    }, [idUsuario, userToken]);

    // Lógica dos Gráficos de Consumo
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
    const [loadingGrafico, setLoadingGrafico] = useState(true);

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
                } finally {
                    setLoadingGrafico(false);
                }
            }
        };

        fetchConsumos();
    }, [idUsuario]);

    const [ultimos6Meses, setUltimos6Meses] = useState([]);
    const [valoresEnergiaMeses, setValoresEnergiaMeses] = useState([]);
    const [valoresAguaMeses, setValoresAguaMeses] = useState([]);

    useEffect(() => {
        const hoje = new Date();

        const dias = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date(hoje);
            d.setDate(hoje.getDate() - (5 - i));
            return d;
        });

        const meses = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date(hoje);
            d.setMonth(hoje.getMonth() - (5 - i));
            return d;
        });

        function somarConsumoPorPeriodo(consumos: any[], periodos: Date[], tipo: "dia" | "mes") {
            return periodos.map((dataPeriodo) => {
                const mesmoDia = tipo === "dia";
                const filtrados = consumos.filter((c) => {
                    const data = new Date(c.data_registro);
                    return mesmoDia
                        ? data.toDateString() === dataPeriodo.toDateString()
                        : data.getMonth() === dataPeriodo.getMonth() &&
                        data.getFullYear() === dataPeriodo.getFullYear();
                });

                let total = 0;
                filtrados.forEach((c) => {
                    const tempo = c.tempo ?? c.tempo_uso ?? 0;
                    const tipoTempo = c.tipoTempo ?? c.tipo ?? "min";
                    if (c.consumo_kwh_hora) {
                        const tempoHora = tempo / 60;
                        total += tempoHora * (c.consumo_kwh_hora ?? 0);
                    } else if (c.consumo_litros_minuto) {
                        const tempoMin = tempo / 60;
                        total += tempoMin * (c.consumo_litros_minuto ?? 0);
                    }
                });

                return Number(total.toFixed(3));
            });
        }

        const energiaMeses = somarConsumoPorPeriodo(consumosEnergia, meses, "mes");
        const aguaMeses = somarConsumoPorPeriodo(consumosAgua, meses, "mes");

        setUltimos6Meses(
            meses.map((m) => m.toLocaleString("default", { month: "short" }))
        );
        setValoresEnergiaMeses(energiaMeses);
        setValoresAguaMeses(aguaMeses);
    }, [consumosEnergia, consumosAgua]);

    // Lógica para Consumo do Mês Atual
    function calcularConsumoMesAtual(consumosEnergia: any[], consumosAgua: any[]) {
        const agora = new Date();
        const mesAtual = agora.getMonth();
        const anoAtual = agora.getFullYear();

        let totalEnergia = 0;
        let totalAgua = 0;

        consumosEnergia.forEach((c: any) => {
            const data = new Date(c.data_registro);
            if (data.getMonth() === mesAtual && data.getFullYear() === anoAtual) {
                const tempo = c.tempo ?? c.tempo_uso ?? 0;
                const tipoTempo = c.tipoTempo ?? c.tipo ?? "min";

                const tempoHoras = tempo / 60;

                const consumoFinal = tempoHoras * (parseFloat(c.consumo_kwh_hora) || 0);
                totalEnergia += consumoFinal;
            }
        });

        consumosAgua.forEach((c: any) => {
            const data = new Date(c.data_registro);
            if (data.getMonth() === mesAtual && data.getFullYear() === anoAtual) {
                const tempo = c.tempo_uso ?? c.tempo ?? 0;
                const tipoTempo = c.tipoTempo ?? c.tipo ?? "min";

                const tempoMinutos = tempo / 60;

                const consumoFinal = tempoMinutos * (parseFloat(c.consumo_litros_minuto) || 0);
                totalAgua += consumoFinal;
            }
        });

        return {
            energiaMes: Number(totalEnergia.toFixed(3)),
            aguaMes: Number(totalAgua.toFixed(1)),
        };
    }

    const { energiaMes, aguaMes } = calcularConsumoMesAtual(consumosEnergia, consumosAgua);

    // Lógica para Listas de Eletrodomésticos e Atividades
    const [topEletros, setTopEletros] = useState<any[]>([]);
    const [topAtividades, setTopAtividades] = useState<any[]>([]);

    useEffect(() => {
        const buscarTopConsumos = async () => {
            if (!idUsuario || !userToken) return;

            try {
                const eletros = await listarEletrodomesticosPorUsuario(userToken, idUsuario);
                const atividades = await listarAtividadesPorUsuario(userToken, idUsuario);

                const agora = new Date();
                const mesAtual = agora.getMonth() + 1;
                const anoAtual = agora.getFullYear();

                const eletrosComConsumo = await Promise.all(
                    (eletros.data || eletros).map(async (e: any) => {
                        const consumos = consumosEnergia.filter((c: any) => {
                            const dataConsumo = new Date(c.data || c.data_registro);
                            const mesmoMes = dataConsumo.getMonth() + 1 === mesAtual;
                            const mesmoAno = dataConsumo.getFullYear() === anoAtual;
                            return (
                                c.id_eletrodomestico === e.id_eletrodomestico &&
                                mesmoMes &&
                                mesmoAno
                            );
                        });

                        let total = 0;
                        consumos.forEach((c: any) => {
                            const tempo = c.tempo ?? 0;
                            const tipoTempo = c.tipo ?? "min";
                            const tempoHoras = tempo / 60;
                            total += tempoHoras * (parseFloat(e.consumo_kwh_hora) || 0);
                        });

                        return { imagem: e.imagem, marca: e.marca, modelo: e.modelo, consumo: total };
                    })
                );

                const atividadesComConsumo = await Promise.all(
                    (atividades.data || atividades).map(async (a: any) => {
                        const consumos = consumosAgua.filter((c: any) => {
                            const dataConsumo = new Date(c.data || c.data_registro);
                            const mesmoMes = dataConsumo.getMonth() + 1 === mesAtual;
                            const mesmoAno = dataConsumo.getFullYear() === anoAtual;
                            return (
                                c.id_atividade === a.id_atividade &&
                                mesmoMes &&
                                mesmoAno
                            );
                        });

                        let total = 0;
                        consumos.forEach((c: any) => {
                            const tempo = c.tempo_uso ?? 0;
                            const tipoTempo = c.tipo ?? "min";
                            const tempoMin = tempo / 60;
                            total += tempoMin * (a.consumo_litros_minuto || 0);
                        });

                        return { imagem: a.imagem, nome: a.nome, consumo: total };
                    })
                );

                const top3Eletros = eletrosComConsumo
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 3);

                const top3Atividades = atividadesComConsumo
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 3);

                setTopEletros(top3Eletros);
                setTopAtividades(top3Atividades);
            } catch (error) {
                console.error("Erro ao calcular top consumos:", error);
            }
        };

        if (consumosEnergia.length || consumosAgua.length) {
            buscarTopConsumos();
        }
    }, [consumosEnergia, consumosAgua]);

    // Lógica para Estimativa de Custos Mensais
    const [custoEnergia, setCustoEnergia] = useState('00,00');
    const [custoAgua, setCustoAgua] = useState('00,00');

    useEffect(() => {
        const verificarOuCadastrarCustoMensal = async () => {
            if (!idUsuario || !userToken) return;

            try {
                const idResidencia = await AsyncStorage.getItem('residenciaSelecionada');
                const residencia = await selecionarResidenciaPorId(userToken, idResidencia);
                const estado = residencia?.data?.estado;

                const tarifaEstado = await selecionarTarifaPorEstado(userToken, estado);
                const tarifaEnergia = tarifaEstado.data.tarifa_kwh;
                const tarifaAgua = tarifaEstado.data.tarifa_m3;

                const custos = await listarCustosPorUsuario(userToken, idUsuario);
                const custosData = custos.data || custos;

                const hoje = new Date();
                const mesAtual = hoje.getMonth();
                const anoAtual = hoje.getFullYear();

                const custoExistente = custosData.find((c: any) => {
                    const data = new Date(c.data_registro);
                    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
                });

                const novoCustoEnergia = Number((energiaMes * tarifaEnergia).toFixed(2));
                const novoCustoAgua = Number((aguaMes * tarifaAgua).toFixed(2));
                const novoCustoEnergiaImposto = novoCustoEnergia + (novoCustoEnergia * 32.5 / 100);
                const novoCustoAguaImposto = novoCustoAgua + (novoCustoAgua * 7.5 / 100);

                setCustoEnergia(novoCustoEnergia.toFixed(2).replace('.', ','));
                setCustoAgua(novoCustoAgua.toFixed(2).replace('.', ','));

                if (!custoExistente && (energiaMes > 0 || aguaMes > 0)) {
                    await cadastrarCusto(userToken, idUsuario, novoCustoEnergia, novoCustoEnergiaImposto, novoCustoAgua, novoCustoAguaImposto);
                } else if (custoExistente) {
                    const valoresIguais =
                        Number(custoExistente.valor_energia_sem_impostos) === novoCustoEnergia &&
                        Number(custoExistente.valor_agua_sem_impostos) === novoCustoAgua;

                    if (!valoresIguais) {
                        await editarCusto(userToken, custoExistente.id_custo, idUsuario, novoCustoEnergia, novoCustoEnergiaImposto, novoCustoAgua, novoCustoAguaImposto);
                    }
                }
            } catch (error) {
                console.error("Erro ao verificar ou cadastrar custo mensal:", error);
            }
        };

        if (energiaMes !== 0 || aguaMes !== 0) {
            verificarOuCadastrarCustoMensal();
        }
    }, [energiaMes, aguaMes, idUsuario, userToken]);


    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[400]} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), flexDirection: "row", alignItems: "center", justifyContent: "center", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], gap: RFValue(13), paddingVertical: RFValue(6) }}>
                            <View style={{ width: RFValue(280), height: "100%", alignItems: "flex-start", gap: RFValue(6) }}>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(50), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(8), paddingVertical: RFValue(8) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("EstimativaCustos")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ width: RFValue(15), height: RFValue(15), borderRadius: "50%", backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }}>
                                                <Icon name="currency-brl" size={RFValue(11)} color={colors.blue[300]} />
                                            </View>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginLeft: RFValue(5) }}>Estimativa de Custos Mensais</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(15)} color={colors.white} />
                                    </View>
                                    <View style={{ width: "100%", alignItems: "flex-start", justifyContent: "center", flexDirection: "row", marginTop: RFValue(5) }}>
                                        <View style={{ borderRightWidth: RFValue(1), borderColor: colors.white, width: "50%", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>Energia: R$ {custoEnergia}</Text>
                                        </View>
                                        <View style={{ width: "50%", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>Água: R$ {custoAgua}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(100), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(8), paddingVertical: RFValue(8) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("Metas")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="bullseye-arrow" size={RFValue(15)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginLeft: RFValue(5) }}>Metas de Consumo</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(15)} color={colors.white} />
                                    </View>
                                    <View style={{ width: "100%", height: "85%", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                        <View style={{ width: RFValue(100), height: "100%", alignItems: "center", justifyContent: "center" }}>
                                            <GraficoDonutModel consumo={energiaMes} meta={metaEnergia} cor={colors.yellow[300]} tipo={"energia"} tamanho={"pequeno"} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>{energiaMes} kWh / {metaEnergia} kWh</Text>
                                        </View>
                                        <View style={{ width: RFValue(10), height: "100%", backgroundColor: colors.blue[300], alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ width: RFValue(1), height: "80%", backgroundColor: colors.white }}></View>
                                        </View>
                                        <View style={{ width: RFValue(100), height: "100%", alignItems: "center", justifyContent: "center" }}>
                                            <GraficoDonutModel consumo={aguaMes} meta={metaAgua} cor={colors.blue[200]} tipo={"agua"} tamanho={"pequeno"} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>{aguaMes} L / {metaAgua} L</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(102), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(8), paddingVertical: RFValue(8) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("Graficos")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="chart-box-outline" size={RFValue(15)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginLeft: RFValue(5) }}>Gráficos de Consumo</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(15)} color={colors.white} />
                                    </View>
                                    <View style={{ width: "100%", height: "100%", alignItems: "flex-start", justifyContent: "center", flexDirection: "row", marginTop: RFValue(3), gap: RFValue(10) }}>
                                        <View style={{ alignItems: "center", justifyContent: "center", width: "43%" }}>
                                            {loadingGrafico ? (
                                                <ActivityIndicator size="small" color={colors.white} animating={true} />
                                            ) : (
                                                <GraficoLinhaModel
                                                    labels={ultimos6Meses}
                                                    valores={valoresEnergiaMeses}
                                                    cor={colors.yellow[100]}
                                                    corSecundaria={colors.yellow[200]}
                                                    tamanho={"pequeno"}
                                                />
                                            )}
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(7) }}>Energia (kWh)</Text>
                                        </View>
                                        <View style={{ alignItems: "center", justifyContent: "center", width: "43%" }}>
                                            {loadingGrafico ? (
                                                <ActivityIndicator size="small" color={colors.white} animating={true} />
                                            ) : (
                                                <GraficoLinhaModel
                                                    labels={ultimos6Meses}
                                                    valores={valoresAguaMeses}
                                                    cor={colors.blue[100]}
                                                    corSecundaria={colors.blue[400]}
                                                    tamanho={"pequeno"}
                                                />
                                            )}
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(7) }}>Água (Litros)</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: RFValue(320), height: "100%", gap: RFValue(6) }}>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(129.5), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(8), paddingVertical: RFValue(8) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("Eletrodomesticos")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="lightning-bolt" size={RFValue(15)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginLeft: RFValue(5) }}>Lista de Eletrodomésticos</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(15)} color={colors.white} />
                                    </View>
                                    {topEletros !== undefined ? (
                                        <View style={{ paddingVertical: RFValue(5) }}>
                                            <View style={{
                                                backgroundColor: colors.blue[300],
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                width: "100%",
                                            }}>
                                                <View style={{ width: "22%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                </View>
                                                <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>
                                                        Marca
                                                    </Text>
                                                </View>
                                                <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>
                                                        Modelo
                                                    </Text>
                                                </View>
                                                <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(0), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>
                                                        Consumo
                                                    </Text>
                                                </View>
                                            </View>
                                            <FlatList
                                                data={topEletros}
                                                keyExtractor={(item) => item.id}
                                                style={{ width: "100%", height: "100%" }}
                                                renderItem={({ item, index }) => {
                                                    const isLast = index === topEletros.length - 1;

                                                    return (
                                                        <TouchableOpacity
                                                            style={{
                                                                backgroundColor: colors.blue[300],
                                                                flexDirection: "row",
                                                                justifyContent: "flex-start",
                                                                pointerEvents: "none"
                                                            }}
                                                            activeOpacity={1}
                                                        >
                                                            <View style={{ width: "22%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(2), position: "relative" }}>
                                                                <Icon name={item.imagem ? item.imagem as any : "progress-question"} size={RFValue(20)} color={colors.white} />
                                                            </View>
                                                            <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(2) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8), textAlign: "center" }}>
                                                                    {item.marca}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(2) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8), textAlign: "center" }}>
                                                                    {item.modelo}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(0), borderColor: colors.white, paddingVertical: RFValue(2) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8), textAlign: "center" }}>
                                                                    {item.consumo === 0 ? "0" : `${item.consumo.toFixed(3).replace(".", ",")} kWh`}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ width: "100%", height: "80%", alignItems: "center", justifyContent: "center", marginTop: RFValue(5) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>Nenhum eletrodoméstico cadastrado</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(129), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(8), paddingVertical: RFValue(8) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("Atividades")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="water" size={RFValue(15)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginLeft: RFValue(5) }}>Lista de Atividades</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(15)} color={colors.white} />
                                    </View>
                                    {topAtividades !== undefined ? (
                                        <View style={{ paddingVertical: RFValue(5) }}>
                                            <View style={{
                                                backgroundColor: colors.blue[300],
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                width: "100%",
                                            }}>
                                                <View style={{ width: "24%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                </View>
                                                <View style={{ width: "38%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>
                                                        Atividade
                                                    </Text>
                                                </View>
                                                <View style={{ width: "38%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(0), borderColor: colors.white, paddingVertical: RFValue(5) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>
                                                        Consumo
                                                    </Text>
                                                </View>
                                            </View>
                                            <FlatList
                                                data={topAtividades}
                                                keyExtractor={(item) => item.id}
                                                style={{ width: "100%", height: "100%" }}
                                                renderItem={({ item, index }) => {
                                                    const isLast = index === topAtividades.length - 1;

                                                    return (
                                                        <TouchableOpacity
                                                            style={{
                                                                backgroundColor: colors.blue[300],
                                                                flexDirection: "row",
                                                                justifyContent: "flex-start",
                                                                pointerEvents: "none"
                                                            }}
                                                            activeOpacity={1}
                                                        >
                                                            <View style={{ width: "24%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(2), position: "relative" }}>
                                                                <Icon name={item.imagem ? item.imagem as any : "progress-question"} size={RFValue(20)} color={colors.white} />
                                                            </View>
                                                            <View style={{ width: "38%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(2) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8), textAlign: "center" }}>
                                                                    {item.nome}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: "38%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(0), borderColor: colors.white, paddingVertical: RFValue(2) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8), textAlign: "center" }}>
                                                                    {item.consumo === 0 ? "0" : `${item.consumo.toFixed(3).replace(".", ",")} kWh`}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ width: "100%", height: "80%", alignItems: "center", justifyContent: "center", marginTop: RFValue(5) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>Nenhuma atividade cadastrada</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingTop: RFValue(15), paddingBottom: RFValue(5), zIndex: 3000 }}>
                            <ScrollView
                                style={{ width: "100%", maxHeight: alturaCalculada }}
                                showsVerticalScrollIndicator={false}
                            >
                                <TouchableOpacity style={{ width: "100%", height: RFValue(80), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(10), paddingVertical: RFValue(12) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("EstimativaCustos")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ width: RFValue(23), height: RFValue(23), borderRadius: "50%", backgroundColor: colors.white, alignItems: "center", justifyContent: "center" }}>
                                                <Icon name="currency-brl" size={RFValue(17)} color={colors.blue[300]} />
                                            </View>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Estimativa de Custos Mensais</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(25)} color={colors.white} />
                                    </View>
                                    <View style={{ width: "100%", alignItems: "flex-start", justifyContent: "center", flexDirection: "row", marginTop: RFValue(10) }}>
                                        <View style={{ borderRightWidth: RFValue(2), borderColor: colors.white, width: "50%", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>Energia: R$ {custoEnergia}</Text>
                                        </View>
                                        <View style={{ width: "50%", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>Água: R$ {custoAgua}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(170), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(10), paddingVertical: RFValue(12), marginTop: RFValue(15) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("Metas")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="bullseye-arrow" size={RFValue(25)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Metas de Consumo</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(25)} color={colors.white} />
                                    </View>
                                    <View style={{ width: "100%", height: "85%", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                        <View style={{ width: RFValue(150), height: "100%", alignItems: "center", justifyContent: "center" }}>
                                            <GraficoDonutModel consumo={energiaMes} meta={metaEnergia} cor={colors.yellow[300]} tipo={"energia"} tamanho={"pequeno"} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>{energiaMes} kWh / {metaEnergia} kWh</Text>
                                        </View>
                                        <View style={{ width: RFValue(10), height: "100%", backgroundColor: colors.blue[300], alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ width: RFValue(2), height: "80%", backgroundColor: colors.white }}></View>
                                        </View>
                                        <View style={{ width: RFValue(150), height: "100%", alignItems: "center", justifyContent: "center" }}>
                                            <GraficoDonutModel consumo={aguaMes} meta={metaAgua} cor={colors.blue[200]} tipo={"agua"} tamanho={"pequeno"} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>{aguaMes} L / {metaAgua} L</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(180), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(8), paddingVertical: RFValue(8), marginTop: RFValue(15) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("Graficos")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="chart-box-outline" size={RFValue(25)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Gráficos de Consumo</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(25)} color={colors.white} />
                                    </View>
                                    <View style={{ width: "100%", height: "100%", alignItems: "flex-start", justifyContent: "center", flexDirection: "row", marginTop: RFValue(10), gap: RFValue(0) }}>
                                        <View style={{ alignItems: "center", justifyContent: "center", width: "50%" }}>
                                            {loadingGrafico ? (
                                                <ActivityIndicator size="small" color={colors.white} animating={true} />
                                            ) : (
                                                <GraficoLinhaModel
                                                    labels={ultimos6Meses}
                                                    valores={valoresEnergiaMeses}
                                                    cor={colors.yellow[100]}
                                                    corSecundaria={colors.yellow[200]}
                                                    tamanho={"pequeno"}
                                                />
                                            )}
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10) }}>Energia (kWh)</Text>
                                        </View>
                                        <View style={{ alignItems: "center", justifyContent: "center", width: "50%" }}>
                                            {loadingGrafico ? (
                                                <ActivityIndicator size="small" color={colors.white} animating={true} />
                                            ) : (
                                                <GraficoLinhaModel
                                                    labels={ultimos6Meses}
                                                    valores={valoresAguaMeses}
                                                    cor={colors.blue[100]}
                                                    corSecundaria={colors.blue[400]}
                                                    tamanho={"pequeno"}
                                                />
                                            )}
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10) }}>Água (Litros)</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(200), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(8), paddingVertical: RFValue(8), marginTop: RFValue(15) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("Eletrodomesticos")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="lightning-bolt" size={RFValue(25)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Lista de Eletrodomésticos</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(25)} color={colors.white} />
                                    </View>
                                    {topEletros !== undefined ? (
                                        <View style={{ paddingVertical: RFValue(5) }}>
                                            <View style={{
                                                backgroundColor: colors.blue[300],
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                width: "100%",
                                            }}>
                                                <View style={{ width: "22%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(8) }}>
                                                </View>
                                                <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(8) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>
                                                        Marca
                                                    </Text>
                                                </View>
                                                <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(8) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>
                                                        Modelo
                                                    </Text>
                                                </View>
                                                <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(0), borderColor: colors.white, paddingVertical: RFValue(8) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>
                                                        Consumo
                                                    </Text>
                                                </View>
                                            </View>
                                            <FlatList
                                                data={topEletros}
                                                keyExtractor={(item) => item.id}
                                                style={{ width: "100%", height: "100%" }}
                                                renderItem={({ item, index }) => {
                                                    const isLast = index === topEletros.length - 1;

                                                    return (
                                                        <TouchableOpacity
                                                            style={{
                                                                backgroundColor: colors.blue[300],
                                                                flexDirection: "row",
                                                                justifyContent: "flex-start",
                                                                pointerEvents: "none"
                                                            }}
                                                            activeOpacity={1}
                                                        >
                                                            <View style={{ width: "22%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(4), position: "relative" }}>
                                                                <Icon name={item.imagem ? item.imagem as any : "progress-question"} size={RFValue(30)} color={colors.white} />
                                                            </View>
                                                            <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(4) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12), textAlign: "center" }}>
                                                                    {item.marca}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(4) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12), textAlign: "center" }}>
                                                                    {item.modelo}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: "26%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(0), borderColor: colors.white, paddingVertical: RFValue(4) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12), textAlign: "center" }}>
                                                                    {item.consumo === 0 ? "0" : `${item.consumo.toFixed(3).replace(".", ",")} kWh`}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ width: "100%", height: "80%", alignItems: "center", justifyContent: "center", marginTop: RFValue(5) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>Nenhum eletrodoméstico cadastrado</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: "100%", height: RFValue(200), backgroundColor: colors.blue[300], borderRadius: RFValue(10), paddingHorizontal: RFValue(8), paddingVertical: RFValue(8), marginTop: RFValue(15) }}
                                    activeOpacity={1}
                                    onPress={() => navigation.navigate("Atividades")}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="water" size={RFValue(25)} color={colors.white} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginLeft: RFValue(5) }}>Lista de Atividades</Text>
                                        </View>
                                        <Icon name="arrow-right-circle-outline" size={RFValue(25)} color={colors.white} />
                                    </View>
                                    {topAtividades !== undefined ? (
                                        <View style={{ paddingVertical: RFValue(5) }}>
                                            <View style={{
                                                backgroundColor: colors.blue[300],
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                width: "100%",
                                            }}>
                                                <View style={{ width: "24%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(8) }}>
                                                </View>
                                                <View style={{ width: "38%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(8) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>
                                                        Atividade
                                                    </Text>
                                                </View>
                                                <View style={{ width: "38%", justifyContent: "center", alignItems: "center", borderBottomWidth: RFValue(1), borderRightWidth: RFValue(0), borderColor: colors.white, paddingVertical: RFValue(8) }}>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>
                                                        Consumo
                                                    </Text>
                                                </View>
                                            </View>
                                            <FlatList
                                                data={topAtividades}
                                                keyExtractor={(item) => item.id}
                                                style={{ width: "100%", height: "100%" }}
                                                renderItem={({ item, index }) => {
                                                    const isLast = index === topAtividades.length - 1;

                                                    return (
                                                        <TouchableOpacity
                                                            style={{
                                                                backgroundColor: colors.blue[300],
                                                                flexDirection: "row",
                                                                justifyContent: "flex-start",
                                                                pointerEvents: "none"
                                                            }}
                                                            activeOpacity={1}
                                                        >
                                                            <View style={{ width: "24%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(4), position: "relative" }}>
                                                                <Icon name={item.imagem ? item.imagem as any : "progress-question"} size={RFValue(30)} color={colors.white} />
                                                            </View>
                                                            <View style={{ width: "38%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(1), borderColor: colors.white, paddingVertical: RFValue(4) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), textAlign: "center" }}>
                                                                    {item.nome}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: "38%", justifyContent: "center", alignItems: "center", borderBottomWidth: isLast ? 0 : RFValue(1), borderRightWidth: RFValue(0), borderColor: colors.white, paddingVertical: RFValue(4) }}>
                                                                <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12), textAlign: "center" }}>
                                                                    {item.consumo === 0 ? "0" : `${item.consumo.toFixed(3).replace(".", ",")} kWh`}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ width: "100%", height: "80%", alignItems: "center", justifyContent: "center", marginTop: RFValue(5) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>Nenhuma atividade cadastrada</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </ScrollView>
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
    logo: {
        width: RFValue(316),
        height: RFValue(202),
        resizeMode: "contain"
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
    },
    caixa: {
        flexDirection: 'row',
        alignItems: 'center',
        width: RFValue(255),
        height: RFValue(35),
        marginBottom: RFValue(15)
    },
    label: {
        marginLeft: RFValue(8),
        fontSize: RFValue(14),
        color: colors.white,
        fontFamily: fontFamily.inder
    }
})