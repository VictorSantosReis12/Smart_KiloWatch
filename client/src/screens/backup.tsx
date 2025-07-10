// React Native
import React, { useState, useEffect } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, Keyboard, KeyboardEvent, ScrollView } from "react-native";
import { HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";

// Componentes
import { Button } from "@/components/button";
import { Input } from "@/components/input";

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

export default function CadastroScreen({ navigation }: any) {
    // Carregamento de fontes
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    });
    if (!fontsLoaded) {
        return null
    }

    // Teclado
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Estados
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessages, setErrorMessages] = useState({ nome: '', email: '' });
    const [errors, setErrors] = useState({ email: '', nome: '' });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const onKeyboardShow = (e: KeyboardEvent) => {
            setKeyboardHeight(e.endCoordinates.height);
        };
        const onKeyboardHide = () => {
            setKeyboardHeight(0);
        };

        const showSub = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
        const hideSub = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    function mostrarAlert() {
        if (!nome || !email) {
            Alert.alert(
                "Atenção!",
                "Por favor, preencha todos os campos.",
                [
                    { text: "OK" }
                ],
                { cancelable: true }
            );
        } else {
            navigation.navigate("CadastroSenha", {
                nome: nome,
                email: email
            });
        }
    }

    const handleLogin = async () => {
        let hasError = false;
        const newErrors: { nome: string; email: string } = { nome: '', email: '' };

        if (nome.trim() === '') {
            newErrors.nome = 'Por favor, preencha o Nome.';
            hasError = true;
        }

        if (email.trim() === '') {
            newErrors.email = 'Por favor, preencha o Email.';
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: keyboardHeight }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                        <Ionicons
                            name="chevron-back-circle"
                            size={RFValue(39)}
                            color="white"
                            style={{ position: "absolute", top: RFValue(51), left: RFValue(20) }}
                            onPress={() => navigation.navigate("TelaInicial")}
                        />

                        <Image
                            style={{
                                width: RFValue(316),
                                height: RFValue(202),
                                resizeMode: "contain",
                                marginBottom: RFValue(25)
                            }}
                            source={require("@/assets/logo-titulo.png")}
                        />

                        <View style={{ position: "relative" }}>
                            <Input
                                border={!!errors.nome === true ? "#fc1212" : colors.gray}
                                label="Nome completo"
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
                            />
                            {errors.nome && (
                                <HelperText
                                    type="error"
                                    visible={true}
                                    style={styles.helperText}
                                >
                                    {errors.nome}
                                </HelperText>
                            )}
                            {errorMessages.nome !== '' && (
                                <HelperText
                                    type="error"
                                    visible={true}
                                    style={styles.helperText}
                                >
                                    {errorMessages.nome}
                                </HelperText>
                            )}
                        </View>


                        <View style={{ position: "relative" }}>
                            <Input
                                border={!!errors.email === true ? colors.red : colors.gray}
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
                            />
                            {errors.email && (
                                <HelperText
                                    type="error"
                                    visible={true}
                                    style={styles.helperText}
                                >
                                    {errors.email}
                                </HelperText>
                            )}
                            {errorMessages.email !== '' && (
                                <HelperText
                                    type="error"
                                    visible={true}
                                    style={styles.helperText}
                                >
                                    {errorMessages.email}
                                </HelperText>
                            )}
                        </View>

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
                            onPress={handleLogin}
                        />
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
        paddingTop: 80,
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