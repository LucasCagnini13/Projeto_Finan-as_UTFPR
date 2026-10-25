const fs = require("fs");
const path = require("path");
const vm = require("vm");

function moduloCarregar(cCaminho, mNomes, oExtras) {
    const cCodigo = fs
        .readFileSync(cCaminho, "utf8")
        .replace(/^\s*import[\s\S]*?from\s+["'][^"']+["'];\s*$/gm, "")
        .replace(/^export /gm, "");

    const oContexto = {
        ...oExtras,
        console,
        setTimeout,
        Promise
    };

    vm.runInNewContext(`${cCodigo}\nthis.oApi = { ${mNomes.join(", ")} };`, oContexto);

    return oContexto.oApi;
}

const cServicos = path.join(__dirname, "..", "src", "services");
const oValidar = moduloCarregar(
    path.join(cServicos, "usuarioValidar.js"),
    [
        "usuarioEmailValidar",
        "usuarioCpfValidar",
        "usuarioNomeValidar",
        "usuarioSenhaValidar",
        "usuarioCpfFormatar",
        "usuarioCpfDigitosObter",
        "usuarioCpfMascarar"
    ],
    {}
);
const oServico = moduloCarregar(
    path.join(cServicos, "usuarioService.js"),
    ["usuarioAutenticar", "usuarioCriar", "usuarioRecuperarSolicitar", "usuarioSenhaRedefinir", "usuarioAtualObter", "usuarioAtualizar", "usuarioSair"],
    {
        atrasoSimular() {
            return Promise.resolve();
        },
        ...oValidar
    }
);

async function conferir() {
    const oLogin = await oServico.usuarioAutenticar("professor@email.com", "123456");
    if (!oLogin.lSucesso || oLogin.oUsuario.cNome !== "Professor Convidado" || oLogin.oUsuario.cSenha) {
        throw new Error("login de demonstração");
    }

    const oSenhaErrada = await oServico.usuarioAutenticar("professor@email.com", "000");
    if (oSenhaErrada.lSucesso || oSenhaErrada.cMensagem !== "E-mail ou senha incorretos.") {
        throw new Error("senha incorreta");
    }

    const oInvalido = await oServico.usuarioCriar({
        cNome: "Ana",
        cEmail: "ana",
        cCpf: "11111111111",
        cSenha: ""
    });
    if (oInvalido.lSucesso) {
        throw new Error("cadastro inválido passou");
    }

    const oRepetido = await oServico.usuarioCriar({
        cNome: "Matheus Silva",
        cEmail: "professor@email.com",
        cCpf: "52998224725",
        cSenha: "123456"
    });
    if (oRepetido.lSucesso || oRepetido.cCampo !== "cEmail") {
        throw new Error("e-mail repetido");
    }

    const oNovo = await oServico.usuarioCriar({
        cNome: "Ana Souza",
        cEmail: "ana@email.com",
        cCpf: "390.533.447-05",
        cSenha: "abc123"
    });
    if (!oNovo.lSucesso || oNovo.oUsuario.cNome !== "Ana Souza") {
        throw new Error("cadastro válido");
    }

    const oCpfRepetido = await oServico.usuarioCriar({
        cNome: "Carla Souza",
        cEmail: "carla@email.com",
        cCpf: "39053344705",
        cSenha: "abc123"
    });
    if (oCpfRepetido.lSucesso || oCpfRepetido.cCampo !== "cCpf") {
        throw new Error("CPF repetido");
    }

    const oRecuperar = await oServico.usuarioRecuperarSolicitar("ana@email.com");
    if (!oRecuperar.lSucesso || !oRecuperar.cToken) {
        throw new Error("recuperação");
    }

    const oRedefinir = await oServico.usuarioSenhaRedefinir(oRecuperar.cToken, "nova-senha");
    if (!oRedefinir.lSucesso) {
        throw new Error("redefinição");
    }

    const oSenhaAntiga = await oServico.usuarioAutenticar("ana@email.com", "abc123");
    const oSenhaNova = await oServico.usuarioAutenticar("ana@email.com", "nova-senha");
    if (oSenhaAntiga.lSucesso || !oSenhaNova.lSucesso) {
        throw new Error("senha nova não entrou");
    }

    if (oValidar.usuarioCpfMascarar("52998224725") !== "***.***.***-25") {
        throw new Error("CPF mascarado");
    }

    const oPerfil = await oServico.usuarioAtualObter(1);
    if (oPerfil.cNome !== "Professor Convidado" || oPerfil.cSenha || oPerfil.cEmail !== "professor@email.com") {
        throw new Error("perfil sem senha");
    }

    const oEmailRepetido = await oServico.usuarioAtualizar(1, {
        cNome: "Matheus Silva",
        cEmail: "ana@email.com",
        cSenha: "123456"
    });
    const oPerfilMantido = await oServico.usuarioAutenticar("professor@email.com", "123456");
    if (oEmailRepetido.lSucesso || oEmailRepetido.cCampo !== "cEmail" || !oPerfilMantido.lSucesso || oPerfilMantido.oUsuario.cNome !== "Professor Convidado") {
        throw new Error("e-mail de outra conta");
    }

    const cNomeLongo = "Matheus Albuquerque Sobrenome Comprido Para Testar Cabecalho Perfil";
    const oSalvo = await oServico.usuarioAtualizar(1, {
        cNome: cNomeLongo,
        cEmail: "professor@email.com",
        cSenha: "654321"
    });
    const oSenhaAntigaMatheus = await oServico.usuarioAutenticar("professor@email.com", "123456");
    const oSenhaNovaMatheus = await oServico.usuarioAutenticar("professor@email.com", "654321");
    if (!oSalvo.lSucesso || oSalvo.oUsuario.cNome !== cNomeLongo || oSalvo.oUsuario.cSenha || oSenhaAntigaMatheus.lSucesso || !oSenhaNovaMatheus.lSucesso) {
        throw new Error("perfil atualizado");
    }

    const oSaida = await oServico.usuarioSair();
    if (!oSaida.lSucesso) {
        throw new Error("saída da conta");
    }

    console.log("usuarioService conferido");
}

conferir().catch((oErro) => {
    console.error(oErro);
    process.exit(1);
});
