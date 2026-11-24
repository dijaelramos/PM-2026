"""Gera o vídeo do YouTube de um Material do Dia: voz lendo o material + o trecho lido na tela.

Uso:
    python canal/video.py                      # materiais de hoje (horário de Pernambuco)
    python canal/video.py --data 2026-11-24    # materiais de um dia
    python canal/video.py --arquivo Material_do_Dia/2026-11-24_Historia_de_Pernambuco.md

Saída em canal/saida/<id>/: video.mp4, miniatura.png e video.json (título, descrição com capítulos, tags).

O que entra no vídeo: só as seções numeradas de conteúdo (1, 2, 3…, quadros e pegadinhas). Fica de fora tudo o que
é do estudante (roteiro, cobertura, revisão espaçada, redação, menções ao perfil e ao Orquestrador).
"""
import argparse
import asyncio
import datetime as dt
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import textwrap
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CANAL = RAIZ / "canal"
CACHE = CANAL / ".cache"
SAIDA = CANAL / "saida"
CONFIG = json.loads((CANAL / "config.json").read_text(encoding="utf-8"))

BYTES_POR_SEGUNDO = 48000 // 8  # MP3 24 kHz, 48 kbit/s, CBR (edge-tts e Azure, no formato pedido abaixo)
FORMATO_AZURE = "audio-24khz-48kbitrate-mono-mp3"
LARG, ALT = 1920, 1080
DIAS = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"]
MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro",
         "novembro", "dezembro"]

# seções que não vão para o vídeo (são do estudante, não do conteúdo)
SECAO_FORA = re.compile(r"roteiro|cobertura|revis[ãa]o espa[çc]ada|reda[çc][ãa]o|revis[ãa]o ativa|simulado", re.I)
# parágrafos pessoais (perfil, Orquestrador, erros do estudante)
PESSOAL = re.compile(r"seu perfil|do perfil|Orquestrador|sua dificuldade|suas dificuldades|você errou|seus erros|"
                     r"sua prioridade|prioridade do seu|você marcou|Perfil_do_Estudante", re.I)
ATRIBUICAO = re.compile(r"\s*\*?\((?=[^)]*(?:apostila|consenso dos manuais|tutor|base local|doutrina|base do curso|"
                        r"memoriza|texto oficial|trecho de lei|jurisprud))[^)]*\)\*?", re.I)
EMOJI = re.compile("[\U0001F300-\U0001FAFF\u2600-\u27BF\u2B50\u2705\u26A0\uFE0F]")


def hoje_recife():
    return dt.datetime.now(dt.timezone(dt.timedelta(hours=-3))).date()


# ---------------------------------------------------------------- texto

def limpar_md(t):
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    t = ATRIBUICAO.sub("", t)
    t = re.sub(r"[*_`]", "", t)
    t = re.sub(r"(?i)(consenso dos manuais|doutrina|apostila|base do curso)\s*:\s*", "", t)
    t = EMOJI.sub("", t)
    return re.sub(r"[ \t]+", " ", t).strip()


def para_fala(t):
    """Ajustes para a voz ler bem."""
    trocas = [(r"\s×\s", " versus "), (r"→", ", que leva a "), (r"\bart\.\s*", "artigo "), (r"\barts\.\s*", "artigos "),
              (r"\bnº\s*", "número "), (r"§§\s*", "parágrafos "), (r"§\s*", "parágrafo "), (r"\bséc\.\s*", "século "),
              (r"\bséculos? XVI\b", "século dezesseis"), (r"\bséculos? XVII\b", "século dezessete"),
              (r"\bséculos? XVIII\b", "século dezoito"), (r"\bséculos? XIX\b", "século dezenove"),
              (r"\bséculos? XX\b", "século vinte"), (r"\bEx\.\s*(\d+)", r"Exemplo \1"), (r"\bex\.:", "por exemplo,"),
              (r"\be\.g\.", "por exemplo"), (r"\bCF\b", "Constituição Federal"), (r"\s—\s", ", "), (r"\s–\s", " a "),
              (r"\|", ", "), (r"\s+", " ")]
    for a, b in trocas:
        t = re.sub(a, b, t)
    return t.strip()


