import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { RFValue } from 'react-native-responsive-fontsize';

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
import { colors } from '@/styles/colors';

interface LineChartProps {
    labels: string[];
    valores: number[];
    cor: string;
    corSecundaria: string;
    tamanho: 'pequeno' | 'grande';
}

const GraficoLinhaModel: React.FC<LineChartProps> = ({
    labels,
    valores,
    cor,
    corSecundaria,
    tamanho
}) => {
    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const alturaCalculada = height * 0.82;

    return (
        <View style={styles.container}>
            {isLandscape ?
                <LineChart
                    data={{
                        labels,
                        datasets: [
                            {
                                data: valores,
                                color: () => cor,
                                strokeWidth: RFValue(1),
                            },
                        ],
                    }}
                    width={tamanho === 'pequeno' ? RFValue(100) : RFValue(200)}
                    height={tamanho === 'pequeno' ? RFValue(50) : RFValue(100)}
                    yAxisSuffix=""
                    yAxisInterval={1}
                    fromZero={false}
                    withInnerLines={false}
                    withOuterLines={true}
                    withDots={true}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    segments={4}
                    chartConfig={{
                        backgroundGradientFrom: 'transparent',
                        backgroundGradientFromOpacity: 0,
                        backgroundGradientTo: 'transparent',
                        backgroundGradientToOpacity: 0,
                        fillShadowGradientFrom: 'transparent',
                        fillShadowGradientFromOpacity: 0,
                        fillShadowGradientTo: 'transparent',
                        fillShadowGradientToOpacity: 0,
                        decimalPlaces: 0,
                        color: () => corSecundaria,
                        labelColor: () => colors.white,
                        propsForDots: {
                            r: '5',
                            strokeWidth: '0',
                            stroke: "transparent",
                            fill: corSecundaria,
                        },
                        propsForBackgroundLines: {
                            stroke: colors.white,
                            strokeDasharray: '',
                        },
                        propsForLabels: {
                            fontFamily: fontFamily.inder,
                            fontSize: RFValue(5)
                        },
                    }}
                    style={{
                        backgroundColor: "transparent",
                        justifyContent: "center",
                        width: RFValue(115),
                        marginVertical: 0,
                        marginHorizontal: 0,
                        paddingBottom: RFValue(6),
                        paddingHorizontal: 0,
                    }}
                />
                :
                <LineChart
                    data={{
                        labels,
                        datasets: [
                            {
                                data: valores,
                                color: () => cor,
                                strokeWidth: RFValue(1),
                            },
                        ],
                    }}
                    width={tamanho === 'pequeno' ? RFValue(145) : RFValue(200)}
                    height={tamanho === 'pequeno' ? RFValue(80) : RFValue(100)}
                    yAxisSuffix=""
                    yAxisInterval={1}
                    fromZero={false}
                    withInnerLines={false}
                    withOuterLines={true}
                    withDots={true}
                    withVerticalLabels={true}
                    withHorizontalLabels={true}
                    segments={4}
                    chartConfig={{
                        backgroundGradientFrom: 'transparent',
                        backgroundGradientFromOpacity: 0,
                        backgroundGradientTo: 'transparent',
                        backgroundGradientToOpacity: 0,
                        fillShadowGradientFrom: 'transparent',
                        fillShadowGradientFromOpacity: 0,
                        fillShadowGradientTo: 'transparent',
                        fillShadowGradientToOpacity: 0,
                        decimalPlaces: 0,
                        color: () => corSecundaria,
                        labelColor: () => colors.white,
                        propsForDots: {
                            r: '4',
                            strokeWidth: '0',
                            stroke: "transparent",
                            fill: corSecundaria,
                        },
                        propsForBackgroundLines: {
                            stroke: colors.white,
                            strokeDasharray: '',
                        },
                        propsForLabels: {
                            fontFamily: fontFamily.inder,
                            fontSize: RFValue(8)
                        },
                    }}
                    style={{
                        backgroundColor: "transparent",
                        justifyContent: "center",
                        width: RFValue(170),
                        marginVertical: 0,
                        marginHorizontal: 0,
                        paddingBottom: RFValue(14),
                        paddingHorizontal: 0,
                        marginLeft: -RFValue(15),
                    }}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: "transparent",
    },
});

export default GraficoLinhaModel;