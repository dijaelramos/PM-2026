# PMPE Ouvir — app para ler e ouvir o material

App instalável no celular (Android e iPhone) com o **Material do Dia**, o **plano**, o **edital** e a **Base de Conhecimento**. Funciona sem internet depois da primeira abertura.

- **Voz natural (MP3):** os materiais mais recentes ganham áudio com voz neural pt-BR (Antonio, 10% mais lenta que o normal). Toca com a tela apagada, no fone ou no carro, com controles na tela de bloqueio, capítulos e velocidade de 0,85× a 2×. O app lembra onde você parou.
- **Progresso:** contagem regressiva para a prova e os simulados (datas do [perfil](../Perfil_do_Estudante.md)), sequência de dias estudados, minutos ouvindo por dia (gráfico de 14 dias), horas do [plano](../Plano_de_Estudos_PMPE_2026.md) por disciplina, materiais concluídos e próximas sessões. A atividade fica registrada só no celular.
- **Revisão rápida:** cada material (a partir de 10/11) ganha uma versão de 5 a 15 minutos, só com os blocos "Para levar para a prova", os "Quadros para não confundir" e as "Pegadinhas da banca", com áudio próprio. Na tela inicial, um botão toca em sequência as revisões dos últimos 7 dias.
- **Questões separadas do material:** cada sessão tem o material de estudo (só os assuntos, que é o que o áudio lê) e as "Questões do dia" (estudo dirigido, mapa, questões e gabarito), abertas pelo botão **📝 Questões do dia** do material e pelo cartão "Terminou o estudo? Agora é praticar", no fim do texto. Nos resumões, o teste-relâmpago também fica num arquivo à parte (botão **⚡ Fazer o teste-relâmpago**).
- **Questões:** as questões oficiais dos materiais e as questões autorais (marcadas como não oficiais) viram exercícios interativos: escolher a alternativa, riscar as erradas, ver a correção com o comentário do gabarito e o tempo gasto. As erradas vão para o **caderno de erros**, e o painel mostra a taxa de acerto por disciplina e por material. As questões reservadas para o Simulado 1 ficam de fora enquanto ele estiver `pendente` no [perfil](../Perfil_do_Estudante.md).
- **Flashcards com revisão espaçada:** cada linha das "Pegadinhas da banca" e dos "Quadros para não confundir" vira um cartão (frente: o que a banca escreve; verso: o certo e o artigo). Acertou: o cartão volta em 1, 3, 7, 15, 30 e 60 dias. Errou: volta amanhã e repete no fim da sessão. Há limite de cartões novos por dia, estudo por disciplina ou por material, "Ver no material" e leitura em voz alta.
- **Cronômetro da sessão:** segue a tabela "Roteiro" do material, bloco por bloco (ex.: 1 h retomada → 1 h aprofundamento → 1 h questões), com pausa opcional de 5 ou 10 minutos entre os blocos. Na troca de bloco, toca um som, o celular vibra e a barra no topo avisa. Materiais sem roteiro usam as horas do plano para o dia. O tempo cronometrado entra no progresso.
- **Voz do celular:** qualquer texto (leis, apostilas, materiais antigos) pode ser lido pela voz do próprio aparelho. A tela fica acesa enquanto lê.

## Como o conteúdo chega ao celular

1. O material novo entra no repositório normalmente (`git push`).
2. O GitHub Actions ([workflow](../.github/workflows/app.yml)) roda `app/build.py`: converte o Markdown em texto para fala, gera o MP3 só do que é novo e publica no GitHub Pages.
3. Ao abrir o app com internet, ele baixa os textos novos e o áudio dos 3 materiais mais recentes. Depois disso, tudo funciona offline.

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
| `questoes.py` | Extrai questões, gabarito, comentário e texto de apoio dos arquivos `_Questoes.md` do Material do Dia e de `Banco_de_Provas/Questoes_Autorais/` |
| `audio.py` | Gera o MP3 com edge-tts, com cache por capítulo em `app/.cache/` |
| `icone.py` | Desenha os ícones do app |
| `web/` | O app: `index.html`, `app.js`, `style.css`, `sw.js` (modo offline) |
