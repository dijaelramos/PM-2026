# Questões do dia — quinta-feira, 26/11/2026 — Informática

> **Material de estudo:** [2026-11-26_Informatica.md](2026-11-26_Informatica.md). Estude o material antes: este arquivo traz só o que é para responder.
> **Como responder:** resolva as **questões** e anote suas letras; o **estudo dirigido** fica para o fim de semana, por escrito e sem consultar. Mande as respostas ao Orquestrador para a correção. O **gabarito comentado** está no fim deste arquivo: só confira depois de responder.
> **Reserva do Simulado 1:** a questão de backup da prova de Soldado PMPE 2023 (Q34) **não foi usada**. As questões 1 a 6 são **oficiais** (Instituto AOCP). As questões 7 a 10 são **autorais de treino, não oficiais**, porque nenhuma questão oficial do banco cobra os tipos de backup.

## 11. Estudo dirigido (fim de semana, sem consultar)

1. Quantos bits tem um byte? Escreva a sequência das unidades até o petabyte e quanto vale cada degrau.
2. Diferencie memória volátil de não volátil, com um exemplo de cada.
3. Compare HD e SSD em tecnologia, partes móveis, velocidade, resistência e preço.
4. O que são SATA, SCSI e SAS?
5. Cite três serviços de armazenamento em nuvem e diga para que servem FTP, HTTP, BitTorrent, VoIP e RFID.
6. Cite cinco extensões de compactação e diga o que são .docx, .exe e .bat.
7. Quais são os cuidados com o backup recomendados pela Cartilha do CERT.br? Cite cinco.
8. Explique a regra 3-2-1 com um exemplo de uma unidade policial.
9. Defina backup completo, incremental, diferencial, de cópia e diário, dizendo quais marcam os arquivos.
10. Completo no domingo e incrementais de segunda a sexta; o disco queima na sexta à noite, depois do backup. O que restaurar? E se fossem diferenciais?
11. Compare incremental e diferencial quanto ao tamanho, ao tempo de fazer e ao tempo de restaurar.
12. Como se restaura um arquivo da Lixeira do Windows? O que fazem "Esvaziar Lixeira" e Shift + Delete?
13. Para que servem o Histórico de Arquivos e a Restauração do Sistema? Qual dos dois recupera documentos?

---

## Mapa das questões

| Questão | Conteúdo exigido | Onde foi ensinado (material de estudo) |
|---|---|---|
| 1 | Unidades: gigabyte × petabyte; **formato certo ou errado** | Seção 1 |
| 2 | Dispositivo sem partes móveis; interfaces SATA, SCSI, SAS | Seção 2 |
| 3 | Extensões de compactação × documentos e executáveis | Seção 4 |
| 4 | Serviços e protocolos de armazenamento e transferência × VoIP e RFID | Seção 3 |
| 5 | Boas práticas de backup; **comando INCORRETA** | Seção 5 |
| 6 | Restaurar arquivos da Lixeira; Restauração do Sistema | Seção 7 |
| 7 | Restauração com backup incremental | Seção 6 |
| 8 | Características do backup diferencial | Seção 6 |
| 9 | Regra 3-2-1 e redundância contra ransomware | Seção 5 |
| 10 | Lixeira, Histórico de Arquivos, Restauração do Sistema, Shift + Delete | Seção 7 |

---

## 12. Questões (resolva antes de ver a seção 13)

As questões 1 a 6 são do Instituto AOCP, transcritas sem alteração do [Banco de Provas](../Banco_de_Provas/README.md). São quatro de nível médio (TRT-1, ITEP-RN e PMES) e duas de nível superior (PC-PA e PP-DF). A PMES 2018 cita o Windows 7; o edital de 2026 cobra o Windows 11, mas a Lixeira funciona da mesma forma.

### Questão 1 — Polícia Penal do DF 2022 (AOCP), item 32 — certo ou errado

*Nível superior · gabarito oficial pós-recursos · [prova](../Banco_de_Provas/AOCP/Outras_Areas/PP-DF_2022_Policial_Penal/prova.md), p. 5*

Um disco com capacidade de 100 gigabytes é menor que um disco de 1 petabyte.

( ) Certo ( ) Errado

### Questão 2 — PC-PA 2021, Investigador (AOCP), Q12

*Nível superior · gabarito oficial pós-recursos · [prova](../Banco_de_Provas/AOCP/Outras_Areas/PC-PA_2021_Investigador/prova.md), p. 5*

O dispositivo de armazenamento de dados que não possuiu partes móveis em sua estrutura, fazendo com que não sofra falhas mecânicas, pois nada se movimenta dentro da sua estrutura, denomina-se

