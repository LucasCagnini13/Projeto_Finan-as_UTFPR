const fs = require("fs");
const path = require("path");
const vm = require("vm");

const cArquivo = path.join(__dirname, "..", "src", "services", "usuarioValidar.js");
const cCodigo = fs
    .readFileSync(cArquivo, "utf8")
    .replace(/export function /g, "function ");

const oModulo = {};
vm.runInNewContext(`${cCodigo}\nthis.oApi = { usuarioEmailValidar, usuarioCpfValidar, usuarioNomeValidar, usuarioSenhaValidar, usuarioCpfFormatar };`, oModulo);

const {
    usuarioEmailValidar,
    usuarioCpfValidar,
    usuarioNomeValidar,
    usuarioSenhaValidar,
    usuarioCpfFormatar
} = oModulo.oApi;

function conferir(lCondicao, cMensagem) {
    if (!lCondicao) {
        throw new Error(cMensagem);
    }
}

conferir(usuarioEmailValidar("professor@email.com"), "e-mail válido");
conferir(!usuarioEmailValidar("professor"), "e-mail inválido");
conferir(usuarioCpfValidar("529.982.247-25"), "CPF válido");
conferir(!usuarioCpfValidar("111.111.111-11"), "CPF repetido");
conferir(!usuarioCpfValidar("123"), "CPF curto");
conferir(usuarioNomeValidar("Ana Souza"), "nome completo");
conferir(!usuarioNomeValidar("Ana"), "nome sem sobrenome");
conferir(usuarioSenhaValidar("123456"), "senha preenchida");
conferir(!usuarioSenhaValidar("   "), "senha vazia");
conferir(usuarioCpfFormatar("52998224725") === "529.982.247-25", "máscara do CPF");

console.log("usuarioValidar conferido");
