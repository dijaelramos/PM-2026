# Material do dia — terça-feira, 15/12/2026 — Raciocínio Lógico (3 h)

> **Sessão do plano:** Raciocínio Lógico, **sessão 4/10**, item **4** do Anexo II: princípios e técnicas de contagem, princípio multiplicativo, permutações, arranjos, combinações e probabilidade ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** 30 min de revisão · 1 h 30 de tópicos e exemplos · 1 h de questões com correção.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova. Exemplos resolvidos com passos numerados.
> **Base:** [Raciocínio Lógico](../Base_de_Conhecimento/RACIOCÍNIO%20LÓGICO/Raciocínio%20Lógico.txt). Exemplos **criados pelo tutor**, salvo indicação.
> **Questões do dia:** em arquivo separado, [2026-12-15_Raciocinio_Logico_Questoes.md](2026-12-15_Raciocinio_Logico_Questoes.md), com o estudo dirigido, o mapa, 8 questões **oficiais** da AOCP e 2 **autorais**, com gabarito comentado.
> **Reserva do Simulado 1:** nenhuma questão da prova de Soldado PMPE 2023 foi usada. Outras cinco questões oficiais de contagem ficaram guardadas para as revisões do item 4 (19/01, 03/02 e 19/02).

## Roteiro

| Bloco | O que fazer |
|---|---|
| **30 min — revisão** | Revisão espaçada (seção 8). |
| **1 h 30 — tópicos e exemplos** | Seções 1 a 5, nos três níveis. Resolva cada exemplo no caderno **antes** de ler a solução. Feche com os quadros (seção 6) e as pegadinhas (seção 7). |
| **1 h — questões com correção** | As 10 questões do [arquivo de questões](2026-12-15_Raciocinio_Logico_Questoes.md), com rascunho, e a correção pelo gabarito. |

## Cobertura do edital

Texto do Anexo II: *"4. Princípios e técnicas de contagem: princípio multiplicativo, permutações, arranjos e combinações; probabilidade."* (redação do plano)

| Item | Subtópico | Situação |
|---|---|---|
| 4 | Princípio multiplicativo e aditivo | **explicado hoje** (seção 1) |
| 4 | Fatorial, permutações e anagramas (com repetição) | **explicado hoje** (seção 2) |
| 4 | Arranjos e combinações | **explicado hoje** (seção 3) |
| 4 | Combinações com condições | **explicado hoje** (seção 4) |
| 4 | Probabilidade | **explicado hoje** (seção 5) |
| 4 | Revisão do item 4 | **19/01** (RL 8 condensada), **03/02** e **19/02** |

---

## 1. Princípio multiplicativo e princípio aditivo

### 🟢 Iniciante — entender

Contar é descobrir **de quantas maneiras** algo pode acontecer. Quando uma escolha é feita **em etapas** (escolho isto **e** depois aquilo), **multiplicamos**. Quando escolho **uma coisa ou outra**, de grupos diferentes, **somamos**.

> **Ex. 1** *(criado pelo tutor)* — Um soldado tem 2 coturnos e 3 gandolas. De quantas formas pode se vestir (um coturno **e** uma gandola)? 2 × 3 = **6**.

### 🟡 Intermediário — aplicar

| Princípio | Palavra-chave | Conta |
|---|---|---|
| **Multiplicativo** | etapas sucessivas: "**e**" | multiplica as possibilidades de cada etapa |
| **Aditivo** | uma opção **ou** outra, de grupos que não se misturam | soma as possibilidades |

> **Ex. 2** *(criado pelo tutor, resolvido)* — Uma placa interna do batalhão tem **2 letras** (A a Z, 26 letras) seguidas de **2 algarismos** (0 a 9), com repetição permitida. Quantas placas existem?
> 1. Etapas: letra, letra, algarismo, algarismo.
> 2. 26 × 26 × 10 × 10 = **67.600**.

> **Ex. 3** *(criado pelo tutor, resolvido)* — Para ir de Olinda ao Recife há 3 linhas de ônibus ou 2 rotas de metrô. Quantas formas de ir, usando **um** só meio?
> 1. É ônibus **ou** metrô: 3 + 2 = **5**.

