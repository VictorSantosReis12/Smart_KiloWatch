// React Native
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, FlatList, TouchableOpacity } from "react-native";
import { IconButton, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';

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

// API
import { cadastrarResidencia } from "@/services/api";

const estadosBR = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'];

export default function CadastrarResidenciaScreen({ navigation }: any) {
    const { userData } = useContext(AuthContext);
    const { userToken } = useContext(AuthContext);

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
    const [estado, setEstado] = useState('');
    const [filteredEstados, setFilteredEstados] = useState<string[]>(estadosBR);
    const [isFocused, setIsFocused] = useState(false);
    const [cidade, setCidade] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
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
            const cadastroResponse = await cadastrarResidencia(userToken, idUsuario, estado, cidade, rua, numero, complemento);

            if (!cadastroResponse.success) {
                setSnackbarVisible(true);
                setSnackbarMessage(cadastroResponse.message || 'Erro ao cadastrar residência.');
                return;
            }

            navigation.navigate("Residencias");
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
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    {isLandscape ?
                        <View style={{ borderWidth: RFValue(1), borderColor: colors.white, borderRadius: RFValue(10), padding: RFValue(10), height: "100%" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: RFValue(600), paddingBottom: RFValue(8), borderBottomWidth: RFValue(3), borderBottomColor: colors.yellow[300] }}>
                                <Text style={{ fontSize: RFValue(12), fontFamily: fontFamily.krona, color: colors.white }}>
                                    Cadastrar Residência
                                </Text>

                                <Button
                                    children="Cancelar"
                                    compact
                                    contentStyle={{ paddingVertical: RFValue(1), paddingHorizontal: RFValue(0), backgroundColor: colors.blue[500], borderColor: colors.white, borderWidth: RFValue(2), width: RFValue(90) }}
                                    labelStyle={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder }}
                                    style={{
                                        alignSelf: "center",
                                        borderRadius: RFValue(5)
                                    }}
                                    onPress={() => navigation.navigate('Residencias')}
                                />
                            </View>

                            <ScrollView
                                style={{ width: RFValue(600), marginTop: RFValue(10), maxHeight: RFValue(500) }}
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
                                        style={[styles.input, { width: RFValue(600), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
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
                                        style={[styles.input, { width: RFValue(600), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
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
                                        style={[styles.input, { width: RFValue(600), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
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
                                            style={[styles.input, { width: RFValue(280), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
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
                                            style={[styles.input, { width: RFValue(280), height: RFValue(25), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
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
                                width: RFValue(600),
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
                        <View style={{ paddingHorizontal: RFValue(6), paddingVertical: RFValue(20), height: "100%", width: "100%" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingBottom: RFValue(15), borderBottomWidth: RFValue(3), borderBottomColor: colors.yellow[300], marginTop: RFValue(15) }}>
                                <Text style={{ fontSize: RFValue(18), fontFamily: fontFamily.krona, color: colors.white }}>
                                    Cadastrar Residência
                                </Text>
                            </View>

                            <View
                                style={{ width: "100%", marginTop: RFValue(20), height: RFValue(500) }}
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
                                    children="Cancelar"
                                    compact
                                    contentStyle={{ paddingVertical: RFValue(6), backgroundColor: colors.blue[500], borderColor: colors.white, borderWidth: RFValue(2), width: RFValue(145), borderRadius: RFValue(20) }}
                                    labelStyle={{ fontSize: RFValue(14), color: colors.white }}
                                    style={{
                                        alignSelf: "center",
                                        borderRadius: RFValue(20)
                                    }}
                                    onPress={() => navigation.navigate('Residencias')}
                                />
                                
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
                            marginBottom: isLandscape ? RFValue(5) : RFValue(10),
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