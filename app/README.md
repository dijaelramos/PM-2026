# PMPE Ouvir — app para ler e ouvir o material

App instalável no celular (Android e iPhone) com o **Material do Dia**, o **plano**, o **edital** e a **Base de Conhecimento**. Funciona sem internet depois da primeira abertura.

- **Voz natural (MP3):** os materiais mais recentes ganham áudio com voz neural pt-BR (Antonio, 10% mais lenta que o normal). Toca com a tela apagada, no fone ou no carro, com controles na tela de bloqueio, capítulos e velocidade de 0,85× a 2×. O app lembra onde você parou.
- **Progresso:** contagem regressiva para a prova e os simulados (datas do [perfil](../Perfil_do_Estudante.md)), sequência de dias estudados, minutos ouvindo por dia (gráfico de 14 dias), horas do [plano](../Plano_de_Estudos_PMPE_2026.md) por disciplina, materiais concluídos e próximas sessões. A atividade fica registrada só no celular.
- **Revisão rápida:** cada material (a partir de 10/11) ganha uma versão de 5 a 15 minutos, só com os blocos "Para levar para a prova", os "Quadros para não confundir" e as "Pegadinhas da banca", com áudio próprio. Na tela inicial, um botão toca em sequência as revisões dos últimos 7 dias.
- **Questões separadas do material:** cada sessão tem o material de estudo (só os assuntos, que é o que o áudio lê) e as "Questões do dia" (estudo dirigido, mapa, questões e gabarito), abertas pelo botão **📝 Questões do dia** do material e pelo cartão "Terminou o estudo? Agora é praticar", no fim do texto. Nos resumões, o teste-relâmpago também fica num arquivo à parte (botão **⚡ Fazer o teste-relâmpago**). Quem estuda ouvindo recebe o mesmo convite quando o áudio do material termina: no reprodutor, na tela inicial (por até 3 dias, até abrir as questões) e, com a tela apagada, como notificação (se as notificações estiverem permitidas).
- **Questões:** as questões oficiais dos materiais e as questões autorais (marcadas como não oficiais) viram exercícios interativos: escolher a alternativa, riscar as erradas, ver a correção com o comentário do gabarito e o tempo gasto. As erradas vão para o **caderno de erros**, e o painel mostra a taxa de acerto por disciplina e por material. As questões reservadas para o Simulado 1 ficam de fora enquanto ele estiver `pendente` no [perfil](../Perfil_do_Estudante.md).
- **Banco de questões oficiais:** as provas de `Banco_de_Provas/` (PM e AOCP de outras áreas) entram no app, com as questões ligadas aos tópicos do edital, com filtro por disciplina, tópico, situação (não resolvidas, erradas, acertadas), banca, prova e quantidade, e o acerto por tópico. Avisos na própria questão: outra banca, nível superior, 4 alternativas, certo ou errado, gabarito não confirmado. Ficam de fora as anuladas, as que dependem de figura, a prova de Soldado PMPE 2023 (Simulado 1) e **toda questão que algum material usa, de qualquer data** (inclusive o Simulado 2): ela entra no app no dia do material, com o comentário, e não chega "gasta" ao material nem ao simulado. O build acha essas questões pelo cabeçalho do material ("### Questão 3 — PC-ES 2019, Investigador (AOCP), Q46").
- **Caderno de erros com revisão espaçada:** a questão errada volta amanhã; acertando na revisão, volta em 7 dias e depois em 30, e então sai da revisão. Errou de novo, recomeça. O botão **🔁 Revisar os erros de hoje** aparece na tela de questões, e a tela inicial avisa quantas há.
- **Simulado de prova:** o app monta 60 questões (10 por disciplina, na ordem da prova, as não resolvidas primeiro) com cronômetro de 3, 4 ou 5 h, alternativas riscáveis, grau de certeza (certeza, dúvida, chute), "revisar depois" e a folha com as 60 questões. A correção sai só na entrega: nota por disciplina e por bloco, o aviso se ficaria abaixo de 30% num bloco, zeraria uma disciplina ou ficaria abaixo de 30% do total, certeza × acerto e os tópicos do edital em que errou. Para os **Simulados 1 e 2 do plano**, que são feitos no papel ou no caderno, o app tem a **folha de respostas**: marca o tempo, guarda a letra e a certeza e corrige sozinha quando o gabarito chega ao app (no dia da correção do plano: 19/01 e 18/02). Antes disso, "Copiar a folha para o Orquestrador" leva as respostas para a correção no chat.
- **Edital verticalizado:** os 61 itens do Anexo II, cada um com a situação (✅ estudado, ⏳ já passou no plano e falta concluir, 📅 ainda vem), os dias do plano com o link do material, o acerto nas questões do app ligadas ao item e quantas questões das provas o cobram (🔥). Dá para marcar a teoria como estudada, registrar revisões, resolver as questões do item e ordenar por "prioridade" (muito cobrado e pouco acertado), incidência ou pior acerto. Itens abaixo de 60% de acerto (com 3 ou mais resolvidas) ficam marcados como fracos.
- **Cópia de segurança:** em **Meus dados** (link no rodapé da tela inicial), o app salva um arquivo `.json` com todo o progresso ou o envia pelo menu de compartilhar do celular (Drive, WhatsApp, e-mail). Para restaurar, escolha o arquivo: **Juntar** soma com os dados do celular (serve para usar dois aparelhos: vale a resposta mais recente de cada questão e o maior tempo de cada dia) e **Substituir** troca tudo. A tela inicial lembra de fazer a cópia quando a última tem mais de 7 dias.
- **Lei seca com incidência:** na Constituição e nas leis do edital, cada artigo cobrado ganha um 🔥 com o número de questões oficiais que o citam (pelo artigo que aparece no enunciado ou no comentário do gabarito, nas questões dos materiais de todas as datas e do banco). A caixa **Artigos mais cobrados**, no topo, leva a cada artigo, e o toque no parágrafo do artigo mostra **✍ N questões** para resolver as que já estão no app. É uma contagem automática: indica o que mais cai, não é estatística exata.
- **Redação:** editor com cronômetro (1 h, 50 ou 40 min, ou sem tempo), estimativa de linhas (15 a 20, ajustável pelo número de letras por linha da sua letra), contagem de parágrafos e palavras e a lista do que zera a redação. As propostas vêm do plano (o material do dia tem os textos de apoio) e das provas oficiais da AOCP, ou um tema livre. **Copiar para o Tutor de Redação** leva o texto e o pedido de correção pela Tabela 12.2; depois você registra a nota de cada aspecto e acompanha a evolução (média das últimas três e o aspecto mais fraco). Dá para registrar também a redação feita no papel.
- **Relatório para o Orquestrador:** em Meus dados, o app monta um relatório em Markdown com o desempenho por disciplina e por item do edital, as respostas de cada material do dia (letra marcada e gabarito), os simulados, as redações e a atividade de 14 dias. **Copiar relatório** leva para a conversa; **Enviar relatório ao GitHub** grava em `Relatorios_do_App/` (o do dia e `ultimo.md`), e o Orquestrador lê no VS Code depois do `git pull`. Para enviar, ligue o app ao GitHub uma vez com um *fine-grained token* só deste repositório e permissão **Contents: Read and write**. O token fica só no celular e não entra na cópia de segurança. A tela inicial lembra de enviar quando o último tem mais de 3 dias.
- **Meta do dia:** três anéis na tela inicial (tempo de estudo no app, questões e flashcards), com a meta escolhida em Progresso. O tempo é o maior entre o áudio ouvido e o cronômetro, o simulado e a redação do dia.
- **Questões no fone:** em Questões → **🎧 Questões no fone**, a voz do celular lê o enunciado e as alternativas; um toque na alternativa responde, a voz diz se acertou (e a letra certa) e, com "seguir sozinho", lê a próxima. Entram até 20 questões boas de ouvir (sem texto de apoio, sem tabela, enunciado curto), com os erros do dia primeiro. A tela fica acesa: com ela apagada, o celular costuma parar a voz.
- **Simulado para imprimir:** em Simulado → **Montar um simulado para imprimir**, o app monta as 60 questões com capa, textos de apoio, folha de respostas e, se quiser, o gabarito no fim; **Imprimir** salva em PDF. Depois de fazer no papel, **Marcar as respostas na folha do app** corrige e manda os erros para o caderno de erros.
- **Modo reta final:** de 14 a 20/02 aparece na tela inicial (e a qualquer momento pelo Edital): fila do dia com os erros pendentes e as questões dos itens fracos, os itens do edital abaixo de 60% ou muito cobrados e ainda não praticados, os 15 artigos mais cobrados (ler e resolver) e os flashcards errados.
- **Questões do dia interativas**: no caderno de questões (o botão no fim do material leva até ele), cada questão vira um cartão para marcar a letra, tocar em Responder e ver na hora se acertou, com o comentário. Primeiro as autorais de treino (no estilo AOCP — não oficiais), depois as oficiais; o gabarito do arquivo fica fechado. As respostas contam no desempenho e no caderno de erros.
- **Treinar meus pontos fracos** (em Questões e no Edital): 20 questões em rodízio dos até 6 itens do edital com acerto abaixo de 60% (3+ resolvidas) ou já estudados e pouco treinados, na ordem incidência × erro; primeiro as erradas, depois as não resolvidas.
- **Modo prova no simulado** (opção na tela do Simulado, vale para o do app, o impresso e a folha do plano): o relógio fica escondido (toque para espiar 5 s) e o app avisa com som, vibração e notificação a cada hora e quando faltam 30 e 15 minutos.
- **Professor (IA híbrida)** (`#/professor`, bloco 🤖 na tela inicial): pergunta por voz (reconhecimento de fala do celular) ou texto; a busca local escolhe até 8 trechos da base (índice `busca.*.json`, palavras raras pesam mais; plano e edital ficam de fora) e manda junto ao Claude (`claude-opus-5-5`, esforço baixo, SDK oficial `@anthropic-ai/sdk@1.6.0` pelo jsDelivr, com `fallbacks: "default"`), que responde citando [n]; a resposta pode ser lida em voz alta. Sem internet ou sem chave, responde só com os trechos da base. A chave da API fica só no celular (`ia`, fora da cópia de segurança); a conversa (`professor`) só acrescenta mensagens e recomeça depois de 12 perguntas.
- **Correção da redação pela IA** (na redação salva): notas dos 4 aspectos da Tabela 12.2 em JSON estruturado, com os trechos que justificam os descontos, desvios de gramática e o que reescrever primeiro; se a redação ainda não tem nota, a do Professor é registrada (dá para trocar pela do Tutor de Redação).
- **Temas prováveis da redação:** os temas de `Base_de_Conhecimento/REDAÇÃO/Temas_provaveis_2026.md` (prognóstico pelo padrão da AOCP) aparecem em Redação, com a chance, o motivo e o repertório.
- **Atalhos na tela inicial:** Simulado, Redação, Edital e Meus dados.
- **Flashcards com revisão espaçada:** cada linha das "Pegadinhas da banca" e dos "Quadros para não confundir" vira um cartão (frente: o que a banca escreve; verso: o certo e o artigo). Acertou: o cartão volta em 1, 3, 7, 15, 30 e 60 dias. Errou: volta amanhã e repete no fim da sessão. Há limite de cartões novos por dia, estudo por disciplina ou por material, "Ver no material" e leitura em voz alta.
- **Cronômetro da sessão:** segue a tabela "Roteiro" do material, bloco por bloco (ex.: 1 h retomada → 1 h aprofundamento → 1 h questões), com pausa opcional de 5 ou 10 minutos entre os blocos. Na troca de bloco, toca um som, o celular vibra e a barra no topo avisa. Materiais sem roteiro usam as horas do plano para o dia. O tempo cronometrado entra no progresso.
- **Voz do celular:** qualquer texto (leis, apostilas, materiais antigos) pode ser lido pela voz do próprio aparelho. A tela fica acesa enquanto lê.

