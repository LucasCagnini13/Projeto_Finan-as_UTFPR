import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PerfilEditarScreen } from "../screens/perfil/PerfilEditarScreen";
import { PerfilScreen } from "../screens/perfil/PerfilScreen";
import { oCores } from "../theme/cores";

const Stack = createNativeStackNavigator();

export function NavegacaoPerfil() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: oCores.cPrimaria,
                headerTitleStyle: { color: oCores.cTexto },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: oCores.cFundoSuave }
            }}
        >
            <Stack.Screen name="PerfilVer" component={PerfilScreen} options={{ title: "Perfil" }} />
            <Stack.Screen name="PerfilEditar" component={PerfilEditarScreen} options={{ title: "Editar perfil" }} />
        </Stack.Navigator>
    );
}