- **(A)** HDDs.
- **(B)** SSDs.
- **(C)** SATA.
- **(D)** SCSI.
- **(E)** SASs.

### Questão 3 — TRT-1 2018, Técnico Judiciário — Segurança (AOCP), Q26

*Nível médio · gabarito oficial pós-recursos · [prova](../Banco_de_Provas/AOCP/Outras_Areas/TRT-1_2018_Tecnico_Judiciario_Seguranca/prova.md), p. 11*

Arquivos compactados ocupam um espaço menor de armazenamento. Além disso, a transferência de um arquivo compactado, entre dois computadores, leva um tempo menor do que a do arquivo original. Assinale a alternativa em que todas as extensões de arquivo apresentadas são utilizadas na compactação de arquivos.

- **(A)** .arj e .bit
- **(B)** .tar e .odf
- **(C)** .rar e .zip
- **(D)** .docx e .tar.gz
- **(E)** .exe e .bat

### Questão 4 — TRT-1 2018, Técnico Judiciário — Segurança (AOCP), Q29

*Nível médio · gabarito oficial pós-recursos · [prova](../Banco_de_Provas/AOCP/Outras_Areas/TRT-1_2018_Tecnico_Judiciario_Seguranca/prova.md), p. 11*

Na Internet, há várias formas de armazenar ou transmitir arquivos entre usuários e computadores. Entretanto, nem todos os protocolos ou programas utilizados têm essa finalidade. Assinale a alternativa em que nenhum protocolo ou programa tenha como função a transferência ou armazenamento de arquivos.

- **(A)** FTP e Google Drive.
- **(B)** BitTorrent e FTP.
- **(C)** HTTP e DropBox.
- **(D)** Microsoft OneDrive e VoIP.
- **(E)** VoIP e RFID.

### Questão 5 — ITEP-RN 2018, Agente de Necropsia (AOCP), Q35

*Nível médio · gabarito oficial pós-recursos · [prova](../Banco_de_Provas/AOCP/Outras_Areas/ITEP-RN_2018_Agente_de_Necropsia/prova.md), p. 11*

Com relação aos Backups, também conhecidos como cópias de segurança, assinale a alternativa INCORRETA.

- **(A)** Para garantir que os dados, além de seguros, estejam consistentes, após a criação do backup, pode-se verificar se os dados gravados não estão corrompidos.
- **(B)** Pen-Drive é um exemplo de dispositivo comumente utilizado para guardar backups.
- **(C)** Quando se realiza backup de informações sigilosas, é recomendado que ele seja gravado de forma criptografada.
- **(D)** Gravar os dados do backup em formato compactado é uma maneira de economizar espaço nos dispositivos de armazenamento.
- **(E)** Para garantir que os dados não serão corrompidos, é recomendado armazenar os backups sempre no mesmo local do dispositivo de armazenamento.

### Questão 6 — PMES 2018, Soldado Combatente (AOCP), Q44

*Nível médio · gabarito oficial pós-recursos · [prova](../Banco_de_Provas/AOCP/PMES_2018_Soldado/prova.md), p. 14*

Considerando o Sistema Operacional Microsoft Windows 7 (instalação padrão em português), assinale a alternativa que apresenta a forma de recuperar arquivos específicos excluídos para Lixeira.

- **(A)** Clicar no ícone da lixeira com o botão Direito do Mouse e selecionar a opção restaurar arquivos.
- **(B)** Abrir a pasta Lixeira, selecionar os arquivos desejados, clicar no comando “Restaurar este item”, da barra de comandos.
- **(C)** Clicar no ícone da lixeira com o botão Direito do Mouse e selecionar a opção “Esvaziar Lixeira”.
- **(D)** Não é possível restaurar arquivos excluídos para lixeira.
- **(E)** Utilizar a ferramenta disponível em "Propriedades do Sistema", chamada "Restauração do Sistema".

### Questão 7 — Questão autoral de treino, no estilo AOCP — não oficial · INF 4

Um batalhão faz backup completo de seu servidor todo domingo e backup incremental de segunda a sábado, sempre às 22h. Na quinta-feira, às 15h, o disco do servidor falhou. Para recuperar os dados até o último backup disponível, devem ser restaurados

- **(A)** apenas o backup completo de domingo.
- **(B)** apenas o backup incremental de quarta-feira.
- **(C)** o backup completo de domingo e o incremental de quarta-feira.
- **(D)** o backup completo de domingo e os incrementais de segunda, terça e quarta-feira, nessa ordem.
- **(E)** os incrementais de segunda, terça e quarta-feira, sem necessidade do completo.

