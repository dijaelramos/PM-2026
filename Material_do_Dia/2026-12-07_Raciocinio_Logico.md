# Material do dia — segunda-feira, 07/12/2026 — Raciocínio Lógico (2 h 30) e Redação (30 min)

> **Sessão do plano:** Raciocínio Lógico, **sessão 3/10**, item **3** do Anexo II: diagramas lógicos; representação, leitura de conjuntos e resolução de questões ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** Raciocínio Lógico 2 h 30: 20 min de revisão · 1 h 20 de tópicos e exemplos · 50 min de questões com correção. Redação 30 min: enviar o texto ao Tutor de Redação, ler a correção e reescrever um parágrafo.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova. Exemplos resolvidos com passos numerados.
> **Base:** [Raciocínio Lógico](../Base_de_Conhecimento/RACIOCÍNIO%20LÓGICO/Raciocínio%20Lógico.txt). Exemplos **criados pelo tutor**, salvo indicação.
> **Questões do dia:** em arquivo separado, [2026-12-07_Raciocinio_Logico_Questoes.md](2026-12-07_Raciocinio_Logico_Questoes.md), com o estudo dirigido, o mapa, 8 questões **oficiais** (7 da AOCP e 1 da CEV-UECE) e 2 **autorais**, com gabarito comentado.
> **Reserva do Simulado 1:** nenhuma questão da prova de Soldado PMPE 2023 foi usada.
> **Amanhã (08/12) é feriado.** O resumão de hoje está em [2026-12-07_Resumao_Feriado.md](2026-12-07_Resumao_Feriado.md).

## Roteiro

| Bloco | O que fazer |
|---|---|
| **20 min — revisão** | Revisão espaçada (seção 9): itens 1 e 2 de Raciocínio Lógico e a semana passada. |
| **1 h 20 — tópicos e exemplos** | Seções 1 a 6, nos três níveis. **Desenhe** cada diagrama dos exemplos no caderno, sem copiar o desenho pronto. Feche com os quadros (seção 7) e as pegadinhas (seção 8). |
| **50 min — questões com correção** | As 10 questões do [arquivo de questões](2026-12-07_Raciocinio_Logico_Questoes.md), com rascunho, e a correção pelo gabarito no fim dele. |
| **30 min — Redação** | Seção 10: correção da redação de 04/12 (PMDF 2023, segurança no trânsito). |

## Cobertura do edital

Texto do Anexo II: *"3. Diagramas lógicos."* (O plano detalha: representação, leitura de conjuntos e resolução de questões.)

| Item | Subtópico | Situação |
|---|---|---|
| 3 | Conjuntos: noções, pertinência e inclusão | **explicado hoje** (seção 1) |
| 3 | Operações com conjuntos | **explicado hoje** (seção 2) |
| 3 | Diagramas de Venn com dois conjuntos | **explicado hoje** (seção 3) |
| 3 | Diagramas com três conjuntos e contagem | **explicado hoje** (seção 4) |
| 3 | Tabelas de dupla entrada | **explicado hoje** (seção 5) |
| 3 | Conjuntos numéricos | **explicado hoje** (seção 6) |
| 4 | Probabilidade | **15/12** (hoje só a ideia de "casos favoráveis sobre o total", para ler o diagrama; seção 4) |
| 2 | Diagramas com "todo", "nenhum", "algum" | **19/11** (revisão na seção 9) |
| 3 | Revisão do item 3 | **22/12** (sessão 5/10) |

---

## 1. Conjuntos: noções, pertinência e inclusão

### 🟢 Iniciante — entender

Conjunto é uma **coleção** de elementos: os soldados de um pelotão, os números pares, as viaturas de um batalhão. Escreve-se entre chaves: {1, 2, 3}.

> **Ex. 1** *(criado pelo tutor)* — P = {Ana, Bruno, Caio} é o conjunto dos policiais de plantão. "Ana pertence a P": **Ana ∈ P**. "Davi não pertence a P": **Davi ∉ P**.

### 🟡 Intermediário — aplicar

| Símbolo | Leitura | Relação entre… | Exemplo |
|---|---|---|---|
| ∈ | pertence | **elemento** e conjunto | 2 ∈ {1, 2, 3} |
| ∉ | não pertence | elemento e conjunto | 5 ∉ {1, 2, 3} |
| ⊂ | está contido | **conjunto** e conjunto | {1, 2} ⊂ {1, 2, 3} |
| ⊄ | não está contido | conjunto e conjunto | {4} ⊄ {1, 2, 3} |
| ∅ ou { } | conjunto vazio | — | não tem elementos |