### 🔴 Avançado — acertar a prova

- **Sem repetição**, as opções **diminuem** a cada etapa: senha de 3 algarismos **distintos** = 10 × 9 × 8 = 720.
- **Restrição primeiro:** comece pela posição que tem condição (por exemplo, "o primeiro algarismo não pode ser 0", "termina em número par").
- Cada objeto com **2 estados** (sim/não, com/sem): multiplique por 2 para cada um. Com **k** estados possíveis para cada um de **n** objetos: **kⁿ**.

> **Ex. 4** *(criado pelo tutor, resolvido)* — Quantos números de 3 algarismos **distintos** podem ser formados com 0, 1, 2, 3, 4?
> 1. Centena: não pode ser 0 → 4 opções.
> 2. Dezena: sobram 4 (o 0 volta a valer) → 4.
> 3. Unidade: sobram 3.
> 4. 4 × 4 × 3 = **48**.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Escolher 1 camisa entre 6 **ou** 1 boné entre 3 dá 18 formas." **Errado**: se é **um ou outro**, soma: 6 + 3 = **9**. Multiplica-se quando é camisa **e** boné.

**Para levar para a prova:** "**e**" (etapas) → **multiplica**; "**ou**" (grupos separados) → **soma**. Sem repetição, diminua um a cada etapa. Comece pela posição com **restrição**.

---

## 2. Fatorial e permutações (anagramas)

### 🟢 Iniciante — entender

**Permutar** é **trocar de lugar**: de quantas formas posso enfileirar n objetos diferentes? A resposta é **n!** (n fatorial) = n × (n − 1) × … × 1.

> **Ex. 1** *(criado pelo tutor)* — De quantas formas 3 soldados podem formar fila? 3! = 3 × 2 × 1 = **6**.

### 🟡 Intermediário — aplicar

| Valor | Resultado |
|---|---|
| 0! e 1! | 1 |
| 3! | 6 |
| 4! | 24 |
| 5! | 120 |
| 6! | 720 |
| 7! | 5.040 |

**Anagrama** = qualquer reordenação das letras de uma palavra (com ou sem sentido).
- Letras **todas diferentes**: **n!**.
- Com letras **repetidas**: **n! ÷ (a! · b! · …)**, em que a, b, … são as repetições de cada letra.
- Letras **fixas** numa posição: retire-as e permute **só as que sobram**.

> **Ex. 2** *(criado pelo tutor, resolvido)* — Quantos anagramas tem **FARDA**?
> 1. 5 letras; o **A** aparece **2** vezes.
> 2. 5! ÷ 2! = 120 ÷ 2 = **60**.

> **Ex. 3** *(criado pelo tutor, resolvido)* — Quantos anagramas de **CABO** começam por **vogal**?
> 1. Primeira letra: A ou O → 2 opções.
> 2. As outras 3 letras permutam: 3! = 6.
> 3. 2 × 6 = **12**.

### 🔴 Avançado — acertar a prova

- **Ao fixar letras, recalcule as repetições** só entre as letras que **sobraram**: se a letra repetida foi fixada, a repetição pode desaparecer.
- **Letras juntas** ("as vogais juntas"): trate o bloco como **uma letra só** e depois permute **dentro** do bloco.
- **Ordem alfabética** ("em que posição aparece a palavra X"): conte, letra por letra, quantos anagramas vêm **antes**.

> **Ex. 4** *(criado pelo tutor, resolvido)* — Quantos anagramas de **RECIFE** terminam em **E**?
> 1. Fixe um **E** no fim. Sobram R, E, C, I, F: 5 letras **distintas** (só restou um E).
> 2. 5! = **120**.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "FARDA tem 5! = 120 anagramas." **Errado**: há **dois A**; trocar um A pelo outro não cria anagrama novo. São **60**.

**Para levar para a prova:** fila de n distintos = **n!**. Letras repetidas: **divida** pelo fatorial de cada repetição. Letra fixa: tire-a e permute o resto (recalculando as repetições). Letras juntas: bloco = 1 elemento × permutação interna.

---

## 3. Arranjos e combinações

