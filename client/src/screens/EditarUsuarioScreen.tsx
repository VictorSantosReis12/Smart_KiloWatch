// React Native
import React, { useState, useEffect, useContext, use } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity } from "react-native";
import { IconButton, ActivityIndicator, TextInput, Snackbar, Switch } from 'react-native-paper';
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
import InputModal from "../screens/InputModal";

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
import { buscarUsuarioPorEmail, editarUsuario, editarNomeUsuario, editarEmailUsuario } from "@/services/api";

export default function EditarUsuarioScreen({ navigation }: any) {
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
    const { signIn } = useContext(AuthContext);

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
    const [notificacao, setNotificacao] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            if (userData?.email) {
                const result = await buscarUsuarioPorEmail(userData.email);
                setUsuario(result);
                setNotificacao(result.ativar_notificacao);
            }
        };

        fetchUsuario();
    }, [userData?.email]);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Modal
    const [textModal, setTextModal] = useState('Inserir senha atual');
    const [buttonCancelar, setButtonCancelar] = useState('Cancelar');
    const [buttonConfirmar, setButtonConfirmar] = useState('Salvar');
    const handleConfirmar = () => {
        let hasError = false;
        const newErrors: { nome: string; email: string; senhaAtual: string; senhaNova: string } = { nome: '', email: '', senhaAtual: '', senhaNova: '' };

        if (senhaAtual === '') {
            newErrors.senhaAtual = 'Por favor, preencha a Senha Atual.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setErrors({ nome: '', email: '', senhaAtual: '', senhaNova: '' });

        handleRegister();
    }

    const [modalVisible, setModalVisible] = useState(false);

    const handleCloseModal = () => setModalVisible(false);

    const handleRegister= async () => {
        const newErrors: { nome: string; email: string; senhaAtual: string; senhaNova: string } = { nome: '', email: '', senhaAtual: '', senhaNova: '' };

        if (checked) {
            const usuarioResponse = await editarUsuario(userToken, idUsuario, nome, email, senhaAtual, senhaNova, notificacao);
            if (!usuarioResponse.success) {
                if (usuarioResponse.message === 'Senha incorreta.') {
                    newErrors.senhaAtual = 'Senha Incorreta.';
                    setErrors(newErrors);
                    return;
                }
                setSnackbarVisible(true);
                setSnackbarMessage(usuarioResponse.message || 'Erro ao editar usuário.');
                setModalVisible(false);
                return;
            }
            const tokenNovoNome = usuarioResponse.token;
            await signIn(tokenNovoNome, null, true);
            setSnackbarVisible(true);
            setSnackbarMessage(usuarioResponse.message || 'Usuário editado com sucesso.');
            setModalVisible(false);
            setChecked(false);
            setErrors({ nome: '', email: '', senhaAtual: '', senhaNova: '' });
        } else {
            const nomeResponse = await editarNomeUsuario(userToken, idUsuario, nome, email, senhaAtual);
            if (!nomeResponse.success) {
                if (nomeResponse.message === 'Senha incorreta.') {
                    newErrors.senhaAtual = 'Senha Incorreta.';
                    setErrors(newErrors);
                    return;
                }
                setSnackbarVisible(true);
                setSnackbarMessage(nomeResponse.message || 'Erro ao editar nome.');
                setModalVisible(false);
                return;
            }
            const tokenNovoNome = nomeResponse.token;
            await signIn(tokenNovoNome, null, true);

            const emailResponse = await editarEmailUsuario(userToken, idUsuario, nome, email);
            if (!emailResponse.success) {
                setSnackbarVisible(true);
                setSnackbarMessage(emailResponse.message || 'Erro ao editar email.');
                setModalVisible(false);
                return;
            }
            const tokenNovoEmail = emailResponse.token;
            await signIn(tokenNovoEmail, null, true);

            setSnackbarVisible(true);
            setSnackbarMessage('Usuário editado com sucesso.');
            setModalVisible(false);
            setErrors({ nome: '', email: '', senhaAtual: '', senhaNova: '' });
        }
    }

    const [nome, setNome] = useState(nomeUsuario);
    const [email, setEmail] = useState(emailUsuario);
    const [senhaAtual, setSenhaAtual] = useState('');
    const [senhaNova, setSenhaNova] = useState('');
    const [senhaAtualVisivel, setSenhaAtualVisivel] = useState(false);
    const [senhaNovaVisivel, setSenhaNovaVisivel] = useState(false);
    const [errorMessages, setErrorMessages] = useState({ nome: '', email: '', senhaAtual: '', senhaNova: '' });
    const [errors, setErrors] = useState({ nome: '', email: '', senhaAtual: '', senhaNova: '' });
    const [checked, setChecked] = useState(false);

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
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Editar Usuário</Text>
                            </View>
                            <View style={{ marginTop: RFValue(10) }}>
                                <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(5) }}>
                                    Nome Completo
                                </Text>
                                <Input
                                    border={!!errors.nome === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    disableLabel={true}
                                    placeholder="Nome Completo"
                                    value={nome}
                                    styleLabel={{ color: !!errors.nome === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.nome === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        setNome(v);
                                        if (errors.nome) {
                                            setErrors(prev => ({ ...prev, nome: '' }));
                                        }
                                        if (errorMessages.nome) {
                                            setErrorMessages(prev => ({ ...prev, nome: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(610), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                    hasError={!!errors.nome}
                                    errorText={errors.nome}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                />
                            </View>
                            <View style={{ marginTop: RFValue(5) }}>
                                <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(5) }}>
                                    Email
                                </Text>
                                <Input
                                    border={!!errors.email === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    disableLabel={true}
                                    placeholder="Email"
                                    value={email}
                                    styleLabel={{ color: !!errors.email === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.email === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        setEmail(v);
                                        if (errors.email) {
                                            setErrors(prev => ({ ...prev, email: '' }));
                                        }
                                        if (errorMessages.email) {
                                            setErrorMessages(prev => ({ ...prev, email: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(610), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                    hasError={!!errors.email}
                                    errorText={errors.email}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: RFValue(610), marginTop: RFValue(5) }}>
                                <TouchableOpacity
                                    style={[styles.caixa, {
                                        width: "auto",
                                        height: RFValue(48),
                                        paddingHorizontal: RFValue(10),
                                    }]}
                                    onPress={() => {
                                        setChecked(!checked)
                                        setSenhaNova('');
                                    }}
                                    activeOpacity={1}
                                >
                                    <Switch
                                        value={checked}
                                        onValueChange={setChecked}
                                        color={colors.blue[200]}
                                        trackColor={{ false: "#575757ff", true: colors.blue[400] }}
                                    />

                                    <Text style={[styles.label, { fontSize: RFValue(10), color: colors.white }]}>Alterar a senha</Text>
                                </TouchableOpacity>

                                {checked && (
                                    <Input
                                        border={!!errors.senhaNova === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        label="Senha Nova"
                                        value={senhaNova}
                                        styleLabel={{ color: !!errors.senhaNova === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                        contentStyle={{ fontSize: RFValue(10) }}
                                        outlineColor={!!errors.senhaNova === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setSenhaNova(v);
                                            if (errors.senhaNova) {
                                                setErrors(prev => ({ ...prev, senhaNova: '' }));
                                            }
                                            if (errorMessages.senhaNova) {
                                                setErrorMessages(prev => ({ ...prev, senhaNova: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(450), height: RFValue(25), marginBottom: RFValue(0), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.senhaNova}
                                        errorText={errors.senhaNova}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), top: RFValue(25), bottom: RFValue(0) }]}
                                        secureTextEntry={!senhaNovaVisivel}
                                        right={
                                            <TextInput.Icon
                                                icon={senhaNovaVisivel ? 'eye-off' : 'eye'}
                                                color="#fff"
                                                size={RFValue(15)}
                                                onPress={() => setSenhaNovaVisivel(!senhaNovaVisivel)}
                                                forceTextInputFocus={false}
                                            />
                                        }
                                    />)}
                            </View>
                            <Button
                                children="Confirmar"
                                contentStyle={{ paddingVertical: RFValue(4), backgroundColor: colors.green }}
                                labelStyle={{ fontSize: RFValue(10), color: colors.white }}
                                style={{
                                    width: RFValue(200),
                                    backgroundColor: colors.green,
                                    borderRadius: RFValue(20),
                                    marginTop: RFValue(15)
                                }}
                                onPress={() => {
                                    let hasError = false;
                                    const newErrors: { nome: string; email: string; senhaAtual: string; senhaNova: string } = { nome: '', email: '', senhaAtual: '', senhaNova: '' };

                                    if (nome.trim() === '') {
                                        newErrors.nome = 'Por favor, preencha o Nome Completo.';
                                        hasError = true;
                                    }

                                    if (email.trim() === '') {
                                        newErrors.email = 'Por favor, preencha o Email.';
                                        hasError = true;
                                    }

                                    if (checked && senhaNova === '') {
                                        newErrors.senhaNova = 'Por favor, preencha a Senha Nova.';
                                        hasError = true;
                                    }

                                    if (hasError) {
                                        setErrors(newErrors);
                                        return;
                                    }

                                    setErrors({ nome: '', email: '', senhaAtual: '', senhaNova: '' });

                                    setSenhaAtual('');
                                    setSenhaAtualVisivel(false);
                                    setModalVisible(true);
                                }}
                            />
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Editar Usuário</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30), gap: RFValue(15) }}>
                                <View>
                                    <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(8) }}>
                                        Nome Completo
                                    </Text>
                                    <Input
                                        border={!!errors.nome === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        disableLabel={true}
                                        placeholder="Nome Completo"
                                        value={nome}
                                        styleLabel={{ color: !!errors.nome === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                        contentStyle={{ fontSize: RFValue(16) }}
                                        outlineColor={!!errors.nome === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setNome(v);
                                            if (errors.nome) {
                                                setErrors(prev => ({ ...prev, nome: '' }));
                                            }
                                            if (errorMessages.nome) {
                                                setErrorMessages(prev => ({ ...prev, nome: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: "100%", height: RFValue(40), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.nome}
                                        errorText={errors.nome}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(0) }]}
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(8) }}>
                                        Email
                                    </Text>
                                    <Input
                                        border={!!errors.email === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        disableLabel={true}
                                        placeholder="Email"
                                        value={email}
                                        styleLabel={{ color: !!errors.email === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                        contentStyle={{ fontSize: RFValue(16) }}
                                        outlineColor={!!errors.email === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setEmail(v);
                                            if (errors.email) {
                                                setErrors(prev => ({ ...prev, email: '' }));
                                            }
                                            if (errorMessages.email) {
                                                setErrorMessages(prev => ({ ...prev, email: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: "100%", height: RFValue(40), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.email}
                                        errorText={errors.email}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[styles.caixa, {
                                        width: "auto",
                                        height: RFValue(48),
                                        paddingHorizontal: RFValue(10),
                                        transform: [{ scaleX: RFValue(1.2) }, { scaleY: RFValue(1.2) }]
                                    }]}
                                    onPress={() => {
                                        setChecked(!checked)
                                        setSenhaNova('');
                                    }}
                                    activeOpacity={1}
                                >
                                    <Switch
                                        value={checked}
                                        onValueChange={setChecked}
                                        color={colors.blue[200]}
                                        trackColor={{ false: "#575757ff", true: colors.blue[400] }}
                                    />

                                    <Text style={[styles.label, { fontSize: RFValue(16), color: colors.white }]}>Alterar a senha</Text>
                                </TouchableOpacity>

                                <Input
                                    border={!!errors.senhaNova === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Senha Nova"
                                    value={senhaNova}
                                    styleLabel={{ color: !!errors.senhaNova === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                    contentStyle={{ fontSize: RFValue(16) }}
                                    outlineColor={!!errors.senhaNova === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        setSenhaNova(v);
                                        if (errors.senhaNova) {
                                            setErrors(prev => ({ ...prev, senhaNova: '' }));
                                        }
                                        if (errorMessages.senhaNova) {
                                            setErrorMessages(prev => ({ ...prev, senhaNova: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: "100%", height: RFValue(40), marginBottom: RFValue(60), borderRadius: RFValue(10), opacity: checked ? 1 : 0 }]}
                                    editable={!checked ? false : true}
                                    hasError={!!errors.senhaNova}
                                    errorText={errors.senhaNova}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(12), top: RFValue(45), opacity: checked ? 1 : 0 }]}
                                    secureTextEntry={!senhaNovaVisivel}
                                    right={
                                        <TextInput.Icon
                                            icon={senhaNovaVisivel ? 'eye-off' : 'eye'}
                                            color="#fff"
                                            size={RFValue(25)}
                                            onPress={() => setSenhaNovaVisivel(!senhaNovaVisivel)}
                                            forceTextInputFocus={false}
                                        />
                                    }
                                />

                                <Button
                                    children="Confirmar"
                                    contentStyle={{ paddingVertical: RFValue(4), backgroundColor: colors.green }}
                                    labelStyle={{ fontSize: RFValue(16), color: colors.white }}
                                    style={{
                                        width: RFValue(200),
                                        backgroundColor: colors.green,
                                        borderRadius: RFValue(20),
                                        marginTop: RFValue(15),
                                        alignSelf: 'center'
                                    }}
                                    onPress={() => {
                                        let hasError = false;
                                        const newErrors: { nome: string; email: string; senhaAtual: string; senhaNova: string } = { nome: '', email: '', senhaAtual: '', senhaNova: '' };

                                        if (nome.trim() === '') {
                                            newErrors.nome = 'Por favor, preencha o Nome Completo.';
                                            hasError = true;
                                        }

                                        if (email.trim() === '') {
                                            newErrors.email = 'Por favor, preencha o Email.';
                                            hasError = true;
                                        }

                                        if (checked && senhaNova === '') {
                                            newErrors.senhaNova = 'Por favor, preencha a Senha Nova.';
                                            hasError = true;
                                        }

                                        if (hasError) {
                                            setErrors(newErrors);
                                            return;
                                        }

                                        setErrors({ nome: '', email: '', senhaAtual: '', senhaNova: '' });

                                        setSenhaAtual('');
                                        setSenhaAtualVisivel(false);
                                        setModalVisible(true);
                                    }}
                                />
                            </View>
                        </View>
                    }

                    <Sidebar navigation={navigation} />

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
                            marginBottom: isLandscape ? RFValue(5) : RFValue(90),
                            zIndex: 5000,
                        }}

                    >
                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder }}>{snackbarMessage}</Text>
                    </Snackbar>
                </View>
                <InputModal
                    visible={modalVisible}
                    onDismiss={handleCloseModal}
                    changeText={textModal}
                    changeButtonCancelar={buttonCancelar}
                    changeButtonConfirmar={buttonConfirmar}
                    handleConfirmar={handleConfirmar}
                    input={
                        isLandscape ?
                            <Input
                                border={!!errors.senhaAtual === true ? colors.red : colors.gray}
                                autoCapitalize="none"
                                label="Senha Atual"
                                value={senhaAtual}
                                styleLabel={{ color: !!errors.senhaAtual === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                contentStyle={{ fontSize: RFValue(10) }}
                                outlineColor={!!errors.senhaAtual === true ? colors.red : 'transparent'}
                                onChangeText={v => {
                                    setSenhaAtual(v);
                                    if (errors.senhaAtual) {
                                        setErrors(prev => ({ ...prev, senhaAtual: '' }));
                                    }
                                    if (errorMessages.senhaAtual) {
                                        setErrorMessages(prev => ({ ...prev, senhaAtual: '' }));
                                    }
                                }}
                                style={[styles.input, { width: RFValue(200), height: RFValue(25), marginBottom: RFValue(0), borderRadius: RFValue(10), alignSelf: 'center' }]}
                                hasError={!!errors.senhaAtual}
                                errorText={errors.senhaAtual}
                                helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0), top: RFValue(25), left: RFValue(25) }]}
                                secureTextEntry={!senhaAtualVisivel}
                                right={
                                    <TextInput.Icon
                                        icon={senhaAtualVisivel ? 'eye-off' : 'eye'}
                                        color="#fff"
                                        size={RFValue(15)}
                                        onPress={() => setSenhaAtualVisivel(!senhaAtualVisivel)}
                                        forceTextInputFocus={false}
                                    />
                                }
                            />
                            :
                            <Input
                                border={!!errors.senhaAtual === true ? colors.red : colors.gray}
                                autoCapitalize="none"
                                label="Senha Atual"
                                value={senhaAtual}
                                styleLabel={{ color: !!errors.senhaAtual === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                contentStyle={{ fontSize: RFValue(16) }}
                                outlineColor={!!errors.senhaAtual === true ? colors.red : 'transparent'}
                                onChangeText={v => {
                                    setSenhaAtual(v);
                                    if (errors.senhaAtual) {
                                        setErrors(prev => ({ ...prev, senhaAtual: '' }));
                                    }
                                    if (errorMessages.senhaAtual) {
                                        setErrorMessages(prev => ({ ...prev, senhaAtual: '' }));
                                    }
                                }}
                                style={[styles.input, { width: RFValue(250), height: RFValue(40), marginBottom: RFValue(35), borderRadius: RFValue(10), alignSelf: 'center' }]}
                                hasError={!!errors.senhaAtual}
                                errorText={errors.senhaAtual}
                                helperStyle={[styles.helperText, { fontSize: RFValue(12), top: RFValue(45), left: RFValue(20) }]}
                                secureTextEntry={!senhaAtualVisivel}
                                right={
                                    <TextInput.Icon
                                        icon={senhaAtualVisivel ? 'eye-off' : 'eye'}
                                        color="#fff"
                                        size={RFValue(25)}
                                        onPress={() => setSenhaAtualVisivel(!senhaAtualVisivel)}
                                        forceTextInputFocus={false}
                                    />
                                }
                            />
                    }
                />
            </SafeAreaView>
        </SafeAreaProvider >
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
    }, input: {
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
        height: RFValue(35)
    },
    label: {
        marginLeft: RFValue(8),
        fontSize: RFValue(14),
        fontFamily: fontFamily.inder
    }
})