**Tipos:** **vazio** (nenhum elemento), **unitário** (um elemento), **finito**, **infinito**.

**Número de subconjuntos** de um conjunto com *n* elementos: **2ⁿ** (inclui o vazio e o próprio conjunto).

> **Ex. 2** *(criado pelo tutor, resolvido)* — Quantos subconjuntos tem A = {a, b, c}?
> 1. n = 3.
> 2. 2³ = **8**: ∅, {a}, {b}, {c}, {a, b}, {a, c}, {b, c}, {a, b, c}.

> **Ex. 3** *(criado pelo tutor)* — Representar por propriedade: B = {x ∈ ℕ | x < 4} = {0, 1, 2, 3} (naturais menores que 4).

### 🔴 Avançado — acertar a prova

- **Um elemento pode ser ele mesmo um conjunto.** Em M = {1, {2}, 3}, os elementos são **1**, **{2}** e **3**. O número **2** **não** é elemento de M; o **conjunto {2}** é. Então 2 ∉ M, mas {2} ∈ M.
- **{2} ≠ 2** e **{2, 3} ≠ {2}, {3}**. A banca monta conjuntos com chaves dentro de chaves para confundir.
- **∅ é subconjunto de qualquer conjunto**, mas **não** é elemento, a menos que apareça escrito dentro das chaves: {∅} é unitário.

> **Ex. 4** *(criado pelo tutor, resolvido)* — X = {a, {b}, c} e Y = {c, b, {a}}. Qual é X ∩ Y?
> 1. Elementos de X: **a**, **{b}** e **c**.
> 2. Elementos de Y: **c**, **b** e **{a}**.
> 3. "a" é diferente de "{a}", e "{b}" é diferente de "b". Só **c** aparece igual nos dois.
> 4. X ∩ Y = **{c}** (unitário).

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "O conjunto {∅} é vazio." **Errado**: ele tem **um** elemento (o conjunto vazio); é **unitário**.

**Para levar para a prova:** ∈ liga **elemento** a conjunto; ⊂ liga **conjunto** a conjunto. Subconjuntos: **2ⁿ**. Cuidado com elementos que são conjuntos: **{2} ≠ 2**.

---

## 2. Operações com conjuntos

### 🟢 Iniciante — entender

- **União** (A ∪ B): junta tudo o que está em A **ou** em B.
- **Interseção** (A ∩ B): só o que está em A **e** em B ao mesmo tempo.
- **Diferença** (A − B): o que está em A, **mas não** em B.
- **Complementar** (Aᶜ): o que **não** está em A, dentro do universo considerado.

> **Ex. 1** *(criado pelo tutor)* — A = soldados com CNH; B = soldados com curso de tiro. A ∩ B = soldados com CNH **e** curso de tiro.

### 🟡 Intermediário — aplicar

| Operação | Símbolo | Exemplo com A = {1, 2, 3, 4} e B = {3, 4, 5, 6} |
|---|---|---|
| União | A ∪ B | {1, 2, 3, 4, 5, 6} |
| Interseção | A ∩ B | {3, 4} |
| Diferença | A − B | {1, 2} |
| Diferença | B − A | {5, 6} |

**Fórmula da união (dois conjuntos):**

**n(A ∪ B) = n(A) + n(B) − n(A ∩ B)**

Subtrai-se a interseção porque ela foi contada **duas vezes** (em A e em B).

> **Ex. 2** *(criado pelo tutor, resolvido)* — Numa companhia, 18 soldados têm CNH, 12 têm curso de tiro e 7 têm os dois. Quantos têm pelo menos um?
> 1. n(A ∪ B) = 18 + 12 − 7.
> 2. = **23**.

> **Ex. 3** *(criado pelo tutor, resolvido)* — Com A = {2, 4, 6, 8} e B = {6, 8, 10}: (a) n(A ∪ B)? (b) A − B?
> 1. A ∪ B = {2, 4, 6, 8, 10} → **5** elementos (conferindo pela fórmula: 4 + 3 − 2 = 5).
> 2. A − B = **{2, 4}**.

### 🔴 Avançado — acertar a prova

