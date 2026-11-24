# Canal do YouTube: vídeo do Material do Dia

Todo dia útil, o GitHub gera um vídeo para cada material do dia: a voz lê o material e a tela mostra o trecho lido,
com o nome da seção, a barra de progresso e capítulos clicáveis no YouTube. Depois publica no canal.

| Arquivo | Para quê |
|---|---|
| `video.py` | Gera `canal/saida/<aula>/video.mp4`, `miniatura.png` e `video.json` (título, descrição com capítulos, tags) |
| `publicar.py` | Envia os vídeos pela API do YouTube; não repete aula já publicada |
| `autorizar.py` | Autorização única do canal (gera o `YT_REFRESH_TOKEN`) |
| `config.json` | Nome do canal, voz e privacidade |
| `../.github/workflows/canal.yml` | Roda tudo às 07:05 (dias úteis) ou quando você pedir na aba Actions |

**O que vai para o vídeo:** só as seções de conteúdo (1, 2, 3…, quadros e pegadinhas). Ficam de fora o roteiro,
a cobertura do edital, a revisão espaçada, a redação e qualquer parágrafo sobre o seu perfil ou o Orquestrador.

## O que você precisa fazer (uma vez)

### 1. Criar o canal
1. Use uma conta Google **só para o canal** (recomendado) e crie o canal em youtube.com.
2. **Não use** nome, brasão ou logotipo da PMPE, do Governo de PE ou do Instituto AOCP: o canal é independente.
3. Em YouTube Studio > Configurações > Canal > **Qualificação de recursos**, verifique o telefone (libera vídeos com
   mais de 15 minutos e miniatura personalizada; os vídeos têm de 20 a 70 minutos).
4. Coloque o nome do canal em `config.json` (`"nome_canal"`).

### 2. Liberar a API do YouTube (Google Cloud)
1. Em console.cloud.google.com, crie um projeto e ative a **YouTube Data API v3**.
2. Em "Tela de consentimento OAuth": tipo **Externo**; adicione seu e-mail como usuário de teste e depois clique em
   **Publicar app** (em "Teste", a autorização vence em 7 dias).
3. Em "Credenciais", crie um **ID do cliente OAuth** do tipo **App para computador** e baixe o JSON como
   `canal/client_secret.json` (esse arquivo não vai para o GitHub).
4. No seu computador: `pip install google-auth-oauthlib` e `python canal/autorizar.py`.
5. No GitHub: Settings > Secrets and variables > Actions > New repository secret: `YT_CLIENT_ID`,
   `YT_CLIENT_SECRET` e `YT_REFRESH_TOKEN`.

⚠️ **Auditoria do Google:** projetos novos e não auditados só conseguem enviar vídeos **privados** pela API. Para
publicar como público automaticamente, peça a auditoria no formulário "YouTube API Services - Audit and Quota
Extension". Enquanto isso, os vídeos sobem privados e você muda para "Público" no YouTube Studio (1 clique).

### 3. Voz com licença comercial (obrigatório para monetizar)
A voz padrão (`"voz": "edge"`) é gratuita, mas **não tem licença para uso comercial**: com ela o `publicar.py` sempre
envia o vídeo como privado. Para o canal monetizado, use a mesma voz (Antonio) pelo **Azure AI Speech**:
1. Crie um recurso "Speech" no portal do Azure (há camada gratuita de 500 mil caracteres por mês; um material
   tem de 17 mil a 50 mil caracteres).
2. Cadastre os secrets `AZURE_SPEECH_KEY` e `AZURE_SPEECH_REGION` (ex.: `brazilsouth`).
3. Em `config.json`, troque `"voz": "edge"` por `"voz": "azure"` e `"privacidade"` por `"public"`.

## Gerar um vídeo no seu computador
```
pip install -r canal/requirements.txt
python canal/video.py --data 2026-11-24
```
O vídeo fica em `canal/saida/2026-11-24_.../video.mp4`.

## Antes de monetizar
- **Programa de Parcerias do YouTube:** exige 1.000 inscritos e 4.000 horas assistidas em 12 meses. O YouTube pode
  recusar canais com conteúdo **produzido em massa e repetitivo** (voz sintética lendo texto). Para reduzir esse
  risco, grave você mesmo uma abertura curta ou comentários, responda dúvidas e crie Shorts com as pegadinhas.
- **Direitos autorais:** os materiais citam trechos curtos de obras de terceiros (a apostila de História de
  Pernambuco do Prof. Robson Alves; a Cartilha do CERT.br, de licença não comercial). Citação curta com a fonte é
  permitida para estudo, mas num canal monetizado o ideal é reescrever esses trechos com suas palavras.
  Leis, a Constituição e o edital são textos oficiais e podem ser lidos à vontade.
