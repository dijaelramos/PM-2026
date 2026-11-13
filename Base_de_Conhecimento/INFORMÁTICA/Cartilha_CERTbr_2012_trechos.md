# Cartilha de Segurança para Internet (CERT.br, versão 4.0, 2012) — trechos

> **Tópicos do edital:** Informática, item 3 (segurança da informação) e item 4 (backup).
> **Fonte:** CERT.br/NIC.br, *Cartilha de Segurança para Internet*, versão 4.0, São Paulo, 2012 — PDF oficial em https://cartilha.cert.br/livro/cartilha-seguranca-internet.pdf, baixado em **13/11/2026**.
> **Licença:** Creative Commons Atribuição-Uso não-comercial-Vedada a criação de obras derivadas 3.0 (http://cartilha.cert.br/cc/). Os trechos **entre aspas** e os da seção 1 foram copiados **sem alteração** do texto; só foram retirados os números de notas de rodapé e as legendas de figuras, e os acentos foram restaurados (a extração do PDF separava os acentos das letras). O que está fora de aspas é resumo do tutor, com as palavras da Cartilha sempre que possível.
> **Por que esta versão:** as provas da AOCP de 2017 a 2019 do banco copiam literalmente as definições desta edição (por exemplo, UFPB 2019 Q25, DESENBAHIA 2017 Q20, ITEP-RN 2018 Q25 e SEJUS-CE 2017 Q18). O site atual da Cartilha (fascículos) tem textos mais novos e com outra redação; o **ransomware** não aparece na versão de 2012.

## 1. Requisitos básicos de segurança (Capítulo 7)

- **Identificação:** permitir que uma entidade se identifique, ou seja, diga quem ela é.
- **Autenticação:** verificar se a entidade é realmente quem ela diz ser.
- **Autorização:** determinar as ações que a entidade pode executar.
- **Integridade:** proteger a informação contra alteração não autorizada.
- **Confidencialidade ou sigilo:** proteger uma informação contra acesso não autorizado.
- **Não repúdio:** evitar que uma entidade possa negar que foi ela quem executou uma ação.
- **Disponibilidade:** garantir que um recurso esteja disponível sempre que necessário.

## 2. Ataques na Internet (Capítulo 3)

- **Vulnerabilidade:** "Uma vulnerabilidade é definida como uma condição que, quando explorada por um atacante, pode resultar em uma violação de segurança. Exemplos de vulnerabilidades são falhas no projeto, na implementação ou na configuração de programas, serviços ou equipamentos de rede."
- **Varredura em redes (Scan):** "Varredura em redes, ou scan, é uma técnica que consiste em efetuar buscas minuciosas em redes, com o objetivo de identificar computadores ativos e coletar informações sobre eles como, por exemplo, serviços disponibilizados e programas instalados." (Não confundir *scan* com *scam*, que é golpe.)
- **Falsificação de e-mail (E-mail spoofing):** "Falsificação de e-mail, ou e-mail spoofing, é uma técnica que consiste em alterar campos do cabeçalho de um e-mail, de forma a aparentar que ele foi enviado de uma determinada origem quando, na verdade, foi enviado de outra."
- **Interceptação de tráfego (Sniffing):** "Interceptação de tráfego, ou sniffing, é uma técnica que consiste em inspecionar os dados trafegados em redes de computadores, por meio do uso de programas específicos chamados de sniffers."
- **Força bruta (Brute force):** "Um ataque de força bruta, ou brute force, consiste em adivinhar, por tentativa e erro, um nome de usuário e senha e, assim, executar processos e acessar sites, computadores e serviços em nome e com os mesmos privilégios deste usuário."
- **Desfiguração de página (Defacement):** "Desfiguração de página, defacement ou pichação, é uma técnica que consiste em alterar o conteúdo da página Web de um site."
- **Negação de serviço (DoS e DDoS):** "Negação de serviço, ou DoS (Denial of Service), é uma técnica pela qual um atacante utiliza um computador para tirar de operação um serviço, um computador ou uma rede conectada à Internet. Quando utilizada de forma coordenada e distribuída, ou seja, quando um conjunto de computadores é utilizado no ataque, recebe o nome de negação de serviço distribuído, ou DDoS (Distributed Denial of Service). O objetivo destes ataques não é invadir e nem coletar informações, mas sim exaurir recursos e causar indisponibilidades ao alvo."

## 3. Códigos maliciosos (Capítulo 4)

- **Malware:** "Códigos maliciosos (malware) são programas especificamente desenvolvidos para executar ações danosas e atividades maliciosas em um computador." Formas de infecção citadas: exploração de vulnerabilidades dos programas instalados; auto-execução de mídias removíveis infectadas, como pen-drives; acesso a páginas Web maliciosas com navegadores vulneráveis; ação direta de atacantes; execução de arquivos previamente infectados.
- **Vírus:** "Vírus é um programa ou parte de um programa de computador, normalmente malicioso, que se propaga inserindo cópias de si mesmo e se tornando parte de outros programas e arquivos. Para que possa se tornar ativo e dar continuidade ao processo de infecção, o vírus depende da execução do programa ou arquivo hospedeiro, ou seja, para que o seu computador seja infectado é preciso que um programa já infectado seja executado."
- **Worm:** "Worm é um programa capaz de se propagar automaticamente pelas redes, enviando cópias de si mesmo de computador para computador. Diferente do vírus, o worm não se propaga por meio da inclusão de cópias de si mesmo em outros programas ou arquivos, mas sim pela execução direta de suas cópias ou pela exploração automática de vulnerabilidades existentes em programas instalados em computadores."
- **Bot:** "Bot é um programa que dispõe de mecanismos de comunicação com o invasor que permitem que ele seja controlado remotamente. Possui processo de infecção e propagação similar ao do worm, ou seja, é capaz de se propagar automaticamente, explorando vulnerabilidades existentes em programas instalados em computadores." O computador infectado é chamado de **zumbi**; o conjunto deles, de **botnet**.
- **Spyware:** "Spyware é um programa projetado para monitorar as atividades de um sistema e enviar as informações coletadas para terceiros. Pode ser usado tanto de forma legítima quanto maliciosa, dependendo de como é instalado, das ações realizadas, do tipo de informação monitorada e do uso que é feito por quem recebe as informações coletadas."
  - **Keylogger:** "capaz de capturar e armazenar as teclas digitadas pelo usuário no teclado do computador."
  - **Screenlogger:** "similar ao keylogger, capaz de armazenar a posição do cursor e a tela apresentada no monitor, nos momentos em que o mouse é clicado, ou a região que circunda a posição onde o mouse é clicado. É bastante utilizado por atacantes para capturar as teclas digitadas pelos usuários em teclados virtuais, disponíveis principalmente em sites de Internet Banking."
  - **Adware:** "projetado especificamente para apresentar propagandas." Pode ter uso legítimo (patrocínio de programas gratuitos) ou malicioso (propaganda direcionada com monitoramento oculto).
- **Backdoor:** "Backdoor é um programa que permite o retorno de um invasor a um computador comprometido, por meio da inclusão de serviços criados ou modificados para este fim."
- **Cavalo de troia (Trojan):** "Cavalo de troia, trojan ou trojan-horse, é um programa que, além de executar as funções para as quais foi aparentemente projetado, também executa outras funções, normalmente maliciosas, e sem o conhecimento do usuário." Em geral, precisa ser **explicitamente executado** para ser instalado.
- **Rootkit:** "Rootkit é um conjunto de programas e técnicas que permite esconder e assegurar a presença de um invasor ou de outro código malicioso em um computador comprometido."

## 4. Golpes e spam (Capítulos 2 e 5)

- **Furto de identidade:** "O furto de identidade, ou identity theft, é o ato pelo qual uma pessoa tenta se passar por outra, atribuindo-se uma falsa identidade, com o objetivo de obter vantagens indevidas."
- **Fraude de antecipação de recursos:** "A fraude de antecipação de recursos, ou advance fee fraud, é aquela na qual um golpista procura induzir uma pessoa a fornecer informações confidenciais ou a realizar um pagamento adiantado, com a promessa de futuramente receber algum tipo de benefício." (Exemplo clássico: o "Golpe da Nigéria".)
- **Phishing:** "Phishing, phishing-scam ou phishing/scam, é o tipo de fraude por meio da qual um golpista tenta obter dados pessoais e financeiros de um usuário, pela utilização combinada de meios técnicos e engenharia social." Ocorre por meio de mensagens eletrônicas que: "tentam se passar pela comunicação oficial de uma instituição conhecida, como um banco, uma empresa ou um site popular"; "procuram atrair a atenção do usuário, seja por curiosidade, por caridade ou pela possibilidade de obter alguma vantagem financeira"; "informam que a não execução dos procedimentos descritos pode acarretar sérias consequências"; e "tentam induzir o usuário a fornecer dados pessoais e financeiros".
- **Pharming:** "Pharming é um tipo específico de phishing que envolve a redireção da navegação do usuário para sites falsos, por meio de alterações no serviço de DNS (Domain Name System). Neste caso, quando você tenta acessar um site legítimo, o seu navegador Web é redirecionado, de forma transparente, para uma página falsa."
- **Boato (Hoax):** "Um boato, ou hoax, é uma mensagem que possui conteúdo alarmante ou falso e que, geralmente, tem como remetente, ou aponta como autora, alguma instituição, empresa importante ou órgão governamental."
- **Spam:** "Spam é o termo usado para se referir aos e-mails não solicitados, que geralmente são enviados para um grande número de pessoas. Quando este tipo de mensagem possui conteúdo exclusivamente comercial também é referenciado como UCE (Unsolicited Commercial E-mail)."

## 5. Autenticação (Capítulo 8)

"Existem três grupos básicos de mecanismos de autenticação, que se utilizam de: aquilo que você é (informações biométricas, como a sua impressão digital, a palma da sua mão, a sua voz e o seu olho), aquilo que apenas você possui (como seu cartão de senhas bancárias e um token gerador de senhas) e, finalmente, aquilo que apenas você sabe (como perguntas de segurança e suas senhas)."

Senha boa: "aquela que é difícil de ser descoberta (forte) e fácil de ser lembrada". Não usar: dados pessoais, sequências de teclado, palavras de listas conhecidas. Usar: números aleatórios, grande quantidade de caracteres, diferentes tipos de caracteres.

## 6. Criptografia (Capítulo 9)

- **Chave simétrica:** "também chamada de criptografia de chave secreta ou única, utiliza uma mesma chave tanto para codificar como para decodificar informações, sendo usada principalmente para garantir a confidencialidade dos dados." Exemplos: AES, Blowfish, RC4, 3DES e IDEA.
- **Chaves assimétricas:** "também conhecida como criptografia de chave pública, utiliza duas chaves distintas: uma pública, que pode ser livremente divulgada, e uma privada, que deve ser mantida em segredo por seu dono. Quando uma informação é codificada com uma das chaves, somente a outra chave do par pode decodificá-la." Exemplos: RSA, DSA, ECC e Diffie-Hellman.
- **Comparação:** a simétrica "é a mais indicada para garantir a confidencialidade de grandes volumes de dados, pois seu processamento é mais rápido", mas exige canal seguro para combinar a chave e é difícil de gerenciar; a assimétrica tem "processamento mais lento", mas facilita o gerenciamento e dispensa canal seguro. O ideal é o **uso combinado** (simétrica para codificar a informação; assimétrica para compartilhar a chave de sessão), usado por navegadores e leitores de e-mail. Exemplos: **SSL, PGP e S/MIME**.
- **Função de resumo (hash):** "um método criptográfico que, quando aplicado sobre uma informação, independente do tamanho que ela tenha, gera um resultado único e de tamanho fixo, chamado hash." Usos: verificar a integridade de arquivos e gerar assinaturas digitais. Exemplos: SHA-1, SHA-256 e MD5.
- **Assinatura digital:** "permite comprovar a autenticidade e a integridade de uma informação, ou seja, que ela foi realmente gerada por quem diz ter feito isto e que ela não foi alterada." Assina-se com a **chave privada**; verifica-se com a **chave pública**. A codificação é feita sobre o **hash**, não sobre o conteúdo inteiro.
- **Certificado digital:** "um registro eletrônico composto por um conjunto de dados que distingue uma entidade e associa a ela uma chave pública." É emitido por uma **Autoridade Certificadora (AC)**, que publica a **Lista de Certificados Revogados (LCR)**. A AC raiz tem certificado autoassinado.
- **Certificado autoassinado:** "é aquele no qual o dono e o emissor são a mesma entidade." Uso **legítimo**: ACs raízes, instituições de ensino e pequenos grupos que querem confidencialidade e integridade sem pagar uma AC comercial. Uso **malicioso**: "um atacante pode criar um certificado autoassinado e utilizar, por exemplo, mensagens de phishing, para induzir os usuários a instalá-lo. A partir do momento em que o certificado for instalado no navegador, passa a ser possível estabelecer conexões cifradas com sites fraudulentos, sem que o navegador emita alertas quanto à confiabilidade do certificado."
- **Certificado EV SSL (Extended Validation Secure Socket Layer):** "certificado emitido sob um processo mais rigoroso de validação do solicitante. Inclui a verificação de que a empresa foi legalmente registrada, encontra-se ativa e que detém o registro do domínio para o qual o certificado será emitido, além de dados adicionais, como o endereço físico."

## 7. Conexões (Capítulo 10)

- **Conexão padrão** ("http://"): "Não provê requisitos de segurança."
- **Conexão segura** ("https://", cadeado fechado): "Provê autenticação, integridade e confidencialidade, como requisitos de segurança."
- **Conexão segura com EV SSL:** mesmos requisitos, "porém com maior grau de confiabilidade quanto à identidade do site e de seu dono".
- **Certificado autoassinado ou cadeia não reconhecida:** "apesar de prover integridade e confidencialidade, não provê autenticação, já que não há garantias relativas ao certificado em uso."

## 8. Mecanismos de segurança (Capítulo 7)

- **Antimalware:** "Ferramentas antimalware são aquelas que procuram detectar e, então, anular ou remover os códigos maliciosos de um computador. Antivírus, antispyware, antirootkit e antitrojan são exemplos de ferramentas deste tipo."
- **Firewall pessoal:** "um tipo específico de firewall que é utilizado para proteger um computador contra acessos não autorizados vindos da Internet." O antimalware não impede que um atacante explore, via rede, uma vulnerabilidade nem evita o acesso por um backdoor; por isso, "além da instalação do antimalware, é necessário que você utilize um firewall pessoal".
- **Falso positivo:** situação em que um mecanismo de segurança aponta como maliciosa uma atividade legítima ("falso alarme").
- **Backups — cuidados (trecho):** manter os backups atualizados; "em locais seguros, bem condicionados (longe de poeira, muito calor ou umidade) e com acesso restrito"; automatizar e conferir se estão sendo feitos; fazer backup antes de grandes alterações e de enviar o computador para manutenção; "armazene dados sensíveis em formato criptografado"; "mantenha backups redundantes, ou seja, várias cópias, para evitar perder seus dados em um incêndio, inundação, furto ou pelo uso de mídias defeituosas (você pode escolher pelo menos duas das seguintes possibilidades: sua casa, seu escritório e um repositório remoto)"; testar a recuperação periodicamente.
