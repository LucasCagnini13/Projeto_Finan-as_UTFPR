import { Pressable, StyleSheet, Text, View } from "react-native";
import { oCores } from "../../theme/cores";
import { valorFormatar } from "../../services/valorFormatar";

function quantidadeFormatar(nQuantidade) {
    const [cInteiro, cDecimal] = String(nQuantidade).split(".");
    const cMilhar = cInteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return cDecimal ? `${cMilhar},${cDecimal}` : cMilhar;
}

export function InvestimentoLista({ mInvestimentos, aoPressionar }) {
    return (
        <View style={estilos.cartao}>
            {mInvestimentos.map((oInvestimento, nIndice) => (
                <View key={oInvestimento.nId}>
                    {nIndice > 0 ? <View style={estilos.divisor} /> : null}
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => aoPressionar(oInvestimento.nId)}
                        style={estilos.linha}
                    >
                        <View style={estilos.textos}>
                            <Text numberOfLines={1} style={estilos.ativo}>{oInvestimento.cAtivo}</Text>
                            <Text numberOfLines={1} style={estilos.subtitulo}>
                                {quantidadeFormatar(oInvestimento.nQuantidade)} un. · {oInvestimento.cInstituicao}
                            </Text>
                            <Text numberOfLines={1} style={estilos.investido}>
                                Investido {valorFormatar(oInvestimento.nValorInvestido)}
                            </Text>
                        </View>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={estilos.atual}>
                            {valorFormatar(oInvestimento.nValorAtual)}
                        </Text>
                    </Pressable>
                </View>
            ))}
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: oCores.cBranco,
        borderRadius: 20,
        paddingHorizontal: 16
    },
    divisor: {
        backgroundColor: oCores.cBorda,
        height: 1
    },
    linha: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        paddingVertical: 14
    },
    textos: {
        flex: 1
    },
    ativo: {
        color: oCores.cTexto,
        fontSize: 16,
        fontWeight: "600"
    },
    subtitulo: {
        color: oCores.cTextoSuave,
        fontSize: 13,
        marginTop: 2
    },
    investido: {
        color: oCores.cTextoSuave,
        fontSize: 13,
        marginTop: 4
    },
    atual: {
        color: oCores.cTexto,
        fontSize: 15,
        fontWeight: "700",
        maxWidth: 140
    }
});
