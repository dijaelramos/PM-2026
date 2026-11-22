# Material do dia — quarta-feira, 13/01/2027 — Informática (3 h)

> **Sessão do plano:** Informática, **sessão 9/10**, itens **6 e 7** do Anexo II: Windows 11 (configurações, recursos do sistema, Painel de Controle e comandos do Prompt de Comando) e **integração** de Word/Writer, Excel/Calc e PowerPoint/Impress, com exportação ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** 30 min de revisão · 1 h 30 de tópicos e exemplos · 1 h de questões com correção.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova.
> **Fontes:** [Informática (base)](../Base_de_Conhecimento/INFORMÁTICA/Informática.txt) (itens 6 e 7) e a [lista oficial de atalhos do Windows 11](../Base_de_Conhecimento/INFORMÁTICA/Atalhos_oficiais_Windows11_e_LibreOffice7.md) (Suporte Microsoft). O que vem marcado como *consenso dos manuais* é explicação do tutor, sem fonte local.
> **Ligação com 21/12:** a sessão 5/10 ensinou o básico (Explorador, atalhos principais, Configurações × Painel de Controle, comandos dir, cd, md, rd, copy, move, del, ren). Hoje é a **retomada com aprofundamento**: recursos do sistema, comandos de rede e de processos, e o uso **integrado** dos programas.
> **Questões do dia:** em arquivo separado, [2027-01-13_Informatica_Questoes.md](2027-01-13_Informatica_Questoes.md), com o estudo dirigido, o mapa, 2 questões **oficiais** da AOCP e 8 **autorais**, com gabarito comentado.
> **Poucas questões oficiais:** as questões de Windows do banco cobram Windows 7, 10 ou XP. As utilizáveis já saíram em 21/12; das que sobraram, só a de 2º Tenente PMPE 2023 (Windows 10) ensina algo que vale para o 11, e ela vem com aviso. Por isso entram 8 autorais.

## Roteiro

| Bloco | O que fazer |
|---|---|
| **30 min — revisão** | Revisão espaçada (seção 7, 10 min) e releitura da seção "Para levar para a prova" de [21/12](2026-12-21_Informatica_e_Redacao.md), partes 3 a 5. |
| **1 h 30 — tópicos e exemplos** | Seções 1 a 4, nos três níveis, refazendo os exemplos. Depois os quadros e as pegadinhas (seções 5 e 6) e o estudo dirigido do [arquivo de questões](2027-01-13_Informatica_Questoes.md). |
| **1 h — questões** | As 10 questões (cerca de 4 min cada) e a correção pelo gabarito. |

## Cobertura do edital

| Item | Subtópico | Situação |
|---|---|---|
| 5 e 6 | Explorador, atalhos básicos, Configurações × Painel, comandos básicos do Prompt | 21/12 |
| 6 | Recursos do Windows 11: áreas de trabalho virtuais, Snap, capturas, contas, manutenção, recuperação | **explicado hoje** (seção 1) |
| 6 | Configurações e Painel de Controle em detalhe | **explicado hoje** (seção 2) |
| 6 | Prompt de Comando: rede, processos, sistema e ajuda | **explicado hoje** (seção 3) |
| 7 | Integração Office × LibreOffice: formatos, PDF, colar especial, vínculo, mala direta | **explicado hoje** (seção 4) |
| 1 a 7 | Revisão geral de Informática | **sessão 10/10** (fevereiro) |

---

## 1. Recursos do Windows 11

### 🟢 Iniciante — entender

O Windows 11 traz recursos para **organizar o trabalho** (várias áreas de trabalho, janelas lado a lado), **capturar a tela** e **manter o sistema** funcionando (limpeza, atualização, recuperação).

> **Ex. 1** *(criado pelo tutor)* — Num plantão, você deixa numa área de trabalho os sistemas da ocorrência e, em outra, os documentos pessoais. Alterna entre elas sem fechar nada.

### 🟡 Intermediário — aplicar

