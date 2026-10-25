# Recorte 05 — Perfil

Decisões compartilhadas: [ADR-001](../adr/ADR-001-cache-dados-servidor.md) e [ADR-002](../adr/ADR-002-navegacao.md).

## Contexto

A pessoa autenticada precisa revisar os próprios dados e encerrar a sessão. O público é o usuário do aplicativo. A pasta alvo é `frontend/`. A alteração fica no mock e na sessão; a validação oficial de cadastro será da API.

Requisitos: RF04 e RF07.

## Objetivo

A pessoa vê e altera nome, e-mail e senha, e sai da conta voltando ao login sem acesso às abas.

## Escopo

- Incluído:
  - `PerfilScreen` com a foto da referência, nome, e-mail, CPF mascarado, ação de editar e ação de sair.
  - `PerfilEditarScreen` altera nome, e-mail e senha (RF07), com a mesma checagem de formato do cadastro e erro se o e-mail já pertence a outra conta do mock.
  - Sair (RF04) limpa `sessaoSlice`, limpa o cache do TanStack Query e a guarda volta para o login.
  - O nome salvo passa a aparecer na saudação do início, porque a sessão e `usuarioChaveAtual` são atualizadas.
- Fora:
  - Exclusão da conta.
  - Troca de foto persistida em servidor. A foto da referência permanece a da demonstração.
  - Recuperação de senha, que está no recorte 01.
  - Qualquer dado financeiro. Esta tela não lê saldo nem lançamento.

## Critérios de aceite

- [ ] Dado o usuário de demonstração autenticado, quando abre Perfil, então vê nome, e-mail e a ação de editar.
- [ ] Dado um nome novo válido, quando salva, então a saudação do início usa esse nome.
- [ ] Dado a edição com e-mail já usado por outra conta do mock, quando salva, então a tela mostra o erro e mantém o dado anterior.
- [ ] Dado a sessão aberta, quando sai, então o login volta e o início não abre sem autenticar de novo.
- [ ] Dado a saída concluída, quando entra com outra conta da demonstração, então o cache anterior não aparece no início.

## Dependências

- Sessão e guarda do recorte 01.
- `usuarioAtualizar` e `usuarioSair` em `usuarioService`.
- `usuarioChaveAtual` para o dado exibido. A flag `lAutenticado` continua no Redux.
- `QueryClient.clear` no logout, para os dados financeiros não vazarem entre contas.

## Arquivos previstos

- `frontend/src/screens/perfil/PerfilScreen.jsx`
- `frontend/src/screens/perfil/PerfilEditarScreen.jsx`
- alteração em `frontend/src/services/usuarioService.js`
- alteração em `frontend/src/store/sessaoSlice.js`

## Estados

- Carregando: o botão Salvar fica desabilitado enquanto o mock grava.
- Erro: e-mail inválido, e-mail já usado ou senha vazia, com o dado anterior preservado.
- Vazio: não é uma listagem. Se a sessão não tiver usuário, a guarda já tirou a pessoa desta tela.
- Extremo: nome longo na saudação e no cabeçalho do perfil, truncado em uma linha.

## Nota de implementação

A marca do perfil é a inicial do nome, a mesma da saudação. Não há arquivo de foto. O CPF aparece como `***.***.***-25`. Salvar grava nome, e-mail e senha no mock e atualiza a sessão e `usuarioChaveAtual`. Sair também limpa o filtro visual, para a conta seguinte não herdar o período da anterior.

## Evidências

- Código das telas de perfil em `frontend/`.
- `node scripts/usuarioServiceConferir.js` cobre perfil sem senha, e-mail de outra conta sem alterar o dado anterior, nome longo, senha nova e saída.
- A passagem visual no Expo Go: abrir Perfil, salvar um nome com sobrenome, ver a saudação, rejeitar o e-mail de outra conta, sair e entrar de novo.
