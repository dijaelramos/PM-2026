# Material do dia — sexta-feira, 13/11/2026 — Informática (2 h) e Redação (1 h)

> **Sessão do plano:** Informática, sessão 2/10 — **item 3** do Anexo II (segurança da informação) — e Redação, com a proposta da **PMES 2022** adiada de 06/11 ([plano](../Plano_de_Estudos_PMPE_2026.md)). A correção da redação é na segunda, **16/11**.
> **Distribuição:** Informática 2 h — 15 min de revisão · 1 h de tópicos e exemplos · 45 min de questões com correção. Redação 1 h — 10 min de planejamento · 40 min de escrita · 10 min de autorrevisão.
> **Formato:** padrão em três níveis ([regra](../.github/regras/material_e_correcao.md)). 🟢 Iniciante = entender · 🟡 Intermediário = aplicar · 🔴 Avançado = acertar a prova.
> **Fonte principal:** *Cartilha de Segurança para Internet* do CERT.br, versão 4.0 (2012), baixada do site oficial em 13/11/2026. Os trechos citados entre aspas estão em [Base_de_Conhecimento/INFORMÁTICA/Cartilha_CERTbr_2012_trechos.md](../Base_de_Conhecimento/INFORMÁTICA/Cartilha_CERTbr_2012_trechos.md). **A AOCP copia as definições dessa Cartilha palavra por palavra** nas questões de segurança: conhecer o texto dela é a melhor preparação. Conceitos que não estão na Cartilha de 2012 (ransomware, VPN, firewall de próxima geração, leis) vêm da doutrina e estão marcados *(citado pelo tutor)*. Os exemplos "criados pelo tutor" são **análise do tutor**.
> **Reserva do Simulado 1:** a Q33 da prova de Soldado PMPE 2023 trata deste item e não foi usada.

## Roteiro

| Bloco | O que fazer |
|---|---|
| **15 min — revisão espaçada** | Faça a seção 11 sem consultar (conectivos de LP e condicional de RL). |
| **1 h — tópicos e exemplos** | Leia os níveis 🟢 e 🟡 das seções 1 a 7. Depois leia os níveis 🔴 e o quadro de pegadinhas (seção 8). Ao fim de cada seção, diga em voz alta o "Para levar para a prova". |
| **45 min — questões com correção** | Confira o mapa, resolva as 7 questões (seção 10) e responda ao estudo dirigido (seção 9). Mande as respostas para correção ou confira na seção 13. |
| **1 h — redação** | Siga a seção 12: proposta da PMES 2022, 10 + 40 + 10 min. |

## Cobertura do edital

Texto do Anexo II: *"3. Conceitos de proteção e segurança da informação, incluindo ameaças, vulnerabilidades, malwares, phishing, criptografia, autenticação e boas práticas de segurança."*

| Item | Subtópico | Situação |
|---|---|---|
| 3 | Conceitos de proteção e segurança da informação (requisitos/princípios) | **explicado hoje** (seção 1) |
| 3 | Ameaças e vulnerabilidades (e os ataques que as exploram) | **explicado hoje** (seção 2) |
| 3 | Malwares | **explicado hoje** (seção 3) |
| 3 | Phishing (e os golpes vizinhos que a banca usa como distratores, e spam) | **explicado hoje** (seção 4) |
| 3 | Criptografia (incluindo hash, assinatura e certificado digital, HTTPS) | **explicado hoje** (seção 5) |
| 3 | Autenticação | **explicado hoje** (seção 6) |
| 3 | Boas práticas de segurança (antimalware, firewall, VPN, atualização, senhas, backup) | **explicado hoje** (seção 7) |
| 1–2 | Internet, intranet, navegadores, serviços e nuvem | sessão de **03/11** do plano; revisão integrada em **28/01/2027** |
| 4 | Armazenamento e backup (tipos e restauração) | **26/11** (hoje só as boas práticas de backup ligadas à segurança) |
| 5–7 | Hardware, arquivos e pastas, Windows 11, Office/LibreOffice | **09/12** a **13/01/2027** |

---

## 1. Conceitos de proteção e segurança da informação

### 🟢 Iniciante — entender

Segurança da informação é proteger os dados para que: **só quem pode** veja (sigilo), **ninguém altere** sem autorização (integridade) e eles **estejam lá quando precisar** (disponibilidade). Pense no **boletim de ocorrência** de uma vítima: só pessoas autorizadas podem lê-lo, ninguém pode mudar o que foi registrado e o sistema precisa funcionar na hora em que o policial vai consultá-lo.

> **Ex. 1** *(criado pelo tutor)* — Um sistema de consulta de mandados fora do ar numa madrugada de plantão: nenhum dado vazou nem foi alterado, mas a **disponibilidade** falhou, e o policial não consegue saber se o abordado tem mandado em aberto.

### 🟡 Intermediário — aplicar

**Os requisitos básicos de segurança, segundo a Cartilha do CERT.br** (texto da Cartilha):

| Requisito | Definição da Cartilha | Pergunta-chave |
|---|---|---|
| **Identificação** | "permitir que uma entidade se identifique, ou seja, diga quem ela é" | Quem você **diz** ser? |
| **Autenticação** | "verificar se a entidade é realmente quem ela diz ser" | Você **é mesmo** quem diz? |
| **Autorização** | "determinar as ações que a entidade pode executar" | O que você **pode fazer**? |
| **Integridade** | "proteger a informação contra alteração não autorizada" | Foi **alterada**? |
| **Confidencialidade ou sigilo** | "proteger uma informação contra acesso não autorizado" | Quem pode **ver**? |
| **Não repúdio** | "evitar que uma entidade possa negar que foi ela quem executou uma ação" | O autor pode **negar**? |
| **Disponibilidade** | "garantir que um recurso esteja disponível sempre que necessário" | Está **acessível** quando preciso? |

**A tríade clássica (CID):** **C**onfidencialidade, **I**ntegridade e **D**isponibilidade. Muitas bancas acrescentam **Autenticidade** (CIDA) e **Não repúdio**.

**Identificação → autenticação → autorização, passo a passo** (o login do policial no sistema):
1. Digita a matrícula → **identificação** (diz quem é).
2. Digita a senha e confirma o código no celular → **autenticação** (prova que é).
3. O sistema libera a consulta de antecedentes, mas não a edição de ocorrências de outra unidade → **autorização** (o que pode fazer).

> **Ex. 2** *(criado pelo tutor)* — Um escrivão altera, sem autorização, a hora de um fato registrado num inquérito eletrônico. Requisito violado: **integridade**. Nenhum dado vazou e o sistema continua no ar.
>
> **Ex. 3** *(criado pelo tutor)* — Um servidor tira foto da tela com dados sigilosos de uma investigação e manda num grupo de mensagens. Requisito violado: **confidencialidade**.

### 🔴 Avançado — acertar a prova

- **Identificação ≠ autenticação.** Informar o usuário é identificação; provar com senha, token ou biometria é autenticação. A banca troca os dois.
- **Autenticação ≠ autorização.** Autenticado não quer dizer autorizado para tudo (princípio do **menor privilégio**: cada usuário recebe só as permissões de que precisa) *(citado pelo tutor)*.
- **Não repúdio** depende de prova de autoria, como a **assinatura digital** (seção 5). Senha compartilhada destrói o não repúdio: não dá para provar quem fez.
- **Falso positivo** (Cartilha): quando um mecanismo de segurança aponta como maliciosa uma atividade **legítima** (por exemplo, um e-mail verdadeiro classificado como spam). É um "falso alarme".
- **Ataque de negação de serviço** fere a **disponibilidade**; **vazamento** fere a **confidencialidade**; **adulteração** fere a **integridade**. Associe cada ataque ao requisito.

> **Ex. 4** *(criado pelo tutor)* — Dois policiais usam a mesma senha no sistema de registro de ocorrências. Um registro falso aparece. Quem fez? Não dá para saber: a senha compartilhada violou a **autenticação** e eliminou o **não repúdio**.
>
> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — Afirmativa: "A disponibilidade garante que a informação só seja acessada por pessoas autorizadas". **Errado**: isso é **confidencialidade**. Disponibilidade = acessível **quando necessário**.

**Para levar para a prova:** CID = Confidencialidade (quem vê), Integridade (não alterada), Disponibilidade (acessível quando preciso). Identificação (diz quem é) → Autenticação (prova) → Autorização (o que pode fazer). Não repúdio = não pode negar a autoria.

---

## 2. Ameaças, vulnerabilidades e ataques

### 🟢 Iniciante — entender

- **Vulnerabilidade** é a **fraqueza** (a janela sem tranca).
- **Ameaça** é o que **pode explorar** a fraqueza (o ladrão que passa pela rua).
- **Risco** é a **chance** de a ameaça explorar a fraqueza e causar dano.
- **Ataque** é a ameaça **em ação**; **incidente** é o evento de segurança que de fato aconteceu.

> **Ex. 1** *(criado pelo tutor)* — O computador da recepção de um batalhão está com o Windows desatualizado (vulnerabilidade). Um worm que circula na rede explora essa falha (ameaça). Como o computador fica ligado na rede interna, o risco é alto. Quando o worm infecta a máquina, há um incidente.

### 🟡 Intermediário — aplicar

**Vulnerabilidade (Cartilha):** "uma condição que, quando explorada por um atacante, pode resultar em uma violação de segurança. Exemplos de vulnerabilidades são falhas no projeto, na implementação ou na configuração de programas, serviços ou equipamentos de rede."

