import { atrasoSimular } from "./atrasoSimular";
import { saldoCopiar } from "./memoriaFinanceira";

export async function saldoObter(nUsuarioId) {
    await atrasoSimular();
    return saldoCopiar(nUsuarioId);
}
