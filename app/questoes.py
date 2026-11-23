"""Extrai as questões, com gabarito e comentário, do Material do Dia e das questões autorais.

Formatos reconhecidos (todos já usados no repositório):
- questões em "### Questão N — fonte" (materiais) ou "### DC-01 — tema" (autorais);
- alternativas "- **(A)** texto" ou o par "( ) Certo ( ) Errado";
- gabarito em tabela (normal ou "transposta", com as questões nas colunas),
  em "### Questão N — gabarito X" ou em parágrafos "**DC-01 — E.** comentário" / "1. **A.** comentário";
- "Texto de apoio das questões 4 e 5" / "(questões LP-01 a LP-13)" vira texto de apoio dessas questões.

Questões marcadas como "reservada para o Simulado 1" ficam de fora enquanto o
Simulado 1 estiver pendente no Perfil do Estudante (regra comum do projeto).
"""
import re

RE_H2 = re.compile(r"^##\s+(.*)$")
RE_H3 = re.compile(r"^###\s+(.*)$")
RE_ALT = re.compile(r"^\s*[-*]\s+(?:\*\*)?\(([A-E])\)(?:\*\*)?\s*(.*)$")
RE_CE = re.compile(r"\(\s*\)\s*Certo\s*\(\s*\)\s*Errado", re.I)
RE_QMAT = re.compile(r"^Questão\s+(\d+)\b\s*(?:—\s*(.*))?$")
RE_QAUT = re.compile(r"^([A-Z]{2,3}-\d{2,3})\b\s*(?:—\s*(.*))?$")
RE_GAB_H3 = re.compile(r"^Questão\s+(\d+)\s*—\s*gabarito\s+(\S+)", re.I)
RE_COM_AUT = re.compile(r"^\*\*([A-Z]{2,3}-\d{2,3})\s*—\s*([^*]+?)\.?\*\*\s*(.*)$")
RE_COM_NUM = re.compile(r"^(\d+)\.\s+\*\*([^*]+?)\.?\*\*\s*(.*)$")
RE_CHAVE = re.compile(r"^(\d+|[A-Z]{2,3}-\d{2,3})$")

DISCIPLINAS_AUTORAIS = {
    "Direito_Constitucional": "Direito Constitucional",
    "Direitos_Humanos_e_Legislacao": "Direitos Humanos e Legislação Extravagante",
    "Estatuto_da_Juventude": "Direitos Humanos e Legislação Extravagante",
    "Historia_de_Pernambuco": "História de Pernambuco",
    "Informatica": "Informática",
    "Lingua_Portuguesa": "Língua Portuguesa",
    "Raciocinio_Logico": "Raciocínio Lógico",
}


def simulado1_pendente(texto_perfil, hoje=None):
    """Pendente até o perfil dizer "realizado" ou até a data de "Passa a valer como realizado ... a partir de DD/MM/AAAA"."""
    m = re.search(r"Simulado 1[^\n]*?:\*\*\s*([^\s—.,]+)([^\n]*)", texto_perfil)
    if m and m.group(1).lower().startswith("realizado"):
        return False
    d = re.search(r"realizado[^\n]*?a partir de (\d{2})/(\d{2})/(\d{4})", m.group(2)) if m else None
    if d and hoje is not None:
        return hoje.isoformat() < f"{d.group(3)}-{d.group(2)}-{d.group(1)}"
    return True


def sem_links_locais(md):
    """Links para arquivos do repositório viram texto (no app eles não abrem)."""
    return re.sub(r"\[([^\]]*)\]\((?!https?:)[^)]*\)", r"\1", md)


def _texto_simples(md):
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", md)
    return re.sub(r"[*_`]", "", t).strip()


def _secoes(linhas):
    idx = [i for i, ln in enumerate(linhas) if RE_H2.match(ln)]
    out = []
    for n, i in enumerate(idx):
        fim = idx[n + 1] if n + 1 < len(idx) else len(linhas)
        out.append({"titulo": RE_H2.match(linhas[i]).group(1).strip(), "ini": i + 1, "fim": fim})
    return out


