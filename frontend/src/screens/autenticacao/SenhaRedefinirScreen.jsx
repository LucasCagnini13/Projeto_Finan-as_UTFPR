import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { BotaoTexto } from "../../components/atoms/BotaoTexto";
import { TextoTitulo } from "../../components/atoms/TextoTitulo";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { TelaAutenticacaoTemplate } from "../../components/templates/TelaAutenticacaoTemplate";
import { usuarioSenhaRedefinir } from "../../services/usuarioService";
import { oCores } from "../../theme/cores";

export function SenhaRedefinirScreen({ navigation, route }) {
    const cToken = route.params?.cToken || "";
    const cEmail = route.params?.cEmail || "";
    const [cSenha, setCSenha] = useState("");
    const [lSenhaVisivel, setLSenhaVisivel] = useState(false);
    const [lCarregando, setLCarregando] = useState(false);
    const [cErroSenha, setCErroSenha] = useState("");
    const [cErro, setCErro] = useState(cToken ? "" : "O link de redefinição não é válido.");

    async function usuarioRedefinir() {
        if (!cToken) {
            setCErro("O link de redefinição não é válido.");
            return;
        }

        setLCarregando(true);

        const oResultado = await usuarioSenhaRedefinir(cToken, cSenha);

        setLCarregando(false);

        if (!oResultado.lSucesso) {
            if (oResultado.cCampo === "cSenha") {
                setCErroSenha(oResultado.cMensagem);
                return;
            }

            setCErro(oResultado.cMensagem);
            return;
        }

        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }]
        });
    }

    return (
        <TelaAutenticacaoTemplate
            oRodape={
                <BotaoTexto cTitulo="Voltar ao login" lDestaque aoPressionar={() => navigation.navigate("Login")} />
            }
        >
            <View style={estilos.cabecalho}>
                <TextoTitulo cTitulo="Nova senha" />
                <Text style={estilos.subtitulo}>
                    {cEmail ? `Redefina a senha de ${cEmail}` : "Informe a nova senha da sua conta"}
                </Text>
            </View>
            {cErro ? <Text style={estilos.erroGeral}>{cErro}</Text> : null}
            <CampoFormulario
                cRotulo="Nova senha"
                cPlaceholder="Digite sua senha"
                cValor={cSenha}
                cErro={cErroSenha}
                lSenha
                lSenhaVisivel={lSenhaVisivel}
                lDesabilitado={!cToken}
                aoAlternarSenha={() => setLSenhaVisivel((lAtual) => !lAtual)}
                aoAlterar={(cValor) => {
                    setCSenha(cValor);
                    setCErroSenha("");
                }}
            />
            <BotaoPrimario
                cTitulo="SALVAR"
                lCarregando={lCarregando}
                lDesabilitado={!cToken}
                aoPressionar={usuarioRedefinir}
            />
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
        lineHeight: 22,
        marginTop: 8,
        textAlign: "center"
    },
    erroGeral: {
        color: oCores.cErro,
        fontSize: 14,
        marginBottom: 12,
        textAlign: "center"
    }
});