**1.1 Organizar janelas e áreas de trabalho** (lista oficial, salvo indicação):

| Atalho | Função |
|---|---|
| **Windows + Tab** | Abrir a **Visão de Tarefas** (mostra as janelas abertas e as **áreas de trabalho virtuais**; ali se cria uma nova) |
| **Windows + Ctrl + D** | Criar uma nova **área de trabalho virtual** *(consenso dos manuais)* |
| **Windows + Ctrl + ← / →** | Alternar entre as áreas de trabalho virtuais *(consenso dos manuais)* |
| **Windows + Z** | Abrir os **layouts de ajuste** (Snap) |
| **Windows + ← / →** | Encaixar a janela na metade esquerda ou direita da tela |
| **Windows + ↑ / ↓** | **Maximizar** / **minimizar** a janela ativa |
| **Windows + Home** | Minimizar ou restaurar todas as janelas, **exceto a ativa** |
| **Windows + vírgula (,)** | **Espiar** temporariamente a área de trabalho |

**1.2 Capturar a tela:**

| Atalho | O que faz |
|---|---|
| **PrtScn** | Seleciona uma região da tela e copia para a **área de transferência** (padrão atual do Windows 11) |
| **Alt + PrtScn** | Captura a **janela ativa** para a área de transferência |
| **Windows + Shift + S** | Seleciona uma região e copia para a área de transferência (**Ferramenta de Captura**) |
| **Windows + PrtScn** | Captura a **tela inteira** e **salva um arquivo** na pasta **Imagens > Capturas de Tela** |
| **Windows + Shift + R** | **Grava em vídeo** uma região da tela (Ferramenta de Captura) |

**1.3 Outros atalhos úteis:** **Windows + V** (histórico da área de transferência, que precisa ser **ativado**); **Windows + ponto (.)** (painel de **emojis**); **Windows + W** (**Widgets**); **Windows + N** (central de **notificações** e calendário); **Windows + A** (configurações rápidas); **Windows + P** (modo de **projeção**: duplicar, estender, só segunda tela); **Windows + Pause** (Configurações > Sistema > **Sobre**); **Windows + U** (**Acessibilidade**).

**1.4 Contas de usuário** *(consenso dos manuais)*:

| Tipo | Pode |
|---|---|
| **Administrador** | Instalar programas, mudar configurações que afetam todos, criar contas |
| **Padrão** | Usar os programas e mudar as **próprias** configurações; para instalar ou alterar o sistema, o **Controle de Conta de Usuário (UAC)** pede a senha de um administrador |

**1.5 Manutenção e recuperação** *(consenso dos manuais)*:

| Recurso | Para que serve |
|---|---|
| **Limpeza de Disco** / **Sensor de Armazenamento** | Liberar espaço (arquivos temporários, Lixeira) |
| **Desfragmentar e Otimizar Unidades** | Otimizar o disco (no **SSD**, o Windows faz a otimização própria, não a desfragmentação clássica) |
| **Gerenciador de Dispositivos** | Ver o hardware e **atualizar ou reverter drivers** |
| **Restauração do Sistema** (pontos de restauração) | Voltar **configurações do sistema e programas** a um momento anterior, **sem apagar** os documentos pessoais |
| **Histórico de Arquivos** | **Backup** de versões dos arquivos pessoais |
| **Redefinir este PC** | Reinstalar o Windows, com opção de **manter** ou **remover** os arquivos pessoais |
| **BitLocker** | **Criptografar** a unidade inteira (edições Pro e superiores) |

> **Ex. 2** *(criado pelo tutor)* — Depois de instalar um driver, o computador começou a travar. A saída mais simples é usar a **Restauração do Sistema** para um ponto anterior à instalação: os documentos não são apagados.

### 🔴 Avançado — acertar a prova

