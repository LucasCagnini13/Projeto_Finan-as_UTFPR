import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BotaoPrimario } from "../atoms/BotaoPrimario";
import { BotaoTexto } from "../atoms/BotaoTexto";
import { CampoFormulario } from "../molecules/CampoFormulario";
import { dataExibir, dataIsoMontar, dataMascaraAplicar } from "../../services/transacaoService";
import { valorMascaraAplicar } from "../../services/valorFormatar";
import { oCores } from "../../theme/cores";

const mTipos = [
    { cValor: "", cRotulo: "Todos" },
    { cValor: "entrada", cRotulo: "Entrada" },
    { cValor: "saida", cRotulo: "Saída" }
];

export function FiltroMovimentacao({ lAberto, oFiltro, mCategorias, aoAplicar, aoLimpar, aoFechar }) {
    const [cInicio, setCInicio] = useState(dataExibir(oFiltro.cPeriodoInicio));
    const [cFim, setCFim] = useState(dataExibir(oFiltro.cPeriodoFim));
    const [nCategoriaId, setNCategoriaId] = useState(oFiltro.nCategoriaId);
    const [cTipo, setCTipo] = useState(oFiltro.cTipo);
    const [cValorMin, setCValorMin] = useState(oFiltro.cValorMin);
    const [cValorMax, setCValorMax] = useState(oFiltro.cValorMax);
    const [cErroData, setCErroData] = useState("");

    function filtroAplicar() {
        const cPeriodoInicio = cInicio.trim() ? dataIsoMontar(cInicio) : "";
        const cPeriodoFim = cFim.trim() ? dataIsoMontar(cFim) : "";

        if ((cInicio.trim() && !cPeriodoInicio) || (cFim.trim() && !cPeriodoFim)) {
            setCErroData("Use o formato dd/mm/aaaa.");
            return;
        }

        aoAplicar({
            cPeriodoInicio,
            cPeriodoFim,
            nCategoriaId,
            cTipo,
            cValorMin,
            cValorMax
        });
    }

    return (
        <Modal animationType="slide" transparent visible={lAberto} onRequestClose={aoFechar}>
            <View style={estilos.fundo}>
                <View style={estilos.folha}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={estilos.titulo}>Filtrar movimentações</Text>
                        <CampoFormulario
                            cRotulo="Período inicial"
                            cPlaceholder="dd/mm/aaaa"
                            cTipoTeclado="number-pad"
                            cValor={cInicio}
                            cErro={cErroData}
                            aoAlterar={(cTexto) => setCInicio(dataMascaraAplicar(cTexto))}
                        />
                        <CampoFormulario
                            cRotulo="Período final"
                            cPlaceholder="dd/mm/aaaa"
                            cTipoTeclado="number-pad"
                            cValor={cFim}
                            aoAlterar={(cTexto) => setCFim(dataMascaraAplicar(cTexto))}
                        />
                        <Text style={estilos.rotulo}>Categoria</Text>
                        <View style={estilos.opcoes}>
                            <Opcao cRotulo="Todas" lSelecionada={!nCategoriaId} aoPressionar={() => setNCategoriaId(null)} />
                            {mCategorias.map((oCategoria) => (
                                <Opcao
                                    key={oCategoria.nId}
                                    cRotulo={oCategoria.cNome}
                                    lSelecionada={nCategoriaId === oCategoria.nId}
                                    aoPressionar={() => setNCategoriaId(oCategoria.nId)}
                                />
                            ))}
                        </View>
                        <Text style={estilos.rotulo}>Tipo</Text>
                        <View style={estilos.opcoes}>
                            {mTipos.map((oTipo) => (
                                <Opcao
                                    key={oTipo.cRotulo}
                                    cRotulo={oTipo.cRotulo}
                                    lSelecionada={cTipo === oTipo.cValor}
                                    aoPressionar={() => setCTipo(oTipo.cValor)}
                                />
                            ))}
                        </View>
                        <CampoFormulario
                            cRotulo="Valor mínimo"
                            cPlaceholder="0,00"
                            cTipoTeclado="number-pad"
                            cValor={cValorMin}
                            aoAlterar={(cTexto) => setCValorMin(valorMascaraAplicar(cTexto))}
                        />
                        <CampoFormulario
                            cRotulo="Valor máximo"
                            cPlaceholder="0,00"
                            cTipoTeclado="number-pad"
                            cValor={cValorMax}
                            aoAlterar={(cTexto) => setCValorMax(valorMascaraAplicar(cTexto))}
                        />
                        <BotaoPrimario cTitulo="APLICAR" aoPressionar={filtroAplicar} />
                        <View style={estilos.limpar}>
                            <BotaoTexto cTitulo="Limpar filtro" lDestaque aoPressionar={aoLimpar} />
                            <BotaoTexto cTitulo="Fechar" aoPressionar={aoFechar} />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

function Opcao({ cRotulo, lSelecionada, aoPressionar }) {
    return (
        <Pressable
            accessibilityRole="button"
            onPress={aoPressionar}
            style={[estilos.opcao, lSelecionada && estilos.opcaoSelecionada]}
        >
            <Text style={[estilos.opcaoTexto, lSelecionada && estilos.opcaoTextoSelecionado]}>{cRotulo}</Text>
        </Pressable>
    );
}

const estilos = StyleSheet.create({
    fundo: {
        backgroundColor: "rgba(17, 19, 31, 0.4)",
        flex: 1,
        justifyContent: "flex-end"
    },
    folha: {
        backgroundColor: oCores.cBranco,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "88%",
        padding: 20
    },
    titulo: {
        color: oCores.cTexto,
        fontSize: 20,
        fontWeight: "700",
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
        marginBottom: 16
    },
    opcao: {
        backgroundColor: oCores.cFundoSuave,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    opcaoSelecionada: {
        backgroundColor: oCores.cPrimariaSuave
    },
    opcaoTexto: {
        color: oCores.cTextoSuave,
        fontWeight: "600"
    },
    opcaoTextoSelecionado: {
        color: oCores.cPrimaria
    },
    limpar: {
        alignItems: "center",
        flexDirection: "row",
        gap: 16,
        justifyContent: "center",
        marginTop: 16
    }
});