**Ataques descritos na Cartilha** (palavras-chave em negrito):

| Ataque | O que é (Cartilha) | Requisito mais atingido |
|---|---|---|
| **Exploração de vulnerabilidades** | Usar uma vulnerabilidade para "invadir um sistema, acessar informações confidenciais, disparar ataques contra outros computadores ou tornar um serviço inacessível" | vários |
| **Varredura em redes (scan)** | "efetuar **buscas minuciosas em redes**, com o objetivo de identificar computadores ativos e coletar informações sobre eles" | preparação de ataque |
| **Falsificação de e-mail (e-mail spoofing)** | "**alterar campos do cabeçalho** de um e-mail, de forma a aparentar que ele foi enviado de uma determinada origem quando, na verdade, foi enviado de outra" | autenticidade |
| **Interceptação de tráfego (sniffing)** | "**inspecionar os dados trafegados** em redes de computadores, por meio do uso de programas específicos chamados de **sniffers**" | confidencialidade |
| **Força bruta (brute force)** | "adivinhar, por **tentativa e erro**, um nome de usuário e senha" | autenticação |
| **Desfiguração de página (defacement)** | "**alterar o conteúdo da página Web** de um site" (também chamada de **pichação**) | integridade |
| **Negação de serviço (DoS) / distribuída (DDoS)** | "**tirar de operação** um serviço, um computador ou uma rede"; quando feita por **um conjunto de computadores**, é **DDoS**. "O objetivo destes ataques **não é invadir e nem coletar informações**, mas sim exaurir recursos e causar indisponibilidades" | **disponibilidade** |

**Engenharia social:** técnica de **persuasão** que explora a confiança, a curiosidade ou o medo das pessoas para que elas entreguem informações ou executem ações. A Cartilha a cita como ingrediente do **phishing** e de outros golpes: os golpistas exploram "fragilidades dos usuários" porque atacar diretamente o servidor de um banco "não é uma tarefa simples".

> **Ex. 2** *(passo a passo, criado pelo tutor)* — O site da prefeitura de uma cidade do Agreste amanhece com mensagens ofensivas no lugar das notícias. (1) O site saiu do ar? Não. (2) O conteúdo foi trocado? Sim. → **Desfiguração (defacement)**, ataque à **integridade**.
>
> **Ex. 3** *(passo a passo, criado pelo tutor)* — O site de agendamento de um órgão fica lento e cai, porque milhares de computadores infectados enviam acessos ao mesmo tempo. (1) Houve invasão ou roubo de dados? Não. (2) O serviço ficou indisponível? Sim. (3) Foram muitos computadores? Sim. → **DDoS**, ataque à **disponibilidade** (os computadores costumam ser **zumbis** de uma **botnet**, seção 3).

### 🔴 Avançado — acertar a prova

- **Scan ≠ scam.** *Scan* (com "n") é **varredura** de rede; *scam* (com "m") é **golpe** para enganar o usuário (a própria Cartilha faz esse alerta).
- **Sniffing pode ser legítimo:** administradores de rede usam sniffers para diagnosticar problemas. A banca pode dizer que o sniffing é "sempre ilegal" → errado.
- **DoS não invade.** O objetivo é **indisponibilizar**, não coletar dados.
- **Spoofing de e-mail** não exige invadir a conta do remetente: basta **alterar o cabeçalho**. Por isso o campo "De:" não prova quem enviou.
- **Vulnerabilidade de dia zero (*zero-day*):** falha ainda desconhecida pelo fabricante ou sem correção disponível *(citado pelo tutor)*.
- **Hacker x cracker:** no uso das bancas, *hacker* é o especialista que conhece profundamente os sistemas; *cracker* é quem **quebra** a segurança com finalidade maliciosa. Os dois são **pessoas**, não programas *(citado pelo tutor)*.
- **Na lei brasileira** *(citado pelo tutor)*: invadir dispositivo informático é crime (Código Penal, art. 154-A, incluído pela Lei 12.737/2012, a "Lei Carolina Dieckmann", com penas aumentadas pela Lei 14.155/2021); a fraude eletrônica é forma qualificada de estelionato (CP, art. 171, § 2º-A).

> **Ex. 4** *(criado pelo tutor)* — Um e-mail chega com o remetente "comando@pm.pe.gov.br" pedindo uma planilha com dados de efetivo. O cabeçalho foi alterado. Técnica: **e-mail spoofing**. A conta verdadeira do comando nem foi invadida.
>
> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — Afirmativa: "O ataque DDoS tem como principal objetivo invadir o servidor e copiar os dados armazenados". **Errado**: o objetivo é **exaurir recursos** e causar **indisponibilidade**; a Cartilha diz que não é invadir nem coletar informações.

**Para levar para a prova:** vulnerabilidade = fraqueza; ameaça = o que explora; risco = probabilidade de dano. Scan = varredura; spoofing = falsificar cabeçalho; sniffing = interceptar tráfego; força bruta = tentativa e erro; defacement = pichar o site; DoS/DDoS = derrubar o serviço (**disponibilidade**, sem invadir).

---

## 3. Malwares (códigos maliciosos)

### 🟢 Iniciante — entender

Malware é **qualquer programa feito para causar dano**. Cada tipo tem uma "personalidade":
- o **vírus** é um parasita: gruda em outro arquivo e só age quando esse arquivo é aberto;
- o **worm** é um viajante: se espalha sozinho pela rede;
- o **cavalo de troia** é um presente falso: parece útil, mas esconde algo ruim;
- o **spyware** é um espião: observa e manda o que vê para alguém;
- o **bot** é um robô controlado à distância;
- o **backdoor** é uma porta dos fundos para o invasor voltar;
- o **rootkit** é o especialista em se esconder;
- o **ransomware** é um sequestrador: tranca os dados e cobra resgate.

> **Ex. 1** *(criado pelo tutor)* — Um soldado baixa um "jogo grátis" no computador da reserva de armamento. O jogo funciona, mas, sem que ele saiba, instala um programa que envia arquivos para fora. É um **cavalo de troia**: fez o que prometia e algo escondido.

### 🟡 Intermediário — aplicar

**Definição geral (Cartilha):** "Códigos maliciosos (malware) são programas especificamente desenvolvidos para executar ações danosas e atividades maliciosas em um computador."

| Tipo | Definição da Cartilha (palavras-chave) | Como se propaga | Marca registrada |
|---|---|---|---|
| **Vírus** | "programa ou parte de um programa [...] que se propaga **inserindo cópias de si mesmo e se tornando parte de outros programas e arquivos**"; "depende da **execução do programa ou arquivo hospedeiro**" | Precisa de um **hospedeiro** e de **execução** | Parasita de arquivo |
| **Worm** | "capaz de se **propagar automaticamente pelas redes**, enviando **cópias de si mesmo** de computador para computador"; não se inclui em outros arquivos; explora vulnerabilidades | **Sozinho**, pela rede | Consome muitos recursos da rede |
| **Bot** | "dispõe de **mecanismos de comunicação com o invasor** que permitem que ele seja **controlado remotamente**"; propagação "similar ao do worm" | Automática, como o worm | **Controle remoto**; a máquina vira **zumbi**; várias formam uma **botnet** |
| **Spyware** | "projetado para **monitorar as atividades** de um sistema e **enviar as informações coletadas para terceiros**"; uso **legítimo ou malicioso** | Instalado (não se replica sozinho) | Espionagem |
| ↳ **Keylogger** | "capturar e armazenar as **teclas digitadas**" | — | Teclado |
| ↳ **Screenlogger** | "armazenar a **posição do cursor e a tela** [...] nos momentos em que o **mouse é clicado**"; usado contra **teclados virtuais** | — | Mouse e tela |
| ↳ **Adware** | "projetado especificamente para **apresentar propagandas**" | — | Propaganda |
| **Backdoor** | "permite o **retorno de um invasor** a um computador comprometido" | Instalado por outro malware ou pelo atacante | Porta dos fundos |
| **Cavalo de troia (trojan)** | "além de executar as funções para as quais foi **aparentemente projetado**, também executa **outras funções**, normalmente maliciosas, e **sem o conhecimento do usuário**" | Precisa ser **executado** pelo usuário | Disfarce |
| **Rootkit** | "conjunto de programas e técnicas que permite **esconder e assegurar a presença** de um invasor ou de outro código malicioso" | Instalado após o comprometimento | Camuflagem |
| **Ransomware** *(citado pelo tutor; não está na Cartilha de 2012)* | Torna os dados ou o equipamento **inacessíveis** (em geral por **criptografia**) e exige **resgate**, normalmente em criptomoeda | E-mail, links, vulnerabilidades | Sequestro de dados |

**Como identificar o tipo, passo a passo:**
1. **Ele se espalha sozinho?** Pela rede, sem hospedeiro → worm (ou bot, se também for **controlado remotamente**). Inserindo-se em arquivos → vírus.
2. **Ele se disfarça de programa útil?** → cavalo de troia.
3. **Ele espiona e envia dados?** → spyware (teclas → keylogger; tela e cliques → screenlogger; propaganda → adware).
4. **Ele garante o retorno do invasor?** → backdoor. **Ele esconde o invasor?** → rootkit.
5. **Ele tranca dados e pede pagamento?** → ransomware.

