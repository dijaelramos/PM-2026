"""Perfil central do Chrome e conexão local reutilizada pelos concursos (Python 3.8+)."""
import json
import os
from pathlib import Path
import re
import subprocess
import time
from urllib.parse import urlsplit

from motor import ler_json


def canal_normalizado(url):
    u = urlsplit(url.strip())
    return (u.hostname or "").lower().replace("www.", "", 1) + u.path.rstrip("/").lower()


def resolver(projeto, config):
    central = Path(projeto).resolve().parent / "canal_youtube"
    cadastro = ler_json(central / "config.json")
    opcao = cadastro.get("perfil_compartilhado")
    if not opcao:
        return Path(projeto) / "canal/.chrome_perfil", False
    if canal_normalizado(opcao["url_canal"]) != canal_normalizado(config["url_canal"]):
        raise ValueError("O perfil central pertence a outro canal. Confira a URL configurada neste concurso.")
    perfil = (central / opcao["pasta"]).resolve()
    if perfil.parent != central.resolve() or perfil.name != ".chrome_perfil":
        raise ValueError("O perfil central deve ficar em canal_youtube/.chrome_perfil.")
    return perfil, True


def em_uso(perfil):
    """Consulta só os processos do perfil indicado; não fecha nem termina navegadores."""
    perfil = Path(perfil)
    if os.name != "nt":
        return (perfil / "SingletonLock").is_symlink() or (perfil / "SingletonLock").exists()
    codigo = (
        "$ErrorActionPreference='Stop'; "
        "@(Get-CimInstance Win32_Process | Where-Object { "
        "$_.Name -in 'chrome.exe','msedge.exe' -and $_.CommandLine -and "
        "$_.CommandLine.Contains('--user-data-dir') } | "
        "Select-Object -ExpandProperty CommandLine) | ConvertTo-Json -Compress"
    )
    resultado = subprocess.run(
        ["powershell", "-NoProfile", "-Command", codigo], capture_output=True, text=True, timeout=30)
    if resultado.returncode:
        raise RuntimeError("Não consegui confirmar se o Chrome do perfil está fechado.")
    comandos = json.loads(resultado.stdout.strip() or "[]")
    if isinstance(comandos, str):
        comandos = [comandos]
    import ctypes
    from ctypes import wintypes
    dividir = ctypes.windll.shell32.CommandLineToArgvW
    dividir.argtypes = [wintypes.LPCWSTR, ctypes.POINTER(ctypes.c_int)]
    dividir.restype = ctypes.POINTER(wintypes.LPWSTR)
    liberar = ctypes.windll.kernel32.LocalFree
    liberar.argtypes = [ctypes.c_void_p]
    liberar.restype = ctypes.c_void_p
    esperado = perfil.resolve()
    for comando in comandos:
        quantidade = ctypes.c_int()
        ponteiro = dividir(comando, ctypes.byref(quantidade))
        if not ponteiro:
            raise RuntimeError("Não consegui identificar o perfil de um navegador aberto.")
        try:
            argumentos = [ponteiro[i] for i in range(quantidade.value)]
        finally:
            liberar(ponteiro)
        for i, argumento in enumerate(argumentos):
            valor = None
            if argumento.startswith("--user-data-dir="):
                valor = argumento.split("=", 1)[1]
            elif argumento == "--user-data-dir" and i + 1 < len(argumentos):
                valor = argumentos[i + 1]
            if valor and Path(valor).resolve() == esperado:
                return True
    return False


def endpoint(perfil):
    try:
        linhas = (Path(perfil) / "DevToolsActivePort").read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        return None
    if len(linhas) != 2 or not linhas[0].isdigit() or not 1 <= int(linhas[0]) <= 65535:
        return None
    if not re.fullmatch(r"/devtools/browser/[a-zA-Z0-9-]+", linhas[1]):
        return None
    return "ws://127.0.0.1:" + linhas[0] + linhas[1]


