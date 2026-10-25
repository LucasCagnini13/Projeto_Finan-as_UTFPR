const mPagamentoFalhar = {};
const mTransacaoFalhar = {};
const mCoresCategoria = ["#5C5CFF", "#F5A524", "#8B7CFF", "#1FA971", "#F0445A"];

function carteiraVazia() {
    return {
        oSaldo: {
            nSaldo: 0,
            nEntradas: 0,
            nSaidas: 0,
            nTotalCategorias: 0,
            cAtualizado: "Sem movimentação",
            mCategorias: []
        },
        mPagamentos: [],
        mTransacoes: [],
        mCategorias: [],
        mRendas: [],
        nProximoPagamentoId: 1,
        nProximaTransacaoId: 1,
        nProximaCategoriaId: 1,
        nProximaRendaId: 1
    };
}

function carteiraDemonstracao() {
    return {
        oSaldo: {
            nSaldo: 3250,
            nEntradas: 5000,
            nSaidas: 1750,
            nTotalCategorias: 1750,
            cAtualizado: "Atualizado há 5 minutos",
            mCategorias: [
                { nId: 1, cNome: "Alimentação", nValor: 962.5, cCor: "#5C5CFF" },
                { nId: 2, cNome: "Transporte", nValor: 437.5, cCor: "#F5A524" },
                { nId: 3, cNome: "Lazer", nValor: 350, cCor: "#8B7CFF" }
            ]
        },
        mPagamentos: [
            {
                nId: 1,
                cDescricao: "Internet",
                nValor: 100,
                cVencimento: dataIsoSomarDias(3),
                cPeriodicidade: "Mensal",
                nLembreteDias: 1,
                lPago: false,
                cIcone: "wifi-outline"
            },
            {
                nId: 2,
                cDescricao: "Academia",
                nValor: 80,
                cVencimento: dataIsoSomarDias(5),
                cPeriodicidade: "Mensal",
                nLembreteDias: 2,
                lPago: false,
                cIcone: "fitness-outline"
            },
            {
                nId: 3,
                cDescricao: "Assinatura anual do plano familiar com descrição muito longa para testar o limite da linha",
                nValor: 9999999.99,
                cVencimento: dataIsoSomarDias(20),
                cPeriodicidade: "Anual",
                nLembreteDias: 5,
                lPago: false,
                cIcone: "document-text-outline"
            }
        ],
        nProximoPagamentoId: 4,
        nProximaTransacaoId: 6,
        nProximaCategoriaId: 4,
        nProximaRendaId: 2,
        mCategorias: [
            { nId: 1, cNome: "Alimentação" },
            { nId: 2, cNome: "Transporte" },
            { nId: 3, cNome: "Lazer" }
        ],
        mRendas: [
            { nId: 1, cDescricao: "Salário", nValor: 5000, lRecorrente: true, nLancamentoId: 1 }
        ],
        mTransacoes: [
            {
                nId: 1,
                cDescricao: "Salário",
                nValor: 5000,
                lEntrada: true,
                cData: "2026-10-05",
                cLocal: "Empresa",
                nCategoriaId: null,
                cCategoria: "Renda",
                cComprovanteUri: ""
            },
            {
                nId: 2,
                cDescricao: "Mercado",
                nValor: 962.5,
                lEntrada: false,
                cData: "2026-10-12",
                cLocal: "Supermercado",
                nCategoriaId: 1,
                cCategoria: "Alimentação",
                cComprovanteUri: ""
            },
            {
                nId: 3,
                cDescricao: "Uber",
                nValor: 437.5,
                lEntrada: false,
                cData: "2026-10-18",
                cLocal: "Centro",
                nCategoriaId: 2,
                cCategoria: "Transporte",
                cComprovanteUri: ""
            },
            {
                nId: 4,
                cDescricao: "Cinema",
                nValor: 350,
                lEntrada: false,
                cData: "2026-10-21",
                cLocal: "Shopping",
                nCategoriaId: 3,
                cCategoria: "Lazer",
                cComprovanteUri: ""
            },
            {
                nId: 5,
                cDescricao: "Compra extraordinária de equipamento profissional com descrição muito longa para testar o limite da linha",
                nValor: 9999999.99,
                lEntrada: false,
                cData: "2026-10-22",
                cLocal: "Loja online",
                nCategoriaId: 3,
                cCategoria: "Lazer",
                cComprovanteUri: "",
                lSomenteExibicao: true
            }
        ]
    };
}