> **Ex. 2** *(passo a passo, criado pelo tutor)* — Uma planilha do Excel recebida por e-mail tem macros que, ao abrir o arquivo, infectam outras planilhas do computador. (1) Espalha-se sozinho pela rede? Não. (2) Insere-se em outros arquivos e depende de o arquivo ser aberto? Sim. → **Vírus** (mais precisamente, **vírus de macro**, que a Cartilha cita como tipo de vírus de script).
>
> **Ex. 3** *(passo a passo, criado pelo tutor)* — Numa segunda-feira, todos os arquivos da seção administrativa aparecem com extensão estranha e uma mensagem pede pagamento em criptomoeda para devolvê-los. → **Ransomware**. A defesa mais eficaz contra a perda é ter **backup** fora da rede (seção 7).

### 🔴 Avançado — acertar a prova

- **Vírus x worm (a pergunta mais clássica):** o vírus **precisa de hospedeiro** e de **execução**; o worm **não precisa de hospedeiro** e se propaga **sozinho** pela rede, explorando vulnerabilidades.
- **Worm x bot:** os dois se propagam automaticamente; o que define o **bot** é a **comunicação com o invasor** e o **controle remoto**. Se a questão der ao bot só a característica de "se propagar enviando cópias de si mesmo", ela está descrevendo o **worm**.
- **Trojan não se replica** sozinho: precisa que o usuário o execute.
- **Keylogger e screenlogger são tipos de spyware.** Se a questão descrever captura de **teclas e cliques**, a categoria geral é **spyware**. O screenlogger existe para burlar o **teclado virtual** dos bancos.
- **Spyware pode ser legítimo** (instalado pelo próprio dono, com consentimento). A banca pode dizer que é "sempre malicioso" → errado.
- **Adware pode ser legítimo** (patrocínio de programa gratuito).
- **Nomes que não são malware:** *cracker* e *hacker* são **pessoas**; *hardware* é a parte **física** do computador; *alienware* é uma **marca de computadores**; *firewall* e *antivírus* são **defesas** *(citado pelo tutor)*.

> **Ex. 4** *(criado pelo tutor)* — Um computador de um posto policial passa a enviar milhares de e-mails de propaganda durante a madrugada, sob comando de alguém de fora. A máquina virou **zumbi** de uma **botnet**: foi infectada por um **bot**.
>
> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — Afirmativa: "O worm, para se propagar, precisa ser anexado a um arquivo hospedeiro e depende de que o usuário execute esse arquivo". **Errado**: essa é a descrição do **vírus**. O worm se propaga **sozinho** pela rede.

**Para levar para a prova:** vírus = hospedeiro + execução; worm = sozinho pela rede; bot = controle remoto (zumbi, botnet); trojan = disfarce (não se replica); spyware = espião (keylogger = teclas; screenlogger = tela e cliques; adware = propaganda); backdoor = volta do invasor; rootkit = esconde; ransomware = sequestro com resgate.

---

## 4. Phishing, outros golpes e spam

### 🟢 Iniciante — entender

**Phishing** vem de *fishing* (pescar): o golpista joga uma **isca** (mensagem falsa de banco, de órgão público, de loja) para "pescar" seus dados. A isca usa **pressa, medo ou ganância**: "sua conta será bloqueada", "você ganhou um prêmio", "ajude esta campanha".

> **Ex. 1** *(criado pelo tutor)* — Um SMS diz: "Detran-PE: sua CNH será suspensa hoje. Regularize em [link]". O link leva a uma página igual à do Detran, que pede CPF, senha e dados do cartão. É **phishing** (por SMS, também chamado de *smishing*).

### 🟡 Intermediário — aplicar

**Definição da Cartilha:** "Phishing, phishing-scam ou phishing/scam, é o tipo de **fraude** por meio da qual um golpista tenta **obter dados pessoais e financeiros** de um usuário, pela utilização **combinada de meios técnicos e engenharia social**."

**As 4 características das mensagens de phishing (Cartilha):**
1. "tentam se passar pela **comunicação oficial de uma instituição conhecida**, como um banco, uma empresa ou um site popular";
2. "procuram atrair a atenção do usuário, seja por **curiosidade**, por **caridade** ou pela possibilidade de obter alguma **vantagem financeira**";
3. "informam que a não execução dos procedimentos descritos pode acarretar **sérias consequências**";
4. "tentam induzir o usuário a fornecer dados pessoais e financeiros" (por páginas falsas, instalação de códigos maliciosos ou formulários).

**Os golpes vizinhos (que a banca usa para confundir):**

| Golpe | Definição da Cartilha | Palavra-chave |
|---|---|---|
| **Phishing** | fraude para obter **dados pessoais e financeiros**, com **meios técnicos + engenharia social** | isca, dados |
| **Pharming** | "tipo específico de phishing que envolve a **redireção da navegação** do usuário para sites falsos, por meio de **alterações no serviço de DNS**" — você digita o endereço certo e cai no site falso | **DNS** |
| **Furto de identidade** (*identity theft*) | "ato pelo qual uma pessoa tenta **se passar por outra**, atribuindo-se uma **falsa identidade**, com o objetivo de obter vantagens indevidas" | falsa identidade |
| **Fraude de antecipação de recursos** (*advance fee fraud*) | golpista induz a pessoa "a fornecer informações confidenciais ou a realizar um **pagamento adiantado**, com a **promessa de futuramente receber algum tipo de benefício**" (ex.: "Golpe da Nigéria") | pagar antes, receber depois |
| **Boato** (*hoax*) | "mensagem que possui **conteúdo alarmante ou falso** e que, geralmente, tem como remetente, ou aponta como autora, alguma instituição, empresa importante ou órgão governamental" | alarme falso, corrente |
| **Spam** | "termo usado para se referir aos **e-mails não solicitados**, que geralmente são enviados para um **grande número de pessoas**"; se o conteúdo é **exclusivamente comercial**, chama-se **UCE** (*Unsolicited Commercial E-mail*) | não solicitado, em massa |

> **Ex. 2** *(passo a passo, criado pelo tutor)* — Um e-mail diz que um parente distante deixou uma herança de 2 milhões e que você precisa pagar R$ 3 mil de "taxas de cartório" para liberá-la. (1) Pede pagamento **antes**? Sim. (2) Promete benefício **depois**? Sim. → **Fraude de antecipação de recursos**.
>
> **Ex. 3** *(passo a passo, criado pelo tutor)* — Você digita corretamente o endereço do seu banco, mas a página que abre é falsa, porque o roteador da sua casa teve o DNS alterado. (1) Você clicou num link de mensagem? Não. (2) O endereço digitado estava certo? Sim. (3) O redirecionamento veio da alteração no **DNS**? Sim. → **Pharming**.

### 🔴 Avançado — acertar a prova

- **Phishing é fraude**, não é programa. Ele pode **usar** códigos maliciosos, mas não é um tipo de malware. A banca pode definir phishing com a definição de malware, de spyware ou de vírus → errado.
- **Pharming é um tipo de phishing** (não o contrário) e a marca dele é o **DNS**. Se a questão disser que "hoax é um tipo de phishing que altera o DNS", trocou o nome: isso é pharming. Hoax é **boato**.
- **Spam não é phishing.** Spam é mensagem **não solicitada em massa** (muitas vezes só propaganda); phishing é **fraude** para roubar dados. Um phishing pode chegar como spam, mas os conceitos são diferentes.
- **Variantes** *(citado pelo tutor)*: **spear phishing** (direcionado a uma pessoa ou órgão específico, com dados reais da vítima); **smishing** (por SMS); **vishing** (por voz, a "falsa central de atendimento"); **whaling** (mira autoridades e executivos).
- **Furto de identidade** pode ser crime contra a **fé pública** ("falsa identidade"); muitos golpes na Internet são **estelionato** (Cartilha).

> **Ex. 4** *(criado pelo tutor)* — O comandante de um batalhão recebe um e-mail com o nome dele, o número correto da unidade e uma "intimação" da Corregedoria com link para "ciência". É **spear phishing**: personalizado, com dados reais, mirando uma autoridade.
>
> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — Afirmativa: "Pharming é a mensagem de conteúdo alarmante que circula como corrente, atribuída a um órgão público". **Errado**: essa é a definição de **boato (hoax)**. Pharming = redirecionamento por alteração de **DNS**.

**Para levar para a prova:** phishing = **fraude** para obter **dados pessoais e financeiros** por **meios técnicos + engenharia social**, imitando instituição conhecida. Pharming = phishing por **DNS**. Furto de identidade = **se passar por outro**. Antecipação de recursos = **pagar antes** para receber benefício. Hoax = **boato** alarmante. Spam = **não solicitado** em massa (comercial = UCE).

---

## 5. Criptografia, assinatura e certificado digital

### 🟢 Iniciante — entender

Criptografar é **embaralhar** uma informação com uma **chave**, para que só quem tem a chave certa consiga ler.
- **Simétrica:** é como um cadeado com **uma única chave** para trancar e abrir. As duas pessoas precisam ter cópia da mesma chave.
- **Assimétrica:** é como uma **caixa de correio**: qualquer um coloca a carta pela fenda (**chave pública**), mas só o dono abre com a chave dele (**chave privada**).

> **Ex. 1** *(criado pelo tutor)* — Você compacta um relatório com senha e manda a senha ao colega por telefone. É a lógica da **simétrica**: a mesma senha tranca e destranca, e ela precisou ser combinada por outro canal.

### 🟡 Intermediário — aplicar

**a) Simétrica x assimétrica (Cartilha)**

