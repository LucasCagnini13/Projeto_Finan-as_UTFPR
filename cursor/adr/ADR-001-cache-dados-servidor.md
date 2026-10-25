# ADR-001 — Cache dos dados financeiros no cliente

Data: 2026-10-25
Status: aceita

## Contexto

O aplicativo precisa mostrar saldo, lançamentos e investimentos sincronizados entre as telas (RF10, RF17, RF18, RF25) sem misturar esses dados com o que é só da interface, como filtros e modais (RF19). A API ainda não existe neste recorte. O que estava escrito em `frontend/README.md` guardava listas, loading e erro no Redux.

## Decisão

Os dados que pertencem ao servidor ficam no TanStack Query, com chaves estáveis:

- `usuarioChaveAtual`
- `saldoChaveObter(nUsuarioId)`
- `transacaoChaveListar(nUsuarioId)`
- `categoriaChaveListar(nUsuarioId)`
- `pagamentoChaveListar(nUsuarioId)`
- `pagamentoChaveBuscar(nUsuarioId, nPagamentoId)`
- `rendaChaveListar(nUsuarioId)`
- `transacaoChaveBuscar(nUsuarioId, nLancamentoId)`
- `investimentoChaveListar(nUsuarioId)`
- `investimentoChaveBuscar(nUsuarioId, nInvestimentoId)`

O filtro não entra na chave. A consulta guarda a lista inteira e a tela deriva a lista visível com o filtro do Redux. Filtros, modais e a sessão (`lAutenticado`, `oUsuario`) ficam no Redux. Mutação bem-sucedida invalida as chaves afetadas. Nesta fase não há atualização otimista.

Enquanto não houver API, o serviço devolve o mock no mesmo formato húngaro que a tela espera.

## Alternativas consideradas

- Redux para tudo. Centraliza o estado, mas a sincronização com o servidor teria de ser feita à mão. Separar a interface das stores depois é caro.
- `useState` com passagem de props. Serve em tela pequena, mas espalha o mesmo dado por várias telas e facilita inconsistência. Migrar componentes acoplados depois é caro.
- TanStack Query ou SWR. A escolha é o TanStack Query, pela convenção de Query Keys. SWR ficaria de fora para não haver duas convenções de cache.

## Consequências assumidas

A interface atualiza quando o cache é invalidado, com menos código manual de sincronização. Quem for mexer nisso precisa conhecer cache, invalidação e erro de consulta. Trocar a convenção das chaves depois é caro. Sem atualização otimista, o saldo não pisca um valor errado; a tela espera a invalidação.