const mCarteiras = {
    1: carteiraDemonstracao()
};

function carteiraObter(nUsuarioId) {
    if (!mCarteiras[nUsuarioId]) {
        mCarteiras[nUsuarioId] = carteiraVazia();
    }

    return mCarteiras[nUsuarioId];
}

function categoriaPercentualMontar(mCategorias) {
    const mComValor = mCategorias
        .filter((oCategoria) => oCategoria.nValor > 0)
        .map((oCategoria) => ({ ...oCategoria }));
    const nTotal = mComValor.reduce((nSoma, oCategoria) => nSoma + oCategoria.nValor, 0);
    let nAcumulado = 0;

    mComValor.forEach((oCategoria, nIndice) => {
        if (nTotal <= 0 || nIndice === mComValor.length - 1) {
            oCategoria.nPercentual = Math.max(0, Math.round((100 - nAcumulado) * 10) / 10);
            return;
        }

        const nPercentual = Math.round((oCategoria.nValor / nTotal) * 1000) / 10;
        oCategoria.nPercentual = nPercentual;
        nAcumulado = Math.round((nAcumulado + nPercentual) * 10) / 10;
    });

    return { nTotal, mCategorias: mComValor };
}

function categoriaSaldoGarantir(oSaldo, nCategoriaId, cNome) {
    let oCategoria = oSaldo.mCategorias.find((oItem) => oItem.nId === nCategoriaId);

    if (!oCategoria) {
        oCategoria = {
            nId: nCategoriaId,
            cNome: cNome || "Categoria",
            nValor: 0,
            cCor: mCoresCategoria[oSaldo.mCategorias.length % mCoresCategoria.length]
        };
        oSaldo.mCategorias.push(oCategoria);
    }

    return oCategoria;
}

function dataIsoSomarDias(nDias) {
    const oData = new Date();
    oData.setHours(0, 0, 0, 0);
    oData.setDate(oData.getDate() + nDias);
    const cMes = String(oData.getMonth() + 1).padStart(2, "0");
    const cDia = String(oData.getDate()).padStart(2, "0");
    return `${oData.getFullYear()}-${cMes}-${cDia}`;
}

export function saldoCopiar(nUsuarioId) {
    const oSaldo = carteiraObter(nUsuarioId).oSaldo;
    const oGrafico = categoriaPercentualMontar(oSaldo.mCategorias);

    return {
        ...oSaldo,
        nTotalCategorias: oGrafico.nTotal,
        mCategorias: oGrafico.mCategorias
    };
}

export function saldoBaixar(nUsuarioId, nValor) {
    const oSaldo = carteiraObter(nUsuarioId).oSaldo;
    oSaldo.nSaldo -= nValor;
    oSaldo.nSaidas += nValor;
    oSaldo.cAtualizado = "Atualizado agora";
}

export function pagamentoListaCopiar(nUsuarioId) {
    return carteiraObter(nUsuarioId).mPagamentos.map((oPagamento) => ({ ...oPagamento }));
}

export function pagamentoBuscarCopia(nUsuarioId, nPagamentoId) {
    const oPagamento = carteiraObter(nUsuarioId).mPagamentos.find((oItem) => oItem.nId === nPagamentoId);
    return oPagamento ? { ...oPagamento } : null;
}

export function pagamentoMemoriaIncluir(nUsuarioId, oPagamento) {
    const oCarteira = carteiraObter(nUsuarioId);
    const oNovo = {
        nId: oCarteira.nProximoPagamentoId,
        cDescricao: oPagamento.cDescricao.trim(),
        nValor: oPagamento.nValor,
        cVencimento: dataTextoParaIso(oPagamento.cVencimento),
        cPeriodicidade: oPagamento.cPeriodicidade,
        nLembreteDias: oPagamento.nLembreteDias,
        lPago: false,
        cIcone: "receipt-outline"
    };

    oCarteira.nProximoPagamentoId += 1;
    oCarteira.mPagamentos.push(oNovo);
    return { ...oNovo };
}

