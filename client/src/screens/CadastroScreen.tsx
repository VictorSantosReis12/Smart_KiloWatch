// React Native
import React, { useState } from 'react'
import { Alert, TouchableOpacity, Image, View, Text, StyleSheet } from "react-native"
import { Ionicons } from '@expo/vector-icons'

// Componentes
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

export default function CadastroScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    if (!fontsLoaded) {
        return null
    }

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

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

            <Input
                placeholder="Nome Completo"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
                placeholderTextColor={colors.gray}
            />

            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor={colors.gray}
            />

            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.botao}
                onPress={() => mostrarAlert()}
            >

                <Text style={styles.title}>Próximo</Text>

                <Ionicons
                    name="arrow-forward-circle"
                    size={34}
                    color={colors.yellow[200]}
                    style={{ position: "absolute", right: 50 }}
                />

            </TouchableOpacity>
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
        borderRadius: 20,
        marginTop: width * 0.172
    },
    title: {
        fontSize: 18,
        fontFamily: fontFamily.krona,
        color: colors.yellow[200]
    }
})