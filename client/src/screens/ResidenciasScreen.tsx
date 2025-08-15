// React Native
import React, { useState, useEffect, useContext, use } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity } from "react-native";
import { IconButton, ActivityIndicator, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import { Button } from "@/components/button";
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
import { listarResidenciasPorUsuario, excluirResidencia } from "@/services/api";

export default function ResidenciasScreen({ navigation }: any) {
    const { userData } = useContext(AuthContext);
    const { userToken } = useContext(AuthContext);

    // Carregamento de fontes
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    });

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const isVeryWide = (width / height) > 2.4;

    // Teclado
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Estados
    const { signOut } = useContext(AuthContext);
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

    // Modal
    const [textModal, setTextModal] = useState('');
    const [buttonCancelar, setButtonCancelar] = useState('');
    const [buttonConfirmar, setButtonConfirmar] = useState('');
    const [handleConfirmar, setHandleConfirmar] = useState(() => () => { });
    const [modalVisible, setModalVisible] = useState(false);
    const handleOpenModalSair = () => {
        setModalVisible(true);
        setTextModal('Tem certeza que deseja sair da conta?');
        setButtonCancelar('Cancelar');
        setButtonConfirmar('Sair');
        setHandleConfirmar(() => () => {
            signOut();
        });
    };
    const handleOpenModalExcluir = () => {
        setModalVisible(true);
        setTextModal('Tem certeza que deseja excluir esta residência?');
        setButtonCancelar('Cancelar');
        setButtonConfirmar('Excluir');
        setHandleConfirmar(() => async () => {
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

    const handleAvancar = async () => {
        if (selecionada === null) return;

        try {
            await AsyncStorage.setItem('residenciaSelecionada', JSON.stringify(selecionada));
            navigation.navigate('Home');
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
        };
        fetchData();
    }, [userData, userToken]);

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    {isLandscape ?
                        <View style={{ borderWidth: RFValue(1), borderColor: colors.white, borderRadius: RFValue(10), padding: RFValue(10), height: "100%" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: RFValue(600), paddingBottom: RFValue(8), borderBottomWidth: RFValue(3), borderBottomColor: colors.yellow[300] }}>
                                <Text style={{ fontSize: RFValue(12), fontFamily: fontFamily.krona, color: colors.white }}>
                                    Suas Residências
                                </Text>

                                <Button
                                    children="Sair da Conta"
                                    icon={({ size, color }) => (
                                        <Ionicons
                                            name="exit-outline"
                                            size={RFValue(15)}
                                            color={color}
                                        />
                                    )}
                                    compact
                                    contentStyle={{ paddingVertical: RFValue(3), paddingHorizontal: RFValue(0), backgroundColor: colors.red }}
                                    labelStyle={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder }}
                                    style={{
                                        alignSelf: "center",
                                        borderRadius: RFValue(5)
                                    }}
                                    onPress={handleOpenModalSair}
                                />
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
                                                textAlign: "center"
                                            }}
                                        >
                                            Você não tem nenhuma residência cadastrada
                                        </Text>
                                    </View>
                                ) : (
                                    <ScrollView
                                        contentContainerStyle={{ gap: RFValue(6) }}
                                        showsVerticalScrollIndicator={false}
                                        style={{
                                            width: RFValue(600),
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
                                                        width: RFValue(550),
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
                                                    onPress={() => navigation.navigate('EditarResidencias', { residencia: r })}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>

                            <View style={{
                                position: "relative",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: RFValue(600),
                                backgroundColor: colors.blue[500],
                                gap: RFValue(10),
                                paddingVertical: RFValue(5)
                            }}>

                                <View style={{
                                    height: RFValue(35),
                                    width: RFValue(35),
                                    backgroundColor: colors.red,
                                    borderRadius: "50%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4
                                }}>
                                    <IconButton
                                        icon={({ color, size }) => (
                                            <Icon name="home-minus" color={colors.white} size={RFValue(20)} />
                                        )}
                                        size={RFValue(36)}
                                        iconColor="#fff"
                                        disabled={nenhumaSelecionada}
                                        onPress={() => handleOpenModalExcluir()}
                                    />
                                </View>
                                <View style={{
                                    height: RFValue(35),
                                    width: RFValue(35.5),
                                    backgroundColor: colors.black,
                                    borderRadius: "50%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4,
                                    position: "absolute",
                                    top: RFValue(5),
                                    left: RFValue(184.8),
                                    display: nenhumaSelecionada ? 'flex' : 'none',
                                    opacity: nenhumaSelecionada ? 0.5 : 0,
                                }}>
                                </View>

                                <Button
                                    children="Avançar"
                                    contentStyle={{ paddingVertical: RFValue(4) }}
                                    labelStyle={{ fontSize: RFValue(10) }}
                                    style={{
                                        width: RFValue(140),
                                        backgroundColor: colors.blue[300],
                                        borderRadius: RFValue(20)
                                    }}
                                    disabled={nenhumaSelecionada}
                                    onPress={() => handleAvancar()}
                                />

                                <View style={{
                                    height: RFValue(27),
                                    width: RFValue(140.5),
                                    backgroundColor: colors.black,
                                    borderRadius: RFValue(20),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4,
                                    position: "absolute",
                                    top: RFValue(9),
                                    left: RFValue(230),
                                    display: nenhumaSelecionada ? 'flex' : 'none',
                                    opacity: nenhumaSelecionada ? 0.5 : 0,
                                }}>
                                </View>

                                <View style={{
                                    height: RFValue(35),
                                    width: RFValue(35),
                                    backgroundColor: colors.green,
                                    borderRadius: "50%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4
                                }}>
                                    <IconButton
                                        icon={({ color, size }) => (
                                            <Icon name="home-plus" color={colors.white} size={RFValue(20)} />
                                        )}
                                        size={RFValue(36)}
                                        iconColor="#fff"
                                        onPress={() => navigation.navigate('CadastrarResidencias')}
                                    />
                                </View>

                            </View>
                        </View>
                        :
                        <View style={{ padding: RFValue(5), height: "100%", width: "100%" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingBottom: RFValue(8), borderBottomWidth: RFValue(3), borderBottomColor: colors.yellow[300], marginTop: RFValue(20) }}>
                                <Text style={{ fontSize: RFValue(18), fontFamily: fontFamily.krona, color: colors.white }}>
                                    Suas Residências
                                </Text>

                                <Button
                                    children="Sair"
                                    icon={({ size, color }) => (
                                        <Ionicons
                                            name="exit-outline"
                                            size={RFValue(20)}
                                            color={color}
                                        />
                                    )}
                                    compact
                                    contentStyle={{ paddingVertical: RFValue(2), paddingHorizontal: RFValue(6), backgroundColor: colors.red }}
                                    labelStyle={{ fontSize: RFValue(14), color: colors.white, fontFamily: fontFamily.inder }}
                                    style={{
                                        alignSelf: "center",
                                        borderRadius: RFValue(10)
                                    }}
                                    onPress={handleOpenModalSair}
                                />
                            </View>

                            <View style={{ height: RFValue(150), marginTop: RFValue(20), flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                                                fontSize: RFValue(16),
                                                textAlign: "center"
                                            }}
                                        >
                                            Você não tem nenhuma residência cadastrada
                                        </Text>
                                    </View>
                                ) : (
                                    <ScrollView
                                        contentContainerStyle={{ gap: RFValue(6) }}
                                        showsVerticalScrollIndicator={false}
                                        style={{
                                            width: RFValue(310),
                                            height: RFValue(150)
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
                                                        width: RFValue(260),
                                                        height: RFValue(50),
                                                        justifyContent: "center",
                                                        borderRadius: RFValue(15),
                                                        borderWidth: RFValue(3),
                                                        ...(selecionada === r.id_residencia ? { borderColor: colors.yellow[300] } : { borderColor: "transparent" }),
                                                    }}
                                                >
                                                    <Text
                                                        numberOfLines={2}
                                                        ellipsizeMode="tail"
                                                        style={{
                                                            color: colors.white,
                                                            fontFamily: fontFamily.inder,
                                                            fontSize: RFValue(12),
                                                        }}
                                                    >
                                                        {`Residência ${i + 1} — Rua ${r.rua}, ${r.numero} ${r.complemento !== null ? r.complemento : ''}`}
                                                    </Text>
                                                </TouchableOpacity>
                                                <IconButton
                                                    icon={({ color, size }) => (
                                                        <Icon name="pencil" color={colors.white} size={RFValue(25)} />
                                                    )}
                                                    size={RFValue(35)}
                                                    iconColor="#fff"
                                                    onPress={() => navigation.navigate('EditarResidencias', { residencia: r })}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>

                            <View style={{
                                position: "relative",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: RFValue(315),
                                backgroundColor: colors.blue[500],
                                gap: RFValue(10),
                                paddingVertical: RFValue(5)
                            }}>

                                <View style={{
                                    height: RFValue(50),
                                    width: RFValue(50),
                                    backgroundColor: colors.red,
                                    borderRadius: "50%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4
                                }}>
                                    <IconButton
                                        icon={({ color, size }) => (
                                            <Icon name="home-minus" color={colors.white} size={RFValue(30)} />
                                        )}
                                        size={RFValue(40)}
                                        iconColor="#fff"
                                        disabled={nenhumaSelecionada}
                                        onPress={() => handleOpenModalExcluir()}
                                    />
                                </View>
                                <View style={{
                                    height: RFValue(50),
                                    width: RFValue(50.5),
                                    backgroundColor: colors.black,
                                    borderRadius: "50%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4,
                                    position: "absolute",
                                    top: RFValue(5),
                                    left: RFValue(8),
                                    display: nenhumaSelecionada ? 'flex' : 'none',
                                    opacity: nenhumaSelecionada ? 0.5 : 0,
                                }}>
                                </View>

                                <Button
                                    children="Avançar"
                                    contentStyle={{ paddingVertical: RFValue(4) }}
                                    labelStyle={{ fontSize: RFValue(14) }}
                                    style={{
                                        width: RFValue(180),
                                        backgroundColor: colors.blue[300],
                                        borderRadius: RFValue(20)
                                    }}
                                    disabled={nenhumaSelecionada}
                                    onPress={() => handleAvancar()}
                                />

                                <View style={{
                                    height: RFValue(43),
                                    width: RFValue(180.5),
                                    backgroundColor: colors.black,
                                    borderRadius: RFValue(20),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4,
                                    position: "absolute",
                                    top: RFValue(8.5),
                                    left: RFValue(67.5),
                                    display: nenhumaSelecionada ? 'flex' : 'none',
                                    opacity: nenhumaSelecionada ? 0.5 : 0,
                                }}>
                                </View>

                                <View style={{
                                    height: RFValue(50),
                                    width: RFValue(50),
                                    backgroundColor: colors.green,
                                    borderRadius: "50%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    elevation: 4
                                }}>
                                    <IconButton
                                        icon={({ color, size }) => (
                                            <Icon name="home-plus" color={colors.white} size={RFValue(30)} />
                                        )}
                                        size={RFValue(40)}
                                        iconColor="#fff"
                                        onPress={() => navigation.navigate('CadastrarResidencias')}
                                    />
                                </View>

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
        backgroundColor: colors.blue[500]
    },
    container: {
        padding: RFValue(10),
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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
    }
})