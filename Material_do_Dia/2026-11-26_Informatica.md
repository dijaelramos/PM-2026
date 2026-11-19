# Material do dia — quinta-feira, 26/11/2026 — Informática (3 h)

> **Sessão do plano:** Informática, **sessão 3/10**, item **4** do Anexo II: armazenamento de dados e backup; dispositivos, procedimentos e aplicativos; tipos de backup e restauração de dados ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** 30 min de revisão · 1 h 30 de tópicos e exemplos · 1 h de questões com correção.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova. Exemplos resolvidos com passos numerados.
> **Fontes:** [Informática (base)](../Base_de_Conhecimento/INFORMÁTICA/Informática.txt) e [Cartilha de Segurança do CERT.br, trechos](../Base_de_Conhecimento/INFORMÁTICA/Cartilha_CERTbr_2012_trechos.md) (cuidados com backup). O que vem marcado como *consenso dos manuais* é explicação do tutor.
> **Questões do dia:** em arquivo separado, [2026-11-26_Informatica_Questoes.md](2026-11-26_Informatica_Questoes.md), com o estudo dirigido, o mapa, 6 questões **oficiais** da AOCP e 4 **autorais** sobre tipos de backup (nenhuma questão oficial do banco cobre esse ponto), e o gabarito comentado no fim.
> **Reserva do Simulado 1:** a questão de backup da prova de Soldado PMPE 2023 (Q34) **não foi usada**.

## Roteiro

| Bloco | O que fazer |
|---|---|
| **30 min — revisão** | Revisão espaçada (seção 10): segurança da informação (13/11), lógica (19/11) e História de Pernambuco (esta semana). |
| **1 h 30 — tópicos e exemplos** | Seções 1 a 7, primeiro os níveis 🟢 e 🟡, depois os 🔴. Refaça à mão os exemplos de restauração (seção 6). Feche com os quadros (seção 8) e as pegadinhas (seção 9). |
| **1 h — questões com correção** | As 10 questões do [arquivo de questões](2026-11-26_Informatica_Questoes.md) (cerca de 4 min cada) e a correção pelo gabarito no fim dele. O estudo dirigido fica para o fim de semana, com o resumão. |

## Cobertura do edital

Texto do Anexo II: *"4. Procedimentos, aplicativos e dispositivos para armazenamento de dados e para realização de cópia de segurança (backup), incluindo dispositivos de armazenamento, tipos de backup e restauração de dados."*

| Item | Subtópico | Situação |
|---|---|---|
| 4 | Unidades de medida de armazenamento | **explicado hoje** (seção 1) |
| 4 | Dispositivos de armazenamento | **explicado hoje** (seção 2) |
| 4 | Aplicativos e serviços para armazenar e transferir arquivos (nuvem, FTP) | **explicado hoje** (seção 3) |
| 4 | Compactação de arquivos | **explicado hoje** (seção 4) |
| 4 | Procedimentos de backup (boas práticas) | **explicado hoje** (seção 5) |
| 4 | Tipos de backup | **explicado hoje** (seção 6) |
| 4 | Restauração de dados | **explicado hoje** (seções 6 e 7) |
| 5 | Arquivos, pastas e hardware | **09/12** (sessão 4/10) |
| 3 | Segurança da informação | **13/11**; revisão hoje (seção 10) |

---

## 1. Unidades de medida de armazenamento

### 🟢 Iniciante — entender

O computador guarda tudo em **bits** (0 ou 1). Oito bits formam um **byte**, que é mais ou menos o espaço de uma letra. As unidades maiores são "pacotes" de bytes.

> **Ex. 1** *(criado pelo tutor)* — A palavra "PMPE" tem 4 letras: ocupa cerca de 4 bytes. Uma foto de celular ocupa uns 3 MB, ou seja, uns 3 milhões de bytes.

### 🟡 Intermediário — aplicar

| Unidade | Vale | Para ter uma ideia *(criado pelo tutor)* |
|---|---|---|
| bit (b) | 0 ou 1 | a menor unidade |
| byte (B) | 8 bits | um caractere |
| KB (kilobyte) | 1.024 bytes | um texto curto |
| MB (megabyte) | 1.024 KB | uma foto, uma música |
| GB (gigabyte) | 1.024 MB | um filme; a memória de um celular |
| TB (terabyte) | 1.024 GB | um HD externo |
| PB (petabyte) | 1.024 TB | um grande centro de dados |

