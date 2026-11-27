"""Teste do robô: posta AGORA, uma vez só, a aula de hoje e o Short 1/3 de hoje, e termina.

Uso (na pasta do projeto ou dentro de canal/):
    python canal/robo_teste.py

Usa as mesmas funções do robo.py (mesmo Chrome, mesma visibilidade de config.json) e anota o que postar em
canal/.postados.json. Assim o robô principal, quando for ligado, não posta de novo o que o teste já postou.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import robo as R  # noqa: E402


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    if not R.dependencias.garantir(R.log):
        return 1
    tarefas = R.tarefas_do_dia(R.agora().date())
    escolhidas = [t for t in tarefas if t["tipo"] == "aula"][:1] + \
                 [t for t in tarefas if t["tipo"] == "short" and t["n"] == 1]
    if not escolhidas:
        print("Hoje não há material (fim de semana ou dia sem sessão): nada para testar.")
        return 1
    vis = R.visibilidade()
    erros = 0
    for t in escolhidas:
        ja = R.registro().get(t["chave"])
        if ja:
            R.log(f"{t['nome']}: já postado antes ({ja.get('link')}); pulando")
            continue
        R.log(f"TESTE: postando {t['nome']} como {vis}")
        try:
            item = R.preparar(t)
            if not item:
                R.log("  nada para postar neste material")
                continue
            link = R.postar(*item[:3], vis, item[3], item[4])
        except Exception as erro:
            R.log(f"  ERRO: {str(erro).splitlines()[0][:300]}")
            R.log_erro(t["nome"])
            R.log("  O erro completo está em canal/log.txt: é só pedir para a IA ler o log.")
            erros += 1
            continue  # segue para o próximo (o Short testa o caminho mesmo se a aula falhar)
        R.registrar(t["chave"], link, item[4].get("comentario") if vis != "PRIVATE" else None,
                    item[4].get("playlist") if item[4].get("playlist_ok") is False else None)
        R.log(f"  postado: {link}")
    R.log("Teste concluído" + (f" com {erros} erro(s)." if erros else ".")
          + " Confira em YouTube Studio > Conteúdo (aba Vídeos e aba Shorts).")
    return 1 if erros else 0


if __name__ == "__main__":
    sys.exit(main())
