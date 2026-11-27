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

VERSAO_SAIDA = 4  # o robô gera de novo vídeos com versão mais velha (ou amostras de teste)
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
    # "Consenso dos manuais: a nova área…" -> "A nova área…" (no começo de frase, a letra seguinte fica maiúscula)
    t = re.sub(r"(?i)(^|(?<=[.!?] ))(?:consenso dos manuais|doutrina|apostila|base do curso)\s*:\s*(\W*\w)",
               lambda m: m.group(1) + m.group(2)[:-1] + m.group(2)[-1].upper(), t)
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
    if h1.lower().startswith("resumão"):  # "Resumão da semana — 23 a 27/11/2026"
        disciplina = h1.split(" — ")[0].strip()
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


# ---------------------------------------------------------------- questões do final do vídeo

RE_QUESTAO = re.compile(r"^###\s+Questão\s+(\d+)\s+—\s+(.*)$")
RE_ALTERNATIVA = re.compile(r"^\s*[-*]\s+\*\*\(([A-E])\)\*\*\s*(.*)$")


def questoes_do_video(caminho, maximo=None):
    """Questões de múltipla escolha do caderno do dia (arquivo _Questoes), com gabarito e justificativa curta.

    Autorais primeiro, depois oficiais. Ficam de fora as que dependem de texto de apoio, tabela, figura ou que são
    longas demais para ler numa tela.
    """
    maximo = maximo or CONFIG.get("questoes_no_final", 5)
    arq = caminho.with_name(f"{caminho.stem}_Questoes.md")
    if not arq.exists():
        arq = caminho
    enunciados, gabaritos, atual, no_gabarito = {}, {}, None, False
    for ln in arq.read_text(encoding="utf-8-sig").splitlines():
        if re.match(r"^##\s+(?!#)", ln):
            no_gabarito, atual = bool(re.search(r"(?i)gabarito", ln)), None
            continue
        m = RE_QUESTAO.match(ln)
        if m:
            num, resto = int(m.group(1)), m.group(2).strip()
            destino = gabaritos if no_gabarito else enunciados
            if num in destino:
                atual = None
            elif no_gabarito:
                g = re.match(r"gabarito\s+([A-E])\b", resto)
                atual = destino[num] = {"letra": g.group(1) if g else None, "linhas": []}
            else:
                atual = destino[num] = {"origem": resto, "linhas": []}
            continue
        if ln.startswith("#"):
            atual = None
            continue
        if atual is not None:
            atual["linhas"].append(ln)

    escolhidas = []
    for num, q in enunciados.items():
        g = gabaritos.get(num)
        if not g or not g["letra"]:
            continue
        alts, enun, ok = [], [], True
        for ln in q["linhas"]:
            s = ln.strip()
            if not s:
                if enun and enun[-1]:
                    enun.append("")  # fim de parágrafo
                continue
            m = RE_ALTERNATIVA.match(s)
            if m:
                alts.append((m.group(1), limpar_md(m.group(2))))
                continue
            if alts or s.startswith(("|", "![", "```", "<")):
                ok = False
            if re.fullmatch(r"\*[^*].*\*", s):  # linha de metadados (nível, prova, página)
                continue
            linha = limpar_md(re.sub(r"^(?:>\s*)+|^[-*]\s+", "", s))
            novo_par = re.match(r"^(?:[IVX]+[.)–-]|\d+[.)]|[a-e]\))\s", linha)  # assertivas I, II… começam linha
            if enun and enun[-1] and not novo_par:
                enun[-1] += " " + linha
            else:
                if enun and not enun[-1]:
                    enun.pop()
                enun.append(linha)
        enunciado = "\n".join(e for e in enun if e)
        letras = "".join(a for a, _ in alts)
        if (not ok or letras not in ("ABCDE", "ABCD") or g["letra"] not in letras or not enunciado
                or len(enunciado) > 650 or sum(len(t) for _, t in alts) > 750
                or re.search(r"(?i)\b(texto|figura|imagem|tabela|gráfico|quadro)\s+(acima|abaixo|a seguir|I\b)", enunciado)):
            continue
        just = ""
        for par in re.split(r"\n\s*\n", "\n".join(g["linhas"]).strip()):
            par = par.strip()
            if par and not par.startswith(("|", "-", "*Fonte")):
                just = limpar_md(re.sub(r"^\*\*[^*]*\*\*\s*", "", par))
                break
        if len(just) > 380:
            just = partir(just, 380)[0]
        just = just[:1].upper() + just[1:]
        autoral = "autoral" in q["origem"].lower()
        escolhidas.append({"autoral": autoral, "num": num, "enunciado": enunciado, "alts": alts, "letra": g["letra"],
                           "just": just, "origem": "Questão autoral no estilo AOCP — não oficial" if autoral
                           else limpar_md(q["origem"])})
    escolhidas.sort(key=lambda q: (not q["autoral"], q["num"]))
    escolhidas = escolhidas[:maximo]
    if len(escolhidas) < 3:  # resumões e dias sem múltipla escolha: perguntas abertas com resposta-modelo
        escolhidas += perguntas_abertas(arq, maximo - len(escolhidas))
    return escolhidas