- **A − B ≠ B − A.** A ordem importa.
- **"Ou"** na linguagem dos conjuntos = **união** (pelo menos um); **"e"** = **interseção** (os dois).
- **Complementar** depende do **universo**: em "dos 40 soldados, 25 têm CNH", o complementar tem 15.
- Ao combinar operações, resolva **primeiro os parênteses**: C ∩ (A ∪ B) → faça A ∪ B antes.

> **Ex. 4** *(criado pelo tutor, resolvido)* — A = {1, 2}, B = {2, 3}, C = {3, 4}. Calcule (A ∪ B) ∩ C.
> 1. A ∪ B = {1, 2, 3}.
> 2. {1, 2, 3} ∩ {3, 4} = **{3}** (unitário).

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "n(A ∪ B) = n(A) + n(B) sempre." **Errado**: só quando A e B **não têm** elementos em comum (disjuntos).

**Para levar para a prova:** **∪** = ou (junta), **∩** = e (comum), **A − B** = só de A, **complementar** = fora (no universo). **n(A ∪ B) = n(A) + n(B) − n(A ∩ B)**. Parênteses primeiro.

---

## 3. Diagramas de Venn com dois conjuntos

### 🟢 Iniciante — entender

O diagrama de Venn mostra os conjuntos como **círculos**. Onde os círculos se cruzam está a interseção. O retângulo em volta é o **universo** (todos os elementos considerados).

> **Ex. 1** *(criado pelo tutor)* — Num desenho com dois círculos (CNH e tiro), há 4 regiões: **só CNH**, **os dois**, **só tiro** e **nenhum** (fora dos círculos, dentro do retângulo).

### 🟡 Intermediário — aplicar

**Método (de dentro para fora)** *(criado pelo tutor)*:
1. Desenhe os dois círculos dentro de um retângulo.
2. Ponha primeiro o número da **interseção** (os dois).
3. Calcule o "**só A**" = n(A) − interseção e o "**só B**" = n(B) − interseção.
4. **Nenhum** = total − (só A + os dois + só B).

> **Ex. 2** *(criado pelo tutor, resolvido)* — 50 candidatos: 30 passaram no teste físico, 25 no psicológico e 15 nos dois. Quantos não passaram em nenhum? Quantos passaram em só um?
> 1. Interseção = 15.
> 2. Só físico = 30 − 15 = 15. Só psicológico = 25 − 15 = 10.
> 3. Pelo menos um = 15 + 15 + 10 = 40.
> 4. Nenhum = 50 − 40 = **10**. Só um = 15 + 10 = **25**.

> **Ex. 3** *(criado pelo tutor, resolvido)* — Ao contrário: 40 PMs; 22 fazem ronda a pé, 26 fazem ronda motorizada, e **todos** fazem pelo menos uma. Quantos fazem as duas?
> 1. n(A ∪ B) = 40 (todos em pelo menos uma).
> 2. 40 = 22 + 26 − x.
> 3. x = 48 − 40 = **8**.

### 🔴 Avançado — acertar a prova

- **"Somente A"** ≠ **"A"**. "A" inclui a interseção; "somente A" não.
- **"Pelo menos um"** = união; **"nenhum"** = fora da união; **"exatamente um"** = só A + só B.
- **Cuidado com o pressuposto:** n(A) + n(B) − total só dá a interseção **se todos** estiverem em pelo menos um conjunto. Se pode haver elementos fora dos dois, o cálculo dá apenas o **mínimo** da interseção. Muitas questões assumem que todos estão em algum conjunto; leia o enunciado.
- Quando o total é **menor** que a soma dos conjuntos, há interseção.

> **Ex. 4** *(criado pelo tutor, resolvido)* — Dos 30 inscritos, 18 querem a manhã e 20 querem a tarde. Qual é o **mínimo** que quer os dois?
> 1. 18 + 20 = 38 > 30.
> 2. A sobra, 38 − 30 = **8**, é o mínimo da interseção (se todos quiserem pelo menos um turno, é exatamente 8).

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Se 20 soldados têm CNH e 7 têm CNH e curso de tiro, então 20 têm só CNH." **Errado**: só CNH = 20 − 7 = **13**.

**Para levar para a prova:** comece pela **interseção**, depois "só A" e "só B", por fim "**nenhum**". "Somente" exclui a interseção. Total menor que a soma → a diferença é a interseção (se todos estão em algum conjunto).

---

## 4. Três conjuntos e problemas de contagem

### 🟢 Iniciante — entender

Com três círculos, aparecem **8 regiões**: o centro (os três), as três regiões de "exatamente dois", as três de "só um" e a região de fora ("nenhum").

