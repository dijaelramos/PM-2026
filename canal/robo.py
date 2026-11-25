"""Robô do canal: gera e posta no YouTube Studio (pelo Chrome) a aula e os 3 Shorts de cada dia útil, em loop.

Uso (no terminal, na pasta do projeto):
    python canal/robo.py --login     # 1ª vez: abre o Chrome do robô para você entrar na conta do canal
    python canal/robo.py --testar    # confere se o robô está logado no YouTube Studio
    python canal/robo.py --simular   # mostra a agenda de hoje, sem gerar nem postar nada
    python canal/robo.py             # liga o robô: fica rodando até você fechar o terminal (Ctrl+C)

Agenda de cada dia útil (horários em config.json):
    "horario_aula" (07:00)            gera e posta a aula de cada material do dia
    "horarios_shorts" (12, 18, 21 h)  gera e posta os Shorts 1/3, 2/3 e 3/3
Se o robô for ligado tarde, ele posta o que estiver atrasado, com pelo menos 1 hora entre um Short e outro.
O registro do que já foi postado fica em canal/.postados.json, para nunca postar duas vezes.

Atenção: os Termos do YouTube proíbem acessar o serviço por meios automatizados sem autorização. O uso deste robô
é por sua conta e risco, e o risco é para o canal. O robô usa um perfil de Chrome só dele (canal/.chrome_perfil).
"""
import argparse
import ctypes
import datetime as dt
import json
import re
import subprocess
import sys
import time
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import shorts as S  # noqa: E402
import video as V  # noqa: E402

PERFIL = V.CANAL / ".chrome_perfil"
REGISTRO = V.CANAL / ".postados.json"
ERROS = V.SAIDA / "_erros"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
INTERVALO_SHORTS = dt.timedelta(hours=1)
MAX_TENTATIVAS = 3


def agora():
    return dt.datetime.now(dt.timezone(dt.timedelta(hours=-3))).replace(tzinfo=None)  # hora do Recife


def hora(txt, dia):
    h, m = map(int, txt.split(":"))
    return dt.datetime.combine(dia, dt.time(h, m))


def log(msg):
    print(f"[{agora():%d/%m %H:%M}] {msg}", flush=True)


def registro():
    try:
        return json.loads(REGISTRO.read_text(encoding="utf-8"))
    except Exception:
        return {}


def registrar(chave, link):
    r = registro()
    r[chave] = {"link": link, "quando": agora().isoformat(timespec="minutes")}
    REGISTRO.write_text(json.dumps(r, ensure_ascii=False, indent=2), encoding="utf-8")


def visibilidade():
    v = V.CONFIG.get("visibilidade_robo", "public").upper()
    if v == "PUBLIC" and V.CONFIG.get("voz") != "azure" and not V.CONFIG.get("aceito_voz_edge_em_publico"):
        log("AVISO: a voz 'edge' (gratuita) não tem licença para uso comercial, então o vídeo vai como PRIVADO. Para "
            "postar público: use a voz do Azure (\"voz\": \"azure\") ou, por sua conta e risco, marque "
            "\"aceito_voz_edge_em_publico\": true em canal/config.json.")
        return "PRIVATE"
    return v if v in ("PUBLIC", "UNLISTED", "PRIVATE") else "PRIVATE"


# ---------------------------------------------------------------- agenda

def tarefas_do_dia(dia):
    if dia.weekday() >= 5:
        return []
    tarefas = []
    for m in V.materiais_do_dia(dia):
        tarefas.append({"tipo": "aula", "chave": m.stem, "material": m,
                        "quando": hora(V.CONFIG.get("horario_aula", "07:00"), dia), "nome": f"aula {m.stem}"})
    principal = S.principal_do_dia(dia)
    if principal:
        m = principal[0]
        for n, h in enumerate(V.CONFIG.get("horarios_shorts", ["12:00", "18:00", "21:00"]), 1):
            tarefas.append({"tipo": "short", "n": n, "chave": f"{m.stem}#short{n}", "material": m,
                            "quando": hora(h, dia), "nome": f"Short {n}/3 de {m.stem}"})
    return tarefas


