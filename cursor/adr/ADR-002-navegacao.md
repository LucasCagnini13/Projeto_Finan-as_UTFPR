# ADR-002 — Navegação em pilha, abas e guarda de rota

Data: 2026-10-25
Status: aceita

## Contexto

O usuário alterna entre o resumo (RF24), o extrato (RF18) e as telas de autenticação (RF01–RF05). O aplicativo é mobile. Recarregar a tela no meio de um formulário prejudica o uso.

## Decisão

React Navigation com três níveis:

- uma guarda na raiz, que troca a árvore conforme `lAutenticado`;
- uma pilha de autenticação (login, cadastro, recuperação e redefinição de senha) quando não há sessão;
- quatro abas quando há sessão: Início, Finanças, Investimentos e Perfil;
- uma pilha dentro de cada aba para o fluxo sequencial daquele módulo.

Parâmetros de rota carregam identificadores e flags, como `nLancamentoId`, `nPagamentoId`, `nInvestimentoId`, `cToken` e `lEntrada`.

## Alternativas consideradas

- Páginas com URL tradicional. Permite endereço direto, mas o recarregamento pode perder o formulário e piora a experiência mobile. Migrar depois para uma navegação de aplicativo de página única é caro.
- Pilha, abas e guarda de rota. É a opção adotada.
- Abas controladas só com `useState`. A implementação é curta, mas não guarda histórico nem protege a área autenticada. Completar o roteamento depois é caro.

## Consequências assumidas

A navegação entre módulos preserva o estado das telas e concentra o controle de acesso na guarda. A manutenção de navegadores aninhados é maior. Se a sessão expirar no meio de um formulário, o preenchimento pode se perder. Neste recorte não há token real; a guarda lê apenas a sessão em memória.