### Questão 8 — Questão autoral de treino, no estilo AOCP — não oficial · INF 4

Sobre o backup diferencial, assinale a alternativa correta.

- **(A)** Copia apenas os arquivos alterados desde o último backup de qualquer tipo e marca esses arquivos como copiados.
- **(B)** Copia todos os arquivos selecionados e marca todos como copiados.
- **(C)** Copia os arquivos alterados desde o último backup completo e não os marca como copiados, por isso tende a crescer a cada dia até o próximo completo.
- **(D)** Exige, para a restauração, o backup completo e todos os diferenciais realizados depois dele, em ordem.
- **(E)** Dispensa a existência de um backup completo anterior.

### Questão 9 — Questão autoral de treino, no estilo AOCP — não oficial · INF 4

Um órgão público quer reduzir o risco de perder seus dados por incêndio, furto ou ataque de ransomware. A medida mais adequada, segundo as boas práticas de backup, é

- **(A)** manter uma única cópia de segurança no mesmo disco dos arquivos originais.
- **(B)** manter várias cópias, em pelo menos dois tipos de mídia, com uma delas guardada fora do local e protegida contra alterações pela rede.
- **(C)** substituir o backup pela compactação dos arquivos em .zip.
- **(D)** guardar as cópias apenas na memória RAM dos servidores, por ser mais rápida.
- **(E)** fazer um único backup completo na instalação dos sistemas e nunca mais atualizá-lo.

### Questão 10 — Questão autoral de treino, no estilo AOCP — não oficial · INF 4

No Windows, um usuário apagou por engano um documento da área de trabalho, usando a tecla Delete. Sobre a recuperação desse arquivo, assinale a alternativa correta.

- **(A)** O documento pode ser recuperado abrindo a Lixeira, selecionando-o e usando a opção de restaurar.
- **(B)** O documento foi apagado definitivamente, porque a tecla Delete não envia arquivos para a Lixeira.
- **(C)** A única forma de recuperar o documento é a Restauração do Sistema, que devolve os arquivos pessoais excluídos.
- **(D)** Se o usuário tivesse usado Shift + Delete, o documento também iria para a Lixeira.
- **(E)** A opção "Esvaziar Lixeira" devolve os arquivos à pasta de origem.

---

## 13. Gabarito e comentários

*Questões 1 a 6: gabaritos oficiais (pós-recursos), como indicado em cada questão. Questões 7 a 10: **autorais, não oficiais**. Os comentários são **análise do tutor**.*

### Placar de referência

| Questão | Gabarito | Tema |
|---|---|---|
| 1 — PP-DF 2022 item 32 | **CERTO** | Unidades |
| 2 — PC-PA 2021 Inv. Q12 | **B** | SSD |
| 3 — TRT-1 2018 Q26 | **C** | Compactação |
| 4 — TRT-1 2018 Q29 | **E** | Protocolos e serviços |
| 5 — ITEP-RN 2018 Q35 | **E** (a INCORRETA) | Boas práticas de backup |
| 6 — PMES 2018 Q44 | **B** | Lixeira |
| 7 — autoral | **D** | Restauração incremental |
| 8 — autoral | **C** | Diferencial |
| 9 — autoral | **B** | Regra 3-2-1 |
| 10 — autoral | **A** | Restauração no Windows |

### Questão 1 — gabarito CERTO

**Por que está certo:** 1 petabyte = 1.024 terabytes = cerca de 1 milhão de gigabytes. 100 GB é muito menos.

**O detalhe que mais derruba:** não saber a ordem K → M → G → T → **P**.

### Questão 2 — gabarito B

**Por que a (B) está correta:** o **SSD** usa memória flash e não tem partes móveis.

**Por que as outras estão erradas:**
- **(A)** O **HDD** (HD) tem discos que giram e cabeça de leitura: **partes móveis**.
- **(C), (D) e (E)** **SATA**, **SCSI** e **SAS** são **interfaces** (padrões de conexão), não dispositivos.

### Questão 3 — gabarito C

**Por que a (C) está correta:** **.rar** e **.zip** são formatos de compactação.

**Por que as outras estão erradas:**
- **(A)** .arj é de compactação, mas **.bit** não é.
- **(B)** .tar agrupa arquivos, mas **.odf** é formato do LibreOffice (fórmulas), não de compactação.
- **(D)** .tar.gz é de compactação, mas **.docx** é documento do Word.
- **(E)** .exe e .bat são **executáveis**.

**O detalhe que mais derruba:** um item certo no par não salva a alternativa; os **dois** têm de ser de compactação.

### Questão 4 — gabarito E

