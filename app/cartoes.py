"""Flashcards do app: cada linha das tabelas de "Pegadinhas" e dos "Quadros para não confundir" vira um cartão.

Pegadinha: frente = o que a banca escreve; verso = o certo (e onde está na lei).
Quadro: frente = 1ª coluna; verso = as outras colunas, com o nome de cada uma.
"""
import hashlib
import re
import unicodedata

from fala import _texto_inline, normalizar


INVERTER = {"numero", "numeros", "prazo", "prazos", "idade", "quorum", "valor"}


def _norm(texto):
    t = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", t).strip()


def _sem_links(md_texto):
    return re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", md_texto)


def _tipo_secao(titulo):
    t = titulo.lower()
    if "pegadinha" in t:
        return "pegadinha"
    if "para não confundir" in t or "para nao confundir" in t:
        return "quadro"
    return None


def _limpa_titulo(titulo):
    return re.sub(r"^\s*\d+(?:\.\d+)*[.)]?\s*", "", titulo).strip()


def extrair(tokens, md, doc_id, data, disciplina, origem):
    """Lista de cartões do documento (tokens já processados por fala.capitulos, com data-f nas linhas)."""
    cartoes = []
    secao = None  # (tipo, título da seção)
    nivel_secao = None
    contexto = None
    titulo_atual, nivel_atual = None, None
    cab, linhas, linha, tr, em_cab = [], [], None, None, False

    def fecha_tabela():
        if not secao or not cab or not linhas:
            return
        tipo, titulo_secao = secao
        cab_txt = [_texto_inline(c).strip() for c in cab]
        for celulas, tr_tok in linhas:
            if len(celulas) < 2:
                continue
            textos = [_texto_inline(c).strip() for c in celulas]
            if not textos[0] or not any(textos[1:]):
                continue
            html = [md.renderInline(_sem_links(c.content.strip())) for c in celulas]
            onde_i = next((i for i, h in enumerate(cab_txt) if i > 0 and _norm(h) == "onde"), None)
            onde = textos[onde_i] if onde_i is not None and onde_i < len(textos) else ""
            frente, fala_frente = html[0], textos[0]
            if tipo == "pegadinha" and len(cab_txt) >= 2 and _norm(cab_txt[0]).startswith("a banca"):
                rf, rv = "A banca escreve…", "O certo é…"
                verso, fala_verso = html[1], textos[1]
            else:
                rf = cab_txt[0] if cab_txt else ""
                rv = ""
                outras = [(cab_txt[i] if i < len(cab_txt) else "", html[i], textos[i])
                          for i in range(1, len(celulas)) if i != onde_i and textos[i]]
                if len(outras) == 1 and _norm(rf) in INVERTER:
                    # quadro de números: pergunta pela regra, responde o número ("Licença à gestante" → 120 dias)
                    rf, rv = outras[0][0], rf
                    frente, fala_frente = outras[0][1], outras[0][2]
                    verso, fala_verso = html[0], textos[0]
                elif len(outras) == 1:
                    rv = outras[0][0]
                    verso, fala_verso = outras[0][1], outras[0][2]
                else:
                    verso = "<br>".join(f"<b>{h}:</b> {v}" if h else v for h, v, _ in outras)
                    fala_verso = ". ".join(f"{h}: {t}" if h else t for h, _, t in outras)
            ctx = contexto or _limpa_titulo(titulo_secao)
            cid = hashlib.sha1(f"{_norm(ctx) if tipo == 'quadro' else ''}|{_norm(fala_frente)}".encode()).hexdigest()[:12]
            cartao = {"id": cid, "doc": doc_id, "data": data, "disciplina": disciplina, "origem": origem,
                      "tipo": tipo, "ctx": ctx, "rf": rf, "f": frente, "rv": rv, "v": verso,
                      "ff": normalizar(fala_frente), "fv": normalizar(fala_verso + (f". {onde}" if onde else ""))}
            if onde:
                cartao["onde"] = onde
            if tr_tok is not None and tr_tok.attrGet("data-f") is not None:
                cartao["b"] = int(tr_tok.attrGet("data-f"))
            cartoes.append(cartao)

    for i, tok in enumerate(tokens):
        if tok.type == "heading_open":
            nivel = int(tok.tag[1])
            titulo = _texto_inline(tokens[i + 1]).strip() if i + 1 < len(tokens) else ""
            if secao and nivel <= nivel_secao:
                secao, nivel_secao, contexto = None, None, None
            tipo = _tipo_secao(titulo)
            if tipo and not secao:
                secao, nivel_secao, contexto = (tipo, titulo), nivel, None
            elif secao and nivel > nivel_secao:
                contexto = _limpa_titulo(titulo)
        elif not secao:
            continue
        elif tok.type == "table_open":
            cab, linhas, linha, em_cab = [], [], None, False
        elif tok.type == "thead_open":
            em_cab = True
        elif tok.type == "thead_close":
            em_cab = False
        elif tok.type == "tr_open":
            linha, tr = [], tok
        elif tok.type == "inline" and linha is not None:
            linha.append(tok)
        elif tok.type == "tr_close" and linha is not None:
            if em_cab:
                cab = linha
            else:
                linhas.append((linha, tr))
            linha = None
        elif tok.type == "table_close":
            fecha_tabela()
            cab, linhas = [], []
    return cartoes
