# Material do dia — terça-feira, 22/12/2026 — Raciocínio Lógico (3 h)

> **Sessão do plano:** Raciocínio Lógico, **sessão 5/10**: **revisão do item 1** do Anexo II, estruturas lógicas, proposições, conectivos, quantificadores e falácias, com questões ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** 30 min de revisão · 1 h 30 de tópicos e exemplos · 1 h de questões com correção.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova. Exemplos resolvidos com passos numerados.
> **Base:** [Raciocínio Lógico](../Base_de_Conhecimento/RACIOCÍNIO%20LÓGICO/Raciocínio%20Lógico.txt) e o material de [09/11](2026-11-09_Raciocinio_Logico.md). Exemplos **criados pelo tutor**, diferentes dos de 09/11.
> **Por que esta revisão importa:** o seu perfil registra como **prioridade** a confusão entre **equivalência** e **negação do condicional** (erros de 09/11). A seção 4 foi montada para resolver isso.
> **Questões do dia:** em arquivo separado, [2026-12-22_Raciocinio_Logico_Questoes.md](2026-12-22_Raciocinio_Logico_Questoes.md), com o estudo dirigido, o mapa, 9 questões **oficiais** da AOCP e 2 **autorais**, com gabarito comentado.
> **Reserva do Simulado 1:** nenhuma questão da prova de Soldado PMPE 2023 foi usada. Duas questões oficiais do item 1 ficaram guardadas para as revisões integradas (03/02 e 19/02).

## Roteiro

| Bloco | O que fazer |
|---|---|
| **30 min — revisão** | Revisão espaçada (seção 9). |
| **1 h 30 — tópicos e exemplos** | Seções 1 a 6, nos três níveis. Resolva cada exemplo no caderno **antes** de ler a solução. Feche com os quadros (seção 7) e as pegadinhas (seção 8). |
| **1 h — questões com correção** | As 11 questões do [arquivo de questões](2026-12-22_Raciocinio_Logico_Questoes.md) e a correção pelo gabarito. |

## Cobertura do edital

Texto do Anexo II: *"1. Estruturas lógicas: proposições, conectivos lógicos, quantificadores e falácias."* (redação do plano)

| Item | Subtópico | Situação |
|---|---|---|
| 1 | Proposição, valor lógico, número de linhas | **revisado hoje** (seção 1) |
| 1 | Conectivos e valor de proposições compostas | **revisado hoje** (seção 2) |
| 1 | Tautologia, contradição e contingência | **explicado hoje** (seção 3) |
| 1 | Equivalências × negações | **revisado e aprofundado hoje** (seções 4 e 5) |
| 1 | Quantificadores e "é falso que…" | **revisado hoje** (seção 6) |
| 1 | Falácias | **revisado hoje** (seção 6.4) |
| 2 | Argumentação, validade, conclusões | **29/12** (RL 6) |

---

## 1. Proposição e valor lógico

### 🟢 Iniciante — entender

**Proposição** é uma frase **declarativa** que pode ser julgada **verdadeira (V)** ou **falsa (F)**, nunca as duas. Frase falsa **também** é proposição.

| É proposição | Não é proposição |
|---|---|
| "Olinda fica em Pernambuco." (V) | Pergunta: "Quem está de serviço?" |
| "10 é número ímpar." (F) | Ordem: "Apresente os documentos." |
| | Exclamação ou desejo: "Boa sorte na prova!" |
| | Sentença aberta: "y − 4 = 10" (depende de y); "Ela chegou cedo" (quem?) |
| | Paradoxo: "Eu estou mentindo agora." |

**Simples** = uma ideia só. **Composta** = duas ou mais simples ligadas por conectivos.

### 🟡 Intermediário — aplicar

**Linhas da tabela-verdade = 2ⁿ**, com *n* = número de proposições simples **diferentes**.

