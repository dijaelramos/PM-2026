# Material do dia — quarta-feira, 09/12/2026 — Informática (3 h)

> **Sessão do plano:** Informática, **sessão 4/10**, item **5** do Anexo II, com foco na **organização de computadores**: processador, memórias, armazenamento, entrada e saída, periféricos, instalação, configuração e utilização ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** 30 min de revisão · 1 h 30 de tópicos e exemplos · 1 h de questões com correção.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova.
> **Fonte:** [Informática (base)](../Base_de_Conhecimento/INFORMÁTICA/Informática.txt) e o [material de 26/11](2026-11-26_Informatica.md) (armazenamento). O que vem marcado como *consenso dos manuais* é explicação do tutor.
> **Questões do dia:** em arquivo separado, [2026-12-09_Informatica_Questoes.md](2026-12-09_Informatica_Questoes.md), com o estudo dirigido, o mapa, 8 questões **oficiais** da AOCP e 2 **autorais**, com gabarito comentado.
> **Reserva do Simulado 1:** a questão de hardware da prova de Soldado PMPE 2023 (Q35) **não foi usada**.

## Roteiro

| Bloco | O que fazer |
|---|---|
| **30 min — revisão** | Revisão espaçada (seção 9): diagramas lógicos (07/12), backup (26/11) e as dificuldades do perfil. |
| **1 h 30 — tópicos e exemplos** | Seções 1 a 6, nos três níveis. Feche com os quadros (seção 7) e as pegadinhas (seção 8). |
| **1 h — questões com correção** | As 10 questões do [arquivo de questões](2026-12-09_Informatica_Questoes.md) e a correção pelo gabarito no fim dele. O estudo dirigido fica para o fim de semana. |

## Cobertura do edital

Texto do Anexo II: *"5. Conceitos de organização e gerenciamento de arquivos, pastas e programas, incluindo criação, nomeação, renomeação, cópia, movimentação e exclusão. Conceitos básicos de instalação, configuração e utilização de periféricos. Organização de computadores: processador, memórias, dispositivos de armazenamento, dispositivos de entrada e saída e periféricos."*

| Item | Subtópico | Situação |
|---|---|---|
| 5 | Hardware × software | **explicado hoje** (seção 1) |
| 5 | Placa-mãe e processador | **explicado hoje** (seção 2) |
| 5 | Memórias (RAM, ROM, cache, registradores) | **explicado hoje** (seção 3) |
| 5 | Dispositivos de armazenamento | **26/11**; revisão hoje (seção 3) |
| 5 | Dispositivos de entrada e saída; periféricos | **explicado hoje** (seção 4) |
| 5 | Instalação, configuração e utilização de periféricos (portas, drivers) | **explicado hoje** (seção 5) |
| 5 | Unidades de medida | **26/11**; revisão hoje (seção 6) |
| 5 | Arquivos e pastas (criar, nomear, copiar, mover, excluir) | **21/12** (sessão 5/10) |

---

## 1. Hardware e software

### 🟢 Iniciante — entender

**Hardware** é a parte **física** do computador: o que se pode tocar (teclado, processador, monitor). **Software** é a parte **lógica**: os **programas** (Windows, Word, navegador).

> **Ex. 1** *(criado pelo tutor)* — No computador da sala de rádio do batalhão: a impressora e o monitor são **hardware**; o sistema do COPOM e o Windows são **software**.

### 🟡 Intermediário — aplicar

| Tipo de software | O que faz | Exemplos |
|---|---|---|
| **Sistema operacional** | Controla o hardware e serve de base para os outros programas | Windows 11, Linux, Android |
| **Aplicativos** | Executam tarefas do usuário | Word, Excel, navegador |
| **Utilitários** | Manutenção e proteção | antivírus, compactador, desfragmentador |
| **Firmware** | Software gravado no próprio hardware para fazê-lo funcionar | BIOS/UEFI da placa-mãe |
| **Malware** | Software **malicioso** (13/11) | vírus, ransomware |

> **Ex. 2** *(criado pelo tutor)* — Pense no aplicativo do talão eletrônico da viatura: é um **conjunto de instruções** que manda o tablet fazer um trabalho (registrar a infração, imprimir o auto). Isso é software. O tablet e a impressora portátil, que você pode segurar, são hardware.

