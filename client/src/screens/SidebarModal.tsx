import React, { useState, useContext, useEffect } from 'react';
import { View, Image, useWindowDimensions, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

// Componentes
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
import { buscarUsuarioPorEmail, editarNotificacaoUsuario, excluirUsuario } from '@/services/api';

const Sidebar = ({ navigation }: any) => {
    const { userData } = useContext(AuthContext);
    const { userToken } = useContext(AuthContext);

    const route = useRoute();
    const isPage = route.name;

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
    const [checked, setChecked] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            if (userData?.email) {
                const result = await buscarUsuarioPorEmail(userData.email);
                setUsuario(result);
                notificacao = result.ativar_notificacao;
                setChecked(notificacao);
            }
        };

        fetchUsuario();
    }, [userData?.email]);

    const { signOut } = useContext(AuthContext);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    let definirPagina = '';
    switch (isPage) {
        case "Home":
            definirPagina = 'home';
            break;
        case "Graficos":
            definirPagina = 'graficos';
            break;
        case "Metas":
            definirPagina = 'metas';
            break;
        case "Eletrodomesticos":
            definirPagina = 'eletrodomesticos';
            break;
        case "Atividades":
            definirPagina = 'atividades';
            break;
        case "Notificacoes":
            definirPagina = 'notificacao';
            break;
        case "Usuario":
            definirPagina = 'usuario';
            break;
        case "Listas":
            definirPagina = 'listas';
            break;
        case "Configuracoes":
            definirPagina = 'configuracoes';
            break;
    }
    const [ativo, setAtivo] = useState(definirPagina);
    const [isOpen, setIsOpen] = useState(false);
    const [configOpen, setConfigOpen] = useState(false);
    const [perfilOpen, setPerfilOpen] = useState(false);

    // Carregamento de fontes
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    });

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const marginHome = (width / 2) - (RFValue(70) / 2);

    const DrawerArea = TouchableOpacity as any;
    const ViewArea = View as any;

    async function handleModificarNotificacao() {
        setChecked(!checked);

        const response = await editarNotificacaoUsuario(userToken, idUsuario, !checked);
        if (!response) {
            return;
        }
    }

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
        setTextModal('Tem certeza que deseja excluir esta conta?');
        setButtonCancelar('Cancelar');
        setButtonConfirmar('Excluir');
        setHandleConfirmar(() => async () => {
            const excluirResponse = await excluirUsuario(userToken, idUsuario);
            if (!excluirResponse.success) {
                setSnackbarMessage(excluirResponse.message || 'Erro ao excluir residência.');
                return;
            }
            signOut();
        });
    };

    const handleCloseModal = () => setModalVisible(false);

    if (!fontsLoaded) {
        return null
    }

    return (
        <>
            {isLandscape ?
                <>
                    <View style={{ backgroundColor: colors.blue[400], width: "100%", height: "10%", justifyContent: "center", alignItems: "center" }}>
                        <Image
                            style={{ width: RFValue(25), height: RFValue(30) }}
                            source={require("@/assets/logo.png")}
                        />
                    </View>
                    <DrawerArea
                        style={{ width: isOpen ? RFValue(140) : RFValue(40), backgroundColor: colors.blue[400], height: "90%", justifyContent: "flex-start", alignItems: "center", cursor: "default", alignSelf: "flex-start" } as any}
                        onPress={() => setIsOpen(true)}
                        activeOpacity={1}
                    >
                        <View
                            pointerEvents="none"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: RFValue(2.5),
                                width: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.4)', // sombra leve
                                zIndex: 1,
                                borderBottomLeftRadius: RFValue(2),
                                borderBottomRightRadius: RFValue(2),
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                            }}
                        />
                        <ScrollView style={{ width: "100%", maxHeight: RFValue(277) }} contentContainerStyle={{ alignItems: "center", justifyContent: "flex-start" }} showsVerticalScrollIndicator={false}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(6), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: isOpen ? RFValue(120) : RFValue(21), borderRadius: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("home")
                                    navigation.navigate("Home");
                                }}
                            >
                                <Icon name="home" size={RFValue(21)} color={ativo === "home" ? colors.yellow[200] : colors.white} />
                                {isOpen && <Text style={{ color: ativo === "home" ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(8) }}>Home</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(6), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: isOpen ? RFValue(120) : RFValue(21), borderRadius: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("metas")
                                    navigation.navigate("Metas");
                                }}
                            >
                                <Icon name="bullseye-arrow" size={RFValue(21)} color={ativo === "metas" ? colors.yellow[200] : colors.white} />
                                {isOpen && <Text style={{ color: ativo === "metas" ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(8) }}>Metas</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(6), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: isOpen ? RFValue(120) : RFValue(21), borderRadius: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("graficos")
                                    navigation.navigate("Graficos");
                                }}
                            >
                                <Icon name="chart-box-outline" size={RFValue(21)} color={ativo === "graficos" ? colors.yellow[200] : colors.white} />
                                {isOpen && <Text style={{ color: ativo === "graficos" ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(8) }}>Gráficos</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(6), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: isOpen ? RFValue(120) : RFValue(21), borderRadius: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("eletrodomesticos")
                                    navigation.navigate("Eletrodomesticos");
                                }}
                            >
                                <Icon name="lightning-bolt" size={RFValue(21)} color={ativo === "eletrodomesticos" ? colors.yellow[200] : colors.white} />
                                {isOpen && <Text style={{ color: ativo === "eletrodomesticos" ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(8) }}>Eletrodomésticos</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(6), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: isOpen ? RFValue(120) : RFValue(21), borderRadius: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("atividades")
                                    navigation.navigate("Atividades");
                                }}
                            >
                                <Icon name="water" size={RFValue(21)} color={ativo === "atividades" ? colors.yellow[200] : colors.white} />
                                {isOpen && <Text style={{ color: ativo === "atividades" ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(8) }}>Atividades</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(6), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: isOpen ? RFValue(120) : RFValue(21), borderRadius: RFValue(1) }}
                                onPress={() => {
                                    setPerfilOpen(!perfilOpen);
                                    setConfigOpen(false)
                                }}
                            >
                                <Icon name="account-circle" size={RFValue(21)} color={perfilOpen ? colors.yellow[200] : colors.white} />
                                {isOpen && <Text style={{ color: perfilOpen ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(8) }}>Usuário</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(6), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: isOpen ? RFValue(120) : RFValue(21), borderRadius: RFValue(1) }}
                                onPress={() => {
                                    setConfigOpen(!configOpen)
                                    setPerfilOpen(false)
                                }}
                            >
                                <Icon name="cogs" size={RFValue(21)} color={configOpen ? colors.yellow[200] : colors.white} />
                                {isOpen && <Text style={{ color: configOpen ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(8) }}>Configurações</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(6), backgroundColor: colors.blue[400], width: isOpen ? RFValue(120) : RFValue(21), borderRadius: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("notificacao")
                                    navigation.navigate("Notificacoes");
                                }}
                            >
                                <Icon name="bell" size={RFValue(21)} color={ativo === "notificacao" ? colors.yellow[200] : colors.white} />
                                {isOpen && <Text style={{ color: ativo === "notificacao" ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(8) }}>Notificações</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </DrawerArea>
                    <ViewArea
                        onMouseEnter={() => setIsOpen(true)}
                        pointerEvents={isOpen ? 'none' : 'auto'}
                        style={{
                            position: "absolute",
                            top: "10%",
                            left: 0,
                            width: RFValue(40),
                            height: isOpen ? RFValue(0) : RFValue(277),
                            zIndex: 1000,
                            backgroundColor: "transparent",
                        }}
                    />
                    <ConfirmarModal
                        visible={modalVisible}
                        onDismiss={handleCloseModal}
                        changeText={textModal}
                        changeButtonCancelar={buttonCancelar}
                        changeButtonConfirmar={buttonConfirmar}
                        handleConfirmar={handleConfirmar}
                    />
                    {isOpen &&
                        <ViewArea
                            onMouseEnter={() => {
                                setIsOpen(false)
                                setConfigOpen(false)
                                setPerfilOpen(false)
                            }}
                            pointerEvents={!isOpen ? 'none' : 'auto'}
                            style={{
                                position: "absolute",
                                top: "10%",
                                left: RFValue(140),
                                width: RFValue(540),
                                height: RFValue(277),
                                zIndex: 4000,
                                backgroundColor: colors.black,
                                opacity: 0.2
                            }}
                        />
                    }
                    {configOpen &&
                        <ViewArea style={{ position: "absolute", top: RFValue(217), left: RFValue(138), width: RFValue(127), height: RFValue(79), backgroundColor: "transparent", zIndex: 5000 }}
                            onMouseEnter={() => {
                                setConfigOpen(true)
                                setIsOpen(true)
                                setPerfilOpen(false)
                            }}
                        >
                        </ViewArea>
                    }
                    {configOpen && isOpen &&
                        <View style={{ position: "absolute", top: RFValue(217), left: RFValue(145), width: RFValue(120), height: RFValue(79), backgroundColor: colors.blue[200], borderRadius: RFValue(5), zIndex: 6000 }}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(5), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: RFValue(120), borderRadius: RFValue(1), paddingLeft: RFValue(2.5), borderTopLeftRadius: RFValue(5), borderTopRightRadius: RFValue(5) }}
                                onPress={() => handleModificarNotificacao()}
                                activeOpacity={1}
                            >
                                {checked ? (
                                    <Ionicons name="checkbox" size={30} color={colors.white} />
                                ) : (
                                    <Ionicons name="square-outline" size={30} color={colors.white} />
                                )}
                                <Text style={{ fontSize: RFValue(6), color: colors.white, fontFamily: fontFamily.krona }}>Receber notificações</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(5), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: RFValue(120), borderRadius: RFValue(1), paddingLeft: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("")
                                    navigation.navigate("ResidenciasConfig")
                                }}
                            >
                                <Icon name="home-outline" size={RFValue(17)} color={colors.white} />
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(6) }}>Suas Residências</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(5), backgroundColor: colors.blue[400], width: RFValue(120), borderRadius: RFValue(1), borderBottomLeftRadius: RFValue(5), borderBottomRightRadius: RFValue(5), paddingLeft: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("")
                                    navigation.navigate("Suporte")
                                }}
                            >
                                <Icon name="help-circle-outline" size={RFValue(17)} color={colors.white} />
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(6) }}>Suporte ao Cliente</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {perfilOpen &&
                        <ViewArea style={{ position: "absolute", top: RFValue(155), left: RFValue(138), width: RFValue(127), height: RFValue(137), backgroundColor: "transparent", zIndex: 5000 }}
                            onMouseEnter={() => {
                                setPerfilOpen(true)
                                setIsOpen(true)
                                setConfigOpen(false)
                            }}
                        >
                        </ViewArea>
                    }
                    {perfilOpen && isOpen &&
                        <View style={{ position: "absolute", top: RFValue(155), left: RFValue(145), width: RFValue(120), height: RFValue(137), backgroundColor: colors.blue[200], borderRadius: RFValue(5), zIndex: 6000 }}>
                            <View
                                style={{ alignItems: "center", justifyContent: "flex-start", gap: RFValue(3), paddingVertical: RFValue(4.5), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: RFValue(120), borderRadius: RFValue(1), paddingLeft: RFValue(2.5), borderTopLeftRadius: RFValue(5), borderTopRightRadius: RFValue(5) }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(3), width: "100%", paddingLeft: RFValue(1.5) }}>
                                    <Icon name="account-outline" size={RFValue(13)} color={colors.white} />
                                    <Text style={{ fontSize: RFValue(6), color: colors.white, fontFamily: fontFamily.inder }}>Nome: {nomeUsuario}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(3), width: "100%", paddingLeft: RFValue(1.5) }}>
                                    <Icon name="email" size={RFValue(13)} color={colors.white} />
                                    <Text style={{ fontSize: RFValue(6), color: colors.white, fontFamily: fontFamily.inder }}>Email: {emailUsuario}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(3), width: "100%", paddingLeft: RFValue(1.5) }}>
                                    <Icon name="bell-outline" size={RFValue(13)} color={colors.white} />
                                    <Text style={{
                                        fontSize: RFValue(6),
                                        color: colors.white,
                                        fontFamily: fontFamily.inder,
                                    }}>
                                        Notificações{" "}
                                        <Text style={{
                                            color: checked ? colors.green : colors.red
                                        }}>
                                            {checked ? "ativadas" : "desativadas"}
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(5), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: RFValue(120), borderRadius: RFValue(1), paddingLeft: RFValue(1) }}
                                onPress={() => {
                                    setAtivo("")
                                    navigation.navigate("EditarUsuario")
                                }}
                            >
                                <Icon name="account-edit" size={RFValue(17)} color={colors.white} />
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(6) }}>Editar usuário</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(5), backgroundColor: colors.blue[400], borderBottomWidth: 3, borderColor: colors.white, width: RFValue(120), borderRadius: RFValue(1), paddingLeft: RFValue(1) }}
                                onPress={() => handleOpenModalSair()}
                            >
                                <Icon name="exit-run" size={RFValue(17)} color={colors.white} />
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(6) }}>Sair da conta</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: RFValue(5), paddingVertical: RFValue(5), backgroundColor: colors.blue[400], width: RFValue(120), borderRadius: RFValue(1), borderBottomLeftRadius: RFValue(5), borderBottomRightRadius: RFValue(5), paddingLeft: RFValue(1) }}
                                onPress={() => handleOpenModalExcluir()}
                            >
                                <Icon name="delete-forever" size={RFValue(17)} color={colors.white} />
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(6) }}>Excluir conta</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </>
                :
                <>
                    <View style={{ flex: 1, justifyContent: "space-between", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 2000 }}>
                        <View style={{ backgroundColor: colors.blue[400], width: "100%", height: "9%", justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: RFValue(20) }}>
                            <Icon name="bell" size={RFValue(30)} color={ativo === "notificacao" ? colors.yellow[200] : colors.white} onPress={() => navigation.navigate("Notificacoes")} />
                            <Image
                                style={{ width: RFValue(45), height: RFValue(50) }}
                                source={require("@/assets/logo.png")}
                            />
                            <Icon name="account-circle" size={RFValue(30)} color={ativo === "usuario" ? colors.yellow[200] : colors.white} onPress={() => navigation.navigate("Usuario")} />
                        </View>
                        <View style={{ backgroundColor: colors.blue[400], width: "100%", height: "9%", justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: RFValue(20) }}>
                            <View style={{ flexDirection: "row", width: RFValue(100), justifyContent: "space-between" }}>
                                <Icon name="chart-box-outline" size={RFValue(35)} color={ativo === "graficos" ? colors.yellow[200] : colors.white} onPress={() => navigation.navigate("Graficos")} />
                                <Icon name="bullseye-arrow" size={RFValue(35)} color={ativo === "metas" ? colors.yellow[200] : colors.white} onPress={() => navigation.navigate("Metas")} />
                            </View>
                            <View style={{ flexDirection: "row", width: RFValue(100), justifyContent: "space-between" }}>
                                <Icon name="format-list-bulleted" size={RFValue(35)} color={ativo === "listas" ? colors.yellow[200] : colors.white} onPress={() => navigation.navigate("Listas")} />
                                <Icon name="cogs" size={RFValue(35)} color={ativo === "configuracoes" ? colors.yellow[200] : colors.white} onPress={() => navigation.navigate("Configuracoes")} />
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: colors.blue[400], borderRadius: "50%", width: RFValue(70), height: RFValue(70), justifyContent: "center", alignItems: "center", position: "absolute", left: marginHome, bottom: 0, marginBottom: RFValue(10), zIndex: 4000 }}>
                        <View style={{ borderWidth: RFValue(2), borderColor: colors.yellow[200], borderRadius: "50%", width: RFValue(60), height: RFValue(60), justifyContent: "center", alignItems: "center" }}>
                            <Icon name="home" size={RFValue(40)} color={ativo === "home" ? colors.yellow[200] : colors.white} onPress={() => navigation.navigate("Home")} />
                        </View>
                    </View>
                </>}
        </>
    )
};

export default Sidebar;