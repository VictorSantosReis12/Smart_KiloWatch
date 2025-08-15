import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { RFValue } from 'react-native-responsive-fontsize';

import Icon from '@expo/vector-icons/MaterialCommunityIcons';

// Cores
import { colors } from "@/styles/colors"

interface DoughnutChartProps {
    consumo: number;
    meta: number;
    cor?: string;
    tipo: 'agua' | 'energia';
    tamanho: 'pequeno' | 'grande';
}

const GraficoDonutModel: React.FC<DoughnutChartProps> = ({
    consumo,
    meta,
    cor,
    tipo,
    tamanho
}) => {
    // Dimensões da janela
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const alturaCalculada = height * 0.82;

    const restante = meta - consumo > 0 ? meta - consumo : 0;

    const isZerado = consumo === 0 && meta === 0;

    const data = isZerado
        ? [
            {
                name: 'Vazio',
                population: 1,
                color: colors.white,
                legendFontColor: '#7F7F7F',
                legendFontSize: RFValue(12),
            },
        ]
        : [
            {
                name: 'Consumido',
                population: consumo,
                color: cor,
                legendFontColor: '#7F7F7F',
                legendFontSize: RFValue(12),
            },
            {
                name: 'Restante',
                population: restante,
                color: '#eee',
                legendFontColor: '#7F7F7F',
                legendFontSize: RFValue(12),
            },
        ];

    return (
        <View style={styles.container}>
            {isLandscape ?
                <>
                    <PieChart
                        data={data}
                        width={tamanho === 'pequeno' ? RFValue(65) : RFValue(150)}
                        height={tamanho === 'pequeno' ? RFValue(65) : RFValue(150)}
                        chartConfig={{
                            backgroundGradientFrom: 'transparent',
                            backgroundGradientTo: 'transparent',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="0"
                        center={[RFValue(16.5), RFValue(0)]}
                        hasLegend={false}
                        absolute
                    />
                    <View style={{ width: RFValue(35), height: RFValue(35), borderRadius: "50%", backgroundColor: colors.blue[300], justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                        {tipo === 'agua' ? (
                            <Icon name="water" size={RFValue(20)} color={colors.white} />
                        ) : (
                            <Icon name="lightning-bolt" size={RFValue(20)} color={colors.white} />
                        )}
                    </View>
                </>
                :
                <>
                    <PieChart
                        data={data}
                        width={tamanho === 'pequeno' ? RFValue(110) : RFValue(150)}
                        height={tamanho === 'pequeno' ? RFValue(110) : RFValue(150)}
                        chartConfig={{
                            backgroundGradientFrom: 'transparent',
                            backgroundGradientTo: 'transparent',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="0"
                        center={[RFValue(27), RFValue(0)]}
                        hasLegend={false}
                        absolute
                    />
                    <View style={{ width: RFValue(60), height: RFValue(60), borderRadius: "50%", backgroundColor: colors.blue[300], justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                        {tipo === 'agua' ? (
                            <Icon name="water" size={RFValue(30)} color={colors.white} />
                        ) : (
                            <Icon name="lightning-bolt" size={RFValue(30)} color={colors.white} />
                        )}
                    </View>
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});

export default GraficoDonutModel;