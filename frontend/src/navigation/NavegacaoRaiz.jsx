import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { sessaoAutenticadaObter } from "../store/sessaoSlice";
import { NavegacaoAutenticacao } from "./NavegacaoAutenticacao";
import { NavegacaoPrincipal } from "./NavegacaoPrincipal";

export function NavegacaoRaiz() {
    const lAutenticado = useSelector(sessaoAutenticadaObter);

    return (
        <NavigationContainer>
            {lAutenticado ? <NavegacaoPrincipal /> : <NavegacaoAutenticacao />}
        </NavigationContainer>
    );
}
