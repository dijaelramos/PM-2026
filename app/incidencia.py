"""Lei seca com incidência: quantas questões oficiais cobram cada artigo da CF e das leis do edital.

Fonte: as questões oficiais dos materiais (todas as datas; o comentário do gabarito cita o artigo que decide a
questão) e as do banco (só o enunciado e as alternativas). Cada citação "art. 5º, XI, da CF" é atribuída à lei
escrita logo depois dela; sem lei escrita, à lei do tópico da questão (DC -> CF, DH 9 -> Maria da Penha...).
É uma contagem automática: serve para ver o que mais cai, não como estatística exata.
"""
import html as html_lib
import re

# arquivo da Base de Conhecimento -> (como a lei aparece no texto das questões, tópicos do edital que são dela)
LEIS = {
    "CF_1988_arts_1_a_144": (r"\bCF\b|CF/88|CRFB|Constitui[çc][ãa]o(?: Federal| da República)?|Carta Magna", ["DC", "DH 3"]),
    "DUDH_1948": (r"Declara[çc][ãa]o Universal|\bDUDH\b", ["DH 4"]),
    "CADH_Pacto_de_San_Jose_1969": (r"Conven[çc][ãa]o Americana|San Jos[ée]|\bCADH\b", ["DH 5"]),
    "Lei_8069_1990_ECA": (r"\bECA\b|8\.069|Estatuto da Crian[çc]a", ["DH 6"]),
    "Lei_13869_2019_Abuso_de_Autoridade": (r"13\.869|[Aa]buso de [Aa]utoridade", ["DH 7"]),
    "Lei_9455_1997_Tortura": (r"9\.455|[Ll]ei de [Tt]ortura|[Ll]ei da [Tt]ortura", ["DH 8"]),
    "Lei_11340_2006_Maria_da_Penha": (r"11\.340|Maria da Penha", ["DH 9", "DH 17"]),
    "Lei_7716_1989_Crimes_de_Preconceito": (r"7\.716|[Pp]reconceito de [Rr]a[çc]a", ["DH 10"]),
    "Lei_9605_1998_Crimes_Ambientais": (r"9\.605|[Cc]rimes [Aa]mbientais", ["DH 11"]),
    "Lei_8072_1990_Crimes_Hediondos": (r"8\.072|[Cc]rimes [Hh]ediondos|[Ll]ei dos [Hh]ediondos", ["DH 12"]),
    "Lei_11343_2006_Drogas": (r"11\.343|[Ll]ei de [Dd]rogas|[Ll]ei [Aa]ntidrogas", ["DH 13"]),
    "Lei_PE_6783_1974_Estatuto_dos_Militares_de_PE": (r"6\.783|Estatuto dos (?:Policiais )?Militares", ["DH 14"]),
    "Lei_10741_2003_Estatuto_da_Pessoa_Idosa": (r"10\.741|Estatuto (?:da Pessoa Idosa|do Idoso)", ["DH 15"]),
    "Lei_12852_2013_Estatuto_da_Juventude": (r"12\.852|Estatuto da Juventude", ["DH 16"]),
}
MARCAS = {k: re.compile(v[0]) for k, v in LEIS.items()}
RE_ART = re.compile(r"\bart(?:igo)?s?\.?\s*(\d{1,3})(?:\s*[º°o])?(?:\s*-\s*([A-Z])\b)?", re.I)
RE_ART_HTML = re.compile(r'<p data-f="(\d+)"><strong>Art\.\s*(\d{1,3})(?:\s*[º°])?(?:-([A-Z]))?\.?</strong>')


def _texto(q):
    partes = [q.get("enunciado", ""), " ".join(a[1] for a in q.get("alternativas", [])), q.get("comentario", "")]
    return re.sub(r"\s+", " ", html_lib.unescape(re.sub(r"<[^>]+>", " ", " ".join(partes))))


def _lei_do_topico(tops):
    leis = []
    for c in tops or []:
        for lei, (_, codigos) in LEIS.items():
            if any(c == x or (" " not in x and c.split(" ")[0] == x) for x in codigos) and lei not in leis:
                leis.append(lei)
    return leis[0] if len(leis) == 1 else None


def citacoes(q):
    """{(lei, artigo)} citados na questão."""
    texto = _texto(q)
    reserva = _lei_do_topico(q.get("top"))
    if not reserva:  # sem tópico claro: a única lei citada no texto, se houver só uma
        citadas = [k for k, m in MARCAS.items() if m.search(texto)]
        reserva = citadas[0] if len(citadas) == 1 else None
    out = set()
    for m in RE_ART.finditer(texto):
        depois = re.split(r"[;)]|\.\s+[A-ZÁÉÍÓÚ]", texto[m.end(): m.end() + 90])[0]
        lei = next((k for k, mk in MARCAS.items() if mk.search(depois)), None) or reserva
        if lei:
            out.add((lei, m.group(1) + (f"-{m.group(2).upper()}" if m.group(2) else "")))
    return out


def contar(questoes_oficiais):
    """{lei: {artigo: [ids das questões]}} (uma questão conta uma vez por artigo)."""
    out = {}
    for q in questoes_oficiais:
        for lei, art in citacoes(q):
            out.setdefault(lei, {}).setdefault(art, []).append(q["id"])
    return out


def marcar(html, por_artigo):
    """[[data-f, artigo, nº de questões, [ids]]] dos artigos do documento que aparecem nas questões."""
    out = []
    for m in RE_ART_HTML.finditer(html):
        art = m.group(2) + (f"-{m.group(3)}" if m.group(3) else "")
        ids = por_artigo.get(art)
        if ids:
            out.append([int(m.group(1)), art, len(ids), ids])
    return out
