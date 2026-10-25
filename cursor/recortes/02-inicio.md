# Recorte 02 — Início

Decisões compartilhadas: [ADR-001](../adr/ADR-001-cache-dados-servidor.md) e [ADR-002](../adr/ADR-002-navegacao.md).

## Contexto

Depois de entrar, a pessoa quer ver o resumo do dia e o que está para vencer. O público é o usuário autenticado na demonstração. A pasta alvo é `frontend/`. O saldo mostrado é o que o serviço devolve; a tela não recalcula.

Requisitos: RF17 e RF24 na exibição; RF20, RF21 e RF23 no fluxo de contas. A notificação de verdade (RF22) fica fora.

## Objetivo

A pessoa vê saldo, entradas, saídas, próximos pagamentos e gastos por categoria, e consegue abrir, cadastrar e baixar uma conta.

## Escopo

- Incluído:
  - `InicioScreen` no visual da referência: saudação “Olá, Professor!”, foto, cartão “Saldo disponível” com R$ 3.250,00, “Atualizado há 5 minutos”, ações Transferir e Histórico, cartões de entradas R$ 5.000,00 e saídas R$ 1.750,00, próximos pagamentos e gráfico Alimentação 55%, Transporte 25% e Lazer 20%.
  - `PagamentoListarScreen`, aberta por “Ver tudo”.
  - `PagamentoDetalheScreen` com o parâmetro `nPagamentoId`.
  - `PagamentoCriarScreen` com descrição, valor, periodicidade, vencimento (RF20) e lembrete em dias (RF21). O lembrete fica salvo no mock e a tela confirma. Não há push.
  - Marcar o pagamento como pago (RF23) invalida `saldoChaveObter`, `transacaoChaveListar` e `pagamentoChaveListar`.
  - “Histórico” navega para a aba Finanças.
  - “Transferir” abre o formulário de lançamento do recorte 03 já como saída, com `lEntrada: false`.
  - Dados vindos de `saldoObter` e `pagamentoListar` via TanStack Query.
- Fora:
  - Cálculo oficial do saldo, que será da API.
  - Envio de notificação (RF22).
  - Extrato completo, categorias e rendas, que estão no recorte 03.

## Critérios de aceite

- [ ] Dado o usuário da demonstração autenticado, quando abre Início, então vê saudação, saldo R$ 3.250,00, entradas, saídas, dois pagamentos e o gráfico da referência, com as quatro abas.
- [ ] Dado a lista de pagamentos ainda respondendo, quando abre “Ver tudo”, então aparece o estado de carregamento.
- [ ] Dado nenhum pagamento, quando abre “Ver tudo”, então aparece o estado vazio com ação de cadastrar.
- [ ] Dado falha do mock de pagamentos, quando a lista carrega, então aparece o erro com nova tentativa.
- [ ] Dado um pagamento, quando marca como pago, então o início e as finanças passam a refletir a baixa depois da invalidação.
- [ ] Dado o cartão de saldo, quando toca em Histórico, então abre a lista de finanças. Quando toca em Transferir, então abre o lançamento com `lEntrada: false`.

## Dependências

- Sessão do recorte 01.
- QueryClient, `saldoChaveObter` e `pagamentoChaveListar`.
- Átomos de estado (`EstadoCarregando`, `EstadoVazio`, `EstadoErro`) e organismos `SaldoResumoCard`, `ResumoEntradaSaida`, `PagamentoLista` e `GraficoCategoria`.
- O destino de Transferir existe no recorte 03. Até lá, a rota pode existir vazia, mas o parâmetro `lEntrada` já é passado.

## Arquivos previstos

- `frontend/src/screens/inicio/InicioScreen.jsx`
- `frontend/src/screens/inicio/PagamentoListarScreen.jsx`
- `frontend/src/screens/inicio/PagamentoDetalheScreen.jsx`
- `frontend/src/screens/inicio/PagamentoCriarScreen.jsx`
- `frontend/src/services/saldoService.js`
- `frontend/src/services/pagamentoService.js`
- `frontend/src/components/organisms/SaldoResumoCard.jsx`
- `frontend/src/components/organisms/GraficoCategoria.jsx`

## Estados

- Carregando: atraso do mock antes de saldo e pagamentos.
- Vazio: nenhum pagamento futuro, com ação de cadastrar conta.
- Erro: falha do mock na lista, com nova tentativa.
- Extremo: descrição longa de conta e valor alto no cartão, sem quebrar o layout. O olho do cartão de saldo oculta e revela o valor.

## Nota de implementação

A carteira de demonstração pertence ao usuário `nId` 1, Professor Convidado. A saudação usa o primeiro nome: “Olá, Professor!”. Conta nova abre o início sem saldo e sem pagamentos. Histórico e Transferir já navegam para a aba Finanças; o formulário completo do lançamento continua no recorte 03, mas a rota de Transferir recebe `lEntrada: false`.

## Evidências

- Código das telas de início em `frontend/`.
- `node scripts/pagamentoConferir.js` cobre o resumo da referência, a conta vazia, a baixa, o valor extremo e a falha seguida de nova tentativa.
- A passagem visual no Expo Go: entrar com a conta de demonstração, abrir um pagamento pelo `nPagamentoId`, marcar como pago e ver o saldo mudar.