def _blocos_h3(linhas, ini, fim):
    out, atual = [], None
    for i in range(ini, fim):
        m = RE_H3.match(linhas[i])
        if m:
            atual = (m.group(1).strip(), [])
            out.append(atual)
        elif atual:
            atual[1].append(linhas[i])
    return out


def _norm_resp(v):
    v = _texto_simples(v).upper()
    if v.startswith("ANULAD"):
        return "ANULADA"
    m = re.match(r"^(CERTO|ERRADO|[A-E])\b", v)
    return m.group(1) if m else None


def _celulas(ln):
    return [c.strip() for c in ln.strip().strip("|").split("|")]


def _tabela(linhas, resp):
    rows = [_celulas(ln) for ln in linhas if not re.match(r"^\s*\|[\s:|-]+\|\s*$", ln)]
    if len(rows) < 2:
        return
    cab = [_texto_simples(c) for c in rows[0]]
    if not cab or not cab[0].lower().startswith("questão"):
        return
    if len(cab) > 2 and all(RE_CHAVE.match(c) for c in cab[1:]):  # questões nas colunas
        for row in rows[1:]:
            r = [_texto_simples(c) for c in row]
            if r and re.search(r"gabarito|resposta", r[0], re.I):
                for k, v in zip(cab[1:], r[1:]):
                    resp.setdefault(k, _norm_resp(v))
        return
    col = next((i for i, c in enumerate(cab) if re.search(r"gabarito|resposta", c, re.I)), None)
    if col is None:
        return
    for row in rows[1:]:
        r = [_texto_simples(c) for c in row]
        m = re.match(r"^(\d+|[A-Z]{2,3}-\d{2,3})\b", r[0]) if r else None
        if m and len(r) > col:
            resp.setdefault(m.group(1), _norm_resp(r[col]))


def _gabarito(linhas, ini, fim):
    resp, coment = {}, {}
    i = ini
    while i < fim:  # tabelas
        if linhas[i].lstrip().startswith("|"):
            j = i
            while j < fim and linhas[j].lstrip().startswith("|"):
                j += 1
            _tabela(linhas[i:j], resp)
            i = j
        else:
            i += 1
    for tit, corpo in _blocos_h3(linhas, ini, fim):  # "### Questão N — gabarito X"
        m = RE_GAB_H3.match(tit)
        if m:
            resp.setdefault(m.group(1), _norm_resp(m.group(2)))
            coment[m.group(1)] = "\n".join(corpo).strip()
    atual, dentro_h3_gab = None, False
    for ln in linhas[ini:fim]:  # "**DC-01 — E.** ..." ou "1. **A.** ..."
        m3 = RE_H3.match(ln)
        if m3:
            atual, dentro_h3_gab = None, bool(RE_GAB_H3.match(m3.group(1).strip()))
            continue
        if dentro_h3_gab:
            continue
        m = RE_COM_AUT.match(ln) or RE_COM_NUM.match(ln)
        # o negrito tem de ser só a resposta ("A", "Certo"…), senão é outra lista numerada
        if m and re.fullmatch(r"(?i)(?:[A-E]|certo|errado|anulada)(?:\s*\([^)]*\))?", _texto_simples(m.group(2)).rstrip(".")):
            k, r, resto = m.groups()
            resp.setdefault(k, _norm_resp(r))
            if k in coment:  # já veio de "### Questão N — gabarito X"
                atual = None
                continue
            atual = k
            coment[k] = resto
            continue
        if RE_COM_NUM.match(ln):  # outra lista numerada em negrito: o comentário acabou
            atual = None
        if atual is not None:
            if ln.lstrip().startswith("|"):
                atual = None
            else:
                coment[atual] += "\n" + ln
    return resp, {k: v.strip() for k, v in coment.items()}