def preparar(t):
    """Gera o vídeo se ainda não existir. Devolve (arquivo, título, descrição, miniatura) ou None."""
    pasta = V.SAIDA / t["material"].stem
    if t["tipo"] == "aula":
        if not (pasta / "video.mp4").exists():
            log(f"gerando a aula de {t['material'].name} (alguns minutos)…")
            if not V.montar(t["material"].resolve()):
                return None
        meta = json.loads((pasta / "video.json").read_text(encoding="utf-8"))
        return pasta / "video.mp4", meta["titulo"], meta["descricao"], pasta / "miniatura.png"
    js = pasta / "shorts" / f"short_{t['n']}.json"
    if not js.exists():
        log(f"gerando os Shorts de {t['material'].name}…")
        S.montar(t["material"].resolve())
    if not js.exists():
        return None
    meta = json.loads(js.read_text(encoding="utf-8"))
    aula = registro().get(t["material"].stem, {}).get("link")
    desc = meta["descricao"].replace("{link_aula}", aula or V.CONFIG.get("url_canal", "no canal"))
    return js.with_suffix(".mp4"), meta["titulo"], desc, None


# ---------------------------------------------------------------- Chrome / YouTube Studio

def limpo(texto, limite):
    return texto.replace("<", "‹").replace(">", "›")[:limite]  # o YouTube não aceita < e >


def abrir_chrome(pw):
    PERFIL.mkdir(parents=True, exist_ok=True)
    return pw.chromium.launch_persistent_context(str(PERFIL), channel="chrome", headless=False,
                                                 viewport={"width": 1400, "height": 900}, args=["--lang=pt-BR"])


def preencher(page, seletor, texto):
    caixa = page.locator(seletor).first
    caixa.wait_for(timeout=180_000)
    caixa.click()
    page.keyboard.press("Control+A")
    page.keyboard.press("Delete")
    page.keyboard.type(texto)


def esperar_envio(page, limite_min=90):
    """Espera o upload terminar (o rótulo de progresso deixa de mostrar porcentagem/'enviando')."""
    fim = time.time() + limite_min * 60
    rotulo = page.locator("ytcp-video-upload-progress .progress-label, ytcp-video-upload-progress").first
    while time.time() < fim:
        try:
            txt = rotulo.inner_text(timeout=5000)
        except Exception:
            txt = ""
        if txt and not re.search(r"\d+\s*%|enviando|uploading|carregando", txt, re.I):
            return txt.strip()
        time.sleep(5)
    raise TimeoutError("o upload não terminou no tempo esperado")


def postar(arquivo, titulo, descricao, visib, miniatura=None):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        ctx = abrir_chrome(pw)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        try:
            page.goto("https://www.youtube.com/upload", wait_until="domcontentloaded", timeout=120_000)
            page.wait_for_timeout(4000)
            if "accounts.google.com" in page.url:
                raise RuntimeError("o Chrome do robô não está logado. Rode: python canal/robo.py --login")
            page.locator('input[type="file"]').first.set_input_files(str(arquivo))
            preencher(page, "#title-textarea #textbox", limpo(titulo, 100))
            preencher(page, "#description-textarea #textbox", limpo(descricao, 4900))
            if miniatura and miniatura.exists():
                try:
                    page.locator("input#file-loader").first.set_input_files(str(miniatura), timeout=10_000)
                except Exception:
                    log("  (miniatura não enviada: o canal precisa de verificação por telefone)")
            page.locator('tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]').first.click()
            link = None
            for _ in range(60):  # o link aparece depois que o upload começa
                try:
                    link = page.locator('ytcp-video-info a[href*="youtu"]').first.get_attribute("href", timeout=2000)
                except Exception:
                    link = None
                if link:
                    break
                page.wait_for_timeout(2000)
            for _ in range(3):  # Detalhes -> Elementos do vídeo -> Verificações -> Visibilidade
                page.locator("#next-button").first.click()
                page.wait_for_timeout(2000)
            page.locator(f'tp-yt-paper-radio-button[name="{visib}"]').first.click()
            estado = esperar_envio(page)
            log(f"  envio concluído ({estado[:60]})")
            page.locator("#done-button").first.click()
            page.locator("ytcp-video-share-dialog, ytcp-uploads-still-processing-dialog").first.wait_for(timeout=180_000)
            page.wait_for_timeout(3000)
            return link or "(link não capturado)"
        except Exception:
            ERROS.mkdir(parents=True, exist_ok=True)
            foto = ERROS / f"erro_{agora():%Y%m%d_%H%M%S}.png"
            try:
                page.screenshot(path=str(foto), full_page=True)
                log(f"  foto da tela do erro: {foto}")
            except Exception:
                pass
            raise
        finally:
            ctx.close()


