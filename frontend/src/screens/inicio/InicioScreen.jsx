import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { AvatarUsuario } from "../../components/atoms/AvatarUsuario";
import { BotaoTexto } from "../../components/atoms/BotaoTexto";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { EstadoVazio } from "../../components/atoms/EstadoVazio";
import { GraficoCategoria } from "../../components/organisms/GraficoCategoria";
import { PagamentoLista } from "../../components/organisms/PagamentoLista";
import { ResumoEntradaSaida } from "../../components/organisms/ResumoEntradaSaida";
import { SaldoResumoCard } from "../../components/organisms/SaldoResumoCard";
import { pagamentoChaveListar, saldoChaveObter } from "../../services/chavesConsulta";
import { pagamentoListar } from "../../services/pagamentoService";
import { saldoObter } from "../../services/saldoService";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function InicioScreen({ navigation }) {
    const oUsuario = useSelector(sessaoUsuarioObter);
    const nUsuarioId = oUsuario?.nId;
    const cPrimeiroNome = (oUsuario?.cNome || "usuário").trim().split(/\s+/)[0];
    const oSaldo = useQuery({
        queryKey: saldoChaveObter(nUsuarioId),
        queryFn: () => saldoObter(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const oPagamentos = useQuery({
        queryKey: pagamentoChaveListar(nUsuarioId),
        queryFn: () => pagamentoListar(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const mProximos = (oPagamentos.data || []).filter((oPagamento) => !oPagamento.lPago).slice(0, 2);

    function historicoAbrir() {
        navigation.getParent()?.navigate("Financas", { screen: "FinancaListar" });
    }

    function transferenciaAbrir() {
        navigation.getParent()?.navigate("Financas", {
            screen: "LancamentoCriar",
            params: { lEntrada: false }
        });
    }

    function pagamentoAbrir(nPagamentoId) {
        navigation.navigate("PagamentoDetalhe", { nPagamentoId });
    }

    return (
        <SafeAreaView edges={["top"]} style={estilos.tela}>
            <ScrollView contentContainerStyle={estilos.conteudo} showsVerticalScrollIndicator={false}>
                <View style={estilos.cabecalho}>
                    <View style={estilos.saudacaoBloco}>
                        <Text numberOfLines={1} style={estilos.saudacao}>Olá, {cPrimeiroNome}!</Text>
                        <Text style={estilos.subtitulo}>Seu resumo financeiro de hoje</Text>
                    </View>
                    <AvatarUsuario cNome={cPrimeiroNome} />
                </View>

                {oSaldo.isPending ? <EstadoCarregando cTitulo="Carregando resumo" /> : null}
                {oSaldo.isError ? (
                    <EstadoErro
                        cTitulo="Não foi possível carregar o saldo"
                        cDescricao={oSaldo.error?.message}
                        aoTentarNovamente={oSaldo.refetch}
                    />
                ) : null}
                {!oSaldo.isError && oSaldo.data ? (
                    <>
                        <SaldoResumoCard
                            nSaldo={oSaldo.data.nSaldo}
                            cAtualizado={oSaldo.data.cAtualizado}
                            aoTransferir={transferenciaAbrir}
                            aoHistorico={historicoAbrir}
                        />
                        <View style={estilos.espaco}>
                            <ResumoEntradaSaida nEntradas={oSaldo.data.nEntradas} nSaidas={oSaldo.data.nSaidas} />
                        </View>
                    </>
                ) : null}

                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Próximos pagamentos</Text>
                    <BotaoTexto cTitulo="Ver tudo" lDestaque aoPressionar={() => navigation.navigate("PagamentoListar")} />
                </View>

                {oPagamentos.isPending ? <EstadoCarregando cTitulo="Carregando pagamentos" /> : null}
                {oPagamentos.isError ? (
                    <EstadoErro
                        cTitulo="Não foi possível carregar os pagamentos"
                        cDescricao="Tente de novo em instantes."
                        aoTentarNovamente={oPagamentos.refetch}
                    />
                ) : null}
                {!oPagamentos.isError && oPagamentos.data && mProximos.length === 0 ? (
                    <EstadoVazio cTitulo="Nenhum pagamento futuro" cDescricao="Cadastre uma conta para acompanhar o vencimento." />
                ) : null}
                {!oPagamentos.isError && mProximos.length > 0 ? (
                    <PagamentoLista mPagamentos={mProximos} aoPressionar={pagamentoAbrir} />
                ) : null}

                {!oSaldo.isError && oSaldo.data && oSaldo.data.mCategorias.length > 0 ? (
                    <View style={estilos.espaco}>
                        <Text style={estilos.secaoTitulo}>Gastos por categoria</Text>
                        <View style={estilos.grafico}>
                            <GraficoCategoria
                                mCategorias={oSaldo.data.mCategorias}
                                nTotal={oSaldo.data.nTotalCategorias}
                            />
                        </View>
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    tela: {
        backgroundColor: oCores.cFundoSuave,
        flex: 1
    },
    conteudo: {
        paddingBottom: 28,
        paddingHorizontal: 20,
        paddingTop: 12
    },
    cabecalho: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    saudacaoBloco: {
        flex: 1,
        marginRight: 12
    },
    saudacao: {
        color: oCores.cTexto,
        fontSize: 28,
        fontWeight: "700"
    },
    subtitulo: {
        color: oCores.cTextoSuave,
        fontSize: 15,
        marginTop: 4
    },
    espaco: {
        marginTop: 14
    },
    secao: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        marginTop: 22
    },
    secaoTitulo: {
        color: oCores.cTexto,
        fontSize: 18,
        fontWeight: "700"
    },
    grafico: {
        marginTop: 10
    }
});