### 🟢 Iniciante — entender

Escolher **p** elementos de um grupo de **n**. A pergunta que decide tudo: **a ordem importa?**
- Escolher **comandante e subcomandante** (cargos diferentes): a ordem **importa** → **arranjo**.
- Escolher **3 soldados para uma patrulha** (todos iguais na função): a ordem **não importa** → **combinação**.

> **Ex. 1** *(criado pelo tutor)* — Pegar Ana e Bruno para presidente e vice é diferente de pegar Bruno e Ana. Pegar Ana e Bruno para uma comissão é o **mesmo** grupo.

### 🟡 Intermediário — aplicar

| | Arranjo | Combinação |
|---|---|---|
| A ordem importa? | **Sim** | **Não** |
| Fórmula | **A(n, p) = n! ÷ (n − p)!** | **C(n, p) = n! ÷ [p! · (n − p)!]** |
| Na prática | n × (n − 1) × … (**p** fatores) | arranjo ÷ **p!** |
| Exemplos | cargos, pódio, senhas sem repetição, fila | comissão, equipe, grupo, aperto de mão, escolher frutas |

**Relação:** **A(n, p) = C(n, p) × p!** (cada grupo pode ser ordenado de p! formas).

> **Ex. 2** *(criado pelo tutor, resolvido)* — Entre 8 soldados, escolher **comandante, motorista e rádio-operador** da viatura.
> 1. Funções diferentes → **ordem importa** → arranjo.
> 2. 8 × 7 × 6 = **336**.

> **Ex. 3** *(criado pelo tutor, resolvido)* — Entre 8 soldados, escolher **3** para uma patrulha a pé.
> 1. Funções iguais → combinação.
> 2. C(8, 3) = (8 × 7 × 6) ÷ (3 × 2 × 1) = 336 ÷ 6 = **56**.

### 🔴 Avançado — acertar a prova

- **Atalho:** C(n, p) = **C(n, n − p)**. Escolher 3 de 10 dá o mesmo que deixar 7 de fora: C(10, 3) = C(10, 7) = 120.
- **Valores úteis:** C(n, 1) = n; C(n, 2) = n(n − 1) ÷ 2; C(n, n) = 1.
- **Apertos de mão** entre n pessoas = **C(n, 2)**. **Diagonais** de um polígono de n lados = C(n, 2) − n.
- A razão **arranjo ÷ combinação** dos mesmos n e p é sempre **p!**: só pode dar 1, 2, 6, 24, 120…

> **Ex. 4** *(criado pelo tutor, resolvido)* — Numa reunião com 6 oficiais, cada um cumprimenta todos os outros uma vez. Quantos apertos de mão?
> 1. Cada aperto é um **par**, sem ordem: C(6, 2) = 6 × 5 ÷ 2 = **15**.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Escolher 2 sargentos entre 5 para uma escala de fim de semana (os dois trabalham juntos) dá 5 × 4 = 20." **Errado**: os dois têm a **mesma** função; é combinação: 20 ÷ 2 = **10**.

**Para levar para a prova:** **ordem importa → arranjo** (n × (n − 1) × …); **não importa → combinação** (arranjo ÷ p!). Cargos e funções diferentes = arranjo; grupo, equipe, comissão = combinação. A ÷ C = **p!**.

---

## 4. Combinações com condições

### 🟢 Iniciante — entender

Muitas questões pedem equipes com **regras**: "pelo menos 1 mulher", "mais homens que mulheres", "fulano não pode ir". A técnica: **divida em casos**, conte cada caso com **multiplicação** (escolho do grupo A **e** do grupo B) e **some** os casos.

> **Ex. 1** *(criado pelo tutor)* — Equipe de 2 pessoas com **1 cabo e 1 soldado**, havendo 3 cabos e 4 soldados: C(3, 1) × C(4, 1) = 3 × 4 = **12**.

### 🟡 Intermediário — aplicar

**Roteiro:**
1. Liste as **composições possíveis** (quantos de cada grupo) que obedecem à regra.
2. Para cada composição, **multiplique** as combinações de cada grupo.
3. **Some** as composições.

