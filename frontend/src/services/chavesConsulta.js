export function usuarioChaveAtual() {
    return ["usuario", "atual"];
}

export function saldoChaveObter(nUsuarioId) {
    return ["saldo", "obter", nUsuarioId];
}

export function transacaoChaveListar(nUsuarioId) {
    return ["transacao", "listar", nUsuarioId];
}

export function categoriaChaveListar(nUsuarioId) {
    return ["categoria", "listar", nUsuarioId];
}

export function transacaoChaveBuscar(nUsuarioId, nLancamentoId) {
    return ["transacao", "buscar", nUsuarioId, nLancamentoId];
}

export function pagamentoChaveListar(nUsuarioId) {
    return ["pagamento", "listar", nUsuarioId];
}

export function pagamentoChaveBuscar(nUsuarioId, nPagamentoId) {
    return ["pagamento", "buscar", nUsuarioId, nPagamentoId];
}

export function rendaChaveListar(nUsuarioId) {
    return ["renda", "listar", nUsuarioId];
}

export function investimentoChaveListar(nUsuarioId) {
    return ["investimento", "listar", nUsuarioId];
}

export function investimentoChaveBuscar(nUsuarioId, nInvestimentoId) {
    return ["investimento", "buscar", nUsuarioId, nInvestimentoId];
}
