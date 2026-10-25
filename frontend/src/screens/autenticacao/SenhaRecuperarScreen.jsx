import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { BotaoTexto } from "../../components/atoms/BotaoTexto";
import { TextoTitulo } from "../../components/atoms/TextoTitulo";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { TelaAutenticacaoTemplate } from "../../components/templates/TelaAutenticacaoTemplate";
import { usuarioRecuperarSolicitar } from "../../services/usuarioService";
import { usuarioEmailValidar } from "../../services/usuarioValidar";
import { oCores } from "../../theme/cores";

export function SenhaRecuperarScreen({ navigation }) {
    const [cEmail, setCEmail] = useState("");
    const [cErroEmail, setCErroEmail] = useState("");
    const [lCarregando, setLCarregando] = useState(false);
    const [cToken, setCToken] = useState("");
    const [cEmailEnviado, setCEmailEnviado] = useState("");

    async function usuarioRecuperar() {
        if (!usuarioEmailValidar(cEmail)) {
            setCErroEmail("Informe um e-mail válido.");
            return;
        }

        setLCarregando(true);

        const oResultado = await usuarioRecuperarSolicitar(cEmail);

        setLCarregando(false);

        if (!oResultado.lSucesso) {
            setCErroEmail(oResultado.cMensagem);
            setCToken("");
            return;
        }

        setCErroEmail("");
        setCToken(oResultado.cToken);
        setCEmailEnviado(oResultado.cEmail);
    }

    return (
        <TelaAutenticacaoTemplate
            oRodape={
                <BotaoTexto cTitulo="Voltar ao login" lDestaque aoPressionar={() => navigation.navigate("Login")} />
            }
        >
            <View style={estilos.cabecalho}>
                <TextoTitulo cTitulo="Esqueci minha senha" />
                <Text style={estilos.subtitulo}>Informe o e-mail cadastrado para receber o link</Text>
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
                    setCToken("");
                }}
            />
            <BotaoPrimario cTitulo="ENVIAR" lCarregando={lCarregando} aoPressionar={usuarioRecuperar} />
            {cToken ? (
                <View style={estilos.aviso}>
                    <Text style={estilos.avisoTexto}>Enviamos um link de redefinição para {cEmailEnviado}.</Text>
                    <View style={estilos.link}>
                        <BotaoTexto
                            cTitulo="Abrir link de redefinição"
                            lDestaque
                            aoPressionar={() =>
                                navigation.navigate("SenhaRedefinir", {
                                    cToken,
                                    cEmail: cEmailEnviado
                                })
                            }
                        />
                    </View>
                </View>
            ) : null}
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
    aviso: {
        marginTop: 24
    },
    avisoTexto: {
        color: oCores.cTexto,
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center"
    },
    link: {
        alignItems: "center",
        marginTop: 14
    }
});
