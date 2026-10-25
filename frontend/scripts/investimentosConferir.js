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

const oInvestimento = moduloCarregar(
    path.join(__dirname, "..", "src", "services", "investimentoService.js"),
    ["investimentoAutorizar", "investimentoListar", "investimentoBuscar", "investimentoSincronizarFalharDefinir"],
    {
        atrasoSimular() {
            return Promise.resolve();
        }
    }
);

function conferir(lCondicao, cMensagem) {
    if (!lCondicao) {
        throw new Error(cMensagem);
    }
}

async function executar() {
    const oVazio = await oInvestimento.investimentoListar(1);
    conferir(!oVazio.lBancoCentral && !oVazio.lB3 && oVazio.mInvestimentos.length === 0, "sem autorização a carteira fica vazia");

    await oInvestimento.investimentoAutorizar(1, { lBancoCentral: true, lB3: false });
    const oBanco = await oInvestimento.investimentoListar(1);
    conferir(
        oBanco.mInvestimentos.length === 2 && oBanco.mInvestimentos.every((oItem) => oItem.cInstituicao === "Banco Central"),
        "Banco Central devolve a carteira de exemplo"
    );

    await oInvestimento.investimentoAutorizar(1, { lBancoCentral: true, lB3: true });
    const oCompleta = await oInvestimento.investimentoListar(1);
    const oExtremo = oCompleta.mInvestimentos.find((oItem) => oItem.nValorAtual === 9999999.99);
    conferir(oCompleta.mInvestimentos.length === 5 && oExtremo && oExtremo.cAtivo.length > 40, "carteira com valor extremo");
    conferir(oCompleta.mInvestimentos.every((oItem) => oItem.cAtivo && oItem.nQuantidade && oItem.nValorInvestido && oItem.nValorAtual), "ativo, quantidade e valores");

    const oPetr = await oInvestimento.investimentoBuscar(1, 3);
    conferir(oPetr.nId === 3 && oPetr.cAtivo === "PETR4", "detalhe pelo nInvestimentoId");

    oInvestimento.investimentoSincronizarFalharDefinir(1, true);
    const oOutraDuranteFalha = await oInvestimento.investimentoListar(2);
    conferir(oOutraDuranteFalha.mInvestimentos.length === 0, "falha não vaza para outra conta");
    let lFalhou = false;

    try {
        await oInvestimento.investimentoListar(1);
    } catch (oErro) {
        lFalhou = oErro.message === "Não foi possível sincronizar com a instituição.";
    }

    conferir(lFalhou, "falha da instituição");
    conferir((await oInvestimento.investimentoListar(1)).mInvestimentos.length === 5, "nova tentativa conclui");

    const oOutraConta = await oInvestimento.investimentoListar(2);
    conferir(oOutraConta.mInvestimentos.length === 0, "outra conta sem autorização");
    console.log("investimentos conferido");
}

executar().catch((oErro) => {
    console.error(oErro);
    process.exit(1);
});