> **Ex. 1** *(criado pelo tutor)* — Três cursos (tiro, direção, primeiros socorros). O centro é quem faz os três; as pétalas são quem faz dois; as bordas, quem faz só um.

### 🟡 Intermediário — aplicar

**Método (do centro para fora)** *(criado pelo tutor)*:
1. Ponha o número dos **três** no centro.
2. Para cada par, "**exatamente esses dois**" = (par) − (os três).
3. Para cada conjunto, "**só ele**" = (conjunto) − (as duas pétalas dele) − (centro).
4. **Nenhum** = total − (soma de todas as regiões).

**Fórmula da união (três conjuntos):**
n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(A ∩ C) − n(B ∩ C) + n(A ∩ B ∩ C)

> **Ex. 2** *(criado pelo tutor, resolvido)* — 60 PMs fizeram cursos: tiro 30, direção 28, socorros 25; tiro e direção 12; tiro e socorros 10; direção e socorros 9; os três 4. Quantos fizeram só um curso?
> 1. Centro = 4.
> 2. Pétalas: tiro e direção só = 12 − 4 = 8; tiro e socorros só = 10 − 4 = 6; direção e socorros só = 9 − 4 = 5.
> 3. Só tiro = 30 − 8 − 6 − 4 = 12. Só direção = 28 − 8 − 5 − 4 = 11. Só socorros = 25 − 6 − 5 − 4 = 10.
> 4. Só um = 12 + 11 + 10 = **33**.
> 5. Conferência: união = 33 + (8 + 6 + 5) + 4 = 56; nenhum = 60 − 56 = 4.

**Contagem por "participações"** (útil quando todos estão em dois ou três grupos):
> **Ex. 3** *(criado pelo tutor, resolvido)* — 25 alunos do curso de formação se inscreveram em oficinas; cada aluno fez **1 ou 2** oficinas, e o total de inscrições foi 34. Quantos fizeram duas?
> 1. Sejam *u* os que fizeram uma e *d* os que fizeram duas: u + d = 25.
> 2. Cada um conta uma inscrição por oficina: u + 2d = 34.
> 3. Subtraindo a 1ª equação da 2ª: d = 34 − 25 = **9** (e u = 16).
>
> A mesma ideia vale quando as pessoas estão em 2 ou 3 grupos: some as **participações** (tamanho de cada grupo) e monte as duas equações.

**Probabilidade simples a partir do diagrama** *(antecipado do item 4, estudo em 15/12)*: probabilidade = **casos favoráveis ÷ total de casos**. Se 6 de 30 pessoas estão "fora" dos círculos, a chance de sortear uma delas é 6/30 = 1/5.

### 🔴 Avançado — acertar a prova

- O erro mais comum é **não descontar o centro** das pétalas. Os números dados para "A e B" incluem quem está nos **três**.
- **"Exatamente dois"** = soma das pétalas sem o centro.
- Quando o enunciado dá "aprovados" e "reprovados" em etapas, monte o diagrama com os **aprovados** (ou só com os reprovados) e use o total para fechar.
- Confira sempre: a soma de todas as regiões tem de dar o total.

> **Ex. 4** *(criado pelo tutor, resolvido)* — Num treino de tiro com dois disparos por atirador: 45 acertaram o 1º disparo, 25 acertaram os dois, 12 acertaram **só** o 2º e 30 **erraram** o 2º. Quantos atiradores havia? Quantos erraram os dois?
> 1. Acertaram o 2º = 25 + 12 = 37.
> 2. Todo atirador acertou **ou** errou o 2º: total = 37 + 30 = **67**.
> 3. Só o 1º = 45 − 25 = 20.
> 4. Erraram os dois = 67 − (20 + 25 + 12) = **10**.
> 5. Probabilidade de sortear alguém que errou os dois = 10/67.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Se 12 fazem tiro e direção e 4 fazem os três, então 12 fazem exatamente tiro e direção." **Errado**: exatamente os dois = 12 − 4 = **8**.

**Para levar para a prova:** três conjuntos: **centro → pétalas (par − centro) → bordas (conjunto − pétalas − centro) → fora**. Confira a soma. Participações: some os tamanhos dos grupos e monte o sistema. Probabilidade = favoráveis ÷ total.

---

## 5. Tabelas de dupla entrada

### 🟢 Iniciante — entender

