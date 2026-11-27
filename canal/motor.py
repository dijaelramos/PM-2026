"""Fila do YouTube, compartilhada pelo robô geral e pelos individuais (Python 3.8+)."""
import argparse
import contextlib
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
from urllib.parse import urlsplit, parse_qs

FUSO = dt.timezone(dt.timedelta(hours=-3))
INTERVALO = dt.timedelta(minutes=10)
PREFIXO_RPC = "@@YTFILA@@"
HORARIOS = ("07:00", "12:00", "18:00", "21:00")


def agora():
    return dt.datetime.now(FUSO).replace(tzinfo=None)


def ler_json(arquivo, padrao=None):
    """Ausência é normal; arquivo danificado nunca equivale a histórico vazio."""
    arquivo = Path(arquivo)
    if not arquivo.exists():
        return {} if padrao is None else padrao
    return json.loads(arquivo.read_text(encoding="utf-8-sig"))


def salvar_json(arquivo, valor):
    arquivo = Path(arquivo)
    arquivo.parent.mkdir(parents=True, exist_ok=True)
    temporario = arquivo.with_name(arquivo.name + ".tmp-" + str(os.getpid()))
    try:
        with temporario.open("w", encoding="utf-8", newline="\n") as f:
            json.dump(valor, f, ensure_ascii=False, indent=2)
            f.flush()
            os.fsync(f.fileno())
        os.replace(str(temporario), str(arquivo))
    finally:
        if temporario.exists():
            temporario.unlink()


class Ocupado(RuntimeError):
    pass


