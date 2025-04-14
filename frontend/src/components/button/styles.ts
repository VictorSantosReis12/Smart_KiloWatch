import { StyleSheet } from "react-native"
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

import { colors } from "@/styles/colors"
import { fontFamily } from "@/styles/FontFamily"

export const styles = StyleSheet.create ({
    button: {
        width: width * 0.777,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.blue[300],
        paddingHorizontal: 49,
        paddingVertical: 15,
        borderRadius: 20
    },
    title: {
        fontSize: 18,
        fontFamily: fontFamily.krona,
        color: colors.yellow[200]
    }
})