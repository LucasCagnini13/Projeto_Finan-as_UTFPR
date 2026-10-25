import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { oCores } from "../../theme/cores";

export function EstadoCarregando({ cTitulo }) {
    return (
        <View style={estilos.caixa}>
            <ActivityIndicator color={oCores.cPrimaria} />
            {cTitulo ? <Text style={estilos.titulo}>{cTitulo}</Text> : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    caixa: {
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 24,
        paddingVertical: 20
    },
    titulo: {
        color: oCores.cTextoSuave,
        fontSize: 14,
        textAlign: "center"
    }
});
