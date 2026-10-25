# Cursor — treinamento da IA

Esta pasta é a fonte de treinamento dos agentes do Cursor neste repositório. Ela não contém código de produto. Contém o processo de desenvolvimento com IA e os padrões que o código precisa obedecer.

A IA é ferramenta de engenharia, não autora do produto. Ela orquestra código a partir de uma especificação rastreável. Pedido vago vira código errado, rápido.

---

## O que a IA deve ler, nesta ordem

1. [`AGENTS.md`](./AGENTS.md) — o que o agente pode e não pode fazer
2. [`desenvolvimento-ia.md`](./desenvolvimento-ia.md) — processo: especificação antes do código
3. [`padroes.md`](./padroes.md) — nomenclatura, Atomic Design, MVC e Singleton
4. [`../README.md`](../README.md) — decisões do projeto
5. o README da pasta que vai mudar: [`../frontend/README.md`](../frontend/README.md) ou [`../backend/README.md`](../backend/README.md)

Não gere código sem passar por essa leitura quando a tarefa for implementação.

---

## Papel desta pasta

| Arquivo | Uso |
| --- | --- |
| `AGENTS.md` | Contrato dos agentes: ordem de trabalho, limites e anti-padrões |
| `desenvolvimento-ia.md` | Processo de desenvolvimento com IA (spec, aceite, ADR, um recorte) |
| `padroes.md` | Hungarian Notation, `entidade + ação` e arquitetura |
| `adr/` | Decisões caras de desfazer. Cache no TanStack Query e navegação em pilha, abas e guarda |
| `recortes/` | Um planejamento por tela: login e cadastro, início, finanças, investimentos e perfil |

O Cursor carrega sozinho:

- [`../AGENTS.md`](../AGENTS.md) na raiz
- as regras em [`../.cursor/rules/`](../.cursor/rules/)
- [`../frontend/AGENTS.md`](../frontend/AGENTS.md) e [`../backend/AGENTS.md`](../backend/AGENTS.md) quando o trabalho for nessas pastas

Esses arquivos só apontam para cá. Se o processo mudar, mude esta pasta.

---

## Regra de ouro

```text
problema → o quê / por quê / aceite
    → decisão cara, se houver (ADR)
    → um recorte só
    → código + testes + evidência
```

Não comece pelo código. Não peça o aplicativo inteiro. Não desenhe tela sem requisito. Não escolha arquitetura com “qual é o melhor?”.
