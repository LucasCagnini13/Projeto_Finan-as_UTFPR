# Recorte 04 — Investimentos

Decisões compartilhadas: [ADR-001](../adr/ADR-001-cache-dados-servidor.md) e [ADR-002](../adr/ADR-002-navegacao.md).

## Contexto

A pessoa quer ver os investimentos ligados às instituições que ela autorizar. O público é o usuário autenticado. A pasta alvo é `frontend/`. Banco Central e B3 aparecem só como autorização simulada. Não há chamada externa.

Os ativos desta fase são uma carteira de exemplo no formato que a API futura devolveria (ativo, quantidade, valor investido e valor atual). Não são a posição real de uma pessoa, porque o aplicativo ainda não consulta uma instituição.

Requisitos: RF25, RF26 e RF27, na forma de demonstração.

Recomendações ficam fora. Uma sugestão sem o estilo do investidor seria genérica. O perfil (conservador, moderado ou arrojado) e as recomendações ligadas a ele entram num planejamento próprio, depois.

## Objetivo

A pessoa autoriza a consulta simulada e passa a ver a carteira de exemplo, com o detalhe de cada ativo.

## Escopo

- Incluído:
  - `InvestimentoListarScreen`. Sem autorização, a lista fica vazia e explica que é preciso autorizar.
  - Interruptor local para Banco Central e para B3 (RF26). A autorização fica no mock, não numa API.
  - Com autorização, `investimentoListar` devolve a carteira pela chave `investimentoChaveListar` (RF25, RF27): nome do ativo, quantidade, valor investido e valor atual.
  - `InvestimentoDetalheScreen` recebe `nInvestimentoId`.
  - Uma falha simulada da instituição mostra erro com nova tentativa. A nova tentativa pode concluir.
- Fora:
  - Integração real com o Banco Central ou com a B3.
  - Ordem de compra ou venda.
  - Estilo do investidor e recomendações. Dependem de um recorte futuro, porque a sugestão precisa do perfil antes de aparecer.
  - Qualquer cálculo de rentabilidade além dos valores já devolvidos pelo mock.

## Critérios de aceite

- [ ] Dado sessão sem autorização, quando abre Investimentos, então a lista está vazia e oferece autorizar.
- [ ] Dado a autorização ligada, quando a consulta termina, então aparecem ativo, quantidade, valor investido e valor atual.
- [ ] Dado um ativo, quando toca, então o detalhe abre com o `nInvestimentoId` daquele item.
- [ ] Dado a sincronização em falha, quando a tela pede de novo, então o erro aparece e a nova tentativa pode concluir.
- [ ] Dado a consulta ainda respondendo, quando a autorização acaba de ser ligada, então a lista mostra carregamento antes dos ativos.
- [ ] Dado a aba aberta, quando a pessoa percorre a tela, então não há bloco de recomendação nem pergunta de perfil.

## Dependências

- Sessão do recorte 01 e a aba Investimentos do ADR-002.
- `investimentoChaveListar` e `investimentoService`.
- Átomos de carregando, vazio e erro.
- Organismo `InvestimentoLista`.

## Arquivos previstos

- `frontend/src/screens/investimento/InvestimentoListarScreen.jsx`
- `frontend/src/screens/investimento/InvestimentoDetalheScreen.jsx`
- `frontend/src/services/investimentoService.js`
- `frontend/src/components/organisms/InvestimentoLista.jsx`

## Estados

- Carregando: atraso do mock depois de autorizar ou de tentar de novo.
- Vazio: nenhuma autorização, com ação de autorizar. Também vazio se a instituição autorizada não devolver ativos.
- Erro: falha simulada da sincronização, com nova tentativa.
- Extremo: nome longo de ativo e valor alto na linha, sem quebrar o cartão.

## Nota de implementação

A chave da lista inclui `nUsuarioId`, como as outras listas financeiras, para a autorização de uma conta não aparecer em outra. O botão "Simular falha da instituição" arma uma falha única; "Tentar de novo" conclui.

## Evidências

- Código das telas de investimento em `frontend/`.
- `node scripts/investimentosConferir.js` cobre lista vazia sem autorização, carteira após autorizar, detalhe por `nInvestimentoId`, valor extremo, falha e nova tentativa.
- A passagem visual no Expo Go: abrir Investimentos vazio, autorizar, abrir um ativo e simular a falha. A tela não mostra recomendação nem perfil de investidor.
