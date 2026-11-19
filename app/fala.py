"""Converte Markdown em texto próprio para ser lido em voz alta.

O texto dos materiais tem tabelas, emojis, siglas jurídicas (art., §, inc.),
números romanos de incisos e datas. Aqui tudo isso vira frases que a voz
sintetizada lê de forma natural. A mesma saída alimenta o MP3 (voz neural,
gerada no computador) e a leitura com a voz do celular.
"""
import re
import unicodedata

MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
         "agosto", "setembro", "outubro", "novembro", "dezembro"]

SIMBOLOS = {
    "×": " versus ", "⇒": ", então ", "↔": " se e somente se ", "⇔": " se e somente se ",
    "≠": " diferente de ", "≥": " maior ou igual a ", "≤": " menor ou igual a ",
    "∧": " e ", "∨": " ou ", "¬": " não ", "∴": " portanto ", "≈": " aproximadamente ",
    "·": ", ", "•": ", ", "|": ", ", "→": ", ", "←": ", ", "➜": ", ", "➔": ", ",
}

# Siglas formadas só por letras romanas que não devem virar número.
NAO_ROMANOS = {"DC", "CD", "CC", "MD", "MC", "CM", "DM", "DI", "MI", "MM", "CV", "DIV", "MIX", "MIL", "LCD"}

_ROMANOS = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"),
            (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]


def _romano_para_int(s):
    valores = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    total = 0
    for i, ch in enumerate(s):
        v = valores[ch]
        if i + 1 < len(s) and valores[s[i + 1]] > v:
            total -= v
        else:
            total += v
    return total


def _int_para_romano(n):
    out = []
    for v, r in _ROMANOS:
        while n >= v:
            out.append(r)
            n -= v
    return "".join(out)


def _troca_romano(m):
    s = m.group(1)
    if s in NAO_ROMANOS:
        return s
    if len(s) == 1 and s not in "IVX":
        return s  # letras de alternativas (C), (D) etc.
    n = _romano_para_int(s)
    if n <= 0 or _int_para_romano(n) != s:
        return s
    return str(n)


def _data_completa(m):
    d, mes, a = int(m.group(1)), int(m.group(2)), m.group(3)
    if not (1 <= d <= 31 and 1 <= mes <= 12):
        return m.group(0)
    return f"{'primeiro' if d == 1 else d} de {MESES[mes - 1]} de {a}"


def _data_curta(m):
    d, mes = int(m.group(1)), int(m.group(2))
    if not (1 <= d <= 31 and 1 <= mes <= 12):
        return m.group(0)
    return f"{'primeiro' if d == 1 else d} de {MESES[mes - 1]}"


def _horas(m):
    n = m.group(1)
    return f"{n} {'hora' if n == '1' else 'horas'}"


NIVEIS = {"🟢": "iniciante", "🟡": "intermediário", "🔴": "avançado"}


def _questoes(m):
    nums = re.findall(r"\d+", m.group(0))
    return "questões " + ", ".join(nums[:-1]) + " e " + nums[-1]


