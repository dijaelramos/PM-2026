"""Monta a "Revisão rápida" de um Material do Dia: o essencial para ouvir em 10 a 15 minutos.

Junta, na ordem do material:
1. cada bloco "**Para levar para a prova:**", com o título da seção de onde veio;
2. as seções inteiras "Quadros para não confundir" e "Pegadinhas da banca".
Materiais sem esses blocos (os primeiros, de 05 a 09/11) não ganham revisão.
"""
import re

RE_H2 = re.compile(r"^##\s+(.*)$")
RE_LEVAR = re.compile(r"^\s*(?:>\s*)?\*\*Para levar para a prova:?\*\*:?\s*(.*)$", re.I)
RE_ITEM = re.compile(r"^\s*(?:>\s*)?(?:[-*+]|\d+[.)])\s")
RE_SECAO_INTEIRA = re.compile(r"quadros|pegadinhas", re.I)


def _sem_citacao(ln):
    return re.sub(r"^\s*>\s?", "", ln)


def _bloco_levar(linhas, i):
    """O parágrafo do "Para levar" e, se ele terminar em ":" (ou só tiver o rótulo), a lista seguinte."""
    out = []
    while i < len(linhas) and linhas[i].strip() and linhas[i].strip() != ">":
        out.append(_sem_citacao(linhas[i]))
        i += 1
    out[0] = RE_LEVAR.sub(lambda m: m.group(1), out[0])
    if out[0][:1].islower():
        out[0] = out[0][0].upper() + out[0][1:]
    texto = " ".join(out).strip()
    if not texto or texto.endswith(":"):
        j = i
        while j < len(linhas) and not linhas[j].strip():
            j += 1
        if j < len(linhas) and RE_ITEM.match(linhas[j]):
            out.append("")
            while j < len(linhas):
                ln = linhas[j]
                prox = linhas[j + 1] if j + 1 < len(linhas) else ""
                if RE_ITEM.match(ln) or re.match(r"^\s{2,}\S", ln) or (not ln.strip() and RE_ITEM.match(prox)):
                    out.append(_sem_citacao(ln))
                    j += 1
                else:
                    break
    return [ln for ln in out if ln is not None]


def _limpa_titulo(tit):
    return re.sub(r"^\d+(?:-[A-Z])?\.\s*", "", tit).strip()


def montar(texto, titulo, quando):
    """Markdown da revisão rápida, ou None se o material não tiver o que revisar."""
    linhas = texto.splitlines()
    secoes = [(i, RE_H2.match(ln).group(1).strip()) for i, ln in enumerate(linhas) if RE_H2.match(ln)]
    levar, inteiras = [], []
    for n, (i, tit) in enumerate(secoes):
        fim = secoes[n + 1][0] if n + 1 < len(secoes) else len(linhas)
        if RE_SECAO_INTEIRA.search(tit) and not re.search(r"questões|gabarito|semana", tit, re.I):
            corpo = "\n".join(linhas[i + 1:fim]).strip()
            corpo = re.sub(r"\n-{3,}\s*$", "", corpo)
            if corpo:
                inteiras.append((_limpa_titulo(tit), corpo))
            continue
        for j in range(i + 1, fim):
            if RE_LEVAR.match(linhas[j]):
                bloco = "\n".join(_bloco_levar(linhas, j)).strip()
                if bloco:
                    levar.append((_limpa_titulo(tit), bloco))
    if len(levar) < 2 and not inteiras:
        return None

    partes = [f"# Revisão rápida — {titulo}", "",
              f"Revisão do material de {quando}: o que levar para a prova"
              + (", os quadros e as pegadinhas." if inteiras else "."), ""]
    if levar:
        partes += ["## Para levar para a prova", ""]
        for tit, bloco in levar:
            partes += [f"### {tit}", "", bloco, ""]
    for tit, corpo in inteiras:
        partes += [f"## {tit}", "", corpo, ""]
    return "\n".join(partes)
