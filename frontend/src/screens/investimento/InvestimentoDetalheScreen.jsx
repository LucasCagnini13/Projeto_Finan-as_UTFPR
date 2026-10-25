import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { investimentoChaveBuscar } from "../../services/chavesConsulta";
import { investimentoBuscar } from "../../services/investimentoService";
import { valorFormatar } from "../../services/valorFormatar";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

function quantidadeFormatar(nQuantidade) {
    const [cInteiro, cDecimal] = String(nQuantidade).split(".");
    const cMilhar = cInteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return cDecimal ? `${cMilhar},${cDecimal}` : cMilhar;
}

export function InvestimentoDetalheScreen({ route }) {
    const nInvestimentoId = route.params?.nInvestimentoId;
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oInvestimento = useQuery({
        queryKey: investimentoChaveBuscar(nUsuarioId, nInvestimentoId),
        queryFn: () => investimentoBuscar(nUsuarioId, nInvestimentoId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null && nInvestimentoId !== undefined && nInvestimentoId !== null
    });

    if (oInvestimento.isPending) {
        return <EstadoCarregando cTitulo="Carregando ativo" />;
    }

    if (oInvestimento.isError) {
        return (
            <EstadoErro
                cTitulo="Não foi possível abrir o ativo"
                cDescricao={oInvestimento.error?.message}
                aoTentarNovamente={oInvestimento.refetch}
            />
        );
    }

    const oAtivo = oInvestimento.data;

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} style={estilos.tela}>
            <Text style={estilos.nome}>{oAtivo.cAtivo}</Text>
            <Text style={estilos.instituicao}>{oAtivo.cInstituicao}</Text>
            <View style={estilos.cartao}>
                <Linha cRotulo="Quantidade" cValor={`${quantidadeFormatar(oAtivo.nQuantidade)} un.`} />
                <Linha cRotulo="Valor investido" cValor={valorFormatar(oAtivo.nValorInvestido)} />
                <Linha cRotulo="Valor atual" cValor={valorFormatar(oAtivo.nValorAtual)} />
            </View>
            <Text style={estilos.aviso}>Exemplo no formato da consulta futura. Não há compra nem venda neste recorte.</Text>
        </ScrollView>
    );
}

function Linha({ cRotulo, cValor }) {
    return (
        <View style={estilos.linha}>
            <Text style={estilos.rotulo}>{cRotulo}</Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={estilos.valor}>{cValor}</Text>
        </View>
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
    nome: {
        color: oCores.cTexto,
        fontSize: 22,
        fontWeight: "700"
    },
    instituicao: {
        color: oCores.cTextoSuave,
        fontSize: 14,
        marginBottom: 16,
        marginTop: 4
    },
    cartao: {
        backgroundColor: oCores.cBranco,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    linha: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
        paddingVertical: 12
    },
    rotulo: {
        color: oCores.cTextoSuave,
        fontSize: 14
    },
    valor: {
        color: oCores.cTexto,
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        textAlign: "right"
    },
    aviso: {
        color: oCores.cTextoSuave,
        fontSize: 13,
        lineHeight: 18,
        marginTop: 16
    }
});
