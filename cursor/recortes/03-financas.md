# Recorte 03 — Finanças

Decisões compartilhadas: [ADR-001](../adr/ADR-001-cache-dados-servidor.md) e [ADR-002](../adr/ADR-002-navegacao.md).

## Contexto

A pessoa precisa registrar, filtrar e revisar o que entrou e saiu. O público é o usuário autenticado. A pasta alvo é `frontend/`. A lista completa vem do cache. O filtro é estado visual e não entra na chave da consulta.

Requisitos: RF09, RF10, RF11, RF12, RF13, RF14, RF15, RF16, RF18 e RF19.

## Objetivo

A pessoa consulta o histórico, cria e altera lançamentos, organiza categorias e registra fontes de renda, com a mesma informação refletida no saldo do início.

## Escopo

- Incluído:
  - `FinancaListarScreen` como histórico (RF18), com descrição, valor e tipo.
  - Filtro por período, categoria, tipo e valor no `filtroSlice` e num modal (RF19). A tela aplica `transacaoFiltrar` sobre `mTransacoes`. Limpar o filtro restaura a lista.
  - `LancamentoCriarScreen` e edição no mesmo formulário, com valor, data, descrição, local, categoria e classificação de entrada ou saída (RF10, RF11, RF12). A rota de criação recebe `lEntrada`. A edição recebe `nLancamentoId`.
  - Exclusão com confirmação (RF12).
  - `LancamentoDetalheScreen` anexa e exibe comprovante (RF13, RF14). O arquivo fica só como URI local no mock.
  - `CategoriaListarScreen` para criar categoria ou pasta (RF09).
  - `RendaListarScreen` com descrição, valor e opção de recorrência, como salário ou aluguel (RF15, RF16).
  - Cada mutação invalida `transacaoChaveListar` e `saldoChaveObter`.
  - Um lançamento do mock tem descrição muito longa e valor alto.
  - Atalho Pagamentos na lista de finanças, abrindo a mesma pilha de contas do recorte 02, com `nPagamentoId`.
- Fora:
  - Saldo oficial calculado na tela.
  - Persistência do comprovante em servidor.
  - Uma segunda regra de baixa. O pagamento continua o do recorte 02.
  - Filtro enviado ao servidor. Neste recorte a filtragem é na lista já carregada.

## Critérios de aceite

- [ ] Dado lançamentos no mock, quando abre Finanças, então a lista mostra descrição, valor e tipo.
- [ ] Dado um filtro que não encontra nada, quando aplica, então a lista entra em vazio e o botão limpa o filtro.
- [ ] Dado a consulta em falha, quando a tela abre, então o erro oferece nova tentativa.
- [ ] Dado valor, data, descrição, local e categoria, quando salva uma saída, então o item aparece na lista e o saldo do início muda após a invalidação.
- [ ] Dado um lançamento aberto por `nLancamentoId`, quando edita, exclui ou anexa comprovante, então o detalhe e a lista mostram o resultado.
- [ ] Dado descrição muito longa e valor alto, quando a lista renderiza, então o texto trunca e o valor continua legível.
- [ ] Dado o botão Transferir do início, quando a rota abre, então o formulário já está como saída.

## Dependências

- Casca, sessão e as chaves `transacaoChaveListar`, `categoriaChaveListar`, `rendaChaveListar` e `saldoChaveObter`.
- `filtroSlice` no Redux, separado do cache.
- Organismo `TransacaoLista` e molécula `ItemLinhaValor`.
- Seletor de imagem do Expo para o comprovante.
- Átomos de carregando, vazio e erro.

## Arquivos previstos

- `frontend/src/screens/financas/FinancaListarScreen.jsx`
- `frontend/src/screens/financas/LancamentoCriarScreen.jsx`
- `frontend/src/screens/financas/LancamentoDetalheScreen.jsx`
- `frontend/src/screens/financas/CategoriaListarScreen.jsx`
- `frontend/src/screens/financas/RendaListarScreen.jsx`
- `frontend/src/services/transacaoService.js`
- `frontend/src/services/categoriaService.js`
- `frontend/src/services/rendaService.js`
- `frontend/src/store/filtroSlice.js`

## Estados

- Carregando: atraso do mock na lista, nas categorias e nas rendas.
- Vazio: nenhum lançamento, ou filtro sem resultado, com texto diferente em cada caso. Categoria e renda também têm vazio com ação de criar.
- Erro: falha da consulta, com nova tentativa. Formulário inválido aponta o campo.
- Extremo: descrição longa truncada e valor alto formatado em reais, sem estourar a linha.

## Nota de implementação

O saldo exibido no início continua o da demonstração (R$ 3.250,00). A lista inclui um lançamento de valor alto só para o texto longo não estourar a linha; ele aparece como “fora do saldo” e a exclusão avisa que não altera essa soma. Uma saída com categoria recalcula as fatias do gráfico. Uma renda nova também cria a entrada correspondente. A partir de um lançamento criado, editado ou excluído nesta tela, o serviço atualiza o saldo e o início reflete a mudança.

## Evidências

- Código das telas de finanças em `frontend/`.
- `node scripts/financasConferir.js` cobre filtro vazio, criação de saída com mudança de saldo, edição, exclusão e valor extremo.
- A passagem visual no Expo Go: abrir Finanças, filtrar sem resultado, limpar, salvar uma saída, anexar comprovante e voltar ao início.
