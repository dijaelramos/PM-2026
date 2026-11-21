# Material do dia — segunda-feira, 28/12/2026 — Informática (2 h 30) e Redação (30 min)

> **Sessão do plano:** Informática, **sessão 7/10**, item **7** do Anexo II: **Microsoft Excel 2019** e **LibreOffice 7 Calc**: planilhas, fórmulas e funções, tabelas, gráficos e exportação de arquivos ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** Informática 2 h 30: 20 min de revisão · 1 h 20 de tópicos e exemplos · 50 min de questões com correção. Redação 30 min: enviar o texto ao Tutor de Redação, ler a correção e reescrever um parágrafo.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova.
> **Fontes:** [Informática (base)](../Base_de_Conhecimento/INFORMÁTICA/Informática.txt) e a [lista oficial de atalhos do LibreOffice Calc 7](../Base_de_Conhecimento/INFORMÁTICA/Atalhos_oficiais_Windows11_e_LibreOffice7.md) (Ajuda do LibreOffice 7.6, em português). Atalhos do Excel em português vêm marcados como *consenso dos manuais* quando não há fonte oficial coerente.
> **Questões do dia:** em arquivo separado, [2026-12-28_Informatica_e_Redacao_Questoes.md](2026-12-28_Informatica_e_Redacao_Questoes.md), com o estudo dirigido, o mapa, 6 questões **oficiais** (4 da AOCP e 2 da FGV) e 4 **autorais**, com gabarito comentado.
> ⚠️ **Correção à base:** o [guia da base](../Base_de_Conhecimento/INFORMÁTICA/Informática.txt) diz que, no Calc, o atalho que alterna referências relativas e absolutas é **Shift + F4**. Na **lista oficial do LibreOffice 7.6**, é **F4**, como no Excel. Shift + F4 era o atalho de versões antigas do Calc.
> ⚠️ **Questões fora:** PMES 2018, Q46, e UFPB 2019, Q24, ficaram de fora porque a fórmula do enunciado é uma **imagem** que não aparece na transcrição; ITEP-RN 2018, Q37, porque depende de ícones que também não aparecem.

## Roteiro

| Bloco | O que fazer |
|---|---|
| **20 min — revisão** | Revisão espaçada (seção 11). |
| **1 h 20 — tópicos e exemplos** | Seções 1 a 7, nos três níveis. Se tiver Excel ou Calc, **digite os exemplos**. Feche com os quadros (seção 8) e as pegadinhas (seção 9). |
| **50 min — questões com correção** | As 10 questões do [arquivo de questões](2026-12-28_Informatica_e_Redacao_Questoes.md) e a correção pelo gabarito. |
| **30 min — Redação** | Seção 10: correção da redação de 23/12 (apostas on-line). |

## Cobertura do edital

Texto do Anexo II: *"7. Edição de textos, planilhas e apresentações (ambientes Microsoft Office 2019 e LibreOffice 7, em português)."* (parte de **planilhas**; redação do plano: planilhas, fórmulas e funções, tabelas, gráficos e exportação de arquivos)

| Item | Subtópico | Situação |
|---|---|---|
| 7 | Conceitos e interface do Excel 2019 e do Calc 7 | **explicado hoje** (seção 1) |
| 7 | Fórmulas, operadores e ordem das operações | **explicado hoje** (seção 2) |
| 7 | Referências relativas, absolutas e mistas; outra planilha | **explicado hoje** (seção 3) |
| 7 | Funções (soma, contagem, SE, PROCV e outras) | **explicado hoje** (seção 4) |
| 7 | Formatação, classificar, filtrar, erros | **explicado hoje** (seção 5) |
| 7 | Gráficos | **explicado hoje** (seção 6) |
| 7 | Salvar e exportar | **explicado hoje** (seção 7) |
| 7 | Word e Writer | **23/12** |
| 7 | PowerPoint e Impress | **30/12** |

---

## 1. Conceitos e interface

### 🟢 Iniciante — entender