- **Restauração do Sistema não é backup** dos seus arquivos: ela restaura o **sistema**. Para os documentos, **Histórico de Arquivos** ou outra cópia de segurança.
- **PrtScn** sozinha **não salva arquivo**: copia para a área de transferência. Quem **salva arquivo** automaticamente é **Windows + PrtScn**.
- **Windows + D** mostra a área de trabalho; **Windows + vírgula** só **espia** enquanto as teclas estão pressionadas; **Windows + Home** minimiza **todas menos a ativa**.

**Para levar para a prova:** **Win+Tab** Visão de Tarefas; **Win+Ctrl+D** nova área de trabalho; **Win+Z** Snap; **Win+PrtScn** salva print em Imagens; **Win+Shift+S** recorte; **Win+Pause** Sobre; conta **padrão** precisa do administrador (UAC) para instalar; **Restauração do Sistema** volta o sistema sem apagar documentos.

---

## 2. Configurações e Painel de Controle em detalhe

### 🟢 Iniciante — entender

Lembre de 21/12: **Configurações** (Windows + I) é o centro de ajustes; o **Painel de Controle** continua existindo (Windows + R > **control**).

### 🟡 Intermediário — aplicar

**2.1 Páginas do aplicativo Configurações (Windows + I):**

| Página | O que ajusta (exemplos) |
|---|---|
| **Sistema** | Tela, som, notificações, energia e bateria, **armazenamento**, área de transferência, **Sobre** (nome do PC, edição do Windows) |
| **Bluetooth e dispositivos** | Mouse, teclado, impressoras, câmeras, **Bluetooth** |
| **Rede e Internet** | Wi-Fi, Ethernet, VPN, modo avião, proxy |
| **Personalização** | **Plano de fundo**, temas, tela de bloqueio, **Iniciar**, **Barra de Tarefas** |
| **Aplicativos** | **Aplicativos instalados** (desinstalar), aplicativos **padrão**, **inicialização** |
| **Contas** | Suas informações, **opções de entrada** (senha, PIN, Windows Hello), família, outros usuários |
| **Hora e idioma** | Data e hora, idioma, região, digitação |
| **Acessibilidade** | Lupa, Narrador, contraste, legendas, teclado |
| **Privacidade e segurança** | **Segurança do Windows**, permissões de câmera, microfone e localização |
| **Windows Update** | Atualizações, **histórico**, **pausar** atualizações |

**2.2 Categorias do Painel de Controle** *(consenso dos manuais)*: **Sistema e Segurança** (firewall, backup, ferramentas); **Rede e Internet**; **Hardware e Sons** (dispositivos e impressoras); **Programas** (**Programas e Recursos**: desinstalar); **Contas de Usuário**; **Aparência e Personalização**; **Relógio e Região**; **Facilidade de Acesso**.

> **Ex. 3** *(criado pelo tutor)* — O cabo quer que o PDF abra sempre no navegador, e não no leitor instalado. Caminho: **Configurações > Aplicativos > Aplicativos padrão**.

### 🔴 Avançado — acertar a prova

- **Programas que iniciam com o Windows:** Configurações > Aplicativos > **Inicialização** ou **Gerenciador de Tarefas > Aplicativos de inicialização**.
- **Descobrir a edição do Windows e o nome do PC:** Configurações > Sistema > **Sobre** (ou **Windows + Pause**).
- **Windows Update** é página própria nas Configurações (não fica dentro de "Privacidade").

---

## 3. Prompt de Comando: além do básico

### 🟢 Iniciante — entender

Além de mexer com pastas e arquivos (21/12), o Prompt testa a **rede**, mostra os **processos** e dá informações do **sistema**.

### 🟡 Intermediário — aplicar

