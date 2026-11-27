# Canal do YouTube: vídeo do Material do Dia

Todo dia útil, o GitHub gera um vídeo para cada material do dia: a voz lê o material e a tela mostra o trecho lido,
com o nome da seção, a barra de progresso e capítulos clicáveis no YouTube. Depois publica no canal.

| Arquivo | Para quê |
|---|---|
| `video.py` | Gera `canal/saida/<aula>/video.mp4`, `miniatura.png` e `video.json` (título, descrição com capítulos, tags) |
| `shorts.py` | Gera os 3 Shorts do dia em `canal/saida/<aula>/shorts/` (pegadinha, questão relâmpago, resumo de 30 s) |
| `publicar.py` | Envia a aula e os Shorts pela API do YouTube (Shorts agendados), sem repetir o que já foi publicado; `--testar` confere a conexão |
| `autorizar.py` | Autorização única do canal (gera o `YT_REFRESH_TOKEN`) |
| `config.json` | Nome do canal, voz e privacidade |
| `../.github/workflows/canal.yml` | Roda tudo às 07:05 (dias úteis) ou quando você pedir na aba Actions |

**Canal:** https://www.youtube.com/@infinityCursosBeberibe (`nome_canal` e `url_canal` em `config.json`).

**Shorts (3 por dia):** vídeos verticais de até 1 minuto, feitos do material do dia:
1. **Pegadinha da banca:** linhas do quadro "A banca escreve… | O certo é…".
2. **Questão relâmpago:** a voz lê o enunciado, as alternativas ficam na tela, há uma pausa e depois vem o gabarito.
3. **Resumo de 30 segundos:** o "Para levar para a prova" de uma seção.

Cada Short termina chamando para a aula completa, e a descrição traz o link da aula do dia. Os Shorts ficam
agendados para os horários de `"horarios_shorts"` (12:00, 18:00 e 21:00, hora do Recife).

**O que vai para o vídeo:** só as seções de conteúdo (1, 2, 3…, quadros e pegadinhas). Ficam de fora o roteiro,
a cobertura do edital, a revisão espaçada, a redação e qualquer parágrafo sobre o seu perfil ou o Orquestrador.

**Questões no final (todos os vídeos):** na abertura, a voz avisa que haverá questões no final, para o espectador
assistir até o fim. Depois do conteúdo vêm até 5 questões do caderno do dia (`_Questoes.md`): primeiro as autorais,
depois as oficiais. Cada questão tem uma pausa de 4 segundos, e então vêm a chamada "deixe as suas respostas nos
comentários" e o gabarito comentado. Nos resumões entram as perguntas do teste-relâmpago, com a resposta-modelo.
A quantidade fica em `config.json` (`"questoes_no_final"`).

## O que você precisa fazer (uma vez)

### 1. Criar o canal
1. Use uma conta Google **só para o canal** (recomendado) e crie o canal em youtube.com.
2. **Não use** nome, brasão ou logotipo da PMPE, do Governo de PE ou do Instituto AOCP: o canal é independente.
3. Em YouTube Studio > Configurações > Canal > **Qualificação de recursos**, verifique o telefone (libera vídeos com
   mais de 15 minutos e miniatura personalizada; os vídeos têm de 20 a 70 minutos).
4. Coloque o nome do canal em `config.json` (`"nome_canal"`).

### 2. Liberar a API do YouTube (Google Cloud), cerca de 20 minutos
Entre em console.cloud.google.com **com a mesma conta Google do canal**.

1. **Projeto:** no seletor de projetos (alto da página), clique em **Novo projeto**. Dê um nome, por exemplo
   `canal-pmpe`, e clique em **Criar**. Depois, selecione o projeto.
2. **Ativar a API:** no menu, abra **APIs e serviços > Biblioteca**, procure **YouTube Data API v3** e clique em
   **Ativar**.
3. **Tela de consentimento:** abra **APIs e serviços > Tela de consentimento OAuth** (em algumas contas, o nome é
   **Google Auth Platform**) e clique em **Começar**.
   - Nome do app: `Publicador do canal`. E-mail de suporte: o seu.
   - Público: **Externo**.
   - Contato: o seu e-mail. Aceite os termos e clique em **Criar**.
4. **Publicar o app:** em **Público** (Audience), clique em **Publicar app** e confirme. Se ficar em "Teste", a
   autorização vence em 7 dias.
