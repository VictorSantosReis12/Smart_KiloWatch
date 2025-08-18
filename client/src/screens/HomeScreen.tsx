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
import { listarResidenciasPorUsuario, excluirResidencia } from "@/services/api";

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

    // Estimativa de Custos Mensais
    const definirValorEnergia = "13,00";
    const [valorEnergia, setValorEnergia] = useState(definirValorEnergia);
    const definirValorAgua = "22,00";
    const [valorAgua, setValorAgua] = useState(definirValorAgua);

    // Listas
    const [hasEletrodomestico, setHasEletrodomestico] = useState(false);
    const [hasAtividade, setHasAtividade] = useState(false);

    // Metas de Consumo
    const definirConsumoEnergia = 50;
    const definirMetaEnergia = 300;
    const definirConsumoAgua = 6300;
    const definirMetaAgua = 12000;
    const [consumoEnergia, setConsumoEnergia] = useState(definirConsumoEnergia);
    const [metaEnergia, setMetaEnergia] = useState(definirMetaEnergia);
    const [consumoAgua, setConsumoAgua] = useState(definirConsumoAgua);
    const [metaAgua, setMetaAgua] = useState(definirMetaAgua);

    // Gráficos de Consumo
    const definirGraficoEnergiaValores = [180, 180, 200, 190, 210, 170];
    const definirGraficoEnergiaTempo = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const [graficoEnergiaValores, setGraficoEnergiaValores] = useState(definirGraficoEnergiaValores);
    const [graficoEnergiaTempo, setGraficoEnergiaTempo] = useState(definirGraficoEnergiaTempo);
    const definirGraficoAguaValores = [5600, 5300, 6000, 5800, 6200, 5700];
    const definirGraficoAguaTempo = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const [graficoAguaValores, setGraficoAguaValores] = useState(definirGraficoAguaValores);
    const [graficoAguaTempo, setGraficoAguaTempo] = useState(definirGraficoAguaTempo);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#04498E');
        NavigationBar.setButtonStyleAsync('light');
    }, []);

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
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>Energia: R$ {valorEnergia}</Text>
                                        </View>
                                        <View style={{ width: "50%", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>Água: R$ {valorAgua}</Text>
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
                                            <GraficoDonutModel consumo={consumoEnergia} meta={metaEnergia} cor={colors.yellow[300]} tipo={"energia"} tamanho={"pequeno"} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>{consumoEnergia} kWh / {metaEnergia} kWh</Text>
                                        </View>
                                        <View style={{ width: RFValue(10), height: "100%", backgroundColor: colors.blue[300], alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ width: RFValue(1), height: "80%", backgroundColor: colors.white }}></View>
                                        </View>
                                        <View style={{ width: RFValue(100), height: "100%", alignItems: "center", justifyContent: "center" }}>
                                            <GraficoDonutModel consumo={consumoAgua} meta={metaAgua} cor={colors.blue[200]} tipo={"agua"} tamanho={"pequeno"} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(8) }}>{consumoAgua} L / {metaAgua} L</Text>
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
                                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                                            <GraficoLinhaModel
                                                labels={graficoEnergiaTempo}
                                                valores={graficoEnergiaValores}
                                                cor={colors.yellow[100]}
                                                corSecundaria={colors.yellow[200]}
                                                tamanho={"pequeno"}
                                            />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(7) }}>Energia (kWh)</Text>
                                        </View>
                                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                                            <GraficoLinhaModel
                                                labels={graficoAguaTempo}
                                                valores={graficoAguaValores}
                                                cor={colors.blue[100]}
                                                corSecundaria={colors.blue[400]}
                                                tamanho={"pequeno"}
                                            />
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
                                    {hasEletrodomestico ? (
                                        <>
                                        </>
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
                                    {hasAtividade ? (
                                        <>
                                        </>
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
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>Energia: R$ {valorEnergia}</Text>
                                        </View>
                                        <View style={{ width: "50%", alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>Água: R$ {valorAgua}</Text>
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
                                            <GraficoDonutModel consumo={consumoEnergia} meta={metaEnergia} cor={colors.yellow[300]} tipo={"energia"} tamanho={"pequeno"} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>{consumoEnergia} kWh / {metaEnergia} kWh</Text>
                                        </View>
                                        <View style={{ width: RFValue(10), height: "100%", backgroundColor: colors.blue[300], alignItems: "center", justifyContent: "center" }}>
                                            <View style={{ width: RFValue(2), height: "80%", backgroundColor: colors.white }}></View>
                                        </View>
                                        <View style={{ width: RFValue(150), height: "100%", alignItems: "center", justifyContent: "center" }}>
                                            <GraficoDonutModel consumo={consumoAgua} meta={metaAgua} cor={colors.blue[200]} tipo={"agua"} tamanho={"pequeno"} />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(12) }}>{consumoAgua} L / {metaAgua} L</Text>
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
                                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                                            <GraficoLinhaModel
                                                labels={graficoEnergiaTempo}
                                                valores={graficoEnergiaValores}
                                                cor={colors.yellow[100]}
                                                corSecundaria={colors.yellow[200]}
                                                tamanho={"pequeno"}
                                            />
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(10) }}>Energia (kWh)</Text>
                                        </View>
                                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                                            <GraficoLinhaModel
                                                labels={graficoAguaTempo}
                                                valores={graficoAguaValores}
                                                cor={colors.blue[100]}
                                                corSecundaria={colors.blue[400]}
                                                tamanho={"pequeno"}
                                            />
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
                                    {hasEletrodomestico ? (
                                        <>
                                        </>
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
                                    {hasAtividade ? (
                                        <>
                                        </>
                                    ) : (
                                        <View style={{ width: "100%", height: "80%", alignItems: "center", justifyContent: "center", marginTop: RFValue(5) }}>
                                            <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>Nenhuma atividade cadastrada</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    }
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