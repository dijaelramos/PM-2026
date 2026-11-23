# Questões do dia — sexta-feira, 13/11/2026 — Informática

> **Material de estudo:** [2026-11-13_Informatica_e_Redacao.md](2026-11-13_Informatica_e_Redacao.md). Estude o material antes: este arquivo traz só o que é para responder.
> **Como responder:** faça o **estudo dirigido** por escrito, sem consultar; depois resolva as **questões** e anote suas letras. Mande as respostas ao Orquestrador para a correção. O **gabarito comentado** está no fim deste arquivo: só confira depois de responder.
> **Reserva do Simulado 1:** a Q33 da prova de Soldado PMPE 2023 trata deste item e não foi usada.

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

### Estudo dirigido — respostas *(resposta-modelo do tutor, não oficial)*

1. **Confidencialidade**: proteger a informação contra **acesso não autorizado** (violação: um boletim com dados de vítima vaza para um grupo de mensagens). **Integridade**: proteger contra **alteração não autorizada** (violação: alguém altera o registro de uma ocorrência no sistema). **Disponibilidade**: o recurso **disponível sempre que necessário** (violação: um DDoS derruba o sistema de consulta na hora da abordagem). (Os exemplos são livres; confira o requisito.)
2. **Identificação**: a entidade **diz quem é** (digita a matrícula). **Autenticação**: verifica se ela **é mesmo** quem diz (senha, código no celular, biometria). **Autorização**: determina **o que ela pode fazer** (consultar, mas não editar).
3. É **evitar que alguém negue** que foi ele quem executou uma ação. É garantido pela **assinatura digital** (prova de autoria). Senha compartilhada destrói o não repúdio.
4. **Vulnerabilidade** é a **fraqueza** (falha de projeto, implementação ou configuração). **Ameaça** é o que **pode explorar** a fraqueza. **Risco** é a **chance** de a ameaça explorar a fraqueza e causar dano.
5. **Scan**: **varredura** de redes para achar computadores ativos e coletar informações (preparação de ataque). **E-mail spoofing**: **alterar o cabeçalho** para parecer que veio de outra origem (autenticidade). **Sniffing**: **inspecionar o tráfego** com sniffers (confidencialidade). **Força bruta**: adivinhar usuário e senha por **tentativa e erro** (autenticação). **Defacement**: **alterar o conteúdo** de uma página web, "pichação" (integridade). **DDoS**: **tirar de operação** um serviço com um **conjunto de computadores**, sem invadir (disponibilidade).
6. Técnica de **persuasão** que explora a **confiança, a curiosidade ou o medo** das pessoas para que entreguem informações ou executem ações. É ingrediente do phishing e de outros golpes.
7. O **vírus** se propaga **inserindo cópias de si em outros programas e arquivos** e depende da **execução do hospedeiro**. O **worm** se propaga **sozinho pela rede**, enviando cópias de si, **sem hospedeiro**, explorando vulnerabilidades.
8. Os dois se propagam automaticamente, mas o **bot** tem **comunicação com o invasor** e é **controlado remotamente**. **Zumbi** é a máquina infectada por bot; **botnet** é a rede formada por vários zumbis.
9. Programa que, além das funções para as quais foi **aparentemente projetado**, executa **outras funções**, em geral maliciosas, **sem o conhecimento do usuário**. **Não se replica sozinho**: precisa ser executado pelo usuário.
10. Programa que **monitora as atividades** do sistema e **envia as informações a terceiros** (uso legítimo ou malicioso). **Keylogger**: as **teclas digitadas**. **Screenlogger**: a **tela e a posição do cursor** quando o **mouse é clicado** (contra teclados virtuais). **Adware**: apresenta **propagandas**.
11. O **backdoor** permite o **retorno do invasor** a um computador comprometido. O **rootkit** é um conjunto de programas e técnicas para **esconder e assegurar a presença** do invasor ou de outro malware.
12. Malware que torna os dados **inacessíveis** (em geral por **criptografia**) e exige **resgate**, normalmente em criptomoeda. A principal defesa contra a perda dos dados é o **backup** (atualizado, redundante, com cópia **fora do local** e desconectada).
13. "Fraude por meio da qual um golpista tenta **obter dados pessoais e financeiros** de um usuário, pela utilização **combinada de meios técnicos e engenharia social**." As mensagens: (1) **se passam por instituição conhecida**; (2) atraem por **curiosidade, caridade ou vantagem financeira**; (3) ameaçam **sérias consequências** se o usuário não agir; (4) **induzem a fornecer dados** pessoais e financeiros.
14. **Phishing**: fraude para obter **dados** (meios técnicos + engenharia social). **Pharming**: phishing que **redireciona** a navegação a sites falsos **alterando o DNS**. **Furto de identidade**: **se passar por outra pessoa** para obter vantagem. **Fraude de antecipação de recursos**: induzir a **pagar adiantado** com a promessa de um **benefício futuro** (Golpe da Nigéria). **Boato (hoax)**: mensagem de **conteúdo alarmante ou falso**, atribuída a instituição importante. **Spam**: e-mails **não solicitados** enviados a **muitas pessoas** (comercial = UCE).
15. **Spear phishing**: phishing **direcionado** a uma pessoa ou órgão específico, com dados reais da vítima. **Smishing**: phishing por **SMS**.
16. **Simétrica**: **uma só chave** (secreta) para cifrar e decifrar; **mais rápida**, boa para grandes volumes; exige canal seguro para combinar a chave; ex.: **AES, 3DES**. **Assimétrica**: **duas chaves**, **pública** e **privada**; **mais lenta**; ex.: **RSA**, DSA, ECC. Na prática, as duas são usadas juntas (TLS, PGP, S/MIME).
17. Para **sigilo**: cifra-se com a **chave pública do destinatário** (só a privada dele decifra). Para **assinar**: usa-se a **própria chave privada** (sobre o hash), e qualquer um verifica com a **chave pública** do remetente.
18. **Função de resumo** que gera um resultado **único e de tamanho fixo**, qualquer que seja o tamanho da informação, sem caminho inverso. Serve para verificar a **integridade**: se o hash mudou, o arquivo mudou. (Ex.: SHA-256.)
19. Garante **autenticidade** (quem assinou), **integridade** (o conteúdo não mudou) e **não repúdio**. **Não garante sigilo**: o texto pode continuar legível.
20. **Certificado digital**: registro eletrônico que **distingue uma entidade e associa a ela uma chave pública**, emitido por uma **Autoridade Certificadora**. **Autoassinado**: o **dono e o emissor são a mesma entidade**. Uso malicioso: o golpista convence a vítima a **instalar** no navegador um certificado autoassinado dele; o navegador passa a confiar, e o site falso aparece como seguro.
21. Certificado emitido sob um **processo mais rigoroso de validação** do solicitante: verifica se a empresa foi legalmente registrada, está ativa e detém o domínio e o endereço. O navegador mostra o **nome da instituição** em destaque.
22. **Autenticação, integridade e confidencialidade**. **Não**: o cadeado indica que a **conexão é cifrada**, não que o site é honesto. Um site falso pode ter HTTPS válido para o **domínio falso**; confira o endereço.
23. **Aquilo que você sabe** (senha, pergunta de segurança), **aquilo que você possui** (token, cartão de senhas, celular) e **aquilo que você é** (biometria). **2FA**: combina **dois grupos diferentes** (ex.: senha + código no celular). Duas senhas não são 2FA.
24. O **antimalware** **detecta e anula ou remove** códigos maliciosos. O **firewall** **bloqueia acessos não autorizados** vindos da Internet (e o envio de dados por malware). Um não faz o trabalho do outro: segurança é em **camadas**, por isso a Cartilha recomenda **os dois**.
25. **NGFW** junta o firewall tradicional (portas, endereços, protocolos) com **inspeção profunda de pacotes**, **controle por aplicação e por usuário** e **IPS** integrado. **IDS** **detecta e alerta**; **IPS** **detecta e bloqueia**.
26. **Rede privada virtual**: cria um **túnel criptografado** sobre a Internet, com **confidencialidade e integridade**. Use para **acesso remoto seguro** à intranet e para comunicação sensível em rede pública. Não protege contra malware já instalado.
27. Quaisquer quatro: manter os backups **atualizados, automáticos e conferidos**; guardá-los em local seguro, com **acesso restrito**; **criptografar dados sensíveis**; manter **backups redundantes** em pelo menos **dois lugares** (casa, escritório, remoto); **testar** a recuperação periodicamente; ter uma cópia **fora do local** (3-2-1).

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
