// React Native
import React, { useState, useEffect } from 'react'
import { Image, View, Text, StyleSheet } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage'

// Componentes
import { Button } from "@/components/button"

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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

export default function TelaInicialScreen({ navigation }: any) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, []);

    if (!fontsLoaded || loading) {
        return null
    }

    return (
        <View style={styles.container}>
            <Image

            style={styles.logo}
            source={require("@/assets/logo-titulo.png")}

            />

            <Button
                title="Cadastrar-se"
                onPress={() => navigation.navigate("Cadastro")}
            />

            <View style={styles.div_or}>
                <View style={styles.line} />
                <Text style={styles.text_or} >ou</Text>
                <View style={styles.line} />
            </View>

            <Button
                title="Entrar"
                style={styles.login}
                onPress={() => navigation.navigate("Login")}
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
        resizeMode: "contain"
    },
    div_or: {
        width: width * 0.777,
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 30
    },
    line: {
        flex: 1,
        width: width * 0.286,
        height: 1,
        backgroundColor: colors.yellow[100]
    },
    text_or: {
        marginHorizontal: 8,
        fontSize: 16,
        fontFamily: fontFamily.krona,
        color: colors.white
    },
    login: {
        width: width * 0.777,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.blue[500],
        paddingHorizontal: 49,
        paddingVertical: 15,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colors.yellow[200]
    }
})