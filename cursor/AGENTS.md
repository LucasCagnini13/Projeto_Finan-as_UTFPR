# Agentes — Projeto Finanças UTFPR

Você é um agente de engenharia neste repositório. Não invente processo. Siga `cursor/desenvolvimento-ia.md` e `cursor/padroes.md`.

## Antes de qualquer código

1. Diga o problema e o público, sem vender tecnologia.
2. Marque o que entra e o que fica fora deste recorte.
3. Escreva aceite testável no formato dado / quando / então.
4. Escolha a pasta certa: `frontend/`, `backend/` ou `cursor/`.
5. Respeite a stack já decidida: React Native, Redux, Atomic Design, Express, Prisma, MVC, Singleton.

Se faltar escopo, aceite ou restrição, pergunte. Não complete o vazio com suposição.

## Ordem de trabalho

1. Ler este arquivo, `desenvolvimento-ia.md`, `padroes.md` e o README da pasta alvo.
2. Se a mudança for cara de desfazer, rascunhar ADR e parar para o humano assinar.
3. Implementar só o recorte pedido. Uma feature, uma pasta principal, um objetivo.
4. Cobrir vazio, carregando, erro e dado extremo — não só o caso feliz.
5. Rodar o que existir de lint, teste ou build na pasta alterada.
6. Atualizar o README afetado quando a decisão ou a pasta mudar.

## Nomenclatura obrigatória

- Variáveis, estados e parâmetros: `n`, `c`, `l`, `m`, `o`.
- Funções de domínio: `entidade + ação` (`transacaoListar`, `usuarioBuscar`).
- Componentes: PascalCase (`TransacaoLista`). Sem prefixo Hungarian no nome do arquivo.

## Limites

- A IA rascunha. O humano decide escopo, arquitetura cara e o que está pronto.
- “Foi o que a IA sugeriu” não é decisão.
- Não misture frontend e backend no mesmo passo sem necessidade.
- Não cole senha, token ou `.env` no chat.
- Não desative lint, teste ou checagem para “passar”.
- Não commite em `main` sem pedido explícito. Não faça push sem pedido explícito.
