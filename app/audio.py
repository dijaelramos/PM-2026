"""Gera o MP3 de um documento com a voz neural pt-BR (edge-tts).

Cada capítulo é sintetizado separadamente e guardado em cache pelo hash do
texto (MP3 + JSON com o início de cada frase). Os capítulos são concatenados
em um único MP3 (os quadros MP3 podem ser emendados), e o início de cada
capítulo é calculado pelo tamanho em bytes, porque o edge-tts entrega áudio
CBR de 48 kbit/s. O início de cada parágrafo vem dos eventos de frase
(SentenceBoundary) e permite marcar no texto o trecho que está sendo lido.
"""
import asyncio
import bisect
import hashlib
import json
from pathlib import Path

import edge_tts

BYTES_POR_SEGUNDO = 48000 // 8  # audio-24khz-48kbitrate-mono-mp3
TICKS_POR_SEGUNDO = 10_000_000


async def _sintetizar(texto, voz, taxa, tentativas=4):
    """Retorna (mp3, [[texto_da_frase, inicio_em_segundos], ...])."""
    for tentativa in range(tentativas):
        try:
            buf, frases = bytearray(), []
            com = edge_tts.Communicate(texto, voz, rate=taxa, boundary="SentenceBoundary")
            async for parte in com.stream():
                if parte["type"] == "audio":
                    buf += parte["data"]
                elif parte["type"] in ("SentenceBoundary", "WordBoundary"):
                    frases.append([parte["text"], round(parte["offset"] / TICKS_POR_SEGUNDO, 3)])
            if buf:
                return bytes(buf), frases
            raise RuntimeError("áudio vazio")
        except Exception as erro:  # rede instável: tenta de novo
            if tentativa == tentativas - 1:
                raise
            print(f"    tentando de novo ({erro})")
            await asyncio.sleep(3 * (tentativa + 1))


def tempos_dos_paragrafos(paragrafos, frases, duracao):
    """Segundo (relativo ao capítulo) em que cada parágrafo começa a ser falado."""
    texto = "\n".join(paragrafos)
    inicios_txt, pos = [], 0
    for p in paragrafos:
        inicios_txt.append(pos)
        pos += len(p) + 1
    # Acha cada frase no texto, em ordem, e anota (posição no texto, tempo).
    pontos, cursor = [(0, 0.0)], 0
    for frase, t in frases:
        frase = frase.strip()
        if not frase:
            continue
        achou = texto.find(frase, cursor)
        if achou < 0:
            achou = texto.find(frase[:24], cursor)
        if achou < 0:
            continue
        pontos.append((achou, t))
        cursor = achou + max(1, len(frase) // 2)
    pontos.append((len(texto), duracao))
    posicoes = [p for p, _ in pontos]

    tempos = []
    for i, ini in enumerate(inicios_txt):
        fim = inicios_txt[i + 1] if i + 1 < len(inicios_txt) else len(texto)
        k = bisect.bisect_left(posicoes, ini)
        if k < len(pontos) and pontos[k][0] < fim:
            t = pontos[k][1]  # uma frase começa dentro deste parágrafo
        else:  # sem frase própria: interpola pela posição no texto
            (p0, t0), (p1, t1) = pontos[max(0, k - 1)], pontos[min(k, len(pontos) - 1)]
            t = t0 + (t1 - t0) * ((ini - p0) / (p1 - p0)) if p1 > p0 else t0
        tempos.append(round(max(t, tempos[-1] if tempos else 0.0), 2))
    return tempos


class GeradorAudio:
    def __init__(self, pasta_cache: Path, voz: str, taxa: str, paralelo: int = 4):
        self.cache = pasta_cache
        self.cache.mkdir(parents=True, exist_ok=True)
        self.voz, self.taxa = voz, taxa
        self.sem = asyncio.Semaphore(paralelo)
        self.usados = set()

    async def _capitulo(self, texto):
        chave = hashlib.sha256(f"{self.voz}|{self.taxa}|{texto}".encode()).hexdigest()[:20]
        arq, meta = self.cache / f"{chave}.mp3", self.cache / f"{chave}.json"
        self.usados.update({arq.name, meta.name})
        if arq.exists() and arq.stat().st_size > 0 and meta.exists():
            return arq.read_bytes(), json.loads(meta.read_text(encoding="utf-8"))
        async with self.sem:
            dados, frases = await _sintetizar(texto, self.voz, self.taxa)
        arq.write_bytes(dados)
        meta.write_text(json.dumps(frases, ensure_ascii=False), encoding="utf-8")
        return dados, frases

    async def documento(self, capitulos):
        """Retorna (mp3, inicio_de_cada_capitulo, [tempos_absolutos_dos_paragrafos_de_cada_capitulo])."""
        partes = await asyncio.gather(*(self._capitulo("\n".join(c["paragrafos"])) for c in capitulos))
        inicios, tempos, pos = [], [], 0
        for cap, (mp3, frases) in zip(capitulos, partes):
            ini = pos / BYTES_POR_SEGUNDO
            rel = tempos_dos_paragrafos(cap["paragrafos"], frases, len(mp3) / BYTES_POR_SEGUNDO)
            inicios.append(round(ini, 2))
            tempos.append([round(ini + t, 2) for t in rel])
            pos += len(mp3)
        return b"".join(p for p, _ in partes), inicios, tempos

    def limpar_cache(self):
        for arq in list(self.cache.glob("*.mp3")) + list(self.cache.glob("*.json")):
            if arq.name not in self.usados:
                arq.unlink()
