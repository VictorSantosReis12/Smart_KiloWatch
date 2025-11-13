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

    let consumoExcedeu;
    let consumoQuaseExcedendo

    if (meta !== 0) {
        consumoExcedeu = consumo > meta;

        consumoQuaseExcedendo = false;

        if (!consumoExcedeu) {
            consumoQuaseExcedendo = consumo >= meta * 0.85;
        } else {
            consumoQuaseExcedendo = false;
        }
    }

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
                        center={[tamanho === 'pequeno' ? RFValue(16.5) : RFValue(37.5), RFValue(0)]}
                        hasLegend={false}
                        absolute
                    />
                    <View style={{ width: tamanho === 'pequeno' ? RFValue(35) : RFValue(85), height: tamanho === 'pequeno' ? RFValue(35) : RFValue(85), borderRadius: "50%", backgroundColor: tamanho === 'pequeno' ? colors.blue[300] : colors.blue[400], justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                        {tipo === 'agua' ? (
                            <Icon name="water" size={tamanho === 'pequeno' ? RFValue(20) : RFValue(45)} color={colors.white} />
                        ) : (
                            <Icon name="lightning-bolt" size={tamanho === 'pequeno' ? RFValue(20) : RFValue(45)} color={colors.white} />
                        )}
                    </View>
                    {consumoExcedeu && (
                        <View style={{ position: 'absolute', bottom: RFValue(10), right: RFValue(2) }}>
                            <Icon name="alert-rhombus" size={tamanho === 'pequeno' ? RFValue(10) : RFValue(30)} color={colors.red} />
                        </View>
                    )}
                    {consumoQuaseExcedendo && (
                        <View style={{ position: 'absolute', bottom: RFValue(10), right: RFValue(2) }}>
                            <Icon name="alert-rhombus" size={tamanho === 'pequeno' ? RFValue(10) : RFValue(30)} color={colors.yellow[300]} />
                        </View>
                    )}
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
                        center={[tamanho === 'pequeno' ? RFValue(27) : RFValue(37.5), RFValue(0)]}
                        hasLegend={false}
                        absolute
                    />
                    <View style={{ width: tamanho === 'pequeno' ? RFValue(60) : RFValue(85), height: tamanho === 'pequeno' ? RFValue(60) : RFValue(85), borderRadius: "50%", backgroundColor: tamanho === 'pequeno' ? colors.blue[300] : colors.blue[400], justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                        {tipo === 'agua' ? (
                            <Icon name="water" size={tamanho === 'pequeno' ? RFValue(30) : RFValue(45)} color={colors.white} />
                        ) : (
                            <Icon name="lightning-bolt" size={tamanho === 'pequeno' ? RFValue(30) : RFValue(45)} color={colors.white} />
                        )}
                    </View>
                    {consumoExcedeu && (
                        <View style={{ position: 'absolute', bottom: RFValue(10), right: RFValue(2) }}>
                            <Icon name="alert-rhombus" size={tamanho === 'pequeno' ? RFValue(20) : RFValue(30)} color={colors.red} />
                        </View>
                    )}
                    {consumoQuaseExcedendo && (
                        <View style={{ position: 'absolute', bottom: RFValue(10), right: RFValue(2) }}>
                            <Icon name="alert-rhombus" size={tamanho === 'pequeno' ? RFValue(20) : RFValue(30)} color={colors.yellow[300]} />
                        </View>
                    )}
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