## Como o conteúdo chega ao celular

1. O material novo entra no repositório normalmente (`git push`).
2. O GitHub Actions ([workflow](../.github/workflows/app.yml)) roda `app/build.py`: converte o Markdown em texto para fala, gera o MP3 só do que é novo e publica no GitHub Pages.
3. **Materiais montados com antecedência** só entram no app **na data do nome do arquivo** (horário de Pernambuco). O workflow roda sozinho todo dia às 03:05 para liberar o material do dia, sem precisar de push. Para testar outra data no computador: `python app/build.py --audios 0 --ate AAAA-MM-DD`.
4. Ao abrir o app com internet, ele baixa os textos novos e o áudio dos 3 materiais mais recentes. Depois disso, tudo funciona offline.

## Configuração (uma vez)

1. No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Faça um push (ou rode o workflow em **Actions → Publicar app PMPE Ouvir → Run workflow**).
3. No celular, abra `https://dijaelramos.github.io/PM-2026/`:
   - **Android (Chrome):** menu ⋮ → **Instalar app** (ou "Adicionar à tela inicial").
   - **iPhone (Safari):** botão Compartilhar → **Adicionar à Tela de Início**.

## Rodar no computador

```bash
pip install -r app/requirements.txt
python app/build.py --audios 0          # rápido, sem MP3
python app/build.py                     # com MP3 dos 15 materiais mais recentes
python -m http.server -d app/dist 8000  # abrir http://localhost:8000
```