**Ordem para decorar:** K → M → G → T → P ("**K**ilo, **M**ega, **G**iga, **T**era, **P**eta"). Cada degrau multiplica por **1.024** (na prática, "por mil").

> **Ex. 2** *(criado pelo tutor, resolvido)* — Um pen drive de 64 GB ou um HD de 2 TB: qual guarda mais?
> 1. 2 TB = 2 × 1.024 GB = 2.048 GB.
> 2. 2.048 GB > 64 GB.
> 3. O **HD de 2 TB** guarda 32 vezes mais.

> **Ex. 3** *(criado pelo tutor, resolvido)* — Quantas fotos de 4 MB cabem em 1 GB?
> 1. 1 GB = 1.024 MB.
> 2. 1.024 ÷ 4 = **256 fotos**.

### 🔴 Avançado — acertar a prova

- **Byte (B) × bit (b):** a velocidade da internet é dada em **bits** por segundo (Mbps); o tamanho dos arquivos, em **bytes** (MB). 100 Mbps não são 100 MB por segundo (são cerca de 12,5 MB/s).
- Em comparações, **converta para a mesma unidade** antes de comparar.
- **Peta** vem depois de **tera**. Distrator comum: inverter a ordem ou pôr "peta" antes de "giga".

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "1 TB é menor que 500 GB." **Errado**: 1 TB = 1.024 GB.

> **Ex. 5** *(criado pelo tutor)* — Um vídeo de câmera corporal de 1 hora ocupa uns 4 GB. Um mês de gravações de 30 câmeras, 8 h por dia: 4 × 8 × 30 × 30 = 28.800 GB ≈ **28 TB**. Por isso órgãos públicos usam servidores e nuvem.

**Para levar para a prova:** **1 byte = 8 bits**. **KB → MB → GB → TB → PB**, cada um **1.024** vezes o anterior. Converta tudo para a mesma unidade antes de comparar.

---

## 2. Dispositivos de armazenamento

### 🟢 Iniciante — entender

Há dois tipos de memória: a **principal** (RAM), rápida mas que **apaga quando desliga**; e a de **armazenamento** (HD, SSD, pen drive, nuvem), que **guarda** os arquivos mesmo desligada.

> **Ex. 1** *(criado pelo tutor)* — Você digita um boletim de ocorrência e falta luz antes de salvar: o texto estava só na **RAM** e se perdeu. Se tivesse salvado, estaria no **SSD** do computador.

### 🟡 Intermediário — aplicar

| Dispositivo | Tecnologia | Características |
|---|---|---|
| **HD** (disco rígido, HDD) | **Magnético**, com discos que giram e cabeça de leitura | Tem **partes móveis**; mais barato por GB; mais lento; sofre com quedas |
| **SSD** | **Memória flash**, sem partes móveis | **Sem partes móveis**: mais rápido, silencioso, resistente a impacto; mais caro por GB |
| **Pen drive** e **cartão de memória** (SD, microSD) | Memória flash removível | Portáteis; bons para levar arquivos e para backup pequeno |
| **CD / DVD / Blu-ray** | **Óticos** (leitura a laser) | Cerca de 700 MB, 4,7 GB e 25 GB |
| **Fita magnética** | Magnética | Backup corporativo de grande volume, barato e durável |
| **Nuvem** | Armazenamento remoto pela internet | Acesso de qualquer lugar; depende de internet (seção 3) |

**Interfaces (padrões de conexão)** *(consenso dos manuais)*: **SATA**, **SCSI**, **SAS** e **NVMe** são **padrões de ligação** do disco ao computador, não tipos de disco. Um SSD pode usar SATA ou NVMe; um HD costuma usar SATA.

> **Ex. 2** *(criado pelo tutor)* — A viatura tem um computador de bordo que trepida o tempo todo. Qual disco é melhor? O **SSD**: sem partes móveis, não sofre falha mecânica com a vibração.

> **Ex. 3** *(criado pelo tutor)* — Classifique: pen drive (flash, removível); HD externo (magnético, partes móveis); DVD (ótico); OneDrive (nuvem).

