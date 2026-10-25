import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { oCores } from "../../theme/cores";
import { dataVencimentoExibir } from "../../services/transacaoService";
import { valorFormatar } from "../../services/valorFormatar";

export function ItemPagamento({ oPagamento, aoPressionar }) {
    return (
        <Pressable accessibilityRole="button" onPress={() => aoPressionar(oPagamento.nId)} style={estilos.linha}>
            <View style={estilos.icone}>
                <Ionicons color={oCores.cPrimaria} name={oPagamento.cIcone || "receipt-outline"} size={20} />
            </View>
            <View style={estilos.textos}>
                <Text numberOfLines={1} style={estilos.descricao}>{oPagamento.cDescricao}</Text>
                <Text numberOfLines={1} style={estilos.vencimento}>{dataVencimentoExibir(oPagamento.cVencimento)}</Text>
            </View>
            <Text adjustsFontSizeToFit numberOfLines={1} style={estilos.valor}>
                {valorFormatar(oPagamento.nValor)}
            </Text>
        </Pressable>
    );
}

const estilos = StyleSheet.create({
    linha: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        paddingVertical: 12
    },
    icone: {
        alignItems: "center",
        backgroundColor: oCores.cFundoSuave,
        borderRadius: 16,
        height: 40,
        justifyContent: "center",
        width: 40
    },
    textos: {
        flex: 1
    },
    descricao: {
        color: oCores.cTexto,
        fontSize: 16,
        fontWeight: "600"
    },
    vencimento: {
        color: oCores.cTextoSuave,
        fontSize: 13,
        marginTop: 2
    },
    valor: {
        color: oCores.cSaida,
        fontSize: 15,
        fontWeight: "700",
        maxWidth: 120
    }
});
