import { StyleSheet, View } from "react-native";
import { ItemLinhaValor } from "../molecules/ItemLinhaValor";
import { dataExibir } from "../../services/transacaoService";
import { oCores } from "../../theme/cores";

export function TransacaoLista({ mTransacoes, aoPressionar }) {
    return (
        <View style={estilos.cartao}>
            {mTransacoes.map((oTransacao, nIndice) => (
                <View key={oTransacao.nId}>
                    {nIndice > 0 ? <View style={estilos.divisor} /> : null}
                    <ItemLinhaValor
                        cTitulo={oTransacao.cDescricao}
                        cSubtitulo={`${dataExibir(oTransacao.cData)} · ${oTransacao.cCategoria || "Sem categoria"}${oTransacao.lSomenteExibicao ? " · fora do saldo" : ""}`}
                        nValor={oTransacao.nValor}
                        lEntrada={oTransacao.lEntrada}
                        aoPressionar={() => aoPressionar(oTransacao.nId)}
                    />
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
    }
});
