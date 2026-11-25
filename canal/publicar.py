"""Publica no YouTube a aula do dia (canal/video.py) e os Shorts do dia (canal/shorts.py), pasta canal/saida/<aula>/.

Precisa destas variáveis de ambiente (no GitHub, como "secrets"):
    YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN   (veja canal/README.md e canal/autorizar.py)

Uso:
    python canal/publicar.py            # publica o que estiver em canal/saida
    python canal/publicar.py --testar   # só confere a conexão (mostra o nome do canal); não envia nada

Regras de segurança:
- enquanto "api_auditada" for false em config.json, NÃO envia nada: o YouTube trava como privado, para sempre,
  todo vídeo enviado por projeto não auditado. Os vídeos ficam no artefato da aba Actions para envio manual;
- não publica de novo o que já está no canal (procura o "Código da aula"/"Código do short" nas descrições);
- com a voz "edge" (gratuita, sem licença comercial), tudo sobe como PRIVADO, seja qual for a config;
- a aula sai com a privacidade de config.json; cada Short fica agendado para o seu horário ("horarios_shorts",
  hora do Recife). Se o horário já passou, o Short sai na hora.
"""
import argparse
import datetime as dt
import json
import os
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CANAL = RAIZ / "canal"
SAIDA = CANAL / "saida"
CONFIG = json.loads((CANAL / "config.json").read_text(encoding="utf-8"))
ESCOPOS = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"]
RECIFE = dt.timezone(dt.timedelta(hours=-3))


def segredo(nome):
    """Valor do secret sem os deslizes comuns de cópia: espaços, aspas, vírgula, 'NOME =' ou '"NOME":' na frente."""
    v = os.environ.get(nome, "").strip()
    v = re.sub(r'^\s*"?%s"?\s*[:=]\s*' % nome, "", v)
    return v.strip().rstrip(",").strip().strip('"').strip("'").strip()


def cliente():
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    cid = segredo("YT_CLIENT_ID")
    if not re.fullmatch(r"\d+-[a-z0-9]+\.apps\.googleusercontent\.com", cid):
        print(f"AVISO: o secret YT_CLIENT_ID não tem o formato esperado ({len(cid)} caracteres; o certo termina em "
              "'.apps.googleusercontent.com'). Confira o valor em Settings > Secrets and variables > Actions.")
    cred = Credentials(None, refresh_token=segredo("YT_REFRESH_TOKEN"), token_uri="https://oauth2.googleapis.com/token",
                       client_id=cid, client_secret=segredo("YT_CLIENT_SECRET"), scopes=ESCOPOS)
    return build("youtube", "v3", credentials=cred, cache_discovery=False)


def publicados(yt):
    """{código: id do vídeo} dos envios recentes do canal (lê as descrições da playlist de envios)."""
    canal = yt.channels().list(part="contentDetails", mine=True).execute()
    uploads = canal["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    codigos, pagina = {}, None
    for _ in range(10):  # até 500 vídeos mais recentes
        r = yt.playlistItems().list(part="snippet", playlistId=uploads, maxResults=50, pageToken=pagina).execute()
        for it in r.get("items", []):
            desc = it["snippet"].get("description", "")
            for marca in ("Código da aula: ", "Código do short: "):
                if marca in desc:
                    codigos[desc.rsplit(marca, 1)[1].split()[0]] = it["snippet"]["resourceId"]["videoId"]
        pagina = r.get("nextPageToken")
        if not pagina:
            break
    return codigos


def privacidade_base():
    priv = CONFIG.get("privacidade", "private")
    if CONFIG.get("voz") != "azure" and priv != "private":
        print("  voz 'edge' não tem licença para uso comercial: o vídeo sobe como PRIVADO.")
        priv = "private"
    return priv


def enviar(yt, arquivo, meta, status, miniatura=None):
    from googleapiclient.http import MediaFileUpload
    corpo = {
        "snippet": {"title": meta["titulo"], "description": meta["descricao"], "tags": meta["tags"],
                    "categoryId": "27", "defaultLanguage": "pt-BR", "defaultAudioLanguage": "pt-BR"},
        "status": dict({"selfDeclaredMadeForKids": False, "embeddable": True}, **status),
    }
    pedido = yt.videos().insert(part="snippet,status", body=corpo,
                                media_body=MediaFileUpload(str(arquivo), mimetype="video/mp4",
                                                           chunksize=8 * 1024 * 1024, resumable=True))
    resposta = None
    while resposta is None:
        st, resposta = pedido.next_chunk()
        if st:
            print(f"  enviando… {int(st.progress() * 100)}%", end="\r")
    vid = resposta["id"]
    print(f"\n  enviado: https://youtu.be/{vid} ({status.get('privacyStatus')}"
          f"{', agendado para ' + status['publishAt'] if status.get('publishAt') else ''})")
    if miniatura and miniatura.exists():
        try:
            yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(str(miniatura), mimetype="image/png")).execute()
        except Exception as erro:  # miniatura personalizada exige canal verificado por telefone
            print(f"  aviso: miniatura não enviada ({erro})")
    return vid