def normalizar(texto):
    t = texto
    t = re.sub(r"https?://\S+|www\.\S+", "", t)
    # Emojis de nível: somem antes da palavra correspondente; sozinhos, viram a palavra.
    for emo, palavra in NIVEIS.items():
        t = re.sub(emo + r"️?\s*(?=" + palavra + ")", "", t, flags=re.I)
        t = t.replace(emo, f" {palavra} ")
    t = re.sub(r"\bQ\d+(?:\s*,\s*Q\d+)*\s+e\s+Q\d+\b", _questoes, t)
    for k, v in SIMBOLOS.items():
        t = t.replace(k, v)
    # Emojis e outros símbolos gráficos somem.
    t = "".join(" " if unicodedata.category(c) in ("So", "Cs", "Co") else c for c in t)
    t = t.replace("️", "").replace("‍", "")
    t = re.sub(r"[*_`~#>]+", " ", t)

    t = re.sub(r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b", _data_completa, t)
    t = re.sub(r"(?<![\d/.])(\d{2})/(\d{2})(?![\d/])", _data_curta, t)
    t = re.sub(r"\b(\d{1,3}(?:\.\d{3})+|\d{4,})/(\d{4}|\d{2})\b", r"\1, de \2", t)
    t = re.sub(r"\bCF/88\b", "CF de 88", t)
    t = re.sub(r"\b(\d+)\s?h\s?(\d{2})\b", lambda m: f"{_horas(m)} e {m.group(2)}", t)
    t = re.sub(r"\b(\d+)\s?h\b", _horas, t)
    t = re.sub(r"\b(\d+)\s?min\b", r"\1 minutos", t)

    t = t.replace("§§", " parágrafos ").replace("§", " parágrafo ")
    t = re.sub(r"\bArts\.\s*", "Artigos ", t)
    t = re.sub(r"\barts\.\s*", "artigos ", t)
    t = re.sub(r"\bArt\.\s*", "Artigo ", t)
    t = re.sub(r"\bart\.\s*", "artigo ", t)
    t = re.sub(r"\bincs?\.\s*", lambda m: "incisos " if m.group(0).startswith("incs") else "inciso ", t)
    t = re.sub(r"\bals?\.\s*(?=[a-z]\b)", "alínea ", t)
    t = re.sub(r"\b[Pp]\.\s?ex\.", "por exemplo", t)
    t = re.sub(r"\bex\.:", "por exemplo:", t)
    t = re.sub(r"\bEx\.\s*", "Exemplo ", t)
    t = re.sub(r"\bc/c\b", "combinado com", t)
    t = re.sub(r"\be/ou\b", "e ou", t)
    t = re.sub(r"\b[nN][ºo°]\s*(?=\d)", "número ", t)
    t = re.sub(r"\bQ(\d+)\b", r"questão \1", t)

    # "artigo 5º, LXVIII" -> "artigo 5º, inciso LXVIII" -> "... inciso 68"
    t = re.sub(r"(\b[Aa]rtigos? \d+[º°]?(?:-[A-Z])?,\s*)(?=[IVXLC]+\b)", r"\1inciso ", t)
    t = re.sub(r"(?<![\w-])([IVXLCDM]{1,7})(?![\w-])", _troca_romano, t)

    t = re.sub(r"\s+=\s+", ": ", t)
    t = re.sub(r"\s+([,.;:!?])", r"\1", t)
    t = re.sub(r"([,;:])\s*([,;:.])", r"\2", t)
    t = re.sub(r"\(\s*\)", "", t)
    t = re.sub(r"\s{2,}", " ", t).strip(" ,;")
    return t


def _fecha(frase):
    frase = frase.strip()
    if frase and frase[-1] not in ".!?:;…":
        frase += "."
    return frase


def _texto_inline(tok):
    partes = []
    for c in tok.children or []:
        if c.type in ("text", "code_inline"):
            partes.append(c.content)
        elif c.type in ("softbreak", "hardbreak"):
            partes.append(" ")
    return "".join(partes)


def nivel_capitulo(tokens):
    """Nível de título que separa capítulos: h2 se houver; senão h3; senão nenhum."""
    niveis = {t.tag for t in tokens if t.type == "heading_open"}
    for tag in ("h2", "h3"):
        if tag in niveis:
            return tag
    return None


def capitulos(tokens, titulo_doc):
    """Divide o documento em capítulos de fala e marca o HTML para a leitura acompanhada.

    Retorna [{"titulo": str, "paragrafos": [str], "f": [int]}]. Altera os tokens:
    - títulos de capítulo recebem id="cap-N";
    - cada bloco lido (parágrafo, título, linha de tabela) recebe data-f="K", e
      "f" guarda, para cada parágrafo falado, o K do bloco correspondente (-1 = sem bloco).
    """
    tag_cap = nivel_capitulo(tokens)
    caps = [{"titulo": titulo_doc, "paragrafos": [], "f": []}]
    contador = [0]
    buf = []
    em_titulo = None
    bloco = None  # token de abertura do bloco que está sendo lido
    tabela = None  # {"cab": [...], "linha": [...], "em_cab": bool}
    numero_item = []

    # Em listas "compactas" o markdown-it esconde o <p>; mostrando-o, cada item vira um bloco marcável.
    for tok in tokens:
        if tok.type in ("paragraph_open", "paragraph_close") and tok.hidden:
            tok.hidden = False
            if tok.type == "paragraph_open":
                tok.attrSet("class", "lp")

    def adiciona(texto, tok_bloco):
        if len(texto) <= 1:
            return
        caps[-1]["paragrafos"].append(texto)
        if tok_bloco is not None:
            tok_bloco.attrSet("data-f", str(contador[0]))
            caps[-1]["f"].append(contador[0])
            contador[0] += 1
        else:
            caps[-1]["f"].append(-1)

    def emite(texto, tok_bloco):
        adiciona(_fecha(normalizar(texto)), tok_bloco)

    for tok in tokens:
        tipo = tok.type
        if tipo == "heading_open":
            em_titulo = tok.tag
            bloco = tok
            if tok.tag == tag_cap:
                if caps[-1]["paragrafos"]:
                    caps.append({"titulo": "", "paragrafos": [], "f": []})
                tok.attrSet("id", f"cap-{len(caps) - 1}")
        elif tipo == "heading_close":
            em_titulo = None
        elif tipo == "paragraph_open":
            bloco = tok
        elif tipo == "inline":
            texto = _texto_inline(tok)
            if tabela is not None:
                tabela["linha"].append(normalizar(texto))
            elif em_titulo:
                if em_titulo == tag_cap or (em_titulo == "h1" and len(caps) == 1 and not caps[0]["paragrafos"]):
                    caps[-1]["titulo"] = normalizar(texto) or caps[-1]["titulo"]
                emite(texto, bloco)
            else:
                buf.append(texto)
        elif tipo == "paragraph_close" and tabela is None:
            if buf:
                prefixo = f"{numero_item[-1]}. " if numero_item and numero_item[-1] else ""
                emite(prefixo + " ".join(buf), bloco)
                if numero_item:
                    numero_item[-1] = ""  # só o 1º parágrafo do item leva o número
            buf = []
        elif tipo == "list_item_open":
            numero_item.append(tok.info if tok.markup in (".", ")") else "")
        elif tipo == "list_item_close":
            numero_item.pop()
        elif tipo == "table_open":
            tabela = {"cab": [], "linha": [], "em_cab": False}
        elif tipo == "thead_open":
            tabela["em_cab"] = True
        elif tipo == "thead_close":
            tabela["em_cab"] = False
        elif tipo == "tr_open" and tabela is not None:
            tabela["linha"] = []
            bloco = tok
        elif tipo == "tr_close" and tabela is not None:
            if tabela["em_cab"]:
                tabela["cab"] = tabela["linha"]
            else:
                partes = []
                for i, cel in enumerate(tabela["linha"]):
                    cel = cel.strip()
                    if not cel or cel in ("-", "—"):
                        continue
                    cab = tabela["cab"][i].strip() if i < len(tabela["cab"]) else ""
                    partes.append(f"{cab}: {cel}" if cab and i > 0 else cel)
                if partes:
                    adiciona(_fecha("; ".join(_fecha(p)[:-1] for p in partes)), bloco)
        elif tipo == "table_close":
            tabela = None

    for i, c in enumerate(caps):
        if not c["titulo"]:
            c["titulo"] = f"Parte {i + 1}"
    # Não remover capítulos: o índice de cada um precisa bater com id="cap-N" no HTML.
    for c in caps:
        if not c["paragrafos"]:
            c["paragrafos"].append(_fecha(c["titulo"]))
            c["f"].append(-1)
    return caps
