// React Native
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, Image, View, StyleSheet, StatusBar, Keyboard, KeyboardEvent, ScrollView, Animated, useWindowDimensions, Text } from "react-native";
import { HelperText, TextInput, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from "react-native-responsive-fontsize";

// Componentes
import { Button } from "@/components/button";
import { Input } from "@/components/input";

// Fontes
import { useFonts } from 'expo-font';
import {
    Inder_400Regular
} from "@expo-google-fonts/inder";
import {
    KronaOne_400Regular
} from "@expo-google-fonts/krona-one";
import { fontFamily } from "@/styles/FontFamily";

// Cores
import { colors } from "@/styles/colors";

// API
import { cadastrarUsuario } from "../services/api";

export default function CadastroScreen({ route, navigation }: any) {
    const { nome, email } = route.params;
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const isVeryWide = (width / height) > 2.4;

    // Teclado
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    // Estados
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [checked, setChecked] = useState(false);
    const [errorMessages, setErrorMessages] = useState({ senha: '', confirmarSenha: '' });
    const [errors, setErrors] = useState({ senha: '', confirmarSenha: '' });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const onKeyboardShow = (e: KeyboardEvent) => {
            setKeyboardHeight(e.endCoordinates.height);
            setIsKeyboardVisible(true);
        };
        const onKeyboardHide = () => {
            setKeyboardHeight(0);
            setIsKeyboardVisible(false);
        };

        const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
        const hideSub = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const handleRegister = async () => {
        let hasError = false;
        const newErrors: { senha: string; confirmarSenha: string } = { senha: '', confirmarSenha: '' };

        if (senha.trim() === '') {
            newErrors.senha = 'Por favor, preencha a Senha.';
            hasError = true;
        }

        if (confirmarSenha.trim() === '') {
            newErrors.confirmarSenha = 'Por favor, preencha o Confirmar Senha.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        if (senha !== confirmarSenha) {
            newErrors.confirmarSenha = 'As senhas não coincidem.';
            setErrors(newErrors);
            return;
        }

        setErrors({ senha: '', confirmarSenha: '' });

        try {
            const cadastroResponse = await cadastrarUsuario(nome, email, senha, checked);

            if (!cadastroResponse.success) {
                setSnackbarVisible(true);
                setSnackbarMessage(cadastroResponse.message || 'Erro no cadastro.');
                return;
            }

            navigation.navigate("Login");
        } catch (error) {
            console.error('Erro no handleRegister:', error);
        }
    };

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                {!isLandscape && !isVeryWide ?
                    <Ionicons
                        name="chevron-back-circle"
                        size={RFValue(39)}
                        color="white"
                        style={{ position: "absolute", top: RFValue(51), left: RFValue(10) }}
                        onPress={() => navigation.navigate("TelaInicial", {
                            fromCadastro: true,
                            nome,
                            email
                        })}
                        zIndex={1000}
                    />
                    : isLandscape && isVeryWide ? (
                        <View style={{ position: "absolute", top: RFValue(20), left: RFValue(20), width: RFValue(25), height: RFValue(25), zIndex: 1000, borderRadius: '50%' }}>
                            <Ionicons
                                name="chevron-back-circle"
                                size={RFValue(25)}
                                color="white"
                                onPress={() => navigation.navigate("TelaInicial", {
                                    fromCadastro: true,
                                    nome,
                                    email
                                })}
                                zIndex={1000}
                            />
                        </View>
                    ) : null
                }
                <View style={[styles.container, { flexDirection: isLandscape ? 'row' : 'column', gap: isLandscape ? RFValue(60) : '0' }]}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    <Image

                        style={[styles.logo, { width: isLandscape ? RFValue(210) : RFValue(316), height: isLandscape ? RFValue(134) : RFValue(202) }]}
                        source={require("@/assets/logo-titulo.png")}

                    />
                    {isLandscape ? (
                        !isVeryWide ? (
                            <View style={{ alignItems: "center", justifyContent: "center", borderWidth: RFValue(1), borderColor: colors.white, borderRadius: RFValue(10), padding: RFValue(15) }}>
                                <Ionicons
                                    name="chevron-back-circle"
                                    size={RFValue(20)}
                                    style={{ position: "absolute", top: RFValue(11), left: RFValue(5) }}
                                    color="white"
                                    onPress={() => navigation.navigate("TelaInicial", {
                                        fromCadastro: true,
                                        nome,
                                        email
                                    })}
                                    zIndex={1000}
                                />
                                <Text style={{ fontSize: RFValue(12), fontFamily: fontFamily.krona, color: colors.white, marginBottom: RFValue(25) }}>
                                    Cadastrar-se
                                </Text>
                                <Input
                                    border={!!errors.senha === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Senha"
                                    value={senha}
                                    styleLabel={{ color: !!errors.senha === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.senha === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        setSenha(v);
                                        if (errors.senha) {
                                            setErrors(prev => ({ ...prev, senha: '' }));
                                        }
                                        if (errorMessages.senha) {
                                            setErrorMessages(prev => ({ ...prev, senha: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(18), borderRadius: RFValue(10) }]}
                                    hasError={!!errors.senha}
                                    errorText={errors.senha}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(6) }]}
                                    secureTextEntry={!senhaVisivel}
                                    right={
                                        <TextInput.Icon
                                            icon={senhaVisivel ? 'eye-off' : 'eye'}
                                            color="#fff"
                                            size={RFValue(15)}
                                            onPress={() => setSenhaVisivel(!senhaVisivel)}
                                            forceTextInputFocus={false}
                                        />
                                    }
                                />

                                <Input
                                    border={!!errors.confirmarSenha === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    label="Confirmar Senha"
                                    value={confirmarSenha}
                                    styleLabel={{ color: !!errors.confirmarSenha === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                    contentStyle={{ fontSize: RFValue(10) }}
                                    outlineColor={!!errors.confirmarSenha === true ? colors.red : 'transparent'}
                                    onChangeText={v => {
                                        setConfirmarSenha(v);
                                        if (errors.confirmarSenha) {
                                            setErrors(prev => ({ ...prev, confirmarSenha: '' }));
                                        }
                                        if (errorMessages.confirmarSenha) {
                                            setErrorMessages(prev => ({ ...prev, confirmarSenha: '' }));
                                        }
                                    }}
                                    style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                    hasError={!!errors.confirmarSenha}
                                    errorText={errors.confirmarSenha}
                                    helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                    secureTextEntry={!confirmarSenhaVisivel}
                                    right={
                                        <TextInput.Icon
                                            icon={confirmarSenhaVisivel ? 'eye-off' : 'eye'}
                                            color="#fff"
                                            size={RFValue(15)}
                                            onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
                                            forceTextInputFocus={false}
                                        />
                                    }
                                />

                                <TouchableOpacity
                                    style={[styles.caixa, {
                                        width: RFValue(190),
                                        height: RFValue(30),
                                        marginBottom: RFValue(30)
                                    }]}
                                    onPress={() => setChecked(!checked)}
                                    activeOpacity={1}
                                >
                                    {checked ? (
                                        <Ionicons name="checkbox" size={RFValue(20)} color={colors.white} />
                                    ) : (
                                        <Ionicons name="square-outline" size={RFValue(20)} color={colors.white} />
                                    )}
                                    <Text style={[styles.label, { fontSize: RFValue(10) }]}>Receber notificações</Text>
                                </TouchableOpacity>

                                <Button
                                    children="Cadastrar-se"
                                    contentStyle={{ paddingVertical: RFValue(4) }}
                                    labelStyle={{ fontSize: RFValue(10) }}
                                    style={{
                                        width: RFValue(190),
                                        backgroundColor: colors.blue[300],
                                        marginTop: RFValue(15),
                                        borderRadius: RFValue(8)
                                    }}
                                    onPress={handleRegister}
                                />
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', gap: RFValue(10), alignItems: 'center', justifyContent: 'center' }}>
                                    <Input
                                        border={!!errors.senha === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        label="Senha"
                                        value={senha}
                                        styleLabel={{ color: !!errors.senha === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                        contentStyle={{ fontSize: RFValue(10) }}
                                        outlineColor={!!errors.senha === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setSenha(v);
                                            if (errors.senha) {
                                                setErrors(prev => ({ ...prev, senha: '' }));
                                            }
                                            if (errorMessages.senha) {
                                                setErrorMessages(prev => ({ ...prev, senha: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(18), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.senha}
                                        errorText={errors.senha}
                                        helperStyle={styles.helperText}
                                        secureTextEntry={!senhaVisivel}
                                        right={
                                            <TextInput.Icon
                                                icon={senhaVisivel ? 'eye-off' : 'eye'}
                                                color="#fff"
                                                onPress={() => setSenhaVisivel(!senhaVisivel)}
                                                forceTextInputFocus={false}
                                            />
                                        }
                                    />

                                    <Input
                                        border={!!errors.confirmarSenha === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        label="Confirmar Senha"
                                        value={confirmarSenha}
                                        styleLabel={{ color: !!errors.confirmarSenha === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                        contentStyle={{ fontSize: RFValue(10) }}
                                        outlineColor={!!errors.confirmarSenha === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setConfirmarSenha(v);
                                            if (errors.confirmarSenha) {
                                                setErrors(prev => ({ ...prev, confirmarSenha: '' }));
                                            }
                                            if (errorMessages.confirmarSenha) {
                                                setErrorMessages(prev => ({ ...prev, confirmarSenha: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(18), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.confirmarSenha}
                                        errorText={errors.confirmarSenha}
                                        helperStyle={styles.helperText}
                                        secureTextEntry={!confirmarSenhaVisivel}
                                        right={
                                            <TextInput.Icon
                                                icon={confirmarSenhaVisivel ? 'eye-off' : 'eye'}
                                                color="#fff"
                                                onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
                                                forceTextInputFocus={false}
                                            />
                                        }
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.caixa, {
                                        backgroundColor: "#FF0000"
                                    }]}
                                    onPress={() => setChecked(!checked)}
                                    activeOpacity={1}
                                >
                                    {checked ? (
                                        <Ionicons name="checkbox" size={35} color={colors.white} />
                                    ) : (
                                        <Ionicons name="square-outline" size={35} color={colors.white} />
                                    )}
                                    <Text style={styles.label}>Receber notificações</Text>
                                </TouchableOpacity>

                                <Button
                                    children="Cadastrar-se"
                                    contentStyle={{ paddingVertical: RFValue(3) }}
                                    labelStyle={{ fontSize: RFValue(10) }}
                                    style={{
                                        width: RFValue(190),
                                        backgroundColor: colors.blue[300],
                                        marginTop: RFValue(15),
                                        borderRadius: RFValue(8)
                                    }}
                                    onPress={handleRegister}
                                />
                            </View>
                        )
                    ) : (
                        <>
                            <Input
                                border={!!errors.senha === true ? colors.red : colors.gray}
                                autoCapitalize="none"
                                label="Senha"
                                value={senha}
                                styleLabel={{ color: !!errors.senha === true ? colors.red : colors.white }}
                                outlineColor={!!errors.senha === true ? colors.red : 'transparent'}
                                onChangeText={v => {
                                    setSenha(v);
                                    if (errors.senha) {
                                        setErrors(prev => ({ ...prev, senha: '' }));
                                    }
                                    if (errorMessages.senha) {
                                        setErrorMessages(prev => ({ ...prev, senha: '' }));
                                    }
                                }}
                                style={styles.input}
                                hasError={!!errors.senha}
                                errorText={errors.senha}
                                helperStyle={styles.helperText}
                                secureTextEntry={!senhaVisivel}
                                right={
                                    <TextInput.Icon
                                        icon={senhaVisivel ? 'eye-off' : 'eye'}
                                        color="#fff"
                                        onPress={() => setSenhaVisivel(!senhaVisivel)}
                                        forceTextInputFocus={false}
                                    />
                                }
                            />

                            <Input
                                border={!!errors.confirmarSenha === true ? colors.red : colors.gray}
                                autoCapitalize="none"
                                label="Confirmar Senha"
                                value={confirmarSenha}
                                styleLabel={{ color: !!errors.confirmarSenha === true ? colors.red : colors.white }}
                                outlineColor={!!errors.confirmarSenha === true ? colors.red : 'transparent'}
                                onChangeText={v => {
                                    setConfirmarSenha(v);
                                    if (errors.confirmarSenha) {
                                        setErrors(prev => ({ ...prev, confirmarSenha: '' }));
                                    }
                                    if (errorMessages.confirmarSenha) {
                                        setErrorMessages(prev => ({ ...prev, confirmarSenha: '' }));
                                    }
                                }}
                                style={styles.input}
                                hasError={!!errors.confirmarSenha}
                                errorText={errors.confirmarSenha}
                                helperStyle={styles.helperText}
                                secureTextEntry={!confirmarSenhaVisivel}
                                right={
                                    <TextInput.Icon
                                        icon={confirmarSenhaVisivel ? 'eye-off' : 'eye'}
                                        color="#fff"
                                        onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
                                        forceTextInputFocus={false}
                                    />
                                }
                            />

                            <TouchableOpacity
                                style={styles.caixa}
                                onPress={() => setChecked(!checked)}
                                activeOpacity={1}
                            >
                                {checked ? (
                                    <Ionicons name="checkbox" size={35} color={colors.white} />
                                ) : (
                                    <Ionicons name="square-outline" size={35} color={colors.white} />
                                )}
                                <Text style={styles.label}>Receber notificações</Text>
                            </TouchableOpacity>

                            <Button
                                children="Cadastrar-se"
                                style={{
                                    width: RFValue(255),
                                    paddingVertical: RFValue(2),
                                    backgroundColor: colors.blue[300],
                                    marginTop: RFValue(62),
                                    borderRadius: RFValue(20)
                                }}
                                onPress={handleRegister}
                            />
                        </>
                    )
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
                            marginBottom: isLandscape ? RFValue(5) : RFValue(10),
                        }}

                    >
                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder }}>{snackbarMessage}</Text>
                    </Snackbar>
                </View>
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
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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