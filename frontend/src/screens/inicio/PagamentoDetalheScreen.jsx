import { StyleSheet, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { pagamentoChaveBuscar, pagamentoChaveListar, saldoChaveObter, transacaoChaveListar } from "../../services/chavesConsulta";
import { pagamentoBuscar, pagamentoQuitar } from "../../services/pagamentoService";
import { dataVencimentoExibir } from "../../services/transacaoService";
import { valorFormatar } from "../../services/valorFormatar";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function PagamentoDetalheScreen({ route }) {
    const nPagamentoId = route.params?.nPagamentoId;
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oConsultaCliente = useQueryClient();
    const oPagamento = useQuery({
        queryKey: pagamentoChaveBuscar(nUsuarioId, nPagamentoId),
        queryFn: () => pagamentoBuscar(nUsuarioId, nPagamentoId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null && nPagamentoId !== undefined && nPagamentoId !== null
    });
    const oQuitar = useMutation({
        mutationFn: () => pagamentoQuitar(nUsuarioId, nPagamentoId),
        onSuccess: async () => {
            await oConsultaCliente.invalidateQueries({ queryKey: saldoChaveObter(nUsuarioId) });
            await oConsultaCliente.invalidateQueries({ queryKey: pagamentoChaveListar(nUsuarioId) });
            await oConsultaCliente.invalidateQueries({ queryKey: transacaoChaveListar(nUsuarioId) });
            await oConsultaCliente.invalidateQueries({ queryKey: pagamentoChaveBuscar(nUsuarioId, nPagamentoId) });
        }
    });

    if (nPagamentoId === undefined || nPagamentoId === null) {
        return (
            <View style={estilos.tela}>
                <EstadoErro cTitulo="Pagamento não encontrado" cDescricao="Abra o item pela lista de pagamentos." />
            </View>
        );
    }

    return (
        <View style={estilos.tela}>
            {oPagamento.isPending ? <EstadoCarregando cTitulo="Carregando pagamento" /> : null}
            {oPagamento.isError ? (
                <EstadoErro
                    cTitulo="Não foi possível abrir o pagamento"
                    cDescricao={oPagamento.error?.message}
                    aoTentarNovamente={oPagamento.refetch}
                />
            ) : null}
            {oPagamento.data ? (
                <View style={estilos.conteudo}>
                    <Text style={estilos.descricao}>{oPagamento.data.cDescricao}</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={estilos.valor}>
                        {valorFormatar(oPagamento.data.nValor)}
                    </Text>
                    <Text style={estilos.linha}>{dataVencimentoExibir(oPagamento.data.cVencimento)}</Text>
                    <Text style={estilos.linha}>Periodicidade: {oPagamento.data.cPeriodicidade}</Text>
                    <Text style={estilos.linha}>Lembrete: {oPagamento.data.nLembreteDias} dia(s) antes</Text>
                    <Text style={estilos.linha}>{oPagamento.data.lPago ? "Pago" : "Em aberto"}</Text>
                    {oQuitar.isError ? <Text style={estilos.erro}>{oQuitar.error?.message}</Text> : null}
                    {!oPagamento.data.lPago ? (
                        <View style={estilos.acao}>
                            <BotaoPrimario
                                cTitulo="MARCAR COMO PAGO"
                                lCarregando={oQuitar.isPending}
                                aoPressionar={() => oQuitar.mutate()}
                            />
                        </View>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    tela: {
        backgroundColor: oCores.cFundoSuave,
        flex: 1
    },
    conteudo: {
        padding: 24
    },
    descricao: {
        color: oCores.cTexto,
        fontSize: 24,
        fontWeight: "700"
    },
    valor: {
        color: oCores.cSaida,
        fontSize: 28,
        fontWeight: "700",
        marginTop: 12
    },
    linha: {
        color: oCores.cTextoSuave,
        fontSize: 16,
        marginTop: 10
    },
    erro: {
        color: oCores.cErro,
        marginTop: 16
    },
    acao: {
        marginTop: 28
    }
});
