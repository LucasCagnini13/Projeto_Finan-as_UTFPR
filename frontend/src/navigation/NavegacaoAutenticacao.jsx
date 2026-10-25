import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/autenticacao/LoginScreen";
import { CadastroScreen } from "../screens/autenticacao/CadastroScreen";
import { SenhaRecuperarScreen } from "../screens/autenticacao/SenhaRecuperarScreen";
import { SenhaRedefinirScreen } from "../screens/autenticacao/SenhaRedefinirScreen";

const Stack = createNativeStackNavigator();

export function NavegacaoAutenticacao() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
            <Stack.Screen name="SenhaRecuperar" component={SenhaRecuperarScreen} />
            <Stack.Screen name="SenhaRedefinir" component={SenhaRedefinirScreen} />
        </Stack.Navigator>
    );
}
