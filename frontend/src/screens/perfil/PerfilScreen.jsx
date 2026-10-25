import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { AvatarUsuario } from "../../components/atoms/AvatarUsuario";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { usuarioChaveAtual } from "../../services/chavesConsulta";
import { usuarioAtualObter, usuarioSair } from "../../services/usuarioService";
import { usuarioCpfMascarar } from "../../services/usuarioValidar";
import { filtroLimpar } from "../../store/filtroSlice";
import { sessaoEncerrar, sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function PerfilScreen({ navigation }) {
    const dispatch = useDispatch();
    const oConsultaCliente = useQueryClient();
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const [lSaindo, setLSaindo] = useState(false);
    const oPerfil = useQuery({
        queryKey: usuarioChaveAtual(),
        queryFn: () => usuarioAtualObter(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });

    async function sessaoSair() {
        setLSaindo(true);
        await usuarioSair();
        oConsultaCliente.clear();
        dispatch(filtroLimpar());
        dispatch(sessaoEncerrar());
    }

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} style={estilos.tela}>
            {oPerfil.isPending ? <EstadoCarregando cTitulo="Carregando perfil" /> : null}
            {oPerfil.isError ? (
                <EstadoErro
                    cTitulo="Não foi possível carregar o perfil"
                    cDescricao={oPerfil.error?.message}
                    aoTentarNovamente={oPerfil.refetch}
                />
            ) : null}
            {oPerfil.data ? (
                <View style={estilos.cartao}>
                    <AvatarUsuario cNome={oPerfil.data.cNome} nTamanho={88} />
                    <Text numberOfLines={1} style={estilos.nome}>{oPerfil.data.cNome}</Text>
                    <Text numberOfLines={1} style={estilos.email}>{oPerfil.data.cEmail}</Text>
                    <Text style={estilos.cpf}>CPF {usuarioCpfMascarar(oPerfil.data.cCpf)}</Text>
                    <View style={estilos.editar}>
                        <BotaoPrimario cTitulo="EDITAR" aoPressionar={() => navigation.navigate("PerfilEditar")} />
                    </View>
                    <Pressable accessibilityRole="button" disabled={lSaindo} onPress={sessaoSair} style={estilos.sair}>
                        <Text style={estilos.sairTexto}>{lSaindo ? "Saindo" : "Sair"}</Text>
                    </Pressable>
                </View>
            ) : null}
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    tela: {
        backgroundColor: oCores.cFundoSuave,
        flex: 1
    },
    conteudo: {
        padding: 20
    },
    cartao: {
        alignItems: "center",
        backgroundColor: oCores.cBranco,
        borderRadius: 20,
        padding: 24
    },
    nome: {
        color: oCores.cTexto,
        fontSize: 22,
        fontWeight: "700",
        marginTop: 16
    },
    email: {
        color: oCores.cTextoSuave,
        fontSize: 15,
        marginTop: 4
    },
    cpf: {
        color: oCores.cTexto,
        fontSize: 15,
        fontWeight: "600",
        marginTop: 12
    },
    editar: {
        alignSelf: "stretch",
        marginTop: 24
    },
    sair: {
        marginTop: 16,
        paddingVertical: 8
    },
    sairTexto: {
        color: oCores.cSaida,
        fontSize: 15,
        fontWeight: "700"
    }
});