> **Ex. 3** *(criado pelo tutor)* — Um vírus é software? **Sim**: é um programa, embora malicioso. "Software" não quer dizer "programa bom" nem "programa leve".

### 🔴 Avançado — acertar a prova

- **"Soft" não é "leve"**: software é a parte **lógica**, não um programa que exige pouco processamento.
- **Malware** é um **tipo** de software; definir "software" como "programa que causa danos" está errado.
- **Firmware** fica gravado no hardware, mas é software.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "O mouse sem fio e o pen drive são softwares, porque são pequenos." **Errado**: tamanho não importa; o que se toca é hardware.

> **Ex. 5** *(criado pelo tutor)* — Peopleware (*consenso dos manuais*): termo para as **pessoas** que usam o sistema. Às vezes aparece ao lado de hardware e software.

**Para levar para a prova:** **hardware** = físico; **software** = programas (sistema operacional, aplicativos, utilitários, firmware, malware). Software não é "programa leve".

---

## 2. Placa-mãe e processador

### 🟢 Iniciante — entender

A **placa-mãe** é a "avenida" onde tudo se conecta. O **processador** (CPU) é o "cérebro": executa as instruções dos programas.

> **Ex. 1** *(criado pelo tutor)* — Abrindo o gabinete de um computador do quartel, a placa grande no fundo é a placa-mãe; o processador fica encaixado nela, sob um cooler (ventoinha).

### 🟡 Intermediário — aplicar

| Componente | Função | Detalhes |
|---|---|---|
| **Placa-mãe** (motherboard) | **Interliga** os componentes internos e permite a comunicação entre eles | Tem o soquete do processador, os encaixes de memória, os conectores de disco e as portas |
| **Processador** (CPU, Unidade Central de Processamento) | Executa as instruções | **ULA** (Unidade Lógica e Aritmética: faz os cálculos), **UC** (Unidade de Controle: coordena), **registradores** (memória interna mínima) |
| **Clock** | Velocidade do processador | Em **GHz** (bilhões de ciclos por segundo) |
| **Núcleos** (cores) | Processadores dentro do processador | Dual-core, quad-core, octa-core |
| **Gabinete** | A caixa que guarda os componentes | Não é a CPU, embora muita gente chame assim |
| **Fonte** | Fornece energia | — |
| **Placa de vídeo** | Gera a imagem para o monitor | Integrada ou dedicada |

**Componentes internos básicos para o computador funcionar:** **processador** e **memória RAM** (com a placa-mãe que os liga).

> **Ex. 2** *(criado pelo tutor)* — "Um processador de 3,2 GHz com 8 núcleos": o clock é 3,2 GHz; os núcleos permitem fazer várias tarefas em paralelo.

> **Ex. 3** *(criado pelo tutor)* — Quem faz as contas? A **ULA**, dentro do processador. A placa-mãe só **liga** as peças.

### 🔴 Avançado — acertar a prova

- **Placa-mãe ≠ CPU ≠ gabinete.** A placa-mãe **interliga**; a CPU **processa**; o gabinete **guarda**.
- **CPU** nas provas = **processador**, componente **interno**; **não** é periférico.
- Pen drive, teclado, mouse e monitor **não** são componentes internos básicos.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "A placa-mãe executa as operações aritméticas do computador." **Errado**: isso é a **ULA**, no processador.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "A placa-mãe também é conhecida como gabinete." **Errado**: gabinete é a **caixa**.

**Para levar para a prova:** **placa-mãe** interliga; **processador (CPU)** executa (ULA calcula, UC controla); clock em **GHz**; núcleos. Componentes internos básicos: **CPU e RAM**. CPU não é periférico nem gabinete.

---

## 3. Memórias

### 🟢 Iniciante — entender

O computador tem memórias **rápidas e pequenas** (perto do processador) e memórias **lentas e grandes** (para guardar). A **RAM** é a mesa de trabalho: rápida, mas apaga quando desliga. O **SSD/HD** é o arquivo: guarda tudo.

> **Ex. 1** *(criado pelo tutor)* — Você abre o boletim de ocorrência: ele sai do SSD e vai para a **RAM**, onde é editado. Se faltar energia antes de salvar, o que estava só na RAM se perde.

