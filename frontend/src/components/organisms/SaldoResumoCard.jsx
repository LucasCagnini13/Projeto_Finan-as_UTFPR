import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { oCores } from "../../theme/cores";
import { valorFormatar } from "../../services/valorFormatar";

export function SaldoResumoCard({ nSaldo, cAtualizado, aoTransferir, aoHistorico }) {
    const [lVisivel, setLVisivel] = useState(true);

    return (
        <View style={estilos.cartao}>
            <View style={estilos.topo}>
                <Text style={estilos.rotulo}>Saldo disponível</Text>
                <Pressable accessibilityRole="button" onPress={() => setLVisivel((lAtual) => !lAtual)}>
                    <Ionicons color={oCores.cBranco} name={lVisivel ? "eye-outline" : "eye-off-outline"} size={22} />
                </Pressable>
            </View>
            <Text adjustsFontSizeToFit numberOfLines={1} style={estilos.valor}>
                {lVisivel ? valorFormatar(nSaldo) : "R$ ••••••"}
            </Text>
            <Text style={estilos.atualizado}>{cAtualizado}</Text>
            <View style={estilos.acoes}>
                <Pressable accessibilityRole="button" onPress={aoTransferir} style={estilos.acao}>
                    <Text style={estilos.acaoTexto}>+ Transferir</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={aoHistorico} style={estilos.acao}>
                    <Text style={estilos.acaoTexto}>Histórico</Text>
                </Pressable>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: oCores.cPrimaria,
        borderRadius: 24,
        padding: 22
    },
    topo: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    rotulo: {
        color: "rgba(255,255,255,0.85)",
        fontSize: 14,
        fontWeight: "600"
    },
    valor: {
        color: oCores.cBranco,
        fontSize: 34,
        fontWeight: "700",
        marginTop: 14
    },
    atualizado: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 13,
        marginTop: 6
    },
    acoes: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20
    },
    acao: {
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.16)",
        borderRadius: 16,
        flex: 1,
        paddingVertical: 12
    },
    acaoTexto: {
        color: oCores.cBranco,
        fontSize: 14,
        fontWeight: "700"
    }
});