Uma **planilha eletrônica** é uma grade de **colunas** (letras: A, B, C…) e **linhas** (números: 1, 2, 3…). O encontro de uma coluna com uma linha é a **célula**, identificada pelo **endereço** (B3 = coluna B, linha 3). O arquivo inteiro se chama **pasta de trabalho** no Excel (**.xlsx**) e **documento de planilha** no Calc (**.ods**); cada aba é uma **planilha**.

- **Intervalo:** A1:A10 (de A1 **até** A10). Em português, os argumentos das funções se separam por **ponto e vírgula**: =SOMA(A1;B1).
- **Caixa de Nome** (à esquerda) mostra o endereço da célula ativa; a **Barra de Fórmulas** (Excel) ou **Linha de entrada** (Calc) mostra o conteúdo da célula.

### 🟡 Intermediário — aplicar

**Guias do Excel 2019 que mais caem:**

| Guia | Comandos |
|---|---|
| **Página Inicial** | Fonte, alinhamento, **Mesclar e Centralizar**, **Quebrar Texto Automaticamente**, formato de número (Moeda, %, **Aumentar/Diminuir Casas Decimais**), **Formatação Condicional**, Inserir/Excluir células, **AutoSoma**, **Classificar e Filtrar** |
| **Inserir** | **Tabela**, **Tabela Dinâmica**, **Gráficos**, Minigráficos, Imagens |
| **Fórmulas** | Inserir Função, Biblioteca de Funções, Gerenciador de Nomes, Rastrear Precedentes/Dependentes |
| **Dados** | **Classificar**, **Filtro**, Remover Duplicatas, **Validação de Dados**, Texto para Colunas |
| **Exibir** | **Congelar Painéis**, Linhas de Grade, Zoom |

**Calc 7 (menus):** Arquivo · Editar · Exibir · Inserir · Formatar · Estilos · Planilha · Dados · Ferramentas · Janela · Ajuda. Destaques: **Inserir → Gráfico**, **Inserir → Função** (**Ctrl + F2**, Assistente de funções), **Dados → Ordenar**, **Dados → AutoFiltro**, **Formatar → Células** (**Ctrl + 1**), **Exibir → Congelar linhas e colunas**.

### 🔴 Avançado — acertar a prova

- **Tabela** (Inserir → Tabela, no Excel) transforma um intervalo em tabela com **filtros no cabeçalho** e formatação automática.
- **Tabela dinâmica** resume grandes listas (somas e contagens por categoria) sem fórmulas.

---

## 2. Fórmulas e ordem das operações

### 🟢 Iniciante — entender

Toda fórmula começa com **=**. Operadores:

