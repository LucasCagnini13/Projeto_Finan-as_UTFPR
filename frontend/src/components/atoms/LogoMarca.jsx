import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { oCores } from "../../theme/cores";

export function LogoMarca() {
    return (
        <View style={estilos.caixa}>
            <Ionicons color={oCores.cPrimaria} name="sparkles" size={32} />
        </View>
    );
}

const estilos = StyleSheet.create({
    caixa: {
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: oCores.cPrimariaSuave,
        borderRadius: 22,
        height: 76,
        justifyContent: "center",
        width: 76
    }
});
