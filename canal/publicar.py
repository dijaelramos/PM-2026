"""Publica no YouTube os vídeos gerados por canal/video.py (pasta canal/saida/<id>/).

Precisa destas variáveis de ambiente (no GitHub, como "secrets"):
    YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN   (veja canal/README.md e canal/autorizar.py)

Regras de segurança:
- não publica de novo uma aula que já está no canal (procura o "Código da aula" nas descrições dos envios);
- com a voz "edge" (gratuita, sem licença comercial), o vídeo sobe sempre como PRIVADO, seja qual for a config;
- a privacidade padrão vem de canal/config.json ("private", "unlisted" ou "public").
"""
import json
import os
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CANAL = RAIZ / "canal"
SAIDA = CANAL / "saida"
CONFIG = json.loads((CANAL / "config.json").read_text(encoding="utf-8"))
ESCOPOS = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"]


def cliente():
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    cred = Credentials(None, refresh_token=os.environ["YT_REFRESH_TOKEN"], token_uri="https://oauth2.googleapis.com/token",
                       client_id=os.environ["YT_CLIENT_ID"], client_secret=os.environ["YT_CLIENT_SECRET"], scopes=ESCOPOS)
    return build("youtube", "v3", credentials=cred, cache_discovery=False)


def codigos_publicados(yt):
    """Códigos de aula já enviados (lê as descrições da playlist de envios do canal)."""
    canal = yt.channels().list(part="contentDetails", mine=True).execute()
    uploads = canal["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    codigos, pagina = set(), None
    for _ in range(10):  # até 500 vídeos mais recentes
        r = yt.playlistItems().list(part="snippet", playlistId=uploads, maxResults=50, pageToken=pagina).execute()
        for it in r.get("items", []):
            desc = it["snippet"].get("description", "")
            if "Código da aula: " in desc:
                codigos.add(desc.rsplit("Código da aula: ", 1)[1].split()[0])
        pagina = r.get("nextPageToken")
        if not pagina:
            break
    return codigos


def enviar(yt, pasta):
    from googleapiclient.http import MediaFileUpload
    meta = json.loads((pasta / "video.json").read_text(encoding="utf-8"))
    privacidade = CONFIG.get("privacidade", "private")
    if CONFIG.get("voz") != "azure" and privacidade != "private":
        print("  voz 'edge' não tem licença para uso comercial: o vídeo sobe como PRIVADO.")
        privacidade = "private"
    corpo = {
        "snippet": {"title": meta["titulo"], "description": meta["descricao"], "tags": meta["tags"],
                    "categoryId": "27", "defaultLanguage": "pt-BR", "defaultAudioLanguage": "pt-BR"},
        "status": {"privacyStatus": privacidade, "selfDeclaredMadeForKids": False, "embeddable": True},
    }
    pedido = yt.videos().insert(part="snippet,status", body=corpo,
                                media_body=MediaFileUpload(str(pasta / "video.mp4"), mimetype="video/mp4",
                                                           chunksize=8 * 1024 * 1024, resumable=True))
    resposta = None
    while resposta is None:
        status, resposta = pedido.next_chunk()
        if status:
            print(f"  enviando… {int(status.progress() * 100)}%", end="\r")
    vid = resposta["id"]
    print(f"\n  enviado: https://youtu.be/{vid} ({privacidade})")
    try:
        yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(pasta / "miniatura.png"),
                                                                     mimetype="image/png")).execute()
    except Exception as erro:  # miniatura personalizada exige canal verificado por telefone
        print(f"  aviso: miniatura não enviada ({erro})")
    return vid


def main():
    if not os.environ.get("YT_REFRESH_TOKEN"):
        print("Sem credenciais do YouTube (YT_REFRESH_TOKEN): nada foi publicado. Os vídeos ficam em canal/saida.")
        return 0
    pastas = [p for p in sorted(SAIDA.glob("*")) if (p / "video.mp4").exists()]
    if not pastas:
        print("Nenhum vídeo para publicar.")
        return 0
    yt = cliente()
    ja = codigos_publicados(yt)
    for pasta in pastas:
        meta = json.loads((pasta / "video.json").read_text(encoding="utf-8"))
        if meta["id"] in ja:
            print(f"{meta['id']}: já está no canal")
            continue
        print(f"Publicando {meta['id']}")
        enviar(yt, pasta)
    return 0


if __name__ == "__main__":
    sys.exit(main())
