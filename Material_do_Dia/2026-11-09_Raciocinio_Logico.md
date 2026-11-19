# Material do dia — segunda-feira, 09/11/2026 — Raciocínio Lógico (2 h 30) + Redação (30 min)

> **Sessão do plano:** Raciocínio Lógico, sessão 1/10 — item **1 (estruturas lógicas: proposições, conectivos, quantificadores e falácias)** do Anexo II ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição:** 20 min revisão · 1 h 20 tópicos e exemplos · 50 min questões com correção · 30 min Redação (preparação para 13/11).
> **Base:** questões oficiais do [Banco de Provas](../Banco_de_Provas/indice_por_topico.md). A prova de Soldado PMPE 2023 não foi usada (reservada para o Simulado 1). Os exemplos do texto de estudo **não** repetem as questões da lista.
> **Questões do dia:** em arquivo separado, [2026-11-09_Raciocinio_Logico_Questoes.md](2026-11-09_Raciocinio_Logico_Questoes.md), com as questões oficiais e o gabarito comentado.

## 0. Revisão rápida (20 min) — Língua Portuguesa

Releia em [Perfil_do_Estudante.md](../Perfil_do_Estudante.md) as dificuldades registradas e refaça de cabeça: locução verbal (*ir* + infinitivo = só tempo; *dever, poder, precisar, costumar, voltar a, estar* + gerúndio = acrescentam sentido); parônimos (*mandado/mandato*, *tráfico/tráfego*); *porquanto* = causa.

## 1. Proposição

**Proposição** é uma frase **declarativa** que pode ser julgada **verdadeira (V) ou falsa (F)**, nunca as duas.

| É proposição | Não é proposição |
|---|---|
| "Recife é a capital de Pernambuco." (V) | Pergunta: "Que horas são?" |
| "3 + 4 = 9." (F — falsa, mas é proposição) | Ordem: "Feche a porta." |
| "Todo cabo é sargento." (F) | Exclamação/desejo: "Que dia lindo!", "Feliz aniversário!" |
| | Sentença aberta: "x + 2 = 5" (depende de x) · "Ele é policial" (quem?) |
| | Paradoxo: "Esta frase é falsa." |

## 2. Conectivos e tabela-verdade

| Conectivo | Símbolo | Leitura | Só é **falsa** quando... | Só é **verdadeira** quando... |
|---|---|---|---|---|
| Negação | ~p ou ¬p | não p | p é V | p é F |
| Conjunção | p ∧ q | p **e** q | pelo menos uma é F | **as duas são V** |
| Disjunção inclusiva | p ∨ q | p **ou** q | **as duas são F** | pelo menos uma é V |
| Disjunção exclusiva | p ⊻ q | **ou** p **ou** q (só uma) | as duas têm o mesmo valor | os valores são diferentes |
| Condicional | p → q | **se** p, **então** q | **V → F** (a "Vera Fischer") | todos os outros casos |
| Bicondicional | p ↔ q | p **se e somente se** q | os valores são diferentes | os valores são iguais |

**Número de linhas da tabela-verdade = 2ⁿ**, sendo *n* o número de proposições simples diferentes. Ex.: "Se chover, o treino é cancelado e a tropa fica no quartel" → 3 proposições → 2³ = **8 linhas**.

## 3. Equivalências (mesmo sentido lógico)

| Proposição | Equivalente | Exemplo |
|---|---|---|
| p → q | **~q → ~p** (contrapositiva: inverte e nega) | "Se chove, a rua molha" ≡ "Se a rua não molhou, não choveu" |
| p → q | **~p ∨ q** (nega a 1ª, troca por "ou", mantém a 2ª) | "Se chove, a rua molha" ≡ "Não chove ou a rua molha" |
| p ↔ q | (p → q) ∧ (q → p) | |

**Armadilha:** "Se não chove, a rua não molha" (**~p → ~q**, inversa) e "Se a rua molha, choveu" (**q → p**, recíproca) **não** são equivalentes a p → q.

## 4. Negações (cai muito na AOCP)

| Proposição | Negação | Exemplo |
|---|---|---|
| p ∧ q | **~p ∨ ~q** (De Morgan: nega as duas e troca "e" por "ou") | "Ana é sargento **e** Bia é cabo" → "Ana **não** é sargento **ou** Bia **não** é cabo" |
| p ∨ q | **~p ∧ ~q** (nega as duas e troca "ou" por "e") | "Vou de carro **ou** de moto" → "**Não** vou de carro **e não** vou de moto" |
| p → q | **p ∧ ~q** (mantém a 1ª, "e", nega a 2ª — "MANÉ") | "Se treino, passo" → "Treino **e não** passo" |
| p ↔ q | p ⊻ q | |

## 5. Quantificadores e suas negações

| Proposição | Negação | Exemplo |
|---|---|---|
| **Todo** A é B | **Algum** A **não** é B (existe A que não é B) | "Todo soldado é pontual" → "Algum soldado não é pontual" |
| **Nenhum** A é B | **Algum** A é B | "Nenhum aluno faltou" → "Algum aluno faltou" |
| **Algum** A é B | **Nenhum** A é B | "Algum preso fugiu" → "Nenhum preso fugiu" |
| **Algum** A **não** é B | **Todo** A é B | |

**Armadilha clássica:** a negação de "Todo A é B" **não** é "Nenhum A é B" (isso é o contrário, não a negação).

**Negar ≠ dizer o oposto:** se "Pedro é mais alto que Lucas" é falsa, a única certeza é "Pedro **não** é mais alto que Lucas" (ele pode ser mais baixo **ou** da mesma altura).

**Diagramas para "todo" e "nenhum":** "Todo A é B" → o círculo A fica **dentro** de B. "Nenhum A é B" → círculos **separados**. Desenhe antes de marcar: só conclua o que vale em **todos** os desenhos possíveis.

## 6. Falácias (argumentos que parecem válidos, mas não são)

| Falácia | Como reconhecer |
|---|---|
| **Afirmar o consequente** | "Se chove, a rua molha. A rua molhou. Logo, choveu." (inválido: pode ter sido um caminhão-pipa) |
| **Negar o antecedente** | "Se chove, a rua molha. Não choveu. Logo, a rua não molhou." (inválido) |
| *Ad hominem* | ataca a pessoa, não o argumento |
| Apelo à autoridade / à maioria | "é verdade porque o especialista disse" / "porque todos acham" |
| Generalização apressada | conclui uma regra a partir de poucos casos |
| Falso dilema | apresenta só duas opções quando há outras |

**Formas válidas:** *modus ponens* (p → q; p; logo q) e *modus tollens* (p → q; ~q; logo ~p).

## 9. Redação (30 min) — preparação para 13/11

A redação de 06/11 foi juntada à de sexta, 13/11 (proposta PMES 2022, "A importância da valorização da saúde mental no ambiente de trabalho" — [material](2026-11-06_Redacao_Producao.md)).

1. **15 min:** leia o [exemplo de correção](Exemplo_Correcao_de_Redacao.md) e anote os 3 erros que mais tiraram pontos.
2. **15 min:** releia os textos de apoio e escreva, sem redigir o texto ainda: a **tese** em uma frase; **2 argumentos**, cada um com um apoio (dado, conceito ou exemplo); a **proposta/conclusão** em uma frase. Guarde para sexta.
