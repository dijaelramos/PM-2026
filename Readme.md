# Preparação para a PMPE 2026

Este repositório reúne materiais de estudo e agentes personalizados para apoiar a preparação para o concurso da Polícia Militar de Pernambuco (PMPE), com foco principal no cargo de Soldado/QPMG, código 201, conforme o Edital de Abertura nº 001/2026.

Não é uma aplicação de software: não há instalação de dependências, compilação ou execução de código. O conteúdo está organizado para consulta e uso no VS Code com o Copilot Chat.

## Por onde começar

1. Consulte o [edital de abertura de 2026](Editais/2026/2026%20-%20Edital%20de%20Abertura.pdf). A [versão em texto](Editais/2026/2026%20-%20Edital%20de%20Abertura.md) traz no topo um resumo conferido: banca, datas, distribuição das questões, critérios de aprovação e de redação.
2. Use o [conteúdo programático](Base_de_Conhecimento/CONTEUDOS_PROGRAMATICOS/Conteudos.txt) para localizar os assuntos previstos para Soldado/QPMG.
3. Siga o [plano de estudos vigente](Plano_de_Estudos_PMPE_2026.md) e mantenha o [perfil do estudante](Perfil_do_Estudante.md) atualizado.
4. Acesse os materiais na pasta da disciplina correspondente em `Base_de_Conhecimento/`.
5. No Copilot Chat, peça ajuda ao [Orquestrador de Estudos](.github/agents/orquestrador-estudos-pmpe.agent.md) ou diretamente a um dos tutores descritos abaixo.

O edital e seus anexos são a referência definitiva em caso de divergência. A prova de 2023 é material de prática e referência e não substitui o edital atual.

## Estrutura do repositório

| Pasta/arquivo | Conteúdo |
|---|---|
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | Regras comuns a todos os agentes: fatos do concurso, fontes, questões oficiais e autorais, busca na Web, planos de estudo e tom. |
| [`.github/regras/`](.github/regras/) | Roteiros detalhados que as regras comuns mandam ler antes de cada tarefa: questões oficiais, questão autoral sobre lei, busca na Web e planos de estudo. |
| [`.github/agents/`](.github/agents/) | Definições dos agentes, cada um só com o que é específico da sua disciplina (única cópia; é a pasta que o VS Code lê). |
| [`Perfil_do_Estudante.md`](Perfil_do_Estudante.md) | Disponibilidade, datas, nível e desempenho. Os agentes leem este arquivo para não perguntar de novo o que já está definido. |
| [`Plano_de_Estudos_PMPE_2026.md`](Plano_de_Estudos_PMPE_2026.md) | Plano vigente, com redação semanal e dois simulados. Também em [planilha](Plano_de_Estudos_PMPE_2026.xlsx). |
| [`Plano_de_Estudos_PMPE_2027.xlsx`](Plano_de_Estudos_PMPE_2027.xlsx) | Plano original, mantido sem alterações para referência (não tem redação nem simulados). |
| [`Base_de_Conhecimento/`](Base_de_Conhecimento/) | Conteúdo programático de referência e materiais separados por disciplina. |
| [`Base_de_Conhecimento/Assuntos.txt`](Base_de_Conhecimento/Assuntos.txt) | Material auxiliar: texto corrido do conteúdo programático. |
| [`Editais/2026/`](Editais/2026/) | Edital do concurso em foco, em PDF e em texto convertido (`.md`). |
| [`Editais/2023/`](Editais/2023/) | Caderno de prova oficial de Soldado PMPE 2023 (Instituto AOCP), em PDF e em texto convertido, com índice de questões por tópico. |
| [`Banco_de_Provas/`](Banco_de_Provas/README.md) | Outras provas oficiais de PM (AOCP: PMPE 2023 – 2º Tenente, PMGO 2022 e PMES 2022; FGV: PMSP 2022; CEV/UECE: PMCE 2025) e 8 provas da AOCP de outras áreas (sistema prisional, polícia civil, perícia, judiciário, universidade, legislativo, saúde e banco público), com critérios e níveis de cada avaliação, frequência de temas e índice de questões por tópico do edital da PMPE 2026. |
| [`Material_do_Dia/`](Material_do_Dia/README.md) | Material de cada sessão do plano (texto de estudo, questões oficiais com gabarito comentado e redação), feito só com provas oficiais. Peça ao Orquestrador "o estudo de hoje". |
| [`Banco_de_Provas/Questoes_Autorais/`](Banco_de_Provas/Questoes_Autorais/README.md) | 82 questões autorais no estilo AOCP (não oficiais), com gabarito comentado, para os tópicos com pouca ou nenhuma questão oficial e para completar o Simulado 2. |

### Materiais por disciplina

Em `Base_de_Conhecimento/`, os materiais estão distribuídos entre:

- **Língua Portuguesa** — guia em TXT;
- **História de Pernambuco** — apostila em PDF, com versão em texto (`HISTORIA_DE_PERNAMBUCO.md`), e resumo do período republicano com fontes (`Periodo_Republicano_PE.md`);
- **Raciocínio Lógico** — guia em TXT;
- **Informática** — guia em TXT;
- **Direito Constitucional** — texto da Constituição (arts. 1º a 144) em `.md` e arquivos de texto com links e referências;
- **Direitos Humanos e Legislação Extravagante** — textos completos das 13 normas do programa em `.md` e arquivos de texto com links;
- **Índice da legislação** — [`Base_de_Conhecimento/INDICE_DA_LEGISLACAO.md`](Base_de_Conhecimento/INDICE_DA_LEGISLACAO.md), com fonte, data da cópia e alterações de cada norma;
- **Conteúdo programático** — transcrição organizada dos assuntos de Soldado/QPMG.

