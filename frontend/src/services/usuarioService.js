import { atrasoSimular } from "./atrasoSimular";
import {
    usuarioCpfDigitosObter,
    usuarioCpfValidar,
    usuarioEmailValidar,
    usuarioNomeValidar,
    usuarioSenhaValidar
} from "./usuarioValidar";

const mUsuarios = [
    {
        nId: 1,
        cNome: "Professor Convidado",
        cEmail: "professor@email.com",
        cCpf: "52998224725",
        cSenha: "123456",
        cTokenRecuperacao: ""
    }
];

let nProximoId = 2;

function usuarioSessaoFormatar(oUsuario) {
    return {
        nId: oUsuario.nId,
        cNome: oUsuario.cNome,
        cEmail: oUsuario.cEmail,
        cCpf: oUsuario.cCpf
    };
}

function usuarioBuscarPorId(nId) {
    return mUsuarios.find((oUsuario) => oUsuario.nId === nId);
}

function usuarioBuscarPorEmail(cEmail) {
    const cEmailNormalizado = cEmail.trim().toLowerCase();
    return mUsuarios.find((oUsuario) => oUsuario.cEmail.toLowerCase() === cEmailNormalizado);
}

function usuarioBuscarPorCpf(cCpf) {
    const cDigitos = usuarioCpfDigitosObter(cCpf);
    return mUsuarios.find((oUsuario) => oUsuario.cCpf === cDigitos);
}

export async function usuarioAutenticar(cEmail, cSenha) {
    await atrasoSimular();

    const oUsuario = usuarioBuscarPorEmail(cEmail);

    if (!oUsuario || oUsuario.cSenha !== cSenha) {
        return {
            lSucesso: false,
            cCampo: "cSenha",
            cMensagem: "E-mail ou senha incorretos."
        };
    }

    return {
        lSucesso: true,
        oUsuario: usuarioSessaoFormatar(oUsuario)
    };
}

export async function usuarioCriar(oNovoUsuario) {
    await atrasoSimular();

    if (!usuarioNomeValidar(oNovoUsuario.cNome)) {
        return {
            lSucesso: false,
            cCampo: "cNome",
            cMensagem: "Informe nome e sobrenome."
        };
    }

    if (!usuarioEmailValidar(oNovoUsuario.cEmail)) {
        return {
            lSucesso: false,
            cCampo: "cEmail",
            cMensagem: "Informe um e-mail válido."
        };
    }

    if (!usuarioCpfValidar(oNovoUsuario.cCpf)) {
        return {
            lSucesso: false,
            cCampo: "cCpf",
            cMensagem: "Informe um CPF válido."
        };
    }

    if (!usuarioSenhaValidar(oNovoUsuario.cSenha)) {
        return {
            lSucesso: false,
            cCampo: "cSenha",
            cMensagem: "Informe uma senha."
        };
    }

    if (usuarioBuscarPorEmail(oNovoUsuario.cEmail)) {
        return {
            lSucesso: false,
            cCampo: "cEmail",
            cMensagem: "Este e-mail já está cadastrado."
        };
    }

    if (usuarioBuscarPorCpf(oNovoUsuario.cCpf)) {
        return {
            lSucesso: false,
            cCampo: "cCpf",
            cMensagem: "Este CPF já está cadastrado."
        };
    }

    const oUsuario = {
        nId: nProximoId,
        cNome: oNovoUsuario.cNome.trim(),
        cEmail: oNovoUsuario.cEmail.trim().toLowerCase(),
        cCpf: usuarioCpfDigitosObter(oNovoUsuario.cCpf),
        cSenha: oNovoUsuario.cSenha,
        cTokenRecuperacao: ""
    };

    nProximoId += 1;
    mUsuarios.push(oUsuario);

    return {
        lSucesso: true,
        oUsuario: usuarioSessaoFormatar(oUsuario)
    };
}

export async function usuarioRecuperarSolicitar(cEmail) {
    await atrasoSimular();

    if (!usuarioEmailValidar(cEmail)) {
        return {
            lSucesso: false,
            cCampo: "cEmail",
            cMensagem: "Informe um e-mail válido."
        };
    }

    const oUsuario = usuarioBuscarPorEmail(cEmail);

    if (!oUsuario) {
        return {
            lSucesso: false,
            cCampo: "cEmail",
            cMensagem: "Não encontramos uma conta com este e-mail."
        };
    }

    const cToken = `recuperacao-${oUsuario.nId}`;
    oUsuario.cTokenRecuperacao = cToken;

    return {
        lSucesso: true,
        cToken,
        cEmail: oUsuario.cEmail
    };
}

export async function usuarioAtualObter(nUsuarioId) {
    await atrasoSimular(300);
    const oUsuario = usuarioBuscarPorId(nUsuarioId);

    if (!oUsuario) {
        throw new Error("Não foi possível carregar o perfil.");
    }

    return usuarioSessaoFormatar(oUsuario);
}

export async function usuarioAtualizar(nUsuarioId, oDados) {
    await atrasoSimular();
    const oUsuario = usuarioBuscarPorId(nUsuarioId);

    if (!oUsuario) {
        return {
            lSucesso: false,
            cMensagem: "Não foi possível salvar o perfil."
        };
    }

    if (!usuarioNomeValidar(oDados.cNome)) {
        return {
            lSucesso: false,
            cCampo: "cNome",
            cMensagem: "Informe nome e sobrenome."
        };
    }

    if (!usuarioEmailValidar(oDados.cEmail)) {
        return {
            lSucesso: false,
            cCampo: "cEmail",
            cMensagem: "Informe um e-mail válido."
        };
    }

    if (!usuarioSenhaValidar(oDados.cSenha)) {
        return {
            lSucesso: false,
            cCampo: "cSenha",
            cMensagem: "Informe uma senha."
        };
    }

    const oOutro = usuarioBuscarPorEmail(oDados.cEmail);

    if (oOutro && oOutro.nId !== oUsuario.nId) {
        return {
            lSucesso: false,
            cCampo: "cEmail",
            cMensagem: "Este e-mail já está cadastrado."
        };
    }

    oUsuario.cNome = oDados.cNome.trim();
    oUsuario.cEmail = oDados.cEmail.trim().toLowerCase();
    oUsuario.cSenha = oDados.cSenha;

    return {
        lSucesso: true,
        oUsuario: usuarioSessaoFormatar(oUsuario)
    };
}

export async function usuarioSair() {
    await atrasoSimular(300);
    return { lSucesso: true };
}

export async function usuarioSenhaRedefinir(cToken, cSenha) {
    await atrasoSimular();

    const oUsuario = mUsuarios.find((oItem) => oItem.cTokenRecuperacao && oItem.cTokenRecuperacao === cToken);

    if (!oUsuario) {
        return {
            lSucesso: false,
            cMensagem: "O link de redefinição não é válido."
        };
    }

    if (!usuarioSenhaValidar(cSenha)) {
        return {
            lSucesso: false,
            cCampo: "cSenha",
            cMensagem: "Informe uma senha."
        };
    }

    oUsuario.cSenha = cSenha;
    oUsuario.cTokenRecuperacao = "";

    return {
        lSucesso: true
    };
}
