import { Pressable, StyleSheet, Text } from "react-native";
import { oCores } from "../../theme/cores";

export function BotaoTexto({ cTitulo, aoPressionar, lDestaque }) {
    return (
        <Pressable accessibilityRole="button" onPress={aoPressionar}>
            <Text style={[estilos.texto, lDestaque && estilos.destaque]}>{cTitulo}</Text>
        </Pressable>
    );
}

const estilos = StyleSheet.create({
    texto: {
        color: oCores.cTextoSuave,
        fontSize: 15,
        fontWeight: "500"
    },
    destaque: {
        color: oCores.cPrimaria,
        fontWeight: "700"
    }
});