Os formatos e o nível de detalhe variam entre disciplinas. Consulte também as fontes oficiais indicadas nos materiais quando precisar confirmar legislação, jurisprudência ou informação sujeita a atualização. Para a prova, vale a legislação vigente em 29/09/2026, data de publicação do edital (item 1.4.2).

## Agentes de estudo

Os perfis estão em `.github/agents/` e foram escritos para apoiar explicações, resolução de questões, exercícios, simulados, revisões e planos de estudo. Todos seguem as regras comuns de `.github/copilot-instructions.md`.

| Agente | Uso principal |
|---|---|
| [Orquestrador de Estudos — PMPE](.github/agents/orquestrador-estudos-pmpe.agent.md) | Encaminha o pedido ao tutor adequado, monta simulados, ajusta o plano e sintetiza temas multidisciplinares. |
| [Tutor de Língua Portuguesa](.github/agents/lingua-portuguesa-pmpe.agent.md) | Interpretação, gramática, ortografia, sintaxe e semântica. |
| [Tutor de História de Pernambuco](.github/agents/historia-pernambuco-pmpe.agent.md) | História, movimentos e cultura pernambucana previstos no programa. |
| [Tutor de Raciocínio Lógico](.github/agents/raciocinio-logico-pmpe.agent.md) | Lógica, argumentação, diagramas, contagem e probabilidade. |
| [Tutor de Informática](.github/agents/informatica-pmpe.agent.md) | Internet, segurança, arquivos, sistemas operacionais e ferramentas de escritório. |
| [Tutor de Direito Constitucional](.github/agents/direito-constitucional-pmpe.agent.md) | Direitos e garantias, organização do Estado e dos Poderes e defesa do Estado. |
| [Tutor de Direitos Humanos e Legislação Extravagante](.github/agents/direitos-humanos-legislacao-pmpe.agent.md) | Direitos humanos, tratados e legislação especial prevista no edital. |
| [Tutor de Redação](.github/agents/tutor-redacao-seguranca-publica.agent.md) | Planejamento, prática e correção de redações pela rubrica do edital da PMPE (Tabela 12.2) ou do edital de outro concurso. |

### Usar no VS Code

Abra a pasta do repositório no VS Code e inicie uma conversa no Copilot Chat. Selecione o Orquestrador para dúvidas gerais ou o tutor da disciplina para um pedido específico. Exemplos:

- “Explique os princípios fundamentais da Constituição e me dê questões oficiais sobre o tema.”
- “Crie 5 questões inéditas de crase para eu treinar.”
- “Corrija minha redação pela rubrica da PMPE.”
- “Monte o Simulado 2 do meu plano.”

As definições estão em `.github/agents/`, pasta que o VS Code reconhece por padrão. Edite os agentes somente ali e coloque regras que valem para todos em `.github/copilot-instructions.md`, em vez de repeti-las em cada agente.

### Questões oficiais e autorais

Por padrão, os agentes trabalham com **questões oficiais**, conferidas em fonte oficial e começando pela prova de 2023. Se você pedir explicitamente questões criadas (por exemplo, "crie 5 questões inéditas de crase"), eles geram **questões autorais de treino**, sempre com o rótulo "no estilo AOCP — não oficiais" e com cinco alternativas, como na prova.

## Organização e escopo dos materiais

- Para os tutores de Soldado/QPMG, `Base_de_Conhecimento/CONTEUDOS_PROGRAMATICOS/Conteudos.txt` delimita os assuntos de estudo. `Base_de_Conhecimento/Assuntos.txt` é um material auxiliar.
- Os agentes só leem bem arquivos de texto. Ao acrescentar um PDF, DOCX ou XLSX, inclua também uma versão em `.md` ou `.txt` ao lado dele.
- A prova de Soldado 2023 é o banco de questões oficiais mais próximo da prova de 2026. Ela está **reservada para o Simulado 1** (07/01/2027); o gabarito definitivo do Tipo 01 já está em [`Editais/2023/indice_questoes_2023.md`](Editais/2023/indice_questoes_2023.md), para a correção do simulado.
- Ao acrescentar material, mantenha-o na pasta da disciplina correspondente e confira sua aderência ao edital.
- A prova de 2023 pode ajudar na prática e na observação do estilo de questões, mas o conteúdo e as regras válidos são os do edital de 2026 e seus anexos.
- Para redação ou informações de outros cargos, verifique sempre o edital específico; os materiais e agentes não substituem a leitura do documento oficial.

## Referências do concurso

- [Edital de Abertura 001/2026](Editais/2026/2026%20-%20Edital%20de%20Abertura.pdf)
- [Prova de Soldado PMPE 2023](Editais/2023/2023%20-%20PMPE.pdf)
- [Instituto AOCP](https://www.institutoaocp.org.br)
- [Diário Oficial de Pernambuco](https://www.cepe.com.br)

---

Este repositório é um apoio à organização dos estudos. Para decisões sobre inscrição, requisitos, cronograma, provas ou classificação, confira sempre as publicações oficiais e o edital completo.
