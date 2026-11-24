"""Autorização única do canal do YouTube (rode no seu computador, uma vez).

1. Baixe o arquivo de credenciais OAuth ("App para computador") do Google Cloud e salve como canal/client_secret.json.
2. pip install google-auth-oauthlib
3. python canal/autorizar.py
4. O navegador abre: entre com a conta do canal e autorize.
5. Copie os três valores impressos para os "secrets" do repositório no GitHub
   (YT_CLIENT_ID, YT_CLIENT_SECRET e YT_REFRESH_TOKEN). Não envie esses valores a ninguém.
"""
import json
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

ESCOPOS = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"]
SEGREDO = Path(__file__).resolve().parent / "client_secret.json"

fluxo = InstalledAppFlow.from_client_secrets_file(str(SEGREDO), scopes=ESCOPOS)
cred = fluxo.run_local_server(port=0, prompt="consent", access_type="offline")
dados = json.loads(SEGREDO.read_text(encoding="utf-8"))
dados = dados.get("installed") or dados.get("web")
print("\nCopie para os secrets do GitHub (Settings > Secrets and variables > Actions):")
print(f"YT_CLIENT_ID     = {dados['client_id']}")
print(f"YT_CLIENT_SECRET = {dados['client_secret']}")
print(f"YT_REFRESH_TOKEN = {cred.refresh_token}")
