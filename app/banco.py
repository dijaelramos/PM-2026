"""Banco de questões oficiais do app: lê as provas de Banco_de_Provas/ (prova.md + indice.md).

Cada prova tem:
- prova.md: "## Disciplina", blocos "**Texto de apoio / instruções**", "### Questão N" (ou "### Item N",
  nos itens de certo ou errado) e alternativas "- **(A)** texto";
- indice.md: tabela "| Nº | Pág. | Correspondência no programa PMPE 2026 | Gabarito |".

Entram só as questões que o índice liga a um item do programa da PMPE 2026 e que têm gabarito.
Ficam de fora as anuladas e as que dependem de figura do caderno (o texto convertido não traz a imagem).
A prova de Soldado PMPE 2023 não está em Banco_de_Provas/ (fica em Editais/2023, reservada para o Simulado 1).
"""
import re
from pathlib import Path

DISCIPLINAS = {
    "LP": "Língua Portuguesa",
    "HPE": "História de Pernambuco",
    "HP": "História de Pernambuco",
    "RL": "Raciocínio Lógico",
    "INF": "Informática",
    "DC": "Direito Constitucional",
    "DH": "Direitos Humanos e Legislação Extravagante",
}
RE_TOPICO = re.compile(r"\b(LP|HPE|HP|RL|INF|DC|DH)\s*(\d+)\s*[–-]\s*([^;*(|]+)")
RE_LINHA_INDICE = re.compile(r"^\|\s*(\d+)\s*\|[^|]*\|([^|]*)\|([^|]*)\|")
RE_QUESTAO = re.compile(r"^###\s+(Questão|Item)\s+(\d+)\b")
RE_ALT = re.compile(r"^\s*-\s+\*\*\(([A-E])\)\*\*\s*(.*)$")
RE_APOIO = re.compile(r"^\*\*Texto de apoio", re.I)
RE_FAIXA = re.compile(r"quest(?:ões|oes)\s+(?:de\s+)?(\d+)\s+(?:a|à|até|e)\s+(\d+)", re.I)
# enunciado que manda olhar uma figura que o texto convertido não tem
RE_FIGURA = re.compile(r"(?:figura|imagem|ilustração|planilha|janela|tela|ícone|botão)\s+(?:a seguir|abaixo|apresentad|ilustrad)"
                       r"|observe (?:a|o) (?:figura|imagem|tela|janela|planilha)|conforme (?:a|o) (?:figura|imagem)", re.I)


def _celula(t):
    return re.sub(r"[*_`]", "", t).strip()


def _meta_prova(pasta, texto_prova, texto_indice):
    h1 = re.search(r"^#\s+(.+)$", texto_prova, re.M).group(1).strip()
    banca = re.search(r"\(([^()]*)\)\s*$", h1).group(1).strip()
    partes = [p.strip() for p in re.sub(r"\s*\([^()]*\)\s*$", "", h1).split(" — ")]
    orgao = partes[0]
    sigla = re.search(r"\(([^)]+)\)", orgao)
    sigla = sigla.group(1).split(",")[0].strip() if sigla else orgao
    if " – " in orgao:  # "EBSERH – Hospital Universitário ... (HUJB-UFCG)"
        sigla = orgao.split(" – ")[0].strip()
    elif len(sigla) == 2:  # só a UF: "Câmara Municipal de Maringá (PR)"
        sigla = re.sub(r"\s*\(.*$", "", orgao).replace("Câmara Municipal de", "Câmara de")
    ano = int(re.search(r"(\d{4})", orgao).group(1))
    cargo = re.sub(r"\s*\((?:Edital|caderno)[^)]*\)", "", partes[1] if len(partes) > 1 else "").strip()
    nivel = re.search(r"\*\*Nível:\*\*\s*(\w+)", texto_prova)
    gab = re.search(r"^- \*\*Gabarito:\*\*(.*)$", texto_indice, re.M)
    gab = gab.group(1).lower() if gab else ""
    status = "não confirmado" if "não confirmado" in gab else "preliminar" if "preliminar" in gab and "pós" not in gab else "oficial"
    return {
        "id": pasta.name,
        "nome": f"{sigla} {ano}",
        "cargo": cargo,
        "banca": banca,
        "ano": ano,
        "nivel": nivel.group(1) if nivel else "",
        "grupo": "PM" if orgao.startswith("Polícia Militar") else "Outras áreas",
        "status": status,
    }