def celulas(linha):
    return [limpar_md(c) for c in linha.strip().strip("|").split("|")]


def blocos_md(linhas):
    """Divide as linhas de uma seção em blocos: ('h3', texto) | ('p', texto) | ('tabela', [linhas]) | ('lista', [itens])."""
    out, buf, tipo = [], [], None

    def fecha():
        nonlocal buf, tipo
        if buf:
            out.append((tipo, buf if tipo in ("tabela", "lista") else " ".join(buf)))
        buf, tipo = [], None

    for ln in linhas:
        s = ln.rstrip()
        cru = s.lstrip("> ").rstrip() if s.startswith(">") else s
        if not cru.strip() or re.fullmatch(r"\s*(-{3,}|\*{3,})\s*", cru):
            fecha()
            continue
        if cru.startswith("### ") or cru.startswith("#### "):
            fecha()
            out.append(("h3", limpar_md(cru.lstrip("# "))))
            continue
        if cru.lstrip().startswith("|"):
            if tipo != "tabela":
                fecha()
                tipo = "tabela"
            if not re.match(r"^\s*\|[\s:|-]+\|\s*$", cru):
                buf.append(celulas(cru))
            continue
        m = re.match(r"^\s*(?:[-*]|\d+[.)])\s+(.*)$", cru)
        if m:
            if tipo != "lista":
                fecha()
                tipo = "lista"
            buf.append(limpar_md(m.group(1)))
            continue
        if tipo in ("tabela", "lista"):
            fecha()
        tipo = "p"
        buf.append(limpar_md(cru))
    fecha()
    return out


def partir(texto, limite):
    """Divide um texto longo em pedaços de até `limite` caracteres, cortando em fim de frase."""
    frases = re.split(r"(?<=[.!?;:])\s+", texto)
    pedacos, atual = [], ""
    for f in frases:
        if atual and len(atual) + len(f) + 1 > limite:
            pedacos.append(atual)
            atual = f
        else:
            atual = f"{atual} {f}".strip()
    if atual:
        pedacos.append(atual)
    return pedacos