### 🟡 Intermediário — aplicar

| Memória | Características |
|---|---|
| **Registradores** | Dentro do processador; as mais rápidas e menores |
| **Cache** | Entre o processador e a RAM; muito rápida; guarda o que o processador mais usa |
| **RAM** (memória principal) | **Volátil** (perde os dados sem energia); leitura e escrita; guarda os programas e dados **em uso** |
| **ROM** | **Não volátil**; vem **gravada de fábrica**; guarda o **firmware** (BIOS/UEFI) usado ao **ligar** o computador |
| **PROM, EPROM, EEPROM, flash** | **Tipos de ROM** (programáveis; a EEPROM e a flash podem ser apagadas eletricamente) |
| **Memória secundária** (armazenamento) | HD, SSD, pen drive: **não voláteis**, grandes e mais lentas (26/11) |
| **Memória virtual** | Parte do disco usada como extensão da RAM quando ela enche (*consenso dos manuais*) |

**Hierarquia (do mais rápido ao mais lento):** registradores → cache → RAM → armazenamento.

> **Ex. 2** *(criado pelo tutor)* — Qual memória vem gravada de fábrica e é usada ao ligar o computador? A **ROM** (com a BIOS/UEFI).

> **Ex. 3** *(criado pelo tutor)* — Por que o computador fica lento com muitos programas abertos? A **RAM** enche, e o sistema passa a usar a **memória virtual** no disco, que é bem mais lenta.

### 🔴 Avançado — acertar a prova

- **RAM = volátil; ROM = não volátil.** A banca inverte.
- A RAM guarda os dados **temporariamente** (em uso), não "permanentemente".
- **EPROM e EEPROM são tipos de ROM**, não de RAM.
- A **cache** fica entre o processador e a RAM; é **mais rápida** que a RAM.
- "Memória principal" = **RAM** (e a ROM, em alguns livros). "Memória secundária" = armazenamento.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "A memória RAM armazena permanentemente os programas." **Errado**: a RAM é **volátil**; quem guarda permanentemente é o armazenamento (HD/SSD).

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "A cache é mais lenta que a RAM, mas tem mais capacidade." **Errado**: é **mais rápida** e **menor**.

**Para levar para a prova:** **RAM** = principal, **volátil**, dados em uso. **ROM** = **não volátil**, de fábrica, firmware de inicialização (EPROM e EEPROM são ROM). **Cache** = entre CPU e RAM, mais rápida. Hierarquia: registradores → cache → RAM → armazenamento.

---

## 4. Dispositivos de entrada, saída e periféricos

### 🟢 Iniciante — entender

**Periféricos** são os equipamentos ligados ao computador para **trocar informações** com ele. Os de **entrada** mandam dados para o computador; os de **saída** mostram ou entregam o resultado; os **mistos** fazem as duas coisas.

> **Ex. 1** *(criado pelo tutor)* — O policial digita no **teclado** (entrada) e vê o texto no **monitor** (saída).

### 🟡 Intermediário — aplicar

| Tipo | Exemplos |
|---|---|
| **Entrada** | teclado, mouse, scanner, microfone, webcam, **leitor biométrico** (de digitais), leitor de código de barras, câmera |
| **Saída** | monitor, impressora, caixa de som, fone de ouvido, projetor |
| **Entrada e saída** (mistos) | tela sensível ao toque (touchscreen), impressora multifuncional (imprime e digitaliza), modem, placa de rede |
| **Armazenamento** (às vezes classificados como E/S) | pen drive, HD externo, cartão de memória |

**Não são periféricos:** os componentes **internos** essenciais — **processador (CPU)**, **memória RAM**, **placa-mãe**.

> **Ex. 2** *(criado pelo tutor)* — Leitor de digitais usado no ponto eletrônico: **entrada** (envia a digital ao computador).

> **Ex. 3** *(criado pelo tutor)* — Impressora multifuncional: **entrada** (scanner) **e saída** (impressão) = **mista**.

### 🔴 Avançado — acertar a prova

