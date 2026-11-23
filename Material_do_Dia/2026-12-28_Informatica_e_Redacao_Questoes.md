# Questões do dia — segunda-feira, 28/12/2026 — Informática e Redação

> **Material de estudo:** [2026-12-28_Informatica_e_Redacao.md](2026-12-28_Informatica_e_Redacao.md). Estude o material antes: este arquivo traz só o que é para responder.
> **Como responder:** resolva as **questões** com rascunho, sem consultar, e anote suas letras; depois corrija pelo gabarito e faça o **estudo dirigido** por escrito. Mande as respostas ao Orquestrador para a correção. O **gabarito comentado** está no fim deste arquivo: só confira depois de responder.
> **Reserva do Simulado 1:** nenhuma questão da prova de Soldado PMPE 2023 foi usada. As questões 1 a 6 são **oficiais** (1 a 4 da AOCP, 5 e 6 da FGV); as 7 a 10 são **autorais de treino, não oficiais**.

## 12. Estudo dirigido (responda por escrito, sem consultar)

1. O que é célula, intervalo e pasta de trabalho? Quais são as extensões padrão do Excel e do Calc?
2. Qual é a ordem das operações numa fórmula?
3. Diferencie referência relativa, absoluta e mista. Qual tecla alterna entre elas no Excel e no Calc 7?
4. Como se cita a célula B4 da planilha "Plan2" no Excel? E no Calc?
5. Diferencie CONT.NÚM, CONT.VALORES, CONT.SE e CONT.SES.
6. Como funciona o PROCV? O que significa o 0 no último argumento?
7. O que faz DEF.NÚM.DEC? E TRUNCAR?
8. Explique o que causa #DIV/0!, #NOME?, #REF!, #N/D e ####.
9. Qual gráfico usar para comparar, para mostrar evolução e para mostrar partes de um total? O que é uma série de dados?
10. O que se perde ao salvar uma pasta de trabalho em CSV?

---

## Mapa das questões

| Questão | Conteúdo exigido | Onde foi ensinado (material de estudo) |
|---|---|---|
| 1 — ITEP-RN 2018, Q30 | Referência absoluta | Seção 3 |
| 2 — DESENBAHIA 2017, Q19 | PROCV | Seção 4 |
| 3 — SEJUS-CE 2017, Q16 | Função que formata casas decimais (Calc) | Seção 4 |
| 4 — PP-SP 2026, Q38 | Contagem com vários critérios | Seções 4 e 8.1 |
| 5 — PMSP 2022 (FGV), Q51 | SE aninhado e ordem das operações | Seções 2 e 4 |
| 6 — PMSP 2022 (FGV), Q52 | Séries de dados no gráfico | Seção 6 |
| 7 — autoral | Copiar fórmula com referência absoluta | Seção 3 |
| 8 — autoral | Ordem das operações | Seção 2 |
| 9 — autoral | Referência a outra planilha no Calc | Seção 3 |
| 10 — autoral | Salvar em CSV | Seção 7 |

---

## 13. Questões (resolva antes de ver a seção 14)

Questões 1 a 4: Instituto AOCP. Questões 5 e 6: **FGV** (outra banca), prova de Soldado da PMSP 2022. Transcrição sem alteração, a partir do [Banco de Provas](../Banco_de_Provas/README.md). As provas citam **Excel 2010** e **365** e **Calc 5**; as respostas continuam valendo no Excel 2019 e no LibreOffice 7 (veja os comentários). As questões 3 e 4 têm **4 alternativas**, como no caderno. Na questão 6, a tabela do caderno saiu **em linha** na conversão do Banco de Provas; aqui ela foi reorganizada em tabela, com os mesmos dados, e o resto do enunciado está sem alteração. Grafia do caderno mantida: "Libre Office" (questão 3).

### Questão 1 — ITEP-RN 2018, Agente de Necropsia (AOCP), Q30

*Nível médio · gabarito oficial pós-recursos · [prova](../Banco_de_Provas/AOCP/Outras_Areas/ITEP-RN_2018_Agente_de_Necropsia/prova.md), p. 10*

