# Recorte 01 — Login e cadastro

Decisões compartilhadas: [ADR-001](../adr/ADR-001-cache-dados-servidor.md) e [ADR-002](../adr/ADR-002-navegacao.md).

## Contexto

A pessoa precisa entrar, criar uma conta ou pedir uma nova senha antes de ver o dinheiro. O público é o usuário do aplicativo na demonstração em aula. A pasta alvo é `frontend/`. Não há API neste recorte: o serviço autentica contra uma lista em memória.

Requisitos: RF01, RF02, RF03, RF05 e RF06. O encerramento da sessão (RF04) fica no recorte de perfil.

## Objetivo

A pessoa acessa a conta, cria uma conta nova ou redefine a senha por um fluxo simulado, e só então chega às abas.

## Escopo

- Incluído:
  - `LoginScreen`, no visual da referência: logo, “Bem-vindo de volta”, e-mail, senha com mostrar/ocultar, botão Entrar, “Esqueci minha senha” e o link “Criar uma conta”.
  - `CadastroScreen` com nome completo, e-mail, CPF e senha (RF01).
  - Validação de formato na interface e resposta do mock quando e-mail ou CPF já existem (RF02).
  - Login com e-mail e senha (RF03). A credencial de demonstração é `professor@email.com` / `123456`, no nome Professor Convidado. O formulário já abre preenchido.
  - `SenhaRecuperarScreen` pede o e-mail cadastrado (RF05).
  - `SenhaRedefinirScreen` abre com o parâmetro `cToken` simulado e grava a nova senha no mock (RF06). Não há envio real de e-mail.
  - Sessão em `sessaoSlice`: `lAutenticado` e `oUsuario`. Sem sessão, a guarda não monta as abas.
- Fora:
  - Envio real de e-mail e link verdadeiro de redefinição.
  - Unicidade oficial de e-mail e CPF, que será regra da API.
  - Logout, que está no recorte 05.
  - Cálculo de saldo e qualquer tela das abas.

## Critérios de aceite

- [ ] Dado o aplicativo fechado, quando abre, então aparece o login da referência e as abas não estão acessíveis.
- [ ] Dado o e-mail e a senha da demonstração, quando toca em Entrar, então entra no início com a saudação Professor.
- [ ] Dado uma senha errada, quando entra, então a tela mostra o erro e permanece no login.
- [ ] Dado nome, e-mail, CPF e senha válidos e ainda não usados, quando cadastra, então a sessão abre no início.
- [ ] Dado e-mail ou CPF repetido, ou formato inválido, quando cadastra, então a mensagem aponta o campo e a conta não é criada.
- [ ] Dado o e-mail cadastrado, quando pede recuperação e abre o link simulado com `cToken`, então informa a nova senha e volta ao login.

## Dependências

- Casca do Expo, tema, átomos `CampoTexto`, `BotaoPrimario` e `BotaoTexto`, molécula `CampoFormulario` e template da tela de autenticação.
- `usuarioService` com `usuarioAutenticar`, `usuarioCriar` e `usuarioSenhaRedefinir`, devolvendo objeto húngaro ou erro com `cMensagem`.
- Guarda de rota do ADR-002.
- Mock com atraso curto para o botão Entrar mostrar carregamento.

## Arquivos previstos

- `frontend/src/screens/autenticacao/LoginScreen.jsx`
- `frontend/src/screens/autenticacao/CadastroScreen.jsx`
- `frontend/src/screens/autenticacao/SenhaRecuperarScreen.jsx`
- `frontend/src/screens/autenticacao/SenhaRedefinirScreen.jsx`
- `frontend/src/services/usuarioService.js`
- `frontend/src/store/sessaoSlice.js`

## Estados

- Carregando: o botão Entrar ou Cadastrar fica desabilitado enquanto o mock responde.
- Erro: senha incorreta, e-mail desconhecido na recuperação, formato inválido ou e-mail/CPF já usado, com texto no campo correspondente.
- Vazio: não é uma listagem. Os campos começam vazios, com o placeholder da referência no login.
- Extremo: nome longo no cadastro não estoura o campo; a senha pode ser ocultada e exibida.

## Nota de implementação

A área autenticada monta as quatro abas, para a guarda cumprir o aceite. Início, neste recorte, só mostra a saudação com o primeiro nome. Finanças, Investimentos e Perfil usam uma tela vazia até os recortes seguintes. O saldo não é calculado aqui.

## Evidências

- Código nas telas de autenticação em `frontend/`.
- `node scripts/usuarioValidarConferir.js` e `node scripts/usuarioServiceConferir.js` cobrem formato, login, cadastro duplicado e redefinição.
- `npx expo export --platform web` gerou o bundle sem erro de compilação.
- A passagem visual no Expo Go ainda é a conferência da aula: `cd frontend`, `npm install`, `npx expo start`.