# ---------------------------------------------------------------- comandos

def login():
    PERFIL.mkdir(parents=True, exist_ok=True)
    print("Abrindo o Chrome do robô. Entre na conta do canal (infinitycursosbeberibe), confira se o YouTube Studio "
          "abre e depois FECHE essa janela do Chrome.")
    subprocess.Popen([str(CHROME), f"--user-data-dir={PERFIL}", "https://studio.youtube.com"]).wait()
    input("Quando tiver fechado a janela, aperte Enter para eu conferir o login… ")
    return testar()


def testar():
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        ctx = abrir_chrome(pw)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto("https://studio.youtube.com", wait_until="domcontentloaded", timeout=120_000)
        page.wait_for_timeout(6000)
        ok = "studio.youtube.com" in page.url and "accounts.google.com" not in page.url
        ctx.close()
    print("Login OK: o robô abre o YouTube Studio." if ok else "Sem login: rode python canal/robo.py --login")
    return 0 if ok else 1


def simular():
    dia, r = agora().date(), registro()
    tarefas = tarefas_do_dia(dia)
    print(f"Agenda de {dia:%d/%m/%Y} (visibilidade: {visibilidade()}):")
    if not tarefas:
        print("  nada hoje (fim de semana ou sem material)")
    for t in tarefas:
        situacao = "já postado" if t["chave"] in r else ("atrasado: posta ao ligar" if agora() >= t["quando"] else "aguardando")
        print(f"  {t['quando']:%H:%M}  {t['nome']}  [{situacao}]")
    return 0


def ligar():
    try:  # mantém o Windows acordado enquanto o robô roda (sem suspender)
        ctypes.windll.kernel32.SetThreadExecutionState(0x80000000 | 0x00000001)
    except Exception:
        pass
    log("Robô ligado. Deixe este terminal aberto; Ctrl+C desliga.")
    falhas, ultimo_short, ultimo_aviso = {}, None, None
    while True:
        dia, r = agora().date(), registro()
        pendentes = [t for t in tarefas_do_dia(dia) if t["chave"] not in r and falhas.get(t["chave"], 0) < MAX_TENTATIVAS]
        prontas = [t for t in pendentes if agora() >= t["quando"]
                   and not (t["tipo"] == "short" and ultimo_short and agora() - ultimo_short < INTERVALO_SHORTS)]
        if prontas:
            t = prontas[0]
            log(f"Postando: {t['nome']}")
            try:
                item = preparar(t)
                if not item:
                    log("  nada para postar neste material; pulando")
                    registrar(t["chave"], None)
                    continue
                link = postar(*item[:3], visibilidade(), item[3])
                registrar(t["chave"], link)
                if t["tipo"] == "short":
                    ultimo_short = agora()
                log(f"  postado: {link}")
            except KeyboardInterrupt:
                raise
            except Exception as erro:
                falhas[t["chave"]] = falhas.get(t["chave"], 0) + 1
                log(f"  ERRO ({falhas[t['chave']]}/{MAX_TENTATIVAS}): {erro}")
                traceback.print_exc()
                time.sleep(15 * 60)
            continue
        proxima = min(pendentes, key=lambda t: t["quando"], default=None)
        aviso = f"Próximo: {proxima['nome']} às {proxima['quando']:%H:%M}" if proxima else "Tudo postado hoje; amanhã recomeça."
        if aviso != ultimo_aviso:
            log(aviso)
            ultimo_aviso = aviso
        time.sleep(60)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--login", action="store_true")
    g.add_argument("--testar", action="store_true")
    g.add_argument("--simular", action="store_true")
    a = ap.parse_args()
    if a.login:
        return login()
    if a.testar:
        return testar()
    if a.simular:
        return simular()
    try:
        ligar()
    except KeyboardInterrupt:
        log("Robô desligado.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