Referência absoluta é um importante recurso do Microsoft Excel. Considerando a versão 2010 e sua instalação padrão em Português do Brasil, qual das seguintes fórmulas apresenta uma utilização correta de referência absoluta no Microsoft Excel?

- **(A)** =($A1$+A2)/A3
- **(B)** =ABSOLUTA(A2)
- **(C)** =$(A1+A2)/A3$
- **(D)** =ABS(A2)
- **(E)** =($A$1+A2)/$A$3

### Questão 2 — DESENBAHIA 2017, Técnico Escriturário (AOCP), Q19

*Nível médio · gabarito oficial definitivo · [prova](../Banco_de_Provas/AOCP/Outras_Areas/DESENBAHIA_2017_Tecnico_Escriturario/prova.md), p. 10*

A função PROCV do Microsoft Excel 2010 (instalação padrão em Português do Brasil) pode ser utilizada para procurar um determinado valor na

- **(A)** primeira coluna à esquerda do intervalo de pesquisa de uma tabela e retornar o valor, na mesma linha, da coluna onde queremos o resultado.
- **(B)** primeira linha à esquerda do intervalo de pesquisa de uma tabela e retornar o valor, na mesma linha, da coluna onde queremos o resultado.
- **(C)** última coluna à esquerda do intervalo de pesquisa de uma tabela e retornar o valor, na mesma linha, da coluna onde queremos o resultado.
- **(D)** última linha à esquerda do intervalo de pesquisa de uma tabela e retornar o valor, na mesma linha, da coluna onde queremos o resultado.
- **(E)** última linha à direita do intervalo de pesquisa de uma tabela e retornar o valor, na mesma linha, da coluna onde queremos o resultado.

### Questão 3 — SEJUS-CE 2017, Agente Penitenciário (AOCP), Q16

*Nível médio · **4 alternativas** (a PMPE 2026 tem 5) · gabarito oficial pós-recursos · [prova](../Banco_de_Provas/AOCP/Outras_Areas/SEJUS-CE_2017_Agente_Penitenciario/prova.md), p. 6*

Utilizando o editor de planilhas eletrônicas Libre Office Calc (versão 5, instalação padrão em português e Sistema Operacional Windows 7), assinale a alternativa que apresenta a fórmula que realiza a seguinte operação: “Formata um número com um número fixo de casas decimais depois da vírgula e do separador de milhar”

- **(A)** FORMAT.DEC
- **(B)** VALOR.DEC
- **(C)** TRUNCAR
- **(D)** DEF.NÚM.DEC

### Questão 4 — PP-SP 2026, Policial Penal (AOCP), Q38

*Nível médio · 4 alternativas · gabarito oficial definitivo · [prova](../Banco_de_Provas/AOCP/Outras_Areas/PP-SP_2026_Policial_Penal/prova.md), p. 11*

Na rotina de um policial penal da Secretaria da Administração Penitenciária do Estado de São Paulo, uma das atribuições envolve identificar, registrar, fiscalizar e controlar a entrada de pessoas na unidade prisional. Os registros são lançados em uma Tabela do Excel, conforme o seguinte exemplo:

| | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| 1 | **DATA** | **CPF** | **NOME** | **OPERAÇÃO** | **SITUAÇÃO** | **OBSERVAÇÃO** |
| 2 | 10/01/2026 | 108.\*\*\*.\*\*\*-45 | Felipe Soares | Entrada | Liberada | |
| 3 | 10/01/2026 | 108.\*\*\*.\*\*\*-45 | Felipe Soares | Saída | | |
| 4 | 10/01/2026 | 065.\*\*\*.\*\*\*-82 | Roberto Fernandez | Entrada | Liberada | |
| 5 | 10/01/2026 | 065.\*\*\*.\*\*\*-82 | Roberto Fernandez | Saída | | |
| 6 | 10/01/2026 | 026.\*\*\*.\*\*\*-35 | Carla Faria | Entrada | Negada | Falta de documento |
| 7 | 12/02/2026 | 085.\*\*\*.\*\*\*-17 | Fernando Almeida | Entrada | Liberada | |
| 8 | 12/02/2026 | 085.\*\*\*.\*\*\*-17 | Fernando Almeida | Saída | | |
| 9 | 12/02/2026 | 098.\*\*\*.\*\*\*-10 | Renato Trent | Entrada | Negada | Falta de documento |
| 10 | 12/02/2026 | 046.\*\*\*.\*\*\*-33 | Vanio Ricardo | Entrada | Liberada | |
| 11 | 12/02/2026 | 046.\*\*\*.\*\*\*-33 | Vanio Ricardo | Saída | | |
| 12 | 01/03/2026 | 012.\*\*\*.\*\*\*-19 | João Azevedo | Entrada | Negada | Falta de documento |
| 13 | 01/03/2026 | 118.\*\*\*.\*\*\*-51 | Jessica Murch | Entrada | Negada | |
| 14 | 01/03/2026 | 088.\*\*\*.\*\*\*-66 | Marcos Batista | Entrada | Liberada | |
| 15 | 01/03/2026 | 088.\*\*\*.\*\*\*-66 | Marcos Batista | Saída | | |

*(A tabela é uma imagem no caderno, com filtros no cabeçalho; foi transcrita aqui.)*

A chefia solicitou um indicador de auditoria para medir quantas tentativas de entrada foram negadas e possuem observação registrada, pois ocorrências negadas sem justificativa dificultam a análise. Considerando que a contagem deve atender simultaneamente aos critérios OPERAÇÃO = “Entrada”, SITUAÇÃO = “Negada” e OBSERVAÇÃO preenchida, qual função é mais adequada para obter esse total no Excel 365 (padrão, em português)?

- **(A)** PROCV
- **(B)** SOMASES
- **(C)** CONT.SES
- **(D)** CORRESP

### Questão 5 — PMSP 2022, Soldado (FGV), Q51

*Nível médio · **outra banca (FGV)** · prova de **Soldado da PM de SP** · gabarito oficial definitivo · [prova](../Banco_de_Provas/Outras_Bancas/FGV_PMSP_2022_Soldado/prova.md), p. 11*

Considere uma planilha do Excel 2010 na qual as células A1, A2, B1 e B2 contêm, respectivamente, os valores 20, 53, 10 e 35, e na célula B4, foi digitada a fórmula a seguir. =SE(A1>B2;SE(B2+A1*A2+B1>530;A1;A2);A2+B2*A1) Assinale o valor exibido na célula B4.

- **(A)** 20
- **(B)** 53
- **(C)** 753
- **(D)** 1100
- **(E)** 1960

### Questão 6 — PMSP 2022, Soldado (FGV), Q52

*Nível médio · **outra banca (FGV)** · prova de **Soldado da PM de SP** · gabarito oficial definitivo · [prova](../Banco_de_Provas/Outras_Bancas/FGV_PMSP_2022_Soldado/prova.md), p. 11*

Gabriel coletou dados sobre as regiões brasileiras e preencheu os dados numa planilha Excel 2010, como mostrado a seguir.

| | A | B | C |
|---|---|---|---|
| 1 | Região | População | Área territorial |
| 2 | Sudeste | 89.632.912 | 924.620 |
| 3 | Nordeste | 57.667.842 | 1.544.291 |
| 4 | Sul | 30.402.587 | 576.774 |
| 5 | Norte | 18.906.962 | 3.853.676 |
| 6 | Centro-Oeste | 16.707.336 | 1.606.403 |

Depois de selecionar a região “A1:C6”, Gabriel inseriu um gráfico do tipo “Pizza 2D” por meio da guia Inserir, e o gráfico assim exibido mostrou a proporção da distribuição da população em cada região. Para exibir a distribuição territorial de cada região, Gabriel pode acionar a opção Selecionar Dados no menu pop-up do gráfico. Assinale o termo utilizado na interface do Excel que serve para distinguir as colunas de dados, nesse caso.