def roteiro(caminho):
    """Material do dia -> dados do vídeo: título, data, disciplina e a lista de telas (seção, subtítulo, tela, fala)."""
    texto = caminho.read_text(encoding="utf-8-sig")
    linhas = texto.splitlines()
    h1 = next((l[2:].strip() for l in linhas if l.startswith("# ")), caminho.stem)
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", caminho.stem)
    data = dt.date(*map(int, m.groups())) if m else hoje_recife()
    disciplina = re.sub(r"\s*\(\d+\s*h.*?\)\s*$", "", h1.split(" — ")[-1]).strip()
    secoes, atual = [], None
    for ln in linhas:
        h2 = re.match(r"^##\s+(?!#)(.*)$", ln)
        if h2:
            titulo = limpar_md(h2.group(1))
            ok = re.match(r"^\d+(\.\d+)?\.?\s", titulo) and not SECAO_FORA.search(titulo)
            atual = {"titulo": re.sub(r"^\d+(\.\d+)?\.?\s*", "", titulo), "linhas": []} if ok else None
            if atual:
                secoes.append(atual)
            continue
        if atual is not None:
            atual["linhas"].append(ln)

    telas = []
    for sec in secoes:
        sub = ""
        primeira = True
        for tipo, conteudo in blocos_md(sec["linhas"]):
            if tipo == "h3":
                sub = re.sub(r"\s*—\s*", " — ", conteudo)
                continue
            if tipo == "p":
                if PESSOAL.search(conteudo) or len(conteudo) < 3 or not re.search(r"\w", conteudo):
                    continue
                for pedaco in partir(conteudo, 420):
                    fala = para_fala(pedaco)
                    if primeira:
                        fala = f"{sec['titulo'].rstrip('.')}{'' if sec['titulo'][-1:] in '?!' else '.'} {fala}"
                        primeira = False
                    telas.append({"secao": sec["titulo"], "sub": sub, "tipo": "texto", "tela": pedaco, "fala": fala})
            elif tipo == "lista":
                itens = [i for i in conteudo if not PESSOAL.search(i)]
                for grupo in [itens[i:i + 5] for i in range(0, len(itens), 5)]:
                    fala = ". ".join(para_fala(i).rstrip(".;") for i in grupo) + "."
                    if primeira:
                        fala = f"{sec['titulo'].rstrip('.')}{'' if sec['titulo'][-1:] in '?!' else '.'} {fala}"
                        primeira = False
                    telas.append({"secao": sec["titulo"], "sub": sub, "tipo": "lista", "tela": grupo, "fala": fala})
            elif tipo == "tabela" and len(conteudo) >= 2:
                manter = [i for i, c in enumerate(conteudo[0]) if not re.fullmatch(r"(?i)onde|material|se[çc][ãa]o", c)]
                conteudo = [[r[i] if i < len(r) else "" for i in manter] for r in conteudo]
                cab = [c.rstrip("….").strip() for c in conteudo[0]]
                corpo = [r for r in conteudo[1:] if not PESSOAL.search(" ".join(r))]
                for grupo in [corpo[i:i + 6] for i in range(0, len(corpo), 6)]:
                    frases = []
                    for r in grupo:
                        if len(cab) == 2 and not re.search(r"(?i)banca|certo|errado", " ".join(cab)):
                            partes = [f"{r[0]}: {r[1]}"]  # tabela de duas colunas: "termo: explicação"
                        else:
                            partes = [f"{cab[i]}: {c}" if cab[i] else c for i, c in enumerate(r) if c]
                        frases.append(". ".join(para_fala(x).rstrip(".") for x in partes) + ".")
                    fala = " ".join(frases)
                    if primeira:
                        fala = f"{sec['titulo'].rstrip('.')}{'' if sec['titulo'][-1:] in '?!' else '.'} {fala}"
                        primeira = False
                    telas.append({"secao": sec["titulo"], "sub": sub, "tipo": "tabela", "tela": [cab] + grupo,
                                  "fala": fala})
    return {"id": caminho.stem, "h1": h1, "data": data, "disciplina": disciplina,
            "secoes": [s["titulo"] for s in secoes], "telas": telas}


# ---------------------------------------------------------------- voz

def _chave(texto):
    return hashlib.sha1(f"{CONFIG['voz']}|{CONFIG['voz_nome']}|{CONFIG.get('taxa', '-5%')}|{texto}".encode()).hexdigest()[:20]


async def _edge(texto):
    import edge_tts
    buf = bytearray()
    for tentativa in range(4):
        try:
            buf = bytearray()
            async for parte in edge_tts.Communicate(texto, CONFIG["voz_nome"], rate=CONFIG.get("taxa", "-5%")).stream():
                if parte["type"] == "audio":
                    buf += parte["data"]
            if buf:
                return bytes(buf)
        except Exception as erro:
            print(f"    voz: tentando de novo ({erro})")
            await asyncio.sleep(3 * (tentativa + 1))
    raise RuntimeError("não foi possível sintetizar a voz")


def _azure(texto):
    import requests
    from xml.sax.saxutils import escape
    chave, regiao = os.environ["AZURE_SPEECH_KEY"], os.environ["AZURE_SPEECH_REGION"]
    ssml = (f"<speak version='1.0' xml:lang='pt-BR'><voice name='{CONFIG['voz_nome']}'>"
            f"<prosody rate='{CONFIG.get('taxa', '-5%')}'>{escape(texto)}</prosody></voice></speak>")
    r = requests.post(f"https://{regiao}.tts.speech.microsoft.com/cognitiveservices/v1", data=ssml.encode("utf-8"),
                      headers={"Ocp-Apim-Subscription-Key": chave, "Content-Type": "application/ssml+xml",
                               "X-Microsoft-OutputFormat": FORMATO_AZURE, "User-Agent": "canal-estudos"}, timeout=120)
    r.raise_for_status()
    return r.content