- **CPU e RAM não são periféricos.** Alternativa com "CPU" ou "memória RAM" como periférico está errada.
- **Placa-mãe não é periférico.**
- **Dispositivo que envia dados ao computador é de entrada**, mesmo que seja pequeno ou especializado (leitor biométrico, leitor de cartão, *token* USB com certificado digital — *consenso dos manuais*, conforme a banca já considerou).
- **Touchscreen** é **misto**: mostra (saída) e recebe toques (entrada).
- O **HD interno** é armazenamento interno; a banca não o trata como periférico ao lado de monitor e teclado.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "Teclado e CPU são periféricos." **Errado**: o teclado é; a CPU **não**.

> **Ex. 5** *(criado pelo tutor)* — Classifique: projetor (saída), microfone (entrada), webcam (entrada), caixa de som (saída), tela touch do tablet (mista).

**Para levar para a prova:** **entrada** (teclado, mouse, scanner, microfone, leitor biométrico), **saída** (monitor, impressora, som), **mistos** (touchscreen, multifuncional, modem). **CPU, RAM e placa-mãe não são periféricos.**

---

## 5. Instalação, configuração e utilização de periféricos

### 🟢 Iniciante — entender

Para um periférico funcionar, ele precisa estar **conectado** (cabo ou sem fio) e o sistema precisa de um **driver**: o programa que "ensina" o computador a conversar com aquele equipamento.

> **Ex. 1** *(criado pelo tutor)* — Ao ligar uma impressora nova na porta USB, o Windows procura e instala o **driver**. Depois disso, ela aparece em Configurações → Dispositivos → Impressoras.

### 🟡 Intermediário — aplicar

| Conceito | O que é |
|---|---|
| **Driver** | Software que permite ao sistema operacional controlar um dispositivo |
| **Plug and Play** | O sistema reconhece e configura o dispositivo **automaticamente** ao ser conectado |
| **USB** | Porta **universal** para periféricos e armazenamento; aceita conectar e desconectar com o computador ligado (*hot swap*) |
| **HDMI** | Leva **vídeo e áudio** digitais (monitor, TV, projetor) |
| **VGA** | Vídeo **analógico** (padrão antigo) |
| **Bluetooth** | Conexão **sem fio** de curto alcance (fone, mouse, teclado) |
| **Wi-Fi** | Rede **sem fio** |
| **Remover hardware com segurança** | Antes de tirar o pen drive, para não corromper os dados |

> **Ex. 2** *(criado pelo tutor)* — Para ligar o notebook ao projetor da sala de instrução com som: cabo **HDMI** (leva vídeo e áudio).

> **Ex. 3** *(criado pelo tutor)* — A impressora foi conectada, mas não imprime e aparece como "dispositivo desconhecido". O que falta? O **driver**.

### 🔴 Avançado — acertar a prova

- **Driver é software**, não peça.
- **Plug and Play** não dispensa o driver: o sistema **instala** o driver sozinho.
- **HDMI** transmite **áudio e vídeo**; **VGA** só vídeo (analógico).
- Retirar o pen drive sem "remover com segurança" pode **corromper** arquivos que estavam sendo gravados.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "Driver é a placa que liga o periférico à placa-mãe." **Errado**: driver é **software**.

> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — "O cabo VGA leva vídeo e áudio digitais." **Errado**: isso é o **HDMI**.

**Para levar para a prova:** periférico funciona com **conexão + driver** (software). **Plug and Play** = configuração automática. **USB** universal; **HDMI** vídeo e áudio; **Bluetooth** sem fio de curto alcance. Remover o pen drive com segurança.

---

## 6. Unidades de medida (revisão de 26/11)

### 🟢 Iniciante — entender

O computador mede a informação em **bits** e **bytes**. Um byte tem 8 bits.

> **Ex. 1** *(criado pelo tutor)* — Uma letra ocupa cerca de 1 byte.

### 🟡 Intermediário — aplicar

| Unidade | Vale (em informática) |
|---|---|
| 1 byte | 8 bits |
| 1 KB | **1.024** bytes |
| 1 MB | 1.024 KB |
| 1 GB | 1.024 MB |
| 1 TB | 1.024 GB |
| 1 PB | 1.024 TB |

> **Ex. 2** *(criado pelo tutor)* — 2 MB = 2 × 1.024 = 2.048 KB.