### 🔴 Avançado — acertar a prova

- **"Sem partes móveis" = SSD** (e flash em geral). **"Partes móveis, magnético" = HD.**
- **SATA, SCSI e SAS não são dispositivos**: são interfaces. Aparecem como distratores ao lado de HD e SSD.
- **RAM é volátil** (perde os dados sem energia); **ROM**, HD, SSD e pen drive **não** são voláteis.
- **Memória flash** está no SSD, no pen drive e no cartão de memória.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "O HD é um dispositivo sem partes móveis, por isso é imune a falhas mecânicas." **Errado**: isso descreve o **SSD**.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "A RAM serve para guardar os backups da corporação." **Errado**: a RAM é **volátil**; backup vai para mídia de armazenamento (HD, SSD, fita, nuvem).

**Para levar para a prova:** **HD** = magnético, **partes móveis**, barato. **SSD** = flash, **sem partes móveis**, rápido e resistente. Pen drive e cartão = flash removível. CD/DVD/Blu-ray = **óticos**. **SATA, SCSI, SAS** = interfaces, não discos. **RAM** = volátil.

---

## 3. Armazenar e transferir arquivos na internet

### 🟢 Iniciante — entender

Além de guardar no próprio computador, dá para guardar **na internet** (a "nuvem") ou mandar o arquivo para outro computador. Cada serviço ou protocolo tem a sua função.

> **Ex. 1** *(criado pelo tutor)* — O soldado salva o relatório no **OneDrive** pelo computador do quartel e o abre no celular, em casa. O arquivo está na **nuvem**.

### 🟡 Intermediário — aplicar

| Nome | O que é | Armazena ou transfere arquivos? |
|---|---|---|
| **Google Drive, OneDrive, Dropbox, iCloud** | Serviços de **armazenamento em nuvem** | **Sim** (armazenam e sincronizam) |
| **FTP** (File Transfer Protocol) | Protocolo de **transferência de arquivos** | **Sim** |
| **HTTP / HTTPS** | Protocolo da web: transfere páginas e também **downloads** | **Sim** (downloads e uploads pelo navegador) |
| **BitTorrent** | Compartilhamento **P2P** (par a par) de arquivos | **Sim** |
| **VoIP** | **Voz** pela internet (ligações) | **Não** (transmite voz em tempo real) |
| **RFID** | **Identificação por radiofrequência** (etiquetas, crachás, pedágio automático) | **Não** |
| **SMTP / POP3 / IMAP** | Envio e recebimento de **e-mail** | Transportam mensagens (e anexos), mas não são serviços de armazenamento de arquivos |

> **Ex. 2** *(criado pelo tutor)* — A tag do pedágio na BR-232 que abre a cancela sozinha usa **RFID**. Não tem nada a ver com guardar arquivos.

> **Ex. 3** *(criado pelo tutor)* — A ligação pelo WhatsApp entre duas viaturas é **VoIP**: voz pela internet. O PDF enviado pelo mesmo aplicativo é transferência de arquivo, mas a **ligação** em si não é.

### 🔴 Avançado — acertar a prova

- **Nuvem é armazenamento**; **FTP é transferência**; **VoIP é voz**; **RFID é identificação**.
- **HTTP** também transfere arquivos (todo download pelo navegador usa HTTP ou HTTPS).
- Em questões do tipo "nenhum dos dois tem a função de…", basta **um** da dupla servir para eliminar a alternativa.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "O VoIP é o protocolo usado para enviar arquivos grandes entre servidores." **Errado**: isso é o **FTP**. VoIP é voz.

> **Ex. 5** *(criado pelo tutor, resolvido)* — Em qual par **os dois** servem para armazenar ou transferir arquivos: (a) Dropbox e RFID; (b) FTP e Google Drive; (c) VoIP e HTTP?
> 1. (a) RFID não serve → descarta.
> 2. (c) VoIP não serve → descarta.
> 3. Resposta: **(b)**.

**Para levar para a prova:** nuvem (**Drive, OneDrive, Dropbox**) armazena; **FTP**, **HTTP** e **BitTorrent** transferem; **VoIP** = voz; **RFID** = identificação por rádio. Nenhum dos dois últimos guarda ou transfere arquivos.

