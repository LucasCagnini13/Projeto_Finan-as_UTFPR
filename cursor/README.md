# Padrões de código — Projeto Finanças UTFPR

Este arquivo é a referência obrigatória de nomenclatura e organização. Frontend e backend seguem as mesmas regras. Se um nome novo não se encaixar aqui, o padrão deste documento vence o hábito pessoal.

Documentos relacionados:

- visão geral: [`../README.md`](../README.md)
- aplicativo: [`../frontend/README.md`](../frontend/README.md)
- API: [`../backend/README.md`](../backend/README.md)

---

## Sumário

1. [Por que padronizar](#1-por-que-padronizar)
2. [Hungarian Notation — variáveis](#2-hungarian-notation--variáveis)
3. [Funções — entidade + ação](#3-funções--entidade--ação)
4. [Onde aplicar](#4-onde-aplicar)
5. [Exemplos do domínio financeiro](#5-exemplos-do-domínio-financeiro)
6. [Frontend](#6-frontend)
7. [Backend](#7-backend)
8. [Arquivos e pastas](#8-arquivos-e-pastas)
9. [O que evitar](#9-o-que-evitar)
10. [Checklist](#10-checklist)

---

## 1. Por que padronizar

Duas regras resolvem a maior parte das discussões de nome:

1. olhar uma variável e saber o tipo sem abrir o tipo TypeScript;
2. olhar uma função e saber a entidade antes da ação, para o arquivo e a busca agruparem tudo que é daquela entidade.

Por isso `mTransacoes` e `transacaoListar()` são o padrão. `listaDeTransacoes` e `buscarTransacoes()` não são.

---

## 2. Hungarian Notation — variáveis

O prefixo indica o tipo. O restante do nome descreve o significado em português, com a primeira letra após o prefixo em maiúscula.

| Tipo | Prefixo | Exemplos |
| --- | --- | --- |
| number | `n` | `nId`, `nQuantidade`, `nTotal`, `nValor` |
| string | `c` | `cNome`, `cDescricao`, `cMensagem`, `cEmail` |
| boolean | `l` | `lAtivo`, `lPossuiPermissao`, `lCarregando` |
| lista / array | `m` | `mUsuarios`, `mTransacoes`, `mCategorias` |
| objeto | `o` | `oUsuario`, `oConfig`, `oResposta`, `oTransacao` |

O `c` vem de *character/string*. O `l` vem de *logical/boolean*. O `m` vem de *multiple/lista*.

### Exemplo base

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

### Regras

- Use o prefixo em variáveis locais, estados, parâmetros e propriedades de objetos do domínio quando o tipo for estável.
- Um array de objetos continua `m`: `mTransacoes`, nunca `oTransacoes`.
- Um único registro é `o`: `oTransacao`.
- Número em string (texto de input) é `c`, não `n`. Converta antes de calcular:

```js
const cValorDigitado = "12.50";
const nValor = Number(cValorDigitado);
```

- Booleanos começam com ideia de sim/não: `lAtivo`, `lEntrada`, `lPossuiPermissao`. Evite `lStatus`.
- Contadores e totais são `n`: `nTotal`, `nQuantidade`, `nSaldo`.

### Estados React

```js
const [cDescricao, setCDescricao] = useState("");
const [nValor, setNValor] = useState(0);
const [lEntrada, setLEntrada] = useState(true);
const [mTransacoes, setMTransacoes] = useState([]);
const [oTransacaoSelecionada, setOTransacaoSelecionada] = useState(null);
```

O valor guarda o prefixo. O setter do React pode repetir o prefixo (`setCDescricao`). Isso não substitui as funções de domínio.

### Parâmetros

```js
function transacaoCriar(nUsuarioId, cDescricao, nValor, lEntrada) {}

function usuarioAtualizar(oUsuario) {}

function categoriaFiltrar(mCategorias, cNome) {}
```

---

## 3. Funções — entidade + ação

Formato obrigatório para funções de domínio:

```text
[entidade] + [ação]
```

A entidade vem primeiro, em camelCase, sem prefixo Hungarian. A ação vem em seguida, com verbo claro.

### Evite

```js
buscarOnibus();
listarOnibus();
selecionarOnibus();
buscarUsuario();
listarTransacoes();
calcularSaldo();
```

### Use

```js
onibusBuscar();
onibusListar();
onibusSelecionar();

usuarioBuscar();
transacaoListar();
saldoCalcular();
```

### Por que essa ordem

No editor, `usuario` agrupa:

```text
usuarioAtualizar
usuarioBuscar
usuarioCriar
usuarioExcluir
```

Com o verbo na frente, essas funções se espalham por `atualizar`, `buscar`, `criar`.

### Ações comuns

| Ação | Uso |
| --- | --- |
| `Buscar` | um registro por id ou chave |
| `Listar` | coleção |
| `Criar` | insert |
| `Atualizar` | update |
| `Excluir` | delete |
| `Selecionar` | marcar item na UI |
| `Obter` | ler valor já existente (selector, singleton, cache) |
| `Calcular` | derivar número |
| `Formatar` | montar view / payload |
| `Validar` | checar regra |
| `Definir` | gravar um campo de estado |
| `Autenticar` / `Sair` | sessão |

Ação composta continua com a entidade na frente:

```js
paradaBuscarProxima();
localizacaoObterAtual();
transacaoFiltrarPorCategoria();
saldoCalcularMensal();
```

---

## 4. Onde aplicar

| Elemento | Padrão |
| --- | --- |
| variável local | Hungarian |
| parâmetro | Hungarian |
| estado React | Hungarian no valor |
| campo de objeto de domínio | Hungarian quando o objeto é nosso |
| função de domínio | `entidadeAcao` |
| action / thunk Redux | `entidadeAcao` |
| controller, service, model, view | `entidadeAcao` |
| componente React | PascalCase, sem prefixo (`TransacaoLista`) |
| classe singleton | PascalCase + sufixo (`TransacaoServico`, `PrismaServico`) |
| instância singleton | Hungarian `o` (`oTransacaoServico`, `oPrisma`) |
| constante de configuração | Hungarian (`cApiUrl`, `nPorta`) |
| evento de UI genérico | pode ser `aoPressionar`, `aoAlterar` (não é domínio) |

Componentes visuais não recebem prefixo Hungarian no nome do arquivo. Props internas, sim.

```jsx
function BotaoPrimario({ cTitulo, lDesabilitado, aoPressionar }) {}
```

---

## 5. Exemplos do domínio financeiro

### Usuário

```js
usuarioBuscar(nId);
usuarioCriar(oUsuario);
usuarioAtualizar(oUsuario);
usuarioExcluir(nId);
usuarioAutenticar(cEmail, cSenha);
usuarioSair();
```

### Transação

```js
transacaoBuscar(nId);
transacaoListar(nUsuarioId);
transacaoCriar(oTransacao);
transacaoAtualizar(oTransacao);
transacaoExcluir(nId);
transacaoSelecionar(oTransacao);
transacaoFiltrarPorCategoria(nCategoriaId);
```

### Categoria e saldo

```js
categoriaListar();
categoriaBuscar(nId);
categoriaCriar(oCategoria);

saldoCalcular(mTransacoes);
saldoCalcularMensal(nAno, nMes);
```

### Objetos

```js
const oTransacao = {
    nId: 1,
    nUsuarioId: 10,
    nCategoriaId: 3,
    cDescricao: "Almoço",
    nValor: 32.9,
    lEntrada: false
};

const mTransacoes = [oTransacao];
const nSaldo = saldoCalcular(mTransacoes);
const lPossuiMovimento = mTransacoes.length > 0;
```

---

## 6. Frontend

Arquitetura: **Atomic Design** + **Redux** para estado de UI.

### Camadas

```text
atoms → molecules → organisms → templates → screens
```

- Atom não importa slice de feature.
- Screen é o único lugar que costuma ligar `useSelector`, `dispatch` e template.
- Organism recebe dados e callbacks prontos.

### Redux

```js
const oEstadoInicial = {
    mTransacoes: [],
    oTransacaoSelecionada: null,
    lCarregando: false,
    cErro: ""
};
```

```js
dispatch(transacaoListar());
dispatch(transacaoSelecionar(oTransacao));
dispatch(transacaoFiltroDefinir(nCategoriaId));

const mTransacoes = useSelector(transacaoListaObter);
const lCarregando = useSelector(transacaoCarregandoObter);
```

O nome do selector também é `entidade + ação`: `transacaoListaObter`, não `getTransacoes`.

### Services HTTP

```js
export async function transacaoListar() {
    const oResposta = await api.get("/transacoes");
    return oResposta.data;
}
```

Não coloque `fetch` dentro de atom ou molecule.

---

## 7. Backend

Arquitetura: **MVC** + **Prisma** + **Singleton** no Express.

```text
rota → controller → service → model → Prisma
                         ↘ view → JSON
```

### Singleton

Uma instância por processo para Prisma e para services de domínio.

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

```js
export const oTransacaoServico = TransacaoServico.obterInstancia();
```

Nunca faça `new PrismaClient()` em arquivo de rota.

### MVC com os nomes do padrão

```js
// controller
async function transacaoListar(oRequisicao, oResposta) {
    const nUsuarioId = Number(oRequisicao.usuario.nId);
    const mTransacoes = await oTransacaoServico.transacaoListar(nUsuarioId);
    return oResposta.json(transacaoListaFormatar(mTransacoes));
}

// service
async function transacaoListar(nUsuarioId) {
    return transacaoModel.transacaoListar(nUsuarioId);
}

// model
async function transacaoListar(nUsuarioId) {
    return oPrisma.transacao.findMany({
        where: { usuarioId: nUsuarioId }
    });
}

// view
function transacaoListaFormatar(mTransacoes) {
    return {
        lSucesso: true,
        mDados: mTransacoes
    };
}
```

O controller recebe `oRequisicao` e `oResposta`, não `req` e `res`, para manter o prefixo de objeto.

Se o Prisma usar colunas sem prefixo (`id`, `usuarioId`), a conversão para Hungarian acontece no model ou na view. O restante da API trabalha só com `nId`, `cDescricao`, `lEntrada`.

---

## 8. Arquivos e pastas

| Tipo | Nome do arquivo | Exemplo |
| --- | --- | --- |
| Componente | PascalCase | `TransacaoLista.jsx` |
| Screen | PascalCase + `Screen` | `TransacaoListarScreen.jsx` |
| Slice Redux | entidade + `Slice` | `transacaoSlice.js` |
| Service frontend | entidade + `Service` | `transacaoService.js` |
| Controller | entidade + `Controller` | `transacaoController.js` |
| Model | entidade + `Model` | `transacaoModel.js` |
| View | entidade + `View` | `transacaoView.js` |
| Service backend | entidade + `Servico` | `TransacaoServico.js` |
| Rota | entidade + `Routes` | `transacaoRoutes.js` |

O nome do arquivo descreve a entidade. Os métodos de dentro descrevem a ação.

---

## 9. O que evitar

```js
// errado — verbo na frente
buscarUsuario();
listarTransacoes();
getSaldo();
setFiltro();

// errado — sem prefixo de tipo
const id = 10;
const nome = "Lucas";
const ativo = true;
const transacoes = [];

// errado — prefixo trocado
const oTransacoes = [];
const mUsuario = { nId: 1 };

// errado — misturar inglês e português sem necessidade
const nUserId = 10;
function userFind() {}

// errado — Hungarian em componente
function OBotao() {}
function MLista() {}
```

```js
// certo
usuarioBuscar();
transacaoListar();
saldoObter();
filtroDefinir();

const nId = 10;
const cNome = "Lucas";
const lAtivo = true;
const mTransacoes = [];
const oUsuario = { nId: 1 };

function BotaoPrimario() {}
function TransacaoLista() {}
```

Não use `any` para escapar do prefixo. Se o tipo é união ou desconhecido, extraia um objeto `oResultado` com campos prefixados.

---

## 10. Checklist

Antes de considerar um arquivo pronto:

- [ ] Toda variável de tipo claro tem prefixo `n`, `c`, `l`, `m` ou `o`
- [ ] Todo parâmetro de função de domínio segue a mesma regra
- [ ] Estados React usam Hungarian no valor
- [ ] Funções de domínio estão em `entidadeAcao`
- [ ] Actions, thunks e selectors Redux seguem `entidadeAcao`
- [ ] Controllers, services, models e views seguem `entidadeAcao`
- [ ] Prisma Client e services compartilhados são singleton
- [ ] Controller não acessa o banco
- [ ] View não calcula regra de negócio
- [ ] Atom não chama API
- [ ] Screen não recria botão ou input que já existe em `atoms/`
- [ ] Nenhum segredo foi commitado

Em dúvida de nome, copie um exemplo deste arquivo e troque só a entidade.
