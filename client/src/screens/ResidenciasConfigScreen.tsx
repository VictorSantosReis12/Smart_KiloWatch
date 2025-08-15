// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity } from "react-native";
import { IconButton, ActivityIndicator, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import { Button } from "@/components/button/index"
import Sidebar from "../screens/SidebarModal";
import ConfirmarModal from "../screens/ConfirmarModal";

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
import { excluirResidencia, listarResidenciasPorUsuario } from "@/services/api";

export default function ResidenciasConfigScreen({ navigation }: any) {
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

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [residencias, setResidencias] = useState<Array<{
        id_residencia: number;
        rua: string;
        numero: string;
        complemento: string | null;
    }>>([]);
    const [carregando, setCarregando] = useState(true);
    const [selecionada, setSelecionada] = useState<number | null>(null);
    let nenhumaSelecionada = selecionada === null;

    const selecionarResidencia = (id: number) => {
        setSelecionada(id);
    };

    const [residenciaAtiva, setResidenciaAtiva] = useState('');

    // Modal
    const [textModal, setTextModal] = useState('');
    const [buttonCancelar, setButtonCancelar] = useState('');
    const [buttonConfirmar, setButtonConfirmar] = useState('');
    const [handleConfirmar, setHandleConfirmar] = useState(() => () => { });
    const [modalVisible, setModalVisible] = useState(false);
    const handleOpenModalExcluir = () => {
        setModalVisible(true);
        setTextModal('Tem certeza que deseja excluir esta residência?');
        setButtonCancelar('Cancelar');
        setButtonConfirmar('Excluir');
        setHandleConfirmar(() => async () => {
            if (Number(residenciaAtiva) === selecionada) {
                setSnackbarVisible(true);
                setSnackbarMessage("Não é possível excluir a residência ativa.");
                setModalVisible(false);
                return;
            }
            try {
                const excluirResponse = await excluirResidencia(userToken, selecionada);
                if (!excluirResponse.success) {
                    setSnackbarVisible(true);
                    setSnackbarMessage(excluirResponse.message || 'Erro ao excluir residência.');
                    return;
                }
                setResidencias(prev => prev.filter(res => res.id_residencia !== selecionada));

                setSelecionada(null);

                setModalVisible(false);

                setSnackbarVisible(true);
                setSnackbarMessage('Residência excluída com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir residência:', error);
            }
        });
    };
    const handleCloseModal = () => setModalVisible(false);

    const handleSalvar = async () => {
        if (selecionada === null) return;

        try {
            await AsyncStorage.setItem('residenciaSelecionada', JSON.stringify(selecionada));
            setResidenciaAtiva(JSON.stringify(selecionada));
        } catch (error) {
            console.error('Erro ao salvar residência no AsyncStorage:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await listarResidenciasPorUsuario(
                    userToken,
                    userData.id_usuario
                );
                if (res.success) setResidencias(res.data);
            } catch (e) {
                console.error('Erro ao buscar residências:', e);
            } finally {
                setCarregando(false);
            }

            const residenciaString = await AsyncStorage.getItem('residenciaSelecionada');
            if (residenciaString !== null) {
                const residenciaSelecionada = JSON.parse(residenciaString);
                setResidenciaAtiva(residenciaSelecionada);
            } else {
                console.error('Nenhuma residência selecionada salva.');
            }
        };
        fetchData();
    }, [userData, userToken]);

    console.log(residenciaAtiva)

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    <Sidebar navigation={navigation} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Suas Residências</Text>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                width: RFValue(610),
                                backgroundColor: colors.blue[500],
                                paddingVertical: RFValue(5),
                                marginTop: RFValue(10)
                            }}>

                                <Button
                                    children="Cadastrar nova residência"
                                    contentStyle={{ paddingVertical: RFValue(2), backgroundColor: colors.green, gap: RFValue(5) }}
                                    labelStyle={{ fontSize: RFValue(6), color: colors.white }}
                                    icon={({ size, color }) => (
                                        <Icon name="home-plus" color={colors.white} size={RFValue(15)} />
                                    )}
                                    style={{
                                        width: RFValue(170),
                                        backgroundColor: colors.green,
                                        borderRadius: RFValue(20)
                                    }}
                                    onPress={() => navigation.navigate("CadastrarResidenciasConfig")}
                                />

                                <Button
                                    children="Definir como ativa"
                                    contentStyle={{ paddingVertical: RFValue(2), backgroundColor: colors.blue[400], gap: RFValue(5) }}
                                    labelStyle={{ fontSize: RFValue(6), color: colors.white }}
                                    icon={({ size, color }) => (
                                        <Icon name="home-switch" color={colors.white} size={RFValue(15)} />
                                    )}
                                    style={{
                                        width: RFValue(140),
                                        backgroundColor: colors.blue[400],
                                        borderRadius: RFValue(20)
                                    }}
                                    onPress={() => handleSalvar()}
                                    disabled={nenhumaSelecionada}
                                />

                                <View style={{
                                    height: RFValue(22),
                                    width: RFValue(140.5),
                                    backgroundColor: colors.black,
                                    borderRadius: RFValue(10),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4,
                                    position: "absolute",
                                    top: RFValue(5),
                                    left: RFValue(235),
                                    display: (nenhumaSelecionada || selecionada === Number(residenciaAtiva)) ? 'flex' : 'none',
                                    opacity: (nenhumaSelecionada || selecionada === Number(residenciaAtiva)) ? 0.5 : 0,
                                }}></View>

                                <Button
                                    children="Excluir residência"
                                    contentStyle={{ paddingVertical: RFValue(2), backgroundColor: colors.red, gap: RFValue(5) }}
                                    labelStyle={{ fontSize: RFValue(6), color: colors.white }}
                                    icon={({ size, color }) => (
                                        <Icon name="home-minus" color={colors.white} size={RFValue(15)} />
                                    )}
                                    style={{
                                        width: RFValue(170),
                                        backgroundColor: colors.green,
                                        borderRadius: RFValue(20)
                                    }}
                                    disabled={nenhumaSelecionada}
                                    onPress={() => handleOpenModalExcluir()}
                                />

                                <View style={{
                                    height: RFValue(22),
                                    width: RFValue(171),
                                    backgroundColor: colors.black,
                                    borderRadius: RFValue(10),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4,
                                    position: "absolute",
                                    top: RFValue(5),
                                    left: RFValue(407),
                                    display: nenhumaSelecionada ? 'flex' : 'none',
                                    opacity: nenhumaSelecionada ? 0.5 : 0,
                                }}></View>

                            </View>
                            <View style={{ height: RFValue(190), marginTop: RFValue(5), flex: 1, justifyContent: "center", alignItems: "center" }}>
                                {carregando ? (
                                    <ActivityIndicator animating={true} size="large" color={colors.white} />
                                ) : residencias.length === 0 ? (
                                    <View
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.white,
                                                fontFamily: fontFamily.inder,
                                                fontSize: RFValue(14),
                                            }}
                                        >
                                            Você não tem nenhuma residência cadastrada.
                                        </Text>
                                    </View>
                                ) : (
                                    <ScrollView
                                        contentContainerStyle={{ gap: RFValue(6) }}
                                        showsVerticalScrollIndicator={false}
                                        style={{
                                            width: RFValue(610),
                                            height: RFValue(190)
                                        }}
                                    >
                                        {residencias.map((r, i) => (
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} key={r.id_residencia}>
                                                <TouchableOpacity
                                                    key={r.id_residencia}
                                                    onPress={() => selecionarResidencia(r.id_residencia)}
                                                    style={{
                                                        backgroundColor: colors.blue[400],
                                                        padding: RFValue(8),
                                                        width: RFValue(560),
                                                        height: RFValue(36),
                                                        justifyContent: "center",
                                                        borderRadius: RFValue(8),
                                                        borderWidth: RFValue(2),
                                                        ...(selecionada === r.id_residencia ? { borderColor: colors.yellow[300] } : { borderColor: "transparent" }),
                                                    }}
                                                >
                                                    <Text
                                                        numberOfLines={2}
                                                        ellipsizeMode="tail"
                                                        style={{
                                                            color: colors.white,
                                                            fontFamily: fontFamily.inder,
                                                            fontSize: RFValue(10),
                                                        }}
                                                    >
                                                        {`Residência ${i + 1} — Rua ${r.rua}, ${r.numero} ${r.complemento !== null ? r.complemento : ''}`}
                                                    </Text>
                                                </TouchableOpacity>
                                                <IconButton
                                                    icon={({ color, size }) => (
                                                        <Icon name="pencil" color={colors.white} size={RFValue(20)} />
                                                    )}
                                                    size={RFValue(36)}
                                                    iconColor="#fff"
                                                    onPress={() => navigation.navigate('EditarResidenciasConfig', { residencia: r })}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Suas Residências</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30), gap: RFValue(25) }}>

                            </View>
                        </View>
                    }
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
                        }}

                    >
                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder }}>{snackbarMessage}</Text>
                    </Snackbar>
                </View>
                <ConfirmarModal
                    visible={modalVisible}
                    onDismiss={handleCloseModal}
                    changeText={textModal}
                    changeButtonCancelar={buttonCancelar}
                    changeButtonConfirmar={buttonConfirmar}
                    handleConfirmar={handleConfirmar}
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
    }
})