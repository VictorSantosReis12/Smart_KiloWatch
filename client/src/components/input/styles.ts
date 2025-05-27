import { StyleSheet } from "react-native"

import { colors } from "@/styles/colors"
import { fontFamily } from "@/styles/FontFamily"

export const styles = StyleSheet.create ({
    input: {
        width: "100%",
        height: 52,
        borderRadius: 5,
        backgroundColor: colors.blue[300],
        padding: 12,
        fontSize: 16,
        color: colors.white
    }
})