> **Ex. 3** *(criado pelo tutor)* — Velocidade de internet em **bits** por segundo (Mbps); tamanho de arquivo em **bytes** (MB).

### 🔴 Avançado — acertar a prova

- Em informática, a banca usa **1 KB = 1.024 bytes** (potências de 2). O "1 KB = 1.000 bytes" é a convenção do Sistema Internacional (kB), mas, em questões de informática da AOCP, o padrão cobrado é **1.024** (*consenso dos manuais*).
- **bit (b) × byte (B)**: não confunda.

> **Ex. 4 — contraexemplo** *(criado pelo tutor)* — "1 GB = 1.000 KB." **Errado** duas vezes: 1 GB = 1.024 **MB** = 1.048.576 KB.

> **Ex. 5** *(criado pelo tutor)* — 1 byte = 8 bits; 4 bytes = 32 bits.

**Para levar para a prova:** 1 byte = 8 bits; **1 KB = 1.024 bytes**; K → M → G → T → P, cada um × 1.024.

---

## 7. Quadros para não confundir

### 7.1 Peças do computador

| Peça | Função | É periférico? |
|---|---|---|
| Placa-mãe | Interliga os componentes | Não |
| Processador (CPU) | Executa as instruções (ULA + UC) | Não |
| Memória RAM | Trabalho, volátil | Não |
| Memória ROM | Firmware de inicialização, não volátil | Não |
| HD/SSD interno | Armazenamento | Não (interno) |
| Teclado, mouse | Entrada | Sim |
| Monitor, impressora | Saída | Sim |
| Touchscreen, multifuncional | Entrada e saída | Sim |

### 7.2 Memórias

| Memória | Volátil? | Velocidade | Função |
|---|---|---|---|
| Registradores | Sim | Máxima | Dentro da CPU |
| Cache | Sim | Muito alta | Entre CPU e RAM |
| RAM | **Sim** | Alta | Programas e dados em uso |
| ROM | **Não** | — | Firmware (BIOS/UEFI) |
| HD/SSD | Não | Menor | Armazenamento permanente |

---

## 8. Pegadinhas da banca

| A banca escreve… | O certo é… | Onde |
|---|---|---|
| Software = partes físicas | Software = **programas**; hardware = físico | Seção 1 |
| Software = programa leve | "Soft" não é "leve" | Seção 1 |
| Placa-mãe = CPU ou gabinete | Placa-mãe **interliga**; CPU processa; gabinete guarda | Seção 2 |
| Placa-mãe faz as contas | Quem calcula é a **ULA** (no processador) | Seção 2 |
| RAM armazena permanentemente | RAM é **volátil** | Seção 3 |
| ROM volátil; RAM não volátil | O contrário | Seção 3 |
| EPROM e EEPROM são tipos de RAM | São tipos de **ROM** | Seção 3 |
| CPU ou memória RAM como periféricos | **Não** são periféricos | Seção 4 |
| Pen drive como componente interno básico | Básicos = **CPU e RAM** | Seção 2 |
| Driver é uma peça | Driver é **software** | Seção 5 |
| 1 KB = 1.000 bytes (em informática) | **1.024** bytes | Seção 6 |

---

## 9. Revisão espaçada (faça primeiro, em 30 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2026-12-09_Informatica_Questoes.md).*

1. **RL 3 (07/12).** 50 policiais: 28 fizeram curso de tiro, 22 de direção e 9 os dois. Quantos não fizeram nenhum? Quantos fizeram só tiro?
2. **RL 3 (07/12).** Em M = {1, {1}, 2}, quantos elementos há? "1 ∈ M" e "{1} ∈ M" são verdadeiros?
3. **INF 4 (26/11).** Incremental × diferencial: qual exige toda a cadeia para restaurar?
4. **INF 4 (26/11).** HD ou SSD: qual não tem partes móveis?
5. **INF 3 (13/11).** Que tipo de malware registra as teclas digitadas? E qual sequestra os dados e pede resgate?
6. **RL 1 — negação (prioridade).** Negue: "Todo periférico é de entrada ou de saída."
7. **LP — crase (30/11).** "Conectou o cabo ___ porta USB" e "Começou ___ imprimir".
