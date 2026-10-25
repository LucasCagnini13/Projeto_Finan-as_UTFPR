import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InvestimentoDetalheScreen } from "../screens/investimento/InvestimentoDetalheScreen";
import { InvestimentoListarScreen } from "../screens/investimento/InvestimentoListarScreen";
import { oCores } from "../theme/cores";

const Stack = createNativeStackNavigator();

export function NavegacaoInvestimentos() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: oCores.cPrimaria,
                headerTitleStyle: { color: oCores.cTexto },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: oCores.cFundoSuave }
            }}
        >
            <Stack.Screen name="InvestimentoListar" component={InvestimentoListarScreen} options={{ title: "Investimentos" }} />
            <Stack.Screen name="InvestimentoDetalhe" component={InvestimentoDetalheScreen} options={{ title: "Ativo" }} />
        </Stack.Navigator>
    );
}
