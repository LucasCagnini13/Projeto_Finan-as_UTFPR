import { atrasoSimular } from "./atrasoSimular";

const mCarteira = [
    {
        nId: 1,
        cAtivo: "Tesouro Selic 2029",
        nQuantidade: 1.5,
        nValorInvestido: 1500,
        nValorAtual: 1620,
        cInstituicao: "Banco Central"
    },
    {
        nId: 2,
        cAtivo: "CDB 110% do CDI",
        nQuantidade: 1,
        nValorInvestido: 3000,
        nValorAtual: 3180,
        cInstituicao: "Banco Central"
    },
    {
        nId: 3,
        cAtivo: "PETR4",
        nQuantidade: 100,
        nValorInvestido: 3200,
        nValorAtual: 3450,
        cInstituicao: "B3"
    },
    {
        nId: 4,
        cAtivo: "IVVB11",
        nQuantidade: 8,
        nValorInvestido: 2000,
        nValorAtual: 2140,
        cInstituicao: "B3"
    },
    {
        nId: 5,
        cAtivo: "Fundo de índice com nome muito longo para testar o limite da linha da carteira de exemplo",
        nQuantidade: 1,
        nValorInvestido: 9999999.99,
        nValorAtual: 9999999.99,
        cInstituicao: "B3"
    }
];

const mAutorizacoes = {};
const mSincronizarFalhar = {};

function autorizacaoObter(nUsuarioId) {
    if (!mAutorizacoes[nUsuarioId]) {
        mAutorizacoes[nUsuarioId] = {
            lBancoCentral: false,
            lB3: false
        };
    }

    return mAutorizacoes[nUsuarioId];
}

function investimentoCopiar(oInvestimento) {
    return { ...oInvestimento };
}

function investimentoFiltrar(oAutorizacao) {
    return mCarteira
        .filter((oInvestimento) => {
            if (oInvestimento.cInstituicao === "Banco Central") {
                return oAutorizacao.lBancoCentral;
            }

            if (oInvestimento.cInstituicao === "B3") {
                return oAutorizacao.lB3;
            }

            return false;
        })
        .map(investimentoCopiar);
}

export function investimentoSincronizarFalharDefinir(nUsuarioId, lFalhar) {
    mSincronizarFalhar[nUsuarioId] = lFalhar;
}

function sincronizarFalharConsumir(nUsuarioId) {
    if (!mSincronizarFalhar[nUsuarioId]) {
        return false;
    }

    mSincronizarFalhar[nUsuarioId] = false;
    return true;
}

export async function investimentoAutorizar(nUsuarioId, oAutorizacao) {
    const oAtual = autorizacaoObter(nUsuarioId);
    oAtual.lBancoCentral = Boolean(oAutorizacao.lBancoCentral);
    oAtual.lB3 = Boolean(oAutorizacao.lB3);
    return { lBancoCentral: oAtual.lBancoCentral, lB3: oAtual.lB3 };
}

export async function investimentoListar(nUsuarioId) {
    await atrasoSimular();

    if (sincronizarFalharConsumir(nUsuarioId)) {
        throw new Error("Não foi possível sincronizar com a instituição.");
    }

    const oAutorizacao = autorizacaoObter(nUsuarioId);

    return {
        lBancoCentral: oAutorizacao.lBancoCentral,
        lB3: oAutorizacao.lB3,
        mInvestimentos: investimentoFiltrar(oAutorizacao)
    };
}

export async function investimentoBuscar(nUsuarioId, nInvestimentoId) {
    await atrasoSimular(300);
    const oInvestimento = investimentoFiltrar(autorizacaoObter(nUsuarioId)).find((oItem) => oItem.nId === nInvestimentoId);

    if (!oInvestimento) {
        throw new Error("Ativo não encontrado.");
    }

    return oInvestimento;
}
