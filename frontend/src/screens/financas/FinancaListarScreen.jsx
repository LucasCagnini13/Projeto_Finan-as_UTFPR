import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { EstadoVazio } from "../../components/atoms/EstadoVazio";
import { FiltroMovimentacao } from "../../components/organisms/FiltroMovimentacao";
import { TransacaoLista } from "../../components/organisms/TransacaoLista";
import { categoriaListar } from "../../services/categoriaService";
import { categoriaChaveListar, transacaoChaveListar } from "../../services/chavesConsulta";
import { transacaoFiltrar, transacaoListar } from "../../services/transacaoService";
import { filtroDefinir, filtroLimpar, filtroModalDefinir, filtroObter } from "../../store/filtroSlice";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function FinancaListarScreen({ navigation }) {
    const dispatch = useDispatch();
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oFiltro = useSelector(filtroObter);
    const oTransacoes = useQuery({
        queryKey: transacaoChaveListar(nUsuarioId),
        queryFn: () => transacaoListar(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const oCategorias = useQuery({
        queryKey: categoriaChaveListar(nUsuarioId),
        queryFn: () => categoriaListar(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const mVisiveis = transacaoFiltrar(oTransacoes.data || [], oFiltro);
    const lFiltroAtivo = Boolean(
        oFiltro.cPeriodoInicio ||
        oFiltro.cPeriodoFim ||
        oFiltro.nCategoriaId ||
        oFiltro.cTipo ||
        oFiltro.cValorMin ||
        oFiltro.cValorMax
    );

    return (
        <View style={estilos.tela}>
            <ScrollView contentContainerStyle={estilos.conteudo} style={estilos.rolagem}>
            <View style={estilos.atalhos}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Filtrar lançamentos"
                    onPress={() => dispatch(filtroModalDefinir(true))}
                    style={[estilos.filtrar, lFiltroAtivo && estilos.filtrarAtivo]}
                >
                    <Ionicons color={oCores.cPrimaria} name="funnel-outline" size={16} />
                    <Text style={estilos.filtrarTexto}>{lFiltroAtivo ? "Filtro ativo" : "Filtrar"}</Text>
                </Pressable>
                <View style={estilos.destinos}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate("CategoriaListar")}
                        style={estilos.destino}
                    >
                        <View style={estilos.destinoIcone}>
                            <Ionicons color={oCores.cPrimaria} name="pricetags-outline" size={18} />
                        </View>
                        <View style={estilos.destinoTextos}>
                            <Text style={estilos.destinoTitulo}>Categorias</Text>
                            <Text style={estilos.destinoSubtitulo}>Organizar pastas</Text>
                        </View>
                        <Ionicons color={oCores.cTextoSuave} name="chevron-forward" size={16} />
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate("RendaListar")}
                        style={estilos.destino}
                    >
                        <View style={estilos.destinoIcone}>
                            <Ionicons color={oCores.cPrimaria} name="wallet-outline" size={18} />
                        </View>
                        <View style={estilos.destinoTextos}>
                            <Text style={estilos.destinoTitulo}>Rendas</Text>
                            <Text style={estilos.destinoSubtitulo}>Salário e aluguel</Text>
                        </View>
                        <Ionicons color={oCores.cTextoSuave} name="chevron-forward" size={16} />
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate("PagamentoListar")}
                        style={estilos.destino}
                    >
                        <View style={estilos.destinoIcone}>
                            <Ionicons color={oCores.cPrimaria} name="calendar-outline" size={18} />
                        </View>
                        <View style={estilos.destinoTextos}>
                            <Text style={estilos.destinoTitulo}>Pagamentos</Text>
                            <Text style={estilos.destinoSubtitulo}>Contas a vencer</Text>
                        </View>
                        <Ionicons color={oCores.cTextoSuave} name="chevron-forward" size={16} />
                    </Pressable>
                </View>
            </View>
            {oTransacoes.isPending ? <EstadoCarregando cTitulo="Carregando lançamentos" /> : null}
            {oTransacoes.isError ? (
                <EstadoErro
                    cTitulo="Não foi possível carregar os lançamentos"
                    cDescricao="A consulta falhou. Você pode tentar de novo."
                    aoTentarNovamente={oTransacoes.refetch}
                />
            ) : null}
            {!oTransacoes.isError && oTransacoes.data && oTransacoes.data.length === 0 ? (
                <View style={estilos.vazio}>
                    <EstadoVazio cTitulo="Nenhum lançamento" cDescricao="Cadastre uma entrada ou uma saída para ver o histórico." />
                </View>
            ) : null}
            {!oTransacoes.isError && oTransacoes.data && oTransacoes.data.length > 0 && mVisiveis.length === 0 ? (
                <View style={estilos.vazio}>
                    <EstadoVazio cTitulo="Nenhum lançamento neste filtro" cDescricao="Limpe o filtro para ver a lista completa." />
                    <Pressable accessibilityRole="button" onPress={() => dispatch(filtroLimpar())} style={estilos.limpar}>
                        <Text style={estilos.limparTexto}>Limpar filtro</Text>
                    </Pressable>
                </View>
            ) : null}
            {!oTransacoes.isError && mVisiveis.length > 0 ? (
                <View style={estilos.lista}>
                    <Text style={estilos.secao}>Lançamentos</Text>
                    <TransacaoLista
                        mTransacoes={mVisiveis}
                        aoPressionar={(nLancamentoId) => navigation.navigate("LancamentoDetalhe", { nLancamentoId })}
                    />
                </View>
            ) : null}
            </ScrollView>
            <View style={estilos.acao}>
                <BotaoPrimario cTitulo="NOVO LANÇAMENTO" aoPressionar={() => navigation.navigate("LancamentoCriar", { lEntrada: true })} />
            </View>
            {oFiltro.lModalAberto ? (
                <FiltroMovimentacao
                    lAberto
                    oFiltro={oFiltro}
                    mCategorias={oCategorias.data || []}
                    aoFechar={() => dispatch(filtroModalDefinir(false))}
                    aoLimpar={() => dispatch(filtroLimpar())}
                    aoAplicar={(oNovoFiltro) => dispatch(filtroDefinir(oNovoFiltro))}
                />
            ) : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    tela: {
        backgroundColor: oCores.cFundoSuave,
        flex: 1
    },
    rolagem: {
        flex: 1
    },
    conteudo: {
        paddingBottom: 12
    },
    atalhos: {
        gap: 10,
        paddingHorizontal: 20,
        paddingTop: 12
    },
    filtrar: {
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: oCores.cBranco,
        borderColor: oCores.cPrimaria,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: "row",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8
    },
    filtrarAtivo: {
        backgroundColor: oCores.cPrimariaSuave
    },
    filtrarTexto: {
        color: oCores.cPrimaria,
        fontSize: 14,
        fontWeight: "700"
    },
    destinos: {
        gap: 8
    },
    destino: {
        alignItems: "center",
        backgroundColor: oCores.cBranco,
        borderRadius: 16,
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    destinoIcone: {
        alignItems: "center",
        backgroundColor: oCores.cPrimariaSuave,
        borderRadius: 12,
        height: 36,
        justifyContent: "center",
        width: 36
    },
    destinoTextos: {
        flex: 1
    },
    destinoTitulo: {
        color: oCores.cTexto,
        fontSize: 15,
        fontWeight: "700"
    },
    destinoSubtitulo: {
        color: oCores.cTextoSuave,
        fontSize: 12,
        marginTop: 2
    },
    secao: {
        color: oCores.cTexto,
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12
    },
    lista: {
        padding: 20
    },
    vazio: {
        paddingHorizontal: 20,
        paddingVertical: 28
    },
    limpar: {
        alignItems: "center",
        marginTop: 12
    },
    limparTexto: {
        color: oCores.cPrimaria,
        fontSize: 15,
        fontWeight: "700"
    },
    acao: {
        padding: 20
    }
});
