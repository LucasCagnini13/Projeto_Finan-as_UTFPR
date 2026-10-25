import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { BotaoPrimario } from "../../components/atoms/BotaoPrimario";
import { EstadoCarregando } from "../../components/atoms/EstadoCarregando";
import { EstadoErro } from "../../components/atoms/EstadoErro";
import { CampoFormulario } from "../../components/molecules/CampoFormulario";
import { usuarioChaveAtual } from "../../services/chavesConsulta";
import { usuarioAtualizar, usuarioAtualObter } from "../../services/usuarioService";
import { usuarioEmailValidar, usuarioNomeValidar, usuarioSenhaValidar } from "../../services/usuarioValidar";
import { sessaoIniciar, sessaoUsuarioObter } from "../../store/sessaoSlice";
import { oCores } from "../../theme/cores";

const oErrosVazios = {
    cNome: "",
    cEmail: "",
    cSenha: ""
};

export function PerfilEditarScreen({ navigation }) {
    const dispatch = useDispatch();
    const oConsultaCliente = useQueryClient();
    const nUsuarioId = useSelector(sessaoUsuarioObter)?.nId;
    const oPerfil = useQuery({
        queryKey: usuarioChaveAtual(),
        queryFn: () => usuarioAtualObter(nUsuarioId),
        enabled: nUsuarioId !== undefined && nUsuarioId !== null
    });
    const [cNome, setCNome] = useState("");
    const [cEmail, setCEmail] = useState("");
    const [cSenha, setCSenha] = useState("");
    const [lSenhaVisivel, setLSenhaVisivel] = useState(false);
    const [lSalvando, setLSalvando] = useState(false);
    const [lFormularioPronto, setLFormularioPronto] = useState(false);
    const [oErros, setOErros] = useState(oErrosVazios);
    const [cErroGeral, setCErroGeral] = useState("");

    useEffect(() => {
        if (!oPerfil.data || lFormularioPronto) {
            return;
        }

        setCNome(oPerfil.data.cNome);
        setCEmail(oPerfil.data.cEmail);
        setLFormularioPronto(true);
    }, [oPerfil.data, lFormularioPronto]);

    async function perfilSalvar() {
        const oErrosFormato = {
            cNome: usuarioNomeValidar(cNome) ? "" : "Informe nome e sobrenome.",
            cEmail: usuarioEmailValidar(cEmail) ? "" : "Informe um e-mail válido.",
            cSenha: usuarioSenhaValidar(cSenha) ? "" : "Informe uma senha."
        };

        setOErros(oErrosFormato);
        setCErroGeral("");

        if (Object.values(oErrosFormato).some(Boolean)) {
            return;
        }

        setLSalvando(true);
        const oResultado = await usuarioAtualizar(nUsuarioId, { cNome, cEmail, cSenha });
        setLSalvando(false);

        if (!oResultado.lSucesso) {
            if (oResultado.cCampo) {
                setOErros({
                    ...oErrosVazios,
                    [oResultado.cCampo]: oResultado.cMensagem
                });
            } else {
                setCErroGeral(oResultado.cMensagem);
            }

            return;
        }

        dispatch(sessaoIniciar(oResultado.oUsuario));
        oConsultaCliente.setQueryData(usuarioChaveAtual(), oResultado.oUsuario);
        navigation.goBack();
    }

    if (oPerfil.isPending) {
        return <EstadoCarregando cTitulo="Carregando perfil" />;
    }

    if (oPerfil.isError) {
        return (
            <EstadoErro
                cTitulo="Não foi possível carregar o perfil"
                cDescricao={oPerfil.error?.message}
                aoTentarNovamente={oPerfil.refetch}
            />
        );
    }

    return (
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled" style={estilos.tela}>
            <CampoFormulario
                cRotulo="Nome"
                cPlaceholder="Nome e sobrenome"
                cAutoCapitalize="words"
                cValor={cNome}
                cErro={oErros.cNome}
                aoAlterar={setCNome}
            />
            <CampoFormulario
                cRotulo="E-mail"
                cPlaceholder="email@exemplo.com"
                cTipoTeclado="email-address"
                cValor={cEmail}
                cErro={oErros.cEmail}
                aoAlterar={setCEmail}
            />
            <CampoFormulario
                cRotulo="Senha"
                cPlaceholder="Digite a senha para salvar"
                lSenha
                lSenhaVisivel={lSenhaVisivel}
                aoAlternarSenha={() => setLSenhaVisivel((lAtual) => !lAtual)}
                cValor={cSenha}
                cErro={oErros.cSenha}
                aoAlterar={setCSenha}
            />
            {cErroGeral ? <Text style={estilos.erro}>{cErroGeral}</Text> : null}
            <BotaoPrimario cTitulo="SALVAR" lCarregando={lSalvando} aoPressionar={perfilSalvar} />
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    tela: {
        backgroundColor: oCores.cFundoSuave,
        flex: 1
    },
    conteudo: {
        padding: 20
    },
    erro: {
        color: oCores.cErro,
        marginBottom: 12
    }
});
