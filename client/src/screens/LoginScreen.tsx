// React Native
import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Alert, Image, View, StyleSheet, StatusBar, Keyboard, KeyboardEvent, ScrollView, Animated, useWindowDimensions, Text } from "react-native";
import { HelperText, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';

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
import { login } from "../services/api";

export default function CadastroScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })
    if (!fontsLoaded) {
        return null
    }

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const isVeryWide = (width / height) > 2.4;

    // Teclado
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    // Estados
    const { signIn } = useContext(AuthContext);
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [checked, setChecked] = useState(false);
    const [errorMessages, setErrorMessages] = useState({ email: '', senha: '' });
    const [errors, setErrors] = useState({ email: '', senha: '' });
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

    // function mostrarAlert() {
    //     if (!nome || !email) {
    //         Alert.alert(
    //             "Atenção!",
    //             "Por favor, preencha todos os campos.",
    //             [
    //                 { text: "OK" }
    //             ],
    //             { cancelable: true }
    //         );
    //     } else {
    //         navigation.navigate("CadastroSenha", {
    //             nome: nome,
    //             email: email
    //         });
    //     }
    // }

    const handleLogin = async () => {
        let hasError = false;
        const newErrors: { email: string; senha: string } = { email: '', senha: '' };

        if (email.trim() === '') {
            newErrors.email = 'Por favor, preencha o Email.';
            hasError = true;
        }

        if (senha.trim() === '') {
            newErrors.senha = 'Por favor, preencha a Senha.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setErrors({ email: '', senha: '' });

        try {
            const loginResponse = await login(email, senha);

            if (!loginResponse.success) {
                throw new Error(loginResponse.message || 'Erro ao fazer login');
            }

            await signIn(loginResponse.token, loginResponse.data, checked);

            navigation.navigate("Login");
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro no login:', error.message);
            } else {
                console.error('Erro no login desconhecido:', error);
            }
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                {!isLandscape && !isVeryWide ?
                    <Ionicons
                        name="chevron-back-circle"
                        size={RFValue(39)}
                        color="white"
                        style={{ position: "absolute", top: RFValue(51), left: RFValue(10) }}
                        onPress={() => navigation.navigate("TelaInicial")}
                        zIndex={1000}
                    />
                    : isLandscape && isVeryWide ? (
                        <View style={{ position: "absolute", top: RFValue(40), left: RFValue(20), width: RFValue(25), height: RFValue(25), zIndex: 1000, borderRadius: '50%' }}>
                            <Ionicons
                                name="chevron-back-circle"
                                size={RFValue(25)}
                                color="white"
                                onPress={() => navigation.navigate("TelaInicial")}
                                zIndex={1000}
                            />
                        </View>
                    ) : null
                }
                <ScrollView
                    contentContainerStyle={{ paddingBottom: keyboardHeight, flexGrow: 1 }}
                    keyboardShouldPersistTaps="always"
                >
                    <View style={[styles.container, { flexDirection: isLandscape ? 'row' : 'column', gap: isLandscape ? RFValue(60) : '0' }]}>
                        <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                        <Animated.Image

                            style={[styles.logo, { width: isLandscape ? RFValue(210) : (isKeyboardVisible ? RFValue(224) : RFValue(316)), height: isLandscape ? RFValue(134) : (isKeyboardVisible ? RFValue(143) : RFValue(202)) }]}
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
                                        onPress={() => navigation.navigate("TelaInicial")}
                                        zIndex={1000}
                                    />
                                    <Text style={{ fontSize: RFValue(12), fontFamily: fontFamily.krona, color: colors.white, marginBottom: RFValue(25) }}>
                                        Entrar
                                    </Text>
                                    <Input
                                        border={!!errors.email === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        keyboardType='email-address'
                                        label="Email"
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
                                        style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(18), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.email}
                                        errorText={errors.email}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(6) }]}
                                    />

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
                                        style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
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
                                        <Text style={[styles.label, { fontSize: RFValue(10) }]}>Lembrar de mim</Text>
                                    </TouchableOpacity>

                                    <Button
                                        children="Entrar"
                                        contentStyle={{ paddingVertical: RFValue(4) }}
                                        labelStyle={{ fontSize: RFValue(10) }}
                                        style={{
                                            width: RFValue(190),
                                            backgroundColor: colors.blue[300],
                                            marginTop: RFValue(15),
                                            borderRadius: RFValue(8)
                                        }}
                                        onPress={handleLogin}
                                    />
                                </View>
                            ) : (
                                <>
                                    <Input
                                        border={!!errors.email === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        keyboardType='email-address'
                                        label="Email"
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
                                        style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(18), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.email}
                                        errorText={errors.email}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(6) }]}
                                    />

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

                                    <Button
                                        children="Cadastrar-se"
                                        style={{
                                            width: RFValue(255),
                                            paddingVertical: RFValue(2),
                                            backgroundColor: colors.blue[300],
                                            marginTop: RFValue(62),
                                            borderRadius: RFValue(20)
                                        }}
                                        onPress={handleLogin}
                                    />
                                </>
                            )
                        ) : (
                            <>
                                <Input
                                    border={!!errors.email === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
                                    keyboardType='email-address'
                                    label="Email"
                                    value={email}
                                    styleLabel={{ color: !!errors.email === true ? colors.red : colors.white }}
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
                                    style={styles.input}
                                    hasError={!!errors.email}
                                    errorText={errors.email}
                                    helperStyle={styles.helperText}
                                />

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
                                    <Text style={styles.label}>Lembrar de mim</Text>
                                </TouchableOpacity>

                                <Button
                                    children="Entrar"
                                    style={{
                                        width: RFValue(255),
                                        paddingVertical: RFValue(2),
                                        backgroundColor: colors.blue[300],
                                        marginTop: RFValue(62),
                                        borderRadius: RFValue(20)
                                    }}
                                    onPress={handleLogin}
                                />
                            </>
                        )
                        }
                    </View>
                </ScrollView>
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

{/* <View>
                <Input
                    placeholder="Confirmar Senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    style={styles.input}
                    placeholderTextColor={colors.gray}
                    secureTextEntry={!confirmarSenhaVisivel}
                />

                <Ionicons
                    name={confirmarSenhaVisivel ? "eye-off" : "eye"}
                    size={29}
                    color={colors.white}
                    style={{ position: "absolute", right: 12, top: 12, zIndex: 10 }}
                    onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
                />
            </View> */}

{/* <TouchableOpacity
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
            </TouchableOpacity> */}