Quando cada pessoa tem **duas características** que se dividem em "sim/não" (homem/mulher; com boné/sem boné), uma **tabela** organiza melhor que os círculos.

> **Ex. 1** *(criado pelo tutor)* — Linhas: homens e mulheres. Colunas: armados e desarmados. Cada casa da tabela é um grupo.

### 🟡 Intermediário — aplicar

**Método:** monte a tabela com os totais nas bordas e vá completando: o que falta numa linha ou coluna é o total menos o que já se sabe.

> **Ex. 2** *(criado pelo tutor, resolvido)* — Numa blitz, foram abordados 30 veículos: 18 carros e 12 motos. Ao todo, 9 veículos foram autuados; entre as motos, 5 foram autuadas. Quantos carros **não** foram autuados?
>
> | | Autuados | Não autuados | Total |
> |---|---|---|---|
> | Carros | 9 − 5 = 4 | 18 − 4 = **14** | 18 |
> | Motos | 5 | 12 − 5 = 7 | 12 |
> | Total | 9 | 21 | 30 |

> **Ex. 3** *(criado pelo tutor)* — A tabela é o mesmo que um diagrama de Venn com dois conjuntos (A = crianças, B = com crachá): as quatro casas são as quatro regiões.

### 🔴 Avançado — acertar a prova

- **Some por linha e por coluna** para conferir: os dois totais gerais têm de bater.
- Leia com cuidado o recorte: "entre os homens, 3 não usavam" é uma **casa** da tabela, não o total da coluna.

> **Ex. 4** *(criado pelo tutor)* — "Entre as mulheres, 2 usavam boné" informa a casa (mulher, com boné). "6 usavam boné" informa o **total** da coluna.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — Somar todos os números do enunciado ("5 + 6 + 3 + 2 = 16") para achar o total. **Errado**: os números se sobrepõem; é preciso montar a tabela.

**Para levar para a prova:** duas características "sim/não" → **tabela 2 × 2** com totais. Preencha pelo que falta em cada linha e coluna; confira os dois totais.

---

## 6. Conjuntos numéricos

### 🟢 Iniciante — entender

Os números se organizam em conjuntos, um dentro do outro, como bonecas russas: **naturais** dentro dos **inteiros**, dentro dos **racionais**, dentro dos **reais**.

> **Ex. 1** *(criado pelo tutor)* — 3 é natural, inteiro, racional e real. −3 é inteiro, racional e real (não natural). 0,5 é racional e real. √2 é irracional e real.

### 🟡 Intermediário — aplicar

| Conjunto | Símbolo | Elementos | Exemplos |
|---|---|---|---|
| Naturais | ℕ | 0, 1, 2, 3, … | 0, 7, 100 |
| Inteiros | ℤ | …, −2, −1, 0, 1, 2, … | −5, 0, 12 |
| Racionais | ℚ | frações a/b, com a e b inteiros e b ≠ 0 (inclui decimais finitos e dízimas periódicas) | 1/2, −3/4, 0,333…, 5 |
| Irracionais | 𝕀 | decimais infinitos **não periódicos** | √2 ≈ 1,414; π ≈ 3,14 |
| Reais | ℝ | racionais + irracionais | todos os anteriores |

**ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ** e **𝕀 ⊂ ℝ**, com ℚ ∩ 𝕀 = ∅.

**ℚ − ℤ** (racionais que **não** são inteiros) = frações cujo quociente **não é inteiro**: 1/2, −7/3, 0,25 (= 1/4), 0,666… (= 2/3).

> **Ex. 2** *(criado pelo tutor, resolvido)* — Quais naturais estão entre 10 − √2 e 10 + √2?
> 1. √2 ≈ 1,41.
> 2. Intervalo: de 8,59 a 11,41.
> 3. Naturais: **9, 10 e 11**.

> **Ex. 3** *(criado pelo tutor)* — 0,75 está em ℚ − ℤ? Sim: 0,75 = 3/4, quociente não inteiro. E 8/4? Não: 8/4 = 2, que é inteiro.

### 🔴 Avançado — acertar a prova

- **ℚ − ℤ** contém decimais **finitos** e **dízimas periódicas**, positivos **e** negativos. "Só dízimas" ou "só positivos" está errado.
- **Irracional ≠ "qualquer não inteiro"**: 0,5 não é inteiro, mas é **racional**.
- Ao contar elementos de um conjunto definido por desigualdades, **estime as raízes** (√2 ≈ 1,41; √3 ≈ 1,73) e liste os números um a um.

