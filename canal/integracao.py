"""Adapta o robô de um concurso à fila, sem misturar seus geradores/configurações."""
import contextlib
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import sys
import unicodedata
from urllib.parse import urlsplit

import motor
import perfil_chrome


def normalizar(texto):
    return "".join(c for c in unicodedata.normalize("NFKD", texto).lower() if not unicodedata.combining(c))


def corresponde(descricao, titulo, tarefa, config, titulo_esperado=""):
    ident = motor.identidade(config, tarefa["chave"])
    marcadores = re.findall(r"^YTCONCURSO ([^\r\n]+)$", descricao, re.M)
    if marcadores:
        return ident in marcadores
    # Compatibilidade com vídeos enviados antes da integração.
    chave = tarefa["chave"]
    codigo = re.search(r"^codigo d[ao] (?:aula|short):\s*" + re.escape(normalizar(chave)) + r"\s*$",
                       normalizar(descricao), re.M)
    referencias = config.get("identificadores_legados", [config["concurso"]])
    contexto = normalizar(titulo + "\n" + descricao[:800])
    origem = any(normalizar(s) in contexto for s in referencias if s)
    if codigo:
        return origem  # o mesmo material pode existir na PMPE e no Bombeiro
    return bool(titulo_esperado and normalizar(titulo).strip() == normalizar(titulo_esperado).strip() and origem)


def _carregou_lista(page):
    for _ in range(60):
        if page.locator("ytcp-video-row").count():
            return
        if re.search(r"nenhum v[íi]deo|nenhum conte[úu]do|no videos|no content|nenhum resultado|no matching",
                     page.locator("body").inner_text(timeout=5000), re.I):
            return
        page.wait_for_timeout(500)
    raise RuntimeError("Não consegui confirmar a lista do Studio. Nenhum upload será iniciado.")


def _proxima_pagina(page):
    botao = page.locator("ytcp-table-footer #navigate-after, ytcp-table-footer [aria-label*='Next'], "
                         "ytcp-table-footer [aria-label*='Próxima'], ytcp-table-footer [aria-label*='próxima']").first
    if botao.count() == 0:
        if page.locator("ytcp-video-row").count() == 0:
            return False
        raise RuntimeError("Não identifiquei a paginação do Studio; não posso concluir que o vídeo está ausente.")
    desativado = botao.get_attribute("disabled") is not None or botao.get_attribute("aria-disabled") == "true"
    if desativado:
        return False
    antes = page.locator("ytcp-video-row").first.inner_text()
    botao.click(timeout=15_000)
    for _ in range(60):
        page.wait_for_timeout(500)
        linhas = page.locator("ytcp-video-row")
        if linhas.count() and linhas.first.inner_text() != antes:
            return True
    raise RuntimeError("A próxima página do Studio não carregou. Upload cancelado.")


def titulo_local(R, tarefa):
    pasta = R.V.SAIDA / tarefa["material"].stem
    arquivo = pasta / "video.json" if tarefa["tipo"] == "aula" else pasta / "shorts" / ("short_{}.json".format(tarefa["n"]))
    return motor.ler_json(arquivo).get("titulo", "")



def videos_identificados(R):
    """Só associa IDs a tarefas com link confirmado no histórico; não presume ausência."""
    identificados = {}
    estado = motor.ler_json(motor.diretorio_estado(R.V.RAIZ, R.V.CONFIG) / "estado.json")
    registros = [(ident, item) for ident, item in estado.get("tarefas", {}).items()
                 if item.get("estado") == "concluido"]
    if getattr(R, "REGISTRO", None) is not None:
        registros.extend((motor.identidade(R.V.CONFIG, chave), item)
                         for chave, item in motor.ler_json(R.REGISTRO).items())
    for ident, item in registros:
        link = motor.link_padrao(item.get("link"))
        if link:
            vid = link.rsplit("/", 1)[-1]
            anterior = identificados.get(vid)
            if anterior and anterior != ident:
                raise RuntimeError("O histórico associa o mesmo vídeo a tarefas diferentes. Confira os registros antes de enviar.")
            identificados[vid] = ident
    return identificados


