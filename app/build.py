#!/usr/bin/env python3
"""Gera o app "PMPE Ouvir" (PWA) em app/dist a partir do conteúdo do repositório.

Uso:
    python app/build.py                  # gera tudo, com MP3 dos 15 materiais mais recentes
    python app/build.py --audios 0       # sem MP3 (rápido; só voz do celular)
    python -m http.server -d app/dist    # testar no navegador em http://localhost:8000
"""
import argparse
import asyncio
import datetime as dt
import hashlib
import json
import re
import shutil
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote

from markdown_it import MarkdownIt

sys.path.insert(0, str(Path(__file__).parent))
from fala import _texto_inline, capitulos  # noqa: E402
from icone import gerar_icones  # noqa: E402
from questoes import DISCIPLINAS_AUTORAIS, simulado1_pendente  # noqa: E402
from questoes import extrair as extrair_questoes  # noqa: E402
from revisao import montar as montar_revisao  # noqa: E402
from roteiro import roteiro as ler_roteiro  # noqa: E402
from cartoes import extrair as extrair_cartoes  # noqa: E402
from plano import ler_datas, ler_plano  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
APP = RAIZ / "app"
DIAS = ["seg.", "ter.", "qua.", "qui.", "sex.", "sáb.", "dom."]
DIAS_LONGOS = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"]

GRUPOS_BASE = {
    "CONTEUDOS_PROGRAMATICOS": "Conteúdo programático",
    "LÍNGUA PORTUGUESA": "Língua Portuguesa",
    "RACIOCÍNIO LÓGICO": "Raciocínio Lógico",
    "INFORMÁTICA": "Informática",
    "Direito_Constitucional": "Direito Constitucional",
    "Direitos_Humanos_e_Legislacao_Extravagante": "Direitos Humanos e Legislação Extravagante",
    "Historia_de_Pernambuco": "História de Pernambuco",
    "REDAÇÃO": "Redação",
}


def slug(texto):
    t = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return re.sub(r"[^A-Za-z0-9]+", "-", t).strip("-").lower()


def hash_curto(dados: bytes, n=10):
    return hashlib.sha256(dados).hexdigest()[:n]


def rel(p: Path):
    return unicodedata.normalize("NFC", p.relative_to(RAIZ).as_posix())


def coletar():
    """Lista os documentos que entram no app."""
    docs = []
    for p in sorted((RAIZ / "Material_do_Dia").glob("*.md")):
        if p.name.lower() == "readme.md":
            continue
        docs.append({"caminho": p, "categoria": "material"})
    plano = RAIZ / "Plano_de_Estudos_PMPE_2026.md"
    if plano.exists():
        docs.append({"caminho": plano, "categoria": "plano", "grupo": "Plano de estudos"})
    for p in sorted((RAIZ / "Editais" / "2026").glob("*.md")):
        docs.append({"caminho": p, "categoria": "plano", "grupo": "Edital 2026"})
    base = RAIZ / "Base_de_Conhecimento"
    for p in sorted(list(base.rglob("*.md")) + list(base.rglob("*.txt"))):
        if p.suffix == ".txt" and p.stat().st_size < 1000:
            continue  # arquivos que só guardam um link
        pasta = p.parent.relative_to(base).parts
        grupo = GRUPOS_BASE.get(pasta[0], pasta[0].replace("_", " ").title()) if pasta else "Geral"
        docs.append({"caminho": p, "categoria": "base", "grupo": grupo})
    return docs


def titulo_material(h1, nome):
    if not re.match(r"(Material do dia|Resumão)", h1, re.I):
        return h1
    partes = [x.strip() for x in h1.split(" — ")]
    assunto = partes[-1] if partes else nome
    assunto = re.sub(r"\s*\(\s*\d+\s?h(?:\s?\d+)?\s*\)|\s*\(\s*\d+\s?min\s*\)", "", assunto)
    assunto = re.sub(r"\s+(?:\d+\s?h(?:\s?\d+)?|\d+\s?min)\b", "", assunto).strip()
    if h1.startswith("Resumão"):
        return "Resumão: " + assunto if not re.search(r"\d", assunto) else "Resumão da semana"
    return assunto


