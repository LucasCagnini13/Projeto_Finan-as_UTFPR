import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { EstadoVazio } from "../../components/atoms/EstadoVazio";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { categoriaCriar, categoriaListar } from "../../services/categoriaService";
import { categoriaChaveListar } from "../../services/chavesConsulta";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function CategoriaListarScreen() {
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oConsultaCliente = useQueryClient();
    const [cNome, setCNome] = useState("");
    const [cErro, setCErro] = useState("");
    const oCategorias = useQuery({
        queryKey: categoriaChaveListar(nUsuarioId),
        queryFn: () => categoriaListar(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const oCriar = useMutation({
        mutationFn: () => categoriaCriar(nUsuarioId, cNome),
        onSuccess: async () => {
            setCNome("");
            setCErro("");
            await oConsultaCliente.invalidateQueries({ queryKey: categoriaChaveListar(nUsuarioId) });
        },
        onError: (oErro) => setCErro(oErro.message)
    });

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} style={estilos.tela}>
            <CampoFormulario
                cRotulo="Nova categoria"
                cPlaceholder="Ex.: Mercado"
                cAutoCapitalize="sentences"
                cValor={cNome}
                cErro={cErro}
                aoAlterar={setCNome}
            />
            <BotaoPrimario cTitulo="CRIAR CATEGORIA" lCarregando={oCriar.isPending} aoPressionar={() => oCriar.mutate()} />
            {oCategorias.isPending ? <EstadoCarregando cTitulo="Carregando categorias" /> : null}
            {oCategorias.isError ? (
                <EstadoErro cTitulo="Não foi possível carregar as categorias" aoTentarNovamente={oCategorias.refetch} />
            ) : null}
            {!oCategorias.isError && oCategorias.data && oCategorias.data.length === 0 ? (
                <View style={estilos.vazio}>
                    <EstadoVazio cTitulo="Nenhuma categoria" cDescricao="Crie uma pasta para organizar os lançamentos." />
                </View>
            ) : null}
            {!oCategorias.isError ? (oCategorias.data || []).map((oCategoria) => (
                <View key={oCategoria.nId} style={estilos.item}>
                    <Text style={estilos.nome}>{oCategoria.cNome}</Text>
                </View>
            )) : null}
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
    vazio: {
        marginTop: 24
    },
    item: {
        backgroundColor: oCores.cBranco,
        borderRadius: 16,
        marginTop: 10,
        padding: 16
    },
    nome: {
        color: oCores.cTexto,
        fontSize: 16,
        fontWeight: "600"
    }
});
