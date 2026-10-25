import { atrasoSimular } from "./atrasoSimular";
import { valorInterpretar } from "./valorFormatar";
import {
    transacaoBuscarCopia,
    transacaoComprovanteDefinir,
    transacaoListarFalharConsumir,
    transacaoListaCopiar,
    transacaoMemoriaAtualizar,
    transacaoMemoriaCriar,
    transacaoMemoriaExcluir
} from "./memoriaFinanceira";

export function dataIsoMontar(cData) {
    const mPartes = cData.trim().split("/");

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

    if (nAno < 2000 || oData.getFullYear() !== nAno || oData.getMonth() !== nMes - 1 || oData.getDate() !== nDia) {
        return "";
    }

    return `${cAno}-${cMes}-${cDia}`;
}

export function dataMascaraAplicar(cData) {
    const cDigitos = String(cData ?? "").replace(/\D/g, "").slice(0, 8);

    if (cDigitos.length <= 2) {
        return cDigitos;
    }

    if (cDigitos.length <= 4) {
        return `${cDigitos.slice(0, 2)}/${cDigitos.slice(2)}`;
    }

    return `${cDigitos.slice(0, 2)}/${cDigitos.slice(2, 4)}/${cDigitos.slice(4)}`;
}

export function dataExibir(cDataIso) {
    if (!cDataIso || cDataIso.length < 10) {
        return cDataIso || "";
    }

    const [cAno, cMes, cDia] = cDataIso.split("-");
    return `${cDia}/${cMes}/${cAno}`;
}

export function dataVencimentoExibir(cDataIso) {
    if (!cDataIso || !/^\d{4}-\d{2}-\d{2}$/.test(cDataIso)) {
        return cDataIso || "";
    }

    const [cAno, cMes, cDia] = cDataIso.split("-").map(Number);
    const oAlvo = new Date(cAno, cMes - 1, cDia);
    const oHoje = new Date();
    oHoje.setHours(0, 0, 0, 0);
    oAlvo.setHours(0, 0, 0, 0);
    const nDias = Math.round((oAlvo.getTime() - oHoje.getTime()) / 86400000);

    if (nDias > 1) {
        return `Vence em ${nDias} dias`;
    }

    if (nDias === 1) {
        return "Vence amanhã";
    }

    if (nDias === 0) {
        return "Vence hoje";
    }

    if (nDias === -1) {
        return "Venceu ontem";
    }

    return `Venceu há ${Math.abs(nDias)} dias`;
}

export function transacaoFiltrar(mTransacoes, oFiltro) {
    const nValorMin = valorInterpretar(oFiltro.cValorMin);
    const nValorMax = valorInterpretar(oFiltro.cValorMax);

    return mTransacoes.filter((oTransacao) => {
        if (oFiltro.cPeriodoInicio && oTransacao.cData < oFiltro.cPeriodoInicio) {
            return false;
        }

        if (oFiltro.cPeriodoFim && oTransacao.cData > oFiltro.cPeriodoFim) {
            return false;
        }

        if (oFiltro.nCategoriaId && oTransacao.nCategoriaId !== oFiltro.nCategoriaId) {
            return false;
        }

        if (oFiltro.cTipo === "entrada" && !oTransacao.lEntrada) {
            return false;
        }

        if (oFiltro.cTipo === "saida" && oTransacao.lEntrada) {
            return false;
        }

        if (nValorMin !== null && !Number.isNaN(nValorMin) && oTransacao.nValor < nValorMin) {
            return false;
        }

        if (nValorMax !== null && !Number.isNaN(nValorMax) && oTransacao.nValor > nValorMax) {
            return false;
        }

        return true;
    });
}

function lancamentoValidar(oLancamento) {
    if (!oLancamento.cDescricao || !oLancamento.cDescricao.trim()) {
        return { cCampo: "cDescricao", cMensagem: "Informe a descrição." };
    }

    if (!oLancamento.nValor || oLancamento.nValor <= 0) {
        return { cCampo: "cValor", cMensagem: "Informe um valor maior que zero." };
    }

    if (!oLancamento.cData) {
        return { cCampo: "cData", cMensagem: "Informe uma data válida." };
    }

    if (!oLancamento.cLocal || !oLancamento.cLocal.trim()) {
        return { cCampo: "cLocal", cMensagem: "Informe o local." };
    }

    if (!oLancamento.nCategoriaId) {
        return { cCampo: "nCategoriaId", cMensagem: "Escolha uma categoria." };
    }

    return null;
}

export async function transacaoListar(nUsuarioId) {
    await atrasoSimular();

    if (transacaoListarFalharConsumir(nUsuarioId)) {
        throw new Error("Não foi possível carregar os lançamentos.");
    }

    return transacaoListaCopiar(nUsuarioId);
}

export async function transacaoBuscar(nUsuarioId, nLancamentoId) {
    await atrasoSimular(300);
    const oTransacao = transacaoBuscarCopia(nUsuarioId, nLancamentoId);

    if (!oTransacao) {
        throw new Error("Lançamento não encontrado.");
    }

    return oTransacao;
}

export async function transacaoCriar(nUsuarioId, oLancamento) {
    await atrasoSimular();
    const oErro = lancamentoValidar(oLancamento);

    if (oErro) {
        throw Object.assign(new Error(oErro.cMensagem), { cCampo: oErro.cCampo });
    }

    return transacaoMemoriaCriar(nUsuarioId, oLancamento);
}

export async function transacaoAtualizar(nUsuarioId, oLancamento) {
    await atrasoSimular();
    const oErro = lancamentoValidar(oLancamento);

    if (oErro) {
        throw Object.assign(new Error(oErro.cMensagem), { cCampo: oErro.cCampo });
    }

    const oResultado = transacaoMemoriaAtualizar(nUsuarioId, oLancamento);

    if (!oResultado.lSucesso) {
        throw new Error(oResultado.cMensagem);
    }

    return oResultado.oTransacao;
}

export async function transacaoExcluir(nUsuarioId, nLancamentoId) {
    await atrasoSimular();
    const oResultado = transacaoMemoriaExcluir(nUsuarioId, nLancamentoId);

    if (!oResultado.lSucesso) {
        throw new Error(oResultado.cMensagem);
    }
}

export async function transacaoComprovanteAnexar(nUsuarioId, nLancamentoId, cComprovanteUri) {
    await atrasoSimular(300);
    const oResultado = transacaoComprovanteDefinir(nUsuarioId, nLancamentoId, cComprovanteUri);

    if (!oResultado.lSucesso) {
        throw new Error(oResultado.cMensagem);
    }

    return oResultado.oTransacao;
}

