import { StyleSheet, Text, View } from "react-native";
import { oCores } from "../../theme/cores";

export function AvatarUsuario({ cNome, nTamanho = 48 }) {
    const cInicial = (cNome || "?").trim().charAt(0).toUpperCase();

    return (
        <View style={[estilos.caixa, { borderRadius: nTamanho / 2, height: nTamanho, width: nTamanho }]}>
            <Text style={[estilos.inicial, { fontSize: Math.round(nTamanho * 0.38) }]}>{cInicial}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    caixa: {
        alignItems: "center",
        backgroundColor: oCores.cPrimariaSuave,
        justifyContent: "center"
    },
    inicial: {
        color: oCores.cPrimaria,
        fontWeight: "700"
    }
});
