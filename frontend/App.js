import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { oConsultaCliente } from "./src/services/consultaCliente";
import { oStore } from "./src/store";
import { NavegacaoRaiz } from "./src/navigation/NavegacaoRaiz";

export default function App() {
    return (
        <Provider store={oStore}>
            <QueryClientProvider client={oConsultaCliente}>
                <SafeAreaProvider>
                    <StatusBar style="dark" />
                    <NavegacaoRaiz />
                </SafeAreaProvider>
            </QueryClientProvider>
        </Provider>
    );
}