def _ids_apoio(titulo):
    m = re.search(r"quest(?:ão|ões)\s+([^()]*)", titulo, re.I)
    if not m:
        return set()
    s, ids = m.group(1), set()
    for a, b in re.findall(r"([A-Z]{2,3}-\d+|\d+)\s+a\s+([A-Z]{2,3}-\d+|\d+)", s):
        pa, na = (a.rsplit("-", 1) + [None])[:2] if "-" in a else (None, a)
        nb = b.rsplit("-", 1)[-1]
        largura = len(na)
        for n in range(int(na), int(nb) + 1):
            ids.add(f"{pa}-{n:0{largura}d}" if pa else str(n))
    ids.update(re.findall(r"[A-Z]{2,3}-\d+|\b\d+\b", s))
    return ids


def extrair(texto, *, doc_id, disciplina, origem, autoral, md, pendente_simulado, avisos):
    linhas = texto.splitlines()
    secoes = _secoes(linhas)
    gab = next((s for s in secoes if re.search(r"gabarito", s["titulo"], re.I)), None)
    if not gab:
        return []
    resp, coment = _gabarito(linhas, gab["ini"], gab["fim"])

    regioes = [s for s in secoes if re.search(r"quest", s["titulo"], re.I)
               and not re.search(r"gabarito|mapa|apoio|respostas", s["titulo"], re.I)]
    if not regioes:  # questões antes do gabarito, sem seção própria
        regioes = [{"titulo": "", "ini": 0, "fim": gab["ini"] - 1}]

    apoio = {}
    for s in secoes:
        if re.search(r"texto de apoio", s["titulo"], re.I):
            html = md.render(sem_links_locais("\n".join(linhas[s["ini"]:s["fim"]])))
            for k in _ids_apoio(s["titulo"]):
                apoio[k] = html

    questoes = []
    for reg in regioes:
        for tit, corpo in _blocos_h3(linhas, reg["ini"], reg["fim"]):
            m = (RE_QAUT if autoral else RE_QMAT).match(tit)
            if not m or RE_GAB_H3.match(tit):
                continue
            chave, resto = m.group(1), (m.group(2) or "").strip()
            meta, alts, enun, ce = None, [], [], False
            for ln in corpo:
                s = ln.strip()
                ma = RE_ALT.match(ln)
                if ma:
                    alts.append([ma.group(1), md.renderInline(sem_links_locais(ma.group(2).strip()))])
                elif RE_CE.search(s):
                    ce = True
                elif meta is None and not any(x.strip() for x in enun) and len(s) > 2 and s.startswith("*") and s.endswith("*"):
                    meta = _texto_simples(s)
                else:
                    enun.append(ln)
            if ce and not alts:
                alts = [["CERTO", "Certo"], ["ERRADO", "Errado"]]
            if "reservada para o simulado 1" in f"{tit} {meta or ''}".lower() and pendente_simulado:
                continue
            r = resp.get(chave)
            if r == "ANULADA":
                continue
            if len(alts) < 2 or r not in {a[0] for a in alts}:
                avisos.append(f"{origem}, {chave}: sem alternativas ou gabarito reconhecível (gabarito: {r})")
                continue
            # Questão de material é oficial (vem do Banco de Provas), salvo se ela mesma se diz autoral.
            oficial = not autoral and not re.search(r"autoral|não oficial", f"{tit} {meta or ''}", re.I)
            questoes.append({
                "id": f"{doc_id}:{chave}",
                "doc": doc_id,
                "numero": chave,
                "origem": origem,
                "tipo": "oficial" if oficial else "autoral",
                "disciplina": disciplina,
                "tema": resto if autoral else "",
                "fonte": "" if autoral else _texto_simples(resto),
                "meta": meta or "",
                "enunciado": md.render(sem_links_locais("\n".join(enun).strip())),
                "alternativas": alts,
                "resposta": r,
                "comentario": md.render(sem_links_locais(coment.get(chave, ""))) if coment.get(chave) else "",
                "apoio": apoio.get(chave, ""),
            })
    return questoes