def status_do_short(meta, agora):
    priv = privacidade_base()
    if priv != "public":
        return {"privacyStatus": priv}
    h, m = map(int, meta["horario"].split(":"))
    quando = dt.datetime.combine(dt.date.fromisoformat(meta["data"]), dt.time(h, m), RECIFE)
    if agora.date() > quando.date():  # Short de um dia que já passou: sai no mesmo horário de hoje
        quando = dt.datetime.combine(agora.date(), dt.time(h, m), RECIFE)
    if quando <= agora + dt.timedelta(minutes=15):
        return {"privacyStatus": "public"}
    # o agendamento exige vídeo privado com publishAt (em UTC)
    return {"privacyStatus": "private", "publishAt": quando.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--testar", action="store_true", help="só confere a conexão com o canal")
    a = ap.parse_args()
    if not os.environ.get("YT_REFRESH_TOKEN"):
        print("Sem credenciais do YouTube (YT_REFRESH_TOKEN): nada foi publicado. Os vídeos ficam em canal/saida.")
        return 0
    yt = cliente()
    c = yt.channels().list(part="snippet,statistics", mine=True).execute()["items"][0]  # confere os secrets
    print(f"Conexão OK: canal \"{c['snippet']['title']}\" ({c['statistics'].get('videoCount', '?')} vídeos).")
    if a.testar:
        return 0
    if not CONFIG.get("api_auditada"):
        print("Projeto da API ainda não auditado (config.json: \"api_auditada\": false): nada foi enviado, porque o "
              "YouTube travaria os vídeos como privados. Baixe os vídeos no artefato desta execução e envie pelo "
              "YouTube Studio (dá para agendar os Shorts lá).")
        return 0
    pastas = [p for p in sorted(SAIDA.glob("*")) if p.is_dir()]
    if not pastas:
        print("Nenhum vídeo para publicar.")
        return 0
    ja = publicados(yt)
    agora = dt.datetime.now(RECIFE)
    for pasta in pastas:
        if (pasta / "video.mp4").exists():
            meta = json.loads((pasta / "video.json").read_text(encoding="utf-8"))
            if meta["id"] in ja:
                print(f"{meta['id']}: aula já está no canal")
            else:
                print(f"Publicando a aula {meta['id']}")
                ja[meta["id"]] = enviar(yt, pasta / "video.mp4", meta, {"privacyStatus": privacidade_base()},
                                        pasta / "miniatura.png")
        for js in sorted((pasta / "shorts").glob("short_*.json")):
            meta = json.loads(js.read_text(encoding="utf-8"))
            if meta["id"] in ja:
                print(f"{meta['id']}: short já está no canal")
                continue
            aula = ja.get(meta["aula"])
            link = f"https://youtu.be/{aula}" if aula else (CONFIG.get("url_canal") or "no canal")
            meta["descricao"] = meta["descricao"].replace("{link_aula}", link)
            print(f"Publicando {meta['id']} ({meta['horario']})")
            ja[meta["id"]] = enviar(yt, js.with_suffix(".mp4"), meta, status_do_short(meta, agora))
    return 0


if __name__ == "__main__":
    sys.exit(main())
