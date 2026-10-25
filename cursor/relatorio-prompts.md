# Prompts

## 1

**Enviado:** criar a base do repositório com frontend, backend, pasta de padrões e READMEs das decisões técnicas (React Native, Atomic Design, Redux, Express, Prisma, MVC, Singleton, Hungarian Notation e funções entidade + ação).

**Por quê:** o GitHub estava vazio e o projeto precisava nascer já organizado e documentado, não só com código.

**Recebido:** estrutura `frontend/`, `backend/` e `padroes-de-codigo/`, com READMEs descrevendo a stack e os padrões de nomenclatura.

**Aceito:** a organização em três pastas e os READMEs das decisões técnicas.

**Recusado:** as pastas vazias com `.gitkeep` (corrijo no prompt 2).

---

## 2

**Enviado:** remover os `.gitkeep` e não criar pasta vazia só para o Git.

**Por quê:** sem código ainda, pasta vazia não agrega; o importante era a documentação.

**Recebido:** arquivos `.gitkeep` apagados; a estrutura ficou só descrita nos READMEs.

**Aceito:** ficar só com a documentação, sem pasta vazia.

**Recusado:** nada.

---

## 3

**Enviado:** renomear `padroes-de-codigo/` para `cursor/` e atualizar os links.

**Por quê:** essa pasta seria o treinamento da IA no Cursor, não só um guia de nomes.

**Recebido:** pasta `cursor/` criada e referências dos READMEs atualizadas.

**Aceito:** o nome `cursor/` para o treinamento da IA.

**Recusado:** manter o nome `padroes-de-codigo/`.

---

## 4

**Enviado:** a pasta local já está sincronizada com o GitHub?

**Por quê:** conferir se o remoto já tinha o que estava no computador antes de continuar.

**Recebido:** não. Havia Git local, mas faltava commit/push; o repositório remoto ainda estava desatualizado.

**Aceito:** o diagnóstico de que ainda não estava no GitHub.

**Recusado:** enviar ao remoto naquele momento.

---

## 5

**Enviado:** além dos padrões, a pasta `cursor/` deve treinar os agentes no processo de desenvolvimento com IA (especificação antes do código, um recorte por vez).

**Por quê:** a IA precisa seguir um processo de engenharia, e não inventar o produto sozinha.

**Recebido:** `cursor/AGENTS.md`, `desenvolvimento-ia.md`, `padroes.md` e regras em `.cursor/rules/`.

**Aceito:** a pasta `cursor/` como treinamento dos agentes, com spec antes do código.

**Recusado:** nada.

---

## 6

**Enviado:** o Cursor já lê essa documentação sozinho, ou frontend e backend precisam apontar para `cursor/`?

**Por quê:** garantir que, ao desenvolver o app ou a API, o agente use o mesmo processo.

**Recebido:** o Cursor já lê `AGENTS.md` e as rules; foram criados `frontend/AGENTS.md` e `backend/AGENTS.md` apontando para `../cursor/`, sem copiar o texto.

**Aceito:** os ponteiros em frontend e backend para `cursor/`.

**Recusado:** duplicar o processo dentro de `frontend/` e `backend/`.

---

## 7

**Enviado:** fazer commit das alterações, sem push.

**Por quê:** versionar o treinamento da IA no Git, mas deixar o envio ao GitHub explícito.

**Recebido:** commit `721a2fe` — `docs: treinar agentes no processo de desenvolvimento com IA`. Não houve pull request: a alteração foi direto na `main`.

**Aceito:** o commit na `main`.

**Recusado:** o push automático.

---

## 8

**Enviado:** montar cinco planejamentos, um por tela (login e cadastro, início, finanças, investimentos e perfil), só de frontend, com mock, TanStack Query para os dados financeiros e navegação em pilha, abas e guarda. Os arquivos precisavam existir na pasta do projeto.

**Por quê:** a especificação tinha ficado só no plano do Cursor, e os arquivos não apareciam no repositório.

**Recebido:** `cursor/recortes/01-login-cadastro.md`, `02-inicio.md`, `03-financas.md`, `04-investimentos.md`, `05-perfil.md`, mais `cursor/adr/ADR-001-cache-dados-servidor.md` e `cursor/adr/ADR-002-navegacao.md`.

**Aceito:** um arquivo por tela, no formato de recorte, com aceite testável.

