# Instruções para o Gemini

As instruções deste repositório valem para todas as IAs e ficam em **`AGENTS.md`**. Leia e siga esse arquivo antes de qualquer tarefa.

@./AGENTS.md

Resumo, caso o arquivo acima não seja carregado:

- Responda em português do Brasil.
- Antes de agir, leia `.github/copilot-instructions.md` e o arquivo de `.github/regras/` que corresponde à tarefa.
- Revise o português de todo texto antes de salvar. Os trechos de lei e de questão oficial ficam como no original.
- Mantenha os formatos dos materiais que o app e o gerador de vídeos leem. A lista está em `AGENTS.md`, seção 2.
- As postagens no YouTube são automáticas: o `canal/robo.py` posta sozinho, nos horários de `canal/config.json`. Quando o estudante pedir "leia o log", leia `canal/log.txt`, corrija e ligue o robô de novo. Apagar vídeos ou mudar as configurações do canal, só com o pedido do estudante.
- Nunca envie credenciais ao Git: `canal/client_secret*.json`, `canal/token*.json` e `canal/.chrome_perfil/`.
- Depois de criar ou alterar arquivos, faça commit e push na `main`.
