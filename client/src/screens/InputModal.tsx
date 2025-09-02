import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    useWindowDimensions
} from "react-native";
import {
    Modal,
    Portal,
    Text,
} from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";

// Componentes
import { Input } from "@/components/input";
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

export default function InputModal({ visible, onDismiss, changeText, changeButtonCancelar, changeButtonConfirmar, handleConfirmar, input, doubleInput }: any) {

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
                        <Text
                            variant="titleLarge"
                            style={styles.title}
                        >
                            {changeText}
                        </Text>

                        {input}

                        <View style={{ width: RFValue(250), gap: RFValue(15), flexDirection: "row", justifyContent: "center", marginTop: RFValue(20) }}>
                            <Button
                                children={changeButtonCancelar}
                                compact
                                contentStyle={{ paddingVertical: RFValue(1), paddingHorizontal: RFValue(0), backgroundColor: colors.blue[400], borderColor: colors.white, borderWidth: RFValue(2), width: RFValue(90) }}
                                labelStyle={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder }}
                                style={{
                                    alignSelf: "center",
                                    borderRadius: RFValue(5)
                                }}
                                onPress={onDismiss}
                            />

                            <Button
                                children={changeButtonConfirmar}
                                compact
                                contentStyle={{ paddingVertical: RFValue(1), paddingHorizontal: RFValue(0), backgroundColor: colors.green, borderColor: colors.green, borderWidth: RFValue(2), width: RFValue(90) }}
                                labelStyle={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder }}
                                style={{
                                    alignSelf: "center",
                                    borderRadius: RFValue(5)
                                }}
                                onPress={handleConfirmar}
                            />
                        </View>
                    </Modal>
                </>
            ) : (
                <>
                    <Modal
                        visible={visible}
                        onDismiss={onDismiss}
                        contentContainerStyle={[styles.modalContainer, { borderRadius: RFValue(20), height: doubleInput ? RFValue(270) : RFValue(185), width: RFValue(300) }]}
                    >
                        <Text
                            variant="titleLarge"
                            style={[styles.title, { fontSize: RFValue(16) }]}
                        >
                            {changeText}
                        </Text>

                        {input}

                        <View style={{ width: RFValue(250), gap: RFValue(15), flexDirection: "row", justifyContent: "center", alignSelf: 'center' }}>
                            <Button
                                children={changeButtonCancelar}
                                compact
                                contentStyle={{ paddingVertical: RFValue(1), paddingHorizontal: RFValue(0), backgroundColor: colors.blue[400], borderColor: colors.white, borderWidth: RFValue(2.5), width: RFValue(90), borderRadius: RFValue(15) }}
                                labelStyle={{ fontSize: RFValue(14), color: colors.white, fontFamily: fontFamily.inder }}
                                style={{
                                    alignSelf: "center",
                                    borderRadius: RFValue(15)
                                }}
                                onPress={onDismiss}
                            />

                            <Button
                                children={changeButtonConfirmar}
                                compact
                                contentStyle={{ paddingVertical: RFValue(1), paddingHorizontal: RFValue(0), backgroundColor: colors.green, borderColor: colors.green, borderWidth: RFValue(2.5), width: RFValue(90), borderRadius: RFValue(15) }}
                                labelStyle={{ fontSize: RFValue(14), color: colors.white, fontFamily: fontFamily.inder }}
                                style={{
                                    alignSelf: "center",
                                    borderRadius: RFValue(15)
                                }}
                                onPress={handleConfirmar}
                            />
                        </View>
                    </Modal>
                </>
            )}
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.blue[400],
        height: RFValue(120),
        width: RFValue(250),
        borderRadius: RFValue(5),
        elevation: 20,
        alignSelf: 'center',
    },
    title: {
        alignSelf: 'center',
        textAlign: 'center',
        color: colors.white,
        fontFamily: fontFamily.inder,
        fontSize: RFValue(12),
        marginBottom: RFValue(15),
    },
});