5. **Credencial:** em **Clientes** (ou **Credenciais > Criar credenciais > ID do cliente OAuth**), escolha o tipo
   **App para computador**, dê um nome e clique em **Criar**. Depois, clique em **Baixar JSON** e salve o arquivo
   como `canal/client_secret.json`. Esse arquivo não vai para o GitHub.
6. **Autorizar o canal**, no seu computador, na pasta do projeto:
   ```
   pip install google-auth-oauthlib google-api-python-client
   python canal/autorizar.py
   ```
   - O navegador abre. Entre com a conta do canal. Se aparecer **"O Google não verificou este app"**, clique em
     **Avançado > Acessar Publicador do canal (não seguro)**. É o seu próprio app, então é seguro.
   - Marque as permissões e clique em **Continuar**.
   - O terminal mostra "Conexão OK com o canal: …" e, em seguida, 3 valores.
7. **Guardar no GitHub:** no repositório, abra **Settings > Secrets and variables > Actions > New repository
   secret** e crie três secrets, colando cada valor: `YT_CLIENT_ID`, `YT_CLIENT_SECRET` e `YT_REFRESH_TOKEN`.
8. **Testar no GitHub:** na aba **Actions**, abra o workflow "Canal do YouTube" e clique em **Run workflow**. O passo
   "Publicar no YouTube" deve dizer que o projeto ainda não está auditado. Antes disso, ele mostra "Conexão OK: canal …", sinal de que os secrets estão certos.

### 2.1 Auditoria do Google (obrigatória para publicar pela API)
Projetos novos da API **não podem publicar**. O YouTube **trava como privado, sem volta**, todo vídeo enviado por
projeto não auditado. Por isso, `config.json` vem com `"api_auditada": false`, e o `publicar.py` não envia nada.

1. Peça a auditoria no formulário **"YouTube API Services - Audit and Quota Extension Form"** (procure esse nome no
   Google). Descreva o uso: um app interno que envia, todo dia, os vídeos do seu próprio canal (1 aula e 3 Shorts).
2. A resposta pode levar semanas. **Enquanto isso:** baixe os vídeos no artefato de cada execução (aba Actions) e
   envie pelo **YouTube Studio**. Lá dá para **agendar** os 3 Shorts para 12:00, 18:00 e 21:00. Os títulos e as
   descrições estão nos arquivos `.json` ao lado de cada vídeo.
3. Aprovada a auditoria, troque `"api_auditada"` para `true`. A partir daí, o envio é automático.

**Cota:** cada envio gasta cerca de 1.600 das 10.000 unidades diárias. A aula e os 3 Shorts (4 envios) cabem no limite.

### 3. Voz com licença comercial (obrigatório para monetizar)
A voz padrão (`"voz": "edge"`) é gratuita, mas **não tem licença para uso comercial**: com ela o `publicar.py` sempre
envia o vídeo como privado. Para o canal monetizado, use a mesma voz (Antonio) pelo **Azure AI Speech**:
1. Crie um recurso "Speech" no portal do Azure (há camada gratuita de 500 mil caracteres por mês; um material
   tem de 17 mil a 50 mil caracteres).
2. Cadastre os secrets `AZURE_SPEECH_KEY` e `AZURE_SPEECH_REGION` (ex.: `brazilsouth`).
3. Em `config.json`, troque `"voz": "edge"` por `"voz": "azure"` e `"privacidade"` por `"public"`.

## Robô no seu computador (posta pelo YouTube Studio, sem precisar da auditoria)

`canal/robo.py` roda no seu PC, em loop. Todo dia útil, ele gera e posta a aula às 07:00 e os 3 Shorts às 12:00,
18:00 e 21:00, pelo Chrome, no YouTube Studio. Ele precisa de `pip install playwright` e do Google Chrome instalado.

1. `python canal/robo.py --login`: abre um Chrome só do robô. Entre na conta do canal, confira se o Studio abre
   e feche a janela.
2. `python canal/robo.py --simular`: mostra a agenda de hoje, sem postar nada.
3. `python canal/robo.py`: liga o robô. Deixe o terminal aberto; Ctrl+C desliga. Enquanto ele roda, o PC não
   entra em suspensão.