**Por que a (E) está correta:** **VoIP** transmite voz e **RFID** identifica objetos por radiofrequência. Nenhum dos dois armazena ou transfere arquivos.

**Por que as outras estão erradas:**
- **(A)** FTP transfere; Google Drive armazena.
- **(B)** BitTorrent e FTP transferem.
- **(C)** HTTP transfere (downloads); Dropbox armazena.
- **(D)** VoIP não, mas o **OneDrive** armazena. Basta um servir para eliminar.

### Questão 5 — gabarito E

**Por que a (E) é a INCORRETA:** guardar o backup no **mesmo local** do original contraria a recomendação de **redundância em locais diferentes**: um defeito, um incêndio ou um furto levaria os dois.

**Por que as outras estão corretas:** (A) verificar a integridade; (B) pen drive como mídia de backup; (C) criptografar dados sigilosos; (D) compactar para economizar espaço. Todas são boas práticas.

**O detalhe que mais derruba:** o comando pede a **INCORRETA**. A (E) começa com "para garantir", o que soa como recomendação.

### Questão 6 — gabarito B

**Por que a (B) está correta:** para restaurar itens específicos, abre-se a Lixeira, selecionam-se os arquivos e usa-se "Restaurar este item".

**Por que as outras estão erradas:**
- **(A)** O menu do botão direito no **ícone** da Lixeira não tem a opção de restaurar arquivos específicos.
- **(C)** "Esvaziar Lixeira" **apaga** de vez.
- **(D)** A Lixeira existe justamente para permitir restaurar.
- **(E)** A Restauração do Sistema volta **configurações do sistema**; não é o caminho para recuperar arquivos excluídos.

### Questão 7 — gabarito D

**Por que a (D) está correta:**
1. O último backup antes da falha (quinta às 15h) foi o de **quarta às 22h**.
2. No incremental, cada backup tem só o do dia.
3. Restaura-se o **completo de domingo** e depois os incrementais de **segunda, terça e quarta**, em ordem.

**Por que as outras estão erradas:**
- **(A)** Perderia tudo o que mudou de segunda a quarta.
- **(B) e (E)** Sem o completo não há base; e o incremental de quarta só tem as mudanças de quarta.
- **(C)** Completo + último é a receita do **diferencial**.

### Questão 8 — gabarito C

**Por que a (C) está correta:** o diferencial copia o que mudou desde o último **completo** e **não marca** os arquivos; por isso cresce a cada dia.

**Por que as outras estão erradas:**
- **(A)** Descreve o **incremental**.
- **(B)** Descreve o **completo**.
- **(D)** Para restaurar o diferencial, basta o completo e o **último** diferencial.
- **(E)** O diferencial é calculado **a partir** de um completo.

### Questão 9 — gabarito B

**Por que a (B) está correta:** é a regra **3-2-1**: várias cópias, em dois tipos de mídia, uma fora do local. Protegida da rede, a cópia resiste ao ransomware.

**Por que as outras estão erradas:**
- **(A)** Mesmo disco = perde tudo junto.
- **(C)** Compactar economiza espaço, mas não é backup.
- **(D)** A RAM é **volátil**.
- **(E)** Backup tem de ser **atualizado**.

### Questão 10 — gabarito A

**Por que a (A) está correta:** a tecla Delete envia o arquivo do disco local para a **Lixeira**, de onde ele pode ser restaurado.

**Por que as outras estão erradas:**
- **(B)** Delete envia para a Lixeira; quem apaga direto é o **Shift + Delete**.
- **(C)** A Restauração do Sistema não é feita para recuperar documentos pessoais.
- **(D)** Shift + Delete **pula** a Lixeira.
- **(E)** "Esvaziar Lixeira" **apaga** de vez.

### Estudo dirigido — respostas *(resposta-modelo do tutor, não oficial)*