def sintetizar(texto):
    CACHE.mkdir(parents=True, exist_ok=True)
    arq = CACHE / f"{_chave(texto)}.mp3"
    if arq.exists():
        return arq.read_bytes()
    mp3 = _azure(texto) if CONFIG["voz"] == "azure" else asyncio.run(_edge(texto))
    arq.write_bytes(mp3)
    return mp3


# ---------------------------------------------------------------- imagens

def fonte(tamanho, negrito=False):
    from PIL import ImageFont
    nomes = (["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"] if negrito else
             ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"])
    pastas = [Path("C:/Windows/Fonts"), Path("/usr/share/fonts/truetype/dejavu"), Path("/usr/share/fonts")]
    for n in nomes:
        for p in pastas:
            if (p / n).exists():
                return ImageFont.truetype(str(p / n), tamanho)
    return ImageFont.load_default()


COR = {"fundo": (15, 27, 46), "faixa": (31, 74, 125), "texto": (238, 242, 248), "suave": (160, 177, 200),
       "destaque": (255, 196, 61), "linha": (52, 74, 105)}


def quebrar(desenho, texto, f, largura):
    linhas = []
    for par in texto.split("\n"):
        palavras, atual = par.split(), ""
        for p in palavras:
            teste = f"{atual} {p}".strip()
            if desenho.textlength(teste, font=f) <= largura:
                atual = teste
            else:
                if atual:
                    linhas.append(atual)
                atual = p
        linhas.append(atual)
    return linhas


def cabecalho(d, info, tela, progresso):
    d.rectangle([0, 0, LARG, 96], fill=COR["faixa"])
    d.text((60, 26), f"{info['disciplina']} · {info['data']:%d/%m/%Y}", font=fonte(38, True), fill=COR["texto"])
    nome = CONFIG.get("nome_canal") or ""
    if nome:
        d.text((LARG - 60 - d.textlength(nome, font=fonte(30)), 32), nome, font=fonte(30), fill=COR["suave"])
    d.text((60, 130), tela["secao"], font=fonte(52, True), fill=COR["destaque"])
    if tela["sub"]:
        d.text((60, 200), tela["sub"], font=fonte(36), fill=COR["suave"])
    d.rectangle([0, ALT - 10, LARG, ALT], fill=COR["linha"])
    d.rectangle([0, ALT - 10, int(LARG * progresso), ALT], fill=COR["destaque"])
    aviso = "Material de estudo independente · não oficial · sem vínculo com a PMPE ou a banca"
    d.text((60, ALT - 58), aviso, font=fonte(24), fill=COR["suave"])


def desenhar_tela(info, tela, progresso, destino):
    from PIL import Image, ImageDraw
    img = Image.new("RGB", (LARG, ALT), COR["fundo"])
    d = ImageDraw.Draw(img)
    cabecalho(d, info, tela, progresso)
    topo, area = 280, ALT - 280 - 90
    if tela["tipo"] == "texto":
        for tam in (54, 48, 42, 38):
            f = fonte(tam)
            linhas = quebrar(d, tela["tela"], f, LARG - 160)
            if len(linhas) * tam * 1.35 <= area:
                break
        y = topo
        for l in linhas:
            d.text((80, y), l, font=f, fill=COR["texto"])
            y += int(tam * 1.35)
    elif tela["tipo"] == "lista":
        y, f = topo, fonte(42)
        for item in tela["tela"]:
            ls = quebrar(d, item, f, LARG - 220)[:3]
            d.ellipse([90, y + 18, 106, y + 34], fill=COR["destaque"])
            for l in ls:
                d.text((130, y), l, font=f, fill=COR["texto"])
                y += 56
            y += 14
    else:  # tabela
        cab, linhas = tela["tela"][0], tela["tela"][1:]
        n = max(len(cab), 1)
        larg_col = (LARG - 160) // n
        f, fb = fonte(34), fonte(34, True)
        y = topo
        for i, c in enumerate(cab):
            d.text((80 + i * larg_col, y), "\n".join(quebrar(d, c, fb, larg_col - 30)[:2]), font=fb, fill=COR["destaque"])
        y += 90
        for r in linhas:
            altura = 1
            for i, c in enumerate(r[:n]):
                ls = quebrar(d, c, f, larg_col - 30)[:4]
                altura = max(altura, len(ls))
                d.text((80 + i * larg_col, y), "\n".join(ls), font=f, fill=COR["texto"], spacing=8)
            y += altura * 44 + 26
            d.line([80, y - 14, LARG - 80, y - 14], fill=COR["linha"], width=2)
    img.save(destino)


def desenhar_capa(info, titulo, destino, tamanho=(LARG, ALT), subtitulo=""):
    from PIL import Image, ImageDraw
    w, h = tamanho
    img = Image.new("RGB", (w, h), COR["fundo"])
    d = ImageDraw.Draw(img)
    esc = w / 1920
    d.rectangle([0, 0, w, int(140 * esc)], fill=COR["faixa"])
    d.text((int(70 * esc), int(40 * esc)), f"{info['data']:%d/%m/%Y} · Concurso Soldado PM-PE 2026", font=fonte(int(52 * esc), True),
           fill=COR["texto"])
    f = fonte(int(120 * esc), True)
    y = int(260 * esc)
    for l in quebrar(d, titulo, f, w - int(160 * esc))[:3]:
        d.text((int(70 * esc), y), l, font=f, fill=COR["destaque"])
        y += int(140 * esc)
    if subtitulo:
        for l in quebrar(d, subtitulo, fonte(int(54 * esc)), w - int(160 * esc))[:3]:
            d.text((int(70 * esc), y + int(20 * esc)), l, font=fonte(int(54 * esc)), fill=COR["texto"])
            y += int(70 * esc)
    d.text((int(70 * esc), h - int(90 * esc)), "Aula narrada · material de estudo não oficial", font=fonte(int(40 * esc)),
           fill=COR["suave"])
    img.save(destino)


# ---------------------------------------------------------------- vídeo

def ffmpeg():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def tempo(seg):
    seg = int(seg)
    return f"{seg // 3600}:{seg % 3600 // 60:02d}:{seg % 60:02d}" if seg >= 3600 else f"{seg // 60:02d}:{seg % 60:02d}"


def montar(caminho, limite_telas=None):
    info = roteiro(caminho)
    if not info["telas"]:
        print(f"  {caminho.name}: nada para o vídeo")
        return None
    pasta = SAIDA / info["id"]
    if pasta.exists():
        shutil.rmtree(pasta)
    (pasta / "telas").mkdir(parents=True)
    dia = info["data"]
    data_extenso = f"{DIAS[dia.weekday()]}, {dia.day} de {MESES[dia.month - 1]} de {dia.year}"
    titulo_aula = info["disciplina"]
    assuntos = ", ".join(s for s in info["secoes"] if not re.search(r"quadro|pegadinha", s, re.I))
    abertura = {"secao": "Abertura", "sub": "", "tipo": "capa",
                "fala": f"Aula de {titulo_aula}, para o concurso de soldado da Polícia Militar de Pernambuco, "
                        f"de {data_extenso}. Nesta aula: {assuntos}. Este é um material de estudo independente, "
                        f"não oficial. Bons estudos!"}
    fim = {"secao": "Encerramento", "sub": "", "tipo": "capa",
           "fala": "Fim da aula. Revise os quadros e as pegadinhas e resolva questões sobre o tema. Até a próxima aula!"}
    telas = [abertura] + info["telas"][:limite_telas] + [fim]

    lista, audio, capitulos, t = [], bytearray(), [], 0.0
    ultima_secao = None
    for i, tela in enumerate(telas):
        mp3 = sintetizar(tela["fala"])
        dur = len(mp3) / BYTES_POR_SEGUNDO + 0.0
        img = pasta / "telas" / f"{i:04d}.png"
        if tela["tipo"] == "capa":
            desenhar_capa(info, titulo_aula, img, subtitulo=assuntos if i == 0 else "Fim da aula")
        else:
            desenhar_tela(info, tela, (i + 1) / len(telas), img)
        if tela["secao"] != ultima_secao:
            capitulos.append((t, tela["secao"]))
            ultima_secao = tela["secao"]
        lista.append(f"file '{img.as_posix()}'\nduration {dur:.3f}")
        audio += mp3
        t += dur
        print(f"  tela {i + 1}/{len(telas)} ({tempo(t)})", end="\r")
    print()
    lista.append(f"file '{(pasta / 'telas' / f'{len(telas) - 1:04d}.png').as_posix()}'")
    (pasta / "lista.txt").write_text("\n".join(lista), encoding="utf-8")
    (pasta / "audio.mp3").write_bytes(bytes(audio))
    subprocess.run([ffmpeg(), "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(pasta / "lista.txt"),
                    "-i", str(pasta / "audio.mp3"), "-c:v", "libx264", "-tune", "stillimage", "-preset", "veryfast",
                    "-r", "12", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest",
                    "-movflags", "+faststart", str(pasta / "video.mp4")], check=True)
    desenhar_capa(info, titulo_aula, pasta / "miniatura.png", (1280, 720), subtitulo=assuntos)

    # título, descrição (com capítulos: o primeiro precisa ser 00:00) e tags
    titulo = f"{titulo_aula}: {assuntos}"
    if len(titulo) > 70:
        titulo = titulo[:67].rsplit(" ", 1)[0] + "…"
    titulo = f"{titulo} | Soldado PM-PE 2026 · {dia:%d/%m}"[:100]
    caps = "\n".join(f"{tempo(s)} {nome}" for s, nome in capitulos)
    descricao = (
        f"Aula narrada de {titulo_aula} para o concurso de Soldado da PM-PE 2026 (banca Instituto AOCP), "
        f"conforme o conteúdo do edital. Assuntos: {assuntos}.\n\n"
        f"Capítulos:\n{caps}\n\n"
        "Material de estudo independente e não oficial, sem vínculo com a Polícia Militar de Pernambuco, com o "
        "Governo do Estado ou com a banca. Confira sempre o edital e a legislação oficial.\n"
        f"{CONFIG.get('creditos', '')}\n"
        f"Narração com voz sintética.\n\nCódigo da aula: {info['id']}"
    )
    meta = {"id": info["id"], "titulo": titulo, "descricao": descricao[:4900],
            "tags": ["concurso PMPE", "soldado PM-PE", "PMPE 2026", "Instituto AOCP", titulo_aula, "concurso público",
                     "polícia militar de Pernambuco"],
            "duracao": round(t), "data": dia.isoformat()}
    (pasta / "video.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    shutil.rmtree(pasta / "telas")
    (pasta / "lista.txt").unlink()
    (pasta / "audio.mp3").unlink()
    print(f"  pronto: {pasta / 'video.mp4'} ({tempo(t)})")
    return pasta


def materiais_do_dia(dia):
    return [p for p in sorted((RAIZ / "Material_do_Dia").glob(f"{dia.isoformat()}_*.md"))
            if not p.stem.endswith("_Questoes")]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=dt.date.fromisoformat, default=None)
    ap.add_argument("--arquivo", type=Path, default=None)
    ap.add_argument("--amostra", type=int, default=None, help="só as N primeiras telas (para testar rápido)")
    a = ap.parse_args()
    arquivos = [a.arquivo] if a.arquivo else materiais_do_dia(a.data or hoje_recife())
    if not arquivos:
        print("Nenhum material para esta data.")
        return
    for arq in arquivos:
        print(f"Gerando o vídeo de {arq.name}")
        montar(arq if arq.is_absolute() else RAIZ / arq, a.amostra)


if __name__ == "__main__":
    sys.exit(main())
