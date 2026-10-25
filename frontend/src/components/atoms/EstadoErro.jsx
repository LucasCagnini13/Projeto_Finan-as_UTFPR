import { Pressable, StyleSheet, Text, View } from "react-native";
import { oCores } from "../../theme/cores";

export function EstadoErro({ cTitulo, cDescricao, aoTentarNovamente }) {
    return (
        <View style={estilos.caixa}>
            <Text style={estilos.titulo}>{cTitulo}</Text>
            {cDescricao ? <Text style={estilos.descricao}>{cDescricao}</Text> : null}
            {aoTentarNovamente ? (
                <Pressable accessibilityRole="button" onPress={aoTentarNovamente} style={estilos.botao}>
                    <Text style={estilos.botaoTexto}>Tentar de novo</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    caixa: {
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16
    },
    titulo: {
        color: oCores.cTexto,
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center"
    },
    descricao: {
        color: oCores.cTextoSuave,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 6,
        textAlign: "center"
    },
    botao: {
        marginTop: 12
    },
    botaoTexto: {
        color: oCores.cPrimaria,
        fontSize: 15,
        fontWeight: "700"
    }
});
