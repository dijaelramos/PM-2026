"""Itens do Anexo II (Conteudos.txt) e ligação de cada sessão do plano aos itens que ela estuda.

Serve ao edital verticalizado do app e para dar um tópico do edital às questões dos materiais.
"""
import re

SIGLAS = {
    "LÍNGUA PORTUGUESA": "LP",
    "HISTÓRIA DE PERNAMBUCO": "HPE",
    "RACIOCÍNIO LÓGICO": "RL",
    "INFORMÁTICA": "INF",
    "DIREITO CONSTITUCIONAL": "DC",
    "DIREITOS HUMANOS E LEGISLAÇÃO EXTRAVAGANTE": "DH",
}
# nome da disciplina no plano (coluna "Disciplina/atividade") -> sigla
SIGLA_DO_PLANO = [
    ("Língua Portuguesa", "LP"), ("História de Pernambuco", "HPE"), ("Raciocínio Lógico", "RL"),
    ("Informática", "INF"), ("Direito Constitucional", "DC"), ("Direitos Humanos", "DH"),
]
RE_TOP = re.compile(r"\b(LP|HPE|HP|RL|INF|DC|DH)\s?(\d{1,2})\b((?:\s*(?:,|e)\s*\d{1,2}\b)*)")


def _curto(texto):
    lei = re.match(r"^Lei\b[^(–-]*?n[º°.]\s*([\d.]+/\d{4})\s*(?:\((.+?)\)|[–-]\s*([^:]+))", texto)
    if lei:  # "Lei n. 9.605/1998 (Lei dos Crimes Ambientais)" -> "Lei dos Crimes Ambientais (9.605/1998)"
        nome = (lei.group(2) or lei.group(3)).strip(" .")
        return f"{nome} ({lei.group(1)})"
    t = re.split(r"\s*[:;(]\s*|\s+[–-]\s+", texto, maxsplit=1)[0].rstrip(" .")
    return t if len(t) <= 70 else t[:68].rsplit(" ", 1)[0] + "…"


def itens(texto):
    """[{c: 'LP 1', d: 'LP', n: 1, nome, curto, grupo}] na ordem do Anexo II (por número dentro da disciplina)."""
    out, disc, grupo, atual = [], None, "", None
    linhas = texto.splitlines()
    for i, ln in enumerate(linhas):
        s = ln.strip()
        if s.startswith("NOTAS"):
            break
        m = re.match(r"^\d+\.\s+(.+)$", s)
        if m and m.group(1).strip() in SIGLAS:
            disc, grupo, atual = SIGLAS[m.group(1).strip()], "", None
            continue
        if not disc:
            continue
        nxt = linhas[i + 1].strip() if i + 1 < len(linhas) else ""
        if s and nxt.startswith("─") and not s.startswith("•"):
            grupo, atual = s, None
            continue
        m = re.match(r"^•\s*(\d+)\.\s*(.*)$", s)
        if m:
            atual = {"c": f"{disc} {int(m.group(1))}", "d": disc, "n": int(m.group(1)), "nome": m.group(2), "grupo": grupo}
            out.append(atual)
            continue
        if atual and s and not s.startswith(("─", "━")):
            atual["nome"] += " " + s
        elif not s:
            atual = None
    for it in out:
        nome = re.sub(r"\s*★★.*$", "", it["nome"])
        nome = re.sub(r"\s*\(Acrescido pelo[^)]*\)\.?", "", nome)
        it["nome"] = re.sub(r"\s+", " ", nome).strip()
        it["curto"] = _curto(it["nome"])
    return sorted(out, key=lambda x: (list(SIGLAS.values()).index(x["d"]), x["n"]))


def _numeros(trecho):
    """'1-4 e 17-18' -> [1, 2, 3, 4, 17, 18]; '11, 14-15' -> [11, 14, 15]."""
    nums = []
    for a, b in re.findall(r"(\d+)\s*(?:[-–]\s*(\d+))?", trecho):
        nums += list(range(int(a), int(b or a) + 1))
    return nums


def itens_da_sessao(sessao):
    """Códigos dos itens que uma sessão do plano estuda ('itens 1-4 e 17-18', 'item 3'...)."""
    sigla = next((s for nome, s in SIGLA_DO_PLANO if sessao["disciplina"].startswith(nome)), None)
    if not sigla:
        return []
    m = re.search(r"\bite(?:m|ns)\s+(\d[\d\s,e\-–]*)", sessao["topicos"].split(":")[0])
    return [f"{sigla} {n}" for n in _numeros(m.group(1))] if m else []


def topicos_no_texto(texto):
    """Códigos de tópico escritos no texto: 'Tópico do edital: DC 2', '· HPE 5', 'DH 9 e 17'."""
    out = []
    for s, n, resto in RE_TOP.findall(texto or ""):
        s = "HPE" if s == "HP" else s
        for x in [n] + re.findall(r"\d+", resto):
            c = f"{s} {int(x)}"
            if c not in out:
                out.append(c)
    return out