| | **Chave simétrica** | **Chaves assimétricas** |
|---|---|---|
| Outros nomes | chave **secreta** ou **única** | chave **pública** |
| Chaves | **uma mesma chave** para codificar e decodificar | **duas chaves**: **pública** (livremente divulgada) e **privada** (secreta, do dono) |
| Velocidade | **mais rápida** — "mais indicada para garantir a confidencialidade de **grandes volumes de dados**" | **mais lenta** |
| Problema | exige **canal seguro** para combinar a chave; difícil gerenciar muitas chaves | resolve esses problemas |
| Exemplos | **AES**, Blowfish, RC4, **3DES**, IDEA | **RSA**, DSA, ECC, Diffie-Hellman |

**Uso combinado:** a simétrica cifra a informação e a assimétrica protege a troca da **chave de sessão**. É o que fazem navegadores e leitores de e-mail: **SSL** (hoje **TLS**), **PGP** e **S/MIME**.

**b) Qual chave usar? (passo a passo)**

| Quero garantir… | Cifro com… | Decifro/verifico com… |
|---|---|---|
| **Sigilo** (só o destinatário lê) | **chave pública do destinatário** | **chave privada do destinatário** |
| **Assinatura digital** (autoria e integridade) | **minha chave privada** (sobre o **hash**) | **minha chave pública** |

**c) Hash, assinatura e certificado (Cartilha)**

| Conceito | Definição | Garante |
|---|---|---|
| **Função de resumo (hash)** | "gera um resultado **único e de tamanho fixo**", independente do tamanho da informação; não dá para fazer o caminho inverso. Ex.: SHA-1, SHA-256, MD5 | **Integridade** (se o hash mudou, o arquivo mudou) |
| **Assinatura digital** | "permite comprovar a **autenticidade** e a **integridade** de uma informação"; assina-se com a **chave privada**, verifica-se com a **pública** | Autenticidade, integridade e **não repúdio** (**não** garante sigilo) |
| **Certificado digital** | "registro eletrônico composto por um conjunto de dados que **distingue uma entidade e associa a ela uma chave pública**"; emitido por uma **Autoridade Certificadora (AC)**; certificados não confiáveis vão para a **Lista de Certificados Revogados (LCR)** | Que a chave pública é **mesmo** de quem diz ser |
| **Certificado autoassinado** | "aquele no qual o **dono e o emissor são a mesma entidade**" | Não comprova identidade por terceiro |
| **Certificado EV SSL** | "emitido sob um **processo mais rigoroso de validação** do solicitante": verifica se a empresa foi legalmente registrada, está ativa, detém o domínio e o endereço físico | Maior confiança na **identidade** do site |

**d) Conexões no navegador (Cartilha)**

| Conexão | Sinal | Requisitos |
|---|---|---|
| Padrão | "http://" | **nenhum** requisito de segurança |
| Segura | "https://", **cadeado fechado** | **autenticação, integridade e confidencialidade** |
| Segura com **EV SSL** | igual à segura, com o **nome da instituição** em destaque | as mesmas, com maior confiança na identidade do dono |
| Certificado **autoassinado** ou cadeia não reconhecida | alerta do navegador, cadeado com aviso | **integridade e confidencialidade**, mas **não autenticação** |

> **Ex. 2** *(passo a passo, criado pelo tutor)* — O sargento Silva quer mandar à delegada Ana um arquivo que **só ela** possa abrir. (1) Objetivo: sigilo. (2) Cifra com a **chave pública da Ana**. (3) Só a **chave privada da Ana** decifra. Se ele cifrasse com a própria chave privada, qualquer pessoa com a chave pública dele leria: isso seria **assinatura**, não sigilo.
>
> **Ex. 3** *(passo a passo, criado pelo tutor)* — Um perito baixa um programa e o site informa o hash SHA-256. (1) Ele calcula o hash do arquivo baixado. (2) Compara com o informado. (3) Iguais → o arquivo **não foi alterado** (**integridade**). Diferentes → arquivo corrompido ou adulterado.

### 🔴 Avançado — acertar a prova

- **Assinatura digital não dá sigilo.** Ela prova **quem** assinou e que o conteúdo **não mudou**; o texto pode continuar legível. Para sigilo, é preciso **cifrar**.
- **A assinatura é feita sobre o hash** (mais rápido), não sobre o documento inteiro.
- **Certificado autoassinado tem uso legítimo e malicioso.** Legítimo: a **AC raiz** (primeira da cadeia) tem certificado autoassinado, e instituições pequenas o usam para ter sigilo sem pagar uma AC comercial. **Malicioso**: se o golpista convencer a vítima (por exemplo, por phishing) a **instalar** no navegador um certificado autoassinado criado por ele, o navegador passa a "confiar" nesse certificado, e o site falso abre **cifrado e sem nenhum aviso**.
- **O cadeado indica conexão cifrada, não site honesto.** Um site falso pode ter HTTPS com certificado válido para o **domínio falso**. Confira o **endereço**.
- **EV SSL é o oposto do autoassinado** em matéria de confiança: validação **mais rigorosa**, feita por AC.
- **No Brasil**, a **ICP-Brasil** (Infraestrutura de Chaves Públicas Brasileira, MP 2.200-2/2001) organiza os certificados digitais com validade jurídica; a AC raiz é o **ITI** *(citado pelo tutor)*.
- **MD5 e SHA-1** aparecem como exemplos na Cartilha de 2012, mas hoje são considerados **fracos** (colisões conhecidas); o recomendado é a família **SHA-2** (como o SHA-256) *(citado pelo tutor)*.

> **Ex. 4** *(criado pelo tutor)* — Um boletim de ocorrência eletrônico assinado digitalmente pelo delegado: se alguém mudar uma vírgula, a verificação da assinatura falha (**integridade**), e o delegado não pode negar que assinou (**não repúdio**).
>
> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — Afirmativa: "Na criptografia assimétrica, a mesma chave é usada para cifrar e decifrar, o que a torna mais rápida para grandes volumes de dados". **Errado** duas vezes: isso descreve a **simétrica** (uma chave, mais rápida). A assimétrica usa **duas chaves** e é **mais lenta**.

**Para levar para a prova:** simétrica = 1 chave, rápida, AES/3DES; assimétrica = pública + privada, lenta, RSA. Sigilo = cifra com a **pública do destinatário**; assinatura = **privada do remetente** sobre o **hash** (autenticidade, integridade, não repúdio, **sem** sigilo). Certificado = associa chave pública a uma entidade (emitido por AC). Autoassinado = dono = emissor (perigoso se instalado por golpe). EV SSL = validação rigorosa. HTTPS = autenticação, integridade e confidencialidade.

---

## 6. Autenticação

### 🟢 Iniciante — entender

Autenticar é **provar** que você é você. Há três jeitos:
- algo que você **sabe** (senha);
- algo que você **tem** (token, celular, cartão);
- algo que você **é** (digital, rosto).

Juntar dois jeitos diferentes deixa a porta bem mais segura.

> **Ex. 1** *(criado pelo tutor)* — No caixa eletrônico, você usa o **cartão** (algo que tem) e a **senha** (algo que sabe). Quem rouba só o cartão não consegue sacar.

### 🟡 Intermediário — aplicar

**Os três grupos de mecanismos de autenticação (Cartilha):**

| Grupo | Exemplos da Cartilha | Outros exemplos *(tutor)* |
|---|---|---|
| **Aquilo que você é** | "impressão digital, a palma da sua mão, a sua voz e o seu olho" | reconhecimento facial |
| **Aquilo que apenas você possui** | "cartão de senhas bancárias e um token gerador de senhas" | celular que recebe código, chave de segurança USB, certificado digital em token ou cartão |
| **Aquilo que apenas você sabe** | "perguntas de segurança e suas senhas" | PIN, padrão de desbloqueio |

**Autenticação em dois fatores (2FA) / verificação em duas etapas:** combina **dois grupos diferentes**. Exemplo: senha (sabe) + código no celular (possui).

**Senha boa, segundo a Cartilha:** "difícil de ser descoberta (forte) e fácil de ser lembrada".

| Não use | Use |
|---|---|
| Dados pessoais (nome, datas, placa, telefone, documentos) | **Grande quantidade de caracteres** (senha longa) |
| Sequências de teclado ("1qaz2wsx") | **Diferentes tipos de caracteres** (maiúsculas, minúsculas, números, sinais) |
| Palavras de listas conhecidas (times, músicas, dicionário) | Números aleatórios; frases longas fáceis de lembrar |

> **Ex. 2** *(passo a passo, criado pelo tutor)* — Um sistema pede senha e depois uma **pergunta secreta** ("nome do primeiro animal"). (1) Senha = sabe. (2) Pergunta secreta = sabe. (3) Dois grupos diferentes? **Não**. → Não é autenticação em dois **fatores**; são dois elementos do **mesmo** fator.
>
> **Ex. 3** *(passo a passo, criado pelo tutor)* — O policial acessa o sistema com o **cartão funcional com certificado digital** (possui) e o **PIN** do cartão (sabe). (1) Possui + sabe. (2) Grupos diferentes. → **Autenticação de dois fatores**.

### 🔴 Avançado — acertar a prova

