# Frontend — Projeto Finanças UTFPR

Aplicativo mobile em **React Native**, organizado por **Atomic Design**, com **Redux** para o estado da interface.

Antes de criar tela, componente ou action, leia [`../cursor/AGENTS.md`](../cursor/AGENTS.md), [`../cursor/desenvolvimento-ia.md`](../cursor/desenvolvimento-ia.md) e [`../cursor/padroes.md`](../cursor/padroes.md).

---

## Como rodar

Na pasta `frontend/`:

```bash
npm install
npx expo start
```

O Expo abre o aplicativo no navegador, no emulador ou no Expo Go. Não há API neste momento.

Conta de demonstração, só no mock em memória:

- e-mail: `professor@email.com`
- senha: `123456`
- nome na saudação: Professor Convidado

O login já abre com esses campos preenchidos.

O que está implementado:

- Recorte 01, em [`../cursor/recortes/01-login-cadastro.md`](../cursor/recortes/01-login-cadastro.md): login, cadastro, recuperação simulada de senha e a guarda que esconde as abas até existir sessão.
- Recorte 02, em [`../cursor/recortes/02-inicio.md`](../cursor/recortes/02-inicio.md): início com saldo, entradas, saídas, próximos pagamentos e gráfico.
- Recorte 03, em [`../cursor/recortes/03-financas.md`](../cursor/recortes/03-financas.md): histórico, filtro, lançamento, comprovante, categorias e rendas. O saldo do início muda quando um lançamento é salvo, editado ou excluído.
- Recorte 04, em [`../cursor/recortes/04-investimentos.md`](../cursor/recortes/04-investimentos.md): autorização simulada do Banco Central e da B3, carteira de exemplo e detalhe do ativo. Não é a posição real e não há recomendação.
- Recorte 05, em [`../cursor/recortes/05-perfil.md`](../cursor/recortes/05-perfil.md): perfil com nome, e-mail e CPF mascarado, edição e saída. Sair limpa a sessão e o cache e volta ao login.

---

## Decisões

| Tema | Escolha |
| --- | --- |
| Framework | React Native |
| Arquitetura de UI | Atomic Design |
| Estado de interface | Redux para sessão, filtros e modais |
| Dados financeiros | TanStack Query, com mock enquanto não há API |
| Comunicação com API | services HTTP |
| Nomenclatura | Hungarian + `entidadeAcao` |

O Redux guarda a sessão e o que é só da interface, como filtros e modais. Saldo, pagamentos e as outras listas financeiras ficam no TanStack Query. A tela mostra o que o serviço devolve; o cálculo oficial do saldo permanece no backend.

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
    ├── navigation/         # guarda, pilha de autenticação e abas
    ├── screens/            # páginas que o usuário navega
    ├── store/              # store, slices e selectors do Redux
    ├── services/           # chamadas para o backend, ou mock neste recorte
    └── theme/              # cores da interface
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
