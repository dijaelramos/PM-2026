"""Lê a tabela "Roteiro" de um Material do Dia para o cronômetro da sessão do app.

Formatos aceitos na 1ª coluna: "1 h — retomada", "**1ª hora — leitura**", "50 min — questões", "2h30 — ...".
"""
import re

from fala import _texto_inline


def minutos(rotulo):
    """Duração em minutos do rótulo de um bloco, ou None se não houver duração."""
    cab = re.split(r"\s+[—–-]\s+", rotulo.strip(), maxsplit=1)[0].strip()
    if re.fullmatch(r"\d+\s*[ªa]\s*hora", cab, re.I):
        return 60
    m = re.fullmatch(r"(\d+)\s*h(?:oras?)?\s*(?:(\d+)\s*(?:min)?)?", cab, re.I)
    if m:
        return int(m[1]) * 60 + int(m[2] or 0)
    m = re.fullmatch(r"(\d+)\s*min(?:utos)?", cab, re.I)
    return int(m[1]) if m else None


def roteiro(tokens):
    """[{titulo, min, texto, f}] da primeira tabela sob um título "Roteiro"; [] se não houver.

    Os tokens já devem ter passado por fala.capitulos(), que marca cada linha de tabela com data-f.
    """
    for i, tok in enumerate(tokens):
        if tok.type == "heading_open" and i + 1 < len(tokens):
            texto = _texto_inline(tokens[i + 1])
            if re.match(r"^(?:\d+\.\s*)?Roteiro\b", texto.strip(), re.I):
                return _blocos(tokens[i:], int(tok.tag[1]))
    return []


def _blocos(tokens, nivel):
    linhas, linha, tr, em_corpo = [], None, None, False
    for tok in tokens[3:]:  # pula o próprio título
        if tok.type == "heading_open" and int(tok.tag[1]) <= nivel:
            break
        if tok.type == "tbody_open":
            em_corpo = True
        elif tok.type == "tr_open" and em_corpo:
            linha, tr = [], tok
        elif tok.type == "inline" and linha is not None:
            linha.append(re.sub(r"\s+", " ", _texto_inline(tok)).strip())
        elif tok.type == "tr_close" and linha is not None:
            linhas.append((linha, tr))
            linha = None
        elif tok.type == "table_close":
            break
    blocos = []
    for celulas, tr in linhas:
        if len(celulas) < 2:
            continue
        duracao = minutos(celulas[0])
        if not duracao:
            continue
        b = {"titulo": celulas[0], "min": duracao, "texto": celulas[1]}
        if tr is not None and tr.attrGet("data-f") is not None:
            b["f"] = int(tr.attrGet("data-f"))
        blocos.append(b)
    return blocos if len(blocos) >= 2 else []