**Recusado:** juntar as cinco telas num único documento.

---

## 9

**Enviado:** na tela de investimentos, manter a carteira de exemplo no formato dos ativos da pessoa e, junto, mostrar recomendações.

**Por quê:** o aplicativo ainda não é um banco, mas a tela precisa deixar claro o que seria a carteira autorizada e o que é só sugestão.

**Recebido:** `cursor/recortes/04-investimentos.md` passou a ter dois blocos, "Meus ativos" e "Recomendações", com caches e erros separados. A chave `recomendacaoChaveListar` entrou no ADR-001.

**Aceito:** os dois blocos na mesma aba, sem misturar sugestão com posição.

**Recusado:** tratar a recomendação como ativo que a pessoa já possui, e oferecer compra ou venda neste recorte.

---

## 10

**Enviado:** repensar a recomendação, porque ela depende do estilo de investidor. A decisão foi tirar as recomendações do recorte 04 por enquanto.

**Por quê:** uma sugestão sem perfil seria genérica. O estilo e as recomendações ficam para um planejamento próprio.

**Recebido:** `cursor/recortes/04-investimentos.md` voltou a tratar só a carteira de exemplo. A chave `recomendacaoChaveListar` saiu do ADR-001.

**Aceito:** a aba de investimentos sem recomendação e sem pergunta de perfil neste recorte.

**Recusado:** manter sugestões genéricas na mesma tela.

---

## 11

**Enviado:** construir o planejamento 1.

**Por quê:** o recorte de login e cadastro já estava escrito e era o primeiro a virar tela.

**Recebido:** aplicativo Expo em `frontend/` com login, cadastro, recuperação simulada, redefinição por `cToken`, sessão no Redux e abas protegidas. Início só saúda pelo nome. As outras abas ficam vazias até o próximo recorte.

**Aceito:** implementar só o recorte 01, com mock e a conta `matheus@email.com`.

**Recusado:** antecipar saldo, lançamentos e o conteúdo de finanças, investimentos e perfil.

---

## 12

**Enviado:** fazer a segunda tela, a de início.

**Por quê:** o login já entrava numa saudação vazia, e o recorte 02 pede o resumo do dia com pagamentos.

**Recebido:** início com saldo, entradas, saídas, próximos pagamentos e gráfico, no cache do TanStack Query. A baixa de uma conta atualiza o saldo. Histórico e Transferir abrem a aba Finanças; o extrato completo ficou para o recorte 03.

**Aceito:** a tela de início com mock da referência e os fluxos de pagamento do recorte 02.

**Recusado:** implementar agora a lista completa de lançamentos, categorias e rendas.

---

## 13

**Enviado:** fazer a terceira tela, a de finanças.

**Por quê:** o histórico, o filtro e o lançamento ainda estavam só no recorte, e o botão Transferir abria uma rota vazia.

**Recebido:** lista de movimentações, filtro no Redux, formulário de lançamento, comprovante local, categorias e rendas. Salvar, editar ou excluir invalida o saldo do início.

**Aceito:** o recorte 03 no frontend, com mock e sem calcular o saldo na tela.

**Recusado:** mandar o filtro para uma API e guardar o comprovante em servidor.

---

## 14

**Enviado:** diferenciar o botão Filtrar de Categorias e Rendas, porque os três textos pareciam a mesma ação.

**Por quê:** filtrar mexe na lista atual; categorias e rendas abrem outras telas.

**Recebido:** Filtrar virou um chip com ícone de funil. Categorias e Rendas viraram cartões com ícone, subtítulo e seta.

**Aceito:** o ajuste visual na lista de finanças, sem mudar o que cada botão faz.

**Recusado:** transformar categorias e rendas em botões de criar direto na lista.

---

## 15

**Enviado:** no valor do lançamento, a vírgula e o ponto deveriam entrar sozinhos.

**Por quê:** a pessoa precisava digitar a pontuação na mão, e o teclado decimal nem sempre oferece esses caracteres.

**Recebido:** o campo aceita só dígitos. Os dois últimos viram centavos e o milhar ganha ponto, como `14,00` e `1.400,00`. O mesmo vale para renda, pagamento e filtro.

**Aceito:** a máscara de dinheiro nos campos de valor.

**Recusado:** deixar o texto livre e só formatar depois de sair do campo.