def perguntas_abertas(arq, quantas):
    """Perguntas do estudo dirigido ou do teste-relâmpago (com resposta-modelo), espalhadas pela lista."""
    sys.path.insert(0, str(RAIZ / "app"))
    from estudo import extrair

    class SemHtml:
        render = staticmethod(lambda t: t)

    est = extrair(arq.read_text(encoding="utf-8-sig"), SemHtml())
    if not est or quantas <= 0:
        return []
    boas = []
    for it in est["itens"]:
        p, r = limpar_md(it["p"].replace("\n", " ")), limpar_md(it["r"].replace("\n", " "))
        if r and len(p) <= 300 and len(r) <= 420 and not re.search(r"(?i)texto|tabela|figura|quadro abaixo", p):
            boas.append({"autoral": True, "num": it["n"], "enunciado": p, "alts": [], "letra": None, "just": r,
                         "origem": "Pergunta de revisão — não oficial"})
    if len(boas) <= quantas:
        return boas
    passo = len(boas) / quantas
    return [boas[int(i * passo)] for i in range(quantas)]


def telas_de_questoes(questoes):
    """Telas do bloco final: as questões (com pausa para pensar), a chamada para os comentários e o gabarito."""
    n, telas = len(questoes), []
    if not n:
        return telas
    for k, q in enumerate(questoes, 1):
        if q["alts"]:
            fim = (" Pause o vídeo, se precisar de mais tempo, e escolha a sua resposta." if k == 1 else
                   " Qual é a sua resposta?")
        else:
            fim = (" Pause o vídeo e responda com as suas palavras, em voz alta ou por escrito." if k == 1 else
                   " Responda com as suas palavras.")
        fala = (f"{'Hora de testar o que você aprendeu. ' if k == 1 else ''}Questão {k}. {para_fala(q['enunciado'])} "
                + " ".join(f"Letra {a}: {para_fala(t).rstrip('.;')}." for a, t in q["alts"]) + fim)
        telas.append({"secao": "Questões para você responder", "sub": f"Questão {k} de {n} · {q['origem']}",
                      "tipo": "questao", "tela": q, "fala": fala, "pausa": 4 if q["alts"] else 6})
    if all(q["alts"] for q in questoes):
        exemplo = ", ".join(f"{k}-?" for k in range(1, min(n, 3) + 1))
        chamada = f"Escreva as suas respostas nos comentários, com o número da questão e a letra: {exemplo}…"
        fala_chamada = "Anote as suas respostas e deixe nos comentários, com o número da questão e a letra. "
    else:
        chamada = "Escreva nos comentários a sua resposta de uma das questões."
        fala_chamada = "Escolha uma das questões e escreva a sua resposta nos comentários. "
    telas.append({"secao": "Questões para você responder", "sub": "Deixe as suas respostas nos comentários",
                  "tipo": "texto", "tela": f"{chamada}\n\nAgora, confira o gabarito comentado.",
                  "fala": fala_chamada + "Agora, confira o gabarito comentado."})
    for k, q in enumerate(questoes, 1):
        if q["alts"]:
            fala = f"Questão {k}: resposta, letra {q['letra']}. {para_fala(q['just'] or dict(q['alts'])[q['letra']])}"
        else:
            fala = f"Questão {k}. Uma boa resposta: {para_fala(q['just'])}"
        telas.append({"secao": "Gabarito comentado", "sub": f"Questão {k} de {n}", "tipo": "gabarito", "tela": q,
                      "fala": fala})
    return telas


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