export function pagamentoMemoriaQuitar(nUsuarioId, nPagamentoId) {
    const oCarteira = carteiraObter(nUsuarioId);
    const oPagamento = oCarteira.mPagamentos.find((oItem) => oItem.nId === nPagamentoId);

    if (!oPagamento) {
        return { lSucesso: false, cMensagem: "Pagamento não encontrado." };
    }

    if (oPagamento.lPago) {
        return { lSucesso: false, cMensagem: "Este pagamento já foi registrado." };
    }

    oPagamento.lPago = true;
    saldoBaixar(nUsuarioId, oPagamento.nValor);
    transacaoIncluir(nUsuarioId, {
        cDescricao: oPagamento.cDescricao,
        nValor: oPagamento.nValor,
        lEntrada: false
    });

    return { lSucesso: true, oPagamento: { ...oPagamento } };
}

function dataTextoParaIso(cData) {
    const cTexto = String(cData || "").trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(cTexto)) {
        return cTexto;
    }

    const mPartes = cTexto.split("/");

    if (mPartes.length !== 3) {
        return "";
    }

    const [cDia, cMes, cAno] = mPartes;

    if (cDia.length !== 2 || cMes.length !== 2 || cAno.length !== 4) {
        return "";
    }

    const nDia = Number(cDia);
    const nMes = Number(cMes);
    const nAno = Number(cAno);
    const oData = new Date(nAno, nMes - 1, nDia);

    if (oData.getFullYear() !== nAno || oData.getMonth() !== nMes - 1 || oData.getDate() !== nDia) {
        return "";
    }

    return `${cAno}-${cMes}-${cDia}`;
}

function dataHojeIso() {
    const oData = new Date();
    const cMes = String(oData.getMonth() + 1).padStart(2, "0");
    const cDia = String(oData.getDate()).padStart(2, "0");
    return `${oData.getFullYear()}-${cMes}-${cDia}`;
}

function saldoLancamentoAplicar(nUsuarioId, oLancamento, nSinal) {
    if (oLancamento.lSomenteExibicao) {
        return;
    }

    const oSaldo = carteiraObter(nUsuarioId).oSaldo;
    const nValor = oLancamento.nValor * nSinal;

    if (oLancamento.lEntrada) {
        oSaldo.nEntradas += nValor;
        oSaldo.nSaldo += nValor;
    } else {
        oSaldo.nSaidas += nValor;
        oSaldo.nSaldo -= nValor;

        if (oLancamento.nCategoriaId) {
            const oCategoria = categoriaSaldoGarantir(oSaldo, oLancamento.nCategoriaId, oLancamento.cCategoria);
            oCategoria.nValor = Math.round((oCategoria.nValor + nValor) * 100) / 100;

            if (oCategoria.nValor < 0) {
                oCategoria.nValor = 0;
            }
        }
    }

    oSaldo.cAtualizado = "Atualizado agora";
}

function transacaoMontar(oCarteira, oTransacao) {
    return {
        nId: oCarteira.nProximaTransacaoId,
        cDescricao: oTransacao.cDescricao.trim(),
        nValor: oTransacao.nValor,
        lEntrada: Boolean(oTransacao.lEntrada),
        cData: oTransacao.cData || dataHojeIso(),
        cLocal: (oTransacao.cLocal || "").trim(),
        nCategoriaId: oTransacao.nCategoriaId || null,
        cCategoria: oTransacao.cCategoria || "",
        cComprovanteUri: oTransacao.cComprovanteUri || ""
    };
}

export function transacaoIncluir(nUsuarioId, oTransacao) {
    const oCarteira = carteiraObter(nUsuarioId);
    const oNova = transacaoMontar(oCarteira, oTransacao);

    oCarteira.nProximaTransacaoId += 1;
    oCarteira.mTransacoes.unshift(oNova);
    return { ...oNova };
}

export function transacaoMemoriaCriar(nUsuarioId, oTransacao) {
    const oNova = transacaoIncluir(nUsuarioId, oTransacao);
    saldoLancamentoAplicar(nUsuarioId, oNova, 1);
    return { ...oNova };
}

export function transacaoBuscarCopia(nUsuarioId, nLancamentoId) {
    const oTransacao = carteiraObter(nUsuarioId).mTransacoes.find((oItem) => oItem.nId === nLancamentoId);
    return oTransacao ? { ...oTransacao } : null;
}