class Trava:
    """Trava do sistema operacional: também é liberada se o processo morrer."""
    def __init__(self, arquivo):
        self.arquivo = Path(arquivo)
        self.f = None

    def __enter__(self):
        self.arquivo.parent.mkdir(parents=True, exist_ok=True)
        self.f = self.arquivo.open("a+b")
        try:
            if os.name == "nt":
                import msvcrt
                self.f.seek(0, 2)
                if self.f.tell() == 0:
                    self.f.write(b"\0")
                    self.f.flush()
                self.f.seek(0)
                msvcrt.locking(self.f.fileno(), msvcrt.LK_NBLCK, 1)
            else:
                import fcntl
                fcntl.flock(self.f.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError as ex:
            self.f.close()
            self.f = None
            raise Ocupado("Outro robô está usando este canal ou perfil.") from ex
        return self

    def __exit__(self, *args):
        if self.f is not None:
            if os.name == "nt":
                import msvcrt
                self.f.seek(0)
                msvcrt.locking(self.f.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                import fcntl
                fcntl.flock(self.f.fileno(), fcntl.LOCK_UN)
            self.f.close()
            self.f = None


def link_padrao(link):
    try:
        url = urlsplit(link or '')
        host = (url.hostname or '').lower()
        if host.startswith('www.'):
            host = host[4:]
        if url.scheme != 'https':
            return None
        if host == 'youtu.be':
            vid = url.path.strip('/')
        elif host in ('youtube.com', 'm.youtube.com'):
            if url.path == '/watch':
                vid = parse_qs(url.query).get('v', [''])[0]
            elif re.fullmatch(r'/(?:shorts|live)/[\w-]{11}/?', url.path):
                vid = url.path.rstrip('/').rsplit('/', 1)[-1]
            else:
                return None
        else:
            return None
        return 'https://youtu.be/' + vid if re.fullmatch(r'[\w-]{11}', vid) else None
    except ValueError:
        return None


def link_valido(link):
    return link_padrao(link) is not None


def diretorio_estado(projeto, config):
    # Na instalação completa, todos usam a mesma pasta, inclusive em unidade de rede.
    central = Path(projeto).parent / "canal_youtube"
    if (central / "config.json").exists():
        raiz = central / ".estado"
    else:
        raiz = Path(os.environ.get("LOCALAPPDATA") or Path.home() / ".local" / "share") / "ConcursosYoutube"
    url = urlsplit(config["url_canal"].strip())
    canal = (url.hostname or "").lower().replace("www.", "", 1) + url.path.rstrip("/").lower()
    return raiz / hashlib.sha256(canal.encode("utf-8")).hexdigest()[:20]


def identidade(config, chave):
    codigo = config.get("id_concurso", "")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", codigo):
        raise ValueError("Configure id_concurso em canal/config.json antes de publicar.")
    return codigo + ":" + chave


def montar_fila(agendas):
    """Ordena por horário, concurso e material; cada item ocupa um intervalo."""
    grupos = {}
    for ordem, codigo, tarefas in agendas:
        for tarefa in tarefas:
            t = dict(tarefa, concurso=codigo, ordem=ordem)
            grupos.setdefault(t["quando"], []).append(t)
    fila = []
    for horario, itens in sorted(grupos.items()):
        concursos = {}
        for t in sorted(itens, key=lambda x: (x["ordem"], x["chave"])):
            concursos.setdefault(t["ordem"], []).append(t)
        alternados = []
        for rodada in range(max(len(lista) for lista in concursos.values())):
            alternados.extend(lista[rodada] for lista in concursos.values() if rodada < len(lista))
        for posicao, t in enumerate(alternados):
            t["quando"] = (dt.datetime.fromisoformat(horario) + posicao * INTERVALO).isoformat()
            fila.append(t)
    return sorted(fila, key=lambda t: (t["quando"], t["ordem"], t["chave"]))


def pode_enviar(estado, instante):
    pausa = estado.get("pausado_ate")
    if pausa and dt.datetime.fromisoformat(pausa) > instante:
        return pausa
    ultimo = estado.get("ultimo_envio")
    if ultimo:
        liberado = dt.datetime.fromisoformat(ultimo) + INTERVALO
        if liberado > instante:
            return liberado.isoformat()
    return None


def publicar(R, tarefa, verificar):
    """Só chama o envio após histórico íntegro, trava e consulta ao próprio Studio."""
    config = R.V.CONFIG
    ident = identidade(config, tarefa["chave"])
    pasta = diretorio_estado(R.V.RAIZ, config)
    try:
        with Trava(pasta / "publicacao.lock"):
            arquivo = pasta / "estado.json"
            estado = ler_json(arquivo)
            itens = estado.setdefault("tarefas", {})
            anterior = itens.get(ident, {})
            historico = ler_json(R.REGISTRO)
            local = historico.get(tarefa["chave"], {})
            link = anterior.get("link") if anterior.get("estado") == "concluido" else local.get("link")
            if link_valido(link):
                # Preserva os registros e extras existentes do concurso.
                if not link_valido(local.get("link")):
                    R.registrar(tarefa["chave"], link)
                return {"estado": "ja_postado", "link": link}
            espera = pode_enviar(estado, agora())
            if espera:
                return {"estado": "aguardar", "ate": espera}
            encontrado = verificar(tarefa)
            if encontrado:
                if encontrado.get("estado") != "publicado":
                    return {"estado": "verificacao_pendente",
                            "mensagem": "O Studio contém rascunho/processamento deste item. Não farei outro envio."}
                link = encontrado["link"]
                if not link_valido(link):
                    raise RuntimeError("O Studio retornou um link inválido.")
                itens[ident] = {"estado": "concluido", "link": link, "quando": agora().isoformat()}
                estado["ultimo_envio"] = agora().isoformat()
                salvar_json(arquivo, estado)
                R.registrar(tarefa["chave"], link)
                return {"estado": "ja_postado", "link": link}
            if anterior.get("estado") in ("enviando", "verificar"):
                return {"estado": "verificacao_pendente",
                        "mensagem": "Houve envio com resultado incerto. Confira o Studio antes de autorizar novo envio."}
            item = R.preparar(tarefa)
            if not item:
                return {"estado": "sem_conteudo"}
            # A geração pode levar bastante tempo. Consulte de novo antes do upload.
            encontrado = verificar(tarefa)
            if encontrado:
                if encontrado.get("estado") == "publicado" and link_valido(encontrado.get("link")):
                    itens[ident] = {"estado": "concluido", "link": encontrado["link"], "quando": agora().isoformat()}
                    estado["ultimo_envio"] = agora().isoformat()
                    salvar_json(arquivo, estado)
                    R.registrar(tarefa["chave"], encontrado["link"])
                    return {"estado": "ja_postado", "link": encontrado["link"]}
                return {"estado": "verificacao_pendente", "mensagem": "Já há um envio deste item no Studio."}
            arquivo_video, titulo, descricao, miniatura, extras = item
            if not arquivo_video.is_file():
                raise RuntimeError("O gerador não produziu o arquivo do vídeo.")
            marcador = "YTCONCURSO " + ident
            descricao = marcador + "\n\n" + descricao
            extras = dict(extras or {})
            iniciou = [False]

            def antes_do_envio():
                # Persistido ANTES de selecionar o arquivo: falha/reinício não libera duplicação.
                itens[ident] = {"estado": "enviando", "quando": agora().isoformat(), "marcador": marcador}
                estado["ultimo_envio"] = agora().isoformat()
                salvar_json(arquivo, estado)
                iniciou[0] = True

            extras["antes_do_envio"] = antes_do_envio
            visibilidade = R.visibilidade()
            try:
                link = R.postar(arquivo_video, titulo, descricao, visibilidade, miniatura, extras)
                if not iniciou[0]:
                    raise RuntimeError("O publicador não confirmou a proteção antes do envio.")
                if not link_valido(link):
                    raise RuntimeError("Envio sem link confirmado; não vou reenviar automaticamente.")
                link = link_padrao(link)
                instante = agora().isoformat()
                itens[ident] = {"estado": "concluido", "link": link, "quando": instante}
                estado["ultimo_envio"] = instante
                salvar_json(arquivo, estado)
                comentario = extras.get("comentario") if visibilidade != "PRIVATE" else None
                R.registrar(tarefa["chave"], link, comentario)
                if extras.get("playlist_ok") is False:
                    R.atualizar_registro(tarefa["chave"], playlist_pendente=extras["playlist"], playlist_tentativas=0)
                return {"estado": "postado", "link": link}
            except BaseException as ex:
                if itens.get(ident, {}).get("estado") != "concluido":
                    if iniciou[0]:
                        itens[ident]["estado"] = "verificar"
                    if isinstance(ex, R.LimiteDiario):
                        estado["pausado_ate"] = (agora().date() + dt.timedelta(days=1)).isoformat() + "T00:00:00"
                    salvar_json(arquivo, estado)
                raise
    except Ocupado:
        return {"estado": "ocupado", "mensagem": "Outro robô está verificando ou enviando. Aguardando a fila."}


class Processo:
    """Um processo por concurso evita misturar módulos/configurações e mantém o Chrome aberto."""
    def __init__(self, cadastro, log):
        self.cadastro, self.log, self.proc = cadastro, log, None

    def chamar(self, op, **dados):
        if self.proc is None or self.proc.poll() is not None:
            caminho = self.cadastro["pasta"] / "canal" / "integracao.py"
            cmd = [sys.executable, "-B", "-u", "-X", "utf8", str(caminho), "--worker"]
            opcoes = {"creationflags": subprocess.CREATE_NO_WINDOW} if os.name == "nt" else {}
            self.proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                         text=True, encoding="utf-8", cwd=str(caminho.parent), **opcoes)
        self.proc.stdin.write(json.dumps(dict(dados, op=op), ensure_ascii=False) + "\n")
        self.proc.stdin.flush()
        while True:
            linha = self.proc.stdout.readline()
            if not linha:
                raise RuntimeError("O executor do concurso encerrou. Verifique o log do concurso.")
            if linha.startswith(PREFIXO_RPC):
                valor = json.loads(linha[len(PREFIXO_RPC):])
                if "erro" in valor:
                    raise RuntimeError(valor["erro"])
                return valor["resultado"]
            self.log("[" + self.cadastro["id"] + "] " + linha.rstrip())

    def fechar(self):
        if self.proc:
            with contextlib.suppress(Exception):
                self.proc.stdin.close()
            try:
                self.proc.wait(timeout=30)
            except subprocess.TimeoutExpired:
                self.proc.terminate()
            self.proc = None


def carregar_cadastros(arquivo):
    arquivo = Path(arquivo)
    config = ler_json(arquivo)
    itens, ids, pastas = [], set(), set()
    for ordem, item in enumerate(config["concursos"]):
        if item.get("ativo", True) is False:
            continue
        c = dict(item)
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", c["id"]) or c["id"] in ids:
            raise ValueError("Identificador de concurso inválido ou repetido.")
        c["pasta"] = (arquivo.parent / c["pasta"]).resolve()
        if c["pasta"] in pastas:
            raise ValueError("Pasta de concurso repetida.")
        cfg = ler_json(c["pasta"] / "canal" / "config.json")
        if cfg.get("id_concurso") != c["id"]:
            raise ValueError(c["id"] + ": identificador diverge do canal/config.json.")
        if not (c["pasta"] / "canal" / "integracao.py").is_file():
            raise ValueError(c["id"] + ": falta preparar o robô individual.")
        c["ordem"] = ordem
        itens.append(c)
        ids.add(c["id"])
        pastas.add(c["pasta"])
    if not itens:
        raise ValueError("Nenhum concurso ativo.")
    return itens


def obter_fila(provedores, cadastros, dia):
    agendas = []
    for c in cadastros:
        tarefas = provedores[c["id"]].chamar("agenda", dia=dia.isoformat())
        agendas.append((c["ordem"], c["id"], tarefas))
    return montar_fila(agendas)


def exibir(fila, nomes):
    print("Simulação — nenhum vídeo, áudio, navegador ou postagem será criado.")
    if not fila:
        print("Não há material publicável neste dia.")
    for t in fila:
        print("{} | {} | {}{}".format(dt.datetime.fromisoformat(t["quando"]).strftime("%d/%m %H:%M"),
              nomes[t["concurso"]], t["nome"], " | já registrado" if t.get("postado") else ""))
    print("Intervalo mínimo real entre envios: 10 minutos. Uploads demorados podem atrasar os próximos.")


def rodar(provedores, cadastros, log, data=None, simular=False, recarregar=None):
    nomes = {c["id"]: c.get("nome", c["id"]) for c in cadastros}
    if simular:
        exibir(obter_fila(provedores, cadastros, data or agora().date()), nomes)
        return 0
    if os.name == "nt":
        import ctypes
        ctypes.windll.kernel32.SetThreadExecutionState(0x80000001)
    avisos, tentativas, atualizados = {}, {}, set()
    try:
        log("Fila ligada: aulas a partir das 07h; Shorts às 12h, 18h e 21h; intervalo de 10 minutos.")
        while True:
            if recarregar:
                try:
                    novos = recarregar()
                    ids = {c["id"] for c in novos}
                    for codigo in list(provedores):
                        if codigo not in ids:
                            provedores.pop(codigo).fechar()
                    for c in novos:
                        if c["id"] not in provedores:
                            provedores[c["id"]] = Processo(c, log)
                            log("Novo concurso incluído na fila: " + c["id"])
                    cadastros[:] = novos
                except Exception as ex:
                    log("Cadastro novo inválido; mantive a fila anterior: " + str(ex))
            dia = agora().date()
            for c in cadastros:
                marca = (dia, c["id"])
                if marca not in atualizados:
                    atualizados.add(marca)
                    try:
                        if provedores[c["id"]].chamar("atualizar"):
                            # No modo individual, o .bat reinicia o próprio processo.
                            if not isinstance(provedores[c["id"]], Processo):
                                return 3
                            provedores[c["id"]].fechar()
                    except Exception as ex:
                        log(c["id"] + ": atualização indisponível: " + str(ex))
            try:
                fila = obter_fila(provedores, cadastros, dia)
            except Exception as ex:
                log("Não consegui ler a agenda: " + str(ex))
                time.sleep(30)
                continue
            trabalhou = False
            for t in fila:
                if t.get("postado") or dt.datetime.fromisoformat(t["quando"]) > agora():
                    continue
                chave = (dia, t["concurso"], t["chave"])
                falhas, liberar = tentativas.get(chave, (0, dt.datetime.min))
                if falhas >= 3 or liberar > agora():
                    continue
                try:
                    resposta = provedores[t["concurso"]].chamar("executar", tarefa=t)
                    estado = resposta["estado"]
                    aviso = t["concurso"] + " | " + t["nome"] + " | " + estado
                    if resposta.get("mensagem"):
                        aviso += " | " + resposta["mensagem"]
                    if resposta.get("ate"):
                        aviso += " | liberado após " + resposta["ate"]
                    if avisos.get(chave) != aviso:
                        log(aviso)
                        avisos[chave] = aviso
                    if estado in ("postado", "ja_postado"):
                        trabalhou = True
                        break
                    if estado in ("verificacao_pendente", "sem_conteudo"):
                        tentativas[chave] = (falhas, agora() + dt.timedelta(minutes=15))
                except Exception as ex:
                    tentativas[chave] = (falhas + 1, agora() + dt.timedelta(minutes=15))
                    log(t["concurso"] + ": " + str(ex))
            if not trabalhou:
                for c in cadastros:
                    try:
                        provedores[c["id"]].chamar("extras")
                    except Exception as ex:
                        log(c["id"] + ": extras pendentes: " + str(ex))
                time.sleep(30)
    except KeyboardInterrupt:
        log("Robô desligado.")
        return 0
    finally:
        if os.name == "nt":
            import ctypes
            ctypes.windll.kernel32.SetThreadExecutionState(0x80000000)


def individual(R, simular=False, data=None):
    from integracao import Executor
    c = {"id": R.V.CONFIG["id_concurso"], "nome": R.V.CONFIG["concurso"], "ordem": 0}
    executor = Executor(R)
    try:
        return rodar({c["id"]: executor}, [c], R.log, data, simular)
    finally:
        executor.fechar()


def principal(arquivo):
    ap = argparse.ArgumentParser(description="Fila de publicação de todos os concursos.")
    grupo = ap.add_mutually_exclusive_group()
    grupo.add_argument("--simular", action="store_true")
    grupo.add_argument("--login", action="store_true")
    grupo.add_argument("--testar", action="store_true")
    ap.add_argument("--data", type=dt.date.fromisoformat, help="data da simulação (AAAA-MM-DD)")
    ap.add_argument("--concurso", help="executar somente o identificador informado")
    a = ap.parse_args()
    if a.data and not a.simular:
        ap.error("--data só pode ser usado com --simular")
    cadastros = carregar_cadastros(arquivo)
    if a.concurso:
        cadastros = [c for c in cadastros if c["id"] == a.concurso]
        if not cadastros:
            ap.error("concurso não cadastrado")
    pasta = Path(arquivo).parent

    def log(texto):
        linha = "[{}] {}".format(agora().strftime("%d/%m %H:%M:%S"), texto)
        print(linha, flush=True)
        if not a.simular:
            with (pasta / "log.txt").open("a", encoding="utf-8") as f:
                f.write(linha + "\n")

    provedores = {c["id"]: Processo(c, log) for c in cadastros}
    try:
        if a.login:
            for c in cadastros:
                resultado = subprocess.run([sys.executable, "-B", "-X", "utf8",
                                            str(c["pasta"] / "canal" / "robo.py"), "--login"])
                if resultado.returncode:
                    return resultado.returncode
            return 0
        if a.testar:
            resultados = [provedores[c["id"]].chamar("testar") for c in cadastros]
            return 0 if all(r == 0 for r in resultados) else 1
        def recarregar():
            lista = carregar_cadastros(arquivo)
            return [c for c in lista if c["id"] == a.concurso] if a.concurso else lista
        return rodar(provedores, cadastros, log, a.data, a.simular, recarregar)
    finally:
        for p in provedores.values():
            p.fechar()
