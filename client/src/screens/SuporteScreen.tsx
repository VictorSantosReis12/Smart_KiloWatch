// React Native
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Alert, Image, View, StyleSheet, StatusBar, ScrollView, useWindowDimensions, Text, TouchableOpacity } from "react-native";
import { IconButton, ActivityIndicator, Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from "react-native-responsive-fontsize";
import AuthContext from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes
import OkModal from "../screens/OkModal";
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
import { buscarUsuarioPorEmail, enviarEmail } from "@/services/api";

const faqData = [
    { id: 1, title: "O que é o Smart KiloWatch?", content: "O Smart KiloWatch é um aplicativo que ajuda você a monitorar e organizar o consumo de energia e água em casa. Com ele, é possível cadastrar eletrodomésticos e atividades, acompanhar relatórios e receber dicas de economia, tudo de forma prática e gratuita." },
    { id: 2, title: "Preciso de sensores ou aparelhos extras para usar o aplicativo?", content: "Não. O Smart KiloWatch funciona com entrada manual de informações, como o tempo de uso dos aparelhos ou quantidade de água utilizada em atividades. Isso torna o app acessível para qualquer pessoa, sem a necessidade de investir em equipamentos adicionais." },
    { id: 3, title: "O aplicativo é gratuito?", content: "Sim. Todas as funcionalidades do Smart KiloWatch são totalmente gratuitas. Você não precisa pagar planos ou assinaturas para acessar relatórios, gráficos ou estimativas de consumo." },
    { id: 4, title: "O app mostra o valor exato da minha conta de luz e água?", content: "Não. O aplicativo faz estimativas baseadas nos dados fornecidos por você e em médias de consumo. Os valores podem variar em relação à conta final, mas servem como referência para identificar onde economizar." },
    { id: 5, title: "Como o aplicativo calcula o consumo de energia?", content: "Ao cadastrar um eletrodoméstico, você informa a potência do aparelho (em watts) e o tempo de uso. O aplicativo usa esses dados junto ao preço do kWh da sua região para calcular o consumo estimado." },
    { id: 6, title: "Posso usar o Smart KiloWatch em qualquer residência?", content: "Sim. O aplicativo foi pensado para se adaptar a qualquer tipo de casa ou apartamento, independentemente do tamanho ou da região." },
    { id: 7, title: "Preciso ter conhecimentos técnicos para usar?", content: "Não. O Smart KiloWatch foi desenvolvido para ser simples e intuitivo. Mesmo quem não entende de consumo energético ou hidráulico consegue usar o app e aprender no processo." },
    { id: 8, title: "Os meus dados ficam seguros no aplicativo?", content: "Sim. O Smart KiloWatch utiliza boas práticas de segurança para proteger suas informações. Os dados são usados apenas dentro da plataforma e não são compartilhados com terceiros." },
    { id: 9, title: "O aplicativo pode ser usado em empresas ou escolas?", content: "Atualmente, o foco do Smart KiloWatch é o uso residencial. No entanto, muitas funcionalidades também podem ajudar pequenas empresas e instituições que desejam monitorar o consumo de forma simples." },
    { id: 10, title: "O aplicativo funciona offline?", content: "Sim, algumas funcionalidades podem ser usadas offline, como visualizar aparelhos cadastrados ou registrar informações. Porém, para gerar relatórios completos e sincronizar dados, é necessário estar conectado à internet." },
];

export default function SuporteScreen({ navigation }: any) {
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

    const idUsuario = userData?.id_usuario || '';
    const nomeUsuario = userData?.nome || '';
    const emailUsuario = userData?.email || '';

    const [abaSelecionada, setAbaSelecionada] = useState<'contato' | 'faq' | 'tutorial'>('faq');

    const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});

    const [isLoading, setIsLoading] = useState(false);

    const toggleItem = (id: number) => {
        setOpenItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const [assunto, setAssunto] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [textArea, setTextArea] = useState(true);
    const [errorMessages, setErrorMessages] = useState({ assunto: '', mensagem: '' });
    const [errors, setErrors] = useState({ assunto: '', mensagem: '' });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleRegister = async () => {
        let hasError = false;
        const newErrors: { assunto: string; mensagem: string; } = { assunto: '', mensagem: '' };

        if (assunto.trim() === '') {
            newErrors.assunto = 'Por favor, preencha o Assunto.';
            hasError = true;
        }

        if (mensagem.trim() === '') {
            newErrors.mensagem = 'Por favor, preencha a Mensagem.';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        setErrors({ assunto: '', mensagem: '' });

        setIsLoading(true);

        try {
            const suporteResponse = await enviarEmail(userToken, nomeUsuario, emailUsuario, assunto, mensagem);
            console.log("Resposta do back:", suporteResponse);

            if (!suporteResponse.success) {
                setSnackbarVisible(true);
                setSnackbarMessage(suporteResponse.message || 'Erro ao enviar mensagem para o suporte.');
                return;
            }

            setSnackbarVisible(true);
            setSnackbarMessage(suporteResponse.message || 'Mensagem enviada com sucesso.');
            setAssunto('');
            setMensagem('');
        } catch (error) {
            console.error('Erro no handleRegister:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Modal
    const [textModal, setTextModal] = useState('Funcionalidade disponível em breve!');
    const [modalVisible, setModalVisible] = useState(false);

    const handleCloseModal = () => setModalVisible(false);
    const handleOk = () => setModalVisible(false);

    if (!fontsLoaded) {
        return null
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar barStyle="light-content" backgroundColor={colors.blue[500]} />

                    {isLandscape ?
                        <View style={{ height: RFValue(277), width: RFValue(640), alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "10%", left: RFValue(40), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15) }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: RFValue(6), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <View style={{ width: "33%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                                    <Text
                                        style={{ color: abaSelecionada === 'contato' ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), borderBottomWidth: RFValue(1.5), borderColor: abaSelecionada === 'contato' ? colors.yellow[300] : colors.blue[500], paddingBottom: RFValue(3) }}
                                        onPress={() => {
                                            setAbaSelecionada('contato');
                                        }}
                                    >Contato</Text>
                                </View>
                                <View style={{ width: RFValue(1), height: "100%", backgroundColor: colors.white }}>
                                </View>
                                <View style={{ width: "33%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                                    <Text
                                        style={{ color: abaSelecionada === 'faq' ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), borderBottomWidth: RFValue(1.5), borderColor: abaSelecionada === 'faq' ? colors.yellow[300] : colors.blue[500], paddingBottom: RFValue(3) }}
                                        onPress={() => {
                                            setAbaSelecionada('faq');
                                        }}
                                    >FAQ</Text>
                                </View>
                                <View style={{ width: RFValue(1), height: "100%", backgroundColor: colors.white }}>
                                </View>
                                <View style={{ width: "33%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                                    <Text
                                        style={{ color: abaSelecionada === 'tutorial' ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(12), borderBottomWidth: RFValue(1.5), borderColor: abaSelecionada === 'tutorial' ? colors.yellow[300] : colors.blue[500], paddingBottom: RFValue(3) }}
                                        onPress={() => {
                                            setAbaSelecionada('tutorial');
                                        }}
                                    >Tutorial</Text>
                                </View>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(15) }}>
                                {abaSelecionada === 'contato' && (
                                    <View style={{ width: '100%', height: RFValue(208), backgroundColor: colors.blue[500], alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <View style={{ width: '38%', height: '100%', justifyContent: 'flex-start', alignItems: 'center', paddingTop: RFValue(10), gap: RFValue(10) }}>
                                            <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, textAlign: 'center', width: '100%' }}>Se quiser entrar em contato com o suporte do Smart KiloWatch, envie uma mensagem para o email suporte.smart.kilowatch@gmail.com</Text>
                                            <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, textAlign: 'center', width: '100%' }}>Atenção! Caso seu email não seja válido ou não exista, você não receberá retorno.</Text>
                                        </View>
                                        <View style={{ width: "60%", height: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: colors.blue[400], flex: 1, width: '100%', borderRadius: RFValue(10), alignItems: 'center', justifyContent: 'flex-start', paddingVertical: RFValue(10), paddingHorizontal: RFValue(10) }}>
                                                <View style={{ width: "100%" }}>
                                                    <Input
                                                        border={!!errors.assunto === true ? colors.red : colors.gray}
                                                        autoCapitalize="none"
                                                        label="Assunto"
                                                        value={assunto}
                                                        styleLabel={{ color: !!errors.assunto === true ? colors.red : colors.white, fontSize: RFValue(10) }}
                                                        contentStyle={{ fontSize: RFValue(10) }}
                                                        outlineColor={!!errors.assunto === true ? colors.red : 'transparent'}
                                                        onChangeText={v => {
                                                            setAssunto(v);
                                                            if (errors.assunto) {
                                                                setErrors(prev => ({ ...prev, assunto: '' }));
                                                            }
                                                            if (errorMessages.assunto) {
                                                                setErrorMessages(prev => ({ ...prev, assunto: '' }));
                                                            }
                                                        }}
                                                        style={[styles.input, { width: "100%", height: RFValue(25), marginBottom: RFValue(13), borderRadius: RFValue(10) }]}
                                                        hasError={!!errors.assunto}
                                                        errorText={errors.assunto}
                                                        helperStyle={[styles.helperText, { fontSize: RFValue(8), top: RFValue(28) }]}
                                                    />
                                                </View>
                                                <View style={{ width: "100%" }}>
                                                    <Input
                                                        border={!!errors.mensagem === true ? colors.red : colors.gray}
                                                        autoCapitalize="none"
                                                        disableLabel={true}
                                                        placeholder="Mensagem"
                                                        value={mensagem}
                                                        styleLabel={{ color: !!errors.mensagem === true ? colors.red : colors.white, fontSize: RFValue(10), textAlignVertical: 'top' }}
                                                        contentStyle={{ fontSize: RFValue(10), textAlignVertical: 'top' }}
                                                        outlineColor={!!errors.mensagem === true ? colors.red : 'transparent'}
                                                        onChangeText={v => {
                                                            setMensagem(v);
                                                            if (errors.mensagem) {
                                                                setErrors(prev => ({ ...prev, mensagem: '' }));
                                                            }
                                                            if (errorMessages.mensagem) {
                                                                setErrorMessages(prev => ({ ...prev, mensagem: '' }));
                                                            }
                                                        }}
                                                        style={[styles.input, { width: "100%", height: RFValue(100), marginBottom: RFValue(10), borderRadius: RFValue(10) }]}
                                                        hasError={!!errors.mensagem}
                                                        errorText={errors.mensagem}
                                                        helperStyle={[styles.helperText, { fontSize: RFValue(8), top: RFValue(103) }]}
                                                        multiline={true}
                                                        numberOfLines={7}
                                                        textAlignVertical='top'
                                                    />
                                                </View>
                                                <View style={{ position: 'relative', width: RFValue(130), marginTop: RFValue(8) }}>
                                                    <Button
                                                        children={isLoading ? "ㅤ" : "Enviar"}
                                                        contentStyle={{ paddingVertical: isLoading ? RFValue(2.8) : RFValue(4), backgroundColor: colors.blue[300] }}
                                                        labelStyle={{ fontSize: RFValue(10), color: colors.yellow[200] }}
                                                        style={{
                                                            width: RFValue(130),
                                                            backgroundColor: colors.blue[300],
                                                            borderRadius: RFValue(20)
                                                        }}
                                                        onPress={() => handleRegister()}
                                                        disabled={isLoading}
                                                    />
                                                    {isLoading && (
                                                        <>
                                                            <View
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    bottom: 0,
                                                                    backgroundColor: colors.black,
                                                                    borderRadius: RFValue(20),
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    opacity: 0.3,
                                                                    width: "100%",
                                                                    height: "100%"
                                                                }}
                                                            ></View>
                                                            <View
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0,
                                                                    bottom: 0,
                                                                    backgroundColor: "transparent",
                                                                    borderRadius: RFValue(20),
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    width: "100%",
                                                                    height: "100%"
                                                                }}
                                                            >
                                                                <ActivityIndicator size="small" color={colors.white} />
                                                            </View>
                                                        </>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                {abaSelecionada === 'faq' && (
                                    <ScrollView style={{ width: "100%", height: RFValue(220), maxHeight: RFValue(220) }} showsVerticalScrollIndicator={false}>
                                        {faqData.map((faq) => (
                                            <React.Fragment key={faq.id}>
                                                <TouchableOpacity
                                                    style={{ width: '100%', height: RFValue(30), backgroundColor: colors.blue[400], borderRadius: RFValue(10), flexDirection: 'row', justifyContent: "space-between", alignItems: "center", paddingHorizontal: RFValue(15), marginBottom: openItems[faq.id] ? RFValue(4) : RFValue(20), borderBottomLeftRadius: openItems[faq.id] ? RFValue(0) : RFValue(10), borderBottomRightRadius: openItems[faq.id] ? RFValue(0) : RFValue(10) }}
                                                    onPress={() => toggleItem(faq.id)}
                                                    activeOpacity={1}
                                                >
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10), maxWidth: '85%' }}>
                                                        {faq.title}
                                                    </Text>
                                                    <Ionicons name={openItems[faq.id] ? "chevron-up" : "chevron-down"} size={RFValue(18)} color={colors.white} />
                                                </TouchableOpacity>

                                                {openItems[faq.id] && (
                                                    <View style={{ backgroundColor: colors.blue[300], width: '100%', padding: RFValue(10), borderBottomLeftRadius: RFValue(10), borderBottomRightRadius: RFValue(10), marginBottom: RFValue(10) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(10) }}>
                                                            {faq.content}
                                                        </Text>
                                                    </View>
                                                )}
                                            </React.Fragment>
                                        ))}

                                    </ScrollView>
                                )}
                                {abaSelecionada === 'tutorial' && (
                                    <View style={{ width: '60%', height: "auto", backgroundColor: colors.blue[400], alignItems: 'center', justifyContent: 'flex-start', borderRadius: RFValue(10), padding: RFValue(15), gap: RFValue(15), alignSelf: 'center' }}>
                                        <Text style={{ fontSize: RFValue(10), color: colors.white, fontFamily: fontFamily.inder, textAlign: "center" }}>Se deseja conhecer mais sobre as funcionalidades do aplicativo, pressione o botão abaixo para iniciar o tutorial</Text>

                                        <Button
                                            children={"Iniciar Tutorial"}
                                            contentStyle={{ paddingVertical: RFValue(4), backgroundColor: colors.blue[300] }}
                                            labelStyle={{ fontSize: RFValue(10), color: colors.yellow[200] }}
                                            style={{
                                                width: RFValue(130),
                                                backgroundColor: colors.blue[300],
                                                borderRadius: RFValue(20)
                                            }}
                                            onPress={() => setModalVisible(true)}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                        :
                        <View style={{ height: alturaCalculada, width: width, alignItems: "center", justifyContent: "flex-start", position: "absolute", top: "9%", left: RFValue(0), backgroundColor: colors.blue[500], paddingHorizontal: RFValue(15), paddingVertical: RFValue(15), zIndex: 3000 }}>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: RFValue(15.5), paddingTop: RFValue(10), borderBottomWidth: RFValue(3), borderColor: colors.yellow[300] }}>
                                <Text
                                    style={{ color: abaSelecionada === 'contato' ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18), borderBottomWidth: RFValue(1.5), borderColor: abaSelecionada === 'contato' ? colors.yellow[300] : colors.blue[500], paddingBottom: RFValue(3) }}
                                    onPress={() => {
                                        setAbaSelecionada('contato');
                                    }}
                                >Contato</Text>
                                <Text
                                    style={{ color: abaSelecionada === 'faq' ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18), borderBottomWidth: RFValue(1.5), borderColor: abaSelecionada === 'faq' ? colors.yellow[300] : colors.blue[500], paddingBottom: RFValue(3) }}
                                    onPress={() => {
                                        setAbaSelecionada('faq');
                                    }}
                                >FAQ</Text>
                                <Text
                                    style={{ color: abaSelecionada === 'tutorial' ? colors.yellow[200] : colors.white, fontFamily: fontFamily.krona, fontSize: RFValue(18), borderBottomWidth: RFValue(1.5), borderColor: abaSelecionada === 'tutorial' ? colors.yellow[300] : colors.blue[500], paddingBottom: RFValue(3) }}
                                    onPress={() => {
                                        setAbaSelecionada('tutorial');
                                    }}
                                >Tutorial</Text>
                            </View>
                            <View style={{ width: "100%", marginTop: RFValue(30), gap: RFValue(25) }}>
                                {abaSelecionada === 'contato' && (
                                    <View style={{ width: '100%', height: RFValue(450), backgroundColor: colors.blue[500], alignItems: 'center' }}>
                                        <Text style={{ fontSize: RFValue(14), color: colors.white, fontFamily: fontFamily.inder, textAlign: 'center', width: '100%' }}>Se quiser entrar em contato com o suporte do Smart KiloWatch, envie uma mensagem para o email suporte.smart.kilowatch@gmail.com</Text>
                                        <Text style={{ fontSize: RFValue(14), color: colors.white, fontFamily: fontFamily.inder, textAlign: 'center', width: '100%', marginTop: RFValue(10) }}>Atenção! Caso seu email não seja válido ou não exista, você não receberá retorno.</Text>

                                        <View style={{ backgroundColor: colors.blue[400], flex: 1, width: '100%', borderRadius: RFValue(10), marginTop: RFValue(20), alignItems: 'center', justifyContent: 'flex-start', paddingVertical: RFValue(20), paddingHorizontal: RFValue(20) }}>
                                            <View style={{ width: "100%" }}>
                                                <Input
                                                    border={!!errors.assunto === true ? colors.red : colors.gray}
                                                    autoCapitalize="none"
                                                    label="Assunto"
                                                    value={assunto}
                                                    styleLabel={{ color: !!errors.assunto === true ? colors.red : colors.white, fontSize: RFValue(16) }}
                                                    contentStyle={{ fontSize: RFValue(16) }}
                                                    outlineColor={!!errors.assunto === true ? colors.red : 'transparent'}
                                                    onChangeText={v => {
                                                        setAssunto(v);
                                                        if (errors.assunto) {
                                                            setErrors(prev => ({ ...prev, assunto: '' }));
                                                        }
                                                        if (errorMessages.assunto) {
                                                            setErrorMessages(prev => ({ ...prev, assunto: '' }));
                                                        }
                                                    }}
                                                    style={[styles.input, { width: "100%", height: RFValue(40), marginBottom: RFValue(20), borderRadius: RFValue(10) }]}
                                                    hasError={!!errors.assunto}
                                                    errorText={errors.assunto}
                                                    helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(0) }]}
                                                />
                                            </View>
                                            <View style={{ width: "100%" }}>
                                                <Input
                                                    border={!!errors.mensagem === true ? colors.red : colors.gray}
                                                    autoCapitalize="none"
                                                    disableLabel={true}
                                                    placeholder="Mensagem"
                                                    value={mensagem}
                                                    styleLabel={{ color: !!errors.mensagem === true ? colors.red : colors.white, fontSize: RFValue(16), textAlignVertical: 'top' }}
                                                    contentStyle={{ fontSize: RFValue(16), textAlignVertical: 'top' }}
                                                    outlineColor={!!errors.mensagem === true ? colors.red : 'transparent'}
                                                    onChangeText={v => {
                                                        setMensagem(v);
                                                        if (errors.mensagem) {
                                                            setErrors(prev => ({ ...prev, mensagem: '' }));
                                                        }
                                                        if (errorMessages.mensagem) {
                                                            setErrorMessages(prev => ({ ...prev, mensagem: '' }));
                                                        }
                                                    }}
                                                    style={[styles.input, { width: "100%", height: RFValue(160), marginBottom: RFValue(20), borderRadius: RFValue(10) }]}
                                                    hasError={!!errors.mensagem}
                                                    errorText={errors.mensagem}
                                                    helperStyle={[styles.helperText, { fontSize: RFValue(12), bottom: RFValue(0) }]}
                                                    multiline={true}
                                                    numberOfLines={6}
                                                    textAlignVertical='top'
                                                />
                                            </View>
                                            <View style={{ position: 'relative', width: RFValue(200) }}>
                                                <Button
                                                    children={isLoading ? "ㅤ" : "Enviar"}
                                                    contentStyle={{ paddingVertical: isLoading ? RFValue(4.8) : RFValue(4), backgroundColor: colors.blue[300] }}
                                                    labelStyle={{ fontSize: RFValue(14), color: colors.yellow[200] }}
                                                    style={{
                                                        width: RFValue(200),
                                                        backgroundColor: colors.blue[300],
                                                        borderRadius: RFValue(20)
                                                    }}
                                                    onPress={() => handleRegister()}
                                                    disabled={isLoading}
                                                />
                                                {isLoading && (
                                                    <>
                                                        <View
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                backgroundColor: colors.black,
                                                                borderRadius: RFValue(20),
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                opacity: 0.3,
                                                                width: "100%",
                                                                height: "100%"
                                                            }}
                                                        ></View>
                                                        <View
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                backgroundColor: "transparent",
                                                                borderRadius: RFValue(20),
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                width: "100%",
                                                                height: "100%"
                                                            }}
                                                        >
                                                            <ActivityIndicator size="small" color={colors.white} />
                                                        </View>
                                                    </>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                )}
                                {abaSelecionada === 'faq' && (
                                    <ScrollView style={{ width: "100%", height: RFValue(450), maxHeight: RFValue(450) }}>
                                        {faqData.map((faq) => (
                                            <React.Fragment key={faq.id}>
                                                <TouchableOpacity
                                                    style={{ width: '100%', height: RFValue(50), backgroundColor: colors.blue[400], borderRadius: RFValue(10), flexDirection: 'row', justifyContent: "space-between", alignItems: "center", paddingHorizontal: RFValue(15), marginBottom: openItems[faq.id] ? RFValue(4) : RFValue(20), borderBottomLeftRadius: openItems[faq.id] ? RFValue(0) : RFValue(10), borderBottomRightRadius: openItems[faq.id] ? RFValue(0) : RFValue(10) }}
                                                    onPress={() => toggleItem(faq.id)}
                                                    activeOpacity={1}
                                                >
                                                    <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14), maxWidth: '85%' }}>
                                                        {faq.title}
                                                    </Text>
                                                    <Ionicons name={openItems[faq.id] ? "chevron-up" : "chevron-down"} size={RFValue(26)} color={colors.white} />
                                                </TouchableOpacity>

                                                {openItems[faq.id] && (
                                                    <View style={{ backgroundColor: colors.blue[300], width: '100%', padding: RFValue(10), borderBottomLeftRadius: RFValue(10), borderBottomRightRadius: RFValue(10), marginBottom: RFValue(10) }}>
                                                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder, fontSize: RFValue(14) }}>
                                                            {faq.content}
                                                        </Text>
                                                    </View>
                                                )}
                                            </React.Fragment>
                                        ))}

                                    </ScrollView>
                                )}
                                {abaSelecionada === 'tutorial' && (
                                    <View style={{ width: '100%', height: "auto", backgroundColor: colors.blue[500], alignItems: 'center', justifyContent: 'flex-start', gap: RFValue(40), alignSelf: 'center' }}>
                                        <Text style={{ fontSize: RFValue(14), color: colors.white, fontFamily: fontFamily.inder, textAlign: "center" }}>Se deseja conhecer mais sobre as funcionalidades do aplicativo, pressione o botão abaixo para iniciar o tutorial</Text>

                                        <Button
                                            children={"Iniciar Tutorial"}
                                            contentStyle={{ paddingVertical: RFValue(6), backgroundColor: colors.blue[300] }}
                                            labelStyle={{ fontSize: RFValue(14), color: colors.yellow[200] }}
                                            style={{
                                                width: RFValue(180),
                                                backgroundColor: colors.blue[300],
                                                borderRadius: RFValue(20)
                                            }}
                                            onPress={() => setModalVisible(true)}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    }

                    <Sidebar navigation={navigation} />

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
                            marginBottom: isLandscape ? RFValue(5) : RFValue(50),
                            zIndex: 5000,
                        }}

                    >
                        <Text style={{ color: colors.white, fontFamily: fontFamily.inder }}>{snackbarMessage}</Text>
                    </Snackbar>

                    <OkModal
                        visible={modalVisible}
                        onDismiss={handleCloseModal}
                        changeText={textModal}
                        handleOk={handleOk}
                    />
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