def buscar_no_studio(R, tarefa, nova_aba):
    """Consulta vídeos E Shorts, incluindo privados/rascunhos, no próprio canal autenticado."""
    page = nova_aba()
    detalhe = None
    atual = page
    try:
        perfil_chrome.abrir_pagina(page, "https://studio.youtube.com", log=getattr(R, "log", None))
        if hasattr(R, "esperar_identidade"):
            R.esperar_identidade(page)
        try:
            page.wait_for_url(re.compile(r"https://studio\.youtube\.com/channel/[^/]+"), timeout=60_000)
        except Exception as ex:
            raise RuntimeError("Não confirmei o canal no Studio. Faça login pelo robô deste concurso.") from ex
        match = re.search(r"/channel/(UC[\w-]+)", page.url)
        if not match:
            raise RuntimeError("O Studio não informou o identificador do canal.")
        canal = match.group(1)
        arquivo_canal = motor.diretorio_estado(R.V.RAIZ, R.V.CONFIG) / "canal.json"
        anterior = motor.ler_json(arquivo_canal)
        esperado = R.V.CONFIG.get("youtube_channel_id") or anterior.get("id")
        if esperado and esperado != canal:
            raise RuntimeError("O perfil está em outro canal do YouTube. Troque para o canal configurado antes de postar.")
        if not esperado:
            motor.salvar_json(arquivo_canal, {"id": canal, "url_configurada": R.V.CONFIG["url_canal"]})
        vistos = set()
        conhecidos = videos_identificados(R)
        procurado = motor.identidade(R.V.CONFIG, tarefa["chave"])
        esperado_titulo = titulo_local(R, tarefa)
        detalhe = page.context.new_page()
        for aba in ("upload", "short"):
            atual = page
            perfil_chrome.abrir_pagina(page, "https://studio.youtube.com/channel/{}/videos/{}".format(canal, aba),
                                       log=getattr(R, "log", None))
            _carregou_lista(page)
            paginas = set()
            while True:
                linhas = page.locator("ytcp-video-row")
                ids_pagina = []
                candidatos = []
                for i in range(linhas.count()):
                    linha = linhas.nth(i)
                    links = linha.locator('a[href*="/video/"]').evaluate_all("(els) => els.map(e => e.getAttribute('href'))")
                    ids = [m.group(1) for link in links for m in [re.search(r"/video/([\w-]{11})/", link or "")] if m]
                    if not ids:
                        raise RuntimeError("Uma linha do Studio não trouxe ID. Não posso assegurar a ausência do vídeo.")
                    vid = ids[0]
                    ids_pagina.append(vid)
                    if vid not in vistos:
                        vistos.add(vid)
                        # Este ID já foi confirmado para OUTRA tarefa. Não abra de novo
                        # seu editor, mas continue verificando todos os IDs desconhecidos.
                        if vid in conhecidos and conhecidos[vid] != procurado:
                            continue
                        candidatos.append((vid, linha.inner_text()))
                assinatura = tuple(ids_pagina)
                if assinatura in paginas:
                    raise RuntimeError("A paginação do Studio repetiu a mesma página.")
                paginas.add(assinatura)
                for vid, resumo in candidatos:
                    atual = detalhe
                    perfil_chrome.abrir_pagina(
                        detalhe, "https://studio.youtube.com/video/{}/edit".format(vid),
                        pronto="#description-textarea #textbox", log=getattr(R, "log", None))
                    caixa = detalhe.locator("#description-textarea #textbox").first
                    caixa.wait_for(state="visible", timeout=60_000)
                    descricao = caixa.inner_text()
                    titulo = detalhe.locator("#title-textarea #textbox").first.inner_text(timeout=15_000)
                    if corresponde(descricao, titulo, tarefa, R.V.CONFIG, esperado_titulo):
                        pendente = re.search(r"rascunho|draft|processando|processing|enviando|uploading|falha no envio",
                                             resumo, re.I)
                        return {"estado": "pendente" if pendente else "publicado", "link": "https://youtu.be/" + vid}
                if not _proxima_pagina(page):
                    break
        return None
    except Exception:
        if hasattr(R, "log"):
            with contextlib.suppress(Exception):
                u = urlsplit(atual.url)
                endereco = (u.scheme + "://" + u.netloc + u.path) if u.netloc else "(sem URL confirmada)"
                R.log("  Consulta interrompida; URL confirmada pelo navegador: " + endereco)
        # Fotografe a consulta que falhou antes de fechar a aba; nunca declare ausência.
        if getattr(R, "ERROS", None) is not None:
            try:
                R.ERROS.mkdir(parents=True, exist_ok=True)
                foto = R.ERROS / ("erro_" + motor.agora().strftime("%Y%m%d_%H%M%S") + "_consulta.png")
                atual.screenshot(path=str(foto), full_page=False, timeout=5000)
                R.log("  Foto da consulta que falhou: " + str(foto))
            except Exception as erro_foto:
                with contextlib.suppress(Exception):
                    R.log("  Não foi possível fotografar a consulta: " + str(erro_foto).splitlines()[0])
        raise
    finally:
        if detalhe:
            with contextlib.suppress(Exception):
                detalhe.close()
        with contextlib.suppress(Exception):
            page.close()


