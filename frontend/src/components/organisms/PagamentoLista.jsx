import { StyleSheet, View } from "react-native";
import { ItemPagamento } from "../molecules/ItemPagamento";
import { oCores } from "../../theme/cores";

export function PagamentoLista({ mPagamentos, aoPressionar }) {
    return (
        <View style={estilos.cartao}>
            {mPagamentos.map((oPagamento, nIndice) => (
                <View key={oPagamento.nId}>
                    {nIndice > 0 ? <View style={estilos.divisor} /> : null}
                    <ItemPagamento oPagamento={oPagamento} aoPressionar={aoPressionar} />
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
