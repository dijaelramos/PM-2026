# Material do dia — terça-feira, 29/12/2026 — Raciocínio Lógico (3 h)

> **Sessão do plano:** Raciocínio Lógico, **sessão 6/10**: **revisão do item 2** do Anexo II: analogias, inferências, deduções, equivalência, implicação, validade e conclusões, com questões de argumentação ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** 30 min de revisão · 1 h 30 de tópicos e exemplos · 1 h de questões com correção.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova. Exemplos resolvidos com passos numerados.
> **Base:** [Raciocínio Lógico](../Base_de_Conhecimento/RACIOCÍNIO%20LÓGICO/Raciocínio%20Lógico.txt) e o material de [19/11](2026-11-19_Raciocinio_Logico_e_Redacao.md). Exemplos **criados pelo tutor**, diferentes dos de 19/11.
> **Questões do dia:** em arquivo separado, [2026-12-29_Raciocinio_Logico_Questoes.md](2026-12-29_Raciocinio_Logico_Questoes.md), com o estudo dirigido, o mapa, 5 questões **oficiais** (2 da AOCP, 2 da CEV-UECE e 1 da FGV) e 5 **autorais**, com gabarito comentado.
> **Reserva do Simulado 1:** nenhuma questão da prova de Soldado PMPE 2023 foi usada. As questões oficiais de argumentação da AOCP que ainda não tinham sido usadas são poucas; por isso entram duas da PMCE 2025 e uma da PMSP 2022.
> ⚠️ **Questões fora:** PMES 2018, Q22, e Câmara de Maringá 2017, Q19, ficaram de fora: os gabaritos oficiais só fecham se o "ou" simples for lido como exclusivo (Q22) ou se "alguns" for lido como "nem todos" (Q19), leituras que contrariam a regra da lógica ensinada aqui. PC-ES 2019 Investigador, Q14, e DESENBAHIA 2017, Q13, ficaram fora porque as alternativas ou os dados são imagens.

## Roteiro

| Bloco | O que fazer |
|---|---|
| **30 min — revisão** | Revisão espaçada (seção 10). |
| **1 h 30 — tópicos e exemplos** | Seções 1 a 7, nos três níveis. Resolva cada exemplo no caderno **antes** de ler a solução. Feche com os quadros (seção 8) e as pegadinhas (seção 9). |
| **1 h — questões com correção** | As 10 questões do [arquivo de questões](2026-12-29_Raciocinio_Logico_Questoes.md), com rascunho, e a correção pelo gabarito. |

## Cobertura do edital

Texto do Anexo II: *"2. Lógica de argumentação: analogias, inferências, deduções e conclusões; equivalência e implicação lógica; argumentos válidos."* (redação do plano)

| Item | Subtópico | Situação |
|---|---|---|
| 2 | Argumento, validade e verdade | **revisado hoje** (seção 1) |
| 2 | Formas válidas e falácias; cadeias e ciclos | **revisado e aprofundado hoje** (seção 2) |
| 2 | Equivalência × implicação; conclusões a partir de uma negação | **revisado hoje** (seção 3) |
| 2 | Deduções em problemas | **revisado hoje** (seção 4) |
| 2 | Ordenação e "exatamente k afirmações verdadeiras" | **explicado hoje** (seção 5) |
| 2 | Conclusões com quantificadores | **revisado hoje** (seção 6) |
| 2 | Analogias | **revisado hoje** (seção 7) |
| 1 a 4 | Questões integradas | **03/02** e **19/02** |

---

## 1. Argumento, validade e verdade

### 🟢 Iniciante — entender

**Argumento** = **premissas** (o que se afirma) + **conclusão** (o que se tira delas). Ele é **válido** quando é **impossível** as premissas serem verdadeiras e a conclusão falsa. Validade é questão de **forma**: um argumento pode ser válido com premissas falsas, e inválido com conclusão verdadeira.

### 🟡 Intermediário — aplicar

**Método da conclusão falsa** *(criado pelo tutor)*: para testar a validade, suponha a **conclusão falsa** e tente deixar **todas as premissas verdadeiras**. Se conseguir, o argumento é **inválido** (achou um contraexemplo). Se der contradição, é **válido**.

*Exemplo 1.* "Se o cabo foi promovido, ele fez o curso. O cabo fez o curso. Logo, foi promovido."
1. Conclusão falsa: o cabo **não** foi promovido.
2. Premissa 1 (p → q) com p falso: **V**, qualquer que seja q.
3. Premissa 2: "fez o curso" = V.
4. Premissas V e conclusão F ao mesmo tempo → **inválido** (afirmação do consequente).