*Exemplo 1.* Quantas linhas tem a tabela de "Se o cabo dirige e o soldado comunica, a equipe chega ou o sargento espera"?
1. Simples diferentes: cabo dirige (p), soldado comunica (q), equipe chega (r), sargento espera (s).
2. n = 4 → 2⁴ = **16 linhas**.

*Exemplo 2.* E de "p ∧ ~p → q"? As simples diferentes são **p** e **q** (o ~p não conta como nova): 2² = **4 linhas**.

### 🔴 Avançado — acertar a prova

- A banca coloca **frase falsa** entre as alternativas "que não são proposição": ela **é** proposição.
- **Sentença aberta** (com "x", "ele", "ela" sem referência) **não** é proposição.
- Contar a mesma proposição duas vezes (p e ~p) é erro: o ~p não aumenta o número de linhas.

---

## 2. Conectivos e valor das compostas

### 🟢 Iniciante — entender

| Conectivo | Forma | Só é **F** quando… | Só é **V** quando… |
|---|---|---|---|
| Negação | ~p | p é V | p é F |
| Conjunção | p **e** q | alguma é F | **as duas** são V |
| Disjunção inclusiva | p **ou** q | **as duas** são F | alguma é V |
| Disjunção exclusiva | **ou** p **ou** q | as duas têm o **mesmo** valor | os valores são **diferentes** |
| Condicional | **se** p, **então** q | **V → F** | todos os outros casos |
| Bicondicional | p **se e somente se** q | os valores são **diferentes** | os valores são **iguais** |

### 🟡 Intermediário — aplicar

*Exemplo 3.* p = "o rádio funciona" (V); q = "a viatura tem combustível" (F). Valor de cada uma:
1. p ∧ q → V e F → **F**.
2. p ∨ q → tem uma V → **V**.
3. p → q → V → F → **F** (o único caso falso do "se").
4. q → p → F → V → **V**.
5. p ↔ q → valores diferentes → **F**.

### 🔴 Avançado — acertar a prova

**Antecedente falso deixa o condicional verdadeiro**, qualquer que seja o consequente. "Se o comandante autorizar, a tropa sai mais cedo": se o comandante **não** autorizou, a frase é **V** (não houve promessa quebrada). Só há quebra quando ele autoriza e a tropa **não** sai.

**Consequente verdadeiro também deixa o condicional verdadeiro** (V → V e F → V).

---

## 3. Tautologia, contradição e contingência

### 🟢 Iniciante — entender

| Nome | O que é | Na última coluna da tabela |
|---|---|---|
| **Tautologia** | Composta **sempre verdadeira**, em qualquer caso | **só V** |
| **Contradição** | Composta **sempre falsa** | **só F** |
| **Contingência** | Às vezes V, às vezes F | V e F |

### 🟡 Intermediário — aplicar

Modelos para reconhecer de olho:

| Estrutura | Classificação | Por quê |
|---|---|---|
| **p ∨ ~p** ("é ou não é") | **Tautologia** | Uma das duas sempre é V |
| **p ∧ ~p** ("é e não é") | **Contradição** | As duas nunca são V juntas |
| **p → p** | **Tautologia** | Nunca sai V → F |
| **p → (p ∨ q)** | **Tautologia** | Se p é V, o "ou" já é V |
| **(p ∧ q) → p** | **Tautologia** | Se o "e" é V, p é V |
| **p ∧ q**, **p → q** | Contingência | Dependem dos valores |

*Exemplo 4.* "Choveu e não choveu" → p ∧ ~p → **contradição**. "Se o portão está trancado, então o portão está trancado" → p → p → **tautologia**. "O cabo está de folga ou o sargento está de folga" → p ∨ q → **contingência** (as duas podem ser F).

### 🔴 Avançado — acertar a prova

- A banca mistura nas alternativas palavras do dia a dia que **não são termos técnicos** de lógica. Os três termos corretos para classificar uma composta são **tautologia, contradição e contingência**.
- **Equivalência** não classifica uma frase sozinha: é relação entre **duas** frases (mesma tabela-verdade).
- Em dúvida, faça a tabela: com uma só proposição simples são **2 linhas**; com duas, **4**.