- **Dois fatores = dois grupos diferentes.** Duas senhas não são 2FA.
- **Biometria** é "aquilo que você **é**", não "aquilo que você possui". A banca troca os grupos.
- **Ataque de força bruta** é contra a autenticação por senha; senhas **longas** e o **bloqueio após tentativas** dificultam o ataque.
- **Troca periódica obrigatória de senha:** orientações modernas (como a NIST SP 800-63B, dos EUA, de 2017) **desaconselham** forçar a troca em intervalos curtos sem indício de vazamento, porque o usuário passa a criar senhas fracas e previsíveis ("Senha01", "Senha02"…). O recomendado é senha longa, única para cada serviço e combinada com **segundo fator** *(citado pelo tutor)*.
- **Senha única para cada serviço:** se um site vaza, o golpista testa a mesma senha em outros (ataque com credenciais vazadas) *(citado pelo tutor)*.

> **Ex. 4** *(criado pelo tutor)* — Um aplicativo de mensagens pede um PIN de 6 dígitos além do código por SMS para reativar a conta num celular novo. Isso evita o golpe em que o criminoso consegue o código por engenharia social ("me passa o código que chegou aí"), mas não sabe o PIN.
>
> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — Afirmativa: "A leitura da impressão digital é um exemplo de mecanismo de autenticação baseado naquilo que o usuário possui". **Errado**: é baseada naquilo que o usuário **é** (biometria).

**Para levar para a prova:** sabe (senha, pergunta), possui (token, cartão, celular), é (biometria). 2FA = **dois grupos diferentes**. Senha boa = forte e fácil de lembrar: longa e com tipos variados, sem dados pessoais nem sequências.

---

## 7. Boas práticas e mecanismos de proteção

### 🟢 Iniciante — entender

Nenhuma proteção sozinha resolve. Segurança funciona em **camadas**, como um batalhão: tem muro (firewall), sentinela (antivírus), crachá (autenticação), portão trancado (atualizações que fecham brechas) e um arquivo de reserva guardado em outro prédio (backup). Se uma camada falha, a outra segura.

> **Ex. 1** *(criado pelo tutor)* — O antivírus não reconheceu um malware novo, mas o firewall bloqueou a tentativa de o programa enviar dados para fora. Uma camada cobriu a falha da outra.

### 🟡 Intermediário — aplicar

| Mecanismo | O que faz | O que **não** faz |
|---|---|---|
| **Antimalware** (Cartilha) | "procuram **detectar e, então, anular ou remover** os códigos maliciosos". Exemplos: antivírus, antispyware, antirootkit, antitrojan | Não impede, sozinho, a exploração de vulnerabilidades via rede nem o acesso por um backdoor já instalado |
| **Firewall pessoal** (Cartilha) | "proteger um computador contra **acessos não autorizados vindos da Internet**"; registra e bloqueia tentativas de acesso, bloqueia o envio de dados coletados por malware | Não remove malware |
| **Firewall de próxima geração (NGFW)** *(citado pelo tutor)* | Junta o firewall tradicional (portas, endereços, protocolos) com **inspeção profunda de pacotes**, **controle por aplicação e por usuário** e **sistema de prevenção de intrusões (IPS)** integrado | Não substitui backup nem atualização |
| **IDS x IPS** *(citado pelo tutor)* | **IDS** (*Intrusion Detection System*) **detecta e alerta**; **IPS** (*Intrusion Prevention System*) **detecta e bloqueia** | — |
| **VPN** (*Virtual Private Network*) *(citado pelo tutor)* | Cria um **túnel criptografado** sobre a Internet: dá **confidencialidade e integridade** à comunicação e permite o **acesso remoto seguro** à intranet | Não protege o computador contra malware que já esteja nele |
| **Atualizações** (*patches*) | **Corrigem vulnerabilidades** conhecidas | — |
| **Filtro antispam** (Cartilha) | Separa e-mails desejados dos indesejados | — |
| **Política de segurança** (Cartilha) | "define os direitos e as responsabilidades de cada um em relação à segurança dos recursos computacionais que utiliza e as penalidades às quais está sujeito, caso não a cumpra" | — |
| **Registro de eventos (logs)** (Cartilha) | "registro de atividade gerado por programas e serviços de um computador"; ajuda a detectar incidentes e investigar | — |
| **Backup** | Cópia para **recuperar** dados perdidos, apagados ou sequestrados | Não impede a infecção |

**Cuidados com backup ligados à segurança (Cartilha):**
- manter os backups atualizados, **automáticos** e conferidos;
- guardá-los em locais seguros, bem condicionados e com **acesso restrito**;
- **armazenar dados sensíveis em formato criptografado**;
- manter **backups redundantes** (várias cópias) "para evitar perder seus dados em um **incêndio, inundação, furto** ou pelo uso de mídias defeituosas", escolhendo **pelo menos dois** destes lugares: casa, escritório e um repositório remoto;
- **testar** periodicamente se é possível recuperar.

Regra prática **3-2-1**: **3** cópias, em **2** tipos de mídia, sendo **1** fora do local *(citado pelo tutor)*. Tipos de backup e restauração ficam para **26/11**.

**Boas práticas do usuário (resumo):**
1. Atualizar sistema e programas.
2. Manter antimalware e firewall ativos.
3. Usar senhas longas, únicas e segundo fator.
4. Desconfiar de links e anexos; conferir o endereço antes de digitar dados.
5. Não instalar programas de origem desconhecida nem certificados enviados por mensagem.
6. Usar VPN e canais institucionais para comunicação sensível; nada de e-mail pessoal ou rede social aberta para dados de serviço.
7. Fazer backup com cópia fora do local.

> **Ex. 2** *(passo a passo, criado pelo tutor)* — Uma equipe de inteligência precisa acessar, de um hotel em outra cidade, um sistema que só funciona na rede interna da corporação. (1) Precisa de acesso à intranet de fora? Sim. (2) A rede do hotel é confiável? Não. (3) Solução: **VPN**, que cria um túnel criptografado até a rede da instituição.
>
> **Ex. 3** *(passo a passo, criado pelo tutor)* — Uma seção faz backup diário num HD externo que fica na mesma sala do servidor. Um incêndio destrói a sala. (1) O backup foi feito? Sim. (2) Ficou no mesmo local? Sim. (3) Resultado: os dois se perdem. Faltou a **redundância fora do local**.

### 🔴 Avançado — acertar a prova

- **Defesa em profundidade:** a banca costuma apresentar uma medida isolada (só antivírus, só senha, só bloqueio de sites) como "suficiente" ou "a mais eficaz". Desconfie de medidas **parciais** ou que criam **outro risco**. Prefira a que **integra várias camadas** de proteção.
- **Antivírus gratuito com "proteção básica"** é melhor do que nada, mas é **uma camada só**, básica.
- **Bloquear quase tudo** (proibir toda a Internet, liberar só uma lista de sites) reduz riscos, mas pode **inviabilizar o serviço** (fere a **disponibilidade**) e não protege contra outros vetores (pen-drive, e-mail, ameaça interna).
- **"Abrir para dar transparência"** informação **operacional ou confidencial** viola a **confidencialidade**. Transparência pública não significa expor dados sigilosos.
- **Intranet é restrita** por definição. Uma "intranet aberta ao público" deixa de ser intranet.
- **Firewall não é antivírus**, e **antivírus não é firewall**: a Cartilha diz que é preciso usar **os dois**.

> **Ex. 4** *(criado pelo tutor)* — O comando quer receber denúncias pelo WhatsApp pessoal dos oficiais "para agilizar". Riscos: dados sensíveis fora do controle institucional (**confidencialidade**), perda de registro (**logs**) e risco de golpe com o número. A boa prática é um canal institucional com controle de acesso.
>
> **Ex. 5 — contraexemplo** *(criado pelo tutor)* — Afirmativa: "Com um antivírus atualizado, o firewall torna-se desnecessário, pois o antivírus impede qualquer acesso não autorizado pela rede". **Errado**: segundo a Cartilha, o antimalware não impede a exploração de vulnerabilidades via rede nem o acesso por backdoor; por isso é necessário **também** o firewall.

**Para levar para a prova:** camadas. Antimalware **detecta e remove**; firewall **bloqueia acesso** não autorizado; NGFW = firewall + **IPS** + controle de aplicação; IDS **alerta**, IPS **bloqueia**; VPN = **túnel criptografado** (acesso remoto seguro); atualização fecha **vulnerabilidade**; backup **redundante, fora do local, criptografado e testado**.

---

### Aplicação — segurança da informação na atividade policial

| Situação | Conceito |
|---|---|
| Consulta a sistemas de antecedentes e mandados com login pessoal | Identificação, autenticação, autorização e **não repúdio** (nunca empreste a senha) |
| Mensagem "do comando" pedindo dados por link | Phishing, spear phishing, e-mail spoofing |
| Fotos de ocorrência e dados de vítimas no celular pessoal | Confidencialidade; LGPD (Lei 13.709/2018, princípio da segurança) *(citado pelo tutor)* |
| Comunicação em operação | VPN e canais institucionais criptografados |
| Vítima de golpe do PIX ou de clonagem de WhatsApp no plantão | Engenharia social, furto de identidade, fraude eletrônica (CP, art. 171, § 2º-A) *(citado pelo tutor)* |
| Site institucional pichado ou fora do ar | Defacement (integridade) e DDoS (disponibilidade) |

---

## 8. Pegadinhas da banca