### 🔴 Avançado — acertar a prova

- "Válido" **não** quer dizer "verdadeiro". A banca dá uma conclusão **verdadeira no mundo real**, mas que **não decorre** das premissas: marque só o que **decorre**.
- Quando as premissas são dadas como verdadeiras, a resposta tem de valer **em todos os casos possíveis**, e não só em um.

---

## 2. Formas válidas, falácias, cadeias e ciclos

### 🟢 Iniciante — entender

| Forma | Molde | Válida? |
|---|---|---|
| *Modus ponens* | p → q; **p**; logo **q** | **Sim** |
| *Modus tollens* | p → q; **~q**; logo **~p** | **Sim** |
| Silogismo hipotético (cadeia) | p → q; q → r; logo **p → r** | **Sim** |
| Silogismo disjuntivo | p ∨ q; **~p**; logo **q** | **Sim** |
| Afirmar o consequente | p → q; q; logo p | **Não** |
| Negar o antecedente | p → q; ~p; logo ~q | **Não** |

### 🟡 Intermediário — aplicar

*Exemplo 2 (cadeia com tollens).* "Se a ponte cair, o trânsito para. Se o trânsito parar, a viatura atrasa. A viatura não atrasou."
1. Cadeia: ponte cai → trânsito para → viatura atrasa.
2. Fato: a viatura **não** atrasou.
3. Tollens na segunda: o trânsito **não** parou.
4. Tollens na primeira: a ponte **não** caiu.

**Ciclo de condicionais.** Quando as condicionais **fecham um círculo** (p → q, q → r, r → s, s → p), todas as proposições têm **o mesmo valor**: ou todas são V, ou todas são F. Basta uma ser V para todas serem V; basta uma ser F para todas serem F.

*Exemplo 3.* "Se o alarme A toca, o B toca. Se o B toca, o C toca. Se o C toca, o A toca."
1. Se A toca → B toca → C toca (e o círculo volta a A).
2. Se C **não** toca → por tollens, B não toca → A não toca.
3. Conclusão: tocam os **três** ou **nenhum**. "Tocar exatamente dois" é **impossível**.
4. Também vale qualquer condicional entre eles, em qualquer ordem: "se o C não toca, o A não toca"; "se o B toca, o A toca".

### 🔴 Avançado — acertar a prova

- Num ciclo, "se não X, então não Y" vale para **qualquer par** (todos andam juntos).

---

## 3. Equivalência × implicação; conclusões a partir de uma negação

### 🟢 Iniciante — entender

- **Equivalência (≡):** duas frases dizem a mesma coisa (ida **e** volta).
- **Implicação (⇒):** da primeira **decorre** a segunda (só **ida**): nunca a primeira é V e a segunda F.

| Implicações clássicas | Por quê |
|---|---|
| p ∧ q ⇒ p | Se as duas são V, cada uma é V |
| p ⇒ p ∨ q | Se p é V, o "ou" já é V |
| (p → q) ∧ p ⇒ q | *Modus ponens* |

### 🟡 Intermediário — aplicar

**Do "não é verdade que p e q":** ~(p ∧ q) tem **três** formas equivalentes. Todas podem ser conclusões corretas:

| Forma | Leitura |
|---|---|
| **~p ∨ ~q** | não p **ou** não q (De Morgan) |
| **p → ~q** | **se** p, **então** não q |
| **q → ~p** | **se** q, **então** não p |

E **não** são conclusões: ~p ∧ ~q (exige as duas falsas), ~p → ~q, nem o "ou exclusivo" (que proíbe as duas falsas, e ~(p ∧ q) permite).

*Exemplo 4.* Sabe-se que "não é verdade que o sargento estava de folga e o tenente estava de serviço".
1. Forma: ~(p ∧ q), com p = sargento de folga, q = tenente de serviço.
2. Conclusões corretas: "O sargento **não** estava de folga **ou** o tenente **não** estava de serviço"; "**Se** o sargento estava de folga, **então** o tenente **não** estava de serviço"; "**Se** o tenente estava de serviço, o sargento **não** estava de folga".
3. Não é conclusão: "O sargento **não** estava de folga **e** o tenente **não** estava de serviço" (pode ser que só uma parte seja falsa).

