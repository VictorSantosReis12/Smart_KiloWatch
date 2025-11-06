import { Button as PaperButton, ButtonProps } from "react-native-paper"
import { StyleProp, ViewStyle, Text } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"

import { colors } from "@/styles/colors"
import { fontFamily } from "@/styles/FontFamily"

type Props = ButtonProps & {
    children: React.ReactNode
    onPress: () => void
    style?: StyleProp<ViewStyle>
    contentStyle?: StyleProp<ViewStyle>
    disabled?: boolean
}

export function Button({ children, onPress, style, contentStyle, labelStyle, disabled, ...rest }: Props) {
    return (
        <PaperButton
            {...rest}
            mode="contained"
            onPress={onPress}
            elevation={2}
            contentStyle={[
                {
                    paddingVertical: RFValue(6),
                    backgroundColor: colors.blue[300],
                    shadowColor: colors.black,
                    shadowOffset: { width: RFValue(0), height: RFValue(3) },
                    shadowOpacity: 0.2,
                    shadowRadius: RFValue(4.65)
                },
                contentStyle
            ]}
            disabled={disabled}
            labelStyle={[
                {
                    fontSize: RFValue(18),
                    fontFamily: fontFamily.krona,
                    color: colors.yellow[200]
                },
                labelStyle
            ]}
            style={[
                {
                    shadowColor: colors.black,
                    shadowOffset: { width: RFValue(0), height: RFValue(3) },
                    shadowOpacity: 0.2,
                    shadowRadius: RFValue(4.65)
                },
                style
            ]}
        >
            {children}
        </PaperButton>
    )
}