| A banca escreve… | O certo é… |
|---|---|
| "Disponibilidade é garantir que só pessoas autorizadas acessem a informação" | Isso é **confidencialidade**; disponibilidade = acessível **quando necessário** |
| "Identificação e autenticação são a mesma coisa" | Identificação = **dizer** quem é; autenticação = **provar** |
| "O objetivo do DDoS é invadir e copiar dados" | O objetivo é **indisponibilizar** (não invadir nem coletar) |
| "Scan é golpe para enganar o usuário" | *Scan* = **varredura**; golpe é *scam* |
| "O worm precisa de um arquivo hospedeiro" | Quem precisa é o **vírus**; o worm se propaga **sozinho** |
| Definição do worm atribuída ao bot (só "propaga cópias de si mesmo") | O que define o bot é o **controle remoto** pelo invasor |
| Definição do spyware atribuída ao worm ("monitora e envia informações") | Monitorar e enviar = **spyware** |
| "O cavalo de troia se replica automaticamente" | O trojan precisa ser **executado**; não se replica sozinho |
| "Keylogger e screenlogger são tipos de vírus" | São tipos de **spyware** |
| "Cracker/alienware/hardware é um tipo de malware" | Cracker = **pessoa**; alienware = **marca**; hardware = parte **física** |
| "Phishing é um programa que se insere em outros arquivos" | Phishing é **fraude** (meios técnicos + engenharia social); inserir-se em arquivos = **vírus** |
| "Hoax é um tipo de phishing que altera o DNS" | Alteração de DNS = **pharming**; hoax = **boato** |
| "Spam e phishing são sinônimos" | Spam = **não solicitado em massa**; phishing = **fraude** para obter dados |
| "Na criptografia simétrica há chave pública e privada" | Simétrica = **uma** chave; pública + privada = **assimétrica** |
| "A assimétrica é mais rápida para grandes volumes" | A **simétrica** é mais rápida |
| "A assinatura digital garante o sigilo do documento" | Garante **autenticidade, integridade e não repúdio**, **não** sigilo |
| "Para enviar mensagem sigilosa, cifra-se com a própria chave privada" | Cifra-se com a **chave pública do destinatário** |
| "Cadeado no navegador = site confiável" | Cadeado = conexão **cifrada**; confira o **endereço** |
| "Certificado EV SSL é emitido pelo próprio dono" | Isso é o **autoassinado**; EV SSL = validação **mais rigorosa** por AC |
| "Biometria é algo que o usuário possui" | Biometria = algo que o usuário **é** |
| "Senha + pergunta secreta = autenticação de dois fatores" | Mesmo grupo (**sabe**); 2FA exige grupos **diferentes** |
| "Com antivírus, o firewall é desnecessário" | São camadas **complementares** |
| "Backup diário no mesmo local físico garante a recuperação" | É preciso cópia **fora do local** (incêndio, furto, inundação) |

---

## 9. Estudo dirigido (responda por escrito, sem consultar)

**Conceitos e ataques (seções 1 e 2)**
1. Defina confidencialidade, integridade e disponibilidade e dê um exemplo policial de violação de cada uma.
2. Qual a diferença entre identificação, autenticação e autorização?
3. O que é não repúdio e que mecanismo o garante?
4. Diferencie vulnerabilidade, ameaça e risco.
5. Defina scan, e-mail spoofing, sniffing, força bruta, defacement e DDoS, e diga qual requisito cada um atinge mais.
6. O que é engenharia social?

**Malwares (seção 3)**

7. Diferencie vírus de worm.
8. O que distingue o bot do worm? O que é botnet e o que é zumbi?
9. O que é cavalo de troia? Ele se replica sozinho?
10. Defina spyware e cite três tipos dele com o que cada um captura.
11. Para que servem o backdoor e o rootkit?
12. O que é ransomware e qual a principal defesa contra a perda dos dados?

**Golpes (seção 4)**

13. Escreva a definição de phishing da Cartilha e cite as quatro características das mensagens.
14. Diferencie phishing, pharming, furto de identidade, fraude de antecipação de recursos, boato e spam.
15. O que é spear phishing? E smishing?

**Criptografia e autenticação (seções 5 e 6)**

16. Compare criptografia simétrica e assimétrica (chaves, velocidade, exemplos).
17. Para mandar um arquivo sigiloso, com qual chave se cifra? E para assinar digitalmente?
18. O que é hash e para que serve?
19. O que a assinatura digital garante e o que ela não garante?
20. O que é certificado digital? E certificado autoassinado? Explique o uso malicioso do autoassinado.
21. O que é certificado EV SSL?
22. Quais requisitos uma conexão HTTPS fornece? O cadeado prova que o site é honesto?
23. Quais são os três grupos de autenticação? O que é autenticação de dois fatores?

**Boas práticas (seção 7)**

24. Qual a diferença entre antimalware e firewall? Por que a Cartilha recomenda os dois?
25. O que é um firewall de próxima geração? Diferencie IDS e IPS.
26. O que é VPN e quando usá-la?
27. Cite quatro cuidados com backup ligados à segurança.

---

## Mapa das questões

Onde está, no texto de estudo, a base de cada questão (sem a resposta):

| Questão | Conteúdo exigido | Onde estudar |
|---|---|---|
| 1 — TRT-1 2018, Q28 | Tipos de malware e de spyware (o que captura teclas e cliques); termos que não são malware | Seção 3 (tabela e 🔴) e seção 2 🔴 (hacker x cracker) |
| 2 — ITEP-RN 2018, Q25 | Definições de phishing, worm, cavalo de troia e bot | Seção 4 (phishing) e seção 3 (tabela e 🔴 worm x bot) |
| 3 — UFPB 2019, Q25 | Definição de phishing x spam, malware, spyware e vírus | Seções 3 e 4 |
| 4 — DESENBAHIA 2017, Q20 | Definição de phishing x fraude de antecipação, furto de identidade, boato e pharming | Seção 4 (tabela de golpes e 🔴) |
| 5 — SEJUS-CE 2017, Q18 | Tipos de certificado (autoassinado, EV SSL) e tipos de criptografia | Seção 5 (tabela "c" e 🔴) |
| 6 — PMPE 2023 (2º Tenente), Q27 | Procedimento seguro de comunicação pela Internet; VPN; confidencialidade; intranet | Seção 7 (tabela, boas práticas e 🔴) e seção 1 |
| 7 — PMPE 2023 (2º Tenente), Q28 | Comparação de medidas de proteção: antivírus, política de senhas, firewall de próxima geração, restrição de sites, backup | Seção 7 (tabela, backup e 🔴) e seção 6 🔴 (troca periódica de senha) |

---

## 10. Questões oficiais (resolva antes de ver a seção 13)

> Fora da prova reservada para o Simulado 1, o banco tem **7 questões oficiais** do item 3, todas da AOCP. As de 2017 a 2019 são de cargos de nível médio de outras áreas; as duas da PMPE 2023 são da prova de **2º Tenente** (nível superior), do mesmo concurso.

### Questão 1 — TRT-1 2018, Técnico Judiciário — Segurança (AOCP), Q28

> Nível médio, área de segurança institucional. Gabarito oficial **pós-recursos**.

Ocorreu um incidente de segurança da informação na empresa onde você trabalha e a equipe de administradores de T.I. solicitou que os usuários não ligassem os seus computadores até que fosse realizada uma varredura em toda a rede em busca de códigos maliciosos. A suspeita é de um software que captura as teclas digitadas no teclado e os cliques de mouse. Esse software é conhecido como

- **(A)** ransomware.
- **(B)** cracker.
- **(C)** alienware.
- **(D)** spyware.
- **(E)** hardware.

### Questão 2 — ITEP-RN 2018, Agente de Necropsia (AOCP), Q25

> Nível médio, perícia oficial. Gabarito oficial **pós-recursos**.

Sobre os conceitos de vírus e outros tipos de programas maliciosos que podem estar instalados em um computador, analise as assertivas e assinale a alternativa que aponta as corretas.

I. Phishing é um tipo de fraude por meio do qual um golpista tenta obter dados pessoais e financeiros de um usuário, pela utilização combinada de meios técnicos e engenharia social.
II. Worm é um programa projetado para monitorar as atividades de um sistema e enviar as informações coletadas para terceiros.
III. Cavalo de troia ou trojan é um programa que, além de executar as funções para as quais foi aparentemente projetado, executa outras funções, normalmente maliciosas e sem o conhecimento do usuário.
IV. Bot é um programa capaz de se propagar automaticamente pelas redes, enviando cópias de si mesmo de computador para computador.

- **(A)** Apenas I e III.
- **(B)** Apenas II e IV.
- **(C)** Apenas I, II e III.
- **(D)** Apenas II e III.
- **(E)** Apenas I, III e IV.

### Questão 3 — UFPB 2019, Assistente em Administração (AOCP), Q25

> Nível médio, universidade federal. Gabarito oficial **pós-recursos**.

O Phishing é um tipo de ameaça virtual bastante comum nos dias de hoje. Em relação ao Phishing, assinale a alternativa correta.

- **(A)** É o termo usado para se referir aos e-mails não solicitados, que geralmente são enviados para um grande número de pessoas. Quando esse tipo de mensagem possui conteúdo exclusivamente comercial, também é referenciado como UCE (Unsolicited Commercial E-mail). Em alguns pontos, assemelha-se a outras formas de propaganda, como a carta colocada na caixa de correio, o panfleto recebido na esquina e a ligação telefônica ofertando produtos.
- **(B)** São programas especificamente desenvolvidos para executar ações danosas e atividades maliciosas em um computador. Algumas das diversas formas como os códigos maliciosos podem infectar ou comprometer um computador são pela exploração de vulnerabilidades existentes nos programas instalados, autoexecução de mídias removíveis infectadas, como pen-drives, entre outras.
- **(C)** É um software projetado para monitorar as atividades de um sistema e enviar as informações coletadas para terceiros. Pode ser usado tanto de forma legítima quanto maliciosa, dependendo de como é instalado, das ações realizadas, do tipo de informação monitorada e do uso que é feito por quem recebe as informações coletadas.
- **(D)** São programas, ou parte de um programa de computador, normalmente maliciosos, que se propagam inserindo cópias de si mesmo e se tornando parte de outros programas e arquivos.
- **(E)** É um método de envio de mensagens eletrônicas que tentam se passar pela comunicação oficial de uma instituição conhecida, como um banco, empresa ou um site popular. Procuram atrair a atenção do usuário, seja por curiosidade, por caridade ou pela possibilidade de obter alguma vantagem financeira.

