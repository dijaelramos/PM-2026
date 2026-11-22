# Material do dia — quarta-feira, 03/02/2027 — Raciocínio Lógico (3 h)

> **Sessão do plano:** Raciocínio Lógico, **sessão 9/10**: **questões integradas dos itens 1 a 4** (estruturas lógicas, argumentação, diagramas, contagem e probabilidade), com correção comentada ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** 30 min de revisão · 1 h 30 de tópicos e exemplos · 1 h de questões com correção.
> **Formato:** síntese em quadros, com exemplos resolvidos (níveis 🟡 e 🔴) ([regra](../.github/regras/material_e_correcao.md)).
> **Fontes:** [Raciocínio Lógico (base)](../Base_de_Conhecimento/RACIOC%C3%8DNIO%20L%C3%93GICO/Racioc%C3%ADnio%20L%C3%B3gico.txt) e os materiais das sessões 1 a 8.
> **Questões do dia:** em arquivo separado, [2027-02-03_Raciocinio_Logico_Questoes.md](2027-02-03_Raciocinio_Logico_Questoes.md), com o estudo dirigido, o mapa, 10 questões **oficiais** (8 da **prova de Soldado PMPE 2023**, 1 da AOCP e 1 da CEV-UECE) e 2 **autorais**, com correção comentada passo a passo.
> **Por que a prova de 2023 de novo:** as 8 questões de argumentação da prova de 2023 (Q22, Q23, Q25 a Q30) não tiveram resolução comentada em 19/01 (só a Q21 e a Q24, de contagem). Elas são o **melhor treino** que existe: mesma banca, mesmo cargo. Refaça-as sem olhar a folha do simulado.
> **Prioridade do seu perfil:** **equivalência × negação do condicional**. A seção 2 e quatro das questões tratam disso.

## Roteiro

| Bloco | O que fazer |
|---|---|
| **30 min — revisão** | Revisão espaçada (seção 7) e o seu registro de erros de RL do Simulado 1 (Q21 a Q30). |
| **1 h 30 — tópicos e exemplos** | Seções 1 a 5, refazendo cada exemplo no papel antes de ler a solução. Depois o método (seção 6). |
| **1 h — questões com correção** | As 12 questões do [arquivo de questões](2027-02-03_Raciocinio_Logico_Questoes.md) (cerca de 5 min cada) e a correção comentada. |

---

## 1. Estruturas lógicas (item 1) — materiais de [09/11](2026-11-09_Raciocinio_Logico.md) e [22/12](2026-12-22_Raciocinio_Logico.md)

| Conectivo | Símbolo | Só é **falso** quando… |
|---|---|---|
| **E** (conjunção) | p ∧ q | **Uma** das duas é falsa |
| **OU** (disjunção inclusiva) | p ∨ q | As **duas** são falsas |
| **OU… OU** (exclusiva) | p ⊻ q | As duas têm o **mesmo** valor |
| **SE… ENTÃO** (condicional) | p → q | **V → F** (antecedente verdadeiro e consequente falso) |
| **SE E SOMENTE SE** (bicondicional) | p ↔ q | Os valores são **diferentes** |

**Quantificadores e negação:**

| Proposição | Negação |
|---|---|
| **Todo** A é B | **Algum** A **não** é B |
| **Nenhum** A é B | **Algum** A **é** B |
| **Algum** A é B | **Nenhum** A é B |
| **Algum** A não é B | **Todo** A é B |

> **Ex. 1** *(criado pelo tutor)* — A negação de "Todo soldado é pontual" é "**Algum** soldado **não** é pontual" (basta um). "Nenhum soldado é pontual" **não** é negação: é a **contrária**, e as duas podem ser falsas ao mesmo tempo.

## 2. Equivalências e negações (a sua prioridade)

| Proposição | **Equivalentes** (mesmo valor sempre) | **Negação** |
|---|---|---|
| **p → q** | **~q → ~p** (contrapositiva); **~p ∨ q** | **p ∧ ~q** |
| **p ∧ q** | — | **~p ∨ ~q** (De Morgan) |
| **p ∨ q** | **~p → q** | **~p ∧ ~q** (De Morgan) |
| **~(p ∧ ~q)** | **~p ∨ q** ≡ **p → q** | — |

**O que NÃO é equivalente a p → q:** a **recíproca** (q → p) e a **inversa** (~p → ~q).

> **Ex. 2** *(criado pelo tutor, resolvido)* — "Se o cabo dirige, então o sargento patrulha."
> 1. **Contrapositiva (equivalente):** "Se o sargento **não** patrulha, então o cabo **não** dirige."
> 2. **Com "ou" (equivalente):** "O cabo **não** dirige **ou** o sargento patrulha."
> 3. **Negação:** "O cabo dirige **e** o sargento **não** patrulha."
> 4. **Armadilhas:** "Se o sargento patrulha, o cabo dirige" (recíproca) e "Se o cabo não dirige, o sargento não patrulha" (inversa) **não** são equivalentes.

