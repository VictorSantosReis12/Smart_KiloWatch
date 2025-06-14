// React Native
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Alert, Image, View, Text, StyleSheet } from "react-native"
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Componentes
import { Button } from "@/components/button"
import { Input } from "@/components/input"

// Tamanhos
import { Dimensions } from "react-native"
const { width } = Dimensions.get("window")

// Fontes
import { useFonts } from 'expo-font'
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
import { login } from "../services/api"

export default function LoginScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [checked, setChecked] = useState(false);
    const [loadingAutoLogin, setLoadingAutoLogin] = useState(true);

    useEffect(() => {
        async function verificarLoginAutomatico() {
            try {
                const permanecer = await AsyncStorage.getItem("permanecerConectado");
                if (permanecer === "true") {
                    const emailArmazenado = await AsyncStorage.getItem("email");
                    const senhaArmazenada = await AsyncStorage.getItem("senha");
                    if (emailArmazenado && senhaArmazenada) {
                        setEmail(emailArmazenado);
                        setSenha(senhaArmazenada);
                        setChecked(true);
                        // Chama login automático
                        const result = await login(emailArmazenado, senhaArmazenada);
                        if (result.success) {
                            navigation.navigate("Residencias");
                        } else {
                            Alert.alert("Erro", "Login automático falhou: " + result.message);
                        }
                    }
                }
            } catch (error) {
                console.log("Erro ao tentar login automático:", error);
            } finally {
                setLoadingAutoLogin(false);
            }
        }

        verificarLoginAutomatico();
    }, []);

    if (!fontsLoaded || loadingAutoLogin) {
        return null; // Ou um loading spinner, se preferir
    }

    async function logar() {
        if (!email || !senha) {
            Alert.alert(
                "Atenção!",
                "Por favor, preencha todos os campos.",
                [
                    { text: "OK" }
                ],
                { cancelable: true }
            );
            return;
        }

        console.log("Tentando logar com:", { email, senha, checked });
        const result = await login(email, senha);
        console.log("Resultado do login:", result);

        if (result.success) {
            console.log(checked)
            if (checked) {
                AsyncStorage.setItem("email", email);
                AsyncStorage.setItem("senha", senha);
            }
            AsyncStorage.setItem("permanecerConectado", checked.toString());
            navigation.navigate("Residencias")
        } else {
            Alert.alert("Erro", result.message)
        }
    }

    return (
        <View style={styles.container}>
            <Ionicons
                name="arrow-back-circle"
                size={39}
                color="white"
                style={{ position: "absolute", top: 51, left: 20 }}
                onPress={() => navigation.navigate("TelaInicial")}
            />

            <Image
                style={styles.logo}
                source={require("@/assets/logo-titulo.png")}
            />

            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor={colors.gray}
            />

            <View>
                <Input
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    style={styles.input}
                    placeholderTextColor={colors.gray}
                    secureTextEntry={!senhaVisivel}
                />

                <Ionicons
                    name={senhaVisivel ? "eye-off" : "eye"}
                    size={29}
                    color={colors.white}
                    style={{ position: "absolute", right: 12, top: 12, zIndex: 10 }}
                    onPress={() => setSenhaVisivel(!senhaVisivel)}
                />
            </View>

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
                title="Entrar"
                style={styles.botao}
                onPress={() => logar()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.blue[500]
    },
    logo: {
        width: width * 0.877,
        height: width * 0.561,
        resizeMode: "contain",
        marginBottom: width * 0.069
    },
    input: {
        width: width * 0.708,
        height: 52,
        borderRadius: 5,
        backgroundColor: "#056EA7",
        padding: 12,
        fontSize: 16,
        fontFamily: fontFamily.inder,
        color: colors.white,
        marginBottom: width * 0.102
    },
    botao: {
        width: width * 0.777,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.blue[300],
        paddingHorizontal: 49,
        paddingVertical: 11,
        borderRadius: 20
    },
    title: {
        fontSize: 18,
        fontFamily: fontFamily.krona,
        color: colors.yellow[200]
    },
    caixa: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.708,
        marginTop: width * -0.034,
        marginBottom: width * 0.178
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
        color: colors.white,
        fontFamily: fontFamily.inder
    }
})