---

## 4. Compactação de arquivos

### 🟢 Iniciante — entender

Compactar é "espremer" o arquivo para ele **ocupar menos espaço** e **viajar mais rápido** pela rede. Depois, descompacta-se e o arquivo volta ao original.

> **Ex. 1** *(criado pelo tutor)* — Vinte fotos da ocorrência (60 MB) não passam no e-mail. Compactadas num **.zip**, ficam num arquivo só, menor e fácil de anexar.

### 🟡 Intermediário — aplicar

| Extensão | O que é |
|---|---|
| **.zip** | Compactação mais comum (Windows abre sem programa extra) |
| **.rar** | Compactação (WinRAR) |
| **.7z** | Compactação (7-Zip) |
| **.tar** | Agrupa vários arquivos num só (comum no Linux) |
| **.gz** e **.tar.gz** | Compactação (gzip); .tar.gz = agrupado e compactado |
| **.arj** | Formato de compactação antigo |
| .docx, .odt | Documentos de texto (Word, LibreOffice Writer) |
| .xlsx, .ods | Planilhas |
| .exe, .bat | Executáveis e arquivos de lote do Windows |
| .pdf | Documento portátil |

> **Ex. 2** *(criado pelo tutor)* — Qual dos pares é só de compactação: ".zip e .7z" ou ".zip e .docx"? O primeiro. **.docx** é documento do Word (ele até usa compactação por dentro, mas é classificado como formato de documento).

> **Ex. 3** *(criado pelo tutor)* — Por que gravar o backup compactado? Para **economizar espaço** na mídia e tempo na transferência.

### 🔴 Avançado — acertar a prova

- Em "todas as extensões são de compactação", basta **uma** extensão errada no par para eliminar a alternativa.
- **.exe** e **.bat** são **executáveis**; abrir um anexo assim é risco de malware (13/11).
- Compactar **não** é criptografar: o .zip comum pode ser aberto por qualquer um, a menos que se use senha.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — ".exe é a extensão de arquivos compactados do Windows." **Errado**: .exe é **executável**.

> **Ex. 5** *(criado pelo tutor)* — Um arquivo "relatorio.pdf.exe" chega por e-mail. Não é um PDF: é um **executável** disfarçado (golpe estudado em 13/11).

**Para levar para a prova:** compactação = **.zip, .rar, .7z, .tar, .gz, .tar.gz, .arj**. **.docx/.odt** = documento; **.exe/.bat** = executável. Compactar **reduz espaço e tempo de transferência**, mas não protege como a criptografia.

---

## 5. Backup: o que é e como fazer bem

### 🟢 Iniciante — entender

Backup é uma **cópia de segurança**: se o original se perder (defeito, furto, vírus, erro), você recupera a cópia. Sem backup, não há o que restaurar.

> **Ex. 1** *(criado pelo tutor)* — Um ransomware sequestra os arquivos da seção de pessoal do batalhão. Se houver backup **fora da rede**, os arquivos voltam sem pagar resgate.

### 🟡 Intermediário — aplicar

**Cuidados com o backup** (Cartilha do CERT.br, trechos na base):

| Cuidado | Por quê |
|---|---|
| Manter os backups **atualizados** e, se possível, **automatizados** | Backup velho não salva o trabalho recente |
| **Verificar** se o backup foi feito e **testar a recuperação** | Garante que os dados estão íntegros, não corrompidos |
| Guardar em **locais seguros**, longe de poeira, calor e umidade, com **acesso restrito** | Protege a mídia |
| Gravar **dados sensíveis criptografados** | Se a mídia for perdida ou furtada, ninguém lê |
| Manter **backups redundantes** (várias cópias em **locais diferentes**: casa, escritório, nuvem) | Um incêndio, uma inundação ou um furto não leva tudo |
| Fazer backup **antes** de grandes alterações e de mandar o computador para manutenção | Evita perda em caso de problema |

**Regra 3-2-1** (base): **3** cópias dos dados, em **2** tipos de mídia, sendo **1** fora do local.

**Compactar o backup** economiza espaço (seção 4).

