# Material do dia — quinta-feira, 28/01/2027 — Informática (3 h)

> **Sessão do plano:** Informática, **sessão 10/10** (última de Informática no plano): **revisão integrada dos itens 1 a 7** (internet e intranet, segurança, backup, hardware, arquivos, Windows 11, Office 2019 e LibreOffice 7), com questões, correção e retomada de dúvidas ([plano](../Plano_de_Estudos_PMPE_2026.md)).
> **Distribuição (do plano):** 30 min de revisão · 1 h 30 de tópicos e exemplos · 1 h de questões com correção.
> **Formato:** síntese em quadros, com os níveis 🟡 (aplicar) e 🔴 (acertar a prova) em cada item ([regra](../.github/regras/material_e_correcao.md)). Cada item aponta o material completo em que foi estudado.
> **Fontes:** [Informática (base)](../Base_de_Conhecimento/INFORMÁTICA/Informática.txt), a [Cartilha de Segurança do CERT.br](../Base_de_Conhecimento/INFORMÁTICA/Cartilha_CERTbr_2012_trechos.md) e a [lista oficial de atalhos](../Base_de_Conhecimento/INFORMÁTICA/Atalhos_oficiais_Windows11_e_LibreOffice7.md), pelos materiais das sessões 1 a 9.
> **Questões do dia:** em arquivo separado, [2027-01-28_Informatica_Questoes.md](2027-01-28_Informatica_Questoes.md), com o estudo dirigido, o mapa, 8 questões **oficiais** da AOCP (1 da **prova de Soldado PMPE 2023**) e 4 **autorais**, uma ou mais por item do edital.
> **Use o Simulado 1:** antes de começar, olhe no seu **registro de erros** (19/01) quais questões de Informática (31 a 40) você errou ou chutou, e dê atenção dobrada a esses itens.

## Roteiro

| Bloco | O que fazer |
|---|---|
| **30 min — revisão** | Revisão espaçada (seção 9) e o registro de erros de Informática do Simulado 1. |
| **1 h 30 — tópicos e exemplos** | Seções 1 a 7 (um item por seção, cerca de 12 min cada) e as pegadinhas (seção 8). Onde travar, abra o material completo indicado. |
| **1 h — questões com correção** | As 12 questões do [arquivo de questões](2027-01-28_Informatica_Questoes.md) e a correção. Termine fazendo o estudo dirigido. |

---

## 1. Internet e intranet (item 1)

| Conceito | Lembrete |
|---|---|
| **Internet** | Rede **mundial** de redes, pública, que usa o conjunto de protocolos **TCP/IP**; conexões por fibra, cabo, telefone, rádio, satélite |
| **Intranet** | Rede **privada** de uma organização, com as **mesmas tecnologias** da internet (TCP/IP, navegador, páginas web); acesso **restrito** aos membros, com **autenticação** |
| **Extranet** | Parte da intranet aberta a **parceiros externos** autorizados |
| **Ligação** | A intranet **pode** estar ligada à internet (com firewall) e pode ser acessada de fora por **VPN** |

🔴 **Para a prova:** intranet **não** é sinônimo de "rede sem internet" e **não** usa tecnologia diferente; o que a define é o **acesso restrito**.

## 2. Ferramentas de internet e nuvem (item 2)

| Tema | Lembrete |
|---|---|
| **Navegadores** | Chrome, Edge, Firefox. Atalhos comuns: **Ctrl + T** nova guia; **Ctrl + Shift + T** reabrir guia fechada; **Ctrl + H** histórico; **Ctrl + J** downloads; **Ctrl + D** favoritar; **Ctrl + Shift + N** (Chrome) / **Ctrl + Shift + P** (Firefox e Edge) janela anônima/privativa; **F5** recarregar |
| **Navegação anônima** | Não guarda **histórico, cookies e dados de formulário** no computador, mas **não** esconde a navegação do provedor, do empregador ou dos sites |
| **Busca no Google** | **"aspas"** = expressão exata; **-palavra** exclui; **site:** busca num site; **filetype:** tipo de arquivo |
| **E-mail** | **Cc** (cópia visível) × **Cco** (cópia oculta); anexos; protocolos **SMTP** (envio), **POP3** e **IMAP** (recebimento; o IMAP mantém no servidor) |
| **Nuvem** | Armazenar e usar serviços pela internet (OneDrive, Google Drive): acesso de qualquer lugar e compartilhamento; **SaaS** (software como serviço, ex.: webmail), **PaaS**, **IaaS** |