---

## 4. Equivalência × negação — o ponto que mais tira pontos

### 🟢 Iniciante — entender

- **Equivalente** = diz **a mesma coisa** com outras palavras (mesma tabela-verdade). Pergunta típica: "é logicamente equivalente", "tem o mesmo sentido", "sem alterar o valor lógico".
- **Negação** = diz **o contrário** (tabela-verdade oposta em todas as linhas). Pergunta típica: "a negação", "é falso que", "não é verdade que".

**Primeiro passo de toda questão: sublinhe se ela pede EQUIVALENTE ou NEGAÇÃO.**

### 🟡 Intermediário — aplicar

**Do condicional (se p, então q):**

| Pedido | Regra | Forma |
|---|---|---|
| Equivalente 1 (contrapositiva) | **Inverte** as duas, **nega** as duas, **mantém o "se"** | **~q → ~p** |
| Equivalente 2 (vira "ou") | **Nega a 1ª**, troca por **"ou"**, **mantém a 2ª** | **~p ∨ q** |
| **Negação** | **Mantém a 1ª**, troca por **"e"**, **nega a 2ª** ("MANÉ") | **p ∧ ~q** |
| Inversa (~p → ~q) | **Não** é equivalente nem negação | — |
| Recíproca (q → p) | **Não** é equivalente nem negação | — |

*Exemplo 5.* "Se o alarme dispara, a patrulha é acionada."
1. Contrapositiva: "Se a patrulha **não** é acionada, o alarme **não** dispara."
2. Com "ou": "O alarme **não** dispara **ou** a patrulha é acionada."
3. Negação: "O alarme dispara **e** a patrulha **não** é acionada."

**O caminho de volta (do "ou" para o "se"):** ~p ∨ q ≡ p → q. Leia o "ou" assim: **nega a primeira parte, põe "se… então", mantém a segunda**.

*Exemplo 6.* "O motorista não está habilitado **ou** a multa é aplicada."
1. Primeira parte: "o motorista **não** está habilitado". Negando: "o motorista **está** habilitado".
2. Resultado: "**Se** o motorista está habilitado, **então** a multa é aplicada."
3. Confira pela contrapositiva: "Se a multa não é aplicada, o motorista não está habilitado." Também equivalente.

**Cuidado com a negação dentro da frase:** quando a primeira parte **já tem "não"**, negar **tira** o "não". Errar isso é a pegadinha principal da AOCP nesse tipo de questão.

### 🔴 Avançado — acertar a prova

**Teste rápido para não trocar:** a negação de um "se" **nunca começa com "se"**: ela é sempre uma frase com **"e"**. Se a alternativa começa com "se", ela só pode ser equivalente (ou errada).

| A alternativa… | Pode ser |
|---|---|
| Começa com "se" | Equivalente (contrapositiva) ou erro (inversa, recíproca) |
| Tem "ou" | Equivalente (~p ∨ q) |
| Tem "e" com a 2ª negada | **Negação** |

---

## 5. Negações das outras estruturas

### 🟢 Iniciante — entender

| Proposição | Negação | Regra |
|---|---|---|
| p **e** q | ~p **ou** ~q | De Morgan: nega as duas e troca "e" por "ou" |
| p **ou** q | ~p **e** ~q | De Morgan: nega as duas e troca "ou" por "e" |
| se p, então q | p **e** ~q | MANÉ |
| **ou** p **ou** q (exclusivo) | p **se e somente se** q | Os valores passam a ser iguais |
| p **se e somente se** q | **ou** p **ou** q | Os valores passam a ser diferentes |

### 🟡 Intermediário — aplicar

*Exemplo 7 (De Morgan).* "O cabo é motorista **e** atirador." Negação: "O cabo **não** é motorista **ou não** é atirador." (Basta uma das partes falhar.)