### Questão 4 — DESENBAHIA 2017, Técnico Escriturário (AOCP), Q20

> Nível médio, agência de fomento. Gabarito oficial **definitivo**.

Sobre o golpe praticado na internet e conhecido como Phishing, assinale a alternativa correta.

- **(A)** É um tipo de fraude no qual um golpista procura induzir uma pessoa a fornecer informações confidenciais ou a realizar um pagamento adiantado, com a promessa de futuramente receber algum tipo de benefício.
- **(B)** É o ato pelo qual uma pessoa tenta se passar por outra, atribuindo-se uma falsa identidade, com o objetivo de obter vantagens indevidas.
- **(C)** É uma mensagem que possui conteúdo alarmante ou falso e que, geralmente, tem como remetente, ou aponta como autora, alguma instituição, empresa importante ou órgão governamental.
- **(D)** Hoax é um tipo específico de Phishing que envolve a redireção da navegação do usuário para sites falsos, por meio de alterações no serviço de DNS.
- **(E)** É um tipo de fraude por meio da qual um golpista tenta obter dados pessoais e financeiros de um usuário, pela utilização combinada de meios técnicos e engenharia social.

### Questão 5 — SEJUS-CE 2017, Agente Penitenciário (AOCP), Q18

> Nível médio, área prisional, **4 alternativas** (a PMPE tem 5). Gabarito oficial **pós-recursos**.

Preencha a lacuna e assinale a alternativa correta. Um(a) ____________________ se usado(a) de forma maliciosa e instalado(a) pode permitir estabelecer conexões cifradas com sites fraudulentos, sem que o navegador emita alertas indicativos de risco.

- **(A)** certificado EV SSL
- **(B)** certificado auto-assinado
- **(C)** criptografia de chaves assimétricas
- **(D)** criptografia de chave simétrica

### Questão 6 — PMPE 2023, 2º Tenente (AOCP), Q27

> Mesmo concurso e mesma banca, prova de **nível superior** (liberada: a reserva vale só para a prova de Soldado). Gabarito oficial **definitivo**.

A Polícia Militar de Pernambuco está implementando procedimentos seguros de comunicação, utilizando a internet, em operações de segurança. Nesse sentido, é correto afirmar que um procedimento adequado para esse contexto é

- **(A)** a utilização de redes sociais abertas para a coleta de informações de inteligência, sem necessidade de protocolos de segurança ou privacidade.
- **(B)** a implementação de uma VPN (Virtual Private Network) para garantir comunicações seguras e criptografadas durante operações sensíveis.
- **(C)** o uso exclusivo de e-mails públicos para comunicação interna, visando facilitar o acesso e a troca de informações entre os oficiais.
- **(D)** a proibição completa do uso de qualquer serviço de internet nas instalações da polícia para evitar vazamentos de informações.
- **(E)** a adoção de um sistema de intranet aberto, permitindo que o público geral acesse informações operacionais para promover a transparência.

### Questão 7 — PMPE 2023, 2º Tenente (AOCP), Q28

> Mesmo concurso e mesma banca, prova de nível superior. Gabarito oficial **definitivo**.

Em um ambiente corporativo, qual das seguintes medidas é a mais eficaz para melhorar a segurança dos computadores e proteger dados sensíveis?

- **(A)** Instalação de antivírus gratuito em todos os computadores do ambiente, garantindo proteção básica contra malwares.
- **(B)** Implementação de uma política de senha forte, exigindo a troca de senhas a cada 30 dias.
- **(C)** Uso de firewalls de próxima geração (NGFW) que integram funcionalidades tradicionais de firewall com sistemas de prevenção contra intrusões.
- **(D)** Restrição do acesso à internet apenas a sites previamente aprovados pela equipe de TI.
- **(E)** Realização de backups diários em discos rígidos externos mantidos no mesmo local físico dos computadores.

---

## 11. Revisão espaçada (faça primeiro, em 15 min)

**a) Língua Portuguesa — conectivos** (dificuldades do item 4 registradas no perfil). *Exercícios do tutor, não oficiais.* Diga a relação de sentido do conectivo em destaque (causa, concessão, conclusão, finalidade, consequência, oposição):

1. "O soldado não abriu o anexo, **porquanto** o remetente era desconhecido."
2. "**Conquanto** o antivírus estivesse atualizado, o computador foi infectado."
3. "Os backups eram testados todo mês; **destarte**, a restauração foi rápida."
4. "Atualize o sistema **para que** as falhas sejam corrigidas."
5. "**Mesmo depois de** trocar a senha, ele continuou recebendo alertas."

**b) Raciocínio Lógico — condicional** (prioridade de revisão). *Exercícios do tutor, não oficiais.* Considere: "Se o e-mail pede a senha, então é phishing."

6. Escreva uma proposição **equivalente** (sem alterar o sentido).
7. Escreva a **negação**.

**c) Leitura do comando.** Antes de resolver, sublinhe o que o comando pede nas questões 2 e 7: a 2 pede "a alternativa que aponta as ______"; a 7 usa um superlativo ("a mais ______"). Diga em uma frase como isso muda a forma de resolver.

---

## 12. Redação (1 h) — proposta da PMES 2022

> A proposta, as regras do edital da PMPE 2026, o roteiro e a lista de autorrevisão estão em [2026-11-06_Redacao_Producao.md](2026-11-06_Redacao_Producao.md). Use aquele material; aqui vai só o resumo.

**Tema:** *A importância da valorização da saúde mental no ambiente de trabalho* (texto dissertativo).

| Tempo | O que fazer |
|---|---|
| **10 min — planejamento** | Escreva a **tese** numa frase. Escolha **dois argumentos**, cada um com um apoio (conceito da OMS dos Textos 1 e 2, o relato do Texto 3 ou conhecimento seu). Não copie trechos dos textos de apoio. |
| **40 min — escrita** | 4 parágrafos: introdução com tese (3–4 linhas), dois desenvolvimentos (cerca de 5 linhas cada) e conclusão que retoma a tese (3–4 linhas). **15 a 20 linhas** (mire em 170 a 210 palavras). |
| **10 min — autorrevisão** | Lista da seção 4 do material de 06/11: tema, coesão, estrutura, gramática e formato (sem nenhuma identificação). |

**Lembretes do edital (itens 12.2 a 12.8):** o que passar da linha 20 não é lido; fuga ao tema, outra tipologia ou **qualquer identificação** zeram a nota; é preciso ter **12 ou mais** dos 40 pontos.

**Para a correção de 16/11:** digite o texto **exatamente como escreveu** (com os erros) e diga quantas linhas ocupou na folha. A correção será pela Tabela 12.2, critério por critério.

---

## 13. Gabarito e comentários

### Placar de referência

| Questão | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| **Gabarito** | D | A | E | E | B | B | C |
| Status | TRT-1 2018, **pós-recursos** | ITEP-RN 2018, **pós-recursos** | UFPB 2019, **pós-recursos** | DESENBAHIA 2017, **definitivo** | SEJUS-CE 2017, **pós-recursos** | PMPE 2023 (2º Ten.), **definitivo** | PMPE 2023 (2º Ten.), **definitivo** |

Comentários: **análise do tutor**, com base na Cartilha do CERT.br.

### Questão 1 — gabarito D (spyware)

**Por que a (D) está correta:** capturar **teclas digitadas** é o que faz o **keylogger**; capturar a tela e a posição nos **cliques de mouse** é o que faz o **screenlogger**. A Cartilha classifica os dois como **"tipos específicos de programas spyware"**, programa "projetado para monitorar as atividades de um sistema e enviar as informações coletadas para terceiros". Como a questão junta teclas **e** cliques e oferece só a categoria geral, a resposta é **spyware**.

**Por que as outras estão erradas:**
- **(A) ransomware.** Sequestra os dados (em geral, criptografando-os) e pede resgate. Não tem como função capturar teclas e cliques.
- **(B) cracker.** É uma **pessoa** que quebra a segurança de sistemas com fins maliciosos, não um software.
- **(C) alienware.** É uma **marca de computadores**, não um tipo de malware. O nome parece "malware" de propósito.
- **(E) hardware.** É a parte **física** do computador. O enunciado fala em "software".

**Detalhe que mais derruba candidatos:** procurar "keylogger" nas alternativas e, sem encontrar, marcar qualquer nome que "pareça" malware. Lembre a hierarquia: keylogger e screenlogger estão **dentro** de spyware.

### Questão 2 — gabarito A (apenas I e III)