🔴 **Para a prova:** **Ctrl + J** = downloads; **anônimo ≠ invisível**; **"aspas"** = frase exata.

## 3. Segurança da informação (item 3) — material de [13/11](2026-11-13_Informatica_e_Redacao.md)

| Ameaça | O que faz |
|---|---|
| **Vírus** | Precisa de um **hospedeiro** (arquivo) e de **execução** para se propagar |
| **Worm** | Espalha-se **sozinho** pela rede, explorando vulnerabilidades |
| **Cavalo de troia** | Parece útil, mas **esconde** função maliciosa |
| **Spyware** | **Espiona** e envia informações; **keylogger** grava as **teclas**; **screenlogger**, a tela |
| **Ransomware** | **Sequestra** (criptografa) os dados e pede **resgate** |
| **Botnet** | Rede de computadores "zumbis" controlados a distância |
| **Phishing** | **Golpe** que se passa por instituição confiável para roubar dados (engenharia social) |

| Proteção | Lembrete |
|---|---|
| **Antivírus / antimalware** | Detecta e remove malware; o **anti-spyware** é dedicado aos espiões |
| **Firewall** | Filtra o **tráfego** de rede (não substitui o antivírus) |
| **Criptografia** | **Simétrica** (mesma chave; ex.: AES) × **assimétrica** (chave pública e privada; ex.: RSA); **hash** (ex.: SHA) garante **integridade** |
| **Autenticação** | Algo que você **sabe** (senha), **tem** (token) ou **é** (biometria); **dois fatores** = dois tipos diferentes |
| **VPN** | "Túnel" **criptografado** para acesso remoto seguro a uma rede |
| **Pilares** | **Confidencialidade, integridade, disponibilidade** (e autenticidade) |

🔴 **Para a prova:** nenhuma medida isolada protege **tudo**: confiar só no firewall ou só no antivírus é sempre a alternativa errada.

## 4. Armazenamento e backup (item 4) — material de [26/11](2026-11-26_Informatica.md)

| Tipo de backup | Copia | Marca os arquivos? |
|---|---|---|
| **Completo** | **Tudo** o que foi selecionado | Sim |
| **Incremental** | O que mudou desde o **último backup de qualquer tipo** | Sim |
| **Diferencial** | O que mudou desde o **último backup completo** | Não (cresce a cada dia) |

- **Restaurar:** com incrementais, precisa do **completo + todos os incrementais**; com diferenciais, do **completo + o último diferencial**.
- **Regra 3-2-1:** **3** cópias, em **2** tipos de mídia, **1** fora do local. Backup no **mesmo** local do original é erro.

## 5. Hardware, software, arquivos e pastas (item 5) — materiais de [09/12](2026-12-09_Informatica.md) e [21/12](2026-12-21_Informatica_e_Redacao.md)

| Tema | Lembrete |
|---|---|
| **Software** | **Básico** (sistema operacional: Windows, Linux), **aplicativo** (Word, Photoshop), **utilitário** (manutenção e proteção: **antivírus**, compactador, desfragmentador) |
| **Memórias** | **RAM**: volátil, de trabalho; **ROM**: não volátil, de inicialização (firmware/BIOS/UEFI); **cache**: rapidíssima, entre CPU e RAM; ordem de velocidade: registradores > cache > RAM > armazenamento |
| **Armazenamento** | **HD** (magnético), **SSD** (sem partes móveis, mais rápido), pen drive, cartão SD, nuvem |
| **Periféricos** | Entrada (teclado, mouse, scanner), saída (monitor, impressora), entrada e saída (touchscreen, multifuncional) |
| **Arquivos** | **Copiar** (Ctrl + C / Ctrl + V) × **mover** (Ctrl + X); arrastar na **mesma unidade** = mover, em **outra unidade** = copiar; **Shift + Delete** exclui sem passar pela Lixeira; **F2** renomeia |