> **Ex. 2** *(criado pelo tutor, resolvido)* — Um pelotão tem **5 cabos e 4 soldados**. Formar uma equipe de **3** com **pelo menos 2 cabos**.
> 1. Composições: (2 cabos e 1 soldado) ou (3 cabos).
> 2. C(5, 2) × C(4, 1) = 10 × 4 = 40.
> 3. C(5, 3) = 10.
> 4. Total: 40 + 10 = **50**.

> **Ex. 3** *(criado pelo tutor, resolvido)* — Mesma tropa (5 cabos e 4 soldados), equipe de 3 com **pelo menos 1 soldado**. Use o **complementar**:
> 1. Todas as equipes: C(9, 3) = 84.
> 2. Equipes **sem** soldado (só cabos): C(5, 3) = 10.
> 3. 84 − 10 = **74**.

### 🔴 Avançado — acertar a prova

- "**Pelo menos um**" → quase sempre é mais rápido **total − nenhum**.
- "**Fulano obrigatoriamente**" → coloque-o na equipe e escolha só os que faltam entre os restantes. "**Fulano não pode**" → retire-o do grupo.
- "**Dois não podem ir juntos**" → total − equipes com os dois juntos.
- **Confira cada composição** com a regra: "mais cabos que soldados" exclui o empate; "cabos e soldados obrigatoriamente" exclui as equipes só de cabos ou só de soldados.

> **Ex. 4** *(criado pelo tutor, resolvido)* — Dos 7 policiais de uma seção, 4 vão a um curso. O **sargento Lima** precisa ir. Quantas turmas?
> 1. Lima já está; faltam 3 vagas entre os 6 restantes.
> 2. C(6, 3) = 20.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Com 5 cabos e 4 soldados, equipes de 3 com pelo menos 1 soldado = 4 × C(8, 2) = 112." **Errado**: esse cálculo conta a mesma equipe **várias vezes** (quando há 2 ou 3 soldados). O certo é **74** (Ex. 3).

**Para levar para a prova:** liste as **composições** permitidas, **multiplique** dentro de cada uma e **some**. "Pelo menos um" = **total − nenhum**. Obrigatório: já entra; proibido: sai do grupo.

---

## 5. Probabilidade

### 🟢 Iniciante — entender

**Probabilidade** = **casos favoráveis ÷ casos possíveis** (todos igualmente prováveis). Vai de **0** (impossível) a **1** (certo); em porcentagem, de 0% a 100%.

> **Ex. 1** *(criado pelo tutor)* — Numa urna há 3 bolas vermelhas e 7 azuis. Probabilidade de tirar vermelha: 3 ÷ 10 = **30%**.

### 🟡 Intermediário — aplicar

| Regra | Conta |
|---|---|
| Básica | P = favoráveis ÷ total |
| **Complementar** | P(não A) = **1 − P(A)** |
| "**e**" com eventos independentes | **multiplica** as probabilidades |
| "**ou**" com eventos que não acontecem juntos | **soma** as probabilidades |
| "ou" com eventos que podem acontecer juntos | P(A) + P(B) − P(A e B) |

> **Ex. 2** *(criado pelo tutor, resolvido)* — Um dado comum é lançado **duas vezes**. Probabilidade de sair **6 nas duas**?
> 1. Os lançamentos são independentes: "6 **e** 6".
> 2. 1/6 × 1/6 = **1/36** ≈ 2,8%.

> **Ex. 3** *(criado pelo tutor, resolvido)* — Numa escala de 10 policiais, 2 serão sorteados para o plantão de Natal. Probabilidade de o **soldado Silva** ser sorteado?
> 1. Total de duplas: C(10, 2) = 45.
> 2. Duplas com Silva: ele + 1 dos outros 9 = 9.
> 3. 9 ÷ 45 = **1/5** = 20%. (Atalho: 2 vagas em 10 pessoas = 2/10.)

### 🔴 Avançado — acertar a prova

- **"Pelo menos um"** → **1 − P(nenhum)**.
- **Sorteio de grupo:** P = (grupos favoráveis) ÷ (todos os grupos), contando os dois com **combinação**.
- **Sem reposição:** o total **diminui** a cada retirada. Com reposição, não.
- Transforme frações em porcentagem para comparar com as alternativas: 1/4 = 25%, 1/5 = 20%, 1/8 = 12,5%, 1/36 ≈ 2,8%.