> **Ex. 2** *(criado pelo tutor)* — Aplicando a regra 3-2-1 aos arquivos de uma companhia: (1) os originais no servidor; (2) uma cópia num HD externo guardado no cofre; (3) uma cópia na nuvem institucional. São 3 cópias, 2 tipos de mídia (HD e nuvem), 1 fora do prédio.

> **Ex. 3** *(criado pelo tutor)* — O sargento faz backup toda sexta, mas nunca testou. Quando precisa, descobre que o arquivo está corrompido. Faltou **verificar e testar a restauração**.

### 🔴 Avançado — acertar a prova

- **Mesmo local = mau backup.** Guardar o backup **no mesmo disco** ou no mesmo lugar do original não protege contra incêndio, furto ou defeito do disco. A banca escreve isso como se fosse recomendação.
- **Backup ligado à rede o tempo todo** pode ser cifrado pelo ransomware junto com o original; o ideal é ter uma cópia **desconectada** ou versionada (*consenso dos manuais*).
- **Criptografia** é recomendada para dados sigilosos; **compactação** é recomendada para economizar espaço. Ambas são boas práticas.
- **Pen drive** é dispositivo comum de backup, apesar de pequeno.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "Para garantir o backup, guarde a cópia sempre no mesmo HD do arquivo original." **Errado**: se o HD queimar, perdem-se os dois.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Depois de feito, o backup não precisa ser conferido." **Errado**: a Cartilha manda **verificar** e **testar a recuperação**.

**Para levar para a prova:** backup bom é **atualizado**, **verificado/testado**, **redundante** e em **locais diferentes** (3-2-1), **criptografado** quando sensível e pode ser **compactado**. Backup no **mesmo local** do original é erro.

---

## 6. Tipos de backup e restauração

### 🟢 Iniciante — entender

Copiar **tudo** todo dia demora e ocupa espaço. Por isso há tipos de backup que copiam **só o que mudou**. A diferença entre eles está em "**mudou desde quando?**".

> **Ex. 1** *(criado pelo tutor)* — Pense num caderno de ocorrências: no domingo você fotografa o caderno inteiro (completo). Nos outros dias, fotografa só as páginas novas. A dúvida é: páginas novas desde **ontem** ou desde **domingo**?

### 🟡 Intermediário — aplicar

| Tipo | O que copia | Marca os arquivos como copiados? |
|---|---|---|
| **Completo** (normal, *full*) | **Tudo** o que foi selecionado | **Sim** |
| **Incremental** | Só o que mudou desde o **último backup de qualquer tipo** (completo ou incremental) | **Sim** |
| **Diferencial** | Só o que mudou desde o **último backup completo** | **Não** |
| **Cópia** | Tudo o que foi selecionado, sem afetar a rotina | **Não** |
| **Diário** | Os arquivos modificados **naquele dia** | **Não** |

A "marca" é o **atributo de arquivamento**: um sinal que diz ao programa "este arquivo já está no backup" (*consenso dos manuais*). Quem limpa a marca (completo e incremental) "zera a contagem" para o próximo backup.

**Comparação incremental × diferencial:**

| | Incremental | Diferencial |
|---|---|---|
| Tamanho de cada backup | **Pequeno** (só o do dia) | **Cresce** a cada dia (acumula desde o completo) |
| Tempo para **fazer** | Rápido | Fica mais lento ao longo da semana |
| Para **restaurar** | Completo + **todos** os incrementais, em ordem | Completo + **só o último** diferencial |
| Tempo para **restaurar** | Mais lento | Mais rápido |

> **Ex. 2** *(base, resolvido — incremental)* — Completo no **domingo**; incrementais de segunda a quarta. O disco queima na quarta à noite. O que restaurar?
> 1. O completo de domingo (a base).
> 2. O incremental de segunda (mudanças de segunda).
> 3. O de terça.
> 4. O de quarta.
> 5. Resposta: **domingo + segunda + terça + quarta, em ordem**.

> **Ex. 3** *(base, resolvido — diferencial)* — Completo no **domingo**; diferenciais de segunda a quarta. Queima na quarta à noite.
> 1. O completo de domingo.
> 2. O diferencial de quarta já contém **tudo** o que mudou desde domingo (segunda, terça e quarta).
> 3. Resposta: **domingo + diferencial de quarta**.

