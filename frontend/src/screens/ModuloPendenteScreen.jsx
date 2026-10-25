import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EstadoVazio } from "../components/atoms/EstadoVazio";
import { oCores } from "../theme/cores";

export function ModuloPendenteScreen({ route }) {
    const cTitulo = route.params?.cTitulo || "Em breve";

    return (
        <SafeAreaView style={estilos.tela}>
            <View style={estilos.conteudo}>
                <EstadoVazio
                    cTitulo={cTitulo}
                    cDescricao="Esta área entra no próximo recorte. O login e o cadastro já estão disponíveis."
                />
            </View>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    tela: {
        backgroundColor: oCores.cFundo,
        flex: 1
    },
    conteudo: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    }
});