def _indice(texto):
    """{número: (códigos de tópico, nomes, gabarito)} das questões ligadas ao programa."""
    out = {}
    for ln in texto.splitlines():
        m = RE_LINHA_INDICE.match(ln)
        if not m:
            continue
        n, corresp, gab = int(m.group(1)), m.group(2), _celula(m.group(3))
        if "fora do programa" in corresp.lower():
            continue
        tops = [(f"{c} {num}", nome.strip(" .;–-")) for c, num, nome in RE_TOPICO.findall(corresp)]
        if tops:
            out[n] = (tops, gab)
    return out


def _blocos(texto):
    """Questões do prova.md com o texto de apoio em vigor: [(número, tipo, linhas, apoio, disciplina)]."""
    out, apoio, disc = [], None, ""
    atual = None  # (numero, tipo, linhas)
    coletando_apoio = None

    def fecha():
        nonlocal atual
        if atual:
            out.append((atual[0], atual[1], atual[2], apoio, disc))
        atual = None

    for ln in texto.splitlines():
        if ln.startswith("## "):
            fecha()
            disc, apoio, coletando_apoio = ln[3:].strip(), None, None
            continue
        if RE_APOIO.match(ln):
            fecha()
            coletando_apoio = []
            apoio = coletando_apoio
            continue
        m = RE_QUESTAO.match(ln)
        if m:
            fecha()
            coletando_apoio = None
            atual = (int(m.group(2)), m.group(1), [])
            continue
        if atual is not None:
            atual[2].append(ln)
        elif coletando_apoio is not None:
            coletando_apoio.append(ln)
    fecha()
    return [(n, t, linhas, "\n".join(ap).strip() if ap else "", d) for n, t, linhas, ap, d in out]


def _resposta(gab, certo_errado):
    g = gab.strip().upper()
    if g.startswith("ANUL"):
        return None
    if certo_errado:
        return {"C": "CERTO", "E": "ERRADO"}.get(g[:1])
    return g[:1] if g[:1] in "ABCDE" and g else None


def _prova(pasta, md, sem_links, avisos):
    texto = (pasta / "prova.md").read_text(encoding="utf-8-sig")
    texto_ind = (pasta / "indice.md").read_text(encoding="utf-8-sig")
    meta = _meta_prova(pasta, texto, texto_ind)
    indice = _indice(texto_ind)
    questoes, apoios = [], {}
    for n, tipo, linhas, apoio, _disc in _blocos(texto):
        if n not in indice:
            continue
        tops, gab = indice[n]
        certo_errado = tipo == "Item"
        resp = _resposta(gab, certo_errado)
        if not resp:
            continue
        alts, enun, depois = [], [], []
        for ln in linhas:
            ma = RE_ALT.match(ln)
            if ma:
                alts.append([ma.group(1), md.renderInline(sem_links(ma.group(2).strip()))])
            elif alts:
                depois.append(ln)
            else:
                enun.append(ln)
        texto_enun = "\n".join(enun).strip()
        if certo_errado:
            alts = [["CERTO", "Certo"], ["ERRADO", "Errado"]]
        if len(alts) < 2 or resp not in {a[0] for a in alts} or not texto_enun:
            avisos.append(f"{meta['nome']} {tipo.lower()} {n}: sem alternativas ou enunciado reconhecível")
            continue
        if RE_FIGURA.search(texto_enun):
            continue  # depende de figura que não está no texto
        if any(x.strip() for x in depois):
            enun += [""] + depois  # texto que o PDF jogou depois das alternativas: fica no fim do enunciado
        q = {"id": f"banco:{meta['id']}:{n}", "p": meta["id"], "n": n, "top": [c for c, _ in tops],
             "e": md.render(sem_links("\n".join(enun).strip())), "a": alts, "r": resp,
             "_nomes": tops, "_txt": texto_enun}
        faixa = RE_FAIXA.search(apoio[:300]) if apoio else None
        if faixa and not int(faixa.group(1)) <= n <= int(faixa.group(2)):
            apoio = ""  # o texto avisa a quais questões se refere, e esta não é uma delas
        if apoio:
            chave = f"{meta['id']}:{len(apoios)}"
            for k, v in apoios.items():
                if v == apoio:
                    chave = k
                    break
            apoios[chave] = apoio
            q["ap"] = chave
        questoes.append(q)
    return meta, questoes, apoios


