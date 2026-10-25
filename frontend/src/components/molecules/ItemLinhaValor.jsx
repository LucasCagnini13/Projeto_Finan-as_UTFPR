import { Pressable, StyleSheet, Text, View } from "react-native";
import { oCores } from "../../theme/cores";
import { valorFormatar } from "../../services/valorFormatar";

export function ItemLinhaValor({ cTitulo, cSubtitulo, nValor, lEntrada, aoPressionar }) {
    return (
        <Pressable accessibilityRole="button" onPress={aoPressionar} style={estilos.linha}>
            <View style={estilos.textos}>
                <Text numberOfLines={1} style={estilos.titulo}>{cTitulo}</Text>
                {cSubtitulo ? <Text numberOfLines={1} style={estilos.subtitulo}>{cSubtitulo}</Text> : null}
            </View>
            <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[estilos.valor, { color: lEntrada ? oCores.cEntrada : oCores.cSaida }]}
            >
                {lEntrada ? "+" : "-"} {valorFormatar(nValor)}
            </Text>
        </Pressable>
    );
}

const estilos = StyleSheet.create({
    linha: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        paddingVertical: 14
    },
    textos: {
        flex: 1
    },
    titulo: {
        color: oCores.cTexto,
        fontSize: 16,
        fontWeight: "600"
    },
    subtitulo: {
        color: oCores.cTextoSuave,
        fontSize: 13,
        marginTop: 2
    },
    valor: {
        fontSize: 15,
        fontWeight: "700",
        maxWidth: 150
    }
});