export function transacaoMemoriaAtualizar(nUsuarioId, oTransacao) {
    const oCarteira = carteiraObter(nUsuarioId);
    const nIndice = oCarteira.mTransacoes.findIndex((oItem) => oItem.nId === oTransacao.nId);

    if (nIndice < 0) {
        return { lSucesso: false, cMensagem: "Lançamento não encontrado." };
    }

    const oAnterior = oCarteira.mTransacoes[nIndice];
    saldoLancamentoAplicar(nUsuarioId, oAnterior, -1);

    const oNova = {
        ...oAnterior,
        cDescricao: oTransacao.cDescricao.trim(),
        nValor: oTransacao.nValor,
        lEntrada: Boolean(oTransacao.lEntrada),
        cData: oTransacao.cData,
        cLocal: oTransacao.cLocal.trim(),
        nCategoriaId: oTransacao.nCategoriaId,
        cCategoria: oTransacao.cCategoria,
        lSomenteExibicao: oAnterior.lSomenteExibicao
    };

    oCarteira.mTransacoes[nIndice] = oNova;
    saldoLancamentoAplicar(nUsuarioId, oNova, 1);
    return { lSucesso: true, oTransacao: { ...oNova } };
}

export function transacaoMemoriaExcluir(nUsuarioId, nLancamentoId) {
    const oCarteira = carteiraObter(nUsuarioId);
    const nIndice = oCarteira.mTransacoes.findIndex((oItem) => oItem.nId === nLancamentoId);

    if (nIndice < 0) {
        return { lSucesso: false, cMensagem: "Lançamento não encontrado." };
    }

    const [oRemovida] = oCarteira.mTransacoes.splice(nIndice, 1);
    saldoLancamentoAplicar(nUsuarioId, oRemovida, -1);
    return { lSucesso: true };
}

export function transacaoComprovanteDefinir(nUsuarioId, nLancamentoId, cComprovanteUri) {
    const oTransacao = carteiraObter(nUsuarioId).mTransacoes.find((oItem) => oItem.nId === nLancamentoId);

    if (!oTransacao) {
        return { lSucesso: false, cMensagem: "Lançamento não encontrado." };
    }

    oTransacao.cComprovanteUri = cComprovanteUri;
    return { lSucesso: true, oTransacao: { ...oTransacao } };
}

export function categoriaListaCopiar(nUsuarioId) {
    return carteiraObter(nUsuarioId).mCategorias.map((oCategoria) => ({ ...oCategoria }));
}

export function categoriaMemoriaIncluir(nUsuarioId, cNome) {
    const oCarteira = carteiraObter(nUsuarioId);
    const oNova = {
        nId: oCarteira.nProximaCategoriaId,
        cNome: cNome.trim()
    };

    oCarteira.nProximaCategoriaId += 1;
    oCarteira.mCategorias.push(oNova);
    return { ...oNova };
}

export function rendaListaCopiar(nUsuarioId) {
    return carteiraObter(nUsuarioId).mRendas.map((oRenda) => ({ ...oRenda }));
}

export function rendaMemoriaIncluir(nUsuarioId, oRenda) {
    const oCarteira = carteiraObter(nUsuarioId);
    const oNova = {
        nId: oCarteira.nProximaRendaId,
        cDescricao: oRenda.cDescricao.trim(),
        nValor: oRenda.nValor,
        lRecorrente: Boolean(oRenda.lRecorrente)
    };

    oCarteira.nProximaRendaId += 1;
    const oLancamento = transacaoMemoriaCriar(nUsuarioId, {
        cDescricao: oNova.cDescricao,
        nValor: oNova.nValor,
        lEntrada: true,
        cCategoria: "Renda",
        cLocal: "Renda cadastrada"
    });
    oNova.nLancamentoId = oLancamento.nId;
    oCarteira.mRendas.push(oNova);
    return { ...oNova };
}

export function transacaoListaCopiar(nUsuarioId) {
    return carteiraObter(nUsuarioId).mTransacoes.map((oTransacao) => ({ ...oTransacao }));
}

export function pagamentoListarFalharDefinir(nUsuarioId, lFalhar) {
    mPagamentoFalhar[nUsuarioId] = lFalhar;
}

export function pagamentoListarFalharConsumir(nUsuarioId) {
    if (!mPagamentoFalhar[nUsuarioId]) {
        return false;
    }

    mPagamentoFalhar[nUsuarioId] = false;
    return true;
}

export function transacaoListarFalharDefinir(nUsuarioId, lFalhar) {
    mTransacaoFalhar[nUsuarioId] = lFalhar;
}

export function transacaoListarFalharConsumir(nUsuarioId) {
    if (!mTransacaoFalhar[nUsuarioId]) {
        return false;
    }

    mTransacaoFalhar[nUsuarioId] = false;
    return true;
}
