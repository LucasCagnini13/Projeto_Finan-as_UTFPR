import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { EstadoVazio } from "../../components/atoms/EstadoVazio";
import { PagamentoLista } from "../../components/organisms/PagamentoLista";
import { pagamentoChaveListar } from "../../services/chavesConsulta";
import { pagamentoListar } from "../../services/pagamentoService";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function PagamentoListarScreen({ navigation }) {
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oPagamentos = useQuery({
        queryKey: pagamentoChaveListar(nUsuarioId),
        queryFn: () => pagamentoListar(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const mAbertos = (oPagamentos.data || []).filter((oPagamento) => !oPagamento.lPago);

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} style={estilos.tela}>
            <Text style={estilos.titulo}>Pagamentos</Text>
            <Text style={estilos.descricao}>Contas em aberto. Toque em uma para ver o vencimento ou marcar como paga.</Text>
            {oPagamentos.isPending ? <EstadoCarregando cTitulo="Carregando pagamentos" /> : null}
            {oPagamentos.isError ? (
                <EstadoErro
                    cTitulo="Não foi possível carregar os pagamentos"
                    cDescricao="A consulta falhou. Você pode tentar de novo."
                    aoTentarNovamente={oPagamentos.refetch}
                />
            ) : null}
            {!oPagamentos.isError && oPagamentos.data && mAbertos.length === 0 ? (
                <EstadoVazio
                    cTitulo="Nenhum pagamento"
                    cDescricao="Cadastre uma conta recorrente para ver os próximos vencimentos."
                />
            ) : null}
            {!oPagamentos.isError && mAbertos.length > 0 ? (
                <PagamentoLista
                    mPagamentos={mAbertos}
                    aoPressionar={(nPagamentoId) => navigation.navigate("PagamentoDetalhe", { nPagamentoId })}
                />
            ) : null}
            {!oPagamentos.isPending && !oPagamentos.isError ? (
                <View style={estilos.acao}>
                    <BotaoPrimario cTitulo="CADASTRAR CONTA" aoPressionar={() => navigation.navigate("PagamentoCriar")} />
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
    titulo: {
        color: oCores.cTexto,
        fontSize: 22,
        fontWeight: "700"
    },
    descricao: {
        color: oCores.cTextoSuave,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
        marginTop: 6
    },
    acao: {
        marginTop: 20
    }
});
