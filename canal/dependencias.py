"""Confere e instala o que o robô e os geradores de vídeo precisam, em qualquer computador.

- Pacotes Python que faltarem: instala na hora (pip).
- Uma vez por semana: atualiza todos (o edge-tts muda com frequência, e versão velha para de gerar a voz).
- Sem pip: ativa o pip do próprio Python (ensurepip).
O Python em si e o navegador são conferidos pelo canal/iniciar_robo.bat (Windows).
"""
import datetime as dt
import importlib
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

CANAL = Path(__file__).resolve().parent
ESTADO = CANAL / ".deps.json"  # quando foi a última atualização (fica fora do Git)
DIAS_ENTRE_ATUALIZACOES = 7

# (módulo importado, pacote no pip)
PACOTES = [
    ("edge_tts", "edge-tts"),
    ("PIL", "pillow"),
    ("imageio_ffmpeg", "imageio-ffmpeg"),
    ("playwright", "playwright"),
    ("requests", "requests"),
]


def _pip(*args):
    cmd = [sys.executable, "-m", "pip", *args, "--disable-pip-version-check"]
    if sys.prefix == getattr(sys, "base_prefix", sys.prefix) and "install" in args:
        cmd.append("--user")  # fora de ambiente virtual: instala só para o usuário (não pede administrador)
    return subprocess.run(cmd, capture_output=True, text=True)


def _tem_pip():
    return importlib.util.find_spec("pip") is not None


def garantir(log=print, atualizar=True):
    """Instala o que falta; uma vez por semana, atualiza tudo. Devolve True se está tudo pronto."""
    if sys.version_info < (3, 8):
        log(f"ERRO: o robô precisa do Python 3.8 ou mais novo (este é o {sys.version.split()[0]}). "
            "Instale o Python 3.12 em https://www.python.org/downloads/")
        return False
    if getattr(sys, "_is_gil_enabled", lambda: True)() is False:
        log(f"ERRO: este é o Python {sys.version.split()[0]} experimental (sem GIL, '3.13t'), sem pacotes prontos "
            "para o robô. Use o Python normal: rode com 'python' ou 'py -3.12', ou use o canal/iniciar_robo.bat.")
        return False
    if not _tem_pip():
        log("Ativando o pip deste Python…")
        subprocess.run([sys.executable, "-m", "ensurepip", "--upgrade"], capture_output=True, text=True)
    faltando = [pip for mod, pip in PACOTES if importlib.util.find_spec(mod) is None]
    if faltando:
        log(f"Instalando o que falta: {', '.join(faltando)} (pode levar alguns minutos)…")
        r = _pip("install", "-q", *faltando)
        if r.returncode != 0:
            log("ERRO ao instalar pacotes:\n" + (r.stderr or r.stdout)[-1500:])
            return False
        importlib.invalidate_caches()
        _marcar_atualizado()
    elif atualizar and _precisa_atualizar():
        log("Atualização semanal dos pacotes do robô…")
        r = _pip("install", "-q", "--upgrade", *[pip for _, pip in PACOTES])
        if r.returncode == 0:
            _marcar_atualizado()
            log("  pacotes atualizados")
        else:
            log("  aviso: não consegui atualizar agora (sigo com as versões instaladas)")
    ainda = [mod for mod, _ in PACOTES if importlib.util.find_spec(mod) is None]
    if ainda:
        log(f"ERRO: ainda faltam {', '.join(ainda)}. Feche e abra de novo o terminal e rode o robô outra vez.")
        return False
    return True


def _precisa_atualizar():
    try:
        ultima = dt.date.fromisoformat(json.loads(ESTADO.read_text(encoding="utf-8"))["atualizado"])
    except Exception:
        return True
    return (dt.date.today() - ultima).days >= DIAS_ENTRE_ATUALIZACOES


def _marcar_atualizado():
    try:
        ESTADO.write_text(json.dumps({"atualizado": dt.date.today().isoformat()}), encoding="utf-8")
    except Exception:
        pass


if __name__ == "__main__":
    sys.exit(0 if garantir() else 1)