Opções do `build.py`: `--audios N` (quantos materiais recebem MP3; cada um tem de 10 a 50 MB), `--revisoes N` (quantas revisões recebem MP3; padrão 30), `--limite-mb` (teto do áudio, padrão 900, porque o GitHub Pages aceita até 1 GB), `--voz pt-BR-FranciscaNeural` (voz feminina; o padrão é `pt-BR-AntonioNeural`) e `--taxa -10%` (velocidade da fala no MP3; o padrão é `-10%`).

## Arquivos

| Arquivo | Função |
|---|---|
| `build.py` | Lê o repositório e gera o site em `app/dist/` |
| `fala.py` | Converte Markdown em texto para ouvir (art. → artigo, § → parágrafo, incisos romanos → números, tabelas linha a linha, datas por extenso) |
| `plano.py` | Lê o cronograma do plano e as datas da prova e dos simulados |
| `revisao.py` | Monta a revisão rápida de cada material |
| `cartoes.py` | Transforma as pegadinhas e os quadros dos materiais em flashcards |
| `roteiro.py` | Lê a tabela "Roteiro" do material para o cronômetro da sessão |
| `banco.py` | Lê as provas de `Banco_de_Provas/` (`prova.md` + `indice.md`) para o banco de questões |
| `edital.py` | Lê os itens do Anexo II (`Conteudos.txt`) e liga cada sessão do plano aos itens que ela estuda |
| `incidencia.py` | Conta as questões oficiais que citam cada artigo da CF e das leis do edital (lei seca com incidência) |
| `simulados.py` | Simulados do plano: folha de respostas e o gabarito, que só entra no app no dia da correção |
| `questoes.py` | Extrai questões, gabarito, comentário e texto de apoio dos arquivos `_Questoes.md` do Material do Dia e de `Banco_de_Provas/Questoes_Autorais/` |
| `audio.py` | Gera o MP3 com edge-tts, com cache por capítulo em `app/.cache/` |
| `icone.py` | Desenha os ícones do app |
| `web/` | O app: `index.html`, `app.js`, `style.css`, `sw.js` (modo offline) |
