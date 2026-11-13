# Material do dia — segunda-feira, 09/11/2026 — Raciocínio Lógico (2 h 30) + Redação (30 min)

> **Sessão do plano:** Raciocínio Lógico, sessão 1/10 — item **1 (estruturas lógicas: proposições, conectivos, quantificadores e falácias)** do Anexo II ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição:** 20 min revisão · 1 h 20 tópicos e exemplos · 50 min questões com correção · 30 min Redação (preparação para 13/11).
> **Base:** questões oficiais do [Banco de Provas](../Banco_de_Provas/indice_por_topico.md). A prova de Soldado PMPE 2023 não foi usada (reservada para o Simulado 1). Os exemplos do texto de estudo **não** repetem as questões da lista.

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

## 7. Questões oficiais (resolva antes de ver a seção 8)

> PMES 2022: **atualizado em 13/11/2026** — o banco agora tem o gabarito **pós-recursos** desta prova. A questão 9 abaixo (PMES 2022, Q28) foi **anulada** pela banca; a questão 3 (Q38) manteve a resposta.

### Questão 1 — Câmara de Maringá 2017, Assistente Legislativo (AOCP), Q18

Dentre as alternativas a seguir, são proposições lógicas, EXCETO

- **(A)** Boa sorte com a sua prova!
- **(B)** Uma criança sempre diz a verdade.
- **(C)** 5x2=10
- **(D)** À noite, todos os gatos são pardos.
- **(E)** O número 18 é ímpar.

### Questão 2 — PC-ES 2019, Investigador (AOCP), Q15

Considere a proposição: "O contingente de policiais aumenta ou o índice de criminalidade irá aumentar.". Nesse caso, a quantidade de linhas da tabela verdade é igual a

- **(A)** 2.
- **(B)** 4.
- **(C)** 8.
- **(D)** 16.
- **(E)** 32.

### Questão 3 — PMES 2022, Soldado (AOCP), Q38

Admitindo-se que as proposições P e Q são verdadeiras, a única alternativa em que os conectivos lógicos implicam uma composição falsa de P e Q é

- **(A)** P ∧ Q.
- **(B)** P ∨ Q.
- **(C)** P ⊻ Q.
- **(D)** P → Q.
- **(E)** P ↔ Q.

### Questão 4 — PC-ES 2019, Investigador (AOCP), Q17

Dada a proposição: "Se eu investigar, eu descubro o assassino.", é correto afirmar que ela pode ser reescrita, sem alterar o sentido lógico, igual a alternativa:

- **(A)** "Se eu não investigar, eu não descubro o assassino.".
- **(B)** "Se eu não descobri o assassino, eu não investiguei.".
- **(C)** "Descobri o assassino e não investiguei.".
- **(D)** "Investiguei e não descobri o assassino.".
- **(E)** "Se eu descobri o assassino, eu não investiguei.".

### Questão 5 — PC-ES 2019, Investigador (AOCP), Q20

Dada a afirmação: "Ezequiel é perito criminal e Osmar é investigador da polícia.", assinale a alternativa que apresenta sua negação.

- **(A)** "Ezequiel não é perito e Osmar não é investigador.".
- **(B)** "Ezequiel não é perito ou Osmar é investigador.".
- **(C)** "Ezequiel é perito ou Osmar não é investigador.".
- **(D)** "Ezequiel não é perito ou Osmar não é investigador.".
- **(E)** "Ezequiel é perito e Osmar é investigador.".

### Questão 6 — Câmara de Maringá 2017, Assistente Legislativo (AOCP), Q16

A negação da proposição "João foi à feira e comprou uma maçã" é

- **(A)** "João foi à feira e João não comprou uma maçã."
- **(B)** "João não foi à feira ou João não comprou uma maçã."
- **(C)** "João foi à feira ou João comprou uma maçã."
- **(D)** "João não foi à feira e João não comprou uma maçã."
- **(E)** "João foi à feira ou João não comprou uma maçã."

### Questão 7 — PMPE 2023, 2º Tenente (AOCP), Q20

Assinale a alternativa em que figura a negação da proposição "Todos os estados do Brasil têm seus próprios reis".

