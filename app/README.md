# PMPE Ouvir — app para ler e ouvir o material

App instalável no celular (Android e iPhone) com o **Material do Dia**, o **plano**, o **edital** e a **Base de Conhecimento**. Funciona sem internet depois da primeira abertura.

- **Voz natural (MP3):** os materiais mais recentes ganham áudio com voz neural pt-BR (Antonio, 10% mais lenta que o normal). Toca com a tela apagada, no fone ou no carro, com controles na tela de bloqueio, capítulos e velocidade de 0,85× a 2×. O app lembra onde você parou.
- **Questões:** as questões oficiais dos materiais e as questões autorais (marcadas como não oficiais) viram exercícios interativos: escolher a alternativa, riscar as erradas, ver a correção com o comentário do gabarito e o tempo gasto. As erradas vão para o **caderno de erros**, e o painel mostra a taxa de acerto por disciplina e por material. As questões reservadas para o Simulado 1 ficam de fora enquanto ele estiver `pendente` no [perfil](../Perfil_do_Estudante.md).
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

Opções do `build.py`: `--audios N` (quantos materiais recebem MP3; o GitHub Pages aceita até 1 GB, e cada material tem de 10 a 35 MB), `--voz pt-BR-FranciscaNeural` (voz feminina; o padrão é `pt-BR-AntonioNeural`) e `--taxa -10%` (velocidade da fala no MP3; o padrão é `-10%`).

## Arquivos

| Arquivo | Função |
|---|---|
| `build.py` | Lê o repositório e gera o site em `app/dist/` |
| `fala.py` | Converte Markdown em texto para ouvir (art. → artigo, § → parágrafo, incisos romanos → números, tabelas linha a linha, datas por extenso) |
| `questoes.py` | Extrai questões, gabarito, comentário e texto de apoio dos materiais e de `Banco_de_Provas/Questoes_Autorais/` |
| `audio.py` | Gera o MP3 com edge-tts, com cache por capítulo em `app/.cache/` |
| `icone.py` | Desenha os ícones do app |
| `web/` | O app: `index.html`, `app.js`, `style.css`, `sw.js` (modo offline) |
