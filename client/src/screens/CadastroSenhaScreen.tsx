// React Native
import React, { useState } from 'react'
import { TouchableOpacity, Alert, Image, View, Text, StyleSheet } from "react-native"
import { Ionicons } from '@expo/vector-icons'

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
import { cadastrarUsuario } from "../services/api"

export default function CadastroSenhaScreen({ route, navigation }: any) {
    const { nome, email } = route.params;
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    if (!fontsLoaded) {
        return null
    }

    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [checked, setChecked] = useState(false);

    async function cadastrar() {
        if (!senha || !confirmarSenha) {
            Alert.alert(
                "Atenção!",
                "Por favor, preencha todos os campos.",
                [
                    { text: "OK" }
                ],
                { cancelable: true }
            );
            return;
        } else if (senha !== confirmarSenha) {
            Alert.alert(
                "Atenção!",
                "As senhas não coincidem.",
                [
                    { text: "OK" }
                ],
                { cancelable: true }
            );
            return;
        }

        const result = await cadastrarUsuario(nome, email, senha, checked);

        if (result.success) {
            navigation.navigate("Login")
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
                onPress={() => navigation.goBack()}
            />

            <Image
                style={styles.logo}
                source={require("@/assets/logo-titulo.png")}
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

            <View>
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
                <Text style={styles.label}>Receber notificações</Text>
            </TouchableOpacity>

            <Button
                title="Cadastrar-se"
                style={styles.botao}
                onPress={() => cadastrar()}
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