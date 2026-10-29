# Preparação para a PMPE 2026

Este repositório reúne materiais de estudo e agentes personalizados para apoiar a preparação para o concurso da Polícia Militar de Pernambuco (PMPE), com foco principal no cargo de Soldado/QPMG, código 201, conforme o Edital de Abertura nº 001/2026.

Não é uma aplicação de software: não há instalação de dependências, compilação ou execução de código. O conteúdo está organizado para consulta e uso no VS Code com o Copilot Chat.

## Por onde começar

1. Consulte o [edital de abertura de 2026](Editais/2026/2026%20-%20Edital%20de%20Abertura.pdf) para conferir regras, conteúdo e critérios oficiais.
2. Use o [conteúdo programático](Base_de_Conhecimento/CONTEUDOS_PROGRAMATICOS/Conteudos.txt) para localizar os assuntos previstos para Soldado/QPMG.
3. Acesse os materiais na pasta da disciplina correspondente em `Base_de_Conhecimento/`.
4. No Copilot Chat, peça ajuda ao [Orquestrador de Estudos](Agents/orquestrador-estudos-pmpe.agent.md) ou diretamente a um dos tutores descritos abaixo.

O edital e seus anexos são a referência definitiva em caso de divergência. A prova de 2023 é apenas material de referência e não substitui o edital atual.

## Estrutura do repositório

| Pasta/arquivo | Conteúdo |
|---|---|
| [`Agents/`](Agents/) | Definições dos agentes de estudo e tutores especializados. |
| [`Assuntos/CONTEUDOS_PROGRAMATICOS/Conteudos.txt`](Assuntos/CONTEUDOS_PROGRAMATICOS/Conteudos.txt) | Material auxiliar sobre o conteúdo programático. |
| [`Base_de_Conhecimento/`](Base_de_Conhecimento/) | Conteúdo programático de referência e materiais separados por disciplina. |
| [`Editais/2026/`](Editais/2026/) | Edital do concurso em foco. |
| [`Editais/2023/`](Editais/2023/) | Edital/prova anterior, para consulta histórica e prática. |

### Materiais por disciplina

Em `Base_de_Conhecimento/`, os materiais estão distribuídos entre:

- **Língua Portuguesa** — documento DOCX;
- **História de Pernambuco** — documento PDF;
- **Raciocínio Lógico** — documento DOCX;
- **Informática** — documento DOCX;
- **Direito Constitucional** — arquivos de texto com tópicos e referências;
- **Direitos Humanos e Legislação Extravagante** — arquivos de texto sobre tratados, direitos humanos e legislação;
- **Conteúdo programático** — transcrição organizada dos assuntos de Soldado/QPMG.

Os formatos e o nível de detalhe variam entre disciplinas. Consulte também as fontes oficiais indicadas nos materiais quando precisar confirmar legislação, jurisprudência ou informação sujeita a atualização.

## Agentes de estudo

Os perfis estão em `Agents/` e foram escritos para apoiar explicações, resolução de questões, exercícios, revisões e planos de estudo.

| Agente | Uso principal |
|---|---|
| [Orquestrador de Estudos — PMPE](Agents/orquestrador-estudos-pmpe.agent.md) | Identifica a disciplina, direciona a solicitação ao tutor adequado e sintetiza temas multidisciplinares. |
| [Tutor de Língua Portuguesa](Agents/lingua-portuguesa-pmpe.agent.md) | Interpretação, gramática, ortografia, sintaxe e semântica. |
| [Tutor de História de Pernambuco](Agents/historia-pernambuco-pmpe.agent.md) | História, movimentos e cultura pernambucana previstos no programa. |
| [Tutor de Raciocínio Lógico](Agents/raciocinio-logico-pmpe.agent.md) | Lógica, argumentação, diagramas, contagem e probabilidade. |
| [Tutor de Informática](Agents/informatica-pmpe.agent.md) | Internet, segurança, arquivos, sistemas operacionais e ferramentas de escritório. |
| [Tutor de Direito Constitucional](Agents/direito-constitucional-pmpe.agent.md) | Direitos e garantias, organização do Estado e dos Poderes e defesa do Estado. |
| [Tutor de Direitos Humanos e Legislação Extravagante](Agents/direitos-humanos-legislacao-pmpe.agent.md) | Direitos humanos, tratados e legislação especial prevista no edital. |
| [Tutor de Redação](Agents/tutor-redacao-seguranca-publica.agent.md) | Planejamento, prática e correção pedagógica de redações para concursos de segurança pública. Para aplicar critérios da PMPE, consulte o edital. |

### Usar no VS Code

Abra a pasta do repositório no VS Code e inicie uma conversa no Copilot Chat. Selecione o Orquestrador para dúvidas gerais ou o tutor da disciplina para um pedido específico. Exemplos:

- “Explique os princípios fundamentais da Constituição e crie cinco questões de revisão.”
- “Monte um plano de revisão de História de Pernambuco para os próximos sete dias.”
- “Corrija minha redação conforme a proposta e os critérios do edital anexado.”

As definições estão armazenadas em `Agents/`. Se elas não aparecerem na lista de agentes do VS Code, configure essa pasta como local de arquivos de agentes personalizados nas configurações do VS Code ou use o local de agentes reconhecido pela sua instalação.

## Organização e escopo dos materiais

- Para os tutores de Soldado/QPMG, `Base_de_Conhecimento/CONTEUDOS_PROGRAMATICOS/Conteudos.txt` delimita os assuntos de estudo.
- `Assuntos/CONTEUDOS_PROGRAMATICOS/Conteudos.txt` é um material auxiliar; consulte a versão em `Base_de_Conhecimento/` como referência usada pelos agentes.
- Ao acrescentar material, mantenha-o na pasta da disciplina correspondente e confira sua aderência ao edital.
- A prova de 2023 pode ajudar na prática e na observação do estilo de questões, mas o conteúdo e as regras válidos são os do edital de 2026 e seus anexos.
- Para redação ou informações de outros cargos, verifique sempre o edital específico; os materiais e agentes não substituem a leitura do documento oficial.

## Referências do concurso

- [Edital de Abertura 001/2026](Editais/2026/2026%20-%20Edital%20de%20Abertura.pdf)
- [Material do concurso de 2023](Editais/2023/2023%20-%20PMPE.pdf)
- [Instituto AOCP](https://www.institutoaocp.org.br)
- [Diário Oficial de Pernambuco](https://www.cepe.com.br)

---

Este repositório é um apoio à organização dos estudos. Para decisões sobre inscrição, requisitos, cronograma, provas ou classificação, confira sempre as publicações oficiais e o edital completo.