Ligado tarde, ele posta o que estiver atrasado, com pelo menos 1 hora entre os Shorts. O que já foi postado fica em
`canal/.postados.json`, para nunca postar duas vezes. Se der erro, a foto da tela vai para `canal/saida/_erros/`, e
ele tenta de novo até 3 vezes.

### Em outro computador (Windows 10/11)

1. Baixe o repositório. O melhor é usar `git clone https://github.com/dijaelramos/PM-2026.git`, porque assim o robô
   baixa sozinho, todo dia, os materiais novos e as correções. Baixar o ZIP também funciona, mas sem essa atualização.
2. Dê dois cliques em `canal\iniciar_robo.bat`:
   - se faltar o Python, ele instala o 3.12 pelo winget (feche e abra de novo depois);
   - os pacotes (edge-tts, pillow, imageio-ffmpeg, playwright, requests) são instalados na hora e atualizados toda semana;
   - o navegador é o Google Chrome; sem ele, o robô usa o Microsoft Edge do Windows.
3. Só na primeira vez nesse computador: no terminal, rode `canal\iniciar_robo.bat --login` e entre na conta do canal.
4. Depois, é só dar dois cliques em `canal\iniciar_robo.bat`. Quando chega uma atualização do código, o robô reinicia
   sozinho.

Cada computador tem o próprio login, o próprio registro de postagens e o próprio `log.txt`. **Deixe o robô ligado
em um computador só**, senão os dois postam o mesmo vídeo.

**Extras de cada aula:**
- **Playlist:** o robô coloca a aula na playlist da disciplina, por exemplo "História de Pernambuco | Soldado PM-PE 2026", e cria a playlist se ela não existir. Use `"playlists": false` para desligar.
- **Comentário fixado:** pede as respostas das questões do fim da aula e, se houver, traz o Pix. Use `"comentario_fixado": false` para desligar.
- **Testar o comentário num vídeo já postado:** `python canal/robo.py --comentar https://youtu.be/ID`.

Se a playlist ou o comentário falharem, o vídeo é postado mesmo assim, e o motivo fica no `log.txt` como AVISO.

**Pix:** com `"pix_chave"`, `"pix_nome"` e `"pix_cidade"` preenchidos, a tela final das aulas mostra o QR Code do Pix, gerado no padrão do Banco Central e sem valor fixo. A chave também vai na descrição das aulas e dos Shorts e no comentário fixado. Prefira uma **chave aleatória**, para não expor CPF, telefone ou e-mail.

**Visibilidade:** `"visibilidade_robo": "public"`. Com a voz gratuita (`"voz": "edge"`), o robô posta como
PRIVADO, a menos que você marque `"aceito_voz_edge_em_publico": true`, por sua conta e risco.

⚠️ Os Termos do YouTube proíbem acessar o serviço por meios automatizados sem autorização. Usar o robô é por sua
conta e risco, e o risco é para o canal. Ele também pode parar de funcionar quando o YouTube mudar a tela do Studio.

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

## Fila geral e robô individual (27/11/2026)

O iniciar_robo.bat na pasta deste concurso executa somente seu canal. O atalho antigo dentro de canal/ também funciona. Para executar todos, use ../canal_youtube/iniciar_robo.bat a partir da pasta do projeto.

A fila geral alterna PMPE, Bombeiro e novos concursos: aulas a partir das 07h e Shorts às 12h, 18h e 21h, com pelo menos 10 minutos reais entre os envios no mesmo canal. Geração e upload demorados podem atrasar o próximo item. O robô individual usa os mesmos horários e a mesma proteção compartilhada.

Os registros antigos são preservados. Sem registro confirmado, a automação consulta os vídeos e Shorts no próprio Studio antes do upload. Rascunho, consulta incompleta, histórico danificado ou resultado de envio incerto impedem um novo envio daquele item.

Use python canal/robo.py --simular --data AAAA-MM-DD para conferir a agenda sem abrir navegador ou publicar. robo_teste.py também passou a ser somente uma simulação. Se a versão antiga do robô estiver ligada, feche-a e abra o novo atalho.

Quando o estudante informar que criou um concurso, o agente da raiz deve preparar o novo robô e acrescentá-lo a canal_youtube/config.json. A fila em execução relê esse cadastro automaticamente. As instruções completas ficam em canal_youtube/COMO_USAR.txt, na raiz compartilhada.