*Exemplo 8 (condicional com antecedente composto).* "Se o laudo chegar **e** a testemunha confirmar, o inquérito será concluído."
1. Estrutura: (p ∧ q) → r.
2. Negação = MANÉ: **mantém** o antecedente inteiro (p ∧ q), troca por "e", **nega** o consequente.
3. Resultado: "O laudo chegou **e** a testemunha confirmou, **e** o inquérito **não** foi concluído."
4. **Não** se nega o antecedente: ele fica como está.

*Exemplo 9 (disjunção exclusiva).* "**Ou** a reunião é na sede **ou** a reunião é no batalhão."
1. Ela é V quando **só uma** acontece.
2. A negação é V quando acontecem **as duas** ou **nenhuma** → valores **iguais** → bicondicional.
3. Negação: "A reunião é na sede **se e somente se** a reunião é no batalhão."
4. Atenção: se as partes trazem "aprovado/reprovado", "presente/ausente", a bicondicional pode aparecer com a **palavra oposta** numa das partes. Confira pelos valores, não pelas palavras.

### 🔴 Avançado — acertar a prova

- "Ou… ou…" com os dois "ou" é **exclusivo**. Um "ou" só é **inclusivo**.
- A negação de "e" **não** é "não… e não…" (isso nega o "ou").
- Na negação de um "se" composto, **o antecedente fica intacto**: a banca coloca alternativas que negam também o antecedente.

---

## 6. Quantificadores, "é falso que" e falácias

### 6.1 🟢 Iniciante — negações dos quantificadores

| Proposição | Negação |
|---|---|
| **Todo** A é B | **Algum** A **não** é B |
| **Algum** A é B | **Nenhum** A é B |
| **Nenhum** A é B | **Algum** A é B |
| **Algum** A **não** é B | **Todo** A é B |

### 6.2 🟡 Intermediário — "é falso que…" e "não é verdade que…"

Essas expressões **negam** o que vem depois. Faça em dois passos: identifique a frase de dentro e aplique a negação.

*Exemplo 10.* "É falso que **toda** viatura está abastecida."
1. Dentro: "toda viatura está abastecida".
2. Negação: "**Alguma** viatura **não** está abastecida." (Basta uma.)
3. **Não** é "nenhuma viatura está abastecida" (isso é o contrário extremo, não a negação).

*Exemplo 11.* "É falso que **algum** aluno chegou atrasado."
1. Dentro: "algum aluno chegou atrasado".
2. Negação: "**Nenhum** aluno chegou atrasado."
3. **Não** é "nenhum aluno chegou no horário": a banca troca o **predicado** pelo oposto. Mantenha o predicado ("chegou atrasado") e mude só o quantificador.

*Exemplo 12 (com "e").* "Não é verdade que o turno é longo **e** a equipe é pequena." → "O turno **não** é longo **ou** a equipe **não** é pequena." E, como "~p ∨ q ≡ p → q", também vale: "**Se** o turno é longo, **então** a equipe **não** é pequena."

### 6.3 🔴 Avançado — "todo" e os conjuntos

"Todo A é B" = o conjunto **A está dentro** de B (B **contém** A). Não garante que todo B seja A. A banca inverte: "o conjunto B está contido em A".

### 6.4 Falácias (argumentos que parecem válidos, mas não são)

| Falácia | Forma ou sinal | Exemplo do tutor |
|---|---|---|
| **Afirmar o consequente** | p → q; q; logo p | "Se houve furto, o alarme toca. O alarme tocou. Logo, houve furto." (pode ter sido falha) |
| **Negar o antecedente** | p → q; ~p; logo ~q | "Se houve furto, o alarme toca. Não houve furto. Logo, o alarme não tocou." |
| *Ad hominem* | Ataca a pessoa | "O argumento dele está errado porque ele foi reprovado no curso." |
| Apelo à autoridade | "Vale porque fulano disse" | "Está certo porque um famoso afirmou." |
| Apelo à maioria (*ad populum*) | "Vale porque todos acham" | "Todo mundo faz, então é correto." |
| Generalização apressada | Poucos casos → regra | "Dois motoristas de aplicativo foram multados; logo, todos são imprudentes." |
| Falso dilema | Só duas saídas, quando há outras | "Ou aumentamos as penas, ou o crime vai dominar." |
| Causa falsa (*post hoc*) | "Veio depois, então foi causado" | "Depois da nova farda, as ocorrências caíram; logo, a farda reduziu o crime." |