**Julgamento de cada assertiva:**
- **I — Correta.** É a definição de phishing da Cartilha: fraude para obter dados pessoais e financeiros com "utilização combinada de meios técnicos e engenharia social".
- **II — Incorreta.** "Monitorar as atividades de um sistema e enviar as informações coletadas para terceiros" é a definição de **spyware**. O worm é o programa que se **propaga automaticamente pelas redes**, enviando cópias de si mesmo.
- **III — Correta.** É a definição de cavalo de troia da Cartilha: além das funções aparentes, executa outras, normalmente maliciosas, sem o conhecimento do usuário.
- **IV — Incorreta.** "Se propagar automaticamente pelas redes, enviando cópias de si mesmo de computador para computador" é a definição de **worm**. O bot até se propaga de forma "similar ao do worm", mas o que o **define** é dispor de **mecanismos de comunicação com o invasor** que permitem **controlá-lo remotamente**. A assertiva deu ao bot a definição de outro malware e omitiu a característica essencial.

**Por que cada alternativa está certa ou errada:**
- **(A) Apenas I e III — correta.** São as duas definições fiéis à Cartilha.
- **(B) Apenas II e IV — errada.** Marca exatamente as duas assertivas com nomes trocados.
- **(C) Apenas I, II e III — errada.** Inclui a II (definição de spyware atribuída ao worm).
- **(D) Apenas II e III — errada.** Inclui a II e exclui a I, que é correta.
- **(E) Apenas I, III e IV — errada.** Inclui a IV (definição de worm atribuída ao bot).

**Detalhe que mais derruba candidatos:** a IV parece verdadeira porque o bot **também** se propaga. Em questão de definição, a pergunta é: "essa é a definição **deste** nome?". A definição dada é a do worm.

### Questão 3 — gabarito E

**Por que a (E) está correta:** reproduz as duas primeiras características das mensagens de phishing na Cartilha: "tentam se passar pela comunicação oficial de uma instituição conhecida, como um banco, uma empresa ou um site popular" e "procuram atrair a atenção do usuário, seja por curiosidade, por caridade ou pela possibilidade de obter alguma vantagem financeira".

**Por que as outras estão erradas** (cada uma é a definição de **outro** conceito da Cartilha):
- **(A)** É a definição de **spam** (e-mails não solicitados em massa; UCE quando exclusivamente comercial).
- **(B)** É a definição de **códigos maliciosos (malware)** e de suas formas de infecção.
- **(C)** É a definição de **spyware** (monitorar e enviar informações; uso legítimo ou malicioso).
- **(D)** É a definição de **vírus** (insere cópias de si mesmo em outros programas e arquivos).

**Detalhe que mais derruba candidatos:** a (A) fala de e-mails "enviados para um grande número de pessoas", e muita gente associa phishing a e-mail em massa. Spam é mensagem **não solicitada**; phishing é **fraude imitando instituição**.

### Questão 4 — gabarito E

**Por que a (E) está correta:** é a definição de phishing da Cartilha, palavra por palavra: "tipo de fraude por meio da qual um golpista tenta obter dados pessoais e financeiros de um usuário, pela utilização combinada de meios técnicos e engenharia social".

**Por que as outras estão erradas:**
- **(A)** É a definição de **fraude de antecipação de recursos** (*advance fee fraud*): pagamento adiantado com promessa de benefício futuro.
- **(B)** É a definição de **furto de identidade** (*identity theft*): se passar por outra pessoa.
- **(C)** É a definição de **boato** (*hoax*): mensagem alarmante ou falsa atribuída a uma instituição.
- **(D)** É a definição de **pharming** (redireção por alteração do DNS), mas a alternativa deu a ela o nome de **hoax**. Nome trocado.

**Detalhe que mais derruba candidatos:** a (D) contém a palavra "Phishing" e um mecanismo técnico (DNS), o que parece sofisticado. Mas hoax é boato; o tipo de phishing por DNS é o **pharming**.

### Questão 5 — gabarito B (certificado auto-assinado)

**Por que a (B) está correta:** a Cartilha descreve o uso **malicioso** do certificado autoassinado: o atacante cria o certificado e induz o usuário (por exemplo, com phishing) a **instalá-lo** no navegador. Depois de instalado, o navegador passa a aceitar esse certificado, e se torna possível estabelecer **conexões cifradas com sites fraudulentos sem que o navegador emita alertas**. O enunciado reproduz esse trecho.

**Por que as outras estão erradas:**
- **(A) certificado EV SSL.** É o certificado com validação **mais rigorosa** do solicitante, emitido por uma AC. É o oposto: aumenta a confiança na identidade do site.
- **(C) criptografia de chaves assimétricas.** É um **método** criptográfico, não algo que se "instala" de forma maliciosa no navegador para enganar o usuário. O problema descrito está no **certificado**, que associa a chave a uma identidade.
- **(D) criptografia de chave simétrica.** Também é um **método** (uma só chave), sem relação com o mecanismo de confiança do navegador.

**Detalhe que mais derruba candidatos:** marcar uma das criptografias porque o enunciado fala em "conexões cifradas". A pista decisiva é "**instalado**" + "**sem alertas**": quem gera ou elimina alertas no navegador é o **certificado**.

### Questão 6 — gabarito B (VPN)

**Por que a (B) está correta:** a VPN cria um **túnel criptografado** sobre a Internet. Com ela, a comunicação em operações sensíveis ganha **confidencialidade** e **integridade**, e os policiais podem acessar com segurança a rede interna mesmo fora das instalações. É o único procedimento que usa a Internet **e** protege a comunicação.

**Por que as outras estão erradas:**
- **(A) redes sociais abertas "sem necessidade de protocolos de segurança ou privacidade".** Coletar informação em fontes abertas pode até fazer parte da inteligência, mas dispensar segurança e privacidade expõe a operação e os agentes (fere a **confidencialidade**). O defeito está no "sem necessidade".
- **(C) uso exclusivo de e-mails públicos para comunicação interna.** Contas públicas e pessoais ficam fora do controle institucional (sem logs, sem política de acesso) e são alvo fácil de phishing e de invasão.
- **(D) proibição completa de qualquer serviço de Internet.** Medida desproporcional: inviabiliza o trabalho (**disponibilidade**) e não é "procedimento seguro de comunicação utilizando a Internet", que é o que o enunciado pede.
- **(E) intranet aberta ao público geral.** Contradiz o próprio conceito de intranet (rede **restrita**) e expõe informações operacionais. Transparência não justifica abrir dados sigilosos.

**Detalhe que mais derruba candidatos:** a (D) parece "a mais segura". Mas o comando pede um procedimento seguro **usando a Internet**; proibir tudo foge do que foi pedido.

### Questão 7 — gabarito C (NGFW)

> O comando pede a medida **mais eficaz**. Várias alternativas trazem medidas que ajudam; a resposta é a que oferece proteção mais ampla, sem criar outro risco.

**Por que a (C) está correta:** o firewall de próxima geração junta **várias camadas** num só mecanismo: a filtragem do firewall tradicional e um **sistema de prevenção contra intrusões (IPS)**, que detecta **e bloqueia** ataques, além da inspeção do tráfego por aplicação. Protege todos os computadores do ambiente ao mesmo tempo, na entrada e na saída da rede.

**Por que as outras não são a mais eficaz:**
- **(A) antivírus gratuito, "proteção básica".** É uma camada útil, mas **única** e assumidamente **básica**. A Cartilha lembra que o antimalware não impede a exploração de vulnerabilidades via rede.
- **(B) senha forte com troca a cada 30 dias.** Senha forte é boa prática, mas protege só a autenticação. A troca obrigatória muito frequente leva os usuários a criar senhas previsíveis, e as orientações atuais a desaconselham sem indício de vazamento *(citado pelo tutor)*.
- **(D) liberar só sites aprovados.** Reduz um vetor (navegação), mas não protege contra os demais (e-mail, pen-drive, ataques vindos da rede) e engessa o trabalho.
- **(E) backups diários no mesmo local físico.** O backup não **melhora a segurança** dos computadores (não impede ataques), e guardá-lo **no mesmo local** contraria a Cartilha, que manda manter cópias redundantes em locais diferentes contra incêndio, inundação e furto.

**Detalhe que mais derruba candidatos:** marcar (B) ou (E) porque "senha forte" e "backup diário" soam como boas práticas. Leia o **complemento**: a troca a cada 30 dias e o **mesmo local físico** são os defeitos.

### Revisão espaçada — respostas *(exercícios do tutor, não oficiais)*

**a) Conectivos:**
1. **porquanto** = **causa** (= porque, visto que). Não é oposição.
2. **conquanto** = **concessão** (= embora).
3. **destarte** = **conclusão** (= assim, portanto).
4. **para que** = **finalidade** (objetivo). Não é consecutiva: consecutiva é "tão/tanto… que" (resultado).
5. **mesmo depois de** = **concessão** (o fato esperado não impediu o resultado). Não é adversativa ("mas, porém").

**b) Condicional** (p = o e-mail pede a senha; q = é phishing; p → q):
6. **Equivalente (contrapositiva):** "Se **não** é phishing, então o e-mail **não** pede a senha." (Inverte, nega as duas e **mantém o "se"**.) Outra equivalente: "O e-mail **não** pede a senha **ou** é phishing."
7. **Negação:** "O e-mail pede a senha **e não** é phishing." (Mantém a 1ª, nega a 2ª e usa "**e**".)

**c) Leitura do comando:** a questão 2 pede a alternativa que aponta as **corretas**: julgue cada assertiva (I a IV) e só depois procure a combinação. A questão 7 pede a medida **mais eficaz**: não basta achar uma alternativa "correta"; compare todas e escolha a mais ampla e sem defeito.
