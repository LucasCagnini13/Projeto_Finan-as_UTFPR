import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { BotaoTexto } from "../../components/atoms/BotaoTexto";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { saldoChaveObter, transacaoChaveBuscar, transacaoChaveListar } from "../../services/chavesConsulta";
import { dataExibir, transacaoBuscar, transacaoComprovanteAnexar, transacaoExcluir } from "../../services/transacaoService";
import { valorFormatar } from "../../services/valorFormatar";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function LancamentoDetalheScreen({ navigation, route }) {
    const nLancamentoId = route.params?.nLancamentoId;
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oConsultaCliente = useQueryClient();
    const oLancamento = useQuery({
        queryKey: transacaoChaveBuscar(nUsuarioId, nLancamentoId),
        queryFn: () => transacaoBuscar(nUsuarioId, nLancamentoId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null && nLancamentoId !== undefined && nLancamentoId !== null
    });

    async function consultasInvalidar() {
        await oConsultaCliente.invalidateQueries({ queryKey: transacaoChaveListar(nUsuarioId) });
        await oConsultaCliente.invalidateQueries({ queryKey: saldoChaveObter(nUsuarioId) });
        await oConsultaCliente.invalidateQueries({ queryKey: transacaoChaveBuscar(nUsuarioId, nLancamentoId) });
    }

    const oExcluir = useMutation({
        mutationFn: () => transacaoExcluir(nUsuarioId, nLancamentoId),
        onSuccess: async () => {
            await consultasInvalidar();
            navigation.goBack();
        }
    });
    const oAnexar = useMutation({
        mutationFn: (cComprovanteUri) => transacaoComprovanteAnexar(nUsuarioId, nLancamentoId, cComprovanteUri),
        onSuccess: consultasInvalidar
    });

    async function comprovanteAnexar() {
        const oPermissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!oPermissao.granted) {
            Alert.alert("Fotos", "Permita o acesso às fotos para anexar o comprovante.");
            return;
        }

        const oResultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7
        });

        if (!oResultado.canceled && oResultado.assets?.[0]?.uri) {
            oAnexar.mutate(oResultado.assets[0].uri);
        }
    }

    function lancamentoExcluir() {
        const cMensagem = oLancamento.data?.lSomenteExibicao
            ? "Essa linha sai do histórico. Ela não entra no saldo da demonstração."
            : "Essa movimentação sai do histórico e do saldo.";
        Alert.alert("Excluir lançamento", cMensagem, [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: () => oExcluir.mutate() }
        ]);
    }

    if (nLancamentoId === undefined || nLancamentoId === null) {
        return (
            <View style={estilos.tela}>
                <EstadoErro cTitulo="Lançamento não encontrado" cDescricao="Abra o item pela lista." />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} style={estilos.tela}>
            {oLancamento.isPending ? <EstadoCarregando cTitulo="Carregando lançamento" /> : null}
            {oLancamento.isError ? (
                <EstadoErro
                    cTitulo="Não foi possível abrir o lançamento"
                    cDescricao={oLancamento.error?.message}
                    aoTentarNovamente={oLancamento.refetch}
                />
            ) : null}
            {!oLancamento.isError && oLancamento.data ? (
                <View>
                    <Text style={estilos.descricao}>{oLancamento.data.cDescricao}</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={[estilos.valor, { color: oLancamento.data.lEntrada ? oCores.cEntrada : oCores.cSaida }]}>
                        {oLancamento.data.lEntrada ? "Entrada" : "Saída"} · {valorFormatar(oLancamento.data.nValor)}
                    </Text>
                    <Text style={estilos.linha}>{dataExibir(oLancamento.data.cData)}</Text>
                    <Text style={estilos.linha}>{oLancamento.data.cLocal}</Text>
                    <Text style={estilos.linha}>{oLancamento.data.cCategoria}</Text>
                    {oLancamento.data.lSomenteExibicao ? (
                        <Text style={estilos.linha}>Este valor alto só testa a lista. Ele não entra nos R$ 3.250,00.</Text>
                    ) : null}
                    {oLancamento.data.cComprovanteUri ? (
                        <Image source={{ uri: oLancamento.data.cComprovanteUri }} style={estilos.foto} />
                    ) : (
                        <Text style={estilos.linha}>Nenhum comprovante anexado</Text>
                    )}
                    {oExcluir.isError || oAnexar.isError ? (
                        <Text style={estilos.erro}>{(oExcluir.error || oAnexar.error)?.message}</Text>
                    ) : null}
                    <View style={estilos.acoes}>
                        <BotaoPrimario
                            cTitulo="EDITAR"
                            aoPressionar={() => navigation.navigate("LancamentoCriar", { nLancamentoId })}
                        />
                        <View style={estilos.secundarios}>
                            <BotaoTexto cTitulo="Anexar comprovante" lDestaque aoPressionar={comprovanteAnexar} />
                            <BotaoTexto cTitulo="Excluir" aoPressionar={lancamentoExcluir} />
                        </View>
                    </View>
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
        padding: 24
    },
    descricao: {
        color: oCores.cTexto,
        fontSize: 24,
        fontWeight: "700"
    },
    valor: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 12
    },
    linha: {
        color: oCores.cTextoSuave,
        fontSize: 16,
        marginTop: 8
    },
    foto: {
        borderRadius: 16,
        height: 220,
        marginTop: 16,
        width: "100%"
    },
    erro: {
        color: oCores.cErro,
        marginTop: 12
    },
    acoes: {
        marginTop: 28
    },
    secundarios: {
        alignItems: "center",
        flexDirection: "row",
        gap: 16,
        justifyContent: "center",
        marginTop: 16
    }
});
