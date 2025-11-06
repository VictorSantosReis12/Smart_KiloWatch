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
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
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

// API
import { selecionarEletrodomesticoPorId, listarConsumoEnergiaPorEletrodomestico } from "@/services/api";

export default function EletrodomesticoModal({ visible, onDismiss, idEletrodomestico, userToken, onTempo, onEdit, onDelete, onEsc }: any) {

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [eletro, setEletro] = useState<any>(null);
    const [tempoHoje, setTempoHoje] = useState<number>(0);
    const [tipoHoje, setTipoHoje] = useState<string>('');
    const [consumoHoje, setConsumoHoje] = useState<string>("0,000");
    const [consumoMes, setConsumoMes] = useState<number>(0);

    useEffect(() => {
        if (!idEletrodomestico || !visible) return;

        setConsumoHoje("0,000")
        setConsumoMes(0)

        const fetchData = async () => {
            try {
                const dados = await selecionarEletrodomesticoPorId(userToken, idEletrodomestico);
                setEletro(dados);

                const registros = await listarConsumoEnergiaPorEletrodomestico(userToken, idEletrodomestico);

                const mesAtual = new Date().getMonth();
                const anoAtual = new Date().getFullYear();

                const registrosArray = Array.isArray(registros.data) ? registros.data : [];
                const registrosMes = registrosArray.filter((r: any) => {
                    const data = new Date(r.data_registro);
                    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
                });

                const hoje = new Date().toISOString().split("T")[0];
                const registroHoje = registrosMes.find((r: any) => r.data_registro.startsWith(hoje));

                let tempoHojeHoras = 0;
                let tempoConsumoHojeHoras = 0;
                if (registroHoje) {
                    if (registroHoje.tipo === 'hora') {
                        tempoHojeHoras = registroHoje.tempo / 60;
                        tempoConsumoHojeHoras = registroHoje.tempo / 60;
                    } else {
                        tempoHojeHoras = registroHoje.tempo;
                        tempoConsumoHojeHoras = registroHoje.tempo / 60;
                    }
                    setTipoHoje(registroHoje.tipo);
                }
                setTempoHoje(tempoHojeHoras);

                const consumoHoje = tempoConsumoHojeHoras * dados.data.consumo_kwh_hora;
                const consumoHojeFormatado = consumoHoje.toFixed(3).replace(".", ",");
                setConsumoHoje(consumoHojeFormatado);

                const somaMes = registrosMes.reduce((acc: number, r: any) => {
                    const tempoEmHoras = r.tipo === "hora" ? r.tempo / 60 : r.tempo / 60;
                    return acc + tempoEmHoras * dados.data.consumo_kwh_hora;
                }, 0);
                setConsumoMes(somaMes);

            } catch (err) {
                console.error("Erro ao carregar detalhes do eletro:", err);
            }
        };

        fetchData();
    }, [idEletrodomestico, visible]);

    if (!eletro) return null;

    return (
        <Portal>
            {isLandscape ? (
                <>
                    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                        <TouchableOpacity activeOpacity={1} style={{ position: "absolute", top: RFValue(15), right: RFValue(15), cursor: "pointer", height: RFValue(23), width: RFValue(23), zIndex: 5000 }} onPress={onEsc}>
                            <Icon name="close-circle" color={colors.white} size={RFValue(23)} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: RFValue(20), marginBottom: RFValue(15) }}>
                            <Icon name={eletro.data.imagem ? eletro.data.imagem as any : "progress-question"} size={RFValue(50)} color={colors.white} />
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={styles.textTitle}>Tipo</Text>
                                <Text style={styles.text}>{eletro.data.tipo}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: RFValue(20), marginBottom: RFValue(10) }}>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={styles.textTitle}>Marca</Text>
                                <Text style={styles.text}>{eletro.data.marca}</Text>
                            </View>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={styles.textTitle}>Modelo</Text>
                                <Text style={styles.text}>{eletro.data.modelo}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: RFValue(20), marginBottom: RFValue(10) }}>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={styles.textTitle}>Consumo kWh/mês</Text>
                                <Text style={styles.text}>{(Number(eletro.data.consumo_kwh_mes)).toFixed(3).replace(".", ",")} kWh</Text>
                            </View>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={styles.textTitle}>Consumo kWh/hora</Text>
                                <Text style={styles.text}>{(Number(eletro.data.consumo_kwh_hora)).toFixed(3).replace(".", ",")} kWh</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: RFValue(20), marginBottom: RFValue(10) }}>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={styles.textTitle}>Consumo de hoje</Text>
                                <Text style={styles.text}>{consumoHoje} kWh</Text>
                            </View>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={styles.textTitle}>Consumo no mês</Text>
                                <Text style={styles.text}>{consumoMes.toFixed(3).replace(".", ",")} kWh</Text>
                            </View>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={styles.textTitle}>Tempo de hoje</Text>
                                <Text style={styles.text}>{tempoHoje} {tipoHoje === 'min' ? tempoHoje === 1 ? "minuto" : "minutos" : tempoHoje === 1 ? "hora" : "horas"}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            {tempoHoje === 0 ? (
                                <Button
                                    children="Adicionar tempo"
                                    contentStyle={{ paddingVertical: RFValue(1), backgroundColor: colors.blue[400], borderWidth: RFValue(1), borderColor: colors.yellow[300], borderRadius: RFValue(20) }}
                                    labelStyle={{ fontSize: RFValue(6), color: colors.yellow[300] }}
                                    style={{
                                        width: RFValue(95),
                                        backgroundColor: colors.blue[400],
                                        borderRadius: RFValue(20),
                                        borderWidth: RFValue(1),
                                        borderColor: colors.yellow[300],
                                        height: "auto",
                                    }}
                                    onPress={onTempo}
                                />
                            ) : (
                                <Button
                                    children="Modificar tempo"
                                    contentStyle={{ paddingVertical: RFValue(1), backgroundColor: colors.blue[400], borderWidth: RFValue(1), borderColor: colors.yellow[300], borderRadius: RFValue(20) }}
                                    labelStyle={{ fontSize: RFValue(6), color: colors.yellow[300] }}
                                    style={{
                                        width: RFValue(95),
                                        backgroundColor: colors.blue[400],
                                        borderRadius: RFValue(20),
                                        borderWidth: RFValue(1),
                                        borderColor: colors.yellow[300],
                                        height: "auto"
                                    }}
                                    onPress={onTempo}
                                />
                            )}
                            <Button
                                children="Editar"
                                contentStyle={{ paddingVertical: RFValue(1), backgroundColor: colors.blue[400], borderWidth: RFValue(1), borderColor: colors.yellow[300], borderRadius: RFValue(20) }}
                                labelStyle={{ fontSize: RFValue(8), color: colors.yellow[300] }}
                                style={{
                                    width: RFValue(95),
                                    backgroundColor: colors.blue[400],
                                    borderRadius: RFValue(20),
                                    borderWidth: RFValue(1),
                                    borderColor: colors.yellow[300],
                                    height: "auto"
                                }}
                                onPress={onEdit}
                            />

                            <Button
                                children="Excluir"
                                contentStyle={{ paddingVertical: RFValue(1), backgroundColor: colors.blue[400], borderWidth: RFValue(1), borderColor: colors.red, borderRadius: RFValue(20) }}
                                labelStyle={{ fontSize: RFValue(8), color: colors.red }}
                                style={{
                                    width: RFValue(95),
                                    backgroundColor: colors.blue[400],
                                    borderRadius: RFValue(20),
                                    borderWidth: RFValue(1),
                                    borderColor: colors.red,
                                    height: "auto"
                                }}
                                onPress={onDelete}
                            />
                        </View>
                    </Modal>
                </>
            ) : (
                <>
                    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalContainer, { width: RFValue(300) }]}>
                        <TouchableOpacity activeOpacity={1} style={{ position: "absolute", top: RFValue(15), right: RFValue(15), cursor: "pointer", height: RFValue(30), width: RFValue(30), zIndex: 5000 }} onPress={onEsc}>
                            <Icon name="close-circle" color={colors.white} size={RFValue(30)} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: RFValue(20), marginBottom: RFValue(15) }}>
                            <Icon name={eletro.data.imagem ? eletro.data.imagem as any : "progress-question"} size={RFValue(70)} color={colors.white} />
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={[styles.textTitle, { fontSize: RFValue(16) }]}>Tipo</Text>
                                <Text style={[styles.text, { fontSize: RFValue(16) }]}>{eletro.data.tipo}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: RFValue(60), marginBottom: RFValue(10) }}>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={[styles.textTitle, { fontSize: RFValue(16) }]}>Marca</Text>
                                <Text style={[styles.text, { fontSize: RFValue(16) }]}>{eletro.data.marca}</Text>
                            </View>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={[styles.textTitle, { fontSize: RFValue(16), fontFamily: fontFamily.inder }]}>Modelo</Text>
                                <Text style={[styles.text, { fontSize: RFValue(16) }]}>{eletro.data.modelo}</Text>
                            </View>
                        </View>

                        <View style={{ alignItems: "flex-start", gap: RFValue(3), marginBottom: RFValue(10) }}>
                            <Text style={[styles.textTitle, { fontSize: RFValue(16) }]}>Consumo kWh/mês</Text>
                            <Text style={[styles.text, { fontSize: RFValue(16) }]}>{(Number(eletro.data.consumo_kwh_mes)).toFixed(3).replace(".", ",")} kWh</Text>
                        </View>

                        <View style={{ alignItems: "flex-start", gap: RFValue(3), marginBottom: RFValue(10) }}>
                            <Text style={[styles.textTitle, { fontSize: RFValue(16) }]}>Consumo kWh/hora</Text>
                            <Text style={[styles.text, { fontSize: RFValue(16) }]}>{(Number(eletro.data.consumo_kwh_hora)).toFixed(3).replace(".", ",")} kWh</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: RFValue(20), marginBottom: RFValue(10) }}>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={[styles.textTitle, { fontSize: RFValue(16) }]}>Consumo de hoje</Text>
                                <Text style={[styles.text, { fontSize: RFValue(16) }]}>{consumoHoje} kWh</Text>
                            </View>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={[styles.textTitle, { fontSize: RFValue(16) }]}>Consumo no mês</Text>
                                <Text style={[styles.text, { fontSize: RFValue(16) }]}>{consumoMes.toFixed(3).replace(".", ",")} kWh</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: RFValue(10) }}>
                            <View style={{ alignItems: "flex-start", gap: RFValue(3) }}>
                                <Text style={[styles.textTitle, { fontSize: RFValue(16) }]}>Tempo de hoje</Text>
                                <Text style={[styles.text, { fontSize: RFValue(16) }]}>{tempoHoje} {tipoHoje === 'min' ? tempoHoje === 1 ? "minuto" : "minutos" : tempoHoje === 1 ? "hora" : "horas"}</Text>
                            </View>

                            {tempoHoje === 0 ? (
                                <Button
                                    children="Adicionar tempo"
                                    contentStyle={{ paddingVertical: RFValue(0), backgroundColor: colors.blue[400], borderWidth: RFValue(1), borderColor: colors.yellow[300], borderRadius: RFValue(15) }}
                                    labelStyle={{ fontSize: RFValue(8), color: colors.yellow[300] }}
                                    style={{
                                        width: RFValue(140),
                                        backgroundColor: colors.blue[400],
                                        borderRadius: RFValue(15),
                                        borderWidth: RFValue(1),
                                        borderColor: colors.yellow[300],
                                        height: "auto",
                                    }}
                                    onPress={onTempo}
                                />
                            ) : (
                                <Button
                                    children="Modificar tempo"
                                    contentStyle={{ paddingVertical: RFValue(0), backgroundColor: colors.blue[400], borderWidth: RFValue(1), borderColor: colors.yellow[300], borderRadius: RFValue(15) }}
                                    labelStyle={{ fontSize: RFValue(8), color: colors.yellow[300] }}
                                    style={{
                                        width: RFValue(140),
                                        backgroundColor: colors.blue[400],
                                        borderRadius: RFValue(15),
                                        borderWidth: RFValue(1),
                                        borderColor: colors.yellow[300],
                                        height: "auto"
                                    }}
                                    onPress={onTempo}
                                />
                            )}
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Button
                                children="Editar"
                                contentStyle={{ paddingVertical: RFValue(0), backgroundColor: colors.blue[400], borderWidth: RFValue(1), borderColor: colors.yellow[300], borderRadius: RFValue(15) }}
                                labelStyle={{ fontSize: RFValue(10), color: colors.yellow[300] }}
                                style={{
                                    width: RFValue(120),
                                    backgroundColor: colors.blue[400],
                                    borderRadius: RFValue(15),
                                    borderWidth: RFValue(1),
                                    borderColor: colors.yellow[300],
                                    height: "auto"
                                }}
                                onPress={onEdit}
                            />

                            <Button
                                children="Excluir"
                                contentStyle={{ paddingVertical: RFValue(0), backgroundColor: colors.blue[400], borderWidth: RFValue(1), borderColor: colors.red, borderRadius: RFValue(15) }}
                                labelStyle={{ fontSize: RFValue(10), color: colors.red }}
                                style={{
                                    width: RFValue(120),
                                    backgroundColor: colors.blue[400],
                                    borderRadius: RFValue(15),
                                    borderWidth: RFValue(1),
                                    borderColor: colors.red,
                                    height: "auto"
                                }}
                                onPress={onDelete}
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
        padding: RFValue(15),
        borderRadius: RFValue(10),
        alignSelf: "center",
        width: RFValue(350),
        height: "auto",
    },
    textTitle: {
        fontSize: RFValue(12),
        color: colors.white,
        fontFamily: fontFamily.inder,
        fontWeight: "bold",
    },
    text: {
        fontSize: RFValue(12),
        color: colors.white,
        fontFamily: fontFamily.inder,
    },
});