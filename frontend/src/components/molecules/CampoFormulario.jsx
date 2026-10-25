import { StyleSheet, Text, View } from "react-native";
import { CampoTexto } from "../atoms/CampoTexto";
import { oCores } from "../../theme/cores";

export function CampoFormulario({ cRotulo, cErro, ...oCampo }) {
    return (
        <View style={estilos.bloco}>
            <Text style={estilos.rotulo}>{cRotulo}</Text>
            <CampoTexto {...oCampo} />
            {cErro ? <Text style={estilos.erro}>{cErro}</Text> : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    bloco: {
        marginBottom: 16
    },
    rotulo: {
        color: oCores.cTexto,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8
    },
    erro: {
        color: oCores.cErro,
        fontSize: 13,
        marginTop: 6
    }
});
