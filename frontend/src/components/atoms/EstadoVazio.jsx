import { StyleSheet, Text, View } from "react-native";
import { oCores } from "../../theme/cores";

export function EstadoVazio({ cTitulo, cDescricao }) {
    return (
        <View style={estilos.caixa}>
            <Text style={estilos.titulo}>{cTitulo}</Text>
            {cDescricao ? <Text style={estilos.descricao}>{cDescricao}</Text> : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    caixa: {
        alignItems: "center",
        paddingHorizontal: 24
    },
    titulo: {
        color: oCores.cTexto,
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center"
    },
    descricao: {
        color: oCores.cTextoSuave,
        fontSize: 15,
        lineHeight: 22,
        marginTop: 8,
        textAlign: "center"
    }
});
