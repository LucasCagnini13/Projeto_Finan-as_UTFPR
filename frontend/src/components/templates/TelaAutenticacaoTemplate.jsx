import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { oCores } from "../../theme/cores";

export function TelaAutenticacaoTemplate({ children, oRodape }) {
    return (
        <SafeAreaView style={estilos.tela}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={estilos.flex}
            >
                <ScrollView
                    contentContainerStyle={estilos.conteudo}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={estilos.miolo}>{children}</View>
                    {oRodape ? <View style={estilos.rodape}>{oRodape}</View> : null}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    tela: {
        backgroundColor: oCores.cFundo,
        flex: 1
    },
    flex: {
        flex: 1
    },
    conteudo: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingBottom: 28,
        paddingHorizontal: 24,
        paddingTop: 24
    },
    miolo: {
        flex: 1,
        justifyContent: "center"
    },
    rodape: {
        alignItems: "center",
        flexDirection: "row",
        gap: 6,
        justifyContent: "center",
        marginTop: 24
    }
});