class Executor:
    def __init__(self, R):
        self.R = R
        self.perfil = None
        self.pw = self.ctx = None
        self.deps_ok = False

    def garantir_perfil(self):
        if self.perfil is None:
            raiz = motor.diretorio_estado(self.R.V.RAIZ, self.R.V.CONFIG)
            codigo = hashlib.sha256(str(self.R.PERFIL.resolve()).lower().encode("utf-8")).hexdigest()[:20]
            trava = motor.Trava(raiz / ("perfil-" + codigo + ".lock"))
            trava.__enter__()
            self.perfil = trava
        if not self.deps_ok:
            if not self.R.dependencias.garantir(self.R.log):
                raise RuntimeError("As dependências do robô não estão disponíveis.")
            self.deps_ok = True

    def nova_aba(self):
        if hasattr(self.R, "nova_aba"):
            return self.R.nova_aba()
        if self.ctx is None:
            from playwright.sync_api import sync_playwright
            self.pw = sync_playwright().start()
            self.ctx = self.R.abrir_chrome(self.pw)
        return self.ctx.new_page()

    def verificar(self, tarefa):
        self.garantir_perfil()
        # O robô antigo do CBMPE abre o perfil por envio: feche a consulta antes do upload.
        try:
            return buscar_no_studio(self.R, tarefa, self.nova_aba)
        finally:
            if not hasattr(self.R, "nova_aba") and self.ctx:
                self.ctx.close()
                self.pw.stop()
                self.ctx = self.pw = None

    def chamar(self, op, **dados):
        try:
            return self._chamar(op, **dados)
        finally:
            if getattr(self.R, "PERFIL_COMPARTILHADO", False) and self.perfil:
                try:
                    # Apenas o executor que possui a trava mantém conexão CDP.
                    # O Chrome externo e seu login continuam abertos.
                    if hasattr(self.R, "encerrar_chrome"):
                        self.R.encerrar_chrome()
                finally:
                    self.liberar_perfil()

    def liberar_perfil(self):
        if self.perfil:
            self.perfil.__exit__(None, None, None)
            self.perfil = None

    def _chamar(self, op, **dados):
        R = self.R
        if op == "agenda":
            dia = dt.date.fromisoformat(dados["dia"])
            historico = motor.ler_json(R.REGISTRO)
            tarefas = []
            for t in R.tarefas_do_dia(dia):
                tarefa = dict(t)
                tarefa["material"] = str(t["material"])
                tarefa["quando"] = t["quando"].isoformat()
                tarefa["postado"] = motor.link_valido(historico.get(t["chave"], {}).get("link"))
                tarefas.append(tarefa)
            return tarefas
        if op == "atualizar":
            return R.atualizar_repositorio()
        if op == "executar":
            tarefa = dict(dados["tarefa"])
            tarefa["material"] = Path(tarefa["material"]).resolve()
            materiais = (R.V.RAIZ / "Material_do_Dia").resolve()
            if materiais not in tarefa["material"].parents:
                raise ValueError("Material fora da pasta deste concurso.")
            return motor.publicar(R, tarefa, self.verificar)
        if op == "extras":
            registros = motor.ler_json(R.REGISTRO)
            if not any(i.get("comentario_pendente") or i.get("playlist_pendente") for i in registros.values()):
                return False
            raiz = motor.diretorio_estado(R.V.RAIZ, R.V.CONFIG)
            try:
                with motor.Trava(raiz / "publicacao.lock"):
                    self.garantir_perfil()
                    if hasattr(R, "playlists_pendentes") and R.playlists_pendentes():
                        return True
                    return R.comentarios_pendentes()
            except motor.Ocupado:
                return False
        if op == "testar":
            self.garantir_perfil()
            return R.testar()
        raise ValueError("Operação desconhecida: " + op)

    def fechar(self):
        if hasattr(self.R, "encerrar_chrome"):
            self.R.encerrar_chrome()
        if self.ctx:
            self.ctx.close()
            self.pw.stop()
        self.liberar_perfil()


def comando_manual(R, funcao):
    executor = Executor(R)
    try:
        executor.garantir_perfil()
        return funcao()
    finally:
        executor.fechar()


def worker():
    import robo as R
    executor = Executor(R)
    try:
        for linha in sys.stdin:
            try:
                dados = json.loads(linha)
                op = dados.pop("op")
                resultado = {"resultado": executor.chamar(op, **dados)}
            except Exception as ex:
                R.log("Erro na integração: " + str(ex))
                R.log_erro("integração com a fila do YouTube")
                resultado = {"erro": str(ex)}
            print(motor.PREFIXO_RPC + json.dumps(resultado, ensure_ascii=False), flush=True)
    finally:
        executor.fechar()


if __name__ == "__main__":
    if sys.argv[1:] != ["--worker"]:
        raise SystemExit("Este arquivo é o executor interno. Use iniciar_robo.bat.")
    worker()