def silencio(segundos):
    """Quadros MP3 mudos no mesmo formato da voz (MPEG-2 camada III, 24 kHz, 48 kbit/s, mono: 144 bytes = 24 ms)."""
    quadro = b"\xff\xf3\x64\xc4" + bytes(140)
    return quadro * int(segundos / 0.024)


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
    aviso = "Material de estudo independente · não oficial · sem vínculo com o órgão ou a banca"
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
    elif tela["tipo"] == "questao":
        q = tela["tela"]
        for tam in (42, 38, 35, 32, 29, 26):
            f, fb = fonte(tam), fonte(tam, True)
            alto = int(tam * 1.32)
            enun = quebrar(d, q["enunciado"], f, LARG - 160)
            alts = [quebrar(d, t, f, LARG - 160 - 90) for _, t in q["alts"]]
            total = len(enun) * alto + 24 + sum(len(a) * alto + 10 for a in alts)
            if total <= area:
                break
        y = topo
        for l in enun:
            d.text((80, y), l, font=f, fill=COR["texto"])
            y += alto
        y += 24
        for (letra, _), ls in zip(q["alts"], alts):
            d.text((80, y), f"({letra})", font=fb, fill=COR["destaque"])
            for l in ls:
                d.text((170, y), l, font=f, fill=COR["texto"])
                y += alto
            y += 10
    elif tela["tipo"] == "gabarito":
        q = tela["tela"]
        aberta = not q["alts"]
        d.text((80, topo), "Uma boa resposta" if aberta else f"Resposta: letra {q['letra']}", font=fonte(64, True),
               fill=COR["destaque"])
        y = topo + 110
        for tam in (40, 36, 32, 28):
            f = fonte(tam)
            alto = int(tam * 1.35)
            certa = quebrar(d, q["enunciado"] if aberta else f"({q['letra']}) {dict(q['alts'])[q['letra']]}",
                            fonte(tam, True), LARG - 160)
            just = quebrar(d, q["just"], f, LARG - 160) if q["just"] else []
            if (len(certa) + len(just)) * alto + 30 <= ALT - 90 - y:
                break
        for l in certa:
            d.text((80, y), l, font=fonte(tam, True), fill=COR["suave" if aberta else "texto"])
            y += alto
        y += 30
        for l in just:
            d.text((80, y), l, font=f, fill=COR["texto" if aberta else "suave"])
            y += alto
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


