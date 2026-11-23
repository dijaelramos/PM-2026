"""Simulados do plano para a folha de respostas do app (Simulado 1 e Simulado 2).

O gabarito só entra no app quando a correção é liberada:
- Simulado 1 (prova de Soldado PMPE 2023): quando o perfil marca o simulado como realizado ou quando o
  material da correção (o de data posterior com "Simulado_1" no nome) chega ao app;
- Simulado 2: quando o arquivo de questões da correção (com gabarito) chega ao app.
Até lá, a folha guarda as respostas e mostra só o tempo e o que falta marcar.
"""
import re

from edital import topicos_no_texto

ORDEM = ["LP", "HPE", "RL", "INF", "DC", "DH"]  # 10 questões de cada, na ordem da prova


def gabarito_2023(texto_indice):
    """{número: letra ou 'ANULADA'}, {número: [tópicos]} do índice da prova de 2023."""
    gab, tops = {}, {}
    for ln in texto_indice.splitlines():
        cel = [c.strip() for c in ln.strip().strip("|").split("|")]
        if not ln.lstrip().startswith("|") or len(cel) != 6 or not cel[0].isdigit():
            continue
        n = cel[0]
        g = re.sub(r"[*_`]", "", cel[5]).strip()
        gab[n] = "ANULADA" if g.lower().startswith("anul") else g[:1].upper()
        tops[n] = topicos_no_texto(cel[2])
    return gab, tops


def montar(raiz, plano_simulados, docs, questoes, pendente_s1):
    """Lista para o catálogo: [{n, nome, data, material, correcao, correcaoDoc, gabarito?, topicos?}]."""
    out = []
    materiais = [d for d in docs if d["categoria"] in ("material", "questoes") and d.get("data")]
    for s in plano_simulados:
        m = re.search(r"(\d+)", s["nome"])
        if not m:
            continue
        k = m.group(1)
        marca = f"Simulado_{k}"
        do_dia = [d for d in materiais if marca in d["caminho"].stem and d["data"] == s["data"]]
        corr = [d for d in materiais if marca in d["caminho"].stem and d["data"] > s["data"]]
        item = {"n": int(k), "nome": s["nome"], "data": s["data"], "total": 60}
        mat = next((d for d in do_dia if d["categoria"] == "material"), None)
        cad = next((d for d in do_dia if d["categoria"] == "questoes"), None)
        if mat:
            item["material"] = mat["id"]
        if cad:
            item["caderno"] = cad["id"]
        if corr:
            item["correcao"] = corr[0]["data"]
            item["correcaoDoc"] = next((d["id"] for d in corr if d["categoria"] == "material"), corr[0]["id"])
        if k == "1":
            item["fonte"] = "Prova de Soldado PMPE 2023 (caderno em PDF ou impresso)"
            indice = raiz / "Editais" / "2023" / "indice_questoes_2023.md"
            if (corr or not pendente_s1) and indice.exists():
                gab, tops = gabarito_2023(indice.read_text(encoding="utf-8-sig"))
                if len(gab) == 60:
                    item["gabarito"], item["topicos"] = gab, tops
        else:
            item["fonte"] = "Caderno do Simulado no app (Questões do dia de " + s["data"][8:10] + "/" + s["data"][5:7] + ")"
            dono = {d["material"] for d in corr if d["categoria"] == "questoes" and d.get("material")}
            qs = {q["numero"]: q for q in questoes if q["doc"] in dono and q["numero"].isdigit()}
            if len(qs) == 60:
                item["gabarito"] = {n: q["resposta"] for n, q in qs.items()}
                item["topicos"] = {n: q.get("top", []) for n, q in qs.items()}
                item["ids"] = {n: q["id"] for n, q in qs.items()}
        out.append(item)
    return out
