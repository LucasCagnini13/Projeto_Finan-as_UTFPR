import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { NavegacaoInicio } from "./NavegacaoInicio";
import { NavegacaoFinancas } from "./NavegacaoFinancas";
import { NavegacaoInvestimentos } from "./NavegacaoInvestimentos";
import { NavegacaoPerfil } from "./NavegacaoPerfil";
import { oCores } from "../theme/cores";

const Tab = createBottomTabNavigator();

function iconeAba(cNome, nTamanho, cCor) {
    return <Ionicons color={cCor} name={cNome} size={nTamanho} />;
}

export function NavegacaoPrincipal() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: oCores.cPrimaria,
                tabBarInactiveTintColor: oCores.cTextoSuave,
                tabBarStyle: {
                    backgroundColor: oCores.cBranco,
                    borderTopColor: oCores.cBorda,
                    height: 72,
                    paddingBottom: 10,
                    paddingTop: 8
                }
            }}
        >
            <Tab.Screen
                name="Inicio"
                component={NavegacaoInicio}
                options={{
                    title: "Início",
                    tabBarIcon: ({ color: cCor, size: nTamanho }) => iconeAba("home-outline", nTamanho, cCor)
                }}
            />
            <Tab.Screen
                name="Financas"
                component={NavegacaoFinancas}
                options={{
                    title: "Finanças",
                    tabBarIcon: ({ color: cCor, size: nTamanho }) => iconeAba("wallet-outline", nTamanho, cCor)
                }}
            />
            <Tab.Screen
                name="Investimentos"
                component={NavegacaoInvestimentos}
                options={{
                    title: "Investimentos",
                    tabBarIcon: ({ color: cCor, size: nTamanho }) => iconeAba("trending-up-outline", nTamanho, cCor)
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={NavegacaoPerfil}
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color: cCor, size: nTamanho }) => iconeAba("person-outline", nTamanho, cCor)
                }}
            />
        </Tab.Navigator>
    );
}