def desenhar_capa(info, titulo, destino, tamanho=(LARG, ALT), subtitulo="", chamada="", pix=False):
    from PIL import Image, ImageDraw
    w, h = tamanho
    img = Image.new("RGB", (w, h), COR["fundo"])
    d = ImageDraw.Draw(img)
    esc = w / 1920
    d.rectangle([0, 0, w, int(140 * esc)], fill=COR["faixa"])
    if CONFIG.get("nome_canal"):
        nome, fn = CONFIG["nome_canal"], fonte(int(40 * esc))
        d.text((w - int(70 * esc) - d.textlength(nome, font=fn), int(48 * esc)), nome, font=fn, fill=COR["texto"])
    d.text((int(70 * esc), int(40 * esc)), f"{info['data']:%d/%m/%Y} · {CONFIG['concurso']}", font=fonte(int(52 * esc), True),
           fill=COR["texto"])
    f = fonte(int(120 * esc), True)
    y = int(260 * esc)
    largura = w - int(160 * esc) - (int(460 * esc) if pix else 0)  # com Pix, o texto não invade o QR Code
    for l in quebrar(d, titulo, f, largura)[:3]:
        d.text((int(70 * esc), y), l, font=f, fill=COR["destaque"])
        y += int(140 * esc)
    if subtitulo:
        for l in quebrar(d, subtitulo, fonte(int(54 * esc)), largura)[:3]:
            d.text((int(70 * esc), y + int(20 * esc)), l, font=fonte(int(54 * esc)), fill=COR["texto"])
            y += int(70 * esc)
    if chamada:
        d.text((int(70 * esc), h - int(180 * esc)), chamada, font=fonte(int(56 * esc), True), fill=COR["destaque"])
    if pix:  # tela final: QR Code do Pix à direita
        import pix as P
        lado = int(380 * esc)
        x0, y0 = w - int(70 * esc) - lado, int(300 * esc)
        img.paste(P.qr(lado), (x0, y0))
        d.text((x0, y0 - int(70 * esc)), "Apoie o canal: Pix", font=fonte(int(48 * esc), True), fill=COR["destaque"])
        fc, linhas, atual = fonte(int(30 * esc)), [], ""
        for ch in P.chave():  # quebra por letra: chave aleatória não tem espaços
            if d.textlength(atual + ch, font=fc) > lado:
                linhas.append(atual)
                atual = ""
            atual += ch
        linhas.append(atual)
        for k, l in enumerate(linhas[:3]):
            d.text((x0, y0 + lado + int(20 * esc) + k * int(40 * esc)), l, font=fonte(int(30 * esc)), fill=COR["texto"])
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
    questoes = questoes_do_video(caminho)
    chamada = f"No final: {len(questoes)} questões para você responder" if questoes else ""
    data_extenso = f"{DIAS[dia.weekday()]}, {dia.day} de {MESES[dia.month - 1]} de {dia.year}"
    titulo_aula = info["disciplina"]
    assuntos = " · ".join(s for s in info["secoes"] if not re.search(r"quadro|pegadinha", s, re.I))
    assuntos_lista = assuntos.replace(" · ", "; ")  # (fora do f-string: compatível com Python antes do 3.12)
    abertura = {"secao": "Abertura", "sub": "", "tipo": "capa",
                "fala": f"Aula de {titulo_aula}, para {CONFIG['concurso']}, "
                        f"de {data_extenso}. Nesta aula: {assuntos_lista}. "
                        + (f"Fique até o final: depois da explicação, há {len(questoes)} questões para você responder, "
                           f"com o gabarito comentado. " if questoes else "")
                        + "Este é um material de estudo independente, não oficial. Bons estudos!"}
    fim = {"secao": "Encerramento", "sub": "", "tipo": "capa",
           "fala": ("Fim da aula. Conte nos comentários quantas questões você acertou. " if questoes else "Fim da aula. ")
                   + "Revise os quadros e as pegadinhas. "
                   + ("Se esta aula ajudou, inscreva-se no canal e ative o sininho para receber a aula de cada dia. "
                      if CONFIG.get("nome_canal") else "")
                   + ("E, se quiser apoiar o canal, o Pix está na tela e na descrição: qualquer valor ajuda. "
                      if CONFIG.get("pix_chave") else "")
                   + "Até a próxima aula!"}
    telas = [abertura] + info["telas"][:limite_telas] + telas_de_questoes(questoes) + [fim]

    lista, audio, capitulos, t = [], bytearray(), [], 0.0
    ultima_secao = None
    for i, tela in enumerate(telas):
        mp3 = sintetizar(tela["fala"]) + silencio(tela.get("pausa", 0))
        dur = len(mp3) / BYTES_POR_SEGUNDO + 0.0
        img = pasta / "telas" / f"{i:04d}.png"
        if tela["tipo"] == "capa":
            desenhar_capa(info, titulo_aula, img, subtitulo=assuntos if i == 0 else "Fim da aula",
                          chamada=chamada if i == 0 else ("Conte nos comentários quantas você acertou!" if questoes else ""),
                          pix=(i > 0 and bool(CONFIG.get("pix_chave"))))
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
    ultima = pasta / "telas" / "{:04d}.png".format(len(telas) - 1)
    lista.append(f"file '{ultima.as_posix()}'")
    (pasta / "lista.txt").write_text("\n".join(lista), encoding="utf-8")
    (pasta / "audio.mp3").write_bytes(bytes(audio))
    subprocess.run([ffmpeg(), "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(pasta / "lista.txt"),
                    "-i", str(pasta / "audio.mp3"), "-c:v", "libx264", "-tune", "stillimage", "-preset", "veryfast",
                    "-r", "12", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest",
                    "-movflags", "+faststart", str(pasta / "video.mp4")], check=True)
    desenhar_capa(info, titulo_aula, pasta / "miniatura.png", (1280, 720), subtitulo=assuntos, chamada=chamada)

    # título, descrição (com capítulos: o primeiro precisa ser 00:00) e tags
    titulo = f"{titulo_aula}: {assuntos}"
    if len(titulo) > 70:
        titulo = titulo[:67].rsplit(" ", 1)[0] + "…"
    titulo = f"{titulo} | {CONFIG['concurso']} · {dia:%d/%m}"[:100]
    caps = "\n".join(f"{tempo(s)} {nome}" for s, nome in capitulos)
    descricao = (
        f"Aula narrada de {titulo_aula} para {CONFIG['concurso']} ({CONFIG.get('banca') or 'banca do edital'}), "
        f"conforme o conteúdo do edital. Assuntos: {assuntos_lista}.\n\n"
        + (f"No final, {len(questoes)} questões para você responder, com gabarito comentado. Deixe as suas respostas "
           "nos comentários!\n\n" if questoes else "")
        + f"Capítulos:\n{caps}\n\n"
        "Material de estudo independente e não oficial, sem vínculo com o órgão do concurso, com o "
        "Governo do Estado ou com a banca. Confira sempre o edital e a legislação oficial.\n"
        f"{CONFIG.get('creditos', '')}\n"
        f"Narração com voz sintética.\n\n"
        + (f"Inscreva-se para receber a aula de cada dia: {CONFIG['url_canal']}\n" if CONFIG.get("url_canal") else "")
        + linha_pix() + "\n"
        + f"Código da aula: {info['id']}"
    )
    meta = {"id": info["id"], "titulo": titulo, "descricao": descricao[:4900],
            "tags": [CONFIG["concurso"], CONFIG.get("banca", ""), titulo_aula, "concurso público"],
            "duracao": round(t), "data": dia.isoformat(), "disciplina": titulo_aula,
            "questoes": len(questoes), "questoes_abertas": bool(questoes) and not questoes[0]["alts"],
            "amostra": bool(limite_telas), "versao": VERSAO_SAIDA}
    (pasta / "video.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    shutil.rmtree(pasta / "telas")
    (pasta / "lista.txt").unlink()
    (pasta / "audio.mp3").unlink()
    print(f"  pronto: {pasta / 'video.mp4'} ({tempo(t)})")
    return pasta


def linha_pix():
    import pix as P
    return P.linha_descricao()


def materiais_do_dia(dia):
    return [p for p in sorted((RAIZ / "Material_do_Dia").glob(f"{dia.isoformat()}_*.md"))
            if not p.stem.endswith("_Questoes")]


def data_iso(texto):
    """Data AAAA-MM-DD (aceita sobras depois da data, como "2026-11-28-1225" ou "2026-11-28 ")."""
    import argparse as _ap
    try:
        return dt.date.fromisoformat(texto.strip()[:10])
    except ValueError:
        raise _ap.ArgumentTypeError(f"data inválida: {texto!r}. Use o formato AAAA-MM-DD, por exemplo 2026-11-28")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=data_iso, default=None)
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
