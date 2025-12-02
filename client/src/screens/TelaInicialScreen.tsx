// React Native
import React, { useState, useEffect, useCallback } from 'react';
import { Image, View, Text, StyleSheet, StatusBar, useWindowDimensions, Keyboard, KeyboardEvent, ScrollView, KeyboardAvoidingView, Platform, Animated } from "react-native";
import { HelperText, Snackbar } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';

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
import { buscarUsuarioPorEmail } from '@/services/api';

export default function TelaInicialScreen({ navigation, route }: any) {
    // Carregamento das fontes
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    });

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const isVeryWide = (width / height) > 2.4;
    const [isCadastro, setIsCadastro] = useState(false);

    // Teclado
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    // Monitorar erros
    const [loading, setLoading] = useState(true);

    // Estados para os inputs
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessages, setErrorMessages] = useState({ nome: '', email: '' });
    const [errors, setErrors] = useState({ email: '', nome: '' });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useFocusEffect(
        useCallback(() => {
            if (route?.params?.fromCadastro) {
                setIsCadastro(true);
            }
        }, [route])
    );

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('#001C38');
        NavigationBar.setButtonStyleAsync('light');
        const checkLogin = async () => {
            try {
                const value = await AsyncStorage.getItem("permanecerConectado");
                if (value === "true") {
                    navigation.navigate("Login");
                }
            } catch (e) {
                console.error("Erro ao ler AsyncStorage:", e);
            } finally {
                setLoading(false);
            }
        }
        checkLogin();
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

    useEffect(() => {
        const nomeParam = route?.params?.nome;
        const emailParam = route?.params?.email;
        if (route?.params?.fromCadastro) {
            setIsCadastro(true);

            if (nomeParam) {
                setNome(nomeParam);
            }

            if (emailParam) {
                setEmail(emailParam);
            }

            route.params.fromCadastro = false;
        }
    }, [route?.params]);

    const handleRegister = async () => {
        let hasError = false;
        const newErrors: { nome: string; email: string } = { nome: '', email: '' };

        if (nome.trim() === '') {
            newErrors.nome = 'Por favor, preencha o Nome.';
            hasError = true;
        }

        if (email.trim() === '') {
            newErrors.email = 'Por favor, preencha o Email.';
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Por favor, insira um email válido.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        const existingEmail = await buscarUsuarioPorEmail(email);
        if (existingEmail) {
            newErrors.email = 'Este email já está cadastrado.';
            setErrors(newErrors);
            return;
        }

        setErrors({ nome: '', email: '' });

        navigation.navigate("Cadastro", { nome, email });
    };

    // Conferir fontes carregadas
    if (!fontsLoaded || loading) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                {!isLandscape && !isVeryWide && isCadastro ?
                    <Ionicons
                        name="chevron-back-circle"
                        size={RFValue(39)}
                        color="white"
                        style={{ position: "absolute", top: RFValue(51), left: RFValue(10) }}
                        onPress={() => setIsCadastro(false)}
                        zIndex={1000}
                    />
                    : isLandscape && isVeryWide && isCadastro ? (
                        <View style={{ position: "absolute", top: RFValue(20), left: RFValue(20), width: RFValue(25), height: RFValue(25), zIndex: 1000, borderRadius: '50%' }}>
                            <Ionicons
                                name="chevron-back-circle"
                                size={RFValue(25)}
                                color="white"
                                onPress={() => setIsCadastro(false)}
                                zIndex={1000}
                            />
                        </View>
                    ) : null
                }
                <View style={[styles.container, { flexDirection: isLandscape ? 'row' : 'column', gap: isLandscape ? isCadastro ? RFValue(30) : RFValue(60) : '0' }]}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    <Image

                        style={[styles.logo, { width: isLandscape ? RFValue(210) : RFValue(316), height: isLandscape ? RFValue(134) : RFValue(202) }]}
                        source={require("@/assets/logo-titulo.png")}

                    />

                    {isLandscape ? (
                        !isVeryWide ? (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <View style={{ alignItems: "center", justifyContent: "center", borderWidth: RFValue(1), borderColor: colors.white, borderRadius: RFValue(10), padding: RFValue(15) }}>
                                    <Text style={{ fontSize: RFValue(12), fontFamily: fontFamily.krona, color: colors.white, marginBottom: RFValue(10) }}>
                                        Cadastrar-se
                                    </Text>
                                    <Input
                                        border={!!errors.nome === true ? colors.red : colors.gray}
                                        label="Nome Completo"
                                        value={nome}
                                        styleLabel={{ color: !!errors.nome === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                        contentStyle={{ fontSize: RFValue(10) }}
                                        outlineColor={!!errors.email === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setNome(v);
                                            if (errors.nome) {
                                                setErrors(prev => ({ ...prev, nome: '' }));
                                            }
                                            if (errorMessages.nome) {
                                                setErrorMessages(prev => ({ ...prev, nome: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(18), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.nome}
                                        errorText={errors.nome}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(6) }]}
                                    />

                                    <Input
                                        border={!!errors.email === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
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
                                        keyboardType='email-address'
                                        hasError={!!errors.email}
                                        errorText={errors.email}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(6) }]}
                                    />

                                    <Button
                                        children="Próximo"
                                        icon={({ size, color }) => (
                                            <Ionicons
                                                name="chevron-forward-circle"
                                                size={RFValue(20)}
                                                color={color}
                                            />
                                        )}
                                        contentStyle={{ flexDirection: 'row-reverse', paddingVertical: RFValue(3) }}
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

                                <View style={[styles.div_or, { width: RFValue(220), marginVertical: RFValue(15) }]}>
                                    <View style={styles.line} />
                                    <Text style={[styles.text_or, { fontSize: RFValue(10) }]} >ou</Text>
                                    <View style={styles.line} />
                                </View>

                                <Button
                                    children="Entrar"
                                    contentStyle={{ backgroundColor: 'transparent', paddingVertical: RFValue(3) }}
                                    labelStyle={{ fontSize: RFValue(10) }}
                                    style={{
                                        width: RFValue(220),
                                        backgroundColor: "transparent",
                                        borderWidth: RFValue(2),
                                        borderColor: colors.yellow[300],
                                        borderRadius: RFValue(8)
                                    }}
                                    onPress={() => navigation.navigate("Login")}
                                />
                            </View>
                        ) : (
                            isCadastro ? (
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: RFValue(12), fontFamily: fontFamily.krona, color: colors.white, marginBottom: RFValue(20) }}>
                                        Cadastrar-se
                                    </Text>

                                    <View style={{ flexDirection: 'row', gap: RFValue(10), alignItems: 'center', justifyContent: 'center' }}>
                                        <Input
                                            border={!!errors.nome === true ? colors.red : colors.gray}
                                            label="Nome Completo"
                                            value={nome}
                                            styleLabel={{ color: !!errors.nome === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                            contentStyle={{ fontSize: RFValue(10) }}
                                            outlineColor={!!errors.email === true ? colors.red : 'transparent'}
                                            onChangeText={v => {
                                                setNome(v);
                                                if (errors.nome) {
                                                    setErrors(prev => ({ ...prev, nome: '' }));
                                                }
                                                if (errorMessages.nome) {
                                                    setErrorMessages(prev => ({ ...prev, nome: '' }));
                                                }
                                            }}
                                            style={[styles.input, { width: RFValue(190), height: RFValue(30), marginBottom: RFValue(18), borderRadius: RFValue(10) }]}
                                            hasError={!!errors.nome}
                                            errorText={errors.nome}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(6) }]}
                                        />

                                        <Input
                                            border={!!errors.email === true ? colors.red : colors.gray}
                                            autoCapitalize="none"
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
                                            keyboardType='email-address'
                                            hasError={!!errors.email}
                                            errorText={errors.email}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(6) }]}
                                        />
                                    </View>

                                    <Button
                                        children="Próximo"
                                        icon={({ size, color }) => (
                                            <Ionicons
                                                name="chevron-forward-circle"
                                                size={RFValue(20)}
                                                color={color}
                                            />
                                        )}
                                        contentStyle={{ flexDirection: 'row-reverse', paddingVertical: RFValue(3) }}
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
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Button
                                        children="Cadastrar-se"
                                        labelStyle={{ fontSize: RFValue(10) }}
                                        onPress={() => setIsCadastro(true)}
                                        style={{ width: RFValue(220), borderRadius: RFValue(8) }}
                                    />

                                    <View style={[styles.div_or, { width: RFValue(220), marginVertical: RFValue(15) }]}>
                                        <View style={styles.line} />
                                        <Text style={[styles.text_or, { fontSize: RFValue(10) }]} >ou</Text>
                                        <View style={styles.line} />
                                    </View>

                                    <Button
                                        children="Entrar"
                                        contentStyle={{ backgroundColor: 'transparent', paddingVertical: RFValue(3) }}
                                        labelStyle={{ fontSize: RFValue(10) }}
                                        style={{
                                            width: RFValue(220),
                                            backgroundColor: "transparent",
                                            borderWidth: RFValue(2),
                                            borderColor: colors.yellow[300],
                                            borderRadius: RFValue(8)
                                        }}
                                        onPress={() => navigation.navigate("Login")}
                                    />
                                </View>
                            )
                        )
                    ) : (
                        !isCadastro ? (
                            <>
                                <Button
                                    children="Cadastrar-se"
                                    onPress={() => setIsCadastro(true)}
                                    style={{ width: RFValue(255) }}
                                />

                                <View style={styles.div_or}>
                                    <View style={styles.line} />
                                    <Text style={styles.text_or} >ou</Text>
                                    <View style={styles.line} />
                                </View>

                                <Button
                                    children="Entrar"
                                    contentStyle={{ backgroundColor: 'transparent' }}
                                    style={{
                                        width: RFValue(255),
                                        backgroundColor: "transparent",
                                        borderWidth: RFValue(3),
                                        borderColor: colors.yellow[300],
                                    }}
                                    onPress={() => navigation.navigate("Login")}
                                />
                            </>) : (
                            <>
                                <Input
                                    border={!!errors.nome === true ? colors.red : colors.gray}
                                    label="Nome Completo"
                                    value={nome}
                                    styleLabel={{ color: !!errors.nome === true ? colors.red : colors.white }}
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
                                    style={styles.input}
                                    hasError={!!errors.nome}
                                    errorText={errors.nome}
                                    helperStyle={styles.helperText}
                                />

                                <Input
                                    border={!!errors.email === true ? colors.red : colors.gray}
                                    autoCapitalize="none"
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
                                    keyboardType='email-address'
                                    hasError={!!errors.email}
                                    errorText={errors.email}
                                    helperStyle={styles.helperText}
                                />

                                <Button
                                    children="Próximo"
                                    icon={({ size, color }) => (
                                        <Ionicons
                                            name="chevron-forward-circle"
                                            size={RFValue(30)}
                                            color={color}
                                        />
                                    )}
                                    contentStyle={{ flexDirection: 'row-reverse' }}
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
                    )}
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.blue[500]
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
    },
    logo: {
        width: RFValue(316),
        height: RFValue(202),
        resizeMode: "contain"
    },
    div_or: {
        width: RFValue(255),
        flexDirection: "row",
        alignItems: "center",
        marginVertical: RFValue(37)
    },
    line: {
        flex: 1,
        width: '100%',
        height: RFValue(1),
        backgroundColor: colors.yellow[100]
    },
    text_or: {
        marginHorizontal: RFValue(8),
        fontSize: RFValue(18),
        fontFamily: fontFamily.krona,
        color: colors.white
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