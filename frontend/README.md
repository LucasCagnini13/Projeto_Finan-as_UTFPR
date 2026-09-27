# Frontend — Projeto Finanças UTFPR

Aplicativo mobile em **React Native**, organizado por **Atomic Design**, com **Redux** para o estado da interface.

Antes de criar tela, componente ou action, leia [`../cursor/README.md`](../cursor/README.md).

---

## Decisões

| Tema | Escolha |
| --- | --- |
| Framework | React Native |
| Arquitetura de UI | Atomic Design |
| Estado de interface | Redux |
| Comunicação com API | services HTTP |
| Nomenclatura | Hungarian + `entidadeAcao` |

O Redux guarda o que a interface precisa lembrar: loading, erro, item selecionado, filtros e listas já carregadas. Regra de negócio pesada (cálculo oficial de saldo, validação de permissão) permanece no backend.

---

## Estrutura

```text
frontend/
└── src/
    ├── components/
    │   ├── atoms/          # menor unidade visual, sem regra de negócio
    │   ├── molecules/      # combinação pequena de átomos
    │   ├── organisms/      # bloco completo de uma feature
    │   └── templates/      # esqueleto da tela (header, conteúdo, rodapé)
    ├── screens/            # páginas que o usuário navega
    ├── store/              # store, slices e selectors do Redux
    └── services/           # chamadas para o backend
```

### O que entra em cada camada

| Camada | Pode | Não pode |
| --- | --- | --- |
| Atom | receber `cTitulo`, `lDesabilitado`, `aoPressionar` | buscar API ou ler Redux de feature |
| Molecule | juntar input + label + erro | conhecer a entidade `transacao` por completo |
| Organism | listar transações, mostrar saldo, disparar action | acessar Prisma ou SQL |
| Template | posicionar header e área scroll | calcular total financeiro |
| Screen | ligar Redux, service e template | redesenhar botão ou input do zero |
| Store | estado de UI e dados já buscados | formatar JSON da API |
| Service | `transacaoListar()`, `usuarioAutenticar()` | renderizar componente |

---

## Atomic Design no projeto

### Atoms

Peças reutilizáveis e burros de regra de negócio.

Exemplos: `BotaoPrimario`, `TextoTitulo`, `CampoTexto`, `IconeStatus`.

```jsx
export function BotaoPrimario({ cTitulo, lDesabilitado, aoPressionar }) {
    return (
        <Pressable disabled={lDesabilitado} onPress={aoPressionar}>
            <Text>{cTitulo}</Text>
        </Pressable>
    );
}
```

### Molecules

Átomos compostos para um uso específico de interface.

Exemplos: `CampoFormulario`, `ItemLinhaValor`, `BadgeCategoria`.

### Organisms

Blocos que representam uma parte da feature.

Exemplos: `SaldoResumoCard`, `TransacaoLista`, `CategoriaSeletor`.

```jsx
export function TransacaoLista({ mTransacoes, transacaoSelecionar }) {
    return mTransacoes.map((oTransacao) => (
        <ItemLinhaValor
            key={oTransacao.nId}
            cTitulo={oTransacao.cDescricao}
            nValor={oTransacao.nValor}
            aoPressionar={() => transacaoSelecionar(oTransacao)}
        />
    ));
}
```

### Templates e screens

O template só define o layout. A screen busca dados, lê o Redux e passa props.

```jsx
export function TransacaoListarScreen() {
    const mTransacoes = useSelector(transacaoListaObter);
    const lCarregando = useSelector(transacaoCarregandoObter);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(transacaoListar());
    }, [dispatch]);

    return (
        <TelaListaTemplate
            cTitulo="Transações"
            lCarregando={lCarregando}
        >
            <TransacaoLista
                mTransacoes={mTransacoes}
                transacaoSelecionar={(oTransacao) => dispatch(transacaoSelecionar(oTransacao))}
            />
        </TelaListaTemplate>
    );
}
```

---

## Redux — estado de UI

Cada fatia do domínio financeiro ganha um slice. Actions e thunks seguem `entidade + ação`.

```text
store/
├── index.js
├── usuarioSlice.js
├── transacaoSlice.js
└── categoriaSlice.js
```

Estado típico de um slice:

```js
const oEstadoInicial = {
    mItens: [],
    oItemSelecionado: null,
    lCarregando: false,
    cErro: ""
};
```

Exemplos de actions:

```text
transacaoListar
transacaoSelecionar
transacaoFiltroDefinir
usuarioAutenticar
saldoAtualizar
```

O componente não monta URL nem trata status HTTP. Ele despacha `transacaoListar()` e o service/thunk fala com a API.

---

## Nomenclatura no frontend

```js
const [cDescricao, setCDescricao] = useState("");
const [nValor, setNValor] = useState(0);
const [lEntrada, setLEntrada] = useState(true);

const mCategorias = useSelector(categoriaListaObter);
const oUsuario = useSelector(usuarioAtualObter);
```

Funções de domínio:

```js
transacaoCriar();
transacaoListar();
transacaoExcluir();
categoriaBuscar();
usuarioSair();
```

Setters do `useState` podem manter o prefixo (`setCDescricao`). Funções que fazem alguma ação de negócio não usam `set`: usam `entidadeAcao`.

---

## Comunicação com o backend

Os services ficam em `src/services/` e devolvem objetos já no formato do app.

```js
export async function transacaoListar() {
    const oResposta = await api.get("/transacoes");
    return oResposta.data;
}

export async function transacaoCriar(oTransacao) {
    const oResposta = await api.post("/transacoes", oTransacao);
    return oResposta.data;
}
```

A URL base da API vem de variável de ambiente, nunca hardcoded em tela.

---

## Checklist antes de abrir PR

- [ ] O componente novo está na camada atômica correta?
- [ ] Variáveis, estados e parâmetros usam Hungarian Notation?
- [ ] Funções de domínio estão no formato `entidadeAcao`?
- [ ] A screen não contém SQL, Prisma ou regra de saldo?
- [ ] Loading e erro passam pelo Redux quando forem compartilhados?
- [ ] Não existe botão ou input duplicado que já exista em `atoms/`?