**Do "ou" exclusivo ("…, exclusivamente"):** "p ou q, exclusivamente" é V só quando **exatamente uma** é V. Quando aparece "exclusivamente" depois de um "se… então", leia como **bicondicional** ("se e somente se").

### 🔴 Avançado — acertar a prova

- Questão que pede "o **número** de conclusões verdadeiras": teste **cada** conclusão contra a premissa, uma a uma, montando a lista "vale / não vale".
- "Não é verdade que p e q" **não** obriga as duas a serem falsas.

---

## 4. Deduções em problemas

### 🟢 Iniciante — entender

Problema de dedução = várias afirmações verdadeiras sobre pessoas, lugares ou tarefas; você descobre o que é **certo**.

### 🟡 Intermediário — aplicar

**Método em quatro passos** *(criado pelo tutor)*:
1. Ache a afirmação que é um **fato** (sem "se", sem "ou").
2. Use o fato para destravar os condicionais (**ponens** ou **tollens**) e os "ou" (**disjuntivo**).
3. Anote cada conclusão nova e volte às afirmações que ainda não usou.
4. Marque a alternativa que vale **com certeza**.

*Exemplo 5.* Sabe-se que:
- I. O cabo dirigiu a viatura **ou** o soldado dirigiu a viatura.
- II. **Se** o cabo dirigiu, **então** o sargento ficou no rádio.
- III. **Se** o tenente ficou no rádio, **então** o sargento **não** ficou no rádio.
- IV. O soldado **não** dirigiu.
1. Fato: o soldado **não** dirigiu (IV).
2. I, pelo silogismo disjuntivo: se o soldado não dirigiu, o **cabo dirigiu**.
3. II, por ponens: o cabo dirigiu → o **sargento ficou no rádio**.
4. III, por tollens: "o sargento não ficou no rádio" é falso → o **tenente não ficou** no rádio.
5. Com certeza: o cabo dirigiu; o sargento ficou no rádio; o tenente não ficou no rádio.

### 🔴 Avançado — acertar a prova

- **Comece pelo fato.** Começar pelos condicionais leva a "chutar" casos.
- Alternativas com "pode ser" ou "talvez" raramente são a resposta "com certeza".

---

## 5. Ordenação e "exatamente k afirmações verdadeiras"

### 🟢 Iniciante — entender

**Ordenação:** desenhe as **posições** (1º, 2º, 3º…) e vá encaixando as pistas. **"Exatamente k verdadeiras":** descubra quais afirmações **não podem** ser verdadeiras juntas; isso diz qual é a falsa.

### 🟡 Intermediário — aplicar

*Exemplo 6 (ordenação).* Quatro viaturas (A, B, C, D) chegaram a um local, uma de cada vez. Pistas: B chegou antes de C; D chegou depois de A, mas antes de B; nenhuma viatura chegou depois de C.
1. "Nenhuma depois de C" → C é a **4ª**.
2. "D depois de A e antes de B" → A, D, B nessa ordem.
3. Fila: **A (1ª), D (2ª), B (3ª), C (4ª)**.
4. Pistas que dizem **quantos** estão acima ou abaixo de alguém fixam a posição exata dele: comece por elas.

*Exemplo 7 ("exatamente k").* Um número inteiro M, de 1 a 30, satisfaz exatamente 2 das 3 afirmações: (I) M é ímpar; (II) M é múltiplo de 4; (III) M é maior que 25.
1. (I) e (II) **não podem** ser verdadeiras juntas (múltiplo de 4 é par).
2. Então a verdadeira dupla inclui a (III), com (I) **ou** (II).
3. (I) e (III): ímpares de 26 a 30 → **27 ou 29**. (II) e (III): múltiplo de 4 de 26 a 30 → **28**.
4. Sem mais pistas, M pode ser 27, 28 ou 29. Com uma pista a mais (por exemplo, "M é par"), M = **28**.

### 🔴 Avançado — acertar a prova

- Em "exatamente k verdadeiras", **comece pelas afirmações incompatíveis**: se duas não podem ser verdadeiras juntas, uma delas é a falsa.
- Em ordenação, cuidado com "maior/menor" × "antes/depois" × "à frente": defina no papel o sentido da fila.

---

## 6. Conclusões com quantificadores

### 🟢 Iniciante — entender

Em lógica, "**algum** A é B" significa "**pelo menos um** A é B": **pode** ser que **todos** sejam. "Algum" **não** quer dizer "nem todos".