**Formas válidas** (não são falácias): *modus ponens* (p → q; p; logo q) e *modus tollens* (p → q; ~q; logo ~p).

---

## 7. Quadros para não confundir

### 7.1 O que fazer com o "se, então"

| Pedido | Resposta | Começa com |
|---|---|---|
| Equivalente | ~q → ~p | **"Se"** (invertido e negado) |
| Equivalente | ~p ∨ q | **"Não… ou…"** |
| Negação | p ∧ ~q | Frase com **"e"** |
| Inversa ~p → ~q | **nada** | "Se não…, não…" na mesma ordem |
| Recíproca q → p | **nada** | "Se" com as partes trocadas |

### 7.2 Classificação de compostas

| Sempre V | Sempre F | Depende |
|---|---|---|
| **Tautologia** (p ∨ ~p) | **Contradição** (p ∧ ~p) | **Contingência** |

---

## 8. Pegadinhas da banca

| A banca escreve… | O certo é… | Onde |
|---|---|---|
| Frase falsa não é proposição | **É** proposição (tem valor lógico) | Seção 1 |
| "Se p, então q" é falsa quando p é falsa | Antecedente falso → **verdadeira** | Seção 2 |
| "É ou não é" é contradição | É **tautologia** | Seção 3 |
| Contingência é a composta sempre falsa | Sempre falsa é a **contradição**; contingência **varia** | Seção 3 |
| Negação do "se" é "se não…, então não…" | **p e ~q** | Seção 4 |
| "Se não p, então não q" é equivalente a "se p, então q" | É a **inversa**: não equivale | Seção 4 |
| "Não A ou B" equivale a "se não A, então B" | Equivale a "**se A, então B**" | Seção 4 |
| Negação de "p e q" é "não p e não q" | **Não p ou não q** | Seção 5 |
| Negação de "se (p e q), r" nega também p e q | O antecedente **fica**; só se nega r | Seção 5 |
| Negação de "ou p ou q" é "não p e não q" | **p se e somente se q** | Seção 5 |
| Negação de "todo A é B" é "nenhum A é B" | **Algum A não é B** | Seção 6 |
| "É falso que algum A é B" = "nenhum A é não B" | **Nenhum A é B** (predicado mantido) | Seção 6 |
| "Todo A é B" → B está contido em A | **A** está contido em **B** | Seção 6 |
| Afirmar o consequente é argumento válido | É **falácia** | Seção 6.4 |

---

## 9. Revisão espaçada (faça primeiro, em 30 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2026-12-22_Raciocinio_Logico_Questoes.md).*

1. **RL 1 (prioridade do perfil).** Escreva a contrapositiva e a negação de "Se o cadete estuda, ele é aprovado".
2. **RL 3 (07/12).** Em um grupo, 12 fazem natação, 9 fazem tiro e 4 fazem os dois. Quantos fazem pelo menos uma das atividades?
3. **RL 4 (15/12).** De quantas maneiras 4 policiais podem formar uma fila?
4. **INF 5 e 6 (21/12).** Para que servem Windows + E, Windows + L e Shift + Delete?
5. **HPE 5 (17/12).** Qual foi o estopim da Guerra dos Mascates?
6. **DH 8 (14/12).** A tortura prescreve? Admite fiança?
7. **LP (perfil).** Em "O sargento **deve chegar** às 7 h", a locução verbal acrescenta sentido ou marca só o tempo?
