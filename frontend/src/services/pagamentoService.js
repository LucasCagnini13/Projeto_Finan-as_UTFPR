import { atrasoSimular } from "./atrasoSimular";
import { dataIsoMontar } from "./transacaoService";
import {
    pagamentoBuscarCopia,
    pagamentoListarFalharConsumir,
    pagamentoListaCopiar,
    pagamentoMemoriaIncluir,
    pagamentoMemoriaQuitar
} from "./memoriaFinanceira";

export async function pagamentoListar(nUsuarioId) {
    await atrasoSimular();

    if (pagamentoListarFalharConsumir(nUsuarioId)) {
        throw new Error("Não foi possível carregar os pagamentos.");
    }

    return pagamentoListaCopiar(nUsuarioId);
}

export async function pagamentoBuscar(nUsuarioId, nPagamentoId) {
    await atrasoSimular(300);
    const oPagamento = pagamentoBuscarCopia(nUsuarioId, nPagamentoId);

    if (!oPagamento) {
        throw new Error("Pagamento não encontrado.");
    }

    return oPagamento;
}

export async function pagamentoCriar(nUsuarioId, oPagamento) {
    await atrasoSimular();

    if (!oPagamento.cDescricao || !oPagamento.cDescricao.trim()) {
        throw new Error("Informe a descrição.");
    }

    if (!oPagamento.nValor || oPagamento.nValor <= 0) {
        throw new Error("Informe um valor maior que zero.");
    }

    if (!oPagamento.cPeriodicidade) {
        throw new Error("Informe a periodicidade.");
    }

    const cVencimentoIso = dataIsoMontar(oPagamento.cVencimento || "");

    if (!cVencimentoIso) {
        throw new Error("Informe uma data válida.");
    }

    if (oPagamento.nLembreteDias === null || oPagamento.nLembreteDias < 0) {
        throw new Error("Informe os dias do lembrete.");
    }

    return pagamentoMemoriaIncluir(nUsuarioId, { ...oPagamento, cVencimento: cVencimentoIso });
}

export async function pagamentoQuitar(nUsuarioId, nPagamentoId) {
    await atrasoSimular();
    const oResultado = pagamentoMemoriaQuitar(nUsuarioId, nPagamentoId);

    if (!oResultado.lSucesso) {
        throw new Error(oResultado.cMensagem);
    }

    return oResultado.oPagamento;
}