---

## 16

**Enviado:** a data do novo lançamento tem o mesmo problema da pontuação manual.

**Por quê:** o campo pedia `dd/mm/aaaa` e a pessoa precisava digitar as barras.

**Recebido:** a data aceita só números e insere as barras, como `24/10/2026`. O vencimento e o período do filtro usam a mesma máscara.

**Aceito:** a máscara de data nos campos em que a pessoa digita o dia.

**Recusado:** abrir um calendário nativo neste ajuste.

---

## 17

**Enviado:** fazer a tela 4, a de investimentos.

**Por quê:** a aba ainda era um espaço vazio, e o recorte 04 pede a carteira de exemplo depois da autorização simulada.

**Recebido:** interruptores do Banco Central e da B3, lista com ativo, quantidade, valor investido e valor atual, detalhe por `nInvestimentoId` e falha simulada com nova tentativa. Sem recomendação e sem perfil de investidor.

**Aceito:** o recorte 04 no frontend, com mock e sem consultar instituição real.

**Recusado:** compra, venda e sugestão de investimento.

---

## 18

**Enviado:** fazer a tela 5, a de perfil.

**Por quê:** a aba ainda era um espaço vazio, e o recorte 05 pede ver os dados, editar e sair da conta.

**Recebido:** perfil com inicial, nome, e-mail e CPF mascarado. A edição grava nome, e-mail e senha no mock, atualiza a saudação e rejeita e-mail de outra conta. Sair limpa a sessão, o cache e o filtro, e volta ao login.

**Aceito:** o recorte 05 no frontend, com mock e sem excluir a conta.

**Recusado:** trocar a foto e apagar o usuário.

---

## 19

**Enviado:** fazer um login diferente, mais genérico, para o professor usar na aula.

**Por quê:** a conta `matheus@email.com` parecia de uma pessoa específica, e o nome de uma palavra só não passava na edição do perfil.

**Recebido:** a demonstração passou a ser `professor@email.com` / `123456`, no nome Professor Convidado. O login abre com os campos preenchidos. A carteira de `nId` 1 permanece a mesma.

**Aceito:** a conta genérica no mock e no README do frontend.

**Recusado:** criar uma autenticação real ou uma senha diferente da de demonstração.

---

## 20

**Enviado:** resolver as divergências do saldo, do gráfico, das datas, da renda, da falha simulada e do erro junto com a lista antiga.

**Por quê:** os números da tela não batiam com o que o alerta e o gráfico diziam, e uma falha de uma conta atingia a outra.

**Recebido:** o lançamento extremo fica marcado fora do saldo. As fatias saem do valor de cada categoria. Renda nova gera entrada. Vencimento é data e a tela mostra “vence em N dias”. 31/02 deixa de passar. A falha simulada é por usuário. O erro esconde a lista anterior. O perfil já era Professor Convidado.

**Aceito:** essas correções no mock, mantendo o saldo inicial de R$ 3.250,00.

**Recusado:** colocar o valor extremo dentro dos R$ 3.250,00.

---

## 21

**Enviado:** os pagamentos só abriam pela tela inicial. Dá para entrar também por Finanças?

**Por quê:** a pessoa que está no histórico não tinha caminho para as contas a vencer sem voltar ao início.

**Recebido:** Finanças ganhou o atalho Pagamentos. A lista, o detalhe com `nPagamentoId` e o cadastro usam a pilha dessa aba, então voltar permanece em Finanças. O início continua com o mesmo fluxo.

**Aceito:** o atalho na lista de finanças, reutilizando as telas de pagamento.

**Recusado:** duplicar a regra de baixa ou criar outra lista.

---

## 22

**Enviado:** os pagamentos dentro de Finanças ainda não ficaram bons. O scroll fica preso na lista, e não fica claro que é a tela de pagamentos.

**Por quê:** os atalhos ficavam fixos e só os lançamentos rolavam. A lista de contas não tinha título próprio.

**Recebido:** Finanças passou a rolar a página inteira, com a seção Lançamentos separada dos atalhos. A tela de contas abre com o título Pagamentos e um único scroll para o texto, a lista e o botão.

**Aceito:** o mesmo fluxo de pagamento, com a página identificada e o scroll da tela.

**Recusado:** embutir as contas no meio do histórico de lançamentos.
