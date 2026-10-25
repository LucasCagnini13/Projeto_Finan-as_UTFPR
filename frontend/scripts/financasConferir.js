const fs = require("fs");
const path = require("path");
const vm = require("vm");

function moduloCarregar(cCaminho, mNomes, oExtras) {
    const cCodigo = fs
        .readFileSync(cCaminho, "utf8")
        .replace(/^\s*import[\s\S]*?from\s+["'][^"']+["'];\s*$/gm, "")
        .replace(/^export /gm, "");
    const oContexto = { ...oExtras, console, setTimeout, Promise, Number, String, Boolean, Date, Error, Object };
    vm.runInNewContext(`${cCodigo}\nthis.oApi = { ${mNomes.join(", ")} };`, oContexto);
    return oContexto.oApi;
}

const cServicos = path.join(__dirname, "..", "src", "services");
const oValor = moduloCarregar(
    path.join(cServicos, "valorFormatar.js"),
    ["valorFormatar", "valorInterpretar", "valorMascaraAplicar", "valorMascaraDeNumero"],
    {}
);
const oMemoria = moduloCarregar(
    path.join(cServicos, "memoriaFinanceira.js"),
    [
        "saldoCopiar",
        "transacaoListaCopiar",
        "transacaoMemoriaCriar",
        "transacaoMemoriaAtualizar",
        "transacaoMemoriaExcluir",
        "transacaoBuscarCopia",
        "transacaoComprovanteDefinir",
        "transacaoListarFalharDefinir",
        "rendaMemoriaIncluir",
        "transacaoListarFalharConsumir",
        "categoriaMemoriaIncluir"
    ],
    {}
);
const oTransacao = moduloCarregar(
    path.join(cServicos, "transacaoService.js"),
    ["transacaoFiltrar", "transacaoListar", "transacaoCriar", "dataIsoMontar", "dataMascaraAplicar"],
    {
        atrasoSimular() {
            return Promise.resolve();
        },
        ...oValor,
        ...oMemoria
    }
);

function conferir(lCondicao, cMensagem) {
    if (!lCondicao) {
        throw new Error(cMensagem);
    }
}

async function executar() {
    const mTransacoes = oMemoria.transacaoListaCopiar(1);
    const oExtremo = mTransacoes.find((oItem) => oItem.nValor === 9999999.99);
    conferir(mTransacoes.length === 5 && oExtremo && oExtremo.cDescricao.length > 40, "lista com valor extremo");
    conferir(oMemoria.saldoCopiar(1).nSaldo === 3250, "saldo inicial da demonstração");

    const mVazio = oTransacao.transacaoFiltrar(mTransacoes, {
        cPeriodoInicio: "2026-01-01",
        cPeriodoFim: "2026-01-31",
        nCategoriaId: null,
        cTipo: "",
        cValorMin: "",
        cValorMax: ""
    });
    conferir(mVazio.length === 0, "filtro sem resultado");
    conferir(oTransacao.dataIsoMontar("22/10/2026") === "2026-10-22", "data do filtro");
    conferir(oTransacao.dataIsoMontar("31/02/2026") === "" && oTransacao.dataIsoMontar("31/04/2026") === "", "data impossível");
    conferir(oTransacao.dataIsoMontar("29/02/2024") === "2024-02-29", "ano bissexto");
    conferir(oTransacao.dataMascaraAplicar("24102026") === "24/10/2026", "barras da data");
    conferir(oTransacao.dataIsoMontar(oTransacao.dataMascaraAplicar("24102026")) === "2026-10-24", "data mascarada");
    conferir(oValor.valorMascaraAplicar("1400") === "14,00", "vírgula automática");
    conferir(oValor.valorMascaraAplicar("140000") === "1.400,00", "ponto de milhar");
    conferir(oValor.valorInterpretar("1.400,00") === 1400, "máscara volta ao número");
    conferir(oValor.valorMascaraDeNumero(962.5) === "962,50", "edição formatada");
    const mPorValor = oTransacao.transacaoFiltrar(mTransacoes, {
        cPeriodoInicio: "",
        cPeriodoFim: "",
        nCategoriaId: null,
        cTipo: "",
        cValorMin: "1.000,00",
        cValorMax: ""
    });
    conferir(mPorValor.every((oItem) => oItem.nValor >= 1000), "filtro entende o ponto de milhar");

    const oCriada = await oTransacao.transacaoCriar(1, {
        cDescricao: "Café",
        nValor: 10,
        lEntrada: false,
        cData: "2026-10-25",
        cLocal: "Padaria",
        nCategoriaId: 1,
        cCategoria: "Alimentação"
    });
    conferir(oCriada.lEntrada === false && oMemoria.saldoCopiar(1).nSaldo === 3240, "saída altera o saldo");
    const oAlimentacao = oMemoria.saldoCopiar(1).mCategorias.find((oCategoria) => oCategoria.nId === 1);
    conferir(oAlimentacao && oAlimentacao.nValor === 972.5 && oAlimentacao.nPercentual !== 55, "fatia acompanha a saída");

    const oEditada = oMemoria.transacaoMemoriaAtualizar(1, {
        ...oCriada,
        nValor: 15,
        cDescricao: "Café",
        cLocal: "Padaria",
        cCategoria: "Alimentação"
    });
    conferir(oEditada.lSucesso && oMemoria.saldoCopiar(1).nSaldo === 3235, "edição altera o saldo");

    const oExcluida = oMemoria.transacaoMemoriaExcluir(1, oCriada.nId);
    conferir(oExcluida.lSucesso && oMemoria.saldoCopiar(1).nSaldo === 3250, "exclusão devolve o saldo");

    oMemoria.transacaoListarFalharDefinir(1, true);
    let lFalhou = false;

    try {
        await oTransacao.transacaoListar(1);
    } catch (oErro) {
        lFalhou = oErro.message === "Não foi possível carregar os lançamentos.";
    }

    conferir(lFalhou, "falha da consulta");
    conferir((await oTransacao.transacaoListar(1)).length === 5, "nova tentativa conclui");
    const oRenda = oMemoria.rendaMemoriaIncluir(1, { cDescricao: "Freelance", nValor: 100, lRecorrente: false });
    const oSaldoRenda = oMemoria.saldoCopiar(1);
    conferir(oRenda.nLancamentoId && oSaldoRenda.nEntradas === 5100 && oSaldoRenda.nSaldo === 3350, "renda entra no saldo");
    console.log("financas conferido");
}

executar().catch((oErro) => {
    console.error(oErro);
    process.exit(1);
});