### 🟡 Intermediário — aplicar

| Premissas | Conclusão garantida |
|---|---|
| Todo A é B; todo B é C | **Todo A é C** |
| Todo A é B; nenhum B é C | **Nenhum A é C** |
| Todo A é B; algum C é A | **Algum C é B** |
| Algum A é B; algum A é C | **nada** sobre B e C (podem não se cruzar) |
| Todo A é B | **Algum B é A** (não "todo B é A") |

*Exemplo 8.* "Todo atirador de elite é policial. Alguns policiais são instrutores."
1. Desenhe: o círculo dos atiradores dentro do dos policiais; o dos instrutores cortando o dos policiais.
2. O dos instrutores pode **ou não** encostar no dos atiradores.
3. Logo, **não** se conclui "algum atirador é instrutor" nem "nenhum atirador é instrutor".

### 🔴 Avançado — acertar a prova

- Só marque a conclusão que vale em **todos** os desenhos possíveis.
- "Todo" + "algum" no termo **do meio** errado não liga nada.

---

## 7. Analogias

**Analogia:** ache a **relação** do primeiro par e aplique ao segundo, **na mesma ordem**. Ex.: "pena : escritor :: bisturi : ?" → instrumento de trabalho → **cirurgião**. Em sequências de **letras**, troque cada letra pela posição no alfabeto (A = 1, B = 2…) e procure a regra. Como **argumento**, a analogia dá conclusão só **provável**, não garantida.

---

## 8. Quadros para não confundir

### 8.1 O que se conclui de cada premissa

| Premissa | Conclui | Não conclui |
|---|---|---|
| p → q e p | q | — |
| p → q e ~q | ~p | — |
| p → q e q | **nada** sobre p | p |
| p → q e ~p | **nada** sobre q | ~q |
| p ∨ q e ~p | q | — |
| p ∨ q e p | **nada** sobre q | ~q |
| ~(p ∧ q) | ~p ∨ ~q; p → ~q; q → ~p | ~p ∧ ~q |
| Ciclo p → q → r → p | todos com o **mesmo** valor | "só alguns" |

### 8.2 Equivalência × implicação

| | Equivalência | Implicação |
|---|---|---|
| Sentido | Ida e volta | Só ida |
| Tabela | Colunas **iguais** | Nunca V na 1ª e F na 2ª |
| Exemplo | p → q ≡ ~q → ~p | p ∧ q ⇒ p |

---

## 9. Pegadinhas da banca

| A banca escreve… | O certo é… | Onde |
|---|---|---|
| Argumento válido tem conclusão verdadeira | Válido = **forma**; a conclusão pode ser falsa se as premissas forem | Seção 1 |
| p → q e q; logo p | **Falácia** (afirmar o consequente) | Seção 2 |
| p ∨ q e p; logo ~q | O "ou" inclusivo **não** exclui q | Seção 8.1 |
| Num ciclo de "se", as partes podem ter valores diferentes | Todas têm o **mesmo** valor | Seção 2 |
| "Não é verdade que p e q" → "não p e não q" | → **não p ou não q** (ou **se p, então não q**) | Seção 3 |
| Implicação vale nos dois sentidos | Só **ida** | Seção 3 |
| "Algum A é B" quer dizer "nem todo A é B" | Quer dizer **pelo menos um** | Seção 6 |
| "Todo A é B" → "todo B é A" | → **algum** B é A | Seção 6 |
| Dois "alguns" ligam os grupos | **Nada** se conclui | Seção 6 |

---

## 10. Revisão espaçada (faça primeiro, em 30 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2026-12-29_Raciocinio_Logico_Questoes.md).*

1. **RL 1 (22/12).** Classifique como tautologia, contradição ou contingência: "Choveu ou não choveu".
2. **RL 1 (22/12, prioridade do perfil).** Escreva uma frase **equivalente** a "Se o recruta falta, ele é advertido" que comece com "se", e a **negação** dela.
3. **INF 7 (28/12).** Em C3 está =A3*$B$1. Copiada para C9, como fica?
4. **INF 7 (28/12).** Qual função conta células que atendem a **dois** critérios ao mesmo tempo?
5. **INF 7 (23/12).** No Word em português, qual é o atalho de salvar? E no Writer?
6. **RL 4 (15/12).** Quantas comissões de 2 pessoas se formam com 6 cabos?
