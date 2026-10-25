import { atrasoSimular } from "./atrasoSimular";
import { categoriaListaCopiar, categoriaMemoriaIncluir } from "./memoriaFinanceira";

export async function categoriaListar(nUsuarioId) {
    await atrasoSimular();
    return categoriaListaCopiar(nUsuarioId);
}

export async function categoriaCriar(nUsuarioId, cNome) {
    await atrasoSimular();

    if (!cNome || !cNome.trim()) {
        throw new Error("Informe o nome da categoria.");
    }

    return categoriaMemoriaIncluir(nUsuarioId, cNome);
}
