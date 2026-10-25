import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { oCores } from "../../theme/cores";
import { valorFormatar } from "../../services/valorFormatar";

const nCentro = 58;
const nRaio = 40;
const nCircunferencia = 2 * Math.PI * nRaio;

export function GraficoCategoria({ mCategorias, nTotal }) {
    let nAcumulado = 0;

    return (
        <View style={estilos.cartao}>
            <View style={estilos.linha}>
                <View style={estilos.grafico}>
                    <Svg height="116" width="116">
                        <Circle
                            cx={nCentro}
                            cy={nCentro}
                            fill="none"
                            r={nRaio}
                            stroke={oCores.cFundoSuave}
                            strokeWidth="14"
                        />
                        {mCategorias.map((oCategoria) => {
                            const nComprimento = (oCategoria.nPercentual / 100) * nCircunferencia;
                            const nRotacao = (nAcumulado / 100) * 360 - 90;
                            nAcumulado += oCategoria.nPercentual;

                            return (
                                <G key={oCategoria.nId} origin={`${nCentro}, ${nCentro}`} rotation={nRotacao}>
                                    <Circle
                                        cx={nCentro}
                                        cy={nCentro}
                                        fill="none"
                                        r={nRaio}
                                        stroke={oCategoria.cCor}
                                        strokeDasharray={`${nComprimento} ${nCircunferencia - nComprimento}`}
                                        strokeWidth="14"
                                    />
                                </G>
                            );
                        })}
                    </Svg>
                    <View style={estilos.centro}>
                        <Text style={estilos.totalRotulo}>Total</Text>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={estilos.totalValor}>
                            {valorFormatar(nTotal)}
                        </Text>
                    </View>
                </View>
                <View style={estilos.legenda}>
                    {mCategorias.map((oCategoria) => (
                        <View key={oCategoria.nId} style={estilos.item}>
                            <View style={[estilos.ponto, { backgroundColor: oCategoria.cCor }]} />
                            <Text numberOfLines={1} style={estilos.nome}>
                                {oCategoria.cNome} ({oCategoria.nPercentual}%)
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: oCores.cBranco,
        borderRadius: 20,
        padding: 16
    },
    linha: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12
    },
    grafico: {
        alignItems: "center",
        height: 116,
        justifyContent: "center",
        width: 116
    },
    centro: {
        alignItems: "center",
        position: "absolute",
        width: 70
    },
    totalRotulo: {
        color: oCores.cTextoSuave,
        fontSize: 12
    },
    totalValor: {
        color: oCores.cTexto,
        fontSize: 12,
        fontWeight: "700"
    },
    legenda: {
        flex: 1,
        gap: 12
    },
    item: {
        alignItems: "center",
        flexDirection: "row",
        gap: 8
    },
    ponto: {
        borderRadius: 5,
        height: 10,
        width: 10
    },
    nome: {
        color: oCores.cTexto,
        flex: 1,
        fontSize: 14
    }
});