| Comando | Função |
|---|---|
| **ipconfig** | Mostra a configuração de rede (IP, máscara, gateway); **ipconfig /all** mostra mais detalhes, como o endereço físico (MAC) e os servidores DNS *(consenso dos manuais)* |
| **ping** endereço | **Testa a conexão** com outro computador ou servidor |
| **tracert** endereço | Mostra o **caminho** (os roteadores) até o destino |
| **nslookup** nome | **Consulta o DNS** (descobre o IP de um nome) |
| **tasklist** / **taskkill** | **Lista** / **encerra** processos (o equivalente do Gerenciador de Tarefas) |
| **systeminfo** | Informações do sistema (versão, memória, data de instalação) *(consenso dos manuais)* |
| **shutdown /s** · **shutdown /r** | **Desligar** · **reiniciar** o computador *(consenso dos manuais)* |
| **chkdsk** | Verificar o **disco** em busca de erros *(consenso dos manuais)* |
| **sfc /scannow** | Verificar e reparar **arquivos do sistema** *(consenso dos manuais)* |
| **tree** | Mostrar a estrutura de pastas em árvore *(consenso dos manuais)* |
| **type** arquivo | Exibir o conteúdo de um arquivo de texto *(consenso dos manuais)* |
| **comando /?** · **help** | **Ajuda** sobre um comando *(consenso dos manuais)* |
| **cls** · **exit** | Limpar a tela · fechar o Prompt |

**Curingas** *(consenso dos manuais)*: **\*** substitui **qualquer sequência** de caracteres; **?** substitui **um** caractere. "del \*.tmp" apaga todos os arquivos com extensão .tmp da pasta atual.

> **Ex. 4** *(criado pelo tutor, resolvido)* — A internet do posto caiu. Em ordem:
> 1. **ipconfig**: o computador recebeu um endereço IP?
> 2. **ping** no gateway (o roteador): a rede local responde?
> 3. **ping** num site e **nslookup** no nome: o problema é a internet ou só o DNS?

### 🔴 Avançado — acertar a prova

- **ping testa**; **ipconfig mostra** a configuração; **tracert** mostra o **caminho**; **nslookup** consulta **nomes**.
- **tasklist lista**; **taskkill encerra**.
- **Atalhos do Prompt** (lista oficial): **Ctrl + C** copia o texto selecionado; **Ctrl + V** cola; **Ctrl + M** entra no modo de Marca (seleção); **setas para cima/baixo** percorrem os comandos já digitados *(consenso dos manuais)*.

**Para levar para a prova:** **ipconfig** configuração; **ping** testa conexão; **tracert** caminho; **nslookup** DNS; **tasklist/taskkill** processos; **shutdown /s** desliga; **chkdsk** disco; **/?** ajuda; **\*** e **?** curingas.

---

## 4. Integração entre os programas (Office 2019 × LibreOffice 7)

### 🟢 Iniciante — entender

Os dois pacotes **conversam**: abrem os arquivos um do outro, **exportam para PDF** e permitem levar uma tabela ou gráfico de um programa para outro.

### 🟡 Intermediário — aplicar

**4.1 Formatos (da base):**

| Função | Microsoft | LibreOffice | Modelo |
|---|---|---|---|
| Texto | Word **.docx** | Writer **.odt** | .dotx / .ott |
| Planilha | Excel **.xlsx** | Calc **.ods** | .xltx / .ots |
| Apresentação | PowerPoint **.pptx** | Impress **.odp** | .potx / .otp |

"Todos abrem e salvam nos formatos uns dos outros" (base): o Writer abre e salva **.docx**; o Word abre e salva **.odt**. Ao salvar em formato de outro programa, pode haver **perda de formatação**, e o LibreOffice **avisa** e pergunta se você quer manter o formato.

**4.2 PDF:**

| Programa | Caminho |
|---|---|
| Word, Excel, PowerPoint 2019 | **Arquivo > Exportar > Criar PDF/XPS** (ou **Salvar como** > tipo PDF) |
| Writer, Calc, Impress 7 | **Arquivo > Exportar como > Exportar como PDF** (há também o ícone de exportação direta na barra) |
| Qualquer programa no Windows | **Imprimir** escolhendo a impressora **Microsoft Print to PDF** *(consenso dos manuais)* |

**4.3 Levar dados de um programa para outro** *(consenso dos manuais)*:

