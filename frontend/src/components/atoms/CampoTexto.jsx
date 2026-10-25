import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { oCores } from "../../theme/cores";

export function CampoTexto({
    cValor,
    cPlaceholder,
    aoAlterar,
    lSenha,
    lSenhaVisivel,
    aoAlternarSenha,
    lDesabilitado,
    cTipoTeclado,
    cAutoCapitalize
}) {
    return (
        <View style={estilos.caixa}>
            <TextInput
                autoCapitalize={cAutoCapitalize || "none"}
                autoCorrect={false}
                editable={!lDesabilitado}
                keyboardType={cTipoTeclado || "default"}
                onChangeText={aoAlterar}
                placeholder={cPlaceholder}
                placeholderTextColor={oCores.cTextoSuave}
                secureTextEntry={lSenha && !lSenhaVisivel}
                style={estilos.campo}
                value={cValor}
            />
            {lSenha ? (
                <Pressable accessibilityRole="button" onPress={aoAlternarSenha} style={estilos.olho}>
                    <Ionicons
                        color={oCores.cTextoSuave}
                        name={lSenhaVisivel ? "eye-off-outline" : "eye-outline"}
                        size={22}
                    />
                </Pressable>
            ) : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    caixa: {
        alignItems: "center",
        backgroundColor: oCores.cCampo,
        borderRadius: 16,
        flexDirection: "row",
        height: 56,
        paddingHorizontal: 16
    },
    campo: {
        color: oCores.cTexto,
        flex: 1,
        fontSize: 16
    },
    olho: {
        marginLeft: 8
    }
});
