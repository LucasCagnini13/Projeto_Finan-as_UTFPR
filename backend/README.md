# Backend — Projeto Finanças UTFPR

API REST em **Node.js** e **Express**, com **Prisma** para o banco, organizada em **MVC**. Serviços compartilhados e o client do Prisma são **Singleton**.

Antes de criar rota, model ou service, leia [`../cursor/AGENTS.md`](../cursor/AGENTS.md), [`../cursor/desenvolvimento-ia.md`](../cursor/desenvolvimento-ia.md) e [`../cursor/padroes.md`](../cursor/padroes.md).

---

## Decisões

| Tema | Escolha |
| --- | --- |
| Runtime | Node.js |
| Framework HTTP | Express |
| ORM | Prisma |
| Organização | MVC |
| Instância única | Singleton |
| Nomenclatura | Hungarian + `entidadeAcao` |

A API é a dona da regra de negócio. O aplicativo apenas envia dados e mostra o resultado.

---

## Estrutura MVC

```text
backend/
├── prisma/
│   └── schema.prisma
└── src/
    ├── controllers/    # C — entrada e saída HTTP
    ├── models/         # M — persistência com Prisma
    ├── views/          # V — montagem do JSON
    ├── services/       # regras de negócio + singletons
    └── routes/         # declaração das URLs
```

### Papel de cada camada

| Camada | Faz | Não faz |
| --- | --- | --- |
| Route | liga verbo + caminho ao controller | validar saldo ou falar com o banco |
| Controller | lê `req`, chama service, devolve `res` | escrever `prisma.transacao.findMany` |
| Service | valida, calcula, orquestra | formatar JSON de resposta |
| Model | CRUD via Prisma | decidir se o usuário pode ver o dado |
| View | padroniza o payload (`oResposta`) | alterar banco |

Fluxo de uma requisição:

```text
rota → controller → service → model/Prisma → view → JSON
```

---

## Singleton

Usamos Singleton quando só pode existir uma instância viva no processo: Prisma Client, configuração e services de domínio.

```js
class PrismaServico {
    static oInstancia = null;

    static obterInstancia() {
        if (!PrismaServico.oInstancia) {
            PrismaServico.oInstancia = new PrismaClient();
        }

        return PrismaServico.oInstancia;
    }
}

export const oPrisma = PrismaServico.obterInstancia();
```

O mesmo padrão vale para services:

```js
class TransacaoServico {
    static oInstancia = null;

    static obterInstancia() {
        if (!TransacaoServico.oInstancia) {
            TransacaoServico.oInstancia = new TransacaoServico();
        }

        return TransacaoServico.oInstancia;
    }

    async transacaoListar(nUsuarioId) {
        return transacaoModel.transacaoListar(nUsuarioId);
    }
}

export const oTransacaoServico = TransacaoServico.obterInstancia();
```

Não instancie `new PrismaClient()` dentro de controller, model ou rota.

---

## Exemplo MVC no domínio financeiro

### Rota

```js
oRota.get("/transacoes", oTransacaoController.transacaoListar);
oRota.post("/transacoes", oTransacaoController.transacaoCriar);
```

### Controller

```js
async function transacaoListar(oRequisicao, oResposta) {
    const nUsuarioId = Number(oRequisicao.usuario.nId);
    const mTransacoes = await oTransacaoServico.transacaoListar(nUsuarioId);

    return oResposta.json(transacaoListaFormatar(mTransacoes));
}
```

### Model

```js
async function transacaoListar(nUsuarioId) {
    return oPrisma.transacao.findMany({
        where: { nUsuarioId }
    });
}
```

### View

```js
function transacaoListaFormatar(mTransacoes) {
    return {
        lSucesso: true,
        mDados: mTransacoes
    };
}
```

Nomes de métodos continuam `entidade + ação` em todas as camadas: `transacaoListar`, `transacaoCriar`, `usuarioBuscar`, `saldoCalcular`.

---

## Prisma

O schema fica em `backend/prisma/schema.prisma`. Models do banco usam nomes de domínio claros (`Usuario`, `Transacao`, `Categoria`).

Campos persistidos podem seguir o prefixo Hungarian quando o time padronizar o schema. Se o Prisma gerar nomes sem prefixo, a conversão para `nId`, `cNome` e `lAtivo` acontece na view ou no model, para o restante do código nunca misturar os dois estilos.

Comandos previstos:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

---

## Nomenclatura no backend

```js
function usuarioBuscar(nId) {}
function usuarioCriar(oUsuario) {}
function transacaoListar(nUsuarioId) {}
function saldoCalcular(mTransacoes) {}
```

```js
const nUsuarioId = 10;
const cEmail = "lucas@utfpr.edu.br";
const lAtivo = true;
const mTransacoes = [];
const oResposta = { lSucesso: true, mDados: mTransacoes };
```

---

## Variáveis de ambiente

Crie `backend/.env` a partir de um `.env.example`. Nunca commite senha, connection string real ou secret de JWT.

Nomes sugeridos:

```text
DATABASE_URL=
PORT=
JWT_SECRET=
```

---

## Checklist antes de abrir PR

- [ ] A rota só aponta para o controller?
- [ ] O controller não acessa o Prisma diretamente?
- [ ] Service e Prisma Client são singleton?
- [ ] A view só formata resposta?
- [ ] Funções usam `entidadeAcao`?
- [ ] Variáveis usam Hungarian Notation?
- [ ] Nenhum dado sensível entrou no commit?