> **Ex. 4** *(criado pelo tutor, resolvido)* — Seja B = {x ∈ ℕ | 1 < x < 20}. Quantos elementos de B têm o quadrado também em B?
> 1. B = {2, 3, 4, …, 19}.
> 2. Teste um a um: 2² = 4 (está), 3² = 9 (está), 4² = 16 (está), 5² = 25 (não está).
> 3. Resposta: **3** elementos (2, 3 e 4).

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Todo número não inteiro é irracional." **Errado**: 1/2 não é inteiro e é **racional**.

**Para levar para a prova:** **ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ**; irracionais = decimais infinitos não periódicos. **ℚ − ℤ** = frações com quociente **não inteiro** (positivas ou negativas, finitas ou periódicas). Use √2 ≈ 1,41.

---

## 7. Quadros para não confundir

### 7.1 Linguagem dos enunciados

| O enunciado diz… | Região no diagrama |
|---|---|
| "A ou B", "pelo menos um" | União |
| "A e B", "os dois" | Interseção |
| "somente A", "apenas A" | A sem a interseção |
| "exatamente um" | só A + só B |
| "nenhum", "nem A nem B" | fora dos círculos |
| "não A" | complementar de A |

### 7.2 Fórmulas

| Situação | Fórmula |
|---|---|
| União de dois | n(A) + n(B) − n(A ∩ B) |
| União de três | soma dos três − soma das interseções duplas + interseção tripla |
| Subconjuntos | 2ⁿ |
| Nenhum | total − união |

### 7.3 Símbolos

| Símbolo | Uso |
|---|---|
| ∈ / ∉ | elemento × conjunto |
| ⊂ / ⊄ | conjunto × conjunto |
| ∪ / ∩ / − | união / interseção / diferença |
| ∅ | vazio |

---

## 8. Pegadinhas da banca

| A banca escreve… | O certo é… | Onde |
|---|---|---|
| {2} é a mesma coisa que 2 | **{2}** é um conjunto; **2** é um número | Seção 1 |
| {∅} é vazio | É **unitário** | Seção 1 |
| n(A ∪ B) = n(A) + n(B) | Subtraia a **interseção** | Seção 2 |
| A − B = B − A | A ordem **importa** | Seção 2 |
| "Somente A" = n(A) | Somente A = n(A) − interseção | Seção 3 |
| Interseção calculada sem saber se todos estão em algum conjunto | O cálculo só é exato se **todos** estão em pelo menos um | Seção 3 |
| Pétala de três conjuntos sem descontar o centro | "Exatamente dois" = par − **centro** | Seção 4 |
| Somar todos os números do enunciado | Monte o **diagrama** ou a **tabela** | Seção 5 |
| ℚ − ℤ = só dízimas ou só positivos | Todas as frações com quociente **não inteiro** | Seção 6 |
| Todo não inteiro é irracional | 1/2 é **racional** | Seção 6 |

---

## 9. Revisão espaçada (faça primeiro, em 20 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2026-12-07_Raciocinio_Logico_Questoes.md).*

1. **RL 2 (19/11) — diagramas e quantificadores.** "Todo cabo é praça. Algum praça é motorista." Conclui-se que algum cabo é motorista? Desenhe.
2. **RL 1 — equivalência e negação (prioridade).** Proposição: "Se o suspeito usava boné, então foi identificado." Escreva a equivalente com "se", a equivalente com "ou" e a negação.
3. **RL 1 — contagem de linhas.** Quantas linhas tem a tabela-verdade de "Ou chove, ou faz sol, e o treino é mantido"?
4. **DC (04/12).** Diga se é privativa ou concorrente: (a) direito penal; (b) caça e pesca; (c) trânsito.
5. **LP (01/12).** Crase ou não: "Às 8h, a tropa foi ___ praça e começou ___ marchar."

---

## 10. Redação (30 min) — correção e reescrita

1. **5 min:** digite o texto de **04/12** (PMDF 2023, segurança no trânsito) exatamente como está na folha.
2. **Peça a correção:** "Corrija minha redação pela Tabela 12.2 da PMPE. Proposta: PMDF 2023, segurança no trânsito. Meu texto tem __ linhas na folha."
3. **15 min:** leia a correção e anote os 3 problemas que mais tiraram pontos.
4. **10 min:** reescreva o parágrafo com mais apontamentos.

Se ainda há redações anteriores sem correção (13/11, 19/11 e 27/11), mande também.