- **(A)** Nenhum estado do Brasil tem rei.
- **(B)** Existe estado do Brasil que não tem seu próprio rei.
- **(C)** Qualquer que seja o estado do Brasil, sempre haverá ao menos um rei.
- **(D)** Todos os reis do Brasil têm seus próprios estados.
- **(E)** Existe um rei nos estados do Brasil.

### Questão 8 — EBSERH 2017, Assistente Social (AOCP), Q14

Se a proposição "João é mais velho que Paulo" é falsa, então podemos afirmar com certeza que

- **(A)** "João é mais novo que Paulo".
- **(B)** "João tem a mesma idade que Paulo".
- **(C)** "Paulo é mais velho que João".
- **(D)** "Paulo é mais novo que João".
- **(E)** "João não é mais velho que Paulo".

### Questão 9 — PMES 2022, Soldado (AOCP), Q28

Considere que as proposições P e Q, a seguir, sejam verdadeiras: P: Todo policial trabalha no Espírito Santo. Q: Nenhum policial é judoca. Então, é correto afirmar que

- **(A)** nenhum judoca trabalha no Espírito Santo.
- **(B)** todo indivíduo que trabalha é judoca.
- **(C)** alguém no Espírito Santo não é judoca.
- **(D)** há policiais judocas fora do Espírito Santo.
- **(E)** se Ricardo é judoca, então não trabalha no Espírito Santo.

---

## 8. Gabarito e comentários

| Questão | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| **Gabarito** | A | B | C | B | D | B | B | E | **anulada** |
| Situação | oficial pós-recursos | oficial pós-recursos | oficial pós-recursos (atualizado em 13/11) | oficial pós-recursos | oficial pós-recursos | oficial pós-recursos | oficial definitivo | oficial pós-recursos | **anulada** no gabarito pós-recursos (o preliminar dava C) |

Comentários (**análise do tutor**):

1. **A.** "Boa sorte com a sua prova!" é exclamação/desejo: não pode ser julgada V ou F. As demais são declarativas (mesmo as falsas, como "18 é ímpar", são proposições).
2. **B.** Duas proposições simples (o contingente aumenta; a criminalidade aumenta) → 2² = 4 linhas.
3. **C.** Com P e Q verdadeiras: P ∧ Q = V; P ∨ Q = V; P ⊻ Q = **F** (a exclusiva exige valores diferentes); P → Q = V; P ↔ Q = V.
4. **B.** Contrapositiva: inverte e nega ("se não descobri, não investiguei"). (A) é a inversa, não equivalente. (D) é a negação.
5. **D.** De Morgan: negação de "p e q" é "não p **ou** não q". (A) mantém o "e" — erro mais comum.
6. **B.** Mesma regra da 5.
7. **B.** Negação de "Todo A é B" = "Algum (existe) A não é B". (A) "Nenhum" é o contrário, não a negação.
8. **E.** Se é falso que João é mais velho, ele pode ser mais novo **ou** da mesma idade. A única certeza é "não é mais velho". (A), (B), (C) e (D) escolhem um dos casos sem garantia.
9. **Anulada** pela banca no gabarito pós-recursos (o preliminar dava C). A banca não publica o motivo no gabarito; a explicação a seguir é **análise do tutor**. A (C) só seria certa se existisse pelo menos um policial: "Todo policial trabalha no ES" não garante que haja policiais, e sem nenhum policial não se pode concluir que "alguém no ES não é judoca". Por isso nenhuma alternativa decorre **necessariamente** das premissas. As outras continuam erradas: (A) e (E) falham porque um judoca que não é policial pode trabalhar no ES; (D) contradiz Q; (B) não decorre das premissas. **Na sua contagem de 09/11, conte esta questão como acerto** (num simulado, questão anulada conta como acerto, item 19.10 do edital).

## 9. Redação (30 min) — preparação para 13/11

A redação de 06/11 foi juntada à de sexta, 13/11 (proposta PMES 2022, "A importância da valorização da saúde mental no ambiente de trabalho" — [material](2026-11-06_Redacao_Producao.md)).

1. **15 min:** leia o [exemplo de correção](Exemplo_Correcao_de_Redacao.md) e anote os 3 erros que mais tiraram pontos.
2. **15 min:** releia os textos de apoio e escreva, sem redigir o texto ainda: a **tese** em uma frase; **2 argumentos**, cada um com um apoio (dado, conceito ou exemplo); a **proposta/conclusão** em uma frase. Guarde para sexta.
