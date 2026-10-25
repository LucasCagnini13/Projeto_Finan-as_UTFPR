import { StyleSheet, Text } from "react-native";
import { oCores } from "../../theme/cores";

export function TextoTitulo({ cTitulo }) {
    return <Text style={estilos.titulo}>{cTitulo}</Text>;
}

const estilos = StyleSheet.create({
    titulo: {
        color: oCores.cTexto,
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center"
    }
});
