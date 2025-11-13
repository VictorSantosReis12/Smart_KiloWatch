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

export default function GraficosScreen({ navigation }: any) {
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

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

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

    const [ultimos6Dias, setUltimos6Dias] = useState([]);
    const [ultimos6Meses, setUltimos6Meses] = useState([]);
    const [valoresEnergiaDias, setValoresEnergiaDias] = useState([]);
    const [valoresAguaDias, setValoresAguaDias] = useState([]);
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

        const energiaDias = somarConsumoPorPeriodo(consumosEnergia, dias, "dia");
        const aguaDias = somarConsumoPorPeriodo(consumosAgua, dias, "dia");
        const energiaMeses = somarConsumoPorPeriodo(consumosEnergia, meses, "mes");
        const aguaMeses = somarConsumoPorPeriodo(consumosAgua, meses, "mes");

        setUltimos6Dias(
            dias.map((d) => d.getDate().toString().padStart(2, "0") + "/" + (d.getMonth() + 1))
        );
        setUltimos6Meses(
            meses.map((m) => m.toLocaleString("default", { month: "short" }))
        );
        setValoresEnergiaDias(energiaDias);
        setValoresAguaDias(aguaDias);
        setValoresEnergiaMeses(energiaMeses);
        setValoresAguaMeses(aguaMeses);
    }, [consumosEnergia, consumosAgua]);

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
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Gráficos de Consumo</Text>
                            </View>
                            <View style={{ width: "100%", backgroundColor: colors.blue[500], justifyContent: "flex-start", alignItems: "center", flexDirection: "column", marginTop: RFValue(15) }}>
                                <View style={{ width: "100%", backgroundColor: colors.blue[500], justifyContent: "center", alignItems: "flex-start", marginBottom: RFValue(10) }}>
                                    <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(10) }}>
                                        {dataFormatada}
                                    </Text>
                                </View>
                                <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                    {loading ? <ActivityIndicator color={colors.white} size={"large"} animating={true} />
                                        :
                                        <>
                                            <TouchableOpacity style={{ width: "48%", backgroundColor: colors.blue[400], borderRadius: RFValue(10), justifyContent: "flex-start", alignItems: "center", marginBottom: RFValue(20), padding: RFValue(10), flexDirection: "column" }}
                                                onPress={() => navigation.navigate('GraficosDiarios')}>
                                                <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                                    <Text style={{ fontSize: RFValue(12), color: colors.white, fontFamily: fontFamily.krona }}>Gráficos Diários</Text>

                                                    <Icon name="arrow-right-circle-outline" size={RFValue(20)} color={colors.white} />
                                                </View>
                                                <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                                    <View style={{ width: "48%", justifyContent: "center", alignItems: "center" }}>
                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(30) }}>
                                                            <GraficoLinhaModel
                                                                labels={ultimos6Dias}
                                                                valores={valoresEnergiaDias}
                                                                cor={colors.yellow[100]}
                                                                corSecundaria={colors.yellow[200]}
                                                                tamanho={"pequeno"}
                                                                tamanhoMedioGrande={true}
                                                            />
                                                        </View>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-5) }}>Energia (kWh)</Text>
                                                    </View>
                                                    <View style={{ width: "48%", justifyContent: "center", alignItems: "center" }}>
                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(30) }}>
                                                            <GraficoLinhaModel
                                                                labels={ultimos6Dias}
                                                                valores={valoresAguaDias}
                                                                cor={colors.blue[100]}
                                                                corSecundaria={colors.blue[200]}
                                                                tamanho={"pequeno"}
                                                                tamanhoMedioGrande={true}
                                                            />
                                                        </View>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-5) }}>Água (Litros)</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: "48%", backgroundColor: colors.blue[400], borderRadius: RFValue(10), justifyContent: "flex-start", alignItems: "center", marginBottom: RFValue(20), padding: RFValue(10), flexDirection: "column" }}
                                                onPress={() => navigation.navigate('GraficosMensais')}>
                                                <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                                    <Text style={{ fontSize: RFValue(12), color: colors.white, fontFamily: fontFamily.krona }}>Gráficos Mensais</Text>

                                                    <Icon name="arrow-right-circle-outline" size={RFValue(20)} color={colors.white} />
                                                </View>
                                                <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                                    <View style={{ width: "48%", justifyContent: "center", alignItems: "center" }}>
                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(30) }}>
                                                            <GraficoLinhaModel
                                                                labels={ultimos6Meses}
                                                                valores={valoresEnergiaMeses}
                                                                cor={colors.yellow[100]}
                                                                corSecundaria={colors.yellow[200]}
                                                                tamanho={"pequeno"}
                                                                tamanhoMedioGrande={true}
                                                            />
                                                        </View>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-5) }}>Energia (kWh)</Text>
                                                    </View>
                                                    <View style={{ width: "48%", justifyContent: "center", alignItems: "center" }}>
                                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(30) }}>
                                                            <GraficoLinhaModel
                                                                labels={ultimos6Meses}
                                                                valores={valoresAguaMeses}
                                                                cor={colors.blue[100]}
                                                                corSecundaria={colors.blue[200]}
                                                                tamanho={"pequeno"}
                                                                tamanhoMedioGrande={true}
                                                            />
                                                        </View>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10), marginTop: RFValue(-5) }}>Água (Litros)</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </>
                                    }
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Gráficos de Consumo</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30) }}>
                                <View style={{ width: "100%", backgroundColor: colors.blue[500], justifyContent: "space-between", alignItems: "center", flexDirection: "row", marginBottom: RFValue(30) }}>
                                    <Text style={{ fontSize: RFValue(13), color: colors.white, fontFamily: fontFamily.inder }}>
                                        {dataFormatada}
                                    </Text>
                                </View>
                                {loading ? <ActivityIndicator color={colors.white} size={"large"} animating={true} />
                                    :
                                    <>
                                        <TouchableOpacity style={{ width: "100%", backgroundColor: colors.blue[400], borderRadius: RFValue(10), justifyContent: "flex-start", alignItems: "center", marginBottom: RFValue(20), padding: RFValue(10), flexDirection: "column" }}
                                            onPress={() => navigation.navigate('GraficosDiarios')}>
                                            <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                                <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.krona }}>Gráficos Diários</Text>

                                                <Icon name="arrow-right-circle-outline" size={RFValue(25)} color={colors.white} />
                                            </View>
                                            <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                                <View style={{ width: "48%", justifyContent: "center", alignItems: "center" }}>
                                                    <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(30) }}>
                                                        <GraficoLinhaModel
                                                            labels={ultimos6Dias}
                                                            valores={valoresEnergiaDias}
                                                            cor={colors.yellow[100]}
                                                            corSecundaria={colors.yellow[200]}
                                                            tamanho={"pequeno"}
                                                            tamanhoMedio={true}
                                                        />
                                                    </View>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginTop: RFValue(-5) }}>Energia (kWh)</Text>
                                                </View>
                                                <View style={{ width: "48%", justifyContent: "center", alignItems: "center" }}>
                                                    <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(30) }}>
                                                        <GraficoLinhaModel
                                                            labels={ultimos6Dias}
                                                            valores={valoresAguaDias}
                                                            cor={colors.blue[100]}
                                                            corSecundaria={colors.blue[200]}
                                                            tamanho={"pequeno"}
                                                            tamanhoMedio={true}
                                                        />
                                                    </View>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginTop: RFValue(-5) }}>Água (Litros)</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ width: "100%", backgroundColor: colors.blue[400], borderRadius: RFValue(10), justifyContent: "flex-start", alignItems: "center", marginBottom: RFValue(20), padding: RFValue(10), flexDirection: "column" }}
                                            onPress={() => navigation.navigate('GraficosMensais')}>
                                            <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                                <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.krona }}>Gráficos Mensais</Text>

                                                <Icon name="arrow-right-circle-outline" size={RFValue(25)} color={colors.white} />
                                            </View>
                                            <View style={{ width: "100%", marginTop: RFValue(10), justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                                                <View style={{ width: "48%", justifyContent: "center", alignItems: "center" }}>
                                                    <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(30) }}>
                                                        <GraficoLinhaModel
                                                            labels={ultimos6Meses}
                                                            valores={valoresEnergiaMeses}
                                                            cor={colors.yellow[100]}
                                                            corSecundaria={colors.yellow[200]}
                                                            tamanho={"pequeno"}
                                                            tamanhoMedio={true}
                                                        />
                                                    </View>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginTop: RFValue(-5) }}>Energia (kWh)</Text>
                                                </View>
                                                <View style={{ width: "48%", justifyContent: "center", alignItems: "center" }}>
                                                    <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", paddingRight: RFValue(30) }}>
                                                        <GraficoLinhaModel
                                                            labels={ultimos6Meses}
                                                            valores={valoresAguaMeses}
                                                            cor={colors.blue[100]}
                                                            corSecundaria={colors.blue[200]}
                                                            tamanho={"pequeno"}
                                                            tamanhoMedio={true}
                                                        />
                                                    </View>
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), marginTop: RFValue(-5) }}>Água (Litros)</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                }
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