- **(A)** Dimensão.
- **(B)** Eixo.
- **(C)** Grandeza.
- **(D)** Série.
- **(E)** Variável.

### Questão 7 — Questão autoral de treino, no estilo AOCP — não oficial · INF 7

No Microsoft Excel 2019 (instalação padrão em português), a célula D2 contém a fórmula =B2*$C$1. Se o conteúdo de D2 for copiado e colado na célula D5, a fórmula em D5 será

- **(A)** =B2*$C$1
- **(B)** =B5*$C$4
- **(C)** =B5*$C$1
- **(D)** =E5*$C$1
- **(E)** =B5*C4

### Questão 8 — Questão autoral de treino, no estilo AOCP — não oficial · INF 7

Em uma planilha do Excel 2019 (instalação padrão em português), as células A1, A2 e A3 contêm, respectivamente, os valores 8, 4 e 2. O resultado da fórmula =A1/A2^2+A3*3 é

- **(A)** 6,5
- **(B)** 18
- **(C)** 10
- **(D)** 0,5
- **(E)** 22

### Questão 9 — Questão autoral de treino, no estilo AOCP — não oficial · INF 7

No LibreOffice Calc 7 (instalação padrão em português), um usuário quer, numa planilha chamada "Resumo", exibir o conteúdo da célula B3 da planilha chamada "Efetivo", do mesmo documento. A fórmula correta, na sintaxe padrão do Calc, é

- **(A)** =Efetivo!B3
- **(B)** =$Efetivo.B3
- **(C)** =Efetivo:B3
- **(D)** =B3@Efetivo
- **(E)** =[Efetivo]B3

### Questão 10 — Questão autoral de treino, no estilo AOCP — não oficial · INF 7

Um usuário salva, no formato **CSV**, uma pasta de trabalho do Excel 2019 que tem três planilhas, fórmulas, formatação e um gráfico. Sobre o arquivo gerado, é correto afirmar que

- **(A)** todas as planilhas são gravadas no mesmo arquivo, com fórmulas e gráficos.
- **(B)** apenas a planilha ativa é gravada, como texto, com os valores das células, sem formatação, fórmulas ou gráficos.
- **(C)** o arquivo só pode ser aberto pelo próprio Excel 2019.
- **(D)** a formatação é mantida, mas os valores numéricos são descartados.
- **(E)** o formato CSV é o formato padrão do LibreOffice Calc.

---

## 14. Gabarito e comentários

*Questões 1 a 6: gabaritos oficiais (AOCP e FGV). Questões 7 a 10: **autorais, não oficiais**. Os comentários são **análise do tutor**.*

### Placar de referência

| Questão | Gabarito | Tema |
|---|---|---|
| 1 — ITEP-RN Q30 | **E** | Referência absoluta |
| 2 — DESENBAHIA Q19 | **A** | PROCV |
| 3 — SEJUS-CE Q16 | **D** | DEF.NÚM.DEC |
| 4 — PP-SP Q38 | **C** | CONT.SES |
| 5 — PMSP (FGV) Q51 | **C** | SE aninhado |
| 6 — PMSP (FGV) Q52 | **D** | Série |
| 7 — autoral | **C** | Copiar fórmula |
| 8 — autoral | **A** | Precedência |
| 9 — autoral | **B** | Outra planilha (Calc) |
| 10 — autoral | **B** | CSV |

### Questão 1 — gabarito E

**Por que a (E) está correta:** em **$A$1** e **$A$3**, o cifrão está antes da coluna e antes da linha: referência **absoluta**, que não muda ao copiar. Vale igual no Excel 2019.

**Por que as outras estão erradas:** (A) "$A1$" põe um cifrão **depois** do número, posição que não existe; (B) não existe função de referência absoluta; (C) cifrão em volta de uma conta não é sintaxe válida; (D) **ABS** devolve o **valor absoluto** (módulo) de um número, não cria referência.

