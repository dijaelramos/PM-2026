"""Lê o cronograma do plano de estudos e as datas do perfil para o painel de progresso do app."""
import re

RE_DATA = re.compile(r"(\d{2})/(\d{2})/(\d{4})")


def _iso(m):
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}"


def _horas(txt):
    m = re.search(r"\d+(?:[.,]\d+)?", txt or "")
    return float(m.group(0).replace(",", ".")) if m else 0.0


def ler_plano(texto_plano):
    """Sessões do cronograma: [{data, disciplina, sessao, topicos, h, r}]."""
    linhas = texto_plano.splitlines()
    cab, sessoes = None, []
    for ln in linhas:
        if not ln.lstrip().startswith("|"):
            cab = None if not ln.strip() else cab
            continue
        cel = [c.strip() for c in ln.strip().strip("|").split("|")]
        if cel and cel[0].lower() == "data":
            cab = [c.lower() for c in cel]
            continue
        if cab is None or re.match(r"^[\s:-]+$", cel[0]):
            continue
        m = RE_DATA.match(cel[0])
        if not m:
            continue
        col = {nome: (cel[i] if i < len(cel) else "") for i, nome in enumerate(cab)}
        disc = col.get("disciplina/atividade", "")
        topicos = re.sub(r"^Edital,\s*[^,]+,\s*", "", col.get("tópicos (itens do anexo ii)", "")).strip()
        sessoes.append({
            "data": _iso(m),
            "disciplina": re.sub(r"\*", "", disc).replace("Leg.", "Legislação"),
            "sessao": col.get("sessão", "").replace("Sessao", "Sessão"),
            "topicos": topicos[:160] + ("…" if len(topicos) > 160 else ""),
            "h": _horas(col.get("disciplina (h)")),
            "r": _horas(col.get("redação (h)")),
        })
    return sessoes


def ler_datas(texto_perfil):
    """Data da prova e dos simulados, como estão no Perfil do Estudante."""
    datas = {}
    m = re.search(r"Prova objetiva[^\n]*?(\d{2}/\d{2}/\d{4})", texto_perfil)
    if m:
        datas["prova"] = _iso(RE_DATA.search(m.group(1)))
    simulados = []
    for nome, resto in re.findall(r"\*\*(Simulado \d)[^*]*:\*\*([^\n]*)", texto_perfil):
        d = RE_DATA.search(resto)
        if d:
            simulados.append({"nome": nome, "data": _iso(d),
                              "situacao": "realizado" if resto.strip().lower().startswith("realizado") else "pendente"})
    datas["simulados"] = simulados
    return datas
