export function usuarioEmailValidar(cEmail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail.trim());
}

export function usuarioCpfDigitosObter(cCpf) {
    return cCpf.replace(/\D/g, "");
}

export function usuarioCpfFormatar(cCpf) {
    const cDigitos = usuarioCpfDigitosObter(cCpf).slice(0, 11);

    if (cDigitos.length <= 3) {
        return cDigitos;
    }

    if (cDigitos.length <= 6) {
        return `${cDigitos.slice(0, 3)}.${cDigitos.slice(3)}`;
    }

    if (cDigitos.length <= 9) {
        return `${cDigitos.slice(0, 3)}.${cDigitos.slice(3, 6)}.${cDigitos.slice(6)}`;
    }

    return `${cDigitos.slice(0, 3)}.${cDigitos.slice(3, 6)}.${cDigitos.slice(6, 9)}-${cDigitos.slice(9)}`;
}

export function usuarioCpfValidar(cCpf) {
    const cDigitos = usuarioCpfDigitosObter(cCpf);

    if (cDigitos.length !== 11 || /^(\d)\1+$/.test(cDigitos)) {
        return false;
    }

    const mNumeros = cDigitos.split("").map(Number);
    let nSoma = 0;

    for (let nIndice = 0; nIndice < 9; nIndice += 1) {
        nSoma += mNumeros[nIndice] * (10 - nIndice);
    }

    let nResto = (nSoma * 10) % 11;

    if (nResto === 10) {
        nResto = 0;
    }

    if (nResto !== mNumeros[9]) {
        return false;
    }

    nSoma = 0;

    for (let nIndice = 0; nIndice < 10; nIndice += 1) {
        nSoma += mNumeros[nIndice] * (11 - nIndice);
    }

    nResto = (nSoma * 10) % 11;

    if (nResto === 10) {
        nResto = 0;
    }

    return nResto === mNumeros[10];
}

export function usuarioCpfMascarar(cCpf) {
    const cDigitos = usuarioCpfDigitosObter(cCpf);

    if (cDigitos.length !== 11) {
        return "";
    }

    return `***.***.***-${cDigitos.slice(9)}`;
}

export function usuarioNomeValidar(cNome) {
    const mPartes = cNome.trim().split(/\s+/).filter(Boolean);
    return mPartes.length >= 2 && mPartes.every((cParte) => cParte.length >= 2);
}

export function usuarioSenhaValidar(cSenha) {
    return cSenha.trim().length > 0;
}
