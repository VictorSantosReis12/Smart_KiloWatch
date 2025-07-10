import { TextInput as PaperInput, HelperText } from "react-native-paper"
import { StyleProp, ViewStyle, TextStyle, Text, KeyboardTypeOptions, View } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"

import { colors } from "@/styles/colors"

// Fontes
import { useFonts } from 'expo-font'
import {
    Inder_400Regular
} from "@expo-google-fonts/inder"
import {
    KronaOne_400Regular
} from "@expo-google-fonts/krona-one"
import { fontFamily } from "@/styles/FontFamily"

type Props = {
    value: string
    border: string
    onChangeText: (text: string) => void
    placeholder?: string
    label?: string
    outlineColor?: string
    keyboardType?: KeyboardTypeOptions
    styleLabel?: StyleProp<TextStyle>
    contentStyle?: StyleProp<TextStyle>
    secureTextEntry?: boolean
    style?: StyleProp<ViewStyle>
    helperStyle?: StyleProp<TextStyle>
    hasError?: boolean
    errorText?: string
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
    right?: React.ReactNode
}

export function Input({
    value,
    border,
    onChangeText,
    placeholder,
    label,
    outlineColor,
    keyboardType,
    styleLabel,
    contentStyle,
    secureTextEntry = false,
    style,
    helperStyle,
    hasError = false,
    errorText = '',
    right,
    autoCapitalize
}: Props) {
    const [fontsLoaded] = useFonts({
        Inder_400Regular,
        KronaOne_400Regular
    })

    if (!fontsLoaded) {
        return null
    }

    return (
        <View style={{ position: "relative" }}>
            <PaperInput
                mode="outlined"
                autoCapitalize={autoCapitalize}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                label={
                    <Text style={[
                        {
                            color: colors.white,
                            fontFamily: fontFamily.inder,
                            fontSize: RFValue(16)
                        },
                        styleLabel
                    ]}>
                        {label}
                    </Text>
                }
                secureTextEntry={secureTextEntry}
                style={[
                    {
                        fontFamily: fontFamily.inder,
                        borderRadius: RFValue(20),
                        shadowColor: colors.black,
                        shadowOffset: { width: RFValue(0), height: RFValue(3) },
                        shadowOpacity: RFValue(0.8),
                        shadowRadius: RFValue(4.65),
                        elevation: RFValue(4)
                    },
                    style
                ]}
                selectionColor={colors.white}
                outlineColor={outlineColor}
                activeOutlineColor={border}
                keyboardType={keyboardType}
                placeholderTextColor={colors.gray}
                theme={{
                    roundness: RFValue(5),
                    colors: {
                        background: colors.blue[300],
                        text: colors.white,
                        placeholder: colors.white,
                        outline: colors.white
                    },
                    fonts: {
                        regular: { fontFamily: fontFamily.inder }
                    }
                }}
                contentStyle={[
                    {
                        fontSize: RFValue(18),
                        color: colors.white,
                        fontFamily: fontFamily.inder
                    },
                    contentStyle
                ]}
                right={right}
            />

            {hasError && errorText !== '' && (
                <HelperText
                    type="error"
                    visible={true}
                    style={helperStyle}
                >
                    {errorText}
                </HelperText>
            )}
        </View>
    )
}