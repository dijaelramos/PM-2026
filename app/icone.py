"""Desenha o ícone do app (PNG) sem bibliotecas externas: fundo azul, fone dourado e botão de play."""
import struct
import zlib
from pathlib import Path

FUNDO = (20, 54, 92)
OURO = (242, 182, 50)
BRANCO = (255, 255, 255)


def _png(caminho: Path, tam: int, pixels):
    linhas = b"".join(b"\x00" + bytes(pixels[y * tam * 3:(y + 1) * tam * 3]) for y in range(tam))

    def bloco(tipo, dados):
        return struct.pack(">I", len(dados)) + tipo + dados + struct.pack(">I", zlib.crc32(tipo + dados) & 0xFFFFFFFF)

    caminho.write_bytes(b"\x89PNG\r\n\x1a\n" + bloco(b"IHDR", struct.pack(">IIBBBBB", tam, tam, 8, 2, 0, 0, 0))
                        + bloco(b"IDAT", zlib.compress(linhas, 9)) + bloco(b"IEND", b""))


def _cor(x, y, escala):
    """Cor no ponto (x, y) em coordenadas de 0 a 1, com o desenho reduzido por `escala`."""
    cx, cy = (x - 0.5) / escala, (y - 0.5) / escala
    r2 = cx * cx + cy * cy
    # arco do fone (meia-lua superior)
    if cy < 0.02 and 0.30 ** 2 <= r2 <= 0.36 ** 2:
        return OURO
    # conchas do fone
    for lado in (-1, 1):
        if abs(cx - lado * 0.33) <= 0.07 and -0.02 <= cy <= 0.26:
            return OURO
    # botão de play
    if -0.10 <= cx <= 0.16 and abs(cy - 0.05) <= (0.16 - cx) * 0.62:
        return BRANCO
    return FUNDO


def desenhar(caminho: Path, tam: int, escala: float = 1.0, amostras: int = 3):
    px = bytearray(tam * tam * 3)
    for y in range(tam):
        for x in range(tam):
            soma = [0, 0, 0]
            for sy in range(amostras):
                for sx in range(amostras):
                    c = _cor((x + (sx + 0.5) / amostras) / tam, (y + (sy + 0.5) / amostras) / tam, escala)
                    soma[0] += c[0]; soma[1] += c[1]; soma[2] += c[2]
            n = amostras * amostras
            i = (y * tam + x) * 3
            px[i:i + 3] = bytes(v // n for v in soma)
    _png(caminho, tam, px)


def gerar_icones(pasta: Path):
    pasta.mkdir(parents=True, exist_ok=True)
    feitos = {"icon-192.png": (192, 1.0), "icon-512.png": (512, 1.0),
              "icon-maskable-512.png": (512, 0.78), "apple-touch-icon.png": (180, 0.9)}
    for nome, (tam, escala) in feitos.items():
        if not (pasta / nome).exists():
            desenhar(pasta / nome, tam, escala, amostras=2 if tam > 200 else 3)
