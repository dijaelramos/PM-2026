"""Gera o MP3 de um documento com a voz neural pt-BR (edge-tts).

Cada capítulo é sintetizado separadamente e guardado em cache pelo hash do
texto. Os capítulos são concatenados em um único MP3 (os quadros MP3 podem
ser emendados), e o início de cada capítulo é calculado pelo tamanho em
bytes, porque o edge-tts entrega áudio CBR de 48 kbit/s.
"""
import asyncio
import hashlib
from pathlib import Path

import edge_tts

BYTES_POR_SEGUNDO = 48000 // 8  # audio-24khz-48kbitrate-mono-mp3


async def _sintetizar(texto, voz, taxa, tentativas=4):
    for tentativa in range(tentativas):
        try:
            buf = bytearray()
            async for parte in edge_tts.Communicate(texto, voz, rate=taxa).stream():
                if parte["type"] == "audio":
                    buf += parte["data"]
            if buf:
                return bytes(buf)
            raise RuntimeError("áudio vazio")
        except Exception as erro:  # rede instável: tenta de novo
            if tentativa == tentativas - 1:
                raise
            print(f"    tentando de novo ({erro})")
            await asyncio.sleep(3 * (tentativa + 1))


class GeradorAudio:
    def __init__(self, pasta_cache: Path, voz: str, taxa: str, paralelo: int = 4):
        self.cache = pasta_cache
        self.cache.mkdir(parents=True, exist_ok=True)
        self.voz, self.taxa = voz, taxa
        self.sem = asyncio.Semaphore(paralelo)
        self.usados = set()

    async def _capitulo(self, texto):
        chave = hashlib.sha256(f"{self.voz}|{self.taxa}|{texto}".encode()).hexdigest()[:20]
        arq = self.cache / f"{chave}.mp3"
        self.usados.add(arq.name)
        if arq.exists() and arq.stat().st_size > 0:
            return arq.read_bytes()
        async with self.sem:
            dados = await _sintetizar(texto, self.voz, self.taxa)
        arq.write_bytes(dados)
        return dados

    async def documento(self, capitulos):
        """Retorna (bytes_mp3, [inicio_em_segundos_de_cada_capitulo])."""
        partes = await asyncio.gather(*(self._capitulo("\n".join(c["paragrafos"])) for c in capitulos))
        inicios, pos = [], 0
        for p in partes:
            inicios.append(round(pos / BYTES_POR_SEGUNDO, 2))
            pos += len(p)
        return b"".join(partes), inicios

    def limpar_cache(self):
        for arq in self.cache.glob("*.mp3"):
            if arq.name not in self.usados:
                arq.unlink()
