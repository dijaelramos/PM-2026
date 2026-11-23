"""Extrai o estudo dirigido (e o teste-relâmpago dos resumões) do arquivo de questões do dia, com as respostas-modelo.

Formato reconhecido:
- a seção "## … Estudo dirigido …" (ou "## … Teste-relâmpago …"), que vai até o próximo "## " ou "---";
  dentro dela, perguntas numeradas "1. texto" ou "10-A. texto" (linhas seguintes que não são outra pergunta
  continuam a mesma) e títulos de grupo em negrito numa linha só ("**Conceito**") ou em "### Título";
- as respostas num título (## ou ###) que tenha "respostas" e "estudo dirigido" ou "teste-relâmpago", também em
  lista numerada com os mesmos números.
O app transforma cada pergunta num cartão: escrever a resposta, conferir com a resposta-modelo e se autoavaliar.
"""
import re

from questoes import sem_links_locais

RE_SECAO = re.compile(r"^##\s+(?!#)(.*(?:estudo dirigido|teste-rel[aâ]mpago).*)$", re.I)
RE_RESP = re.compile(r"^(#{2,3})\s+(?!#)(.*respostas.*)$", re.I)
RE_ITEM = re.compile(r"^\s{0,3}(\d+(?:-[A-Z])?)[.)]\s+(.*)$")
RE_GRUPO = re.compile(r"^\s*(?:\*\*([^*]+)\*\*|###\s+(.+))\s*$")
RE_TITULO = re.compile(r"^#{1,6}\s")


def _lista(linhas):
    """Lista numerada -> [(número, texto em markdown)], com as linhas de continuação."""
    out = []
    for ln in linhas:
        m = RE_ITEM.match(ln)
        if m:
            out.append([m.group(1), [m.group(2)]])
        elif out:
            out[-1][1].append(ln)
    return [(n, "\n".join(t).strip()) for n, t in out]


def extrair(texto, md):
    linhas = texto.splitlines()
    ini = next((i for i, ln in enumerate(linhas) if RE_SECAO.match(ln) and "respostas" not in ln.lower()), None)
    if ini is None:
        return None
    fim = next((i for i in range(ini + 1, len(linhas)) if linhas[i].startswith("## ") or linhas[i].strip() == "---"),
               len(linhas))
    itens, intro, atual, grupo = [], [], None, ""
    for ln in linhas[ini + 1:fim]:
        mi, mg = RE_ITEM.match(ln), RE_GRUPO.match(ln)
        if mi:
            atual = {"n": mi.group(1), "g": grupo, "md": [mi.group(2)]}
            grupo = ""
            itens.append(atual)
        elif mg:
            grupo, atual = _limpo(mg.group(1) or mg.group(2)), None
        elif atual is not None:
            atual["md"].append(ln)
        elif ln.strip():
            intro.append(ln)

    resp = {}
    for i, ln in enumerate(linhas):
        m = RE_RESP.match(ln)
        if not m or not re.search(r"estudo dirigido|teste-rel[aâ]mpago", m.group(2), re.I):
            continue
        nivel = len(m.group(1))
        j = next((k for k in range(i + 1, len(linhas))
                  if re.match(r"^#{1,%d}\s" % nivel, linhas[k]) or linhas[k].strip() == "---"), len(linhas))
        for n, t in _lista([x for x in linhas[i + 1:j] if not RE_TITULO.match(x)]):
            resp.setdefault(n, t)

    def html(t):
        return md.render(sem_links_locais(t)).strip()

    return {
        "titulo": _limpo(re.sub(r"^\d+\.\s*", "", RE_SECAO.match(linhas[ini]).group(1))),
        "intro": html("\n".join(intro)) if intro else "",
        "itens": [{"n": it["n"], "g": it["g"], "p": html("\n".join(it["md"])), "r": html(resp[it["n"]]) if resp.get(it["n"]) else ""}
                  for it in itens],
    }


def _limpo(t):
    return re.sub(r"[*_`]", "", t).strip().rstrip(":")
