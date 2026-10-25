export function valorFormatar(nValor) {
    const nNumero = Number(nValor);
    const lNegativo = nNumero < 0;
    const nAbsoluto = Math.round(Math.abs(nNumero) * 100) / 100;
    const [cInteiro, cCentavos] = nAbsoluto.toFixed(2).split(".");
    const cMilhar = cInteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${lNegativo ? "-" : ""}R$ ${cMilhar},${cCentavos}`;
}

export function valorInterpretar(cValor) {
    const cNormalizado = String(cValor ?? "").trim().replace(/\./g, "").replace(",", ".");
    const nValor = Number(cNormalizado);

    if (!cNormalizado || Number.isNaN(nValor)) {
        return null;
    }

    return nValor;
}

export function valorMascaraAplicar(cValor) {
    const cDigitos = String(cValor ?? "").replace(/\D/g, "").replace(/^0+/, "").slice(0, 11);

    if (!cDigitos) {
        return "";
    }

    const cPreenchido = cDigitos.padStart(3, "0");
    const cCentavos = cPreenchido.slice(-2);
    const cInteiro = cPreenchido.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${cInteiro},${cCentavos}`;
}

export function valorMascaraDeNumero(nValor) {
    const nCentavos = Math.round(Number(nValor) * 100);

    if (!Number.isFinite(nCentavos) || nCentavos <= 0) {
        return "";
    }

    return valorMascaraAplicar(String(nCentavos));
}
