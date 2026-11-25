"""Shorts do dia (vídeos verticais de até 1 minuto) feitos a partir do material do dia.

Três Shorts por dia, para publicar em três horários (config.json, "horarios_shorts"):
  1. Pegadinha da banca  — linhas do quadro "A banca escreve… | O certo é…";
  2. Questão relâmpago   — uma questão curta, pausa para responder e o gabarito;
  3. Resumo de 30 segundos — o "Para levar para a prova" de uma seção.
Cada um termina chamando para a aula completa no canal.

Uso:
    python canal/shorts.py                      # materiais de hoje
    python canal/shorts.py --data 2026-11-25
    python canal/shorts.py --arquivo Material_do_Dia/2026-11-25_Historia_de_Pernambuco.md
Saída: canal/saida/<aula>/shorts/short_<n>.mp4 e short_<n>.json (título, descrição, tags, horário).
"""
import argparse
import datetime as dt
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import video as V  # noqa: E402

LARG, ALT = 1080, 1920
LIMITE = 58.0  # segundos: Shorts curtos rendem mais e ficam abaixo de 1 minuto


# ---------------------------------------------------------------- conteúdo

def secoes(caminho):
    out, atual = [], None
    for ln in caminho.read_text(encoding="utf-8-sig").splitlines():
        m = re.match(r"^##\s+(?!#)(.*)$", ln)
        if m:
            titulo = V.limpar_md(m.group(1))
            atual = {"titulo": titulo, "nome": re.sub(r"^\d+(\.\d+)?\.?\s*", "", titulo), "linhas": []}
            out.append(atual)
        elif atual:
            atual["linhas"].append(ln)
    return out


def pegadinhas(caminho):
    for s in secoes(caminho):
        if re.search(r"(?i)pegadinha", s["titulo"]):
            for tipo, cont in V.blocos_md(s["linhas"]):
                if tipo == "tabela" and len(cont) >= 2 and len(cont[0]) >= 2:
                    return [(r[0], r[1]) for r in cont[1:] if len(r) >= 2 and r[0] and r[1]
                            and not V.PESSOAL.search(" ".join(r))]
    return []


def resumos(caminho):
    out = []
    for s in secoes(caminho):
        if not re.match(r"^\d", s["titulo"]) or V.SECAO_FORA.search(s["titulo"]):
            continue
        for tipo, cont in V.blocos_md(s["linhas"]):
            if tipo == "p" and re.match(r"(?i)para levar para a prova\s*:", cont):
                texto = re.sub(r"(?i)^para levar para a prova\s*:\s*", "", cont)
                if 60 <= len(texto) <= 420 and not V.PESSOAL.search(texto):
                    out.append((s["nome"], texto[:1].upper() + texto[1:]))
    return sorted(out, key=lambda x: len(x[1]))


def questoes(caminho):
    qs = [q for q in V.questoes_do_video(caminho, maximo=50) if q["alts"]]
    return sorted(qs, key=lambda q: (not q["autoral"], len(q["enunciado"]) + sum(len(t) for _, t in q["alts"])))


# ---------------------------------------------------------------- roteiros (cada um: lista de telas)

def chamada_final():
    return "A aula completa está no canal. Inscreva-se!"


def roteiro_pegadinha(info, linhas):
    titulo = "Pegadinha da banca"
    telas = [{"titulo": titulo, "blocos": [{"texto": f"{info['disciplina']}: a pegadinha que a banca adora", "grande": True}],
              "fala": f"Pegadinha de {info['disciplina']} que a banca adora. Você cairia nesta?"}]
    for k, (errado, certo) in enumerate(linhas, 1):
        fala = f"A banca escreve: {V.para_fala(errado)}. Errado! O certo é: {V.para_fala(certo)}."
        if k == len(linhas):
            fala += " " + chamada_final()
        telas.append({"titulo": titulo, "blocos": [
            {"rotulo": "A banca escreve (ERRADO)", "texto": errado, "cor": "erro"},
            {"rotulo": "O certo é", "texto": certo, "cor": "certo"}], "fala": fala})
    return {"tipo": "pegadinha", "telas": telas,
            "titulo": f"Pegadinha de {info['disciplina']} que a banca adora", "tema": linhas[0][0]}


def roteiro_questao(info, q):
    titulo = "Questão relâmpago"
    blocos = [{"texto": q["enunciado"]}] + [{"rotulo": f"({a})", "texto": t, "inline": True} for a, t in q["alts"]]
    # as alternativas ficam na tela (lidas, passariam de 1 minuto); a pausa dá tempo de lê-las
    fala = (f"Questão relâmpago de {info['disciplina']}. {V.para_fala(q['enunciado'])} "
            "Leia as alternativas e responda nos comentários! Três, dois, um.")
    resp = dict(q["alts"])[q["letra"]]
    return {"tipo": "questao", "titulo": f"Você acerta esta questão de {info['disciplina']}?", "tema": q["enunciado"],
            "telas": [
                {"titulo": titulo, "sub": q["origem"], "blocos": blocos, "fala": fala, "pausa": 5},
                {"titulo": f"Resposta: letra {q['letra']}", "blocos": [
                    {"rotulo": f"({q['letra']})", "texto": resp, "inline": True, "cor": "certo"},
                    {"texto": q["just"], "cor": "suave"}],
                 "fala": f"Resposta: letra {q['letra']}. {V.para_fala(q['just'] or resp)} {chamada_final()}"}]}


