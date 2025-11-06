import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    useWindowDimensions,
    Image,
    TouchableOpacity
} from "react-native";
import {
    Modal,
    Portal,
    Text,
} from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";

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

export default function InfoModal({ visible, onDismiss, handleOk }: any) {

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    return (
        <Portal>
            {isLandscape ? (
                <>
                    <Modal
                        visible={visible}
                        onDismiss={onDismiss}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                            <Text
                                variant="titleMedium"
                                style={styles.title}
                            >
                                O aplicativo já inclui o consumo de alguns modelos de eletrodomésticos. Caso o modelo desejado não esteja disponível, essa informação pode ser encontrada na internet, no manual do equipamento ou na etiqueta do INMETRO localizada no próprio aparelho.
                            </Text>

                            <Image

                                style={[styles.logo, { width: RFValue(147), height: RFValue(81.2) }]}
                                source={require("@/assets/suporte-info.png")}

                            />
                        </View>

                        <View style={{ width: RFValue(380), gap: RFValue(15), flexDirection: "row", justifyContent: "center", marginTop: RFValue(20) }}>
                            <Button
                                children={"OK"}
                                compact
                                contentStyle={{ paddingVertical: RFValue(1), paddingHorizontal: RFValue(0), backgroundColor: colors.green, borderColor: colors.green, borderWidth: RFValue(2), width: RFValue(90) }}
                                labelStyle={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder }}
                                style={{
                                    alignSelf: "center",
                                    borderRadius: RFValue(5)
                                }}
                                onPress={handleOk}
                            />
                        </View>
                    </Modal>
                </>
            ) : (
                <>
                    <Modal
                        visible={visible}
                        onDismiss={onDismiss}
                        contentContainerStyle={[styles.modalContainer, {
                            borderRadius: RFValue(20),
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            height: RFValue(450),
                            width: "100%",
                            paddingHorizontal: RFValue(10),
                            alignSelf: "center",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginTop: 'auto',
                            marginBottom: 0,
                        }]}
                    >
                        <TouchableOpacity style={{ width: "80%", height: RFValue(10), backgroundColor: colors.white, borderRadius: RFValue(20), marginTop: RFValue(5) }}
                            onPress={onDismiss}
                            activeOpacity={1}></TouchableOpacity>

                        <Text
                            variant="titleLarge"
                            style={[styles.title, { fontSize: RFValue(16), width: "90%", marginTop: RFValue(15), marginBottom: RFValue(15) }]}
                        >
                            O aplicativo já inclui o consumo de alguns modelos de eletrodomésticos. Caso o modelo desejado não esteja disponível, essa informação pode ser encontrada na internet, no manual do equipamento ou na etiqueta do INMETRO localizada no próprio aparelho.
                        </Text>

                        <Image

                            style={[styles.logo, { width: RFValue(300), height: RFValue(160) }]}
                            source={require("@/assets/suporte-info.png")}

                        />
                    </Modal>
                </>
            )}
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.blue[400],
        height: "auto",
        width: RFValue(400),
        borderRadius: RFValue(5),
        paddingHorizontal: RFValue(10),
        paddingVertical: RFValue(10),
        elevation: 20,
        alignSelf: 'center',
    },
    title: {
        alignSelf: 'center',
        textAlign: "justify",
        color: colors.white,
        fontFamily: fontFamily.inder,
        fontSize: RFValue(10),
        width: RFValue(200),
    },
    logo: {
        width: RFValue(316),
        height: RFValue(202),
        resizeMode: "contain"
    },
});