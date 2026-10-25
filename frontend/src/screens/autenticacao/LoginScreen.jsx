import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { BotaoTexto } from "../../components/atoms/BotaoTexto";
import { LogoMarca } from "../../components/atoms/LogoMarca";
import { TextoTitulo } from "../../components/atoms/TextoTitulo";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { TelaAutenticacaoTemplate } from "../../components/templates/TelaAutenticacaoTemplate";
import { usuarioAutenticar } from "../../services/usuarioService";
import { usuarioEmailValidar, usuarioSenhaValidar } from "../../services/usuarioValidar";
import { sessaoIniciar } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

export function LoginScreen({ navigation }) {
    const dispatch = useDispatch();
    const [cEmail, setCEmail] = useState("professor@email.com");
    const [cSenha, setCSenha] = useState("123456");
    const [lSenhaVisivel, setLSenhaVisivel] = useState(false);
    const [lCarregando, setLCarregando] = useState(false);
    const [cErroEmail, setCErroEmail] = useState("");
    const [cErroSenha, setCErroSenha] = useState("");

    async function usuarioEntrar() {
        const cErroFormatoEmail = usuarioEmailValidar(cEmail) ? "" : "Informe um e-mail válido.";
        const cErroFormatoSenha = usuarioSenhaValidar(cSenha) ? "" : "Informe uma senha.";

        setCErroEmail(cErroFormatoEmail);
        setCErroSenha(cErroFormatoSenha);

        if (cErroFormatoEmail || cErroFormatoSenha) {
            return;
        }

        setLCarregando(true);

        const oResultado = await usuarioAutenticar(cEmail, cSenha);

        setLCarregando(false);

        if (!oResultado.lSucesso) {
            setCErroSenha(oResultado.cMensagem);
            return;
        }

        dispatch(sessaoIniciar(oResultado.oUsuario));
    }

    return (
        <TelaAutenticacaoTemplate
            oRodape={
                <>
                    <Text style={estilos.rodapeTexto}>Não tem uma conta?</Text>
                    <BotaoTexto
                        cTitulo="Criar uma conta"
                        lDestaque
                        aoPressionar={() => navigation.navigate("Cadastro")}
                    />
                </>
            }
        >
            <View style={estilos.cabecalho}>
                <LogoMarca />
                <View style={estilos.titulos}>
                    <TextoTitulo cTitulo="Bem-vindo de volta" />
                    <Text style={estilos.subtitulo}>Acesse sua conta para continuar</Text>
                </View>
            </View>
            <CampoFormulario
                cRotulo="E-mail"
                cPlaceholder="exemplo@email.com"
                cTipoTeclado="email-address"
                cValor={cEmail}
                cErro={cErroEmail}
                aoAlterar={(cValor) => {
                    setCEmail(cValor);
                    setCErroEmail("");
                }}
            />
            <CampoFormulario
                cRotulo="Senha"
                cPlaceholder="Digite sua senha"
                cValor={cSenha}
                cErro={cErroSenha}
                lSenha
                lSenhaVisivel={lSenhaVisivel}
                aoAlternarSenha={() => setLSenhaVisivel((lAtual) => !lAtual)}
                aoAlterar={(cValor) => {
                    setCSenha(cValor);
                    setCErroSenha("");
                }}
            />
            <View style={estilos.acao}>
                <BotaoPrimario cTitulo="ENTRAR" lCarregando={lCarregando} aoPressionar={usuarioEntrar} />
            </View>
            <View style={estilos.esqueci}>
                <BotaoTexto
                    cTitulo="Esqueci minha senha"
                    aoPressionar={() => navigation.navigate("SenhaRecuperar")}
                />
            </View>
            <Text style={estilos.demonstracao}>Conta de demonstração para a aula. Os campos já vêm preenchidos.</Text>
        </TelaAutenticacaoTemplate>
    );
}

const estilos = StyleSheet.create({
    cabecalho: {
        marginBottom: 32
    },
    titulos: {
        marginTop: 22
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
    esqueci: {
        alignItems: "center",
        marginTop: 22
    },
    demonstracao: {
        color: oCores.cTextoSuave,
        fontSize: 13,
        lineHeight: 18,
        marginTop: 16,
        textAlign: "center"
    },
    rodapeTexto: {
        color: oCores.cTextoSuave,
        fontSize: 15
    }
});
