import { atrasoSimular } from "./atrasoSimular";
import { rendaListaCopiar, rendaMemoriaIncluir } from "./memoriaFinanceira";

export async function rendaListar(nUsuarioId) {
    await atrasoSimular();
    return rendaListaCopiar(nUsuarioId);
}

export async function rendaCriar(nUsuarioId, oRenda) {
    await atrasoSimular();

    if (!oRenda.cDescricao || !oRenda.cDescricao.trim()) {
        throw new Error("Informe a descrição.");
    }

    if (!oRenda.nValor || oRenda.nValor <= 0) {
        throw new Error("Informe um valor maior que zero.");
    }

    return rendaMemoriaIncluir(nUsuarioId, oRenda);
}