| Tipo | Operadores |
|---|---|
| Aritméticos | **+** soma, **−** subtração, **\*** multiplicação, **/** divisão, **^** potência, **%** porcentagem |
| Texto | **&** junta textos (="PM"&"PE" → PMPE) |
| Comparação | = , <> (diferente), > , < , >= , <= |

### 🟡 Intermediário — aplicar

**Ordem das operações:** 1º **parênteses**; 2º **potência** (^); 3º **multiplicação e divisão** (da esquerda para a direita); 4º **soma e subtração**; por último, **&** e as comparações.

*Exemplo 1.* B1 = 6, B2 = 3, B3 = 2. Calcule =B1+B2*B3^2.
1. Potência: B3^2 = 4.
2. Multiplicação: B2 × 4 = 12.
3. Soma: 6 + 12 = **18**.
4. Com parênteses, =(B1+B2)*B3^2 = 9 × 4 = **36**.

### 🔴 Avançado — acertar a prova

- **Não** calcule da esquerda para a direita sem olhar a precedência: a banca põe a resposta "da esquerda para a direita" entre as alternativas.
- Fórmula escrita **sem o =** vira **texto** e não calcula.

---

## 3. Referências: relativa, absoluta e mista

### 🟢 Iniciante — entender

Quando você **copia** uma fórmula para outra célula (ou arrasta pela **alça de preenchimento**, o quadradinho no canto da célula), os endereços **mudam** junto. O cifrão **$** **trava** a coluna, a linha ou as duas.

| Tipo | Exemplo | Ao copiar |
|---|---|---|
| **Relativa** | A1 | coluna e linha mudam |
| **Absoluta** | **$A$1** | nada muda |
| **Mista** | **$A1** | a coluna fica; a linha muda |
| **Mista** | **A$1** | a linha fica; a coluna muda |

Atalho para alternar entre os tipos: **F4** no **Excel** e no **Calc 7** (lista oficial do LibreOffice 7.6).

### 🟡 Intermediário — aplicar

*Exemplo 2.* Em C2 está =B2*$F$1 (F1 guarda a taxa). Copiando C2 para C7:
1. A cópia desceu **5 linhas** e **0 colunas**.
2. B2 é relativa: vira **B7**.
3. $F$1 é absoluta: continua **$F$1**.
4. Resultado em C7: **=B7*$F$1**.

*Exemplo 3 (mista).* Em B5 está =$A5*B$2. Copiando para D8 (2 colunas à direita, 3 linhas abaixo):
1. $A5: coluna travada (A), linha muda 5 → **8** → $A8.
2. B$2: coluna muda B → **D**, linha travada → D$2.
3. Resultado: **=$A8*D$2**.

**Referência a outra planilha:**

| Programa | Forma | Exemplo |
|---|---|---|
| **Excel** | Planilha**!**Célula | =Plan2**!**B4 |
| **Calc** | **$**Planilha**.**Célula | =**$**Plan2**.**B4 |

### 🔴 Avançado — acertar a prova

- O **$** fica **antes** da letra e/ou **antes** do número: **$A$1**, **$A1**, **A$1**. Não existe outra posição para o cifrão, nem cifrão em volta de uma conta inteira.
- Referência absoluta **não** é feita por função: é feita **só com o $**. (Funções com nome parecido tratam de números, não de endereços.)
- Copiar para o **lado** muda só a **coluna**; copiar para **baixo** muda só a **linha**.

---

## 4. Funções

### 🟢 Iniciante — entender

Função = fórmula pronta: **=NOME(argumentos)**. Os nomes são em **português**, nos dois programas.

### 🟡 Intermediário — aplicar

| Função | O que faz | Exemplo (A1:A4 = 10, 20, vazio, "ok") |
|---|---|---|
| **SOMA** | Soma | =SOMA(A1:A2) → 30 |
| **MÉDIA** | Média dos números | =MÉDIA(A1:A2) → 15 |
| **MÁXIMO / MÍNIMO** | Maior / menor | =MÁXIMO(A1:A2) → 20 |
| **MAIOR / MENOR** (int.; k) | k-ésimo maior / menor | =MAIOR(A1:A2;2) → 10 |
| **CONT.NÚM** | Conta células com **números** | =CONT.NÚM(A1:A4) → 2 |
| **CONT.VALORES** | Conta células **não vazias** | =CONT.VALORES(A1:A4) → 3 |
| **CONTAR.VAZIO** | Conta células **vazias** | =CONTAR.VAZIO(A1:A4) → 1 |
| **CONT.SE** (int.; critério) | Conta com **um** critério | =CONT.SE(A1:A4;">15") → 1 |
| **CONT.SES** (int.1; crit.1; int.2; crit.2; …) | Conta com **vários** critérios **ao mesmo tempo** | ver exemplo 5 |
| **SOMASE / SOMASES** | Soma com um / vários critérios | =SOMASE(B:B;"Norte";C:C) |
| **SE** (teste; se verdadeiro; se falso) | Decide entre dois resultados | ver exemplo 4 |
| **E / OU** | Combinam testes dentro do SE | =SE(E(A1>5;A2>5);"ok";"não") |
| **ARRED** (núm.; casas) | Arredonda | =ARRED(2,567;2) → 2,57 |
| **TRUNCAR** (núm.; casas) | Corta as casas, sem arredondar | =TRUNCAR(2,567;2) → 2,56 |
| **DEF.NÚM.DEC** (núm.; casas) | **Formata** o número com casas decimais fixas e separador de milhar, devolvendo **texto** | =DEF.NÚM.DEC(1234,5;2) → "1.234,50" |
| **CONCATENAR** ou **&** | Junta textos | =CONCATENAR("PM";"PE") → PMPE |
| **HOJE / AGORA** | Data atual / data e hora | =HOJE() |
| **PROCV** | Procura um valor na **1ª coluna** de uma tabela e devolve o valor da **mesma linha**, na coluna indicada | ver exemplo 6 |
| **PROCH** | Igual ao PROCV, mas procura na **1ª linha** | — |
| **CORRESP / ÍNDICE** | Posição de um valor / valor numa posição | — |

**PROCX** não existe no Excel 2019 (só no Microsoft 365).

*Exemplo 4 (SE aninhado).* A1 = 7, A2 = 4. Fórmula: =SE(A1<A2;A1*2;SE(A1+A2>10;A1;A2+1)).
1. Primeiro teste: 7 < 4? **Falso** → vai para o **terceiro argumento**, que é outro SE.
2. Segundo teste: 7 + 4 = 11 > 10? **Verdadeiro** → devolve **A1 = 7**.
3. Resultado: **7**. (Se o primeiro teste fosse verdadeiro, o resultado seria A1*2, e o segundo SE nem seria avaliado.)

*Exemplo 5 (CONT.SES).* Uma planilha de viaturas tem: B = Batalhão, C = Situação, D = Observação. Quantas viaturas do "6º BPM" estão "Baixadas" **e** com observação preenchida?
1. São **três** critérios ao mesmo tempo e a pergunta é "**quantas**" → **CONT.SES** (o CONT.SE aceita um critério só).
2. =CONT.SES(B2:B50;"6º BPM";C2:C50;"Baixada";D2:D50;"<>")
3. O critério **"<>"** significa "**diferente de vazio**" (preenchida).

*Exemplo 6 (PROCV).* A tabela A2:C20 tem Matrícula (A), Nome (B) e Posto (C). Para achar o **posto** da matrícula que está em F2:
1. =PROCV(F2;A2:C20;3;0)
2. Procura F2 na **primeira coluna** (A) do intervalo.
3. Devolve o valor da **3ª coluna** do intervalo (C), na mesma linha.
4. O **0** (ou FALSO) pede **correspondência exata**.

### 🔴 Avançado — acertar a prova

- **PROCV** procura sempre na **primeira coluna** do intervalo (a da esquerda) e devolve o valor da coluna indicada pelo **número**, na mesma linha. Quem procura numa linha é o **PROCH**.
- **CONT.SE** = um critério; **CONT.SES** = vários (todos precisam valer ao mesmo tempo).
- **DEF.NÚM.DEC** formata (devolve texto); **TRUNCAR** corta casas; **ARRED** arredonda.

---

## 5. Formatação, classificar, filtrar e erros

### 🟢 Iniciante — entender

- **Formatar números:** moeda (R$), porcentagem, número de casas decimais (botões **Aumentar** e **Diminuir Casas Decimais**, no Excel). Mudar o formato **não** muda o valor guardado: 2,567 exibido como 2,57 continua valendo 2,567 nos cálculos.
- **Formatação condicional:** muda a cor da célula **conforme o valor** (por exemplo, vermelho se negativo).
- **Classificar:** ordena as linhas. **Filtrar:** **esconde** as linhas que não atendem ao critério, sem apagá-las.

### 🟡 Intermediário — aplicar

| Tarefa | Excel 2019 | Calc 7 |
|---|---|---|
| Formatar células | Página Inicial (ou **Ctrl + 1**, *consenso dos manuais*) | **Formatar → Células** (**Ctrl + 1**) |
| Formato de 2 casas com separador de milhar | Página Inicial → Número | **Ctrl + Shift + 1** |
| Classificar | Dados → Classificar | **Dados → Ordenar** |
| Filtro nos cabeçalhos | Dados → **Filtro** | **Dados → AutoFiltro** |
| Congelar cabeçalho | Exibir → **Congelar Painéis** | Exibir → **Congelar linhas e colunas** |
| Editar a célula | **F2** | **F2** |
| Ir para A1 | Ctrl + Home | **Ctrl + Home** |
| Próxima planilha | Ctrl + Page Down | **Ctrl + Page Down** |
| Assistente de funções | Fórmulas → Inserir Função | **Ctrl + F2** |

**Mensagens de erro do Excel:**

| Erro | Causa |
|---|---|
| **#DIV/0!** | Divisão por zero (ou por célula vazia) |
| **#NOME?** | Nome de função escrito errado ou inexistente |
| **#VALOR!** | Tipo errado (texto numa conta) |
| **#REF!** | Referência inválida (a célula foi excluída) |
| **#N/D** | Valor não encontrado (comum no PROCV) |
| **####** | Coluna estreita demais para mostrar o número |

### 🔴 Avançado — acertar a prova

- **####** não é erro de fórmula: basta alargar a coluna.
- Filtro **não exclui** dados.

---

## 6. Gráficos

### 🟢 Iniciante — entender

Gráfico transforma números em figura. Selecione os dados (com os títulos) e use **Inserir → Gráficos** (Excel) ou **Inserir → Gráfico** (Calc).

| Tipo | Melhor para |
|---|---|
| **Colunas / barras** | **Comparar** categorias |
| **Linhas** | **Evolução** no tempo |
| **Pizza** | **Partes de um total** (uma série só) |
| **Dispersão** | Relação entre duas variáveis numéricas |

### 🟡 Intermediário — aplicar

Partes de um gráfico: **título**, **eixos** (horizontal = categorias; vertical = valores), **legenda** e **séries de dados**. **Série** é **cada conjunto de valores** que o gráfico desenha, em geral **uma coluna** (ou uma linha) da tabela. **Categorias** são os rótulos (os nomes de cada linha).

*Exemplo 7.* Uma tabela tem Batalhão (A), Ocorrências 2025 (B) e Ocorrências 2026 (C).
1. Gráfico de **colunas** com A1:C6: duas **séries** (2025 e 2026), cinco **categorias** (os batalhões).
2. Gráfico de **pizza** com o mesmo intervalo: mostra **só uma série** (a primeira). Para ver a outra, troque a série em **Selecionar Dados** (botão direito no gráfico, no Excel).

### 🔴 Avançado — acertar a prova

- A pizza mostra **uma série** por vez.
- Os termos da interface do Excel são **Série**, **Categoria**, **Eixo** e **Legenda**: decore o que cada um é.

---

## 7. Salvar e exportar

| Formato | Uso |
|---|---|
| **.xlsx** | Padrão do **Excel** (2007 em diante) |
| **.xls** | Excel 97-2003 |
| **.xltx** / **.xlsm** | **Modelo** do Excel / Excel **com macros** |
| **.ods** / **.ots** | Padrão do **Calc** / **modelo** do Calc |
| **.csv** | **Texto** com valores separados (no Brasil, por ponto e vírgula); guarda **só a planilha ativa**, **sem** fórmulas, formatação ou gráficos |
| **.pdf** | Leitura e impressão |

| Tarefa | Excel 2019 | Calc 7 |
|---|---|---|
| Gerar PDF | Arquivo → **Exportar → Criar PDF/XPS** | Arquivo → **Exportar como → Exportar como PDF** |
| Salvar no formato do outro | Salvar como → **.ods** | Salvar como → **.xlsx** (avisa: manter o formato ou usar o ODF) |

---

## 8. Quadros para não confundir

### 8.1 Contar e somar

| Pergunta | Função |
|---|---|
| Quantas células têm **número**? | CONT.NÚM |
| Quantas células **não estão vazias**? | CONT.VALORES |
| Quantas atendem **um** critério? | CONT.SE |
| Quantas atendem **vários** critérios ao mesmo tempo? | **CONT.SES** |
| **Soma** com critério(s)? | SOMASE / SOMASES |
| **Buscar** um dado numa tabela? | PROCV (ou PROCH, CORRESP + ÍNDICE) |

### 8.2 Excel × Calc

| | Excel 2019 | Calc 7 |
|---|---|---|
| Formato padrão | .xlsx | .ods |
| Outra planilha | Plan2**!**A1 | **$**Plan2**.**A1 |
| Alternar referências | F4 | **F4** (lista oficial 7.6) |
| Assistente de funções | Fórmulas → Inserir Função | **Ctrl + F2** |
| Filtro | Dados → Filtro | Dados → **AutoFiltro** |
| Ordenar | Dados → Classificar | Dados → **Ordenar** |

---

## 9. Pegadinhas da banca

| A banca escreve… | O certo é… | Onde |
|---|---|---|
| Fórmula calculada da esquerda para a direita | **Parênteses → potência → × ÷ → + −** | Seção 2 |
| Ao copiar, $A$1 vira $A$2 | Absoluta **não muda** | Seção 3 |
| Copiar para baixo muda a coluna | Para baixo muda a **linha** | Seção 3 |
| Referência absoluta se cria com uma função | Cria-se com o **$** no endereço | Seção 3 |
| No Calc, a outra planilha se cita com "!" | **$Planilha.A1** (o "!" é do Excel) | Seção 3 |
| CONT.SE aceita vários critérios | Vários critérios = **CONT.SES** | Seção 4 |
| No PROCV, o número indica a linha do resultado | Indica a **coluna** (dentro do intervalo) | Seção 4 |
| PROCX existe no Excel 2019 | Só no Microsoft **365** | Seção 4 |
| Mudar as casas decimais muda o valor | Muda só a **exibição** | Seção 5 |
| Filtro apaga as linhas | Só **oculta** | Seção 5 |
| #### é erro de fórmula | Coluna **estreita** | Seção 5 |
| Pizza mostra várias séries ao mesmo tempo | **Uma** série | Seção 6 |
| CSV guarda todas as planilhas e as fórmulas | Só a planilha **ativa**, só os **valores** | Seção 7 |

---

## 10. Redação (30 min) — correção e reescrita

1. **5 min:** digite o texto de **23/12** (impactos das apostas on-line nas famílias) exatamente como está na folha.
2. **Peça a correção:** "Corrija minha redação pela Tabela 12.2 da PMPE. Proposta: autoral do tutor, os impactos das apostas on-line na vida das famílias brasileiras (15 a 20 linhas). Meu texto tem __ linhas na folha."
3. **15 min:** leia a correção e anote os 3 problemas que mais tiraram pontos.
4. **10 min:** reescreva o parágrafo com mais apontamentos.

Se ainda há redações anteriores sem correção (13/11, 19/11, 27/11, 04/12, 11/12 e 18/12), mande também.

---

## 11. Revisão espaçada (faça primeiro, em 20 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2026-12-28_Informatica_e_Redacao_Questoes.md).*

1. **INF 7 (23/12).** No Word em português, o que fazem Ctrl + B e Ctrl + S? E no Writer?
2. **INF 7 (23/12).** Em que guia do Word 2019 fica a mala direta? E onde se muda a orientação da página no Writer 7?
3. **RL 1 (22/12).** Negue: "Se o alarme toca, a guarnição sai."
4. **RL 1 (22/12).** "É falso que todo policial é motorista" quer dizer o quê?
5. **INF 6 (21/12).** Qual comando do Prompt remove uma pasta?
6. **HPE 5 (18/12).** Qual movimento pernambucano de 1824 se opôs à centralização de D. Pedro I? Quem foi fuzilado depois dele?