def conectar(pw, perfil, executavel, pausa_ms=1500):
    """O chamador deve manter a trava do perfil durante toda a operação no Studio."""
    perfil = Path(perfil)
    perfil.mkdir(parents=True, exist_ok=True)

    def tentar():
        url = endpoint(perfil)
        if not url:
            return None
        try:
            return pw.chromium.connect_over_cdp(url, timeout=3000, slow_mo=pausa_ms)
        except Exception:
            return None

    browser = tentar()
    if browser is None:
        if em_uso(perfil):
            raise RuntimeError("O perfil central está aberto sem conexão disponível. Feche somente o Chrome do robô e tente novamente.")
        anterior = endpoint(perfil)
        argumentos = [
            str(executavel), "--user-data-dir=" + str(perfil),
            "--remote-debugging-address=127.0.0.1", "--remote-debugging-port=0",
            "--lang=pt-BR", "--start-maximized", "--no-first-run", "--no-default-browser-check",
            "https://studio.youtube.com",
        ]
        opcoes = {}
        if os.name == "nt":
            opcoes["creationflags"] = subprocess.DETACHED_PROCESS | subprocess.CREATE_NEW_PROCESS_GROUP
        subprocess.Popen(argumentos, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL, close_fds=True, **opcoes)
        limite = time.monotonic() + 60
        while time.monotonic() < limite:
            if endpoint(perfil) != anterior:
                browser = tentar()
                if browser is not None:
                    break
            time.sleep(0.5)
        if browser is None:
            raise RuntimeError("O Chrome central não disponibilizou a conexão local. Consulte o log e feche apenas a janela do robô antes de tentar novamente.")
    if not browser.contexts:
        raise RuntimeError("O Chrome central não disponibilizou o contexto do perfil.")
    return browser, browser.contexts[0]


def abrir_login_manual(perfil, executavel):
    """Abre o Chrome normal; o chamador deve manter a trava do perfil."""
    perfil = Path(perfil)
    if em_uso(perfil):
        from motor import Ocupado
        raise Ocupado(
            "Feche somente a janela do Chrome central antes de iniciar o login manual. "
            "Não feche um navegador que esteja enviando um vídeo; aguarde o término.")
    perfil.mkdir(parents=True, exist_ok=True)
    # Autenticação humana, sem Playwright, depuração remota ou opções de automação.
    return subprocess.Popen([
        str(executavel), "--user-data-dir=" + str(perfil), "--new-window",
        "https://studio.youtube.com",
    ])


def login_manual(perfil, executavel, perguntar=input, informar=print):
    informar("O login será feito no Chrome normal, sem conexão com o robô.")
    informar("Entre na conta, selecione o canal e confira se o YouTube Studio abre.")
    informar("Depois, FECHE a janela do Chrome desse perfil para salvar a sessão.")
    abrir_login_manual(perfil, executavel)
    perguntar("Após concluir o login e fechar essa janela, aperte Enter: ")
    while em_uso(perfil):
        informar("O Chrome desse perfil ainda está aberto. Feche apenas essa janela.")
        perguntar("Depois de fechar a janela do perfil, aperte Enter: ")
    informar("Etapa manual encerrada. Use iniciar_robo.bat --testar para conferir a sessão.")

def _timeout_de_navegacao(erro):
    if isinstance(erro, TimeoutError):
        return True
    try:
        from playwright.sync_api import TimeoutError as TimeoutPlaywright
    except ImportError:
        return False
    return isinstance(erro, TimeoutPlaywright)


def abrir_pagina(page, url, pronto="body", log=None):
    """Repete somente a abertura GET da página, antes de qualquer ação de envio."""
    for tentativa in range(2):
        try:
            page.bring_to_front()
            page.goto(url, wait_until="commit", timeout=45000)
            # A resposta da navegação não basta: confirme o elemento que será usado.
            page.locator(pronto).first.wait_for(state="visible", timeout=60000)
            return
        except Exception as erro:
            if not _timeout_de_navegacao(erro) or tentativa == 1:
                raise
            if log:
                log("  A página demorou a abrir; repetindo somente a navegação (2/2).")