## 6. Windows 11 (item 6) — materiais de [21/12](2026-12-21_Informatica_e_Redacao.md) e [13/01](2027-01-13_Informatica.md)

- **Atalhos:** Win + E Explorador; Win + D área de trabalho; Win + L bloquear; Win + I Configurações; Win + R Executar; Win + V área de transferência; Win + Tab Visão de Tarefas; Win + Shift + S captura; Win + PrtScn salva print; Ctrl + Shift + Esc Gerenciador de Tarefas.
- **Configurações × Painel de Controle** (os dois existem); **Segurança do Windows** (antivírus Microsoft Defender e firewall); Restauração do Sistema ≠ backup.
- **Prompt:** dir, cd, md, rd, copy, move, del, ren; ipconfig (mostra), **ping** (testa), tracert, nslookup, tasklist/taskkill.

## 7. Office 2019 e LibreOffice 7 (item 7) — materiais de [23/12](2026-12-23_Informatica_e_Redacao.md), [28/12](2026-12-28_Informatica_e_Redacao.md), [30/12](2026-12-30_Informatica_e_Redacao.md) e [13/01](2027-01-13_Informatica.md)

| Tema | Word 2019 | Writer 7 |
|---|---|---|
| Salvar | **Ctrl + B** | **Ctrl + S** |
| Negrito / sublinhado | **Ctrl + N** / **Ctrl + S** | **Ctrl + B** / **Ctrl + U** |
| Formato padrão | .docx | .odt |

| Tema | Lembrete |
|---|---|
| **Excel / Calc** | Fórmula começa com **=**; precedência (potência antes de × e +); **$A$1** absoluta; **F4** alterna; **SE**, **PROCV** (1ª coluna), **CONT.SE / CONT.SES**, **SOMASE**; erros #DIV/0!, #REF!, #NOME?, ####; outra planilha: Excel **Plan2!A1**, Calc **$Plan2.A1** |
| **PowerPoint / Impress** | **F5** do início, **Shift + F5** do slide atual; transição (entre slides) × animação (objetos); slide mestre; .pptx / .odp |
| **Integração** | Todos abrem e salvam os formatos uns dos outros; PDF nativo; **colar vínculo** atualiza; **mala direta** = documento + fonte de dados |

## 8. Pegadinhas da banca (itens 1 a 7)

| A banca escreve… | O certo é… | Item |
|---|---|---|
| O que define a intranet é usar outra tecnologia | O que a define é o **acesso restrito** (a tecnologia é a mesma) | 1 |
| Intranet e internet são sempre redes isoladas | Podem estar **ligadas** (com firewall, VPN) | 1 |
| A navegação anônima esconde o usuário do provedor | Só não guarda dados **no computador** | 2 |
| O firewall elimina a necessidade de antivírus | São **complementares** | 3 |
| O worm precisa de um arquivo hospedeiro | Quem precisa é o **vírus** | 3 |
| O backup diferencial copia o que mudou desde o último incremental | Desde o último **completo** | 4 |
| Guardar o backup no mesmo HD é seguro | **3-2-1**: uma cópia **fora** | 4 |
| Antivírus é software aplicativo | É **utilitário** | 5 |
| A RAM guarda os dados quando o computador desliga | É **volátil** | 5 |
| ipconfig testa a conexão | **ping** testa | 6 |
| Ctrl + S salva no Word em português | Salva com **Ctrl + B** (Ctrl + S é sublinhado) | 7 |
| PROCV procura numa linha | Na **1ª coluna** | 7 |

## 9. Revisão espaçada (faça primeiro, em 10 min)

*Exercícios do tutor, não oficiais. As respostas estão no fim do [arquivo de questões](2027-01-28_Informatica_Questoes.md).*

1. **DH 16 (27/01).** Quem é jovem para o Estatuto da Juventude?
2. **DH 15 (26/01).** Qual é a ação penal nos crimes do Estatuto da Pessoa Idosa?
3. **DC 3 (20/01).** Qual é o prazo de validade do concurso público?
4. **LP 12 (05/01).** Quando a vírgula é obrigatória numa oração adjetiva?
5. **RL 2 (29/12).** De "se p, então q" e "não q", o que se conclui?
