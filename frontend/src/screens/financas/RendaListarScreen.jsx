import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { EstadoVazio } from "../../components/atoms/EstadoVazio";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { rendaChaveListar, saldoChaveObter, transacaoChaveListar } from "../../services/chavesConsulta";
import { rendaCriar, rendaListar } from "../../services/rendaService";
import { valorFormatar, valorInterpretar, valorMascaraAplicar } from "../../services/valorFormatar";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function RendaListarScreen() {
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oConsultaCliente = useQueryClient();
    const [cDescricao, setCDescricao] = useState("");
    const [cValor, setCValor] = useState("");
    const [lRecorrente, setLRecorrente] = useState(true);
    const [cErro, setCErro] = useState("");
    const oRendas = useQuery({
        queryKey: rendaChaveListar(nUsuarioId),
        queryFn: () => rendaListar(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const oCriar = useMutation({
        mutationFn: (oRenda) => rendaCriar(nUsuarioId, oRenda),
        onSuccess: async () => {
            setCDescricao("");
            setCValor("");
            setCErro("");
            await oConsultaCliente.invalidateQueries({ queryKey: rendaChaveListar(nUsuarioId) });
            await oConsultaCliente.invalidateQueries({ queryKey: saldoChaveObter(nUsuarioId) });
            await oConsultaCliente.invalidateQueries({ queryKey: transacaoChaveListar(nUsuarioId) });
        },
        onError: (oErro) => setCErro(oErro.message)
    });

    function rendaSalvar() {
        const nValor = valorInterpretar(cValor);

        if (!cDescricao.trim() || !nValor || nValor <= 0) {
            setCErro("Informe a descrição e um valor maior que zero.");
            return;
        }

        oCriar.mutate({ cDescricao, nValor, lRecorrente });
    }

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} style={estilos.tela}>
            <CampoFormulario cRotulo="Descrição" cPlaceholder="Ex.: Salário" cAutoCapitalize="sentences" cValor={cDescricao} cErro={cErro} aoAlterar={setCDescricao} />
            <CampoFormulario cRotulo="Valor" cPlaceholder="0,00" cTipoTeclado="number-pad" cValor={cValor} aoAlterar={(cTexto) => setCValor(valorMascaraAplicar(cTexto))} />
            <Pressable accessibilityRole="button" onPress={() => setLRecorrente((lAtual) => !lAtual)} style={estilos.recorrencia}>
                <Text style={estilos.recorrenciaTexto}>{lRecorrente ? "Recorrente, como salário ou aluguel" : "Recebimento único"}</Text>
            </Pressable>
            <BotaoPrimario cTitulo="SALVAR RENDA" lCarregando={oCriar.isPending} aoPressionar={rendaSalvar} />
            {oRendas.isPending ? <EstadoCarregando cTitulo="Carregando rendas" /> : null}
            {oRendas.isError ? (
                <EstadoErro cTitulo="Não foi possível carregar as rendas" aoTentarNovamente={oRendas.refetch} />
            ) : null}
            {!oRendas.isError && oRendas.data && oRendas.data.length === 0 ? (
                <View style={estilos.vazio}>
                    <EstadoVazio cTitulo="Nenhuma renda" cDescricao="Cadastre salário, aluguel ou outra fonte." />
                </View>
            ) : null}
            {!oRendas.isError ? (oRendas.data || []).map((oRenda) => (
                <View key={oRenda.nId} style={estilos.item}>
                    <View style={estilos.textos}>
                        <Text numberOfLines={1} style={estilos.nome}>{oRenda.cDescricao}</Text>
                        <Text style={estilos.tipo}>{oRenda.lRecorrente ? "Recorrente" : "Única"}</Text>
                    </View>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={estilos.valor}>{valorFormatar(oRenda.nValor)}</Text>
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
    recorrencia: {
        marginBottom: 16
    },
    recorrenciaTexto: {
        color: oCores.cPrimaria,
        fontWeight: "700"
    },
    vazio: {
        marginTop: 24
    },
    item: {
        alignItems: "center",
        backgroundColor: oCores.cBranco,
        borderRadius: 16,
        flexDirection: "row",
        marginTop: 10,
        padding: 16
    },
    textos: {
        flex: 1
    },
    nome: {
        color: oCores.cTexto,
        fontSize: 16,
        fontWeight: "600"
    },
    tipo: {
        color: oCores.cTextoSuave,
        marginTop: 4
    },
    valor: {
        color: oCores.cEntrada,
        fontWeight: "700",
        maxWidth: 140
    }
});