### Questão 2 — gabarito A

**Por que a (A) está correta:** o **PROCV** procura o valor na **primeira coluna à esquerda** do intervalo e devolve o valor da **mesma linha** na coluna pedida. Igual no Excel 2019.

**Por que as outras estão erradas:** (B) e (D) falam em "linha", que é o caso do **PROCH**; (C) e (E) falam na **última** coluna ou linha, e o PROCV usa a primeira coluna.

### Questão 3 — gabarito D

**Por que a (D) está correta:** **DEF.NÚM.DEC** formata o número com quantidade fixa de casas decimais e separador de milhar (o resultado é texto). A função continua com o mesmo nome no **LibreOffice 7**.

**Por que as outras estão erradas:** (A) e (B) não são funções do Calc com essa finalidade; (C) **TRUNCAR** só **corta** casas decimais, sem formatar nem pôr separador de milhar.

### Questão 4 — gabarito C

**Por que a (C) está correta:** a contagem precisa atender **três critérios ao mesmo tempo** (OPERAÇÃO = "Entrada", SITUAÇÃO = "Negada", OBSERVAÇÃO preenchida, com o critério **"<>"**): função **CONT.SES**, que existe também no **Excel 2019**. Na tabela, o resultado seria **3** (linhas 6, 9 e 12; a linha 13 é negada, mas sem observação).

**Por que as outras estão erradas:** (A) **PROCV** busca um valor, não conta; (B) **SOMASES** **soma** valores com critérios, e aqui se quer **contar** linhas; (D) **CORRESP** devolve a **posição** de um valor.

### Questão 5 — gabarito C

**Por que a (C) está correta:**
1. Teste do primeiro SE: A1 > B2 → 20 > 35? **Falso**.
2. Vai para o terceiro argumento: A2+B2*A1.
3. Precedência: B2*A1 = 35 × 20 = 700; depois 53 + 700 = **753**.
4. O SE de dentro nem é avaliado, porque está no ramo do "verdadeiro".

**Por que as outras estão erradas:** (A) 20 e (B) 53 seriam os resultados do SE de dentro, que não é avaliado; (D) e (E) não correspondem a nenhum ramo calculado com a precedência correta (por exemplo, somar antes de multiplicar dá (53 + 35) × 20 = 1.760, que nem está entre as alternativas).

### Questão 6 — gabarito D

**Por que a (D) está correta:** no Excel, cada coluna de valores representada no gráfico é uma **série** de dados (aqui, "População" e "Área territorial"). A pizza mostra **uma série** por vez; em **Selecionar Dados**, troca-se a série exibida. Igual no Excel 2019.

**Por que as outras estão erradas:** (B) **eixo** é a linha de referência do gráfico (de categorias ou de valores), e a pizza nem tem eixos; (A), (C) e (E) não são os termos da interface do Excel para esse caso.

### Questão 7 — gabarito C

**Por que a (C) está correta:** a cópia desceu **3 linhas** e **0 colunas**. B2 é relativa → **B5**. $C$1 é absoluta → continua **$C$1**.

**Por que as outras estão erradas:** (A) não ajustou a relativa; (B) e (E) alteraram a absoluta; (D) mudou a coluna, mas a cópia foi na mesma coluna.

### Questão 8 — gabarito A

**Por que a (A) está correta:** potência primeiro: A2^2 = 16. Depois divisão e multiplicação: 8 ÷ 16 = 0,5 e 2 × 3 = 6. Por fim, a soma: 0,5 + 6 = **6,5**.

**Por que as outras estão erradas:** (B) 18 sai da conta feita da **esquerda para a direita** (8 ÷ 4 = 2; 2² = 4; 4 + 2 = 6; 6 × 3 = 18); (C) 10 sai de (8 ÷ 4)² + 6; (D) 0,5 esquece a segunda parcela; (E) 22 é só o denominador de uma leitura errada (16 + 6).

### Questão 9 — gabarito B

**Por que a (B) está correta:** no Calc, a referência a outra planilha é **$Planilha.Célula**: **=$Efetivo.B3**.