def roteiro_resumo(info, nome, texto):
    titulo = "Resumo de 30 segundos"
    return {"tipo": "resumo", "titulo": f"{nome}: resumo de 30 segundos ({info['disciplina']})", "tema": nome,
            "telas": [{"titulo": titulo, "sub": nome, "blocos": [{"texto": texto}],
                       "fala": f"Resumo relâmpago de {info['disciplina']}: {nome.rstrip('.?')}. {V.para_fala(texto)} "
                               f"{chamada_final()}"}]}


def duracao(r):
    return sum(len(V.sintetizar(t["fala"])) / V.BYTES_POR_SEGUNDO + t.get("pausa", 0) for t in r["telas"])


def escolher(info, caminho):
    """Os três Shorts do material, cada um com até LIMITE segundos (tenta candidatos menores até caber)."""
    out = []
    pg = pegadinhas(caminho)
    for n in (3, 2, 1):
        if len(pg) >= n:
            r = roteiro_pegadinha(info, pg[:n])
            if duracao(r) <= LIMITE:
                out.append(r)
                break
    for q in questoes(caminho)[:6]:
        r = roteiro_questao(info, q)
        if duracao(r) <= LIMITE:
            out.append(r)
            break
    for nome, texto in resumos(caminho)[:6]:
        r = roteiro_resumo(info, nome, texto)
        if duracao(r) <= LIMITE:
            out.append(r)
            break
    return out


# ---------------------------------------------------------------- imagem vertical

COR = dict(V.COR, erro=(255, 120, 110), certo=(110, 220, 140))


def desenhar(info, tela, progresso, destino):
    from PIL import Image, ImageDraw
    img = Image.new("RGB", (LARG, ALT), COR["fundo"])
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, LARG, 200], fill=COR["faixa"])
    d.text((60, 50), info["disciplina"], font=V.fonte(48, True), fill=COR["texto"])
    d.text((60, 120), f"Concurso Soldado PM-PE · {info['data']:%d/%m}", font=V.fonte(34), fill=COR["suave"])
    y = 290
    for l in V.quebrar(d, tela["titulo"].upper(), V.fonte(68, True), LARG - 120)[:2]:
        d.text((60, y), l, font=V.fonte(68, True), fill=COR["destaque"])
        y += 86
    if tela.get("sub"):
        for l in V.quebrar(d, tela["sub"], V.fonte(36), LARG - 120)[:2]:
            d.text((60, y + 6), l, font=V.fonte(36), fill=COR["suave"])
            y += 48
    topo, fundo = y + 50, 1560  # abaixo de ~1600 a interface do Shorts cobre a tela
    blocos = tela["blocos"]
    for tam in (66, 60, 54, 48, 44, 40, 36, 32):
        f, fb = V.fonte(tam), V.fonte(tam, True)
        alto = int(tam * 1.3)
        grande = any(b.get("grande") for b in blocos)
        if grande:
            f = fb = V.fonte(int(tam * 1.25), True)
            alto = int(tam * 1.25 * 1.3)
        plano, total = [], 0
        for b in blocos:
            recuo = 110 if b.get("inline") else 0
            rot = [] if b.get("inline") or not b.get("rotulo") else V.quebrar(d, b["rotulo"], fb, LARG - 120)
            ls = V.quebrar(d, b.get("texto", ""), f, LARG - 120 - recuo) if b.get("texto") else []
            plano.append((b, rot, ls, recuo))
            total += (len(rot) + len(ls)) * alto + 34
        if total <= fundo - topo:
            break
    y = topo
    for b, rot, ls, recuo in plano:
        cor = COR.get(b.get("cor", "texto"), COR["texto"])
        for l in rot:
            d.text((60, y), l, font=fb, fill=cor)
            y += alto
        if b.get("inline") and b.get("rotulo"):
            d.text((60, y), b["rotulo"], font=fb, fill=COR["destaque"])
        for l in ls:
            d.text((60 + recuo, y), l, font=f, fill=COR["texto"] if b.get("rotulo") and not b.get("inline") else cor)
            y += alto
        y += 34
    nome = V.CONFIG.get("nome_canal") or ""
    d.text((60, 1640), f"Aula completa no canal {nome}".strip(), font=V.fonte(34, True), fill=COR["destaque"])
    d.text((60, 1700), "Material independente · não oficial", font=V.fonte(28), fill=COR["suave"])
    d.rectangle([0, ALT - 14, LARG, ALT], fill=COR["linha"])
    d.rectangle([0, ALT - 14, int(LARG * progresso), ALT], fill=COR["destaque"])
    img.save(destino)


