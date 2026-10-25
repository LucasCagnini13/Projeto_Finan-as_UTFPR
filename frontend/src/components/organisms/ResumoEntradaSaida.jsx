import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { oCores } from "../../theme/cores";
import { valorFormatar } from "../../services/valorFormatar";

function CartaoValor({ cTitulo, nValor, cIcone, cCor }) {
    return (
        <View style={estilos.cartao}>
            <View style={estilos.topo}>
                <Ionicons color={cCor} name={cIcone} size={18} />
                <Text style={estilos.titulo}>{cTitulo}</Text>
            </View>
            <Text adjustsFontSizeToFit numberOfLines={1} style={[estilos.valor, { color: cCor }]}>
                {valorFormatar(nValor)}
            </Text>
        </View>
    );
}

export function ResumoEntradaSaida({ nEntradas, nSaidas }) {
    return (
        <View style={estilos.linha}>
            <CartaoValor cTitulo="Entradas" nValor={nEntradas} cIcone="arrow-up-outline" cCor={oCores.cEntrada} />
            <CartaoValor cTitulo="Saídas" nValor={nSaidas} cIcone="arrow-down-outline" cCor={oCores.cSaida} />
        </View>
    );
}

const estilos = StyleSheet.create({
    linha: {
        flexDirection: "row",
        gap: 12
    },
    cartao: {
        backgroundColor: oCores.cBranco,
        borderRadius: 20,
        flex: 1,
        padding: 16
    },
    topo: {
        alignItems: "center",
        flexDirection: "row",
        gap: 6
    },
    titulo: {
        color: oCores.cTexto,
        fontSize: 14,
        fontWeight: "600"
    },
    valor: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 16
    }
});