**Por que as outras estão erradas:** (A) é a sintaxe do **Excel** (com "!"); (C) os dois-pontos indicam **intervalo**; (D) e (E) não são sintaxes do Calc.

### Questão 10 — gabarito B

**Por que a (B) está correta:** **CSV** é texto com os valores separados (no Brasil, por ponto e vírgula). Ao salvar, o Excel avisa que o formato não aceita várias planilhas e grava **só a planilha ativa**, com os **valores** (resultados das fórmulas), sem formatação nem gráficos.

**Por que as outras estão erradas:** (A) CSV não guarda várias planilhas nem fórmulas e gráficos; (C) CSV é texto e abre em qualquer editor ou planilha; (D) é o contrário: ficam os valores, perde-se a formatação; (E) o padrão do Calc é **.ods**.

### Estudo dirigido — respostas *(resposta-modelo do tutor, não oficial)*

1. **Célula**: o encontro de uma coluna com uma linha, identificada pelo endereço (B3). **Intervalo**: um conjunto de células, como **A1:A10** (de A1 até A10). **Pasta de trabalho**: o arquivo inteiro do Excel (no Calc, "documento de planilha"). Extensões: Excel **.xlsx**; Calc **.ods**.
2. 1º **parênteses**; 2º **potência** (^); 3º **multiplicação e divisão**, da esquerda para a direita; 4º **soma e subtração**; por último, **&** e as comparações.
3. **Relativa** (A1): ao copiar, coluna e linha mudam. **Absoluta** ($A$1): nada muda. **Mista** ($A1 ou A$1): trava só a coluna ou só a linha. A tecla que alterna é **F4**, no Excel e no Calc 7.
4. Excel: **=Plan2!B4**. Calc: **=$Plan2.B4**.
5. **CONT.NÚM**: conta células com **números**. **CONT.VALORES**: conta células **não vazias**. **CONT.SE**: conta com **um critério**. **CONT.SES**: conta com **vários critérios ao mesmo tempo**.
6. Procura um valor na **primeira coluna** do intervalo e devolve o valor da **mesma linha**, na coluna indicada pelo **número** (ex.: =PROCV(F2;A2:C20;3;0) devolve a 3ª coluna). O **0** (ou FALSO) pede **correspondência exata**.
7. **DEF.NÚM.DEC** **formata** o número com casas decimais fixas e separador de milhar e devolve **texto** (=DEF.NÚM.DEC(1234,5;2) → "1.234,50"). **TRUNCAR** **corta** as casas decimais sem arredondar (=TRUNCAR(2,567;2) → 2,56).
8. **#DIV/0!**: divisão por **zero** (ou por célula vazia). **#NOME?**: nome de função **escrito errado** ou inexistente. **#REF!**: **referência inválida** (a célula foi excluída). **#N/D**: **valor não encontrado** (comum no PROCV). **####**: **coluna estreita** demais para mostrar o número (não é erro de fórmula).
9. **Comparar**: colunas ou barras. **Evolução**: linhas. **Partes de um total**: pizza (uma série só). **Série de dados** é **cada conjunto de valores** que o gráfico desenha, em geral uma coluna (ou linha) da tabela.
10. O CSV é **texto** com valores separados: guarda **só a planilha ativa** e perde as **fórmulas** (ficam só os valores), a **formatação** e os **gráficos**.

### Revisão espaçada — respostas *(exercícios do tutor, não oficiais)*

1. Word (pt-BR): **Ctrl + B** salva e **Ctrl + S** sublinha. Writer: **Ctrl + B** põe negrito e **Ctrl + S** salva.
2. Guia **Correspondências**. No Writer 7: **Formatar → Estilo de página → guia Página → Orientação**.
3. "O alarme toca **e** a guarnição **não** sai."
4. "**Algum** policial **não** é motorista."
5. **rd** (ou rmdir).
6. **Confederação do Equador**; **Frei Caneca** foi fuzilado em 1825.
