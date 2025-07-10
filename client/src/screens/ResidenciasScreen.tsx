// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text } from "react-native";
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';

// Componentes
import { Button } from "@/components/button";

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

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const isVeryWide = (width / height) > 2.4;

    // Teclado
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Estados
    const { signOut } = useContext(AuthContext);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    {isLandscape ?
                        <View style={{ borderWidth: RFValue(1), borderColor: colors.white, borderRadius: RFValue(10), padding: RFValue(10), height: "100%" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: RFValue(600), paddingBottom: RFValue(8), borderBottomWidth: RFValue(3), borderBottomColor: colors.yellow[300], alignSelf: "flex-start" }}>
                                <Text style={{ fontSize: RFValue(12), fontFamily: fontFamily.krona, color: colors.white }}>
                                    Suas Residências
                                </Text>

                                <Button
                                    children="Sair da Conta"
                                    icon={({ size, color }) => (
                                        <Ionicons
                                            name="exit-outline"
                                            size={RFValue(15)}
                                            color={color}
                                        />
                                    )}
                                    compact
                                    contentStyle={{ paddingVertical: RFValue(3), paddingHorizontal: RFValue(0), backgroundColor: colors.red }}
                                    labelStyle={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder }}
                                    style={{
                                        alignSelf: "center",
                                        borderRadius: RFValue(5)
                                    }}
                                    onPress={signOut}
                                />
                            </View>

                            <View>
                                <FAB
                                    icon="home-plus"
                                    onPress={() => navigation.navigate('CadastrarResidencias')}
                                    style={{
                                        backgroundColor: '#6200ee',
                                        borderRadius: "50%",
                                        width: RFValue(20),
                                        height: RFValue(20)
                                    }}
                                />
                            </View>
                        </View>
                        :
                        <>
                        </>
                    }
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
        padding: RFValue(10),
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