> **Ex. 4** *(criado pelo tutor, resolvido)* — Uma moeda é lançada **3 vezes**. Probabilidade de sair **pelo menos uma cara**?
> 1. Nenhuma cara = coroa, coroa, coroa: (1/2)³ = 1/8.
> 2. 1 − 1/8 = **7/8** = 87,5%.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Lançando um dado duas vezes, a chance de sair 6 em pelo menos um lançamento é 1/6 + 1/6 = 1/3." **Errado**: os eventos podem ocorrer **juntos**. Pelo complementar: 1 − (5/6)² = 1 − 25/36 = **11/36**.

**Para levar para a prova:** P = **favoráveis ÷ total**. Complementar: **1 − P**. Independentes "e": **multiplica**; exclusivos "ou": **soma**. "Pelo menos um": **1 − nenhum**. Grupos sorteados: combinação em cima e embaixo.

---

## 6. Quadros para não confundir

### 6.1 Qual técnica?

| A questão diz… | Técnica |
|---|---|
| "de quantas formas…" com etapas | Princípio **multiplicativo** |
| "um **ou** outro", grupos separados | Princípio **aditivo** |
| "anagramas", "fila", "ordenar **todos**" | **Permutação** (dividir pelas repetições) |
| "presidente e vice", "1º, 2º e 3º lugar", "senha de dígitos distintos" | **Arranjo** |
| "comissão", "equipe", "grupo", "escolher p de n" | **Combinação** |
| "pelo menos um" | **Total − nenhum** |
| "probabilidade de…" | **Favoráveis ÷ total** |

### 6.2 Contas prontas

| Conta | Valor |
|---|---|
| C(5, 2) = C(5, 3) | 10 |
| C(6, 2) = C(6, 4) | 15 |
| C(6, 3) | 20 |
| C(7, 2) = C(7, 5) | 21 |
| C(8, 2) | 28 |
| C(8, 3) | 56 |
| C(10, 2) | 45 |
| C(9, 3) | 84 |

---

## 7. Pegadinhas da banca

| A banca escreve… | O certo é… | Onde |
|---|---|---|
| Opções de grupos separados multiplicadas | "Ou" entre grupos → **soma** | Seção 1 |
| Anagramas com letra repetida = n! | Divida por **a!** de cada repetição | Seção 2 |
| Repetição mantida depois de fixar a letra repetida | **Recalcule** com as letras que sobraram | Seção 2 |
| Comissão contada como arranjo | Sem ordem → **combinação** | Seção 3 |
| Cargos diferentes contados como combinação | Com ordem → **arranjo** | Seção 3 |
| A ÷ C dá qualquer número | Sempre **p!** (1, 2, 6, 24, 120…) | Seção 3 |
| "Pelo menos 1" = escolher 1 e completar livremente | Conta repetido; use **total − nenhum** | Seção 4 |
| Composição que a regra proíbe incluída na soma | Confira **cada** composição com a regra | Seção 4 |
| Probabilidades de "pelo menos um" somadas | **1 − P(nenhum)** | Seção 5 |
| Probabilidades de "e" somadas | Independentes: **multiplica** | Seção 5 |

---

## 8. Revisão espaçada (faça primeiro, em 30 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2026-12-15_Raciocinio_Logico_Questoes.md).*

1. **RL 3 (07/12).** Numa turma de 50 alunos, 30 estudam para a PM, 25 para a PC e 12 para as duas. Quantos não estudam para nenhuma?
2. **RL 1 — equivalência e negação (prioridade).** Proposição: "Se o alarme tocou, a guarnição saiu." Escreva a contrapositiva e a negação.
3. **RL 2 (19/11).** "Nenhum recruta é sargento. Algum atleta é recruta." Conclui-se que algum atleta não é sargento?
4. **DH 8 (14/12).** A tortura é imprescritível? Qual é a pena da omissão?
5. **LP (01/12).** Classifique a formação: "o ataque", "entardecer".
