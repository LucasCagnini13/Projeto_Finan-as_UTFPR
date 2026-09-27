# Desenvolvimento com IA

Processo que os agentes deste repositório devem seguir. Baseado no material de **Projeto usando IA**: a IA multiplica a especificação que recebe. Especificação ruim vira código ruim, rápido.

Documentos irmãos: [`AGENTS.md`](./AGENTS.md) e [`padroes.md`](./padroes.md).

---

## 1. Papéis

| Quem | Faz |
| --- | --- |
| Humano | escolhe o problema, corta escopo, assina ADR, define “pronto”, aceita ou rejeita a entrega |
| IA | rascunha aceite, compara 2–3 alternativas, implementa um recorte, escreve testes proporcionais |

A IA não é autora do produto. Ela orquestra código a partir de uma especificação rastreável.

---

## 2. Ordem que não se inverte

```text
Problema
    → o quê / por quê (escopo, não-escopo e aceite)
    → decisão cara, se houver (ADR)
    → implementação de UM recorte
    → testes e evidência
    → revisão
```

Não comece pelo código. Não peça o aplicativo inteiro. Não desenhe tela sem requisito. Não pergunte “qual é o melhor?”: peça 2–3 alternativas com consequências neste projeto; o humano decide.

---

## 3. Anatomia de um pedido que funciona

Todo pedido de código precisa destes cinco blocos. Se um faltar, o agente pergunta antes de implementar.

| Elemento | Pergunta | Exemplo neste projeto |
| --- | --- | --- |
| Contexto | Onde isso vive? | `backend/`, Express + Prisma, transação do usuário logado |
| Tarefa | O que fazer agora? | `transacaoListar` devolve só as transações daquele `nUsuarioId` |
| Restrições | O que não pode? | controller não acessa Prisma; sem senha no log |
| Formato | Como devolver? | model + service singleton + view JSON |
| Aceite | Quando está pronto? | lista vazia, lista com itens e usuário sem permissão cobertos |

Prompt-mãe: o recorte nasce do README do projeto, de `cursor/padroes.md` e do critério de aceite escrito. Recorte vago → prompt vago → código errado com confiança.

---

## 4. Definition of Ready — pode começar?

Um recorte só entra em implementação quando tiver:

- problema e valor compreensíveis;
- escopo e não-escopo;
- aceite no formato *dado / quando / então*;
- pasta alvo (`frontend`, `backend` ou `cursor`);
- dependências e restrições da stack;
- evidência esperada (tela, rota, teste ou documento).

Modelo mínimo:

```markdown
## Contexto
Problema, público e motivo.

## Objetivo
Resultado esperado, não a solução técnica.

## Escopo
- Incluído:
- Fora:

## Critérios de aceite
- [ ] Dado ... quando ... então ...

## Dependências
-

## Evidências
- código em:
- teste ou verificação:
```

---

## 5. Ciclo de um recorte

1. Confirmar o DoR acima. Se faltar aceite, parar e perguntar.
2. Ler o código e o README da pasta alvo.
3. Se a escolha for cara de desfazer (auth, modelagem, persistência), rascunhar ADR e esperar assinatura.
4. Implementar só aquele recorte, com os nomes de `padroes.md`.
5. Cobrir vazio, carregando, erro e conteúdo extremo.
6. Verificar o que existir na pasta (lint, teste, subida local).
7. Atualizar documentação se a decisão ou a estrutura mudou.
8. O recorte só está pronto quando o aceite foi cumprido — não quando o caso feliz compilou.

### Mini-ciclo quando a feature ainda não tem spec

Antes do código, o agente registra nesta ordem e espera aprovação humana:

1. problema e aceite
2. análise do que já existe
3. recorte técnico (arquivos e camadas)
4. lista de tarefas pequenas
5. implementação
6. verificação

Não pule da ideia para a tela pronta.

---

## 6. O que a IA faz bem e o que ela não decide

A IA faz bem:

- transformar aceite em tarefas;
- listar alternativas com trade-off;
- gerar o código de uma tarefa;
- escrever teste proporcional ao risco;
- apontar buraco de estado (vazio, erro, sem rede).

O humano continua responsável por:

- qual problema vale a pena;
- o que fica fora do recorte;
- assinar ADR;
- aceitar a entrega.

---

## 7. Decisão de arquitetura (ADR)

Se não havia alternativa real, não era decisão. Premissas já fechadas neste projeto não viram ADR:

- React Native + Atomic Design + Redux
- Node + Express + Prisma + MVC + Singleton
- Hungarian Notation e `entidade + ação`

Use ADR para escolha cara de desfazer: autenticação, modelagem de transação, onde calcular saldo, estratégia de persistência.

```markdown
# ADR-00X — título curto

Data: AAAA-MM-DD
Status: proposta | aceita | substituída

## Contexto
O que era verdade quando decidimos.

## Decisão
Usamos X para Y.

## Alternativas consideradas
- Opção A — por que não.
- Opção B — por que não.

## Consequências assumidas
O que aceitamos perder.
```

A IA lista alternativas. Só o humano assina. “A IA sugeriu” não é contexto.

---

## 8. Interface e API

Telas existem por requisito. Toda tela precisa responder: qual aceite pede isto?

No frontend:

- a screen liga Redux, layout e organisms;
- atom não chama API;
- projete o pior caso (lista longa, valor grande, sem rede), não o mockup com 3 itens.

No backend:

- rota → controller → service → model → view;
- Prisma Client e services de domínio são singleton;
- a API é dona da regra (saldo, permissão, validação).

---

## 9. Anti-padrões

- Começar pelo código ou pela tela e escrever o requisito depois.
- Entregar só o caso feliz e chamar de pronto.
- Pedir o app inteiro num único prompt.
- Misturar frontend e backend sem necessidade.
- Desativar lint ou teste para “passar”.
- Inventar feature fora do recorte (investimento, open banking, IA de gasto).
- Versionar `.env`, token ou senha.
- Quebrar Hungarian Notation ou `entidade + ação` “só neste arquivo”.

---

## 10. Definition of Done — pode encerrar?

- [ ] Aceite do recorte cumprido
- [ ] Código na pasta certa, no padrão de `padroes.md`
- [ ] Estados reais cobertos, não só o caminho feliz
- [ ] Verificação local rodada quando existir
- [ ] README ou ADR atualizado se a decisão mudou
- [ ] Nenhum segredo no repositório