1. **8 bits** = 1 byte. Byte → **KB** → **MB** → **GB** → **TB** → **PB** ("Kilo, Mega, Giga, Tera, Peta"). Cada degrau vale **1.024** vezes o anterior (na prática, "por mil").
2. **Volátil** perde os dados quando a energia acaba: a **RAM**. **Não volátil** guarda os dados desligada: **HD, SSD, pen drive** (e a ROM).
3. **Tecnologia**: HD é **magnético**; SSD usa **memória flash**. **Partes móveis**: o HD **tem** (discos que giram e cabeça de leitura); o SSD **não tem**. **Velocidade**: o SSD é **mais rápido**. **Resistência**: o SSD resiste mais a impacto; o HD sofre com quedas. **Preço**: o HD é **mais barato por GB**.
4. São **interfaces** (padrões de ligação do disco ao computador), **não tipos de disco**. Um HD costuma usar SATA; um SSD pode usar SATA ou NVMe.
5. **Google Drive, OneDrive, Dropbox** (ou iCloud): **armazenamento em nuvem**. **FTP**: **transferência de arquivos**. **HTTP/HTTPS**: protocolo da web, que também transfere arquivos (downloads e uploads). **BitTorrent**: compartilhamento de arquivos **P2P**. **VoIP**: **voz** pela internet. **RFID**: **identificação por radiofrequência** (crachás, etiquetas, pedágio). VoIP e RFID não guardam nem transferem arquivos.
6. Quaisquer cinco: **.zip, .rar, .7z, .tar, .gz** (ou .tar.gz), **.arj**. **.docx** é **documento de texto** (Word). **.exe** e **.bat** são **executáveis** (programa e arquivo de lote do Windows); como anexo, são risco de malware.
7. Quaisquer cinco: manter os backups **atualizados** e, se possível, **automatizados**; **verificar** se o backup foi feito e **testar a recuperação**; guardar em **locais seguros** (sem poeira, calor e umidade), com **acesso restrito**; gravar **dados sensíveis criptografados**; manter **backups redundantes** em **locais diferentes**; fazer backup **antes de grandes alterações** e de mandar o computador para a manutenção.
8. **3** cópias dos dados, em **2** tipos de mídia, sendo **1 fora do local**. Exemplo: os boletins da companhia ficam no computador da seção (cópia 1), num HD externo guardado no armário (cópia 2, outra mídia) e na nuvem institucional ou noutro prédio (cópia 3, fora do local). Um incêndio na sala não leva tudo.
9. **Completo**: copia **tudo** o que foi selecionado; **marca**. **Incremental**: só o que mudou desde o **último backup de qualquer tipo**; **marca**. **Diferencial**: só o que mudou desde o **último completo**; **não marca**. **Cópia**: tudo o que foi selecionado, sem afetar a rotina; **não marca**. **Diário**: os arquivos modificados **naquele dia**; **não marca**. Marcam: **completo e incremental**.
10. Com incrementais: o **completo de domingo** e **todos os incrementais**, de **segunda a sexta**, em ordem. Com diferenciais: o **completo de domingo** e **só o diferencial de sexta**.
11. **Tamanho**: o incremental é **pequeno** (só o do dia); o diferencial **cresce** a cada dia. **Tempo de fazer**: o incremental é **rápido**; o diferencial fica **mais lento** ao longo da semana. **Tempo de restaurar**: o incremental é **mais lento** (completo + toda a cadeia); o diferencial é **mais rápido** (completo + o último).
12. **Abrir a Lixeira**, **selecionar** o arquivo e clicar em **Restaurar**. **Esvaziar Lixeira** apaga de vez o que está nela. **Shift + Delete** exclui **sem passar pela Lixeira**.
13. O **Histórico de Arquivos** faz backup automático de **versões dos arquivos pessoais** num disco externo ou de rede. A **Restauração do Sistema** volta **configurações e arquivos do sistema** a um ponto anterior. Quem recupera **documentos** é o **Histórico de Arquivos**.

### Revisão espaçada — respostas *(exercícios do tutor, não oficiais)*

1. **Vírus:** se anexa a arquivos e precisa ser executado para se espalhar. **Worm:** se propaga sozinho pela rede, explorando falhas. **Trojan (cavalo de Troia):** parece um programa útil, mas executa ações maliciosas. **Ransomware:** torna os dados inacessíveis (criptografa) e exige resgate.
2. Golpe que tenta obter dados pessoais ou financeiros fingindo ser uma instituição confiável. Sinais: **urgência ou ameaça**, **link ou endereço de remetente estranho**, pedido de senha ou código, erros de português.
3. Protege a **confidencialidade** (e pode garantir integridade e autenticidade). **Simétrica:** a mesma chave cifra e decifra. **Assimétrica:** par de chaves, pública e privada.
4. Exigir **duas formas** diferentes de comprovar a identidade, por exemplo a **senha** (algo que você sabe) e um **código no celular** (algo que você tem).
5. Contrapositiva: "Se os dados **não** estão íntegros, então o backup **não** foi testado." Negação: "O backup foi testado **e** os dados **não** estão íntegros."
6. **Nenhum SSD tem partes móveis** (todo + nenhum → nenhum).
7. **Olinda:** vila em 1537, cidade em 1676. **Recife:** vila em 1709/1710.
8. **tráfego** (movimento, fluxo). *Tráfico* é comércio ilegal.
