import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { categoriaListar } from "../../services/categoriaService";
import { categoriaChaveListar, saldoChaveObter, transacaoChaveBuscar, transacaoChaveListar } from "../../services/chavesConsulta";
import { dataExibir, dataIsoMontar, dataMascaraAplicar, transacaoAtualizar, transacaoBuscar, transacaoCriar } from "../../services/transacaoService";
import { valorInterpretar, valorMascaraAplicar, valorMascaraDeNumero } from "../../services/valorFormatar";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

const oErrosVazios = {
    cDescricao: "",
    cValor: "",
    cData: "",
    cLocal: "",
    nCategoriaId: ""
};

export function LancamentoCriarScreen({ navigation, route }) {
    const nLancamentoId = route.params?.nLancamentoId;
    const lEdicao = nLancamentoId !== undefined && nLancamentoId !== null;
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oConsultaCliente = useQueryClient();
    const oCategorias = useQuery({
        queryKey: categoriaChaveListar(nUsuarioId),
        queryFn: () => categoriaListar(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const oLancamento = useQuery({
        queryKey: transacaoChaveBuscar(nUsuarioId, nLancamentoId),
        queryFn: () => transacaoBuscar(nUsuarioId, nLancamentoId),
        enabled: lEdicao && nUsuarioId !== undefined && nUsuarioId !== null
    });
    const [cDescricao, setCDescricao] = useState("");
    const [cValor, setCValor] = useState("");
    const [cData, setCData] = useState("");
    const [cLocal, setCLocal] = useState("");
    const [nCategoriaId, setNCategoriaId] = useState(null);
    const [lEntrada, setLEntrada] = useState(route.params?.lEntrada !== false);
    const [oErros, setOErros] = useState(oErrosVazios);
    const [lFormularioPronto, setLFormularioPronto] = useState(!lEdicao);

    useEffect(() => {
        if (!oLancamento.data || lFormularioPronto) {
            return;
        }

        setCDescricao(oLancamento.data.cDescricao);
        setCValor(valorMascaraDeNumero(oLancamento.data.nValor));
        setCData(dataExibir(oLancamento.data.cData));
        setCLocal(oLancamento.data.cLocal);
        setNCategoriaId(oLancamento.data.nCategoriaId);
        setLEntrada(oLancamento.data.lEntrada);
        setLFormularioPronto(true);
    }, [oLancamento.data, lFormularioPronto]);

    async function consultasInvalidar() {
        await oConsultaCliente.invalidateQueries({ queryKey: transacaoChaveListar(nUsuarioId) });
        await oConsultaCliente.invalidateQueries({ queryKey: saldoChaveObter(nUsuarioId) });

        if (lEdicao) {
            await oConsultaCliente.invalidateQueries({ queryKey: transacaoChaveBuscar(nUsuarioId, nLancamentoId) });
        }
    }

    const oSalvar = useMutation({
        mutationFn: (oDados) => (lEdicao ? transacaoAtualizar(nUsuarioId, oDados) : transacaoCriar(nUsuarioId, oDados)),
        onSuccess: async () => {
            await consultasInvalidar();
            navigation.goBack();
        }
    });

    function lancamentoSalvar() {
        const nValor = valorInterpretar(cValor);
        const cDataIso = dataIsoMontar(cData);
        const oCategoria = (oCategorias.data || []).find((oItem) => oItem.nId === nCategoriaId);
        const oErrosFormato = {
            cDescricao: cDescricao.trim() ? "" : "Informe a descrição.",
            cValor: nValor && nValor > 0 ? "" : "Informe um valor maior que zero.",
            cData: cDataIso ? "" : "Informe uma data válida.",
            cLocal: cLocal.trim() ? "" : "Informe o local.",
            nCategoriaId: nCategoriaId ? "" : "Escolha uma categoria."
        };

        setOErros(oErrosFormato);

        if (Object.values(oErrosFormato).some(Boolean)) {
            return;
        }

        oSalvar.mutate({
            nId: nLancamentoId,
            cDescricao,
            nValor,
            cData: cDataIso,
            cLocal,
            nCategoriaId,
            cCategoria: oCategoria?.cNome || "",
            lEntrada
        });
    }

    if (lEdicao && oLancamento.isPending) {
        return <Text style={estilos.aviso}>Carregando lançamento</Text>;
    }

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled" style={estilos.tela}>
            <View style={estilos.tipos}>
                <Tipo cRotulo="Entrada" lSelecionado={lEntrada} aoPressionar={() => setLEntrada(true)} />
                <Tipo cRotulo="Saída" lSelecionado={!lEntrada} aoPressionar={() => setLEntrada(false)} />
            </View>
            <CampoFormulario cRotulo="Descrição" cPlaceholder="Ex.: Mercado" cAutoCapitalize="sentences" cValor={cDescricao} cErro={oErros.cDescricao} aoAlterar={setCDescricao} />
            <CampoFormulario cRotulo="Valor" cPlaceholder="0,00" cTipoTeclado="number-pad" cValor={cValor} cErro={oErros.cValor} aoAlterar={(cTexto) => setCValor(valorMascaraAplicar(cTexto))} />
            <CampoFormulario cRotulo="Data" cPlaceholder="dd/mm/aaaa" cTipoTeclado="number-pad" cValor={cData} cErro={oErros.cData} aoAlterar={(cTexto) => setCData(dataMascaraAplicar(cTexto))} />
            <CampoFormulario cRotulo="Local" cPlaceholder="Onde foi a transação" cAutoCapitalize="sentences" cValor={cLocal} cErro={oErros.cLocal} aoAlterar={setCLocal} />
            <Text style={estilos.rotulo}>Categoria</Text>
            <View style={estilos.opcoes}>
                {(oCategorias.data || []).map((oCategoria) => (
                    <Tipo
                        key={oCategoria.nId}
                        cRotulo={oCategoria.cNome}
                        lSelecionado={nCategoriaId === oCategoria.nId}
                        aoPressionar={() => setNCategoriaId(oCategoria.nId)}
                    />
                ))}
            </View>
            {oErros.nCategoriaId ? <Text style={estilos.erro}>{oErros.nCategoriaId}</Text> : null}
            {(oCategorias.data || []).length === 0 ? (
                <BotaoTextoCriar navigation={navigation} />
            ) : null}
            {oSalvar.isError ? <Text style={estilos.erro}>{oSalvar.error?.message}</Text> : null}
            <BotaoPrimario cTitulo={lEdicao ? "SALVAR ALTERAÇÃO" : "SALVAR"} lCarregando={oSalvar.isPending} aoPressionar={lancamentoSalvar} />
        </ScrollView>
    );
}

function Tipo({ cRotulo, lSelecionado, aoPressionar }) {
    return (
        <Pressable accessibilityRole="button" onPress={aoPressionar} style={[estilos.tipo, lSelecionado && estilos.tipoSelecionado]}>
            <Text style={[estilos.tipoTexto, lSelecionado && estilos.tipoTextoSelecionado]}>{cRotulo}</Text>
        </Pressable>
    );
}

function BotaoTextoCriar({ navigation }) {
    return (
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate("CategoriaListar")} style={estilos.criar}>
            <Text style={estilos.criarTexto}>Criar uma categoria antes de salvar</Text>
        </Pressable>
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
    aviso: {
        color: oCores.cTextoSuave,
        padding: 24
    },
    tipos: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16
    },
    rotulo: {
        color: oCores.cTexto,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8
    },
    opcoes: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 8
    },
    tipo: {
        backgroundColor: oCores.cBranco,
        borderColor: oCores.cBorda,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    tipoSelecionado: {
        backgroundColor: oCores.cPrimariaSuave,
        borderColor: oCores.cPrimaria
    },
    tipoTexto: {
        color: oCores.cTextoSuave,
        fontWeight: "600"
    },
    tipoTextoSelecionado: {
        color: oCores.cPrimaria
    },
    erro: {
        color: oCores.cErro,
        marginBottom: 12
    },
    criar: {
        marginBottom: 16
    },
    criarTexto: {
        color: oCores.cPrimaria,
        fontWeight: "700"
    }
});