def preparar(doc, md, md_txt):
    p = doc["caminho"]
    texto = p.read_text(encoding="utf-8-sig", errors="replace")
    eh_txt = p.suffix == ".txt"
    m = re.search(r"^#\s+(.+)$", texto, re.M)
    if m and not eh_txt:
        h1 = m.group(1).strip()
    else:
        h1 = next((ln.strip() for ln in texto.splitlines() if ln.strip()), p.stem)
    doc["h1"] = h1
    doc["texto"] = texto
    doc["md"] = md_txt if eh_txt else md
    doc["rel"] = rel(p)
    nome = p.stem
    data = re.match(r"(\d{4})-(\d{2})-(\d{2})", nome)
    if doc["categoria"] == "material":
        doc["titulo"] = titulo_material(h1, nome)
        if data:
            d = dt.date(*map(int, data.groups()))
            doc["data"] = d.isoformat()
            doc["subtitulo"] = f"{DIAS[d.weekday()]} {d:%d/%m}"
        else:
            doc["subtitulo"] = "Extra"
            doc["grupo"] = "Extras"
    else:
        doc["titulo"] = re.sub(r"\s*\(texto convertido\)$", "", h1)[:120] if len(h1) <= 120 else p.stem
    doc["id"] = slug(nome) or hash_curto(doc["rel"].encode())


def reescrever_links(tokens, doc, por_caminho):
    base = doc["caminho"].parent
    for tok in tokens:
        for filho in tok.children or []:
            if filho.type != "link_open":
                continue
            href = filho.attrGet("href") or ""
            if re.match(r"^(https?:|mailto:)", href):
                filho.attrSet("target", "_blank")
                filho.attrSet("rel", "noopener")
                continue
            if href.startswith("#"):
                filho.attrs.pop("href", None)
                continue
            alvo = unquote(href.split("#")[0])
            try:
                caminho = rel((base / alvo).resolve())
            except ValueError:
                caminho = None
            if caminho in por_caminho:
                filho.attrSet("href", f"#/doc/{por_caminho[caminho]}")
            else:
                filho.attrs.pop("href", None)
                filho.attrSet("class", "semlink")


def blocos_busca(tokens):
    """Texto original de cada bloco marcado com data-f (parágrafo, título, linha de tabela), para a busca."""
    out, atual = [], None
    for tok in tokens:
        if tok.type in ("paragraph_open", "heading_open", "tr_open") and tok.attrGet("data-f") is not None:
            atual = [int(tok.attrGet("data-f")), []]
            out.append(atual)
        elif tok.type == "inline" and atual is not None:
            atual[1].append(_texto_inline(tok).strip())
        elif tok.type in ("paragraph_close", "heading_close", "tr_close"):
            atual = None
    return [[f, " · ".join(p for p in partes if p)] for f, partes in out if any(partes)]


def coletar_questoes(docs, md):
    """Questões dos materiais (oficiais) e dos arquivos de questões autorais."""
    perfil = RAIZ / "Perfil_do_Estudante.md"
    pendente = simulado1_pendente(perfil.read_text(encoding="utf-8")) if perfil.exists() else True
    avisos, questoes = [], []
    for d in docs:
        if d["categoria"] == "material" and d.get("data"):
            disciplina = re.sub(r"\s*(?:e|\+)\s*Redação$", "", d["titulo"]).strip()
            questoes += extrair_questoes(d["texto"], doc_id=d["id"], disciplina=disciplina,
                                         origem=f"Material de {d['subtitulo'].split(' ')[-1]}", autoral=False,
                                         md=md, pendente_simulado=pendente, avisos=avisos)
    for p in sorted((RAIZ / "Banco_de_Provas" / "Questoes_Autorais").glob("*.md")):
        if p.stem in DISCIPLINAS_AUTORAIS:
            questoes += extrair_questoes(p.read_text(encoding="utf-8-sig"), doc_id=f"autorais-{slug(p.stem)}",
                                         disciplina=DISCIPLINAS_AUTORAIS[p.stem], origem="Questões autorais",
                                         autoral=True, md=md, pendente_simulado=pendente, avisos=avisos)
    for a in avisos:
        print(f"  AVISO (questão ignorada): {a}")
    if pendente:
        print("  Simulado 1 pendente: questões reservadas ficaram de fora.")
    return questoes