def _avulsas(arquivo, md, sem_links):
    """Questões avulsas de outras bancas (Estatuto da Juventude): "## Questão N — banca, ano, órgão, cargo"."""
    texto = arquivo.read_text(encoding="utf-8-sig")
    secoes = re.split(r"^## ", texto, flags=re.M)[1:]
    gab = next((s for s in secoes if s.lower().startswith("gabarito")), "")
    resp, coment = {}, {}
    for m in re.finditer(r"^\*\*Questão (\d+) — ([A-E])\.\*\*\s*(.*?)(?=^\*\*Questão \d+ — |\Z)", gab, re.M | re.S):
        resp[int(m.group(1))] = m.group(2)
        coment[int(m.group(1))] = m.group(3).strip()
    metas, questoes = {}, []
    for s in secoes:
        m = re.match(r"Questão (\d+) — (.+)", s)
        if not m:
            continue
        n, fonte = int(m.group(1)), m.group(2).strip()
        partes = [p.strip() for p in fonte.split(",")]
        pid = f"avulsas-ej-{n}"
        metas[pid] = {"id": pid, "nome": f"{partes[0]} {partes[1]}" if len(partes) > 1 else partes[0],
                      "cargo": ", ".join(partes[2:]), "banca": partes[0],
                      "ano": int(partes[1]) if len(partes) > 1 and partes[1].isdigit() else 0,
                      "nivel": "", "grupo": "Outras áreas", "status": "conferido com a lei"}
        alts, enun = [], []
        for ln in s.splitlines()[1:]:
            ma = RE_ALT.match(ln)
            if ma:
                alts.append([ma.group(1), md.renderInline(sem_links(ma.group(2).strip()))])
            elif not alts and not ln.startswith("*Fonte:"):
                enun.append(ln)
        if n in resp and len(alts) >= 2:
            questoes.append({"id": f"banco:avulsas-ej:{n}", "p": pid, "n": n, "top": ["DH 16"],
                             "e": md.render(sem_links("\n".join(enun).strip())), "a": alts, "r": resp[n],
                             "c": md.render(sem_links(coment[n])) if coment.get(n) else "",
                             "_nomes": [("DH 16", "Estatuto da Juventude")], "_txt": "\n".join(enun)})
    return metas, questoes


def coletar(raiz: Path, md, sem_links, avisos):
    """{"provas", "apoios", "topicos", "q"} para o app (as chaves "_" são de uso interno do build)."""
    provas, apoios, questoes, nomes = {}, {}, [], {}
    banco = raiz / "Banco_de_Provas"
    for prova in sorted(banco.rglob("prova.md")):
        pasta = prova.parent
        if not (pasta / "indice.md").exists():
            continue
        meta, qs, aps = _prova(pasta, md, sem_links, avisos)
        provas[meta["id"]] = meta
        apoios.update({k: md.render(sem_links(v)) for k, v in aps.items()})
        questoes += qs
    avulsas = banco / "Outras_Bancas" / "Avulsas_Estatuto_da_Juventude" / "questoes.md"
    if avulsas.exists():
        metas, qs = _avulsas(avulsas, md, sem_links)
        provas.update(metas)
        questoes += qs
    for q in questoes:  # nome mais frequente de cada tópico
        for c, nome in q["_nomes"]:
            nomes.setdefault(c, {}).setdefault(nome, 0)
            nomes[c][nome] += 1
    topicos = {c: max(v.items(), key=lambda kv: kv[1])[0] for c, v in nomes.items()}
    return {"provas": provas, "apoios": apoios, "topicos": topicos, "q": questoes}
