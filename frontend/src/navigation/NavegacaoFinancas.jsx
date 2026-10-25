import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FinancaListarScreen } from "../screens/financas/FinancaListarScreen";
import { LancamentoCriarScreen } from "../screens/financas/LancamentoCriarScreen";
import { LancamentoDetalheScreen } from "../screens/financas/LancamentoDetalheScreen";
import { CategoriaListarScreen } from "../screens/financas/CategoriaListarScreen";
import { RendaListarScreen } from "../screens/financas/RendaListarScreen";
import { PagamentoCriarScreen } from "../screens/inicio/PagamentoCriarScreen";
import { PagamentoDetalheScreen } from "../screens/inicio/PagamentoDetalheScreen";
import { PagamentoListarScreen } from "../screens/inicio/PagamentoListarScreen";
import { oCores } from "../theme/cores";

const Stack = createNativeStackNavigator();

export function NavegacaoFinancas() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: oCores.cPrimaria,
                headerTitleStyle: { color: oCores.cTexto },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: oCores.cFundoSuave }
            }}
        >
            <Stack.Screen name="FinancaListar" component={FinancaListarScreen} options={{ title: "Finanças" }} />
            <Stack.Screen
                name="LancamentoCriar"
                component={LancamentoCriarScreen}
                options={({ route }) => ({
                    title: route.params?.nLancamentoId
                        ? "Editar lançamento"
                        : route.params?.lEntrada === false
                            ? "Transferir"
                            : "Novo lançamento"
                })}
            />
            <Stack.Screen name="LancamentoDetalhe" component={LancamentoDetalheScreen} options={{ title: "Lançamento" }} />
            <Stack.Screen name="CategoriaListar" component={CategoriaListarScreen} options={{ title: "Categorias" }} />
            <Stack.Screen name="RendaListar" component={RendaListarScreen} options={{ title: "Rendas" }} />
            <Stack.Screen name="PagamentoListar" component={PagamentoListarScreen} options={{ title: "Pagamentos" }} />
            <Stack.Screen name="PagamentoDetalhe" component={PagamentoDetalheScreen} options={{ title: "Pagamento" }} />
            <Stack.Screen name="PagamentoCriar" component={PagamentoCriarScreen} options={{ title: "Nova conta" }} />
        </Stack.Navigator>
    );
}
