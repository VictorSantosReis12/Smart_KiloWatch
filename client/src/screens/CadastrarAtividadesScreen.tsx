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
import { Button } from "@/components/button";
import { Input } from "@/components/input";
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
import { buscarUsuarioPorEmail, cadastrarAtividade } from "@/services/api";

const Atividades = [
    {
        "id": 1,
        "nome": "Máquina de Lavar (Modelo Tradicional)",
        "imagem": "washing-machine",
        "litros_minuto": 100,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 2,
        "nome": "Máquina de Lavar (Modelo Moderno)",
        "imagem": "washing-machine",
        "litros_minuto": 40,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 3,
        "nome": "Tanque",
        "imagem": "water-pump",
        "litros_minuto": 15,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 4,
        "nome": "Descarga (Caixa Aclopada)",
        "imagem": "toilet",
        "litros_minuto": 6,
        "is_tempo_uso": 1,
        "manter_tempo_uso": 0
    },
    {
        "id": 5,
        "nome": "Descarga (Modelo Econômico)",
        "imagem": "toilet",
        "litros_minuto": 3,
        "is_tempo_uso": 1,
        "manter_tempo_uso": 0
    },
    {
        "id": 6,
        "nome": "Pia do Banheiro (Baixa Vazão)",
        "imagem": "water-pump",
        "litros_minuto": 6,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 7,
        "nome": "Pia do Banheiro (Alta Vazão)",
        "imagem": "water-pump",
        "litros_minuto": 12,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 8,
        "nome": "Chuveiro (Elétrico)",
        "imagem": "shower-head",
        "litros_minuto": 10,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 9,
        "nome": "Chuveiro (A gás ou Pressurizado)",
        "imagem": "shower-head",
        "litros_minuto": 15,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 10,
        "nome": "Pia da Cozinha (Baixa Vazão)",
        "imagem": "water-pump",
        "litros_minuto": 8,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 11,
        "nome": "Pia da Cozinha (Alta Vazão)",
        "imagem": "water-pump",
        "litros_minuto": 15,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
    {
        "id": 12,
        "nome": "Lava-louças (Modelo Convencional)",
        "imagem": "dishwasher",
        "litros_minuto": 12,
        "is_tempo_uso": 1,
        "manter_tempo_uso": 0
    },
    {
        "id": 13,
        "nome": "Lava-louças (Modelo Econômico)",
        "imagem": "dishwasher",
        "litros_minuto": 6,
        "is_tempo_uso": 1,
        "manter_tempo_uso": 0
    },
    {
        "id": 14,
        "nome": "Mangueira",
        "imagem": "pipe-valve",
        "litros_minuto": 6,
        "is_tempo_uso": 0,
        "manter_tempo_uso": 0
    },
]

export default function CadastrarAtividadesScreen({ navigation, route }: any) {
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

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleRegister = async (idAtividade: any, nome: any, imagem: any, litrosMinuto: any, isTempoUso: any, manterTempoUso: any) => {
        const idUsuario = userData.id_usuario;
        try {
            const cadastroResponse = await cadastrarAtividade(userToken, idUsuario, nome, imagem, litrosMinuto, isTempoUso, manterTempoUso);

            if (!cadastroResponse.success) {
                setSnackbarVisible(true);
                setSnackbarMessage(cadastroResponse.message || 'Erro ao cadastrar atividade.');
                return;
            }

            navigation.navigate("Atividades");
        } catch (error) {
            console.error('Erro no handleRegister:', error);
        }
    }

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
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Inserir Atividade</Text>
                                <Icon name="close-circle" color={colors.white} size={RFValue(23)} onPress={() => navigation.navigate("Atividades")} style={{ position: "absolute", right: 0 }} />
                            </View>
                            <View style={{ marginTop: RFValue(15), width: "100%" }}>
                                <ScrollView style={{ width: "90%", maxHeight: RFValue(210), backgroundColor: colors.blue[400], borderRadius: RFValue(10), padding: RFValue(10), alignSelf: "center" }} scrollIndicatorInsets={{ right: RFValue(100) }}>
                                    <FlatList
                                        data={Atividades}
                                        keyExtractor={(item) => item.id.toString()}
                                        style={{ width: "100%", height: "100%", backgroundColor: colors.blue[400], borderRadius: RFValue(10) }}
                                        contentContainerStyle={{ paddingTop: RFValue(5), paddingHorizontal: RFValue(10) }}
                                        renderItem={({ item, index }) => {
                                            const isLastRow = index === Atividades.length - 1;

                                            return (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: colors.blue[300],
                                                        flexDirection: "row",
                                                        justifyContent: "flex-start",
                                                        alignItems: "center",
                                                        marginBottom: isLastRow ? RFValue(0) : RFValue(8),
                                                        padding: RFValue(5),
                                                        borderRadius: RFValue(10)
                                                    }}
                                                    activeOpacity={1}
                                                    onPress={() => handleRegister(item.id, item.nome, item.imagem, item.litros_minuto, item.is_tempo_uso, item.manter_tempo_uso)}
                                                >
                                                    <View>
                                                        <Icon name={item.imagem as any} size={RFValue(28)} color={colors.white} />
                                                    </View>
                                                    <View style={{ gap: RFValue(3), marginLeft: RFValue(8) }}>
                                                        <Text style={styles.textTitle}>{item.nome}</Text>
                                                        <Text style={styles.text}>{item.litros_minuto}L por {item.is_tempo_uso === 0 ? "minuto" : "uso"}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </ScrollView>
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300], position: "relative" }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Inserir Atividade</Text>

                                <Icon
                                    name="close-circle"
                                    color={colors.white}
                                    size={RFValue(30)}
                                    onPress={() => navigation.navigate("Atividades")}
                                    style={{ position: "absolute", right: 0, top: RFValue(5) }}
                                />
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(20), gap: RFValue(25) }}>
                                <ScrollView style={{ width: "100%", maxHeight: RFValue(450), backgroundColor: colors.blue[500], alignSelf: "center" }}>
                                    <FlatList
                                        data={Atividades}
                                        keyExtractor={(item) => item.id.toString()}
                                        style={{ width: "100%", height: "100%", backgroundColor: colors.blue[500] }}
                                        scrollEnabled={false}
                                        renderItem={({ item, index }) => {
                                            const isLastRow = index === Atividades.length - 1;

                                            return (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: colors.blue[300],
                                                        flexDirection: "row",
                                                        justifyContent: "flex-start",
                                                        alignItems: "center",
                                                        marginBottom: isLastRow ? RFValue(0) : RFValue(10),
                                                        padding: RFValue(5),
                                                        borderRadius: RFValue(10)
                                                    }}
                                                    activeOpacity={1}
                                                    onPress={() => handleRegister(item.id, item.nome, item.imagem, item.litros_minuto, item.is_tempo_uso, item.manter_tempo_uso)}
                                                >
                                                    <View>
                                                        <Icon name={item.imagem as any} size={RFValue(28)} color={colors.white} />
                                                    </View>
                                                    <View style={{ gap: RFValue(3), marginLeft: RFValue(8) }}>
                                                        <Text style={styles.textTitle}>{item.nome}</Text>
                                                        <Text style={styles.text}>{item.litros_minuto}L por {item.is_tempo_uso === 0 ? "minuto" : "uso"}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
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
    textTitle: {
        fontSize: RFValue(12),
        color: colors.white,
        fontFamily: fontFamily.inder,
        fontWeight: "bold",
    },
    text: {
        fontSize: RFValue(12),
        color: colors.white,
        fontFamily: fontFamily.inder,
    },
})