import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { BotaoTexto } from "../../components/atoms/BotaoTexto";
import { TextoTitulo } from "../../components/atoms/TextoTitulo";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { TelaAutenticacaoTemplate } from "../../components/templates/TelaAutenticacaoTemplate";
import { usuarioCriar } from "../../services/usuarioService";
import {
    usuarioCpfFormatar,
    usuarioCpfValidar,
    usuarioEmailValidar,
    usuarioNomeValidar,
    usuarioSenhaValidar
} from "../../services/usuarioValidar";
import { sessaoIniciar } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

const oErrosVazios = {
    cNome: "",
    cEmail: "",
    cCpf: "",
    cSenha: ""
};

export function CadastroScreen({ navigation }) {
    const dispatch = useDispatch();
    const [cNome, setCNome] = useState("");
    const [cEmail, setCEmail] = useState("");
    const [cCpf, setCCpf] = useState("");
    const [cSenha, setCSenha] = useState("");
    const [lSenhaVisivel, setLSenhaVisivel] = useState(false);
    const [lCarregando, setLCarregando] = useState(false);
    const [oErros, setOErros] = useState(oErrosVazios);

    function erroDefinir(cCampo, cMensagem) {
        setOErros({
            ...oErrosVazios,
            [cCampo]: cMensagem
        });
    }

    async function usuarioCadastrar() {
        const oErrosFormato = {
            cNome: usuarioNomeValidar(cNome) ? "" : "Informe nome e sobrenome.",
            cEmail: usuarioEmailValidar(cEmail) ? "" : "Informe um e-mail válido.",
            cCpf: usuarioCpfValidar(cCpf) ? "" : "Informe um CPF válido.",
            cSenha: usuarioSenhaValidar(cSenha) ? "" : "Informe uma senha."
        };

        setOErros(oErrosFormato);

        if (oErrosFormato.cNome || oErrosFormato.cEmail || oErrosFormato.cCpf || oErrosFormato.cSenha) {
            return;
        }

        setLCarregando(true);

        const oResultado = await usuarioCriar({
            cNome,
            cEmail,
            cCpf,
            cSenha
        });

        setLCarregando(false);

        if (!oResultado.lSucesso) {
            erroDefinir(oResultado.cCampo, oResultado.cMensagem);
            return;
        }

        dispatch(sessaoIniciar(oResultado.oUsuario));
    }

    return (
        <TelaAutenticacaoTemplate
            oRodape={
                <>
                    <Text style={estilos.rodapeTexto}>Já tem uma conta?</Text>
                    <BotaoTexto cTitulo="Entrar" lDestaque aoPressionar={() => navigation.navigate("Login")} />
                </>
            }
        >
            <View style={estilos.cabecalho}>
                <TextoTitulo cTitulo="Criar uma conta" />
                <Text style={estilos.subtitulo}>Informe seus dados para continuar</Text>
            </View>
            <CampoFormulario
                cRotulo="Nome completo"
                cPlaceholder="Seu nome e sobrenome"
                cAutoCapitalize="words"
                cValor={cNome}
                cErro={oErros.cNome}
                aoAlterar={(cValor) => {
                    setCNome(cValor);
                    setOErros({ ...oErros, cNome: "" });
                }}
            />
            <CampoFormulario
                cRotulo="E-mail"
                cPlaceholder="exemplo@email.com"
                cTipoTeclado="email-address"
                cValor={cEmail}
                cErro={oErros.cEmail}
                aoAlterar={(cValor) => {
                    setCEmail(cValor);
                    setOErros({ ...oErros, cEmail: "" });
                }}
            />
            <CampoFormulario
                cRotulo="CPF"
                cPlaceholder="000.000.000-00"
                cTipoTeclado="number-pad"
                cValor={cCpf}
                cErro={oErros.cCpf}
                aoAlterar={(cValor) => {
                    setCCpf(usuarioCpfFormatar(cValor));
                    setOErros({ ...oErros, cCpf: "" });
                }}
            />
            <CampoFormulario
                cRotulo="Senha"
                cPlaceholder="Digite sua senha"
                cValor={cSenha}
                cErro={oErros.cSenha}
                lSenha
                lSenhaVisivel={lSenhaVisivel}
                aoAlternarSenha={() => setLSenhaVisivel((lAtual) => !lAtual)}
                aoAlterar={(cValor) => {
                    setCSenha(cValor);
                    setOErros({ ...oErros, cSenha: "" });
                }}
            />
            <View style={estilos.acao}>
                <BotaoPrimario cTitulo="CRIAR CONTA" lCarregando={lCarregando} aoPressionar={usuarioCadastrar} />
            </View>
        </TelaAutenticacaoTemplate>
    );
}

const estilos = StyleSheet.create({
    cabecalho: {
        marginBottom: 28
    },
    subtitulo: {
        color: oCores.cTextoSuave,
        fontSize: 15,
        marginTop: 8,
        textAlign: "center"
    },
    acao: {
        marginTop: 8
    },
    rodapeTexto: {
        color: oCores.cTextoSuave,
        fontSize: 15
    }
});
