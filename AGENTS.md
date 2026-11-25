# Instruções para agentes de IA (Codex, Gemini, Copilot e outros)

Este repositório prepara um estudante para o concurso de **Soldado da PM-PE 2026** (banca Instituto AOCP). Ele reúne:

- os materiais de estudo diários (`Material_do_Dia/`);
- o app de celular "PMPE Ouvir" (`app/`, publicado no GitHub Pages);
- o canal do YouTube (`canal/`), que transforma cada material em uma aula narrada e 3 Shorts.

Responda sempre em **português do Brasil**.

## 1. Leia antes de agir

As regras são as mesmas para qualquer IA. Este arquivo só aponta para elas:

1. **`.github/copilot-instructions.md`**: regras comuns. Trazem os fatos do concurso, as fontes, as questões oficiais e autorais, a busca na Web e o tom.
2. O arquivo de `.github/regras/` que corresponde à tarefa:

| Tarefa | Leia antes |
|---|---|
| Montar material de estudo ou corrigir respostas do estudante | `.github/regras/material_e_correcao.md` |
| Procurar, apresentar ou montar lista/simulado de questões oficiais | `.github/regras/questoes_oficiais.md` |
| Criar questão autoral sobre lei, súmula ou tese | `.github/regras/questao_autoral_lei.md` |
| Buscar algo na Web | `.github/regras/busca_web.md` |
| Montar ou ajustar plano de estudos | `.github/regras/planos_de_estudo.md` |

3. **`.github/agents/`**: papéis especializados. O principal é o Orquestrador; há um tutor para cada disciplina. Para tarefas de uma disciplina, siga também o arquivo do tutor dela.

## 2. Regras que não podem falhar

- **Revisão de português:** antes de salvar qualquer texto, revise ortografia, acentuação, crase, concordância, regência e pontuação. Trechos de lei e de questão oficial ficam exatamente como no original (item 1.7 de `material_e_correcao.md`).
- **Formatos que os programas leem.** O app e o gerador de vídeos (`canal/video.py` e `canal/shorts.py`) leem os arquivos de `Material_do_Dia/` por formato. Não mude:
  - seções numeradas `## 1. …`;
  - o quadro "A banca escreve… | O certo é…" na seção de pegadinhas;
  - a seção "Quadros para não confundir";
  - o parágrafo `**Para levar para a prova:**` em cada seção numerada;
  - as questões `### Questão N — …`, com alternativas `- **(A)** texto`;
  - o gabarito `### Questão N — gabarito X`, com um primeiro parágrafo curto `**Por que a (X) está correta:** …`;
  - as respostas do estudo dirigido em `### Estudo dirigido — respostas …`.
- **Questões autorais** levam o rótulo "no estilo AOCP — não oficial". Respeite a **reserva de questões dos simulados**: as regras estão em `questoes_oficiais.md`. Não use nem revele as questões reservadas.
- **Não invente** dados do estudante, de leis ou do edital. Na dúvida, consulte a base local (`Base_de_Conhecimento/`, `Editais/`, `Banco_de_Provas/`).

## 3. Canal do YouTube

- Guia completo: `canal/README.md`.
- O robô `canal/robo.py` posta pelo YouTube Studio no PC do estudante. Os registros e os erros completos ficam em **`canal/log.txt`**. Quando o estudante disser "leia o log", leia esse arquivo, as fotos de erro em `canal/saida/_erros/` e `canal/.postados.json`, e corrija o código.
- **As postagens são automáticas.** Esse é o funcionamento combinado com o estudante: o `robo.py` posta sozinho, todo dia útil, a aula às 07:00 e os Shorts às 12:00, 18:00 e 21:00, como **públicos**. Os horários e a visibilidade ficam em `canal/config.json`.
  - Depois de corrigir um erro do robô, ligue-o de novo (`python canal/robo.py`), para que as postagens continuem sem depender do estudante. Ele não repete o que já está em `canal/.postados.json`.
  - Para não perder um dia, o que falhou pode ser postado de novo pelo próprio robô.
  - Só com o pedido do estudante: apagar vídeos do canal, mudar as configurações do canal ou mudar os horários e a visibilidade.
- **Nunca envie ao Git:**
  - credenciais: `canal/client_secret*.json` e `canal/token*.json`;
  - o perfil do Chrome do robô: `canal/.chrome_perfil/`;
  - os arquivos locais do robô: `canal/.postados.json` e `canal/log.txt`.

  Todos já estão no `.gitignore`. Nunca peça ao estudante que cole senhas ou tokens no chat.

## 4. Git

- Depois de criar ou alterar materiais, o resumão ou o código, faça **commit e push na `main`** sem perguntar. É o combinado com o estudante, e o push publica o app e o site.
- Escreva as mensagens de commit em português, dizendo o que mudou.