> **Ex. 3** *(criado pelo tutor, resolvido)* — "Não é verdade que o rádio está ligado e a viatura não está abastecida." Em símbolos, ~(R ∧ ~A).
> 1. De Morgan: **~R ∨ A** → "O rádio não está ligado **ou** a viatura está abastecida."
> 2. Como ~p ∨ q ≡ p → q: "**Se** o rádio está ligado, **então** a viatura está abastecida."

## 3. Argumentação (item 2) — materiais de [19/11](2026-11-19_Raciocinio_Logico_e_Redacao.md) e [29/12](2026-12-29_Raciocinio_Logico.md)

| Forma | Estrutura | Válida? |
|---|---|---|
| **Modus ponens** | p → q; p ⊢ q | **Sim** |
| **Modus tollens** | p → q; ~q ⊢ ~p | **Sim** |
| **Silogismo hipotético** (cadeia) | p → q; q → r ⊢ p → r | **Sim** |
| **Silogismo disjuntivo** | p ∨ q; ~p ⊢ q | **Sim** |
| **Afirmar o consequente** | p → q; q ⊢ p | **Não** (falácia) |
| **Negar o antecedente** | p → q; ~p ⊢ ~q | **Não** (falácia) |

**Método do "fato":** procure a premissa **simples** (sem conectivo: "Ora, X é Y") e propague o valor dela pelas condicionais, de trás para a frente (tollens) ou de frente para trás (ponens).

> **Ex. 4** *(criado pelo tutor, resolvido)* — "Se chove, a escala muda. Se a escala muda, o cabo folga. O cabo não folgou." Conclusão: a escala **não** mudou (tollens) e, então, **não** choveu (tollens de novo).

**Hipóteses que levam a algo falso:** se um conjunto de hipóteses (H1 e H2 e … Hn) implica um evento que **não** ocorreu, conclui-se que **pelo menos uma** hipótese é falsa (tollens com conjunção: ~(H1 ∧ … ∧ Hn) = ~H1 ∨ … ∨ ~Hn).

**Problemas de ordenação e de "quem mente":** monte uma **tabela** ou uma **reta numérica**; em verdades e mentiras, **teste cada hipótese** e descarte a que gera contradição.

## 4. Diagramas lógicos (item 3) — material de [07/12](2026-12-07_Raciocinio_Logico.md)

| Proposição | Diagrama |
|---|---|
| Todo A é B | **A dentro de B** (o conjunto B **contém** A) |
| Nenhum A é B | Conjuntos **separados** |
| Algum A é B | Conjuntos com **interseção** não vazia |
| Algum A não é B | Parte de A **fora** de B |

**Contagem com conjuntos:** n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Comece **pelo centro** (interseções) e vá para fora.

## 5. Contagem e probabilidade (item 4) — materiais de [15/12](2026-12-15_Raciocinio_Logico.md) e [19/01](2027-01-19_Raciocinio_Logico_e_Simulado_1.md)

| Situação | Ferramenta |
|---|---|
| Etapas independentes | **Multiplica** |
| A ordem importa | **Arranjo** |
| A ordem não importa | **Combinação** |
| Grupos separados | Combinações **multiplicadas** |
| "Pelo menos um" | **1 − P(nenhum)** |
| Múltiplos num intervalo | Quantidade = (último múltiplo − primeiro múltiplo) ÷ k + 1 |

> **Ex. 5** *(criado pelo tutor, resolvido)* — Quantos múltiplos de 4 há entre 20 e 60, inclusive? Primeiro: 20; último: 60. (60 − 20) ÷ 4 + 1 = **11**.

## 6. Método e pegadinhas

**Método em 4 passos:**
1. **Traduza** para símbolos (p, q, ~, ∧, ∨, →).
2. Ache o **fato** (proposição simples) ou o **tipo** de pergunta (equivalência, negação, conclusão, contagem).
3. Aplique a **regra** (tabelas das seções 1 a 5).
4. **Confira** cada alternativa contra a regra (sobretudo nas que pedem a INCORRETA).

| A banca escreve… | O certo é… |
|---|---|
| A negação de "todo" é "nenhum" | É "**algum… não**" |
| "Se p, então q" equivale a "se q, então p" | Isso é a **recíproca**; o equivalente é a **contrapositiva** |
| "Se p, então q" equivale a "se não p, então não q" | Isso é a **inversa** |
| A negação de "p e q" é "não p e não q" | É "**não p ou não q**" |
| A negação de "se p, então q" é "se não p, então não q" | É "**p e não q**" |
| Quando a conclusão de várias hipóteses falha, dá para saber quantas são falsas | Só se sabe que **pelo menos uma** é falsa |
| "Todo A é B" significa que A contém B | **B contém A** |

## 7. Revisão espaçada (faça primeiro, em 10 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2027-02-03_Raciocinio_Logico_Questoes.md).*

1. **LP 14 (01/02).** "Visar" no sentido de ter como objetivo pede que preposição?
2. **LP 17 (02/02).** Diferencie "iminente" e "eminente".
3. **INF 6 (28/01).** Qual comando do Prompt testa a conexão?
4. **DH 14 (25/01).** Qual é o limite das penas disciplinares de prisão ou detenção?
5. **RL 4 (19/01).** Quantas comissões de 2 pessoas se formam com 6 soldados?
