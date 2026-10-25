import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { oCores } from "../../theme/cores";

export function BotaoPrimario({ cTitulo, lDesabilitado, lCarregando, aoPressionar }) {
    const lBloqueado = lDesabilitado || lCarregando;

    return (
        <Pressable
            accessibilityRole="button"
            disabled={lBloqueado}
            onPress={aoPressionar}
            style={({ pressed }) => [
                estilos.botao,
                lBloqueado && estilos.desabilitado,
                pressed && !lBloqueado && estilos.pressionado
            ]}
        >
            {lCarregando ? (
                <ActivityIndicator color={oCores.cBranco} />
            ) : (
                <Text style={estilos.texto}>{cTitulo}</Text>
            )}
        </Pressable>
    );
}

const estilos = StyleSheet.create({
    botao: {
        alignItems: "center",
        backgroundColor: oCores.cPrimaria,
        borderRadius: 18,
        elevation: 6,
        height: 56,
        justifyContent: "center",
        shadowColor: oCores.cPrimaria,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 12
    },
    desabilitado: {
        opacity: 0.7
    },
    pressionado: {
        opacity: 0.9
    },
    texto: {
        color: oCores.cBranco,
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.6
    }
});
