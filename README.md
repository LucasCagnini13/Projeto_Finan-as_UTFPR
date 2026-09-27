# Projeto Finanças UTFPR

Aplicativo mobile de gestão financeira pessoal, desenvolvido na disciplina de **Desenvolvimento Mobile** da UTFPR.

O repositório está organizado em três pastas independentes: aplicativo, API e padrões de código. Toda implementação deve seguir as decisões técnicas registradas neste README e o detalhamento em [`cursor/README.md`](./cursor/README.md).

**Repositório:** [github.com/LucasCagnini13/Projeto_Finan-as_UTFPR](https://github.com/LucasCagnini13/Projeto_Finan-as_UTFPR)

---

## Sumário

- [Objetivo](#objetivo)
- [Decisões técnicas](#decisões-técnicas)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Frontend](#frontend)
- [Backend](#backend)
- [Padrões de código](#padrões-de-código)
- [Como começar](#como-começar)
- [Fluxo Git](#fluxo-git)
- [Documentação](#documentação)

---

## Objetivo

Centralizar receitas, despesas e o saldo do usuário em um aplicativo mobile, com uma API própria para persistir e consultar os dados.

O código precisa ser previsível para a equipe e para a IA: nomes, pastas e responsabilidades não mudam de arquivo para arquivo.

---

## Decisões técnicas

| Área | Decisão |
| --- | --- |
| Frontend | React Native |
| Arquitetura de interface | Atomic Design |
| Estado da interface | Redux |
| Backend | Node.js + Express |
| Acesso a dados | Prisma |
| Organização da API | MVC |
| Instâncias compartilhadas | Singleton |
| Variáveis | Hungarian Notation (`n`, `c`, `l`, `m`, `o`) |
| Funções de domínio | `[entidade] + [ação]` |

Essas regras valem para frontend e backend, inclusive estados, parâmetros e serviços.

---

## Estrutura do repositório

```text
Projeto_Financas_UTFPR/
├── README.md
├── .gitignore
├── frontend/                 # aplicativo React Native
├── backend/                  # API Express + Prisma
└── cursor/        # convenções obrigatórias
```

| Pasta | Responsabilidade |
| --- | --- |
| `frontend/` | Telas, componentes atômicos, Redux e consumo da API |
| `backend/` | Rotas, controllers, models, views JSON, Prisma e singletons |
| `cursor/` | Nomenclatura, arquitetura e exemplos corretos/incorretos |

Não misture código de aplicativo com código de API. Padrões ficam documentados em `cursor/`, não espalhados em comentários soltos.

---

## Frontend

Stack: **React Native**, **Atomic Design** e **Redux** para o estado da interface.

```text
frontend/src/
├── components/
│   ├── atoms/          # botão, texto, input, ícone
│   ├── molecules/      # campo de formulário, item de lista
│   ├── organisms/      # card de saldo, lista de transações
│   └── templates/      # layout de tela
├── screens/            # páginas do aplicativo
├── store/              # slices e store do Redux
└── services/           # chamadas HTTP para a API
```

Regras rápidas:

- um átomo não conhece regra de negócio;
- a tela monta organismos, não redesenha botão do zero;
- loading, erro, seleção e filtros de UI ficam no Redux;
- funções de domínio usam `entidade + ação`, por exemplo `transacaoListar()` e `saldoCalcular()`.

Leia o detalhe em [`frontend/README.md`](./frontend/README.md).

---

## Backend

Stack: **Node.js**, **Express**, **Prisma**, **MVC** e **Singleton**.

```text
backend/
├── prisma/             # schema e migrations
└── src/
    ├── controllers/    # recebe a requisição e devolve a resposta
    ├── models/         # acesso aos dados via Prisma
    ├── views/          # formatação do JSON de resposta
    ├── services/       # regras de negócio e singletons
    └── routes/         # mapeamento das URLs
```

Regras rápidas:

- o controller não fala com o banco diretamente;
- o model usa o Prisma Client singleton;
- o service concentra regra de negócio e também é singleton quando a instância deve ser única;
- a view só formata o payload, sem calcular saldo ou validar permissão.

Leia o detalhe em [`backend/README.md`](./backend/README.md).

---

## Padrões de código

### Variáveis — Hungarian Notation

| Tipo | Prefixo | Exemplos |
| --- | --- | --- |
| number | `n` | `nId`, `nQuantidade`, `nTotal` |
| string | `c` | `cNome`, `cDescricao`, `cMensagem` |
| boolean | `l` | `lAtivo`, `lPossuiPermissao` |
| lista / array | `m` | `mUsuarios`, `mTransacoes` |
| objeto | `o` | `oUsuario`, `oConfig`, `oResposta` |

```js
const nUsuarioId = 10;
const cNomeUsuario = "Lucas";
const lUsuarioAtivo = true;
const mUsuarios = [];
const oUsuario = {
    nId: nUsuarioId,
    cNome: cNomeUsuario,
    lAtivo: lUsuarioAtivo
};
```

Aplique o prefixo em variáveis, estados e parâmetros quando o tipo for claro.

### Funções — entidade + ação

Formato: `[entidade] + [ação]`. Funções da mesma entidade ficam agrupadas na busca e no arquivo.

```js
usuarioBuscar();
usuarioCriar();
usuarioAtualizar();
usuarioExcluir();

transacaoBuscar();
transacaoListar();
transacaoAtualizar();
transacaoExcluir();

categoriaListar();
saldoCalcular();
```

Evite `buscarUsuario()` ou `listarTransacoes()`. O substantivo vem primeiro.

O guia completo, com estados Redux, controllers, Prisma e exemplos do domínio financeiro, está em [`cursor/README.md`](./cursor/README.md).

---

## Como começar

O repositório ainda é a base de organização e documentação. Quando o código for criado:

```bash
# API
cd backend
npm install
npx prisma migrate dev
npm run dev

# Aplicativo
cd frontend
npm install
npx expo start
```

Variáveis de ambiente ficam em `.env` (não versionado). Use `.env.example` só com nomes, nunca com senha ou token.

---

## Fluxo Git

```bash
git init
git add .
git commit -m "docs: estruturar repositório e padrões de código"
git branch -M main
git remote add origin https://github.com/LucasCagnini13/Projeto_Finan-as_UTFPR.git
git push -u origin main
```

Se o remoto já existir, use só `git push -u origin main`.

---

## Documentação

| Arquivo | Conteúdo |
| --- | --- |
| [README.md](./README.md) | Visão geral do projeto e decisões |
| [frontend/README.md](./frontend/README.md) | Atomic Design, Redux e pastas do app |
| [backend/README.md](./backend/README.md) | MVC, Singleton, Express e Prisma |
| [cursor/README.md](./cursor/README.md) | Nomenclatura e exemplos obrigatórios |

---

## Autoria

Projeto acadêmico — UTFPR  
Repositório: [LucasCagnini13/Projeto_Finan-as_UTFPR](https://github.com/LucasCagnini13/Projeto_Finan-as_UTFPR)
