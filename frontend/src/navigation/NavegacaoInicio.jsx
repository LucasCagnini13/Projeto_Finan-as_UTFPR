import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InicioScreen } from "../screens/inicio/InicioScreen";
import { PagamentoListarScreen } from "../screens/inicio/PagamentoListarScreen";
import { PagamentoDetalheScreen } from "../screens/inicio/PagamentoDetalheScreen";
import { PagamentoCriarScreen } from "../screens/inicio/PagamentoCriarScreen";
import { oCores } from "../theme/cores";

const Stack = createNativeStackNavigator();

export function NavegacaoInicio() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: oCores.cPrimaria,
                headerTitleStyle: { color: oCores.cTexto },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: oCores.cFundoSuave }
            }}
        >
            <Stack.Screen name="InicioHome" component={InicioScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PagamentoListar" component={PagamentoListarScreen} options={{ title: "Pagamentos" }} />
            <Stack.Screen name="PagamentoDetalhe" component={PagamentoDetalheScreen} options={{ title: "Pagamento" }} />
            <Stack.Screen name="PagamentoCriar" component={PagamentoCriarScreen} options={{ title: "Nova conta" }} />
        </Stack.Navigator>
    );
}