async def gerar_audios(alvos, args, cache):
    from audio import GeradorAudio
    ger = GeradorAudio(cache, args.voz, args.taxa)
    resultados = {}
    for doc in alvos:
        print(f"  áudio: {doc['rel']}")
        try:
            resultados[doc["id"]] = await ger.documento(doc["capitulos"])
        except Exception as erro:
            print(f"    AVISO: áudio não gerado ({erro}). O app usa a voz do celular para este material.")
    if args.limpar_cache:
        ger.limpar_cache()
    return resultados


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--saida", type=Path, default=APP / "dist")
    ap.add_argument("--audios", type=int, default=15,
                    help="MP3 para os N materiais mais recentes (0 = nenhum). O GitHub Pages aceita até 1 GB.")
    ap.add_argument("--revisoes", type=int, default=30, help="MP3 para as N revisões rápidas mais recentes")
    ap.add_argument("--limite-mb", type=int, default=900,
                    help="teto do total de áudio; acima dele, os MP3 completos mais antigos saem (Pages: 1 GB)")
    ap.add_argument("--voz", default="pt-BR-AntonioNeural",
                    help="voz do MP3 (escolhida pelo usuário em 18/11/2026); outras: pt-BR-FranciscaNeural, pt-BR-ThalitaMultilingualNeural")
    ap.add_argument("--taxa", default="-10%", help="velocidade da voz no MP3, ex.: -10%% (mais lenta) ou +10%%")
    ap.add_argument("--cache", type=Path, default=APP / ".cache" / "audio")
    ap.add_argument("--limpar-cache", action="store_true", help="apaga do cache os trechos de áudio que não foram usados")
    args = ap.parse_args()

    md = MarkdownIt("commonmark", {"html": False}).enable(["table", "strikethrough"])
    md_txt = MarkdownIt("commonmark", {"html": False, "breaks": True}).enable(["table"])

    docs = coletar()
    for d in docs:
        preparar(d, md, md_txt)
    ids = {}
    for d in docs:  # ids únicos
        base_id, n = d["id"], 2
        while d["id"] in ids:
            d["id"] = f"{base_id}-{n}"; n += 1
        ids[d["id"]] = d

    # Revisão rápida de cada material (documento derivado, com áudio próprio).
    revisoes = []
    for d in docs:
        if d["categoria"] != "material" or not d.get("data") or d["h1"].startswith("Resumão"):
            continue
        dia = dt.date.fromisoformat(d["data"])
        texto_rev = montar_revisao(d["texto"], d["titulo"], f"{DIAS_LONGOS[dia.weekday()]}, {dia:%d/%m}")
        if texto_rev:
            rid = f"{d['id']}-revisao"
            revisoes.append({"caminho": d["caminho"], "categoria": "revisao", "id": rid, "md": md,
                             "titulo": f"Revisão rápida: {d['titulo']}", "subtitulo": d["subtitulo"],
                             "data": d["data"], "texto": texto_rev, "rel": f"{d['rel']}#revisao",
                             "h1": texto_rev.splitlines()[0][2:], "material": d["id"]})
            d["revisao"] = rid
    docs += revisoes
    por_caminho = {d["rel"]: d["id"] for d in docs}

    for d in docs:
        tokens = d["md"].parse(d["texto"])
        d["capitulos"] = capitulos(tokens, d["titulo"])
        d["busca"] = blocos_busca(tokens) if d["categoria"] != "revisao" else []  # a revisão repete o material
        d["roteiro"] = ler_roteiro(tokens) if d["categoria"] == "material" else []  # blocos do cronômetro
        d["cartoes"] = []
        if d["categoria"] == "material" and d.get("data"):  # flashcards: pegadinhas e quadros
            resumao = d["h1"].startswith("Resumão")
            d["cartoes"] = extrair_cartoes(
                tokens, d["md"], d["id"], d["data"],
                "Resumão da semana" if resumao else re.sub(r"\s*(?:e|\+)\s*Redação$", "", d["titulo"]).strip(),
                f"{'Resumão' if resumao else 'Material'} de {d['subtitulo'].split(' ')[-1]}")
        reescrever_links(tokens, d, por_caminho)
        d["html"] = d["md"].renderer.render(tokens, d["md"].options, {})

    saida = args.saida
    if saida.exists():
        shutil.rmtree(saida)
    (saida / "data" / "docs").mkdir(parents=True)
    (saida / "audio").mkdir()

    def recentes(cat):
        return sorted((d for d in docs if d["categoria"] == cat and d.get("data")),
                      key=lambda d: (d["data"], d["rel"]), reverse=True)

    alvos_mat = recentes("material")[: max(args.audios, 0)]
    alvos = alvos_mat + recentes("revisao")[: max(args.revisoes, 0)]
    audios = asyncio.run(gerar_audios(alvos, args, args.cache)) if alvos else {}

    # O GitHub Pages aceita até 1 GB: se passar do teto, tira o MP3 completo dos materiais mais antigos.
    total = sum(len(a[0]) for a in audios.values())
    for d in reversed(alvos_mat):
        if total <= args.limite_mb * 1e6:
            break
        if d["id"] in audios:
            total -= len(audios.pop(d["id"])[0])
            print(f"  AVISO: sem MP3 para {d['rel']} (limite de {args.limite_mb} MB); fica com a voz do celular.")

    questoes = coletar_questoes(docs, md)
    por_doc = {}
    for q in questoes:
        por_doc[q["doc"]] = por_doc.get(q["doc"], 0) + 1
    corpo_q = json.dumps(questoes, ensure_ascii=False, separators=(",", ":")).encode()
    arquivo_q = f"data/questoes.{hash_curto(corpo_q)}.json"

    # Índice da busca dentro dos textos: [índice do documento, bloco, texto].
    ids_busca = [d["id"] for d in docs if d["busca"]]
    pos = {i: n for n, i in enumerate(ids_busca)}
    corpo_b = json.dumps({"ids": ids_busca, "b": [[pos[d["id"]], f, t] for d in docs if d["busca"] for f, t in d["busca"]]},
                         ensure_ascii=False, separators=(",", ":")).encode()
    arquivo_b = f"data/busca.{hash_curto(corpo_b)}.json"
    (saida / arquivo_b).write_bytes(corpo_b)

    # Flashcards: materiais antes dos resumões (que repetem pegadinhas); um cartão por id.
    cartoes, vistos = [], set()
    fontes = sorted((d for d in docs if d["cartoes"]), key=lambda d: (d["h1"].startswith("Resumão"), d["data"], d["rel"]))
    for d in fontes:
        for c in d["cartoes"]:
            if c["id"] not in vistos:
                vistos.add(c["id"])
                cartoes.append(c)
    cartoes_por_doc = {}
    for c in cartoes:
        cartoes_por_doc[c["doc"]] = cartoes_por_doc.get(c["doc"], 0) + 1
    corpo_c = json.dumps(cartoes, ensure_ascii=False, separators=(",", ":")).encode()
    arquivo_c = f"data/cartoes.{hash_curto(corpo_c)}.json"
    (saida / arquivo_c).write_bytes(corpo_c)
    (saida / arquivo_q).write_bytes(corpo_q)

    catalogo = []
    for d in docs:
        caps = d["capitulos"]
        item = {k: d[k] for k in ("id", "titulo", "categoria") if k in d}
        if por_doc.get(d["id"]):
            item["questoes"] = por_doc[d["id"]]
        if cartoes_por_doc.get(d["id"]):
            item["cartoes"] = cartoes_por_doc[d["id"]]
        for k in ("subtitulo", "grupo", "data", "revisao", "material", "roteiro"):
            if d.get(k):
                item[k] = d[k]
        if d["id"] in audios:
            mp3, inicios, tempos = audios[d["id"]]
            nome = f"audio/{d['id']}.{hash_curto(mp3)}.mp3"
            (saida / nome).write_bytes(mp3)
            for c, ini, t in zip(caps, inicios, tempos):
                c["inicio"] = ini
                c["t"] = t  # início de cada parágrafo no MP3 (marcação do texto)
            item["audio"] = {"url": nome, "bytes": len(mp3), "duracao": round(len(mp3) / 6000)}
        corpo = json.dumps({"id": d["id"], "titulo": d["titulo"], "origem": d["rel"], "html": d["html"],
                            "capitulos": caps}, ensure_ascii=False, separators=(",", ":")).encode()
        item["arquivo"] = f"data/docs/{d['id']}.{hash_curto(corpo)}.json"
        item["palavras"] = sum(len(p.split()) for c in caps for p in c["paragrafos"])
        (saida / item["arquivo"]).write_bytes(corpo)
        catalogo.append(item)

    ordem = {"material": 0, "revisao": 1, "plano": 2, "base": 3}
    catalogo.sort(key=lambda i: (i.get("grupo", ""), i["titulo"]))
    catalogo.sort(key=lambda i: i.get("data", ""), reverse=True)  # material mais recente primeiro
    catalogo.sort(key=lambda i: ordem[i["categoria"]])
    conteudo = json.dumps(catalogo, ensure_ascii=False, sort_keys=True).encode()
    versao = hash_curto(conteudo, 12)
    arq_plano, arq_perfil = RAIZ / "Plano_de_Estudos_PMPE_2026.md", RAIZ / "Perfil_do_Estudante.md"
    plano = {"sessoes": ler_plano(arq_plano.read_text(encoding="utf-8")) if arq_plano.exists() else [],
             **(ler_datas(arq_perfil.read_text(encoding="utf-8")) if arq_perfil.exists() else {})}
    agora = dt.datetime.now(dt.timezone(dt.timedelta(hours=-3))).strftime("%d/%m/%Y %H:%M")
    (saida / "data" / "catalogo.json").write_text(
        json.dumps({"versao": versao, "gerado_em": agora, "docs": catalogo,
                    "questoes": {"arquivo": arquivo_q, "total": len(questoes)}, "plano": plano,
                    "busca": {"arquivo": arquivo_b}, "cartoes": {"arquivo": arquivo_c, "total": len(cartoes)}},
                   ensure_ascii=False), encoding="utf-8")

    # Arquivos do app; a versão do service worker muda quando o código muda.
    web = APP / "web"
    gerar_icones(web / "icons")  # só desenha os que ainda não existem
    shutil.copytree(web, saida, dirs_exist_ok=True)
    codigo = b"".join((web / n).read_bytes() for n in sorted(x.name for x in web.iterdir() if x.is_file()))
    sw = saida / "sw.js"
    sw.write_text(sw.read_text(encoding="utf-8").replace("__VERSAO__", hash_curto(codigo)), encoding="utf-8")
    (saida / ".nojekyll").write_text("")

    total_audio = sum(a["bytes"] for a in (i.get("audio") for i in catalogo) if a)
    print(f"Pronto: {len(catalogo)} documentos, {len(questoes)} questões, {len(cartoes)} flashcards, {len(audios)} áudios ({total_audio / 1e6:.0f} MB) em {saida}")


if __name__ == "__main__":
    main()