| Recurso | O que acontece |
|---|---|
| **Colar** comum (Ctrl + V) | Cola uma **cópia**; mudar a planilha depois **não** muda o documento |
| **Colar especial > Colar vínculo** (Word) / **Colar especial** com vínculo (Writer) | Cria uma **ligação**: quando a planilha de origem muda, o documento é **atualizado** |
| **Inserir > Objeto** (incorporar) | Coloca o arquivo inteiro dentro do documento; dá para **editar** com duplo clique, mas sem ligação com o original |
| Gráfico do Excel no PowerPoint (ou do Calc no Impress) | Copiar e colar; pode manter o vínculo com a planilha |
| **Mala direta** | Word (**Correspondências**) ou Writer usam uma **lista** (planilha do Excel ou do Calc) para gerar várias cartas, etiquetas ou e-mails personalizados |

> **Ex. 5** *(criado pelo tutor)* — A seção de pessoal mantém no Excel a escala de serviço e quer que o relatório no Word mostre sempre a versão atual da tabela. A solução é **Colar especial > Colar vínculo**: ao abrir o relatório, a tabela é **atualizada** a partir da planilha.

### 🔴 Avançado — acertar a prova

- **Exportar como PDF** no LibreOffice fica no menu **Arquivo**; no Office 2019, em **Arquivo > Exportar** (ou Salvar como).
- **Colar vínculo** = atualiza; **incorporar** = cópia editável, sem ligação; **colar** = cópia simples.
- **Mala direta** junta **um documento principal** com **uma fonte de dados** (lista).

---

## 5. Quadros para não confundir

### 5.1 Capturas de tela

| Quer… | Use |
|---|---|
| Escolher uma região e colar em outro lugar | **Win + Shift + S** (ou PrtScn) |
| Só a janela ativa | **Alt + PrtScn** |
| A tela inteira já salva como arquivo | **Win + PrtScn** |
| Gravar vídeo da tela | **Win + Shift + R** |

### 5.2 Rede no Prompt

| Pergunta | Comando |
|---|---|
| Qual é o meu IP? | **ipconfig** |
| O servidor responde? | **ping** |
| Por onde passa a conexão? | **tracert** |
| Qual IP tem este nome? | **nslookup** |

---

## 6. Pegadinhas da banca

| A banca escreve… | O certo é… | Onde |
|---|---|---|
| PrtScn salva automaticamente um arquivo de imagem | Copia para a **área de transferência**; **Win + PrtScn** salva o arquivo | Seção 1 |
| Restauração do Sistema recupera documentos apagados | Restaura o **sistema**; documentos pedem **backup** | Seção 1 |
| Usuário padrão instala qualquer programa sem senha | O **UAC** pede a senha de administrador | Seção 1 |
| O Windows 11 não tem áreas de trabalho virtuais | **Tem** (Visão de Tarefas, Win + Ctrl + D) | Seção 1 |
| ipconfig testa a conexão com um site | Testa com **ping**; ipconfig **mostra** a configuração | Seção 3 |
| taskkill lista os processos | **tasklist** lista; **taskkill** encerra | Seção 3 |
| O Writer não abre arquivos do Word | **Abre e salva** .docx | Seção 4 |
| Colar comum mantém a tabela atualizada | Só o **colar vínculo** atualiza | Seção 4 |
| O LibreOffice precisa de programa externo para gerar PDF | **Exportar como PDF** é nativo | Seção 4 |

---

## 7. Revisão espaçada (faça primeiro, em 10 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2027-01-13_Informatica_Questoes.md).*

1. **INF 5 e 6 (21/12).** Qual comando cria uma pasta e qual remove uma pasta no Prompt?
2. **INF 7 (28/12).** O que acontece com =B2*$C$1 quando copiada uma linha abaixo?
3. **INF 7 (30/12).** Qual tecla inicia a apresentação do slide atual?
4. **DH 13 (12/01).** Qual é o prazo do inquérito por tráfico com o indiciado preso?
5. **LP 13 (06/01).** "Faz" ou "Fazem" dez anos que entrei na corporação?
