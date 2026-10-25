const fs = require("fs");
const path = require("path");
const vm = require("vm");

function moduloCarregar(cCaminho, mNomes, oExtras) {
    const cCodigo = fs
        .readFileSync(cCaminho, "utf8")
        .replace(/^\s*import[\s\S]*?from\s+["'][^"']+["'];\s*$/gm, "")
        .replace(/^export /gm, "");

    const oContexto = {
        ...oExtras,
        console,
        setTimeout,
        Promise
    };

    vm.runInNewContext(`${cCodigo}\nthis.oApi = { ${mNomes.join(", ")} };`, oContexto);
    return oContexto.oApi;
}

const cServicos = path.join(__dirname, "..", "src", "services");
const oValor = moduloCarregar(path.join(cServicos, "valorFormatar.js"), ["valorFormatar", "valorInterpretar"], {});
const oMemoria = moduloCarregar(
    path.join(cServicos, "memoriaFinanceira.js"),
    [
        "saldoCopiar",
        "pagamentoListaCopiar",
        "pagamentoMemoriaIncluir",
        "pagamentoMemoriaQuitar",
        "transacaoListaCopiar",
        "pagamentoListarFalharDefinir",
        "pagamentoListarFalharConsumir"
    ],
    {}
);
const oPagamento = moduloCarregar(
    path.join(cServicos, "pagamentoService.js"),
    ["pagamentoListar", "pagamentoCriar", "pagamentoQuitar"],
    {
        atrasoSimular() {
            return Promise.resolve();
        },
        ...oMemoria
    }
);

function conferir(lCondicao, cMensagem) {
    if (!lCondicao) {
        throw new Error(cMensagem);
    }
}

async function executar() {
    conferir(oValor.valorFormatar(3250) === "R$ 3.250,00", "saldo formatado");
    conferir(oValor.valorFormatar(1750) === "R$ 1.750,00", "saídas formatadas");
    conferir(oValor.valorFormatar(9999999.99) === "R$ 9.999.999,99", "valor extremo");
    conferir(oValor.valorInterpretar("80,00") === 80, "valor digitado");

    const oSaldo = oMemoria.saldoCopiar(1);
    conferir(oSaldo.nSaldo === 3250 && oSaldo.nEntradas === 5000 && oSaldo.nSaidas === 1750, "resumo da demonstração");
    conferir(oMemoria.saldoCopiar(2).nSaldo === 0 && oMemoria.pagamentoListaCopiar(2).length === 0, "conta nova vazia");

    const mAbertos = oMemoria.pagamentoListaCopiar(1).filter((oPagamento) => !oPagamento.lPago);
    conferir(mAbertos[0].cDescricao === "Internet" && mAbertos[1].cDescricao === "Academia", "dois próximos");

    const oQuitado = oMemoria.pagamentoMemoriaQuitar(1, 1);
    conferir(oQuitado.lSucesso && oQuitado.oPagamento.lPago, "baixa do pagamento");
    conferir(oMemoria.saldoCopiar(1).nSaldo === 3150 && oMemoria.saldoCopiar(1).nSaidas === 1850, "saldo após a baixa");
    conferir(oMemoria.saldoCopiar(1).nTotalCategorias === 1750, "pagamento sem categoria não muda o gráfico");
    const oSaida = oMemoria.transacaoListaCopiar(1)[0];
    conferir(oSaida.cDescricao === "Internet" && oSaida.lEntrada === false, "saída registrada");
    conferir(!oMemoria.pagamentoMemoriaQuitar(1, 1).lSucesso, "baixa repetida");

    const oNovo = oMemoria.pagamentoMemoriaIncluir(2, {
        cDescricao: "Aluguel",
        nValor: 900,
        cVencimento: "10/11/2026",
        cPeriodicidade: "Mensal",
        nLembreteDias: 3
    });
    conferir(oNovo.cDescricao === "Aluguel" && oMemoria.pagamentoListaCopiar(1).length === 3, "conta nova não altera a demonstração");

    oMemoria.pagamentoListarFalharDefinir(1, true);
    const mOutraConta = await oPagamento.pagamentoListar(2);
    conferir(mOutraConta.length === 1, "falha não vaza para outra conta");
    let lFalhou = false;

    try {
        await oPagamento.pagamentoListar(1);
    } catch (oErro) {
        lFalhou = oErro.message === "Não foi possível carregar os pagamentos.";
    }

    conferir(lFalhou, "falha simulada");
    const mLista = await oPagamento.pagamentoListar(1);
    conferir(mLista.length === 3, "nova tentativa conclui");

    console.log("pagamento conferido");
}

executar().catch((oErro) => {
    console.error(oErro);
    process.exit(1);
});