# ---------------------------------------------------------------- montagem

def montar_short(info, r, n, pasta):
    tmp = pasta / f"tmp_{n}"
    tmp.mkdir(parents=True, exist_ok=True)
    lista, audio, total = [], bytearray(), duracao(r)
    t = 0.0
    for i, tela in enumerate(r["telas"]):
        mp3 = V.sintetizar(tela["fala"]) + V.silencio(tela.get("pausa", 0))
        dur = len(mp3) / V.BYTES_POR_SEGUNDO
        img = tmp / f"{i:02d}.png"
        t += dur
        desenhar(info, tela, t / total, img)
        lista.append(f"file '{img.as_posix()}'\nduration {dur:.3f}")
        audio += mp3
    ultima = tmp / "{:02d}.png".format(len(r["telas"]) - 1)
    lista.append(f"file '{ultima.as_posix()}'")
    (tmp / "lista.txt").write_text("\n".join(lista), encoding="utf-8")
    (tmp / "audio.mp3").write_bytes(bytes(audio))
    destino = pasta / f"short_{n}.mp4"
    subprocess.run([V.ffmpeg(), "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(tmp / "lista.txt"),
                    "-i", str(tmp / "audio.mp3"), "-c:v", "libx264", "-tune", "stillimage", "-preset", "veryfast",
                    "-r", "24", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest",
                    "-movflags", "+faststart", str(destino)], check=True)
    shutil.rmtree(tmp)
    return destino, t


def montar(caminho):
    info = V.roteiro(caminho)
    escolhidos = escolher(info, caminho)
    if not escolhidos:
        print(f"  {caminho.name}: sem conteúdo para Shorts")
        return []
    pasta = V.SAIDA / info["id"] / "shorts"
    if pasta.exists():
        shutil.rmtree(pasta)
    pasta.mkdir(parents=True)
    horarios = V.CONFIG.get("horarios_shorts", ["12:00", "18:00", "21:00"])
    url = V.CONFIG.get("url_canal", "")
    feitos = []
    for n, r in enumerate(escolhidos, 1):
        destino, dur = montar_short(info, r, n, pasta)
        titulo = f"{r['titulo']} #Shorts"
        if len(titulo) > 100:
            titulo = r["titulo"][:88].rsplit(" ", 1)[0] + "… #Shorts"
        descricao = (
            f"{r['titulo']}{'' if r['titulo'][-1:] in '?!.' else '.'} Concurso de Soldado da PM-PE 2026 "
            "(banca Instituto AOCP).\n\n"
            "Aula completa do dia: {link_aula}\n"
            + (f"Inscreva-se: {url}\n" if url else "")
            + "\nMaterial de estudo independente e não oficial, sem vínculo com a Polícia Militar de Pernambuco, com o "
              "Governo do Estado ou com a banca. Narração com voz sintética.\n\n"
              "#Shorts #ConcursoPMPE #PMPE2026 #SoldadoPMPE #Concursos\n\n"
            f"Código do short: {info['id']}#short{n}"
        )
        meta = {"id": f"{info['id']}#short{n}", "aula": info["id"], "tipo": r["tipo"], "titulo": titulo,
                "descricao": descricao, "tags": ["shorts", "concurso PMPE", "soldado PM-PE", "PMPE 2026",
                                                 "Instituto AOCP", info["disciplina"]],
                "data": info["data"].isoformat(), "horario": horarios[(n - 1) % len(horarios)], "duracao": round(dur, 1)}
        (pasta / f"short_{n}.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
        feitos.append(destino)
        print(f"  short {n} ({r['tipo']}, {dur:.0f} s): {destino}")
    return feitos


def principal_do_dia(dia):
    """Os Shorts do dia saem de um material só: o da disciplina do dia (o resumão só se não houver outro)."""
    mats = V.materiais_do_dia(dia)
    normais = [p for p in mats if not re.search(r"Resumao|Simulado", p.stem)]
    return (normais or [p for p in mats if "Simulado" not in p.stem])[:1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=V.data_iso, default=None)
    ap.add_argument("--arquivo", type=Path, default=None)
    a = ap.parse_args()
    arquivos = [a.arquivo] if a.arquivo else principal_do_dia(a.data or V.hoje_recife())
    if not arquivos:
        print("Nenhum material para Shorts nesta data.")
        return
    for arq in arquivos:
        print(f"Gerando os Shorts de {arq.name}")
        montar((arq if arq.is_absolute() else V.RAIZ / arq).resolve())


if __name__ == "__main__":
    sys.exit(main())
