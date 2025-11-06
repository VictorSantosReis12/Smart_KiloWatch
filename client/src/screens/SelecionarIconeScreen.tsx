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
import { buscarUsuarioPorEmail } from "@/services/api";

// Ícones
const listaIcones = ["air-conditioner", "blender", "cellphone-charging", "coffee-maker", "controller-classic", "desktop-classic", "desktop-tower-monitor", "desktop-tower", "disc-player", "dishwasher", "fan", "fridge", "fridge-industrial", "fridge-variant", "iron", "grill", "laptop", "lightbulb-on", "microwave", "monitor", "pot-steam", "power-plug", "printer", "printer-3d", "radio", "robot-vacuum", "router-wireless", "shower-head", "speaker", "stove", "television", "television-classic", "toaster", "toaster-oven", "tumble-dryer", "vacuum", "washing-machine"];

export default function SelecionarIconeScreen({ navigation, route }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    const { tipo, marca, modelo, consumo, origem, icone, idEletrodomestico } = route.params;

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

    const iconColumns = 5;

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[400]} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300], position: "relative" }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Selecionar Ícone</Text>
                                <Icon
                                    name="close-circle"
                                    color={colors.white}
                                    size={RFValue(23)}
                                    onPress={() => {
                                        if (origem === "cadastrar") {
                                            navigation.navigate("CadastrarEletrodomesticos", {
                                                tipo,
                                                marca,
                                                modelo,
                                                consumo,
                                                icone: "",
                                            })
                                        }

                                        if (origem === "editar") {
                                            navigation.navigate("EditarEletrodomesticos", {
                                                idEletrodomestico,
                                                icone,
                                                tipo,
                                                marca,
                                                modelo,
                                                consumo
                                            })
                                        }
                                    }}
                                    style={{ position: "absolute", right: 0 }}
                                />
                            </View>
                            <View style={{ marginTop: RFValue(15), width: "100%" }}>
                                <ScrollView style={{ width: "90%", maxHeight: RFValue(210), backgroundColor: colors.blue[400], borderRadius: RFValue(10), padding: RFValue(10), alignSelf: "center" }} scrollIndicatorInsets={{ right: RFValue(100) }}>
                                    <FlatList
                                        data={listaIcones}
                                        keyExtractor={(item, index) => `${item}-${index}`}
                                        numColumns={iconColumns}
                                        renderItem={({ item, index }) => {
                                            const total = listaIcones.length;
                                            const rows = Math.ceil(total / iconColumns);
                                            const startIndexLastRow = (rows - 1) * iconColumns;
                                            const isLastRow = index >= startIndexLastRow;

                                            return (
                                                <TouchableOpacity
                                                    style={{
                                                        flex: 1,
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        marginHorizontal: RFValue(8),
                                                        marginTop: RFValue(8),
                                                        marginBottom: isLastRow ? 0 : RFValue(8),
                                                        backgroundColor: colors.blue[300],
                                                        borderRadius: RFValue(10),
                                                        paddingVertical: RFValue(10),
                                                    }}
                                                    onPress={() => {
                                                        if (origem === "cadastrar") {
                                                            navigation.navigate("CadastrarEletrodomesticos", {
                                                                tipo,
                                                                marca,
                                                                modelo,
                                                                consumo,
                                                                icone: item,
                                                            })
                                                        }

                                                        if (origem === "editar") {
                                                            navigation.navigate("EditarEletrodomesticos", {
                                                                icone: item,
                                                                idEletrodomestico,
                                                                tipo,
                                                                marca,
                                                                modelo,
                                                                consumo
                                                            })
                                                        }
                                                    }}
                                                    activeOpacity={1}
                                                >
                                                    <Icon name={item as any} size={RFValue(35)} color={colors.white} />
                                                </TouchableOpacity>
                                            );
                                        }}
                                        contentContainerStyle={{
                                            paddingBottom: 0,
                                            paddingHorizontal: RFValue(6),
                                        }}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300], position: "relative" }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Selecionar Ícone</Text>

                                <Icon
                                    name="close-circle"
                                    color={colors.white}
                                    size={RFValue(30)}
                                    onPress={() => {
                                        if (origem === "cadastrar") {
                                            navigation.navigate("CadastrarEletrodomesticos", {
                                                tipo,
                                                marca,
                                                modelo,
                                                consumo,
                                                icone: "",
                                            })
                                        }

                                        if (origem === "editar") {
                                            navigation.navigate("EditarEletrodomesticos", {
                                                idEletrodomestico,
                                                icone,
                                                tipo,
                                                marca,
                                                modelo,
                                                consumo
                                            })
                                        }
                                    }}
                                    style={{ position: "absolute", right: 0, top: RFValue(5) }}
                                />
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(20), gap: RFValue(25) }}>
                                <ScrollView style={{ width: "100%", maxHeight: RFValue(450), backgroundColor: colors.blue[500], alignSelf: "center" }} showsVerticalScrollIndicator={false}>
                                    <FlatList
                                        data={listaIcones}
                                        keyExtractor={(item, index) => `${item}-${index}`}
                                        numColumns={3}
                                        scrollEnabled={false}
                                        renderItem={({ item, index }) => {
                                            const total = listaIcones.length;
                                            const rows = Math.ceil(total / 3);
                                            const startIndexLastRow = (rows - 1) * 3;
                                            const isLastRow = index >= startIndexLastRow;

                                            return (
                                                <TouchableOpacity
                                                    style={{
                                                        flex: 1,
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        marginHorizontal: RFValue(8),
                                                        marginTop: RFValue(8),
                                                        marginBottom: isLastRow ? 0 : RFValue(8),
                                                        backgroundColor: colors.blue[300],
                                                        borderRadius: RFValue(10),
                                                        paddingVertical: RFValue(10),
                                                    }}
                                                    onPress={() => {
                                                        if (origem === "cadastrar") {
                                                            navigation.navigate("CadastrarEletrodomesticos", {
                                                                tipo,
                                                                marca,
                                                                modelo,
                                                                consumo,
                                                                icone: item,
                                                            })
                                                        }

                                                        if (origem === "editar") {
                                                            navigation.navigate("EditarEletrodomesticos", {
                                                                icone: item,
                                                                idEletrodomestico,
                                                                tipo,
                                                                marca,
                                                                modelo,
                                                                consumo
                                                            })
                                                        }
                                                    }}
                                                    activeOpacity={1}
                                                >
                                                    <Icon name={item as any} size={RFValue(45)} color={colors.white} />
                                                </TouchableOpacity>
                                            );
                                        }}
                                        contentContainerStyle={{
                                            paddingBottom: 0
                                        }}
                                    />
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