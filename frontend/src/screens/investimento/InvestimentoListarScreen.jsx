import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { BotaoTexto } from "../../components/atoms/BotaoTexto";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { EstadoVazio } from "../../components/atoms/EstadoVazio";
import { InvestimentoLista } from "../../components/organisms/InvestimentoLista";
import { investimentoChaveListar } from "../../services/chavesConsulta";
import { investimentoAutorizar, investimentoListar, investimentoSincronizarFalharDefinir } from "../../services/investimentoService";
import { sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function InvestimentoListarScreen({ navigation }) {
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oConsultaCliente = useQueryClient();
    const oLista = useQuery({
        queryKey: investimentoChaveListar(nUsuarioId),
        queryFn: () => investimentoListar(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const [lBancoCentral, setLBancoCentral] = useState(false);
    const [lB3, setLB3] = useState(false);
    const lCarregando = oLista.isPending || oLista.isFetching;
    const lAutorizado = Boolean(oLista.data?.lBancoCentral || oLista.data?.lB3);
    const mInvestimentos = oLista.data?.mInvestimentos || [];

    useEffect(() => {
        if (!oLista.data) {
            return;
        }

        setLBancoCentral(oLista.data.lBancoCentral);
        setLB3(oLista.data.lB3);
    }, [oLista.data]);

    async function autorizacaoAlterar(cCampo, lValor) {
        const oNova = {
            lBancoCentral: cCampo === "lBancoCentral" ? lValor : lBancoCentral,
            lB3: cCampo === "lB3" ? lValor : lB3
        };

        if (cCampo === "lBancoCentral") {
            setLBancoCentral(lValor);
        } else {
            setLB3(lValor);
        }

        await investimentoAutorizar(nUsuarioId, oNova);
        await oConsultaCliente.invalidateQueries({ queryKey: investimentoChaveListar(nUsuarioId) });
    }

    async function sincronizacaoFalhar() {
        investimentoSincronizarFalharDefinir(nUsuarioId, true);
        await oLista.refetch();
    }

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} style={estilos.tela}>
            <Text style={estilos.aviso}>Carteira de exemplo. A autorização é simulada e estes ativos não são a posição real.</Text>
            <View style={estilos.autorizacoes}>
                <Autorizacao
                    cTitulo="Banco Central"
                    cSubtitulo="Consulta simulada"
                    lValor={lBancoCentral}
                    aoAlterar={(lValor) => autorizacaoAlterar("lBancoCentral", lValor)}
                />
                <View style={estilos.divisor} />
                <Autorizacao
                    cTitulo="B3"
                    cSubtitulo="Consulta simulada"
                    lValor={lB3}
                    aoAlterar={(lValor) => autorizacaoAlterar("lB3", lValor)}
                />
            </View>
            {lCarregando ? <EstadoCarregando cTitulo="Sincronizando investimentos" /> : null}
            {!lCarregando && oLista.isError ? (
                <EstadoErro
                    cTitulo="Não foi possível sincronizar"
                    cDescricao="A instituição não respondeu. Você pode tentar de novo."
                    aoTentarNovamente={oLista.refetch}
                />
            ) : null}
            {!lCarregando && !oLista.isError && oLista.data && !lAutorizado ? (
                <View style={estilos.vazio}>
                    <EstadoVazio
                        cTitulo="Nenhum investimento"
                        cDescricao="Autorize o Banco Central ou a B3 para ver a carteira de exemplo."
                    />
                </View>
            ) : null}
            {!lCarregando && !oLista.isError && oLista.data && lAutorizado && mInvestimentos.length === 0 ? (
                <View style={estilos.vazio}>
                    <EstadoVazio
                        cTitulo="Nenhum ativo"
                        cDescricao="A instituição autorizada não devolveu ativos."
                    />
                </View>
            ) : null}
            {!lCarregando && !oLista.isError && mInvestimentos.length > 0 ? (
                <InvestimentoLista
                    mInvestimentos={mInvestimentos}
                    aoPressionar={(nInvestimentoId) => navigation.navigate("InvestimentoDetalhe", { nInvestimentoId })}
                />
            ) : null}
            {!lCarregando ? (
                <View style={estilos.falha}>
                    <BotaoTexto cTitulo="Simular falha da instituição" aoPressionar={sincronizacaoFalhar} />
                </View>
            ) : null}
        </ScrollView>
    );
}

function Autorizacao({ cTitulo, cSubtitulo, lValor, aoAlterar }) {
    return (
        <View style={estilos.autorizacao}>
            <View style={estilos.textos}>
                <Text style={estilos.titulo}>{cTitulo}</Text>
                <Text style={estilos.subtitulo}>{cSubtitulo}</Text>
            </View>
            <Switch
                accessibilityLabel={`Autorizar ${cTitulo}`}
                accessibilityRole="switch"
                onValueChange={aoAlterar}
                thumbColor={oCores.cBranco}
                trackColor={{ false: oCores.cBorda, true: oCores.cPrimaria }}
                value={lValor}
            />
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
    aviso: {
        color: oCores.cTextoSuave,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16
    },
    autorizacoes: {
        backgroundColor: oCores.cBranco,
        borderRadius: 20,
        marginBottom: 16,
        paddingHorizontal: 16
    },
    autorizacao: {
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        paddingVertical: 14
    },
    textos: {
        flex: 1
    },
    titulo: {
        color: oCores.cTexto,
        fontSize: 16,
        fontWeight: "700"
    },
    subtitulo: {
        color: oCores.cTextoSuave,
        fontSize: 13,
        marginTop: 2
    },
    divisor: {
        backgroundColor: oCores.cBorda,
        height: 1
    },
    vazio: {
        paddingVertical: 24
    },
    falha: {
        alignItems: "center",
        marginTop: 16
    }
});