### 🔴 Avançado — acertar a prova

- **Incremental = desde o último backup (qualquer um)**; **diferencial = desde o último completo**. Essa troca é a pegadinha preferida.
- **Incremental marca** (limpa o atributo); **diferencial não marca**. Por isso o diferencial cresce.
- **Restauração:** incremental exige **a cadeia inteira**; se um incremental do meio se perder, os seguintes ficam incompletos. Diferencial exige **só dois** conjuntos.
- **Backup de cópia** serve para uma cópia extra (por exemplo, para levar a outro local) **sem atrapalhar** a rotina de incrementais e diferenciais.
- O primeiro backup de qualquer estratégia é sempre um **completo**.

> **Ex. 4** *(criado pelo tutor, resolvido — misto)* — Completo no domingo; incremental na segunda; diferencial na terça. O que o diferencial de terça contém?
> 1. Diferencial = desde o **último completo** (domingo).
> 2. Então contém as mudanças de **segunda e terça**, mesmo que segunda já tenha um incremental.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "No backup diferencial, para restaurar é preciso o completo e todos os diferenciais da semana." **Errado**: só o completo e o **último** diferencial. "Todos, em ordem" é o **incremental**.

**Para levar para a prova:** **completo** = tudo (marca). **Incremental** = desde o **último backup** (marca; pequeno; restaura com **toda a cadeia**). **Diferencial** = desde o **último completo** (não marca; cresce; restaura com **completo + último**). **Cópia** e **diário** não marcam.

---

## 7. Restauração no dia a dia (Windows)

### 🟢 Iniciante — entender

Antes de pensar em backup, lembre-se de que o Windows tem a **Lixeira**: o que você exclui vai para lá, e dá para trazer de volta.

> **Ex. 1** *(criado pelo tutor)* — Apagou sem querer a escala do mês? Abra a **Lixeira**, selecione o arquivo e clique em **Restaurar** ("Restaurar este item", "Restaurar os itens selecionados"). Ele volta para a pasta de origem.

### 🟡 Intermediário — aplicar

| Recurso | O que faz |
|---|---|
| **Lixeira** | Guarda os arquivos excluídos do disco do computador. Para recuperar: abrir a Lixeira, **selecionar** e **Restaurar** |
| **Esvaziar Lixeira** | Apaga de vez o que está lá (o contrário de restaurar) |
| **Shift + Delete** | Exclui **sem passar pela Lixeira** |
| **Histórico de Arquivos** (Windows 10 e 11) | Backup automático de versões dos arquivos pessoais num disco externo ou de rede; permite voltar a versões anteriores (*consenso dos manuais*) |
| **Restauração do Sistema** (pontos de restauração) | Volta **configurações e arquivos do sistema** a um estado anterior. **Não** é feita para recuperar documentos pessoais apagados (*consenso dos manuais*) |
| **Nuvem (OneDrive)** | Tem lixeira própria e histórico de versões |

> **Ex. 2** *(criado pelo tutor)* — Um arquivo apagado de um **pen drive** vai para a Lixeira? Em geral, **não**: arquivos excluídos de mídias removíveis são apagados direto (*consenso dos manuais*). Por isso, cuidado ao excluir no pen drive.

> **Ex. 3** *(criado pelo tutor)* — Depois de instalar um programa, o Windows passou a travar. Qual recurso usar? A **Restauração do Sistema**, que volta as configurações para antes da instalação, sem apagar seus documentos.

### 🔴 Avançado — acertar a prova

- **Restaurar da Lixeira** é feito **abrindo** a Lixeira e selecionando os itens. "Clicar com o botão direito no ícone da Lixeira e restaurar" **não** é o caminho; ali há "Esvaziar Lixeira".
- **Restauração do Sistema ≠ recuperar arquivos.** Distrator comum.
- **Shift + Delete** não manda para a Lixeira.
- A prova pode citar o Windows 7 ou o 10; o edital de 2026 cobra o **Windows 11**, mas a Lixeira funciona do mesmo jeito.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "Arquivos excluídos para a Lixeira não podem ser restaurados." **Errado**: esse é o propósito da Lixeira.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "Para recuperar um documento apagado, use a Restauração do Sistema." **Errado**: use a **Lixeira**, o **Histórico de Arquivos** ou um **backup**.

