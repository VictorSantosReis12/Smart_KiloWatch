// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity, FlatList } from "react-native";
import { IconButton, ActivityIndicator, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import Sidebar from "../screens/SidebarModal";

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
import { editarResidencia } from "@/services/api";

const estadosBR = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];

export default function EditarResidenciasConfigScreen({ navigation, route }: any) {
    const { residencia } = route.params;
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const alturaCalculada = height * 0.82;

    const { userData } = useContext(AuthContext);
    const { userToken } = useContext(AuthContext);

    // Estados
    const [estado, setEstado] = useState(residencia?.estado || '');
    const [filteredEstados, setFilteredEstados] = useState<string[]>(estadosBR);
    const [isFocused, setIsFocused] = useState(false);
    const [cidade, setCidade] = useState(residencia?.cidade || '');
    const [rua, setRua] = useState(residencia?.rua || '');
    const [numero, setNumero] = useState(residencia?.numero || '');
    const [complemento, setComplemento] = useState(residencia?.complemento || '');
    const [errorMessages, setErrorMessages] = useState({ estado: '', cidade: '', rua: '', numero: '', complemento: '' });
    const [errors, setErrors] = useState({ estado: '', cidade: '', rua: '', numero: '', complemento: '' });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    function handleChangeText(text: string) {
        setEstado(text);

        if (errors.estado) setErrors(prev => ({ ...prev, estado: "" }));
        if (errorMessages.estado) setErrorMessages(prev => ({ ...prev, estado: "" }));

        if (text.length === 0) {
            setFilteredEstados(estadosBR);
        } else {
            const filtered = estadosBR.filter(e =>
                e.toLowerCase().startsWith(text.toLowerCase())
            );
            setFilteredEstados(filtered);
        }
    }

    function onSelectEstado(estadoSelecionado: string) {
        setEstado(estadoSelecionado);
        setFilteredEstados([]);
        setIsFocused(false);
    }

    const handleRegister = async () => {
        let hasError = false;
        const newErrors: { estado: string; cidade: string; rua: string; numero: string; complemento: string } = { estado: '', cidade: '', rua: '', numero: '', complemento: '' };

        if (estado.trim() === '') {
            newErrors.estado = 'Por favor, selecione um Estado.';
            hasError = true;
        } else {
            const estadoValido = estadosBR.some(
                e => e.toLowerCase() === estado.trim().toLowerCase()
            );
            if (!estadoValido) {
                newErrors.estado = 'Estado inválido. Selecione um estado válido.';
                hasError = true;
            }
        }

        if (cidade.trim() === '') {
            newErrors.cidade = 'Por favor, preencha a Cidade.';
            hasError = true;
        }

        if (rua.trim() === '') {
            newErrors.rua = 'Por favor, preencha a Rua.';
            hasError = true;
        }

        if (numero.trim() === '') {
            newErrors.numero = 'Por favor, preencha o Número.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setErrors({ estado: '', cidade: '', rua: '', numero: '', complemento: '' });

        const idUsuario = userData.id_usuario;
        try {
            const editarResponse = await editarResidencia(userToken, idUsuario, estado, cidade, rua, numero, complemento, residencia.id_residencia);

            if (!editarResponse.success) {
                setSnackbarVisible(true);
                setSnackbarMessage(editarResponse.message || 'Erro ao editar residência.');
                return;
            }

            navigation.navigate("ResidenciasConfig");
        } catch (error) {
            console.error('Erro no handleRegister:', error);
        }
    };

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[400]} />

                    <Sidebar navigation={navigation} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12) }}>Editar Residência</Text>
                                <Icon name="close-circle" color={colors.white} size={RFValue(23)} onPress={() => navigation.navigate("ResidenciasConfig")} />
                            </View>
                            <ScrollView
                                style={{ width: RFValue(610), marginTop: RFValue(10), maxHeight: RFValue(530) }}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={{ position: "relative", zIndex: 1000 }}>
                                    <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(5) }}>
                                        Estado
                                    </Text>
                                    <Input
                                        border={!!errors.estado === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        disableLabel={true}
                                        placeholder="Estado"
                                        value={estado}
                                        styleLabel={{ color: !!errors.estado === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                        contentStyle={{ fontSize: RFValue(10) }}
                                        outlineColor={!!errors.estado === true ? colors.red : 'transparent'}
                                        onChangeText={handleChangeText}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => {
                                            setTimeout(() => setIsFocused(false), 100);
                                        }}
                                        style={[styles.input, { width: RFValue(610), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.estado}
                                        errorText={errors.estado}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                    />
                                    {isFocused && filteredEstados.length > 0 && (
                                        <FlatList
                                            data={filteredEstados}
                                            keyExtractor={item => item}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity onPress={() => onSelectEstado(item)}>
                                                    <Text style={{ padding: 8, backgroundColor: colors.blue[200], fontFamily: fontFamily.inder, color: colors.white }}>{item}</Text>
                                                </TouchableOpacity>
                                            )}
                                            style={{
                                                position: 'absolute',
                                                top: RFValue(41),
                                                width: RFValue(600),
                                                maxHeight: RFValue(45),
                                                backgroundColor: colors.blue[200],
                                                marginTop: 4,
                                                borderRadius: 5,
                                                zIndex: 1000
                                            }}
                                        />
                                    )}
                                </View>
                                <View>
                                    <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(5) }}>
                                        Cidade
                                    </Text>
                                    <Input
                                        border={!!errors.cidade === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        disableLabel={true}
                                        placeholder="Cidade"
                                        value={cidade}
                                        styleLabel={{ color: !!errors.cidade === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                        contentStyle={{ fontSize: RFValue(10) }}
                                        outlineColor={!!errors.cidade === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setCidade(v);
                                            if (errors.cidade) {
                                                setErrors(prev => ({ ...prev, cidade: '' }));
                                            }
                                            if (errorMessages.cidade) {
                                                setErrorMessages(prev => ({ ...prev, cidade: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(610), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.cidade}
                                        errorText={errors.cidade}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(5) }}>
                                        Rua
                                    </Text>
                                    <Input
                                        border={!!errors.rua === true ? colors.red : colors.gray}
                                        autoCapitalize="none"
                                        disableLabel={true}
                                        placeholder="Rua"
                                        value={rua}
                                        styleLabel={{ color: !!errors.rua === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                        contentStyle={{ fontSize: RFValue(10) }}
                                        outlineColor={!!errors.rua === true ? colors.red : 'transparent'}
                                        onChangeText={v => {
                                            setRua(v);
                                            if (errors.rua) {
                                                setErrors(prev => ({ ...prev, rua: '' }));
                                            }
                                            if (errorMessages.rua) {
                                                setErrorMessages(prev => ({ ...prev, rua: '' }));
                                            }
                                        }}
                                        style={[styles.input, { width: RFValue(610), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                        hasError={!!errors.rua}
                                        errorText={errors.rua}
                                        helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                    />
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View>
                                        <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(5) }}>
                                            Número
                                        </Text>
                                        <Input
                                            border={!!errors.numero === true ? colors.red : colors.gray}
                                            autoCapitalize="none"
                                            disableLabel={true}
                                            placeholder="Número"
                                            value={numero}
                                            styleLabel={{ color: !!errors.numero === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                            contentStyle={{ fontSize: RFValue(10) }}
                                            outlineColor={!!errors.numero === true ? colors.red : 'transparent'}
                                            onChangeText={v => {
                                                setNumero(v);
                                                if (errors.numero) {
                                                    setErrors(prev => ({ ...prev, numero: '' }));
                                                }
                                                if (errorMessages.numero) {
                                                    setErrorMessages(prev => ({ ...prev, numero: '' }));
                                                }
                                            }}
                                            style={[styles.input, { width: RFValue(285), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                            keyboardType='numeric'
                                            hasError={!!errors.numero}
                                            errorText={errors.numero}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                        />
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(5) }}>
                                            Complemento
                                        </Text>
                                        <Input
                                            border={!!errors.complemento === true ? colors.red : colors.gray}
                                            autoCapitalize="none"
                                            disableLabel={true}
                                            placeholder="Complemento"
                                            value={complemento}
                                            styleLabel={{ color: !!errors.complemento === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                            contentStyle={{ fontSize: RFValue(10) }}
                                            outlineColor={!!errors.complemento === true ? colors.red : 'transparent'}
                                            onChangeText={v => {
                                                setComplemento(v);
                                                if (errors.complemento) {
                                                    setErrors(prev => ({ ...prev, complemento: '' }));
                                                }
                                                if (errorMessages.complemento) {
                                                    setErrorMessages(prev => ({ ...prev, complemento: '' }));
                                                }
                                            }}
                                            style={[styles.input, { width: RFValue(285), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                            hasError={!!errors.complemento}
                                            errorText={errors.complemento}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                        />
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                width: RFValue(610),
                                paddingVertical: RFValue(5)
                            }}>
                                <Button
                                    children="Confirmar"
                                    contentStyle={{ paddingVertical: RFValue(4), backgroundColor: colors.green }}
                                    labelStyle={{ fontSize: RFValue(10), color: colors.white }}
                                    style={{
                                        width: RFValue(140),
                                        backgroundColor: colors.green,
                                        borderRadius: RFValue(20)
                                    }}
                                    onPress={() => handleRegister()}
                                />
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingBottom: RFValue(20), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text style={{ color: colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18) }}>Editar Residência</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30), gap: RFValue(25) }}>
                                <View
                                    style={{ width: "100%" }}
                                >
                                    <View style={{ position: "relative", zIndex: 1000 }}>
                                        <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(8) }}>
                                            Estado
                                        </Text>
                                        <Input
                                            border={!!errors.estado === true ? colors.red : colors.gray}
                                            autoCapitalize="none"
                                            disableLabel={true}
                                            placeholder="Estado"
                                            value={estado}
                                            styleLabel={{ color: !!errors.estado === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                            contentStyle={{ fontSize: RFValue(16) }}
                                            outlineColor={!!errors.estado === true ? colors.red : 'transparent'}
                                            onChangeText={handleChangeText}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => {
                                                setTimeout(() => setIsFocused(false), 100);
                                            }}
                                            style={[styles.input, { width: "100%", height: RFValue(40), marginBottom: RFValue(20), borderRadius: RFValue(10) }]}
                                            hasError={!!errors.estado}
                                            errorText={errors.estado}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(0) }]}
                                        />
                                        {isFocused && filteredEstados.length > 0 && (
                                            <FlatList
                                                data={filteredEstados}
                                                keyExtractor={item => item}
                                                keyboardShouldPersistTaps="handled"
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity onPress={() => onSelectEstado(item)}>
                                                        <Text style={{ padding: 8, backgroundColor: colors.blue[200], fontFamily: fontFamily.inder, color: colors.white }}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                                style={{
                                                    position: 'absolute',
                                                    top: RFValue(64),
                                                    width: "100%",
                                                    maxHeight: RFValue(90),
                                                    backgroundColor: colors.blue[200],
                                                    marginTop: 4,
                                                    borderRadius: 5,
                                                    zIndex: 1000,
                                                    elevation: 5
                                                }}
                                            />
                                        )}
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(8) }}>
                                            Cidade
                                        </Text>
                                        <Input
                                            border={!!errors.cidade === true ? colors.red : colors.gray}
                                            autoCapitalize="none"
                                            disableLabel={true}
                                            placeholder="Cidade"
                                            value={cidade}
                                            styleLabel={{ color: !!errors.cidade === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                            contentStyle={{ fontSize: RFValue(16) }}
                                            outlineColor={!!errors.cidade === true ? colors.red : 'transparent'}
                                            onChangeText={v => {
                                                setCidade(v);
                                                if (errors.cidade) {
                                                    setErrors(prev => ({ ...prev, cidade: '' }));
                                                }
                                                if (errorMessages.cidade) {
                                                    setErrorMessages(prev => ({ ...prev, cidade: '' }));
                                                }
                                            }}
                                            style={[styles.input, { width: "100%", height: RFValue(40), marginBottom: RFValue(20), borderRadius: RFValue(10) }]}
                                            hasError={!!errors.cidade}
                                            errorText={errors.cidade}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(6), bottom: RFValue(0) }]}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(8) }}>
                                            Rua
                                        </Text>
                                        <Input
                                            border={!!errors.rua === true ? colors.red : colors.gray}
                                            autoCapitalize="none"
                                            disableLabel={true}
                                            placeholder="Rua"
                                            value={rua}
                                            styleLabel={{ color: !!errors.rua === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                            contentStyle={{ fontSize: RFValue(16) }}
                                            outlineColor={!!errors.rua === true ? colors.red : 'transparent'}
                                            onChangeText={v => {
                                                setRua(v);
                                                if (errors.rua) {
                                                    setErrors(prev => ({ ...prev, rua: '' }));
                                                }
                                                if (errorMessages.rua) {
                                                    setErrorMessages(prev => ({ ...prev, rua: '' }));
                                                }
                                            }}
                                            style={[styles.input, { width: "100%", height: RFValue(40), marginBottom: RFValue(20), borderRadius: RFValue(10) }]}
                                            hasError={!!errors.rua}
                                            errorText={errors.rua}
                                            helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(0) }]}
                                        />
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <View>
                                            <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(8) }}>
                                                Número
                                            </Text>
                                            <Input
                                                border={!!errors.numero === true ? colors.red : colors.gray}
                                                autoCapitalize="none"
                                                disableLabel={true}
                                                placeholder="Número"
                                                value={numero}
                                                styleLabel={{ color: !!errors.numero === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                                contentStyle={{ fontSize: RFValue(16) }}
                                                outlineColor={!!errors.numero === true ? colors.red : 'transparent'}
                                                onChangeText={v => {
                                                    setNumero(v);
                                                    if (errors.numero) {
                                                        setErrors(prev => ({ ...prev, numero: '' }));
                                                    }
                                                    if (errorMessages.numero) {
                                                        setErrorMessages(prev => ({ ...prev, numero: '' }));
                                                    }
                                                }}
                                                style={[styles.input, { width: RFValue(145), height: RFValue(40), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                                keyboardType='numeric'
                                                hasError={!!errors.numero}
                                                errorText={errors.numero}
                                                helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(0) }]}
                                            />
                                        </View>

                                        <View>
                                            <Text style={{ fontSize: RFValue(16), color: colors.white, fontFamily: fontFamily.inder, marginBottom: RFValue(8) }}>
                                                Complemento
                                            </Text>
                                            <Input
                                                border={!!errors.complemento === true ? colors.red : colors.gray}
                                                autoCapitalize="none"
                                                disableLabel={true}
                                                placeholder="Complemento"
                                                value={complemento}
                                                styleLabel={{ color: !!errors.complemento === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                                contentStyle={{ fontSize: RFValue(16) }}
                                                outlineColor={!!errors.complemento === true ? colors.red : 'transparent'}
                                                onChangeText={v => {
                                                    setComplemento(v);
                                                    if (errors.complemento) {
                                                        setErrors(prev => ({ ...prev, complemento: '' }));
                                                    }
                                                    if (errorMessages.complemento) {
                                                        setErrorMessages(prev => ({ ...prev, complemento: '' }));
                                                    }
                                                }}
                                                style={[styles.input, { width: RFValue(145), height: RFValue(40), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                                hasError={!!errors.complemento}
                                                errorText={errors.complemento}
                                                helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(0) }]}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    paddingVertical: RFValue(5)
                                }}>
                                    <Button
                                        children="Confirmar"
                                        contentStyle={{ paddingVertical: RFValue(6), backgroundColor: colors.green }}
                                        labelStyle={{ fontSize: RFValue(14), color: colors.white }}
                                        style={{
                                            width: RFValue(145),
                                            backgroundColor: colors.green,
                                            borderRadius: RFValue(20)
                                        }}
                                        onPress={() => handleRegister()}
                                    />

                                    <Button
                                        children="Cancelar"
                                        compact
                                        contentStyle={{ paddingVertical: RFValue(6), backgroundColor: colors.blue[500], borderColor: colors.white, borderWidth: RFValue(2), width: RFValue(145), borderRadius: RFValue(20) }}
                                        labelStyle={{ fontSize: RFValue(14), color: colors.white }}
                                        style={{
                                            alignSelf: "center",
                                            borderRadius: RFValue(20)
                                        }}
                                        onPress={() => navigation.navigate('ResidenciasConfig')}
                                    />
                                </View>
                            </View>
                        </View>
                    }
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
                            marginBottom: isLandscape ? RFValue(0) : RFValue(85),
                            zIndex: 5000,
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
        backgroundColor: colors.blue[500],
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative"
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