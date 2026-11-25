"""Pix do canal: "copia e cola" (BR Code estático do Banco Central) e QR Code para a tela final das aulas.

Configuração em canal/config.json:
    "pix_chave":  a chave Pix (recomendado: chave ALEATÓRIA, para não expor CPF, telefone ou e-mail);
    "pix_nome":   nome do recebedor, como está no banco (até 25 letras);
    "pix_cidade": cidade do recebedor (até 15 letras).
Sem "pix_chave", nada de Pix aparece nos vídeos.
"""
import json
import unicodedata
from pathlib import Path

CONFIG = json.loads((Path(__file__).resolve().parent / "config.json").read_text(encoding="utf-8"))


def configurado():
    return bool(CONFIG.get("pix_chave", "").strip())


def chave():
    return CONFIG.get("pix_chave", "").strip()


def _ascii(texto, limite):
    t = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return " ".join(t.upper().split())[:limite]


def _campo(ident, valor):
    return f"{ident}{len(valor):02d}{valor}"


def _crc16(dados):
    crc = 0xFFFF  # CRC16-CCITT (polinômio 0x1021, início 0xFFFF), como pede o manual do BR Code
    for b in dados.encode("utf-8"):
        crc ^= b << 8
        for _ in range(8):
            crc = ((crc << 1) ^ 0x1021) if crc & 0x8000 else (crc << 1)
            crc &= 0xFFFF
    return f"{crc:04X}"


def copia_e_cola():
    """Código Pix estático (sem valor fixo: quem apoia escolhe o valor no app do banco)."""
    conta = _campo("00", "br.gov.bcb.pix") + _campo("01", chave())
    corpo = (_campo("00", "01") + _campo("26", conta) + _campo("52", "0000") + _campo("53", "986")
             + _campo("58", "BR") + _campo("59", _ascii(CONFIG.get("pix_nome", "") or "CANAL", 25))
             + _campo("60", _ascii(CONFIG.get("pix_cidade", "") or "RECIFE", 15))
             + _campo("62", _campo("05", "***")) + "6304")
    return corpo + _crc16(corpo)


def qr(tamanho):
    """Imagem (Pillow) do QR Code do Pix, quadrada, com `tamanho` pixels de lado."""
    import qrcode
    q = qrcode.QRCode(border=2, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(copia_e_cola())
    q.make(fit=True)
    return q.make_image(fill_color="black", back_color="white").convert("RGB").resize((tamanho, tamanho))


def linha_descricao():
    if not configurado():
        return ""
    return f"Apoie o canal pelo Pix (qualquer valor): {chave()}\n"