**Para levar para a prova:** **Lixeira** → abrir, selecionar, **Restaurar**. **Esvaziar Lixeira** apaga de vez; **Shift + Delete** pula a Lixeira. **Histórico de Arquivos** = versões dos seus arquivos. **Restauração do Sistema** = configurações do sistema, não documentos.

---

## 8. Quadros para não confundir

### 8.1 Tipos de backup

| Tipo | Copia | Marca? | Restaurar |
|---|---|---|---|
| Completo | Tudo | Sim | Só ele |
| Incremental | Desde o último backup | Sim | Completo + todos os incrementais, em ordem |
| Diferencial | Desde o último completo | Não | Completo + último diferencial |
| Cópia | Tudo o selecionado | Não | — |
| Diário | O que mudou no dia | Não | — |

### 8.2 Dispositivos

| Dispositivo | Tecnologia | Partes móveis? |
|---|---|---|
| HD | Magnética | **Sim** |
| SSD | Flash | **Não** |
| Pen drive, cartão SD | Flash | Não |
| CD, DVD, Blu-ray | Ótica | Sim (o disco gira no leitor) |
| Fita | Magnética | Sim |

### 8.3 Protocolos e serviços

| Nome | Função |
|---|---|
| FTP | Transferir arquivos |
| HTTP/HTTPS | Páginas web e downloads |
| BitTorrent | Compartilhar arquivos P2P |
| Drive, OneDrive, Dropbox | Armazenar na nuvem |
| VoIP | Voz pela internet |
| RFID | Identificação por radiofrequência |

---

## 9. Pegadinhas da banca

| A banca escreve… | O certo é… | Onde |
|---|---|---|
| 1 TB é menor que 500 GB | 1 TB = 1.024 GB | Seção 1 |
| HD sem partes móveis | **SSD** é que não tem partes móveis | Seção 2 |
| SATA, SCSI e SAS como tipos de disco | São **interfaces** de conexão | Seção 2 |
| RAM guarda os dados com o computador desligado | RAM é **volátil** | Seção 2 |
| VoIP ou RFID como transferência de arquivos | VoIP = voz; RFID = identificação | Seção 3 |
| .exe ou .docx como extensão de compactação | Compactação = .zip, .rar, .7z, .tar.gz | Seção 4 |
| Guardar o backup no mesmo local do original | Locais **diferentes** (redundância, 3-2-1) | Seção 5 |
| Backup não precisa ser testado | **Verificar** e **testar** a recuperação | Seção 5 |
| Incremental copia desde o último completo | Isso é o **diferencial**; incremental = desde o **último backup** | Seção 6 |
| Diferencial marca os arquivos | Diferencial **não marca** | Seção 6 |
| Para restaurar o diferencial, todos os diferenciais | Completo + **último** diferencial | Seção 6 |
| Restauração do Sistema recupera documentos apagados | Recupera **configurações do sistema**; documentos, pela Lixeira ou backup | Seção 7 |
| Arquivos na Lixeira não podem ser restaurados | Podem: abrir a Lixeira, selecionar, **Restaurar** | Seção 7 |

---

## 10. Revisão espaçada (faça primeiro, em 30 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2026-11-26_Informatica_Questoes.md).*

1. **INF 3 (13/11).** Diferencie vírus, worm, trojan e ransomware em uma linha cada.
2. **INF 3 (13/11).** O que é phishing? Cite dois sinais de uma mensagem de phishing.
3. **INF 3 (13/11).** Para que serve a criptografia? Diferencie criptografia simétrica e assimétrica.
4. **INF 3 (13/11).** O que é autenticação em dois fatores? Dê um exemplo.
5. **RL 2 (19/11) — prioridade.** Escreva a contrapositiva e a negação de: "Se o backup foi testado, então os dados estão íntegros."
6. **RL 2 (19/11).** "Todo SSD é memória flash. Nenhuma memória flash tem partes móveis." O que se conclui?
7. **HPE (esta semana).** Em que anos Olinda virou vila e cidade? E o Recife virou vila?
8. **LP 17 — parônimos.** Complete com *tráfego* ou *tráfico*: "O ________ de dados na rede aumentou durante o backup."
