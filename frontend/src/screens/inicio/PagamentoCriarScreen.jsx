import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { pagamentoChaveListar } from "../../services/chavesConsulta";
import { pagamentoCriar } from "../../services/pagamentoService";
import { dataIsoMontar, dataMascaraAplicar } from "../../services/transacaoService";
import { valorInterpretar, valorMascaraAplicar } from "../../services/valorFormatar";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

const mPeriodicidades = ["Semanal", "Mensal", "Anual"];

const oErrosVazios = {
    cDescricao: "",
    cValor: "",
    cPeriodicidade: "",
    cVencimento: "",
    cLembrete: ""
};

export function PagamentoCriarScreen({ navigation }) {
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oConsultaCliente = useQueryClient();
    const [cDescricao, setCDescricao] = useState("");
    const [cValor, setCValor] = useState("");
    const [cPeriodicidade, setCPeriodicidade] = useState("Mensal");
    const [cVencimento, setCVencimento] = useState("");
    const [cLembrete, setCLembrete] = useState("1");
    const [oErros, setOErros] = useState(oErrosVazios);
    const [cConfirmacao, setCConfirmacao] = useState("");
    const oCriar = useMutation({
        mutationFn: (oPagamento) => pagamentoCriar(nUsuarioId, oPagamento),
        onSuccess: async (oPagamento) => {
            await oConsultaCliente.invalidateQueries({ queryKey: pagamentoChaveListar(nUsuarioId) });
            setCConfirmacao(`Conta cadastrada. Lembrete de ${oPagamento.nLembreteDias} dia(s) salvo.`);
        }
    });

    async function pagamentoSalvar() {
        const nValor = valorInterpretar(cValor);
        const nLembreteDias = Number(cLembrete);
        const oErrosFormato = {
            cDescricao: cDescricao.trim() ? "" : "Informe a descrição.",
            cValor: nValor && nValor > 0 ? "" : "Informe um valor maior que zero.",
            cPeriodicidade: cPeriodicidade ? "" : "Informe a periodicidade.",
            cVencimento: dataIsoMontar(cVencimento) ? "" : "Informe uma data válida.",
            cLembrete: cLembrete.trim() !== "" && !Number.isNaN(nLembreteDias) && nLembreteDias >= 0
                ? ""
                : "Informe os dias do lembrete."
        };

        setOErros(oErrosFormato);
        setCConfirmacao("");

        if (Object.values(oErrosFormato).some(Boolean)) {
            return;
        }

        try {
            await oCriar.mutateAsync({
                cDescricao,
                nValor,
                cPeriodicidade,
                cVencimento,
                nLembreteDias
            });
        } catch (oErro) {
            setOErros({
                ...oErrosVazios,
                cDescricao: oErro.message
            });
        }
    }

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled" style={estilos.tela}>
            <CampoFormulario
                cRotulo="Descrição"
                cPlaceholder="Ex.: Internet"
                cAutoCapitalize="sentences"
                cValor={cDescricao}
                cErro={oErros.cDescricao}
                aoAlterar={setCDescricao}
            />
            <CampoFormulario
                cRotulo="Valor"
                cPlaceholder="0,00"
                cTipoTeclado="number-pad"
                cValor={cValor}
                cErro={oErros.cValor}
                aoAlterar={(cTexto) => setCValor(valorMascaraAplicar(cTexto))}
            />
            <Text style={estilos.rotulo}>Periodicidade</Text>
            <View style={estilos.opcoes}>
                {mPeriodicidades.map((cOpcao) => {
                    const lSelecionada = cOpcao === cPeriodicidade;

                    return (
                        <Pressable
                            key={cOpcao}
                            accessibilityRole="button"
                            onPress={() => setCPeriodicidade(cOpcao)}
                            style={[estilos.opcao, lSelecionada && estilos.opcaoSelecionada]}
                        >
                            <Text style={[estilos.opcaoTexto, lSelecionada && estilos.opcaoTextoSelecionado]}>{cOpcao}</Text>
                        </Pressable>
                    );
                })}
            </View>
            {oErros.cPeriodicidade ? <Text style={estilos.erro}>{oErros.cPeriodicidade}</Text> : null}
            <CampoFormulario
                cRotulo="Vencimento"
                cPlaceholder="dd/mm/aaaa"
                cTipoTeclado="number-pad"
                cValor={cVencimento}
                cErro={oErros.cVencimento}
                aoAlterar={(cTexto) => setCVencimento(dataMascaraAplicar(cTexto))}
            />
            <CampoFormulario
                cRotulo="Lembrete em dias"
                cPlaceholder="1"
                cTipoTeclado="number-pad"
                cValor={cLembrete}
                cErro={oErros.cLembrete}
                aoAlterar={setCLembrete}
            />
            {cConfirmacao ? <Text style={estilos.confirmacao}>{cConfirmacao}</Text> : null}
            {oCriar.isError && !cConfirmacao ? <Text style={estilos.erro}>{oCriar.error?.message}</Text> : null}
            <BotaoPrimario
                cTitulo={cConfirmacao ? "VER PAGAMENTOS" : "SALVAR CONTA"}
                lCarregando={oCriar.isPending}
                aoPressionar={cConfirmacao ? () => navigation.goBack() : pagamentoSalvar}
            />
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
    rotulo: {
        color: oCores.cTexto,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8
    },
    opcoes: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16
    },
    opcao: {
        backgroundColor: oCores.cBranco,
        borderColor: oCores.cBorda,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    opcaoSelecionada: {
        backgroundColor: oCores.cPrimariaSuave,
        borderColor: oCores.cPrimaria
    },
    opcaoTexto: {
        color: oCores.cTextoSuave,
        fontWeight: "600"
    },
    opcaoTextoSelecionado: {
        color: oCores.cPrimaria
    },
    erro: {
        color: oCores.cErro,
        marginBottom: 12
    },
    confirmacao: {
        color: oCores.cEntrada,
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16
    }
});
